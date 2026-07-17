from datetime import date, datetime
from pathlib import Path
from typing import Any

from pilotage_api.simulation.storage import read_ndjson


class DatasetNotGeneratedError(FileNotFoundError):
    pass


class SimulatedAdapters:
    """Lecture des signaux simulés en respectant leur date de publication."""

    def __init__(self, scenario_dir: Path) -> None:
        if not (scenario_dir / "manifest.json").exists():
            raise DatasetNotGeneratedError(f"Dataset absent: {scenario_dir}")
        self.scenario_dir = scenario_dir

    def weather(
        self, site_id: str, from_date: date, to_date: date, as_of: datetime
    ) -> list[dict[str, Any]]:
        return [
            row
            for row in read_ndjson(self.scenario_dir / "observed/weather_forecasts.ndjson")
            if row["site_id"] == site_id
            and from_date.isoformat() <= row["forecast_for"] <= to_date.isoformat()
            and row["issued_at"] <= as_of.isoformat()
        ]

    def events(self, as_of: datetime) -> list[dict[str, Any]]:
        visible = [
            row
            for row in read_ndjson(self.scenario_dir / "observed/events.ndjson")
            if row["last_updated_at"] <= as_of.isoformat()
        ]
        latest: dict[str, dict[str, Any]] = {}
        for row in visible:
            if (
                row["id"] not in latest
                or row["last_updated_at"] > latest[row["id"]]["last_updated_at"]
            ):
                latest[row["id"]] = row
        return list(latest.values())

    def calendar(self, from_date: date, to_date: date) -> list[dict[str, Any]]:
        return [
            row
            for row in read_ndjson(self.scenario_dir / "observed/calendar.ndjson")
            if from_date.isoformat() <= row["date"] <= to_date.isoformat()
        ]

    def roadworks(self, site_id: str, as_of: datetime) -> list[dict[str, Any]]:
        return [
            row
            for row in read_ndjson(self.scenario_dir / "observed/roadworks.ndjson")
            if row["site_id"] == site_id and row["last_updated_at"] <= as_of.isoformat()
        ]
