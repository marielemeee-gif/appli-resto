# Démarrage du prototype avec Codex

Ce dossier contient la préparation du prototype. Il ne contient volontairement aucun code applicatif.

## Ce qu'il faut faire

1. Décompresser le dossier dans un emplacement dédié.
2. Ouvrir **le dossier complet** dans Codex, et non uniquement le PDF.
3. Activer le mode Plan avec `/plan` ou `Shift+Tab` selon l'interface utilisée.
4. Demander à Codex de lire, dans cet ordre :
   - `AGENTS.md` ;
   - `PLANS.md` ;
   - `docs/00_PRODUCT_BRIEF.md` à `docs/06_ACCEPTANCE_TESTS.md` ;
   - `references/ETUDE_COMPLETE.md` pour l'analyse détaillée ;
   - `references/ETUDE_PREMIUM.pdf` pour les références visuelles.
5. Copier-coller le contenu de `PROMPT_INITIAL_CODEX.md` dans Codex.
6. Répondre aux questions de cadrage de Codex.
7. Relire son plan et ne valider que la première phase de construction.

## Ce qu'il ne faut pas faire au premier message

- Ne pas demander « construis toute l'application ».
- Ne pas donner uniquement le PDF sans les règles du dépôt.
- Ne pas brancher de vraies API, caisse ou données personnelles.
- Ne pas commencer par un modèle d'IA complexe.
- Ne pas autoriser des commandes fournisseurs ou changements de planning automatiques.

## Résultat attendu du premier échange

Codex doit produire un plan d'exécution détaillé comprenant :

- l'architecture proposée ;
- l'arborescence des fichiers ;
- la méthode de simulation des données et des API ;
- la logique de prévision et de recommandation ;
- les écrans à construire ;
- les tests et scénarios de démonstration ;
- les risques et hypothèses ;
- les commandes de lancement et de vérification envisagées.

Il doit ensuite s'arrêter et demander une validation avant de coder.

## Références officielles Codex

- Bonnes pratiques : https://learn.chatgpt.com/guides/best-practices.md
- Configuration `AGENTS.md` : https://learn.chatgpt.com/docs/agent-configuration/agents-md
- Principes de prompting : https://learn.chatgpt.com/docs/prompting.md

