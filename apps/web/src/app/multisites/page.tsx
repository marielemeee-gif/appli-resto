import { AppShell } from "@/components/app-shell";
import { MultisitesClient } from "@/components/multisites-client";
import { PageHeader } from "@/components/ui";

export default function MultisitesPage() {
  return (
    <AppShell>
      <PageHeader eyebrow="Vue groupe" title="Rééquilibrer avant le service" description="Bordeaux centre · vendredi · fenêtre commune 18 h 30–21 h." />
      <MultisitesClient />
    </AppShell>
  );
}
