# Pilotage restaurants — état du projet

## Current goal

Publier un prototype démontrable de pilotage prédictif de trois restaurants fictifs, puis préparer un lien public simple à partager.

## Latest user ask

Créer le premier commit du projet et le pousser vers `marielemeee-gif/appli-resto` après validation explicite (« go »).

## Agreed scope and approvals

- Phases 1 à 7 validées successivement.
- Données exclusivement fictives et reproductibles.
- API locale fictive, sans connecteur ni décision réelle.
- Premier commit et push GitHub approuvés le 17 juillet 2026.
- Message approuvé : `Build fictional restaurant steering prototype` avec le corps proposé.

## Decisions made

- Monorepo Next.js/TypeScript et FastAPI/Python.
- Simulation déterministe avec graine `20260717`.
- Prévision numérique, règles de recommandation et explication séparées.
- Registre JSON local pour les décisions de démonstration, ignoré par Git.
- Gain observé absent du prototype ; seuls les gains estimés fictifs sont affichés.

## Work completed

- Simulation de trois sites et six scénarios.
- Prévision, fourchettes, confiance, facteurs, backtest et abstention.
- Recommandations d’effectif, préparation, achats et transfert multi-sites.
- Cockpit, briefing, multi-sites, ROI et diagnostic connectés à l’API.
- Validation, modification et refus enregistrés localement.
- Revue finale, sécurité, documentation et parcours guidé.

## Current state

Prototype local terminé et publié. `main` suit `origin/main`, tous deux sur le commit `0c6eddc` dans `marielemeee-gif/appli-resto`.

## Touched files and artifacts

- Application : `apps/web`, `apps/api`.
- Configuration fictive : `data/config`.
- Documentation : `docs`, `README.md`, `AGENTS.md`, `PLANS.md`.
- Références produit : `references`.
- Données générées et `data/decisions.json` exclus de Git.

## Validation run and result

- `pnpm check` réussi.
- 5 tests web et 22 tests API réussis.
- Build des six routes Next.js réussi.
- `pnpm audit --audit-level moderate` : aucune vulnérabilité connue.
- Recherche de secrets : aucun résultat.

## Blockers and open questions

- Aucun blocage Git restant.
- Le service public répond sur `https://pilotage-restaurants.onrender.com/`.
- Le parcours public est fonctionnel avec données et décisions fictives.
- Une optimisation pré-calculant les backtests est prête ; elle réduit localement briefing et prévisions d’environ 26 secondes à moins de 0,05 seconde hors réveil Render.

## Next actions

1. Approuver, committer et pousser l’optimisation des backtests.
2. Lancer un déploiement manuel du dernier commit dans Render (`autoDeploy` est désactivé).
3. Rejouer le parcours public et partager le lien.
