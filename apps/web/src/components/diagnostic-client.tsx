"use client";

import { useEffect, useState } from "react";
import { Briefing, getBacktest, getBriefing } from "@/lib/api";
import { Confidence, StateBanner } from "./ui";

type DiagnosticData = {
  normal: Briefing;
  abstention: Briefing;
  backtest: Awaited<ReturnType<typeof getBacktest>>;
};

const methodLabels: Record<string, string> = {
  historical_baseline: "Référence historique",
  reservation_enriched: "Prévision enrichie",
  abstain: "Prévision suspendue",
};

const reasonLabels: Record<string, string> = {
  low_data_quality: "Qualité des données insuffisante",
  insufficient_history: "Historique insuffisant",
};

const translate = (value: string) => reasonLabels[value] ?? value.replaceAll("_", " ");

export function DiagnosticClient() {
  const [data, setData] = useState<DiagnosticData>();
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      const normal = await getBriefing("concert_dry_friday", "republique");
      const backtest = await getBacktest();
      const abstention = await getBriefing("bad_data_abstain", "liberte");
      setData({ normal, abstention, backtest });
    }
    load().catch((value: Error) => setError(value.message));
  }, []);

  if (error) return <StateBanner tone="danger" title="Explication indisponible">{error}</StateBanner>;
  if (!data) return <StateBanner tone="info" title="Lecture de la prévision">Nous rassemblons les facteurs, la fourchette et les contrôles qualité…</StateBanner>;

  const forecast = data.normal.forecast;
  const abstention = data.abstention.forecast;
  const delta = (forecast.expected_covers ?? 0) - (forecast.baseline_covers ?? 0);

  return (
    <>
      <section className="forecast-story" aria-labelledby="forecast-story-title">
        <div className="forecast-summary">
          <p className="eyebrow light">République · dîner</p>
          <span className="forecast-kicker">Prévision du service</span>
          <div className="forecast-number"><strong>{forecast.expected_covers}</strong><span>couverts</span></div>
          <p className="forecast-range">Fourchette probable <strong>{forecast.lower_covers}–{forecast.upper_covers}</strong></p>
          <Confidence score={Math.round(forecast.confidence.score * 100)} />
        </div>
        <div className="forecast-explanation">
          <p className="eyebrow">Le raisonnement, sans boîte noire</p>
          <h2 id="forecast-story-title">La référence monte de {Math.abs(delta)} couverts</h2>
          <p className="story-lede">Le moteur part de <strong>{forecast.baseline_covers} couverts</strong>, observés sur des services comparables. Il applique ensuite uniquement les signaux disponibles avant la coupure.</p>
          <ol className="reason-steps">
            {forecast.drivers.map((driver, index) => (
              <li key={`${driver.code}-${index}`}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div><strong>{driver.explanation}</strong><small>{driver.impact_covers > 0 ? "+" : ""}{driver.impact_covers} couverts dans le calcul</small></div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <div className="diagnostic-grid diagnostic-details">
        <section className="panel">
          <p className="eyebrow">Traçabilité</p><h2>{methodLabels[forecast.method]}</h2>
          <dl className="detail-list">
            <div><dt>Données arrêtées à</dt><dd>{new Date(forecast.data_cutoff).toLocaleString("fr-FR", { hour: "2-digit", minute: "2-digit", day: "numeric", month: "short" })}</dd></div>
            <div><dt>Erreur moyenne du backtest</dt><dd>{(data.backtest.enriched.covers_wape * 100).toFixed(1)} %</dd></div>
            <div><dt>Fuite d’information future</dt><dd>{data.backtest.temporal_leakage_violations === 0 ? "Aucune détectée" : data.backtest.temporal_leakage_violations}</dd></div>
            <div><dt>Version de calcul</dt><dd>{forecast.model_version}</dd></div>
          </dl>
        </section>
        <section className="abstention-card">
          <span className="abstention-mark" aria-hidden="true">!</span>
          <div><p className="eyebrow">Cas de prudence · Liberté</p><h2>Ici, le moteur ne chiffre rien</h2><p>Quand la donnée n’est pas assez fiable, aucune fausse précision ni recommandation opérationnelle n’est produite.</p>
          <ul>{(abstention.abstention_reasons.length ? abstention.abstention_reasons : data.abstention.data_quality_messages).map((reason) => <li key={reason}>{translate(reason)}</li>)}</ul></div>
        </section>
      </div>
    </>
  );
}
