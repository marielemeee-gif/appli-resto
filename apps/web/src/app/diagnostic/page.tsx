import { AppShell } from "@/components/app-shell";
import { DiagnosticClient } from "@/components/diagnostic-client";
import { PageHeader } from "@/components/ui";

export default function DiagnosticPage() {
  return (
    <AppShell>
      <PageHeader eyebrow="Diagnostic" title="Pourquoi cette prévision ?" description="Méthode, fraîcheur, données manquantes et historique des calculs." />
      <DiagnosticClient />
      <section className="state-gallery" aria-labelledby="states-title"><h2 id="states-title">États prévus</h2>{["Chargement","Aucune donnée","Erreur de source","Confiance faible","Prévision indisponible"].map((state) => <div key={state}><span className="state-icon" aria-hidden="true">○</span><strong>{state}</strong><small>Message explicite et aucune donnée de secours silencieuse.</small></div>)}</section>
    </AppShell>
  );
}
