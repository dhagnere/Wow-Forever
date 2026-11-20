/**
 * Dates clés de WoW Forever, affichées sur /calendrier/ et livrées dans le fichier d'agenda (.ics).
 * Une date non annoncée reste « null » : l'événement s'affiche sur la page mais n'entre pas dans l'agenda.
 * Mettre à jour au fil des annonces de Blizzard (et changer « majLe »).
 */

export interface Echeance {
  id: string;
  titre: string;
  /** Début, en heure de Paris (« 2026-11-05T00:00 ») ou journée entière (« 2026-12-09 »). null : pas de date annoncée. */
  debut: string | null;
  /** Période affichée quand la date exacte n'est pas connue. */
  periode?: string;
  description: string;
  /** Page du site qui détaille l'événement. */
  lien: string;
  /** Version anglaise (/en/calendar/ et agenda anglais) : mêmes faits, à reporter à chaque changement. */
  en: { titre: string; description: string; periode?: string };
}

export const MAJ_CALENDRIER = "2026-11-20";

export const ECHEANCES: Echeance[] = [
  {
    id: "sortie",
    titre: "Sortie de WoW Forever",
    debut: "2026-11-05T00:00",
    description: "Ouverture des serveurs le 4 novembre à 15 h, heure du Pacifique : minuit à Paris, dans la nuit du 4 au 5. Niveau maximal 60.",
    lien: "/guides/bien-demarrer/",
    en: { titre: "WoW Forever launch", description: "Realms open on 4 November at 3 pm Pacific time: midnight in Paris, in the night from 4 to 5 November. Level cap 60." },
  },
  {
    id: "raids",
    titre: "Ouverture des premiers raids",
    debut: "2026-12-09",
    description: "Trois raids ouvrent au niveau 60 : les profondeurs des Saisons (10 joueurs, 8 boss), le sommet d'Hyjal (20 joueurs, 13 boss) et le repaire d'Onyxia (40 joueurs). Pour entrer au repaire d'Onyxia, chacun doit avoir l'amulette drakefeu dans son sac. Les guides paraissent avant l'ouverture.",
    lien: "/donjons/#raids",
    en: { titre: "First raids open", description: "Three level 60 raids open: Barrow Deeps (10 players, 8 bosses), Hyjal Summit (20 players, 13 bosses) and Onyxia's Lair (40 players). To enter Onyxia's Lair, every raid member needs the Drakefire Amulet in their bags. Guides are published before the opening." },
  },
  {
    id: "hardcore",
    titre: "Mode Hardcore",
    debut: null,
    periode: "Hiver 2026-2027",
    description: "Annoncé pour l'hiver d'après la feuille de route, sans date précise, sur des royaumes Hardcore officiels, à part des autres. La date sera ajoutée ici et dans l'agenda dès son annonce.",
    lien: "/actualites/",
    en: { titre: "Hardcore mode", periode: "Winter 2026-2027", description: "Announced for the winter according to the roadmap, without a precise date, on official Hardcore realms separate from the others. The date will be added here and to the calendar as soon as it is announced." },
  },
  {
    id: "printemps-2027",
    titre: "Mise à jour du printemps 2027",
    debut: null,
    periode: "Printemps 2027",
    description: "Deux nouveaux raids (10 et 20 joueurs), deux donjons, de nouvelles quêtes et une nouvelle zone, une chaîne de quêtes légendaire et une nouvelle saison JcJ, d'après la feuille de route. Pas encore de date.",
    lien: "/actualites/",
    en: { titre: "Spring 2027 update", periode: "Spring 2027", description: "Two new raids (10 and 20 players), two dungeons, new quests and a new zone, a legendary questline and a new PvP season, according to the roadmap. No date yet." },
  },
  {
    id: "ete-2027",
    titre: "Mise à jour de l'été 2027",
    debut: null,
    periode: "Été 2027",
    description: "Un raid emblématique remanié, un nouveau raid, du contenu dans le monde, deux donjons, une nouvelle saison JcJ et des mises à jour des métiers et du système d'héritage, d'après la feuille de route. Pas encore de date.",
    lien: "/actualites/",
    en: { titre: "Summer 2027 update", periode: "Summer 2027", description: "A revamped iconic raid, a new raid, more world content, two dungeons, a new PvP season and updates to professions and the Legacy system, according to the roadmap. No date yet." },
  },
];
