import { AppShell } from "@/components/app-shell";
import { ScenarioPlayer } from "@/components/scenario-player";
import { PageHeader } from "@/components/ui";

export default function ScenariosPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Laboratoire fictif"
        title="Jouer les six scénarios"
        description="Explorez un cas, puis lancez-le : tous les onglets représenteront le même monde fictif et réagiront à vos décisions."
        site="3 établissements fictifs"
      />
      <ScenarioPlayer />
    </AppShell>
  );
}
