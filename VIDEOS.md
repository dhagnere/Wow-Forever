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
