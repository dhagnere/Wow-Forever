# Vidéos de jeu → guide de 1 à 60

Une partie filmée sert à corriger le guide de 1 à 60 avec ce qui se passe vraiment en jeu. Chaque vidéo donne trois résultats.

## Condition : aucun guide commercial

La vidéo est jouée **sans Zygor** (ni aucun autre guide payant) : l'addon est **désactivé** dans la liste des AddOns, pas seulement masqué. Sinon l'ordre des étapes serait celui de ce guide, et rien n'en est repris. La vidéo est vérifiée sur toute sa durée (bande du haut de l'écran, où s'affiche le pointeur, et discussion) avant toute exploitation ; une vidéo avec Zygor est supprimée sans être analysée.

## Ce qu'il faut voir à l'écran

- la discussion, avec les messages « Quête acceptée : … » et « … terminé » ;
- la fiche de quête ouverte quelques secondes à la prise (titre, objectifs, donneur) ;
- les coordonnées : carte ouverte (« Personnage : x, y » en bas à gauche) ou petit addon sur la mini-carte, en particulier là où se trouvent les monstres et objets d'une quête ;
- si possible, un commentaire à voix haute quand quelque chose ne colle pas avec le guide du site.

Format : 1080p à 30 images par seconde, une zone par dossier, des morceaux de 10 à 20 minutes numérotés (`orc-chasseur_durotar_01.mp4`…). Partage par lien le temps du travail, puis retour en accès limité.

## Les trois résultats

1. **Le parcours relevé** — `content/parcours-releves.ts` : l'ordre joué dans la zone, étape par étape (« prendre:<id> », « faire:<id> », « rendre:<id> »), pour la race, et pour la classe si des quêtes de classe en font partie. Le guide suit cet ordre en tête de zone, puis l'ordre calculé (`ordreDuGuide`).
2. **Les quêtes de Forever manquantes** — `content/ajouts-forever.ts` : toute quête vue en jeu et absente du guide (ids 9100001 et suivants), avec donneur, receveur, coordonnées, objectifs rédigés avec nos mots et la source (vidéo, moment). Aucun texte de quête recopié.
3. **Le bloc de remarques** — à coller dans `/admin/guides/<race>/<classe>/`, champ « Importer des remarques », une étape par ligne :

   ```
   prendre:4641 | oui |
   prendre:788 | non | ce qui ne colle pas, en quelques mots
   ```

   « oui » coche « vérifié en jeu » ; les remarques restent dans l'admin.

Les deux premiers passent par un commit sur `dev` (tests compris : `tests/parcours-releves.test.ts`, `tests/ajouts-forever.test.ts`) et n'apparaissent sur le site qu'au déploiement. Un guide d'essai (page locale, non publiée) peut être préparé avant, pour relecture.

## Procédure d'analyse (la même pour chaque classe et chaque guide)

Du lien de la vidéo au guide mis à jour, dans cet ordre :

1. **Télécharger** la vidéo (`gdown`, id du lien Drive).
2. **Extraire les images** (`ffmpeg` via `imageio-ffmpeg` : 1 image/6 s pour les longues, 1 image/s pour les courtes de moins d'une minute).
3. **OCR** (`rapidocr-onnxruntime`, script `ocr_all.py`).
4. **Chronologie** (`extract_timeline.py` → `timeline.txt`) : repérer « Quête acceptée : … » et « … terminé », ainsi que les « niveau N ».
5. **Relever l'ordre des quêtes** : la suite des `prendre` / `faire` / `rendre`, dans l'ordre des vidéos, sans trier.
6. **Vérifier les coordonnées** à chaque fois (`quest_lookup.py` ou `guidePour` : donneur, receveur, cibles), et ne reporter que celles du guide.
7. **Écrire les trois résultats** : `parcours-relevés.ts` (ordre), `ajouts-forever.ts` (quête Forever vue et absente du guide), `analyses-videos.ts` (une entrée par vidéo).
8. **Vérifier** : `npm run lint && npm test` (les tests comprennent l'ordre jouable et les ajouts Forever).
9. **Pousser** sur `dev` (le site se déploie automatiquement).
10. **Régénérer l'addon** `TavernGuide` : `npx tsx exporter-addon.ts` (→ `data.lua`), puis re-zipper, pour que la route serve aussi en jeu.

Avant tout : confirmer que la vidéo est jouée **sans addon de guide** (pas de Zygor ni Questie à l'écran). Sinon l'ordre ne vaut rien et la vidéo est écartée, jamais analysée.

## Vidéos traitées

| Date | Personnage | Zone | Durée | Parcours relevé | Ajouts Forever | Remarques |
|---|---|---|---|---|---|---|
| 6 novembre 2026 | Orc chasseur | Durotar (Vallée des Épreuves) | 3 min 10 s | 4 étapes (orc, toutes classes) | « Armes égarées » (9100001) | 5 lignes |
| 6 novembre 2026 | Orc chasseur | Durotar (Vallée des Épreuves, niveaux 1 à 5) | 27 min | 22 étapes (chasseur ; 19 pour les autres classes orques) | « Armes égarées » : secteur relevé (44,1 – 66,6) | 19 lignes ; « Les vils quasits » (792) manque au guide |
| 6 novembre 2026 | Orc chasseur (vidéo 3-1) | Durotar | 4 min 48 s | écartée : Zygor chargé (« Zygor Guides Viewer: Sold … ») | — | — |
| 7 novembre 2026 | Orc chasseur (vidéos 08–17) | Durotar → Orgrimmar → Durotar nord | ~6 h | route 1 à ~13 | 15 quêtes Forever (camping, naga, cuisine Orgrimmar) | « Les ordres de l'amiral » (830) absente du guide |
| 8 novembre 2026 | Tauren druide (vidéos 01–03) | Mulgore (Camp Narache) | 8 min | 9 étapes (druide) | — | 747 → 752/753 → 3094 (classe) |
