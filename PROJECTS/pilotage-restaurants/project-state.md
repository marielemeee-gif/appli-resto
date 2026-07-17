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
- Le déploiement public n’est pas encore configuré.
- Le déploiement public nécessite le choix et la configuration d’un hébergeur après le push.

## Next actions

1. Enregistrer cette mise à jour d’état dans un petit commit de suivi après approbation.
2. Choisir et configurer l’hébergement de l’interface et de l’API fictive.
3. Vérifier le parcours sur le lien public avant partage.
