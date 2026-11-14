# Addons de jeu de La Taverne Éternelle

| Dossier | Rôle | État |
|---|---|---|
| `EternalRoutes/` | Guide pas à pas en jeu (fenêtre, flèche, auto-avance) | 0.12.1 : lit EternalProbe, puis RouteProbe ; consigne sous chaque étape (entraîneur, grimoire, objets à ramasser) ; niveaux lus au bon format |
| `EternalProbe/` | Sonde de deuxième génération, remplace RouteProbe (`/ep`) | 0.10.1 : captures de la 0.8, trajets (`/ep trajet`), code à coller sur le site (`/ep export`, `/ep export depart` (zone de départ seule ; depuis la 0.11.1, `/ep export` donne la zone de départ gardée et la suite réunies, `/ep export commune` la suite seule)), titre des entraîneurs, grimoires achetés, nouveau niveau noté à la montée (`level|5|nouveau`) |
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

## Routes enregistrées seulement (EternalRoutes 0.13.5)

Les 56 guides de 1 à 60 du site (un par race et classe) ne sont plus chargés par l'addon : seules les routes
enregistrées en jeu servent de référence. Chaque route de départ s'affiche sous la forme
« Départ · Clairières de Tirisfal · Mort-vivant · Démoniste · 1-6 » (zone, race et classe de l'enregistrement) ;
les routes de faction gardent « Horde · zone · niveaux ». `npm run addon:wow` ne remet plus les guides du site :
il écrit `Maps.lua` et la base de quêtes (`QuestDB.lua`).

## Une route de départ par classe (EternalRoutes 0.13.4)

Chaque classe a ses quêtes et ses entraîneurs dès la zone de départ : une route de départ se garde désormais par zone
**et par classe** (`rp-depart-<zone>-<classe>`). Enregistrer la zone de départ avec un guerrier n'écrase plus la
route du démoniste : les deux coexistent.

- Le personnage suit la route de départ de sa classe quand elle existe ; sinon celle d'une autre classe de sa race,
  complétée comme avant (quêtes de classe, entraîneur de sa classe).
- Importer la route de sa classe la fait suivre aussitôt, même si le personnage suivait celle d'une autre classe.
- Les routes de départ importées avant la 0.13.4 prennent le nom de la classe qui les a enregistrées au chargement de
  l'addon ; un personnage qui en suivait une la retrouve sans rien faire.
- Les routes de faction (après la zone de départ) restent communes à toutes les classes.

Pour couvrir une race, il faut donc enregistrer sa zone de départ une fois avec chaque classe, puis `/ep export depart`
pour le site si besoin.

## Position exacte des PNJ dans la base intégrée (EternalRoutes 0.13.3)

`QuestDB.lua` plaçait chaque donneur et receveur au centre de son village, comme le guide du site qui regroupe les PNJ
voisins en un seul point. Dans un même village, tous les entraîneurs avaient donc la même position : la flèche du
« Parchemin simple » du guerrier visait la maison de l'entraîneur des démonistes. La base donne maintenant la position
du PNJ lui-même (fiche de la quête), et le centre du village seulement quand le PNJ n'est pas placé.

## Entraîneur de la classe jouée (EternalRoutes 0.13.2)

Sur une route enregistrée avec une autre classe, les étapes « Voir l'entraîneur » menaient jusqu'ici à l'entraîneur de
la classe qui l'avait enregistrée, ou disparaissaient. Chacune mène maintenant à l'entraîneur de la classe jouée le plus
proche, sur la même carte, au même moment de la route : nom, position et flèche sont les siens.

- Positions : base intégrée (`ns.classTrainers` dans `QuestDB.lua`, entraîneurs des bases libres placés par
  `npm run base:quetes`, puis `npm run addon:wow`), complétée par les entraîneurs vus en jeu.
- Entraîneur vu en jeu : chaque fois qu'un personnage ouvre la fenêtre de l'entraîneur de sa classe, l'addon retient
  son nom et sa position pour tout le compte (`EternalRoutesRoutesDB.entraineursClasse`). C'est ce qui place les
  entraîneurs propres à Forever, absents des bases libres.
- Sans entraîneur connu sur la carte, l'étape reste sans flèche et invite à ouvrir une fois la fenêtre de l'entraîneur ;
  la position est alors retenue et l'étape se met à jour.
- Les visites d'entraîneur de métier, d'entraîneur de démons et les achats de grimoire restent réservés à la classe qui
  a enregistré la route.

## Quêtes de classe sur une route d'une autre classe (EternalRoutes 0.13.1)

Une route enregistrée avec un personnage sert à toutes les classes de sa race. Jusqu'ici, un guerrier qui suivait
une route enregistrée par un démoniste ne voyait pas ses propres quêtes de classe : le démoniste ne les avait pas
prises. EternalRoutes les ajoute maintenant d'après sa base de quêtes (`QuestDB.lua`) : chaque quête réservée à la
classe jouée, donnée dans une zone de la route et à son niveau, apparaît avec ses étapes « prendre », « faire » et
« rendre », juste après la première étape où le niveau demandé est atteint ; ses suites viennent après elle. La route
enregistrée n'est pas modifiée : le démoniste la voit toujours telle qu'il l'a jouée.

## Annonces discrètes (EternalProbe 0.11.0, EternalRoutes 0.13.0)

Les messages automatiques des deux addons (début et fin d'enregistrement, sortie de la zone de départ, rappel de la
vidéo, suite de route, quête abandonnée…) ne s'écrivent plus dans le chat : ils passent dans un petit bandeau en haut
de l'écran, effacé en 2,5 secondes, pour ne pas rester dans les vidéos. Les réponses aux commandes de lecture restent
dans le chat, pour être relues : `/ep dump`, `/ep context`, `/ep archives`, `/ep aide` ; `/er status`, `state`, `objs`,
`quests`, `routes`, `rec dump`.

- `/ep annonces aucune` et `/er annonces aucune` : silence complet (rien à l'écran ni dans le chat), pour filmer.
- `/ep annonces chat` et `/er annonces chat` : retour à l'ancien fonctionnement.
- `/ep annonces ecran` et `/er annonces ecran` : le bandeau (réglage par défaut).

Le bandeau rouge de fin de zone de départ, qu'on ferme d'un clic, et l'alerte centrale de Warcraft (« raid warning »)
restent affichés : ce sont des consignes à suivre.

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
