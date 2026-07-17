# Pilotage restaurants — état du projet

## Current goal

Publier un prototype démontrable de pilotage prédictif de trois restaurants fictifs, puis préparer un lien public simple à partager.

## Latest user ask

Transformer le site en véritable application de test : une seule galerie de scénarios, un lancement qui modifie toute l'application, des autres onglets vivants et cohérents, et une démo fictive autonome même si cela implique de simplifier l'API et les données.

## Agreed scope and approvals

- Phases 1 à 7 validées successivement.
- Phase 8 de refonte UX validée le 17 juillet 2026.
- Phase 9 validée le 17 juillet 2026 ; commit, push sur `main` et contrôle du redéploiement Render approuvés, avec exclusion de `prototype-use-cases/`.
- Phase 10 validée le 17 juillet 2026 ; commit, push sur `main` et contrôle du redéploiement Render approuvés, avec exclusion de `prototype-use-cases/`.
- Correctif `/valeur` et décisions de bar validé pour commit et push le 17 juillet 2026.
- Commit et push sur `main` approuvés le 17 juillet 2026, avec exclusion explicite de `prototype-use-cases/`.
- Message de commit approuvé : `Redesign fictional restaurant demo` avec le corps proposé.
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
- Direction visuelle validée : « brasserie éditoriale premium », avec ivoire chaud, encre, turquoise, safran et brique.
- Les six scénarios affichés proviennent des configurations fictives existantes ; aucun exemple chiffré non calculé n’a été ajouté.
- Les nombres, fourchettes, facteurs et recommandations du laboratoire viennent de l'API ; la question manager et l'action pédagogique portent la mention « illustration fictive - non calculée ».
- Responsive signifie ici desktop riche puis adaptation tablette/mobile, et non conception mobile prioritaire.
- L'étude initiale est préservée ; la révision est un nouveau PDF de 32 pages avec un addendum daté de quatre pages.
- Phase 10 proposée : les écrans publics utilisent des instantanés fictifs déterministes et un état partagé dans le navigateur ; l'API reste une preuve technique séparée.
- Le laboratoire devient l'unique sélecteur de scénario ; les autres pages montrent seulement le cas actif.
- Chaque scénario décisionnel doit croiser au moins trois paramètres et montrer référence, changement, contributions, heure limite et effet multi-sites éventuel.
- Le différenciateur à démontrer est la replanification sous contrainte de temps et l'orchestration entre établissements, pas un tableau de bord prédictif générique.

## Work completed

- Simulation de trois sites et six scénarios.
- Prévision, fourchettes, confiance, facteurs, backtest et abstention.
- Recommandations d’effectif, préparation, achats et transfert multi-sites.
- Cockpit, briefing, multi-sites, ROI et diagnostic connectés à l’API.
- Validation, modification et refus enregistrés localement.
- Revue finale, sécurité, documentation et parcours guidé.
- Refonte du socle visuel commun, de la navigation et des cinq routes métier.
- Diagnostic corrigé : prévision normale de République expliquée, puis abstention de Liberté séparée et traduite.
- Galerie des six scénarios fictifs et reproductibles ajoutée.
- Laboratoire `/scenarios` ajouté avec six boutons, calcul à la demande, abstention et transfert multi-sites.
- Scénario d'annulation corrigé pour être rejoué à 13:45, après publication de l'annulation.
- Source Markdown de l'étude complétée et PDF révisé généré.
- Phase 10 locale : six mondes fictifs complets, état partagé de session et laboratoire unique.
- Cockpit, Briefing, Établissements, Valeur et Explications synchronisés sur le scénario actif.
- Décisions de briefing et transfert multi-sites reliés au registre de valeur de la session.
- Police éditoriale remplacée par une sans-serif système plus adaptée à une application.
- Conflit public `/roi` identifié : la route API JSON masquait l'écran web ; navigation Valeur déplacée vers `/valeur`.
- Scénario concert recentré sur des décisions de bar réalistes : fûts à mettre en froid et glaçons à sécuriser.

## Current state

Le commit de phase 9 `872e5e8` est poussé sur `origin/main` et l'utilisateur indique l'avoir déployé manuellement sur Render. La phase 10 est terminée, vérifiée et validée ; sa publication Git est en cours.

## Touched files and artifacts

- Application : `apps/web`, `apps/api`.
- Configuration fictive : `data/config`.
- Documentation : `docs`, `README.md`, `AGENTS.md`, `PLANS.md`.
- Refonte UX : `apps/web/src/app/globals.css`, composants partagés, diagnostic et `scenario-gallery.tsx`.
- Références produit : `references`.
- Joueur : `apps/web/src/app/scenarios/page.tsx`, `apps/web/src/components/scenario-player.tsx` et styles responsive associés.
- Étude révisée : `references/ETUDE_COMPLETE.md`, `scripts/build_revised_study.py` et `output/pdf/Analyse_pilotage_predictif_restaurants_premium_revision.pdf`.
- Données générées et `data/decisions.json` exclus de Git.

## Validation run and result

- `pnpm check` réussi après la refonte.
- 6 tests web et 22 tests API réussis.
- Build des six routes Next.js réussi.
- Vérification visuelle réussie sur les cinq routes en desktop et le briefing en mobile, sans débordement horizontal.
- Vérification publique après déploiement : `/health`, `/cockpit`, `/briefing`, `/multisites`, `/roi` et `/diagnostic` répondent `200`.
- Le diagnostic public affiche « Six situations, toutes fictives » ; l’ancienne galerie « États prévus » a disparu.
- L’API publique renvoie `reservation_enriched`, 140 couverts, une fourchette 135–140 et deux recommandations pour le scénario concert.
- `pnpm audit --audit-level moderate` : aucune vulnérabilité connue.
- Recherche de secrets : aucun résultat.
- Phase 9 : `pnpm check` réussi avec 8 tests web et 22 tests API ; lint, types et build des neuf routes réussis.
- Rejeu API des six cas réussi : normal 96, concert 140, annulation 124 avec facteur -10, multi-sites 112 avec une proposition, abstention explicite et travaux 82.
- Responsive vérifié à 1280 px (trois colonnes, aucun débordement) et 390 px (une colonne, aucun débordement, boutons 48 px minimum).
- PDF révisé : 32 pages A4 ; texte extrait avec accents et quatre pages ajoutées inspectées visuellement sans coupure ni chevauchement.
- Phase 10 : 10 tests web et 22 tests API passent avec lint, types et build.
- Parcours navigateur réussi : sélectionner multi-sites, lancer le monde, simuler le transfert, puis retrouver la décision et le gain estimé fictif dans Valeur.
- Responsive : 1280 px en quatre colonnes et 390 px en une colonne, sans débordement horizontal.

## Blockers and open questions

- Aucun blocage technique restant.
- Le service public répond sur `https://pilotage-restaurants.onrender.com/`.
- Le parcours public est fonctionnel avec données et décisions fictives.
- L’optimisation du commit `7aea520` est déployée : `/health` répond en 0,2–0,5 seconde et le briefing public en 0,92 seconde lors de la vérification finale.
- Aucun blocage de publication restant pour la phase 8.
- Le dossier non suivi `prototype-use-cases/` préexistait ou appartient à l’utilisateur ; il reste hors du périmètre de la refonte et ne doit pas être ajouté sans validation explicite.
- La phase 9 n'est pas encore publique ; la démonstration Render affiche toujours la phase 8.

## Next actions

1. Faire valider la phase 10 locale, son niveau de réalisme et la nouvelle typographie.
2. Après validation explicite, commiter et pousser en excluant `prototype-use-cases/`.
3. Redéployer sur Render puis vérifier le laboratoire et les cinq vues publiques.
