import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DemoProvider } from "@/demo/demo-context";
import { demoScenarios } from "@/demo/scenarios";
import BriefingPage from "./briefing/page";
import DiagnosticPage from "./diagnostic/page";
import MultisitesPage from "./multisites/page";
import Home from "./page";
import ValeurPage from "./valeur/page";
import ScenariosPage from "./scenarios/page";

const push = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));

function renderDemo(ui: React.ReactNode) {
  return render(<DemoProvider>{ui}</DemoProvider>);
}

afterEach(() => {
  cleanup();
  push.mockClear();
});

describe("Application de démonstration", () => {
  it("borne chaque monde à des paramètres et décisions réalistes", () => {
    for (const scenario of demoScenarios) {
      expect(scenario.signals.length).toBeGreaterThanOrEqual(3);
      expect(scenario.signals.length).toBeLessThanOrEqual(5);
      expect(scenario.recommendations.length).toBeLessThanOrEqual(3);
    }
  });

  it("affiche le cockpit et identifie le monde fictif actif", () => {
    renderDemo(<Home />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Vendredi 17 juillet");
    expect(screen.getByText(/République · Pic de demande/)).toBeInTheDocument();
    expect(screen.getByText(/données fictives scénarisées/i)).toBeInTheDocument();
    expect(screen.getByText(/4 paramètres croisés/i)).toBeInTheDocument();
  });

  it.each([
    [BriefingPage, "République doit replanifier maintenant"],
    [MultisitesPage, "Arbitrer sans déplacer le risque"],
    [ValeurPage, "La valeur évolue avec vos décisions"],
    [DiagnosticPage, "Pourquoi cette prévision ?"],
    [ScenariosPage, "Jouer les six scénarios"],
  ])("rend un écran métier cohérent", (Page, title) => {
    renderDemo(<Page />);
    expect(screen.getByRole("heading", { level: 1, name: title })).toBeInTheDocument();
  });

  it("ne présente les six scénarios que dans le laboratoire", () => {
    const diagnostic = renderDemo(<DiagnosticPage />);
    expect(diagnostic.queryByRole("heading", { name: "Semaine normale" })).not.toBeInTheDocument();
    diagnostic.unmount();

    renderDemo(<ScenariosPage />);
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(6);
    expect(screen.getByRole("heading", { name: "Données insuffisantes" })).toBeInTheDocument();
  });

  it("lance un scénario qui devient l'état global de l'application", async () => {
    renderDemo(<ScenariosPage />);
    const card = screen.getByRole("heading", { name: "Événement annulé" }).closest("article");
    expect(card).not.toBeNull();
    fireEvent.click(within(card!).getByRole("button", { name: "Explorer ce cas" }));
    fireEvent.click(screen.getByRole("button", { name: "Lancer dans l’app →" }));

    await waitFor(() => expect(screen.getByText("Retournement tardif")).toBeInTheDocument());
    expect(push).toHaveBeenCalledWith("/cockpit");
  });

  it("une décision met à jour le briefing et le registre local", () => {
    renderDemo(<BriefingPage />);
    const action = screen.getByRole("heading", { name: "Mettre en froid 2 fûts supplémentaires" }).closest("article");
    fireEvent.click(within(action!).getByRole("button", { name: "Valider" }));
    expect(within(action!).getByText("Validée")).toBeInTheDocument();
    expect(screen.getByText(/Registre mis à jour/i)).toBeInTheDocument();
  });
});
