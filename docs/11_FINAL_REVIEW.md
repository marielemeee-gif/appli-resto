# Phase 7 — revue finale

## Périmètre revu

Le prototype local couvre simulation déterministe, adaptateurs fictifs, prévision et backtest, recommandations explicables, décisions locales et cinq écrans intégrés. Il ne contient ni authentification de production, ni connecteur réel, ni automatisation d’une décision métier.

## Sécurité et confidentialité

- Recherche de signatures courantes de clés privées, jetons et mots de passe : aucun résultat.
- `.env` et variantes locales sont ignorés ; seul `.env.example`, sans secret, est versionnable.
- `pnpm audit --audit-level moderate` ne signale plus aucune vulnérabilité connue ; la dépendance transitive `postcss` est verrouillée sur la version corrigée 8.5.10.
- Données générées, registre des décisions, environnements Python, dépendances JavaScript et sorties de build sont ignorés.
- Toutes les données métier sont fictives et reproductibles avec la graine `20260717`.
- CORS est limité aux origines locales et aux futurs aperçus Vercel ; il n’accorde aucune capacité autre que GET/POST.
- Une décision porte toujours `simulated_only: true` et n’appelle aucun système externe.

## Frontières métier vérifiées

- La simulation conserve une vérité séparée des observations accessibles au modèle.
- La prévision numérique produit valeur, fourchette, facteurs, confiance et abstention.
- Les recommandations sont des règles déterministes séparées de la prévision.
- L’interface explique les résultats sans produire elle-même les valeurs numériques.
- Le ROI sépare gain estimé et gain observé ; ce dernier reste `null` dans le prototype.

## Reproductibilité

Depuis un clone neuf :

```bash
cp .env.example .env
pnpm install --frozen-lockfile
python3.12 -m venv .venv
.venv/bin/python -m pip install -e 'apps/api[dev]'
pnpm generate:data
pnpm check
```

Puis lancer `pnpm dev:api` et `pnpm dev:web` dans deux terminaux.

## Contrôles de sortie

- `pnpm check` : lint, typage, tests et build web/API.
- 5 tests de rendu web.
- 22 tests API couvrant simulation, prévision sans fuite, recommandations, contraintes et décisions.
- Build Next.js des routes `/`, `/cockpit`, `/briefing`, `/multisites`, `/roi` et `/diagnostic`.
- Parcours HTTP réel : activation du concert, briefing, décision simulée, ROI sans gain observé.
- Registre local remis à zéro après vérification.

## Limites avant lien public

- Le dépôt Git local n’a pas encore de commit ni de remote au moment de cette revue.
- Un hébergement public devra définir `NEXT_PUBLIC_API_URL` vers l’API fictive déployée.
- Le registre JSON est adapté à la démonstration mono-instance, pas à une charge multi-utilisateur.
- Un lien public ne doit être créé qu’après publication GitHub et validation des paramètres de l’hébergeur.

## Décision de sortie

Le prototype est prêt pour un premier commit contrôlé et une publication sur le dépôt GitHub choisi. Le déploiement public constitue l’action externe suivante.
