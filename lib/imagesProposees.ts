import { ECRANS, type SlugEcran } from "@/config/ecrans";
import { CARTES_JEU } from "@/content/cartes-jeu";
import { CLASSES } from "@/content/classes";
import { ECRAN_CLASSE, ecranArticle, nomEcran } from "./ecrans";
import { carte } from "./cartes";

/**
 * Images d'en-tête proposées pour un brouillon, choisies parmi les illustrations du jeu que le site possède déjà :
 * écrans de chargement (npm run ecrans:jeu) et cartes du monde (npm run cartes:jeu), lus dans les fichiers de WoW Forever.
 * Aucune image n'est prise sur un autre site (garde-fou « Droit d'auteur ») : la proposition est faite dans l'éditeur,
 * Jobwow la garde ou non, et elle passe comme un envoi par la case de déclaration et par enregistrerImage.
 */

export interface ImageProposee {
  /** « ecran:<slug> » ou « carte:<slug> » : la seule valeur que renvoie le formulaire. */
  cle: string;
  type: "ecran" | "carte";
  slug: string;
  nom: string;
  /** Aperçu (adresse publique) et fichier lu à l'enregistrement (chemin dans public/). */
  apercu: string;
  fichier: string;
  alt: string;
  credit: string;
  raison: string;
}

const normaliser = (t: string) => ` ${t.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "").replace(/[’']/g, " ").replace(/[^a-z0-9]+/g, " ").trim()} `;
/** Nom cherché dans le texte, sans article de tête (« Les Mortemines » → « mortemines »). */
const motif = (nom: string) => normaliser(nom.replace(/\(.*?\)/g, "")).replace(/^ (les?|la|l) /, " ");

const ECRAN = (slug: SlugEcran, raison: string): ImageProposee => ({
  cle: `ecran:${slug}`, type: "ecran", slug, nom: nomEcran(slug),
  apercu: `/images/jeu/ecrans/${slug}-800.jpg`, fichier: `images/jeu/ecrans/${slug}-1600.jpg`,
  alt: `Écran de chargement de WoW Forever : ${nomEcran(slug)}`, credit: "Écran de chargement du jeu · © Blizzard Entertainment", raison,
});
const CARTE = (slug: string, raison: string): ImageProposee => ({
  cle: `carte:${slug}`, type: "carte", slug, nom: carte(slug)?.nom ?? slug,
  apercu: `/images/jeu/cartes/${slug}-500.jpg`, fichier: `images/jeu/cartes/${slug}-1000.jpg`,
  alt: `Carte de WoW Forever : ${carte(slug)?.nom ?? slug}`, credit: "Carte du jeu · © Blizzard Entertainment", raison,
});

/** Retrouve l'image proposée d'après la valeur du formulaire, seulement parmi les illustrations connues (pas de chemin libre). */
export function imageProposeeDepuisCle(cle: string): ImageProposee | null {
  const [type, slug] = cle.split(":");
  if (type === "ecran" && ECRANS.some((e) => e.slug === slug)) return ECRAN(slug as SlugEcran, "");
  if (type === "carte" && CARTES_JEU[slug]) return CARTE(slug, "");
  return null;
}

/** Jusqu'à `nombre` images, les plus proches du sujet d'abord (lieux et donjons cités, classe, page de référence, rubrique). */
export function proposerImages(
  a: { titre: string; chapo: string; corps: string; etiquettes: string[]; pilier: string | null; rubrique: string },
  nombre = 4,
): ImageProposee[] {
  const texte = normaliser([a.titre, a.titre, a.chapo, a.etiquettes.join(" "), a.corps].join(" "));
  const titre = normaliser(a.titre);
  const scores = new Map<string, { image: ImageProposee; score: number }>();
  const ajouter = (image: ImageProposee, score: number) => {
    const avant = scores.get(image.cle);
    if (!avant || avant.score < score) scores.set(image.cle, { image, score: score + (avant ? 0.5 : 0) });
  };
  for (const e of ECRANS) {
    const m = motif(e.nom);
    if (m.trim().length >= 4 && texte.includes(m)) ajouter(ECRAN(e.slug as SlugEcran, `« ${e.nom} » cité dans l'article`), titre.includes(m) ? 6 : 4);
  }
  for (const [slug, c] of Object.entries(CARTES_JEU)) {
    const m = motif(c.nom);
    if (m.trim().length >= 4 && texte.includes(m)) ajouter(CARTE(slug, `« ${c.nom} » cité dans l'article`), titre.includes(m) ? 5 : 3);
  }
  for (const c of CLASSES) {
    const m = motif(c.nom);
    if (texte.includes(m) && ECRAN_CLASSE[c.slug]) ajouter(ECRAN(ECRAN_CLASSE[c.slug], `lieu emblématique du ${c.nom.toLowerCase()}`), titre.includes(m) ? 3 : 1.5);
  }
  ajouter(ECRAN(ecranArticle(a), a.pilier ? "page de référence de l'article" : "rubrique de l'article"), 2);
  return [...scores.values()].sort((x, y) => y.score - x.score).slice(0, nombre).map((s) => s.image);
}
