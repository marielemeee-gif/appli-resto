"use client";

import { useEffect, useState } from "react";
import { Briefing, Decision, decide, getBriefing } from "@/lib/api";
import { Confidence, StateBanner } from "./ui";

export function BriefingClient() {
  const [briefing, setBriefing] = useState<Briefing>();
  const [decision, setDecision] = useState<Decision>();
  const [error, setError] = useState("");
  useEffect(() => { getBriefing().then(setBriefing).catch((value: Error) => setError(value.message)); }, []);
  if (error) return <StateBanner tone="danger" title="Briefing indisponible">{error}</StateBanner>;
  if (!briefing) return <StateBanner tone="info" title="Briefing en cours">Calcul à partir des données fictives…</StateBanner>;
  const forecast = briefing.forecast;
  const recommendation = briefing.recommendations[0];
  const submit = async (status: Decision["status"]) => {
    if (!recommendation) return;
    setError("");
    try { setDecision(await decide(`/recommendations/${recommendation.id}/decisions`, status, status === "modified" ? { ...recommendation.action, quantity: 1 } : undefined)); }
    catch (value) { setError((value as Error).message); }
  };
  return <>
    {decision && <StateBanner tone="info" title="Décision fictive enregistrée">Statut : {decision.status}. Aucun système externe n’a été appelé.</StateBanner>}
    <div className="briefing-layout"><section className="phone-card" aria-labelledby="brief-title"><div className="phone-top"><span>République · dîner</span><Confidence score={Math.round(forecast.confidence.score * 100)} /></div><div className="big-number">{forecast.expected_covers ?? "—"}</div><p className="big-label">couverts prévus</p><p className="range">Fourchette probable : {forecast.lower_covers} à {forecast.upper_covers}</p><div className="brief-block teal"><span>Ce qui va se passer</span><strong>{forecast.drivers[0]?.explanation ?? "Aucun facteur dominant"}</strong></div><div className="brief-block blue"><span>Ce qui a changé</span><strong>{(forecast.expected_covers ?? 0) - (forecast.baseline_covers ?? 0)} couverts vs référence</strong></div><h2 id="brief-title" className="sr-only">Briefing du service</h2></section>
    <section className="action-sheet" aria-labelledby="action-title">{recommendation ? <><p className="eyebrow">Action prioritaire</p><h2 id="action-title">{recommendation.title}</h2><dl><div><dt>Heure limite</dt><dd>{new Date(recommendation.deadline).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}</dd></div><div><dt>Gain estimé</dt><dd>{recommendation.estimated_gain_cents / 100} €</dd></div><div><dt>Calcul</dt><dd>{recommendation.formula}</dd></div></dl><Confidence score={Math.round(recommendation.confidence * 100)} /><div className="button-row"><button className="button primary" type="button" onClick={() => submit("accepted")}>Valider</button><button className="button secondary" type="button" onClick={() => submit("modified")}>Modifier</button><button className="button ghost" type="button" onClick={() => submit("refused")}>Refuser</button></div></> : <StateBanner tone="warning" title="Aucune action proposée">Le moteur s’abstient ou l’heure limite est passée.</StateBanner>}<p className="helper">Chaque choix est simulé, traçable et révocable uniquement dans ce prototype.</p></section></div>
  </>;
}
