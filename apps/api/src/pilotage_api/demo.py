from datetime import date, datetime
from pathlib import Path
from typing import Annotated, Any

from fastapi import APIRouter, HTTPException, Query, status

from pilotage_api.settings import get_settings
from pilotage_api.simulation.adapters import DatasetNotGeneratedError, SimulatedAdapters
from pilotage_api.simulation.config import load_scenarios, load_sites
from pilotage_api.simulation.models import ScenarioDefinition, Site

router = APIRouter()
_active_scenario_id: str | None = None


def active_scenario_dir() -> tuple[str, Path]:
    if _active_scenario_id is None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={"code": "scenario_not_active", "message": "Aucun scénario actif."},
        )
    return _active_scenario_id, get_settings().data_dir / "generated" / _active_scenario_id


def _adapters() -> SimulatedAdapters:
    _, scenario_dir = active_scenario_dir()
    try:
        return SimulatedAdapters(scenario_dir)
    except DatasetNotGeneratedError as error:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={"code": "scenario_not_active", "message": str(error)},
        ) from error


@router.get("/demo/scenarios", response_model=list[ScenarioDefinition], tags=["demo"])
def scenarios() -> list[ScenarioDefinition]:
    return load_scenarios(get_settings().data_dir / "config")


@router.post("/demo/scenarios/{scenario_id}/activate", tags=["demo"])
def activate_scenario(scenario_id: str) -> dict[str, str]:
    global _active_scenario_id
    settings = get_settings()
    if not settings.demo_mode:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    known = {scenario.id for scenario in load_scenarios(settings.data_dir / "config")}
    scenario_dir = settings.data_dir / "generated" / scenario_id
    if scenario_id not in known or not (scenario_dir / "manifest.json").exists():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "scenario_not_active", "message": "Scénario absent ou non généré."},
        )
    _active_scenario_id = scenario_id
    return {"scenario_id": scenario_id, "status": "active"}


@router.get("/sites", response_model=list[Site], tags=["sites"])
def sites() -> list[Site]:
    return load_sites(get_settings().data_dir / "config")


@router.get("/sites/{site_id}", response_model=Site, tags=["sites"])
def site(site_id: str) -> Site:
    for configured_site in sites():
        if configured_site.id == site_id:
            return configured_site
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Site inconnu.")


@router.get("/mock/weather", tags=["mock"])
def mock_weather(
    site_id: str,
    from_date: date,
    to_date: date,
    as_of: datetime,
) -> list[dict[str, Any]]:
    return _adapters().weather(site_id, from_date, to_date, as_of)


@router.get("/mock/events", tags=["mock"])
def mock_events(as_of: datetime) -> list[dict[str, Any]]:
    return _adapters().events(as_of)


@router.get("/mock/calendar", tags=["mock"])
def mock_calendar(
    from_date: Annotated[date, Query(alias="from")],
    to_date: Annotated[date, Query(alias="to")],
) -> list[dict[str, Any]]:
    return _adapters().calendar(from_date, to_date)


@router.get("/mock/roadworks", tags=["mock"])
def mock_roadworks(site_id: str, as_of: datetime) -> list[dict[str, Any]]:
    return _adapters().roadworks(site_id, as_of)
