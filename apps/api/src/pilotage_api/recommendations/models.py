from datetime import date, datetime
from typing import Any, Literal

from pydantic import BaseModel, ConfigDict, Field

from pilotage_api.forecasting.models import ForecastResult


class RecommendationModel(BaseModel):
    model_config = ConfigDict(extra="forbid")


class ConstraintCheck(RecommendationModel):
    code: str
    passed: bool
    detail: str


class Recommendation(RecommendationModel):
    id: str
    service_id: str
    forecast_model_version: str
    type: Literal["staffing", "preparation", "purchase"]
    title: str
    action: dict[str, Any]
    deadline: datetime
    estimated_gain_cents: int = Field(ge=0)
    estimated_risk_cents: int = Field(ge=0)
    confidence: float = Field(ge=0, le=1)
    formula: str
    assumptions: list[str]
    constraints: list[ConstraintCheck]
    status: Literal["proposal"] = "proposal"


class Briefing(RecommendationModel):
    service_id: str
    generated_at: datetime
    forecast: ForecastResult
    recommendations: list[Recommendation] = Field(max_length=3)
    data_quality_messages: list[str]


class DispatchSite(RecommendationModel):
    site_id: str
    service_id: str
    expected_covers: int
    planned_servers: int
    required_servers: int
    server_gap: int


class DispatchProposal(RecommendationModel):
    id: str
    service_date: date
    role: Literal["server"] = "server"
    source_site_id: str
    target_site_id: str
    quantity: int = Field(gt=0)
    starts_at: datetime
    ends_at: datetime
    travel_minutes: int = Field(ge=0)
    estimated_gain_cents: int = Field(ge=0)
    confidence: float = Field(ge=0, le=1)
    constraints: list[ConstraintCheck]
    status: Literal["proposal"] = "proposal"


class DispatchResponse(RecommendationModel):
    service_date: date
    sites: list[DispatchSite]
    proposals: list[DispatchProposal]


class DecisionInput(RecommendationModel):
    status: Literal["accepted", "modified", "refused"]
    selected_action: dict[str, Any] | None = None
    reason: str | None = None
    decided_at: datetime | None = None


class DecisionRecord(RecommendationModel):
    id: str
    recommendation_id: str
    recommendation_type: str
    site_id: str
    service_id: str
    status: Literal["accepted", "modified", "refused"]
    selected_action: dict[str, Any] | None
    reason: str | None
    decided_at: datetime
    estimated_gain_cents: int = Field(ge=0)
    simulated_only: Literal[True] = True


class RoiSummary(RecommendationModel):
    decisions_count: int
    accepted_count: int
    modified_count: int
    refused_count: int
    estimated_gain_cents: int = Field(ge=0)
    observed_gain_cents: None = None
    decisions: list[DecisionRecord]
