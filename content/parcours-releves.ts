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
    // Orc chasseur, vidéos 01 à 09 du 7 novembre 2026 (ordre des vidéos conservé) : Vallée des Épreuves → Sen'jin →
    // Îles de l'Écho → Tranchecolline. La vidéo 07 est une reprise de la Vallée (quêtes déjà rendues) ; la 06, une escorte.
    race: "orc",
    classe: "chasseur",
    lieu: "durotar",
    etapes: [
      // Vallée des Épreuves (niveaux 1-5) — vidéos 01, 03
      "prendre:4641", "rendre:4641", "prendre:788", "prendre:9100001", "faire:788", "faire:9100001",
      "prendre:790", "faire:790", "rendre:790", "prendre:804", "rendre:788", "rendre:804", "prendre:789", "prendre:3087", "faire:3087",
      "rendre:9100001", "prendre:4402", "rendre:3087", "prendre:5441",
      "faire:4402", "faire:789", "faire:5441",
      "prendre:9100003", // Les vils quasits (792) — vidéo 03
      "prendre:794", "faire:794", "rendre:794",
      "prendre:805", "rendre:805",
      "rendre:5441",
      "prendre:6394", "faire:6394", "rendre:6394",
      "prendre:2161", "faire:2161", "rendre:2161",
      // Sen'jin (niveaux 5-6) — vidéo 02
      "prendre:9100011", "prendre:786", "prendre:817", "prendre:9100002", "prendre:808", "prendre:823", "prendre:826", "prendre:9100005",
      // Îles de l'Écho (niveaux 6-8) — vidéos 04, 05
      "prendre:818", "prendre:9100004", "prendre:9100009", "prendre:9100010", "prendre:9100006",
      // Camping + Tranchecolline (niveaux 6-9) — vidéos 08, 09
      "prendre:9100012", "prendre:9100013", "prendre:784", "prendre:9100007", "prendre:815", "prendre:9100008",
    ],
    source: "Vidéos du 7 novembre 2026, orc chasseur (Jobwow) : Durotar, de la Vallée des Épreuves à Tranchecolline. Ordre des vidéos 01 à 09 conservé.",
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
      "prendre:9100003",
      "prendre:794", "faire:794", "rendre:794",
      "prendre:805", "rendre:805",
      "rendre:5441",
      "prendre:6394", "faire:6394", "rendre:6394",
      "prendre:2161", "faire:2161", "rendre:2161",
      "prendre:9100011", "prendre:786", "prendre:817", "prendre:9100002", "prendre:808", "prendre:823", "prendre:826", "prendre:9100005",
      "prendre:818", "prendre:9100004", "prendre:9100009", "prendre:9100010", "prendre:9100006",
      "prendre:9100012", "prendre:9100013", "prendre:784", "prendre:9100007", "prendre:815", "prendre:9100008",
    ],
    source: "Vidéos du 7 novembre 2026, orc chasseur (Jobwow), étapes communes à toutes les classes orques.",
  },
];
