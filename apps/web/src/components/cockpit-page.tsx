"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Briefing, Forecast, getBriefing, getForecasts } from "@/lib/api";
import { AppShell } from "./app-shell";
import { Confidence, PageHeader, StateBanner } from "./ui";

const day = (serviceId: string) => new Intl.DateTimeFormat("fr-FR", { weekday: "short" }).format(new Date(serviceId.split("_")[1]));

export function CockpitPage() {
  const [data, setData] = useState<{ briefing: Briefing; forecasts: Forecast[] }>();
  const [error, setError] = useState("");
  useEffect(() => { Promise.all([getBriefing(), getForecasts()]).then(([briefing, forecasts]) => setData({ briefing, forecasts })).catch((value: Error) => setError(value.message)); }, []);
  const forecast = data?.briefing.forecast;
  const dinners = data?.forecasts.filter((item) => item.service_id.endsWith("dinner")) ?? [];

  return <AppShell>
    <PageHeader eyebrow="Météo d’activité" title="Vendredi 17 juillet" description="Données calculées par l’API fictive locale." />
    {!data && !error && <StateBanner tone="info" title="Calcul en cours">Activation du scénario et calcul des prévisions…</StateBanner>}
    {error && <StateBanner tone="danger" title="API fictive indisponible">{error}. Lancez `pnpm dev:api` et générez les données.</StateBanner>}
    {data && forecast && forecast.expected_covers !== null && <>
      <section className="activity-card" aria-labelledby="activity-title">
        <div className="activity-score" aria-label={`Indice d’activité ${Math.round(forecast.confidence.score * 100)} sur 100`}>{Math.round(forecast.confidence.score * 100)}</div>
        <div><p className="eyebrow">Activité prévue</p><h2 id="activity-title">{forecast.expected_covers} couverts attendus ce soir</h2><p>{forecast.drivers.map((item) => item.explanation).join(" · ")}</p></div>
        <Confidence score={Math.round(forecast.confidence.score * 100)} />
      </section>
      <section className="kpi-grid" aria-label="Indicateurs du service">
        <article className="kpi"><span>Couverts</span><strong>{forecast.expected_covers}</strong><small>{forecast.lower_covers} à {forecast.upper_covers}</small></article>
        <article className="kpi"><span>CA prévu</span><strong>{((forecast.expected_revenue_cents ?? 0) / 100).toLocaleString("fr-FR")} €</strong><small>Estimation fictive</small></article>
        <article className="kpi attention"><span>Décisions</span><strong>{data.briefing.recommendations.length}</strong><small>Propositions, jamais automatiques</small></article>
      </section>
      <div className="cockpit-grid"><section className="panel" aria-labelledby="week-title"><div className="panel-heading"><div><p className="eyebrow">Prévision API</p><h2 id="week-title">Dîners à sept jours</h2></div><span>Fourchettes disponibles</span></div><div className="bars" role="img" aria-label="Prévisions de couverts à sept jours">{dinners.map((item) => <div className="bar-column" key={item.service_id}><span className="bar-value">{item.expected_covers ?? "—"}</span><span className="bar" style={{ height: `${(item.expected_covers ?? 0) / 1.5}px` }} /><span>{day(item.service_id)}</span></div>)}</div></section>
      <section className="decision-panel" aria-labelledby="decisions-title"><p className="eyebrow light">Fenêtres d’action</p><h2 id="decisions-title">{data.briefing.recommendations.length} décisions prioritaires</h2>{data.briefing.recommendations.map((item) => <article className="decision-card" key={item.id}><span>{item.type}</span><strong>{item.title}</strong><small>avant {new Date(item.deadline).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}</small></article>)}<Link className="button amber" href="/briefing">Décider dans le briefing</Link></section></div>
    </>}
    <p className="fixture-note">API locale · scénario concert_dry_friday · données 100 % fictives.</p>
  </AppShell>;
}
