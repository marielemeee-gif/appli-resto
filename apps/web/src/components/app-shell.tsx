"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { useDemo } from "@/demo/demo-context";
import { ScenarioLibrary } from "./scenario-library";

const navigation = [
  ["Tableau de bord", "/cockpit"],
  ["Décisions", "/briefing"],
  ["Établissements", "/multisites"],
  ["Journal", "/valeur"],
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const { scenario, resetDemo, storageError } = useDemo();
  const [examplesOpen, setExamplesOpen] = useState(false);
  const closeExamples = useCallback(() => setExamplesOpen(false), []);
  return (
    <>
      <a className="skip-link" href="#main-content">
        Aller au contenu
      </a>
      <header className="topbar">
        <Link className="brand" href="/cockpit" aria-label="Prototype App, pilotage restaurants, accueil">
          <span className="brand-mark" aria-hidden="true"><svg viewBox="0 0 32 32" role="img"><circle cx="16" cy="17" r="7" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M16 10v14M12 13c1.1-1 2.4-1.5 4-1.5s2.9.5 4 1.5M7 7v7M5 7v4c0 1.7.7 3 2 3s2-1.3 2-3V7M25 7v17M25 7c2.2 1.3 3 3.5 3 6h-3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
          <span className="brand-copy"><strong>Prototype App</strong><small>Pilotage restaurants</small></span>
        </Link>
        <a className="specs-link" href="/specs-prototype-app.pdf" target="_blank" rel="noreferrer">Specs PDF</a>
        <nav aria-label="Navigation principale">
          {navigation.map(([label, href]) => (
            <Link key={href} href={href}>{label}</Link>
          ))}
        </nav>
        <div className="active-demo">
          <span><small>Mode démo</small><strong>{scenario.shortName}</strong></span>
          <button type="button" onClick={() => setExamplesOpen(true)}>Cas fictifs</button>
          <button type="button" onClick={resetDemo}>Réinitialiser</button>
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
