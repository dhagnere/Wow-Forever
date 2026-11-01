/**
 * Accès en lecture à wago.tools : versions du jeu, tables de données (CSV en français) et fichiers bruts (icônes).
 * Le produit suivi est WoW Forever (« wowf ») ; OBJETS_PRODUIT permet d'en viser un autre.
 */

const BASE = "https://wago.tools";
const AGENT = "AzerothForever/1.0 (+site de fans)";

export function produit(): string {
  return process.env.OBJETS_PRODUIT?.trim() || "wowf";
}

async function lire(chemin: string, delaiMs = 120_000): Promise<Response> {
  const r = await fetch(`${BASE}${chemin}`, { headers: { "User-Agent": AGENT }, signal: AbortSignal.timeout(delaiMs) });
  if (!r.ok) throw new Error(`wago.tools ${chemin.split("?")[0]} : HTTP ${r.status}`);
  return r;
}

/** Dernière version publiée du produit suivi, par exemple « 1.60.1.70707 ». */
export async function derniereVersion(): Promise<string> {
  const json = (await (await lire("/api/builds", 30_000)).json()) as Record<string, { version?: string; created_at?: string }[]>;
  const builds = json?.[produit()];
  if (!Array.isArray(builds) || !builds.length) throw new Error(`Produit « ${produit()} » introuvable sur wago.tools.`);
  const tries = [...builds].sort((a, b) => String(b.created_at ?? "").localeCompare(String(a.created_at ?? "")));
  const v = tries[0]?.version;
  if (!v || !/^[\d.]+$/.test(v)) throw new Error("Version illisible sur wago.tools.");
  return v;
}

/** Table de données du jeu, au format CSV, textes en français. */
export async function tableCsv(nom: string, version: string): Promise<string> {
  const p = new URLSearchParams({ build: version, locale: "frFR" });
  return (await lire(`/db2/${encodeURIComponent(nom)}/csv?${p}`)).text();
}

/** Fichier brut du jeu (icône au format BLP). */
export async function fichierBrut(id: number, version: string): Promise<Buffer> {
  const r = await lire(`/api/casc/${id}?${new URLSearchParams({ build: version })}`, 30_000);
  return Buffer.from(await r.arrayBuffer());
}
