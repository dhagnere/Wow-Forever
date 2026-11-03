import { config } from "../config";

/**
 * Bloc « Page Facebook » du tableau de bord : abonnés, mentions J'aime et réactions des dix dernières publications.
 * Utilise le jeton de Page déjà configuré pour la veille ; le jeton n'est jamais affiché ni journalisé.
 */

export interface PublicationFb { date: Date; texte: string; lien: string; reactions: number; commentaires: number; partages: number }
export interface StatsFacebook { abonnes: number | null; jaime: number | null; publications: PublicationFb[] }

async function graph<T>(chemin: string, params: Record<string, string>): Promise<T> {
  const fb = config.facebook();
  if (!fb) throw new Error("Page Facebook non configurée.");
  const q = new URLSearchParams({ ...params, access_token: fb.jeton });
  const r = await fetch(`https://graph.facebook.com/${fb.version}/${chemin}?${q}`, { signal: AbortSignal.timeout(10_000) });
  if (!r.ok) throw new Error(`Facebook a répondu ${r.status}.`);
  return (await r.json()) as T;
}

export async function statsFacebook(): Promise<StatsFacebook | { erreur: string } | null> {
  const fb = config.facebook();
  if (!fb) return null;
  try {
    const [page, posts] = await Promise.all([
      graph<{ followers_count?: number; fan_count?: number }>(fb.pageId, { fields: "followers_count,fan_count" }),
      graph<{ data?: { created_time: string; message?: string; permalink_url?: string; reactions?: { summary?: { total_count?: number } }; comments?: { summary?: { total_count?: number } }; shares?: { count?: number } }[] }>(
        `${fb.pageId}/posts`,
        { fields: "created_time,message,permalink_url,reactions.summary(total_count).limit(0),comments.summary(total_count).limit(0),shares", limit: "10" },
      ),
    ]);
    return {
      abonnes: page.followers_count ?? null,
      jaime: page.fan_count ?? null,
      publications: (posts.data ?? []).map((p) => ({
        date: new Date(p.created_time),
        texte: (p.message ?? "").split("\n")[0].slice(0, 110),
        lien: p.permalink_url ?? "",
        reactions: p.reactions?.summary?.total_count ?? 0,
        commentaires: p.comments?.summary?.total_count ?? 0,
        partages: p.shares?.count ?? 0,
      })),
    };
  } catch (e) {
    // Message générique : l'adresse appelée contient le jeton et ne doit pas apparaître.
    return { erreur: e instanceof Error && e.message.startsWith("Facebook a répondu") ? e.message : "Facebook injoignable pour le moment." };
  }
}
