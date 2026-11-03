import { fichierAgenda } from "@/lib/agenda";
import { SITE } from "@/lib/site";

export const dynamic = "force-dynamic";

export function GET() {
  return new Response(fichierAgenda(SITE.url), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'inline; filename="wow-forever-taverne-eternelle.ics"',
      "Cache-Control": "public, max-age=3600",
    },
  });
}
