from dataclasses import dataclass
from datetime import date, datetime, time, timedelta
from zoneinfo import ZoneInfo

from pilotage_api.simulation.models import LocalEvent, RoadDisruption, ServiceType

PARIS = ZoneInfo("Europe/Paris")


@dataclass(frozen=True)
class DemandAdjustment:
    multiplier: float = 1.0
    reservation_multiplier: float = 1.0
    staff_delta: int = 0


def target_friday(demo_date: date) -> date:
    return demo_date + timedelta(days=(4 - demo_date.weekday()) % 7)


def demand_adjustment(
    scenario_id: str,
    site_id: str,
    service_date: date,
    service_type: ServiceType,
    demo_date: date,
) -> DemandAdjustment:
    friday = target_friday(demo_date)
    if service_date != friday or service_type != "dinner":
        return DemandAdjustment()
    if scenario_id == "concert_dry_friday":
        multiplier = 1.22 if site_id == "republique" else 1.08
        return DemandAdjustment(multiplier, 1.28)
    if scenario_id == "event_cancelled":
        multiplier = 0.94 if site_id == "republique" else 1.0
        return DemandAdjustment(multiplier, 0.92)
    if scenario_id == "multisite_staff_imbalance":
        staff_delta = 1 if site_id == "republique" else (-1 if site_id == "liberte" else 0)
        return DemandAdjustment(staff_delta=staff_delta)
    if scenario_id == "roadworks_delivery_risk" and site_id == "gare":
        return DemandAdjustment(multiplier=0.88, reservation_multiplier=0.9)
    return DemandAdjustment()


def scenario_events(
    scenario_id: str, demo_date: date, cutoff: datetime
) -> tuple[list[LocalEvent], list[LocalEvent]]:
    friday = target_friday(demo_date)
    starts_at = datetime.combine(friday, time(20, 0), PARIS)
    ends_at = datetime.combine(friday, time(23, 0), PARIS)
    if scenario_id not in {"concert_dry_friday", "event_cancelled"}:
        return [], []

    observed = LocalEvent(
        id="event_bordeaux_live_2026",
        name="Bordeaux Live",
        category="concert",
        latitude=44.8431,
        longitude=-0.5718,
        capacity=5200,
        starts_at=starts_at,
        ends_at=ends_at,
        status="confirmed",
        last_updated_at=cutoff - timedelta(days=2),
    )
    if scenario_id == "event_cancelled":
        final = observed.model_copy(
            update={
                "status": "cancelled",
                "last_updated_at": cutoff + timedelta(hours=5, minutes=40),
            }
        )
        return [observed, final], [final]
    else:
        final = observed
    return [observed], [final]


def scenario_roadworks(
    scenario_id: str, demo_date: date, cutoff: datetime
) -> tuple[list[RoadDisruption], list[RoadDisruption]]:
    if scenario_id != "roadworks_delivery_risk":
        return [], []
    friday = target_friday(demo_date)
    starts_at = datetime.combine(friday, time(9, 0), PARIS)
    ends_at = datetime.combine(friday, time(18, 0), PARIS)
    disruption = RoadDisruption(
        id="works_gare_access_2026",
        site_id="gare",
        zone="Cours de la Marne",
        severity=3,
        starts_at=starts_at,
        ends_at=ends_at,
        access_impact=0.65,
        delivery_delay_minutes=75,
        last_updated_at=cutoff - timedelta(minutes=20),
    )
    return [disruption], [disruption]
