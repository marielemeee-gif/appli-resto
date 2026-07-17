"use client";

import Link from "next/link";
import { useState } from "react";
import { useDemo } from "@/demo/demo-context";
import { getDemoHorizon, type DemoSite, type DemoWatchItem } from "@/demo/scenarios";
import { Confidence, PageHeader, StateBanner } from "./ui";

const recommendationLabels: Record<string, string> = { staffing: "Équipe", preparation: "Préparation", purchase: "Achats" };
const siteIds: DemoSite["id"][] = ["republique", "liberte", "gare"];

function isSiteId(value: string): value is DemoSite["id"] {
  return siteIds.some((siteId) => siteId === value);
}

function isService(value: string): value is "lunch" | "dinner" {
  return value === "lunch" || value === "dinner";
}

function OperationalWatch({ items }: { items: DemoWatchItem[] }) {
  return <section className="panel" aria-labelledby="watch-title">
    <div className="panel-heading"><div><p className="eyebrow">À surveiller</p><h2 id="watch-title">Horizon opérationnel</h2></div><span>4 échéances utiles</span></div>
    <div className="watch-list">
      {items.map((item) => <article className={`watch-item ${item.urgency}`} key={item.id}>
        <div className="watch-meta"><span>{item.category}</span><small>{item.when}</small></div>
        <div><strong>{item.title}</strong><p>{item.detail}</p></div>
        <small className="watch-site">{item.site}</small>
      </article>)}
    </div>
  </section>;
}

export function CockpitPage() {
  const { scenario, decisions } = useDemo();
  const [horizonSite, setHorizonSite] = useState<DemoSite["id"]>(scenario.siteId);
  const [horizonService, setHorizonService] = useState<"lunch" | "dinner">("dinner");
  const forecast = scenario.forecast;
  const scenarioDecisions = decisions.filter((item) => item.scenarioId === scenario.id);
  const horizon = getDemoHorizon(scenario.sites)[horizonSite];

  return <>
    <PageHeader eyebrow={`Tableau de bord · ${scenario.moment}`} title="Pilotage du jour" description={`Vendredi 17 juillet · dîner · ${scenario.siteName} · données fictives arrêtées à ${scenario.asOf}.`} site={scenario.siteName} />

    {forecast.expectedCovers === null ? <>
      <StateBanner tone="warning" title="Prévision suspendue">{forecast.abstentionReason} Les échéances opérationnelles restent visibles, mais aucune action chiffrée n’est proposée.</StateBanner>
      <OperationalWatch items={scenario.watch} />
    </> : <>
      <section className="executive-forecast" aria-labelledby="forecast-title">
        <div className="forecast-primary"><p className="eyebrow light">Dîner prévu</p><div><strong>{forecast.expectedCovers}</strong><span>couverts</span></div><p id="forecast-title">Fourchette {forecast.lowerCovers}–{forecast.upperCovers} · {forecast.expectedRevenue?.toLocaleString("fr-FR")} € de CA fictif</p></div>
        <div className="forecast-change"><span>Depuis le dernier point</span><strong>{forecast.previousCovers} → {forecast.expectedCovers}</strong><p>{scenario.summary}</p><Confidence score={forecast.confidence} /></div>
        <Link className="button amber" href="/briefing">Traiter {scenario.recommendations.length} décisions</Link>
      </section>

      <details className="forecast-details">
        <summary>Voir le calcul et les facteurs</summary>
        <div className="forecast-details-grid">
          <div><span>Référence comparable</span><strong>{forecast.baselineCovers} couverts</strong><small>{forecast.method} · arrêté à {scenario.asOf}</small></div>
          <ol>{scenario.signals.map((signal) => <li key={signal.id}><span>{signal.label}</span><strong>{signal.current}</strong><small>{signal.impactCovers === null ? "Contrainte non chiffrée" : `${signal.impactCovers > 0 ? "+" : ""}${signal.impactCovers} couverts`} · {signal.updatedAt}</small></li>)}</ol>
        </div>
      </details>

      <section className="week-horizon" aria-labelledby="week-title">
        <header><div><p className="eyebrow">Projection compacte</p><h2 id="week-title">Les 7 prochains jours</h2></div><div className="horizon-filters"><label>Établissement<select value={horizonSite} onChange={(event) => { if (isSiteId(event.target.value)) setHorizonSite(event.target.value); }}>{scenario.sites.map((site) => <option value={site.id} key={site.id}>{site.name}</option>)}</select></label><label>Service<select value={horizonService} onChange={(event) => { if (isService(event.target.value)) setHorizonService(event.target.value); }}><option value="lunch">Déjeuner</option><option value="dinner">Dîner</option></select></label></div></header>
        <div className="horizon-days">{horizon.map((day, index) => <article className={index === 0 ? "today" : ""} key={day.date}><span>{day.day}</span><small>{day.date}</small><strong>{day[horizonService] ?? "—"}</strong><em>{day[horizonService] === null ? "donnée insuffisante" : `${day.confidence} % confiance`}</em></article>)}</div>
        <p>Projection fictive de consultation · le service courant conserve sa fourchette détaillée ci-dessus.</p>
      </section>

      <div className="cockpit-grid dashboard-workspace">
        <OperationalWatch items={scenario.watch} />
        <section className="decision-panel" aria-labelledby="decisions-title"><p className="eyebrow light">À traiter</p><h2 id="decisions-title">{scenario.recommendations.length} décisions</h2>{scenario.recommendations.map((item) => { const decision = scenarioDecisions.find((entry) => entry.recommendationId === item.id); return <article className="decision-card" key={item.id}><span>{recommendationLabels[item.type]}</span><strong>{item.title}</strong><small>{decision ? `Décision ${decision.status}` : `avant ${item.deadline}`}</small></article>; })}<Link className="button amber" href="/briefing">Ouvrir les décisions</Link></section>
      </div>
    </>}
  </>;
}
