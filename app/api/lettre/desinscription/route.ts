import { desinscrireParLien } from "@/modules/veille";

/**
 * Désinscription en un clic (RFC 8058) : la messagerie de l'abonné appelle cette adresse en POST quand il clique sur
 * « Se désinscrire » à côté de l'expéditeur. Le lien est signé ; un lien faux ne change rien.
 */
export async function POST(requete: Request): Promise<Response> {
  const u = new URL(requete.url);
  await desinscrireParLien(Number(u.searchParams.get("a")), String(u.searchParams.get("s") ?? "").slice(0, 100));
  return new Response(null, { status: 204 });
}
