"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { BLOCAGE_MIN, COOKIE_SESSION, DUREE_SESSION_S, authentifier, secretConfigure } from "@/modules/veille";

/** Adresse du visiteur. Scalingo ajoute la vraie adresse en fin de X-Forwarded-For. */
async function adresseIp(): Promise<string> {
  const h = await headers();
  const liste = (h.get("x-forwarded-for") ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  return liste.at(-1) ?? h.get("x-real-ip") ?? "inconnue";
}

export async function seConnecter(_etat: string | null, form: FormData): Promise<string | null> {
  if (!secretConfigure()) return "Le site n'est pas configuré : SESSION_SECRET doit faire au moins 32 caractères (Scalingo, onglet Environment).";
  const identifiant = String(form.get("identifiant") ?? "");
  const mdp = String(form.get("motdepasse") ?? "");
  if (!identifiant.trim() || !mdp) return "Saisissez l'identifiant et le mot de passe.";

  const r = await authentifier(identifiant, mdp, await adresseIp());
  if (!r.ok) {
    if (r.raison === "bloque") return `Trop d'essais manqués. Réessayez dans ${BLOCAGE_MIN} minutes.`;
    if (r.raison === "configuration") return "Premier accès impossible : ADMIN_PASSWORD est absent ou fait moins de 16 caractères (Scalingo, onglet Environment).";
    return "Identifiant ou mot de passe incorrect.";
  }
  (await cookies()).set(COOKIE_SESSION, r.jeton, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: DUREE_SESSION_S,
  });
  redirect(r.premierCompte ? "/admin/compte/?bienvenue=1" : "/admin/");
}

export async function seDeconnecter(): Promise<void> {
  (await cookies()).delete(COOKIE_SESSION);
  redirect("/admin/connexion/?sortie=1");
}
