import { iconeObjet } from "@/modules/veille";

export const dynamic = "force-dynamic";

/** Carré sombre servi quand l'icône n'a pas pu être lue, pour ne pas laisser d'image cassée. */
const VIDE = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M8AAwUBAa8b7VEAAAAASUVORK5CYII=",
  "base64",
);

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const texte = (await params).id;
  const id = /^\d{1,9}$/.test(texte) ? Number(texte) : 0;
  let png: Buffer | null = null;
  try {
    png = await iconeObjet(id);
  } catch (e) {
    console.error(`[icones] ${id} :`, e instanceof Error ? e.message : e);
  }
  return new Response(new Uint8Array(png ?? VIDE), {
    headers: {
      "Content-Type": "image/png",
      // Une icône lue ne change pas d'un identifiant à l'autre ; un échec est réessayé une heure plus tard.
      "Cache-Control": png ? "public, max-age=2592000, immutable" : "public, max-age=3600",
    },
  });
}
