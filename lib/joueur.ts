import "server-only";
import { cookies, headers } from "next/headers";
import { COOKIE_JOUEUR, DUREE_SESSION_JOUEUR_S, empreinteDepot, joueurDeSession, type Joueur } from "@/modules/veille";

/**
 * Session du joueur : jeton aléatoire dans un cookie HttpOnly (sa seule empreinte est en base). Cookie nécessaire au
 * service demandé (rester connecté) : il ne sert à aucune mesure d'audience.
 */

export async function joueurConnecte(): Promise<Joueur | null> {
  try {
    return await joueurDeSession((await cookies()).get(COOKIE_JOUEUR)?.value);
  } catch {
    return null;
  }
}

export async function poserSession(jeton: string): Promise<void> {
  (await cookies()).set(COOKIE_JOUEUR, jeton, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: DUREE_SESSION_JOUEUR_S,
  });
}

export async function jetonSession(): Promise<string | undefined> {
  return (await cookies()).get(COOKIE_JOUEUR)?.value;
}

export async function oublierSession(): Promise<void> {
  (await cookies()).delete(COOKIE_JOUEUR);
}

/** Empreinte du jour de la connexion (adresse IP et navigateur, salées) : limite les créations de comptes en série. */
export async function empreinteConnexion(): Promise<string> {
  const h = await headers();
  const ip = (h.get("x-forwarded-for") ?? "").split(",")[0].trim() || "0.0.0.0";
  return empreinteDepot(ip, h.get("user-agent") ?? "");
}

/** Adresse de retour sûre : un chemin du site, jamais une autre adresse. */
export function retourSur(valeur: unknown, defaut = "/compte/"): string {
  const v = String(valeur ?? "");
  return v.startsWith("/") && !v.startsWith("//") && !v.includes("\\") && v.length < 300 ? v : defaut;
}
