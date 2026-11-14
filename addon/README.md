# Addons de jeu de La Taverne Éternelle

| Dossier | Rôle | État |
|---|---|---|
| `EternalRoutes/` | Guide pas à pas en jeu (fenêtre, flèche, auto-avance) | 0.12.1 : lit EternalProbe, puis RouteProbe ; consigne sous chaque étape (entraîneur, grimoire, objets à ramasser) ; niveaux lus au bon format |
| `EternalProbe/` | Sonde de deuxième génération, remplace RouteProbe (`/ep`) | 0.10.1 : captures de la 0.8, trajets (`/ep trajet`), code à coller sur le site (`/ep export`, `/ep export depart`), titre des entraîneurs, grimoires achetés, nouveau niveau noté à la montée (`level|5|nouveau`) |
| `RouteProbe/` | Ancienne sonde d'enregistrement, gardée pour référence | 0.6.0, version jouée au 13/11 |

Branche de travail : `dev-addon`. Chaque changement est relu puis fusionné dans `dev`.

## Ce qu'EternalProbe enregistre en plus de RouteProbe (0.8.0)

Nouveaux événements, au même format « heure|type|… » (EternalRoutes ignore ceux qu'il ne connaît pas) :
`qniveau` (niveau de la quête et du joueur, groupe conseillé), `recompense` (xp, argent, objets donnés et au choix),
`choix` (objet choisi), `gain` (xp et argent reçus), `taxi` (point de vol, destinations connues), `fpnouveau`,
`vol` (départ, arrivée), `mort`, `exploit` (élite ou rare vaincu), `photo` (capture d'écran prise au niveau gagné,
à la première visite d'une zone, après un élite ; `/ep photos off` les coupe), `trajet` (zeppelin, bateau). Détail en tête de `Captures.lua`.

**Trajets** : `/ep trajet Zeppelin Tirisfal - Orgrimmar` au moment d'embarquer. L'arrivée se note seule dès qu'on reste
immobile 5 s dans une autre zone ; `/ep trajet fin` la note à la main, `/ep trajet annule` abandonne. Marche sans
enregistrement en cours et survit à un `/reload`. Le site place un trajet d'après ses lieux de départ et d'arrivée,
jamais d'après l'heure : on peut le rejouer après coup (aucune quête n'est en jeu).

**Entraîneurs et grimoires (0.10.0)** : l'événement `trainer` porte en 7e champ le titre du PNJ (« Entraîneur de démons »,
« Dresseur de familiers »), lu sur sa bulle ; `livre` note un grimoire ou un livre acheté chez un vendeur (objet, nom,
vendeur, titre, position, niveau). Les autres achats ne sont pas notés.

**Niveaux (0.10.1)** : à la montée de niveau, le jeu donne encore l'ancien niveau ; la sonde note désormais le nouveau, lu dans
l'événement, sous la forme `level|5|nouveau`. Les enregistrements plus anciens (sans `nouveau`) sont lus avec un niveau de plus
par le site, `carnet:video`, `carnet:incrustation` et EternalRoutes.

## Consignes sous l'étape (EternalRoutes 0.12.0)

Sous les objectifs, une ligne jaune « » … » dit quoi faire :

| Étape | Consigne |
|---|---|
| Entraîneur de classe | Apprenez vos nouveaux sorts auprès de l'entraîneur. |
| Entraîneur de métier | Apprenez le rang suivant de votre métier. |
| Entraîneur de démons (fenêtre d'entraîneur) | Choisissez une capacité pour votre démon. |
| Achat d'un grimoire (`livre`) | Choisissez une capacité pour votre démon et achetez son grimoire. Faite dès que le grimoire est dans les sacs. |
| Dresseur de familiers | Choisissez les techniques à enseigner à votre familier. |
| Objet à ramasser sur des monstres | Fouillez les corps : Sanglier tacheté. |
| Objet à ramasser dans le décor | Cliquez sur : Caisse abandonnée pour ramasser les objets. |
| Objet sans source relevée | Ramassez les objets demandés. |
| Objet du décor à utiliser, lieu à atteindre | Cliquez sur l'objet indiqué dans le décor. / Rendez-vous sur place… |

Un grimoire ou un livre utilisable dans les sacs fait apparaître, quelle que soit l'étape, un encadré : « Ouvrez vos sacs
et faites un clic droit sur « Grimoire d'Éclair de feu (Rang 2) » : votre démon apprend la capacité. » (mode réduit compris).
Les sources (« sur : … ») ne sont plus collées au texte de l'objectif : elles sont dans la consigne. Textes dans `Locale.lua`
(`HINT_…`, français et anglais), règles dans `Engine.ActionsEtape` et `Engine.ActionsSacs` (`GuideEngine.lua`).

## Publier un parcours sur le site

1. En jeu : `/ep export`. La fenêtre montre un code déjà sélectionné : Ctrl+C. Après `/ep suite`, la zone de départ
   reste exportable à part : `/ep export depart`.
2. Site : Administration › **Guides à valider (Probe)**, coller, « Analyser le code ».
3. Relire (zones, quêtes, trajets, vérification), choisir la portée, « Publier ». Les pages du guide se mettent à jour
   dans la minute ; « Retirer du site » rend l'ordre d'avant.

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
