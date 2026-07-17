from datetime import date, datetime
from pathlib import Path
from zoneinfo import ZoneInfo

import pytest

from pilotage_api.forecasting.backtest import run_backtest
from pilotage_api.forecasting.engine import forecast_service
from pilotage_api.forecasting.repository import ForecastRepository
from pilotage_api.simulation.generator import GenerationRequest, generate_dataset

PARIS = ZoneInfo("Europe/Paris")
PROJECT_ROOT = Path(__file__).resolve().parents[3]
CONFIG_DIR = PROJECT_ROOT / "data/config"
DEMO_DATE = date(2026, 7, 17)
MORNING_CUTOFF = datetime(2026, 7, 17, 8, 0, tzinfo=PARIS)


@pytest.fixture(scope="module")
def forecast_data(tmp_path_factory: pytest.TempPathFactory) -> Path:
    output = tmp_path_factory.mktemp("forecasting")
    for scenario_id in (
        "baseline_normal",
        "concert_dry_friday",
        "event_cancelled",
        "bad_data_abstain",
    ):
        generate_dataset(
            GenerationRequest(
                seed=20260717,
                demo_date=DEMO_DATE,
                scenario_id=scenario_id,
                config_dir=CONFIG_DIR,
                output_dir=output,
                history_days=365,
            )
        )
    return output


def test_baseline_uses_only_prior_comparable_services(forecast_data: Path) -> None:
    repository = ForecastRepository(forecast_data / "baseline_normal")
    result = forecast_service(
        repository,
        "republique_2026-07-17_dinner",
        MORNING_CUTOFF,
        enriched_is_eligible=False,
    )

    assert result.method == "historical_baseline"
    assert result.comparable_period is not None
    assert result.comparable_period.count == 8
    assert result.comparable_period.to_date < DEMO_DATE
    assert all("_dinner" in service_id for service_id in result.comparable_period.service_ids)
    assert all(
        date.fromisoformat(service_id.split("_")[1]).weekday() == DEMO_DATE.weekday()
        for service_id in result.comparable_period.service_ids
    )


def test_concert_forecast_exceeds_baseline_and_explains_signals(forecast_data: Path) -> None:
    scenario_dir = forecast_data / "concert_dry_friday"
    report = run_backtest(scenario_dir)
    result = forecast_service(
        ForecastRepository(scenario_dir),
        "republique_2026-07-17_dinner",
        MORNING_CUTOFF,
        historical_mae=report.enriched.covers_mae,
        enriched_is_eligible=report.selected_method == "reservation_enriched",
    )

    assert result.expected_covers is not None
    assert result.baseline_covers is not None
    assert result.lower_covers is not None
    assert result.upper_covers is not None
    assert result.expected_covers > result.baseline_covers
    assert result.lower_covers < result.expected_covers <= result.upper_covers
    assert {driver.code for driver in result.drivers} >= {
        "reservation_pace",
        "nearby_concert",
        "dry_weather",
    }


def test_event_cancellation_recalculates_downward(forecast_data: Path) -> None:
    scenario_dir = forecast_data / "event_cancelled"
    repository = ForecastRepository(scenario_dir)
    before = forecast_service(repository, "republique_2026-07-17_dinner", MORNING_CUTOFF)
    after = forecast_service(
        repository,
        "republique_2026-07-17_dinner",
        datetime(2026, 7, 17, 14, 0, tzinfo=PARIS),
    )

    assert before.expected_covers is not None and after.expected_covers is not None
    assert after.expected_covers < before.expected_covers
    assert "event_cancelled" in {driver.code for driver in after.drivers}


def test_bad_data_scenario_abstains(forecast_data: Path) -> None:
    scenario_dir = forecast_data / "bad_data_abstain"
    result = forecast_service(
        ForecastRepository(scenario_dir),
        "liberte_2026-07-17_dinner",
        MORNING_CUTOFF,
    )

    assert result.method == "abstain"
    assert result.expected_covers is None
    assert result.confidence.level == "unavailable"
    assert result.abstention_reasons == ["low_data_quality"]


def test_backtest_beats_baseline_without_temporal_leakage(forecast_data: Path) -> None:
    report = run_backtest(forecast_data / "baseline_normal")

    assert report.baseline.observations > 100
    assert report.enriched.covers_wape < report.baseline.covers_wape
    assert report.selected_method == "reservation_enriched"
    assert report.temporal_leakage_checks > 0
    assert report.temporal_leakage_violations == 0
