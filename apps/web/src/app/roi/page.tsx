import { AppShell } from "@/components/app-shell";
import { RoiClient } from "@/components/roi-client";
import { PageHeader } from "@/components/ui";

export default function RoiPage() {
  return <AppShell><PageHeader eyebrow="Registre des décisions" title="La preuve du gain, sans promesse artificielle" description="Valeurs fictives issues du registre API local." /><RoiClient /></AppShell>;
}
