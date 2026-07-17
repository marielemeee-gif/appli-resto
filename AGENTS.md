# Instructions permanentes du prototype

## Mission

Construire un prototype démontrable d'aide à la décision pour des groupes de restaurants urbains. Le produit transforme des données de caisse et des signaux locaux en :

1. prévision de couverts et de chiffre d'affaires par service ;
2. besoin d'effectif par rôle ;
3. recommandations de préparation et d'achat ;
4. alertes avec une heure limite de décision ;
5. replanification entre établissements ;
6. registre des décisions et du gain estimé.

## Règle principale

Le produit ne doit pas être présenté comme un simple tableau de bord ou une « IA magique ». Chaque résultat important doit indiquer :

- ce qui a changé ;
- la fourchette de prévision ;
- les facteurs principaux ;
- l'action possible ;
- son heure limite ;
- le gain ou le risque estimé ;
- le niveau de confiance.

## Travail par phases

- Lire `PLANS.md` avant toute modification.
- Pour une phase complexe, produire ou actualiser un plan d'exécution avant de coder.
- Ne réaliser qu'une phase validée à la fois.
- À la fin de chaque phase : lancer les vérifications, résumer les changements, montrer le résultat et demander la validation de la suite.
- Ne pas élargir silencieusement le périmètre.

## Périmètre du prototype

Le prototype utilise trois établissements fictifs d'un même groupe, des services déjeuner/dîner et vingt-quatre mois de données simulées. Il doit fonctionner localement et sans compte externe obligatoire.

Fonctions prioritaires :

- génération déterministe de données avec une graine ;
- API simulées de météo, événements, circulation et calendrier ;
- prévision simple et reproductible avec référence historique ;
- intervalle d'incertitude ;
- règles explicables d'effectif, préparation et achats ;
- cockpit quotidien responsive ;
- briefing et alerte ;
- vue multi-sites ;
- validation ou refus d'une recommandation ;
- registre du ROI.

## Hors périmètre initial

- paiement et abonnement réels ;
- authentification de production ou gestion complexe des rôles ;
- connecteurs réels vers toutes les caisses ;
- données réelles de salariés ou de clients ;
- planning juridiquement complet ;
- commande fournisseur automatique ;
- promotion automatique ;
- application mobile native ;
- mise en production publique ;
- modèle de langage utilisé comme moteur numérique de prévision.

## Architecture recommandée à challenger dans le plan

- interface : Next.js, TypeScript et composants accessibles ;
- service de données et de prévision : Python et FastAPI ;
- stockage du prototype : SQLite ou fichiers structurés, selon le compromis le plus simple ;
- données simulées : scripts Python avec graine fixe ;
- contrats : schémas JSON/Pydantic partagés et documentés ;
- tests : tests unitaires de la simulation et des règles, tests d'API, puis tests des parcours critiques.

Codex peut proposer une architecture plus simple si elle couvre les critères d'acceptation et réduit réellement le risque.

## Principes de données et de prévision

- Séparer les données « vraies » de simulation des données visibles par le modèle.
- Empêcher toute fuite d'information future dans le backtest.
- Commencer par une référence simple : moyenne pondérée des mêmes services passés.
- Un modèle plus complexe n'est accepté que s'il bat cette référence sur les scénarios de test.
- Afficher une fourchette plutôt qu'un nombre artificiellement exact.
- S'abstenir lorsque l'historique, la qualité des données ou la confiance sont insuffisants.
- Garder les recommandations critiques déterministes, auditables et testables.

## Principes UX

- Interface en français.
- Lecture prioritaire sur ordinateur, mais responsive sur mobile.
- Une vue quotidienne doit pouvoir être comprise en moins de deux minutes.
- Trois décisions prioritaires maximum par service.
- L'utilisateur doit pouvoir valider, modifier ou refuser chaque recommandation.
- Toujours prévoir les états chargement, vide, erreur, données incomplètes et confiance faible.
- Reprendre l'esprit graphique du PDF de référence sans copier une marque existante.

## Sécurité et confidentialité

- N'utiliser que des données fictives dans le prototype.
- Ne jamais ajouter de secrets au dépôt.
- Fournir un fichier d'exemple pour toute variable d'environnement.
- Éviter les dépendances externes inutiles.
- Toute intégration réelle future devra faire l'objet d'une phase dédiée de sécurité et de conformité.

## Qualité et définition de « terminé »

Une phase n'est terminée que lorsque :

- le comportement correspond aux critères d'acceptation ;
- les tests pertinents passent ;
- le lint, le formatage et le contrôle de types passent ;
- les données restent reproductibles avec la même graine ;
- les décisions sont explicables ;
- les erreurs et limites sont visibles ;
- les commandes de lancement sont documentées ;
- le diff a été relu pour les régressions et les changements hors périmètre.

## Interdictions

- Ne pas remplacer les données simulées par des appels réseau sans validation.
- Ne pas fabriquer de précision ou de ROI non traçable.
- Ne pas masquer une erreur par des données de secours silencieuses.
- Ne pas automatiser une décision métier irréversible.
- Ne pas supprimer ou réécrire une partie validée sans expliquer le besoin.

