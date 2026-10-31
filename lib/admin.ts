import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE_SESSION, jetonValide } from "@/modules/veille";

/** À appeler en tête de chaque page et action d'administration. */
export async function exigerAdmin(): Promise<void> {
  const jeton = (await cookies()).get(COOKIE_SESSION)?.value;
  if (!(await jetonValide(jeton))) redirect("/admin/connexion/");
}
