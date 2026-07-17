import argparse
import json
from datetime import date, datetime, time, timedelta
from pathlib import Path
from statistics import fmean
from typing import Literal
from zoneinfo import ZoneInfo

from pilotage_api.forecasting.engine import forecast_service
from pilotage_api.forecasting.models import BacktestReport, MethodMetrics
from pilotage_api.forecasting.repository import ForecastRepository
from pilotage_api.simulation.storage import read_ndjson

PARIS = ZoneInfo("Europe/Paris")


def get_backtest(scenario_dir: Path) -> BacktestReport:
    """Lit le rapport pré-calculé en déploiement, sinon le calcule localement."""
    report_path = scenario_dir / "reports/backtest.json"
    if report_path.exists():
        return BacktestReport.model_validate_json(report_path.read_text())
    return run_backtest(scenario_dir)


def _metrics(
    actuals: list[tuple[int, int]], predictions: list[tuple[int, int, int, int]]
) -> MethodMetrics:
    cover_errors = [
        abs(actual[0] - predicted[0])
        for actual, predicted in zip(actuals, predictions, strict=True)
    ]
    revenue_errors = [
        abs(actual[1] - predicted[1])
        for actual, predicted in zip(actuals, predictions, strict=True)
    ]
    coverage = [
        predicted[2] <= actual[0] <= predicted[3]
        for actual, predicted in zip(actuals, predictions, strict=True)
    ]
    denominator = sum(actual[0] for actual in actuals)
    return MethodMetrics(
        observations=len(actuals),
        covers_mae=round(fmean(cover_errors), 2),
        covers_wape=round(sum(cover_errors) / denominator, 4) if denominator else 0,
        revenue_mae_cents=round(fmean(revenue_errors), 2),
        interval_coverage=round(sum(coverage) / len(coverage), 4),
    )


def run_backtest(
    scenario_dir: Path,
    evaluation_days: int = 84,
    generated_at: datetime | None = None,
) -> BacktestReport:
    repository = ForecastRepository(scenario_dir)
    manifest = __import__("json").loads((scenario_dir / "manifest.json").read_text())
    evaluation_to = date.fromisoformat(manifest["history_end"])
    evaluation_from = evaluation_to - timedelta(days=evaluation_days - 1)
    ground_truth = {
        row["service_id"]: row
        for row in read_ndjson(scenario_dir / "ground_truth/sales_actuals.ndjson")
    }
    target_ids = [
        service_id
        for service_id, service in repository.services.items()
        if evaluation_from <= date.fromisoformat(service["service_date"]) <= evaluation_to
    ]
    target_ids.sort()

    actuals: list[tuple[int, int]] = []
    baseline_predictions: list[tuple[int, int, int, int]] = []
    enriched_predictions: list[tuple[int, int, int, int]] = []
    leakage_checks = 0
    leakage_violations = 0
    for service_id in target_ids:
        service = repository.services[service_id]
        service_date = date.fromisoformat(service["service_date"])
        cutoff = datetime.combine(service_date, time(8, 0), PARIS)
        comparables = repository.comparables(service, cutoff)
        leakage_checks += len(comparables)
        leakage_violations += sum(
            date.fromisoformat(row["service"]["service_date"]) >= service_date
            for row in comparables
        )
        if len(comparables) < 4 or service_id not in ground_truth:
            continue
        baseline = forecast_service(repository, service_id, cutoff, enriched_is_eligible=False)
        enriched = forecast_service(repository, service_id, cutoff, enriched_is_eligible=True)
        if baseline.expected_covers is None or enriched.expected_covers is None:
            continue
        actual = ground_truth[service_id]
        actuals.append((actual["covers"], actual["revenue_cents"]))
        baseline_predictions.append(
            (
                baseline.expected_covers,
                baseline.expected_revenue_cents or 0,
                baseline.lower_covers or 0,
                baseline.upper_covers or 0,
            )
        )
        enriched_predictions.append(
            (
                enriched.expected_covers,
                enriched.expected_revenue_cents or 0,
                enriched.lower_covers or 0,
                enriched.upper_covers or 0,
            )
        )

    baseline_metrics = _metrics(actuals, baseline_predictions)
    enriched_metrics = _metrics(actuals, enriched_predictions)
    selected: Literal["reservation_enriched", "historical_baseline"] = (
        "reservation_enriched"
        if enriched_metrics.covers_wape <= baseline_metrics.covers_wape
        else "historical_baseline"
    )
    return BacktestReport(
        scenario_id=manifest["scenario_id"],
        generated_at=generated_at or datetime.combine(evaluation_to, time(23, 59), PARIS),
        evaluation_from=evaluation_from,
        evaluation_to=evaluation_to,
        baseline=baseline_metrics,
        enriched=enriched_metrics,
        selected_method=selected,
        temporal_leakage_checks=leakage_checks,
        temporal_leakage_violations=leakage_violations,
    )


def _project_root() -> Path:
    return Path(__file__).resolve().parents[5]


def main() -> None:
    parser = argparse.ArgumentParser(description="Exécute les backtests chronologiques.")
    parser.add_argument("--scenario", default="all")
    parser.add_argument("--evaluation-days", type=int, default=84)
    parser.add_argument("--data-dir", type=Path, default=_project_root() / "data/generated")
    args = parser.parse_args()
    scenario_ids = (
        sorted(path.name for path in args.data_dir.iterdir() if (path / "manifest.json").exists())
        if args.scenario == "all"
        else [args.scenario]
    )
    for scenario_id in scenario_ids:
        report = run_backtest(args.data_dir / scenario_id, args.evaluation_days)
        report_path = args.data_dir / scenario_id / "reports/backtest.json"
        report_path.parent.mkdir(parents=True, exist_ok=True)
        report_path.write_text(
            json.dumps(report.model_dump(mode="json"), ensure_ascii=False, indent=2, sort_keys=True)
            + "\n"
        )
        print(
            f"{scenario_id}: baseline WAPE={report.baseline.covers_wape:.2%}, "
            f"enrichi={report.enriched.covers_wape:.2%}, sélection={report.selected_method}"
        )


if __name__ == "__main__":
    main()
