from datetime import date, datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, model_validator

ServiceType = Literal["lunch", "dinner"]
EventStatus = Literal["planned", "confirmed", "cancelled"]
WeatherCondition = Literal["clear", "cloudy", "rain", "storm"]
InventoryFamily = Literal["fresh_produce", "meat", "beverages"]


class StrictModel(BaseModel):
    model_config = ConfigDict(extra="forbid")


class Site(StrictModel):
    id: str
    name: str
    latitude: float
    longitude: float
    capacity: int = Field(gt=0)
    terrace_capacity: int = Field(ge=0)
    base_covers_lunch: int = Field(gt=0)
    base_covers_dinner: int = Field(gt=0)
    average_ticket_lunch_cents: int = Field(gt=0)
    average_ticket_dinner_cents: int = Field(gt=0)
    roles: list[str]


class ScenarioDefinition(StrictModel):
    id: str
    name: str
    description: str


class Service(StrictModel):
    id: str
    site_id: str
    service_date: date
    service_type: ServiceType
    opens_at: datetime
    closes_at: datetime
    capacity: int = Field(gt=0)


class SalesActual(StrictModel):
    service_id: str
    covers: int = Field(ge=0)
    revenue_cents: int = Field(ge=0)
    average_ticket_cents: int = Field(ge=0)
    item_mix: dict[str, int]
    discount_cents: int = Field(ge=0)
    is_duplicate: bool = False

    @model_validator(mode="after")
    def revenue_matches_ticket(self) -> "SalesActual":
        expected = self.covers * self.average_ticket_cents - self.discount_cents
        if self.revenue_cents != max(0, expected):
            raise ValueError("revenue_cents must match covers, ticket and discount")
        return self


class ReservationSnapshot(StrictModel):
    service_id: str
    published_at: datetime
    booked_covers: int = Field(ge=0)
    cancellations: int = Field(ge=0)


class WeatherObservation(StrictModel):
    site_id: str
    observed_for: date
    temperature_c: float
    rain_mm: float = Field(ge=0)
    wind_kph: float = Field(ge=0)
    condition: WeatherCondition


class WeatherForecast(StrictModel):
    site_id: str
    issued_at: datetime
    forecast_for: date
    horizon_days: int = Field(ge=0, le=7)
    temperature_c: float
    rain_mm: float = Field(ge=0)
    wind_kph: float = Field(ge=0)
    condition: WeatherCondition
    uncertainty: float = Field(ge=0, le=1)
    is_missing: bool = False


class LocalEvent(StrictModel):
    id: str
    name: str
    category: Literal["concert", "sport", "festival", "conference"]
    latitude: float
    longitude: float
    capacity: int = Field(gt=0)
    starts_at: datetime
    ends_at: datetime
    status: EventStatus
    last_updated_at: datetime


class RoadDisruption(StrictModel):
    id: str
    site_id: str
    zone: str
    severity: int = Field(ge=0, le=3)
    starts_at: datetime
    ends_at: datetime
    access_impact: float = Field(ge=0, le=1)
    delivery_delay_minutes: int = Field(ge=0)
    last_updated_at: datetime


class StaffPlan(StrictModel):
    service_id: str
    role: str
    people: int = Field(ge=0)
    starts_at: datetime
    ends_at: datetime
    available_people: int = Field(ge=0)


class InventorySnapshot(StrictModel):
    site_id: str
    captured_at: datetime
    family: InventoryFamily
    quantity_units: float = Field(ge=0)
    shelf_life_days: int = Field(gt=0)


class DataQualityIssue(StrictModel):
    code: Literal["missing_history", "duplicate_sale", "uncertain_weather"]
    site_id: str
    service_id: str | None = None
    detail: str
