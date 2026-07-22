"use client";

import { useState } from "react";
import { useDemo } from "@/demo/demo-context";
import { operationalImpact, preServiceFieldSignal, type FieldSignalMode } from "@/demo/operational-session";

export function FieldSignalPanel() {
  const { operationalStage, applyFieldSignal } = useDemo();
  const [mode, setMode] = useState<FieldSignalMode>("voice_transcript");
  const [confirmed, setConfirmed] = useState(false);

  if (operationalStage === "field_update_applied") {
    return <section className="field-signal applied" aria-labelledby="field-signal-title" aria-live="polite">
      <div className="field-signal-status"><span>✓</span><div><p className="eyebrow">Signal validé à 10:20</p><h2 id="field-signal-title">Le briefing a été recalculé</h2></div></div>
      <div className="field-impact" aria-label="Impact du signal terrain">
        <div><span>République</span><strong>{operationalImpact.previousCovers} → {operationalImpact.expectedCovers}</strong><small>couverts prévus</small></div>
        <div><span>Confiance</span><strong>{operationalImpact.previousConfidence} → {operationalImpact.expectedConfidence} %</strong><small>3 faits contrôlés</small></div>
        <div><span>Équipe</span><strong>{operationalImpact.staffingChanges.join(" · ")}</strong><small>besoin recalculé</small></div>
      </div>
    </section>;
  }

  return <section className="field-signal" aria-labelledby="field-signal-title">
    <div className="field-signal-intro">
      <div><p className="eyebrow">Nouveau · {preServiceFieldSignal.receivedAt}</p><h2 id="field-signal-title">Valider le retour du manager</h2><p>Ce signal fictif complète les données déjà synchronisées. Il ne modifie le plan qu’après contrôle humain.</p></div>
      <div className="signal-mode" role="group" aria-label="Format du signal">
        <button className={mode === "voice_transcript" ? "active" : ""} type="button" onClick={() => { setMode("voice_transcript"); setConfirmed(false); }}>Note vocale</button>
        <button className={mode === "form" ? "active" : ""} type="button" onClick={() => { setMode("form"); setConfirmed(false); }}>Formulaire</button>
      </div>
    </div>
    <div className="field-signal-content">
      <div className="signal-source"><span aria-hidden="true">{mode === "voice_transcript" ? "◖))" : "✓"}</span><div><strong>{mode === "voice_transcript" ? "Transcription proposée" : "Informations saisies"}</strong><p>{preServiceFieldSignal.transcript}</p><small>{preServiceFieldSignal.source}</small></div></div>
      <div className="signal-facts">{preServiceFieldSignal.facts.map((fact) => <div key={fact.label}><span>{fact.label}</span><strong>{fact.value}</strong></div>)}</div>
      <label className="signal-confirm"><input type="checkbox" checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} /><span>{mode === "voice_transcript" ? "Transcription relue et conforme" : "Informations contrôlées par le manager"}</span></label>
      <button className="button primary" type="button" disabled={!confirmed} onClick={() => applyFieldSignal(mode)}>Valider et actualiser le briefing</button>
    </div>
  </section>;
}
