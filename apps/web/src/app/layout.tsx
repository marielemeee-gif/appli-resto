import type { Metadata } from "next";
import "@fontsource-variable/manrope";
import { DemoProvider } from "@/demo/demo-context";
import "./globals.css";

export const metadata: Metadata = {
  title: "Prototype App · Pilotage restaurants",
  description: "Prototype local d'aide à la décision pour restaurants.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" data-scroll-behavior="smooth">
      <body><DemoProvider>{children}</DemoProvider></body>
    </html>
  );
}
