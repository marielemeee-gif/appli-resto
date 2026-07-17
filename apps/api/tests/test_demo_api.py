from datetime import date
from pathlib import Path

import httpx
import pytest

import pilotage_api.demo as demo
from pilotage_api.main import app
from pilotage_api.settings import Settings
from pilotage_api.simulation.generator import GenerationRequest, generate_dataset

PROJECT_ROOT = Path(__file__).resolve().parents[3]


@pytest.mark.anyio
async def test_catalog_endpoints_expose_fictitious_configuration() -> None:
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        scenarios = await client.get("/demo/scenarios")
        sites = await client.get("/sites")

    assert scenarios.status_code == 200
    assert len(scenarios.json()) == 6
    assert sites.status_code == 200
    assert [site["id"] for site in sites.json()] == ["republique", "liberte", "gare"]


@pytest.mark.anyio
async def test_scenario_activation_and_mock_weather(
    tmp_path: Path, monkeypatch: pytest.MonkeyPatch
) -> None:
    config_dir = PROJECT_ROOT / "data/config"
    data_dir = tmp_path / "data"
    data_dir.mkdir()
    (data_dir / "config").symlink_to(config_dir, target_is_directory=True)
    generate_dataset(
        GenerationRequest(
            seed=20260717,
            demo_date=date(2026, 7, 17),
            scenario_id="baseline_normal",
            config_dir=config_dir,
            output_dir=data_dir / "generated",
            history_days=365,
        )
    )
    settings = Settings(data_dir=data_dir)
    monkeypatch.setattr(demo, "get_settings", lambda: settings)
    demo._active_scenario_id = None

    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        inactive = await client.get(
            "/mock/weather",
            params={
                "site_id": "republique",
                "from_date": "2026-07-17",
                "to_date": "2026-07-17",
                "as_of": "2026-07-17T08:00:00+02:00",
            },
        )
        activated = await client.post("/demo/scenarios/baseline_normal/activate")
        weather = await client.get(
            "/mock/weather",
            params={
                "site_id": "republique",
                "from_date": "2026-07-17",
                "to_date": "2026-07-17",
                "as_of": "2026-07-17T08:00:00+02:00",
            },
        )
        forecast = await client.get(
            "/forecasts",
            params={
                "site_id": "republique",
                "from": "2026-07-17",
                "to": "2026-07-17",
                "as_of": "2026-07-17T08:00:00+02:00",
            },
        )
        briefing = await client.get(
            "/briefings/republique_2026-07-17_dinner",
            params={"as_of": "2026-07-17T08:00:00+02:00"},
        )

    assert inactive.status_code == 409
    assert activated.json() == {"scenario_id": "baseline_normal", "status": "active"}
    assert weather.status_code == 200
    assert len(weather.json()) == 1
    assert forecast.status_code == 200
    assert len(forecast.json()) == 2
    assert all(item["model_version"] == "forecast-v1.0.0" for item in forecast.json())
    assert briefing.status_code == 200
    assert len(briefing.json()["recommendations"]) <= 3
    assert all(item["status"] == "proposal" for item in briefing.json()["recommendations"])
