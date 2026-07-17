"use client";

import { useDemo } from "@/demo/demo-context";
import { PageHeader } from "./ui";

const labels = { accepted: "Validée", modified: "Modifiée", refused: "Refusée" };
const typeLabels: Record<string, string> = { staffing: "Équipe", preparation: "Préparation", purchase: "Achats", dispatch: "Transfert", quality: "Qualité", supplier_order: "Brouillon fournisseur", custom: "Décision libre" };

export function RoiClient() {
  const { scenario, decisions } = useDemo();
  const rows = decisions.filter((item) => item.scenarioId === scenario.id);
  const estimatedGain = rows.reduce((sum, item) => sum + item.estimatedGain, 0);
  const accepted = rows.filter((item) => item.status === "accepted").length;
  const modified = rows.filter((item) => item.status === "modified").length;
  const refused = rows.filter((item) => item.status === "refused").length;

  return <>
    <PageHeader eyebrow="Journal de la session" title="Décisions prises" description={`${scenario.siteName} · une trace opérationnelle, sans revendiquer de gain observé.`} site={scenario.siteName} />
    <section className="journal-summary" aria-label="Résumé du journal"><div><span>Décisions</span><strong>{rows.length}</strong><small>{accepted} validée{accepted > 1 ? "s" : ""} · {modified} modifiée{modified > 1 ? "s" : ""} · {refused} refusée{refused > 1 ? "s" : ""}</small></div><div><span>Gain estimé fictif</span><strong>{estimatedGain.toLocaleString("fr-FR")} €</strong><small>Gain observé : non disponible</small></div><p>Les montants viennent des règles de la démo. Les décisions libres et les brouillons fournisseur restent à 0 € lorsqu’aucune valeur n’est traçable.</p></section>
    <section className="table-panel" aria-labelledby="table-title"><h2 id="table-title">Historique</h2>{rows.length === 0 ? <p>Aucune décision prise pour le moment.</p> : <div className="table-wrap"><table><thead><tr><th>Date</th><th>Type</th><th>Décision</th><th>Responsable</th><th>Statut</th><th>Gain estimé</th></tr></thead><tbody>{rows.map((item) => <tr key={item.id}><td>{new Date(item.decidedAt).toLocaleString("fr-FR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}</td><td>{typeLabels[item.recommendationType] ?? item.recommendationType}</td><td>{item.title}{item.deadline ? <small className="table-deadline">avant {item.deadline}</small> : null}</td><td>{item.owner ?? item.site}</td><td>{labels[item.status]}</td><td>{item.estimatedGain} €</td></tr>)}</tbody></table></div>}</section>
  </>;
}
