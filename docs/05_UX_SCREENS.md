# Écrans et expérience utilisateur

Le PDF de référence contient quatre maquettes conceptuelles. Le prototype doit reprendre leur logique, tout en restant implémentable et accessible.

## Navigation proposée

- Groupe et site.
- Cockpit.
- Briefing.
- Multi-sites.
- Décisions et ROI.
- Scénarios de démonstration, visibles seulement en mode local.

## Écran 1 — cockpit quotidien

### Objectif

Comprendre la semaine et ouvrir le service prioritaire.

### Contenu

- Site et date.
- Indice d'activité lisible.
- Prévision à sept jours.
- Couverts, chiffre d'affaires et équipe du service choisi.
- Fourchette et confiance.
- Facteurs principaux.
- Trois décisions maximum.
- Bouton d'ouverture du briefing.

### États

- normal ;
- activité forte ;
- activité faible ;
- confiance faible ;
- données manquantes ;
- prévision indisponible.

## Écran 2 — briefing et alerte

### Objectif

Présenter une décision en quelques secondes sur ordinateur ou mobile.

### Contenu

- Ce qui va se passer.
- Ce qui a changé.
- Action proposée.
- Heure limite.
- Gain ou risque estimé.
- Confiance.
- Valider, modifier ou refuser.
- Motif facultatif ou liste de raisons.

### Règle de conception

Une alerte ne doit pas ressembler à une injonction certaine. L'incertitude et le droit de refus restent visibles.

## Écran 3 — multi-sites

### Objectif

Comparer les écarts de capacité d'un groupe et proposer une réallocation.

### Contenu

- Trois cartes de sites.
- Couverts prévus et écart de personnel.
- Fenêtre horaire commune.
- Proposition de transfert.
- Temps de trajet, rôle et contraintes.
- Coût évité et confiance.
- Validation, modification ou refus.

## Écran 4 — registre du ROI

### Objectif

Prouver la valeur et comprendre quelles décisions sont réellement exécutables.

### Contenu

- Gain estimé et observé.
- Décisions utiles/appliquées/refusées.
- Heures réaffectées.
- Achats ajustés.
- Ruptures potentielles évitées.
- Répartition par type de décision.
- Dernières décisions.
- Méthodes et hypothèses consultables.

## Écran 5 — détail et diagnostic

Peut être une page ou un panneau latéral :

- données disponibles ;
- valeurs manquantes ;
- méthode utilisée ;
- référence historique ;
- facteurs et impacts ;
- version du modèle ;
- date limite des données ;
- historique des recalculs.

## Direction graphique

- Fond clair.
- Bleu nuit pour la structure.
- Vert pétrole pour les signaux et validations.
- Ambre pour les échéances et éléments d'attention.
- Rouge réservé aux risques réels, pas aux simples baisses.
- Cartes aérées, coins légèrement arrondis et typographie très lisible.
- Chiffres importants grands, détails secondaires discrets.

## Accessibilité

- Contraste suffisant.
- Aucun état transmis uniquement par la couleur.
- Navigation clavier.
- Libellés explicites pour graphiques et boutons.
- Tableaux avec en-têtes.
- Mise en page utilisable à 200 % de zoom.
- Animations réduites lorsque l'utilisateur le demande.

## Démonstration guidée

Prévoir un bouton ou sélecteur de scénario permettant de passer dans cet ordre :

1. semaine normale ;
2. concert et météo favorable ;
3. annulation tardive ;
4. déséquilibre multi-sites ;
5. données insuffisantes et abstention ;
6. résultat mensuel dans le registre du ROI.

