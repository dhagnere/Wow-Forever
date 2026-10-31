/**
 * Session d'administration : jeton signé (HMAC-SHA256) dans un cookie HttpOnly.
 * Utilise Web Crypto, disponible dans le proxy Next.js comme dans Node.
 * Garde-fou à ne jamais affaiblir (voir CLAUDE.md) : tout /admin exige une session valide.
 *
 * Jeton : « idAdmin.versionSession.expiration.signature ».
 * Le proxy vérifie la signature et l'expiration ; exigerAdmin() vérifie en plus, en base,
 * que le compte existe toujours et que son mot de passe n'a pas changé depuis (version).
 */

export const COOKIE_SESSION = "af_admin";
export const DUREE_SESSION_S = 60 * 60 * 12; // 12 heures

const encodeur = new TextEncoder();

function secret(): string {
  const s = process.env.SESSION_SECRET ?? "";
  if (s.length < 32) throw new Error("SESSION_SECRET absent ou trop court (32 caractères minimum).");
  return s;
}

/** Vrai si SESSION_SECRET est utilisable (sert à afficher un message clair à la connexion). */
export function secretConfigure(): boolean {
  return (process.env.SESSION_SECRET ?? "").length >= 32;
}

function base64url(octets: ArrayBuffer): string {
  return Buffer.from(octets).toString("base64url");
}

async function signer(donnees: string): Promise<string> {
  const cle = await crypto.subtle.importKey("raw", encodeur.encode(secret()), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return base64url(await crypto.subtle.sign("HMAC", cle, encodeur.encode(donnees)));
}

function egaliteConstante(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export interface Porteur {
  id: number;
  version: number;
}

export async function creerJeton(p: Porteur, maintenantS = Math.floor(Date.now() / 1000)): Promise<string> {
  const expire = maintenantS + DUREE_SESSION_S;
  return `${p.id}.${p.version}.${expire}.${await signer(`admin.${p.id}.${p.version}.${expire}`)}`;
}

/** Porteur du jeton si la signature est bonne et le jeton non expiré ; sinon null. */
export async function lireJeton(jeton: string | undefined, maintenantS = Math.floor(Date.now() / 1000)): Promise<Porteur | null> {
  if (!jeton) return null;
  const parties = jeton.split(".");
  if (parties.length !== 4) return null;
  const [id, version, expire] = parties.slice(0, 3).map(Number);
  const signature = parties[3];
  if (![id, version, expire].every(Number.isInteger) || !signature || expire < maintenantS) return null;
  try {
    return egaliteConstante(signature, await signer(`admin.${id}.${version}.${expire}`)) ? { id, version } : null;
  } catch {
    return null;
  }
}

export async function jetonValide(jeton: string | undefined, maintenantS = Math.floor(Date.now() / 1000)): Promise<boolean> {
  return (await lireJeton(jeton, maintenantS)) !== null;
}

/** Compare le mot de passe saisi à ADMIN_PASSWORD, en temps constant. Sert à créer le premier compte. */
export async function motDePasseCorrect(saisi: string): Promise<boolean> {
  const attendu = process.env.ADMIN_PASSWORD ?? "";
  if (attendu.length < 16) throw new Error("ADMIN_PASSWORD absent ou trop court (16 caractères minimum).");
  const [a, b] = await Promise.all([signer(`mdp.${saisi}`), signer(`mdp.${attendu}`)]);
  return egaliteConstante(a, b);
}
