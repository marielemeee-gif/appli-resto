# Pilotage prédictif de restaurants

Prototype local d'aide à la décision pour un groupe fictif de trois restaurants. Le produit doit transformer des historiques simulés et des signaux locaux en prévisions explicables, recommandations actionnables et registre de valeur.

> État du dépôt : **phase 7 — prototype local revu, publication Git en attente**. Toutes les valeurs et décisions sont fictives.

## Commencer ici

1. Lire [`AGENTS.md`](AGENTS.md), qui contient les règles permanentes du projet.
2. Lire [`PLANS.md`](PLANS.md), qui décrit les phases et le format du plan d'exécution.
3. Parcourir les documents numérotés dans [`docs/`](docs/).
4. Consulter [`references/ETUDE_COMPLETE.md`](references/ETUDE_COMPLETE.md) et le PDF associé pour le contexte et la direction visuelle.
5. Utiliser [`PROMPT_INITIAL_CODEX.md`](PROMPT_INITIAL_CODEX.md) pour préparer la phase 1.

## Documentation

| Document | Objet |
| --- | --- |
| `docs/00_PRODUCT_BRIEF.md` | Vision, utilisateurs et démonstration de référence |
| `docs/01_PROTOTYPE_SCOPE.md` | Périmètre P0/P1 et contraintes |
| `docs/02_DATA_SIMULATION.md` | Données fictives, scénarios et reproductibilité |
| `docs/03_API_CONTRACTS.md` | Contrats HTTP proposés |
| `docs/04_FORECASTING_AND_RULES.md` | Prévision, abstention et recommandations |
| `docs/05_UX_SCREENS.md` | Parcours, écrans et accessibilité |
| `docs/06_ACCEPTANCE_TESTS.md` | Critères d'acceptation métier et techniques |
| `docs/09_UX_IMPLEMENTATION.md` | Écrans réalisés, principes d’interface, contrôles et limites |
| `docs/10_INTEGRATION_DEMO.md` | Parcours guidé, décisions locales, contrôles et limites de publication |
| `docs/11_FINAL_REVIEW.md` | Revue de sécurité, reproductibilité et préparation à la publication |

## Architecture cible proposée

La phase 0 propose un monorepo avec une interface Next.js/TypeScript, une API FastAPI/Python, des contrats versionnés et des données de démonstration locales. Cette architecture doit être validée avant la création du squelette exécutable.

## Principes non négociables

- Données uniquement fictives et reproductibles avec une graine fixe.
- Aucune fuite de données futures dans les prévisions ou backtests.
- Prévisions accompagnées d'une fourchette, de facteurs et d'un niveau de confiance traçable.
- Recommandations déterministes, explicables, révocables et jamais exécutées automatiquement.
- Aucun secret dans Git ; les futures variables d'environnement auront un fichier d'exemple.

## Lancement local

Prérequis : Node.js 24, pnpm 11.9 et Python 3.12.

```bash
cp .env.example .env
pnpm install --frozen-lockfile
python3.12 -m venv .venv
.venv/bin/python -m pip install -e 'apps/api[dev]'
```

Dans deux terminaux :

```bash
pnpm dev:web
pnpm dev:api
```

L’interface est disponible sur `http://localhost:3000` et la santé de l’API sur `http://127.0.0.1:8000/health`. Les routes de démonstration sont `/cockpit`, `/briefing`, `/multisites`, `/roi` et `/diagnostic`.

Contrôles complets :

```bash
pnpm check
```

## Données de démonstration

Générer les 24 mois d’historique et les six scénarios :

```bash
pnpm generate:data
```

La génération produit environ 36 Mo dans `data/generated/`, séparés entre données observables et vérité simulée. Le dossier est ignoré par Git et peut être recréé à partir de la graine `20260717`. Voir [`data/README.md`](data/README.md).

Endpoints disponibles après lancement de l’API :

- `GET /demo/scenarios` et `POST /demo/scenarios/{scenario_id}/activate` ;
- `GET /sites` et `GET /sites/{site_id}` ;
- `GET /mock/weather`, `/mock/events`, `/mock/calendar` et `/mock/roadworks`.
- `GET /forecasts?site_id=&from=&to=` et `GET /backtests/current`.
- `GET /briefings/{service_id}`, `GET /recommendations/{id}` et `GET /dispatch`.

Produire les rapports de backtest :

```bash
pnpm backtest:data
```

## Statut

Les phases 1 à 7 fournissent le prototype local complet et revu. Le prochain jalon est le premier commit contrôlé, sa publication GitHub, puis le déploiement donnant un lien public.
