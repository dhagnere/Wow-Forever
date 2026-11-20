import { iconeObjetOrigine } from "@/modules/veille";

export const dynamic = "force-dynamic";

/**
 * Icône d'un objet de l'Azeroth d'origine absent des fichiers de Forever (butin des donjons et raids), par l'identifiant de l'objet.
 * Tant que son icône n'est pas notée (tâche quotidienne `base:importer` ou bouton de /admin/butin), un carré « ? » est servi.
 */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const texte = (await params).id;
  const id = /^\d{1,9}$/.test(texte) ? Number(texte) : 0;
  let png: Buffer | null = null;
  try {
    png = await iconeObjetOrigine(id);
  } catch (e) {
    console.error(`[icones origine] ${id} :`, e instanceof Error ? e.message : e);
  }
  const image = png ?? (await iconeInconnue());
  return new Response(new Uint8Array(image), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": png ? "public, max-age=2592000, immutable" : "public, max-age=3600",
    },
  });
}

let inconnue: Promise<Buffer> | null = null;
/** Carré sombre marqué « ? », fabriqué une fois. */
function iconeInconnue(): Promise<Buffer> {
  inconnue ??= import("sharp").then(({ default: sharp }) =>
    sharp(
      Buffer.from(
        `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" fill="#1c140e"/><text x="32" y="44" text-anchor="middle" font-family="sans-serif" font-size="34" font-weight="700" fill="#8a7f6c">?</text></svg>`,
      ),
    )
      .png()
      .toBuffer(),
  );
  return inconnue;
}
