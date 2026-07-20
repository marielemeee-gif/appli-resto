"use client";

import { useDemo } from "@/demo/demo-context";
import { getDemoHorizon, getDemoSiteView, type DemoSite } from "@/demo/scenarios";
import { Confidence, PageHeader } from "./ui";
import { SiteTrend } from "./site-trend";

const sitePresentation: Record<DemoSite["id"], { tone: "teal" | "amber" | "coral"; kicker: string; icon: React.ReactNode }> = {
  republique: {
    tone: "coral",
    kicker: "Centre-ville · terrasse",
    icon: <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M6 16h20M9 16a7 7 0 0 1 14 0M16 7V4M8 10 6 8m18 2 2-2M10 21h12l-1 7H11Z" /></svg>,
  },
  liberte: {
    tone: "teal",
    kicker: "Quartier · afterwork",
    icon: <svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="12" cy="14" r="6" /><circle cx="21" cy="17" r="5" /><path d="M7 27c1-5 4-7 9-7s8 2 9 7" /></svg>,
  },
  gare: {
    tone: "amber",
    kicker: "Flux voyageurs · livraison",
    icon: <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M8 5h16v17H8zM11 9h10v6H11zM11 22l-3 5m13-5 3 5M11 19h.1M21 19h.1" /></svg>,
  },
};

export function GroupHome({ onOpenSite }: { onOpenSite: (siteId: DemoSite["id"]) => void }) {
  const { scenario, decisions, decide } = useDemo();
  const horizon = getDemoHorizon(scenario.sites);
  const siteViews = scenario.sites.map((site) => getDemoSiteView(scenario, site.id));
  const reliableViews = siteViews.filter((view) => view.forecast.expectedCovers !== null);
  const totalCovers = reliableViews.reduce((sum, view) => sum + (view.forecast.expectedCovers ?? 0), 0);
  const totalRevenue = reliableViews.reduce((sum, view) => sum + (view.forecast.expectedRevenue ?? 0), 0);
  const tenseSites = scenario.sites.filter((site) => site.requiredServers !== null && site.plannedServers < site.requiredServers);
  const priorities = siteViews.flatMap((view) => view.recommendations.slice(0, 1).map((recommendation) => ({ site: view.site, recommendation }))).slice(0, 3);
  const proposal = scenario.dispatch;
  const proposalDecision = proposal ? decisions.find((item) => item.recommendationId === proposal.id) : undefined;

  return <>
    <PageHeader eyebrow={`Accueil groupe · ${scenario.moment}`} title="Le groupe en un coup d’œil" description={`${scenario.name} · vendredi 17 juillet · dîner · données fictives arrêtées à ${scenario.asOf}.`} showSiteSelect={false} />

    <section className="group-hero" aria-labelledby="group-pulse-title">
      <div className="group-hero-lead">
        <span className="group-live"><i /> Situation du dîner</span>
        <h2 id="group-pulse-title">{tenseSites.length ? `${tenseSites.length} lieu sous tension, deux plans stables` : "Les trois lieux sont sous contrôle"}</h2>
        <p>{scenario.differentiator}</p>
      </div>
      <div className="group-metrics" aria-label="Chiffres consolidés du groupe">
        <article><span>Couverts prévus</span><strong>{totalCovers}</strong><small>{reliableViews.length}/3 lieux fiables</small></article>
        <article><span>CA fictif</span><strong>{totalRevenue.toLocaleString("fr-FR")} €</strong><small>médiane du dîner</small></article>
        <article className={tenseSites.length ? "attention" : ""}><span>À arbitrer</span><strong>{priorities.length}</strong><small>priorités avant service</small></article>
      </div>
      <div className="group-hero-mark" aria-hidden="true"><span>3</span><small>lieux<br />synchronisés</small></div>
    </section>

    <section className="site-overview-section" aria-labelledby="sites-overview-title">
      <div className="section-heading compact"><div><p className="eyebrow">Vue des établissements</p><h2 id="sites-overview-title">Où regarder en premier ?</h2></div><p>Chaque carte ouvre un détail local complet.</p></div>
      <div className="site-overview-grid">
        {siteViews.map((view) => {
          const presentation = sitePresentation[view.site.id];
          const forecast = view.forecast;
          const gap = view.site.requiredServers === null ? null : view.site.plannedServers - view.site.requiredServers;
          const primarySignal = view.signals.find((signal) => signal.category === "event") ?? view.signals[0];
          const primaryAction = view.recommendations[0];
          return <article className={`site-overview-card ${presentation.tone}`} key={view.site.id}>
            <header><div className="site-identity"><span className="site-illustration">{presentation.icon}</span><div><small>{presentation.kicker}</small><h3>{view.site.name}</h3></div></div><span className={`site-health ${forecast.expectedCovers === null ? "blocked" : gap !== null && gap < 0 ? "alert" : "stable"}`}>{forecast.expectedCovers === null ? "À fiabiliser" : gap !== null && gap < 0 ? "À renforcer" : "Plan stable"}</span></header>
            <div className="site-forecast-line"><div><strong>{forecast.expectedCovers ?? "—"}</strong><span>couverts</span></div>{forecast.expectedCovers !== null && <Confidence score={forecast.confidence} />}</div>
            <SiteTrend label={view.site.name} values={horizon[view.site.id].map((day) => day.dinner)} tone={presentation.tone} />
            <dl className="site-card-facts"><div><dt>CA fictif</dt><dd>{forecast.expectedRevenue?.toLocaleString("fr-FR") ?? "—"} €</dd></div><div><dt>Équipe salle</dt><dd>{view.site.plannedServers} / {view.site.requiredServers ?? "—"}</dd></div><div><dt>Stock</dt><dd>{view.site.stockRisk}</dd></div></dl>
            <div className="site-card-signal"><span>{primarySignal?.label ?? "Qualité des données"}</span><strong>{primarySignal?.current ?? forecast.abstentionReason}</strong></div>
            <div className="site-card-action"><div><span>{primaryAction ? `Avant ${primaryAction.deadline}` : "Action suspendue"}</span><strong>{primaryAction?.title ?? "Corriger les sources avant de décider"}</strong></div><button className="button site-open-button" type="button" onClick={() => onOpenSite(view.site.id)}>Voir le détail de {view.site.name}</button></div>
          </article>;
        })}
      </div>
    </section>

    {proposal ? <section className="group-arbitrage featured" aria-labelledby="group-arbitrage-title"><div><p className="eyebrow light">Arbitrage multi-sites</p><h2 id="group-arbitrage-title">{proposal.source} peut renforcer {proposal.target}</h2><p>{proposal.quantity} serveur · {proposal.travelMinutes} min de trajet · décision avant {proposal.deadline}. Aucun second déficit n’est créé.</p></div><div><strong>{proposal.estimatedGain} €</strong><span>gain estimé fictif</span>{proposalDecision ? <small>Transfert {proposalDecision.status} dans la session</small> : <button className="button amber" type="button" onClick={() => decide(proposal.id, "accepted")}>Simuler le transfert</button>}</div></section> : <section className="group-arbitrage" aria-labelledby="group-arbitrage-title"><div><p className="eyebrow">Arbitrage multi-sites</p><h2 id="group-arbitrage-title">Ne pas déplacer d’équipe aujourd’hui</h2><p>La marge disponible ne couvre pas un autre site sans créer un nouveau déficit. Les actions restent locales.</p></div><span className="calm-badge">Plan groupe cohérent</span></section>}
  </>;
}
