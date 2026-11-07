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
    classe: "chasseur",
    lieu: "durotar",
    etapes: [
      // Vidéo 1 (3 min 10 s)
      "prendre:4641", // Votre place en ce monde, auprès de Kaltunk (0:05)
      "rendre:4641", // à Gornek, dans l'Antre (1:00)
      "prendre:788", // La dent tranchante, Gornek (1:05)
      "prendre:9100001", // Armes égarées, Gornek (2:35)
      // Vidéo 2 (27 min)
      "faire:788", // sangliers tachetés, en même temps que les armes (0:00 à 7:30)
      "faire:9100001", // armes d'entraînement, carte à 44,1 – 66,6 (0:20)
      "prendre:790", // Sarkoth, auprès de Hana'zua (vers 7:40)
      "faire:790", // Sarkoth vaincu, pince rapportée (vers 9:30)
      "rendre:790", // à Hana'zua (vers 10:00)
      "prendre:804", // Sarkoth, suite : rapporter la pince à Gornek
      "rendre:788", // dans l'Antre (vers 11:00)
      "rendre:804",
      "prendre:789", // L'aiguillon du scorpide, Gornek
      "prendre:3087", // Parchemin gravé (chasseur), Gornek
      "faire:3087",
      "rendre:9100001", // Armes égarées rendue dans l'Antre (vers 12:00)
      "prendre:4402", // Surprise aux pommes de cactus de Galgar, à la sortie de l'Antre
      "rendre:3087", // à Jen'shan
      "prendre:5441", // Les péons paresseux, Contremaître Thazz'ril
      "faire:4402", // pommes de cactus, queues de scorpides et péons, ensemble (13:00 à la fin)
      "faire:789",
      "faire:5441",
    ],
    source: "Vidéos du 6 novembre 2026, chasseur orc (« valles des épreuves HORDE HUNTER » 1 et 2), jouées sans guide commercial ; la vidéo 3-1 n'est pas retenue (Zygor chargé).",
  },
  {
    // Même partie, pour les autres classes orques : sans le parchemin propre au chasseur.
    race: "orc",
    classe: null,
    lieu: "durotar",
    etapes: [
      "prendre:4641", "rendre:4641", "prendre:788", "prendre:9100001", "faire:788", "faire:9100001",
      "prendre:790", "faire:790", "rendre:790", "prendre:804", "rendre:788", "rendre:804", "prendre:789",
      "rendre:9100001", "prendre:4402", "prendre:5441", "faire:4402", "faire:789", "faire:5441",
    ],
    source: "Vidéos du 6 novembre 2026, chasseur orc (1 et 2), étapes communes à toutes les classes.",
  },
  {
    // Troll chasseur, vidéos 01 à 05 du 7 novembre 2026 (ordre des vidéos conservé) : Vallée des Épreuves, puis Sen'jin
    // et Îles de l'Écho. La vidéo 07 est une seconde prise de la Vallée (mêmes quêtes déjà relevées) ; la 06, un dialogue.
    race: "troll",
    classe: "chasseur",
    lieu: "durotar",
    etapes: [
      "prendre:4641", "rendre:4641", "prendre:788", "prendre:9100001", "faire:788", "faire:9100001",
      "prendre:790", "faire:790", "rendre:790", "prendre:804", "rendre:788", "rendre:804", "prendre:789", "prendre:3082", "faire:3082",
      "rendre:9100001", "prendre:4402", "rendre:3082", "prendre:5441",
      "faire:4402", "faire:789", "faire:5441",
      "prendre:794", "faire:794", "rendre:794",
      "prendre:805", "rendre:805",
      "rendre:5441",
      "prendre:6394", "faire:6394", "rendre:6394",
      "prendre:2161", "faire:2161", "rendre:2161",
      "prendre:786", "prendre:817", "prendre:9100002", "prendre:808", "prendre:823", "prendre:826",
      "prendre:818",
    ],
    source: "Vidéos du 7 novembre 2026, troll chasseur (Jobwow) : Durotar, de la Vallée des Épreuves aux Îles de l'Écho. Ordre des vidéos 01 à 05 conservé.",
  },
  {
    // Même parcours pour les autres classes trolls, sans le parchemin propre au chasseur (3087).
    race: "troll",
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
    source: "Vidéos du 7 novembre 2026, troll chasseur (Jobwow), étapes communes à toutes les classes trolls.",
  },
];
