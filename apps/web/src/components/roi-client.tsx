"use client";

import Link from "next/link";
import { useDemo } from "@/demo/demo-context";
import { PageHeader } from "./ui";

const labels = { accepted: "Validée", modified: "Modifiée", refused: "Refusée" };
const typeLabels: Record<string, string> = { staffing: "Équipe", preparation: "Préparation", purchase: "Achats", dispatch: "Transfert", quality: "Qualité" };

export function RoiClient() {
  const { scenario, decisions } = useDemo();
  const rows = decisions.filter((item) => item.scenarioId === scenario.id);
  const estimatedGain = rows.reduce((sum, item) => sum + item.estimatedGain, 0);
  const accepted = rows.filter((item) => item.status === "accepted").length;
  const modified = rows.filter((item) => item.status === "modified").length;
  const refused = rows.filter((item) => item.status === "refused").length;

  return <>
    <PageHeader eyebrow="Registre de la session" title="La valeur évolue avec vos décisions" description={`${scenario.name} · estimations fictives traçables, gain observé volontairement absent.`} site={scenario.siteName} />
    <section className="kpi-grid four" aria-label="Indicateurs de valeur"><article className="kpi"><span>Gain estimé</span><strong>{estimatedGain.toLocaleString("fr-FR")} €</strong><small>Jamais observé</small></article><article className="kpi"><span>Décisions</span><strong>{rows.length}</strong><small>{accepted} validée{accepted > 1 ? "s" : ""}</small></article><article className="kpi"><span>Modifiées</span><strong>{modified}</strong><small>Arbitrage manager</small></article><article className="kpi"><span>Refusées</span><strong>{refused}</strong><small>Droit de refus</small></article></section>
    <div className="roi-grid">
      <aside className="value-card"><p className="eyebrow light">Lecture prudente</p><h2>Estimé ≠ observé</h2><p>Chaque montant vient de la règle affichée dans le briefing. Aucun gain terrain n’est revendiqué.</p><dl><div><dt>Gain observé</dt><dd>Non disponible</dd></div><div><dt>Source</dt><dd>Décisions de démonstration</dd></div></dl></aside>
      <section className="value-next"><p className="eyebrow">Rendre la démo vivante</p><h2>Testez une autre décision</h2><p>Validez, modifiez ou refusez une action : le registre se met à jour immédiatement et reste attaché au scénario actif.</p><Link className="button primary" href="/briefing">Retourner au briefing</Link></section>
    </div>
    <section className="table-panel" aria-labelledby="table-title"><h2 id="table-title">Décisions du scénario</h2>{rows.length === 0 ? <p>Aucune décision. Utilisez le briefing ou la vue groupe.</p> : <div className="table-wrap"><table><thead><tr><th>Date</th><th>Type</th><th>Décision</th><th>Site</th><th>Statut</th><th>Gain estimé</th></tr></thead><tbody>{rows.map((item) => <tr key={item.id}><td>{new Date(item.decidedAt).toLocaleString("fr-FR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}</td><td>{typeLabels[item.recommendationType] ?? item.recommendationType}</td><td>{item.title}</td><td>{item.site}</td><td>{labels[item.status]}</td><td>{item.estimatedGain} €</td></tr>)}</tbody></table></div>}</section>
  </>;
}
