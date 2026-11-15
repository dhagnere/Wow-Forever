/**
 * Miniature d'une vidéo YouTube, lue par le serveur du site et servie depuis le site (route /carnet/videos/miniature/…) :
 * le navigateur du visiteur ne contacte jamais Google. Sert de repli quand la vidéo n'a pas de miniature gardée dans
 * public/images/videos/.
 */

/** Identifiant de vidéo YouTube (11 caractères). */
export const idVideoValide = (id: string): boolean => /^[\w-]{11}$/.test(id);

/** Tailles essayées dans l'ordre : 1280 × 720, puis 320 × 180 (toujours au format 16:9, sans bandes noires). */
const TAILLES = ["maxresdefault.jpg", "hq720.jpg", "mqdefault.jpg"];

export async function miniatureVideoYoutube(id: string): Promise<Buffer | null> {
  if (!idVideoValide(id)) return null;
  for (const taille of TAILLES) {
    try {
      const r = await fetch(`https://i.ytimg.com/vi/${id}/${taille}`, { signal: AbortSignal.timeout(8000), next: { revalidate: 86400 } } as RequestInit);
      if (!r.ok || !(r.headers.get("content-type") ?? "").startsWith("image/")) continue;
      return Buffer.from(await r.arrayBuffer());
    } catch {
      // taille suivante
    }
  }
  return null;
}
