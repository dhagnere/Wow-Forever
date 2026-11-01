import { MOTS_DIESE, phraseAppel, RESEAUX, type Reseau } from "@/config/reseaux";
import { config } from "../config";
import type { Article } from "../types";

type Contenu = Pick<Article, "accrocheFacebook" | "texteFacebook" | "slug" | "titre">;

export function urlArticle(slug: string): string {
  return `${config.siteUrl()}/articles/${slug}/`;
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
 *  - Facebook : accroche, présentation, lien vers l'article, appel, mots-dièse.
 *  - Reel, Instagram, TikTok : liens non cliquables, on renvoie vers le site par son nom.
 *  - X : 280 caractères, texte de présentation raccourci si besoin, appel et lien gardés.
 */
export function texteReseau(reseau: Reseau, a: Contenu): string {
  const accroche = a.accrocheFacebook.trim() || a.titre;
  const presentation = a.texteFacebook.trim();
  const appel = phraseAppel();
  const diese = MOTS_DIESE.join(" ");
  const lien = urlArticle(a.slug);

  if (reseau === "facebook") {
    return [accroche, presentation, `La suite ici : ${lien}`, appel, diese].filter(Boolean).join("\n\n");
  }
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
