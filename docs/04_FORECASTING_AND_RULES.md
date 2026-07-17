# Prévision et règles de recommandation

## Séparation des responsabilités

Le prototype comporte trois couches indépendantes :

1. **prévision numérique** : estime couverts et chiffre d'affaires ;
2. **règles de décision** : transforme la prévision en actions sous contraintes ;
3. **explication** : traduit les résultats structurés en langage clair.

Un modèle de langage éventuel ne doit pas inventer le nombre de couverts, l'intervalle, le gain ou la recommandation.

## Référence historique

La première méthode calcule une moyenne pondérée des quatre à huit services comparables précédents : même site, même type de service et même jour de semaine.

Elle corrige éventuellement :

- la tendance récente ;
- la fermeture ou un changement d'offre déclaré ;
- la vitesse de réservation disponible.

Cette référence doit être affichée et utilisée comme seuil minimal de performance.

## Prévision enrichie du prototype

Le moteur peut utiliser une régression ou un modèle tabulaire léger avec :

- jour de semaine et service ;
- semaine et saison ;
- vacances et jours fériés ;
- réservations et accélération ;
- température, pluie, vent et incertitude météo ;
- événements pondérés par distance et horaires ;
- travaux ou accessibilité ;
- promotion, fermeture et prix lorsque disponibles.

Le choix exact du modèle doit être justifié par la simplicité, l'explicabilité et les résultats du backtest.

## Backtest

- Découpage chronologique uniquement.
- Aucune donnée publiée après le moment simulé de prévision.
- Comparaison systématique à la référence historique.
- Résultats par site, jour et service.
- Mesures : MAE ou WAPE pour couverts et chiffre d'affaires.
- Couverture de l'intervalle : proportion des résultats compris dans la fourchette.

## Intervalle et confiance

La fourchette dépend au minimum :

- de l'erreur historique du modèle ;
- de l'horizon ;
- de la quantité d'historique ;
- de la qualité des données ;
- de l'incertitude météo et événementielle.

La confiance ne doit pas être un simple nombre décoratif. Elle doit être calculée à partir de signaux traçables et accompagnée d'une raison.

## Abstention

Le moteur s'abstient ou élargit fortement la fourchette lorsque :

- l'historique comparable est insuffisant ;
- une fermeture ou refonte de carte rend l'historique non comparable ;
- les données de caisse sont incohérentes ;
- un événement inédit domine la demande ;
- plusieurs signaux critiques sont manquants ;
- la prévision enrichie ne bat pas la référence.

## Règles d'effectif

Exemple de règle simplifiée :

```text
besoin_par_role = socle_minimum + charge_prevue / capacite_habituelle_par_personne
```

La règle doit intégrer :

- rôle et compétences ;
- capacité de salle, cuisine et terrasse ;
- heures de préparation et fermeture ;
- disponibilité simplifiée ;
- écart avec le planning existant ;
- coût du sous-effectif et du sureffectif.

Le prototype recommande un besoin, mais ne fabrique pas un planning légal complet.

## Préparation et achats

Pour quelques familles de produits :

```text
quantite_a_preparer = demande_prevue * quantite_par_couvert * rendement
quantite_a_commander = quantite_a_preparer - stock_utilisable + stock_securite
```

Contraintes :

- durée de conservation ;
- conditionnement minimum ;
- délai et heure limite fournisseur ;
- pertes historiques ;
- stock de sécurité ;
- incertitude de la prévision.

Si le stock ou les recettes sont insuffisamment fiables, recommander seulement des volumes de préparation ou afficher une abstention.

## Alerte avec fenêtre d'action

Une alerte est produite uniquement si :

- une information nouvelle change significativement la prévision ou le risque ;
- une action est encore possible ;
- le bénéfice attendu dépasse un seuil ;
- le niveau de confiance est suffisant.

L'alerte précise l'ancienne et la nouvelle estimation, la cause, l'action, l'échéance et le gain estimé.

## Replanification multi-sites

Une proposition de transfert respecte :

- sites du même groupe ;
- rôle et compétences compatibles ;
- disponibilité sur les deux sites ;
- temps de trajet ;
- absence de sous-effectif créé sur le site source ;
- bénéfice supérieur au coût du transfert.

## ROI

Le gain estimé et le gain simulé observé sont séparés.

Exemples :

- heures évitées ou réaffectées ;
- achats réduits avant échéance ;
- pertes ou ruptures simulées évitées ;
- marge additionnelle d'une capacité mieux allouée.

Chaque montant conserve sa formule, ses hypothèses et le statut de la décision.

