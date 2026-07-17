"use client";

import { useDemo } from "@/demo/demo-context";
import { Confidence, PageHeader } from "./ui";

export function DiagnosticClient() {
  const { scenario } = useDemo();
  const forecast = scenario.forecast;

  return <>
    <PageHeader eyebrow="Transparence du scénario actif" title="Pourquoi cette prévision ?" description={`${scenario.name} · séparation entre référence numérique, paramètres, règles et explication.`} site={scenario.siteName} />
    {forecast.expectedCovers === null ? <section className="diagnostic-abstain"><span aria-hidden="true">!</span><div><p className="eyebrow">Calcul suspendu</p><h2>Trois contrôles empêchent une prévision fiable</h2><p>{forecast.abstentionReason}</p><div className="quality-list">{scenario.signals.map((signal) => <article key={signal.id}><strong>{signal.label}</strong><span>{signal.current}</span><p>{signal.explanation}</p></article>)}</div></div></section> : <>
      <section className="forecast-story" aria-labelledby="forecast-story-title">
        <div className="forecast-summary"><p className="eyebrow light">{scenario.siteName} · {scenario.moment}</p><span className="forecast-kicker">Prévision du service</span><div className="forecast-number"><strong>{forecast.expectedCovers}</strong><span>couverts</span></div><p className="forecast-range">Fourchette probable <strong>{forecast.lowerCovers}–{forecast.upperCovers}</strong></p><Confidence score={forecast.confidence} /></div>
        <div className="forecast-explanation"><p className="eyebrow">Le calcul, sans boîte noire</p><h2 id="forecast-story-title">De {forecast.baselineCovers} à {forecast.expectedCovers} couverts</h2><p className="story-lede">La référence vient de services comparables. Les contributions ci-dessous sont les seuls paramètres utilisés pour l’estimation fictive à {scenario.asOf}.</p><ol className="reason-steps">{scenario.signals.map((signal, index) => <li key={signal.id}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{signal.label} · {signal.current}</strong><small>{signal.impactCovers === null ? "Contrainte, sans impact numérique direct" : `${signal.impactCovers > 0 ? "+" : ""}${signal.impactCovers} couverts`} · actualisé {signal.updatedAt}</small><p>{signal.explanation}</p></div></li>)}</ol></div>
      </section>
      <section className="counterfactual-grid" aria-label="Comparaison du calcul">
        <article><span>Référence historique</span><strong>{forecast.baselineCovers}</strong><p>Sans signaux du jour</p></article>
        <article><span>Dernier calcul</span><strong>{forecast.previousCovers}</strong><p>Avant le changement récent</p></article>
        <article className="muted"><span>Sans le signal principal</span><strong>{forecast.counterfactualCovers}</strong><p>Contrefactuel fictif</p></article>
        <article className="active"><span>Signaux croisés</span><strong>{forecast.expectedCovers}</strong><p>Estimation actuelle</p></article>
      </section>
      <div className="diagnostic-grid diagnostic-details"><section className="panel"><p className="eyebrow">Traçabilité</p><h2>{forecast.method}</h2><dl className="detail-list"><div><dt>Données arrêtées à</dt><dd>{scenario.asOf}</dd></div><div><dt>Signaux croisés</dt><dd>{scenario.signals.length}</dd></div><div><dt>Fourchette</dt><dd>{forecast.lowerCovers}–{forecast.upperCovers}</dd></div><div><dt>Confiance</dt><dd>{forecast.confidence} %</dd></div></dl></section><section className="rule-panel"><p className="eyebrow">Règles séparées du calcul</p><h2>{scenario.recommendations.length} décisions déterministes</h2>{scenario.recommendations.length ? <ul>{scenario.recommendations.map((item) => <li key={item.id}><strong>{item.title}</strong><span>avant {item.deadline}</span><small>{item.rule}</small></li>)}</ul> : <p>Aucune règle chiffrée ne s’exécute quand la qualité est insuffisante.</p>}</section></div>
    </>}
  </>;
}
