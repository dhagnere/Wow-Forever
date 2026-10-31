/**
 * Session d'administration : jeton signé (HMAC-SHA256) dans un cookie HttpOnly.
 * Utilise Web Crypto, disponible dans le proxy Next.js comme dans Node.
 * Garde-fou à ne jamais affaiblir (voir CLAUDE.md) : tout /admin exige une session valide.
 */

export const COOKIE_SESSION = "af_admin";
export const DUREE_SESSION_S = 60 * 60 * 12; // 12 heures

const encodeur = new TextEncoder();

function secret(): string {
  const s = process.env.SESSION_SECRET ?? "";
  if (s.length < 32) throw new Error("SESSION_SECRET absent ou trop court (32 caractères minimum).");
  return s;
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

export async function creerJeton(maintenantS = Math.floor(Date.now() / 1000)): Promise<string> {
  const expire = maintenantS + DUREE_SESSION_S;
  return `${expire}.${await signer(`admin.${expire}`)}`;
}

export async function jetonValide(jeton: string | undefined, maintenantS = Math.floor(Date.now() / 1000)): Promise<boolean> {
  if (!jeton) return false;
  const [expireTxt, signature] = jeton.split(".");
  const expire = Number(expireTxt);
  if (!signature || !Number.isInteger(expire) || expire < maintenantS) return false;
  try {
    return egaliteConstante(signature, await signer(`admin.${expire}`));
  } catch {
    return false;
  }
}

/** Compare le mot de passe saisi à ADMIN_PASSWORD, en temps constant. */
export async function motDePasseCorrect(saisi: string): Promise<boolean> {
  const attendu = process.env.ADMIN_PASSWORD ?? "";
  if (attendu.length < 16) throw new Error("ADMIN_PASSWORD absent ou trop court (16 caractères minimum).");
  const [a, b] = await Promise.all([signer(`mdp.${saisi}`), signer(`mdp.${attendu}`)]);
  return egaliteConstante(a, b);
}
