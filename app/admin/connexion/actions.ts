"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE_SESSION, DUREE_SESSION_S, creerJeton, motDePasseCorrect } from "@/modules/veille";

const tentatives = new Map<string, { n: number; depuis: number }>();

export async function seConnecter(_etat: string | null, form: FormData): Promise<string | null> {
  // Freine les essais répétés : au-delà de 5 échecs en 15 minutes, attente imposée.
  const maintenant = Date.now();
  const t = tentatives.get("admin");
  if (t && maintenant - t.depuis < 15 * 60_000 && t.n >= 5) return "Trop d'essais. Réessayez dans quelques minutes.";

  const mdp = String(form.get("motdepasse") ?? "");
  if (!(await motDePasseCorrect(mdp))) {
    const courant = t && maintenant - t.depuis < 15 * 60_000 ? t : { n: 0, depuis: maintenant };
    tentatives.set("admin", { n: courant.n + 1, depuis: courant.depuis });
    await new Promise((r) => setTimeout(r, 800));
    return "Mot de passe incorrect.";
  }
  tentatives.delete("admin");
  (await cookies()).set(COOKIE_SESSION, await creerJeton(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: DUREE_SESSION_S,
  });
  redirect("/admin/veille/");
}

export async function seDeconnecter(): Promise<void> {
  (await cookies()).delete(COOKIE_SESSION);
  redirect("/admin/connexion/");
}
