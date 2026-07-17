"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDemo } from "@/demo/demo-context";
import { demoScenarios, getDemoScenario } from "@/demo/scenarios";

export function ScenarioPlayer() {
  const router = useRouter();
  const { scenario: activeScenario, selectScenario } = useDemo();
  const [previewId, setPreviewId] = useState(activeScenario.id);
  const preview = getDemoScenario(previewId);

  function launch() {
    selectScenario(preview.id);
    router.push("/cockpit");
  }

  return (
    <>
      <section className="scenario-picker" aria-labelledby="picker-title">
        <div className="section-intro">
          <div><p className="eyebrow">Laboratoire unique</p><h2 id="picker-title">Choisir le monde à tester</h2></div>
          <p>Chaque scénario transforme toute l’application. Il reste actif quand vous passez du cockpit au briefing, au groupe, à la valeur et aux explications.</p>
        </div>
        <div className="play-grid">
          {demoScenarios.map((scenario, index) => (
            <article className={`play-card${preview.id === scenario.id ? " active" : ""}`} key={scenario.id}>
              <div className="play-card-top"><span>{String(index + 1).padStart(2, "0")}</span><small>{scenario.siteName}</small></div>
              <h3>{scenario.name}</h3>
              <p>{scenario.summary}</p>
              <div className="play-question"><span>Question manager</span><p>{scenario.question}</p></div>
              <button className="button scenario-play-button" type="button" onClick={() => setPreviewId(scenario.id)}>
                {preview.id === scenario.id ? "Aperçu ouvert" : "Explorer ce cas"}
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="scenario-launchpad" aria-labelledby="preview-title">
        <header>
          <div><p className="eyebrow light">Aperçu · {preview.moment}</p><h2 id="preview-title">{preview.name}</h2><p>{preview.differentiator}</p></div>
          <button className="button amber launch-button" type="button" onClick={launch}>Lancer dans l’app →</button>
        </header>
        <div className="launchpad-flow">
          <article><span>01 · Situation précédente</span><strong>{preview.forecast.previousCovers ?? "Donnée non fiable"}{preview.forecast.previousCovers !== null ? " couverts" : ""}</strong><p>Dernière estimation disponible avant les nouveaux signaux.</p></article>
          <article><span>02 · Paramètres croisés</span><strong>{preview.signals.length} signaux</strong><p>{preview.signals.map((signal) => signal.label).join(" · ")}</p></article>
          <article><span>03 · Nouvelle décision</span><strong>{preview.forecast.expectedCovers ?? "Abstention"}{preview.forecast.expectedCovers !== null ? " couverts" : ""}</strong><p>{preview.recommendations[0]?.title ?? preview.forecast.abstentionReason}</p></article>
        </div>
        <div className="launchpad-detail">
          <div><p className="eyebrow light">Ce que l’app va croiser</p><ul>{preview.signals.map((signal) => <li key={signal.id}><span>{signal.label}</span><strong>{signal.previous} → {signal.current}</strong></li>)}</ul></div>
          <div><p className="eyebrow light">Parcours conseillé</p><p className="journey-copy">{preview.journey}</p><small>Données fictives scénarisées · instantané {preview.asOf}</small></div>
        </div>
      </section>
    </>
  );
}
