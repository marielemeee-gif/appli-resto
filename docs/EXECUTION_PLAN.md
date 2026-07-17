# Plan d’exécution du prototype

Statut : **phase 12 réalisée localement et vérifiée, en attente de validation avant publication**
Date de cadrage : 17 juillet 2026

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
