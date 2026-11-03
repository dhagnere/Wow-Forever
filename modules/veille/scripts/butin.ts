import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { gzipSync } from "node:zlib";
import { derniereVersion, tableCsv } from "../objets/wago";
import { lancer } from "./_lanceur";
import { lignes, lireCsv, lireDump, n, preparerPositions } from "./_bases-libres";

/**
 * « Où le trouver » pour chaque objet : monstres et taux de butin, coffres et gisements, marchands, quêtes,
 * avec la position des monstres sur les cartes du jeu.
 *
 *   npm run base:butin -- <dump CMaNGOS classic-db (.sql ou .sql.gz)> <dossier db_world d'AzerothCore>
 *
 * Données de l'Azeroth d'origine (1.12), base communautaire libre CMaNGOS classic-db (GPL v3) ; noms français des
 * créatures, objets du décor et quêtes : AzerothCore (GPL v2). Positions converties sur les cartes du jeu (UiMapAssignment).
 * Résultat : modules/veille/objets/donnees/butin.json.gz, lu par la fiche de chaque objet.
 * Avec --en : noms d'origine de CMaNGOS (anglais), écrits dans butin.en.json.gz pour la version anglaise du site.
 */



interface Ligne { entry: number; item: number; chance: number; groupe: number; ref: number; max: number }

lancer("base:butin", async () => {
  const EN = process.argv.includes("--en");
  const [fichierDump, dossierLocales] = process.argv.slice(2).filter((a) => !a.startsWith("--"));
  if (!fichierDump || !dossierLocales) throw new Error("Usage : npm run base:butin -- <dump CMaNGOS> <dossier db_world AzerothCore>");
  const sql = await lireDump(fichierDump);
  const locale = async (f: string) => readFile(path.join(dossierLocales, f), "utf8");
  const version = await derniereVersion();

  // Objets connus de Forever : seuls ceux-là sont gardés.
  const idsForever = new Set(lireCsv(await tableCsv("ItemSparse", version)).map((l) => Number(l.ID)));

  // --- Noms français.
  const nomsCreatures = new Map<number, string>();
  const nomsObjetsDecor = new Map<number, string>();
  const titresQuetes = new Map<number, string>();
  // En anglais, les noms d'origine de CMaNGOS suffisent ; en français, ceux d'AzerothCore.
  if (!EN) {
    for (const l of lignes(await locale("creature_template_locale.sql"), "creature_template_locale")) if (l.locale === "frFR" && l.Name) nomsCreatures.set(n(l.entry), String(l.Name));
    for (const l of lignes(await locale("gameobject_template_locale.sql"), "gameobject_template_locale")) if (l.locale === "frFR" && l.name) nomsObjetsDecor.set(n(l.entry), String(l.name));
    for (const l of lignes(await locale("quest_template_locale.sql"), "quest_template_locale")) if (l.locale === "frFR" && l.Title) titresQuetes.set(n(l.ID), String(l.Title));
  }

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

  const { positions, tuilesLues } = await preparerPositions(sql, version, EN ? "enUS" : "frFR");

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
  console.log(`${tuilesLues()} tuiles d'exploration lues pour départager les zones voisines.`);
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
  await writeFile(path.join(dossier, EN ? "butin.en.json.gz" : "butin.json.gz"), gzipSync(json, { level: 9 }));
  console.log(`${Object.keys(sortie).length} objets avec au moins une source ; ${citeesCreatures.size} créatures, ${citeesDecor.size} objets du décor, ${citeesQuetes.size} quêtes. ${(json.length / 1e6).toFixed(1)} Mo de données.`);
});
