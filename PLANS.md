# Format du plan d'exécution

Avant de coder, Codex doit créer `docs/EXECUTION_PLAN.md` en utilisant la structure ci-dessous.

## 1. Résultat de la phase

Décrire le résultat visible attendu en une à trois phrases.

## 2. Hypothèses et décisions

Lister les hypothèses retenues, les alternatives écartées et les décisions qui nécessitent une validation humaine.

## 3. Architecture et flux

Décrire :

- les composants ;
- la circulation des données ;
- les frontières entre simulation, prévision, recommandation et interface ;
- les formats échangés ;
- la stratégie de persistance.

## 4. Fichiers concernés

Donner l'arborescence à créer ou modifier et le rôle de chaque fichier important.

## 5. Étapes d'implémentation

Découper le travail en étapes courtes, vérifiables et ordonnées. Chaque étape doit produire un résultat testable.

## 6. Vérifications

Pour chaque étape, préciser :

- tests unitaires ;
- tests d'API ;
- contrôle des types et lint ;
- test de parcours ;
- vérification visuelle ;
- commande exacte envisagée.

## 7. Risques et solutions de repli

Inclure au minimum les risques de données incohérentes, fuite temporelle, prévision trop précise, API simulée irréaliste, règle inexécutable et interface trompeuse.

## 8. Critères de sortie

Reprendre les critères d'acceptation applicables et expliquer comment chacun sera prouvé.

## Phases prévues

### Phase 0 — cadrage et architecture

- Lire l'ensemble du dossier.
- Inspecter l'environnement disponible.
- Poser les questions bloquantes.
- Proposer l'architecture, l'arborescence et les commandes.
- Mettre à jour les contrats si nécessaire.
- S'arrêter avant toute création de code applicatif.

### Phase 1 — squelette exécutable

- Initialiser les projets retenus.
- Ajouter les commandes de développement, lint, types et tests.
- Créer uniquement une page d'accueil technique et un endpoint de santé.
- Prouver que l'ensemble démarre localement.

### Phase 2 — simulation des données et des API

- Générer les établissements, services et vingt-quatre mois d'historique.
- Simuler météo, événements, vacances, jours fériés et travaux.
- Produire plusieurs scénarios nommés et reproductibles.
- Exposer les données par des adaptateurs simulant les futures API.

### Phase 3 — prévision et backtest

- Implémenter la référence historique.
- Créer une prévision par site, date et service.
- Ajouter une fourchette et les facteurs principaux.
- Exécuter un backtest chronologique sans fuite du futur.
- Ajouter la possibilité de s'abstenir.

### Phase 4 — moteur de recommandations

- Transformer la prévision en besoin d'effectif.
- Produire préparation, achats et alertes avec heure limite.
- Ajouter la replanification multi-sites.
- Expliquer chaque règle et tester les contraintes.

### Phase 5 — expérience utilisateur

- Construire le cockpit quotidien.
- Construire le briefing et l'alerte.
- Construire la vue multi-sites.
- Construire le registre du ROI.
- Traiter les états dégradés et le responsive.

### Phase 6 — intégration et démonstration

- Relier les écrans aux API.
- Enregistrer validation, modification ou refus.
- Rejouer les scénarios d'acceptation.
- Préparer une démonstration guidée et des captures.

### Phase 7 — revue finale du prototype

- Lancer tous les contrôles.
- Vérifier les hypothèses et les limites affichées.
- Faire une revue du diff et de la sécurité.
- Documenter le lancement et les prochaines intégrations réelles.

