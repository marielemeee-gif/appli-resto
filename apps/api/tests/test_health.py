import httpx
import pytest

from pilotage_api.main import app


@pytest.mark.anyio
async def test_health_reports_api_state_without_demo_data() -> None:
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/health")

    assert response.status_code == 200
    assert response.json() == {
        "status": "ok",
        "service": "pilotage-api",
        "version": "0.1.0",
        "environment": "development",
        "data_status": "not_initialized",
    }
