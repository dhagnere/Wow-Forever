import { config } from "../config";

/**
 * Publication d'un Reel sur la Page Facebook (API Reels de Meta), en trois temps :
 *  1. start  : réserve un identifiant de vidéo et une adresse d'envoi ;
 *  2. envoi  : transfert du fichier vers rupload.facebook.com ;
 *  3. finish : publication avec la description.
 * Permissions du jeton de Page : pages_manage_posts, pages_read_engagement, pages_show_list.
 */
export async function publierReel(video: Buffer, description: string): Promise<string> {
  const fb = config.facebook();
  if (!fb) throw new Error("FACEBOOK_PAGE_ID ou FACEBOOK_PAGE_TOKEN manquant.");
  const base = `https://graph.facebook.com/${fb.version}/${fb.pageId}/video_reels`;

  const debut = await appel(`${base}`, { upload_phase: "start", access_token: fb.jeton });
  const videoId = debut.video_id as string | undefined;
  const urlEnvoi = (debut.upload_url as string | undefined) ?? (videoId ? `https://rupload.facebook.com/video-upload/${fb.version}/${videoId}` : undefined);
  if (!videoId || !urlEnvoi) throw new Error("Réponse inattendue de Meta à l'ouverture de l'envoi.");

  const envoi = await fetch(urlEnvoi, {
    method: "POST",
    headers: { Authorization: `OAuth ${fb.jeton}`, offset: "0", file_size: String(video.length), "Content-Type": "application/octet-stream" },
    body: new Uint8Array(video),
    signal: AbortSignal.timeout(120_000),
  });
  const reponseEnvoi = (await envoi.json().catch(() => ({}))) as { success?: boolean; error?: { message?: string } };
  if (!envoi.ok || reponseEnvoi.success === false) throw new Error(reponseEnvoi.error?.message ?? `Envoi de la vidéo : HTTP ${envoi.status}`);

  const fin = await appel(base, {
    upload_phase: "finish",
    video_id: videoId,
    video_state: "PUBLISHED",
    description,
    access_token: fb.jeton,
  });
  if (fin.success === false) throw new Error("Meta a refusé la publication du Reel.");
  return videoId;
}

async function appel(url: string, params: Record<string, string>): Promise<Record<string, unknown>> {
  const r = await fetch(url, { method: "POST", body: new URLSearchParams(params), signal: AbortSignal.timeout(30_000) });
  const json = (await r.json().catch(() => ({}))) as Record<string, unknown> & { error?: { message?: string } };
  if (!r.ok || json.error) throw new Error(json.error?.message ?? `HTTP ${r.status}`);
  return json;
}
