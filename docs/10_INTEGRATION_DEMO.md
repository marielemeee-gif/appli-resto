# Phase 6 — intégration et démonstration

## Parcours public actuel — moins de cinq minutes

Ce parcours de session est entièrement fictif et fonctionne dans le navigateur, sans dépendre d'une API externe :

1. Ouvrir `/cockpit` et lire le briefing groupe initial : 325 couverts, dont 126 à République.
2. Dans `Nouveau · 10:20`, choisir `Note vocale` ou `Formulaire`, contrôler les trois faits puis cocher la confirmation humaine.
3. Cliquer `Valider et actualiser le briefing` : le groupe passe à 339, République à 140 et la confiance à 84 %.
4. Ouvrir République pour voir le pic demande/capacité à 19–20 h et les facteurs datés.
5. Ouvrir `/briefing`, traiter tout ou partie des trois arbitrages, éventuellement avec modification ou refus motivé.
6. Préparer le message terrain : l'utilisateur choisit ensuite SMS ou WhatsApp ; aucun destinataire ni envoi n'est automatisé.
7. Ouvrir `/valeur` pour retrouver les statuts et gains estimés fictifs. Le gain observé reste volontairement vide.

Pour rejouer la démonstration, utiliser `Réinitialiser` sur ordinateur ou recharger complètement la page sur mobile. Le scénario revient au briefing initial de 08:00. Si le signal terrain ne doit pas être joué, les six cas fictifs restent consultables dans leur fenêtre sans modifier la session.

À annoncer pendant la démonstration : la note vocale est une transcription préenregistrée, les systèmes tiers sont simulés, les calculs sont déterministes, et aucune commande fournisseur ni communication n'est envoyée automatiquement.

## Résultat

Les cinq écrans consomment désormais l’API FastAPI locale via `NEXT_PUBLIC_API_URL`. Les fixtures visuelles de phase 5 ne servent plus de repli silencieux : chargement, erreur API, abstention et absence de décision sont affichés explicitement.

Toutes les données et décisions restent fictives. Valider un bouton écrit uniquement un enregistrement dans `data/decisions.json`, ignoré par Git ; aucun planning, fournisseur ou système externe n’est appelé.

## Parcours guidé — moins de dix minutes

1. Ouvrir `/cockpit` : le scénario `concert_dry_friday` est activé et l’API calcule couverts, chiffre d’affaires, fourchette, confiance, facteurs et recommandations.
2. Ouvrir `/briefing` : valider, modifier ou refuser la première recommandation. Le message confirme qu’il s’agit d’une décision fictive.
3. Ouvrir `/valeur` : vérifier le nouveau statut, le gain estimé et l’absence volontaire de gain observé.
4. Ouvrir `/multisites` : le scénario `multisite_staff_imbalance` propose un transfert sûr entre République et Liberté ; sa validation reste une écriture locale.
5. Ouvrir `/diagnostic` : le scénario `bad_data_abstain` montre l’abstention et l’absence de recommandation précise.

## Démarrage

Après installation et génération des données :

```bash
pnpm dev:api
pnpm dev:web
```

Ouvrir `http://localhost:3000`. Pour repartir avec un registre vide :

```bash
rm -f data/decisions.json
```

## Contrats ajoutés

- `POST /recommendations/{id}/decisions`
- `POST /dispatch/{id}/decisions`
- `GET /decisions`
- `GET /roi`

Une décision modifiée exige une action sélectionnée. Une décision après l’échéance ou déjà enregistrée renvoie une erreur métier explicite. Le registre sépare gain estimé et gain observé ; ce dernier reste toujours vide dans le prototype.

## Vérifications du 17 juillet 2026

- activation réelle du scénario via HTTP ;
- briefing réel : 140 couverts et deux recommandations sur les données générées localement ;
- écriture d’une décision de vérification avec `simulated_only: true` ;
- lecture ROI avec `observed_gain_cents: null` ;
- build statique des six routes Next.js ;
- contrôles complets avec `pnpm check`.

## Limites avant publication

- Le registre JSON convient à une démo mono-instance, pas à plusieurs serveurs publics concurrents.
- L’activation du scénario est globale à l’API de démonstration.
- Il n’y a volontairement ni authentification ni données réelles.
- Les captures finales et le déploiement public relèvent de la phase 7 et nécessiteront le dépôt GitHub et le choix d’un hébergeur.
