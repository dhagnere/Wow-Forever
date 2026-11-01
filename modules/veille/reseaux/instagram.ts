import { config } from "../config";

/**
 * Publication d'un Reel sur Instagram (API Graph de Meta, compte professionnel relié à la Page) :
 *  1. création d'un conteneur REELS avec l'adresse publique de la vidéo et la légende ;
 *  2. attente du traitement par Instagram (status_code FINISHED) ;
 *  3. publication du conteneur.
 */

const ATTENTE_MAX_MS = 5 * 60_000;

async function graphe(chemin: string, params: Record<string, string>, methode: "GET" | "POST" = "POST"): Promise<Record<string, unknown>> {
  const ig = config.instagram();
  if (!ig) throw new Error("Instagram n'est pas configuré.");
  const p = new URLSearchParams({ ...params, access_token: ig.jeton });
  const url = `https://graph.facebook.com/${ig.version}/${chemin}`;
  const r = methode === "GET"
    ? await fetch(`${url}?${p}`, { signal: AbortSignal.timeout(30_000) })
    : await fetch(url, { method: "POST", body: p, signal: AbortSignal.timeout(30_000) });
  const json = (await r.json().catch(() => ({}))) as Record<string, unknown> & { error?: { message?: string } };
  if (!r.ok || json.error) throw new Error(`Instagram : ${json.error?.message ?? `HTTP ${r.status}`}`);
  return json;
}

/** Identifiant du compte Instagram : INSTAGRAM_USER_ID, sinon celui relié à la Page Facebook. */
export async function compteInstagram(): Promise<string> {
  const ig = config.instagram();
  if (!ig) throw new Error("Instagram n'est pas configuré.");
  if (ig.userId) return ig.userId;
  if (!ig.pageId) throw new Error("INSTAGRAM_USER_ID ou FACEBOOK_PAGE_ID requis pour trouver le compte Instagram.");
  const page = await graphe(ig.pageId, { fields: "instagram_business_account" }, "GET");
  const id = (page.instagram_business_account as { id?: string } | undefined)?.id;
  if (!id) throw new Error("Aucun compte Instagram professionnel n'est relié à la Page Facebook.");
  return id;
}

export async function publierReelInstagram(urlVideo: string, legende: string, pause = (ms: number) => new Promise((r) => setTimeout(r, ms))): Promise<string> {
  const compte = await compteInstagram();
  const conteneur = await graphe(`${compte}/media`, { media_type: "REELS", video_url: urlVideo, caption: legende, share_to_feed: "true" });
  const id = conteneur.id as string | undefined;
  if (!id) throw new Error("Instagram : conteneur non créé.");

  const debut = Date.now();
  for (;;) {
    const etat = await graphe(id, { fields: "status_code,status" }, "GET");
    const code = etat.status_code as string | undefined;
    if (code === "FINISHED") break;
    if (code === "ERROR" || code === "EXPIRED") throw new Error(`Instagram : traitement de la vidéo en échec (${String(etat.status ?? code)}).`);
    if (Date.now() - debut > ATTENTE_MAX_MS) throw new Error("Instagram : traitement de la vidéo trop long, nouvel essai à l'heure suivante.");
    await pause(5_000);
  }
  const publie = await graphe(`${compte}/media_publish`, { creation_id: id });
  const mediaId = publie.id as string | undefined;
  if (!mediaId) throw new Error("Instagram : publication non confirmée.");
  return mediaId;
}
