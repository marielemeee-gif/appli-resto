import Link from "next/link";

const navigation = [
  ["Aujourd’hui", "/cockpit"],
  ["Scénarios", "/scenarios"],
  ["Briefing", "/briefing"],
  ["Établissements", "/multisites"],
  ["Valeur", "/roi"],
  ["Explications", "/diagnostic"],
];

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Aller au contenu
      </a>
      <header className="topbar">
        <Link className="brand" href="/cockpit" aria-label="Service, pilotage restaurants, accueil">
          <span className="brand-mark" aria-hidden="true">S</span>
          <span className="brand-copy"><strong>Service</strong><small>Pilotage restaurants</small></span>
        </Link>
        <nav aria-label="Navigation principale">
          {navigation.map(([label, href]) => (
            <Link key={href} href={href}>{label}</Link>
          ))}
        </nav>
        <span className="demo-pill"><span aria-hidden="true">●</span> Données fictives</span>
      </header>
      <main id="main-content" className="app-main">{children}</main>
    </>
  );
}
