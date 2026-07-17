"use client";

import { useDemo } from "@/demo/demo-context";
import { PageHeader } from "./ui";

const labels = { accepted: "Validée", modified: "Modifiée", refused: "Refusée" };
const typeLabels: Record<string, string> = { staffing: "Équipe", preparation: "Préparation", purchase: "Achats", dispatch: "Transfert", quality: "Qualité", supplier_order: "Brouillon fournisseur", custom: "Décision libre" };

export function RoiClient() {
  const { scenario, activeSite, decisions } = useDemo();
  const rows = decisions.filter((item) => item.scenarioId === scenario.id && (item.site === activeSite.name || item.site === "Groupe"));
  const estimatedGain = rows.reduce((sum, item) => sum + item.estimatedGain, 0);
  const accepted = rows.filter((item) => item.status === "accepted").length;
  const modified = rows.filter((item) => item.status === "modified").length;
  const refused = rows.filter((item) => item.status === "refused").length;

  return <>
    <PageHeader eyebrow="Journal mensuel" title="Décisions prises" description={`${activeSite.name} · distinguer ce qui était estimé de ce qui sera réellement observé.`} site={activeSite.name} />
    <section className="journal-summary" aria-label="Résumé du journal"><div><span>Période</span><strong>Juillet 2026</strong><small>mois fictif en cours</small></div><div><span>Décisions</span><strong>{rows.length}</strong><small>{accepted} validée{accepted > 1 ? "s" : ""} · {modified} modifiée{modified > 1 ? "s" : ""} · {refused} refusée{refused > 1 ? "s" : ""}</small></div><div><span>Gain estimé fictif</span><strong>{estimatedGain.toLocaleString("fr-FR")} €</strong><small>Somme des règles traçables</small></div><div><span>Gain observé</span><strong>—</strong><small>Non disponible dans la démo</small></div><p>Le prévu/réel sera calculé après le service depuis la caisse. Aucun résultat terrain n’est inventé ici.</p></section>
    <section className="table-panel" aria-labelledby="table-title"><h2 id="table-title">Historique · {activeSite.name}</h2>{rows.length === 0 ? <p>Aucune décision enregistrée pour {activeSite.name} dans cet instantané. Une consigne terrain peut être ajoutée depuis Décisions.</p> : <div className="table-wrap"><table><thead><tr><th>Date</th><th>Type</th><th>Décision</th><th>Responsable</th><th>Statut</th><th>Gain estimé</th></tr></thead><tbody>{rows.map((item) => <tr key={item.id}><td>{new Date(item.decidedAt).toLocaleString("fr-FR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}</td><td>{typeLabels[item.recommendationType] ?? item.recommendationType}</td><td>{item.title}{item.deadline ? <small className="table-deadline">avant {item.deadline}</small> : null}{item.note ? <small className="table-note">Motif : {item.note}</small> : null}</td><td>{item.owner ?? item.site}</td><td>{labels[item.status]}</td><td>{item.estimatedGain} €</td></tr>)}</tbody></table></div>}</section>
  </>;
}
