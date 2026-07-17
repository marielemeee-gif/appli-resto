import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { getBriefing, getScenarios } from "@/lib/api";
import BriefingPage from "./briefing/page";
import DiagnosticPage from "./diagnostic/page";
import MultisitesPage from "./multisites/page";
import Home from "./page";
import RoiPage from "./roi/page";
import ScenariosPage from "./scenarios/page";

vi.mock("@/lib/api", () => ({
  getBriefing: vi.fn(() => new Promise(() => undefined)),
  getForecasts: vi.fn(() => new Promise(() => undefined)),
  getDispatch: vi.fn(() => new Promise(() => undefined)),
  getRoi: vi.fn(() => new Promise(() => undefined)),
  getBacktest: vi.fn(() => new Promise(() => undefined)),
  getScenarios: vi.fn(() => new Promise(() => undefined)),
  decide: vi.fn(),
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("Phase 5", () => {
  it("affiche le cockpit et identifie les données fictives", () => {
    render(<Home />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Vendredi 17 juillet",
    );
    expect(screen.getByText(/Données fictives/i)).toBeInTheDocument();
    expect(screen.getByText(/données 100 % fictives/i)).toBeInTheDocument();
    expect(screen.getByText(/calcul en cours/i)).toBeInTheDocument();
  });

  it.each([
    [BriefingPage, "Vendredi soir sera chargé"],
    [MultisitesPage, "Rééquilibrer avant le service"],
    [RoiPage, "La preuve du gain, sans promesse artificielle"],
    [DiagnosticPage, "Pourquoi cette prévision ?"],
    [ScenariosPage, "Jouer les six scénarios"],
  ])("rend un écran métier avec un titre unique", (Page, title) => {
    render(<Page />);

    expect(screen.getByRole("heading", { level: 1, name: title })).toBeInTheDocument();
  });

  it("présente les six scénarios comme des simulations", () => {
    const view = render(<DiagnosticPage />);

    expect(view.getByRole("heading", { name: "Six situations, toutes fictives" })).toBeInTheDocument();
    expect(view.getAllByText("Scénario simulé")).toHaveLength(6);
    expect(view.getByText("Données insuffisantes")).toBeInTheDocument();
  });

  it("rend les six scénarios jouables depuis le laboratoire", async () => {
    vi.mocked(getScenarios).mockResolvedValueOnce([
      { id: "baseline_normal", name: "Semaine normale", description: "Normal" },
      { id: "concert_dry_friday", name: "Concert et météo sèche", description: "Concert" },
      { id: "event_cancelled", name: "Événement annulé", description: "Annulation" },
      { id: "multisite_staff_imbalance", name: "Déséquilibre multi-sites", description: "Équipes" },
      { id: "bad_data_abstain", name: "Données insuffisantes", description: "Qualité" },
      { id: "roadworks_delivery_risk", name: "Travaux et livraison", description: "Travaux" },
    ]);

    const view = render(<ScenariosPage />);

    const buttons = await view.findAllByRole("button", { name: "Jouer ce scénario" });
    expect(buttons).toHaveLength(6);
    expect(view.getByRole("region", { name: "Aucun scénario joué" })).toBeInTheDocument();

    fireEvent.click(buttons[2]);
    await waitFor(() => expect(getBriefing).toHaveBeenCalledWith(
      "event_cancelled",
      "republique",
      "2026-07-17T13:45:00+02:00",
    ));
  });
});
