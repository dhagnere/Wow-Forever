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
    // Orc chasseur, vidéos 01 à 05 du 7 novembre 2026 (ordre des vidéos conservé) : Vallée des Épreuves, puis Sen'jin
    // et Îles de l'Écho. La vidéo 07 est une seconde prise de la Vallée (mêmes quêtes déjà relevées) ; la 06, une escorte.
    race: "orc",
    classe: "chasseur",
    lieu: "durotar",
    etapes: [
      "prendre:4641", "rendre:4641", "prendre:788", "prendre:9100001", "faire:788", "faire:9100001",
      "prendre:790", "faire:790", "rendre:790", "prendre:804", "rendre:788", "rendre:804", "prendre:789", "prendre:3087", "faire:3087",
      "rendre:9100001", "prendre:4402", "rendre:3087", "prendre:5441",
      "faire:4402", "faire:789", "faire:5441",
      "prendre:794", "faire:794", "rendre:794",
      "prendre:805", "rendre:805",
      "rendre:5441",
      "prendre:6394", "faire:6394", "rendre:6394",
      "prendre:2161", "faire:2161", "rendre:2161",
      "prendre:786", "prendre:817", "prendre:9100002", "prendre:808", "prendre:823", "prendre:826",
      "prendre:818",
    ],
    source: "Vidéos du 7 novembre 2026, orc chasseur (Jobwow) : Durotar, de la Vallée des Épreuves aux Îles de l'Écho. Ordre des vidéos 01 à 05 conservé.",
  },
  {
    // Même parcours pour les autres classes orques, sans le parchemin propre au chasseur (3087).
    race: "orc",
    classe: null,
    lieu: "durotar",
    etapes: [
      "prendre:4641", "rendre:4641", "prendre:788", "prendre:9100001", "faire:788", "faire:9100001",
      "prendre:790", "faire:790", "rendre:790", "prendre:804", "rendre:788", "rendre:804", "prendre:789",
      "rendre:9100001", "prendre:4402", "prendre:5441", "faire:4402", "faire:789", "faire:5441",
      "prendre:794", "faire:794", "rendre:794",
      "prendre:805", "rendre:805",
      "rendre:5441",
      "prendre:6394", "faire:6394", "rendre:6394",
      "prendre:2161", "faire:2161", "rendre:2161",
      "prendre:786", "prendre:817", "prendre:9100002", "prendre:808", "prendre:823", "prendre:826",
      "prendre:818",
    ],
    source: "Vidéos du 7 novembre 2026, orc chasseur (Jobwow), étapes communes à toutes les classes orques.",
  },
];
