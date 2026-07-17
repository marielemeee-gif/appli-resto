# Déploiement public de la démonstration

## Architecture

Le déploiement utilise un seul service Docker Render :

1. Next.js exporte les six pages en fichiers statiques.
2. FastAPI sert ces fichiers et les endpoints fictifs sur la même origine.
3. Les six scénarios déterministes sont générés pendant la construction de l’image.
4. Les backtests sont pré-calculés pendant la construction pour garder les écrans réactifs.
5. Le service écoute le port fourni par Render et expose `/health`.

Cette architecture produit une seule URL publique et évite la configuration CORS ou deux hébergements distincts.

## Déployer

Utiliser le Blueprint versionné dans `render.yaml` :

[Déployer sur Render](https://dashboard.render.com/blueprint/new?repo=https%3A%2F%2Fgithub.com%2Fmarielemeee-gif%2Fappli-resto)

Après connexion à Render :

1. autoriser l’accès au dépôt GitHub si demandé ;
2. conserver le nom `pilotage-restaurants` ou choisir un nom disponible ;
3. valider la création du service gratuit ;
4. attendre la fin du build et le passage au vert de `/health` ;
5. ouvrir l’URL `https://…onrender.com` et rejouer le parcours de `docs/10_INTEGRATION_DEMO.md`.

## Contrôles locaux effectués

- export statique Next.js réussi ;
- `/`, `/briefing/` et `/health` répondent `200` depuis FastAPI ;
- activation du scénario concert autorisée en environnement public de démonstration ;
- briefing calculé : 140 couverts et deux recommandations sur les données fictives générées ;
- `pnpm check` réussi avec 5 tests web et 22 tests API.

## URL créée

Le service répond sur [https://pilotage-restaurants.onrender.com/](https://pilotage-restaurants.onrender.com/). Le 17 juillet 2026, les six routes, l’activation du scénario concert, le briefing et le registre ROI ont été vérifiés publiquement.

## Limites

- Le plan gratuit peut mettre le service en veille : le premier chargement peut être plus lent.
- Le registre JSON est éphémère sur un service sans disque persistant et peut être remis à zéro lors d’un redéploiement.
- Le service est une démonstration publique sans authentification : aucune donnée réelle ne doit y être ajoutée.
- `autoDeploy` est désactivé dans le Blueprint ; les futures versions doivent être redéployées explicitement après validation.
