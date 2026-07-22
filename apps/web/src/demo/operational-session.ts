import type { DemoScenario } from "./scenarios";

export type OperationalStage = "briefing" | "field_update_applied";
export type FieldSignalMode = "form" | "voice_transcript";

export type FieldSignal = {
  id: string;
  siteId: "republique";
  receivedAt: string;
  source: string;
  transcript: string;
  facts: Array<{ label: string; value: string }>;
};

export type OperationalImpact = {
  site: string;
  previousCovers: number;
  expectedCovers: number;
  groupPreviousCovers: number;
  groupExpectedCovers: number;
  previousRange: string;
  expectedRange: string;
  previousConfidence: number;
  expectedConfidence: number;
  staffingChanges: string[];
};

export type ServiceLoadPoint = {
  hour: string;
  demand: number;
  capacity: number;
};

export const preServiceFieldSignal: FieldSignal = {
  id: "republique-field-note-1020",
  siteId: "republique",
  receivedAt: "10:20",
  source: "Manager République · note vocale transcrite",
  transcript: "Terrasse confirmée, groupe de 22 à 19:30, livraison de glaçons annoncée à 13:30.",
  facts: [
    { label: "Terrasse", value: "Ouverture confirmée" },
    { label: "Réservation", value: "Groupe de 22 à 19:30" },
    { label: "Fournisseur", value: "Glaçons annoncés à 13:30" },
  ],
};

export const operationalImpact: OperationalImpact = {
  site: "République",
  previousCovers: 126,
  expectedCovers: 140,
  groupPreviousCovers: 325,
  groupExpectedCovers: 339,
  previousRange: "120–132",
  expectedRange: "135–146",
  previousConfidence: 76,
  expectedConfidence: 84,
  staffingChanges: ["Salle 7 → 8", "Bar 1 → 2"],
};

const initialLoad: ServiceLoadPoint[] = [
  { hour: "18h", demand: 12, capacity: 18 },
  { hour: "19h", demand: 24, capacity: 28 },
  { hour: "20h", demand: 31, capacity: 32 },
  { hour: "21h", demand: 27, capacity: 32 },
  { hour: "22h", demand: 20, capacity: 26 },
  { hour: "23h", demand: 12, capacity: 18 },
];

const updatedLoad: ServiceLoadPoint[] = [
  { hour: "18h", demand: 14, capacity: 18 },
  { hour: "19h", demand: 29, capacity: 28 },
  { hour: "20h", demand: 37, capacity: 32 },
  { hour: "21h", demand: 30, capacity: 32 },
  { hour: "22h", demand: 19, capacity: 26 },
  { hour: "23h", demand: 11, capacity: 18 },
];

export function getServiceLoad(stage: OperationalStage): ServiceLoadPoint[] {
  return stage === "field_update_applied" ? updatedLoad : initialLoad;
}

function initialScenario(scenario: DemoScenario): DemoScenario {
  return {
    ...scenario,
    moment: "Briefing initial 08:00",
    asOf: "17 juillet · 08:00",
    summary: "Le briefing initial intègre le concert, mais la terrasse, le groupe et la livraison restent à confirmer.",
    differentiator: "Le plan reste volontairement prudent tant que le signal terrain de République n'est pas validé.",
    forecast: {
      ...scenario.forecast,
      previousCovers: 121,
      expectedCovers: 126,
      lowerCovers: 120,
      upperCovers: 132,
      counterfactualCovers: 122,
      expectedRevenue: 5166,
      confidence: 76,
      method: "Référence + réservations confirmées à 08:00",
    },
    systems: scenario.systems.map((system) => {
      if (system.id === "concert-booking") return { ...system, lastSync: "07:50", evidence: "72 couverts confirmés" };
      if (system.id === "concert-local") return { ...system, status: "warning", lastSync: "07:30", evidence: "Concert confirmé · terrasse à confirmer" };
      if (system.id === "concert-supplier") return { ...system, status: "warning", lastSync: "07:40", evidence: "Livraison de glaçons non confirmée" };
      return system;
    }),
    watch: scenario.watch.map((item) => {
      if (item.id === "watch-weather") return { ...item, title: "24 °C sec · terrasse à confirmer", detail: "Le signal météo est favorable, mais l'ouverture terrain n'est pas encore validée.", urgency: "soon" };
      if (item.id === "watch-supplier") return { ...item, title: "Livraison de glaçons à confirmer avant 14:00", detail: "Aucune commande supplémentaire n'est proposée avant le retour terrain.", urgency: "soon" };
      return item;
    }),
    staffing: [
      { role: "Salle", planned: 7, required: 7 },
      { role: "Cuisine", planned: 3, required: 3 },
      { role: "Bar", planned: 1, required: 1 },
    ],
    signals: [
      { id: "concert-res", label: "Réservations", category: "reservations", previous: "61 à J-1", current: "72 confirmées à 08:00", impactCovers: 19, updatedAt: "07:50", explanation: "Le rythme est supérieur aux vendredis comparables, sans intégrer le groupe encore non confirmé." },
      { id: "concert-event", label: "Concert à 450 m", category: "event", previous: "Annonce provisoire", current: "4 800 places · confirmé", impactCovers: 5, updatedAt: "07:10", explanation: "Une contribution prudente est retenue avant le retour du manager sur la terrasse et le groupe." },
      { id: "concert-weather", label: "Terrasse", category: "weather", previous: "Risque d'averse 35 %", current: "Sec prévu · ouverture à confirmer", impactCovers: 0, updatedAt: "07:30", explanation: "La météo seule ne suffit pas à considérer la terrasse comme exploitable." },
      { id: "concert-stock", label: "Fûts et glaçons", category: "stock", previous: "Couverture 1,2 service", current: "Livraison à confirmer", impactCovers: 0, updatedAt: "07:40", explanation: "Le stock borne la décision bar sans modifier la demande prévue." },
    ],
    recommendations: [
      { id: "concert-initial-prep", type: "preparation", title: "Maintenir la mise en place pour 126 couverts", detail: "Le premier lot reste calé sur la médiane initiale tant que la note terrain n'est pas validée.", deadline: "11:00", estimatedGain: 46, estimatedRisk: 68, confidence: 76, rule: "mise en place initiale = médiane disponible à 08:00" },
    ],
    sites: scenario.sites.map((site) => site.id === "republique" ? { ...site, expectedCovers: 126, requiredServers: 7, alert: "Signal terrain attendu", stockRisk: "Modéré" } : site),
  };
}

function updatedScenario(scenario: DemoScenario): DemoScenario {
  return {
    ...scenario,
    moment: "Point terrain 10:20",
    asOf: "17 juillet · 10:20",
    systems: scenario.systems.map((system) => {
      if (system.id === "concert-booking") return { ...system, lastSync: "10:18", evidence: "84 couverts confirmés · groupe inclus" };
      if (system.id === "concert-local") return { ...system, status: "fresh", lastSync: "10:20", evidence: "Terrasse confirmée par le manager" };
      if (system.id === "concert-supplier") return { ...system, status: "fresh", lastSync: "10:15", evidence: "Livraison de glaçons annoncée à 13:30" };
      return system;
    }),
    signals: scenario.signals.map((signal) => {
      if (signal.id === "concert-res") return { ...signal, current: "84 confirmées · groupe de 22 inclus", updatedAt: "10:18" };
      if (signal.id === "concert-weather") return { ...signal, current: "Sec · 24 °C · terrasse confirmée", updatedAt: "10:20" };
      if (signal.id === "concert-stock") return { ...signal, current: "Couverture 0,8 service · livraison 13:30", updatedAt: "10:15" };
      return signal;
    }),
  };
}

export function deriveOperationalScenario(baseScenario: DemoScenario, stage: OperationalStage): DemoScenario {
  if (baseScenario.id !== "concert_dry_friday") return baseScenario;
  return stage === "field_update_applied" ? updatedScenario(baseScenario) : initialScenario(baseScenario);
}
