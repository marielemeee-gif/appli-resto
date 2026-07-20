"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useState } from "react";
import { useDemo } from "@/demo/demo-context";
import { ScenarioLibrary } from "./scenario-library";

const navigation = [
  { label: "Accueil", shortLabel: "Accueil", href: "/cockpit", icon: "home" },
  { label: "Décisions", shortLabel: "Décisions", href: "/briefing", icon: "check" },
  { label: "Journal", shortLabel: "Journal", href: "/valeur", icon: "journal" },
];

function NavIcon({ name }: { name: string }) {
  if (name === "home") return <svg viewBox="0 0 24 24"><path d="m4 10 8-6 8 6v9a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1Z" /></svg>;
  if (name === "check") return <svg viewBox="0 0 24 24"><path d="M5 12.5 9.2 17 19 7" /><path d="M19 12a7 7 0 1 1-4-6.3" /></svg>;
  return <svg viewBox="0 0 24 24"><path d="M6 4h12v16H6zM9 8h6M9 12h6M9 16h4" /></svg>;
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const { scenario, resetDemo, showGroup, storageError } = useDemo();
  const [examplesOpen, setExamplesOpen] = useState(false);
  const currentPath = usePathname()?.replace(/\/$/, "") || "/";
  const closeExamples = useCallback(() => setExamplesOpen(false), []);
  return (
    <>
      <a className="skip-link" href="#main-content">
        Aller au contenu
      </a>
      <header className="topbar">
        <Link className="brand" href="/cockpit" onClick={showGroup} aria-label="Prototype App, pilotage restaurants, accueil">
          <span className="brand-mark" aria-hidden="true"><svg viewBox="0 0 32 32" role="img"><circle cx="16" cy="17" r="7" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M16 10v14M12 13c1.1-1 2.4-1.5 4-1.5s2.9.5 4 1.5M7 7v7M5 7v4c0 1.7.7 3 2 3s2-1.3 2-3V7M25 7v17M25 7c2.2 1.3 3 3.5 3 6h-3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
          <span className="brand-copy"><strong>Prototype App</strong><small>Pilotage restaurants</small></span>
        </Link>
        <a className="specs-link" href="/specs-prototype-app.pdf" target="_blank" rel="noreferrer">Specs PDF</a>
        <nav aria-label="Navigation principale">
          {navigation.map(({ label, shortLabel, href, icon }) => (
            <Link key={href} href={href} onClick={href === "/cockpit" ? showGroup : undefined} aria-label={label} aria-current={currentPath === href ? "page" : undefined}>
              <span className="nav-icon" aria-hidden="true"><NavIcon name={icon} /></span>
              <span className="nav-label-desktop">{label}</span>
              <span className="nav-label-mobile" aria-hidden="true">{shortLabel}</span>
            </Link>
          ))}
        </nav>
        <div className="active-demo">
          <span><small>Mode démo</small><strong>{scenario.shortName}</strong></span>
          <button className="examples-button" type="button" onClick={() => setExamplesOpen(true)}>Cas fictifs</button>
          <button className="reset-button" type="button" onClick={resetDemo}>Réinitialiser</button>
        </div>
      </header>
      <main id="main-content" className="app-main">
        {storageError && <div className="storage-warning" role="status">{storageError}</div>}
        {children}
        <p className="fixture-note">Mode démo autonome · données fictives scénarisées · aucun système réel connecté.</p>
      </main>
      <ScenarioLibrary open={examplesOpen} onClose={closeExamples} />
    </>
  );
}
