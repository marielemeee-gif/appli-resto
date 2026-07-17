"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Briefing,
  Dispatch,
  ScenarioDefinition,
  getBriefing,
  getDispatch,
  getScenarios,
} from "@/lib/api";
import { Confidence, StateBanner } from "./ui";

type ScenarioResult = {
  scenario: ScenarioDefinition;
  briefing: Briefing;
  dispatch?: Dispatch;
  siteName: string;
};

const context: Record<string, { siteId: string; siteName: string; asOf: string; moment: string; lesson: string; question: string; illustratedAction: string }> = {
  baseline_normal: { siteId: "gare", siteName: "Gare", asOf: "2026-07-17T08:00:00+02:00", moment: "Briefing 08:00", lesson: "Comprendre la référence sans perturbation majeure.", question: "Dois-je changer quelque chose pour ce service ordinaire ?", illustratedAction: "Conserver le plan actuel et programmer le prochain contrôle." },
  concert_dry_friday: { siteId: "republique", siteName: "République", asOf: "2026-07-17T08:00:00+02:00", moment: "Briefing 08:00", lesson: "Mesurer l’effet cumulé des réservations, du concert et de la terrasse.", question: "Le concert justifie-t-il un renfort et plus de préparation ?", illustratedAction: "Renforcer les quantités prioritaires avant les heures limites." },
  event_cancelled: { siteId: "republique", siteName: "République", asOf: "2026-07-17T13:45:00+02:00", moment: "Alerte 13:45", lesson: "Voir comment une information tardive révise la demande à la baisse.", question: "Que puis-je encore réduire après l’annulation ?", illustratedAction: "Réduire la préparation ou la commande encore modifiable." },
  multisite_staff_imbalance: { siteId: "liberte", siteName: "Liberté", asOf: "2026-07-17T08:00:00+02:00", moment: "Vue groupe 08:00", lesson: "Comparer les besoins et proposer un renfort entre établissements.", question: "Puis-je renforcer Liberté sans fragiliser République ?", illustratedAction: "Transférer temporairement un serveur entre les deux sites." },
  bad_data_abstain: { siteId: "liberte", siteName: "Liberté", asOf: "2026-07-17T08:00:00+02:00", moment: "Contrôle 08:00", lesson: "Vérifier que le moteur préfère s’abstenir plutôt qu’inventer.", question: "Puis-je décider malgré les doublons et l’historique incomplet ?", illustratedAction: "Bloquer la recommandation précise et demander une correction des données." },
  roadworks_delivery_risk: { siteId: "gare", siteName: "Gare", asOf: "2026-07-17T08:00:00+02:00", moment: "Alerte accès 08:00", lesson: "Observer l’effet local des travaux et du risque de livraison.", question: "La livraison doit-elle être avancée avant la fermeture d’accès ?", illustratedAction: "Avancer la fenêtre de livraison ou prévoir une réception alternative." },
};

const methodLabels: Record<string, string> = {
  historical_baseline: "Référence historique",
  reservation_enriched: "Prévision enrichie",
  abstain: "Calcul suspendu",
};

const recommendationLabels: Record<string, string> = {
  staffing: "Équipe",
  preparation: "Préparation",
  purchase: "Achats",
};

const reasonLabels: Record<string, string> = {
  low_data_quality: "Qualité des données insuffisante",
  insufficient_history: "Historique insuffisant",
};

const translateReason = (reason: string) => reasonLabels[reason] ?? reason.replaceAll("_", " ");

export function ScenarioPlayer() {
  const [scenarios, setScenarios] = useState<ScenarioDefinition[]>([]);
  const [result, setResult] = useState<ScenarioResult>();
  const [playingId, setPlayingId] = useState<string>();
  const [error, setError] = useState("");

  useEffect(() => {
    getScenarios().then(setScenarios).catch((value: Error) => setError(value.message));
  }, []);

  async function play(scenario: ScenarioDefinition) {
    const scenarioContext = context[scenario.id];
    if (!scenarioContext) return;
    setPlayingId(scenario.id);
    setError("");
    try {
      const briefing = await getBriefing(scenario.id, scenarioContext.siteId, scenarioContext.asOf);
      const dispatch = scenario.id === "multisite_staff_imbalance" ? await getDispatch() : undefined;
      setResult({ scenario, briefing, dispatch, siteName: scenarioContext.siteName });
    } catch (value) {
      setError((value as Error).message);
    } finally {
      setPlayingId(undefined);
    }
  }

  if (error && scenarios.length === 0) {
    return <StateBanner tone="danger" title="Scénarios indisponibles">{error}</StateBanner>;
  }

  const forecast = result?.briefing.forecast;
  const dispatchProposal = result?.dispatch?.proposals[0];

  return (
    <>
      <section className="scenario-picker" aria-labelledby="picker-title">
        <div className="section-intro">
          <div><p className="eyebrow">Choisir</p><h2 id="picker-title">Un scénario, un calcul réel</h2></div>
          <p>Les six situations viennent de la configuration du prototype. Les résultats ci-dessous sont calculés par l’API fictive, pas écrits dans l’écran.</p>
        </div>
        {scenarios.length === 0 ? (
          <StateBanner tone="info" title="Catalogue en chargement">Lecture des six scénarios configurés…</StateBanner>
        ) : (
          <div className="play-grid">
            {scenarios.map((scenario, index) => {
              const scenarioContext = context[scenario.id];
              const isActive = result?.scenario.id === scenario.id;
              return (
                <article className={`play-card${isActive ? " active" : ""}`} key={scenario.id}>
                  <div className="play-card-top"><span>{String(index + 1).padStart(2, "0")}</span><small>{scenarioContext.siteName}</small></div>
                  <h3>{scenario.name}</h3>
                  <p>{scenario.description}</p>
                  <div className="play-question"><span>Question manager</span><p>{scenarioContext.question}</p></div>
                  <button className="button scenario-play-button" type="button" disabled={playingId !== undefined} onClick={() => play(scenario)}>
                    {playingId === scenario.id ? "Calcul en cours…" : isActive ? "Rejouer" : "Jouer ce scénario"}
                  </button>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {error && scenarios.length > 0 && <StateBanner tone="danger" title="Calcul interrompu">{error}</StateBanner>}

      {!result && scenarios.length > 0 && (
        <section className="scenario-empty" aria-label="Aucun scénario joué">
          <span aria-hidden="true">↳</span><div><h2>À vous de jouer</h2><p>Sélectionnez une carte pour voir ce qui change, ce que le moteur prévoit et l’action encore possible.</p></div>
        </section>
      )}

      {result && forecast && (
        <section className="scenario-result" aria-live="polite" aria-labelledby="result-title">
          <div className="result-heading">
            <div><p className="eyebrow light">Résultat simulé · {result.siteName}</p><h2 id="result-title">{result.scenario.name}</h2></div>
            {forecast.expected_covers !== null && <Confidence score={Math.round(forecast.confidence.score * 100)} />}
          </div>

          <div className="demo-story-strip">
            <div><span>Ce cas démontre · {context[result.scenario.id].moment}</span><p>{context[result.scenario.id].lesson}</p></div>
            <div><span>Question manager</span><p>{context[result.scenario.id].question}</p></div>
            <div className="illustrated-action"><span>Illustration fictive · non calculée</span><p>{context[result.scenario.id].illustratedAction}</p></div>
          </div>

          {forecast.expected_covers === null ? (
            <div className="result-abstention">
              <span aria-hidden="true">!</span><div><h3>Le moteur s’abstient</h3><p>Aucun nombre ni plan d’action précis n’est produit avec une donnée jugée insuffisante.</p><ul>{forecast.abstention_reasons.map((reason) => <li key={reason}>{translateReason(reason)}</li>)}</ul></div>
            </div>
          ) : (
            <>
              <div className="result-kpis">
                <div><span>Prévision</span><strong>{forecast.expected_covers}</strong><small>couverts</small></div>
                <div><span>Fourchette</span><strong>{forecast.lower_covers}–{forecast.upper_covers}</strong><small>probable</small></div>
                <div><span>Référence</span><strong>{forecast.baseline_covers}</strong><small>services comparables</small></div>
                <div><span>Méthode</span><strong className="result-method">{methodLabels[forecast.method]}</strong><small>{forecast.model_version}</small></div>
              </div>
              <div className="result-columns">
                <div><p className="eyebrow light">Ce qui explique le résultat</p><ul className="result-drivers">{forecast.drivers.map((driver) => <li key={driver.code}><span>{driver.impact_covers > 0 ? "+" : ""}{driver.impact_covers}</span><p>{driver.explanation}</p></li>)}</ul></div>
                <div><p className="eyebrow light">Actions proposées</p>{result.briefing.recommendations.length ? <ul className="result-actions">{result.briefing.recommendations.map((recommendation) => <li key={recommendation.id}><small>{recommendationLabels[recommendation.type] ?? recommendation.type}</small><strong>{recommendation.title.replace(/(\d)\.(\d)/g, "$1,$2")}</strong><span>avant {new Date(recommendation.deadline).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}</span></li>)}</ul> : <p>Aucune action précise n’est proposée pour ce résultat.</p>}</div>
              </div>
            </>
          )}

          {dispatchProposal && <aside className="result-dispatch"><span>Proposition groupe</span><strong>Transférer {dispatchProposal.quantity} serveur de République vers Liberté</strong><small>Trajet fictif {dispatchProposal.travel_minutes} min · gain estimé {dispatchProposal.estimated_gain_cents / 100} €</small></aside>}
          <div className="result-footer"><span>Graine 20260717 · données 100 % fictives</span>{result.scenario.id === "multisite_staff_imbalance" ? <Link href="/multisites">Voir la décision multi-sites →</Link> : <Link href="/diagnostic">Comprendre le calcul →</Link>}</div>
        </section>
      )}
    </>
  );
}
