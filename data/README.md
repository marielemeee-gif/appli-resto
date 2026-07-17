# Données fictives de démonstration

`config/` contient les trois établissements et les six scénarios versionnés. `generated/` est recréé localement et ignoré par Git.

```bash
pnpm generate:data
```

La commande utilise par défaut la graine `20260717`, la date de démonstration `2026-07-17`, 730 jours d’historique et sept jours futurs.

Chaque scénario contient :

```text
scenario_id/
├── manifest.json
├── observed/       données publiées avant la coupure du 17/07/2026 à 08:00
└── ground_truth/   réalité simulée, inaccessible au moteur avant le service
```

Les fichiers NDJSON sont triés et sérialisés de façon déterministe. `manifest.json` conserve les métadonnées et l’empreinte SHA-256 de chaque fichier. Relancer deux fois une même configuration doit produire les mêmes empreintes.

## Scénarios

- `baseline_normal` : semaine normale ;
- `concert_dry_friday` : concert, météo sèche et réservations accélérées ;
- `event_cancelled` : événement confirmé à la coupure puis annulé ;
- `multisite_staff_imbalance` : sureffectif à République et sous-effectif à Liberté ;
- `bad_data_abstain` : historique manquant, doublon et météo incertaine ;
- `roadworks_delivery_risk` : travaux sévères près de Gare et livraison retardée.

Ces données sont entièrement fictives et ne doivent jamais être remplacées silencieusement par des données réelles.

Les rapports chronologiques de prévision sont générés séparément :

```bash
pnpm backtest:data
```
