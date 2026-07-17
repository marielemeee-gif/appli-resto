# Implémentation des recommandations — phase 4

## Principes

Les recommandations sont des propositions déterministes. Elles ne modifient aucun planning, ne passent aucune commande et n’appellent aucun système externe. Chaque proposition conserve sa prévision source, sa formule, ses hypothèses, son échéance, ses contraintes et son niveau de confiance.

Un briefing contient au maximum trois recommandations. Une action dont l’échéance est dépassée n’est plus proposée. Une prévision en abstention ne produit aucune recommandation précise.

## Effectif

```text
serveurs_requis = plafond(couverts_prévus / 32)
écart = serveurs_requis - serveurs_planifiés
```

Le moteur propose un ajout lorsque l’écart est positif ou une réaffectation lorsqu’il est négatif. Le prototype ne prétend pas produire un planning juridiquement complet.

## Préparation

```text
viande_à_préparer = couverts_prévus × 0,12 kg × rendement_1,08
```

Cette règle fictive porte sur une seule famille et sert à démontrer une préparation explicable. Elle ne constitue pas une fiche recette réelle.

## Achats

```text
commande_boissons = couverts_prévus × 1,8 × sécurité_1,10 − stock_utilisable
```

Une proposition n’est créée que si la quantité calculée dépasse le stock simulé. L’heure limite fictive est 14 h et aucune commande n’est envoyée.

## Dispatch multi-sites

Le moteur compare le nombre de serveurs requis et planifiés pour les trois sites. Un transfert est proposé uniquement si :

- les sites appartiennent au même groupe fictif ;
- le rôle est disponible à la source ;
- le site source reste correctement couvert ;
- le trajet simulé ne dépasse pas vingt minutes ;
- un manque compatible existe à la destination.

Dans `multisite_staff_imbalance`, la proposition transfère un serveur de République vers Liberté de 18 h 30 à 21 h, avec un trajet de sept minutes. Si le rôle serveur est retiré du site source, aucune proposition n’est produite.

## API

- `GET /briefings/{service_id}` ;
- `GET /recommendations/{recommendation_id}` ;
- `GET /dispatch?service_date=YYYY-MM-DD`.

Toutes les sorties portent le statut `proposal`. La validation, la modification, le refus et le registre du ROI seront persistés dans une phase ultérieure.
