# Addons de jeu de La Taverne Éternelle

| Dossier | Rôle | État |
|---|---|---|
| `EternalRoutes/` | Guide pas à pas en jeu (fenêtre, flèche, auto-avance) | À déposer (voir plus bas) |
| `RouteProbe/` | Ancienne sonde d'enregistrement, gardée pour référence | À déposer (voir plus bas) |
| `EternalProbe/` | Sonde de deuxième génération, remplace RouteProbe | À construire |

Branche de travail : `dev-addon`. Chaque changement est relu puis fusionné dans `dev`.

## Déposer EternalRoutes et RouteProbe (une seule fois)

Depuis le PC où l'on joue, sans rien installer :

1. Ouvrir `https://github.com/dhagnere/Wow-Forever/tree/dev-addon/addon` (branche **dev-addon**, vérifier le sélecteur en haut à gauche).
2. **Add file › Upload files**.
3. Glisser les dossiers `EternalRoutes` et `RouteProbe` pris dans
   `C:\WOW\world of Warcraft\_forever_\Interface\AddOns\` (les dossiers entiers, pas leur contenu).
4. Message : « Addons : versions jouées d'EternalRoutes et RouteProbe ». Laisser « Commit directly to the dev-addon branch ».
5. **Commit changes**.

Ne pas déposer les sauvegardes (`WTF/…/SavedVariables`) : elles contiennent le nom du compte.

## Décisions (13 novembre 2026)

- EternalProbe a **sa propre table de sauvegarde**, `EternalProbeDB`, portant un numéro de format.
- EternalRoutes lit `EternalProbeDB`, puis `RouteProbeDB` à défaut : trois petits changements dans `Importer.lua`,
  le message d'erreur et la dépendance optionnelle du `.toc`.
- RouteProbe est désinstallé quand EternalProbe arrive.
- Les données partent vers le site par une page d'import de `/admin` (fichier de sauvegarde glissé), puis la sauvegarde est vidée.
- Pas d'installation automatique : chaque version sort en zip, déposé dans le Drive (« Versions à installer »).

## Travailler sans PC fixe

Le dépôt contient un environnement **GitHub Codespaces** (`.devcontainer/`) : bouton **Code › Codespaces › Create codespace on dev-addon**.
Le site et sa base démarrent dans le navigateur ; le mot de passe de `/admin` s'affiche à la création. `npm run dev` lance le site.
