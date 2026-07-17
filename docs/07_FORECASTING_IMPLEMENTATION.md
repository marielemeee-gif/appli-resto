# Implémentation de la prévision — phase 3

## Méthodes

### Référence historique

La référence sélectionne les huit derniers services ayant exactement le même site, le même type de service et le même jour de semaine. Seuls les services antérieurs à la coupure sont admissibles. Une moyenne pondérée favorise les observations récentes et expose la liste complète des services utilisés.

### Prévision enrichie

Le premier enrichissement reste volontairement explicable. Il compare le dernier instantané de réservations disponible avant la coupure aux instantanés équivalents des services comparables. L’ajustement est borné puis complété par des facteurs structurés : concert confirmé ou annulé, météo sèche favorable à la terrasse et travaux affectant l’accès.

Le moteur enrichi n’est utilisé que si son WAPE de backtest est inférieur ou égal à celui de la référence. Sinon, la référence historique reste la méthode sélectionnée.

## Fourchette et confiance

La demi-largeur de l’intervalle dépend de la MAE historique, de l’horizon et de l’incertitude météo. La confiance dépend du nombre de comparables, de l’horizon, de l’incertitude des signaux et des problèmes de qualité. Chaque score est accompagné de raisons lisibles.

Le moteur s’abstient lorsque moins de quatre comparables sont disponibles ou lorsque plusieurs défauts critiques sont présents. Dans ce cas, aucun nombre de couverts ou de revenu n’est produit.

## Backtest

```bash
pnpm backtest:data
```

Le backtest utilise les 84 derniers jours historiques. Pour chaque service cible, il simule une coupure à 08:00 et rejette tout comparable ou instantané postérieur. Les rapports sont écrits dans `data/generated/{scenario}/reports/backtest.json`.

Résultats de référence avec la graine `20260717` :

| Scénario | WAPE référence | WAPE enrichi | Méthode retenue |
| --- | ---: | ---: | --- |
| baseline_normal | 6,52 % | 2,47 % | réservation enrichie |
| concert_dry_friday | 6,51 % | 2,39 % | réservation enrichie |
| event_cancelled | 6,84 % | 2,49 % | réservation enrichie |
| multisite_staff_imbalance | 6,78 % | 2,34 % | réservation enrichie |
| bad_data_abstain | 6,93 % | 2,34 % | enrichie globalement, abstention locale à Liberté |
| roadworks_delivery_risk | 6,66 % | 2,43 % | réservation enrichie |

Ces chiffres évaluent uniquement les données fictives du prototype. Ils ne constituent ni une promesse commerciale ni une mesure sur des restaurants réels.
