import { NextResponse, type NextRequest } from "next/server";
import { COOKIE_SESSION, jetonValide } from "@/modules/veille";

/**
 * Accès réservé à l'administration. Garde-fou à ne jamais affaiblir (voir CLAUDE.md).
 * Les actions serveur revérifient la session (lib/admin.ts).
 */
export async function proxy(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith("/admin/connexion")) return NextResponse.next();
  if (await jetonValide(req.cookies.get(COOKIE_SESSION)?.value)) return NextResponse.next();
  const url = req.nextUrl.clone();
  url.pathname = "/admin/connexion/";
  url.search = "";
  return NextResponse.redirect(url);
}

export const config = { matcher: ["/admin/:path*"] };
