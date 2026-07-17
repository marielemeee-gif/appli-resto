import argparse
import math
import shutil
from dataclasses import dataclass
from datetime import date, datetime, time, timedelta
from pathlib import Path
from typing import Any
from zoneinfo import ZoneInfo

from pilotage_api.simulation.config import load_scenarios, load_sites
from pilotage_api.simulation.models import (
    DataQualityIssue,
    InventoryFamily,
    InventorySnapshot,
    ReservationSnapshot,
    SalesActual,
    Service,
    ServiceType,
    Site,
    StaffPlan,
    WeatherCondition,
    WeatherForecast,
    WeatherObservation,
)
from pilotage_api.simulation.randomness import seeded_random
from pilotage_api.simulation.scenarios import (
    demand_adjustment,
    scenario_events,
    scenario_roadworks,
)
from pilotage_api.simulation.storage import build_manifest, write_ndjson

PARIS = ZoneInfo("Europe/Paris")
SERVICE_TIMES: dict[ServiceType, tuple[time, time]] = {
    "lunch": (time(12, 0), time(14, 30)),
    "dinner": (time(19, 0), time(23, 0)),
}
RESERVATION_LEADS = (14, 7, 3, 1, 0)
ITEMS = ("main_course", "vegetarian", "dessert")


@dataclass(frozen=True)
class GenerationRequest:
    seed: int
    demo_date: date
    scenario_id: str
    config_dir: Path
    output_dir: Path
    history_days: int = 730
    future_days: int = 7

    @property
    def cutoff(self) -> datetime:
        return datetime.combine(self.demo_date, time(8, 0), PARIS)


def _date_range(start: date, end: date) -> list[date]:
    return [start + timedelta(days=offset) for offset in range((end - start).days + 1)]


def _seasonality(day: date) -> float:
    return 1 + 0.1 * math.sin(2 * math.pi * (day.timetuple().tm_yday - 120) / 365.25)


def _weekday_factor(day: date, service_type: str) -> float:
    factors = (0.82, 0.85, 0.91, 1.0, 1.18, 1.14, 0.92)
    factor = factors[day.weekday()]
    if service_type == "dinner" and day.weekday() in (4, 5):
        factor += 0.08
    return factor


def _weather(seed: int, site: Site, day: date) -> WeatherObservation:
    rng = seeded_random(seed, "weather", site.id, day)
    annual = 14 + 9 * math.sin(2 * math.pi * (day.timetuple().tm_yday - 105) / 365.25)
    temperature = round(annual + rng.uniform(-3.5, 3.5), 1)
    rain = 0.0 if rng.random() < 0.62 else round(rng.uniform(0.4, 12), 1)
    wind = round(rng.uniform(5, 34), 1)
    condition: WeatherCondition = (
        "clear" if rain == 0 and temperature > 12 else ("cloudy" if rain < 1 else "rain")
    )
    if rain > 9 and wind > 26:
        condition = "storm"
    return WeatherObservation(
        site_id=site.id,
        observed_for=day,
        temperature_c=temperature,
        rain_mm=rain,
        wind_kph=wind,
        condition=condition,
    )


def _service(site: Site, day: date, service_type: ServiceType) -> Service:
    opens, closes = SERVICE_TIMES[service_type]
    return Service(
        id=f"{site.id}_{day.isoformat()}_{service_type}",
        site_id=site.id,
        service_date=day,
        service_type=service_type,
        opens_at=datetime.combine(day, opens, PARIS),
        closes_at=datetime.combine(day, closes, PARIS),
        capacity=site.capacity,
    )


def _sales(
    seed: int,
    site: Site,
    service: Service,
    weather: WeatherObservation,
    scenario_id: str,
    demo_date: date,
) -> tuple[SalesActual, float]:
    rng = seeded_random(seed, "sales", scenario_id, service.id)
    base = site.base_covers_lunch if service.service_type == "lunch" else site.base_covers_dinner
    trend = 1 + 0.00012 * (service.service_date - (demo_date - timedelta(days=730))).days
    terrace_effect = 1.0
    if weather.condition == "clear" and weather.temperature_c >= 18 and site.terrace_capacity:
        terrace_effect += min(0.1, site.terrace_capacity / site.capacity * 0.2)
    if weather.condition in {"rain", "storm"}:
        terrace_effect -= 0.08 if site.terrace_capacity else 0.03
    adjustment = demand_adjustment(
        scenario_id, site.id, service.service_date, service.service_type, demo_date
    )
    noise = rng.uniform(0.93, 1.07)
    raw_covers = (
        base
        * _weekday_factor(service.service_date, service.service_type)
        * _seasonality(service.service_date)
        * trend
        * terrace_effect
        * adjustment.multiplier
        * noise
    )
    covers = max(0, min(site.capacity, round(raw_covers)))
    base_ticket = (
        site.average_ticket_lunch_cents
        if service.service_type == "lunch"
        else site.average_ticket_dinner_cents
    )
    average_ticket = max(1200, round(base_ticket * rng.uniform(0.96, 1.05)))
    discount = 0 if rng.random() < 0.82 else round(covers * average_ticket * 0.02)
    revenue = max(0, covers * average_ticket - discount)
    vegetarian = round(covers * rng.uniform(0.16, 0.25))
    dessert = round(covers * rng.uniform(0.38, 0.56))
    item_mix = {
        ITEMS[0]: max(0, covers - vegetarian),
        ITEMS[1]: vegetarian,
        ITEMS[2]: dessert,
    }
    return (
        SalesActual(
            service_id=service.id,
            covers=covers,
            revenue_cents=revenue,
            average_ticket_cents=average_ticket,
            item_mix=item_mix,
            discount_cents=discount,
        ),
        adjustment.reservation_multiplier,
    )


def _reservations(
    seed: int,
    service: Service,
    covers: int,
    acceleration: float,
    weather: WeatherObservation,
) -> list[ReservationSnapshot]:
    snapshots: list[ReservationSnapshot] = []
    fractions = {14: 0.12, 7: 0.27, 3: 0.46, 1: 0.66, 0: 0.78}
    for lead in RESERVATION_LEADS:
        rng = seeded_random(seed, "reservation", service.id, lead)
        published_day = service.service_date - timedelta(days=lead)
        published_at = datetime.combine(published_day, time(9, 0), PARIS)
        gross = round(covers * fractions[lead] * acceleration * rng.uniform(0.94, 1.06))
        cancellation_rate = 0.025 + (0.06 if weather.condition in {"rain", "storm"} else 0)
        cancellations = round(gross * cancellation_rate)
        snapshots.append(
            ReservationSnapshot(
                service_id=service.id,
                published_at=published_at,
                booked_covers=max(0, min(service.capacity, gross - cancellations)),
                cancellations=cancellations,
            )
        )
    return snapshots


def _forecast(
    seed: int,
    site: Site,
    observation: WeatherObservation,
    cutoff: datetime,
    horizon: int,
    scenario_id: str,
) -> WeatherForecast:
    rng = seeded_random(seed, "forecast", scenario_id, site.id, observation.observed_for)
    error_scale = 0.7 if horizon <= 1 else (1.8 if horizon <= 3 else 3.5)
    uncertainty = 0.12 if horizon <= 1 else (0.3 if horizon <= 3 else 0.55)
    is_bad = scenario_id == "bad_data_abstain" and site.id == "liberte"
    if scenario_id == "concert_dry_friday" and horizon <= 7:
        temperature = max(22.0, observation.temperature_c)
        rain = 0.0
        condition: WeatherCondition = "clear"
    else:
        temperature = round(observation.temperature_c + rng.uniform(-error_scale, error_scale), 1)
        rain = max(0.0, round(observation.rain_mm + rng.uniform(-error_scale, error_scale), 1))
        condition = "clear" if rain == 0 else ("cloudy" if rain < 1 else "rain")
    return WeatherForecast(
        site_id=site.id,
        issued_at=cutoff - timedelta(minutes=5),
        forecast_for=observation.observed_for,
        horizon_days=horizon,
        temperature_c=temperature,
        rain_mm=rain,
        wind_kph=observation.wind_kph,
        condition=condition,
        uncertainty=0.95 if is_bad else uncertainty,
        is_missing=is_bad,
    )


def _calendar(days: list[date]) -> list[dict[str, Any]]:
    return [
        {
            "date": day.isoformat(),
            "is_weekend": day.weekday() >= 5,
            "is_public_holiday": (day.month, day.day) in {(1, 1), (5, 1), (7, 14), (12, 25)},
            "school_holiday_zone_a": day.month in {7, 8} or (day.month == 12 and day.day >= 20),
            "version": "fr-calendar-2026.1",
        }
        for day in days
    ]


def _staff_plans(
    sites: list[Site],
    services: list[Service],
    sales_by_id: dict[str, SalesActual],
    request: GenerationRequest,
) -> list[StaffPlan]:
    plans: list[StaffPlan] = []
    for service in services:
        if not request.demo_date <= service.service_date <= request.demo_date + timedelta(days=7):
            continue
        site = next(item for item in sites if item.id == service.site_id)
        sales = sales_by_id[service.id]
        adjustment = demand_adjustment(
            request.scenario_id,
            site.id,
            service.service_date,
            service.service_type,
            request.demo_date,
        )
        server_count = max(1, math.ceil(sales.covers / 32) + adjustment.staff_delta)
        cook_count = max(1, math.ceil(sales.covers / 46))
        for role, people in (("server", server_count), ("cook", cook_count)):
            plans.append(
                StaffPlan(
                    service_id=service.id,
                    role=role,
                    people=people,
                    starts_at=service.opens_at - timedelta(minutes=30),
                    ends_at=service.closes_at + timedelta(minutes=30),
                    available_people=people,
                )
            )
    return plans


def _inventory(sites: list[Site], cutoff: datetime, seed: int) -> list[InventorySnapshot]:
    records: list[InventorySnapshot] = []
    for site in sites:
        inventory_defaults: tuple[tuple[InventoryFamily, int, float], ...] = (
            ("fresh_produce", 3, 85.0),
            ("meat", 4, 64.0),
            ("beverages", 90, 210.0),
        )
        for family, shelf_life, base in inventory_defaults:
            rng = seeded_random(seed, "inventory", site.id, family, cutoff.date())
            records.append(
                InventorySnapshot(
                    site_id=site.id,
                    captured_at=cutoff - timedelta(minutes=15),
                    family=family,
                    quantity_units=round(base * rng.uniform(0.75, 1.2), 1),
                    shelf_life_days=shelf_life,
                )
            )
    return records


def generate_dataset(request: GenerationRequest) -> dict[str, Any]:
    sites = load_sites(request.config_dir)
    scenarios = load_scenarios(request.config_dir)
    if request.scenario_id not in {scenario.id for scenario in scenarios}:
        raise ValueError(f"Unknown scenario: {request.scenario_id}")
    if request.history_days < 365:
        raise ValueError("At least 365 history days are required")

    scenario_dir = request.output_dir / request.scenario_id
    if scenario_dir.exists():
        shutil.rmtree(scenario_dir)
    scenario_dir.mkdir(parents=True)

    start = request.demo_date - timedelta(days=request.history_days)
    end = request.demo_date + timedelta(days=request.future_days)
    all_days = _date_range(start, end)
    future_days = _date_range(request.demo_date, end)

    services: list[Service] = []
    sales: list[SalesActual] = []
    observed_sales: list[SalesActual] = []
    reservations: list[ReservationSnapshot] = []
    observations: list[WeatherObservation] = []
    forecasts: list[WeatherForecast] = []
    quality_issues: list[DataQualityIssue] = []
    sales_by_id: dict[str, SalesActual] = {}

    weather_by_site_day: dict[tuple[str, date], WeatherObservation] = {}
    for site in sites:
        for day in all_days:
            observation = _weather(request.seed, site, day)
            weather_by_site_day[(site.id, day)] = observation
            observations.append(observation)
            for service_type in SERVICE_TIMES:
                service = _service(site, day, service_type)
                actual, acceleration = _sales(
                    request.seed,
                    site,
                    service,
                    observation,
                    request.scenario_id,
                    request.demo_date,
                )
                services.append(service)
                sales.append(actual)
                sales_by_id[service.id] = actual
                is_missing_history = (
                    request.scenario_id == "bad_data_abstain"
                    and site.id == "liberte"
                    and request.demo_date - timedelta(days=60) <= day < request.demo_date
                    and day.toordinal() % 3 == 0
                )
                if day < request.demo_date and not is_missing_history:
                    observed_sales.append(actual)
                elif is_missing_history:
                    quality_issues.append(
                        DataQualityIssue(
                            code="missing_history",
                            site_id=site.id,
                            service_id=service.id,
                            detail="Vente absente de l’historique observable.",
                        )
                    )
                reservations.extend(
                    snapshot
                    for snapshot in _reservations(
                        request.seed, service, actual.covers, acceleration, observation
                    )
                    if snapshot.published_at <= request.cutoff
                )

    if request.scenario_id == "bad_data_abstain":
        duplicate_source = next(
            sale
            for sale in observed_sales
            if sale.service_id.startswith("liberte_") and "_dinner" in sale.service_id
        )
        observed_sales.append(duplicate_source.model_copy(update={"is_duplicate": True}))
        quality_issues.append(
            DataQualityIssue(
                code="duplicate_sale",
                site_id="liberte",
                service_id=duplicate_source.service_id,
                detail="Doublon volontaire pour le scénario de qualité dégradée.",
            )
        )

    for site in sites:
        for horizon, day in enumerate(future_days):
            forecasts.append(
                _forecast(
                    request.seed,
                    site,
                    weather_by_site_day[(site.id, day)],
                    request.cutoff,
                    horizon,
                    request.scenario_id,
                )
            )
        if request.scenario_id == "bad_data_abstain" and site.id == "liberte":
            quality_issues.append(
                DataQualityIssue(
                    code="uncertain_weather",
                    site_id=site.id,
                    detail="Prévisions météo marquées manquantes et très incertaines.",
                )
            )

    observed_events, final_events = scenario_events(
        request.scenario_id, request.demo_date, request.cutoff
    )
    observed_roadworks, final_roadworks = scenario_roadworks(
        request.scenario_id, request.demo_date, request.cutoff
    )
    staff_plans = _staff_plans(sites, services, sales_by_id, request)
    inventories = _inventory(sites, request.cutoff, request.seed)

    write_ndjson(scenario_dir / "observed/sites.ndjson", sites)
    write_ndjson(scenario_dir / "observed/services.ndjson", services)
    write_ndjson(scenario_dir / "observed/sales_history.ndjson", observed_sales)
    write_ndjson(scenario_dir / "observed/reservation_snapshots.ndjson", reservations)
    write_ndjson(scenario_dir / "observed/weather_forecasts.ndjson", forecasts)
    write_ndjson(scenario_dir / "observed/events.ndjson", observed_events)
    write_ndjson(scenario_dir / "observed/roadworks.ndjson", observed_roadworks)
    write_ndjson(scenario_dir / "observed/calendar.ndjson", _calendar(all_days))
    write_ndjson(scenario_dir / "observed/staff_plans.ndjson", staff_plans)
    write_ndjson(scenario_dir / "observed/inventory_snapshots.ndjson", inventories)
    write_ndjson(scenario_dir / "observed/data_quality_issues.ndjson", quality_issues)
    write_ndjson(scenario_dir / "ground_truth/sales_actuals.ndjson", sales)
    write_ndjson(scenario_dir / "ground_truth/weather_observations.ndjson", observations)
    write_ndjson(scenario_dir / "ground_truth/events.ndjson", final_events)
    write_ndjson(scenario_dir / "ground_truth/roadworks.ndjson", final_roadworks)

    return build_manifest(
        scenario_dir,
        {
            "schema_version": "1.0.0",
            "scenario_id": request.scenario_id,
            "seed": request.seed,
            "demo_date": request.demo_date,
            "data_cutoff": request.cutoff,
            "history_start": start,
            "history_end": request.demo_date - timedelta(days=1),
            "future_end": end,
            "timezone": "Europe/Paris",
            "site_count": len(sites),
            "service_count": len(services),
        },
    )


def _project_root() -> Path:
    return Path(__file__).resolve().parents[5]


def main() -> None:
    root = _project_root()
    parser = argparse.ArgumentParser(description="Génère les données fictives du prototype.")
    parser.add_argument("--seed", type=int, default=20260717)
    parser.add_argument("--demo-date", type=date.fromisoformat, default=date(2026, 7, 17))
    parser.add_argument("--scenario", default="all")
    parser.add_argument("--output-dir", type=Path, default=root / "data/generated")
    args = parser.parse_args()

    config_dir = root / "data/config"
    scenario_ids = (
        [scenario.id for scenario in load_scenarios(config_dir)]
        if args.scenario == "all"
        else [args.scenario]
    )
    for scenario_id in scenario_ids:
        manifest = generate_dataset(
            GenerationRequest(
                seed=args.seed,
                demo_date=args.demo_date,
                scenario_id=scenario_id,
                config_dir=config_dir,
                output_dir=args.output_dir,
            )
        )
        print(
            f"{scenario_id}: {manifest['service_count']} services, "
            f"{len(manifest['files'])} fichiers"
        )


if __name__ == "__main__":
    main()
