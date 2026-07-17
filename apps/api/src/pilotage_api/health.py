from typing import Literal

from pydantic import BaseModel


class HealthResponse(BaseModel):
    status: Literal["ok"] = "ok"
    service: Literal["pilotage-api"] = "pilotage-api"
    version: str
    environment: str
    data_status: Literal["not_initialized"] = "not_initialized"
