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
