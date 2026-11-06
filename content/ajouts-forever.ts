/**
 * Quêtes ajoutées par Forever dans l'Azeroth d'origine, à saisir à la main : les bases libres (CMaNGOS, AzerothCore) ne les
 * connaissent pas, et les fichiers du jeu n'en donnent que le numéro, sans titre, donneur ni objectif. Elles sont relevées
 * en jeu, sur des parties jouées sans guide commercial (jamais d'après Zygor, Wowhead ou un autre guide), puis insérées par
 * lib/guide.ts dans la zone indiquée ; le guide calcule lui-même leur place dans l'ordre de passage.
 *
 * Comment remplir (une quête par entrée) :
 *  - id : 9100001, 9100002… (unique, jamais réutilisé : il sert à sauvegarder la progression des joueurs) ;
 *  - lieu : slug de la carte de la zone (« durotar », « clairieres-de-tirisfal »…) ;
 *  - positions x et y : coordonnées en jeu sur la carte de la zone (0 à 100) ;
 *  - objectifs : rédigés avec nos mots (« Rapporter 6 × … », « Vaincre 10 × … »), jamais le texte du jeu ;
 *  - cibles : quelques points où se trouvent les monstres ou objets ; sans cibles, l'objectif est marqué « à relever » et le
 *    guide le compte comme fait dès la prise (comme une lettre à remettre) ;
 *  - faction : "alliance", "horde" ou null ; classes : slugs, seulement pour une quête de classe ;
 *  - avant : id de la quête à rendre avant de pouvoir prendre celle-ci ;
 *  - en : titre et objectifs anglais quand on les connaît (sinon le français s'affiche, signalé) ;
 *  - source : la vidéo ou la partie où la quête a été vue, pour la retrouver.
 */

export interface QueteForever {
  id: number;
  lieu: string;
  titre: string;
  /** Niveau de la quête ; à défaut, celui auquel elle a été prise en jeu. */
  niveau: number;
  min?: number;
  donneur: { nom: string; x: number; y: number };
  objectifs: string[];
  cibles?: [number, number][];
  /** À qui rendre la quête ; par défaut, au donneur. */
  rendre?: { nom: string; x: number; y: number };
  faction: "alliance" | "horde" | null;
  classes?: string[];
  avant?: number;
  groupe?: boolean;
  en?: { titre: string; objectifs?: string[] };
  source: string;
}

export const QUETES_FOREVER: QueteForever[] = [
  {
    id: 9100001,
    lieu: "durotar",
    titre: "Armes égarées",
    niveau: 1,
    min: 1,
    // Gornek et Kzan Tranchecorne sont dans l'Antre : position de Gornek d'après les bases libres.
    donneur: { nom: "Gornek", x: 42.1, y: 68.3 },
    objectifs: ["Rapporter 6 × Arme d'entraînement abandonnée"],
    rendre: { nom: "Kzan Tranchecorne", x: 42.1, y: 68.3 },
    faction: "horde",
    // Proposée par Gornek après le rendu de « Votre place en ce monde » (vidéo) ; à confirmer si elle l'est aussi avant.
    avant: 4641,
    source: "Vidéo du 6 novembre 2026 (chasseur orc, 2:35 et 2:50) : prise auprès de Gornek après « Votre place en ce monde » ; armes au pied des cactus de la vallée, coordonnées à relever.",
  },
];

/** Repère affiché quand l'emplacement des cibles n'a pas encore été relevé en jeu. */
export const SECTEUR_A_RELEVER = { fr: "[secteur à relever en jeu]", en: "[area to be recorded in game]" } as const;
export const TITRE_EN_A_CONFIRMER = "[English name to be confirmed]";
