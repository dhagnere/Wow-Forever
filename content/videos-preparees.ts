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
 *  - `fichiers` : noms des fichiers d'origine, dans l'ordre (plusieurs fichiers : à assembler avec npm run carnet:video).
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
}

export const VIDEOS_PREPAREES: VideoPreparee[] = [];
