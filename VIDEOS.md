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

## Vidéos traitées

| Date | Personnage | Zone | Durée | Parcours relevé | Ajouts Forever | Remarques |
|---|---|---|---|---|---|---|
| 6 novembre 2026 | Orc chasseur | Durotar (Vallée des Épreuves) | 3 min 10 s | 4 étapes (orc, toutes classes) | « Armes égarées » (9100001) | 5 lignes |
