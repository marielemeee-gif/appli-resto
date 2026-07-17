"use client";

import { useDemo } from "@/demo/demo-context";
import { Confidence, PageHeader, StateBanner } from "./ui";

const statusLabels = { accepted: "Validée", modified: "Modifiée", refused: "Refusée" };

export function BriefingClient() {
  const { scenario, decisions, decide } = useDemo();
  const forecast = scenario.forecast;
  const scenarioDecisions = decisions.filter((item) => item.scenarioId === scenario.id);

  return <>
    <PageHeader eyebrow={scenario.moment} title={forecast.expectedCovers === null ? "Décision suspendue : données à corriger" : `${scenario.siteName} doit replanifier maintenant`} description={scenario.question} site={scenario.siteName} />
    {forecast.expectedCovers === null ? (
      <section className="abstention-brief"><span aria-hidden="true">!</span><div><p className="eyebrow">Abstention contrôlée</p><h2>Aucun chiffre de secours</h2><p>{forecast.abstentionReason}</p><ul>{scenario.signals.map((signal) => <li key={signal.id}><strong>{signal.label}</strong> · {signal.current}</li>)}</ul></div></section>
    ) : <>
      <div className="briefing-layout">
        <section className="phone-card" aria-labelledby="brief-title">
          <div className="phone-top"><span>{scenario.siteName} · dîner</span><Confidence score={forecast.confidence} /></div>
          <div className="big-number">{forecast.expectedCovers}</div><p className="big-label">couverts prévus</p>
          <p className="range">Fourchette probable : {forecast.lowerCovers} à {forecast.upperCovers}</p>
          <div className="brief-block teal"><span>Ce qui va se passer</span><strong>{scenario.summary}</strong></div>
          <div className="brief-block blue"><span>Ce qui a changé</span><strong>{forecast.previousCovers} → {forecast.expectedCovers} couverts après {scenario.signals.length} signaux croisés</strong></div>
          <div className="brief-block amber-block"><span>Sans le principal signal</span><strong>{forecast.counterfactualCovers} couverts dans le contrefactuel</strong></div>
          <h2 id="brief-title" className="sr-only">Briefing du service</h2>
        </section>
        <section className="action-sheet" aria-labelledby="action-title">
          <p className="eyebrow">Actions encore possibles</p><h2 id="action-title">Décider avant qu’il ne soit trop tard</h2>
          <div className="action-stack">{scenario.recommendations.map((recommendation) => {
            const decision = scenarioDecisions.find((item) => item.recommendationId === recommendation.id);
            return <article className={`interactive-action${decision ? " decided" : ""}`} key={recommendation.id}>
              <header><span>avant {recommendation.deadline}</span><Confidence score={recommendation.confidence} /></header>
              <h3>{recommendation.title}</h3><p>{recommendation.detail}</p>
              <dl><div><dt>Gain estimé fictif</dt><dd>{recommendation.estimatedGain} €</dd></div><div><dt>Risque évité</dt><dd>{recommendation.estimatedRisk} €</dd></div></dl>
              <small className="rule-copy">Règle : {recommendation.rule}</small>
              {decision ? <div className="decision-result"><strong>{statusLabels[decision.status]}</strong><span>Registre mis à jour · aucun système réel appelé</span></div> : <div className="button-row"><button className="button primary" type="button" onClick={() => decide(recommendation.id, "accepted")}>Valider</button><button className="button secondary" type="button" onClick={() => decide(recommendation.id, "modified")}>Modifier</button><button className="button ghost" type="button" onClick={() => decide(recommendation.id, "refused")}>Refuser</button></div>}
            </article>;
          })}</div>
          {!scenario.recommendations.length && <StateBanner tone="warning" title="Aucune action proposée">Le moteur s’abstient.</StateBanner>}
        </section>
      </div>
    </>}
  </>;
}
