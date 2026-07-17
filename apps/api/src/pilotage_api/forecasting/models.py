from datetime import date, datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


class ForecastModel(BaseModel):
    model_config = ConfigDict(extra="forbid")


class ForecastDriver(ForecastModel):
    code: Literal[
        "reservation_pace",
        "nearby_concert",
        "event_cancelled",
        "dry_weather",
        "roadworks",
    ]
    impact_covers: int
    explanation: str


class ComparablePeriod(ForecastModel):
    service_ids: list[str]
    from_date: date
    to_date: date
    count: int


class ConfidenceDetail(ForecastModel):
    score: float = Field(ge=0, le=1)
    level: Literal["high", "medium", "low", "unavailable"]
    reasons: list[str]


class ForecastResult(ForecastModel):
    service_id: str
    generated_at: datetime
    data_cutoff: datetime
    model_version: str
    method: Literal["historical_baseline", "reservation_enriched", "abstain"]
    expected_covers: int | None
    lower_covers: int | None
    upper_covers: int | None
    expected_revenue_cents: int | None
    baseline_covers: int | None
    drivers: list[ForecastDriver]
    confidence: ConfidenceDetail
    comparable_period: ComparablePeriod | None
    abstention_reasons: list[str]


class MethodMetrics(ForecastModel):
    observations: int
    covers_mae: float
    covers_wape: float
    revenue_mae_cents: float
    interval_coverage: float


class BacktestReport(ForecastModel):
    scenario_id: str
    generated_at: datetime
    evaluation_from: date
    evaluation_to: date
    baseline: MethodMetrics
    enriched: MethodMetrics
    selected_method: Literal["historical_baseline", "reservation_enriched"]
    temporal_leakage_checks: int
    temporal_leakage_violations: int
