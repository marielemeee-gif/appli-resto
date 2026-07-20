import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { DemoProvider } from "@/demo/demo-context";
import { demoScenarios, getDemoHistory, getDemoSiteView } from "@/demo/scenarios";
import { BriefingClient } from "@/components/briefing-client";
import { RoiClient } from "@/components/roi-client";
import BriefingPage from "./briefing/page";
import Home from "./page";
import ValeurPage from "./valeur/page";

function renderDemo(ui: React.ReactNode) {
  return render(<DemoProvider>{ui}</DemoProvider>);
}

afterEach(() => {
  cleanup();
  window.history.replaceState({}, "", "/");
});

describe("Application de démonstration", () => {
  it("borne chaque monde à des paramètres et décisions réalistes", () => {
    for (const scenario of demoScenarios) {
      expect(scenario.signals.length).toBeGreaterThanOrEqual(3);
      expect(scenario.signals.length).toBeLessThanOrEqual(5);
      expect(scenario.recommendations.length).toBeLessThanOrEqual(3);
      expect(scenario.staffing.map((item) => item.role)).toEqual(["Salle", "Cuisine", "Bar"]);
      expect(scenario.watch).toHaveLength(4);
      expect(scenario.watch.filter((item) => item.category === "Événement" || item.category === "Fournisseur").every((item) => item.site === scenario.siteName)).toBe(true);
      expect(scenario.history.every((item) => item.decidedAt.startsWith("2026-07"))).toBe(true);
      if (scenario.dispatch) expect(scenario.recommendations.some((item) => item.id === scenario.dispatch?.id)).toBe(true);
      const primarySite = scenario.sites.find((site) => site.id === scenario.siteId);
      expect(primarySite?.expectedCovers).toBe(scenario.forecast.expectedCovers);
      expect(primarySite?.plannedServers).toBe(scenario.staffing.find((item) => item.role === "Salle")?.planned);
      expect(primarySite?.requiredServers).toBe(scenario.staffing.find((item) => item.role === "Salle")?.required);
      if (scenario.forecast.expectedCovers !== null && scenario.forecast.baselineCovers !== null) {
        const explainedDelta = scenario.signals.reduce((sum, signal) => sum + (signal.impactCovers ?? 0), 0);
        expect(explainedDelta).toBe(scenario.forecast.expectedCovers - scenario.forecast.baselineCovers);
        expect(scenario.forecast.lowerCovers).toBeLessThanOrEqual(scenario.forecast.expectedCovers);
        expect(scenario.forecast.upperCovers).toBeGreaterThanOrEqual(scenario.forecast.expectedCovers);
      }
    }
    expect(demoScenarios.find((scenario) => scenario.id === "bad_data_abstain")?.supplierWorkflow).toBeUndefined();
  });

  it("peuple les trois établissements avec des vues locales cohérentes", () => {
    for (const scenario of demoScenarios) {
      for (const site of scenario.sites) {
        const view = getDemoSiteView(scenario, site.id);
        expect(view.site.id).toBe(site.id);
        expect(view.systems.length).toBeGreaterThanOrEqual(3);
        expect(view.staffing.map((item) => item.role)).toEqual(["Salle", "Cuisine", "Bar"]);
        expect(new Set(view.recommendations.map((item) => item.id)).size).toBe(view.recommendations.length);
        expect(view.recommendations.length).toBeLessThanOrEqual(3);

        if (view.forecast.expectedCovers === null || view.forecast.baselineCovers === null) {
          expect(view.recommendations).toHaveLength(0);
        } else {
          expect(view.watch.length).toBeGreaterThanOrEqual(3);
          expect(view.recommendations.length).toBeGreaterThan(0);
          expect(view.forecast.lowerCovers).toBeLessThanOrEqual(view.forecast.expectedCovers);
          expect(view.forecast.upperCovers).toBeGreaterThanOrEqual(view.forecast.expectedCovers);
          expect(view.signals.reduce((sum, signal) => sum + (signal.impactCovers ?? 0), 0)).toBe(view.forecast.expectedCovers - view.forecast.baselineCovers);
        }
      }

      const journalSites = new Set(getDemoHistory(scenario).map((item) => item.site));
      expect(["République", "Liberté", "Gare"].every((siteName) => journalSites.has(siteName))).toBe(true);
    }
  });

  it("propose des décisions différentes selon le lieu", () => {
    const scenario = demoScenarios.find((item) => item.id === "concert_dry_friday")!;
    const titlesBySite = scenario.sites.map((site) => getDemoSiteView(scenario, site.id).recommendations.map((item) => item.title));
    expect(titlesBySite[0]).not.toEqual(titlesBySite[1]);
    expect(titlesBySite[1]).not.toEqual(titlesBySite[2]);
    expect(titlesBySite[2]).not.toEqual(titlesBySite[0]);
  });

  it("présente une entrée groupe claire et trois destinations opérationnelles", () => {
    renderDemo(<Home />);
    expect(screen.getByRole("heading", { level: 1, name: "Le groupe en un coup d’œil" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Prototype App, pilotage restaurants, accueil" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Specs PDF" })).toHaveAttribute("href", "/specs-prototype-app.pdf");
    expect(screen.getByRole("button", { name: "Cas fictifs" })).toHaveClass("examples-button");
    const navigation = screen.getByRole("navigation", { name: "Navigation principale" });
    expect(within(navigation).getAllByRole("link")).toHaveLength(3);
    expect(within(navigation).getByRole("link", { name: "Accueil" })).toBeInTheDocument();
    expect(within(navigation).getByRole("link", { name: "Décisions" })).toBeInTheDocument();
    expect(within(navigation).getByRole("link", { name: "Journal" })).toBeInTheDocument();
    expect(navigation.querySelectorAll(".nav-icon")).toHaveLength(3);
    expect(screen.queryByRole("link", { name: "Explications" })).not.toBeInTheDocument();
    expect(screen.getByText("339")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Voir le détail de République" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Voir le détail de Liberté" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Voir le détail de Gare" })).toBeInTheDocument();
  });

  it.each([
    [BriefingPage, "3 décisions avant le dîner"],
    [ValeurPage, "Décisions prises"],
  ])("rend un écran métier cohérent", (Page, title) => {
    renderDemo(<Page />);
    expect(screen.getByRole("heading", { level: 1, name: title })).toBeInTheDocument();
  });

  it("ouvre un exemple fictif sans modifier le tableau de bord", () => {
    renderDemo(<Home />);
    const republique = screen.getByRole("heading", { name: "République" }).closest("article");
    expect(within(republique!).getByText("140")).toBeInTheDocument();
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
    expect(within(republique!).getByText("140")).toBeInTheDocument();
  });

  it("permet de consulter sept jours sans alourdir le scénario actif", () => {
    renderDemo(<Home />);
    fireEvent.click(screen.getByRole("button", { name: "Voir le détail de République" }));
    const horizon = screen.getByRole("heading", { name: "Les 7 prochains jours" }).closest("section");
    expect(horizon).not.toBeNull();
    expect(within(horizon!).getAllByRole("article")).toHaveLength(7);
    expect(screen.getByLabelText("Établissement actif")).toHaveValue("republique");
    expect(within(horizon!).getByLabelText("Service")).toHaveValue("dinner");
    expect(within(horizon!).getAllByText("140").length).toBeGreaterThan(0);

    fireEvent.change(within(horizon!).getByLabelText("Service"), { target: { value: "lunch" } });
    expect(within(horizon!).getAllByText("87").length).toBeGreaterThan(0);
  });

  it("partage une vue Liberté complète et ses décisions propres", () => {
    const view = renderDemo(<Home />);
    fireEvent.click(screen.getByRole("button", { name: "Voir le détail de Liberté" }));

    expect(view.container.querySelector(".forecast-primary strong")).toHaveTextContent("108");
    expect(screen.getByText(/Fourchette 103–114 · 3.996 € de CA fictif/)).toBeInTheDocument();
    expect(screen.getByText("4 échéances utiles")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "2 décisions" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Aucune décision moteur" })).not.toBeInTheDocument();

    view.rerender(<DemoProvider><BriefingPage /></DemoProvider>);
    expect(screen.getByRole("heading", { level: 1, name: "2 décisions avant le dîner" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Préparer 18 assiettes afterwork à partager" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Décaler une prise de poste sur 19:00–21:00" })).toBeInTheDocument();
    const action = screen.getByRole("heading", { name: "Décaler une prise de poste sur 19:00–21:00" }).closest("article");
    fireEvent.click(within(action!).getByRole("button", { name: "Valider" }));
    expect(within(action!).getByText("Validée")).toBeInTheDocument();

    view.rerender(<DemoProvider><ValeurPage /></DemoProvider>);
    expect(screen.getByRole("heading", { name: "Historique · Liberté" })).toBeInTheDocument();
    expect(screen.getByText("Décaler une prise de poste sur 19:00–21:00")).toBeInTheDocument();
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

  it("transforme l’accueil en arbitrage groupe compact même sans transfert", () => {
    renderDemo(<Home />);
    expect(screen.getByText("339")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Où regarder en premier ?" })).toBeInTheDocument();
    expect(screen.getAllByText("Préparer 24 portions froides pour la terrasse")).toHaveLength(1);
    expect(screen.getByRole("heading", { name: "Ne pas déplacer d’équipe aujourd’hui" })).toBeInTheDocument();
  });

  it("revient toujours à la vue groupe depuis un détail local", () => {
    renderDemo(<Home />);
    fireEvent.click(screen.getByRole("button", { name: "Voir le détail de Gare" }));
    expect(screen.getByRole("heading", { level: 1, name: "Pilotage du jour" })).toBeInTheDocument();
    expect(window.location.search).toBe("?site=gare");
    fireEvent.change(screen.getByLabelText("Établissement actif"), { target: { value: "liberte" } });
    expect(window.location.search).toBe("?site=liberte");
    fireEvent.click(screen.getByRole("button", { name: "Vue groupe" }));
    expect(screen.getByRole("heading", { level: 1, name: "Le groupe en un coup d’œil" })).toBeInTheDocument();
    expect(window.location.search).toBe("");
  });

  it("restaure l’accueil groupe quand un onglet revient sur l’URL sans filtre", () => {
    renderDemo(<Home />);
    fireEvent.click(screen.getByRole("button", { name: "Voir le détail de République" }));
    expect(screen.getByRole("heading", { level: 1, name: "Pilotage du jour" })).toBeInTheDocument();

    window.history.replaceState({}, "", "/cockpit/");
    fireEvent(window, new Event("pageshow"));

    expect(screen.getByRole("heading", { level: 1, name: "Le groupe en un coup d’œil" })).toBeInTheDocument();
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
    const republique = screen.getByRole("heading", { name: "République" }).closest("article");
    expect(within(republique!).getByText("140")).toBeInTheDocument();
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
