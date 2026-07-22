import { getServiceLoad, type OperationalStage } from "@/demo/operational-session";

export function ServiceLoadChart({ stage }: { stage: OperationalStage }) {
  const points = getServiceLoad(stage);
  const max = Math.max(...points.flatMap((point) => [point.demand, point.capacity]));
  const tensionCount = points.filter((point) => point.demand > point.capacity).length;

  return <figure className="service-load" aria-labelledby="service-load-title">
    <figcaption><div><p className="eyebrow">Charge du service · fictive</p><h2 id="service-load-title">Demande et capacité par heure</h2></div><span className={tensionCount ? "load-alert" : "load-stable"}>{tensionCount ? `${tensionCount} créneau${tensionCount > 1 ? "x" : ""} sous tension` : "Capacité suffisante"}</span></figcaption>
    <div className="load-legend"><span><i className="demand" /> Couverts attendus</span><span><i className="capacity" /> Capacité équipe</span></div>
    <div className="load-chart" role="img" aria-label={points.map((point) => `${point.hour}: ${point.demand} couverts attendus pour une capacité de ${point.capacity}`).join("; ")}>
      {points.map((point) => <div className={`load-column ${point.demand > point.capacity ? "over" : ""}`} key={point.hour}>
        <div className="load-bars"><span className="load-bar demand" style={{ height: `${(point.demand / max) * 100}%` }}><b>{point.demand}</b></span><span className="load-bar capacity" style={{ height: `${(point.capacity / max) * 100}%` }}><b>{point.capacity}</b></span></div>
        <strong>{point.hour}</strong>
      </div>)}
    </div>
    <p>{stage === "field_update_applied" ? "Le groupe de 22 crée un pic à 19–20 h : le renfort salle devient actionnable avant 16:00." : "Le plan initial couvre la demande connue. Le retour terrain peut encore déplacer le pic."}</p>
  </figure>;
}
