"use client";

import { useDemo } from "@/demo/demo-context";
import { Confidence, PageHeader, StateBanner } from "./ui";

export function MultisitesClient() {
  const { scenario, decisions, decide } = useDemo();
  const proposal = scenario.dispatch;
  const decision = proposal ? decisions.find((item) => item.recommendationId === proposal.id) : undefined;

  return <>
    <PageHeader eyebrow="Vue groupe · même monde fictif" title="Arbitrer sans déplacer le risque" description={`${scenario.name} · comparaison des trois établissements au même instant ${scenario.asOf}.`} site="Groupe Bordeaux" />
    <section className="group-context"><span>Signal actif</span><strong>{scenario.shortName}</strong><p>{scenario.differentiator}</p></section>
    <section className="site-grid" aria-label="Situation des établissements">{scenario.sites.map((site) => {
      const gap = site.requiredServers === null ? null : site.plannedServers - site.requiredServers;
      const tone = gap === null ? "warning" : gap < 0 ? "danger" : gap > 0 ? "warning" : "success";
      return <article className="site-card" key={site.id}><div className="site-card-head"><span className={`status-dot ${tone}`} /><h2>{site.name}</h2><strong className={tone}>{gap === null ? "?" : `${gap > 0 ? "+" : ""}${gap}`}</strong></div><p>{site.expectedCovers ?? "Prévision suspendue"}{site.expectedCovers !== null ? " couverts prévus" : ""}</p><dl><div><dt>Planifiés</dt><dd>{site.plannedServers} serveurs</dd></div><div><dt>Requis</dt><dd>{site.requiredServers ?? "—"}</dd></div><div><dt>Stock</dt><dd>{site.stockRisk}</dd></div><div><dt>Situation</dt><dd>{site.alert}</dd></div></dl></article>;
    })}</section>
    {proposal ? <section className="transfer-card" aria-labelledby="transfer-title"><div><p className="eyebrow light">Simulation avant / après</p><h2 id="transfer-title">Transférer {proposal.quantity} serveur de {proposal.source} vers {proposal.target}</h2><p>Trajet {proposal.travelMinutes} min · après transfert : {proposal.source} {proposal.sourceAfterTransfer}/7, {proposal.target} {proposal.targetAfterTransfer}/6. Aucun nouveau déficit n’est créé.</p></div><div className="transfer-meta"><strong>{proposal.estimatedGain} €</strong><span>gain estimé fictif</span><Confidence score={proposal.confidence} />{decision ? <div className="decision-result light"><strong>Transfert {decision.status}</strong><span>Le registre de la session est à jour.</span></div> : <button className="button amber" type="button" onClick={() => decide(proposal.id, "accepted")}>Simuler le transfert avant {proposal.deadline}</button>}</div></section> : <StateBanner tone="info" title="Aucun transfert utile dans ce scénario">La vue groupe reste synchronisée, mais aucun déplacement ne réduit le risque sans fragiliser un autre site.</StateBanner>}
  </>;
}
