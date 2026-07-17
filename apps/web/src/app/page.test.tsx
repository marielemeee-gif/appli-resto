import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { DemoProvider } from "@/demo/demo-context";
import { demoScenarios } from "@/demo/scenarios";
import { BriefingClient } from "@/components/briefing-client";
import { RoiClient } from "@/components/roi-client";
import BriefingPage from "./briefing/page";
import MultisitesPage from "./multisites/page";
import Home from "./page";
import ValeurPage from "./valeur/page";

function renderDemo(ui: React.ReactNode) {
  return render(<DemoProvider>{ui}</DemoProvider>);
}

afterEach(cleanup);

describe("Application de démonstration", () => {
  it("borne chaque monde à des paramètres et décisions réalistes", () => {
    for (const scenario of demoScenarios) {
      expect(scenario.signals.length).toBeGreaterThanOrEqual(3);
      expect(scenario.signals.length).toBeLessThanOrEqual(5);
      expect(scenario.recommendations.length).toBeLessThanOrEqual(3);
      expect(scenario.staffing.map((item) => item.role)).toEqual(["Salle", "Cuisine", "Bar"]);
      expect(scenario.watch).toHaveLength(4);
    }
    expect(demoScenarios.find((scenario) => scenario.id === "bad_data_abstain")?.supplierWorkflow).toBeUndefined();
  });

  it("présente quatre destinations opérationnelles distinctes", () => {
    renderDemo(<Home />);
    expect(screen.getByRole("heading", { level: 1, name: "Pilotage du jour" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Prototype App, pilotage restaurants, accueil" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Specs PDF" })).toHaveAttribute("href", "/specs-prototype-app.pdf");
    expect(screen.getByRole("button", { name: "Cas fictifs" })).toHaveClass("examples-button");
    const navigation = screen.getByRole("navigation", { name: "Navigation principale" });
    expect(within(navigation).getAllByRole("link")).toHaveLength(4);
    expect(within(navigation).getByRole("link", { name: "Tableau de bord" })).toBeInTheDocument();
    expect(within(navigation).getByRole("link", { name: "Décisions" })).toBeInTheDocument();
    expect(within(navigation).getByRole("link", { name: "Établissements" })).toBeInTheDocument();
    expect(within(navigation).getByRole("link", { name: "Journal" })).toBeInTheDocument();
    expect(navigation.querySelectorAll(".nav-icon")).toHaveLength(4);
    expect(screen.queryByRole("link", { name: "Explications" })).not.toBeInTheDocument();
    expect(screen.getByText("Concert · 4 800 places")).toBeInTheDocument();
    expect(screen.getByText("CDD serveur arrive à échéance")).toBeInTheDocument();
    expect(screen.getByText("Brouillon fûts et glaçons avant 14:00")).toBeInTheDocument();
  });

  it.each([
    [BriefingPage, "3 décisions avant le dîner"],
    [MultisitesPage, "Où agir dans le groupe"],
    [ValeurPage, "Décisions prises"],
  ])("rend un écran métier cohérent", (Page, title) => {
    renderDemo(<Page />);
    expect(screen.getByRole("heading", { level: 1, name: title })).toBeInTheDocument();
  });

  it("ouvre un exemple fictif sans modifier le tableau de bord", () => {
    const view = renderDemo(<Home />);
    expect(view.container.querySelector(".forecast-primary strong")).toHaveTextContent("140");
    fireEvent.click(screen.getByRole("button", { name: "Cas fictifs" }));
    expect(screen.getByRole("dialog", { name: "Explorer un exemple fictif" })).toBeInTheDocument();
    expect(screen.getByText(/L’application, ses chiffres et vos décisions ne seront pas modifiés/i)).toBeInTheDocument();

    const cancelled = screen.getByText("Événement annulé").closest("button");
    expect(cancelled).not.toBeNull();
    fireEvent.click(cancelled!);
    expect(screen.getByRole("heading", { level: 3, name: "Événement annulé" })).toBeInTheDocument();
    expect(screen.getByText("124 couverts")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Fermer l’exemple" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(view.container.querySelector(".forecast-primary strong")).toHaveTextContent("140");
  });

  it("permet de consulter sept jours sans alourdir le scénario actif", () => {
    renderDemo(<Home />);
    const horizon = screen.getByRole("heading", { name: "Les 7 prochains jours" }).closest("section");
    expect(horizon).not.toBeNull();
    expect(within(horizon!).getAllByRole("article")).toHaveLength(7);
    expect(within(horizon!).getByLabelText("Établissement")).toHaveValue("republique");
    expect(within(horizon!).getByLabelText("Service")).toHaveValue("dinner");
    expect(within(horizon!).getAllByText("140").length).toBeGreaterThan(0);

    fireEvent.change(within(horizon!).getByLabelText("Service"), { target: { value: "lunch" } });
    expect(within(horizon!).getAllByText("87").length).toBeGreaterThan(0);
  });

  it("une décision met à jour l'écran et le Journal", () => {
    const view = renderDemo(<BriefingPage />);
    expect(screen.getByRole("heading", { name: "Équipe du service" })).toBeInTheDocument();
    expect(screen.getByText("7 / 8")).toBeInTheDocument();
    expect(screen.getByText("1 / 2")).toBeInTheDocument();
    expect(screen.queryByText("121 → 140")).not.toBeInTheDocument();
    expect(screen.getByText("Sources actualisées · 4/4")).toBeInTheDocument();
    expect(screen.getByText("Glissez pour parcourir les 3 priorités")).toBeInTheDocument();
    expect(view.container.querySelector(".systems-details")).not.toHaveAttribute("open");
    expect(view.container.querySelectorAll(".interactive-action")).toHaveLength(3);
    const action = screen.getByRole("heading", { name: "Préparer 24 portions froides pour la terrasse" }).closest("article");
    fireEvent.click(within(action!).getByRole("button", { name: "Valider" }));
    expect(within(action!).getByText("Validée")).toBeInTheDocument();
    expect(within(action!).getByText("Ajoutée au Journal.")).toBeInTheDocument();
  });

  it("transforme la vue groupe en arbitrage compact même sans transfert", () => {
    renderDemo(<MultisitesPage />);
    expect(screen.getByText("339")).toBeInTheDocument();
    expect(screen.getByText("Qui a besoin d’aide, qui peut aider ?")).toBeInTheDocument();
    expect(screen.getByText("Glissez pour comparer les 3 établissements")).toBeInTheDocument();
    expect(screen.getByText("Manque 1")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Ne pas déplacer d’équipe aujourd’hui" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Traiter le plan local" })).toHaveAttribute("href", "/briefing");
  });

  it("exige un motif pour modifier une recommandation et le journalise", () => {
    renderDemo(<><BriefingClient /><RoiClient /></>);
    const action = screen.getByRole("heading", { name: "Préparer 24 portions froides pour la terrasse" }).closest("article");
    fireEvent.click(within(action!).getByRole("button", { name: "Modifier" }));
    fireEvent.change(within(action!).getByLabelText("Décrivez la modification"), { target: { value: "Réduire le lot à 16 portions" } });
    fireEvent.click(within(action!).getByRole("button", { name: "Enregistrer" }));

    expect(within(action!).getByText("Modifiée")).toBeInTheDocument();
    expect(screen.getByText("Motif : Réduire le lot à 16 portions")).toBeInTheDocument();
    expect(screen.getByText("Gain observé")).toBeInTheDocument();
    expect(screen.getByText("Non disponible dans la démo")).toBeInTheDocument();
  });

  it("joue localement l’abstention et bloque une action arrivée trop tard", () => {
    renderDemo(<Home />);
    fireEvent.click(screen.getByRole("button", { name: "Cas fictifs" }));
    const dialog = screen.getByRole("dialog", { name: "Explorer un exemple fictif" });

    fireEvent.click(within(dialog).getByText("Données insuffisantes").closest("button")!);
    expect(within(dialog).getByText("Le moteur s’abstient")).toBeInTheDocument();
    expect(within(dialog).getByText("Aucun nombre ni plan d’action précis n’est produit.")).toBeInTheDocument();

    fireEvent.click(within(dialog).getByText("Événement annulé").closest("button")!);
    expect(within(dialog).getByText("Échéance dépassée · action non exécutable")).toBeInTheDocument();
    const activeAction = within(dialog).getByText("Réaffecter un serveur après 20:30").closest("article");
    fireEvent.click(within(activeAction!).getByRole("button", { name: "Valider" }));
    expect(within(activeAction!).getByText("Simulation locale : validée")).toBeInTheDocument();

    fireEvent.click(within(dialog).getByRole("button", { name: "Fermer l’exemple" }));
    expect(document.querySelector(".forecast-primary strong")).toHaveTextContent("140");
  });

  it("ajoute une décision terrain et prépare un partage sans envoi automatique", () => {
    renderDemo(<><BriefingClient /><RoiClient /></>);
    fireEvent.change(screen.getByLabelText("Action"), { target: { value: "Préparer le comptoir extérieur" } });
    fireEvent.click(screen.getByRole("button", { name: "Ajouter au plan" }));

    expect(screen.getByText("Préparer le comptoir extérieur")).toBeInTheDocument();
    expect(screen.getByText("Décision libre")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Préparer le message" }));

    expect(screen.getByRole("dialog", { name: "Choisir le canal" })).toBeInTheDocument();
    expect(screen.getByText(/Aucun destinataire n’est prérempli/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Ouvrir WhatsApp" })).toHaveAttribute("href", expect.stringContaining("https://wa.me/?text="));
    expect(screen.getByRole("link", { name: "Ouvrir SMS" })).toHaveAttribute("href", expect.stringContaining("sms:?&body="));
  });

  it("prépare puis confirme humainement un brouillon fournisseur fictif", () => {
    renderDemo(<><BriefingClient /><RoiClient /></>);
    expect(screen.getByText("Fût blonde locale")).toBeInTheDocument();
    expect(screen.getByText("Glaçons alimentaires")).toBeInTheDocument();
    expect(screen.getByText("240 €")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Préparer le brouillon" }));
    expect(screen.getByText(/Une confirmation humaine reste obligatoire/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Confirmer dans la démo" }));

    expect(screen.getByText("✓ Confirmé fictivement")).toBeInTheDocument();
    expect(screen.getByText("Brouillon fournisseur")).toBeInTheDocument();
    expect(screen.getByText(/Rien n’a été transmis au fournisseur/i)).toBeInTheDocument();
  });
});
