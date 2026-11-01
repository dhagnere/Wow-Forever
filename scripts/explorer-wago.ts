/**
 * Exploration de wago.tools (données extraites du jeu), avant l'import de la base d'objets.
 *   npm run base:explorer                       → produits et dernières versions disponibles
 *   npm run base:explorer -- ItemSparse <build> → en-tête et 3 premières lignes d'une table (CSV, français)
 * Lecture seule : rien n'est écrit en base.
 */

const BASE = "https://wago.tools";

async function lire(url: string): Promise<Response> {
  const r = await fetch(url, { headers: { "User-Agent": "AzerothForever/1.0 (+site de fans)" }, signal: AbortSignal.timeout(60_000) });
  if (!r.ok) throw new Error(`${url} : HTTP ${r.status}`);
  return r;
}

async function versions() {
  const json = (await (await lire(`${BASE}/api/builds`)).json()) as unknown;
  // Format attendu : { produit: [ { version, created_at, ... }, ... ] }. Affichage prudent si le format diffère.
  if (json && typeof json === "object" && !Array.isArray(json)) {
    for (const [produit, liste] of Object.entries(json as Record<string, unknown>)) {
      const builds = Array.isArray(liste) ? (liste as Record<string, unknown>[]) : [];
      const recent = builds.slice(0, 3).map((b) => `${b.version ?? "?"}${b.created_at ? ` (${String(b.created_at).slice(0, 10)})` : ""}`);
      const marque = /forever/i.test(produit) || builds.some((b) => /^1\.6\d\./.test(String(b.version))) ? "  ← Forever ?" : "";
      console.log(`${produit.padEnd(28)} ${recent.join(", ")}${marque}`);
    }
  } else {
    console.log(JSON.stringify(json, null, 2).slice(0, 3000));
  }
}

async function table(nom: string, build?: string) {
  const p = new URLSearchParams({ locale: "frFR" });
  if (build) p.set("build", build);
  const texte = await (await lire(`${BASE}/db2/${encodeURIComponent(nom)}/csv?${p}`)).text();
  const lignes = texte.split(/\r?\n/).filter(Boolean);
  console.log(`${nom}${build ? ` (${build})` : ""} : ${lignes.length - 1} lignes`);
  console.log(lignes.slice(0, 4).join("\n"));
}

const [nom, build] = process.argv.slice(2);
(nom ? table(nom, build) : versions()).catch((e) => {
  console.error("Échec :", e instanceof Error ? e.message : e);
  process.exitCode = 1;
});
