import { exigerAdmin } from "@/lib/admin";
import { csvParJour, tableauStatistiques } from "@/modules/veille";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  await exigerAdmin();
  const jours = Number(new URL(req.url).searchParams.get("jours") ?? 30);
  const t = await tableauStatistiques(jours);
  return new Response(csvParJour(t), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="statistiques-${t.jours}-jours.csv"`,
      "Cache-Control": "private, no-store",
    },
  });
}
