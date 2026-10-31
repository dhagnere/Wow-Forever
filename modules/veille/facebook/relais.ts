import { MOTS_DIESE_FACEBOOK } from "@/config/taxonomie";
import { config } from "../config";
import type { Article } from "../types";
import * as depot from "../articles/depot";

export const MAX_PAR_HEURE = 3;

/** Heure courante à Paris (0-23). */
export function heureParis(d = new Date()): number {
  const parties = new Intl.DateTimeFormat("en-GB", { hour: "numeric", hourCycle: "h23", timeZone: "Europe/Paris" }).formatToParts(d);
  return Number(parties.find((p) => p.type === "hour")?.value);
}

/** Fenêtre de publication : de 8h à 22h, heure de Paris. */
export function dansLaPlageHoraire(d = new Date()): boolean {
  const h = heureParis(d);
  return h >= 8 && h < 22;
}

export function urlArticle(slug: string): string {
  return `${config.siteUrl()}/articles/${slug}/`;
}

/** Texte du post : accroche, présentation, lien vers le site (jamais vers la source), mots-dièse. */
export function messageFacebook(a: Pick<Article, "accrocheFacebook" | "texteFacebook" | "slug" | "titre">): string {
  const accroche = a.accrocheFacebook.trim() || a.titre;
  return [accroche, a.texteFacebook.trim(), `La suite ici : ${urlArticle(a.slug)}`, MOTS_DIESE_FACEBOOK]
    .filter(Boolean)
    .join("\n\n");
}

async function publierSurPage(a: Article): Promise<string> {
  const fb = config.facebook();
  if (!fb) throw new Error("FACEBOOK_PAGE_ID ou FACEBOOK_PAGE_TOKEN manquant.");
  const corps = new URLSearchParams({ message: messageFacebook(a), link: urlArticle(a.slug), access_token: fb.jeton });
  const r = await fetch(`https://graph.facebook.com/${fb.version}/${fb.pageId}/feed`, {
    method: "POST",
    body: corps,
    signal: AbortSignal.timeout(20_000),
  });
  const json = (await r.json().catch(() => ({}))) as { id?: string; error?: { message?: string } };
  if (!r.ok || !json.id) throw new Error(json.error?.message ?? `HTTP ${r.status}`);
  return json.id;
}

export interface BilanRelais {
  statut: "hors-plage" | "non-configure" | "quota-atteint" | "termine";
  publies: string[];
  echecs: { slug: string; erreur: string }[];
}

export async function relayer(maintenant = new Date()): Promise<BilanRelais> {
  const bilan: BilanRelais = { statut: "termine", publies: [], echecs: [] };
  if (!config.facebook()) return { ...bilan, statut: "non-configure" };
  if (!dansLaPlageHoraire(maintenant)) return { ...bilan, statut: "hors-plage" };

  const restant = MAX_PAR_HEURE - (await depot.relaisFacebookCetteHeure());
  if (restant <= 0) return { ...bilan, statut: "quota-atteint" };

  for (const a of await depot.enAttenteFacebook(restant)) {
    try {
      const postId = await publierSurPage(a);
      await depot.relaisFacebookReussi(a.id, postId);
      bilan.publies.push(a.slug);
    } catch (e) {
      const erreur = e instanceof Error ? e.message : String(e);
      await depot.relaisFacebookEchoue(a.id, erreur);
      bilan.echecs.push({ slug: a.slug, erreur });
    }
  }
  return bilan;
}
