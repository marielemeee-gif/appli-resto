import hashlib
import math
from datetime import date, datetime, time
from pathlib import Path
from typing import Any
from zoneinfo import ZoneInfo

from pilotage_api.forecasting.backtest import run_backtest
from pilotage_api.forecasting.engine import forecast_service
from pilotage_api.forecasting.repository import ForecastRepository
from pilotage_api.recommendations.models import (
    Briefing,
    ConstraintCheck,
    DispatchProposal,
    DispatchResponse,
    DispatchSite,
    Recommendation,
)
from pilotage_api.simulation.storage import read_ndjson

PARIS = ZoneInfo("Europe/Paris")
TRAVEL_MINUTES = {
    frozenset(("republique", "liberte")): 7,
    frozenset(("republique", "gare")): 14,
    frozenset(("liberte", "gare")): 12,
}


def _stable_id(*parts: object) -> str:
    digest = hashlib.blake2b("|".join(map(str, parts)).encode(), digest_size=8).hexdigest()
    return f"rec_{digest}"


def _service_records(scenario_dir: Path, filename: str, service_id: str) -> list[dict[str, Any]]:
    return [
        row
        for row in read_ndjson(scenario_dir / f"observed/{filename}")
        if row.get("service_id") == service_id
    ]


def _deadline(service_date: date, hour: int) -> datetime:
    return datetime.combine(service_date, time(hour, 0), PARIS)


def _staffing_recommendation(
    service_id: str,
    service_date: date,
    expected_covers: int,
    confidence: float,
    model_version: str,
    plans: list[dict[str, Any]],
) -> Recommendation | None:
    required = max(1, math.ceil(expected_covers / 32))
    planned = next((int(row["people"]) for row in plans if row["role"] == "server"), 0)
    gap = required - planned
    if gap == 0:
        return None
    direction = "Ajouter" if gap > 0 else "Retirer ou réaffecter"
    quantity = abs(gap)
    return Recommendation(
        id=_stable_id(service_id, "staffing", gap),
        service_id=service_id,
        forecast_model_version=model_version,
        type="staffing",
        title=f"{direction} {quantity} serveur{'s' if quantity > 1 else ''}",
        action={"role": "server", "quantity_delta": gap, "duration_hours": 3},
        deadline=_deadline(service_date, 16),
        estimated_gain_cents=quantity * 3 * 2500 if gap < 0 else 0,
        estimated_risk_cents=quantity * 18000 if gap > 0 else 0,
        confidence=confidence,
        formula="serveurs_requis = plafond(couverts_prévus / 32)",
        assumptions=["Capacité habituelle de 32 couverts par serveur.", "Créneau de pic de 3 h."],
        constraints=[
            ConstraintCheck(
                code="manager_validation_required",
                passed=True,
                detail="La proposition ne modifie aucun planning automatiquement.",
            )
        ],
    )


def _preparation_recommendation(
    service_id: str,
    service_date: date,
    expected_covers: int,
    confidence: float,
    model_version: str,
) -> Recommendation:
    meat_kg = round(expected_covers * 0.12 * 1.08, 1)
    return Recommendation(
        id=_stable_id(service_id, "preparation", meat_kg),
        service_id=service_id,
        forecast_model_version=model_version,
        type="preparation",
        title=f"Préparer {meat_kg:.1f} kg pour les plats principaux",
        action={"family": "meat", "quantity_kg": meat_kg},
        deadline=_deadline(service_date, 11),
        estimated_gain_cents=0,
        estimated_risk_cents=round(expected_covers * 0.08 * 1800),
        confidence=confidence,
        formula="préparation = couverts_prévus × 0,12 kg × rendement_1,08",
        assumptions=["120 g servis par couvert.", "Coefficient de rendement et sécurité de 1,08."],
        constraints=[
            ConstraintCheck(
                code="recipe_scope",
                passed=True,
                detail="Règle limitée à une famille fictive et documentée.",
            )
        ],
    )


def _purchase_recommendation(
    service_id: str,
    service_date: date,
    site_id: str,
    expected_covers: int,
    confidence: float,
    model_version: str,
    inventory: list[dict[str, Any]],
) -> Recommendation | None:
    current = next(
        (float(row["quantity_units"]) for row in inventory if row["family"] == "beverages"),
        0.0,
    )
    required = round(expected_covers * 1.8 * 1.1)
    shortage = max(0, math.ceil(required - current))
    if shortage == 0:
        return None
    return Recommendation(
        id=_stable_id(service_id, "purchase", shortage),
        service_id=service_id,
        forecast_model_version=model_version,
        type="purchase",
        title=f"Ajouter {shortage} unités de boissons à la commande",
        action={"site_id": site_id, "family": "beverages", "quantity_units": shortage},
        deadline=_deadline(service_date, 14),
        estimated_gain_cents=0,
        estimated_risk_cents=shortage * 320,
        confidence=confidence,
        formula="commande = demande_prévue × 1,8 × sécurité_1,10 − stock_utilisable",
        assumptions=["1,8 boisson par couvert.", "Stock de sécurité de 10 %."],
        constraints=[
            ConstraintCheck(
                code="supplier_deadline",
                passed=True,
                detail="Commande fictive modifiable jusqu’à 14 h.",
            ),
            ConstraintCheck(
                code="no_automatic_order",
                passed=True,
                detail="Aucune commande fournisseur n’est envoyée.",
            ),
        ],
    )


def build_briefing(scenario_dir: Path, service_id: str, cutoff: datetime) -> Briefing:
    repository = ForecastRepository(scenario_dir)
    report = run_backtest(scenario_dir)
    forecast = forecast_service(
        repository,
        service_id,
        cutoff,
        historical_mae=(
            report.enriched.covers_mae
            if report.selected_method == "reservation_enriched"
            else report.baseline.covers_mae
        ),
        enriched_is_eligible=report.selected_method == "reservation_enriched",
    )
    if forecast.expected_covers is None:
        return Briefing(
            service_id=service_id,
            generated_at=cutoff,
            forecast=forecast,
            recommendations=[],
            data_quality_messages=forecast.abstention_reasons,
        )
    service = repository.service(service_id)
    service_date = date.fromisoformat(service["service_date"])
    plans = _service_records(scenario_dir, "staff_plans.ndjson", service_id)
    inventory = read_ndjson(scenario_dir / "observed/inventory_snapshots.ndjson")
    confidence = forecast.confidence.score
    candidates = [
        _staffing_recommendation(
            service_id,
            service_date,
            forecast.expected_covers,
            confidence,
            forecast.model_version,
            plans,
        ),
        _preparation_recommendation(
            service_id,
            service_date,
            forecast.expected_covers,
            confidence,
            forecast.model_version,
        ),
        _purchase_recommendation(
            service_id,
            service_date,
            service["site_id"],
            forecast.expected_covers,
            confidence,
            forecast.model_version,
            inventory,
        ),
    ]
    recommendations = [item for item in candidates if item is not None and item.deadline > cutoff]
    recommendations.sort(key=lambda item: (item.deadline, -item.estimated_risk_cents))
    return Briefing(
        service_id=service_id,
        generated_at=cutoff,
        forecast=forecast,
        recommendations=recommendations[:3],
        data_quality_messages=[],
    )


def build_dispatch(scenario_dir: Path, service_date: date, cutoff: datetime) -> DispatchResponse:
    repository = ForecastRepository(scenario_dir)
    report = run_backtest(scenario_dir)
    plans = read_ndjson(scenario_dir / "observed/staff_plans.ndjson")
    sites: list[DispatchSite] = []
    for site_id in sorted(repository.sites):
        service_id = f"{site_id}_{service_date.isoformat()}_dinner"
        forecast = forecast_service(
            repository,
            service_id,
            cutoff,
            historical_mae=report.enriched.covers_mae,
            enriched_is_eligible=report.selected_method == "reservation_enriched",
        )
        if forecast.expected_covers is None:
            continue
        planned = next(
            (
                int(row["people"])
                for row in plans
                if row["service_id"] == service_id and row["role"] == "server"
            ),
            0,
        )
        required = max(1, math.ceil(forecast.expected_covers / 32))
        sites.append(
            DispatchSite(
                site_id=site_id,
                service_id=service_id,
                expected_covers=forecast.expected_covers,
                planned_servers=planned,
                required_servers=required,
                server_gap=planned - required,
            )
        )

    proposals: list[DispatchProposal] = []
    sources = [site for site in sites if site.server_gap > 0]
    targets = [site for site in sites if site.server_gap < 0]
    for source in sources:
        remaining_surplus = source.server_gap
        for target in targets:
            if remaining_surplus <= 0:
                break
            quantity = min(remaining_surplus, abs(target.server_gap))
            travel = TRAVEL_MINUTES.get(frozenset((source.site_id, target.site_id)), 20)
            constraints = [
                ConstraintCheck(
                    code="same_group",
                    passed=True,
                    detail="Les deux sites appartiennent au groupe fictif.",
                ),
                ConstraintCheck(
                    code="role_compatible",
                    passed="server" in repository.sites[source.site_id]["roles"],
                    detail="Le rôle serveur est disponible sur le site source.",
                ),
                ConstraintCheck(
                    code="source_capacity_preserved",
                    passed=remaining_surplus >= quantity,
                    detail="Le transfert ne crée pas de sous-effectif à la source.",
                ),
                ConstraintCheck(
                    code="travel_time",
                    passed=travel <= 20,
                    detail=f"Trajet simulé de {travel} minutes.",
                ),
            ]
            if all(check.passed for check in constraints):
                proposals.append(
                    DispatchProposal(
                        id=_stable_id(service_date, source.site_id, target.site_id, quantity),
                        service_date=service_date,
                        source_site_id=source.site_id,
                        target_site_id=target.site_id,
                        quantity=quantity,
                        starts_at=datetime.combine(service_date, time(18, 30), PARIS),
                        ends_at=datetime.combine(service_date, time(21, 0), PARIS),
                        travel_minutes=travel,
                        estimated_gain_cents=quantity * 18600,
                        confidence=0.81,
                        constraints=constraints,
                    )
                )
                remaining_surplus -= quantity
    return DispatchResponse(service_date=service_date, sites=sites, proposals=proposals)
