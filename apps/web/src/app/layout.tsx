import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pilotage prédictif des restaurants",
  description: "Prototype local d'aide à la décision pour restaurants.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
