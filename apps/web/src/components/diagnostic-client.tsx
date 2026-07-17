"use client";

import { useEffect, useState } from "react";
import { Briefing, getBacktest, getBriefing } from "@/lib/api";
import { StateBanner } from "./ui";

export function DiagnosticClient() {
  const [data, setData] = useState<{ briefing: Briefing; backtest: Awaited<ReturnType<typeof getBacktest>> }>();
  const [error, setError] = useState("");
  useEffect(() => { getBriefing("bad_data_abstain", "liberte").then(async (briefing) => ({ briefing, backtest: await getBacktest() })).then(setData).catch((value: Error) => setError(value.message)); }, []);
  if (error) return <StateBanner tone="danger" title="Diagnostic indisponible">{error}</StateBanner>;
  if (!data) return <StateBanner tone="info" title="Diagnostic en cours">Contrôle de la qualité et du backtest…</StateBanner>;
  const forecast = data.briefing.forecast;
  return <><StateBanner tone="warning" title="Le moteur s’abstient sur Liberté">{forecast.abstention_reasons.join(", ") || data.briefing.data_quality_messages.join(", ")}. Aucune recommandation précise n’est produite.</StateBanner><div className="diagnostic-grid"><section className="panel"><p className="eyebrow">Méthode</p><h2>{forecast.method}</h2><dl className="detail-list"><div><dt>Version</dt><dd>{forecast.model_version}</dd></div><div><dt>Coupure</dt><dd>{new Date(forecast.data_cutoff).toLocaleString("fr-FR")}</dd></div><div><dt>WAPE backtest</dt><dd>{(data.backtest.enriched.covers_wape * 100).toFixed(2)} %</dd></div><div><dt>Fuites temporelles</dt><dd>{data.backtest.temporal_leakage_violations}</dd></div></dl></section><section className="panel"><p className="eyebrow">Qualité</p><h2>Messages explicites</h2><ul className="driver-list">{data.briefing.data_quality_messages.map((message) => <li key={message}><span>{message}</span><strong>bloquant</strong></li>)}</ul></section></div></>;
}
