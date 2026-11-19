/**
 * Personnages des vidéos du Journal (depuis le 17/11/2026, demandé par Jobwow) : chaque narration porte le sien
 * (`profil`), choisi par `npm run carnet -- --personnage <id>` ou d'après le nom du personnage joué noté par la sonde
 * (`nomsEnJeu`). Le personnage décide des répliques, du nom affiché, du titre de la série et de la façon d'apparaître :
 * - « medaillon » : portrait rond en bas à gauche pendant toute la vidéo (Jobwow le tavernier) ;
 * - « evenements » : buste détouré qui surgit du bas de l'image à chaque moment fort, avec une bulle façon bande
 *   dessinée, puis repart (Jobwow TheSham, chaman orc).
 */
import {
  REPLIQUES, REPLIQUES_CAPACITE, REPLIQUES_MORT_REPETEE, REPLIQUES_PALIERS, type GenreMoment,
} from "@/content/repliques-jobwow";
import {
  REPLIQUES_CAPACITE_THESHAM, REPLIQUES_MORT_REPETEE_THESHAM, REPLIQUES_PALIERS_THESHAM, REPLIQUES_THESHAM,
} from "@/content/repliques-thesham";

export interface JeuRepliques {
  parGenre: Record<GenreMoment, string[]>;
  paliers: Record<number, string[]>;
  capacite: string[];
  mortRepetee: string[];
}

export interface PersonnageVideo {
  id: string;
  nom: string;                         // nom affiché (cartouche, appel à s'abonner)
  serie: string;                       // titre de la série : titres YouTube, sous-titre d'ouverture
  presentation: string;                // début de la description YouTube
  motDiese: string;                    // mot-dièse de la série
  avatar: string;                      // image, relative à la racine du dépôt
  apparition: "medaillon" | "evenements";
  /** Rangement (demandé le 18/11/2026) : sous-dossier de D:\WOW et début de tous ses noms de fichiers ; rendu `<base>.<id>.mp4`. */
  dossier: string;
  prefixe: string;
  /** Noms du personnage en jeu (sonde, sans le royaume) qui le choisissent d'office ; casse, espaces et accents ignorés. */
  nomsEnJeu: string[];
  repliques: JeuRepliques;
  /**
   * Voix des bulles (npm run carnet:voix) : enregistrement de référence (sinon celui de Jobwow), voix abaissée de
   * quelques demi-tons (même durée), intensité de Chatterbox. Ce qui est donné sur la ligne de commande l'emporte.
   */
  voix?: { reference?: string; grave?: number; exaggeration?: number };
  /** Bulle façon bande dessinée : cri écrit sur un cartouche au-dessus de la bulle, selon le moment. */
  onomatopees?: Record<GenreMoment, string>;
}

export const PERSONNAGES: Record<string, PersonnageVideo> = {
  jobwow: {
    id: "jobwow",
    nom: "Jobwow",
    serie: "Journal de Jobwow",
    presentation: "Le Journal de Jobwow, tavernier mort-vivant, sur WoW Forever",
    motDiese: "#JournalDeJobwow",
    avatar: "public/images/jobwow-512.png",
    apparition: "medaillon",
    dossier: "Journal de Jobwow",
    prefixe: "journal-jobwow",
    nomsEnJeu: ["Jobwow"],
    repliques: { parGenre: REPLIQUES, paliers: REPLIQUES_PALIERS, capacite: REPLIQUES_CAPACITE, mortRepetee: REPLIQUES_MORT_REPETEE },
  },
  thesham: {
    id: "thesham",
    nom: "Jobwow TheSham",
    serie: "Journal de Jobwow TheSham",
    presentation: "Le Journal de Jobwow TheSham, chaman orc, sur WoW Forever",
    motDiese: "#JobwowTheSham",
    avatar: "visuels/avatars/thesham.png",
    apparition: "evenements",
    dossier: "Journal de Jobwow TheSham",
    prefixe: "journal-thesham",
    nomsEnJeu: ["Jobwow TheSham"],     // nom donné par Jobwow le 17/11/2026 (en jeu sans espace : « Jobwowthesham »)
    repliques: {
      parGenre: REPLIQUES_THESHAM, paliers: REPLIQUES_PALIERS_THESHAM,
      capacite: REPLIQUES_CAPACITE_THESHAM, mortRepetee: REPLIQUES_MORT_REPETEE_THESHAM,
    },
    // voix d'orc : celle de Jobwow abaissée de trois demi-tons, plus appuyée (à valider par Jobwow à l'écoute)
    voix: { grave: 3, exaggeration: 0.85 },
    onomatopees: {
      intro: "Jobwow TheSham !", zone: "En route !", niveau: "Niveau !", mort: "Argh !", exploit: "Boum !",
      entraineur: "Les esprits parlent !", grimoire: "Grimoire !", quete: "Quête !", trajet: "Larguez les amarres !",
      vol: "Envol !", marqueur: "Noté !",
      hecatombe: "Encore ?!", malchance: "Aïe !", temeraire: "Lok'tar !", jackpot: "Kaching !", rafale: "Et hop !",
      demitour: "Pouf !", attente: "Zzz…", egare: "Hein ?",
    },
  },
};

export const PERSONNAGE_PAR_DEFAUT = "jobwow";

/** Le personnage d'une narration (id inconnu ou absent : Jobwow). */
export const personnageVideo = (id?: string | null): PersonnageVideo => PERSONNAGES[id ?? ""] ?? PERSONNAGES[PERSONNAGE_PAR_DEFAUT];

/** Le personnage d'après le nom joué noté par la sonde (« Nom-Royaume ») ; null si aucun ne le revendique. */
// WoW n'accepte ni espace ni tiret dans un nom : « Jobwow TheSham » se lit « Jobwowthesham » en jeu
const simplifier = (t: string) => t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[\s'’_]/g, "").toLowerCase();

export function personnageDuJeu(nomEnJeu?: string | null): PersonnageVideo | null {
  const nom = simplifier((nomEnJeu ?? "").split("-")[0]);
  if (!nom) return null;
  return Object.values(PERSONNAGES).find((p) => p.nomsEnJeu.some((x) => simplifier(x) === nom)) ?? null;
}

/** Le personnage d'un fichier d'après le début de son nom (« journal-thesham_2026-11-18_p2.narration.json ») ; null sinon. */
export function personnageDuNom(nom: string): PersonnageVideo | null {
  const b = nom.replace(/^.*[\\/]/, "").toLowerCase();
  return Object.values(PERSONNAGES).sort((a, z) => z.prefixe.length - a.prefixe.length)
    .find((p) => b.startsWith(`${p.prefixe.toLowerCase()}_`)) ?? null;
}
