# Vidéos de jeu → YouTube et Lettre

Les parties filmées par Jobwow (Warcraft Recorder) servent **seulement** à la chaîne YouTube et à la Lettre de la semaine.
Elles ne servent plus à corriger les guides du site : les routes réellement jouées passent par RouteProbe et l'addon
EternalRoutes. Rien n'est donc repris d'une vidéo dans `content/parcours-releves.ts`, `content/ajouts-forever.ts` ni dans
la relecture des guides, et les addons affichés à l'écran (Zygor, Questie…) ne posent plus de problème : ce qu'ils montrent
n'entre jamais dans le site.

## Circuit

1. **Jobwow envoie les liens de partage** (Google Drive, « Tous les utilisateurs disposant du lien » le temps du travail) des
   fichiers d'une semaine.
2. **Téléchargement et lecture de l'écran**, un fichier à la fois (`gdown`, puis une image toutes les 5 s avec ffmpeg et
   `rapidocr-onnxruntime`) : discussion (« Quête acceptée », « … terminée », niveaux), texte du centre (lieux traversés,
   pointeur de l'addon de guide), suivi des quêtes. Les fichiers téléchargés sont effacés aussitôt lus.
3. **Séances** : les fichiers d'une même séance (moins de 30 minutes d'écart) forment une vidéo YouTube, à assembler par
   Jobwow avec `npm run carnet:video`. Les chapitres sont calculés sur la vidéo assemblée (durées des fichiers mises bout à bout).
4. **Fiche YouTube** dans `content/videos-preparees.ts` : titre (100 caractères au plus), description, chapitres (lieux,
   niveaux, quêtes marquantes), fichiers et liens d'origine. Elle s'affiche dans `/admin/videos`, avec des boutons « Copier ».
   **Miniature** (`miniature`, obligatoire, une par vidéo) : 1280 × 720, 2 Mo au plus, dans `public/images/videos/`
   (`journal-<date>.jpg`, suffixe `-2` pour une deuxième séance le même jour). Elle s'affiche dans la fiche de l'admin,
   avec un lien de téléchargement ; le test refuse une vidéo préparée sans miniature.
   - **Image** (à partir du 13/11/2026) : une illustration fournie par Jobwow, différente pour chaque vidéo, qui montre
     la progression du personnage ; gardée dans `visuels/videos/illustration-<numéro>.webp` (la première vidéo :
     `illustration-01.webp`). Elle porte le logo de World of Warcraft Forever : créditer « © Blizzard Entertainment »
     dans la description. Ne jamais aller chercher une illustration ailleurs.
   - **Image** (avant le 13/11/2026, et à défaut d'illustration fournie) : une image nette du personnage de Jobwow tirée de la vidéo (ffmpeg, une image par seconde autour d'un
     moment fort : arrivée dans une ville, niveau gagné, gros plan). Effacer le nom flottant et les icônes d'interface
     collées au personnage (OpenCV, `cv2.inpaint`, masque sur le texte violet et sur les icônes) ; le bas de l'image
     passe sous le dégradé.
   - **Textes** : le sujet de la séance en deux lignes (« DU GLAS » / « À BRILL »), les niveaux, la zone et la date ; ni
     classe, ni nom d'addon, ni « sans guide ».
   - **Rendu** : `npm run video:miniature -- --image <image> --cadrage x,y,l,h --haut "…" --bas "…" --niveaux "1 → 8"
     --lieu "…" --date "…" --sortie public/images/videos/journal-<date>.jpg` (gabarit `visuels/miniature-video.html`,
     rendu par Playwright ; `--anglais` pour une version anglaise). Regarder le résultat avant de pousser.
5. **Lettre de la semaine**, en français et en anglais, dans `content/lettres-preparees.ts` : le récit des séances, avec un
   lien vers `/carnet/videos/` (ou `/en/notebook/videos/`) et le Carnet. Elle s'importe en brouillon dans `/admin/lettre`.
6. **Vérifier** (`npm run lint && npm test && npm run build`), puis pousser sur `dev`.

## Jobwow incrusté (bulles et sous-titres)

Décidé le 13 novembre 2026 : pas de voix ; Jobwow (sa capture, dans un médaillon) en bas à gauche, une bulle de réplique
humoristique et un sous-titre à chaque moment fort, la miniature YouTube en image de départ, une vidéo 16:9 et des clips
verticaux de 30 s. Gratuit, tout sur le PC de Jobwow. Une vidéo fournie donne une vidéo rendue (pas de regroupement).

**Le parcours en une commande (15/11/2026)** : déposer les vidéos dans `D:\WOW`, lancer `npm run carnet`. Les vidéos d'une
même journée sont assemblées en une seule (`Journal de Jobwow/journal-jobwow_<date>.mp4`) avec une seule narration et un
`.youtube.txt` (titre, description avec chapitres et liens vers le site : Carnet, vidéos, guide de 1 à 60, carte de chaque
zone traversée, base d'objets, Lettre, abonnement à la chaîne, Page Facebook ; refait à chaque passage ; chapitres tirés des moments de la narration, zones, niveaux, élites, trajets,
repères, décalés de l'image de départ, `chapitresNarration`, et suivis en direct dans l'Atelier pendant la relecture) ; une vidéo ajoutée ensuite refait l'assemblage et la narration (l'ancienne gardée en `.narration.avant.json`).
Dans l'Atelier, « Ouvrir le dossier D:\WOW » charge la narration de la journée et la vidéo assemblée (miniatures tirées
d'elle) ; les sept étapes y sont marquées terminées, en cours ou à faire. « Valider et enregistrer » met la narration
validée, miniature comprise (`miniatureImage`), dans les Téléchargements ; relancer `npm run carnet` la reprend toute
seule (Téléchargements, D:\WOW ou `DOSSIER_TELECHARGEMENTS`), écrit `<base>.miniature.jpg`, la place au début de la vidéo
et rend `.jobwow.mp4` et les clips. `--ecart <minutes>` découpe par séance au lieu de la journée.

**Longues soirées : des parties de 15 à 20 minutes (15/11/2026, demandé par Jobwow)**. Une journée de plus de 20 minutes
est découpée d'office (`lib/parties.ts`). Les coupes sont notées d'après la sonde : embarquement (zeppelin, bateau) 100,
pause entre deux enregistrements 95, départ en vol 90, arrivée d'un trajet ou d'un vol 80 à 85, arrivée dans une zone 80,
quête rendue 60 (75 si aucun autre objectif n'est entamé), niveau 55 ; toutes les 15 secondes, un « moment calme » noté
selon le temps écoulé depuis la dernière activité. Une coupe pendant une mort et le retour au corps, ou pendant un combat
contre un élite, est à éviter (−300) ; pendant un objectif de quête à moitié fait (avancé il y a moins de 3 minutes), elle
perd 80 points, sauf un départ ou une pause. La coupe tombe juste après l'événement, le temps que la bulle finisse.
Le meilleur jeu de coupes (`choisirParties`) donne des parties de 8 à 20 minutes, au mieux de 15 à 20 ; jamais plus de 20.
Les parties sont numérotées par soirée. Fichiers, dans `Journal de Jobwow` :
- `<journée>.parties.json` : le découpage et les coupes proposées (fins de chapitre, moments vraiment calmes) ;
- `<journée>_p<n>.narration.json` : la narration de chaque partie (`extrait` : son morceau de la vidéo de la journée,
  `partie` : numéro et total ; secondes comptées depuis le début de la partie, répliques propres à la partie) ;
- `<journée>_p<n>.youtube.txt` : titre « Journal de Jobwow · 15 novembre 2026 – partie 2 · … » et description qui situe
  la partie dans la soirée ; puis `<journée>_p<n>.miniature.jpg`, `.jobwow.mp4` et `.clip-N.mp4` au rendu.
La vidéo de la journée n'est jamais recoupée : chaque partie en est tirée au rendu (`-ss` et `-t`, réencodage exact).
Dans l'Atelier, la liste propose chaque partie ; le bloc « Découpage de la soirée » montre les parties sur une frise
(clic : ouvrir la partie) et, pour chaque coupe, la liste des coupes possibles. « Enregistrer le découpage » met
`<journée>.parties.json` dans les Téléchargements ; `npm run carnet` le reprend et refait la narration des seules parties
dont les bornes ont changé (l'ancienne gardée en `.narration.avant.json`). La miniature porte « PARTIE n » en haut à droite
(champ « Partie »). `--sans-parties` garde une seule vidéo ; une journée déjà préparée d'un seul tenant le reste, sauf avec
`--decouper` (l'ancienne narration passe en `.narration.avant.json`).
Rangement (16/11/2026) : chaque narration validée et chaque découpage enregistrés par l'Atelier sont repris dans
`D:\WOW\Journal de Jobwow` (miniature écrite à côté) puis retirés des Téléchargements, doublons « (1) » compris
(`rangerTelecharges`). Dans la frise de l'Atelier, chaque partie prend la couleur de son état (à relire, relue,
miniature choisie, validée, rendue, envoyée), la partie ouverte est encadrée en doré.

**Carte de fin (16/11/2026, demandée par Jobwow)**. Chaque vidéo 16:9 se termine par un fondu au noir de 2,5 s (image
et son), puis 8 s de carte de fin (`carteFin`, `outro` de `grapheRendu`) : « La suite de l'aventure… », la miniature de
la partie suivante encadrée d'or avec son titre (zones, niveaux), et l'adresse du site ; pour la dernière partie ou une
vidéo seule, « La suite de l'aventure au prochain épisode », le médaillon de Jobwow et l'appel à s'abonner. Les 8 s
laissent la place aux éléments de fin de YouTube (vidéo suivante, playlist, S'abonner). Si la miniature de la partie
suivante n'est pas encore choisie, la carte prend une image de son début et note « provisoire » dans
`<base>.carte-fin.txt` : la vidéo est refaite au `npm run carnet` qui suit le choix de la miniature. Toutes les
narrations validées sont rangées avant le premier rendu, pour que chaque carte trouve la miniature suivante.
L'adresse du site s'écrit aussi sur la miniature (champ « Adresse du site » de l'Atelier) ; une image ne peut pas
porter de lien cliquable, le lien reste en tête de la description.

**Lecture des parties dans les enregistrements d'origine (16/11/2026)**. Une partie est lue par une liste concat des
fichiers de D:\WOW (`listeMorceau` : `inpoint`/`outpoint` par fichier, d'après `sources`), avec `-reinit_filter 0` et
une coupe nette dans le graphe (`trim=duration`). Une recherche (`-ss`) dans la vidéo assemblée faisait repartir
l'horloge à la jonction de deux fichiers : la partie débordait jusqu'à la fin de la soirée. La durée de sortie est
bornée (`-t`), et un rendu d'une durée inattendue est refait. Ses moments et clips déjà relus sont alors repris
dans chaque partie (`repriseDansPartie`, `relue` dans la narration : l'Atelier marque la relecture faite) ; une partie
sans moment relu à son début reçoit sa propre intro. Restent à faire pour chaque partie : la miniature et la validation.

**Dossier de travail : `D:\WOW`** (décidé le 15/11/2026). Toutes les opérations vidéo s'y font : vidéos de Warcraft
Recorder, narrations, miniatures, rendus. Sans chemin, `npm run carnet:video` et `npm run carnet:incrustation` travaillent
sur `D:\WOW` (`DOSSIER_VIDEOS` dans `lib/videoCarnet.ts`, la variable d'environnement du même nom le remplace) ; l'Atelier
écrit ses commandes avec ce dossier.

Un dossier (celui de Warcraft Recorder) est rangé par séances comme pour `carnet:video` (plus de 30 minutes d'écart : nouvelle
séance), chaque séance assemblée sans réencodage dans « Journal de Jobwow » (`--sortie` pour un autre dossier) ; `--par-fichier`
garde une vidéo par fichier.

1. `npm run carnet:incrustation preparer` (tout `D:\WOW`) ou `npm run carnet:incrustation -- "D:\WOW\<vidéo>.mp4" --preparer` écrit `<vidéo>.narration.json` : intro, puis les moments
   tirés des repères d'EternalProbe (niveau, élite, mort, zone, grimoire, entraîneur, trajet, vol, repère `/ep mark`, une
   quête rendue toutes les deux minutes au plus), sans chevauchement, et trois clips verticaux au plus. Miniature :
   `--miniature <image>` ou `<vidéo>.miniature.jpg|png|webp` à côté de la vidéo. L'Atelier la fabrique (bloc « Miniature
   YouTube », depuis le 15/11) : il ouvre la vidéo dans le navigateur, sans rien envoyer, tire six images aux moments forts
   et les compose en 1280 × 720 dans la mise en page de `visuels/miniature-video.html` ; le JPEG enregistré se range dans
   D:\WOW à côté de la vidéo et sert aussi de miniature YouTube.
2. Relecture dans l'**Atelier vidéo de Jobwow** (artefact https://claude.ai/artifact/DSRxPCDtJQRUeL65i1cfvs) : ouvrir le
   fichier, corriger heures, répliques (« Autre réplique »), sous-titres et clips, aperçu 16:9 et 9:16, puis copier le texte
   dans le fichier.
3. `npm run carnet:incrustation -- "<vidéo>.narration.json"` rend `<vidéo>.jobwow.mp4` et `<vidéo>.clip-N.mp4`
   (`--sans-clips` pour s'en passer). Le médaillon (portrait retouché « Taverne » : parties claires assombries, touche chaude, bords assombris) rebondit quand Jobwow « parle », passe en gris à la mort, en doré au niveau.

**Voix de Jobwow** (choisie le 14/11) : `npm run carnet:voix -- "<vidéo>.narration.json"` fait dire chaque bulle par
Chatterbox Multilingual (Resemble AI, licence MIT, français), qui imite `visuels/voix/jobwow-reference.mp3` (voix « Gilles »
de Piper, enregistrements CC0, traitée « mort-vivant léger ») avec exaggeration 0,7 et cfg 0,3 (`scripts/voix_chatterbox.py`).
Les fichiers vont dans `voix-<vidéo>/` ; la narration reçoit `voix`, `voixTexte`, `dureeVoix`, et la bulle dure le temps de
la phrase. Le rendu mêle les voix au jeu, baissé à 35 % pendant qu'elles parlent ; une bulle modifiée après coup garde
l'ancienne voix muette jusqu'au prochain `carnet:voix`. Installation sur le PC, une seule fois : environ 5 Go libres, puis
`npm run voix:installer` (`scripts/installer-voix.ps1`). Le script choisit un Python compatible (3.10 à 3.14 : PyTorch
audio n'existe pas pour 3.15) ou installe 3.12 à côté par `py install`, sans toucher à la dernière version ; il crée
l'environnement `.voix/` (non versionné), y installe chatterbox-tts, PyTorch pour CUDA si une carte NVIDIA est présente,
et télécharge le modèle. `carnet:voix` (`scripts/voix.ts`) lance `voix_chatterbox.py` avec ce Python. Sans carte NVIDIA, la voix se calcule au
processeur : plus lent, sans limite. Description YouTube : mentionner la voix de synthèse.

**Second personnage : Jobwow TheSham** (demandé le 17/11/2026, en prévision d'un changement de personnage). Les
personnages des vidéos sont dans `content/personnages.ts` : nom, série (titres YouTube, sous-titre d'ouverture,
description, mot-dièse, playlist), avatar, répliques et façon d'apparaître. Jobwow, le tavernier, garde son médaillon
permanent. TheSham, chaman orc (sa classe peut être dite, à la différence de Jobwow), n'apparaît qu'aux moments forts :
son buste détouré (`visuels/avatars/thesham.png`, tiré de `visuels/thesham-capture.webp`) monte du bas de l'image en
0,3 s, parle dans une bulle façon bande dessinée (fond blanc, gros trait noir, ombre franche de la couleur du moment,
queue vers sa bouche, cri sur un cartouche penché : « NIVEAU ! », « ARGH ! »…), puis redescend ; gris à la mort, auréolé
d'or au niveau. Deux moments à moins de 1,5 s l'un de l'autre le gardent à l'écran (`intervallesApparition`). En
vertical, il occupe le bas de l'image et les sous-titres passent en haut. Polices de la bulle livrées avec le dépôt
(Comic Neue Bold et Bangers, licence OFL, `visuels/polices/`), pour un rendu identique sur tous les PC. Répliques dans
`content/repliques-thesham.ts`.

Choix du personnage : `npm run carnet -- --personnage thesham` (ou `thesham` seul si PowerShell retire le `--`) pour
les narrations à préparer ; d'office quand le nom du personnage joué, noté par la sonde, figure dans `nomsEnJeu` de son
profil (casse, espaces et accents ignorés : « Jobwow TheSham » reconnaît « Jobwowthesham » en jeu) ; sinon Jobwow. La narration le garde (`profil`), la carte de fin et le texte YouTube le suivent. Dans l'Atelier,
le bloc « Personnage de la vidéo », en tête de page (deux cartes, Jobwow et Jobwow TheSham, avec les réglages de chacun), change d'avis après coup : les bulles sont réécrites avec les répliques du nouveau personnage
(une bulle vidée reste vide) et revenir au précédent rend les siennes. La voix (`carnet:voix`) reste celle de Jobwow
tant qu'aucune référence propre à TheSham n'est choisie.

Répliques dans `content/repliques-jobwow.ts` (aucune classe citée : celle de Jobwow n'est jamais précisée), narration et
graphe ffmpeg dans `lib/incrustation.ts`, images (sharp) et encodage dans `scripts/incrustation-video.ts`, contrôles dans
`tests/incrustation.test.ts`. L'atelier embarque une copie des répliques : la republier quand la liste change.

## Règles des textes

- Titres, noms de lieux et de quêtes seulement : aucun texte de quête recopié.
- Rien d'inventé : ce qui ne se voit pas dans la vidéo reste entre crochets.
- Ne pas annoncer une partie « sans guide » quand un addon de guide est affiché.
- Le nom d'un guide commercial n'apparaît ni dans les titres ni dans la Lettre.

## Séances préparées pour YouTube

| Semaine | Date | Personnage | Fichiers | Durée | Remarques |
|---|---|---|---|---|---|
| 2026-S46 | 11 novembre 2026 | Jobwow, mort-vivant (Clairières de Tirisfal, Le Glas → Brill) | 8 (12 h 57 → 16 h 09) | 2 h 10 min 35 s | niveaux 1 à 8, 26 chapitres ; addon de guide et Questie à l'écran ; niveau 6 entre deux fichiers (14 h 09 → 14 h 22, non filmé) |

## Historique : vidéos utilisées pour le guide (jusqu'au 8 novembre 2026)

Avant ce changement, les vidéos jouées sans addon de guide servaient à relever l'ordre réel des quêtes. Les résultats restent
dans `content/parcours-releves.ts` et `content/ajouts-forever.ts`, mais ne sont plus complétés par des vidéos.

| Date | Personnage | Zone | Durée | Parcours relevé | Ajouts Forever | Remarques |
|---|---|---|---|---|---|---|
| 6 novembre 2026 | Orc chasseur | Durotar (Vallée des Épreuves) | 3 min 10 s | 4 étapes (orc, toutes classes) | « Armes égarées » (9100001) | 5 lignes |
| 6 novembre 2026 | Orc chasseur | Durotar (Vallée des Épreuves, niveaux 1 à 5) | 27 min | 22 étapes (chasseur ; 19 pour les autres classes orques) | « Armes égarées » : secteur relevé (44,1 – 66,6) | 19 lignes ; « Les vils quasits » (792) manque au guide |
| 6 novembre 2026 | Orc chasseur (vidéo 3-1) | Durotar | 4 min 48 s | écartée : Zygor chargé (« Zygor Guides Viewer: Sold … ») | — | — |
| 7 novembre 2026 | Orc chasseur (vidéos 08–17) | Durotar → Orgrimmar → Durotar nord | ~6 h | route 1 à ~13 | 15 quêtes Forever (camping, naga, cuisine Orgrimmar) | « Les ordres de l'amiral » (830) absente du guide |
| 8 novembre 2026 | Tauren druide (vidéos 01–03) | Mulgore (Camp Narache) | 8 min | 9 étapes (druide) | — | 747 → 752/753 → 3094 (classe) |
