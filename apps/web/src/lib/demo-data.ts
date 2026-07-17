export const week = [
  { day: "Lun", covers: 62, low: 55, high: 69 },
  { day: "Mar", covers: 74, low: 67, high: 81 },
  { day: "Mer", covers: 67, low: 60, high: 75 },
  { day: "Jeu", covers: 92, low: 84, high: 101 },
  { day: "Ven", covers: 128, low: 115, high: 140, selected: true },
  { day: "Sam", covers: 119, low: 108, high: 131 },
  { day: "Dim", covers: 84, low: 76, high: 93 },
];

export const recommendations = [
  {
    type: "Préparation",
    title: "Préparer 18,1 kg pour les plats principaux",
    deadline: "avant 11 h",
    risk: "Risque évité estimé : 202 €",
  },
  {
    type: "Achats",
    title: "Ajouter 36 unités de boissons",
    deadline: "avant 14 h",
    risk: "Risque évité estimé : 115 €",
  },
];

export const sites = [
  { name: "République", covers: 140, planned: 6, required: 5, gap: 1, tone: "warning" },
  { name: "Liberté", covers: 112, planned: 3, required: 4, gap: -1, tone: "danger" },
  { name: "Gare", covers: 96, planned: 3, required: 3, gap: 0, tone: "success" },
];

export const decisions = [
  { date: "18/07", type: "Personnel", action: "+1 serveur", status: "Validée", gain: "+142 €" },
  { date: "17/07", type: "Achats", action: "Commande réduite", status: "Validée", gain: "+240 €" },
  { date: "16/07", type: "Terrasse", action: "Ouverture", status: "Refusée", gain: "0 €" },
];
