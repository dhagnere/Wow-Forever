import { enregistrerSignal, type Signal } from "@/modules/veille";
import { SITE } from "@/lib/site";

export const dynamic = "force-dynamic";

/** Réception des signaux de mesure d'audience (navigator.sendBeacon). Réponse vide dans tous les cas. */
export async function POST(req: Request) {
  const vide = new Response(null, { status: 204 });
  // Respect du refus de suivi exprimé par le navigateur.
  if (req.headers.get("dnt") === "1" || req.headers.get("sec-gpc") === "1") return vide;
  const texte = await req.text().catch(() => "");
  if (!texte || texte.length > 4000) return vide;
  let signaux: Signal[];
  try {
    const brut = JSON.parse(texte) as unknown;
    signaux = (Array.isArray(brut) ? brut : [brut]).slice(0, 20) as Signal[];
  } catch {
    return vide;
  }
  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || req.headers.get("x-real-ip") || "0.0.0.0";
  const contexte = { ip, ua: req.headers.get("user-agent") ?? "", hoteSite: new URL(SITE.url).hostname };
  for (const s of signaux) {
    try {
      await enregistrerSignal(s, contexte);
    } catch (e) {
      console.error("[mesure]", e instanceof Error ? e.message : e);
      break;
    }
  }
  return vide;
}
