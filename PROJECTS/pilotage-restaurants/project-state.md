# Pilotage restaurants — état du projet

## Current goal

Publier un prototype démontrable de pilotage prédictif de trois restaurants fictifs, puis préparer un lien public simple à partager.

## Latest user ask

Mettre à jour le PDF lié à `Specs PDF` avec une page concise « Du terrain au briefing groupe », actualiser le Markdown source, contrôler visuellement toutes les pages et remplacer la copie publique, sans modifier l’application.

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
- Phase 13 autorisée le 17 juillet 2026 : compléter les preuves P0 utiles sans ajouter d'onglet ; validation du résultat encore attendue avant commit et push.
- Phase 14 autorisée le 17 juillet 2026 ; résultat local terminé, validation encore attendue avant commit et push.
- Phases 13 et 14 validées le 17 juillet 2026 ; commit et push vers `origin/main` autorisés avec le message `Complete and rebalance restaurant demo` et exclusion de `prototype-use-cases/`.
- Correctif de visibilité d'en-tête validé pour commit et push le 17 juillet 2026 avec le message `Improve header action visibility`, toujours sans `prototype-use-cases/`.
- Phase 17 validée le 18 juillet 2026 ; commit et push de ses huit fichiers vers `origin/main` autorisés avec le message `Populate restaurant views by location`, en excluant `prototype-use-cases/`.
- Phase 18 validée le 20 juillet 2026 : accueil groupe moderne, navigation à trois destinations, détail local explicite et suppression de la redondance avec `Établissements`.
- Résultat de la phase 18 validé par l'utilisateur le 20 juillet 2026 ; commit et push vers `origin/main` autorisés, toujours sans `prototype-use-cases/`, après validation du message de commit.
- Phase 19 documentaire validée le 20 juillet 2026 ; commit et push vers `origin/main` autorisés avec le message `Update restaurant prototype study`, toujours sans `prototype-use-cases/`.

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
- L'étude initiale est préservée ; la révision est désormais un PDF de 33 pages avec un addendum daté de cinq pages.
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
- Phase 13 : horizon sept jours compact et filtrable localement par site/service, besoins Salle/Cuisine/Bar, motif obligatoire pour modifier/refuser, échéance réellement bloquée, cas fictifs jouables en vase clos et Journal mensuel distinguant estimé/observé.
- Les filtres de l'horizon ne changent jamais le scénario actif ; les actions des cas fictifs ne sortent jamais de la fenêtre.
- Le gain observé reste indisponible tant qu'aucune caisse réelle n'est connectée.

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
- Horizon fictif déterministe de sept jours ajouté au Tableau de bord avec lecture des trois établissements et des deux services.
- Besoins d'effectif affichés par rôle dans Décisions, sans simuler un planning juridiquement complet.
- Préparation cuisine concrète ajoutée au cas principal tout en conservant le brouillon fournisseur fûts/glaçons.
- Modifier ou refuser ouvre un motif obligatoire, ensuite visible dans le Journal.
- Une recommandation dont l'heure limite est dépassée devient visible mais non exécutable.
- La fenêtre Cas fictifs permet de jouer localement un scénario décisionnel ou l'abstention sans modifier l'application.
- Journal mensuel complété avec période, gain estimé fictif et gain observé explicitement absent.
- Nom visible `Service` remplacé par `Prototype App` dans l'en-tête, les métadonnées et le message de partage.
- Phase 14 terminée localement : Établissements compare le groupe et conclut même sans transfert ; Décisions place les trois actions avant les outils secondaires.
- Phase 14 inclut une réduction du défilement mobile et un favicon assiette/couverts pour l'onglet navigateur.
- L'ancienne édition complète de 32 pages a été conservée jusqu'à la phase 18 ; sa copie publique reste reliée au bouton `Specs PDF`.
- Phase 19 terminée localement : l'étude complète passe à 33 pages avec le parcours « Du terrain au briefing groupe », un cas fictif de pré-service, trois priorités et arbitrage humain.
- La source Markdown et le PDF listent les sources rennaises candidates : travaux, trafic, parkings, STAR GTFS/GTFS-RT, OpenAgenda Rennes Métropole et Météo-France ; aucune n'est connectée dans la démonstration.
- La page de spécifications est réalignée sur la navigation actuelle : Accueil groupe, détail d'un lieu, Décisions et Journal.
- Correctif local après `11d102c` : `Specs PDF` devient safran plein, `Cas fictifs` turquoise plein et reste visible sur mobile ; seul `Réinitialiser` y est masqué.
- Le résumé fournisseur replié est aligné sur les dimensions de `Consigne terrain et transmission` en desktop.

## Current state

Les phases 13 à 18 et le correctif d’accueil sont publiés sur `origin/main`. La phase 19 documentaire est validée et son commit/push est autorisé. Le PDF public contient 33 pages et le fonctionnement de l'application n'a pas été modifié.

## Touched files and artifacts

- Application : `apps/web`, `apps/api`.
- Configuration fictive : `data/config`.
- Documentation : `docs`, `README.md`, `AGENTS.md`, `PLANS.md`.
- Refonte UX : `apps/web/src/app/globals.css`, composants partagés, diagnostic et `scenario-gallery.tsx`.
- Références produit : `references`.
- Joueur : `apps/web/src/app/scenarios/page.tsx`, `apps/web/src/components/scenario-player.tsx` et styles responsive associés.
- Étude révisée : `references/ETUDE_COMPLETE.md`, `scripts/build_revised_study.py` et `output/pdf/Analyse_pilotage_predictif_restaurants_premium_revision.pdf`.
- Copie publique du PDF : `apps/web/public/specs-prototype-app.pdf` ; accès dans l'en-tête via `Specs PDF`.
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
- Phase 13 : `pnpm check` réussi avec 12 tests web et 22 tests API ; lint, types et build passent.
- Parcours testés : horizon sept jours et changement de service, rôles Salle/Cuisine/Bar, modification avec motif journalisé, abstention jouable, action expirée bloquée et scénario principal inchangé après fermeture.
- Responsive Phase 13 : aucun débordement horizontal à 1280 px et 390 px ; la bande sept jours défile horizontalement sur mobile.
- Phase 14 : `pnpm check` réussi avec 13 tests web et 22 tests API ; lint, types et build passent.
- Contrôle étroit à 287 px sans débordement : Décisions environ 2 030 px, Tableau de bord et Établissements environ 2 100 px, Journal moins de 1 000 px. Outils terrain et fournisseur restent accessibles mais repliés.
- PDF complet régénéré : 32 pages A4, 28 pages initiales inchangées et quatre pages d'addendum actualisées ; rendu PNG inspecté sans coupure ni chevauchement.
- Les routes locales `/specs-prototype-app.pdf` et `/icon.svg` répondent `200` avec les bons types MIME.
- GitHub : commit `5db2b38` poussé avec succès de `main` vers `origin/main` le 17 juillet 2026.
- Correctif d'en-tête : 13 tests web, lint, types et build réussis ; contrôle à 287 px sans débordement, avec `Specs PDF` safran et `Cas fictifs` turquoise tous deux visibles, `Réinitialiser` seul masqué.
- GitHub : correctif `8a345a1` poussé avec succès de `main` vers `origin/main` le 17 juillet 2026.
- Phase 15 : `pnpm check` réussi avec 13 tests web et 22 tests API ; lint, types et build passent.
- Phase 15 responsive : à 390 px, aucun débordement global, navigation fixe en bas, onglet actif, décisions et établissements en rails horizontaux ; hauteurs ramenées à environ 1 330 px et 1 440 px.
- Phase 15 visuelle : palette plus fraîche, surfaces blanches, ombres allégées, accents turquoise/abricot et boutons moins massifs sur ordinateur comme sur mobile.
- GitHub : phase 15 poussée avec succès de `main` vers `origin/main` dans le commit `928a16c` le 17 juillet 2026.
- Phase 16 : `pnpm check` réussi avec 14 tests web et 22 tests API ; lint, types et build passent.
- Phase 16 responsive : parcours République → Liberté → Décisions → Journal validé à 390 px sans débordement ni erreur console ; comparaison validée à 920 px.
- Audit phase 16 : vigies rattachées au bon site, historiques alignés sur juillet 2026, transfert synchronisé par identifiant et contributions numériques réconciliées avec la prévision.
- GitHub : phase 16 poussée avec succès de `main` vers `origin/main` dans le commit `2e12e29` le 17 juillet 2026.
- Phase 17 : `pnpm check` réussi avec 16 tests web et 22 tests API ; lint, types et build passent.
- Phase 17 responsive : Liberté puis Gare vérifiées dans le navigateur à 392 px et en largeur ordinateur, sans débordement horizontal ; les prévisions, vigies et décisions changent bien par lieu.
- GitHub : phase 17 poussée avec succès de `main` vers `origin/main` dans le commit `3dbf6cd` le 18 juillet 2026 ; la branche distante pointe sur ce hash.
- Phase 18 : `pnpm check` réussi avec 16 tests web et 22 tests API ; lint, types, build Next.js, Ruff et mypy passent.
- Phase 18 visuelle : accueil groupe et détail République contrôlés sur ordinateur ; vue mobile sans débordement global, en-tête allégé et trois cartes accessibles dans un rail horizontal compact.
- Phase 18 anti-doublon : l'onglet `Établissements` et sa page parallèle disparaissent, et la seconde liste répétant les trois actions prioritaires a été retirée de l'accueil.
- GitHub : phase 18 poussée avec succès de `main` vers `origin/main` dans le commit `73796a6` le 20 juillet 2026 ; la branche distante pointe sur ce hash.
- Correctif accueil : 17 tests web, lint, types et build Next.js passent ; vérification navigateur réussie pour `/cockpit` → République (`?site=republique`) → `/cockpit`, avec retour immédiat à la home sans actualisation.
- GitHub : correctif d’accueil poussé avec succès de `main` vers `origin/main` dans le commit `6d85315` le 20 juillet 2026 ; la branche distante pointe sur ce hash.
- Phase 19 : PDF maître et copie publique identiques, 33 pages A4 et 156 907 octets ; texte attendu extrait avec succès.
- Phase 19 visuelle : les 33 pages ont été rendues en PNG et inspectées, sans coupure, chevauchement ni glyphe défectueux ; les pages 29 à 33 suivent la palette et les composants visuels de l'application actuelle.
- Phase 19 web : `pnpm check:web` réussit avec lint, contrôle TypeScript, 17 tests web et build Next.js.

## Blockers and open questions

- Aucun blocage technique restant.
- Le service public répond sur `https://pilotage-restaurants.onrender.com/`.
- Le parcours public est fonctionnel avec données et décisions fictives.
- L’optimisation du commit `7aea520` est déployée : `/health` répond en 0,2–0,5 seconde et le briefing public en 0,92 seconde lors de la vérification finale.
- Aucun blocage de publication restant pour la phase 8.
- Le dossier non suivi `prototype-use-cases/` préexistait ou appartient à l’utilisateur ; il reste hors du périmètre de la refonte et ne doit pas être ajouté sans validation explicite.
- Le dernier commit est sur GitHub mais pas encore confirmé sur Render ; un redéploiement puis une vérification publique restent nécessaires.

## Next actions

1. Committer et pousser les six fichiers de la phase 19, sans ajouter `prototype-use-cases/`.
2. Redéployer Render.
3. Vérifier l'ouverture du PDF public de 33 pages.
