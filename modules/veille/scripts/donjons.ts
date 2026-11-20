import { existsSync, readdirSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { gunzipSync } from "node:zlib";
import { lancer } from "./_lanceur";
import { lignes, lireCsv, lireDump, n } from "./_bases-libres";
import { derniereVersion, tableCsv } from "../objets/wago";

/**
 * Donjons de l'Azeroth d'origine : boss dans l'ordre des rencontres, butin de chacun, monstres rares, entrées sur la
 * carte de la zone et quêtes du donjon.
 *
 *   npm run base:donjons            (sans chemin : dossier « sources » voisin du projet, comme base:quetes)
 *   npm run base:donjons -- <dump CMaNGOS classic-db (.sql ou .sql.gz)> <dossier db_world d'AzerothCore>
 *
 * Sources libres : CMaNGOS classic-db (GPL v3) pour les créatures, leurs apparitions, le butin et les quêtes ;
 * AzerothCore (GPL v2) pour les rencontres de chaque donjon (instance_encounters), les entrées (areatrigger) et les noms
 * français. Les positions des entrées sont converties sur les cartes des zones d'après les monstres dont on connaît à la
 * fois la position dans le monde (CMaNGOS) et sur la carte (modules/veille/objets/donnees/butin.json.gz) : aucune autre
 * source n'est lue. Le butin est celui de l'Azeroth d'origine : la page lit chaque objet dans la base d'objets du site
 * (fichiers de Forever) et, pour ceux que Forever ne décrit pas, affiche le nom et la qualité gardés ici (« objets »),
 * signalés comme à confirmer ; un relevé en jeu (TaverneTrace) le remplace boss par boss. Les quêtes sont filtrées sur
 * les fichiers de Forever (table QuestV2 de wago.tools) quand wago.tools répond ; sinon un donjon déjà filtré garde sa
 * liste précédente et les autres sont marquées « à vérifier ».
 * Résultat : content/donjons-jeu.json (noms français et anglais).
 */

/** Donjons du site : identifiant de la carte de l'instance, zone de l'entrée (cartes du jeu), zone de la quête (AreaTable). */
const DONJONS: { slug: string; carte: number; zones: string[]; aire: number[] }[] = [
  { slug: "gouffre-de-ragefeu", carte: 389, zones: ["orgrimmar"], aire: [2437] },
  { slug: "mortemines", carte: 36, zones: ["marche-de-l-ouest"], aire: [1581] },
  { slug: "cavernes-des-lamentations", carte: 43, zones: ["les-tarides"], aire: [718] },
  { slug: "donjon-d-ombrecroc", carte: 33, zones: ["foret-des-pins-argentes"], aire: [209] },
  { slug: "profondeurs-de-brassenoire", carte: 48, zones: ["orneval"], aire: [719] },
  { slug: "prison", carte: 34, zones: ["hurlevent"], aire: [717] },
  { slug: "gnomeregan", carte: 90, zones: ["dun-morogh"], aire: [721] },
  { slug: "kraal-de-tranchebauge", carte: 47, zones: ["les-tarides"], aire: [491] },
  { slug: "monastere-ecarlate", carte: 189, zones: ["clairieres-de-tirisfal"], aire: [796] },
  { slug: "souilles-de-tranchebauge", carte: 129, zones: ["les-tarides"], aire: [722] },
  { slug: "uldaman", carte: 70, zones: ["terres-ingrates"], aire: [1337] },
  { slug: "zul-farrak", carte: 209, zones: ["tanaris"], aire: [1176] },
  { slug: "maraudon", carte: 349, zones: ["desolace"], aire: [2100] },
  { slug: "temple-englouti", carte: 109, zones: ["marais-des-chagrins"], aire: [1477, 1417] },
  { slug: "profondeurs-de-rochenoire", carte: 230, zones: ["gorge-des-vents-brulants", "steppes-ardentes"], aire: [1584] },
  { slug: "pic-de-rochenoire", carte: 229, zones: ["gorge-des-vents-brulants", "steppes-ardentes"], aire: [1583] },
  { slug: "hache-tripes", carte: 429, zones: ["feralas"], aire: [2557] },
  { slug: "scholomance", carte: 289, zones: ["maleterres-de-l-ouest"], aire: [2057] },
  { slug: "stratholme", carte: 329, zones: ["maleterres-de-l-est"], aire: [2017] },
  // raids de l'Azeroth d'origine (l'entrée du Cœur du Magma et du Repaire de l'Aile noire est dans une autre instance)
  { slug: "coeur-du-magma", carte: 409, zones: [], aire: [2717] },
  { slug: "repaire-d-onyxia", carte: 249, zones: ["marecage-d-aprefange"], aire: [2159] },
  { slug: "repaire-de-l-aile-noire", carte: 469, zones: [], aire: [2677] },
  { slug: "zul-gurub", carte: 309, zones: ["vallee-de-strangleronce"], aire: [1977] },
  { slug: "ruines-d-ahn-qiraj", carte: 509, zones: ["silithus"], aire: [3429] },
  { slug: "temple-d-ahn-qiraj", carte: 531, zones: ["silithus"], aire: [3428] },
  { slug: "naxxramas", carte: 533, zones: ["maleterres-de-l-est"], aire: [3456] },
];

/** Butin gardé : objets d'au moins 1 % de chance (les objets de quête à 100 % comptent). */
const SEUIL = 1;

interface Ligne { entry: number; item: number; chance: number; groupe: number; ref: number; max: number }

function argumentsDonjons(args: string[]): { fichierDump: string; dossierLocales: string } {
  const positionnels = args.filter((a) => !a.startsWith("--"));
  if (positionnels.some((a) => /^<.*>$/.test(a))) throw new Error("Chevrons reçus : remplace <…> par les vrais chemins, ou lance simplement « npm run base:donjons ».");
  let [fichierDump, dossierLocales] = positionnels;
  const sources = process.env.SOURCES_QUETES ?? path.resolve(process.cwd(), "..", "sources");
  if (!fichierDump) {
    const dossier = path.join(sources, "classic-db", "Full_DB");
    const dump = existsSync(dossier) ? readdirSync(dossier).find((f) => /\.sql(\.gz)?$/.test(f)) : undefined;
    if (!dump) throw new Error(`Dump CMaNGOS introuvable dans ${dossier}. Donne son chemin : npm run base:donjons -- "<fichier .sql.gz>" "<dossier db_world>"`);
    fichierDump = path.join(dossier, dump);
  }
  dossierLocales ??= path.join(sources, "azerothcore-wotlk", "data", "sql", "base", "db_world");
  for (const f of ["instance_encounters.sql", "areatrigger.sql", "areatrigger_teleport.sql", "creature_template_locale.sql", "quest_template_locale.sql", "item_template_locale.sql"]) {
    if (!existsSync(path.join(dossierLocales, f))) throw new Error(`${f} absent de ${dossierLocales}. Dans le clone d'AzerothCore : git sparse-checkout set data/sql/base/db_world`);
  }
  console.log(`Dump : ${fichierDump}\nAzerothCore : ${dossierLocales}`);
  return { fichierDump, dossierLocales };
}

/** Ajustement affine par moindres carrés : y ≈ a·x + b. */
function droite(pts: [number, number][]): { a: number; b: number; ecart: number } | null {
  if (pts.length < 6) return null;
  const k = pts.length;
  const mx = pts.reduce((s, p) => s + p[0], 0) / k;
  const my = pts.reduce((s, p) => s + p[1], 0) / k;
  let sxy = 0, sxx = 0;
  for (const [x, y] of pts) { sxy += (x - mx) * (y - my); sxx += (x - mx) ** 2; }
  if (!sxx) return null;
  const a = sxy / sxx, b = my - a * mx;
  const ecart = Math.sqrt(pts.reduce((s, [x, y]) => s + (y - (a * x + b)) ** 2, 0) / k);
  return { a, b, ecart };
}

lancer("base:donjons", async () => {
  const { fichierDump, dossierLocales } = argumentsDonjons(process.argv.slice(2));
  const sql = await lireDump(fichierDump);
  const ac = async (f: string) => readFile(path.join(dossierLocales, f), "utf8");

  // --- Noms français (AzerothCore).
  const nomsFr = new Map<number, string>();
  for (const l of lignes(await ac("creature_template_locale.sql"), "creature_template_locale")) if (l.locale === "frFR" && l.Name) nomsFr.set(n(l.entry), String(l.Name));
  const titresFr = new Map<number, string>();
  for (const l of lignes(await ac("quest_template_locale.sql"), "quest_template_locale")) if (l.locale === "frFR" && l.Title) titresFr.set(n(l.ID), String(l.Title));

  // --- Créatures et leurs apparitions.
  const creatures = new Map<number, { en: string; min: number; max: number; rang: number; loot: number }>();
  for (const l of lignes(sql, "creature_template")) {
    creatures.set(n(l.Entry), { en: String(l.Name ?? ""), min: n(l.MinLevel), max: n(l.MaxLevel), rang: n(l.Rank), loot: n(l.LootId) });
  }
  const spawns = new Map<number, { carte: number; x: number; y: number }[]>();
  for (const l of lignes(sql, "creature")) {
    const id = n(l.id);
    spawns.set(id, [...(spawns.get(id) ?? []), { carte: n(l.map), x: Number(l.position_x), y: Number(l.position_y) }]);
  }

  // --- Butin (même calcul que base:butin : groupes, références, chances combinées).
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
  const usageReference = new Map<number, Set<number>>();
  for (const [entry, rows] of butinCreatures) for (const r of rows) if (r.ref < 0) usageReference.set(-r.ref, (usageReference.get(-r.ref) ?? new Set()).add(entry));
  const MONDIALE = 40;
  function tirage(table: Map<number, Ligne[]>, entry: number, profondeur = 0): Map<number, { p: number; quete: boolean }> {
    const res = new Map<number, { p: number; quete: boolean }>();
    const ajouter = (item: number, p: number, quete: boolean) => {
      const a = res.get(item);
      const avant = (a?.p ?? 0) / 100;
      res.set(item, { p: 100 * (1 - (1 - avant) * (1 - Math.min(100, p) / 100)), quete: (a?.quete ?? false) || quete });
    };
    const groupes = new Map<number, Ligne[]>();
    for (const r of table.get(entry) ?? []) {
      if (r.ref < 0) {
        // butin aléatoire « mondial » (partagé par plus de 40 monstres) : pas propre au boss, laissé de côté
        if (profondeur > 2 || (usageReference.get(-r.ref)?.size ?? 0) > MONDIALE) continue;
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
  // Objets (CMaNGOS, noms français d'AzerothCore) : le butin gris et blanc n'est pas listé. Nom, qualité et emplacement
  // sont gardés pour les objets que la base du site (fichiers de Forever) ne décrit pas.
  const qualite = new Map<number, number>();
  const objetsOrigine = new Map<number, { en: string; q: number; c: number; sc: number; s: number; nv: number; req: number }>();
  for (const l of lignes(sql, "item_template")) {
    const id = n(l.entry);
    qualite.set(id, n(l.Quality));
    objetsOrigine.set(id, { en: String(l.name ?? ""), q: n(l.Quality), c: n(l.class), sc: n(l.subclass), s: n(l.InventoryType), nv: n(l.ItemLevel), req: n(l.RequiredLevel) });
  }
  const objetsFr = new Map<number, string>();
  for (const l of lignes(await ac("item_template_locale.sql"), "item_template_locale")) if (l.locale === "frFR" && l.Name) objetsFr.set(n(l.ID), String(l.Name));
  const butinDe = (creature: number) => {
    const c = creatures.get(creature);
    if (!c?.loot) return [];
    return [...tirage(butinCreatures, c.loot)]
      .filter(([item, v]) => v.p >= SEUIL && ((qualite.get(item) ?? 0) >= 2 || v.quete))
      .sort((a, b) => (qualite.get(b[0]) ?? 0) - (qualite.get(a[0]) ?? 0) || b[1].p - a[1].p)
      .map(([item, v]) => ({ i: item, p: Math.round(v.p * 10) / 10, ...(v.quete ? { q: 1 } : {}) }));
  };

  // --- Rencontres de chaque donjon, dans l'ordre (AzerothCore, d'après DungeonEncounter.dbc).
  // Une rencontre créditée par un sort porte le nom du boss dans son commentaire ; un boss invoqué (sans apparition
  // fixe, comme Ragnaros) prend la carte d'une rencontre voisine. Les versions 10 et 25 joueurs ne comptent qu'une fois.
  const parNomEn = new Map<string, number>();
  for (const [id, c] of creatures) if (c.rang === 3 || !parNomEn.has(c.en)) parNomEn.set(c.en, id);
  const parCarte = new Map<number, number[]>();
  const rencontres = [...lignes(await ac("instance_encounters.sql"), "instance_encounters")]
    .map((l) => {
      const id = n(l.creditType) === 0 ? n(l.creditEntry) : parNomEn.get(String(l.comment ?? "").trim()) ?? 0;
      return { entry: n(l.entry), id, carte: spawns.get(id)?.[0]?.carte as number | undefined, derniere: n(l.lastEncounterDungeon) > 0 };
    })
    .sort((a, b) => a.entry - b.entry);
  // boss sans apparition fixe : carte de la rencontre voisine du même donjon (la dernière rencontre d'un donjon ferme le bloc)
  for (let change = true; change; ) {
    change = false;
    for (let k = 0; k < rencontres.length; k++) {
      const r = rencontres[k];
      if (r.carte !== undefined || !creatures.has(r.id)) continue;
      const avant = rencontres[k - 1], apres = rencontres[k + 1];
      if (avant && avant.entry === r.entry - 1 && !avant.derniere && avant.carte !== undefined) r.carte = avant.carte;
      else if (apres && apres.entry === r.entry + 1 && !r.derniere && apres.carte !== undefined) r.carte = apres.carte;
      if (r.carte !== undefined) change = true;
    }
  }
  for (const r of rencontres) {
    if (r.carte === undefined) continue;
    const liste = parCarte.get(r.carte) ?? [];
    if (!liste.includes(r.id)) parCarte.set(r.carte, [...liste, r.id]);
  }

  // --- Conversion des positions du monde vers la carte d'une zone, d'après les monstres situés des deux façons.
  const butinJson = JSON.parse(gunzipSync(await readFile(path.join(process.cwd(), "modules/veille/objets/donnees/butin.json.gz"))).toString("utf8")) as {
    creatures: Record<string, { z?: Record<string, [number, number][]> }>;
  };
  const paires = new Map<string, { wx: number; wy: number; x: number; y: number }[]>();
  for (const [id, c] of Object.entries(butinJson.creatures)) {
    const s = spawns.get(Number(id)) ?? [];
    const zones = Object.entries(c.z ?? {});
    if (s.length !== 1 || zones.length !== 1 || zones[0][1].length !== 1) continue;
    const [slug, [[x, y]]] = zones[0];
    paires.set(slug, [...(paires.get(slug) ?? []), { wx: s[0].x, wy: s[0].y, x, y }]);
  }
  const conversions = new Map<string, (wx: number, wy: number) => [number, number] | null>();
  for (const [slug, p] of paires) {
    // Dans WoW, l'axe x de la carte suit -y du monde et l'axe y de la carte suit -x du monde.
    const fx = droite(p.map((q) => [q.wy, q.x]));
    const fy = droite(p.map((q) => [q.wx, q.y]));
    if (!fx || !fy || fx.ecart > 1.5 || fy.ecart > 1.5) continue;
    conversions.set(slug, (wx, wy) => {
      const x = fx.a * wy + fx.b, y = fy.a * wx + fy.b;
      return x >= 0 && x <= 100 && y >= 0 && y <= 100 ? [Math.round(x * 10) / 10, Math.round(y * 10) / 10] : null;
    });
  }

  // --- Entrées : déclencheurs qui mènent dans l'instance, à leur place dans le monde.
  const triggers = new Map<number, { carte: number; x: number; y: number }>();
  for (const l of lignes(await ac("areatrigger.sql"), "areatrigger")) triggers.set(n(l.entry), { carte: n(l.map), x: Number(l.x), y: Number(l.y) });
  const entreesParCarte = new Map<number, { carte: number; x: number; y: number }[]>();
  for (const l of lignes(await ac("areatrigger_teleport.sql"), "areatrigger_teleport")) {
    const t = triggers.get(n(l.ID));
    if (!t || (t.carte !== 0 && t.carte !== 1)) continue;
    const cible = n(l.target_map);
    entreesParCarte.set(cible, [...(entreesParCarte.get(cible) ?? []), t]);
  }

  // --- Quêtes du donjon : rattachées à sa zone, ou dont les cibles et les objets demandés y sont.
  let questsForever: Set<number> | null = null;
  try {
    const version = await derniereVersion();
    questsForever = new Set(lireCsv(await tableCsv("QuestV2", version)).map((l) => Number(l.ID)));
    console.log(`${questsForever.size} quêtes dans les fichiers de Forever (wago.tools ${version}).`);
  } catch (e) {
    console.log(`wago.tools injoignable (${e instanceof Error ? e.message : e}) : quêtes déjà vérifiées reprises du fichier précédent, les autres marquées à vérifier.`);
  }
  // Sans wago.tools, un donjon dont les quêtes ont déjà été filtrées sur Forever garde ce filtre (liste du fichier précédent).
  const dejaVerifiees = new Map<string, Set<number>>();
  if (!questsForever) {
    try {
      const avant = JSON.parse(await readFile(path.join(process.cwd(), "content/donjons-jeu.json"), "utf8")) as {
        quetesVerifiees?: boolean; donjons?: Record<string, { qv?: boolean; quetes?: { id: number }[] }>;
      };
      for (const [slug, d] of Object.entries(avant.donjons ?? {})) {
        if (d.qv ?? avant.quetesVerifiees) dejaVerifiees.set(slug, new Set((d.quetes ?? []).map((q) => q.id)));
      }
    } catch {
      // premier passage : rien à reprendre
    }
  }
  const lootVersCreatures = new Map<number, number[]>();
  for (const [id, c] of creatures) if (c.loot) lootVersCreatures.set(c.loot, [...(lootVersCreatures.get(c.loot) ?? []), id]);
  const creaturesDonnant = new Map<number, Set<number>>();
  for (const [entry, rows] of butinCreatures) for (const r of rows) if (r.chance < 0) for (const c of lootVersCreatures.get(entry) ?? []) creaturesDonnant.set(r.item, (creaturesDonnant.get(r.item) ?? new Set()).add(c));
  const carteDe = (creature: number) => spawns.get(creature)?.[0]?.carte;
  const quetesParCarte = new Map<number, { id: number; fr: string; en: string; nv: number; min: number; camp: number }[]>();
  const aireVersCarte = new Map<number, number>();
  for (const d of DONJONS) for (const a of d.aire) aireVersCarte.set(a, d.carte);
  for (const l of lignes(sql, "quest_template")) {
    const id = n(l.entry);
    const cartes = new Set<number>();
    const zone = n(l.ZoneOrSort);
    if (zone > 0 && aireVersCarte.has(zone)) cartes.add(aireVersCarte.get(zone)!);
    for (const k of [1, 2, 3, 4]) {
      const cible = n(l[`ReqCreatureOrGOId${k}`]);
      if (cible > 0) { const c = carteDe(cible); if (c !== undefined) cartes.add(c); }
      const objet = n(l[`ReqItemId${k}`]);
      if (objet > 0) {
        const donneurs = [...(creaturesDonnant.get(objet) ?? [])];
        // l'objet ne tombe que dans le donjon (aucun monstre du monde ouvert ne le donne)
        const lieux = new Set(donneurs.map(carteDe).filter((c): c is number => c !== undefined));
        if (lieux.size === 1) cartes.add([...lieux][0]);
      }
    }
    for (const c of cartes) {
      if (!DONJONS.some((d) => d.carte === c)) continue;
      if (questsForever && !questsForever.has(id)) continue;
      const races = n(l.RequiredRaces);
      // camp : 1 Alliance, 2 Horde, 0 les deux
      const alliance = 1 | 4 | 8 | 64, horde = 2 | 16 | 32 | 128;
      const camp = !races ? 0 : (races & alliance) && !(races & horde) ? 1 : (races & horde) && !(races & alliance) ? 2 : 0;
      quetesParCarte.set(c, [...(quetesParCarte.get(c) ?? []), { id, fr: titresFr.get(id) ?? String(l.Title ?? ""), en: String(l.Title ?? ""), nv: n(l.QuestLevel), min: n(l.MinLevel), camp }]);
    }
  }

  // --- Assemblage.
  const fiche = (id: number) => {
    const c = creatures.get(id)!;
    return { id, n: nomsFr.get(id) ?? c.en, en: c.en, nv: [c.min, c.max] as [number, number], r: c.rang, butin: butinDe(id) };
  };
  const sortie: Record<string, unknown> = {};
  const utilises = new Set<number>();
  let toutesVerifiees = true;
  for (const d of DONJONS) {
    const boss = (parCarte.get(d.carte) ?? []).filter((id) => creatures.has(id));
    const dejaBoss = new Set(boss);
    // monstres rares (rang 2 : élite rare ; 4 : rare) apparus dans l'instance, avec un butin propre
    const rares = [...spawns].filter(([id, s]) => !dejaBoss.has(id) && s.some((x) => x.carte === d.carte) && [2, 4].includes(creatures.get(id)?.rang ?? 0))
      .map(([id]) => fiche(id)).filter((f) => f.butin.length);
    // niveaux des monstres de l'instance (hors bestioles de niveau 1)
    let min = 99, max = 0;
    for (const [id, s] of spawns) {
      if (!s.some((x) => x.carte === d.carte)) continue;
      const c = creatures.get(id);
      if (!c || c.max <= 1) continue;
      min = Math.min(min, c.min); max = Math.max(max, c.max);
    }
    // entrées, sur la carte de la première zone qui les contient ; deux entrées à moins de 40 mètres n'en font qu'une
    const entrees: { zone: string; x: number; y: number }[] = [];
    const vues: { x: number; y: number }[] = [];
    for (const e of entreesParCarte.get(d.carte) ?? []) {
      if (vues.some((v) => Math.hypot(v.x - e.x, v.y - e.y) < 40)) continue;
      vues.push(e);
      for (const z of d.zones) {
        const p = conversions.get(z)?.(e.x, e.y);
        if (p) { entrees.push({ zone: z, x: p[0], y: p[1] }); break; }
      }
    }
    const filtre = dejaVerifiees.get(d.slug);
    const qv = !!questsForever || !!filtre;
    const quetes = [...new Map((quetesParCarte.get(d.carte) ?? []).map((q) => [q.id, q])).values()]
      .filter((q) => !filtre || filtre.has(q.id))
      .sort((a, b) => a.nv - b.nv || a.id - b.id);
    for (const b of [...boss, ...rares.map((r) => r.id)]) for (const x of butinDe(b)) utilises.add(x.i);
    sortie[d.slug] = {
      carte: d.carte,
      niveaux: max ? [min, max] : null,
      entrees,
      boss: boss.map(fiche),
      rares,
      quetes,
      qv,
    };
    if (!qv) toutesVerifiees = false;
    console.log(`${d.slug} : ${boss.length} boss, ${rares.length} rares, ${entrees.length} entrée(s), ${quetes.length} quêtes, monstres ${min}-${max}.`);
  }
  const donnees = {
    version: {
      source: "CMaNGOS classic-db (GPL v3), AzerothCore (GPL v2) : rencontres, entrées et noms français",
      quetes: toutesVerifiees ? "filtrées sur les fichiers de Forever" : "en partie de l'Azeroth d'origine, présence dans Forever à vérifier",
    },
    quetesVerifiees: toutesVerifiees,
    donjons: sortie,
    // objets du butin tels que les bases libres les décrivent (n : nom français, q : qualité, c/sc : classe, s : emplacement)
    objets: Object.fromEntries([...utilises].sort((a, b) => a - b).map((id) => {
      const o = objetsOrigine.get(id);
      return [id, o ? { n: objetsFr.get(id) ?? o.en, ...o } : { n: String(id), en: String(id), q: 1, c: 0, sc: 0, s: 0, nv: 0, req: 0 }];
    })),
  };
  await writeFile(path.join(process.cwd(), "content/donjons-jeu.json"), JSON.stringify(donnees, null, 1) + "\n");
  console.log("content/donjons-jeu.json écrit.");
});
