"use client";

import { useDemo } from "@/demo/demo-context";

export function PageHeader({ eyebrow, title, description, showSiteSelect = true }: { eyebrow: string; title: string; description: string; site?: string; showSiteSelect?: boolean }) {
  const { scenario, activeSite, selectActiveSite } = useDemo();

  function changeSite(value: string) {
    const site = scenario.sites.find((item) => item.id === value);
    if (site) selectActiveSite(site.id);
  }

  return (
    <header className="page-header">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {showSiteSelect && <label className="site-select">
        <span>Vue active</span>
        <select aria-label="Établissement actif" value={activeSite.id} onChange={(event) => changeSite(event.target.value)}>
          {scenario.sites.map((site) => <option value={site.id} key={site.id}>{site.name}</option>)}
        </select>
      </label>}
    </header>
  );
}

export function Confidence({ score = 84 }: { score?: number }) {
  const label = score >= 75 ? "Élevée" : score >= 55 ? "Modérée" : "Faible";
  return (
    <span className="confidence" aria-label={`Confiance ${score} pour cent`}>
      <span aria-hidden="true">●</span> {label} · {score} %
    </span>
  );
}

export function StateBanner({ tone, title, children }: { tone: "warning" | "danger" | "info"; title: string; children: React.ReactNode }) {
  return (
    <aside className={`state-banner ${tone}`} role="status">
      <strong>{title}</strong>
      <span>{children}</span>
    </aside>
  );
}
