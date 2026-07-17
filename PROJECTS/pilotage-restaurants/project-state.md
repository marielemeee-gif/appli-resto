# Pilotage restaurants — état du projet

## Current goal

Publier un prototype démontrable de pilotage prédictif de trois restaurants fictifs, puis préparer un lien public simple à partager.

## Latest user ask

Rendre les six cas réellement jouables, améliorer l'UX avec davantage de contenu fictif explicitement identifié, conserver une expérience riche sur ordinateur et responsive sur mobile, puis réviser le document d'analyse initial.

## Agreed scope and approvals

- Phases 1 à 7 validées successivement.
- Phase 8 de refonte UX validée le 17 juillet 2026.
- Phase 9 validée le 17 juillet 2026 ; commit, push sur `main` et contrôle du redéploiement Render approuvés, avec exclusion de `prototype-use-cases/`.
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

## Current state

La phase 8 reste publiée sur `https://pilotage-restaurants.onrender.com/`. La phase 9 est terminée, vérifiée et validée ; sa publication sur `main` et Render est en cours.

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

## Blockers and open questions

- Aucun blocage technique restant.
- Le service public répond sur `https://pilotage-restaurants.onrender.com/`.
- Le parcours public est fonctionnel avec données et décisions fictives.
- L’optimisation du commit `7aea520` est déployée : `/health` répond en 0,2–0,5 seconde et le briefing public en 0,92 seconde lors de la vérification finale.
- Aucun blocage de publication restant pour la phase 8.
- Le dossier non suivi `prototype-use-cases/` préexistait ou appartient à l’utilisateur ; il reste hors du périmètre de la refonte et ne doit pas être ajouté sans validation explicite.
- La phase 9 n'est pas encore publique ; la démonstration Render affiche toujours la phase 8.

## Next actions

1. Commiter les douze fichiers approuvés en excluant `prototype-use-cases/`, puis pousser sur `main`.
2. Attendre le redéploiement Render et vérifier `/scenarios` ainsi que les six calculs publics.
3. Enregistrer le commit et les preuves publiques après succès.
