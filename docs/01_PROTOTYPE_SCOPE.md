# Périmètre du prototype

## Principe de livraison

Le prototype est une démonstration locale. Il doit privilégier la clarté du raisonnement, la reproductibilité et la qualité visuelle plutôt que la couverture exhaustive d'un produit SaaS.

## P0 — indispensable

### Données

- Trois sites fictifs : République, Liberté et Gare.
- Deux services par jour : déjeuner et dîner.
- Vingt-quatre mois d'historique simulé.
- Ventes, couverts, ticket moyen et articles principaux.
- Réservations, annulations et vitesse de réservation.
- Météo, calendrier, vacances, jours fériés et événements.
- Travaux ou perturbations de circulation simplifiés.
- Planning prévu, capacités et rôles disponibles.
- Stocks simplifiés pour quelques familles de produits.

### Calculs

- Référence historique par même jour et même service.
- Prévision à sept jours.
- Fourchette probable et niveau de confiance.
- Facteurs principaux de variation.
- Besoin d'effectif par rôle.
- Trois recommandations maximum.
- Heure limite et gain/risque estimé.
- Moteur d'abstention.
- Proposition de transfert entre sites.
- Registre des décisions et du ROI.

### Interface

- Cockpit quotidien.
- Détail d'un service.
- Briefing/alerte responsive.
- Vue multi-sites.
- Registre du ROI.
- Sélecteur de scénario de démonstration.

### Validation

- Validation, modification ou refus d'une recommandation.
- Conservation de la raison et du résultat simulé.
- Rejeu des scénarios définis dans les tests d'acceptation.

## P1 — seulement si le P0 est stable

- Simulateur « et si ? ».
- Comparaison de deux méthodes de prévision.
- Variation du niveau de confiance en direct.
- Export d'un briefing PDF.
- Visualisation des délais fournisseurs.
- Explication en langage naturel générée à partir de données structurées.

## Hors périmètre

- Vraies données de caisse.
- Connexion réelle Météo-France, Google, OpenAgenda ou transport.
- Écriture dans un planning ou un ERP.
- Commande fournisseur ou campagne promotionnelle réelle.
- Gestion de paie, contrats ou contraintes sociales exhaustives.
- Authentification multi-entreprises de production.
- Facturation et abonnement.
- Application iOS/Android native.
- Hébergement public et exploitation 24/7.

## Contraintes non fonctionnelles

- Démarrage local documenté.
- Génération complète des données en moins d'une minute sur un poste standard.
- Réponses d'API de démonstration rapides et déterministes.
- Interface utilisable au clavier et avec contrastes suffisants.
- Aucun secret ou identifiant personnel.
- Tests reproductibles sans réseau.
- Les erreurs de données doivent être visibles, jamais remplacées silencieusement.

## Décisions proposées à confirmer

1. Utiliser Bordeaux comme ville fictive de démonstration.
2. Utiliser trois sites d'un même groupe, et non des concurrents indépendants.
3. Faire une application web responsive, pas une application mobile native.
4. Utiliser un moteur de prévision simple et explicable avant tout modèle avancé.
5. Garder l'explication en langage naturel optionnelle et séparée des calculs.

