# Critères et scénarios d'acceptation

## Règles générales

- Tous les tests fonctionnent sans réseau.
- Une même graine produit les mêmes résultats.
- Les valeurs affichées proviennent des API du prototype, pas de constantes cachées dans l'interface.
- Les scénarios restent compréhensibles dans les logs et les données générées.
- Chaque recommandation peut être reliée à sa prévision et à ses contraintes.

## A1 — génération reproductible

**Étant donné** la graine `20260717` et la configuration de référence  
**Quand** les données sont générées deux fois  
**Alors** les fichiers ou enregistrements produits sont identiques.

## A2 — référence historique

**Étant donné** un service sans événement exceptionnel  
**Quand** la référence est calculée  
**Alors** elle utilise uniquement des services antérieurs comparables et expose la période utilisée.

## A3 — concert et météo favorable

**Étant donné** le scénario `concert_dry_friday`  
**Quand** la prévision du vendredi soir est calculée  
**Alors** elle dépasse la référence historique, cite le concert et la météo parmi les facteurs et conserve une fourchette.

## A4 — annulation tardive

**Étant donné** le scénario `event_cancelled`  
**Quand** l'événement passe de confirmé à annulé avant l'échéance fournisseur  
**Alors** la prévision est recalculée, l'écart avec la version précédente est visible et une réduction de commande peut être proposée avec une heure limite.

## A5 — décision expirée

**Étant donné** une recommandation dont l'heure limite est dépassée  
**Quand** un utilisateur tente de la valider  
**Alors** l'API refuse avec `recommendation_expired` et l'interface explique que l'action n'est plus exécutable.

## A6 — replanification multi-sites

**Étant donné** le scénario `multisite_staff_imbalance`  
**Quand** la vue groupe est ouverte  
**Alors** le système propose un transfert compatible, affiche le trajet et ne crée pas de sous-effectif sur le site source.

## A7 — contrainte incompatible

**Étant donné** une personne disponible mais sans le rôle nécessaire  
**Quand** le transfert est évalué  
**Alors** aucune proposition invalide n'est produite et la contrainte est traçable.

## A8 — données insuffisantes

**Étant donné** le scénario `bad_data_abstain`  
**Quand** le moteur tente une prévision  
**Alors** il élargit la fourchette ou s'abstient, explique les données manquantes et ne produit pas de recommandation précise trompeuse.

## A9 — comparaison au modèle simple

**Étant donné** un backtest chronologique  
**Quand** le modèle enrichi est évalué  
**Alors** le rapport affiche ses erreurs et celles de la référence. Si le modèle enrichi est moins bon, la référence reste utilisée pour le scénario concerné.

## A10 — validation et registre

**Étant donné** une recommandation valide  
**Quand** le manager la valide ou la modifie  
**Alors** la décision, son motif, son échéance et son résultat simulé sont enregistrés dans le registre.

## A11 — ROI traçable

**Étant donné** plusieurs décisions enregistrées  
**Quand** le tableau mensuel est consulté  
**Alors** chaque montant agrégé peut être relié aux décisions et aux formules qui le composent.

## A12 — aucune automatisation irréversible

**Étant donné** une recommandation d'achat, d'équipe ou de transfert  
**Quand** elle est produite  
**Alors** elle reste à l'état de proposition et aucune action externe n'est exécutée.

## A13 — expérience responsive

**Étant donné** une largeur mobile  
**Quand** le briefing est ouvert  
**Alors** la prévision, l'action, l'échéance, la confiance et les boutons restent visibles et utilisables sans défilement horizontal.

## A14 — états dégradés

**Étant donné** une erreur de l'adaptateur météo simulé  
**Quand** le cockpit est chargé  
**Alors** l'application affiche l'indisponibilité du signal, réduit la confiance et continue uniquement si les autres données le permettent.

## A15 — démonstration complète

Une démonstration est acceptée si elle permet en moins de dix minutes de :

1. activer le scénario concert ;
2. lire le cockpit ;
3. ouvrir le briefing ;
4. valider ou modifier une action ;
5. afficher le transfert multi-sites ;
6. provoquer une abstention ;
7. retrouver la décision dans le registre du ROI.

## Contrôles techniques attendus

Codex doit préciser les commandes exactes après initialisation, mais le dépôt devra comporter :

- tests de génération des données ;
- tests des règles et contraintes ;
- tests du backtest sans fuite temporelle ;
- tests d'API ;
- contrôle de types ;
- lint et formatage ;
- tests des parcours critiques ;
- vérification visuelle des quatre écrans principaux.

