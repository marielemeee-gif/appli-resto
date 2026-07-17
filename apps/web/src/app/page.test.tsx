import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import BriefingPage from "./briefing/page";
import DiagnosticPage from "./diagnostic/page";
import MultisitesPage from "./multisites/page";
import Home from "./page";
import RoiPage from "./roi/page";

vi.mock("@/lib/api", () => ({
  getBriefing: vi.fn(() => new Promise(() => undefined)),
  getForecasts: vi.fn(() => new Promise(() => undefined)),
  getDispatch: vi.fn(() => new Promise(() => undefined)),
  getRoi: vi.fn(() => new Promise(() => undefined)),
  getBacktest: vi.fn(() => new Promise(() => undefined)),
  decide: vi.fn(),
}));

describe("Phase 5", () => {
  it("affiche le cockpit et identifie les données fictives", () => {
    render(<Home />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Vendredi 17 juillet",
    );
    expect(screen.getByText("Démo fictive")).toBeInTheDocument();
    expect(screen.getByText(/données 100 % fictives/i)).toBeInTheDocument();
    expect(screen.getByText(/calcul en cours/i)).toBeInTheDocument();
  });

  it.each([
    [BriefingPage, "Vendredi soir sera chargé"],
    [MultisitesPage, "Rééquilibrer avant le service"],
    [RoiPage, "La preuve du gain, sans promesse artificielle"],
    [DiagnosticPage, "Pourquoi cette prévision ?"],
  ])("rend un écran métier avec un titre unique", (Page, title) => {
    render(<Page />);

    expect(screen.getByRole("heading", { level: 1, name: title })).toBeInTheDocument();
  });
});
