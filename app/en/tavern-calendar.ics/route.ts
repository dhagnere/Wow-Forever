import { fichierAgenda } from "@/lib/agenda";
import { SITE } from "@/lib/site";

export const dynamic = "force-dynamic";

/** Agenda des dates annoncées, en anglais (/en/calendar/). */
export function GET() {
  return new Response(fichierAgenda(SITE.url, new Date(), "en"), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'inline; filename="wow-forever-eternal-tavern.ics"',
      "Cache-Control": "public, max-age=3600",
    },
  });
}
