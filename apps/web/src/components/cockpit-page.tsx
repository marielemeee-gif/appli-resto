"use client";

import Link from "next/link";
import { useDemo } from "@/demo/demo-context";
import { Confidence, PageHeader, StateBanner } from "./ui";

const recommendationLabels: Record<string, string> = { staffing: "Équipe", preparation: "Préparation", purchase: "Achats" };
const days = ["ven.", "sam.", "dim.", "lun.", "mar.", "mer.", "jeu."];

export function CockpitPage() {
  const { scenario, decisions } = useDemo();
  const forecast = scenario.forecast;
  const scenarioDecisions = decisions.filter((item) => item.scenarioId === scenario.id);
  const week = forecast.expectedCovers === null ? [] : [0, 8, -14, -18, -11, -7, 3].map((delta) => Math.max(40, forecast.expectedCovers! + delta));

  return <>
    <PageHeader eyebrow={`Cockpit · ${scenario.moment}`} title="Vendredi 17 juillet" description={`${scenario.siteName} · ${scenario.shortName} · instantané fictif ${scenario.asOf}.`} site={scenario.siteName} />

    <section className="change-ribbon" aria-label="Changement détecté">
      <span>Ce qui a changé</span>
      <strong>{forecast.previousCovers === null || forecast.expectedCovers === null ? "La qualité des données ne permet plus de chiffrer le service" : `${forecast.previousCovers} → ${forecast.expectedCovers} couverts depuis le dernier point`}</strong>
      <small>{scenario.signals.length} paramètres croisés · {scenario.recommendations.length} action{scenario.recommendations.length > 1 ? "s" : ""} encore possible{scenario.recommendations.length > 1 ? "s" : ""}</small>
    </section>

    {forecast.expectedCovers === null ? (
      <>
        <StateBanner tone="warning" title="Prévision suspendue">{forecast.abstentionReason} Aucun chiffre ni plan précis n’est produit.</StateBanner>
        <section className="signal-grid" aria-label="Contrôles qualité bloquants">{scenario.signals.map((signal) => <article className="signal-card blocked" key={signal.id}><span>{signal.label}</span><strong>{signal.current}</strong><p>{signal.explanation}</p><small>Contrôlé à {signal.updatedAt}</small></article>)}</section>
      </>
    ) : <>
      <section className="activity-card" aria-labelledby="activity-title">
        <div className="activity-score" aria-label={`Confiance ${forecast.confidence} sur 100`}>{forecast.confidence}</div>
        <div><p className="eyebrow">Activité prévue</p><h2 id="activity-title">{forecast.expectedCovers} couverts attendus</h2><p>Référence {forecast.baselineCovers} · estimation précédente {forecast.previousCovers} · fourchette {forecast.lowerCovers}–{forecast.upperCovers}.</p></div>
        <Confidence score={forecast.confidence} />
      </section>
      <section className="kpi-grid" aria-label="Indicateurs du service">
        <article className="kpi"><span>Prévision croisée</span><strong>{forecast.expectedCovers}</strong><small>{forecast.lowerCovers} à {forecast.upperCovers}</small></article>
        <article className="kpi"><span>CA fictif</span><strong>{forecast.expectedRevenue?.toLocaleString("fr-FR")} €</strong><small>Non observé</small></article>
        <article className="kpi attention"><span>Écart récent</span><strong>{forecast.expectedCovers - (forecast.previousCovers ?? forecast.expectedCovers) > 0 ? "+" : ""}{forecast.expectedCovers - (forecast.previousCovers ?? forecast.expectedCovers)}</strong><small>couverts depuis le dernier point</small></article>
      </section>
      <section className="signal-grid" aria-label="Paramètres croisés">{scenario.signals.map((signal) => <article className="signal-card" key={signal.id}><span>{signal.label}</span><strong>{signal.previous} → {signal.current}</strong><p>{signal.explanation}</p><footer><small>{signal.impactCovers !== null ? `${signal.impactCovers > 0 ? "+" : ""}${signal.impactCovers} couverts` : "Contrainte opérationnelle"}</small><small>{signal.updatedAt}</small></footer></article>)}</section>
      <div className="cockpit-grid">
        <section className="panel" aria-labelledby="week-title"><div className="panel-heading"><div><p className="eyebrow">Horizon</p><h2 id="week-title">Dîners à sept jours</h2></div><span>Projection du scénario actif</span></div><div className="bars" role="img" aria-label="Prévisions fictives à sept jours">{week.map((value, index) => <div className="bar-column" key={days[index]}><span className="bar-value">{value}</span><span className="bar" style={{ height: `${value / 1.5}px` }} /><span>{days[index]}</span></div>)}</div></section>
        <section className="decision-panel" aria-labelledby="decisions-title"><p className="eyebrow light">Fenêtres d’action</p><h2 id="decisions-title">{scenario.recommendations.length} priorités maximum</h2>{scenario.recommendations.map((item) => { const decision = scenarioDecisions.find((entry) => entry.recommendationId === item.id); return <article className="decision-card" key={item.id}><span>{recommendationLabels[item.type]}</span><strong>{item.title}</strong><small>{decision ? `Décision ${decision.status}` : `avant ${item.deadline}`}</small></article>; })}<Link className="button amber" href="/briefing">Décider dans le briefing</Link></section>
      </div>
    </>}
  </>;
}
