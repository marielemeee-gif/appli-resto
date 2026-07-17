# Phase 5 — expérience utilisateur

## Résultat

L’interface de démonstration couvre cinq vues statiques et navigables, alimentées uniquement par des fixtures fictives explicites. Leur connexion aux endpoints existants est volontairement réservée à la phase 6.

| Route | Démonstration |
| --- | --- |
| `/cockpit` | activité du jour, fourchette, confiance, prévision à sept jours et deux décisions prioritaires |
| `/briefing` | résumé opérationnel, causes, recommandations bornées et heures limites |
| `/multisites` | comparaison de trois sites et proposition de transfert non automatique |
| `/roi` | registre de décisions et distinction entre gain estimé et gain observé |
| `/diagnostic` | méthode, fraîcheur, données manquantes, abstention et historique des calculs |

La route `/` présente le cockpit. Le bandeau « Démo fictive » et la note de bas de page empêchent de confondre les valeurs avec des données réelles.

## Principes d’interface appliqués

- La prévision numérique reste distincte des recommandations métier et de leur explication.
- La fourchette et la confiance sont visibles près de la valeur centrale.
- Une recommandation est formulée comme une proposition avec une échéance, jamais comme une exécution automatique.
- Le ROI estimé n’est jamais présenté comme un résultat observé.
- Le diagnostic montre un signal manquant et le comportement d’abstention associé.
- La navigation, les titres, tableaux, régions et graphiques décoratifs disposent d’une structure sémantique ou d’un libellé accessible.
- Un lien d’évitement, des focus visibles et une mise en page fluide sont prévus pour le clavier, le zoom et le mobile.
- Les couleurs reprennent la direction premium bleu nuit, turquoise et ambre sans coder un état uniquement par la couleur.

## Vérifications exécutées le 17 juillet 2026

```bash
pnpm check
```

Résultat : lint et typage web valides, 5 tests de rendu valides, build Next.js des six routes statiques valide, lint et typage API valides, 20 tests API valides.

Les tests vérifient le marquage fictif du cockpit et le titre principal unique de chaque écran métier. Une revue manuelle finale clavier, contraste, zoom 200 % et tailles mobiles reste à conduire pendant la phase 6 avec les données réellement servies par l’API.

## Limites assumées avant la phase 6

- Les boutons illustrent les actions mais ne persistent encore aucune validation, modification ou opposition.
- Les écrans utilisent `src/lib/demo-data.ts`, clairement identifié comme fixture de présentation.
- Le sélecteur de site et la navigation ne gèrent pas encore d’état applicatif partagé.
- Aucun montant de ROI n’est une mesure réelle.

## Point d’arrêt

La phase 6 ne commence qu’après validation explicite de ces écrans et de leur hiérarchie d’information.
