# Plan d’exécution du prototype

Statut : **phase 20 terminée localement — validation utilisateur attendue avant commit et push**
Date de cadrage : 22 juillet 2026

## Phase 20 — rendre la démonstration réellement opérationnelle

### 1. Résultat de la phase

L'application raconte un service continu plutôt qu'une suite d'écrans : briefing initial à 08:00, signal terrain fictif validé à 10:20, changement visible de la prévision et de la capacité, trois arbitrages maximum, puis traçabilité immédiate dans le Journal. L'accueil est plus compact, le détail gagne un seul visuel métier utile et le Journal devient lisible sans tableau horizontal sur mobile.

### 2. Hypothèses et décisions

- **Confirmé** : persona principale = responsable opérationnel d'un groupe fictif de trois restaurants ; résultat attendu = comprendre et arbitrer le service en moins de deux minutes.
- **Confirmé** : aucune API réelle, donnée réelle, commande automatique, capture audio ou interprétation libre par un LLM.
- **Décidé** : un seul cas fil rouge, déjà documenté dans le PDF : vendredi à République, note terrain à 10:20 avant le dîner.
- **Décidé** : l'état initial reste à 08:00 avec 126 couverts prévus à République, fourchette 120-132, confiance 76 %, soit 325 couverts groupe.
- **Décidé** : la note validée ajoute un groupe confirmé et la terrasse, puis signale la livraison de glaçons ; l'état dérivé passe à 140 couverts, fourchette 135-146, confiance 84 %, soit 339 couverts groupe.
- **Décidé** : les trois priorités après validation restent préparation froide avant 11:00, glaçons avant 14:00 et renfort sur 19:00-22:00 avant 16:00.
- **Décidé** : le formulaire structuré et la transcription vocale de démonstration produisent le même objet typé et déterministe. Une transcription doit être confirmée ; aucun texte arbitraire ne déclenche un calcul.
- **Décidé** : le changement est local à la session et réversible par `Réinitialiser`. Un rechargement complet restaure le briefing initial, ce qui constitue la stratégie de reset de la démo.
- **Décidé** : `Specs PDF` et `Cas fictifs` restent visibles conformément aux validations précédentes ; leur poids visuel peut être légèrement réduit mais ils ne sont ni supprimés ni cachés dans un menu.
- **Écarté** : nouvel onglet, chatbot, photos de banque d'images, console de connecteurs, calendrier libre, vraie reconnaissance vocale et persistance multi-utilisateur.

### 3. Architecture et flux

```text
fixture pré-service 08:00
        + signal terrain typé 10:20
        + fonction déterministe d'application
                  |
                  v
scénario de session dérivé
  - forecast / fourchette / confiance
  - signaux et fraîcheur des sources
  - capacité Salle / Cuisine / Bar
  - 3 recommandations déterministes
                  |
        +---------+----------+
        |                    |
 Accueil + détail       Décisions
        |                    |
        +---------+----------+
                  v
          Journal de session
```

`operational-session.ts` contient le signal fictif, l'état avant/après et la transformation pure. `DemoProvider` reste l'unique propriétaire de l'état de session et expose le stade, l'impact et les actions. Les calculs numériques, les règles de recommandation et les textes explicatifs restent dans des structures distinctes. Aucun appel réseau n'est ajouté.

### 4. Fichiers concernés

- `apps/web/src/demo/operational-session.ts` : nouveau contrat du signal terrain, fixture 10:20, courbe horaire et transformation déterministe du scénario.
- `apps/web/src/demo/demo-context.tsx` : stade de session, validation du signal, impact courant et reset.
- `apps/web/src/demo/scenarios.ts` : types strictement nécessaires au scénario dérivé, sans réécrire les six cas isolés.
- `apps/web/src/components/field-signal-panel.tsx` : panneau formulaire/transcription, confirmation humaine et résumé de l'impact.
- `apps/web/src/components/service-load-chart.tsx` : demande horaire contre capacité, unique nouveau graphique métier.
- `apps/web/src/components/group-home.tsx` et `cockpit-page.tsx` : accueil compact, chronologie et changement avant/après.
- `apps/web/src/components/briefing-client.tsx` : progression des arbitrages et conséquences visibles après chaque décision.
- `apps/web/src/components/roi-client.tsx` : historique en cartes sur mobile, tableau conservé sur ordinateur.
- `apps/web/src/app/globals.css` : responsive, densité, états et micro-interactions sobres.
- `apps/web/src/app/page.test.tsx` : invariants et parcours fil rouge.
- `docs/05_UX_SCREENS.md`, `docs/06_ACCEPTANCE_TESTS.md`, `docs/10_INTEGRATION_DEMO.md` : écrans, acceptation, talk track et reset.
- `PROJECTS/pilotage-restaurants/project-state.md` : état et validation de la phase.

### 5. Étapes d'implémentation

1. Écrire le contrat typé et les fixtures avant/après, avec une fonction pure testable et sans mutation du scénario source.
2. Ajouter l'état de session au provider, le reset et le résumé d'impact réconciliant exactement les deltas.
3. Installer sur l'accueil le signal terrain en attente, puis la chronologie 08:00 → 10:20 → prochaine échéance.
4. Mettre à jour le détail local avec le changement expliqué et la courbe horaire demande/capacité.
5. Relier Décisions au nouveau stade, afficher la progression 0/3 à 3/3 et conserver modification/refus/motif/transmission.
6. Transformer le Journal mobile en cartes tout en conservant un tableau accessible sur ordinateur.
7. Réduire les blocs disproportionnés et ajouter seulement les retours nécessaires : confirmation, changement de statut et focus visible.
8. Mettre à jour le guide de démo : préparation, parcours de moins de cinq minutes, reset, scénario de secours et limites à annoncer.

### 6. Vérifications

Tests à ajouter dans `page.test.tsx` :

- le reset affiche 126 couverts à République et 325 au groupe ;
- une note non confirmée ne modifie rien ;
- la validation passe à 140/339, réconcilie +14 couverts, la fourchette et la confiance ;
- les besoins Salle et Bar changent sans fabriquer un planning complet ;
- exactement trois priorités exécutables apparaissent avec leurs échéances ;
- validation, modification motivée et refus mettent à jour la progression et le Journal ;
- le changement de lieu ne propage pas le signal de République à Liberté ou Gare ;
- `Réinitialiser` restaure l'état initial ;
- les six cas fictifs restent isolés et l'abstention continue de fonctionner.

Commandes :

```bash
pnpm check:web
pnpm check
git diff --check
```

Parcours navigateur : 1440 x 900 et 390 x 844, accueil → validation du signal → détail République → trois décisions → transmission préparée → Journal → reset. Vérifier absence de débordement, navigation clavier, focus, messages de statut et cohérence des nombres à chaque étape.

### 7. Risques et solutions de repli

- **Données incohérentes** : une seule transformation pure dérive tous les nombres ; tests de réconciliation groupe/site et avant/après.
- **Fuite temporelle** : le signal porte 10:20 et seules les données connues à cette heure sont appliquées ; les échéances restent ultérieures.
- **Prévision trop précise** : conserver fourchette et confiance, afficher +14 comme delta de fixture et non comme vérité terrain.
- **API simulée irréaliste** : afficher source, dernière synchronisation et statut simulé ; aucun faux appel ni spinner réseau théâtral.
- **Règle inexécutable** : après 11:00, 14:00 ou 16:00, l'action correspondante reste visible mais bloquée selon la règle existante.
- **Interface trompeuse** : la note vocale est une transcription préenregistrée de démonstration ; validation humaine et mention fictive restent visibles.
- **Texte libre incohérent avec les chiffres** : aucune saisie arbitraire n'est interprétée ; repli sur le formulaire structuré si le mode transcription ajoute de la confusion.
- **Surcharge mobile** : chronologie compacte, outils secondaires repliés, cartes du Journal et une seule visualisation ; supprimer le graphique avant d'ajouter du défilement excessif.
- **Régression des scénarios** : la transformation n'agit que sur le cas fil rouge de la session principale ; la bibliothèque isolée reste inchangée.

### 8. Critères de sortie

- Une personne comprend en moins de deux minutes ce qui a changé, pourquoi et avant quelle heure agir.
- Le même signal met à jour sans contradiction Accueil, détail, Décisions et Journal.
- Trois décisions maximum, chacune avec confiance, responsable implicite ou explicite, échéance, gain/risque fictif et statut.
- La prévision numérique, la règle déterministe et l'explication restent séparées et testables.
- Aucun appel externe, aucune action irréversible et aucune donnée non fictive.
- Le parcours fonctionne au clavier, sur ordinateur et à 390 px sans débordement global.
- `pnpm check` réussit et le guide de démonstration permet un reset fiable avant chaque présentation.

## Correctif post-phase 19 — neutraliser les anciens liens filtrés

- **Constat public** : une session neuve sur `/` affiche bien l’accueil groupe, mais un onglet ou favori conservant `/cockpit/?site=republique` ouvre encore le détail local et ressemble à une mauvaise page d’arrivée.
- **Décision** : toute nouvelle initialisation ou restauration complète du cockpit revient à la vue groupe et nettoie le filtre d’URL ; le détail local reste ouvert uniquement par une interaction dans l’application.
- **Périmètre** : logique d’entrée de `CockpitPage`, tests de navigation et état du projet ; aucune donnée, prévision ou règle métier modifiée.
- **Vérifications prévues** : URL racine, ancien lien filtré, ouverture d’un détail, changement de lieu, retour groupe, historique navigateur, tests web et build.
- **Résultat local** : ancien lien République et actualisation d’un détail reviennent à `/cockpit/` et à l’accueil groupe ; un clic sur une carte ouvre encore le détail demandé. Lint, types, 18 tests web et build passent.

## Phase 19 — ajouter le parcours « Du terrain au briefing groupe » aux specs

### 1. Résultat de la phase

L’étude révisée passe de 32 à 33 pages sans altérer ses 28 pages initiales. Une page concise montre, avec un seul cas fictif de pré-service, comment une note terrain validée devient trois priorités groupe puis un arbitrage humain.

### 2. Hypothèses et décisions

- **Confirmé** : aucun fonctionnement applicatif ne change ; seuls le Markdown source, le générateur PDF et les PDF générés sont modifiés.
- **Confirmé** : le cas reste fictif et concret métier, avant un dîner à République.
- **Décidé** : le parcours tient en quatre étapes - saisie validée, enrichissement, trois priorités, arbitrage humain.
- **Décidé** : les sources rennaises sont présentées comme des connecteurs envisageables ou simulés : météo, agenda local, circulation/travaux et perturbations STAR ; aucune connexion réelle n’est revendiquée.
- **Décidé** : la page 30 est seulement réalignée sur l’application actuelle (Accueil, détail local, Décisions, Journal et 17 tests web).
- **Écarté** : ajouter plusieurs scénarios, détailler une architecture vocale ou promettre une commande/action automatique.

### 3. Architecture et flux

```text
note formulaire ou vocale validée
  + caisse / réservations / planning / stock
  + météo / agenda / circulation / STAR à Rennes
        -> synthèse bornée à 3 priorités
        -> responsable groupe modifie, valide ou refuse
```

Le Markdown reste la source éditoriale. `scripts/build_revised_study.py` génère l’addendum ReportLab, le fusionne avec `references/ETUDE_PREMIUM.pdf`, puis la sortie validée remplace la copie publique du bouton `Specs PDF`.

### 4. Fichiers concernés

- `references/ETUDE_COMPLETE.md` : section source du nouveau parcours et organisation actuelle corrigée.
- `scripts/build_revised_study.py` : page 33 et libellés de l’addendum actualisés.
- `output/pdf/Analyse_pilotage_predictif_restaurants_premium_revision.pdf` : PDF maître régénéré.
- `apps/web/public/specs-prototype-app.pdf` : copie publique remplacée à l’identique.
- `PROJECTS/pilotage-restaurants/project-state.md` : état documentaire et vérifications.

### 5. Étapes d’implémentation

1. Ajouter le cas fil rouge dans le Markdown et réaligner la description de l’application.
2. Dessiner la page 33 avec une chaîne de quatre étapes et les garde-fous humains.
3. Régénérer le PDF maître, vérifier 33 pages et la présence des textes attendus.
4. Rendre toutes les pages en PNG, inspecter la planche complète puis chaque page à taille lisible.
5. Remplacer la copie publique et vérifier identité binaire, type MIME et build web.

### 6. Vérifications

```bash
python scripts/build_revised_study.py
pdfinfo output/pdf/Analyse_pilotage_predictif_restaurants_premium_revision.pdf
pdftotext output/pdf/Analyse_pilotage_predictif_restaurants_premium_revision.pdf -
pdftoppm -png -r 120 output/pdf/Analyse_pilotage_predictif_restaurants_premium_revision.pdf tmp/pdfs/review/page
cmp output/pdf/Analyse_pilotage_predictif_restaurants_premium_revision.pdf apps/web/public/specs-prototype-app.pdf
pnpm check:web
```

### 7. Risques et solutions de repli

- **Donnée incohérente** : toutes les valeurs du cas sont marquées fictives et réconcilient les trois priorités du prototype.
- **Fuite temporelle** : la page décrit uniquement des informations disponibles avant le service et horodatées.
- **Prévision trop précise** : aucune nouvelle prévision ponctuelle n’est inventée ; fourchette et confiance restent les principes de l’étude.
- **API simulée irréaliste** : les sources rennaises sont explicitement « envisageables/simulées », jamais connectées dans le prototype.
- **Règle inexécutable** : aucune action externe automatique ; échéance et validation humaine sont visibles.
- **Interface trompeuse** : la note vocale nécessite validation de transcription et le cas fil rouge porte la mention fictive.
- **Régression PDF** : conservation page à page des 28 pages initiales et revue visuelle des 33 pages.

### 8. Critères de sortie

- Une seule page nouvelle, lisible, sans chevauchement ni texte coupé.
- Le flux demandé et les quatre étapes sont compris sans dépendre du reste de l’étude.
- Les sources rennaises et les données internes sont nommées concrètement sans prétendre à une intégration active.
- Trois priorités maximum et décision humaine explicite.
- Markdown, PDF maître et copie publique cohérents ; application fonctionnellement inchangée.

### Correctif post-publication — accueil sans actualisation

- **Problème observé** : l’accueil groupe et le détail République partageaient la même URL `/cockpit`, permettant au navigateur de restaurer le détail local lors de la réouverture d’un onglet ; une actualisation recréait ensuite l’état groupe.
- **Décision** : `/cockpit` désigne toujours l’accueil groupe et un détail local utilise un paramètre explicite, par exemple `/cockpit/?site=republique`.
- **Comportement** : retour navigateur, restauration d’onglet, logo, lien `Accueil`, bouton `Vue groupe` et `Réinitialiser` resynchronisent l’interface avec l’URL.
- **Vérification** : 17 tests web, lint, types et build passent ; le parcours réel détail République → navigation fraîche vers `/cockpit` restaure la home sans actualisation.

## Phase 18 — moderniser l'accueil et clarifier le parcours groupe → lieu

### 1. Résultat de la phase

L'application s'ouvre sur une vue groupe immédiatement compréhensible : chiffres consolidés, situation des trois lieux et une action prioritaire propre à chaque carte. Un clic sur République, Liberté ou Gare ouvre ensuite un véritable détail local, avec un retour explicite au groupe, sans répéter une seconde fois la même vue dans un onglet séparé.

### 2. Hypothèses et décisions

- **Confirmé** : l'accueil doit d'abord montrer la situation globale des trois établissements, puis permettre d'entrer dans le détail de chacun.
- **Confirmé** : la modernisation doit rester simple, responsive et utilisable comme une application, pas comme une vitrine marketing.
- **Constaté** : le Tableau de bord actuel ouvre directement sur République alors que la vue groupe est reléguée dans `Établissements` ; les deux pages répètent le sélecteur de site, les prévisions et les décisions.
- **Décidé** : `Accueil` remplace le libellé `Tableau de bord` et devient l'unique entrée groupe.
- **Décidé** : supprimer `Établissements` de la navigation ; l'ancienne route `/multisites` redirige vers `/cockpit` afin de conserver les anciens liens.
- **Décidé** : limiter la navigation principale à `Accueil`, `Décisions` et `Journal`, tout en conservant `Specs PDF` et `Cas fictifs` comme actions secondaires visibles.
- **Proposé** : l'accueil affiche un total groupe, le nombre de lieux sous tension, trois cartes d'établissement et une conclusion ou proposition multi-sites.
- **Proposé** : chaque carte de lieu montre uniquement les éléments qui aident à choisir où agir — couverts, CA fictif, équipe, confiance, signal principal, décision prioritaire — puis un bouton `Voir le détail`.
- **Proposé** : le détail local réutilise les calculs existants mais commence par un fil `Vue groupe / Nom du lieu` et un bouton `Retour au groupe` ; le changement de lieu reste possible.
- **Proposé** : trois mini-courbes déterministes sur sept jours et des pictogrammes métier sobres remplacent l'idée de photos génériques. Ces visuels expliquent une tendance et n'imitent pas de vrais restaurants.
- **Proposé** : direction visuelle `hospitality operations` — surfaces plus nettes, bento asymétrique, bleu nuit moins massif, accents turquoise/abricot plus francs, une seule police variable moderne auto-hébergée.
- **Écarté** : ajouter une page d'accueil marketing, des photographies de banque d'images, une carte géographique fictive ou un nouvel onglet par établissement.
- **Décidé après contrôle visuel** : ne pas ajouter un second bloc de trois décisions sur l'accueil ; les actions prioritaires sont déjà visibles dans les cartes, et leur traitement complet reste dans `Décisions`.

### 3. Architecture et flux

```text
/ ou /cockpit
  GroupHome
    ├─ indicateurs groupe
    ├─ 3 SiteOverviewCard + mini-tendance
    └─ GroupDecisionCard (conclusion ou transfert)
             │ Voir le détail
             ▼
  LocalCockpit(siteId)
    ├─ retour au groupe + sélecteur compact
    ├─ prévision / facteurs
    ├─ horizon local
    └─ vigies + raccourci Décisions

/briefing ── décisions du site actif
/valeur   ── journal du site actif
/multisites ── redirection vers /cockpit
```

`DemoContext` reste la source du scénario, du site actif, du niveau `groupe` ou `détail local` et des décisions de session. L'accueil appelle `getDemoSiteView` et `getDemoHorizon` pour chacun des trois lieux ; il ne crée aucune nouvelle donnée numérique. Le site actif continue d'alimenter Décisions et Journal. Prévision, règles et explication restent séparées.

### 4. Fichiers concernés

- `components/cockpit-page.tsx` : orchestration accueil groupe / détail local.
- `components/group-home.tsx` : nouvelle composition groupe, cartes de lieux et arbitrage multi-sites.
- `components/site-trend.tsx` : mini-courbe SVG accessible construite à partir de l'horizon fictif existant.
- `components/multisites-client.tsx` : extraction des éléments utiles puis suppression de la page dupliquée.
- `components/app-shell.tsx` : navigation ramenée à trois destinations et en-tête mobile allégé.
- `components/ui.tsx` : variantes d'en-tête groupe et détail local.
- `app/multisites/page.tsx` : redirection de compatibilité.
- `app/globals.css` : grille bento, cartes, mini-visuels, typographie et responsive.
- `app/layout.tsx`, `package.json` : police variable auto-hébergée, uniquement si elle n'ajoute pas de dépendance runtime.
- `app/page.test.tsx` : parcours groupe → lieu → décisions → journal et absence de doublon de navigation.
- `PROJECTS/pilotage-restaurants/project-state.md` : suivi de phase.

### 5. Étapes d'implémentation

1. Extraire une vue groupe pure à partir des trois `DemoSiteView` et définir les trois priorités agrégées maximum.
2. Construire l'accueil groupe avec les trois cartes de lieux et leurs mini-tendances utiles.
3. Relier `Voir le détail`, `Retour au groupe` et le changement de lieu sans ajouter de nouvelle route métier.
4. Intégrer la conclusion ou le transfert multi-sites à l'accueil puis rediriger l'ancienne vue `Établissements`.
5. Simplifier la navigation et moderniser le système visuel, d'abord en desktop puis en responsive mobile.
6. Rejouer le parcours complet, vérifier les états d'abstention et éliminer les contenus dupliqués ou disproportionnés.

### 6. Vérifications

```bash
pnpm check:web
pnpm check
```

- Tests : accueil initial en vue groupe, trois cartes peuplées, trois priorités maximum, ouverture de chaque détail, retour groupe, conservation du site actif dans Décisions et Journal, redirection `/multisites`.
- Invariants : les totaux groupe égalent la somme des sites fiables ; chaque carte utilise la même prévision que son détail ; aucune donnée nouvelle n'est codée dans un composant visuel.
- Parcours desktop : Accueil → Liberté → Décisions → Journal → Accueil → Gare.
- Parcours mobile étroit : en-tête allégé, navigation à trois destinations, cartes de lieux dans un rail horizontal borné et aucun débordement global.
- Contrôle visuel : hiérarchie au-dessus de la ligne de flottaison, densité, contraste, tailles tactiles de 44 px et mouvement désactivé avec `prefers-reduced-motion`.

### 7. Risques et solutions de repli

- **Données incohérentes** : tous les agrégats dérivent de `getDemoSiteView`, avec tests d'égalité entre carte et détail.
- **Fuite temporelle** : les mini-tendances reprennent uniquement l'horizon fictif déjà publié ; aucun résultat futur observé n'est ajouté.
- **Prévision trop précise** : fourchette et confiance restent visibles dans le détail ; l'accueil présente des ordres de grandeur et signale l'abstention.
- **API simulée irréaliste** : aucune connexion supplémentaire ; la mention `données fictives` reste visible sur le groupe et le détail.
- **Règle inexécutable** : l'accueil ne déclenche aucune action irréversible et renvoie vers le flux de décision existant.
- **Interface trompeuse** : pas de photos de faux établissements ni de carte géographique ; les mini-visuels sont étiquetés comme projections.
- **Surcharge mobile** : contenu global borné à trois cartes dans un rail horizontal ; la liste répétée des mêmes priorités a été retirée et les détails restent derrière une action explicite.
- **Régression des liens** : `/multisites` reste une redirection stable vers l'accueil.

### 8. Critères de sortie

- En moins de deux minutes, l'utilisateur identifie le groupe, le lieu sous tension et l'action prioritaire.
- La première vue contient les chiffres utiles des trois lieux sans devoir utiliser le sélecteur.
- Un clic ouvre un détail local clairement identifié et un retour groupe toujours visible.
- Accueil et ancienne vue Établissements ne dupliquent plus les mêmes informations.
- La navigation ne comporte que trois destinations métier et reste lisible à 390 px.
- Les visuels ont une fonction opérationnelle : tendance, état ou contexte ; aucun élément décoratif ne suggère une donnée réelle.
- Les décisions restent propres au lieu, limitées à trois, modifiables et journalisées.
- L'abstention volontaire, les données fictives et la confiance restent explicites.
- Tests, lint, types, build, desktop et mobile passent avant demande de validation.

## Phase 17 — peupler chaque vue active avec un instantané complet

### 1. Résultat de la phase

République, Liberté et Gare disposent chacun d'une démonstration opérationnelle complète dans le même scénario : prévision, fourchette, chiffre d'affaires fictif, facteurs, besoins par rôle, recommandations, vigies, systèmes simulés et historique. Changer `Vue active` ne produit plus un écran dégradé ou un message d'absence de données.

### 2. Hypothèses et décisions

- **Confirmé** : toutes les nouvelles valeurs sont fictives, déterministes et locales au prototype.
- **Décidé** : le site porteur du scénario conserve les fixtures métier détaillées déjà validées.
- **Décidé** : les deux autres sites reçoivent un instantané généré par une fonction pure à partir de leur synthèse groupe.
- **Décidé** : le générateur applique des paramètres stables par établissement — ticket moyen, amplitude, confiance et écart à la référence — plutôt que des nombres aléatoires.
- **Décidé** : chaque instantané secondaire croise réservations, météo et capacité locale ; la somme des contributions réconcilie exactement la prévision avec sa référence.
- **Décidé** : chaque établissement reçoit des décisions réellement différentes selon son contexte : terrasse/bar à République, équipe/afterwork à Liberté, livraison/préparation à Gare.
- **Décidé** : chaque instantané comporte deux ou trois recommandations déterministes maximum, avec règle, heure limite, gain/risque fictif et confiance.
- **Décidé** : le besoin Salle vient de la comparaison groupe ; Cuisine et Bar sont dérivés par ratios explicites et arrondis.
- **Décidé** : les systèmes tiers secondaires sont des adaptateurs fictifs horodatés, jamais présentés comme des connexions réelles.
- **Décidé** : le Journal complète automatiquement les sites sans historique avec une décision fictive passée, marquée estimée.
- **Confirmé** : le scénario d'abstention reste une abstention uniquement pour son site porteur ; les autres sites fiables restent peuplés.

### 3. Architecture et flux

```text
scenario + activeSiteId
          │
          ▼
getDemoSiteView(scenario, siteId) ── fonction pure déterministe
  ├─ site porteur -> fixtures validées inchangées
  └─ autre site   -> forecast + systems + signals + staffing
                    + recommendations propres au lieu + watch
          │
          ├─ Tableau de bord
          ├─ Décisions / validation / modification / refus
          └─ partage terrain

getDemoHistory(scenario)
  └─ historique existant + une trace de démonstration par site manquant
```

La prévision secondaire reste une fixture d'interface et non le résultat de l'API Python. Cette frontière est indiquée dans la méthode et dans la mention globale de données fictives. Les décisions utilisent les mêmes identifiants que les recommandations générées et rejoignent le contexte de session existant.

### 4. Fichiers concernés

- `demo/scenarios.ts` : contrat `DemoSiteView`, générateur déterministe et historique complété.
- `demo/demo-context.tsx` : décisions et historique basés sur la vue active.
- `components/cockpit-page.tsx` : même profondeur fonctionnelle pour les trois lieux.
- `components/briefing-client.tsx` : recommandations, rôles, systèmes et partage propres au site actif.
- `components/roi-client.tsx` : historique initial non vide pour chaque établissement.
- `app/page.test.tsx` : invariants des 18 vues site/scénario et parcours secondaire complet.
- `docs/EXECUTION_PLAN.md`, `PROJECTS/pilotage-restaurants/project-state.md` : suivi de phase.

### 5. Étapes d'implémentation

1. Définir le contrat d'un instantané complet par site.
2. Générer les vues secondaires et leurs décisions propres de façon déterministe et réconciliable.
3. Relier le contexte de décisions et l'historique au site actif.
4. Remplacer les écrans secondaires dégradés par les composants complets existants.
5. Vérifier validation, modification, partage et Journal pour Liberté et Gare.
6. Contrôler desktop, mobile et l'ensemble des scénarios.

### 6. Vérifications

```bash
pnpm check:web
pnpm check
```

Les tests couvrent les 18 couples scénario/site : médiane dans la fourchette, contributions réconciliées, trois rôles, une à trois recommandations, décisions distinctes par établissement, trois systèmes minimum, historique non vide et identifiants uniques. Le parcours navigateur contrôle Liberté puis Gare à 390 px et sur la largeur ordinateur disponible.

Résultat : `pnpm check` réussit avec 16 tests web et 22 tests API ; lint, contrôle TypeScript et build Next.js passent. Le parcours navigateur confirme une vue Liberté complète (108 couverts, fourchette 103–114, 3 996 € fictifs, décisions afterwork/équipe) et une vue Gare distincte (91 couverts, décisions pic voyageurs/livraison). À 392 px, les cartes restent lisibles dans leur rail horizontal et aucun débordement global n'est observé.

### 7. Risques et solutions de repli

- **Données incohérentes** : fonction pure unique, tests exhaustifs sur 18 vues.
- **Fuite temporelle** : toutes les heures sont antérieures à l'instantané ou explicitement des échéances futures.
- **Prévision trop précise** : fourchette obligatoire et méthode `simulation locale fictive` visible.
- **API simulée irréaliste** : systèmes nommés et horodatés mais mention globale `aucun système réel connecté` conservée.
- **Règle inexécutable** : recommandations bornées aux données disponibles et à trois actions.
- **Interface trompeuse** : aucune promesse de données réelles ; tous les gains restent estimés fictifs.
- **Duplication** : un générateur partagé alimente les composants existants sans créer de nouvel onglet.

### 8. Critères de sortie

- Aucun site fiable n'affiche `pas de données`, `aucune priorité` ou une vue synthétique dégradée.
- Les trois sites proposent une prévision, des facteurs et au moins une action différente.
- Les actions secondaires peuvent être validées, modifiées ou refusées puis retrouvées dans le Journal.
- Les systèmes, vigies et décisions changent réellement avec le site actif.
- L'abstention reste visible lorsque la qualité du site porteur est réellement insuffisante.
- Les 18 vues sont déterministes, cohérentes et couvertes par les tests.
- Tests, lint, types, build et responsive passent.

## Phase 16 — rendre la vue active utile et fiabiliser les parcours

### 1. Résultat de la phase

Le sélecteur `Vue active` devient interactif sur ordinateur et mobile : il filtre les informations réellement disponibles pour République, Liberté ou Gare, sans fabriquer une prévision détaillée absente des fixtures. La vue groupe permet de placer un établissement au centre de l'analyse, et l'audit corrige les incohérences de site, de décision et de période repérées dans les parcours.

### 2. Hypothèses et décisions

- **Confirmé** : les trois établissements restent fictifs et appartiennent au même instantané de scénario.
- **Décidé** : le site actif est un filtre de lecture partagé entre Tableau de bord, Décisions, Établissements et Journal.
- **Décidé** : le site porteur du scénario conserve la prévision complète, ses facteurs et ses recommandations calculées.
- **Décidé** : pour un autre site, l'app affiche seulement les données réellement présentes dans la comparaison groupe : couverts attendus, équipe salle, risque stock, alerte et horizon dérivé déjà existant.
- **Écarté** : dériver silencieusement une fourchette, un chiffre d'affaires, des besoins Cuisine/Bar ou des recommandations pour un site secondaire.
- **Décidé** : une vue secondaire sans recommandation montre un état calme et permet seulement une décision terrain libre.
- **Décidé** : les vigies sont filtrées sur `Groupe` et le site actif ; leur compteur devient dynamique.
- **Décidé** : la vue Établissements propose explicitement `Mettre en vue active` puis renvoie vers le Tableau de bord.
- **Décidé** : l'identifiant de la décision de transfert est partagé entre Décisions et Établissements afin que les deux écrans se synchronisent.
- **Décidé** : les historiques présentés comme juillet 2026 sont replacés dans juillet 2026.

### 3. Architecture et flux

```text
DemoContext
  activeSiteId + selectActiveSite
          │
          ├─ PageHeader : liste déroulante partagée
          ├─ Tableau de bord : détail si site scénario / synthèse sinon
          ├─ Décisions : recommandations du site scénario / état calme sinon
          ├─ Établissements : site actif surligné + changement de focus
          └─ Journal : décisions filtrées par établissement

Fixture scénario
  ├─ forecast / signals / recommendations -> site porteur uniquement
  └─ sites[]                             -> synthèse honnête des trois sites
```

La sélection reste en mémoire de session React et revient au site du scénario lors d'un changement de cas fictif ou d'une réinitialisation. Aucune API ni persistance externe n'est ajoutée.

### 4. Fichiers concernés

- `demo/demo-context.tsx` : état de site actif et attribution des décisions libres.
- `demo/scenarios.ts` : cohérence des vigies, dates du Journal et identifiant de transfert.
- `components/ui.tsx` : véritable sélecteur accessible.
- `components/cockpit-page.tsx` : détail complet ou synthèse honnête selon le site.
- `components/briefing-client.tsx` : recommandations filtrées et état calme.
- `components/multisites-client.tsx` : établissement actif et action de focus.
- `components/roi-client.tsx` : journal filtré par site.
- `app/globals.css`, `app/page.test.tsx` : responsive, états et tests de synchronisation.
- `PROJECTS/pilotage-restaurants/project-state.md` : suivi de phase.

### 5. Étapes d'implémentation

1. Ajouter le site actif au contexte partagé.
2. Transformer l'étiquette statique en liste déroulante accessible.
3. Adapter Tableau de bord et Décisions sans fabriquer de données secondaires.
4. Relier la vue groupe et le Journal au filtre.
5. Corriger les incohérences révélées par l'audit.
6. Rejouer les parcours desktop et mobile.

### 6. Vérifications

```bash
pnpm check:web
pnpm check
```

Tests prévus : changement de site partagé, synthèse secondaire, absence de fausse fourchette, vigies filtrées, décision libre attribuée au bon site, transfert synchronisé entre deux écrans et Journal filtré. Contrôle visuel à 390 px et sur la largeur ordinateur disponible.

Résultat : `pnpm check` réussit avec 14 tests web et 22 tests API ; lint, types et build passent. Le parcours navigateur à 390 px sélectionne Liberté depuis République, conserve ce choix dans Décisions et Journal, ajoute une consigne attribuée à Liberté avec confirmation immédiate, puis la retrouve dans son historique. Aucun débordement global ni erreur console n'est observé ; le rail Établissements conserve trois cartes, une seule vue active et deux actions de changement. À 920 px, la comparaison reste en cinq colonnes et le sélecteur occupe 176 px sans rupture de mise en page.

L'audit ajoute également des invariants automatisés : le site principal doit correspondre à la prévision et au besoin Salle, la fourchette doit contenir la médiane, les contributions affichées doivent réconcilier l'écart à la référence, les vigies Événement/Fournisseur doivent porter le bon site, le Journal doit rester en juillet et le transfert doit partager l'identifiant de sa recommandation.

### 7. Risques et solutions de repli

- **Données incohérentes** : une seule source `activeSiteId` et une recherche dans `scenario.sites`.
- **Fuite temporelle** : aucun signal futur ni résultat observé n'est ajouté.
- **Prévision trop précise** : les sites secondaires n'affichent ni intervalle ni CA détaillé.
- **API simulée irréaliste** : la sélection reste locale et ne prétend pas interroger un nouveau connecteur.
- **Règle inexécutable** : aucune recommandation n'est créée par simple changement de vue.
- **Interface trompeuse** : un libellé distingue explicitement `vue synthèse groupe` et `prévision détaillée`.
- **Surcharge** : aucun onglet et aucun panneau métier supplémentaire permanent.

### 8. Critères de sortie

- Les trois lieux sont sélectionnables sur ordinateur et mobile.
- Le changement est cohérent sur les quatre écrans.
- Les données détaillées ne sont affichées que pour le site qui les possède.
- Une décision libre porte le nom du site actif.
- Une décision de transfert est visible comme prise sur les deux écrans concernés.
- Les vigies et le Journal ne mélangent plus silencieusement les sites ou périodes.
- Tests, lint, types, build et responsive passent.

Phase terminée localement le 17 juillet 2026. Aucun commit, push ni déploiement n'est réalisé avant validation explicite.

## Phase 15 — faire du mobile une vraie interface d'application

### 1. Résultat visé

La version ordinateur conserve sa densité opérationnelle, tandis que la version mobile cesse d'être une simple colonne très longue : navigation fixe en bas, en-tête compact, cartes prioritaires consultables par balayage et hiérarchie visuelle plus contemporaine sur toutes les tailles d'écran.

### 2. Hypothèses et décisions

- **Confirmé** : aucune donnée, règle métier ou fonctionnalité n'est ajoutée ou supprimée.
- **Décidé** : sous 42 rem, les quatre tâches principales passent dans une barre de navigation fixe en bas avec icône, libellé court et cible tactile d'au moins 44 px.
- **Décidé** : l'en-tête mobile ne garde que la marque, `Specs PDF` et `Cas fictifs` ; le mode et la réinitialisation restent accessibles sur ordinateur.
- **Décidé** : les décisions et les établissements deviennent des rails horizontaux à points d'arrêt sur mobile afin de réduire fortement la hauteur de page.
- **Décidé** : une courte consigne de balayage rend ce comportement découvrable ; la première carte reste entièrement visible.
- **Décidé** : la palette évolue vers un fond froid très clair, une encre bleutée, un turquoise plus lumineux et un accent abricot, avec des cartes moins massives et des ombres plus fines.
- **Confirmé** : les couleurs d'état restent distinctes et ne portent jamais seules l'information.
- **Confirmé** : le desktop reste riche et les changements visuels y améliorent la hiérarchie sans modifier sa structure.

### 3. Fichiers concernés

- `components/app-shell.tsx` : navigation mobile illustrée et état actif.
- `components/briefing-client.tsx` : indication de balayage des priorités.
- `components/multisites-client.tsx` : indication de balayage des établissements.
- `app/globals.css` : palette, surfaces, navigation fixe, rails et densité mobile.
- `app/page.test.tsx` : présence des affordances mobiles sans régression des parcours.
- `PROJECTS/pilotage-restaurants/project-state.md` : suivi de la phase.

### 4. Vérifications prévues

```bash
pnpm check:web
pnpm check
```

Contrôles visuels sur les quatre vues à 1280 px et 390 px, avec vérification des cibles tactiles, du contenu masqué par la barre basse, des rails, des fenêtres et de l'absence de débordement global.

Résultat : `pnpm check` réussit avec 13 tests web et 22 tests API ; lint, types et build passent. À 390 px, Décisions et Établissements n'ont aucun débordement global, leur rail est réellement défilable, la navigation reste fixée au bas de la fenêtre et la page conserve une marge suffisante pour ne masquer aucun contenu. La vue Décisions mesure environ 1 330 px et Établissements environ 1 440 px dans le cas principal, contre plus de 2 000 px avant la phase. Aucun message d'erreur n'est émis dans la console. Le contrôle à la largeur disponible de 920 px confirme également la conservation de la composition tablette/ordinateur.

### 5. Critères de sortie

- Les quatre tâches sont accessibles au pouce sans remonter en haut de page.
- Le contexte de page reste visible avec un en-tête mobile compact.
- Les trois décisions et les trois établissements se consultent sans tripler la hauteur de page.
- Les boutons `Specs PDF` et `Cas fictifs` restent immédiatement visibles.
- La nouvelle palette fonctionne de façon cohérente sur ordinateur et mobile.
- Aucun contenu ni comportement métier n'est perdu.
- Tests, lint, types et build passent.

Phase terminée localement le 17 juillet 2026. Aucun commit, push ni déploiement n'est réalisé avant validation explicite.

## Phase 14 — rendre chaque onglet proportionné à sa tâche

### 1. Résultat de la phase

Établissements devient une vraie vue d'arbitrage groupe : synthèse, comparaison compacte et conclusion actionnable même lorsqu'aucun transfert n'est conseillé. Décisions donne la priorité aux trois actions, avec un seul résumé de service et les sources secondaires repliées.

### 2. Hypothèses et décisions

- **Confirmé** : aucun nouvel onglet, scénario ou système tiers n'est ajouté.
- **Décidé** : la grande typographie et les espacements de page sont légèrement réduits sur les quatre vues, sans banaliser la prévision principale.
- **Décidé** : Établissements remplace les trois grandes fiches répétitives par une lecture groupe puis une ligne comparable par site.
- **Décidé** : lorsqu'aucun transfert n'est utile, l'app explique le verrou et renvoie vers l'action locale pertinente au lieu d'afficher un simple état vide.
- **Décidé** : Décisions supprime la répétition du changement de prévision déjà disponible dans le Tableau de bord.
- **Décidé** : prévision utile, prochaine limite et effectifs par rôle sont fusionnés dans un seul résumé compact.
- **Décidé** : les systèmes interrogés passent dans un détail repliable ; leurs preuves restent disponibles.
- **Décidé** : les recommandations deviennent la zone dominante et s'affichent en trois colonnes sur ordinateur, puis une colonne sur mobile.
- **Décidé** : les outils occasionnels et le brouillon fournisseur sont repliés par défaut, surtout pour raccourcir le parcours mobile.
- **Décidé** : le pictogramme assiette/couverts devient aussi l'icône de l'onglet navigateur.

### 3. Architecture et flux

```text
Tableau de bord -> comprendre la situation
Décisions       -> résumé minimal -> 1 à 3 actions -> outils terrain
Établissements  -> synthèse groupe -> comparaison -> transfert ou plan local
Journal         -> trace estimée / observée
```

Aucune donnée ni règle ne change. Les composants recomposent les fixtures déterministes déjà présentes ; les décisions continuent d'utiliser le contexte de session existant.

### 4. Fichiers concernés

- `components/multisites-client.tsx` : synthèse groupe, comparaison et conclusion.
- `components/briefing-client.tsx` : résumé fusionné, sources repliées et priorités numérotées.
- `app/globals.css` : proportions, grilles desktop/mobile et densité.
- `app/page.test.tsx` : structure opérationnelle et absence de répétition.
- `app/icon.svg` : favicon cohérent avec le pictogramme de l'application.
- `references/ETUDE_COMPLETE.md`, `scripts/build_revised_study.py` et `output/pdf/…revision.pdf` : étude complète conservée et addendum actualisé.
- `public/specs-prototype-app.pdf` et `components/app-shell.tsx` : copie publique et accès `Specs PDF` dans l'en-tête.
- `PROJECTS/pilotage-restaurants/project-state.md` : suivi de la phase avant commit.

### 5. Étapes d'implémentation

1. Réorganiser Établissements autour de l'arbitrage.
2. Réduire Décisions à une seule couche de contexte.
3. Donner la priorité visuelle aux recommandations.
4. Harmoniser en-têtes, cartes secondaires et Journal.
5. Vérifier les parcours et le responsive.

### 6. Vérifications

```bash
pnpm check:web
pnpm check
```

Contrôles visuels à 1280 px et 390 px sur les quatre onglets. Les tests garantissent trois établissements comparables, une conclusion sans transfert, un résumé unique dans Décisions, trois rôles, trois priorités maximum et la conservation des interactions existantes.

Résultat : `pnpm check` réussit avec 13 tests web et 22 tests API. Lint, types et build passent. À largeur étroite de contrôle (287 px, plus contraignante que la cible), aucun débordement n'est observé ; Décisions passe d'environ 2 600 px à 2 030 px de hauteur, les outils secondaires fermés occupent 63 px et le fournisseur 123 px. Tableau de bord et Établissements restent autour de 2 100 px, Journal sous 1 000 px. Le PDF public répond en `200`, contient 32 pages A4 et ses quatre pages d'addendum ont été rendues puis inspectées sans coupure ni chevauchement.

### 7. Risques et solutions de repli

- **Données incohérentes** : tous les agrégats sont dérivés des mêmes fixtures de sites.
- **Fuite temporelle** : aucune valeur future ni valeur observée n'est ajoutée.
- **Prévision trop précise** : fourchette et confiance restent dans le résumé de décision.
- **API simulée irréaliste** : les preuves des sources restent marquées fictives et seulement consultables.
- **Règle inexécutable** : l'absence de marge mobilisable interdit toujours un transfert.
- **Interface trompeuse** : la conclusion distingue explicitement transfert simulé et action locale.
- **Perte d'information** : les sources sont repliées, jamais supprimées.

### 8. Critères de sortie

- La question « quel site a besoin d'aide et qui peut aider ? » se lit sans ouvrir trois fiches.
- Le cas sans transfert débouche sur une orientation utile.
- Les recommandations apparaissent avant les outils secondaires.
- Une seule synthèse du service précède les actions.
- Aucun nouvel onglet ni doublon fonctionnel n'est créé.
- Le PDF public conserve les 28 pages initiales et actualise uniquement l'addendum de quatre pages.
- Aucun débordement à 1280 px et 390 px.
- Tests, lint, types et build passent.

Phase terminée localement le 17 juillet 2026. Le commit, le push et le redéploiement restent soumis à validation explicite.

Correction post-validation : `Specs PDF` utilise désormais un bouton safran plein et `Cas fictifs` un bouton turquoise plein. Sur mobile, `Cas fictifs` reste visible avec une cible de 44 px ; seul `Réinitialiser`, action secondaire, est masqué.

Le résumé replié du fournisseur est également ramené à la même hauteur et au même poids typographique que `Consigne terrain et transmission` sur ordinateur ; le montant et l'heure limite restent ses seuls accents.

## Phase 13 — compléter le P0 sans alourdir l'application

### 1. Résultat de la phase

Les quatre écrans restent inchangés dans leur rôle, mais récupèrent les preuves essentielles du brief initial : horizon à sept jours, lecture par site et service, besoins par rôle, décisions modifiables avec motif, exemples jouables en vase clos et suivi mensuel prévu/réel prudent.

### 2. Hypothèses et décisions

- **Confirmé** : aucun nouvel onglet ne sera créé.
- **Décidé** : la prévision à sept jours tient dans une seule bande compacte du Tableau de bord, avec choix local du site et du service.
- **Décidé** : changer le site ou le service de cette bande ne modifie pas le reste de la démonstration ; il s'agit d'un horizon de consultation fictif clairement étiqueté.
- **Décidé** : chaque exemple devient jouable à l'intérieur de la fenêtre, puis se referme sans modifier l'application principale.
- **Décidé** : `Modifier` et `Refuser` exigent une note courte ; cette note est conservée dans le Journal.
- **Décidé** : une décision dépassée est visible mais non actionnable selon l'heure de l'instantané fictif.
- **Décidé** : le besoin d'effectif est résumé par rôle `Salle`, `Cuisine` et `Bar`, sans construire un planning complet.
- **Décidé** : le cas principal conserve fûts et glaçons mais ajoute une préparation cuisine concrète parmi les trois priorités.
- **Décidé** : le Journal affiche juillet 2026, le gain estimé et les champs réels volontairement indisponibles ; aucun résultat terrain ne sera inventé.

### 3. Architecture et flux

```text
Fixtures déterministes
  ├─ horizon[site][service][7 jours] -> bande du Tableau de bord
  ├─ staffing[3 rôles]              -> contexte Décisions
  ├─ recommandations + cutoff       -> action ou état expiré
  └─ décisions + note               -> Journal mensuel

Fenêtre Cas fictifs
  scénario sélectionné -> action locale simulée -> résultat local
  fermeture -> aucune mutation du contexte principal
```

L'horizon, les rôles et les scénarios restent des fixtures de démonstration typées. La prévision numérique, les recommandations et leur explication restent séparées. Les interactions de scénario utilisent exclusivement un état local au composant de fenêtre.

### 4. Fichiers concernés

- `demo/scenarios.ts` : horizon, besoins par rôle, note de décision et préparation cuisine.
- `demo/demo-context.tsx` : conservation du motif de modification/refus.
- `components/cockpit-page.tsx` : bande à sept jours et choix de lecture.
- `components/briefing-client.tsx` : rôles, échéance et formulaire de motif.
- `components/scenario-library.tsx` : mini-parcours jouable isolé.
- `components/roi-client.tsx` : synthèse mensuelle et note de décision.
- `app/globals.css` et `app/page.test.tsx` : présentation, responsive et tests.

### 5. Étapes d'implémentation

1. Étendre le contrat des fixtures avec horizon, rôles et note.
2. Ajouter l'horizon sept jours filtrable au Tableau de bord.
3. Afficher les besoins Salle/Cuisine/Bar dans Décisions.
4. Exiger et tracer un motif pour modifier ou refuser.
5. Rendre une décision expirée non actionnable.
6. Rendre les exemples jouables uniquement dans leur fenêtre.
7. Ajouter la lecture mensuelle prévu/réel dans Journal.
8. Vérifier ordinateur, mobile et tous les parcours.

### 6. Vérifications

```bash
pnpm check:web
pnpm check
```

Les tests couvriront les sept jours, les trois sites, les deux services, les trois rôles, le motif obligatoire, l'échéance expirée, l'abstention jouable, l'absence de mutation après fermeture et l'absence de gain observé fabriqué.

Résultat : `pnpm check` réussit avec 12 tests web et 22 tests API. Le lint, les contrôles TypeScript/Python et le build Next.js passent. Le Tableau de bord a été contrôlé à 1280 px et 390 px sans débordement horizontal ; à 390 px, les sept jours défilent dans leur propre bande. L'écran Décisions affiche bien les trois rôles et leurs écarts. Les tests rejouent la modification motivée, sa trace dans le Journal, l'abstention, l'échéance expirée et l'absence de mutation du scénario principal.

### 7. Risques et solutions de repli

- **Données incohérentes** : types uniques et valeurs d'horizon bornées autour des niveaux propres à chaque site.
- **Fuite temporelle** : l'horizon reste une projection arrêtée à `asOf`, sans résultat futur observé.
- **Prévision trop précise** : valeurs arrondies et mention de projection fictive ; le service courant conserve sa fourchette.
- **API simulée irréaliste** : aucune mention de temps réel ou de connexion active n'est ajoutée.
- **Règle inexécutable** : comparaison explicite entre heure limite et instantané du scénario.
- **Interface trompeuse** : les scénarios joués restent dans une fenêtre marquée fictive ; le réel du Journal reste vide.
- **Surcharge** : un seul composant compact par manque identifié et aucune navigation supplémentaire.

### 8. Critères de sortie

- Sept jours sont visibles sans grand graphique.
- Les trois sites et les services déjeuner/dîner sont consultables.
- Salle, Cuisine et Bar affichent planifié/requis.
- Modifier ou refuser nécessite une note visible dans Journal.
- Une action expirée est bloquée avec une raison.
- L'abstention et au moins un cas décisionnel sont jouables sans changer l'application principale.
- Le Journal distingue estimé et observé.
- Aucun débordement à 1280 px et 390 px.
- Tests, lint, types et build passent.

Phase terminée localement le 17 juillet 2026. Aucun commit ni déploiement n'est réalisé avant validation explicite.

Avant publication, le nom générique `Service` est remplacé par `Prototype App` dans l'en-tête, le titre du navigateur et le message de partage. Le sous-titre `Pilotage restaurants` conserve le contexte métier.

## Phase 12 — une navigation par tâches, sans répétition

### 1. Résultat de la phase

L'application passe de six onglets qui racontent souvent la même prévision à quatre espaces correspondant à quatre tâches : comprendre, décider, arbitrer entre sites et consulter le journal. Les scénarios fictifs deviennent une bibliothèque modale sans effet sur l'état de l'application ; l'explication du calcul devient un détail contextuel du Tableau de bord.

### 2. Hypothèses et décisions

- **Confirmé** : le responsable opérationnel doit comprendre où aller sans connaître le vocabulaire du prototype.
- **Décidé** : navigation principale limitée à `Tableau de bord`, `Décisions`, `Établissements` et `Journal`.
- **Décidé** : `Scénarios` quitte la navigation ; le bouton `Cas fictifs` ouvre une fenêtre et ne change jamais le scénario actif.
- **Décidé** : `Explications` quitte la navigation ; la méthode, la référence et les facteurs sont consultables depuis la prévision du Tableau de bord.
- **Décidé** : le Tableau de bord ne répète plus toutes les cartes de facteurs ; il montre la situation, les quatre vigies et les décisions à prendre.
- **Décidé** : Décisions ne répète plus un faux écran de téléphone ni toute la narration ; il conserve un contexte chiffré compact, les actions, les systèmes et le fournisseur.
- **Décidé** : Journal se concentre sur la trace et les montants estimés, sans bloc promotionnel renvoyant vers un autre onglet.
- **Décidé** : le manager peut ajouter une décision libre avec responsable et heure limite ; elle rejoint immédiatement le Journal.
- **Décidé** : un partage prépare un briefing texte et peut ouvrir SMS ou WhatsApp via les liens natifs du terminal ; aucun destinataire n'est prérempli et aucun message n'est envoyé automatiquement.
- **Confirmé** : toute donnée reste fictive et toute action reste réversible ou simulée.

### 3. Architecture et flux

```text
Tableau de bord
  situation + vigies + raccourci vers Décisions
  └─ détail contextuel « Voir le calcul »

Décisions
  contexte compact + 3 actions + décision libre + systèmes/fournisseur
  └─ message préparé -> SMS ou WhatsApp -> confirmation dans l'app tierce

Établissements
  comparaison + transfert simulé

Journal
  décisions prises + gain estimé/non observé

Cas fictifs (fenêtre)
  aperçu local uniquement -> fermeture -> application inchangée
```

Le contexte fictif principal reste déterministe. La bibliothèque lit les mêmes fixtures mais n'appelle jamais `selectScenario`. Les décisions de session continuent d'alimenter le Journal. Prévision, recommandations et explication restent séparées dans les données, même lorsqu'elles sont rapprochées visuellement.

### 4. Fichiers concernés

- `components/app-shell.tsx` : quatre destinations et ouverture de la bibliothèque.
- `components/scenario-library.tsx` : fenêtre d'aperçu fictif sans mutation.
- `components/cockpit-page.tsx` : suppression des répétitions et explication contextuelle.
- `components/briefing-client.tsx` : écran Décisions recentré sur l'action.
- `demo/demo-context.tsx` : ajout traçable d'une décision libre.
- `components/roi-client.tsx` : Journal simplifié.
- `app/scenarios/page.tsx` : ancienne route mutante neutralisée.
- `app/globals.css` et `app/page.test.tsx` : styles, responsive et parcours.

### 5. Étapes d'implémentation

1. Réduire la navigation et ajouter la fenêtre `Cas fictifs`.
2. Garantir qu'explorer ou fermer un exemple ne modifie pas l'application.
3. Élaguer le Tableau de bord et intégrer l'explication en disclosure.
4. Élaguer Décisions et Journal autour de leurs tâches propres.
5. Ajouter une décision libre et préparer son partage SMS/WhatsApp avec confirmation externe.
6. Neutraliser l'ancien parcours `/scenarios` qui mutait toute l'application.
7. Vérifier le parcours complet sur ordinateur et mobile.

### 6. Vérifications

```bash
pnpm check:web
pnpm check
```

Tests attendus : quatre liens principaux seulement ; fenêtre accessible ; changement d'aperçu sans changement du scénario actif ; fermeture explicite ; prévision détaillable depuis le Tableau de bord ; décisions et fournisseur toujours actionnables ; décision libre ajoutée au Journal ; liens SMS/WhatsApp préremplis sans envoi automatique ; aucune régression responsive.

Résultat : 9 tests web et 22 tests API réussis. Lint, types et build Next.js passent. Les parcours ont été joués dans le navigateur : aperçu d'un scénario puis fermeture avec prévision inchangée à 140, ajout d'une décision libre, préparation des liens SMS/WhatsApp et trace dans Journal. Aucun débordement horizontal n'a été observé à 1280 px et 390 px. Les anciennes routes `/diagnostic` et `/scenarios` répondent par une redirection vers `/cockpit`.

### 7. Risques et solutions de repli

- **Données incohérentes** : la fenêtre lit les fixtures existantes sans créer de second état métier.
- **Fuite temporelle** : l'instantané `asOf` reste visible dans le détail de calcul.
- **Prévision trop précise** : fourchette et confiance restent visibles dans le résumé compact.
- **API simulée irréaliste** : les systèmes restent marqués comme interrogés dans la démo, jamais réellement connectés.
- **Règle inexécutable** : les actions et leur heure limite restent exclusivement dans Décisions.
- **Interface trompeuse** : la fenêtre indique explicitement qu'elle ne modifie rien et qu'aucune donnée n'est réelle.
- **Perte de profondeur** : le détail du calcul reste accessible depuis le Tableau de bord ; les anciennes routes `/diagnostic` et `/scenarios` redirigent vers lui au lieu de maintenir des écrans parallèles.

### 8. Critères de sortie

- Quatre destinations principales maximum.
- Chaque destination répond à une question opérationnelle distincte.
- Aucun bloc important n'est répété à l'identique entre Tableau de bord et Décisions.
- Les scénarios sont consultables sans modifier l'application.
- Le calcul reste accessible en un clic depuis la prévision.
- Le workflow fournisseur et le Journal restent fonctionnels.
- Une décision libre peut être ajoutée puis incluse dans un message préparé pour SMS ou WhatsApp.
- Aucun débordement à 1280 px et 390 px.
- Tests, lint, types et build passent.

## Phase 11 — systèmes tiers et brouillons d'action

### 1. Résultat de la phase

La démo simule des intégrations concrètes avec caisse, réservations, planning et fournisseur. Le scénario concert permet d'interroger un catalogue fournisseur fictif, de vérifier disponibilité et contraintes, puis de préparer et confirmer une commande entièrement simulée, traçable dans le registre. Le premier écran devient un tableau de bord opérationnel : prévision, signaux croisés, météo, événement, échéance d'équipe, fenêtre fournisseur et trois décisions maximum.

### 2. Hypothèses et décisions

- **Confirmé** : aucune API réelle, aucun fournisseur réel et aucune commande réelle ne sont appelés.
- **Confirmé** : le parcours doit rester crédible pour un petit groupe urbain de trois établissements, notamment un groupe de taille comparable à une cible rennaise.
- **Décidé** : l'interface affiche la fraîcheur et le statut de chaque système interrogé au lieu d'un vague badge « connecté ».
- **Décidé** : la décision fournisseur suit deux étapes distinctes : « Préparer le brouillon » puis « Confirmer dans la démo ».
- **Décidé** : la confirmation produit uniquement un événement fictif dans le registre ; elle ne prétend jamais avoir transmis une commande externe.
- **Décidé** : le catalogue vérifie référence, conditionnement, stock disponible, prix, minimum de commande, heure limite et créneau de livraison.
- **Décidé** : aucun nouvel onglet n'est nécessaire ; le détail des systèmes et le brouillon vivent dans le Briefing, puis la trace apparaît dans Valeur.
- **Décidé** : l'onglet existant « Aujourd'hui » est renommé « Tableau de bord » ; sa projection décorative à sept jours est remplacée par quatre vigies opérationnelles.
- **Décidé** : l'échéance d'équipe reste anonyme et fictive ; aucun nom ni donnée personnelle n'est présenté.

### 3. Architecture et flux

```text
Signaux fictifs
  caisse + réservations + événement + météo + stock
                    |
                    v
          recommandation déterministe
                    |
                    v
     catalogue fournisseur fictif interrogé
     - 2 fûts de 30 L disponibles
     - 4 sacs de glaçons de 10 kg disponibles
     - minimum, prix, cutoff et livraison vérifiés
                    |
                    v
       brouillon -> confirmation humaine fictive
                    |
                    v
              registre de valeur
```

Les instantanés de scénario reçoivent une liste de `systems` et, lorsque pertinent, un `supplierWorkflow`. L'état de session distingue `recommended`, `drafted` et `confirmed_demo`. La prévision numérique reste indépendante ; le workflow fournisseur consomme seulement la recommandation déjà calculée.

### 4. Fichiers concernés

- `apps/web/src/demo/scenarios.ts` : systèmes interrogés, catalogue et contraintes fictives.
- `apps/web/src/demo/demo-context.tsx` : état du brouillon et confirmation de démonstration.
- `apps/web/src/components/briefing-client.tsx` : fraîcheur des systèmes, lignes de commande et double confirmation.
- `apps/web/src/components/roi-client.tsx` : trace du brouillon et de la confirmation fictive.
- `apps/web/src/components/cockpit-page.tsx` et `components/app-shell.tsx` : tableau de bord et navigation.
- `apps/web/src/app/globals.css` et tests : présentation et parcours.

### 5. Étapes d'implémentation

1. Ajouter les contrats de système tiers et de catalogue fournisseur.
2. Décrire le workflow concert : deux fûts de 30 L et quatre sacs de glaçons de 10 kg.
3. Afficher les systèmes interrogés avec statut et dernière synchronisation.
4. Créer le brouillon avec lignes, quantité, prix, total, cutoff et livraison.
5. Ajouter la confirmation fictive et sa trace dans Valeur.
6. Bloquer le workflow fournisseur lorsque la qualité des données est insuffisante.
7. Remplacer la projection à sept jours par la vigie météo, événement, équipe et fournisseur.

### 6. Vérifications

```bash
pnpm check:web
pnpm check
```

Résultat : 11 tests web réussis ; catalogue disponible, minimum respecté, brouillon créé, confirmation humaine obligatoire, aucune transmission externe, événement visible dans Valeur et aucun workflow fournisseur dans le scénario de données insuffisantes. Lint, types et build Next.js réussis. Le parcours a aussi été joué dans le navigateur ; à 390 px, aucune page contrôlée ne déborde horizontalement.

### 7. Risques et solutions de repli

- **Automatisation trompeuse** : utiliser systématiquement « brouillon » et « confirmation fictive », jamais « commande envoyée ».
- **Catalogue irréaliste** : montrer conditionnement, quantité disponible, prix, cutoff et créneau.
- **Trop de complexité** : un seul fournisseur et deux références dans le cas principal ; aucun écran d'administration.
- **Couplage prévision/achat** : la prévision ne connaît ni prix ni fournisseur ; le workflow démarre après la recommandation.
- **Donnée indisponible** : bloquer le brouillon avec une raison visible, sans produit de secours silencieux.

### 8. Critères de sortie

- Le manager voit quelles sources ont été interrogées et quand.
- Le catalogue fictif produit un brouillon concret de deux fûts et quatre sacs de glaçons.
- Prix, total, disponibilité, minimum, cutoff et livraison sont visibles.
- La confirmation humaine est obligatoire et explicitement simulée.
- Valeur conserve la trace de l'action sans revendiquer une commande réelle.
- Le parcours reste utilisable sur ordinateur et mobile.
- Le Tableau de bord montre quatre échéances opérationnelles et trois priorités maximum.
- Tests, lint, types et build passent avant publication.

## Phase 10 — application de démonstration cohérente

### 1. Résultat de la phase

Le prototype public devient une application de test autonome : un scénario fictif est choisi dans un laboratoire unique, puis Cockpit, Briefing, Établissements, Valeur et Explications représentent tous le même monde et évoluent avec les décisions de l'utilisateur. La profondeur fonctionnelle prime sur la fidélité d'une API de production ; aucune panne ou latence de l'API ne doit empêcher la démonstration.

### 2. Hypothèses et décisions

- **Confirmé** : toutes les données restent fictives et la démo n'a pas à prouver une intégration réelle.
- **Confirmé** : la cible est d'abord une expérience riche sur ordinateur, adaptée proprement aux tablettes et mobiles.
- **Confirmé** : les scénarios ne doivent être présentés qu'à un seul endroit ; la galerie est supprimée de la page Explications.
- **Proposé** : le laboratoire présente les six cas, un aperçu structuré et un bouton « Lancer dans l'app » ; il ne se contente plus d'ajouter un bloc de texte sous les cartes.
- **Décidé** : le scénario actif est conservé pendant la navigation de la session et indiqué dans la coque par un résumé et un lien « Changer », sans dupliquer le sélecteur. Un rechargement complet repart volontairement du cas initial.
- **Proposé** : la démo publique lit des instantanés TypeScript déterministes et complets. L'API FastAPI reste une preuve technique séparée, sans repli silencieux entre les deux modes.
- **Proposé** : les décisions accepter, modifier, refuser et réinitialiser sont simulées dans le navigateur ; elles modifient immédiatement les priorités et le registre de valeur.
- **Confirmé** : la démo doit matérialiser un positionnement différenciant de replanification, pas seulement exposer davantage de tableaux et de données.
- **Décidé** : chaque scénario décisionnel croise au moins trois familles de signaux parmi réservations, météo, événement, calendrier, accès/travaux, équipe, stock et contrainte fournisseur.
- **Décidé** : chaque décision majeure montre la référence sans signaux, l'effet cumulé des signaux, ce qui a changé depuis le calcul précédent, l'action encore possible et son heure limite.
- **Décidé** : la vue groupe montre les effets secondaires d'une décision sur les autres établissements afin de démontrer l'orchestration multi-sites.
- **À valider** : cette architecture de démo autonome remplace l'API comme source des écrans publics pendant cette phase.

### 3. Architecture et flux

```text
Laboratoire unique
  -> sélection du scénario
  -> état de démo partagé pendant la session
       -> Cockpit : journée, alertes et trois priorités
       -> Briefing : prévision, facteurs et décisions interactives
       -> Établissements : comparaison des trois sites et transfert
       -> Valeur : journal local des décisions simulées
       -> Explications : calcul et règles du scénario actif uniquement
```

Les données sont séparées en trois couches explicites : `forecast` pour les nombres et fourchettes, `recommendations` pour les règles et échéances, `explanations` pour la narration. Un fournisseur d'état client expose le scénario actif et les décisions. Les données de démonstration sont versionnées, reproductibles et marquées « fictives scénarisées » ; elles ne sont jamais présentées comme un résultat terrain ou un appel API temps réel.

Chaque monde contient aussi une matrice de signaux avec valeur antérieure, valeur actuelle, impact et fraîcheur. Le cockpit résume les croisements utiles, tandis que la page Explications expose le calcul de référence, les contributions cumulées et le contrefactuel sans le principal signal. Les recommandations restent déterministes : la narration explique une règle structurée, elle ne produit ni la prévision ni l'action.

### 4. Fichiers concernés

- `apps/web/src/demo/scenarios.ts` : six mondes fictifs complets et typés.
- `apps/web/src/demo/demo-context.tsx` : scénario actif, décisions locales et remise à zéro.
- `apps/web/src/app/layout.tsx` et `components/app-shell.tsx` : fournisseur global et résumé du mode démo.
- `components/scenario-player.tsx` : aperçu riche et lancement dans l'application.
- `components/cockpit-page.tsx` : situation quotidienne du scénario actif.
- `components/briefing-client.tsx` : décisions interactives et état après action.
- `components/multisites-client.tsx` : trois sites cohérents et transfert conditionnel.
- `components/roi-client.tsx` : registre fictif initial puis décisions de la session.
- `app/valeur/page.tsx` : route web distincte de l'endpoint JSON API `/roi` afin d'éviter le conflit observé sur Render.
- `components/diagnostic-client.tsx` : explication du seul scénario actif.
- `app/diagnostic/page.tsx` : suppression de la seconde galerie.
- `app/globals.css` et tests : états, transitions et responsive.

### 5. Étapes d'implémentation

1. Définir le contrat complet d'un monde de démonstration et les six jeux cohérents.
   - Inclure au moins trois signaux croisés par scénario décisionnel.
   - Inclure référence, dernière estimation, estimation actuelle et contrefactuel.
2. Ajouter le fournisseur global de session avec réinitialisation et mention permanente du mode fictif.
3. Transformer le laboratoire en aperçu puis lancement vers le Cockpit.
4. Brancher Cockpit et Briefing sur le même scénario et rendre les recommandations actionnables.
5. Brancher Établissements, Valeur et Explications sur ce même état ; supprimer toute galerie dupliquée.
6. Harmoniser les états normal, alerte, abstention et décision prise.
7. Vérifier les six parcours en ordinateur, tablette et mobile.

### 6. Vérifications

```bash
pnpm lint:web
pnpm typecheck:web
pnpm test:web
pnpm build:web
pnpm check
```

Les tests vérifieront qu'un scénario lancé dans le laboratoire change les cinq autres vues, qu'une décision met à jour le briefing et la valeur, que l'abstention n'affiche aucun nombre, que la réinitialisation restaure l'état déterministe et que la galerie n'existe qu'une fois. Une revue visuelle sera menée à 1280 px, 768 px et 390 px.

### 7. Risques et solutions de repli

- **Données incohérentes** : un schéma TypeScript unique et des invariants testés pour chaque monde.
- **Fuite temporelle** : chaque scénario conserve un `asOf` explicite ; aucune donnée postérieure n'est affichée dans l'explication.
- **Prévision trop précise** : fourchette, confiance et mention de simulation restent obligatoires ; l'abstention utilise des valeurs nulles.
- **API simulée irréaliste** : l'interface n'affirme plus être en temps réel ; elle se présente clairement comme une démo scénarisée autonome.
- **Règle inexécutable** : chaque recommandation possède contrainte, échéance, état et résultat après décision.
- **Interface trompeuse** : les instantanés calculés pour la démo, les règles et la narration restent visuellement séparés.
- **État local périmé** : l'état n'est conservé que pendant la navigation ; un rechargement ou le bouton « Réinitialiser » restaure le monde initial déterministe.

### 8. Critères de sortie

- Une seule page contient les six cartes de scénario.
- « Lancer dans l'app » change réellement toutes les autres vues.
- Chaque scénario décisionnel rend visibles au moins trois paramètres croisés et leur contribution.
- La valeur différenciante « détecter un changement, agir avant l'heure limite, arbitrer entre sites » est démontrée sans discours marketing isolé.
- Les cinq vues métier montrent le même site, le même instant et les mêmes priorités.
- Accepter, modifier ou refuser une action produit un changement visible et réversible.
- Les six scénarios montrent des parcours distincts, dont l'abstention et le transfert multi-sites.
- Aucun écran public ne dépend de la disponibilité de l'API pour fonctionner.
- Les frontières prévision, recommandation et explication restent explicites.
- Aucun débordement horizontal n'existe aux trois largeurs contrôlées.
- Tests, lint, types et build passent avant publication.

### Résultat du 17 juillet 2026

La démo publique ne dépend plus de l'API pour rendre ses écrans métier. Six mondes fictifs typés partagent le même contrat et croisent chacun trois à cinq signaux, avec au maximum trois recommandations. Le laboratoire est l'unique galerie : « Lancer dans l'app » active le monde choisi, puis Cockpit, Briefing, Établissements, Valeur et Explications restent cohérents pendant toute la navigation de la session.

Le concert croise réservations, événement, météo et stock ; l'annulation recalcule seulement les décisions encore réversibles ; le multi-sites simule l'état source et cible après transfert ; les travaux relient accès, annulations, stock et fournisseur ; les données dégradées produisent une abstention sans nombre de secours. Les actions du briefing et le transfert mettent immédiatement à jour le registre fictif.

La direction typographique éditoriale a été remplacée par une sans-serif système d'application, sans téléchargement externe, avec chiffres tabulaires. La revue visuelle confirme quatre colonnes à 1280 px et une colonne à 390 px, sans débordement horizontal. `pnpm check` réussit avec 10 tests web et 22 tests API, lint, types et build des neuf routes.

Publication : commit et push sur `main` approuvés explicitement le 17 juillet 2026, en excluant `prototype-use-cases/`. Le redéploiement Render sera contrôlé après le push.

Correctif après publication : la page web Valeur est déplacée de `/roi` vers `/valeur`, car le service combiné Render réservait `/roi` à la réponse JSON de l'API. Le scénario concert utilise désormais des unités opérationnelles de bar - deux fûts à mettre en froid et 40 kg de glaçons à sécuriser - au lieu d'une préparation exprimée en kilos de plats.

## Phase 9 — scénarios jouables et étude révisée

### 1. Résultat de la phase

Une nouvelle route `/scenarios` permet de jouer chacun des six scénarios simulés et d’observer la prévision, la fourchette, les facteurs, l’abstention éventuelle et les recommandations réellement renvoyées par l’API. Une édition révisée du PDF initial conserve l’étude d’origine et ajoute un bilan daté du prototype construit.

### 2. Hypothèses et décisions

- **Confirmé** : les scénarios restent déterministes, fictifs et servis par l’API existante.
- **Confirmé** : une carte de scénario ne doit plus laisser croire qu’elle est interactive si elle ne déclenche aucun calcul.
- **Décidé** : la page charge le catalogue API, puis active et calcule un scénario uniquement à la demande de l’utilisateur.
- **Décidé** : chaque cas possède aussi une trame pédagogique fictive (question manager et décision illustrée), explicitement séparée des nombres calculés, afin que la démonstration reste complète lorsque le moteur s’abstient ou ne propose aucune action.
- **Décidé** : République illustre les scénarios généraux, Liberté le déséquilibre et l’abstention, Gare les travaux.
- **Décidé** : le PDF original est conservé ; une édition révisée séparée ajoute un addendum au lieu de réécrire rétroactivement l’étude initiale.
- **Validé le 17 juillet 2026** : publication Git/Render de la phase 9 et conservation du PDF révisé comme livrable séparé.

### 3. Architecture et flux

La page web lit `GET /demo/scenarios`, puis utilise l’activation existante et `GET /briefings/{service_id}` de façon séquentielle. L’interface ne fabrique aucune valeur numérique : seules les métadonnées de présentation (site démontré, angle pédagogique et route complémentaire) sont locales. Le PDF révisé assemble les 28 pages originales et un addendum généré avec ReportLab ; le Markdown reçoit le même bilan sous forme éditable.

### 4. Fichiers concernés

- `apps/web/src/app/scenarios/page.tsx` : nouvelle route publique.
- `apps/web/src/components/scenario-player.tsx` : catalogue, activation et résultat.
- `apps/web/src/components/scenario-gallery.tsx` : liens explicites vers le joueur.
- `apps/web/src/components/app-shell.tsx`, `globals.css`, `lib/api.ts` et tests : navigation, styles et contrat.
- `references/ETUDE_COMPLETE.md` : addendum source.
- `scripts/build_revised_study.py` : génération reproductible de l’addendum et assemblage.
- `output/pdf/Analyse_pilotage_predictif_restaurants_premium_revision.pdf` : livrable révisé.

### 5. Étapes d’implémentation

1. Ajouter le catalogue et l’exécution séquentielle des scénarios côté web.
2. Construire la page de sélection et le panneau de résultat responsive.
3. Relier la galerie existante à la nouvelle route.
4. Rédiger l’addendum en distinguant démontré, simulé et restant à valider.
5. Générer, rendre et inspecter toutes les nouvelles pages du PDF.

### 6. Vérifications

```bash
pnpm check
python3 scripts/build_revised_study.py
pdfinfo output/pdf/Analyse_pilotage_predictif_restaurants_premium_revision.pdf
pdftoppm -f 29 -png output/pdf/Analyse_pilotage_predictif_restaurants_premium_revision.pdf tmp/pdfs/revision
```

Le parcours vérifie au minimum un scénario normal, l’annulation, le multi-sites, l’abstention et les travaux. La page est contrôlée en desktop et mobile.

### 7. Risques et solutions de repli

- **Course entre activations** : appels séquentiels et résultat marqué comme démonstration mono-session ; endpoint atomique dédié seulement si le prototype doit devenir multi-utilisateur.
- **Interface trompeuse** : bouton d’exécution explicite, état de calcul, mention permanente de données fictives et étiquette distincte « illustration fictive » pour la narration non calculée.
- **Prévision trop précise** : fourchette et confiance restent affichées ; l’abstention ne produit aucun nombre de secours.
- **PDF réécrivant l’histoire** : étude originale inchangée, addendum daté et statut de chaque preuve explicite.
- **Données simulées prises pour des résultats terrain** : aucun ROI observé ni validation client n’est revendiqué.
- **Régression de mise en page PDF** : rendu PNG et inspection des pages ajoutées avant livraison.

### 8. Critères de sortie

- Les six cartes possèdent un bouton fonctionnel et renvoient six résultats API distincts ou une abstention explicite.
- Le scénario actif, le site et la provenance fictive restent visibles.
- Aucun chiffre métier n’est codé en dur dans le joueur.
- Le PDF révisé conserve les 28 pages originales et ajoute un bilan lisible, sans texte coupé ni chevauchement.
- L’addendum sépare clairement « démontré par le prototype », « simulé uniquement » et « à valider en pilote réel ».
- Tests, lint, types, build web et tests API passent avant validation.

### Résultat du 17 juillet 2026

La route `/scenarios` charge les six configurations depuis l'API et permet de les jouer séparément. Le scénario d'annulation utilise la coupure de 13:45 afin d'intégrer l'information tardive ; le cas de données insuffisantes s'abstient sans valeur de secours et le cas multi-sites renvoie une proposition de transfert. Les résultats numériques calculés et l'illustration pédagogique non calculée sont identifiés séparément.

L'expérience conserve une mise en page riche à trois colonnes sur ordinateur, passe à deux colonnes sur tablette et à une colonne sur mobile. Le contrôle à 390 px confirme l'absence de débordement horizontal et une hauteur minimale de 48 px pour les boutons ; le contrôle à 1280 px confirme le retour à trois colonnes.

`pnpm check` réussit avec 8 tests web et 22 tests API, lint, types et build. Les six scénarios ont été rejoués directement contre l'API : 96 couverts en semaine normale, 140 pour le concert, 124 après annulation, 112 pour le déséquilibre, abstention sur données dégradées et 82 pour les travaux. Le PDF révisé contient 32 pages : les 28 pages initiales sont préservées et quatre pages d'addendum ont été rendues puis inspectées sans texte coupé ni chevauchement.

Publication : commit et push sur `main` approuvés explicitement le 17 juillet 2026, en excluant `prototype-use-cases/`.

## Phase 8 — refonte UX de la démonstration

### 1. Résultat de la phase

La démonstration doit paraître plus chaleureuse, plus premium et plus concrète, tout en restant immédiatement identifiable comme un prototype composé exclusivement de données fictives. La page « Pourquoi cette prévision ? » doit expliquer une prévision normale, puis montrer séparément le cas d'abstention, avec un établissement cohérent sur tout l'écran.

### 2. Hypothèses et décisions

- **Confirmé** : aucune donnée réelle, aucun appel externe et aucune modification du moteur numérique.
- **Confirmé** : les six scénarios simulés existants doivent devenir visibles et compréhensibles.
- **Décidé pour cette phase** : direction « brasserie éditoriale premium » — ivoire chaud, encre profonde, turquoise, safran et brique — inspirée du PDF sans reproduire une marque.
- **Décidé pour cette phase** : les exemples non calculés ne sont pas nécessaires ; la galerie s'appuie sur les six scénarios réellement configurés et les marque explicitement comme fictifs.
- **Hors périmètre** : nouveau modèle de prévision, nouvelles règles métier, données réelles, authentification et connecteurs.

### 3. Architecture et flux

Les contrats API, la simulation, la prévision et les règles restent inchangés. Le web reformate uniquement les sorties structurées : libellés français, hiérarchie visuelle, facteurs, intervalle, confiance et qualité. Le diagnostic charge une prévision calculée du scénario concert et un cas d'abstention du scénario de données dégradées, sans les confondre.

### 4. Fichiers concernés

- `apps/web/src/app/globals.css` : tokens, responsive, animations et composants visuels.
- `apps/web/src/components/app-shell.tsx` et `ui.tsx` : coque, navigation et éléments partagés.
- `apps/web/src/components/diagnostic-client.tsx` : explication normale + abstention.
- `apps/web/src/components/scenario-gallery.tsx` : six scénarios fictifs visibles.
- `apps/web/src/components/{cockpit-page,briefing-client,multisites-client,roi-client}.tsx` : harmonisation des écrans.
- `apps/web/src/app/*/page.tsx` et tests : microcopy et preuves de rendu.

### 5. Étapes d'implémentation

1. Refaire le socle visuel et la navigation sans modifier les routes.
2. Corriger le diagnostic et traduire les codes techniques.
3. Ajouter la galerie des six scénarios configurés.
4. Harmoniser les quatre écrans de décision.
5. Vérifier desktop, mobile, états asynchrones et accessibilité de base.

### 6. Vérifications

```bash
pnpm lint:web
pnpm typecheck:web
pnpm test:web
pnpm build:web
pnpm check
```

Une vérification visuelle est réalisée sur les cinq routes principales en desktop et sur le briefing en mobile.

### 7. Risques et solutions de repli

- **Interface trompeuse** : badge permanent « données fictives » et provenance sur les scénarios.
- **Confusion calcul/illustration** : aucun chiffre illustratif supplémentaire n'est présenté comme calculé.
- **Diagnostic encore opaque** : traduire méthode, confiance et qualité, puis séparer clairement prévision et abstention.
- **Régression responsive** : grilles à une colonne et cibles tactiles de 44 px sous 640 px.
- **Régression métier** : aucun changement des contrats ou calculs API pendant cette phase.

### 8. Critères de sortie

- Le site affiché dans le diagnostic correspond aux données chargées.
- Aucun code `abstain` ou `low_data_quality` n'est exposé à l'utilisateur.
- Facteurs, fourchette, confiance, référence et qualité sont compréhensibles en français.
- Les six scénarios fictifs sont visibles et nommés.
- Les cinq routes partagent une identité cohérente et responsive.
- Tests, lint, types et build passent avant demande de validation.

### Résultat du 17 juillet 2026

Le socle visuel adopte la direction « brasserie éditoriale premium » sur les cinq routes. Le diagnostic présente désormais une prévision enrichie de République avec référence, facteurs, impacts, fourchette, confiance et backtest, puis isole le cas d'abstention de Liberté dans un encart de prudence. Les six scénarios configurés sont visibles et explicitement marqués comme simulations. La vérification desktop et mobile ne montre aucun débordement horizontal ; `pnpm check` réussit avec 6 tests web et 22 tests API.

Publication : le commit `4fcfa18` est poussé sur `origin/main` et déployé sur Render. Les routes `/health`, `/cockpit`, `/briefing`, `/multisites`, `/roi` et `/diagnostic` répondent toutes `200`. Le diagnostic public contient la galerie des six scénarios et l’API publique renvoie la prévision enrichie attendue (140 couverts, fourchette 135–140, deux recommandations).

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
