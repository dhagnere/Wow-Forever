/** Lecture centralisée des variables d'environnement du module. */

function lire(nom: string): string | undefined {
  const v = process.env[nom];
  return v && v.trim() !== "" ? v.trim() : undefined;
}

export function exiger(nom: string): string {
  const v = lire(nom);
  if (!v) throw new Error(`Variable d'environnement manquante : ${nom} (voir .env.example)`);
  return v;
}

export const config = {
  siteUrl: () => (lire("SITE_URL") ?? "http://localhost:3000").replace(/\/+$/, ""),
  databaseUrl: () => lire("DATABASE_URL") ?? lire("SCALINGO_POSTGRESQL_URL") ?? exiger("DATABASE_URL"),
  modele: () => lire("ANTHROPIC_MODEL") ?? "claude-opus-5-5",
  brouillonsParJour: () => {
    const n = Number(lire("VEILLE_BROUILLONS_PAR_JOUR") ?? 12);
    return Number.isFinite(n) && n > 0 ? Math.min(Math.floor(n), 30) : 12;
  },
  /** Reels Facebook : actifs par défaut, FACEBOOK_REELS=off pour les couper. */
  reels: () => lire("FACEBOOK_REELS") !== "off",
  facebook: () => {
    const pageId = lire("FACEBOOK_PAGE_ID");
    const jeton = lire("FACEBOOK_PAGE_TOKEN");
    if (!pageId || !jeton) return null;
    return { pageId, jeton, version: lire("FACEBOOK_GRAPH_VERSION") ?? "v21.0" };
  },
};
