import { cookies } from "next/headers";
import { connecterTiktok } from "@/modules/veille";

export const dynamic = "force-dynamic";

const PAGE = (titre: string, texte: string) =>
  new Response(
    `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="robots" content="noindex"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${titre}</title>
<style>body{margin:0;background:#0b1020;color:#ece4d2;font:17px/1.6 system-ui,sans-serif;display:grid;place-items:center;min-height:100vh;padding:16px}main{max-width:520px;text-align:center}a{display:inline-block;margin-top:16px;background:#d9a94a;color:#1a1406;font-weight:700;padding:12px 22px;border-radius:4px;text-decoration:none}</style>
</head><body><main><h1>${titre}</h1><p>${texte}</p><a href="/admin/reseaux/">Retour à l'administration</a></main></body></html>`,
    { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } },
  );

/**
 * Retour de TikTok après autorisation. Le jeton aléatoire comparé ici n'a pu être posé que par /admin/reseaux/tiktok/connexion/,
 * réservé à l'administration : c'est lui qui garantit que la connexion a été demandée par Silfax.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const pot = await cookies();
  const attendu = pot.get("af_tiktok_etat")?.value;
  pot.delete({ name: "af_tiktok_etat", path: "/reseaux/tiktok/" });
  if (url.searchParams.get("error")) return PAGE("Autorisation refusée", "TikTok n'a pas autorisé la publication. Vous pouvez recommencer depuis l'administration.");
  const code = url.searchParams.get("code");
  if (!code || !attendu || url.searchParams.get("state") !== attendu) {
    return PAGE("Lien invalide ou expiré", "Relancez la connexion depuis l'administration (Réseaux › Relier le compte TikTok).");
  }
  try {
    const compte = await connecterTiktok(code);
    return PAGE("Compte TikTok relié", `La publication sur ${compte.replace(/[<>&"]/g, "")} est prête.`);
  } catch (e) {
    console.error("[tiktok]", e instanceof Error ? e.message : e);
    return PAGE("Connexion impossible", "TikTok a refusé l'échange. Vérifiez TIKTOK_CLIENT_KEY, TIKTOK_CLIENT_SECRET et l'adresse de retour déclarée dans l'application TikTok.");
  }
}
