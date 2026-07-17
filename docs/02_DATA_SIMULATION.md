# Simulation des données et des API externes

## Objectif

Créer un environnement fictif cohérent, reproductible et assez riche pour démontrer les comportements du produit sans dépendre d'une vraie caisse ni d'une API externe.

## Règles de reproductibilité

- Toute génération accepte une graine entière.
- La graine de démonstration recommandée est `20260717`.
- Les dates de démonstration doivent être configurables.
- Une même graine et une même configuration produisent exactement les mêmes données.
- Les données « futures réelles » de simulation restent séparées des données fournies au moteur de prévision.

## Entités principales

| Entité | Champs essentiels | Rôle |
|---|---|---|
| `site` | id, nom, latitude, longitude, capacité, terrasse, rôles | établissement |
| `service` | site, date, type, ouverture, fermeture | unité de prévision |
| `sales_actual` | couverts, CA, ticket moyen, articles, remises | résultat historique ou futur simulé |
| `reservation_snapshot` | instant, couverts réservés, annulations | signal avancé disponible à un instant donné |
| `weather_observation` | température, pluie, vent, condition | météo observée |
| `weather_forecast` | date d'émission, horizon, valeurs, incertitude | météo disponible pour prévoir |
| `local_event` | catégorie, position, capacité, horaires, statut | signal événementiel |
| `road_disruption` | zone, sévérité, début, fin | travaux et accessibilité |
| `staff_plan` | rôle, personnes, heures prévues, disponibilité | planning simplifié |
| `inventory_snapshot` | famille, quantité, durée de vie | stock simplifié |
| `forecast` | valeur, borne basse, borne haute, facteurs, confiance | résultat du moteur |
| `recommendation` | type, action, échéance, gain, contrainte, confiance | décision proposée |
| `decision` | choix, modification, motif, horodatage | action du manager |
| `outcome` | résultat simulé, gain réalisé, commentaire | apprentissage et ROI |

## Génération de la demande réelle

La demande simulée d'un service est construite avec :

1. un niveau de base propre au site et au service ;
2. un effet du jour de la semaine ;
3. une saisonnalité annuelle ;
4. un effet vacances/jour férié ;
5. une tendance progressive ;
6. un effet météo différent selon la terrasse et le service ;
7. un effet événement dépendant de la distance, de l'horaire et du type de site ;
8. un effet travaux/accessibilité ;
9. un effet promotion ou fermeture ;
10. un bruit aléatoire borné.

La valeur finale doit respecter la capacité du site et conserver une relation cohérente entre couverts, ticket moyen et chiffre d'affaires.

## Réservations

- Générer plusieurs instantanés avant le service : J-14, J-7, J-3, J-1 et jour J.
- La vitesse de réservation dépend du type de service et de l'événement.
- Les annulations augmentent avec la météo défavorable ou l'annulation d'un événement.
- Le moteur de prévision ne voit que l'instantané disponible au moment du calcul.

## API météo simulée

L'adaptateur météo expose une prévision dont l'erreur augmente avec l'horizon :

- J-0/J-1 : faible erreur ;
- J-2/J-3 : erreur moyenne ;
- J-4 à J-7 : erreur plus élevée.

Chaque réponse contient : date d'émission, horizon, température, pluie, vent, condition et indice d'incertitude.

## API événements simulée

Chaque événement contient :

- identifiant stable ;
- nom fictif ;
- catégorie ;
- capacité estimée ;
- coordonnées ;
- heure d'entrée et de sortie ;
- statut prévu, confirmé ou annulé ;
- dernière mise à jour.

Un événement peut attirer un site et détourner la clientèle d'un autre. L'effet réel est propre au couple site/événement.

## API circulation/travaux simulée

- Zone ou distance au site.
- Fenêtre temporelle.
- Sévérité de 0 à 3.
- Effet différent sur livraison, accès client et terrasse.
- Possibilité de mise à jour tardive déclenchant une alerte.

## Scénarios obligatoires

### `baseline_normal`

Semaine ordinaire, aucune perturbation majeure. Sert de référence.

### `concert_dry_friday`

Concert proche, météo sèche, réservations accélérées et forte demande vendredi soir.

### `event_cancelled`

Annulation tardive d'un événement. La prévision baisse et une commande peut encore être réduite.

### `multisite_staff_imbalance`

République est en léger sureffectif et Liberté en sous-effectif sur la même plage horaire.

### `bad_data_abstain`

Historique incomplet, doublons de caisse et météo incertaine. Le moteur doit élargir l'intervalle ou s'abstenir.

### `roadworks_delivery_risk`

Travaux modifiant l'heure de livraison et l'accessibilité d'un site.

## Contrôles de cohérence

- Aucun nombre de couverts négatif.
- Couverts cohérents avec la capacité et les fermetures.
- CA cohérent avec couverts et ticket moyen.
- Aucun instantané de réservation postérieur au moment de prévision.
- Aucun événement annulé présenté comme confirmé après la mise à jour.
- Les stocks diminuent avec la consommation et augmentent avec les livraisons.
- Les décisions modifient le résultat uniquement selon des règles explicites.

## Données visibles et vérité de simulation

Deux couches doivent être conservées :

- `observed/` : ce que l'application connaît au moment de la décision ;
- `ground_truth/` : ce qui se produit réellement dans le scénario.

Le backtest et le registre du ROI utilisent la vérité uniquement après le service.

