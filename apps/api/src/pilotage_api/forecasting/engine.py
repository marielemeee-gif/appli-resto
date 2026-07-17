from datetime import date, datetime, time
from statistics import fmean
from typing import Literal
from zoneinfo import ZoneInfo

from pilotage_api.forecasting.models import (
    ComparablePeriod,
    ConfidenceDetail,
    ForecastDriver,
    ForecastResult,
)
from pilotage_api.forecasting.repository import ForecastRepository

PARIS = ZoneInfo("Europe/Paris")
MODEL_VERSION = "forecast-v1.0.0"


def _weighted_average(values: list[float]) -> float:
    weights = list(range(len(values), 0, -1))
    return sum(value * weight for value, weight in zip(values, weights, strict=True)) / sum(weights)


def _reservation_signal(
    repository: ForecastRepository,
    service_id: str,
    comparables: list[dict[str, object]],
    cutoff: datetime,
) -> tuple[float, int]:
    target = repository.latest_reservation(service_id, cutoff)
    if target is None:
        return 1.0, 0
    booked_values: list[int] = []
    for row in comparables:
        service = row["service"]
        assert isinstance(service, dict)
        comparable_date = date.fromisoformat(str(service["service_date"]))
        comparable_cutoff = datetime.combine(comparable_date, time(8, 0), PARIS)
        snapshot = repository.latest_reservation(str(service["id"]), comparable_cutoff)
        if snapshot is not None:
            booked_values.append(int(snapshot["booked_covers"]))
    if not booked_values or fmean(booked_values) <= 0:
        return 1.0, 0
    raw_ratio = int(target["booked_covers"]) / fmean(booked_values)
    ratio = min(1.3, max(0.75, raw_ratio))
    return 1 + 0.65 * (ratio - 1), len(booked_values)


def _signal_drivers(
    repository: ForecastRepository,
    service: dict[str, object],
    cutoff: datetime,
    baseline: int,
) -> tuple[list[ForecastDriver], int, float]:
    drivers: list[ForecastDriver] = []
    target_date = date.fromisoformat(str(service["service_date"]))
    site_id = str(service["site_id"])
    impact = 0
    uncertainty = 0.2

    for event in repository.visible_events(cutoff):
        if date.fromisoformat(event["starts_at"][:10]) != target_date:
            continue
        if event["status"] == "cancelled":
            event_impact = -round(baseline * (0.08 if site_id == "republique" else 0.03))
            drivers.append(
                ForecastDriver(
                    code="event_cancelled",
                    impact_covers=event_impact,
                    explanation="L’événement proche a été annulé avant cette nouvelle estimation.",
                )
            )
        elif event["category"] == "concert" and service["service_type"] == "dinner":
            event_impact = round(baseline * (0.08 if site_id == "republique" else 0.03))
            drivers.append(
                ForecastDriver(
                    code="nearby_concert",
                    impact_covers=event_impact,
                    explanation="Concert confirmé à proximité pendant le service.",
                )
            )
        else:
            event_impact = 0
        impact += event_impact

    weather = repository.weather_for(site_id, target_date, cutoff)
    if weather is not None:
        uncertainty = float(weather["uncertainty"])
        site = repository.sites[site_id]
        if (
            not weather["is_missing"]
            and weather["condition"] == "clear"
            and float(weather["temperature_c"]) >= 18
            and int(site["terrace_capacity"]) > 0
        ):
            weather_impact = round(baseline * 0.02)
            impact += weather_impact
            drivers.append(
                ForecastDriver(
                    code="dry_weather",
                    impact_covers=weather_impact,
                    explanation="Temps sec favorable à la terrasse.",
                )
            )

    for disruption in repository.roadworks_for(site_id, target_date, cutoff):
        works_impact = -round(baseline * float(disruption["access_impact"]) * 0.15)
        impact += works_impact
        drivers.append(
            ForecastDriver(
                code="roadworks",
                impact_covers=works_impact,
                explanation="Les travaux réduisent l’accessibilité du site.",
            )
        )
    return drivers, impact, uncertainty


def forecast_service(
    repository: ForecastRepository,
    service_id: str,
    cutoff: datetime,
    historical_mae: float = 8.0,
    enriched_is_eligible: bool = True,
) -> ForecastResult:
    service = repository.service(service_id)
    target_date = date.fromisoformat(service["service_date"])
    comparables = repository.comparables(service, cutoff)
    period = None
    if comparables:
        comparable_ids = [str(row["service"]["id"]) for row in comparables]
        comparable_dates = [
            date.fromisoformat(str(row["service"]["service_date"])) for row in comparables
        ]
        period = ComparablePeriod(
            service_ids=comparable_ids,
            from_date=min(comparable_dates),
            to_date=max(comparable_dates),
            count=len(comparables),
        )

    quality = repository.quality_for(service["site_id"])
    severe_quality = {row["code"] for row in quality} & {
        "missing_history",
        "duplicate_sale",
        "uncertain_weather",
    }
    abstention_reasons: list[str] = []
    if len(comparables) < 4:
        abstention_reasons.append("insufficient_history")
    if len(severe_quality) >= 2:
        abstention_reasons.append("low_data_quality")
    if abstention_reasons:
        return ForecastResult(
            service_id=service_id,
            generated_at=cutoff,
            data_cutoff=cutoff,
            model_version=MODEL_VERSION,
            method="abstain",
            expected_covers=None,
            lower_covers=None,
            upper_covers=None,
            expected_revenue_cents=None,
            baseline_covers=None,
            drivers=[],
            confidence=ConfidenceDetail(
                score=0,
                level="unavailable",
                reasons=["Historique ou qualité insuffisants pour une prévision fiable."],
            ),
            comparable_period=period,
            abstention_reasons=abstention_reasons,
        )

    covers_values = [float(row["sale"]["covers"]) for row in comparables]
    ticket_values = [float(row["sale"]["average_ticket_cents"]) for row in comparables]
    baseline = round(_weighted_average(covers_values))
    ticket = round(_weighted_average(ticket_values))
    reservation_multiplier, reservation_count = _reservation_signal(
        repository, service_id, comparables, cutoff
    )
    reservation_impact = round(baseline * (reservation_multiplier - 1))
    drivers, external_impact, weather_uncertainty = _signal_drivers(
        repository, service, cutoff, baseline
    )
    if reservation_count:
        drivers.insert(
            0,
            ForecastDriver(
                code="reservation_pace",
                impact_covers=reservation_impact,
                explanation="Rythme de réservation comparé aux services historiques retenus.",
            ),
        )

    method: Literal["reservation_enriched", "historical_baseline"] = (
        "reservation_enriched" if enriched_is_eligible else "historical_baseline"
    )
    expected = baseline + reservation_impact + external_impact if enriched_is_eligible else baseline
    expected = max(0, min(int(service["capacity"]), expected))
    horizon = max(0, (target_date - cutoff.date()).days)
    interval_half_width = max(5, round(historical_mae * (1 + 0.08 * horizon + weather_uncertainty)))
    lower = max(0, expected - interval_half_width)
    upper = min(int(service["capacity"]), expected + interval_half_width)

    score = 0.86
    reasons = [f"{len(comparables)} services comparables utilisés."]
    score -= min(0.24, horizon * 0.025)
    score -= weather_uncertainty * 0.18
    if quality:
        score -= 0.18
        reasons.append("Qualité des données partiellement dégradée.")
    if not enriched_is_eligible:
        score -= 0.08
        reasons.append("La référence est conservée car elle est meilleure au backtest.")
    score = round(max(0.05, min(0.95, score)), 2)
    level: Literal["high", "medium", "low"] = (
        "high" if score >= 0.75 else ("medium" if score >= 0.5 else "low")
    )

    return ForecastResult(
        service_id=service_id,
        generated_at=cutoff,
        data_cutoff=cutoff,
        model_version=MODEL_VERSION,
        method=method,
        expected_covers=expected,
        lower_covers=lower,
        upper_covers=upper,
        expected_revenue_cents=expected * ticket,
        baseline_covers=baseline,
        drivers=drivers if enriched_is_eligible else [],
        confidence=ConfidenceDetail(score=score, level=level, reasons=reasons),
        comparable_period=period,
        abstention_reasons=[],
    )
