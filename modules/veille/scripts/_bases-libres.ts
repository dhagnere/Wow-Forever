import { readFile } from "node:fs/promises";
import { gunzipSync } from "node:zlib";
import { parse } from "csv-parse/sync";
import { CARTES_JEU } from "@/content/cartes-jeu";
import { ECRANS } from "@/config/ecrans";
import { fichierBrut, tableCsv } from "../objets/wago";
import { decoderBlp } from "../objets/blp";

/**
 * Outils communs aux scripts qui lisent les bases libres de l'Azeroth d'origine (CMaNGOS classic-db, AzerothCore) :
 * lecture d'un dump SQL, et conversion des positions du monde sur les cartes des zones du jeu.
 * Utilisés par base:butin (« où le trouver ») et base:quetes (guides de quêtes).
 */

export type Valeur = string | number | null;

/** Colonnes d'une table, lues dans son CREATE TABLE. */
export function colonnes(sql: string, table: string): string[] {
  const debut = sql.indexOf(`CREATE TABLE \`${table}\``);
  if (debut < 0) throw new Error(`Table ${table} absente du fichier.`);
  const fin = sql.indexOf(") ENGINE", debut);
  return [...sql.slice(debut, fin).matchAll(/^\s+`([A-Za-z0-9_]+)`/gm)].map((m) => m[1]);
}

/** Lignes de toutes les instructions INSERT d'une table (analyse des valeurs SQL : nombres, NULL, chaînes échappées). */
export function* lignes(sql: string, table: string): Generator<Record<string, Valeur>> {
  const cols = colonnes(sql, table);
  const marque = `INSERT INTO \`${table}\` VALUES`;
  let pos = sql.indexOf(marque);
  while (pos >= 0) {
    let i = pos + marque.length;
    for (;;) {
      while (i < sql.length && /\s|,/.test(sql[i])) i++;
      if (sql[i] !== "(") break;
      i++;
      const valeurs: Valeur[] = [];
      for (;;) {
        while (sql[i] === " ") i++;
        if (sql[i] === "'") {
          let s = "";
          i++;
          while (i < sql.length) {
            const c = sql[i];
            if (c === "\\") { const n = sql[i + 1]; s += n === "n" ? "\n" : n === "r" ? "" : n === "t" ? "\t" : n; i += 2; continue; }
            if (c === "'" && sql[i + 1] === "'") { s += "'"; i += 2; continue; }
            if (c === "'") { i++; break; }
            s += c;
            i++;
          }
          valeurs.push(s);
        } else {
          let j = i;
          while (sql[j] !== "," && sql[j] !== ")") j++;
          const brut = sql.slice(i, j).trim();
          valeurs.push(brut === "NULL" ? null : Number(brut));
          i = j;
        }
        if (sql[i] === ",") { i++; continue; }
        if (sql[i] === ")") { i++; break; }
      }
      yield Object.fromEntries(cols.map((c, k) => [c, valeurs[k] ?? null]));
    }
    pos = sql.indexOf(marque, i);
  }
}

export const n = (v: Valeur) => (typeof v === "number" ? v : Number(v) || 0);
export const lireCsv = (csv: string) => parse(csv, { columns: true, skip_empty_lines: true, relax_column_count: true, bom: true }) as Record<string, string>[];
export const slugLieu = (nom: string) => nom.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "").replace(/[’']/g, "-").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/** Contenu d'un dump SQL, compressé (.gz) ou non. */
export async function lireDump(fichier: string): Promise<string> {
  const brut = await readFile(fichier);
  return fichier.endsWith(".gz") ? gunzipSync(brut).toString("utf8") : brut.toString("utf8");
}

/** Capitales : leur carte n'a pas de zone d'exploration, mais un point qui s'y trouve leur appartient. */
export const VILLES = new Set(["hurlevent", "forgefer", "darnassus", "orgrimmar", "thunder-bluff", "fossoyeuse"]);

export type Position = { z: Record<string, [number, number][]>; d?: [string, string | null] };

/** Prépare la conversion des positions (tables de cartes du jeu lues une fois) pour un dump donné. */
export async function preparerPositions(sql: string, version: string, locale: "frFR" | "enUS" = "frFR") {
  // --- Positions : monstres et objets du décor, convertis sur les cartes des zones.
  const [assignCsv, uiMapCsv, mapCsv] = await Promise.all([tableCsv("UiMapAssignment", version), tableCsv("UiMap", version), tableCsv("Map", version, locale)]);
  const slugParUiMap = new Map<number, string>();
  for (const u of lireCsv(uiMapCsv)) {
    const s = slugLieu(u.Name_lang ?? "");
    if (u.Type === "3" && CARTES_JEU[s]) slugParUiMap.set(Number(u.ID), s);
  }
  const assignations = lireCsv(assignCsv)
    .filter((a) => slugParUiMap.has(Number(a.UiMapID)))
    .map((a) => ({ carte: Number(a.MapID), uiMap: Number(a.UiMapID), slug: slugParUiMap.get(Number(a.UiMapID))!, minX: +a.Region_0, minY: +a.Region_1, maxX: +a.Region_3, maxY: +a.Region_4, u0: +a.UiMin_0, v0: +a.UiMin_1, u1: +a.UiMax_0, v1: +a.UiMax_1 }))
    .sort((a, b) => (a.maxX - a.minX) * (a.maxY - a.minY) - (b.maxX - b.minX) * (b.maxY - b.minY));
  // Zones d'exploration de chaque carte (sous-zones dévoilées en jeu) : leur forme dit à quelle zone appartient un point.
  const [overlaysCsv, tuilesOverlayCsv, xArtCsv] = await Promise.all([tableCsv("WorldMapOverlay", version), tableCsv("WorldMapOverlayTile", version), tableCsv("UiMapXMapArt", version)]);
  const artParUiMap = new Map<number, number>();
  for (const l of lireCsv(xArtCsv)) if (l.PhaseID === "0" && !artParUiMap.has(Number(l.UiMapID))) artParUiMap.set(Number(l.UiMapID), Number(l.UiMapArtID));
  const overlaysParArt = new Map<number, { id: number; w: number; h: number; x: number; y: number }[]>();
  for (const o of lireCsv(overlaysCsv)) {
    const art = Number(o.UiMapArtID);
    overlaysParArt.set(art, [...(overlaysParArt.get(art) ?? []), { id: Number(o.ID), w: +o.TextureWidth, h: +o.TextureHeight, x: +o.OffsetX, y: +o.OffsetY }]);
  }
  const tuileOverlay = new Map<string, number>();
  for (const t of lireCsv(tuilesOverlayCsv)) if (t.LayerIndex === "0") tuileOverlay.set(`${t.WorldMapOverlayID}/${t.RowIndex}/${t.ColIndex}`, Number(t.FileDataID));
  const tuilesDecodees = new Map<number, Promise<{ largeur: number; hauteur: number; pixels: Buffer } | null>>();
  const tuile = (fichier: number) => {
    if (!tuilesDecodees.has(fichier)) {
      tuilesDecodees.set(fichier, fichierBrut(fichier, version).then((b) => (b.subarray(0, 4).toString("ascii") === "BLP2" ? decoderBlp(b) : null)).catch(() => null));
    }
    return tuilesDecodees.get(fichier)!;
  };
  /** Le point (en pixels de la carte de zone, 1002 × 668) tombe-t-il dans une zone d'exploration de cette carte ? */
  const dansExploration = async (uiMap: number, px: number, py: number): Promise<boolean> => {
    for (const o of overlaysParArt.get(artParUiMap.get(uiMap) ?? -1) ?? []) {
      if (px < o.x || px >= o.x + o.w || py < o.y || py >= o.y + o.h) continue;
      const lx = px - o.x, ly = py - o.y;
      const f = tuileOverlay.get(`${o.id}/${Math.floor(ly / 256)}/${Math.floor(lx / 256)}`);
      const img = f ? await tuile(f) : null;
      if (!img) continue;
      const tx = Math.min(img.largeur - 1, Math.floor(((lx % 256) / 256) * img.largeur));
      const ty = Math.min(img.hauteur - 1, Math.floor(((ly % 256) / 256) * img.hauteur));
      if (img.pixels[(ty * img.largeur + tx) * 4 + 3] > 40) return true;
    }
    return false;
  };

  /**
   * Point du monde (x vers le nord, y vers l'ouest) → zone et position en % de sa carte. Les cadres de zones voisines
   * se chevauchent : la zone retenue est celle dont une zone d'exploration contient le point ; si plusieurs zones dévoilées le
   * contiennent, celle des quêtes du PNJ (`preferees`) quand elle en fait partie, sinon la plus centrale ; à défaut, la plus
   * petite carte qui le contient (une capitale est entièrement dans sa zone).
   */
  type Candidat = { slug: string; uiMap: number; u: number; v: number; aire: number; centre: number };
  /** Cartes de zone dont le cadre contient le point, et celles où il tombe dans une zone dévoilée. */
  const analyser = async (carte: number, x: number, y: number): Promise<{ candidats: Candidat[]; explores: Candidat[] }> => {
    const candidats: Candidat[] = [];
    for (const a of assignations) {
      if (a.carte !== carte || x < a.minX || x > a.maxX || y < a.minY || y > a.maxY) continue;
      const fu = (a.maxY - y) / (a.maxY - a.minY);
      const fv = (a.maxX - x) / (a.maxX - a.minX);
      const u = a.u0 + (a.u1 - a.u0) * fu;
      const v = a.v0 + (a.v1 - a.v0) * fv;
      if (u < 0 || u > 1 || v < 0 || v > 1) continue;
      candidats.push({ slug: a.slug, uiMap: a.uiMap, u, v, aire: (a.maxX - a.minX) * (a.maxY - a.minY), centre: Math.min(fu, 1 - fu, fv, 1 - fv) });
    }
    const explores: Candidat[] = [];
    if (candidats.length > 1 && !candidats.some((c) => VILLES.has(c.slug))) {
      for (const c of candidats) if (await dansExploration(c.uiMap, c.u * 1002, c.v * 668)) explores.push(c);
    }
    return { candidats, explores };
  };
  /** Le point est-il dévoilé sur plusieurs cartes (cadres qui se chevauchent) ? */
  const douteux = (a: { explores: Candidat[] }) => a.explores.length > 1;
  const choisir = (a: { candidats: Candidat[]; explores: Candidat[] }, preferees?: Set<string>): Candidat | null => {
    const { candidats, explores } = a;
    if (!candidats.length) return null;
    if (candidats.length === 1) return candidats[0];
    const ville = candidats.find((c) => VILLES.has(c.slug));
    if (ville) return ville;
    // Le cadre de la carte des Tarides recouvre la Vallée des Épreuves, dévoilée sur les deux cartes : la zone des quêtes du
    // PNJ (ou de ses voisins) tranche, avant la position la plus centrale.
    const voulues = preferees ? explores.filter((c) => preferees.has(c.slug)) : [];
    return (voulues.length ? voulues : explores).sort((p, q) => q.centre - p.centre)[0] ?? [...candidats].sort((p, q) => p.aire - q.aire)[0];
  };
  const enPourcents = (c: Candidat): [string, number, number] => [c.slug, Math.round(c.u * 1000) / 10, Math.round(c.v * 1000) / 10];

  /**
   * Point du monde (x vers le nord, y vers l'ouest) → zone et position en % de sa carte. Les cadres de zones voisines
   * se chevauchent : la zone retenue est celle dont une zone d'exploration contient le point ; si plusieurs zones dévoilées le
   * contiennent, celle des quêtes du PNJ (`preferees`) quand elle en fait partie, sinon la plus centrale ; à défaut, la plus
   * petite carte qui le contient (une capitale est entièrement dans sa zone).
   */
  const surCarte = async (carte: number, x: number, y: number, preferees?: Set<string>): Promise<[string, number, number] | null> => {
    const c = choisir(await analyser(carte, x, y), preferees);
    return c ? enPourcents(c) : null;
  };
  const instances = new Map(lireCsv(mapCsv).map((m) => [Number(m.ID), m.MapName_lang]));
  const ecranDeCarte = new Map(ECRANS.map((e) => [e.carte as number, e.slug]));

  /** Rayon (unités du monde, environ des mètres) dans lequel un PNJ douteux prend la zone de ses voisins déjà tranchés. */
  const RAYON_VOISINS = 150;
  /**
   * `preferences` : pour chaque créature ou objet, les zones de ses quêtes. Un point dévoilé sur deux cartes prend la zone de
   * ses quêtes ; à défaut (dresseur, quête de classe sans zone), celle des PNJ voisins tranchés ainsi ; à défaut, la plus centrale.
   */
  const positions = async (table: string, spawnTable: string, garder: Set<number>, preferences?: Map<number, Set<string>>) => {
    const parSpawn = new Map<number, number>();
    for (const l of lignes(sql, spawnTable)) parSpawn.set(n(l.guid), n(l.entry));
    const res = new Map<number, { z: Record<string, [number, number][]>; d?: [string, string | null] }>();
    const ajouter = (id: number, p: [string, number, number]) => {
      const e = res.get(id) ?? { z: {} };
      const liste = (e.z[p[0]] ??= []);
      // Points trop proches fusionnés, 40 au plus par zone : la carte reste lisible et le fichier léger.
      if (liste.length < 40 && !liste.some(([u, v]) => Math.abs(u - p[1]) < 1.2 && Math.abs(v - p[2]) < 1.2)) liste.push([p[1], p[2]]);
      res.set(id, e);
    };
    const reperes: { carte: number; x: number; y: number; slug: string }[] = [];
    const enAttente: { id: number; carte: number; x: number; y: number; a: Awaited<ReturnType<typeof analyser>> }[] = [];
    for (const l of lignes(sql, table)) {
      const id = n(l.id) || parSpawn.get(n(l.guid)) || 0;
      if (!id || !garder.has(id)) continue;
      if (!res.has(id)) res.set(id, { z: {} });
      const carte = n(l.map);
      if (carte === 0 || carte === 1) {
        const x = n(l.position_x), y = n(l.position_y);
        const a = await analyser(carte, x, y);
        const pref = preferences?.get(id);
        if (douteux(a) && !(pref && a.explores.some((c) => pref.has(c.slug)))) {
          enAttente.push({ id, carte, x, y, a });
          continue;
        }
        const c = choisir(a, pref);
        if (!c) continue;
        if (douteux(a)) reperes.push({ carte, x, y, slug: c.slug });
        ajouter(id, enPourcents(c));
      } else if (instances.has(carte) && !res.get(id)!.d) {
        res.get(id)!.d = [instances.get(carte)!.replace(/^<[^>]+>/, ""), ecranDeCarte.get(carte) ?? null];
      }
    }
    for (const p of enAttente) {
      const proche = reperes
        .filter((r) => r.carte === p.carte && p.a.explores.some((c) => c.slug === r.slug))
        .map((r) => ({ r, d: Math.hypot(r.x - p.x, r.y - p.y) }))
        .filter((r) => r.d < RAYON_VOISINS)
        .sort((a, b) => a.d - b.d)[0];
      const c = choisir(p.a, proche ? new Set([proche.r.slug]) : undefined);
      if (c) ajouter(p.id, enPourcents(c));
    }
    return res;
  };
  return {
    surCarte,
    instances,
    positions: positions as (table: string, spawnTable: string, garder: Set<number>, preferences?: Map<number, Set<string>>) => Promise<Map<number, Position>>,
    tuilesLues: () => tuilesDecodees.size,
  };
}
