"use server";

import { redirect } from "next/navigation";
import { changerMotDePasse, lancerPassage } from "@/modules/veille";
import { exigerAdmin } from "@/lib/admin";

const avecMessage = (chemin: string, message: string) => redirect(`${chemin}?message=${encodeURIComponent(message)}`);

/** Lance un passage de veille (rédaction complète ou classement seul) depuis le tableau de bord. */
export async function lancerVeille(form: FormData): Promise<void> {
  const admin = await exigerAdmin();
  const mode = form.get("mode") === "essai" ? "essai" : "quotidien";
  const erreur = await lancerPassage(mode, `manuel (${admin.identifiant})`);
  avecMessage(
    "/admin/",
    erreur ??
      (mode === "quotidien"
        ? "Veille lancée. Comptez 5 à 15 minutes : les brouillons arrivent dans l'onglet Brouillons, rechargez la page pour suivre le passage."
        : "Classement lancé (sans rédaction). Résultat dans « Revue du jour » d'ici une à deux minutes."),
  );
}

export async function modifierMotDePasse(_etat: string | null, form: FormData): Promise<string | null> {
  const admin = await exigerAdmin();
  const actuel = String(form.get("actuel") ?? "");
  const nouveau = String(form.get("nouveau") ?? "");
  if (nouveau !== String(form.get("confirmation") ?? "")) return "Les deux saisies du nouveau mot de passe diffèrent.";
  const erreur = await changerMotDePasse(admin.id, actuel, nouveau);
  if (erreur) return erreur;
  redirect("/admin/connexion/?mdp=1");
}
