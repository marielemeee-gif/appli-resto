# Prompt initial à copier dans Codex

Nous allons construire le prototype décrit dans ce dépôt, mais pas encore coder.

Passe en mode Plan. Lis intégralement `AGENTS.md`, `PLANS.md`, tous les fichiers de `docs/`, puis `references/ETUDE_COMPLETE.md`. Consulte aussi `references/ETUDE_PREMIUM.pdf` pour comprendre la direction visuelle et les quatre maquettes.

Objectif de ce premier échange : produire un plan d'exécution suffisamment précis pour qu'une autre personne puisse comprendre l'architecture, la simulation, les API, la prévision, les règles métier, les écrans et les vérifications avant le début du développement.

Contraintes :

- ne crée aucun code applicatif pendant cette étape ;
- n'installe aucune dépendance ;
- n'appelle aucune API externe ;
- ne remplace pas les décisions manquantes par des suppositions silencieuses ;
- distingue clairement ce qui est confirmé, proposé ou encore à décider ;
- challenge le périmètre s'il est trop large ;
- garde un prototype local, démontrable et reproductible ;
- utilise uniquement des données fictives ;
- préserve la séparation entre prévision numérique, règles de recommandation et explication en langage naturel.

Commence par :

1. résumer en dix points maximum ce que le produit doit démontrer ;
2. relever les contradictions ou zones floues entre les documents ;
3. me poser au maximum sept questions qui changeraient réellement l'architecture ou la démonstration ;
4. inspecter ensuite l'environnement du dossier sans le modifier ;
5. proposer l'architecture la plus simple répondant aux critères ;
6. créer ou préparer le contenu de `docs/EXECUTION_PLAN.md` selon `PLANS.md` ;
7. détailler la phase 1 avec les fichiers, commandes et tests envisagés ;
8. terminer par une liste des décisions à valider.

Arrête-toi ensuite et demande explicitement : « Le plan et la phase 1 sont-ils validés ? »

