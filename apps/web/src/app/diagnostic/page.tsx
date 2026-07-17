import { AppShell } from "@/components/app-shell";
import { DiagnosticClient } from "@/components/diagnostic-client";
import { PageHeader } from "@/components/ui";
import { ScenarioGallery } from "@/components/scenario-gallery";

export default function DiagnosticPage() {
  return (
    <AppShell>
      <PageHeader eyebrow="Transparence" title="Pourquoi cette prévision ?" description="De la référence historique aux signaux locaux : chaque étape du calcul reste lisible." site="République + Liberté" />
      <DiagnosticClient />
      <ScenarioGallery />
    </AppShell>
  );
}
