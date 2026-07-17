import json
from datetime import date, datetime, time
from pathlib import Path
from threading import Lock
from typing import Any
from uuid import uuid4
from zoneinfo import ZoneInfo

from fastapi import APIRouter, HTTPException, status

from pilotage_api.demo import active_scenario_dir
from pilotage_api.recommendations.engine import build_briefing, build_dispatch
from pilotage_api.recommendations.models import (
    Briefing,
    DecisionInput,
    DecisionRecord,
    DispatchProposal,
    DispatchResponse,
    Recommendation,
    RoiSummary,
)
from pilotage_api.settings import get_settings

PARIS = ZoneInfo("Europe/Paris")
router = APIRouter()
_recommendation_registry: dict[str, Recommendation] = {}
_dispatch_registry: dict[str, DispatchProposal] = {}
_decision_lock = Lock()


def _decision_path() -> Path:
    return get_settings().data_dir / "decisions.json"


def _load_decisions() -> list[DecisionRecord]:
    path = _decision_path()
    if not path.exists():
        return []
    return [DecisionRecord.model_validate(item) for item in json.loads(path.read_text())]


def _save_decision(record: DecisionRecord) -> None:
    with _decision_lock:
        decisions = _load_decisions()
        if any(item.recommendation_id == record.recommendation_id for item in decisions):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail={
                    "code": "decision_already_recorded",
                    "message": "Décision déjà enregistrée.",
                },
            )
        decisions.append(record)
        path = _decision_path()
        path.parent.mkdir(parents=True, exist_ok=True)
        temporary = path.with_suffix(".tmp")
        temporary.write_text(
            json.dumps(
                [item.model_dump(mode="json") for item in decisions],
                ensure_ascii=False,
                indent=2,
            )
        )
        temporary.replace(path)


def _record_decision(
    recommendation_id: str,
    recommendation_type: str,
    site_id: str,
    service_id: str,
    estimated_gain_cents: int,
    deadline: datetime,
    payload: DecisionInput,
    default_action: dict[str, Any],
) -> DecisionRecord:
    decided_at = payload.decided_at or datetime.now(PARIS)
    if decided_at > deadline:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={"code": "recommendation_expired", "message": "L’heure limite est dépassée."},
        )
    if payload.status == "modified" and payload.selected_action is None:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
            detail={"code": "constraint_violation", "message": "Une action modifiée est requise."},
        )
    record = DecisionRecord(
        id=f"decision-{uuid4().hex[:12]}",
        recommendation_id=recommendation_id,
        recommendation_type=recommendation_type,
        site_id=site_id,
        service_id=service_id,
        status=payload.status,
        selected_action=payload.selected_action or default_action,
        reason=payload.reason,
        decided_at=decided_at,
        estimated_gain_cents=estimated_gain_cents if payload.status != "refused" else 0,
    )
    _save_decision(record)
    return record


@router.get("/briefings/{service_id}", response_model=Briefing, tags=["recommendations"])
def briefing(service_id: str, as_of: datetime | None = None) -> Briefing:
    _, scenario_dir = active_scenario_dir()
    try:
        service_date = date.fromisoformat(service_id.split("_")[1])
    except (IndexError, ValueError) as error:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND) from error
    cutoff = as_of or datetime.combine(service_date, time(8, 0), PARIS)
    try:
        result = build_briefing(scenario_dir, service_id, cutoff)
    except KeyError as error:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(error)) from error
    for recommendation in result.recommendations:
        _recommendation_registry[recommendation.id] = recommendation
    return result


@router.get(
    "/recommendations/{recommendation_id}",
    response_model=Recommendation,
    tags=["recommendations"],
)
def recommendation(recommendation_id: str) -> Recommendation:
    try:
        return _recommendation_registry[recommendation_id]
    except KeyError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recommandation inconnue ou briefing non calculé.",
        ) from error


@router.get("/dispatch", response_model=DispatchResponse, tags=["recommendations"])
def dispatch(service_date: date, as_of: datetime | None = None) -> DispatchResponse:
    _, scenario_dir = active_scenario_dir()
    cutoff = as_of or datetime.combine(service_date, time(8, 0), PARIS)
    result = build_dispatch(scenario_dir, service_date, cutoff)
    for proposal in result.proposals:
        _dispatch_registry[proposal.id] = proposal
    return result


@router.post(
    "/recommendations/{recommendation_id}/decisions",
    response_model=DecisionRecord,
    tags=["decisions"],
)
def decide_recommendation(recommendation_id: str, payload: DecisionInput) -> DecisionRecord:
    try:
        recommendation = _recommendation_registry[recommendation_id]
    except KeyError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recommandation inconnue.",
        ) from error
    site_id = recommendation.service_id.split("_")[0]
    return _record_decision(
        recommendation.id,
        recommendation.type,
        site_id,
        recommendation.service_id,
        recommendation.estimated_gain_cents,
        recommendation.deadline,
        payload,
        recommendation.action,
    )


@router.post(
    "/dispatch/{proposal_id}/decisions",
    response_model=DecisionRecord,
    tags=["decisions"],
)
def decide_dispatch(proposal_id: str, payload: DecisionInput) -> DecisionRecord:
    try:
        proposal = _dispatch_registry[proposal_id]
    except KeyError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transfert inconnu.",
        ) from error
    action = {
        "role": proposal.role,
        "quantity": proposal.quantity,
        "source_site_id": proposal.source_site_id,
        "target_site_id": proposal.target_site_id,
        "starts_at": proposal.starts_at.isoformat(),
        "ends_at": proposal.ends_at.isoformat(),
    }
    return _record_decision(
        proposal.id,
        "dispatch",
        proposal.target_site_id,
        proposal.target_site_id + "_" + proposal.service_date.isoformat() + "_dinner",
        proposal.estimated_gain_cents,
        proposal.starts_at,
        payload,
        action,
    )


@router.get("/decisions", response_model=list[DecisionRecord], tags=["decisions"])
def decisions(site_id: str | None = None) -> list[DecisionRecord]:
    records = _load_decisions()
    return [item for item in records if site_id is None or item.site_id == site_id]


@router.get("/roi", response_model=RoiSummary, tags=["decisions"])
def roi() -> RoiSummary:
    records = _load_decisions()
    return RoiSummary(
        decisions_count=len(records),
        accepted_count=sum(item.status == "accepted" for item in records),
        modified_count=sum(item.status == "modified" for item in records),
        refused_count=sum(item.status == "refused" for item in records),
        estimated_gain_cents=sum(item.estimated_gain_cents for item in records),
        decisions=records,
    )
