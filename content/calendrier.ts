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
}

export const MAJ_CALENDRIER = "2026-11-03";

export const ECHEANCES: Echeance[] = [
  {
    id: "sortie",
    titre: "Sortie de WoW Forever",
    debut: "2026-11-05T00:00",
    description: "Ouverture des serveurs le 4 novembre à 15 h, heure du Pacifique : minuit à Paris, dans la nuit du 4 au 5. Niveau maximal 60.",
    lien: "/guides/bien-demarrer/",
  },
  {
    id: "raids",
    titre: "Ouverture des premiers raids",
    debut: "2026-12-09",
    description: "Les premiers raids à 10 et 20 joueurs ouvrent, dont le raid du Mont Hyjal. Les guides paraissent avant l'ouverture.",
    lien: "/donjons/#raids",
  },
  {
    id: "hardcore",
    titre: "Mode Hardcore",
    debut: null,
    periode: "Hiver 2026-2027",
    description: "Annoncé pour l'hiver, sans date précise. La date sera ajoutée ici et dans l'agenda dès son annonce.",
    lien: "/actualites/",
  },
  {
    id: "ete-2027",
    titre: "Nouveaux contenus",
    debut: null,
    periode: "Été 2027",
    description: "Blizzard annonce de nouveaux contenus pour l'été 2027, sans date ni détail pour l'instant.",
    lien: "/actualites/",
  },
];
