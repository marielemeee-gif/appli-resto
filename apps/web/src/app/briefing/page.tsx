import { AppShell } from "@/components/app-shell";
import { BriefingClient } from "@/components/briefing-client";
import { PageHeader } from "@/components/ui";

export default function BriefingPage() {
  return (
    <AppShell>
      <PageHeader eyebrow="Briefing · 09:00" title="Vendredi soir sera chargé" description="Une lecture courte de ce qui change et des actions encore possibles." />
      <BriefingClient />
    </AppShell>
  );
}
