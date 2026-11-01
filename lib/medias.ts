import "server-only";
import { cookies } from "next/headers";
import { COOKIE_SESSION, jetonValide, lireImage } from "@/modules/veille";

/**
 * Sert une image : à tous si elle illustre un article en ligne (mise en cache longue, le contenu d'un identifiant ne change jamais),
 * sinon seulement à l'administration (aperçu des brouillons).
 */
export async function servirImage(idTexte: string, variante: "une" | "og"): Promise<Response> {
  const image = await lireImage(Number(idTexte), variante);
  if (!image) return new Response("Image introuvable", { status: 404 });
  if (!image.publique && !(await jetonValide((await cookies()).get(COOKIE_SESSION)?.value))) {
    return new Response("Image introuvable", { status: 404 });
  }
  return new Response(new Uint8Array(image.donnees), {
    headers: {
      "Content-Type": "image/jpeg",
      "Cache-Control": image.publique ? "public, max-age=31536000, immutable" : "private, no-store",
      "Content-Disposition": "inline",
    },
  });
}
