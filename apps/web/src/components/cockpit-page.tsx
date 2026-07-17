"use client";

import Link from "next/link";
import { useState } from "react";
import { useDemo } from "@/demo/demo-context";
import { getDemoHorizon, type DemoWatchItem } from "@/demo/scenarios";
import { Confidence, PageHeader, StateBanner } from "./ui";

const recommendationLabels: Record<string, string> = { staffing: "Équipe", preparation: "Préparation", purchase: "Achats" };
function isService(value: string): value is "lunch" | "dinner" {
  return value === "lunch" || value === "dinner";
}

function OperationalWatch({ items }: { items: DemoWatchItem[] }) {
  return <section className="panel" aria-labelledby="watch-title">
    <div className="panel-heading"><div><p className="eyebrow">À surveiller</p><h2 id="watch-title">Horizon opérationnel</h2></div><span>{items.length} échéance{items.length > 1 ? "s" : ""} utile{items.length > 1 ? "s" : ""}</span></div>
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
  const { scenario, activeSite, decisions } = useDemo();
  const [horizonService, setHorizonService] = useState<"lunch" | "dinner">("dinner");
  const forecast = scenario.forecast;
  const isDetailedSite = activeSite.id === scenario.siteId;
  const scenarioDecisions = decisions.filter((item) => item.scenarioId === scenario.id);
  const horizon = getDemoHorizon(scenario.sites)[activeSite.id];
  const watchItems = scenario.watch.filter((item) => item.site === "Groupe" || item.site === activeSite.name);
  const serverGap = activeSite.requiredServers === null ? null : activeSite.plannedServers - activeSite.requiredServers;

  return <>
    <PageHeader eyebrow={`Tableau de bord · ${scenario.moment}`} title="Pilotage du jour" description={`Vendredi 17 juillet · dîner · ${activeSite.name} · données fictives arrêtées à ${scenario.asOf}.`} site={activeSite.name} />

    {isDetailedSite && forecast.expectedCovers === null ?
      <StateBanner tone="warning" title="Prévision suspendue">{forecast.abstentionReason} Les échéances opérationnelles restent visibles, mais aucune action chiffrée n’est proposée.</StateBanner>
    : isDetailedSite ? <>
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
    </> : <section className="active-site-summary" aria-labelledby="active-site-title">
      <div><p className="eyebrow">Vue synthèse groupe</p><h2 id="active-site-title">{activeSite.name}</h2><p>Ce scénario ne contient pas de prévision détaillée pour ce site. L’app conserve uniquement les données comparables disponibles, sans inventer de fourchette ni de recommandation.</p></div>
      <dl><div><dt>Dîner attendu</dt><dd>{activeSite.expectedCovers ?? "Suspendu"}</dd></div><div><dt>Équipe salle</dt><dd>{activeSite.plannedServers} / {activeSite.requiredServers ?? "—"}</dd></div><div><dt>Stock</dt><dd>{activeSite.stockRisk}</dd></div><div><dt>Lecture</dt><dd>{serverGap !== null && serverGap < 0 ? `Manque ${Math.abs(serverGap)}` : activeSite.alert}</dd></div></dl>
      <Link className="button ghost" href="/multisites">Comparer les établissements</Link>
    </section>}

    <section className="week-horizon" aria-labelledby="week-title">
      <header><div><p className="eyebrow">Projection compacte · {activeSite.name}</p><h2 id="week-title">Les 7 prochains jours</h2></div><div className="horizon-filters"><label>Service<select value={horizonService} onChange={(event) => { if (isService(event.target.value)) setHorizonService(event.target.value); }}><option value="lunch">Déjeuner</option><option value="dinner">Dîner</option></select></label></div></header>
      <div className="horizon-days">{horizon.map((day, index) => <article className={index === 0 ? "today" : ""} key={day.date}><span>{day.day}</span><small>{day.date}</small><strong>{day[horizonService] ?? "—"}</strong><em>{day[horizonService] === null ? "donnée insuffisante" : `${day.confidence} % confiance`}</em></article>)}</div>
      <p>Projection fictive de consultation · seule la vue du site porteur du scénario dispose d’une fourchette détaillée et de facteurs explicatifs.</p>
    </section>

    <div className="cockpit-grid dashboard-workspace">
      <OperationalWatch items={watchItems} />
      {isDetailedSite && forecast.expectedCovers !== null ? <section className="decision-panel" aria-labelledby="decisions-title"><p className="eyebrow light">À traiter</p><h2 id="decisions-title">{scenario.recommendations.length} décisions</h2>{scenario.recommendations.map((item) => { const decision = scenarioDecisions.find((entry) => entry.recommendationId === item.id); return <article className="decision-card" key={item.id}><span>{recommendationLabels[item.type]}</span><strong>{item.title}</strong><small>{decision ? `Décision ${decision.status}` : `avant ${item.deadline}`}</small></article>; })}<Link className="button amber" href="/briefing">Ouvrir les décisions</Link></section> : <section className="decision-panel calm" aria-labelledby="decisions-title"><p className="eyebrow light">Vue active</p><h2 id="decisions-title">Aucune décision moteur</h2><p>{activeSite.expectedCovers === null ? "Les données sont insuffisantes : aucune action chiffrée n’est produite." : `Aucune priorité calculée pour ${activeSite.name} dans cet instantané.`}</p><Link className="button amber" href="/briefing">Ajouter une décision terrain</Link></section>}
    </div>
  </>;
}
