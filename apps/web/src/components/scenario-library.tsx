"use client";

import { useEffect, useState } from "react";
import { demoScenarios, getDemoScenario } from "@/demo/scenarios";

export function ScenarioLibrary({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [previewId, setPreviewId] = useState(demoScenarios[0].id);
  const preview = getDemoScenario(previewId);

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
          {demoScenarios.map((scenario) => <button className={scenario.id === preview.id ? "active" : ""} type="button" key={scenario.id} onClick={() => setPreviewId(scenario.id)}><span>{scenario.name}</span><small>{scenario.siteName} · {scenario.shortName}</small></button>)}
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
          <p className="preview-note">Cet exemple n’est pas chargé dans le site. Fermez la fenêtre pour reprendre votre démonstration là où vous l’avez laissée.</p>
          <button className="button primary" type="button" onClick={onClose}>Fermer l’exemple</button>
        </article>
      </div>
    </section>
  </div>;
}
