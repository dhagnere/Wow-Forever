import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { gunzipSync, gzipSync } from "node:zlib";
import { parse } from "csv-parse/sync";
import { CARTES_JEU } from "@/content/cartes-jeu";
import { ECRANS } from "@/config/ecrans";
import { derniereVersion, fichierBrut, tableCsv } from "../objets/wago";
import { decoderBlp } from "../objets/blp";
import { lancer } from "./_lanceur";

/**
 * « Où le trouver » pour chaque objet : monstres et taux de butin, coffres et gisements, marchands, quêtes,
 * avec la position des monstres sur les cartes du jeu.
 *
 *   npm run base:butin -- <dump CMaNGOS classic-db (.sql ou .sql.gz)> <dossier db_world d'AzerothCore>
 *
 * Données de l'Azeroth d'origine (1.12), base communautaire libre CMaNGOS classic-db (GPL v3) ; noms français des
 * créatures, objets du décor et quêtes : AzerothCore (GPL v2). Positions converties sur les cartes du jeu (UiMapAssignment).
 * Résultat : modules/veille/objets/donnees/butin.json.gz, lu par la fiche de chaque objet.
 */

type Valeur = string | number | null;

/** Colonnes d'une table, lues dans son CREATE TABLE. */
function colonnes(sql: string, table: string): string[] {
  const debut = sql.indexOf(`CREATE TABLE \`${table}\``);
  if (debut < 0) throw new Error(`Table ${table} absente du fichier.`);
  const fin = sql.indexOf(") ENGINE", debut);
  return [...sql.slice(debut, fin).matchAll(/^\s+`([A-Za-z0-9_]+)`/gm)].map((m) => m[1]);
}

/** Lignes de toutes les instructions INSERT d'une table (analyse des valeurs SQL : nombres, NULL, chaînes échappées). */
function* lignes(sql: string, table: string): Generator<Record<string, Valeur>> {
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

const n = (v: Valeur) => (typeof v === "number" ? v : Number(v) || 0);
const lireCsv = (csv: string) => parse(csv, { columns: true, skip_empty_lines: true, relax_column_count: true, bom: true }) as Record<string, string>[];
const slugLieu = (nom: string) => nom.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "").replace(/[’']/g, "-").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

interface Ligne { entry: number; item: number; chance: number; groupe: number; ref: number; max: number }

lancer("base:butin", async () => {
  const [fichierDump, dossierLocales] = process.argv.slice(2);
  if (!fichierDump || !dossierLocales) throw new Error("Usage : npm run base:butin -- <dump CMaNGOS> <dossier db_world AzerothCore>");
  const brut = await readFile(fichierDump);
  const sql = fichierDump.endsWith(".gz") ? gunzipSync(brut).toString("utf8") : brut.toString("utf8");
  const locale = async (f: string) => readFile(path.join(dossierLocales, f), "utf8");
  const version = await derniereVersion();

  // Objets connus de Forever : seuls ceux-là sont gardés.
  const idsForever = new Set(lireCsv(await tableCsv("ItemSparse", version)).map((l) => Number(l.ID)));

  // --- Noms français.
  const nomsCreatures = new Map<number, string>();
  const nomsObjetsDecor = new Map<number, string>();
  const titresQuetes = new Map<number, string>();
  for (const l of lignes(await locale("creature_template_locale.sql"), "creature_template_locale")) if (l.locale === "frFR" && l.Name) nomsCreatures.set(n(l.entry), String(l.Name));
  for (const l of lignes(await locale("gameobject_template_locale.sql"), "gameobject_template_locale")) if (l.locale === "frFR" && l.name) nomsObjetsDecor.set(n(l.entry), String(l.name));
  for (const l of lignes(await locale("quest_template_locale.sql"), "quest_template_locale")) if (l.locale === "frFR" && l.Title) titresQuetes.set(n(l.ID), String(l.Title));

  // --- Créatures.
  const creatures = new Map<number, { nom: string; min: number; max: number; rang: number; loot: number; vendeur: number }>();
  for (const l of lignes(sql, "creature_template")) {
    const id = n(l.Entry);
    creatures.set(id, { nom: nomsCreatures.get(id) ?? String(l.Name ?? ""), min: n(l.MinLevel), max: n(l.MaxLevel), rang: n(l.Rank), loot: n(l.LootId), vendeur: n(l.VendorTemplateId) });
  }

  // --- Tables de butin.
  const tableButin = (nom: string) => {
    const m = new Map<number, Ligne[]>();
    for (const l of lignes(sql, nom)) {
      const ligne = { entry: n(l.entry), item: n(l.item), chance: n(l.ChanceOrQuestChance), groupe: n(l.groupid), ref: n(l.mincountOrRef), max: Math.max(1, n(l.maxcount)) };
      m.set(ligne.entry, [...(m.get(ligne.entry) ?? []), ligne]);
    }
    return m;
  };
  const butinCreatures = tableButin("creature_loot_template");
  const butinReferences = tableButin("reference_loot_template");
  const butinDecor = tableButin("gameobject_loot_template");

  // Références partagées par beaucoup de monstres : butin aléatoire « mondial », pas listé monstre par monstre.
  const usageReference = new Map<number, Set<number>>();
  for (const [entry, rows] of butinCreatures) for (const r of rows) if (r.ref < 0) usageReference.set(-r.ref, (usageReference.get(-r.ref) ?? new Set()).add(entry));
  const MONDIALE = 40;

  /** Probabilité (en %) de chaque objet pour une entrée de butin, groupes et références compris. */
  function tirage(table: Map<number, Ligne[]>, entry: number, profondeur = 0, ignorerMondiales = false): Map<number, { p: number; quete: boolean }> {
    const res = new Map<number, { p: number; quete: boolean }>();
    const ajouter = (item: number, p: number, quete: boolean) => {
      const a = res.get(item);
      // Deux chances indépendantes de l'obtenir se combinent : 1 - (1 - a)(1 - b).
      const avant = (a?.p ?? 0) / 100;
      res.set(item, { p: 100 * (1 - (1 - avant) * (1 - Math.min(100, p) / 100)), quete: (a?.quete ?? false) || quete });
    };
    const rows = table.get(entry) ?? [];
    const groupes = new Map<number, Ligne[]>();
    for (const r of rows) {
      if (r.ref < 0) {
        if (profondeur > 2 || (ignorerMondiales && (usageReference.get(-r.ref)?.size ?? 0) > MONDIALE)) continue;
        // La référence est tirée avec sa chance, puis « max » fois : probabilité d'obtenir l'objet au moins une fois.
        const pRef = (Math.abs(r.chance) || 100) / 100;
        for (const [item, v] of tirage(butinReferences, -r.ref, profondeur + 1)) ajouter(item, 100 * pRef * (1 - Math.pow(1 - v.p / 100, r.max)), v.quete);
      } else if (r.groupe > 0) {
        groupes.set(r.groupe, [...(groupes.get(r.groupe) ?? []), r]);
      } else if (r.chance !== 0) {
        ajouter(r.item, Math.abs(r.chance), r.chance < 0);
      }
    }
    for (const g of groupes.values()) {
      const explicites = g.filter((r) => r.chance !== 0);
      const somme = explicites.reduce((s, r) => s + Math.abs(r.chance), 0);
      const zeros = g.filter((r) => r.chance === 0);
      for (const r of explicites) ajouter(r.item, Math.abs(r.chance), r.chance < 0);
      for (const r of zeros) ajouter(r.item, Math.max(0, 100 - somme) / zeros.length, false);
    }
    return res;
  }

  // --- Positions : monstres et objets du décor, convertis sur les cartes des zones.
  const [assignCsv, uiMapCsv, mapCsv] = await Promise.all([tableCsv("UiMapAssignment", version), tableCsv("UiMap", version), tableCsv("Map", version)]);
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
   * se chevauchent : la zone retenue est celle dont une zone d'exploration contient le point ; à défaut, la plus petite
   * carte qui le contient (une capitale est entièrement dans sa zone).
   */
  const surCarte = async (carte: number, x: number, y: number): Promise<[string, number, number] | null> => {
    const candidats: { slug: string; uiMap: number; u: number; v: number; aire: number; centre: number }[] = [];
    for (const a of assignations) {
      if (a.carte !== carte || x < a.minX || x > a.maxX || y < a.minY || y > a.maxY) continue;
      const fu = (a.maxY - y) / (a.maxY - a.minY);
      const fv = (a.maxX - x) / (a.maxX - a.minX);
      const u = a.u0 + (a.u1 - a.u0) * fu;
      const v = a.v0 + (a.v1 - a.v0) * fv;
      if (u < 0 || u > 1 || v < 0 || v > 1) continue;
      candidats.push({ slug: a.slug, uiMap: a.uiMap, u, v, aire: (a.maxX - a.minX) * (a.maxY - a.minY), centre: Math.min(fu, 1 - fu, fv, 1 - fv) });
    }
    if (!candidats.length) return null;
    let choisi = candidats.length === 1 ? candidats[0] : undefined;
    if (!choisi) {
      const explores: typeof candidats = [];
      for (const c of candidats) if (await dansExploration(c.uiMap, c.u * 1002, c.v * 668)) explores.push(c);
      choisi = explores.length ? explores.sort((p, q) => q.centre - p.centre)[0] : [...candidats].sort((p, q) => p.aire - q.aire)[0];
    }
    return [choisi.slug, Math.round(choisi.u * 1000) / 10, Math.round(choisi.v * 1000) / 10];
  };
  const instances = new Map(lireCsv(mapCsv).map((m) => [Number(m.ID), m.MapName_lang]));
  const ecranDeCarte = new Map(ECRANS.map((e) => [e.carte as number, e.slug]));

  const positions = async (table: string, spawnTable: string, garder: Set<number>) => {
    const parSpawn = new Map<number, number>();
    for (const l of lignes(sql, spawnTable)) parSpawn.set(n(l.guid), n(l.entry));
    const res = new Map<number, { z: Record<string, [number, number][]>; d?: [string, string | null] }>();
    for (const l of lignes(sql, table)) {
      const id = n(l.id) || parSpawn.get(n(l.guid)) || 0;
      if (!id || !garder.has(id)) continue;
      const e = res.get(id) ?? { z: {} };
      const carte = n(l.map);
      if (carte === 0 || carte === 1) {
        const p = await surCarte(carte, n(l.position_x), n(l.position_y));
        if (p) {
          const liste = (e.z[p[0]] ??= []);
          // Points trop proches fusionnés, 40 au plus par zone : la carte reste lisible et le fichier léger.
          if (liste.length < 40 && !liste.some(([u, v]) => Math.abs(u - p[1]) < 1.2 && Math.abs(v - p[2]) < 1.2)) liste.push([p[1], p[2]]);
        }
      } else if (instances.has(carte) && !e.d) {
        e.d = [instances.get(carte)!.replace(/^<[^>]+>/, ""), ecranDeCarte.get(carte) ?? null];
      }
      res.set(id, e);
    }
    return res;
  };

  // --- Sources par objet.
  type Sources = { m: [number, number, number][]; o: [number, number][]; v: number[]; q: number[]; a?: [number, number, number] };
  const objets = new Map<number, Sources>();
  const sources = (item: number) => {
    if (!objets.has(item)) objets.set(item, { m: [], o: [], v: [], q: [] });
    return objets.get(item)!;
  };

  // Monstres : chaque monstre dont l'entrée de butin contient l'objet.
  const creaturesParLoot = new Map<number, number[]>();
  for (const [id, c] of creatures) if (c.loot) creaturesParLoot.set(c.loot, [...(creaturesParLoot.get(c.loot) ?? []), id]);
  for (const [loot, ids] of creaturesParLoot) {
    for (const [item, v] of tirage(butinCreatures, loot, 0, true)) {
      if (!idsForever.has(item) || v.p <= 0) continue;
      for (const id of ids) sources(item).m.push([id, Math.round(v.p * 100) / 100, v.quete ? 1 : 0]);
    }
  }
  // Butin aléatoire mondial : fourchette de niveaux des monstres qui y ont accès.
  for (const [ref, entrees] of usageReference) {
    if (entrees.size <= MONDIALE) continue;
    let min = 99, max = 0, nb = 0;
    for (const e of entrees) for (const id of creaturesParLoot.get(e) ?? []) { const c = creatures.get(id)!; min = Math.min(min, c.min); max = Math.max(max, c.max); nb++; }
    for (const [item] of tirage(butinReferences, ref, 1)) {
      if (!idsForever.has(item)) continue;
      const s = sources(item);
      s.a = s.a ? [Math.min(s.a[0], min), Math.max(s.a[1], max), s.a[2] + nb] : [min, max, nb];
    }
  }
  // Objets du décor : coffres, gisements, plantes (type 3 : l'entrée de butin est data1).
  const decor = new Map<number, string>();
  for (const l of lignes(sql, "gameobject_template")) {
    if (n(l.type) !== 3 || !n(l.data1)) continue;
    const id = n(l.entry);
    decor.set(id, nomsObjetsDecor.get(id) ?? String(l.name ?? ""));
    for (const [item, v] of tirage(butinDecor, n(l.data1), 0, true)) if (idsForever.has(item) && v.p > 0) sources(item).o.push([id, Math.round(v.p * 100) / 100]);
  }
  // Marchands, directs ou par modèle de vente.
  const parModele = new Map<number, number[]>();
  for (const l of lignes(sql, "npc_vendor_template")) parModele.set(n(l.entry), [...(parModele.get(n(l.entry)) ?? []), n(l.item)]);
  for (const l of lignes(sql, "npc_vendor")) if (idsForever.has(n(l.item))) sources(n(l.item)).v.push(n(l.entry));
  for (const [id, c] of creatures) for (const item of parModele.get(c.vendeur) ?? []) if (idsForever.has(item)) sources(item).v.push(id);
  // Quêtes : récompenses, et qui les donne.
  const quetes = new Map<number, { titre: string; niveau: number; pnj: number[] }>();
  for (const l of lignes(sql, "quest_template")) {
    const id = n(l.entry);
    const recompenses = [1, 2, 3, 4, 5, 6].map((k) => n(l[`RewChoiceItemId${k}`])).concat([1, 2, 3, 4].map((k) => n(l[`RewItemId${k}`]))).filter((x) => x > 0);
    if (!recompenses.length) continue;
    quetes.set(id, { titre: titresQuetes.get(id) ?? String(l.Title ?? ""), niveau: n(l.QuestLevel), pnj: [] });
    for (const item of recompenses) if (idsForever.has(item)) sources(item).q.push(id);
  }
  for (const l of lignes(sql, "creature_questrelation")) quetes.get(n(l.quest))?.pnj.push(n(l.id));

  // --- Assemblage : sources classées, entités réellement citées seulement.
  const citeesCreatures = new Set<number>();
  const citeesDecor = new Set<number>();
  const citeesQuetes = new Set<number>();
  const sortie: Record<number, Sources & { mt?: number }> = {};
  for (const [item, s] of objets) {
    const m = [...new Map(s.m.map((x) => [x[0], x])).values()].sort((a, b) => b[1] - a[1]);
    const o = [...new Map(s.o.map((x) => [x[0], x])).values()].sort((a, b) => b[1] - a[1]).slice(0, 8);
    const v = [...new Set(s.v)].slice(0, 8);
    const q = [...new Set(s.q)].slice(0, 6);
    const r: Sources & { mt?: number } = { m: m.slice(0, 10), o, v, q, ...(s.a ? { a: s.a } : {}), ...(m.length > 10 ? { mt: m.length } : {}) };
    if (!r.m.length && !r.o.length && !r.v.length && !r.q.length && !r.a) continue;
    r.m.forEach((x) => citeesCreatures.add(x[0]));
    r.v.forEach((x) => citeesCreatures.add(x));
    r.o.forEach((x) => citeesDecor.add(x[0]));
    r.q.forEach((x) => { citeesQuetes.add(x); quetes.get(x)?.pnj.slice(0, 2).forEach((p) => citeesCreatures.add(p)); });
    sortie[item] = r;
  }
  // Positions des seules entités citées : moins de calculs, et des tuiles de carte lues au besoin.
  const posCreatures = await positions("creature", "creature_spawn_entry", citeesCreatures);
  const posDecor = await positions("gameobject", "gameobject_spawn_entry", citeesDecor);
  console.log(`${tuilesDecodees.size} tuiles d'exploration lues pour départager les zones voisines.`);
  const fiche = (id: number, nom: string, pos?: { z: Record<string, [number, number][]>; d?: [string, string | null] }) => ({ n: nom, ...(pos && Object.keys(pos.z).length ? { z: pos.z } : {}), ...(pos?.d ? { d: pos.d } : {}) });
  const donnees = {
    version: { jeu: version, source: "CMaNGOS classic-db (GPL v3), noms français AzerothCore (GPL v2)" },
    creatures: Object.fromEntries([...citeesCreatures].filter((id) => creatures.has(id)).map((id) => {
      const c = creatures.get(id)!;
      return [id, { ...fiche(id, c.nom, posCreatures.get(id)), nv: [c.min, c.max], r: c.rang }];
    })),
    decor: Object.fromEntries([...citeesDecor].map((id) => [id, fiche(id, decor.get(id) ?? "", posDecor.get(id))])),
    quetes: Object.fromEntries([...citeesQuetes].filter((id) => quetes.has(id)).map((id) => { const q = quetes.get(id)!; return [id, { n: q.titre, nv: q.niveau, p: q.pnj.slice(0, 2) }]; })),
    objets: sortie,
  };
  const dossier = path.join(process.cwd(), "modules/veille/objets/donnees");
  await mkdir(dossier, { recursive: true });
  const json = JSON.stringify(donnees);
  await writeFile(path.join(dossier, "butin.json.gz"), gzipSync(json, { level: 9 }));
  console.log(`${Object.keys(sortie).length} objets avec au moins une source ; ${citeesCreatures.size} créatures, ${citeesDecor.size} objets du décor, ${citeesQuetes.size} quêtes. ${(json.length / 1e6).toFixed(1)} Mo de données.`);
});
