import { randomBytes, scrypt, timingSafeEqual, createHash } from "node:crypto";

/**
 * Mots de passe des joueurs : empreinte scrypt salée (« scrypt$N$r$p$sel$empreinte », en base64url).
 * Le mot de passe lui-même n'est jamais gardé ni journalisé. Comparaison en temps constant.
 */

const N = 16384;
const R = 8;
const P = 1;
const LONGUEUR = 64;
export const MOT_DE_PASSE_MIN = 10;

function deriver(motDePasse: string, sel: Buffer, n = N, r = R, p = P): Promise<Buffer> {
  return new Promise((ok, ko) =>
    scrypt(motDePasse.normalize("NFKC"), sel, LONGUEUR, { N: n, r, p, maxmem: 64 * 1024 * 1024 }, (e, cle) => (e ? ko(e) : ok(cle))),
  );
}

export async function hacherMotDePasse(motDePasse: string): Promise<string> {
  const sel = randomBytes(16);
  const cle = await deriver(motDePasse, sel);
  return `scrypt$${N}$${R}$${P}$${sel.toString("base64url")}$${cle.toString("base64url")}`;
}

export async function verifierMotDePasse(motDePasse: string, stocke: string): Promise<boolean> {
  const [algo, n, r, p, sel, empreinte] = stocke.split("$");
  if (algo !== "scrypt" || !sel || !empreinte) return false;
  try {
    const attendu = Buffer.from(empreinte, "base64url");
    const cle = await deriver(motDePasse, Buffer.from(sel, "base64url"), Number(n), Number(r), Number(p));
    return cle.length === attendu.length && timingSafeEqual(cle, attendu);
  } catch {
    return false;
  }
}

/** Jeton aléatoire (session, réinitialisation) : le jeton part dans le cookie ou le lien, seule son empreinte est en base. */
export function nouveauJeton(): { jeton: string; empreinte: string } {
  const jeton = randomBytes(32).toString("base64url");
  return { jeton, empreinte: empreinteJeton(jeton) };
}

export function empreinteJeton(jeton: string): string {
  return createHash("sha256").update(jeton).digest("hex");
}
