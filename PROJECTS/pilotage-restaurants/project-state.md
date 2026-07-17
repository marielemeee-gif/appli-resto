# Pilotage restaurants — état du projet

## Current goal

Publier un prototype démontrable de pilotage prédictif de trois restaurants fictifs, puis préparer un lien public simple à partager.

## Latest user ask

Sauvegarder tout l’état avant de redémarrer Codex, afin de reprendre ensuite une refonte de la démonstration publique.

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

Prototype local terminé et publié. Le service Render utilise le commit `7aea520` et répond sur `https://pilotage-restaurants.onrender.com/`.

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
- L’optimisation du commit `7aea520` est déployée : `/health` répond en 0,2–0,5 seconde et le briefing public en 0,92 seconde lors de la vérification finale.
- Retour utilisateur à traiter : la page « Pourquoi cette prévision ? » semble cassée, la démonstration manque d’exemples fictifs visibles et le design n’est pas assez premium.
- Diagnostic confirmé : l’API fonctionne, mais l’écran affiche Liberté avec un sélecteur République, expose les codes techniques `abstain` et `low_data_quality`, explique surtout une abstention et conserve des cartes d’états ressemblant à des placeholders.

## Next actions

1. Préparer une phase de refonte UX en reprenant le PDF premium comme direction visuelle.
2. Corriger le diagnostic : site cohérent, libellés français, facteurs, fourchette, confiance et qualité expliqués visuellement.
3. Ajouter une galerie des six scénarios fictifs et quelques exemples illustratifs clairement marqués « fictifs, non calculés ».
4. Revoir cockpit, briefing, multi-sites et ROI avec une identité plus chaleureuse, de meilleurs graphiques et une hiérarchie plus riche.
5. Tester puis redéployer sans introduire de donnée réelle.
