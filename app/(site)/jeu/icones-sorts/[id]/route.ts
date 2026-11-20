import { iconeFichier } from "@/modules/veille";
import { iconeSortConnue } from "@/lib/sorts";

export const dynamic = "force-dynamic";

/**
 * Icône d'un sort que le dossier public/images/jeu/sorts/ n'a pas encore (sort ajouté après le dernier `npm run sorts:jeu`) :
 * lue dans les fichiers du jeu (wago.tools) par le serveur, gardée dans le cache des icônes. Seules les icônes citées par
 * content/sorts-jeu.json et .en.json sont servies.
 */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const texte = (await params).id;
  const id = /^\d{1,9}$/.test(texte) ? Number(texte) : 0;
  if (!iconeSortConnue(id)) return new Response("Icône inconnue", { status: 404 });
  try {
    const png = await iconeFichier(id);
    if (png) {
      return new Response(new Uint8Array(png), {
        headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=2592000, immutable" },
      });
    }
  } catch (e) {
    console.error(`[icones sorts] ${id} :`, e instanceof Error ? e.message : e);
  }
  return new Response("Icône indisponible", { status: 503, headers: { "Cache-Control": "public, max-age=3600" } });
}
