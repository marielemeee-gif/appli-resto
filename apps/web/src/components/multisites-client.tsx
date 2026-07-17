"use client";

import { useEffect, useState } from "react";
import { Decision, Dispatch, decide, getDispatch } from "@/lib/api";
import { Confidence, StateBanner } from "./ui";

const names: Record<string, string> = { republique: "République", liberte: "Liberté", gare: "Gare" };

export function MultisitesClient() {
  const [data, setData] = useState<Dispatch>();
  const [decision, setDecision] = useState<Decision>();
  const [error, setError] = useState("");
  useEffect(() => { getDispatch().then(setData).catch((value: Error) => setError(value.message)); }, []);
  if (error) return <StateBanner tone="danger" title="Vue groupe indisponible">{error}</StateBanner>;
  if (!data) return <StateBanner tone="info" title="Rééquilibrage en cours">Calcul des écarts fictifs…</StateBanner>;
  const proposal = data.proposals[0];
  const validate = async () => { if (!proposal) return; try { setDecision(await decide(`/dispatch/${proposal.id}/decisions`, "accepted")); } catch (value) { setError((value as Error).message); } };
  return <>
    {decision && <StateBanner tone="info" title="Transfert fictif validé">La décision est enregistrée, sans modifier aucun planning réel.</StateBanner>}
    <section className="site-grid" aria-label="Écarts de personnel par établissement">{data.sites.map((site) => { const tone = site.server_gap < 0 ? "danger" : site.server_gap > 0 ? "warning" : "success"; return <article className="site-card" key={site.site_id}><div className="site-card-head"><span className={`status-dot ${tone}`} /><h2>{names[site.site_id]}</h2><strong className={tone}>{site.server_gap > 0 ? "+" : ""}{site.server_gap}</strong></div><p>{site.expected_covers} couverts prévus</p><dl><div><dt>Planifiés</dt><dd>{site.planned_servers} serveurs</dd></div><div><dt>Requis</dt><dd>{site.required_servers} serveurs</dd></div></dl></article>; })}</section>
    {proposal ? <section className="transfer-card" aria-labelledby="transfer-title"><div><p className="eyebrow light">Recommandation groupe</p><h2 id="transfer-title">Transférer {proposal.quantity} serveur de {names[proposal.source_site_id]} vers {names[proposal.target_site_id]}</h2><p>Trajet simulé de {proposal.travel_minutes} minutes · aucun sous-effectif créé à la source.</p></div><div className="transfer-meta"><strong>{proposal.estimated_gain_cents / 100} €</strong><span>gain estimé</span><Confidence score={Math.round(proposal.confidence * 100)} /><button className="button amber" type="button" onClick={validate}>Valider le transfert fictif</button></div></section> : <StateBanner tone="warning" title="Aucun transfert sûr">Les contraintes ne permettent aucune proposition.</StateBanner>}
  </>;
}
