# Pilotage restaurants — état du projet

## Current goal

Publier un prototype démontrable de pilotage prédictif de trois restaurants fictifs, puis préparer un lien public simple à partager.

## Latest user ask

Réduire les répétitions entre onglets, organiser l'application autour de tâches opérationnelles, rendre les scénarios consultables sans modifier l'application, permettre une décision libre et préparer son partage SMS ou WhatsApp.

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
- Phase 11 proposée : un seul fournisseur fictif, deux références de bar, brouillon de commande puis confirmation de démonstration obligatoire.
- Aucune commande réelle ni appel externe ne doit être envoyé ; le registre conserve uniquement une trace fictive.
- L'ancien onglet « Aujourd'hui » devient « Tableau de bord » ; il concentre quatre vigies opérationnelles et conserve trois décisions maximum.
- Phase 12 : quatre destinations seulement — Tableau de bord, Décisions, Établissements et Journal.
- Les scénarios sont des aperçus fictifs dans une fenêtre ; les consulter ou la fermer ne modifie jamais l'application.
- L'explication détaillée quitte la navigation et s'ouvre depuis la prévision du Tableau de bord.
- Une décision libre peut être affectée à un responsable avec une heure limite puis inscrite au Journal.
- SMS et WhatsApp sont ouverts via des liens natifs avec message prérempli ; aucun contact n'est stocké et aucun envoi n'est automatique.
- Phases 11 et 12 validées par l'utilisateur le 17 juillet 2026 ; commit et push vers `origin/main` explicitement autorisés.
- Message de commit approuvé : `Simplify restaurant operations workflow` avec le corps proposé.

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
- Phase 11 locale : systèmes tiers horodatés, catalogue fournisseur fictif de deux références, brouillon puis confirmation humaine simulée.
- Tableau de bord enrichi avec météo, événement, échéance anonyme de contrat et cutoff fournisseur, synchronisés avec chacun des six scénarios.
- Navigation simplifiée à quatre tâches et ancienne route mutante des scénarios neutralisée.
- Anciennes routes `/diagnostic` et `/scenarios` redirigées vers `/cockpit` afin d'éviter tout écran parallèle résiduel.
- Tableau de bord élagué : résumé de prévision, détail du calcul repliable, vigies et raccourci vers les décisions.
- Décisions élagué : contexte compact, actions, décision terrain, partage et fournisseur.
- Journal élagué : résumé prudent et historique, dont les décisions libres.
- Logo « S » remplacé par un pictogramme simple assiette et couverts.

## Current state

Les commits précédents sont poussés sur `origin/main`. Les phases 11 et 12 sont terminées, vérifiées et validées ; publication Git vers `origin/main` en cours avant un unique redéploiement Render.

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
- Phase 11 : 11 tests web, lint, contrôle TypeScript et build Next.js réussis.
- Parcours fournisseur joué dans le navigateur : catalogue → brouillon → confirmation fictive → trace dans Valeur via la navigation de l'app.
- Briefing et Valeur contrôlés à 390 px sans débordement horizontal ; le tableau de bord expose bien les quatre vigies opérationnelles.
- Phase 12 : 9 tests web et 22 tests API réussis ; lint, types et build passent.
- Parcours navigateur réussi : fenêtre d'exemple fermée sans mutation, détail du calcul ouvert, décision libre ajoutée, message SMS/WhatsApp préparé puis décision retrouvée dans Journal.
- Responsive Phase 12 : aucun débordement horizontal à 1280 px et 390 px.

## Blockers and open questions

- Aucun blocage technique restant.
- Le service public répond sur `https://pilotage-restaurants.onrender.com/`.
- Le parcours public est fonctionnel avec données et décisions fictives.
- L’optimisation du commit `7aea520` est déployée : `/health` répond en 0,2–0,5 seconde et le briefing public en 0,92 seconde lors de la vérification finale.
- Aucun blocage de publication restant pour la phase 8.
- Le dossier non suivi `prototype-use-cases/` préexistait ou appartient à l’utilisateur ; il reste hors du périmètre de la refonte et ne doit pas être ajouté sans validation explicite.
- Les phases 11 et 12 ne sont pas encore publiques ; elles doivent être validées, poussées puis redéployées manuellement sur Render.

## Next actions

1. Créer le commit approuvé et pousser `main` vers `origin` en excluant `prototype-use-cases/`.
2. Demander un unique redéploiement manuel Render puis vérifier les quatre vues publiques.
3. Mettre ensuite à jour l'étude PDF seulement si la démo produit est validée.
