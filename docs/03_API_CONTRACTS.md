# Contrats d'API proposés

Ces contrats sont une base de planification. Codex peut proposer des ajustements avant implémentation, mais doit préserver les informations métier et les scénarios d'acceptation.

## Conventions

- JSON en `snake_case` ou `camelCase`, mais une seule convention dans tout le projet.
- Dates ISO 8601.
- Montants en centimes ou avec devise explicite.
- Heures dans le fuseau `Europe/Paris`.
- Chaque réponse de prévision contient `generated_at`, `data_cutoff` et `model_version`.
- Chaque recommandation contient un identifiant stable et une échéance.

## Santé et scénarios

### `GET /health`

Confirme que le service fonctionne et indique la version des données.

### `GET /demo/scenarios`

Liste les scénarios disponibles avec leur description.

### `POST /demo/scenarios/{scenario_id}/activate`

Active un scénario de démonstration. Autorisé uniquement en environnement local.

## Sites

### `GET /sites`

Retourne les sites, leurs capacités, rôles et services.

### `GET /sites/{site_id}`

Retourne la configuration détaillée d'un site.

## Prévisions

### `GET /forecasts?site_id=&from=&to=`

Retourne les prévisions par service pour une période maximale de quatorze jours.

Exemple simplifié :

```json
{
  "site_id": "republique",
  "generated_at": "2026-07-17T08:00:00+02:00",
  "data_cutoff": "2026-07-17T07:55:00+02:00",
  "services": [
    {
      "service_id": "republique_2026-07-19_dinner",
      "expected_covers": 128,
      "lower_covers": 115,
      "upper_covers": 141,
      "expected_revenue_cents": 641000,
      "confidence": 0.84,
      "baseline_covers": 108,
      "drivers": [
        {"code": "nearby_concert", "impact_covers": 15},
        {"code": "dry_weather", "impact_covers": 6},
        {"code": "reservation_acceleration", "impact_covers": 4}
      ]
    }
  ]
}
```

## Briefing et recommandations

### `GET /briefings/{service_id}`

Retourne la synthèse du service, les données manquantes et trois recommandations maximum.

### `GET /recommendations/{recommendation_id}`

Retourne l'explication, les contraintes et les éléments de calcul.

### `POST /recommendations/{recommendation_id}/decisions`

Enregistre une validation, modification ou un refus.

```json
{
  "status": "modified",
  "selected_action": {
    "role": "server",
    "quantity": 1,
    "start": "2026-07-19T19:00:00+02:00",
    "end": "2026-07-19T21:30:00+02:00"
  },
  "reason": "fin_de_service_plus_calme"
}
```

Le serveur refuse une décision prise après l'échéance et renvoie une erreur métier explicite.

## Multi-sites

### `GET /dispatch?group_id=&service_date=`

Retourne les écarts de capacité, les compétences compatibles, les temps de trajet et les propositions de transfert.

### `POST /dispatch/{proposal_id}/decisions`

Valide, modifie ou refuse un transfert simulé.

## ROI

### `GET /roi?group_id=&month=`

Retourne :

- recommandations produites ;
- décisions utiles, appliquées, modifiées ou refusées ;
- heures réaffectées ;
- achats ajustés ;
- ruptures potentielles évitées ;
- gain estimé et gain simulé observé ;
- méthode et hypothèses de calcul.

### `GET /decisions?site_id=&from=&to=`

Retourne le registre détaillé.

## Adaptateurs externes simulés

Les adaptateurs sont accessibles au moteur, pas nécessairement à l'interface :

- `GET /mock/weather` ;
- `GET /mock/events` ;
- `GET /mock/calendar` ;
- `GET /mock/roadworks`.

Leurs réponses doivent imiter les contraintes d'une vraie API : date d'émission, version, données manquantes, retard et erreur possible.

## Erreurs métier minimales

| Code | Signification |
|---|---|
| `insufficient_history` | historique trop court |
| `low_data_quality` | qualité insuffisante |
| `forecast_unavailable` | prévision non produite |
| `recommendation_expired` | échéance dépassée |
| `constraint_violation` | rôle, stock ou délai incompatible |
| `scenario_not_active` | scénario non activé |
| `decision_already_recorded` | décision déjà enregistrée |

