import json
import shutil
from datetime import date, datetime
from pathlib import Path
from zoneinfo import ZoneInfo

import pytest
from fastapi.testclient import TestClient

import pilotage_api.recommendations.routes as recommendation_routes
from pilotage_api.main import app
from pilotage_api.recommendations.engine import build_briefing, build_dispatch
from pilotage_api.settings import Settings
from pilotage_api.simulation.generator import GenerationRequest, generate_dataset

PARIS = ZoneInfo("Europe/Paris")
PROJECT_ROOT = Path(__file__).resolve().parents[3]
CONFIG_DIR = PROJECT_ROOT / "data/config"
DEMO_DATE = date(2026, 7, 17)
CUTOFF = datetime(2026, 7, 17, 8, 0, tzinfo=PARIS)


@pytest.fixture(scope="module")
def recommendation_data(tmp_path_factory: pytest.TempPathFactory) -> Path:
    output = tmp_path_factory.mktemp("recommendations")
    for scenario_id in (
        "concert_dry_friday",
        "multisite_staff_imbalance",
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


def test_briefing_produces_at_most_three_auditable_proposals(
    recommendation_data: Path,
) -> None:
    briefing = build_briefing(
        recommendation_data / "concert_dry_friday",
        "republique_2026-07-17_dinner",
        CUTOFF,
    )

    assert 1 <= len(briefing.recommendations) <= 3
    assert {item.type for item in briefing.recommendations} >= {"preparation", "purchase"}
    for recommendation in briefing.recommendations:
        assert recommendation.status == "proposal"
        assert recommendation.deadline > CUTOFF
        assert recommendation.formula
        assert recommendation.assumptions
        assert recommendation.constraints
        assert all(check.passed for check in recommendation.constraints)


def test_expired_actions_are_not_proposed(recommendation_data: Path) -> None:
    briefing = build_briefing(
        recommendation_data / "concert_dry_friday",
        "republique_2026-07-17_dinner",
        datetime(2026, 7, 17, 17, 0, tzinfo=PARIS),
    )

    assert briefing.recommendations == []


def test_abstention_never_creates_precise_recommendations(recommendation_data: Path) -> None:
    briefing = build_briefing(
        recommendation_data / "bad_data_abstain",
        "liberte_2026-07-17_dinner",
        CUTOFF,
    )

    assert briefing.forecast.method == "abstain"
    assert briefing.recommendations == []
    assert briefing.data_quality_messages == ["low_data_quality"]


def test_dispatch_moves_one_server_without_harming_source(recommendation_data: Path) -> None:
    dispatch = build_dispatch(recommendation_data / "multisite_staff_imbalance", DEMO_DATE, CUTOFF)

    assert len(dispatch.proposals) == 1
    proposal = dispatch.proposals[0]
    source = next(site for site in dispatch.sites if site.site_id == proposal.source_site_id)
    target = next(site for site in dispatch.sites if site.site_id == proposal.target_site_id)
    assert (proposal.source_site_id, proposal.target_site_id) == ("republique", "liberte")
    assert proposal.quantity == 1
    assert proposal.travel_minutes == 7
    assert source.server_gap - proposal.quantity >= 0
    assert target.server_gap + proposal.quantity == 0
    assert all(check.passed for check in proposal.constraints)


def test_incompatible_role_blocks_dispatch(recommendation_data: Path, tmp_path: Path) -> None:
    source = recommendation_data / "multisite_staff_imbalance"
    scenario_dir = tmp_path / "scenario"
    shutil.copytree(source, scenario_dir)
    sites_path = scenario_dir / "observed/sites.ndjson"
    sites = [json.loads(line) for line in sites_path.read_text().splitlines()]
    for site in sites:
        if site["id"] == "republique":
            site["roles"] = [role for role in site["roles"] if role != "server"]
    sites_path.write_text(
        "".join(json.dumps(site, ensure_ascii=False, sort_keys=True) + "\n" for site in sites)
    )

    dispatch = build_dispatch(scenario_dir, DEMO_DATE, CUTOFF)

    assert dispatch.proposals == []


def test_decision_is_persisted_and_exposed_in_roi(
    recommendation_data: Path,
    tmp_path: Path,
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    scenario_dir = recommendation_data / "concert_dry_friday"
    monkeypatch.setattr(
        recommendation_routes,
        "active_scenario_dir",
        lambda: ("concert_dry_friday", scenario_dir),
    )
    monkeypatch.setattr(
        recommendation_routes,
        "get_settings",
        lambda: Settings(data_dir=tmp_path),
    )
    client = TestClient(app)
    briefing = client.get(
        "/briefings/republique_2026-07-17_dinner",
        params={"as_of": CUTOFF.isoformat()},
    ).json()
    recommendation = briefing["recommendations"][0]

    response = client.post(
        f"/recommendations/{recommendation['id']}/decisions",
        json={
            "status": "accepted",
            "reason": "test_prototype",
            "decided_at": "2026-07-17T09:00:00+02:00",
        },
    )
    roi = client.get("/roi")

    assert response.status_code == 200
    assert response.json()["simulated_only"] is True
    assert roi.json()["decisions_count"] == 1
    assert roi.json()["observed_gain_cents"] is None


def test_modified_decision_requires_selected_action(
    recommendation_data: Path,
    tmp_path: Path,
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    scenario_dir = recommendation_data / "concert_dry_friday"
    monkeypatch.setattr(
        recommendation_routes,
        "active_scenario_dir",
        lambda: ("concert_dry_friday", scenario_dir),
    )
    monkeypatch.setattr(
        recommendation_routes,
        "get_settings",
        lambda: Settings(data_dir=tmp_path),
    )
    client = TestClient(app)
    briefing = client.get(
        "/briefings/republique_2026-07-17_dinner",
        params={"as_of": CUTOFF.isoformat()},
    ).json()

    response = client.post(
        f"/recommendations/{briefing['recommendations'][0]['id']}/decisions",
        json={"status": "modified", "decided_at": "2026-07-17T09:00:00+02:00"},
    )

    assert response.status_code == 422
    assert response.json()["detail"]["code"] == "constraint_violation"
