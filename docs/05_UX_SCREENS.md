# Écrans et expérience utilisateur

## Parcours actuel — du briefing au Journal

L'application publique est organisée autour de trois destinations : `Accueil`, `Décisions` et `Journal`. L'Accueil commence par une vue groupe puis ouvre le détail de chaque établissement. Le cas fil rouge République suit une boucle unique :

1. briefing initial fictif à 08:00 : 126 couverts, fourchette 120–132, confiance 76 % ;
2. retour terrain fictif reçu à 10:20, sous forme de formulaire ou de transcription préremplie ;
3. validation humaine obligatoire de trois faits : terrasse, groupe de 22, livraison de glaçons ;
4. recalcul déterministe : 140 couverts, fourchette 135–146, confiance 84 % ;
5. trois arbitrages maximum, puis inscription des décisions au Journal.

Le formulaire et la note vocale sont deux présentations du même objet fictif. L'application ne capture aucun son et n'interprète aucun texte libre. `Réinitialiser` restaure l'état de 08:00.

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
- Signal terrain à contrôler sur la vue groupe.
- Dans le détail République, un graphique compact compare demande horaire et capacité d'équipe ; il ne constitue pas une nouvelle prévision.

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
- Sur mobile, chaque ligne devient une carte verticale afin d'éviter un tableau horizontal tronqué.

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
