import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE_SESSION, adminDepuisJeton, type Admin } from "@/modules/veille";

/**
 * À appeler en tête de chaque page et action d'administration.
 * Vérifie la signature du jeton, puis en base que le compte existe et que son mot de passe n'a pas changé.
 */
export async function exigerAdmin(): Promise<Admin> {
  const admin = await adminDepuisJeton((await cookies()).get(COOKIE_SESSION)?.value);
  if (!admin) redirect("/admin/connexion/");
  return admin;
}

/** Compte connecté, ou null (pour l'affichage seulement : ne remplace pas exigerAdmin()). */
export async function adminConnecte(): Promise<Admin | null> {
  return adminDepuisJeton((await cookies()).get(COOKIE_SESSION)?.value);
}
