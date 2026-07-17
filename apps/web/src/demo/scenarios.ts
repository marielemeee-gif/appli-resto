export type DemoSignal = {
  id: string;
  label: string;
  category: "reservations" | "weather" | "event" | "calendar" | "access" | "staff" | "stock" | "supplier" | "quality";
  previous: string;
  current: string;
  impactCovers: number | null;
  updatedAt: string;
  explanation: string;
};

export type DemoSystem = {
  id: string;
  name: string;
  kind: "pos" | "reservations" | "planning" | "local_signals" | "supplier";
  status: "fresh" | "warning" | "blocked";
  lastSync: string;
  evidence: string;
};

export type SupplierWorkflow = {
  id: string;
  supplierName: string;
  accountLabel: string;
  minimumOrder: number;
  cutoff: string;
  deliverySlot: string;
  items: Array<{
    sku: string;
    name: string;
    packaging: string;
    requestedQuantity: number;
    availableQuantity: number;
    unitPrice: number;
  }>;
};

export type DemoWatchItem = {
  id: string;
  category: "Météo" | "Événement" | "Équipe" | "Fournisseur";
  title: string;
  when: string;
  site: string;
  detail: string;
  urgency: "normal" | "soon" | "urgent";
};

export type DemoStaffingRole = {
  role: "Salle" | "Cuisine" | "Bar";
  planned: number | null;
  required: number | null;
};

export type DemoHorizonDay = {
  day: string;
  date: string;
  lunch: number | null;
  dinner: number | null;
  confidence: number;
};

export type DemoRecommendation = {
  id: string;
  type: "staffing" | "preparation" | "purchase";
  title: string;
  detail: string;
  deadline: string;
  estimatedGain: number;
  estimatedRisk: number;
  confidence: number;
  rule: string;
};

export type DemoSite = {
  id: "republique" | "liberte" | "gare";
  name: string;
  expectedCovers: number | null;
  plannedServers: number;
  requiredServers: number | null;
  alert: string;
  stockRisk: "Faible" | "Modéré" | "Élevé" | "Inconnu";
};

export type DemoDecision = {
  id: string;
  scenarioId: string;
  recommendationId: string;
  recommendationType: string;
  title: string;
  site: string;
  status: "accepted" | "modified" | "refused";
  decidedAt: string;
  estimatedGain: number;
  owner?: string;
  deadline?: string;
  note?: string;
};

export type DemoScenario = {
  id: string;
  name: string;
  shortName: string;
  summary: string;
  question: string;
  differentiator: string;
  journey: string;
  siteId: DemoSite["id"];
  siteName: string;
  moment: string;
  asOf: string;
  forecast: {
    baselineCovers: number | null;
    previousCovers: number | null;
    expectedCovers: number | null;
    lowerCovers: number | null;
    upperCovers: number | null;
    counterfactualCovers: number | null;
    expectedRevenue: number | null;
    confidence: number;
    method: string;
    abstentionReason?: string;
  };
  systems: DemoSystem[];
  watch: DemoWatchItem[];
  staffing: DemoStaffingRole[];
  signals: DemoSignal[];
  recommendations: DemoRecommendation[];
  supplierWorkflow?: SupplierWorkflow;
  sites: DemoSite[];
  dispatch?: {
    id: string;
    source: string;
    target: string;
    quantity: number;
    travelMinutes: number;
    deadline: string;
    estimatedGain: number;
    confidence: number;
    sourceAfterTransfer: number;
    targetAfterTransfer: number;
  };
  history: DemoDecision[];
};

const site = (id: DemoSite["id"], name: string, expectedCovers: number | null, plannedServers: number, requiredServers: number | null, alert: string, stockRisk: DemoSite["stockRisk"]): DemoSite => ({
  id, name, expectedCovers, plannedServers, requiredServers, alert, stockRisk,
});

const staffing = (salle: [number | null, number | null], cuisine: [number | null, number | null], bar: [number | null, number | null]): DemoStaffingRole[] => [
  { role: "Salle", planned: salle[0], required: salle[1] },
  { role: "Cuisine", planned: cuisine[0], required: cuisine[1] },
  { role: "Bar", planned: bar[0], required: bar[1] },
];

const horizonDays = [
  ["Ven.", "17 juil."], ["Sam.", "18 juil."], ["Dim.", "19 juil."], ["Lun.", "20 juil."],
  ["Mar.", "21 juil."], ["Mer.", "22 juil."], ["Jeu.", "23 juil."],
] as const;

export function getDemoHorizon(sites: DemoSite[]): Record<DemoSite["id"], DemoHorizonDay[]> {
  const result: Record<DemoSite["id"], DemoHorizonDay[]> = { republique: [], liberte: [], gare: [] };
  const dinnerDeltas = [0, 5, -12, -18, -8, -4, 6];
  const lunchDeltas = [0, 2, -7, -10, -5, -2, 3];
  for (const currentSite of sites) {
    result[currentSite.id] = horizonDays.map(([day, date], index) => {
      const base = currentSite.expectedCovers;
      return {
        day,
        date,
        dinner: base === null ? null : Math.max(35, base + dinnerDeltas[index]),
        lunch: base === null ? null : Math.max(25, Math.round(base * 0.62) + lunchDeltas[index]),
        confidence: Math.max(60, 86 - index * 3),
      };
    });
  }
  return result;
}

export function isDeadlineExpired(asOf: string, deadline: string): boolean {
  const asOfMatch = asOf.match(/(\d{2}):(\d{2})$/);
  const deadlineMatch = deadline.match(/^(\d{2}):(\d{2})$/);
  if (!asOfMatch || !deadlineMatch) return false;
  const asOfMinutes = Number(asOfMatch[1]) * 60 + Number(asOfMatch[2]);
  const deadlineMinutes = Number(deadlineMatch[1]) * 60 + Number(deadlineMatch[2]);
  return asOfMinutes > deadlineMinutes;
}

const watch = (siteName: string, eventTitle: string, eventDetail: string, weatherTitle: string, supplierTitle: string): DemoWatchItem[] => [
  { id: "watch-weather", category: "Météo", title: weatherTitle, when: "Aujourd'hui · 18:00", site: "Groupe", detail: "Décision terrasse à confirmer au briefing de 16:00.", urgency: "normal" },
  { id: "watch-event", category: "Événement", title: eventTitle, when: "Aujourd'hui · 20:00", site: siteName, detail: eventDetail, urgency: "urgent" },
  { id: "watch-contract", category: "Équipe", title: "CDD serveur arrive à échéance", when: "29 juillet", site: "Liberté", detail: "Arbitrer le renouvellement avant le 22 juillet. Aucun nom ni donnée personnelle dans la démo.", urgency: "soon" },
  { id: "watch-supplier", category: "Fournisseur", title: supplierTitle, when: "Aujourd'hui · 14:00", site: siteName, detail: "Prochaine fenêtre de modification du fournisseur fictif.", urgency: "soon" },
];

export const demoScenarios: DemoScenario[] = [
  {
    id: "baseline_normal",
    name: "Semaine normale",
    shortName: "Service stable",
    summary: "Une demande ordinaire où la meilleure décision est de ne pas sur-réagir.",
    question: "Faut-il modifier l'organisation quand les signaux restent proches de la référence ?",
    differentiator: "Le moteur croise les signaux mais sait conclure que le plan actuel reste adapté.",
    journey: "Contrôler la stabilité, confirmer la préparation et programmer le prochain point.",
    siteId: "gare", siteName: "Gare", moment: "Briefing 08:00", asOf: "17 juillet · 08:00",
    forecast: { baselineCovers: 95, previousCovers: 94, expectedCovers: 96, lowerCovers: 91, upperCovers: 101, counterfactualCovers: 95, expectedRevenue: 3648, confidence: 88, method: "Référence pondérée + signaux stables" },
    systems: [
      { id: "normal-pos", name: "Caisse", kind: "pos", status: "fresh", lastSync: "07:51", evidence: "Clôture J-1 importée" },
      { id: "normal-booking", name: "Réservations", kind: "reservations", status: "fresh", lastSync: "07:45", evidence: "39 couverts confirmés" },
      { id: "normal-planning", name: "Planning", kind: "planning", status: "fresh", lastSync: "07:35", evidence: "5 serveurs planifiés" },
    ],
    watch: watch("Gare", "Aucun événement majeur", "Aucun impact exceptionnel attendu.", "23 °C sec · terrasse standard", "Commande habituelle déjà couverte"),
    staffing: staffing([5, 5], [3, 3], [1, 1]),
    signals: [
      { id: "normal-res", label: "Réservations", category: "reservations", previous: "37 à J-2", current: "39 à J-0", impactCovers: 1, updatedAt: "07:45", explanation: "Le rythme reste dans la bande habituelle du vendredi." },
      { id: "normal-weather", label: "Météo terrasse", category: "weather", previous: "22 °C", current: "23 °C sec", impactCovers: 0, updatedAt: "07:30", explanation: "Conditions favorables mais déjà habituelles pour la saison : aucun effet additionnel retenu." },
      { id: "normal-calendar", label: "Calendrier local", category: "calendar", previous: "Aucun signal", current: "Aucun signal", impactCovers: 0, updatedAt: "06:00", explanation: "Ni vacances, ni événement majeur à proximité." },
    ],
    recommendations: [
      { id: "normal-prep", type: "preparation", title: "Maintenir la mise en place pour 96 couverts", detail: "Le niveau prévu couvre la médiane sans créer de surproduction inhabituelle.", deadline: "11:00", estimatedGain: 38, estimatedRisk: 52, confidence: 86, rule: "mise en place = prévision médiane du service" },
    ],
    sites: [site("republique", "République", 126, 7, 7, "Plan équilibré", "Faible"), site("liberte", "Liberté", 104, 6, 6, "Plan équilibré", "Faible"), site("gare", "Gare", 96, 5, 5, "Plan équilibré", "Faible")],
    history: [{ id: "hist-normal", scenarioId: "baseline_normal", recommendationId: "normal-check", recommendationType: "preparation", title: "Maintenir le plan de préparation", site: "Gare", status: "accepted", decidedAt: "2026-07-10T09:12:00+02:00", estimatedGain: 31 }],
  },
  {
    id: "concert_dry_friday",
    name: "Concert et météo sèche",
    shortName: "Pic de demande",
    summary: "Réservations en accélération, concert confirmé et terrasse exploitable le même soir.",
    question: "Le cumul des signaux justifie-t-il un renfort et davantage de préparation ?",
    differentiator: "La hausse ne vient pas d'un facteur isolé : l'app additionne demande observée, événement local, météo et capacité opérationnelle.",
    journey: "Détecter le pic, renforcer la préparation avant 11:00 puis sécuriser les boissons avant 14:00.",
    siteId: "republique", siteName: "République", moment: "Briefing 08:00", asOf: "17 juillet · 08:00",
    forecast: { baselineCovers: 102, previousCovers: 121, expectedCovers: 140, lowerCovers: 135, upperCovers: 146, counterfactualCovers: 130, expectedRevenue: 5740, confidence: 84, method: "Référence + rythme + signaux locaux" },
    systems: [
      { id: "concert-pos", name: "Caisse", kind: "pos", status: "fresh", lastSync: "07:52", evidence: "Historique vendredi disponible" },
      { id: "concert-booking", name: "Réservations", kind: "reservations", status: "fresh", lastSync: "07:50", evidence: "84 couverts confirmés" },
      { id: "concert-local", name: "Événements & météo", kind: "local_signals", status: "fresh", lastSync: "07:30", evidence: "Concert confirmé · soirée sèche" },
      { id: "concert-supplier", name: "Catalogue fournisseur", kind: "supplier", status: "fresh", lastSync: "07:40", evidence: "2 références disponibles" },
    ],
    watch: watch("République", "Concert · 4 800 places", "Arrivées concentrées avant le dîner, impact estimé +10 couverts.", "24 °C sec · terrasse ouverte", "Brouillon fûts et glaçons avant 14:00"),
    staffing: staffing([7, 8], [3, 3], [1, 2]),
    signals: [
      { id: "concert-res", label: "Réservations", category: "reservations", previous: "61 à J-1", current: "84 confirmées", impactCovers: 25, updatedAt: "07:52", explanation: "Le rythme dépasse de 31 % les vendredis comparables." },
      { id: "concert-event", label: "Concert à 450 m", category: "event", previous: "Annonce provisoire", current: "4 800 places · confirmé", impactCovers: 10, updatedAt: "07:10", explanation: "L'horaire concentre les arrivées avant le dîner." },
      { id: "concert-weather", label: "Terrasse", category: "weather", previous: "Risque d'averse 35 %", current: "Sec · 24 °C", impactCovers: 3, updatedAt: "07:30", explanation: "La capacité terrasse devient réellement exploitable." },
      { id: "concert-stock", label: "Fûts et glaçons", category: "stock", previous: "Couverture 1,2 service", current: "Couverture 0,8 service", impactCovers: 0, updatedAt: "07:40", explanation: "Le stock ne réduit pas la demande, mais crée une action bar urgente." },
    ],
    recommendations: [
      { id: "concert-prep", type: "preparation", title: "Préparer 24 portions froides pour la terrasse", detail: "Un petit lot couvre la hausse probable sans engager toute la fourchette haute dès le matin.", deadline: "11:00", estimatedGain: 126, estimatedRisk: 190, confidence: 84, rule: "besoin terrasse médian - préparation déjà disponible" },
      { id: "concert-purchase", type: "purchase", title: "Sécuriser 40 kg de glaçons", detail: "Le stock actuel couvre seulement 80 % du besoin médian du bar et de la terrasse.", deadline: "14:00", estimatedGain: 92, estimatedRisk: 145, confidence: 81, rule: "besoin bar + terrasse - stock disponible" },
      { id: "concert-staff", type: "staffing", title: "Décaler un serveur sur le pic 19:00–22:00", detail: "Le renfort couvre la pointe sans ajouter une vacation complète.", deadline: "16:00", estimatedGain: 74, estimatedRisk: 118, confidence: 78, rule: "1 serveur / 24 couverts au pic" },
    ],
    supplierWorkflow: {
      id: "concert-supplier-order",
      supplierName: "Boissons Ouest · fournisseur fictif",
      accountLabel: "Compte démo · République",
      minimumOrder: 150,
      cutoff: "14:00",
      deliverySlot: "15:30–16:00",
      items: [
        { sku: "FUT-BLONDE-30", name: "Fût blonde locale", packaging: "30 L consigné", requestedQuantity: 2, availableQuantity: 6, unitPrice: 92 },
        { sku: "GLACE-ALIM-10", name: "Glaçons alimentaires", packaging: "sac de 10 kg", requestedQuantity: 4, availableQuantity: 8, unitPrice: 14 },
      ],
    },
    sites: [site("republique", "République", 140, 7, 8, "Renfort conseillé", "Élevé"), site("liberte", "Liberté", 108, 6, 6, "Demande stable", "Faible"), site("gare", "Gare", 91, 5, 5, "Demande stable", "Faible")],
    history: [{ id: "hist-concert", scenarioId: "concert_dry_friday", recommendationId: "concert-prev", recommendationType: "staffing", title: "Décaler le renfort sur 19:00–22:00", site: "République", status: "modified", decidedAt: "2026-07-10T15:20:00+02:00", estimatedGain: 68 }],
  },
  {
    id: "event_cancelled",
    name: "Événement annulé",
    shortName: "Retournement tardif",
    summary: "Le concert disparaît à 13:32 alors que la préparation et la commande sont déjà engagées.",
    question: "Que peut-on encore réduire sans dégrader le service ?",
    differentiator: "L'app ne refait pas seulement une prévision : elle recalcule les décisions encore réversibles selon leurs heures limites.",
    journey: "Identifier la baisse, préserver ce qui est engagé et agir sur achat puis équipe avant leurs échéances.",
    siteId: "republique", siteName: "République", moment: "Alerte 13:45", asOf: "17 juillet · 13:45",
    forecast: { baselineCovers: 126, previousCovers: 140, expectedCovers: 124, lowerCovers: 119, upperCovers: 129, counterfactualCovers: 134, expectedRevenue: 5084, confidence: 84, method: "Replanification après événement" },
    systems: [
      { id: "cancel-booking", name: "Réservations", kind: "reservations", status: "fresh", lastSync: "13:39", evidence: "8 annulations reçues" },
      { id: "cancel-local", name: "Événements & météo", kind: "local_signals", status: "fresh", lastSync: "13:32", evidence: "Concert marqué annulé" },
      { id: "cancel-supplier", name: "Fournisseur", kind: "supplier", status: "warning", lastSync: "13:45", evidence: "Commande modifiable 15 min" },
    ],
    watch: watch("République", "Concert annulé à 13:32", "Replanification immédiate des achats et de l'équipe.", "24 °C sec · baisse partiellement amortie", "Réduire la commande avant 14:00"),
    staffing: staffing([8, 7], [3, 3], [2, 2]),
    signals: [
      { id: "cancel-event", label: "Concert", category: "event", previous: "Confirmé · 4 800 places", current: "Annulé", impactCovers: -10, updatedAt: "13:32", explanation: "Le principal moteur de fréquentation disparaît avant le service." },
      { id: "cancel-res", label: "Réservations", category: "reservations", previous: "84 confirmées", current: "76 + 8 annulations", impactCovers: 5, updatedAt: "13:39", explanation: "Les annulations restent partielles : la demande ne revient pas à la référence basse." },
      { id: "cancel-weather", label: "Terrasse", category: "weather", previous: "Sec · 24 °C", current: "Sec · 24 °C", impactCovers: 3, updatedAt: "13:30", explanation: "La météo favorable amortit une partie de la baisse." },
      { id: "cancel-supplier", label: "Commande boissons", category: "supplier", previous: "Modifiable jusqu'à 14:00", current: "15 min restantes", impactCovers: 0, updatedAt: "13:45", explanation: "Cette décision reste réversible, contrairement à une partie de la préparation." },
    ],
    recommendations: [
      { id: "cancel-prep-expired", type: "preparation", title: "Réduire le lot froid déjà lancé", detail: "La fenêtre de correction est passée à 13:30 ; l'action reste visible uniquement pour expliquer l'abstention opérationnelle.", deadline: "13:30", estimatedGain: 0, estimatedRisk: 36, confidence: 88, rule: "heure actuelle > heure limite : action bloquée" },
      { id: "cancel-purchase", type: "purchase", title: "Retirer 31 boissons de la commande", detail: "La commande reste modifiable pendant 15 minutes ; la préparation déjà lancée n'est pas comptée comme récupérable.", deadline: "14:00", estimatedGain: 86, estimatedRisk: 44, confidence: 84, rule: "commande initiale - besoin révisé" },
      { id: "cancel-staff", type: "staffing", title: "Réaffecter un serveur après 20:30", detail: "La pointe se tasse, mais le début de service reste couvert par les réservations maintenues.", deadline: "16:00", estimatedGain: 61, estimatedRisk: 72, confidence: 77, rule: "besoin horaire révisé - équipe planifiée" },
    ],
    sites: [site("republique", "République", 124, 8, 7, "Réaffectation possible", "Modéré"), site("liberte", "Liberté", 111, 6, 6, "Peut recevoir un renfort", "Faible"), site("gare", "Gare", 89, 5, 5, "Plan stable", "Faible")],
    history: [{ id: "hist-cancel", scenarioId: "event_cancelled", recommendationId: "cancel-prev", recommendationType: "purchase", title: "Réduire une commande après annulation", site: "République", status: "accepted", decidedAt: "2026-07-08T13:48:00+02:00", estimatedGain: 79 }],
  },
  {
    id: "multisite_staff_imbalance",
    name: "Déséquilibre multi-sites",
    shortName: "Arbitrage groupe",
    summary: "Liberté manque d'un serveur alors que République peut en libérer un sur la même plage.",
    question: "Peut-on renforcer Liberté sans créer un nouveau risque à République ?",
    differentiator: "La recommandation optimise le groupe et montre la situation des deux sites après transfert, trajet compris.",
    journey: "Comparer les besoins, vérifier rôle et trajet, puis simuler l'état des deux sites après décision.",
    siteId: "liberte", siteName: "Liberté", moment: "Vue groupe 08:00", asOf: "17 juillet · 08:00",
    forecast: { baselineCovers: 104, previousCovers: 108, expectedCovers: 112, lowerCovers: 107, upperCovers: 118, counterfactualCovers: 108, expectedRevenue: 4144, confidence: 82, method: "Demande + capacité groupe" },
    systems: [
      { id: "multi-booking", name: "Réservations", kind: "reservations", status: "fresh", lastSync: "07:48", evidence: "Hausse isolée à Liberté" },
      { id: "multi-planning", name: "Planning groupe", kind: "planning", status: "fresh", lastSync: "07:35", evidence: "Rôles et disponibilités vérifiés" },
      { id: "multi-local", name: "Accès & événements", kind: "local_signals", status: "fresh", lastSync: "07:40", evidence: "Trajet 12 min · afterwork confirmé" },
    ],
    watch: watch("Liberté", "Afterwork · 190 inscrits", "Impact concentré sur Liberté, sans hausse équivalente à République.", "22 °C · terrasse partielle", "Aucun risque fournisseur prioritaire"),
    staffing: staffing([5, 6], [3, 3], [1, 1]),
    signals: [
      { id: "multi-res", label: "Réservations Liberté", category: "reservations", previous: "46", current: "58", impactCovers: 6, updatedAt: "07:48", explanation: "La hausse se concentre sur Liberté ; la part déjà expliquée par l'afterwork n'est pas comptée deux fois." },
      { id: "multi-staff", label: "Équipe République", category: "staff", previous: "Plan équilibré", current: "+1 serveur après 19:00", impactCovers: 0, updatedAt: "07:35", explanation: "République peut céder un renfort sans passer sous son besoin calculé." },
      { id: "multi-access", label: "Trajet inter-sites", category: "access", previous: "18 min", current: "12 min", impactCovers: 0, updatedAt: "07:40", explanation: "Le trajet permet une prise de poste avant la pointe de 19:30." },
      { id: "multi-event", label: "Afterwork voisin", category: "event", previous: "120 participants", current: "190 inscrits", impactCovers: 2, updatedAt: "07:15", explanation: "Seule la contribution non déjà captée dans les réservations est ajoutée." },
    ],
    recommendations: [
      { id: "multi-staffing", type: "staffing", title: "Transférer un serveur vers Liberté", detail: "République reste à 7/7 serveurs et Liberté passe de 5/6 à 6/6.", deadline: "16:30", estimatedGain: 118, estimatedRisk: 42, confidence: 87, rule: "surplus source + déficit cible + trajet < 20 min" },
    ],
    sites: [site("republique", "République", 118, 8, 7, "+1 mobilisable", "Faible"), site("liberte", "Liberté", 112, 5, 6, "-1 sur le pic", "Modéré"), site("gare", "Gare", 94, 5, 5, "Plan stable", "Faible")],
    dispatch: { id: "multi-staffing", source: "République", target: "Liberté", quantity: 1, travelMinutes: 12, deadline: "16:30", estimatedGain: 118, confidence: 87, sourceAfterTransfer: 7, targetAfterTransfer: 6 },
    history: [{ id: "hist-multi", scenarioId: "multisite_staff_imbalance", recommendationId: "dispatch-prev", recommendationType: "dispatch", title: "Renfort République → Liberté", site: "Groupe", status: "accepted", decidedAt: "2026-07-12T16:02:00+02:00", estimatedGain: 104 }],
  },
  {
    id: "bad_data_abstain",
    name: "Données insuffisantes",
    shortName: "Abstention contrôlée",
    summary: "Doublons de caisse, réservations incomplètes et météo périmée rendent la précision trompeuse.",
    question: "Que doit faire l'app quand plusieurs paramètres sont incompatibles ?",
    differentiator: "La profondeur vient aussi de la prudence : l'app bloque les nombres et indique quelles données corriger avant de décider.",
    journey: "Diagnostiquer la qualité, suspendre les actions chiffrées et demander une validation manuelle.",
    siteId: "liberte", siteName: "Liberté", moment: "Contrôle 08:00", asOf: "17 juillet · 08:00",
    forecast: { baselineCovers: null, previousCovers: 106, expectedCovers: null, lowerCovers: null, upperCovers: null, counterfactualCovers: null, expectedRevenue: null, confidence: 28, method: "Calcul suspendu", abstentionReason: "Trois sources critiques ne passent pas les contrôles qualité." },
    systems: [
      { id: "bad-pos-system", name: "Caisse", kind: "pos", status: "blocked", lastSync: "07:50", evidence: "17 % de doublons" },
      { id: "bad-booking-system", name: "Réservations", kind: "reservations", status: "blocked", lastSync: "J-2", evidence: "Synchronisation incomplète" },
      { id: "bad-local-system", name: "Météo", kind: "local_signals", status: "warning", lastSync: "J-1 12:30", evidence: "Donnée vieille de 19 h" },
    ],
    watch: watch("Liberté", "Événement non exploitable", "Le signal ne peut pas être croisé avec les sources dégradées.", "Météo périmée · terrasse à confirmer", "Commande bloquée tant que les données sont incomplètes"),
    staffing: staffing([6, null], [3, null], [1, null]),
    signals: [
      { id: "bad-pos", label: "Caisse", category: "quality", previous: "Import complet", current: "17 % de tickets dupliqués", impactCovers: null, updatedAt: "07:50", explanation: "Le volume historique ne peut pas être comparé sans dédoublonnage." },
      { id: "bad-res", label: "Réservations", category: "quality", previous: "Synchronisé", current: "Dernière synchro J-2", impactCovers: null, updatedAt: "07:45", explanation: "Le rythme récent est inconnu et ne doit pas être extrapolé." },
      { id: "bad-weather", label: "Météo", category: "quality", previous: "Prévision horaire", current: "Donnée vieille de 19 h", impactCovers: null, updatedAt: "07:30", explanation: "Le signal terrasse est trop ancien pour être utilisé." },
    ],
    recommendations: [],
    sites: [site("republique", "République", 122, 7, 7, "Données fiables", "Faible"), site("liberte", "Liberté", null, 6, null, "Prévision suspendue", "Inconnu"), site("gare", "Gare", 93, 5, 5, "Données fiables", "Faible")],
    history: [{ id: "hist-bad", scenarioId: "bad_data_abstain", recommendationId: "quality-check", recommendationType: "quality", title: "Suspendre les recommandations chiffrées", site: "Liberté", status: "accepted", decidedAt: "2026-07-03T08:08:00+02:00", estimatedGain: 0 }],
  },
  {
    id: "roadworks_delivery_risk",
    name: "Travaux et livraison",
    shortName: "Accès sous contrainte",
    summary: "Une fermeture de rue réduit le passage et menace une livraison avant le dîner.",
    question: "Comment protéger le service quand demande, stock et accès changent ensemble ?",
    differentiator: "L'app relie un signal externe à une contrainte fournisseur et à la demande locale, au lieu d'afficher une simple alerte travaux.",
    journey: "Réviser la demande, vérifier le stock tampon et avancer la livraison avant la fermeture.",
    siteId: "gare", siteName: "Gare", moment: "Alerte accès 08:00", asOf: "17 juillet · 08:00",
    forecast: { baselineCovers: 96, previousCovers: 91, expectedCovers: 82, lowerCovers: 77, upperCovers: 87, counterfactualCovers: 91, expectedRevenue: 3116, confidence: 79, method: "Référence + accès + stock" },
    systems: [
      { id: "road-pos", name: "Caisse", kind: "pos", status: "fresh", lastSync: "07:46", evidence: "Annulations rapprochées" },
      { id: "road-local", name: "Accès & travaux", kind: "local_signals", status: "fresh", lastSync: "07:12", evidence: "Fermeture 16:30–21:00" },
      { id: "road-supplier", name: "Fournisseur", kind: "supplier", status: "warning", lastSync: "07:25", evidence: "Créneau à avancer" },
    ],
    watch: watch("Gare", "Travaux autour de Gare", "Fermeture de rue prévue de 16:30 à 21:00.", "Soirée sèche · impact travaux dominant", "Avancer la livraison avant 10:30"),
    staffing: staffing([5, 5], [3, 3], [1, 1]),
    signals: [
      { id: "road-access", label: "Accès rue", category: "access", previous: "Circulation alternée", current: "Fermeture 16:30–21:00", impactCovers: -9, updatedAt: "07:12", explanation: "Le passage spontané et l'accès livraison sont tous deux affectés." },
      { id: "road-res", label: "Réservations", category: "reservations", previous: "38", current: "33 dont 5 annulations", impactCovers: -7, updatedAt: "07:46", explanation: "Les annulations confirment que l'impact ne reste pas théorique." },
      { id: "road-stock", label: "Stock produits frais", category: "stock", previous: "1,1 service", current: "0,6 service", impactCovers: 0, updatedAt: "07:38", explanation: "Le stock tampon ne permet pas d'annuler complètement la livraison." },
      { id: "road-supplier", label: "Créneau fournisseur", category: "supplier", previous: "17:15", current: "Avançable à 15:45", impactCovers: 0, updatedAt: "07:25", explanation: "Une solution reste possible avant la fermeture de l'accès." },
      { id: "road-weather", label: "Météo", category: "weather", previous: "Averses", current: "Sec en soirée", impactCovers: 2, updatedAt: "07:30", explanation: "Le temps sec amortit légèrement la baisse de passage." },
    ],
    recommendations: [
      { id: "road-purchase", type: "purchase", title: "Avancer la livraison à 15:45", detail: "Le créneau passe avant la fermeture et évite une rupture sur les produits frais.", deadline: "10:30", estimatedGain: 143, estimatedRisk: 212, confidence: 90, rule: "stock < 0,8 service ET accès fermé avant créneau initial" },
      { id: "road-prep", type: "preparation", title: "Réduire la mise en place de 12 portions", detail: "La baisse de demande est confirmée par les annulations, mais la météo limite la réduction.", deadline: "11:00", estimatedGain: 48, estimatedRisk: 39, confidence: 76, rule: "écart médian, borné par la fourchette haute" },
    ],
    sites: [site("republique", "République", 125, 7, 7, "Plan stable", "Faible"), site("liberte", "Liberté", 106, 6, 6, "Plan stable", "Faible"), site("gare", "Gare", 82, 5, 5, "Accès et livraison", "Élevé")],
    history: [{ id: "hist-road", scenarioId: "roadworks_delivery_risk", recommendationId: "road-prev", recommendationType: "purchase", title: "Avancer une livraison avant travaux", site: "Gare", status: "accepted", decidedAt: "2026-07-11T09:41:00+02:00", estimatedGain: 132 }],
  },
];

export const defaultScenarioId = "concert_dry_friday";

export function getDemoScenario(id: string) {
  return demoScenarios.find((scenario) => scenario.id === id) ?? demoScenarios.find((scenario) => scenario.id === defaultScenarioId)!;
}
