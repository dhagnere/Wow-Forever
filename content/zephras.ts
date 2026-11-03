/**
 * Quêtes de l'île de Zéphras, à saisir à la main : les fichiers du jeu n'en donnent ni le titre, ni le donneur, ni la
 * position (seuls les lieux de l'île y figurent, voir content/zephras-jeu.ts). Liste vide tant que rien n'est relevé en jeu :
 * le guide Skyborne affiche alors l'île et ses lieux, avec un message, puis enchaîne sur la route de la faction.
 *
 * Comment remplir, au fil du jeu (une quête par entrée, dans n'importe quel ordre : le guide calcule l'ordre lui-même) :
 *  - id : 9000001, 9000002… (unique, jamais réutilisé : il sert à sauvegarder la progression des joueurs) ;
 *  - positions x et y : les coordonnées affichées en jeu sur la carte de l'île (0 à 100), par exemple 41.2 et 23.3 ;
 *  - objectifs : rédigés avec nos mots (« Vaincre 8 × Criailleuse », « Rapporter 5 × Plume de vent »), jamais le texte du jeu ;
 *  - faction : "alliance" (ordre des savants), "horde" (ordre des vents) ou null pour les deux ;
 *  - classes : slugs des classes concernées (« mage »…), seulement pour une quête de classe ;
 *  - avant : id de la quête à rendre avant de pouvoir prendre celle-ci.
 */

export interface QueteZephras {
  id: number;
  titre: string;
  niveau: number;
  /** Niveau minimal pour prendre la quête (par défaut : niveau − 2). */
  min?: number;
  donneur: { nom: string; x: number; y: number };
  objectifs: string[];
  /** Où se trouvent les monstres ou objets des objectifs (quelques points suffisent). */
  cibles?: [number, number][];
  /** À qui rendre la quête ; par défaut, au donneur. */
  rendre?: { nom: string; x: number; y: number };
  faction: "alliance" | "horde" | null;
  classes?: string[];
  avant?: number;
  groupe?: boolean;
}

export const QUETES_ZEPHRAS: QueteZephras[] = [];

/** Niveaux de l'île : [À confirmer] au lancement (null tant que ce n'est pas relevé en jeu). */
export const NIVEAUX_ZEPHRAS: [number, number] | null = null;

/** Où mène la route en quittant l'île, pour chaque faction : [À confirmer] au lancement. */
export const SORTIE_ZEPHRAS: Record<"alliance" | "horde", string | null> = { alliance: null, horde: null };
