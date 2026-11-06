/**
 * Parcours relevés en jeu : l'ordre réellement joué dans une zone, étape par étape, relevé sur une partie filmée sans guide
 * commercial (jamais d'après Zygor ou un autre guide : l'ordre serait le leur). Quand un parcours existe pour une race (et
 * éventuellement une classe) dans une zone, le guide suit d'abord cet ordre, puis reprend l'ordre calculé pour les étapes
 * que la partie n'a pas encore montrées (lib/guide.ts, ordreDuGuide). Positions, cibles et objectifs restent ceux des
 * données du guide.
 *
 * Comment remplir :
 *  - race : slug de race du guide (« orc », « mort-vivant », « skyborne-horde »…) ;
 *  - classe : slug de classe si le parcours est propre à une classe (quêtes de classe), sinon null : il vaut pour toutes ;
 *  - lieu : slug de la zone ;
 *  - etapes : dans l'ordre joué, « prendre:<id> », « faire:<id> » ou « rendre:<id> » (id de la quête dans le guide, ou
 *    9100001… pour une quête de content/ajouts-forever.ts) ; une étape inconnue de la zone est ignorée ;
 *  - source : la vidéo et les moments où les étapes se voient.
 */

export interface ParcoursReleve {
  race: string;
  classe: string | null;
  lieu: string;
  etapes: string[];
  source: string;
}

export const PARCOURS_RELEVES: ParcoursReleve[] = [
  {
    race: "orc",
    classe: null,
    lieu: "durotar",
    etapes: [
      "prendre:4641", // Votre place en ce monde, auprès de Kaltunk (0:05)
      "rendre:4641", // à Gornek, dans l'Antre (1:00)
      "prendre:788", // La dent tranchante, Gornek (1:05)
      "prendre:9100001", // Armes égarées, Gornek (2:35) ; ramassage commencé à 2:50, fin de la vidéo
    ],
    source: "Vidéo du 6 novembre 2026, chasseur orc, 3 min 10 s, jouée sans guide commercial.",
  },
];
