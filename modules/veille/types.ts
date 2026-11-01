import type { SlugRubrique, Pilier } from "@/config/taxonomie";

export type Statut = "brouillon" | "publie" | "supprime";

export interface SourceCitee {
  nom: string;
  url: string;
  titre: string; // titre d'origine
  titreFr?: string; // titre traduit en français (absent sur les articles antérieurs)
  langue?: string; // code ISO de la page d'origine
}

export interface Article {
  id: number;
  slug: string;
  titre: string;
  chapo: string;
  corps: string; // Markdown
  avisSilfax: string;
  rubrique: SlugRubrique;
  etiquettes: string[];
  pilier: Pilier | null;
  description: string;
  accrocheFacebook: string;
  texteFacebook: string;
  sources: SourceCitee[];
  /** Image d'en-tête envoyée par Silfax (absente : visuel généré par le site). */
  image: { id: number; alt: string; credit: string } | null;
  /** Image propre au post Facebook (absente : l'image d'en-tête sert d'aperçu du lien). */
  imageFacebookId: number | null;
  statut: Statut;
  score: number | null;
  origine: "veille" | "manuel";
  creeLe: Date;
  modifieLe: Date;
  publieLe: Date | null;
  facebookPostId: string | null;
  facebookPublieLe: Date | null;
  facebookTentatives: number;
  facebookErreur: string | null;
}

/** Un élément brut lu dans un flux. */
export interface Element {
  sourceId: string;
  sourceNom: string;
  langue: string;
  poids: number;
  video: boolean;
  titre: string;
  url: string;
  resume: string;
  publieLe: Date;
}

/** Un sujet du jour : un ou plusieurs éléments qui parlent de la même chose. */
export interface Sujet {
  cle: string; // empreinte stable du sujet (URL de l'élément principal)
  titre: string;
  elements: Element[];
  score: number;
  detailScore: { sources: number; fraicheur: number; video: number; etranger: number };
}
