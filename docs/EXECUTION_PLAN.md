# Plan d’exécution du prototype

Statut : **phase 7 réalisée — publication Git approuvée**
Date de cadrage : 17 juillet 2026

## 1. Résultat de la phase

La phase 0 doit produire un plan suffisamment précis pour construire ensuite, par incréments vérifiables, une démonstration locale du copilote de replanification. La démonstration fera comprendre en moins de deux minutes ce qui va se passer, ce qui a changé, ce qui peut encore être décidé, avant quelle heure et avec quel gain ou risque estimé.

Le résultat visible de la phase 1 sera volontairement minimal : une page d’accueil technique en français et un endpoint `GET /health`, démarrables localement et couverts par les contrôles de base. Aucune donnée simulée ni logique métier ne sera encore implémentée.

## 2. Hypothèses et décisions

### 2.1 Confirmé par les documents

- Le prototype représente un groupe fictif de trois établissements à Bordeaux : République, Liberté et Gare.
- Il couvre les services déjeuner et dîner et vingt-quatre mois de données fictives.
- La graine de démonstration de référence est `20260717`.
- La démonstration fonctionne localement, sans compte externe, appel réseau ni donnée personnelle.
- La prévision numérique, les règles de recommandation et l’explication sont trois responsabilités séparées.
- La référence historique simple reste visible et gagne par défaut si le modèle enrichi ne la bat pas.
- Une prévision comporte une fourchette, des facteurs, une confiance traçable, un instant de calcul et un instant de coupure des données.
- Une recommandation est une proposition explicable, limitée dans le temps, que le manager peut valider, modifier ou refuser.
- Aucune commande, promotion ou modification de planning n’est exécutée automatiquement.
- Les quatre vues essentielles sont le cockpit, le briefing/alerte, la vue multi-sites et le registre ROI ; un diagnostic peut être un panneau secondaire.

### 2.2 Architecture proposée

- Monorepo avec une interface Next.js/TypeScript et une API Python/FastAPI.
- Node.js 24 LTS épinglé pour le web ; Python 3.12 épinglé pour l’API et la simulation.
- `pnpm` workspaces côté JavaScript, avec la version 11.9 fournie par le runtime Codex.
- Environnement Python standard `.venv` et dépendances déclarées dans `pyproject.toml`; un verrou reproductible sera choisi pendant la phase 1 sans imposer `uv`, absent de l’environnement.
- SQLite pour les décisions, versions de prévision et résultats ; fichiers JSON versionnés pour la configuration et NDJSON ou Parquet généré pour les séries simulées. Le format final des séries reste à valider.
- FastAPI produit le contrat OpenAPI. Le client web consomme des types générés à partir de ce contrat afin d’éviter deux définitions divergentes.
- Tous les calculs métier résident côté API. L’interface n’embarque aucune constante de prévision ou de ROI.
- Les futures API externes sont représentées par des ports/adaptateurs locaux ; aucun appel réseau n’est nécessaire aux tests ni à la démonstration.

### 2.3 Décisions encore ouvertes

1. Le prototype doit-il optimiser en P0 les trois familles — personnel, préparation et achats — ou rendre le personnel complet et les deux autres plus démonstratives ?
2. Le transfert multi-sites doit-il couvrir uniquement le personnel, ou aussi le stock court dès le prototype ?
3. Les données générées doivent-elles privilégier JSON/NDJSON, facile à inspecter, ou Parquet, plus adapté aux séries mais moins lisible sans outil ?
4. La première démonstration doit-elle être fidèle visuellement aux maquettes PDF ou privilégier d’abord la preuve métier avec un habillage plus léger ?
5. Faut-il simuler uniquement l’usage sans authentification, ou montrer aussi un sélecteur fictif de rôle responsable/manager ?
6. Quelle est la date ou la durée cible de la démonstration ? Cette réponse détermine si les phases 2 à 6 peuvent toutes rester dans le P0.

### 2.4 Arbitrage de périmètre recommandé

Le P0 documenté est ambitieux : simulation complète, prévision, effectifs, préparation, achats, alertes, dispatch, décisions, ROI et cinq vues. Pour conserver une démonstration crédible, le chemin critique recommandé est :

1. prévision couverts/CA et abstention ;
2. recommandations d’effectif ;
3. fenêtre d’action ;
4. transfert de personnel entre sites ;
5. registre des décisions et ROI traçable.

La préparation et les achats restent dans la démonstration, mais avec quelques familles et règles simples. Le transfert de stock, les promotions, le simulateur « Et si ? », les notifications réelles, les connecteurs, l’authentification et tout déploiement public restent hors du P0.

## 3. Architecture et flux

### 3.1 Composants

```text
Configuration de scénario + graine
                │
                ▼
      Générateur déterministe
      ├── observed/       connu à l’instant de décision
      └── ground_truth/   résultat réel simulé, masqué jusqu’au service
                │
                ▼
┌──────────────────── API FastAPI ────────────────────┐
│ Adaptateurs simulés → qualité/normalisation         │
│                     → référence + prévision         │
│                     → règles et contraintes         │
│                     → décisions + résultats + ROI   │
└──────────────────────────┬───────────────────────────┘
                           │ JSON / OpenAPI
                           ▼
┌──────────────────── Interface Next.js ──────────────┐
│ Cockpit │ Briefing/alerte │ Multi-sites │ ROI       │
│             Diagnostic et scénarios locaux          │
└──────────────────────────────────────────────────────┘
```

### 3.2 Frontières obligatoires

- **Simulation** : produit le monde fictif complet, puis publie seulement ce qui est observable à un instant donné.
- **Normalisation/qualité** : détecte doublons, incohérences, fraîcheur et valeurs manquantes ; elle ne remplace rien silencieusement.
- **Prévision** : calcule référence, estimation, intervalle, facteurs et confiance ; elle peut s’abstenir.
- **Recommandation** : transforme une prévision en action sous contraintes et avec échéance ; elle ne recalcule pas la demande.
- **Explication** : met en forme uniquement des champs structurés ; aucun LLM n’est requis dans le prototype.
- **Décision/ROI** : conserve recommandation, choix du manager, formule, hypothèses, résultat simulé et gain observé séparément.
- **Interface** : présente les résultats et états ; elle ne fabrique aucune valeur métier.

### 3.3 Formats et conventions

- JSON en `snake_case` sur l’API.
- Dates et heures ISO 8601 avec fuseau `Europe/Paris`.
- Montants entiers en centimes et devise explicite.
- Identifiants stables, sans dépendance à un libellé affiché.
- Chaque prévision porte `generated_at`, `data_cutoff`, `model_version`, `scenario_id` et les données de qualité utilisées.
- Chaque recommandation porte sa prévision source, les contraintes évaluées, son échéance et les formules de gain.
- Les données générées restent hors Git ; seules graines, configurations et petites fixtures sont versionnées.

### 3.4 Persistance

- `data/config/` : sites, capacités, horaires, rôles, recettes simplifiées et scénarios.
- `data/generated/observed/` : instantanés disponibles à chaque coupure.
- `data/generated/ground_truth/` : réalité simulée révélée après le service.
- SQLite : versions de prévision, recommandations, décisions, résultats et lignage du ROI.
- La base est recréable intégralement depuis la graine et la configuration ; elle n’est jamais la seule source d’une donnée de démonstration.

### 3.5 Direction visuelle confirmée par le PDF

- Fond très clair, structure bleu nuit, signaux vert pétrole, échéances ambre et rouge réservé aux risques réels.
- Cockpit desktop : indice d’activité, trois KPI, histogramme sur sept jours et trois décisions maximum.
- Briefing mobile : une information par carte, action et échéance toujours visibles, sans défilement horizontal.
- Multi-sites : comparaison de trois cartes et une seule proposition de transfert très lisible.
- ROI : distinction visible entre estimé et observé, agrégats reliables aux décisions.
- La maquette est une direction, pas un contrat pixel-perfect ; accessibilité, états dégradés et traçabilité peuvent modifier la composition.

## 4. Fichiers concernés

Arborescence cible, créée progressivement :

```text
.
├── .github/
│   ├── workflows/ci.yml
│   ├── ISSUE_TEMPLATE/
│   └── pull_request_template.md
├── apps/
│   ├── api/
│   │   ├── pyproject.toml
│   │   ├── src/pilotage_api/
│   │   │   ├── main.py
│   │   │   ├── settings.py
│   │   │   └── health.py
│   │   └── tests/test_health.py
│   └── web/
│       ├── package.json
│       ├── next.config.ts
│       ├── tsconfig.json
│       ├── app/
│       │   ├── layout.tsx
│       │   └── page.tsx
│       └── tests/home.spec.ts
├── data/
│   ├── config/
│   ├── fixtures/
│   └── generated/
├── docs/
│   ├── 00_PRODUCT_BRIEF.md … 06_ACCEPTANCE_TESTS.md
│   ├── EXECUTION_PLAN.md
│   ├── ARCHITECTURE.md
│   └── decisions/
├── packages/
│   └── api-client/
├── scripts/
├── tests/
│   └── acceptance/
├── .env.example
├── .nvmrc
├── AGENTS.md
├── package.json
├── PLANS.md
└── README.md
```

Phase 1 ne crée que les fichiers nécessaires au squelette, à la santé, au rendu technique et aux contrôles. Les répertoires `data`, moteurs métier et scénarios sont créés dans les phases suivantes.

## 5. Étapes d’implémentation

### Phase 0 — cadrage et architecture

1. Lire et comparer tous les documents et les quatre maquettes.
2. Inspecter les outils locaux sans installer de dépendance.
3. Documenter les zones floues, décisions et architecture proposée.
4. Valider le périmètre et la phase 1 avant tout code.

### Phase 1 — squelette exécutable

1. Épingler Node 24 LTS et Python 3.12 ; documenter les prérequis sans modifier globalement la machine.
2. Initialiser le workspace racine et `apps/web` en TypeScript strict.
3. Créer une page d’accueil technique en français indiquant clairement « données fictives » et l’état des services.
4. Initialiser `apps/api` avec configuration typée et `GET /health`.
5. Ajouter `.env.example` sans secret et valider au démarrage les variables attendues.
6. Ajouter les commandes racine de développement et de contrôle.
7. Ajouter les tests minimaux web/API et la CI équivalente.
8. Vérifier le démarrage local, documenter les commandes et s’arrêter.

### Phase 2 — simulation et adaptateurs

1. Définir les schémas et configurations des trois sites.
2. Générer vingt-quatre mois avec la graine `20260717`.
3. Séparer `observed` et `ground_truth`.
4. Implémenter les six scénarios obligatoires.
5. Exposer les adaptateurs météo, événements, calendrier et travaux simulés.
6. Prouver reproductibilité, cohérence et absence de futur observable.

Résultat du 17 juillet 2026 : les six scénarios génèrent chacun 4 428 services, soit 730 jours historiques, la date de coupure et sept jours futurs pour trois sites et deux services. Les fichiers observés et la vérité simulée sont séparés, accompagnés d’un manifeste SHA-256. Les adaptateurs météo, événements, calendrier et travaux filtrent les données selon leur date de publication.

### Phase 3 — prévision et backtest

1. Implémenter la moyenne pondérée de services comparables.
2. Ajouter les corrections autorisées et une méthode enrichie simple.
3. Produire intervalle, facteurs, qualité et abstention.
4. Réaliser un backtest glissant strictement chronologique.
5. Garder la référence lorsqu’elle est meilleure.

Résultat du 17 juillet 2026 : la référence pondérée expose ses huit services comparables et respecte la coupure temporelle. La méthode enrichie utilise principalement le rythme de réservation, puis des facteurs événement, météo et travaux publiés à temps. Le backtest sur 84 jours compare MAE, WAPE et couverture d’intervalle ; l’enrichissement réduit le WAPE fictif d’environ 6,5 % à 2,4 %. Le scénario de données dégradées s’abstient localement.

### Phase 4 — recommandations

1. Calculer les besoins d’effectif par rôle.
2. Ajouter préparation et achats sur quelques familles fiables.
3. Produire fenêtres d’action, contraintes et gain estimé.
4. Ajouter le dispatch de personnel entre sites.
5. Prouver que toute action reste une proposition.

Résultat du 17 juillet 2026 : les règles d’effectif, préparation et achats produisent au maximum trois propositions par briefing avec formule, hypothèses, échéance et contraintes. Une action expirée disparaît et une abstention ne produit aucune recommandation précise. Le scénario multi-sites transfère un serveur de République vers Liberté sans dégrader la source ; un rôle incompatible bloque la proposition. Toutes les sorties conservent le statut `proposal` et aucun système externe n’est appelé.

### Phase 5 — expérience utilisateur

1. Construire le cockpit et ses états dégradés.
2. Construire briefing/alerte responsive.
3. Construire vue multi-sites et validation de transfert.
4. Construire registre ROI et diagnostic.
5. Vérifier clavier, contrastes, zoom 200 %, mobile et réduction des animations.

Résultat du 17 juillet 2026 : cockpit, briefing, vue multi-sites, registre ROI et diagnostic sont disponibles comme routes statiques navigables. Les fixtures sont explicitement fictives et isolées ; le branchement API reste réservé à la phase 6. La structure sémantique, le lien d’évitement, les focus visibles et les adaptations responsive sont en place. Les contrôles automatiques passent ; la revue manuelle complète clavier, contraste, zoom et mobile sera rejouée après intégration des données.

### Phase 6 — intégration et démonstration

1. Relier tous les écrans à l’API sans constantes cachées.
2. Enregistrer validation, modification et refus.
3. Rejouer A1 à A15 avec les scénarios nommés.
4. Préparer un parcours guidé de moins de dix minutes.

Plan validé le 17 juillet 2026 : l’interface appellera l’API FastAPI via `NEXT_PUBLIC_API_URL` et activera explicitement le scénario fictif adapté à chaque parcours. Les décisions seront enregistrées dans un registre JSON local, protégé contre les écritures concurrentes et recréable ; aucune action externe n’en découlera. Les réponses conserveront recommandation, décision choisie, motif, date et gain estimé séparés. Les écrans afficheront chargement, erreur et résultat, sans repli silencieux vers les fixtures de phase 5.

Résultat du 17 juillet 2026 : cockpit, briefing, multi-sites, ROI et diagnostic consomment l’API fictive. Les actions accepter, modifier et refuser sont persistées localement, les doublons et échéances sont contrôlés, et le gain observé reste explicitement absent. Le parcours concert → décision → ROI, le transfert multi-sites et l’abstention ont été rejoués.

### Phase 7 — revue finale

1. Exécuter tous les contrôles.
2. Auditer absence de secrets et de données réelles.
3. Vérifier limites, abstentions et formules ROI.
4. Relire le diff, documenter le lancement et les limites.

Plan du 17 juillet 2026 : exécuter la chaîne complète, rechercher secrets et artefacts lourds, repartir d’un registre vide, relire les frontières simulation/prévision/recommandation/interface et préparer un rapport de sortie. La publication Git fera l’objet du contrôle séparé prévu par la procédure `git-commit-push` : liste exacte des fichiers, message approuvé, commit vérifié, puis push seulement après configuration du dépôt distant.

Résultat du 17 juillet 2026 : la chaîne complète passe, l’audit de dépendances ne remonte aucune vulnérabilité connue après correction de PostCSS, aucun secret ni donnée personnelle n’a été détecté et le registre est vide. Le rapport final est disponible dans `docs/11_FINAL_REVIEW.md`. La seule étape restante est externe : approuver le premier commit, configurer le remote GitHub et pousser.

## 6. Vérifications

### 6.1 Phase 1 — commandes envisagées

Avec Node 24, pnpm 11.9 et Python 3.12 disponibles :

```bash
pnpm install --frozen-lockfile
pnpm dev:web
pnpm lint:web
pnpm typecheck:web
pnpm test:web

python3.12 -m venv .venv
.venv/bin/python -m pip install -e 'apps/api[dev]'
.venv/bin/python -m ruff check apps/api
.venv/bin/python -m mypy apps/api/src
.venv/bin/python -m pytest apps/api
```

Commandes agrégées envisagées à la racine :

```bash
pnpm check
pnpm dev:web
pnpm dev:api
```

### 6.2 Preuves attendues en phase 1

- Test API : `GET /health` renvoie `200`, version et état, sans dépendance externe.
- Test web : la page d’accueil affiche le statut technique et la mention de données fictives.
- Contrôle TypeScript strict et mypy sans erreur.
- Lint/formatage web et Python sans erreur.
- Démarrage documenté depuis un clone neuf.
- Vérification manuelle desktop et mobile de la page technique.

### 6.3 Stratégie de tests globale

- Unitaires : génération, invariants, confiance, abstention, règles, échéances et ROI.
- API : schémas, codes métier, scénario actif, décisions expirées et idempotence.
- Chronologie : impossibilité d’utiliser une observation postérieure à `data_cutoff`.
- Contrats : compatibilité OpenAPI/client web.
- Parcours : scénario concert, annulation, transfert, abstention et registre.
- Visuel/accessibilité : quatre vues principales aux tailles desktop/mobile, clavier et contraste.
- Reproductibilité : deux générations de même graine comparées par empreinte.

## 7. Risques et solutions de repli

- **Périmètre trop large** : privilégier prévision, effectif, fenêtre d’action, dispatch personnel et ROI ; réduire achats à une démonstration bornée.
- **Données incohérentes** : invariants bloquants et rapport de qualité ; jamais de correction silencieuse.
- **Fuite temporelle** : couche d’accès imposant `data_cutoff`, fixtures piégées et tests négatifs.
- **Prévision trop précise** : intervalle calibré, référence visible et abstention.
- **Modèle enrichi moins bon** : sélection par segment ou retour à la référence.
- **API simulée irréaliste** : dates d’émission, horizons, versions, erreurs et données manquantes déterministes.
- **Règle inexécutable** : évaluer rôle, horaire, trajet, stock et délai avant création de la recommandation.
- **ROI invérifiable** : stocker séparément estimation, formule, décision, résultat et gain observé.
- **Interface trompeuse** : montrer ensemble fourchette, confiance, cause, échéance et droit de refus.
- **Double stack trop coûteuse** : repli possible vers FastAPI servant une interface statique, seulement si la phase 1 montre un coût disproportionné.
- **Versions locales inadéquates** : versions épinglées et documentation ; aucune dépendance à Node 25 ou Python 3.9 pour la reproductibilité.
- **PDF non accessible** : ne pas copier aveuglément la maquette ; fournir sémantique HTML, alternatives textuelles et états non fondés uniquement sur la couleur.

## 8. Critères de sortie

### Phase 0

- Tous les documents et les quatre maquettes ont été examinés.
- L’environnement a été inspecté sans installation de dépendance.
- Les contradictions, propositions et décisions ouvertes sont explicites.
- L’architecture et la phase 1 sont validées humainement.

### Phase 1

- La page technique et `GET /health` fonctionnent localement.
- Tests, lint, formatage et types passent avec les commandes documentées.
- Aucun secret, appel externe, donnée réelle ni logique métier prématurée n’est présent.
- Le démarrage est reproductible depuis un clone neuf.
- La phase s’arrête avant la simulation et attend une nouvelle validation.

Preuves du 17 juillet 2026 : `pnpm check` passe intégralement, le build Next.js produit la route `/`, l’API répond `200` sur `/health` avec `data_status: not_initialized`, et les deux services ont été démarrés localement.

### Traçabilité des critères A1 à A15

Chaque critère reçoit ultérieurement un test ou une preuve nommée. A1, A2 et A14 sont traités aux phases 2-3 ; A3, A4, A8 et A9 en phase 3 ; A5, A6, A7, A10-A12 en phase 4 ; A13 en phase 5 ; A15 en phase 6.

---

**Point de sortie :** le commit et le push Git sont approuvés ; le déploiement public reste une action externe séparée.
