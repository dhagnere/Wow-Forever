/**
 * Vidéos du Journal de Jobwow préparées pour YouTube (page /admin/videos). Jobwow envoie les liens de partage (Google
 * Drive) des parties filmées par Warcraft Recorder ; elles sont analysées selon VIDEOS.md (images, texte à l'écran,
 * chronologie) et chaque séance reçoit ici son titre et sa description, chapitres compris, à coller dans YouTube Studio.
 *
 * Règles :
 *  - une entrée par séance de jeu (une vidéo YouTube), rangée par semaine (`semaine` : « 2026-S46 », lundi au dimanche) ;
 *  - titre de 100 caractères au plus, description de 5 000 au plus (limites de YouTube) ;
 *  - chapitres dans la description : « 0:00 … » en premier, trois au moins, dix secondes au moins entre deux (règles de
 *    YouTube), tirés de ce qui se voit à l'écran (zones, niveaux, quêtes), jamais d'un guide commercial ;
 *  - aucun texte de quête recopié : titres et noms seulement ;
 *  - `fichiers` : noms des fichiers d'origine, dans l'ordre (plusieurs fichiers : à assembler avec npm run carnet:video) ;
 *  - `miniature` (obligatoire) : image de la vidéo dans public/images/videos/ (JPEG ou PNG, 1280 × 720, 2 Mo au plus),
 *    faite avec npm run video:miniature (gabarit visuels/miniature-video.html), le personnage pris dans la vidéo
 *    elle-même, sans nom de classe ni nom d'addon.
 * La vidéo passe « publiée » toute seule dans l'admin quand une vidéo publique de la chaîne porte le même titre.
 */

export interface VideoPreparee {
  /** Identifiant stable : « 2026-11-11-21h00 ». */
  id: string;
  semaine: string;
  /** Date de la séance (AAAA-MM-JJ). */
  date: string;
  fichiers: string[];
  /** Liens de partage fournis par Jobwow, dans le même ordre que les fichiers. */
  liens: string[];
  /** Durée totale (« 1:42:10 »). */
  duree: string;
  titre: string;
  description: string;
  /** Miniature à importer dans YouTube Studio : « /images/videos/journal-2026-11-11.jpg ». */
  miniature: string;
}

export const VIDEOS_PREPAREES: VideoPreparee[] = [
  {
    id: "2026-11-11-12h57",
    semaine: "2026-S46",
    date: "2026-11-11",
    fichiers: [
      "2026-11-11 12-57-00 - Manual.mp4",
      "2026-11-11 13-03-00 - Manual.mp4",
      "2026-11-11 13-06-15 - Manual.mp4",
      "2026-11-11 13-54-35 - Manual.mp4",
      "2026-11-11 14-22-24 - Manual.mp4",
      "2026-11-11 14-41-44 - Manual.mp4",
      "2026-11-11 15-22-56 - Manual.mp4",
      "2026-11-11 16-09-32 - Manual.mp4",
    ],
    liens: [
      "https://drive.google.com/file/d/1VXaptzeWAfq6BZbXlf4mqN1GaBLoBX5Y/view",
      "https://drive.google.com/file/d/1jyXzcjHH-4QOklPQ4zxnw608xt30IewM/view",
      "https://drive.google.com/file/d/1W5-ZZux-NO8X9LbyBG9RoxnUEzAdlwEX/view",
      "https://drive.google.com/file/d/1TtdY8wk1WJErJvJl6TSlpYWyJIDkTQwi/view",
      "https://drive.google.com/file/d/1LzePi4r96K_LMT_kySdZcgvSHucNpSFF/view",
      "https://drive.google.com/file/d/1ypMLBeZ70iOZSfXGNV3xfI2NLPgKrd49/view",
      "https://drive.google.com/file/d/1WFpq6ih5lNgvBSSIthE-2Ge22Ptl-b-i/view",
      "https://drive.google.com/file/d/1eexpxYy07EGO3Zwf3qwR7moY_1T6hOdv/view",
    ],
    duree: "2:10:35",
    miniature: "/images/videos/journal-2026-11-11.jpg",
    titre: "Journal de Jobwow · 11 novembre 2026 · Clairières de Tirisfal · niveaux 1 à 8",
    description: `Une séance de jeu sur WoW Forever : un mort-vivant de la Horde se réveille au Glas, dans les Clairières de Tirisfal, et pousse jusqu'à Brill, du niveau 1 au niveau 8.

Chapitres :
0:00 Réveil au Glas, niveau 1
5:24 Premières quêtes : Les Déchus, Lever le voile
7:39 Niveau 2
12:59 Niveau 3
13:44 Faites cliqueter les thorax ! et Les Maudits
21:04 Niveau 4
23:49 La dernière volonté de Marla
25:24 Les grottes des Tisse-nuit et la chasse aux trésors
39:28 Niveau 5 et La Croisade écarlate
48:46 L'herboristerie apprise
49:16 Le messager rouge
52:51 Vers Brill : Informations décisives, Les champs du Chagrin
56:12 Manoir du Foyerfroid
58:57 Arrivée à Brill
1:02:22 Taverne des Pendus, la cuisine apprise
1:05:37 Des peaux pour les Réprouvés
1:15:47 Niveau 7
1:18:47 Lac Étincelant
1:23:17 Une peste nouvelle et Le frisson de la mort
1:36:07 Étang immobile
1:43:22 Niveau 8
1:45:17 Ferme des Solliden
1:59:37 Demande d'asile
2:05:02 Retour à Brill : Les moulins hantés, Morts dans la Famille
2:06:32 Une série de quêtes rendues à Brill
2:09:37 Nouveaux sorts chez l'entraîneur

Le Carnet de Jobwow : https://www.taverne-eternelle.fr/carnet/
Toutes les vidéos sur le site : https://www.taverne-eternelle.fr/carnet/videos/
Le guide de 1 à 60 : https://www.taverne-eternelle.fr/guides/parcours/

La Taverne Éternelle, site de fans indépendant, non affilié à Blizzard Entertainment.`,
  },
];
