import { config } from "../config";
import { enregistrerJeton, lireJeton } from "./jetons";

/**
 * TikTok (API Content Posting).
 *  - Connexion du compte : autorisation OAuth depuis /admin/reseaux/ ; jeton de 24 h renouvelé automatiquement.
 *  - Mode « brouillon » : la vidéo arrive dans la boîte de réception TikTok du compte, qui la publie depuis l'application
 *    (portée video.upload). Conforme aux règles de TikTok, fonctionne sans audit.
 *  - Mode « direct » : publication immédiate (portée video.publish). Sans audit de l'application par TikTok,
 *    les vidéos restent privées.
 */

const API = "https://open.tiktokapis.com";
export const PORTEES = "user.info.basic,video.upload,video.publish";

function reglages() {
  const t = config.tiktok();
  if (!t) throw new Error("TikTok n'est pas configuré (TIKTOK_CLIENT_KEY, TIKTOK_CLIENT_SECRET).");
  return t;
}

export function urlRetourTiktok(): string {
  // Hors de /admin : le cookie de session (SameSite=Strict) n'est pas envoyé au retour d'un autre site.
  // Le retour est protégé par le jeton aléatoire posé au départ, depuis une session d'administration.
  return `${config.siteUrl()}/reseaux/tiktok/retour/`;
}

export function urlAutorisationTiktok(etat: string): string {
  const t = reglages();
  const p = new URLSearchParams({ client_key: t.clientKey, response_type: "code", scope: PORTEES, redirect_uri: urlRetourTiktok(), state: etat });
  return `https://www.tiktok.com/v2/auth/authorize/?${p}`;
}

interface ReponseJeton {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  refresh_expires_in?: number;
  open_id?: string;
  error?: string;
  error_description?: string;
}

async function demanderJeton(params: Record<string, string>): Promise<ReponseJeton> {
  const t = reglages();
  const r = await fetch(`${API}/v2/oauth/token/`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ client_key: t.clientKey, client_secret: t.clientSecret, ...params }),
    signal: AbortSignal.timeout(30_000),
  });
  const json = (await r.json().catch(() => ({}))) as ReponseJeton;
  if (!r.ok || !json.access_token) throw new Error(`TikTok : ${json.error_description ?? json.error ?? `HTTP ${r.status}`}`);
  return json;
}

async function memoriser(j: ReponseJeton, compte?: string | null): Promise<void> {
  const maintenant = Date.now();
  await enregistrerJeton({
    reseau: "tiktok",
    compte: compte ?? null,
    acces: j.access_token!,
    rafraichissement: j.refresh_token ?? null,
    expireLe: new Date(maintenant + (j.expires_in ?? 86_400) * 1000),
    rafraichissementExpireLe: j.refresh_expires_in ? new Date(maintenant + j.refresh_expires_in * 1000) : null,
  });
}

/** Termine la connexion du compte (code reçu au retour de TikTok). */
export async function connecterTiktok(code: string): Promise<string> {
  const j = await demanderJeton({ code, grant_type: "authorization_code", redirect_uri: urlRetourTiktok() });
  await memoriser(j);
  const nom = await nomCompteTiktok().catch(() => null);
  await memoriser(j, nom ?? j.open_id ?? null);
  return nom ?? "compte TikTok";
}

/** Jeton valide, renouvelé s'il expire dans moins de 10 minutes. */
export async function jetonTiktok(): Promise<string> {
  const j = await lireJeton("tiktok");
  if (!j) throw new Error("Aucun compte TikTok relié : connectez-le depuis /admin/reseaux/.");
  if (j.expireLe.getTime() - Date.now() > 10 * 60_000) return j.acces;
  if (!j.rafraichissement) throw new Error("Jeton TikTok expiré : reconnectez le compte depuis /admin/reseaux/.");
  const nouveau = await demanderJeton({ grant_type: "refresh_token", refresh_token: j.rafraichissement });
  await memoriser(nouveau, j.compte);
  return nouveau.access_token!;
}

async function appel<T = Record<string, unknown>>(chemin: string, corps: unknown): Promise<T> {
  const jeton = await jetonTiktok();
  const r = await fetch(`${API}${chemin}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${jeton}`, "Content-Type": "application/json; charset=UTF-8" },
    body: JSON.stringify(corps ?? {}),
    signal: AbortSignal.timeout(30_000),
  });
  const json = (await r.json().catch(() => ({}))) as { data?: T; error?: { code?: string; message?: string } };
  if (!r.ok || (json.error?.code && json.error.code !== "ok")) throw new Error(`TikTok : ${json.error?.message || json.error?.code || `HTTP ${r.status}`}`);
  return (json.data ?? {}) as T;
}

async function nomCompteTiktok(): Promise<string | null> {
  const jeton = await jetonTiktok();
  const r = await fetch(`${API}/v2/user/info/?fields=display_name,username`, { headers: { Authorization: `Bearer ${jeton}` }, signal: AbortSignal.timeout(15_000) });
  const json = (await r.json().catch(() => ({}))) as { data?: { user?: { display_name?: string; username?: string } } };
  return json.data?.user?.username ?? json.data?.user?.display_name ?? null;
}

/** Confidentialité choisie : publique si le compte le permet, sinon la plus ouverte proposée (privée pour une application non auditée). */
export function choisirConfidentialite(options: string[]): string {
  for (const o of ["PUBLIC_TO_EVERYONE", "MUTUAL_FOLLOW_FRIENDS", "FOLLOWER_OF_CREATOR", "SELF_ONLY"]) if (options.includes(o)) return o;
  if (!options.length) throw new Error("TikTok : aucune option de confidentialité proposée pour ce compte.");
  return options[0];
}

/** Envoie la vidéo (un seul morceau : moins de 64 Mo) et renvoie l'identifiant de publication. */
export async function publierTiktok(video: Buffer, legende: string): Promise<{ publishId: string; mode: "brouillon" | "direct" }> {
  const { mode } = reglages();
  const source = { source: "FILE_UPLOAD", video_size: video.length, chunk_size: video.length, total_chunk_count: 1 };
  let init: { publish_id?: string; upload_url?: string };
  if (mode === "direct") {
    const createur = await appel<{ privacy_level_options?: string[] }>("/v2/post/publish/creator_info/query/", {});
    init = await appel("/v2/post/publish/video/init/", {
      post_info: {
        title: [...legende].slice(0, 2200).join(""),
        privacy_level: choisirConfidentialite(createur.privacy_level_options ?? []),
        disable_comment: false,
        disable_duet: false,
        disable_stitch: false,
        video_cover_timestamp_ms: 1000,
      },
      source_info: source,
    });
  } else {
    init = await appel("/v2/post/publish/inbox/video/init/", { source_info: source });
  }
  if (!init.publish_id || !init.upload_url) throw new Error("TikTok : envoi non ouvert.");

  const envoi = await fetch(init.upload_url, {
    method: "PUT",
    headers: { "Content-Type": "video/mp4", "Content-Range": `bytes 0-${video.length - 1}/${video.length}`, "Content-Length": String(video.length) },
    body: new Uint8Array(video),
    signal: AbortSignal.timeout(120_000),
  });
  if (!envoi.ok) throw new Error(`TikTok : envoi de la vidéo refusé (HTTP ${envoi.status}).`);
  return { publishId: init.publish_id, mode };
}

/** État d'une publication : PROCESSING_UPLOAD, SEND_TO_USER_INBOX, PUBLISH_COMPLETE, FAILED… */
export async function etatTiktok(publishId: string): Promise<{ status: string; raison?: string }> {
  const d = await appel<{ status?: string; fail_reason?: string }>("/v2/post/publish/status/fetch/", { publish_id: publishId });
  return { status: d.status ?? "INCONNU", raison: d.fail_reason };
}
