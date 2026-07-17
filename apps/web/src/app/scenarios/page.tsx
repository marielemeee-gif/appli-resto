import { AppShell } from "@/components/app-shell";
import { ScenarioPlayer } from "@/components/scenario-player";
import { PageHeader } from "@/components/ui";

export default function ScenariosPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Laboratoire fictif"
        title="Jouer les six scénarios"
        description="Choisissez une situation : l’API recalcule la prévision, la fourchette et les actions proposées avec la même graine reproductible."
        site="3 établissements fictifs"
      />
      <ScenarioPlayer />
    </AppShell>
  );
}
