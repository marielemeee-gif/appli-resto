from collections import defaultdict
from datetime import date, datetime, time
from pathlib import Path
from typing import Any
from zoneinfo import ZoneInfo

from pilotage_api.simulation.storage import read_ndjson

PARIS = ZoneInfo("Europe/Paris")


class ForecastRepository:
    def __init__(self, scenario_dir: Path) -> None:
        self.scenario_dir = scenario_dir
        self.services = {
            row["id"]: row for row in read_ndjson(scenario_dir / "observed/services.ndjson")
        }
        self.sales = read_ndjson(scenario_dir / "observed/sales_history.ndjson")
        self.sales_by_service = {
            row["service_id"]: row for row in self.sales if not row["is_duplicate"]
        }
        self.reservations: dict[str, list[dict[str, Any]]] = defaultdict(list)
        for row in read_ndjson(scenario_dir / "observed/reservation_snapshots.ndjson"):
            self.reservations[row["service_id"]].append(row)
        self.weather = read_ndjson(scenario_dir / "observed/weather_forecasts.ndjson")
        self.events = read_ndjson(scenario_dir / "observed/events.ndjson")
        self.roadworks = read_ndjson(scenario_dir / "observed/roadworks.ndjson")
        self.quality_issues = read_ndjson(scenario_dir / "observed/data_quality_issues.ndjson")
        self.sites = {row["id"]: row for row in read_ndjson(scenario_dir / "observed/sites.ndjson")}

    def service(self, service_id: str) -> dict[str, Any]:
        try:
            return self.services[service_id]
        except KeyError as error:
            raise KeyError(f"Unknown service: {service_id}") from error

    def comparables(
        self, service: dict[str, Any], cutoff: datetime, limit: int = 8
    ) -> list[dict[str, Any]]:
        target_date = date.fromisoformat(service["service_date"])
        rows = []
        for service_id, sale in self.sales_by_service.items():
            candidate = self.services[service_id]
            candidate_date = date.fromisoformat(candidate["service_date"])
            if (
                candidate["site_id"] == service["site_id"]
                and candidate["service_type"] == service["service_type"]
                and candidate_date.weekday() == target_date.weekday()
                and candidate_date < target_date
                and datetime.combine(candidate_date, time(23, 59), PARIS) < cutoff
            ):
                rows.append({"service": candidate, "sale": sale})
        rows.sort(key=lambda row: row["service"]["service_date"], reverse=True)
        return rows[:limit]

    def latest_reservation(self, service_id: str, cutoff: datetime) -> dict[str, Any] | None:
        visible = [
            row
            for row in self.reservations.get(service_id, [])
            if datetime.fromisoformat(row["published_at"]) <= cutoff
        ]
        return max(visible, key=lambda row: row["published_at"], default=None)

    def visible_events(self, cutoff: datetime) -> list[dict[str, Any]]:
        latest: dict[str, dict[str, Any]] = {}
        for row in self.events:
            if datetime.fromisoformat(row["last_updated_at"]) <= cutoff:
                if (
                    row["id"] not in latest
                    or row["last_updated_at"] > latest[row["id"]]["last_updated_at"]
                ):
                    latest[row["id"]] = row
        return list(latest.values())

    def weather_for(
        self, site_id: str, target_date: date, cutoff: datetime
    ) -> dict[str, Any] | None:
        visible = [
            row
            for row in self.weather
            if row["site_id"] == site_id
            and row["forecast_for"] == target_date.isoformat()
            and datetime.fromisoformat(row["issued_at"]) <= cutoff
        ]
        return max(visible, key=lambda row: row["issued_at"], default=None)

    def roadworks_for(
        self, site_id: str, target_date: date, cutoff: datetime
    ) -> list[dict[str, Any]]:
        return [
            row
            for row in self.roadworks
            if row["site_id"] == site_id
            and datetime.fromisoformat(row["last_updated_at"]) <= cutoff
            and date.fromisoformat(row["starts_at"][:10])
            <= target_date
            <= date.fromisoformat(row["ends_at"][:10])
        ]

    def quality_for(self, site_id: str) -> list[dict[str, Any]]:
        return [row for row in self.quality_issues if row["site_id"] == site_id]
