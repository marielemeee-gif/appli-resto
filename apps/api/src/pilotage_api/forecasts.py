from datetime import date, datetime, time
from typing import Annotated
from zoneinfo import ZoneInfo

from fastapi import APIRouter, HTTPException, Query, status

from pilotage_api.demo import active_scenario_dir
from pilotage_api.forecasting.backtest import run_backtest
from pilotage_api.forecasting.engine import forecast_service
from pilotage_api.forecasting.models import BacktestReport, ForecastResult
from pilotage_api.forecasting.repository import ForecastRepository

PARIS = ZoneInfo("Europe/Paris")
router = APIRouter()


@router.get("/forecasts", response_model=list[ForecastResult], tags=["forecasts"])
def forecasts(
    site_id: str,
    from_date: Annotated[date, Query(alias="from")],
    to_date: Annotated[date, Query(alias="to")],
    as_of: datetime | None = None,
) -> list[ForecastResult]:
    if (to_date - from_date).days > 14 or to_date < from_date:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY)
    _, scenario_dir = active_scenario_dir()
    repository = ForecastRepository(scenario_dir)
    report = run_backtest(scenario_dir)
    eligible = report.selected_method == "reservation_enriched"
    cutoff = as_of or datetime.combine(from_date, time(8, 0), PARIS)
    service_ids = [
        service_id
        for service_id, service in repository.services.items()
        if service["site_id"] == site_id
        and from_date <= date.fromisoformat(service["service_date"]) <= to_date
    ]
    if not service_ids:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Aucun service trouvé.")
    return [
        forecast_service(
            repository,
            service_id,
            cutoff,
            historical_mae=report.enriched.covers_mae if eligible else report.baseline.covers_mae,
            enriched_is_eligible=eligible,
        )
        for service_id in sorted(service_ids)
    ]


@router.get("/backtests/current", response_model=BacktestReport, tags=["forecasts"])
def current_backtest() -> BacktestReport:
    _, scenario_dir = active_scenario_dir()
    return run_backtest(scenario_dir)
