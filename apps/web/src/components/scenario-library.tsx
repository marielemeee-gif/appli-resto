"use client";

import { useEffect, useState } from "react";
import { demoScenarios, getDemoScenario, isDeadlineExpired } from "@/demo/scenarios";

export function ScenarioLibrary({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [previewId, setPreviewId] = useState(demoScenarios[0].id);
  const [localDecisions, setLocalDecisions] = useState<Record<string, "accepted" | "modified" | "refused">>({});
  const preview = getDemoScenario(previewId);

  function selectPreview(id: string) {
    setPreviewId(id);
    setLocalDecisions({});
  }

  useEffect(() => {
    if (!open) return;
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose, open]);

  if (!open) return null;

  return <div className="modal-backdrop" role="presentation">
    <section className="scenario-modal" role="dialog" aria-modal="true" aria-labelledby="scenario-modal-title">
      <header>
        <div><p className="eyebrow">Bibliothèque de démonstration</p><h2 id="scenario-modal-title">Explorer un exemple fictif</h2><p>Vous consultez un aperçu isolé. L’application, ses chiffres et vos décisions ne seront pas modifiés.</p></div>
        <button className="modal-close" type="button" onClick={onClose} aria-label="Fermer les exemples">×</button>
      </header>
      <div className="scenario-modal-body">
        <nav className="scenario-modal-list" aria-label="Exemples fictifs">
          {demoScenarios.map((scenario) => <button className={scenario.id === preview.id ? "active" : ""} type="button" key={scenario.id} onClick={() => selectPreview(scenario.id)}><span>{scenario.name}</span><small>{scenario.siteName} · {scenario.shortName}</small></button>)}
        </nav>
        <article className="scenario-preview">
          <span className="fiction-badge">Exemple fictif · aperçu seulement</span>
          <h3>{preview.name}</h3>
          <p>{preview.summary}</p>
          <dl>
            <div><dt>Situation</dt><dd>{preview.forecast.previousCovers ?? "Donnée non fiable"}{preview.forecast.previousCovers !== null ? " couverts" : ""}</dd></div>
            <div><dt>Signaux croisés</dt><dd>{preview.signals.length}</dd></div>
            <div><dt>Résultat</dt><dd>{preview.forecast.expectedCovers ?? "Abstention"}{preview.forecast.expectedCovers !== null ? " couverts" : ""}</dd></div>
          </dl>
          <strong>{preview.recommendations[0]?.title ?? preview.forecast.abstentionReason}</strong>
          <section className="scenario-simulation" aria-labelledby="scenario-simulation-title"><h4 id="scenario-simulation-title">Tester dans cette fenêtre</h4>{preview.forecast.expectedCovers === null ? <div className="simulation-abstain"><strong>Le moteur s’abstient</strong><p>{preview.forecast.abstentionReason}</p><small>Aucun nombre ni plan d’action précis n’est produit.</small></div> : <div className="simulation-actions">{preview.recommendations.map((recommendation) => { const status = localDecisions[recommendation.id]; const expired = isDeadlineExpired(preview.asOf, recommendation.deadline); return <article key={recommendation.id}><span>{expired ? `Fermée à ${recommendation.deadline}` : `Avant ${recommendation.deadline}`}</span><strong>{recommendation.title}</strong>{status ? <small>Simulation locale : {status === "accepted" ? "validée" : status === "modified" ? "modifiée" : "refusée"}</small> : expired ? <small>Échéance dépassée · action non exécutable</small> : <div><button type="button" onClick={() => setLocalDecisions((current) => ({ ...current, [recommendation.id]: "accepted" }))}>Valider</button><button type="button" onClick={() => setLocalDecisions((current) => ({ ...current, [recommendation.id]: "modified" }))}>Modifier</button><button type="button" onClick={() => setLocalDecisions((current) => ({ ...current, [recommendation.id]: "refused" }))}>Refuser</button></div>}</article>; })}</div>}</section>
          <p className="preview-note">Cet exemple n’est pas chargé dans le site. Fermez la fenêtre pour reprendre votre démonstration là où vous l’avez laissée.</p>
          <button className="button primary" type="button" onClick={onClose}>Fermer l’exemple</button>
        </article>
      </div>
    </section>
  </div>;
}
