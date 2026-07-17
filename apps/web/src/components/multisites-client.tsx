"use client";

import Link from "next/link";
import { useDemo } from "@/demo/demo-context";
import { Confidence, PageHeader } from "./ui";

export function MultisitesClient() {
  const { scenario, decisions, decide } = useDemo();
  const proposal = scenario.dispatch;
  const decision = proposal ? decisions.find((item) => item.recommendationId === proposal.id) : undefined;
  const totalCovers = scenario.sites.reduce((sum, site) => sum + (site.expectedCovers ?? 0), 0);
  const sitesAtRisk = scenario.sites.filter((site) => site.requiredServers !== null && site.plannedServers < site.requiredServers);
  const availableServers = scenario.sites.reduce((sum, site) => site.requiredServers === null ? sum : sum + Math.max(0, site.plannedServers - site.requiredServers), 0);
  const localTarget = sitesAtRisk[0] ?? scenario.sites.find((site) => site.id === scenario.siteId);

  return <>
    <PageHeader eyebrow="Établissements · même monde fictif" title="Où agir dans le groupe" description={`${scenario.name} · trois établissements comparés au même instant ${scenario.asOf}.`} site="Groupe Bordeaux" />

    <section className="group-summary" aria-label="Synthèse du groupe">
      <article><span>Dîner prévu</span><strong>{totalCovers}</strong><small>couverts sur 3 sites</small></article>
      <article className={sitesAtRisk.length ? "attention" : ""}><span>Sous tension</span><strong>{sitesAtRisk.length}</strong><small>site{sitesAtRisk.length > 1 ? "s" : ""} en déficit d’équipe</small></article>
      <article><span>Marge disponible</span><strong>{availableServers}</strong><small>serveur{availableServers > 1 ? "s" : ""} mobilisable{availableServers > 1 ? "s" : ""}</small></article>
      <div><span>Lecture du jour</span><strong>{scenario.shortName}</strong><p>{scenario.differentiator}</p></div>
    </section>

    <section className="group-board" aria-labelledby="group-board-title">
      <header><div><p className="eyebrow">Comparaison opérationnelle</p><h2 id="group-board-title">Qui a besoin d’aide, qui peut aider ?</h2></div><small>planifié / requis</small></header>
      <small className="mobile-swipe-hint">Glissez pour comparer les 3 établissements <span aria-hidden="true">→</span></small>
      <div className="group-table" role="table" aria-label="Situation des trois établissements">
        <div className="group-table-head" role="row"><span>Établissement</span><span>Prévision</span><span>Équipe salle</span><span>Stock</span><span>Lecture</span></div>
        {scenario.sites.map((site) => {
      const gap = site.requiredServers === null ? null : site.plannedServers - site.requiredServers;
      const tone = gap === null ? "warning" : gap < 0 ? "danger" : gap > 0 ? "warning" : "success";
          const gapLabel = gap === null ? "À vérifier" : gap < 0 ? `Manque ${Math.abs(gap)}` : gap > 0 ? `+${gap} mobilisable` : "Équilibré";
          return <article className={`group-site-row ${tone}`} role="row" key={site.id}>
            <div><span className={`status-dot ${tone}`} /><strong>{site.name}</strong><small>{site.alert}</small></div>
            <div><span>Prévision</span><strong>{site.expectedCovers ?? "—"}</strong><small>{site.expectedCovers === null ? "suspendue" : "couverts"}</small></div>
            <div><span>Équipe salle</span><strong>{site.plannedServers} / {site.requiredServers ?? "—"}</strong><small className={tone}>{gapLabel}</small></div>
            <div><span>Stock</span><strong>{site.stockRisk}</strong></div>
            <div><span>Lecture</span><strong>{gap !== null && gap < 0 ? "Renfort à couvrir" : gap !== null && gap > 0 ? "Peut aider" : site.stockRisk === "Élevé" ? "Stock à sécuriser" : "Plan maintenu"}</strong></div>
          </article>;
        })}
      </div>
    </section>

    {proposal ? <section className="transfer-card" aria-labelledby="transfer-title">
      <div><p className="eyebrow light">Arbitrage proposé</p><h2 id="transfer-title">Transférer {proposal.quantity} serveur vers {proposal.target}</h2><div className="transfer-route"><span><small>{proposal.source}</small><strong>{proposal.sourceAfterTransfer + proposal.quantity} → {proposal.sourceAfterTransfer}</strong></span><i>{proposal.travelMinutes} min →</i><span><small>{proposal.target}</small><strong>{proposal.targetAfterTransfer - proposal.quantity} → {proposal.targetAfterTransfer}</strong></span></div><p>Aucun nouveau déficit n’est créé. Décision possible jusqu’à {proposal.deadline}.</p></div>
      <div className="transfer-meta"><strong>{proposal.estimatedGain} €</strong><span>gain estimé fictif</span><Confidence score={proposal.confidence} />{decision ? <div className="decision-result light"><strong>Transfert {decision.status}</strong><span>Le registre de la session est à jour.</span></div> : <button className="button amber" type="button" onClick={() => decide(proposal.id, "accepted")}>Simuler le transfert</button>}</div>
    </section> : <section className="group-outcome" aria-labelledby="group-outcome-title"><div><p className="eyebrow">Conclusion groupe</p><h2 id="group-outcome-title">Ne pas déplacer d’équipe aujourd’hui</h2><p>{availableServers === 0 ? "Les autres établissements sont exactement à leur besoin : déplacer un serveur créerait un second déficit." : "La marge disponible ne correspond pas au besoin ou à la plage horaire du site sous tension."}</p></div><div><strong>{localTarget?.name ?? scenario.siteName}</strong><span>{localTarget?.alert ?? "Plan local à confirmer"}</span><Link className="button primary" href="/briefing">Traiter le plan local</Link></div></section>}
  </>;
}
