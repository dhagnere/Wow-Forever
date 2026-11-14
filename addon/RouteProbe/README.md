# RouteProbe

Addon **indépendant** (aucun lien avec EternalRoutes) : une *sonde* qui enregistre une
session de jeu pour construire ensuite la **logique Lua** des parcours.

## Ce qu'elle capture

- **Contexte** : race, classe, faction, niveau, carte (`uiMapID` + nom), zone.
- **Quêtes** : `QUEST_ACCEPTED` / `QUEST_TURNED_IN` → `id = nom`.
- **Compteurs de jeu** : `C_QuestLog.GetQuestObjectives(questID)` →
  `text`, `type`, `numFulfilled`, `numRequired`, `finished`. **On lit, on ne compte pas.**
- **PNJ** : cible courante (`PLAYER_TARGET_CHANGED`) + quêtes dispo/actives chez le PNJ
  (`C_GossipInfo.GetAvailableQuests` / `GetActiveQuests`).
- **Positions** : échantillon toutes les 3 s (`C_Map.GetPlayerMapPosition`).
- **Progrès des objectifs** (0.6) : chaque fois qu'un compteur avance (monstre vaincu, objet ramassé, objet du
  décor utilisé), l'heure, la position et l'objectif sont notés (`obj`). Les objets déjà dans les sacs à la prise
  de la quête ne comptent pas.
- **Objets de quête ramassés** (0.6) : à l'ouverture du butin, chaque objet attendu par une quête du journal (ou de
  la catégorie « Quête ») est noté avec sa quantité, sa position et **ce qui l'a donné** : objet du décor (coffre,
  plante, caisse…, nom lu dans l'info-bulle et identifiant du jeu) ou monstre (`loot`). Un objet reçu sans fenêtre de
  butin (« Vous recevez l'objet : … ») est noté aussi (`recu`). `/rp dump` récapitule les objets ramassés.

## Commandes

| Commande | Effet |
|---|---|
| `/rp start` | démarre l'enregistrement (capture le contexte) |
| `/rp stop` | arrête |
| `/rp context` | affiche le contexte (race, classe, carte, zone) |
| `/rp dump` | résumé : contexte + quêtes apprises + compteurs |
| `/rp clear` | efface |
| `/rp mark <texte>` | marqueur (fin de phase, note) |
| `/rp suite` | fin de la zone de départ : arrête, importe la route dans EternalRoutes, efface et relance l'enregistrement pour la partie commune |

## Un enregistrement par personnage

La sauvegarde de RouteProbe est commune au compte, mais chaque personnage garde son propre
enregistrement : à la connexion d'un autre personnage, celui en cours est mis de côté, puis rendu à
son propriétaire quand il revient. `/rp archives` liste les enregistrements mis de côté, `/rp clear`
n'efface que celui du personnage connecté. Un enregistrement en cours reprend tout seul après
`/reload` ou une reconnexion ; seul `/rp stop` l'arrête.

## Vidéo (Warcraft Recorder)

Un addon ne peut pas lancer de logiciel : la vidéo se démarre à la main, dans l'enregistrement manuel
de Warcraft Recorder. À chaque `/rp start` (et donc à chaque `/rp suite`), un rappel orange s'affiche à
l'écran et dans la discussion.

RouteProbe note l'heure de l'horloge du PC, celle que Warcraft Recorder donne à ses vidéos :
au départ, à chaque `/rp mark <texte>` (« Marqueur à 21:15:02 : … ») et à l'arrêt. Les repères sont
gardés avec l'enregistrement (`RouteProbeDB.horloges`, et un événement `clock` dans la liste) ;
`/rp context` les affiche. `RouteProbe.HeureDe(t)` convertit l'heure d'un événement en heure du PC.

## Entraîneurs

À l'ouverture de la fenêtre d'un entraîneur (`TRAINER_SHOW`), la sonde note son nom, sa
position, s'il s'agit d'un entraîneur de métier (`IsTradeskillTrainer`) et le niveau. Chaque
sort appris (`LEARNED_SPELL_IN_TAB`, ou le lien du message « Vous avez appris… ») est noté
avec son identifiant. EternalRoutes en fait une étape « Voir l'entraîneur » à l'import ; une
visite sans sort appris est ignorée.

## Fin de la zone de départ

La sonde connaît la zone de départ de chaque race :

| Race | Zone de départ | Fin vers le niveau |
|---|---|---|
| Humain | Forêt d'Elwynn | 10 |
| Nain, Gnome | Dun Morogh | 10 |
| Elfe de la nuit | Teldrassil | 11 |
| Orc, Troll | Durotar | 14 |
| Mort-vivant | Clairières de Tirisfal | 12 |
| Tauren | Mulgore | 10 |
| Skyborne | Île de Zéphras | 10 |

Un enregistrement lancé dans cette zone est la **partie de départ**. Dès que le
personnage en sort (niveau 8 ou plus), un bandeau rouge s'affiche, avec la classe,
la race, la zone quittée et la faction : il faut alors enregistrer la **partie commune**.
Bouton « Partie commune » ou `/rp suite`. L'enregistrement n'est jamais arrêté d'office.

Pas d'alerte dans les capitales, à Reflet-de-Lune (druides) ni en instance. Avant le
niveau 8, une sortie est traitée comme un détour (simple rappel). Le bandeau disparaît
si le personnage revient dans sa zone de départ. Un second bandeau, sans bouton,
signale le niveau de fin de zone atteint.

## Données

Stockées dans `RouteProbeDB` (au niveau du compte) :
`WTF/Account/<compte>/SavedVariables/RouteProbe.lua`.

Structure :

```lua
RouteProbeDB = {
    context = { raceFile, classFile, faction, level, map, mapName, zone, ... },
    quests = {
        ["783"] = { id = 783, name = "Votre place en ce monde",
                    objectives = { { text, kind, fulfilled, required, finished } } },
    },
    events = { "12.3|accept|783|Votre place en ce monde", ... },
    targets = { ["Gornek"] = "Player-..." },
}
```

## Utilisation

1. Copier le dossier `RouteProbe` dans `Interface/AddOns/`.
2. `/rp start`, jouer, `/rp stop`.
3. `/rp dump` (ou récupérer le fichier SavedVariables).

## Compatibilité

Cible **WoW Forever** (`16001`) et **Classic Era 1.15.x** (`11500`–`11510`), API modernes.
