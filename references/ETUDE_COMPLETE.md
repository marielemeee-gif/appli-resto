# Étude de faisabilité — plateforme de pilotage prédictif pour restaurants

Date : 17 juillet 2026

## 1. Conclusion rapide

Le produit est **techniquement faisable**, y compris avec Claude Code pour accélérer fortement le développement. En revanche, l'idée telle qu'elle est formulée n'est **pas nouvelle ni encore assez différenciante** : plusieurs acteurs prévoient déjà la demande et la convertissent en recommandations de stocks, commandes ou personnel.

Le risque principal n'est pas de réussir à afficher une prévision. Il est de :

1. obtenir les données de caisse, réservation, planning et stock dans un format exploitable ;
2. produire une prévision meilleure que les habitudes du manager ;
3. convertir cette prévision en recommandations assez fiables pour être suivies ;
4. démontrer une économie mensuelle supérieure au prix du logiciel ;
5. intégrer le produit dans un marché déjà équipé de nombreux outils.

La meilleure stratégie serait de commencer par **les restaurants, bars et petits groupes de 2 à 20 établissements**, et non par tous les commerces. Le premier terrain idéal est le groupe de restauration dont le responsable opérationnel commandite le projet : plusieurs établissements, un accès direct au décideur métier et la possibilité de tester sur des activités différentes sans devoir constituer immédiatement un réseau de concurrents.

Le positionnement recommandé :

> **La tour de contrôle opérationnelle des restaurants urbains : elle prévoit chaque service et dit quoi ajuster dans les équipes, la préparation et les commandes.**

L'angle différenciant le plus crédible n'est pas seulement la météo ou les événements, déjà utilisés par plusieurs concurrents. Ce serait la combinaison suivante :

- installation rapide sans remplacer la caisse, le planning ou le logiciel de stock ;
- prévisions hyperlocales intégrant événements, travaux et accessibilité du quartier ;
- recommandations simples et expliquées, service par service ;
- produit adapté aux indépendants et petits groupes français, souvent moins bien servis que les grandes chaînes ;
- preuve du gain en euros après chaque service.

## 2. Le produit précis

### Promesse utilisateur

Chaque jour, le responsable reçoit une « météo de l'activité » sur 7 à 14 jours :

> Vendredi soir : 128 couverts prévus, fourchette probable de 115 à 141. Demande supérieure de 18 % à un vendredi normal, principalement liée au concert voisin et à la météo sèche. Prévoir 4 personnes en salle et 3 en cuisine. Renforcer la préparation des trois plats les plus susceptibles d'être commandés.

Le produit ne doit pas être un tableau de bord supplémentaire. Sa valeur vient de la réponse à quatre questions :

1. Combien de clients, de couverts et de chiffre d'affaires attendre ?
2. De combien de personnes a-t-on besoin, par rôle et créneau ?
3. Quels plats, ingrédients ou familles de produits faut-il préparer et commander ?
4. Quelle action faut-il prendre si la demande prévue est trop faible ou trop forte ?

### Les quatre briques à terme

| Brique | Résultat produit | Niveau de difficulté |
|---|---|---:|
| Prévision | Couverts, tickets et CA par service, avec intervalle d'incertitude | Moyen |
| Personnel | Besoin par rôle et écart avec le planning existant | Moyen à élevé |
| Préparation et achats | Plats, ingrédients, quantités et date de commande | Élevé |
| Actions commerciales | Promotion, modification d'horaires, relance ou fermeture conseillée | Élevé |

Il ne faut pas automatiser immédiatement les commandes, les promotions ou les plannings. Au départ, le produit **recommande et explique** ; le manager valide. L'écriture automatique dans les autres outils n'arrive qu'après avoir établi la confiance.

## 3. Concurrence : ce qui existe déjà

Le marché valide le besoin, mais montre aussi que la simple « météo de la fréquentation » ne suffit pas à différencier l'entreprise.

| Acteur | Ce qu'il propose déjà | Conséquence pour le projet |
|---|---|---|
| [Fullsoon](https://fullsoon.co/) | Prévision des ventes, optimisation des stocks et automatisation des commandes pour restaurants, boulangeries et cantines | Concurrent français direct sur ventes et stocks |
| [Inpulse](https://www.inpulse.ai/) | Prévisions, stocks, achats et connexions fournisseurs ; annonce plus de 60 connexions de caisses et agrégateurs | Très avancé sur les intégrations et les groupes |
| [Covero](https://www.covero.fr/solutions/intelligence-artificielle-restaurant) | Prévision à 7 jours à partir des ventes, météo et événements, suggestions de commandes et effectifs par créneau | Proposition presque identique à l'idée initiale |
| [Nory](https://www.nory.ai/) | Prévision de la demande, plans de personnel, commandes, paie et suivi du compte de résultat | Vision de « système d'exploitation » très proche, orientée groupes |
| [ClearCOGS](https://www.clearcogs.com/) | Prévision, préparation, commandes et recommandations de personnel | Concurrent fort sur l'action opérationnelle |
| [Tenzo](https://www.gotenzo.com/) | Centralisation des outils, reporting et recommandations de performance | Concurrent sur la tour de contrôle et l'intelligence opérationnelle |
| [7shifts](https://www.7shifts.com/) | Planning, suivi du personnel et prévision de la demande | Très fort sur la partie équipes, surtout en Amérique du Nord |
| [PAR OPS](https://partech.com/fr/solutions/back-office-solutions/restaurant-forecasting-software/) | Prévision et suggestions de main-d'œuvre pour marques multi-sites | Acteur entreprise, plus lourd mais très installé |

### Carte fonctionnelle : ce qui est déjà largement couvert

Le tableau ci-dessous reprend ce que les éditeurs mettent publiquement en avant en juillet 2026. « Non mis en avant » ne prouve pas que la fonction n'existe pas ; cela signifie qu'elle n'apparaît pas clairement dans les pages publiques examinées.

| Fonction | Acteurs qui la mettent déjà en avant | Conclusion |
|---|---|---|
| Prévoir CA, ventes ou fréquentation | Fullsoon, Inpulse, Covero, Nory, ClearCOGS, Tenzo, PAR | **Banalisé** : ce n'est pas un positionnement suffisant |
| Utiliser météo, jours fériés et événements | Covero, Tenzo, Nory et ClearCOGS ; également évoqué dans les contenus de plusieurs autres acteurs | **Déjà courant** dans le forecasting moderne |
| Prévoir les plats ou ingrédients | Fullsoon, Inpulse, Covero, Nory, ClearCOGS | **Déjà couvert** et plus difficile qu'une prévision de couverts |
| Faire inventaires et suivi des écarts | Fullsoon, Inpulse, Nory | Ne pas reconstruire un logiciel de stock complet au départ |
| Proposer ou automatiser les commandes fournisseurs | Fullsoon, Inpulse, Nory ; suggestions chez Covero et ClearCOGS | Marché avancé, intégrations fournisseurs coûteuses |
| Générer des plans de préparation | Inpulse, ClearCOGS, Nory ; besoin de préparation anticipé par Tenzo | Déjà proposé, surtout pour chaînes et cuisines centrales |
| Recommander les effectifs | Covero, Nory, ClearCOGS, Tenzo, 7shifts, PAR | **Déjà couvert** : « X serveurs demain » n'est pas unique |
| Gérer le planning, les salariés et la paie | Nory et 7shifts ; Skello et Combo sont déjà très installés en France | Ne pas devenir un nouveau SIRH |
| Agréger caisse, planning, stock et réservations | Tenzo, Nory, Inpulse, ClearCOGS et PAR | La « tour de contrôle » seule existe déjà |
| Reporting multi-sites et alertes | Tenzo, Nory, Inpulse, PAR, ClearCOGS | Fonction nécessaire mais non différenciante |
| Questions en langage naturel / LLM | Tenzo le met explicitement en avant | Un chatbot Claude n'est pas un avantage durable |
| Fidélité, réputation, réservation, paiements | Covero et de nombreux logiciels spécialisés | À intégrer, pas à reconstruire |

[Fullsoon annonce](https://fullsoon.co/) déjà des prévisions à deux semaines du CA, des ventes, de la fréquentation et des ingrédients, ainsi que les inventaires et l'automatisation des commandes fournisseurs. [Inpulse annonce](https://www.inpulse.ai/) prévision et commandes IA, stocks, inventaires, plans de production et BI, avec plus de 3 500 points de vente. [Tenzo](https://www.gotenzo.com/) agrège ventes, travail, stocks, avis et réservations, puis prévoit à partir de la météo, des événements et jours fériés pour le staffing, les achats et la préparation. [ClearCOGS](https://www.clearcogs.com/) se présente déjà comme une couche ajoutée à la stack existante, alimentée automatiquement par la caisse, avec préparation, commandes et travail. Même l'argument « on ne remplace pas vos outils » est donc déjà utilisé.

### Ce qu'il ne faut surtout pas reconstruire

- une caisse ;
- un logiciel d'inventaire exhaustif ;
- un portail de commandes fournisseurs complet ;
- un SIRH avec contrats, pointage, congés et paie ;
- un CRM, une fidélité et une gestion d'avis ;
- un entrepôt de BI générique avec des dizaines de tableaux ;
- un chatbot posé sur les chiffres sans action opérationnelle précise.

Ces briques sont lourdes et déjà occupées. Le produit doit **lire leurs données et leur renvoyer une décision**, pas chercher à toutes les remplacer.

### Le territoire encore défendable

La différenciation proposée doit être plus précise qu'« hyperlocale » :

#### 1. Réagir aux changements, pas seulement donner une prévision hebdomadaire

Recalculer à J-7, J-3, J-1 puis quelques heures avant le service et signaler uniquement ce qui a changé : météo retournée, réservation qui accélère, événement déplacé, transport perturbé ou travaux nouveaux.

> « Depuis hier, la prévision de vendredi a baissé de 18 couverts. La commande peut encore être réduite avant 15 h ; après, il sera trop tard. »

La recommandation comporte une **échéance de décision**, un impact en euros et un niveau de confiance. Cette logique de replanification semble moins centrale dans les offres publiques observées que la simple prévision à 7 ou 14 jours. Elle devra néanmoins être vérifiée en démonstration commerciale auprès des concurrents.

#### 2. Orchestrer plusieurs établissements proches, pas seulement optimiser chaque site

Pour un groupe ayant plusieurs lieux dans une ville, le système peut proposer :

- déplacer un renfort de l'établissement A vers B ;
- transférer un stock court d'un site à un autre ;
- répartir une livraison ;
- comparer l'impact du même événement sur un bar, une brasserie et un restaurant ;
- détecter qu'une baisse dans un site correspond à une hausse dans un autre.

Cette approche est plus pertinente et juridiquement plus simple que de mutualiser immédiatement les chiffres de concurrents indépendants. Le premier « effet réseau » se construit **à l'intérieur d'un même groupe**.

#### 3. Construire une mémoire locale des événements et perturbations

Les bases publiques disent qu'un concert existe, mais rarement comment il affecte ce restaurant précis. Après chaque événement, le manager qualifie l'effet : avant, après, positif, négatif, type de clientèle, terrasse ou livraison. Le système apprend progressivement :

> « Les concerts au Liberté augmentent ce bar avant le spectacle, mais réduisent la brasserie pendant l'événement. »

Cette base d'impacts observés, propre aux lieux et aux concepts, est plus difficile à copier qu'une liste d'événements.

#### 4. Vendre une décision en trois lignes, pas un nouveau logiciel de gestion

Le cœur de l'expérience devient un briefing avec :

1. ce qui va se passer et la fourchette ;
2. ce qui a changé depuis la dernière prévision ;
3. l'action encore possible, son échéance et son gain estimé.

Le tableau de bord complet reste secondaire. Le produit peut ainsi se brancher à Skello, Combo, Fullsoon ou un autre outil au lieu de les affronter sur toutes leurs fonctions.

### Positionnement distinctif recommandé

> **Le copilote de replanification des petits groupes de restaurants urbains. Il détecte les changements locaux qui vont affecter chaque service et indique, avant qu'il ne soit trop tard, quel renfort, quelle préparation ou quelle livraison ajuster — y compris entre les établissements du groupe.**

Ce positionnement est plus étroit que l'idée initiale, mais aussi plus défendable. Il devra être testé par des démonstrations de Fullsoon, Inpulse, Covero et Tenzo : si l'un d'eux exécute déjà très bien ce scénario pour les petits groupes français, il faudra encore resserrer l'angle ou envisager de devenir une brique/partenaire plutôt qu'une plateforme concurrente.

Les réductions spectaculaires de déchets ou de gaspillage affichées sur certains sites concurrents sont des **affirmations commerciales des fournisseurs**, pas des hypothèses à reprendre telles quelles dans le business plan. Une baisse relative du gaspillage ne signifie pas une baisse équivalente du coût matière total.

### Ce qui peut réellement différencier le produit

1. **Petit groupe urbain français comme cœur de cible**  
   Des établissements assez structurés pour avoir des données et un budget, mais trop petits pour un projet logiciel lourd.

2. **Hyperlocal utile, pas décoratif**  
   Événements à proximité, capacité et horaire de l'événement, travaux, parking, transports perturbés et météo horaire. Il faut montrer l'impact attendu de chaque facteur, pas seulement afficher une liste d'événements.

3. **Temps d'installation inférieur à 48 heures**  
   Import CSV au départ, puis intégration à une caisse via un intermédiaire comme [HubRise](https://www.hubrise.com/), qui propose une API unique vers un écosystème de caisses et d'outils de restauration.

4. **Décision quotidienne très courte**  
   Une page ou un message quotidien : prévision, risque, trois décisions et gain estimé. Le manager ne doit pas analyser dix graphiques.

5. **Mesure de la valeur**  
   Après chaque service : prévision contre réel, recommandation suivie ou non, heures et déchets évités. Le produit doit savoir calculer son propre retour sur investissement.

### Ce qui ne constitue pas un avantage durable

- utiliser de l'IA ou un grand modèle de langage ;
- intégrer la météo et les jours fériés ;
- avoir un beau tableau de bord ;
- annoncer un taux de précision sans comparaison avec une méthode simple ;
- récupérer des données publiques accessibles à tous.

L'avantage durable viendra plutôt des connecteurs, de la qualité des historiques normalisés, des règles opérationnelles apprises avec les managers, de la distribution et du coût de changement une fois le produit intégré au fonctionnement quotidien.

## 4. Recommandations de fonctionnalités différenciantes

Toutes ces idées ne doivent pas être construites simultanément. Elles sont classées pour identifier celles qui peuvent créer une différence visible sans rendre le premier produit irréalisable.

| Piste | Valeur pour le client | Défendabilité | Difficulté | Moment recommandé |
|---|---|---:|---:|---|
| Alerte de replanification avec heure limite | Très forte | Moyenne | Moyenne | MVP |
| Optimisation entre sites d'un même groupe | Très forte | Forte | Moyenne | MVP 2 |
| Mémoire locale des événements | Forte | Forte avec le temps | Moyenne | MVP |
| Moteur qui sait s'abstenir | Forte pour la confiance | Moyenne | Moyenne | MVP |
| Registre des décisions et économies | Forte pour vendre et fidéliser | Forte | Faible à moyenne | MVP |
| Simulateur de scénarios | Moyenne à forte | Moyenne | Moyenne | V1 |
| Contraintes fournisseurs et sociales | Forte | Forte | Élevée | V1/V2 |
| Indice collectif de quartier | Potentiellement forte | Forte avec densité | Très élevée | Après PMF |

### 4.1. L'alerte « il est encore temps d'agir »

La plupart des produits mettent en avant la précision de la prévision. Le produit peut se concentrer sur la **fenêtre d'action** :

- commande modifiable avant 15 h ;
- planning modifiable sans pénalité avant J-3 ;
- campagne promotionnelle encore utile jusqu'à J-1 ;
- mise en place cuisine à ajuster le matin même ;
- terrasse à ouvrir seulement si la météo reste suffisamment fiable.

Chaque recommandation indique :

1. ce qui a changé ;
2. l'action proposée ;
3. l'heure limite ;
4. le gain ou risque estimé ;
5. le niveau de confiance.

Nom de fonctionnalité possible : **Fenêtre d'action** ou **Action avant**.

### 4.2. Le « dispatch » entre établissements

Pour un groupe de plusieurs établissements proches, créer un moteur de réallocation :

- renfort de personnel entre deux sites ;
- transfert d'un ingrédient à durée de vie courte ;
- répartition d'une livraison commune ;
- suggestion d'ouverture ou de fermeture de terrasse par site ;
- comparaison des capacités restantes du groupe.

Exemple :

> Le site République devrait être en sureffectif de 6 heures tandis que le site Liberté manque d'un serveur entre 18 h 30 et 21 h. Un transfert interne réduit le risque de sous-effectif sans ajouter de vacation.

Cette proposition est plus distinctive que la simple recommandation « prévoir quatre serveurs » et crée une valeur spécifique aux groupes urbains.

### 4.3. L'empreinte locale des événements

Construire pour chaque établissement une mémoire de l'impact réel des événements :

- distance et temps de marche ;
- public attendu ;
- horaire d'entrée et de sortie ;
- effet avant, pendant et après ;
- météo observée ;
- catégorie de restaurant favorisée ;
- impact sur place, terrasse, livraison et vente à emporter.

Deux concerts de même capacité ne génèrent pas la même clientèle. Après chaque occurrence, le responsable confirme ou corrige l'effet. Cette donnée propriétaire devient progressivement un véritable actif.

Nom possible : **Empreinte événement**.

### 4.4. Un moteur qui sait dire « je ne sais pas »

La confiance peut devenir une différence commerciale. Lorsque les données sont insuffisantes, le produit ne doit pas inventer une recommandation précise. Il affiche :

- une fourchette plus large ;
- la raison de l'incertitude ;
- les données manquantes ;
- une recommandation prudente ou aucune recommandation ;
- le moment du prochain recalcul.

Exemple :

> Prévision incertaine : première édition de cet événement et météo instable. Ne modifiez pas encore le planning ; nouvelle estimation demain à 10 h.

Ce comportement évite qu'une mauvaise première recommandation détruise la confiance du manager.

### 4.5. Le registre des décisions et du ROI

Pour chaque alerte, enregistrer :

- la recommandation ;
- son acceptation, modification ou refus ;
- la décision réellement prise ;
- le résultat du service ;
- l'économie ou le coût évité estimé ;
- le commentaire du manager.

Le responsable obtient ensuite un bilan mensuel :

> 23 recommandations utiles, 11 appliquées, 18 heures de personnel réaffectées, 640 € d'achats ajustés, 7 ruptures potentielles anticipées.

Ce registre sert simultanément à améliorer les modèles, prouver la valeur du logiciel et comprendre pourquoi certaines recommandations ne sont pas exécutables.

### 4.6. Le simulateur de scénarios

Permettre au manager de tester quelques questions concrètes :

- si la pluie commence à 18 h au lieu de 21 h ;
- si le concert est annulé ;
- si la terrasse reste fermée ;
- si une promotion de 10 % est lancée ;
- si une personne est absente ;
- si la livraison est avancée ou reportée.

Le simulateur ne doit pas promettre une causalité parfaite. Il calcule des scénarios à partir des effets observés et affiche les hypothèses utilisées.

Nom possible : **Et si ?**.

### 4.7. Les contraintes opérationnelles intégrées

Une recommandation devient vraiment utile lorsqu'elle respecte :

- les délais et jours de commande fournisseurs ;
- les conditionnements minimums ;
- la durée de conservation ;
- les compétences et rôles des salariés ;
- les temps de repos et contraintes contractuelles ;
- les seuils de marge ;
- la capacité de cuisine, de salle et de terrasse.

Les concurrents couvrent déjà une partie de ces sujets, mais une bibliothèque de contraintes préconfigurées pour les petits groupes français pourrait faciliter l'installation et améliorer la pertinence.

### 4.8. L'indice collectif de quartier, seulement à terme

Une fois plusieurs clients actifs dans une même zone, créer un indicateur agrégé :

> Quartier République : demande prévue supérieure de 12 % à la normale pour les bars, stable pour la restauration du midi.

Conditions indispensables :

- nombre minimal d'établissements ;
- aucune donnée individuelle visible ;
- indices et tendances plutôt que chiffre d'affaires ;
- données retardées lorsque nécessaire ;
- participation contractuelle volontaire ;
- validation juridique en droit de la concurrence.

Cette fonction peut créer un effet réseau, mais elle ne doit pas être nécessaire au lancement.

### 4.9. Le noyau différenciant recommandé

Pour rester réalisable, le produit devrait lancer une combinaison de trois fonctions :

1. **Fenêtre d'action** : ce qui a changé, quoi faire et avant quelle heure ;
2. **Empreinte événement** : mémoire de l'impact hyperlocal propre à chaque site ;
3. **Registre ROI** : décision prise et économie réellement observée.

Le **dispatch entre sites** devient la première extension pour les groupes de plusieurs établissements. Le simulateur et l'indice collectif arrivent ensuite.

Cette combinaison forme une proposition cohérente : détecter un changement local, recommander une décision encore exécutable, puis apprendre de son résultat. Elle est plus claire qu'une plateforme promettant simultanément stocks, paie, planning, CRM, commandes et fidélité.

## 5. Cible de lancement

### Cible recommandée

- groupes de 2 à 20 restaurants, bars, cafés ou boulangeries ;
- en centre-ville ou zones très sensibles aux événements et à la météo ;
- caisse numérique avec au moins 6 à 12 mois d'historique ;
- manager qui fait encore une partie des prévisions et commandes sur tableur ou à l'intuition ;
- masse salariale et achats assez élevés pour qu'une petite amélioration paie le logiciel.

### Cibles à éviter au début

- nouveau restaurant sans historique ;
- établissement saisonnier n'ayant qu'une seule saison de données ;
- très petit commerce sans caisse exportable ni budget logiciel ;
- grande chaîne nécessitant immédiatement audits de sécurité, dix intégrations et appels d'offres ;
- mélange restaurants + boutiques dès la V1.

Le commerce de détail pourra devenir une deuxième verticale. Les cibles, stocks, rythmes de décision et recommandations ne sont toutefois pas les mêmes. Construire les deux simultanément diluerait le MVP.

## 6. Où chercher les données

### Données internes : les plus importantes

| Donnée | Source possible | Utilité | Difficulté |
|---|---|---|---:|
| Ventes, tickets, couverts, articles, remises | Caisse : Zelty, Lightspeed, L'Addition, Tiller/SumUp, Innovorder, export CSV ou HubRise | Variable cible et historique | Critique |
| Réservations et annulations | Zenchef, TheFork, site du restaurant, cahier/export | Signal avancé très puissant | Moyenne |
| Vente sur place, à emporter et livraison | Caisse, Uber Eats, Deliveroo, agrégateur | Séparer des demandes différentes | Moyenne à élevée |
| Planning prévu et heures réalisées | Skello, Combo, badgeuse, CSV | Transformer la demande en besoin d'équipe | Élevée |
| Carte et fiches recettes | Caisse, logiciel de stock, tableur cuisine | Passer des plats aux ingrédients | Très élevée |
| Stock réel, pertes et ruptures | Inventaires, logiciel de stock | Calculer une commande fiable | Très élevée |
| Coûts, conditionnements et délais | Fournisseurs, factures, EDI | Optimiser commandes et marges | Très élevée |
| Promotions, fermetures, travaux internes | Saisie manuelle dans l'app | Éviter de confondre cause et demande | Faible, mais indispensable |

Une caisse compatible avec [HubRise](https://www.hubrise.com/apps) peut réduire fortement le nombre de connecteurs à développer. HubRise invite officiellement les éditeurs à utiliser son API et à publier leur application dans son écosystème. Il faudra néanmoins vérifier les données réellement accessibles, les autorisations du client et le coût par établissement.

### Données externes gratuites ou publiques

| Donnée | Source envisageable | Limite |
|---|---|---|
| Météo prévue et historique | [Météo-France Open Data](https://confluence-meteofrance.atlassian.net/wiki/spaces/OpenDataMeteoFrance/overview) ou API fondée sur les modèles Météo-France | La météo à J+7 est elle-même incertaine |
| Vacances scolaires | [API officielle du calendrier scolaire](https://www.data.gouv.fr/dataservices/api-calendrier-scolaire) | Effet différent selon clientèle et ville |
| Jours fériés | [API officielle des jours fériés](https://www.data.gouv.fr/dataservices/jours-feries) | Signal simple, peu différenciant |
| Événements publics | [OpenAgenda](https://openagenda.com/), [DATAtourisme](https://www.datatourisme.fr/), open data municipal, [data Culture](https://data.culture.gouv.fr/explore/) | Doublons, événements manquants, capacité rarement fiable |
| Travaux et circulation | Open data de chaque métropole ; [Rennes Open Data](https://data.rennesmetropole.fr/pages/home/) publie notamment des informations circulation/travaux | Formats et couverture variables selon les villes |
| Transports et perturbations | [transport.data.gouv.fr](https://doc.transport.data.gouv.fr/type-donnees/operateurs-de-transport-regulier-de-personnes/administration-des-donnees-transport-collectif/publier-des-donnees-temps-reel/temps-reel-des-transports-en-commun), GTFS et GTFS-RT | Mesure l'offre ou les perturbations, pas directement le nombre de piétons |
| Parking disponible | Portails open data municipaux lorsqu'ils publient le temps réel | Couverture locale et historique inégaux |
| Données touristiques | DATAtourisme, offices de tourisme, données territoriales et INSEE | Souvent descriptif ou agrégé, peu temps réel |

### Données difficiles ou payantes

- fréquentation piétonne réelle par rue ;
- présence agrégée issue des téléphones mobiles ;
- fréquentation touristique en temps quasi réel ;
- événements privés et billetterie détaillée ;
- réservations concurrentes ;
- données de transactions bancaires agrégées.

Ces données nécessitent généralement un accord avec une collectivité, un opérateur télécom, un spécialiste de la mobilité ou un fournisseur de données. Il ne faut pas construire le MVP en supposant qu'elles seront disponibles.

Les « heures d'affluence » visibles dans Google Maps ne sont pas un socle sûr : la documentation officielle de [Google Places API](https://developers.google.com/maps/documentation/places/web-service/overview) ne liste pas cette donnée. Des services tiers la récupèrent par scraping, ce qui ajoute risques contractuels, instabilité et coût. Le MVP doit fonctionner sans elle.

### Données des professionnels voisins

Cette idée peut devenir intéressante seulement lorsque la plateforme possède une densité suffisante dans une zone. Elle ne résout pas le démarrage : sans clients, il n'y a pas de signal collectif.

La V1 ne devrait jamais montrer le chiffre d'affaires, les prix, les promotions, les achats ou les prévisions d'un concurrent. L'[Autorité de la concurrence](https://www.autoritedelaconcurrence.fr/sites/default/files/2025-04/guide-pme.pdf) met en garde contre les échanges d'informations stratégiques entre concurrents. Une future donnée de quartier devrait être :

- volontaire et prévue contractuellement ;
- agrégée sur un nombre minimal d'établissements ;
- retardée et normalisée en indice, jamais en valeurs individuelles ;
- séparée par type d'activité lorsque c'est nécessaire ;
- validée par un juriste concurrence avant lancement.

Pour les données personnelles, la [CNIL rappelle](https://www.cnil.fr/fr/technologies/lanonymisation-de-donnees-personnelles) qu'une anonymisation doit rendre l'identification impossible ; une simple pseudonymisation ne suffit pas à faire sortir les données du RGPD.

## 7. Comment produire la prévision

### Niveau 1 : prévoir les couverts et le CA

Variables principales :

- même jour de la semaine et même service ;
- tendance récente ;
- saison, vacances et jours fériés ;
- réservations actuelles, annulations et délai moyen de réservation ;
- température, pluie, vent et écart à la normale saisonnière ;
- événements : distance, horaire, type, capacité et public ;
- promotion, changement de menu ou prix ;
- fermeture passée, rupture, privatisation et données anormales ;
- travaux, parking et transports lorsque la donnée existe.

Le premier modèle à battre est extrêmement simple : moyenne pondérée des quatre ou huit mêmes services précédents, corrigée de la tendance et des réservations. Il faut ensuite comparer des modèles de séries temporelles et des modèles tabulaires comme LightGBM ou CatBoost. Un modèle complexe qui ne bat pas cette référence ne crée aucune valeur.

Mesures recommandées :

- WAPE ou MAE pour les couverts et le CA ;
- erreur par établissement, jour et service ;
- comparaison avec la prévision manuelle du manager et la moyenne historique ;
- intervalle de prévision, par exemple une fourchette probable à 80 % ;
- backtests glissants respectant strictement la chronologie.

Il vaut mieux afficher « 120 à 140 couverts » que promettre artificiellement 132 couverts.

### Niveau 2 : traduire en effectifs

Une première règle peut être explicite :

> Besoin salle = socle minimum + couverts prévus / capacité habituelle par serveur.

Elle doit ensuite intégrer :

- rôle et compétences ;
- configuration de la salle et de la terrasse ;
- type de service ;
- heures de préparation et de fermeture ;
- disponibilités, contrats et temps de repos ;
- productivité propre à chaque établissement ;
- coût du sous-effectif et du sureffectif.

Le MVP recommande un besoin par rôle et compare ce besoin au planning existant. Il ne fabrique pas encore un planning légal complet.

### Niveau 3 : traduire en quantités et commandes

Pour recommander « 15 kg de viande », il faut :

1. prévoir les ventes de chaque plat ;
2. connaître la quantité de viande par recette et le rendement réel ;
3. connaître le stock utilisable et les pertes ;
4. appliquer un stock de sécurité ;
5. respecter le conditionnement fournisseur, le délai, le jour de livraison et la durée de vie.

Formule simplifiée :

> Quantité à commander = demande prévue × quantité recette ÷ rendement − stock utilisable + stock de sécurité.

Sans fiches recettes et stock fiable, le produit peut recommander des **volumes de plats à préparer**, mais pas une commande exacte d'ingrédients.

### Niveau 4 : promotion ou fermeture

Une faible fréquentation ne suffit pas à conseiller une promotion. Il faut estimer la marge additionnelle, le risque de cannibalisation et la capacité disponible. De même, recommander un jour de fermeture nécessite le résultat contributif du service : chiffre d'affaires moins matières, main-d'œuvre évitable et autres coûts variables. Les coûts fixes ne disparaissent pas parce que le restaurant ferme.

### Rôle d'un grand modèle de langage

Claude peut :

- expliquer la prévision en langage simple ;
- résumer les facteurs principaux ;
- convertir les résultats en briefing quotidien ;
- répondre à des questions sur les données ;
- aider à formaliser les règles métiers.

Il ne doit pas être le moteur mathématique qui invente le nombre de couverts. La prévision doit venir de modèles statistiques reproductibles ; les recommandations critiques doivent être calculées par des règles et contraintes auditables.

## 8. MVP recommandé

### MVP 0 — service manuel ou « concierge »

Durée : 3 à 4 semaines.

- récupérer 12 à 24 mois d'exports de caisse de 3 à 5 établissements ;
- nettoyer et agréger par déjeuner/dîner ;
- ajouter météo, calendrier et quelques événements ;
- construire un backtest ;
- envoyer chaque semaine un tableau ou PDF de prévisions ;
- demander au manager ce qu'il aurait décidé et ce qu'il a réellement décidé.

Objectif : prouver qu'il existe un gain avant de construire un SaaS complet.

### MVP 1 — application pilote

Durée : 6 à 10 semaines supplémentaires.

Fonctions indispensables :

- comptes séparés par groupe et établissement ;
- import CSV de caisse ;
- configuration des services, capacité et ratios d'équipe ;
- météo, vacances, jours fériés et événements ;
- prévision à 7 jours des couverts et du CA par service ;
- intervalle d'incertitude et principaux facteurs ;
- recommandation d'effectif par rôle ;
- prévision des 10 à 20 plats principaux, si les données article sont propres ;
- saisie manuelle des promotions, fermetures et événements manquants ;
- briefing quotidien par mail ou notification ;
- comparaison prévision/réel et bouton « recommandation suivie ».

À exclure :

- application mobile native ;
- commandes automatiques ;
- planning automatique complet ;
- données mutualisées entre concurrents ;
- tous les logiciels de caisse ;
- commerce de détail ;
- chatbot généraliste complexe ;
- données piétonnes payantes.

### MVP 2 — première version vendable

- un vrai connecteur de caisse, idéalement via HubRise ou la caisse du partenaire pilote ;
- import du planning existant ;
- recettes simplifiées pour les principaux produits ;
- suggestions de préparation et commandes non automatiques ;
- tableau multi-sites ;
- suivi du gain estimé et réalisé ;
- supervision des imports et dérives du modèle ;
- journal des modifications et gestion des droits.

## 9. Faisabilité avec Claude Code

Claude Code est un outil de développement capable de lire un dépôt, modifier plusieurs fichiers, exécuter des commandes et s'intégrer aux outils de développement, selon sa [documentation officielle](https://docs.anthropic.com/en/docs/claude-code/overview). Il peut aussi se connecter à des API et bases de données par [MCP](https://docs.anthropic.com/en/docs/claude-code/mcp).

### Ce que le porteur de projet peut construire avec Claude Code

| Travail | Faisabilité avec Claude Code | Besoin humain restant |
|---|---|---|
| Maquette et parcours de l'application | Très bonne | Arbitrage produit et retours restaurateurs |
| Front web responsive | Très bonne | Relecture UX et tests réels |
| API, base de données, authentification | Bonne | Revue sécurité et architecture |
| Import et normalisation CSV | Très bonne | Comprendre chaque export de caisse |
| Connexion météo/calendrier/événements | Bonne | Vérifier licences, qualité et résilience |
| Connecteur de caisse | Bonne si API accessible | Accord partenaire, identifiants et cas limites |
| Modèle de prévision initial | Bonne pour coder | Data scientist pour protocole, métriques et validation |
| Règles d'effectif et de commande | Bonne pour implémenter | Expertise métier du restaurateur |
| Tests et déploiement | Bonne | Exploitation, incidents et contrôle des coûts |
| RGPD, droit social, concurrence | Faible comme garant | Juriste/DPO et validation humaine |
| Sécurité de production | Insuffisante seule | Audit par développeur senior ou expert sécurité |

### Réponse objective

- **Oui**, un porteur de projet peut construire une démo convaincante et un MVP de test avec Claude Code, surtout si le premier import est un CSV.
- **Non**, il n'est pas raisonnable de mettre seul en production un produit qui ingère les ventes et plannings de plusieurs entreprises et recommande des commandes coûteuses sans revue technique.
- Claude Code écrit et corrige le logiciel ; il ne donne ni accès aux API fermées, ni historique propre, ni preuve que la prévision est bonne.
- Claude Code est l'outil de construction. Si Claude est présent dans le produit final, il faudra utiliser une API séparée ou un agent SDK, avec coûts et garde-fous propres. L'[Agent SDK](https://docs.anthropic.com/en/docs/claude-code/sdk) permet de programmer des agents en Python ou TypeScript, mais il n'est pas nécessaire au premier moteur de prévision.

### Équipe minimale conseillée

- porteur du projet : produit, entretiens, coordination, vente et tests ;
- responsable opérationnel commanditaire : sponsor, expert métier et partenaire du pilote ;
- un développeur senior ou CTO fractionnel : 0,5 à 1 jour par semaine ;
- un data scientist/ML engineer : environ 10 à 20 jours répartis sur le prototype et le pilote ;
- un juriste ou DPO : mission courte avant le pilote multi-entreprises.

Cette configuration permet d'utiliser Claude Code comme multiplicateur sans lui confier seul les décisions à risque.

## 10. Architecture technique simple

### Proposition

- interface : Next.js/TypeScript, responsive plutôt qu'application mobile ;
- base : PostgreSQL, éventuellement Supabase au début ;
- API et prévision : Python/FastAPI ;
- tâches planifiées : récupération nocturne des données et recalcul quotidien ;
- modèles : baseline saisonnière puis LightGBM/CatBoost et modèles de séries temporelles comparés ;
- hébergement : région européenne ;
- notifications : mail en premier, puis WhatsApp/SMS seulement si l'usage le justifie ;
- suivi : erreurs d'import, fraîcheur des données, performance du modèle et historique des recommandations.

### Données à stocker

- groupe, établissement et configuration ;
- ventes agrégées et éventuellement lignes d'articles ;
- services et horaires ;
- événements et signaux externes ;
- prévisions et intervalles ;
- recommandations, validation et résultat ;
- ratios opérationnels ;
- planning par rôle, avec le moins de données personnelles possible.

Le MVP n'a pas besoin des noms de clients ni des numéros de carte. Pour les équipes, il est préférable de commencer par les heures et les rôles agrégés plutôt que par des données individuelles. La [CNIL demande de ne collecter que les données nécessaires](https://www.cnil.fr/fr/comprendre-le-rgpd/les-six-grands-principes-du-rgpd) et d'établir des durées de conservation.

### Sécurité minimale avant un pilote externe

- isolation stricte des données de chaque groupe ;
- chiffrement en transit et au repos ;
- sauvegardes testées ;
- droits par rôle ;
- journal d'accès et d'actions ;
- secrets hors du code ;
- contrat de sous-traitance de données ;
- procédure de suppression/export ;
- tests de restauration et revue des dépendances.

## 11. Plan de lancement sur six mois

### Semaines 1 à 2 — découverte

- interroger 15 responsables, dont au moins 5 hors du cercle proche ;
- récupérer les outils utilisés, fréquence des décisions, erreurs coûteuses et budget logiciel ;
- auditer les exports du groupe pilote ;
- choisir une seule caisse et une seule solution de planning ;
- obtenir l'accord écrit d'utilisation des données.

Question centrale d'entretien : « Décrire la dernière situation de sureffectif, de sous-effectif ou d'erreur de marchandise : quel en a été le coût et quelle décision a été prise ? »

### Semaines 3 à 6 — preuve par les données

- charger et nettoyer l'historique ;
- créer une prévision de référence ;
- ajouter progressivement réservations, météo et événements ;
- simuler les 8 à 12 dernières semaines sans utiliser d'information future ;
- montrer les résultats au manager ;
- estimer les gains sur les décisions réellement modifiables.

Décision de poursuite uniquement si le modèle bat la référence simple et si les managers déclarent qu'ils auraient changé une décision.

### Semaines 7 à 14 — application pilote

- construire l'import, le tableau quotidien et les recommandations d'effectif ;
- ajouter le suivi prévision/réel ;
- utiliser le produit en parallèle du fonctionnement normal ;
- corriger les données et règles chaque semaine ;
- ne pas automatiser les commandes.

### Semaines 15 à 22 — pilote payé

- 5 à 10 établissements ;
- facturer un montant même réduit pour tester la volonté de payer ;
- formaliser onboarding, support et contrat ;
- mesurer économie, précision et adoption ;
- produire une étude de cas avec autorisation.

### Semaines 23 à 26 — lancement ciblé

- une offre, un segment, une caisse principale ;
- page commerciale avec un exemple chiffré réel ;
- « backtest gratuit de 14 jours » comme outil d'acquisition ;
- prospection de groupes similaires dans deux ou trois villes ;
- début d'un partenariat avec intégrateur de caisse ou HubRise.

## 12. Protocole de pilote et critères de succès

### Dispositif

- 3 à 5 établissements du même groupe au départ ;
- 12 mois d'historique minimum si possible ;
- 8 à 12 semaines de test en direct ;
- certains établissements ou services utilisés comme comparaison lorsque possible ;
- décisions enregistrées avant le service, pas reconstruites après coup.

### Indicateurs

1. erreur sur les couverts et le CA ;
2. amélioration par rapport à la moyenne des mêmes services passés ;
3. précision de la fourchette annoncée ;
4. heures planifiées et réalisées par tranche de CA ;
5. valeur des pertes, ruptures et achats urgents ;
6. temps manager économisé ;
7. taux d'ouverture du briefing et recommandations acceptées ;
8. gain financier directement attribuable.

### Seuils de poursuite proposés

Ce sont des objectifs de pilotage, pas des promesses commerciales :

- au moins 15 % d'amélioration de l'erreur par rapport à la référence simple ;
- bénéfice mesurable d'au moins 400 € par site et par mois ;
- bénéfice au moins deux fois supérieur au prix envisagé ;
- au moins 60 % des briefings consultés ;
- au moins 40 % des recommandations jugées utiles ou appliquées ;
- moins de deux heures de travail manuel par semaine et par nouveau site après stabilisation.

### Conditions d'arrêt ou de pivot

- impossibilité d'obtenir des données propres ou régulières ;
- modèle qui ne bat pas la méthode actuelle du manager ;
- gain inférieur au prix accepté ;
- managers intéressés par les graphiques mais ne changeant aucune décision ;
- onboarding qui reste artisanal et coûteux ;
- refus de payer plus de 80 à 100 € mensuels alors que le support demeure élevé.

## 13. Modèle économique

### Prix recommandé à tester

Éviter six formules avant de connaître l'usage. Tester une offre simple :

- pilote : 500 à 1 000 € par site pour 8 à 12 semaines, déductible si abonnement ;
- abonnement : **199 € HT par site et par mois** ;
- onboarding : **500 € HT par site**, réduit pour un groupe homogène ;
- option avancée stocks/recettes : +100 € par site et par mois lorsque réellement fonctionnelle.

Un groupe peut ensuite avoir un forfait central et un prix dégressif par site. Le prix ne doit pas être fixé à partir du coût informatique, très faible, mais à partir du gain démontré et du coût de l'onboarding.

### Exemple de gain client

Hypothèse illustrative pour un établissement réalisant 100 000 € de CA mensuel :

| Poste | Base mensuelle supposée | Amélioration prudente à tester | Gain mensuel |
|---|---:|---:|---:|
| Achats matière | 30 000 € | 1 à 2 % | 300 à 600 € |
| Masse salariale opérationnelle | 35 000 € | 0,5 à 1,5 % | 175 à 525 € |
| Temps manager | 4 à 8 h à 25 €/h | — | 100 à 200 € |
| **Total direct** | — | — | **575 à 1 325 €** |
| Abonnement | — | — | **−199 €** |
| **Gain net potentiel** | — | — | **376 à 1 126 € / mois** |

Ces valeurs sont des hypothèses de test, pas des résultats observés. Les ventes additionnelles, promotions et ruptures évitées ne sont pas incluses pour ne pas gonfler le calcul.

### Revenus possibles pour l'entreprise

Avec un prix moyen de 199 € par site et par mois, hors onboarding :

| Sites payants | Revenu mensuel récurrent | ARR théorique |
|---:|---:|---:|
| 25 | 4 975 € | 59 700 € |
| 100 | 19 900 € | 238 800 € |
| 300 | 59 700 € | 716 400 € |
| 1 000 | 199 000 € | 2 388 000 € |

Le passage de 25 à 100 sites dépendra plus de la standardisation des intégrations et des ventes que du modèle de prévision. À 100 sites, l'entreprise peut financer une petite équipe très légère ; à 300 sites, elle devient un SaaS significatif. Ces montants sont avant remises, churn, impayés, support et coûts commerciaux.

Objectifs économiques à terme :

- marge brute de 75 à 85 % après automatisation de l'onboarding ;
- remboursement du coût d'acquisition en moins de 9 à 12 mois ;
- churn mensuel inférieur à 1,5 % ;
- support inférieur à 30 minutes par site et par mois hors incident.

## 14. Budget de construction

Les fourchettes dépendent fortement du degré d'autonomie technique du porteur de projet avec Claude Code et de l'accès aux API.

| Étape | Construction très assistée par Claude Code | Avec prestataire classique |
|---|---:|---:|
| Maquette + backtest concierge | 0 à 5 k€ | 8 à 20 k€ |
| MVP pilote sécurisé | 20 à 50 k€ cumulés | 50 à 120 k€ cumulés |
| V1 vendable avec un connecteur et supervision | 60 à 120 k€ cumulés | 120 à 250 k€ cumulés |
| 12 mois très lean, hors salaire fondateur | 80 à 180 k€ | 200 k€ et plus |

Dans la version Claude Code, le budget ne disparaît pas : il se déplace vers les revues seniors, la donnée, le juridique, l'hébergement, l'observabilité et le temps passé à tester avec les restaurateurs.

### Dépenses à prévoir

- hébergement, base, mails et monitoring ;
- abonnement aux outils de développement et éventuellement API Claude ;
- connecteur ou middleware de caisse ;
- données payantes uniquement après validation ;
- développeur senior et data scientist ;
- contrats, RGPD, assurance cyber et conditions générales ;
- support, déplacements et vente ;
- audit de sécurité avant clients externes importants.

## 15. Stratégie commerciale

### Offre d'entrée

> À partir de 12 mois d'exports de caisse, un backtest de 14 jours montre si la prévision aurait été meilleure que la méthode actuelle et quelles décisions auraient pu être ajustées.

Le backtest limite le risque du client et évite de vendre seulement une promesse d'IA.

### Canaux prioritaires

1. groupes indépendants obtenus par réseau direct ;
2. revendeurs et intégrateurs de caisses ;
3. HubRise et marketplaces d'intégrations ;
4. experts-comptables spécialisés CHR ;
5. fournisseurs et grossistes, avec vigilance sur leur accès aux données ;
6. UMIH, CCI et associations de commerçants pour crédibilité et pilotes locaux.

Les collectivités et centres-villes peuvent aider à accéder aux événements, travaux ou commerçants, mais leur cycle de décision est plus lent. Elles ne doivent pas être le premier client indispensable.

### Déroulé de vente

1. entretien de 45 minutes sur une erreur récente ;
2. audit des outils et de l'export ;
3. backtest gratuit ou peu coûteux ;
4. restitution en euros ;
5. pilote payé de 8 à 12 semaines ;
6. abonnement annuel ;
7. étude de cas et recommandation à un autre groupe.

## 16. Principales complexités et réponses

| Risque | Pourquoi il est sérieux | Réponse |
|---|---|---|
| Données sales | Articles renommés, services incomplets, fermetures non notées | Couche de normalisation et écran de correction |
| Accès API | Beaucoup d'éditeurs réservent leur API aux partenaires | CSV d'abord, un partenaire ou HubRise ensuite |
| Démarrage à froid | Nouveau site ou historique trop court | Modèle de groupe + règles simples, sans promettre une forte précision |
| Événement mal interprété | Un concert proche peut attirer ou détourner la clientèle | Distance, horaire, type, capacité et feedback local |
| Météo incertaine | La prévision météo change | Recalcul quotidien et intervalle de confiance |
| Carte et prix changent | Les données historiques ne représentent plus l'offre | Versionner menu, prix et promotions |
| Stock peu fiable | Une commande exacte devient fausse | Commencer par préparation, puis stock après discipline d'inventaire |
| Recommandation inexécutable | Contrats ou livraisons déjà verrouillés | Afficher le délai de décision et les contraintes |
| Méfiance manager | L'intuition métier est forte | Explication, fourchette et validation humaine |
| Concurrence installée | Les acteurs ont déjà connecteurs et références | Segment étroit, onboarding rapide et preuve financière |
| Mutualisation risquée | Confidentialité et droit de la concurrence | Agrégation prudente et revue juridique |
| Churn | La valeur peut sembler saisonnière | Brief quotidien, ROI visible et intégration aux routines |

## 17. Plan d'action immédiat sur 30 jours

### Semaine 1

- obtenir auprès du responsable opérationnel commanditaire la liste exacte des établissements et logiciels utilisés ;
- demander un export anonymisé de 12 à 24 mois ;
- recueillir planning, ventes, articles et réservations disponibles ;
- identifier trois erreurs récentes de stock ou personnel et leur coût.

### Semaine 2

- interviewer cinq autres restaurateurs ;
- normaliser les données du premier site ;
- construire la référence « mêmes services précédents » ;
- vérifier si météo et événements améliorent réellement cette référence.

### Semaine 3

- réaliser une maquette avec Claude Code ;
- créer le briefing quotidien ;
- présenter un backtest au manager ;
- retirer les fonctions qu'il ne comprend pas ou n'utiliserait pas.

### Semaine 4

- lancer des prévisions en parallèle sur trois sites ;
- enregistrer les décisions avant chaque service ;
- décider si le problème le plus rentable est personnel, préparation ou commandes ;
- fixer le périmètre du MVP en fonction des données, pas de l'ambition initiale.

## Verdict final

Le projet est **faisable et potentiellement rentable**, mais ce n'est pas une idée vierge : la concurrence est réelle et parfois très proche. L'opportunité repose sur une exécution française plus légère, hyperlocale et immédiatement opérationnelle pour les petits groupes.

La bonne séquence est :

> **caisse + météo + calendrier + événements → prévision par service → recommandation d'effectif → préparation des principaux plats → stocks et commandes → automatisation.**

Il serait prématuré de commencer par les données des voisins, tous les commerces ou la commande fournisseur automatique. Le premier objectif n'est pas de construire toute la plateforme : c'est de démontrer, sur les données du groupe pilote, qu'une prévision aurait changé une décision et économisé au moins plusieurs centaines d'euros par établissement et par mois.
