"use client";

import { useEffect, useState } from "react";
import { getRoi, Roi } from "@/lib/api";
import { StateBanner } from "./ui";

const labels: Record<string, string> = { accepted: "Validée", modified: "Modifiée", refused: "Refusée" };

export function RoiClient() {
  const [roi, setRoi] = useState<Roi>();
  const [error, setError] = useState("");
  useEffect(() => { getRoi().then(setRoi).catch((value: Error) => setError(value.message)); }, []);
  if (error) return <StateBanner tone="danger" title="Registre indisponible">{error}</StateBanner>;
  if (!roi) return <StateBanner tone="info" title="Registre en chargement">Lecture des décisions fictives…</StateBanner>;
  return <><section className="kpi-grid four" aria-label="Indicateurs de valeur"><article className="kpi"><span>Gain estimé</span><strong>{(roi.estimated_gain_cents / 100).toLocaleString("fr-FR")} €</strong><small>Jamais observé</small></article><article className="kpi"><span>Décisions</span><strong>{roi.decisions_count}</strong><small>{roi.accepted_count} validées</small></article><article className="kpi"><span>Modifiées</span><strong>{roi.modified_count}</strong><small>Choix utilisateur</small></article><article className="kpi"><span>Refusées</span><strong>{roi.refused_count}</strong><small>Droit de refus</small></article></section><aside className="value-card"><p className="eyebrow light">Lecture prudente</p><h2>Estimé ≠ observé</h2><p>Le prototype ne calcule aucun gain réel. Le gain observé reste vide.</p></aside><section className="table-panel" aria-labelledby="table-title"><h2 id="table-title">Décisions enregistrées</h2>{roi.decisions.length === 0 ? <p>Aucune décision : utilisez le briefing ou la vue multi-sites.</p> : <div className="table-wrap"><table><thead><tr><th>Date</th><th>Type</th><th>Site</th><th>Statut</th><th>Gain estimé</th></tr></thead><tbody>{roi.decisions.map((item) => <tr key={item.id}><td>{new Date(item.decided_at).toLocaleString("fr-FR")}</td><td>{item.recommendation_type}</td><td>{item.site_id}</td><td>{labels[item.status]}</td><td>{item.estimated_gain_cents / 100} €</td></tr>)}</tbody></table></div>}</section></>;
}
