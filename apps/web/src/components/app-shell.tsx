import Link from "next/link";

const navigation = [
  ["Cockpit", "/cockpit"],
  ["Briefing", "/briefing"],
  ["Multi-sites", "/multisites"],
  ["Décisions & ROI", "/roi"],
  ["Diagnostic", "/diagnostic"],
];

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Aller au contenu
      </a>
      <header className="topbar">
        <Link className="brand" href="/cockpit" aria-label="Pilotage restaurants, accueil">
          <span className="brand-mark" aria-hidden="true">P</span>
          <span>Pilotage restaurants</span>
        </Link>
        <nav aria-label="Navigation principale">
          {navigation.map(([label, href]) => (
            <Link key={href} href={href}>{label}</Link>
          ))}
        </nav>
        <span className="demo-pill">Démo fictive</span>
      </header>
      <main id="main-content" className="app-main">{children}</main>
    </>
  );
}
