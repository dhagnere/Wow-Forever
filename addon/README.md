# Addons de jeu de La Taverne Éternelle

| Dossier | Rôle | État |
|---|---|---|
| `EternalRoutes/` | Guide pas à pas en jeu (fenêtre, flèche, auto-avance) | 0.11.0 : lit EternalProbe, puis RouteProbe |
| `EternalProbe/` | Sonde de deuxième génération, remplace RouteProbe (`/ep`) | 0.8.1 : niveaux de quête, récompenses, points de vol, vols, morts, élites, captures d'écran |
| `RouteProbe/` | Ancienne sonde d'enregistrement, gardée pour référence | 0.6.0, version jouée au 13/11 |

Branche de travail : `dev-addon`. Chaque changement est relu puis fusionné dans `dev`.

## Ce qu'EternalProbe enregistre en plus de RouteProbe (0.8.0)

Nouveaux événements, au même format « heure|type|… » (EternalRoutes ignore ceux qu'il ne connaît pas) :
`qniveau` (niveau de la quête et du joueur, groupe conseillé), `recompense` (xp, argent, objets donnés et au choix),
`choix` (objet choisi), `gain` (xp et argent reçus), `taxi` (point de vol, destinations connues), `fpnouveau`,
`vol` (départ, arrivée), `mort`, `exploit` (élite ou rare vaincu), `photo` (capture d'écran prise au niveau gagné,
à la première visite d'une zone, après un élite ; `/ep photos off` les coupe). Détail en tête de `Captures.lua`.

## Banc d'essai

`tests/eternalprobe.test.ts` fait tourner EternalProbe dans un WoW simulé (`tests/banc/wow-simule.lua`, Lua par fengari),
puis l'import d'EternalRoutes sur son enregistrement. Il attrape les erreurs avant le jeu, sans remplacer le test en jeu.

## Installer en jeu

1. Désactiver **RouteProbe** dans la liste des AddOns (EternalProbe le remplace ; il prévient s'il le trouve encore actif).
2. Copier `EternalProbe` et `EternalRoutes` dans `Interface\AddOns\` (depuis les zip de « Versions à installer »).
3. `/ep start`, jouer, `/ep stop`, puis `/er importer` : mêmes gestes qu'avant, `/ep` à la place de `/rp`.

Un ancien enregistrement RouteProbe reste importable : il suffit de réactiver RouteProbe le temps de `/er importer`.

## Déposer une nouvelle version depuis le PC de jeu

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
