import { AppShell } from "@/components/app-shell";
import { DiagnosticClient } from "@/components/diagnostic-client";

export default function DiagnosticPage() {
  return (
    <AppShell>
      <DiagnosticClient />
    </AppShell>
  );
}
