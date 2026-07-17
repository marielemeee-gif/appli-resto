"use client";

import Link from "next/link";
import { useDemo } from "@/demo/demo-context";

const navigation = [
  ["Aujourd’hui", "/cockpit"],
  ["Scénarios", "/scenarios"],
  ["Briefing", "/briefing"],
  ["Établissements", "/multisites"],
  ["Valeur", "/roi"],
  ["Explications", "/diagnostic"],
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const { scenario, resetDemo, storageError } = useDemo();
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
        <div className="active-demo">
          <span><small>Mode démo</small><strong>{scenario.shortName}</strong></span>
          <Link href="/scenarios">Changer</Link>
          <button type="button" onClick={resetDemo}>Réinitialiser</button>
        </div>
      </header>
      <main id="main-content" className="app-main">
        {storageError && <div className="storage-warning" role="status">{storageError}</div>}
        {children}
        <p className="fixture-note">Mode démo autonome · données fictives scénarisées · aucun système réel connecté.</p>
      </main>
    </>
  );
}
