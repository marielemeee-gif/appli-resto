# Brief produit du prototype

## Vision

Créer une « météo de l'activité » qui aide un responsable opérationnel à décider avant chaque service : combien de clients attendre, quelle équipe prévoir, quoi préparer, quelle commande ajuster et s'il faut réallouer des ressources entre établissements.

Le prototype ne doit pas prouver que toutes les décisions peuvent être automatisées. Il doit prouver qu'une combinaison de données historiques et de signaux locaux peut produire une recommandation plus utile, plus rapide et plus traçable que l'intuition seule.

## Commanditaire et utilisateurs

- Commanditaire : responsable opérationnel d'un petit groupe de restauration.
- Utilisateur principal : responsable opérationnel multi-sites.
- Utilisateur secondaire : manager d'établissement.
- Observateurs : direction, finance, cuisine et responsables de salle.

## Problèmes à démontrer

1. Les prévisions manuelles réagissent mal aux changements locaux récents.
2. Une prévision seule ne dit pas quelle décision prendre.
3. Les équipes, achats et préparations ont des délais différents.
4. Un groupe peut avoir un surplus sur un site et un manque sur un autre.
5. Les logiciels existants prouvent rarement le gain réel de chaque recommandation.

## Promesse du prototype

Pour un site, une date et un service, l'application affiche :

- la prévision de couverts et de chiffre d'affaires ;
- une fourchette probable ;
- les facteurs qui ont modifié la prévision ;
- trois décisions prioritaires maximum ;
- l'heure limite de chaque décision ;
- le gain ou le risque estimé ;
- la confiance et les données manquantes.

## Démonstration de référence

Le scénario principal se déroule un vendredi à Bordeaux :

- un concert est prévu à proximité ;
- la météo est sèche et favorable à la terrasse ;
- les réservations ont accéléré ;
- République devrait recevoir 128 couverts ;
- Liberté risque un sous-effectif pendant le pic ;
- le système recommande une préparation renforcée, un ajustement de commande et le transfert temporaire d'un serveur ;
- le manager valide ou refuse les recommandations ;
- le registre estime ensuite le gain et conserve le résultat observé.

Toutes ces valeurs sont illustratives et doivent être générées à partir de règles de simulation documentées.

## Parcours essentiel

1. Ouvrir le groupe et choisir un site.
2. Voir la prévision des sept prochains jours.
3. Ouvrir le service de vendredi soir.
4. Comprendre pourquoi l'activité est estimée forte.
5. Examiner trois recommandations avec leurs échéances.
6. Valider, modifier ou refuser une recommandation.
7. Examiner une proposition de transfert multi-sites.
8. Consulter le registre mensuel des gains.

## Résultat attendu du prototype

Une personne découvrant le produit doit pouvoir expliquer en moins de deux minutes :

- ce qui va probablement se passer ;
- ce qui a changé ;
- ce qu'elle peut encore décider ;
- ce que cette décision pourrait faire gagner ou éviter ;
- pourquoi le système est confiant ou prudent.

## Mesures de réussite de la démonstration

- Les scénarios sont reproductibles avec une graine fixe.
- Les prévisions réagissent aux événements, à la météo et aux réservations.
- La référence historique reste visible pour comparaison.
- Les recommandations respectent une contrainte et une heure limite.
- Un scénario de données insuffisantes produit une abstention.
- Une décision validée alimente le registre du ROI.
- Les quatre écrans principaux sont navigables et lisibles.

