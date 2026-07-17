"use client";

import { FormEvent, useState } from "react";
import { useDemo } from "@/demo/demo-context";
import { isDeadlineExpired } from "@/demo/scenarios";
import { Confidence, PageHeader, StateBanner } from "./ui";

const statusLabels = { accepted: "Validée", modified: "Modifiée", refused: "Refusée" };

export function BriefingClient() {
  const { scenario, decisions, decide, supplierStatus, prepareSupplierDraft, confirmSupplierDraft, addCustomDecision } = useDemo();
  const [customTitle, setCustomTitle] = useState("");
  const [customOwner, setCustomOwner] = useState("Responsable bar");
  const [customDeadline, setCustomDeadline] = useState("16:00");
  const [shareOpen, setShareOpen] = useState(false);
  const [pendingReview, setPendingReview] = useState<{ recommendationId: string; status: "modified" | "refused" } | null>(null);
  const [reviewNote, setReviewNote] = useState("");
  const forecast = scenario.forecast;
  const scenarioDecisions = decisions.filter((item) => item.scenarioId === scenario.id);
  const decisionsToday = scenarioDecisions.filter((item) => item.decidedAt.startsWith("2026-07-17"));
  const workflow = scenario.supplierWorkflow;
  const workflowTotal = workflow?.items.reduce((sum, item) => sum + item.requestedQuantity * item.unitPrice, 0) ?? 0;
  const decisionLines = decisionsToday.map((item) => `- ${item.title}${item.owner ? ` · ${item.owner}` : ""}${item.deadline ? ` · avant ${item.deadline}` : ""}${item.note ? ` · ${item.note}` : ""}`);
  const shareMessage = [`Briefing fictif · ${scenario.siteName} · dîner du 17 juillet`, `${forecast.expectedCovers ?? "Prévision suspendue"}${forecast.expectedCovers !== null ? ` couverts prévus (${forecast.lowerCovers}–${forecast.upperCovers})` : ""}`, "", "Décisions retenues", ...decisionLines, "", "Message préparé dans Prototype App."].join("\n");
  const encodedMessage = encodeURIComponent(shareMessage);

  function addDecision(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    addCustomDecision(customTitle, customOwner, customDeadline);
    setCustomTitle("");
  }

  function submitReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!pendingReview || !reviewNote.trim()) return;
    decide(pendingReview.recommendationId, pendingReview.status, reviewNote);
    setPendingReview(null);
    setReviewNote("");
  }

  return <>
    <PageHeader eyebrow="Décisions du service" title={forecast.expectedCovers === null ? "Corriger les données avant d’agir" : `${scenario.recommendations.length} décisions avant le dîner`} description={`${scenario.siteName} · ici, on arbitre et on transmet. Le détail du calcul reste dans le Tableau de bord.`} site={scenario.siteName} />

    <details className="systems-details">
      <summary><span><strong>Sources actualisées · {scenario.systems.filter((system) => system.status === "fresh").length}/{scenario.systems.length}</strong><small>Preuves fictives et heures de synchronisation</small></span><em>Voir le détail</em></summary>
      <div className="systems-evidence" aria-label="Systèmes tiers interrogés">{scenario.systems.map((system) => <article key={system.id}><i className={`system-status ${system.status}`} aria-hidden="true" /><span>{system.name}</span><strong>{system.evidence}</strong><small>{system.lastSync}</small></article>)}</div>
    </details>

    {forecast.expectedCovers === null ? <section className="abstention-brief"><span aria-hidden="true">!</span><div><p className="eyebrow">Abstention contrôlée</p><h2>Aucune décision chiffrée</h2><p>{forecast.abstentionReason}</p><ul>{scenario.signals.map((signal) => <li key={signal.id}><strong>{signal.label}</strong> · {signal.current}</li>)}</ul></div></section> : <>
      <section className="decision-overview" aria-labelledby="staffing-title">
        <div className="decision-overview-main"><span>Service prévu</span><strong>{forecast.expectedCovers} couverts</strong><small>fourchette {forecast.lowerCovers}–{forecast.upperCovers}</small><Confidence score={forecast.confidence} /></div>
        <div className="decision-overview-deadline"><span>Première limite</span><strong>{scenario.recommendations[0]?.deadline}</strong><small>{scenario.recommendations[0]?.title}</small></div>
        <div className="staffing-compact"><div><span>Planifié / requis</span><h2 id="staffing-title">Équipe du service</h2></div>{scenario.staffing.map((item) => { const gap = item.planned === null || item.required === null ? null : item.planned - item.required; return <article className={gap !== null && gap < 0 ? "shortage" : ""} key={item.role}><span>{item.role}</span><strong>{item.planned ?? "—"} / {item.required ?? "—"}</strong><small>{gap !== null && gap < 0 ? `manque ${Math.abs(gap)}` : "couvert"}</small></article>; })}</div>
      </section>

      <section className="action-sheet decision-worklist" aria-labelledby="action-title">
        <div><p className="eyebrow">Plan du service</p><h2 id="action-title">Décider avant les échéances</h2></div>
        <div className={`action-stack count-${scenario.recommendations.length}`}>{scenario.recommendations.map((recommendation, index) => {
          const decision = scenarioDecisions.find((item) => item.recommendationId === recommendation.id);
          const expired = isDeadlineExpired(scenario.asOf, recommendation.deadline);
          const isPending = pendingReview?.recommendationId === recommendation.id;
          return <article className="interactive-action" key={recommendation.id}>
            <header><span>{expired ? `priorité ${index + 1} · fermée à ${recommendation.deadline}` : `priorité ${index + 1} · avant ${recommendation.deadline}`}</span><Confidence score={recommendation.confidence} /></header>
            <h3>{recommendation.title}</h3><p>{recommendation.detail}</p>
            <dl><div><dt>Gain estimé fictif</dt><dd>{recommendation.estimatedGain} €</dd></div><div><dt>Risque évité</dt><dd>{recommendation.estimatedRisk} €</dd></div></dl>
            {decision ? <div className="decision-result"><strong>{statusLabels[decision.status]}</strong><span>{decision.note ?? "Ajoutée au Journal."}</span></div> : expired ? <div className="expired-action"><strong>Action non exécutable</strong><span>L’instantané {scenario.asOf} est postérieur à l’heure limite.</span></div> : <><div className="button-row"><button className="button primary" type="button" onClick={() => decide(recommendation.id, "accepted")}>Valider</button><button className="button ghost" type="button" onClick={() => { setPendingReview({ recommendationId: recommendation.id, status: "modified" }); setReviewNote(""); }}>Modifier</button><button className="button ghost" type="button" onClick={() => { setPendingReview({ recommendationId: recommendation.id, status: "refused" }); setReviewNote(""); }}>Refuser</button></div>{isPending && pendingReview && <form className="review-note" onSubmit={submitReview}><label>{pendingReview.status === "modified" ? "Décrivez la modification" : "Motif du refus"}<textarea required value={reviewNote} onChange={(event) => setReviewNote(event.target.value)} placeholder={pendingReview.status === "modified" ? "Ex. réduire le lot à 16 portions" : "Ex. stock déjà reçu ce matin"} /></label><div className="button-row"><button className="button primary" type="submit">Enregistrer</button><button className="button ghost" type="button" onClick={() => setPendingReview(null)}>Annuler</button></div></form>}</>}
          </article>;
        })}</div>
        {!scenario.recommendations.length && <StateBanner tone="warning" title="Aucune action proposée">Le moteur s’abstient.</StateBanner>}
      </section>

      <details className="secondary-tools">
        <summary><span><strong>Consigne terrain et transmission</strong><small>Ajouter une décision libre ou préparer le briefing SMS / WhatsApp</small></span><em>Ouvrir les outils</em></summary>
        <div className="decision-tools">
          <form className="custom-decision" onSubmit={addDecision}>
            <p className="eyebrow">Décision terrain</p><h2>Ajouter une action</h2><p>Pour une consigne utile qui ne vient pas du moteur.</p>
            <label>Action<input required value={customTitle} onChange={(event) => setCustomTitle(event.target.value)} placeholder="Ex. Préparer le comptoir extérieur" /></label>
            <div><label>Responsable<input required value={customOwner} onChange={(event) => setCustomOwner(event.target.value)} /></label><label>Avant<input required type="time" value={customDeadline} onChange={(event) => setCustomDeadline(event.target.value)} /></label></div>
            <button className="button primary" type="submit">Ajouter au plan</button>
          </form>
          <section className="share-briefing" aria-labelledby="share-title">
            <p className="eyebrow light">Transmission</p><h2 id="share-title">Envoyer le briefing au terrain</h2><p>{decisionsToday.length ? `${decisionsToday.length} décision${decisionsToday.length > 1 ? "s" : ""} prête${decisionsToday.length > 1 ? "s" : ""} à partager.` : "Validez ou ajoutez au moins une décision avant de préparer le message."}</p>
            <button className="button amber" type="button" disabled={!decisionsToday.length} onClick={() => setShareOpen(true)}>Préparer le message</button>
            <small>Le contact et l’envoi sont confirmés dans SMS ou WhatsApp. Rien ne part automatiquement.</small>
          </section>
        </div>
      </details>

      {workflow && <details className="supplier-workflow">
        <summary><div><p className="eyebrow">Fournisseur fictif · avant {workflow.cutoff}</p><h2 id="supplier-title">Commande bar prête à vérifier</h2><p>{workflow.items.length} références · livraison {workflow.deliverySlot}</p></div><div><strong>{workflowTotal} €</strong><small>Voir le brouillon</small></div></summary>
        <div className="supplier-items">{workflow.items.map((item) => <article key={item.sku}><div><span>{item.sku}</span><strong>{item.name}</strong><small>{item.packaging} · {item.availableQuantity} disponibles</small></div><div><strong>{item.requestedQuantity} × {item.unitPrice} €</strong><span>{item.requestedQuantity * item.unitPrice} €</span></div></article>)}</div>
        <footer><p>{supplierStatus === "recommended" ? "Le catalogue est vérifié. Aucun brouillon n’existe encore." : supplierStatus === "drafted" ? "Brouillon créé dans la démo. Une confirmation humaine reste obligatoire." : "Confirmation fictive enregistrée dans le Journal. Rien n’a été transmis au fournisseur."}</p>{supplierStatus === "recommended" && <button className="button primary" type="button" onClick={prepareSupplierDraft}>Préparer le brouillon</button>}{supplierStatus === "drafted" && <button className="button secondary" type="button" onClick={confirmSupplierDraft}>Confirmer dans la démo</button>}{supplierStatus === "confirmed_demo" && <span className="workflow-complete">✓ Confirmé fictivement</span>}</footer>
      </details>}
    </>}

    {shareOpen && <div className="modal-backdrop" role="presentation"><section className="share-modal" role="dialog" aria-modal="true" aria-labelledby="share-modal-title"><header><div><p className="eyebrow">Message préparé</p><h2 id="share-modal-title">Choisir le canal</h2></div><button className="modal-close" type="button" onClick={() => setShareOpen(false)} aria-label="Fermer le partage">×</button></header><pre>{shareMessage}</pre><p>Aucun destinataire n’est prérempli et aucun envoi n’est automatique.</p><div className="button-row"><a className="button whatsapp" href={`https://wa.me/?text=${encodedMessage}`} target="_blank" rel="noreferrer">Ouvrir WhatsApp</a><a className="button primary" href={`sms:?&body=${encodedMessage}`}>Ouvrir SMS</a></div></section></div>}
  </>;
}
