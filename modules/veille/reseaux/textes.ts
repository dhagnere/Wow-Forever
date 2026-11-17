import { MOTS_DIESE, pageFacebookAvecLien, phraseAppel, RESEAUX, type Reseau } from "@/config/reseaux";
import { config } from "../config";
import type { Article } from "../types";

type Contenu = Pick<Article, "accrocheFacebook" | "texteFacebook" | "slug" | "titre">;

export function urlArticle(slug: string): string {
  return `${config.siteUrl()}/articles/${slug}/`;
}

/**
 * Lien vers l'article marqué pour la mesure d'audience : le module statistiques compte ainsi les visites venues
 * de chaque réseau, article par article.
 */
export function lienSuivi(slug: string, source: "facebook" | "x"): string {
  return `${urlArticle(slug)}?utm_source=${source}&utm_medium=social&utm_campaign=veille`;
}

/** Longueur comptée par X : chaque lien vaut 23 caractères. */
export function longueurX(texte: string): number {
  return [...texte.replace(/https?:\/\/\S+/g, "x".repeat(23))].length;
}

function couper(texte: string, max: number): string {
  if (texte.length <= max) return texte;
  return `${texte.slice(0, max - 1).replace(/\s+\S*$/, "")}…`;
}

/**
 * Texte d'un post. Tous les réseaux reçoivent la même phrase d'appel à l'action.
 *  - Facebook (partage depuis un profil) : accroche, présentation, lien vers l'article, appel, mots-dièse.
 *  - Page Facebook : comme Facebook ; sans lien ni nom de domaine tant que FACEBOOK_LIENS n'est pas à « oui »
 *    (limite de Meta One), avec un renvoi vers le site par son nom.
 *  - Reel, Instagram, TikTok : liens non cliquables, on renvoie vers le site par son nom.
 *  - X : 280 caractères, texte de présentation raccourci si besoin, appel et lien gardés.
 */
export function texteReseau(reseau: Reseau, a: Contenu): string {
  const accroche = a.accrocheFacebook.trim() || a.titre;
  const presentation = a.texteFacebook.trim();
  const appel = phraseAppel();
  const diese = MOTS_DIESE.join(" ");

  if (reseau === "page-facebook" && !pageFacebookAvecLien()) {
    return [accroche, presentation, "📖 L'article complet est à la Taverne Éternelle : le lien est sur notre Page, bouton « Visiter le site ».", phraseAppel(false), diese]
      .filter(Boolean).join("\n\n");
  }
  if (reseau === "facebook" || reseau === "page-facebook") {
    return [accroche, presentation, `📖 Lire la suite à la Taverne : ${lienSuivi(a.slug, "facebook")}`, appel, diese].filter(Boolean).join("\n\n");
  }
  const lien = lienSuivi(a.slug, "x");
  if (reseau === "x") {
    const fixe = [accroche, "", lien, "", appel, diese];
    const base = fixe.join("\n");
    const place = RESEAUX.x.limite - longueurX(base) - 2;
    const extrait = presentation && place > 30 ? couper(presentation, place) : "";
    return [accroche, extrait, lien, appel, diese].filter(Boolean).join("\n\n");
  }
  // Reel, Instagram, TikTok : pas de lien cliquable dans la légende.
  const texte = [accroche, presentation, "Article complet sur le site (lien dans la bio).", appel, diese].filter(Boolean).join("\n\n");
  return couper(texte, RESEAUX[reseau].limite);
}

/** Clip vertical d'une vidéo du Journal, publié en Short YouTube ou en Reel Facebook (depuis le PC de Jobwow). */
export interface VideoCourte {
  titre: string;      // moment du clip (« Niveau 6 atteint »)
  accroche: string;   // réplique du personnage dans le clip, en guise d'accroche
  episode: string;    // titre YouTube de l'épisode complet
  nom: string;        // personnage des vidéos (« Jobwow », « Jobwow TheSham »…)
  motDiese: string;   // mot-dièse de sa série
}

/**
 * Texte d'un Short YouTube (titre et description) ou d'un Reel Facebook (légende). Même phrase d'appel que tous les
 * posts ; le Reel de la Page suit la règle de Meta One (sans nom de domaine tant que FACEBOOK_LIENS n'est pas à « oui »).
 * Aucun lien vers une source : le renvoi mène à la chaîne et au site.
 */
export function texteVideoCourte(format: "short" | "reel", v: VideoCourte): { titre: string | null; texte: string } {
  const accroche = v.accroche.trim() ? `« ${v.accroche.trim()} »` : "";
  const extrait = `Extrait de l'épisode « ${v.episode} », en entier sur la chaîne YouTube de la Taverne Éternelle.`;
  if (format === "short") {
    const diese = [...MOTS_DIESE, v.motDiese, "#Shorts"].join(" ");
    const titre = `${couper(`${v.titre} · ${v.nom}`, 100 - " #Shorts".length)} #Shorts`;
    return { titre, texte: couper([accroche, extrait, phraseAppel(), diese].filter(Boolean).join("\n\n"), 5000) };
  }
  const diese = [...MOTS_DIESE, v.motDiese, "#Reels"].join(" ");
  const appel = pageFacebookAvecLien() ? phraseAppel() : phraseAppel(false);
  return { titre: null, texte: couper([`${v.titre} · ${v.nom} 🎬`, accroche, extrait, appel, diese].filter(Boolean).join("\n\n"), RESEAUX.reel.limite) };
}
