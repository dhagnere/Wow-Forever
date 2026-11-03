import { NextResponse, type NextRequest } from "next/server";
import { cleGuideValide, enregistrerProgression, lireProgression } from "@/modules/veille";
import { joueurConnecte } from "@/lib/joueur";

/**
 * Progression du joueur dans un guide.
 *  GET  ?guide=alliance:humain:mage   → { connecte, pseudo?, quetes, jours }
 *  POST { guide, quetes: number[] }   → enregistre (joueur connecté seulement)
 * Le cookie de session est en SameSite=Lax : un autre site ne peut pas envoyer de POST avec lui. L'origine est
 * vérifiée en plus.
 */

export const dynamic = "force-dynamic";

const pasDeCache = { "Cache-Control": "private, no-store" };

export async function GET(req: NextRequest) {
  const guide = req.nextUrl.searchParams.get("guide") ?? "";
  const j = await joueurConnecte();
  if (!j) return NextResponse.json({ connecte: false }, { headers: pasDeCache });
  if (!cleGuideValide(guide)) return NextResponse.json({ connecte: true, pseudo: j.pseudo, quetes: [], jours: [] }, { headers: pasDeCache });
  const p = await lireProgression(j.id, guide);
  return NextResponse.json({ connecte: true, pseudo: j.pseudo, ...p }, { headers: pasDeCache });
}

export async function POST(req: NextRequest) {
  const origine = req.headers.get("origin");
  if (origine && new URL(origine).host !== req.headers.get("host")) return NextResponse.json({ erreur: "origine" }, { status: 403 });
  const j = await joueurConnecte();
  if (!j) return NextResponse.json({ erreur: "connexion" }, { status: 401 });
  const corps = (await req.json().catch(() => null)) as { guide?: unknown; quetes?: unknown } | null;
  const guide = String(corps?.guide ?? "");
  if (!cleGuideValide(guide) || !Array.isArray(corps?.quetes)) return NextResponse.json({ erreur: "donnees" }, { status: 400 });
  const { nouvelles } = await enregistrerProgression(j.id, guide, (corps.quetes as unknown[]).map(Number));
  const p = await lireProgression(j.id, guide);
  return NextResponse.json({ ok: true, nouvelles, jours: p.jours }, { headers: pasDeCache });
}
