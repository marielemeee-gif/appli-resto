import json
from datetime import date, datetime
from pathlib import Path
from zoneinfo import ZoneInfo

import pytest
from pydantic import TypeAdapter

from pilotage_api.simulation.adapters import SimulatedAdapters
from pilotage_api.simulation.config import load_scenarios, load_sites
from pilotage_api.simulation.generator import GenerationRequest, generate_dataset
from pilotage_api.simulation.models import ReservationSnapshot, SalesActual
from pilotage_api.simulation.scenarios import (
    demand_adjustment,
    scenario_events,
    scenario_roadworks,
)
from pilotage_api.simulation.storage import read_ndjson

PARIS = ZoneInfo("Europe/Paris")
PROJECT_ROOT = Path(__file__).resolve().parents[3]
CONFIG_DIR = PROJECT_ROOT / "data/config"
DEMO_DATE = date(2026, 7, 17)
SEED = 20260717


def request(output_dir: Path, scenario_id: str, history_days: int = 365) -> GenerationRequest:
    return GenerationRequest(
        seed=SEED,
        demo_date=DEMO_DATE,
        scenario_id=scenario_id,
        config_dir=CONFIG_DIR,
        output_dir=output_dir,
        history_days=history_days,
    )


@pytest.fixture(scope="module")
def baseline_dir(tmp_path_factory: pytest.TempPathFactory) -> Path:
    output = tmp_path_factory.mktemp("baseline")
    generate_dataset(request(output, "baseline_normal", history_days=730))
    return output / "baseline_normal"


def test_catalog_contains_three_sites_and_six_scenarios() -> None:
    assert [site.id for site in load_sites(CONFIG_DIR)] == ["republique", "liberte", "gare"]
    assert {scenario.id for scenario in load_scenarios(CONFIG_DIR)} == {
        "baseline_normal",
        "concert_dry_friday",
        "event_cancelled",
        "multisite_staff_imbalance",
        "bad_data_abstain",
        "roadworks_delivery_risk",
    }


def test_same_seed_and_configuration_produce_identical_files(tmp_path: Path) -> None:
    first = tmp_path / "first"
    second = tmp_path / "second"

    first_manifest = generate_dataset(request(first, "baseline_normal"))
    second_manifest = generate_dataset(request(second, "baseline_normal"))

    assert first_manifest["files"] == second_manifest["files"]


def test_twenty_four_month_dataset_is_coherent(baseline_dir: Path) -> None:
    manifest = json.loads((baseline_dir / "manifest.json").read_text())
    sites = {site.id: site for site in load_sites(CONFIG_DIR)}
    sales_rows = read_ndjson(baseline_dir / "ground_truth/sales_actuals.ndjson")
    sales = TypeAdapter(list[SalesActual]).validate_python(sales_rows)

    assert manifest["history_start"] == "2024-07-17"
    assert manifest["history_end"] == "2026-07-16"
    assert manifest["service_count"] == 3 * (730 + 8) * 2
    for actual in sales:
        site_id = actual.service_id.split("_", 1)[0]
        assert 0 <= actual.covers <= sites[site_id].capacity
        assert actual.revenue_cents == max(
            0, actual.covers * actual.average_ticket_cents - actual.discount_cents
        )


def test_observed_layer_never_exposes_future_actuals_or_snapshots(baseline_dir: Path) -> None:
    cutoff = datetime(2026, 7, 17, 8, 0, tzinfo=PARIS)
    sales = read_ndjson(baseline_dir / "observed/sales_history.ndjson")
    reservations = TypeAdapter(list[ReservationSnapshot]).validate_python(
        read_ndjson(baseline_dir / "observed/reservation_snapshots.ndjson")
    )

    assert all(row["service_id"].split("_")[1] < DEMO_DATE.isoformat() for row in sales)
    assert all(snapshot.published_at <= cutoff for snapshot in reservations)


def test_scenario_signatures_are_explicit() -> None:
    cutoff = datetime(2026, 7, 17, 8, 0, tzinfo=PARIS)
    friday = date(2026, 7, 17)

    concert = demand_adjustment(
        "concert_dry_friday", "republique", friday, "dinner", DEMO_DATE
    )
    assert concert.multiplier > 1.2
    assert concert.reservation_multiplier > 1.2

    observed_events, final_events = scenario_events("event_cancelled", DEMO_DATE, cutoff)
    assert observed_events[0].status == "confirmed"
    assert final_events[0].status == "cancelled"
    assert final_events[0].last_updated_at > cutoff

    observed_works, _ = scenario_roadworks("roadworks_delivery_risk", DEMO_DATE, cutoff)
    assert observed_works[0].site_id == "gare"
    assert observed_works[0].delivery_delay_minutes == 75

    republic = demand_adjustment(
        "multisite_staff_imbalance", "republique", friday, "dinner", DEMO_DATE
    )
    liberte = demand_adjustment(
        "multisite_staff_imbalance", "liberte", friday, "dinner", DEMO_DATE
    )
    assert (republic.staff_delta, liberte.staff_delta) == (1, -1)


def test_bad_data_scenario_surfaces_quality_issues(tmp_path: Path) -> None:
    generate_dataset(request(tmp_path, "bad_data_abstain"))
    scenario_dir = tmp_path / "bad_data_abstain"

    issues = read_ndjson(scenario_dir / "observed/data_quality_issues.ndjson")
    weather = read_ndjson(scenario_dir / "observed/weather_forecasts.ndjson")
    sales = read_ndjson(scenario_dir / "observed/sales_history.ndjson")

    assert {issue["code"] for issue in issues} == {
        "missing_history",
        "duplicate_sale",
        "uncertain_weather",
    }
    assert any(row["site_id"] == "liberte" and row["is_missing"] for row in weather)
    assert any(row["is_duplicate"] for row in sales)


def test_simulated_adapter_respects_publication_time(baseline_dir: Path) -> None:
    adapters = SimulatedAdapters(baseline_dir)
    before_issue = datetime(2026, 7, 17, 7, 0, tzinfo=PARIS)
    after_issue = datetime(2026, 7, 17, 8, 0, tzinfo=PARIS)

    assert adapters.weather("republique", DEMO_DATE, DEMO_DATE, before_issue) == []
    assert len(adapters.weather("republique", DEMO_DATE, DEMO_DATE, after_issue)) == 1
