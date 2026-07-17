export function PageHeader({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <header className="page-header">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      <div className="site-select" aria-label="Établissement actif">
        <span>Établissement</span>
        <strong>République</strong>
      </div>
    </header>
  );
}

export function Confidence({ score = 84 }: { score?: number }) {
  return (
    <span className="confidence" aria-label={`Confiance ${score} pour cent`}>
      <span aria-hidden="true">●</span> Confiance {score} %
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
