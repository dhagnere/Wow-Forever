# EternalRoutes

Addon **World of Warcraft Classic Era (1.15.x)** de guides de leveling 1→60, pour le site **[La Taverne Éternelle](https://www.taverne-eternelle.fr/)**.

Inspiré de l'*approche* des guides RestedXP (étapes pas-à-pas, flèche de direction, détection de quêtes), mais **code et données 100 % originaux**.

## Fonctionnalités

- **Fenêtre principale** : logo, guide en cours (clic sur son nom pour en changer), zone et barre de progression ; carte de l'étape avec flèche de direction, coordonnées, distance et badge « SUR PLACE » ; une ligne par quête (Prendre en or, Rendre en vert, Faire en bleu), icône d'état, objectifs chiffrés, PNJ ; boutons `<` / « Valider l'étape » / `>` ; les deux étapes suivantes sous « ENSUITE ».
- **Mode réduit** : une ligne (quête en cours, objectif, distance, flèche), un bouton pour valider et un bouton « + » pour revenir à la fenêtre complète (aussi : clic sur le logo, clic droit sur la barre, `/er mini`).
- **Vue du parcours** : zones dans l'ordre du guide, étapes faites et restantes ; un clic sur une étape l'ouvre en consultation.
- **Réglages** : flèche de direction, étapes suivantes, mode réduit, taille de la fenêtre (70 à 150 %), langue, remise à zéro de la progression.
- Survol d'une quête : description et état (à prendre, acceptée, en cours, prête à rendre…).
- **Icônes de quête** : une étape où l'on accepte une quête montre le « ! » jaune du jeu, une étape où l'on rend montre le « ? » ; la flèche de direction passe alors en petit dans le coin. Une étape « Faire » garde la grande flèche.
- Libellés des quêtes : « ACCEPTER LA QUÊTE », « FAIRE », « RENDRE LA QUÊTE ».
- **Consultation** : avec `<` `>` (ou un clic dans « Ensuite » ou la vue du parcours), la fenêtre et la flèche TomTom suivent l'étape affichée ; « Revenir à l'étape » les ramène à l'étape en cours. Un parcours déjà fait par le personnage s'ouvre terminé, avec un message.
- **Flèche TomTom** : un clic sur la boussole de la fenêtre (ou `/er fleche`) renvoie le point à TomTom et affiche dans le chat ce qui bloque, le cas échéant (TomTom absent, flèche désactivée, étape sans coordonnées).
- **Auto-avance** : une étape passe quand ses quêtes sont prises, faites (objectifs remplis) ou rendues.
  - suivi par identifiant de quête ; une quête rendue avant l'installation de l'addon compte (`C_QuestLog.IsQuestFlaggedCompleted`) ;
  - quêtes propres à Forever sans identifiant connu : suivies par leur nom, identifiant appris à l'acceptation (`learnedIds`).
- **Flèche** : TomTom si présent, sinon waypoint natif Blizzard (`C_Map` / `C_SuperTrack`). La carte de l'étape vient de son champ `map` (relevé par RouteProbe) : la flèche reste juste d'une zone à l'autre.
- Progression sauvegardée **par personnage**, reprise exacte à la reconnexion. Après la dernière étape, l'addon annonce la fin du guide et propose la liste.
- **Guides** : uniquement les parcours enregistrés en jeu avec RouteProbe (`Guides/*.lua`).
  - Aucune route pour l'instant : chaque route convertie s'ajoute dans `Guides/` et dans `EternalRoutes.toc`.

## Installation

1. Installer [TomTom (Classic)](https://www.curseforge.com/wow/addons/tomtom) — recommandé pour la flèche.
2. Copier le dossier `EternalRoutes` dans `Interface/AddOns/` du client (chemin final : `Interface/AddOns/EternalRoutes/EternalRoutes.toc`).
3. Redémarrer le jeu. `/er` ou `/eternalroutes` ouvre/ferme la fenêtre.

## Compatibilité

L'addon cible **WoW Forever** (interface `16001`) et reste compatible **Classic Era 1.15.x**
(`11500`–`11510`), tous listés dans `## Interface`. L'API utilisée est celle des clients
modernes (`C_QuestLog`, `C_Map`, `C_Item`, `BackdropTemplate`).

## Logique d'interaction

Le moteur réagit aux **événements WoW** (et non à une simple boucle) :

| Événement | Effet |
|---|---|
| `QUEST_ACCEPTED` | résout le titre via `C_QuestLog.GetTitleForQuestID`, marque la quête « accepted », passe en vert |
| `QUEST_TURNED_IN` | journalise le rendu |
| `GOSSIP_SHOW` / `QUEST_DETAIL` / `QUEST_GREETING` / `QUEST_PROGRESS` / `QUEST_COMPLETE` | détecte l'interaction PNJ |
| `GOSSIP_CLOSED` / `QUEST_FINISHED` | fin d'interaction |
| `QUEST_LOG_UPDATE` | rafraîchit la détection par nom |

Quand le joueur est à **≤ 12 m** du point de l'étape (`TomTom:GetDistanceToWaypoint`), l'intitulé
sous la flèche change en « Accepter : <quête> » / « Rendre : <quête> ». Une étape dont toutes les
quêtes « Prendre » sont au journal avance automatiquement.

## Commandes d'analyse

| Commande | Effet |
|---|---|
| `/er` | ouvre / ferme le guide |
| `/er status` | guide + étape courants |
| `/er state` | analyse complète (distance, devant PNJ, interaction, dernier événement, statut des quêtes) |
| `/er quests` | statut détaillé des quêtes de l'étape |
| `/er debug` | journalise chaque événement WoW dans le chat |
| `/er next` | avance (guide linéaire, pas de retour arrière) |
| `/er mini` | bascule entre fenêtre complète et mode réduit |
| `/er route` | vue du parcours |
| `/er options` | réglages |
| `/er fleche` | renvoie le point à TomTom et explique l'état de la flèche |
| `/er reset` | repart de l'étape 1 |

## Routes enregistrées avec RouteProbe

1. `/rp start`, jouer, puis `/rp stop`.
2. **`/er importer`** : EternalRoutes lit l'enregistrement de RouteProbe et en fait une route, tout de suite, sans fichier à envoyer.
   La route est gardée pour tout le compte (`EternalRoutesRoutesDB`) et choisie d'office si le personnage n'en suit aucune.
   Réimporter le même enregistrement met la route à jour.
3. Avant un autre personnage : `/rp clear`, puis `/rp start`.

| Commande | Effet |
|---|---|
| `/er importer` | convertit l'enregistrement RouteProbe en route |
| `/er routes` | liste les routes importées |
| `/er supprimer <id>` | supprime une route importée (l'identifiant est donné par `/er routes`) |
| `/er restaurer <id>` | remet la version d'une route d'avant son dernier import (gardée à chaque remplacement) |

L'emplacement des étapes « Faire » vient des progrès d'objectifs notés par RouteProbe 0.6 : le point médian des
endroits où l'on a vaincu les monstres, ramassé les objets ou utilisé les objets du décor demandés. Il passe avant le
secteur de la base intégrée, puisqu'il a été relevé en jouant. Chaque objet ramassé garde sa source : la ligne
d'objectif affiche « Caisse de vivres · sur : Caisse abandonnée ». Sans ces relevés (ancien enregistrement), l'étape
est placée d'après les monstres ciblés entre la prise et le rendu.

### Base de quêtes intégrée (QuestDB.lua)

2 334 quêtes de l'Azeroth d'origine, en français et en anglais, générées par La Taverne Éternelle
(`npm run addon:base -- <dossier>`) d'après les bases libres CMaNGOS classic-db (GPL v3) et AzerothCore (GPL v2) :
titre, niveau, niveau minimal, quête préalable, donneur et receveur placés sur la carte, secteur des objectifs,
objectifs rédigés par La Taverne (aucun texte de quête du jeu), restrictions de classe et de race.

- **À l'import d'une route**, la position de chaque étape vient de la base : donneur pour « prendre », receveur pour
  « rendre », secteur des objectifs pour « faire ». Une quête absente de la base (ajoutée par Forever) garde la position
  enregistrée. L'infobulle d'une quête indique l'origine de la position.
- **Objectifs et titres** dans la langue choisie (bouton EN), quand le jeu ne les donne pas encore.
- **Niveau et prérequis** : sous une quête pas encore prise, « Niveau 6 requis » ou « Il faut d'abord rendre … ».

### Une route par zone de départ, puis une route par faction

Pas besoin d'enregistrer chaque race et chaque classe :

| Enregistrement | Sert à |
|---|---|
| Forêt d'Elwynn | humain |
| Dun Morogh | nain et gnome |
| Teldrassil | elfe de la nuit |
| Durotar | orc et troll |
| Clairières de Tirisfal | mort-vivant |
| Mulgore | tauren |
| Île de Zéphras | Skyborne |
| Route de faction (à partir de la sortie de la zone de départ) | toute l'Alliance ou toute la Horde |

- **À l'import**, RouteProbe indique quelle partie il enregistrait : un enregistrement fait dans la zone de départ
  devient la « route de départ » de toutes les races de cette zone, quelle que soit la classe ; la « partie commune »
  (après `/rp suite`, ou `/rp start` hors de la zone de départ) devient une « route de faction »
  (`rp-<faction>-<niveau de départ>`), même si elle passe encore par Brill (Tirisfal) ou par la tour du zeppelin
  (Durotar). Un ancien enregistrement, sans cette indication, est classé d'après ses cartes.
- **Rien ne se perd** : quand un import remplace une route, sa version précédente est gardée ; `/er restaurer <id>`
  la remet (un second appel revient à l'import).
- **Quêtes des autres classes et races masquées** : liste des bases libres (`QuestRestrictions.lua`, 212 quêtes de
  classe, 1 896 de race ou de faction). Pour les quêtes propres à Forever, absentes de ces bases, l'addon constate
  chez le PNJ qu'il ne propose pas la quête à ce personnage, la saute avec ses suites, et réessaie au niveau suivant.
- **Enchaînement** : à la fin de la route de départ, ou en entrant dans une zone qu'elle ne contient pas et où passe
  une route de faction (les capitales enregistrées dans la route de départ ne déclenchent rien), l'addon charge la
  route de faction du niveau du personnage.
- Les quêtes de classe que la route n'a pas enregistrées (route faite avec une autre classe) ne sont pas guidées.

### États des quêtes dans la fenêtre

Chaque quête de l'étape porte la couleur de son état, avec un pictogramme et un badge écrit :

| État | Fond | Repère |
|---|---|---|
| À prendre | neutre, bord or | « ! » jaune du jeu, badge « À PRENDRE » |
| Acceptée, en cours | orangé | jauge et compteurs du jeu, badge « ACCEPTÉE · EN COURS » |
| Objectifs remplis | vert | « ? » jaune du jeu, badge « OBJECTIFS REMPLIS » ou « À RENDRE » |
| Rendue | grisé | repliée en une ligne barrée, en bas de l'étape |

Un bref éclair marque le changement d'état, et une annonce s'affiche sous l'étape pendant huit secondes :
quête acceptée, objectifs remplis (avec l'étape du rendu si elle est plus loin), quête rendue.

Le bloc « Quêtes en cours », toujours visible sous « Ensuite », liste les quêtes de la route présentes dans
le journal du jeu (prêtes à rendre d'abord), avec leur compteur et le total du journal sur 20. Un clic sur
une ligne affiche l'étape où la rendre. Les étapes de « Ensuite » portent une pastille de couleur, et le bord
du mode réduit prend la couleur de l'action en cours.

### Étapes « Voir l'entraîneur »

Une visite chez un entraîneur où l'on a appris au moins un sort devient une étape, placée à
l'endroit enregistré, avec la liste des sorts. Elle ne concerne que la classe qui l'a
enregistrée. Elle se valide en fermant la fenêtre d'un entraîneur du même genre (classe ou
métier), ou d'elle-même quand tous ses sorts sont connus. Une visite oubliée ne bloque pas la
reprise si la quête suivante est déjà entamée.

Réimporter une route de départ avec une autre classe remplace les quêtes, mais garde les
visites des autres classes : chacune est replacée après sa quête de repère (`ancre`). Une route
partagée réunit ainsi, au fil des enregistrements, l'entraîneur de chaque classe.

## Mode sonde (enregistrement)

Plutôt que de deviner les IDs de quête, l'addon peut **apprendre en jouant** :

```
/er rec start     # démarre l'enregistrement
# … jouer, accepter/rendre des quêtes, parler aux PNJ …
/er rec stop      # arrête
/er rec dump      # affiche les quêtes apprises (id = nom)
```

Le mode capture `QUEST_ACCEPTED`, `QUEST_TURNED_IN`, l'ouverture de dialogue
(`C_GossipInfo.GetAvailableQuests`), le PNJ ciblé et des échantillons de position.
Les données sont conservées dans `EternalRoutesRecDB` (au niveau du compte), donc
récupérables dans `WTF/Account/<compte>/SavedVariables/EternalRoutes.lua`.

Une fois le fichier récupéré, on peut générer la table `nom → ID` et rendre les
« Rendre » auto-détectables (`C_QuestLog.IsQuestFlaggedCompleted`).

## Architecture

| Fichier | Rôle |
|---|---|
| `EternalRoutes.toc` | Métadonnées + ordre de chargement |
| `Core.lua` | Namespace, sauvegarde, événements, commandes `/er` |
| `Locale.lua` | Chaînes frFR / enUS |
| `Data.lua` | Documentation du format de données |
| `Guides.lua` | **Généré** par `tools/ingest.mjs` — guides réels |
| `GuideEngine.lua` | Sélection, progression, détection (nom + arrivée) |
| `TomTomIntegration.lua` | Flèche : TomTom, sinon waypoint natif Blizzard |
| `GuideWindow.lua` | Fenêtre principale, mode réduit, vue du parcours, réglages |
| `Recorder.lua` | Mode sonde : enregistre les événements du jeu et les IDs de quête |
| `Textures/logo.tga` | Logo converti en texture WoW (`tools/make-texture.py`) |

## Logo

Le logo du site est affiché dans l'en-tête de la fenêtre. WoW Classic n'accepte pas les
PNG comme texture : `tools/make-texture.py` convertit le PNG source en
`Textures/logo.tga` (256×256, TGA 32 bits non compressé, coins transparents).

```bash
python tools/make-texture.py
```

## Format des données (`Data.lua`)

```lua
{
    id = "orc_hunter", name = "Orc chasseur 1-60",
    faction = "Horde", race = "Orc", class = "HUNTER",
    minLevel = 1, maxLevel = 60, zoneCount = 26,
    steps = {
        {
            zone = "Durotar", zoneIndex = 1,
            x = 42.1, y = 68.3,          -- coordonnées 0..100 (flèche)
            quests = {                    -- affichées à la suite dans la fenêtre
                { kind = "prendre", name = "La dent tranchante", level = 2,
                  objectives = { "Vaincre 10 × Sanglier tacheté" } },
                { kind = "rendre", name = "Votre place en ce monde" },
                { kind = "faire", name = "Armes égarées",
                  objectives = { "Rapporter 6 × Arme d'entraînement abandonnée" } },
            },
            accepts = { "La dent tranchante" },     -- auto-avance dès qu'au journal
            turnins = { "Votre place en ce monde" },
        },
    },
}
```

Les `objectives` viennent de l'enregistrement RouteProbe et sont rattachés à la quête
correspondante (même si la quête est acceptée plusieurs étapes plus tôt).

## Checklist de test en jeu

- [ ] `/er` ouvre la fenêtre et affiche le logo **droit** (pas retourné).
- [ ] Le guide correspond à la faction (Orc Chasseur → Horde, Humain Guerrier → Alliance).
- [ ] La flèche TomTom pointe vers les coordonnées de l'étape.
- [ ] Une étape « Prendre » avance dès que la quête est acceptée.
- [ ] Une étape « Faire » avance quand on arrive sur place (≤ 40 m).
- [ ] Une étape « Rendre » avance manuellement via `>`.
- [ ] Fermer/rouvrir le jeu reprend à la bonne étape (`/er status`).
- [ ] `/er reset` repart de l'étape 1.

## Limites connues

- Une quête sans identifiant enregistré est suivie par son **nom** (client frFR) jusqu'à son acceptation.
- Les étapes « à rendre ailleurs » n'ont pas de coordonnées : pas de flèche, seulement le PNJ et le lieu.
- Pas de test en jeu possible ici : valider le rendu et les clics en jeu.

## Feuille de route

- [x] Squelette de l'addon (toc, core, moteur, UI, TomTom)
- [x] Outil d'ingestion pages → `Guides.lua`
- [x] Données réelles Orc Chasseur + Humain Guerrier
- [x] Détection de rendu de quête (identifiants)
- [x] Bouton minimap + panneau d'options
- [ ] Packaging CurseForge / Wago
