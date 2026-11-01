import { config } from "../config";
import { texteReseau, urlArticle } from "../reseaux/textes";
import { obtenirVideo } from "../reels/stockage";
import { publierReelInstagram } from "../reseaux/instagram";
import { etatTiktok, publierTiktok } from "../reseaux/tiktok";
import { publierReel } from "../reels/publication";
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

export { urlArticle } from "../reseaux/textes";

/** Texte du post Facebook : accroche, présentation, lien vers le site (jamais vers la source), phrase d'appel, mots-dièse. */
export function messageFacebook(a: Pick<Article, "accrocheFacebook" | "texteFacebook" | "slug" | "titre">): string {
  return texteReseau("facebook", a);
}

export function urlMedia(id: number, variante: "une" | "og" = "une"): string {
  return `${config.siteUrl()}/medias/${id}/${variante === "og" ? "og/" : ""}`;
}

/**
 * Forme du post :
 *  - image Facebook fournie : post photo (l'image en grand, le lien vers l'article dans le texte) ;
 *  - sinon : post lien, dont Facebook tire l'aperçu des balises Open Graph de l'article
 *    (image d'en-tête recadrée, ou image générée par le site).
 */
export function requeteFacebook(a: Pick<Article, "accrocheFacebook" | "texteFacebook" | "slug" | "titre" | "imageFacebookId">): {
  chemin: "photos" | "feed";
  params: Record<string, string>;
} {
  const message = messageFacebook(a);
  if (a.imageFacebookId) return { chemin: "photos", params: { url: urlMedia(a.imageFacebookId), message } };
  return { chemin: "feed", params: { message, link: urlArticle(a.slug) } };
}

async function publierSurPage(a: Article): Promise<string> {
  const fb = config.facebook();
  if (!fb) throw new Error("FACEBOOK_PAGE_ID ou FACEBOOK_PAGE_TOKEN manquant.");
  const { chemin, params } = requeteFacebook(a);
  const r = await fetch(`https://graph.facebook.com/${fb.version}/${fb.pageId}/${chemin}`, {
    method: "POST",
    body: new URLSearchParams({ ...params, access_token: fb.jeton }),
    signal: AbortSignal.timeout(30_000),
  });
  const json = (await r.json().catch(() => ({}))) as { id?: string; post_id?: string; error?: { message?: string } };
  const postId = json.post_id ?? json.id;
  if (!r.ok || !postId) throw new Error(json.error?.message ?? `HTTP ${r.status}`);
  return postId;
}

export interface BilanRelais {
  statut: "hors-plage" | "non-configure" | "quota-atteint" | "termine";
  publies: string[];
  echecs: { slug: string; erreur: string }[];
  reels: string[];
  echecsReels: { slug: string; erreur: string }[];
  instagram: string[];
  tiktok: string[];
  echecsReseaux: { reseau: string; slug: string; erreur: string }[];
}

/** Instagram puis TikTok : chacun son quota de 3 publications par heure, mêmes articles, même phrase d'appel. */
async function relayerReseaux(bilan: BilanRelais): Promise<void> {
  if (config.instagram()) {
    const restant = MAX_PAR_HEURE - (await depot.relaisCetteHeure("instagram"));
    for (const a of restant > 0 ? await depot.aRelayer("instagram", restant) : []) {
      try {
        await obtenirVideo(a); // Instagram télécharge la vidéo à son adresse publique : elle doit exister.
        const id = await publierReelInstagram(`${config.siteUrl()}/articles/${a.slug}/video/`, texteReseau("instagram", a));
        await depot.relaiReussi("instagram", a.id, id);
        bilan.instagram.push(a.slug);
      } catch (e) {
        const erreur = e instanceof Error ? e.message : String(e);
        await depot.relaiEchoue("instagram", a.id, erreur);
        bilan.echecsReseaux.push({ reseau: "instagram", slug: a.slug, erreur });
      }
    }
  }
  if (config.tiktok()) {
    const restant = MAX_PAR_HEURE - (await depot.relaisCetteHeure("tiktok"));
    for (const a of restant > 0 ? await depot.aRelayer("tiktok", restant) : []) {
      try {
        const { publishId } = await publierTiktok(await obtenirVideo(a), texteReseau("tiktok", a));
        // Un refus immédiat de TikTok compte comme un échec (nouvel essai à l'heure suivante).
        const etat = await etatTiktok(publishId).catch(() => null);
        if (etat?.status === "FAILED") throw new Error(`TikTok : ${etat.raison ?? "traitement refusé"}`);
        await depot.relaiReussi("tiktok", a.id, publishId);
        bilan.tiktok.push(a.slug);
      } catch (e) {
        const erreur = e instanceof Error ? e.message : String(e);
        await depot.relaiEchoue("tiktok", a.id, erreur);
        bilan.echecsReseaux.push({ reseau: "tiktok", slug: a.slug, erreur });
      }
    }
  }
}

/** Publie les Reels des articles déjà relayés : 3 par heure au plus. */
async function relayerReels(bilan: BilanRelais): Promise<void> {
  if (!config.reels()) return;
  const restant = MAX_PAR_HEURE - (await depot.reelsCetteHeure());
  if (restant <= 0) return;
  for (const a of await depot.reelsEnAttente(restant)) {
    try {
      const video = await obtenirVideo(a);
      const reelId = await publierReel(video, texteReseau("reel", a));
      await depot.reelReussi(a.id, reelId);
      bilan.reels.push(a.slug);
    } catch (e) {
      const erreur = e instanceof Error ? e.message : String(e);
      await depot.reelEchoue(a.id, erreur);
      bilan.echecsReels.push({ slug: a.slug, erreur });
    }
  }
}

export async function relayer(maintenant = new Date()): Promise<BilanRelais> {
  const bilan: BilanRelais = { statut: "termine", publies: [], echecs: [], reels: [], echecsReels: [], instagram: [], tiktok: [], echecsReseaux: [] };
  if (!dansLaPlageHoraire(maintenant)) return { ...bilan, statut: "hors-plage" };
  if (!config.facebook()) {
    await relayerReseaux(bilan);
    return { ...bilan, statut: "non-configure" };
  }

  const restant = MAX_PAR_HEURE - (await depot.relaisFacebookCetteHeure());
  if (restant <= 0) {
    await relayerReels(bilan);
    await relayerReseaux(bilan);
    return { ...bilan, statut: "quota-atteint" };
  }

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
  await relayerReels(bilan);
  await relayerReseaux(bilan);
  return bilan;
}
