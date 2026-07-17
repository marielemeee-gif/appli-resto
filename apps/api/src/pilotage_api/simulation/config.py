import json
from pathlib import Path

from pydantic import TypeAdapter

from pilotage_api.simulation.models import ScenarioDefinition, Site

_SITES = TypeAdapter(list[Site])
_SCENARIOS = TypeAdapter(list[ScenarioDefinition])


def load_sites(config_dir: Path) -> list[Site]:
    return _SITES.validate_python(json.loads((config_dir / "sites.json").read_text()))


def load_scenarios(config_dir: Path) -> list[ScenarioDefinition]:
    return _SCENARIOS.validate_python(json.loads((config_dir / "scenarios.json").read_text()))
