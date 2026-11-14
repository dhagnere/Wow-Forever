import { writeFile } from "node:fs/promises";
import path from "node:path";
import { derniereVersion, tableCsv } from "../objets/wago";
import { objetInterne } from "../objets/conversion";
import { lancer } from "./_lanceur";
import { VILLES, lignes, lireCsv, lireDump, n, preparerPositions, slugLieu, type Position } from "./_bases-libres";
import { lireQuestie, type LieuQuestie } from "./_questie";
import { CARTES_JEU } from "@/content/cartes-jeu";
import { CLASSES_QUETES_FOREVER } from "@/content/classes-quetes-forever";

/**
 * Guides de quêtes : quêtes de classe (chaînes, donneurs, objectifs, récompenses) et parcours de montée en niveau
 * par faction (zones dans l'ordre des niveaux, principaux donneurs).
 *
 *   npm run base:quetes -- <dump CMaNGOS classic-db (.sql ou .sql.gz)> <dossier db_world d'AzerothCore> [--questie <clone QuestieDB>] [--en]
 *
 * Données de l'Azeroth d'origine : CMaNGOS classic-db (GPL v3), titres et noms français AzerothCore (GPL v2). Seules
 * les quêtes encore présentes dans les fichiers de Forever (table QuestV2) sont gardées. Aucun texte de quête n'est
 * repris : les objectifs sont rédigés à partir des données (objets à rapporter, créatures à vaincre).
 * Résultat : content/quetes-jeu.json, lu par les pages /guides/quetes-de-classe/ et /guides/parcours/.
 * Avec --en : version anglaise (titres et noms d'origine de CMaNGOS, objets et sorts en anglais, objectifs rédigés en
 * anglais), écrite dans content/quetes-jeu.en.json et content/guide-jeu.en.json.
 * Avec --questie <dossier> : les quêtes ajoutées par Forever, inconnues de CMaNGOS, sont prises dans les relevés en jeu des
 * joueurs de Questie (clone de https://github.com/Questie/QuestieDB, dossiers « traces » seulement, voir _questie.ts) :
 * titres (en français quand un joueur français les a vus), niveaux, PNJ et positions. Leur classe n'est pas relevée :
 * une quête réservée à une classe se déclare dans content/classes-quetes-forever.ts. Les quêtes réservées aux Skyborne et
 * celles de l'île de Zéphras restent à content/zephras.ts.
 */

const CLASSES: [string, number][] = [
  ["guerrier", 1], ["paladin", 2], ["chasseur", 4], ["voleur", 8], ["pretre", 16], ["chaman", 64], ["mage", 128], ["demoniste", 256], ["druide", 1024],
];
const TOUTES_CLASSES = 1503;
const RACES: [string, number][] = [
  ["Humain", 1], ["Orc", 2], ["Nain", 4], ["Elfe de la nuit", 8], ["Mort-vivant", 16], ["Tauren", 32], ["Gnome", 64], ["Troll", 128],
];
const RACES_EN: Record<string, string> = {
  Humain: "Human", Orc: "Orc", Nain: "Dwarf", "Elfe de la nuit": "Night Elf", "Mort-vivant": "Undead", Tauren: "Tauren", Gnome: "Gnome", Troll: "Troll",
};
const ALLIANCE = 1 | 4 | 8 | 64;
const HORDE = 2 | 16 | 32 | 128;
/** Faction du jeu « Alliance » et « Horde » (FactionTemplate.Enemies). */
const FACTION_ALLIANCE = 469;
const FACTION_HORDE = 67;
/** Catégories saisonnières ou spéciales (Voile d'hiver, fêtes, Foire de Sombrelune…) : pas des quêtes de classe. */
const SAISONNIERES = new Set([-22, -284, -364, -366, -369, -370, -374, -375, -376, -1001, -1002, -1003]);
/** Territoires d'une faction : la route de l'autre n'y passe pas, même si quelques PNJ neutres y donnent des quêtes. */
const TERRITOIRES: Record<"alliance" | "horde", Set<string>> = {
  alliance: new Set(["foret-d-elwynn", "hurlevent", "dun-morogh", "forgefer", "teldrassil", "darnassus", "sombrivage", "loch-modan", "marche-de-l-ouest"]),
  horde: new Set(["durotar", "orgrimmar", "mulgore", "les-pitons-du-tonnerre", "clairieres-de-tirisfal", "fossoyeuse", "foret-des-pins-argentes"]),
};
/** Zones de départ des races d'origine : le guide y part du niveau 1, quelle que soit la fourchette calculée de la zone
 *  (celle de Durotar ressort à 5-14, ce qui écartait les premières quêtes de la Vallée des Épreuves). */
const DEPARTS = new Set(["foret-d-elwynn", "dun-morogh", "teldrassil", "durotar", "mulgore", "clairieres-de-tirisfal"]);
const nbClasses = (m: number) => [1, 2, 4, 8, 16, 64, 128, 256, 1024].filter((b) => m & b).length;

/** Champs de bataille (vallée d'Alterac, goulet des Chanteguerres, bassin Arathi) : leurs quêtes de niveau 60, données aux portes,
 *  ne sont pas des étapes de la route et faussaient la fourchette de niveaux des montagnes d'Alterac. */
const CHAMPS_DE_BATAILLE = new Set([2597, 3277, 3358]);
/** Île de départ des Skyborne : ses quêtes se saisissent dans content/zephras.ts, elle n'est pas une étape des routes de faction. */
const ZEPHRAS = "ile-de-zephras";
/** Types de quêtes laissés hors du parcours : JcJ, raid, donjon (on les fait en groupe, pas en suivant la route). */
const TYPES_HORS_PARCOURS = new Set([41, 62, 81]);

type Ref = { t: "pnj" | "decor" | "objet"; id: number; n: string; b?: boolean };

lancer("base:quetes", async () => {
  const EN = process.argv.includes("--en");
  const args = process.argv.slice(2);
  const iQuestie = args.indexOf("--questie");
  const dossierQuestie = iQuestie >= 0 ? args[iQuestie + 1] : undefined;
  if (iQuestie >= 0 && (!dossierQuestie || dossierQuestie.startsWith("--"))) throw new Error("--questie attend le dossier d'un clone de QuestieDB.");
  const [fichierDump, dossierLocales] = args.filter((a, k) => !a.startsWith("--") && k !== (iQuestie >= 0 ? iQuestie + 1 : -1));
  const suffixe = EN ? ".en" : "";
  /** Objectifs rédigés à partir des données, dans la langue voulue. */
  const V = EN
    ? { rapporter: "Bring", vaincre: "Kill", activer: "Use", utiliser: "Use", sur: "on", sortDemande: "the required spell", objet: "item", cible: "Target:" }
    : { rapporter: "Rapporter", vaincre: "Vaincre", activer: "Activer", utiliser: "Utiliser", sur: "sur", sortDemande: "le sort demandé", objet: "objet", cible: "Cible :" };
  if (!fichierDump || !dossierLocales) throw new Error("Usage : npm run base:quetes -- <dump CMaNGOS> <dossier db_world AzerothCore> [--questie <clone QuestieDB>] [--en] (chemins réels, sans les chevrons)");
  const sql = await lireDump(fichierDump);
  const locale = async (f: string) => (await import("node:fs/promises")).readFile(path.join(dossierLocales, f), "utf8");
  const version = await derniereVersion();

  const [questV2, itemSparse, spellName, spellEffect, factionTemplate] = await Promise.all(
    ["QuestV2", "ItemSparse", "SpellName", "SpellEffect", "FactionTemplate"].map((t) => tableCsv(t, version, EN ? "enUS" : "frFR")),
  );
  const quetesForever = new Set(lireCsv(questV2).map((l) => Number(l.ID)));
  const sparse = lireCsv(itemSparse);
  const nomsObjets = new Map(sparse.map((l) => [Number(l.ID), l.Display_lang]));
  // Objets qui ont une fiche dans la base du site (les objets internes en sont écartés) : seuls ceux-là sont liés.
  const enBase = new Set(sparse.filter((l) => l.Display_lang && !objetInterne(l.Display_lang, Number(l.RequiredLevel) || 0)).map((l) => Number(l.ID)));
  const nomsSorts = new Map(lireCsv(spellName).map((l) => [Number(l.ID), l.Name_lang]));
  // Sort « enseigner » (effet 36) → sort appris : la récompense affichée est le sort appris.
  const enseigne = new Map<number, number>();
  for (const e of lireCsv(spellEffect)) if (e.Effect === "36" && Number(e.EffectTriggerSpell)) enseigne.set(Number(e.SpellID), Number(e.EffectTriggerSpell));
  const factions = new Map(lireCsv(factionTemplate).map((f) => [Number(f.ID), f]));
  const ouvertA = (faction: number, camp: "alliance" | "horde") => {
    const f = factions.get(faction);
    if (!f) return true;
    const groupe = camp === "alliance" ? 2 : 4;
    const ennemi = camp === "alliance" ? FACTION_ALLIANCE : FACTION_HORDE;
    if (Number(f.EnemyGroup) & (groupe | 1)) return false;
    return ![0, 1, 2, 3, 4, 5, 6, 7].some((k) => Number(f[`Enemies_${k}`]) === ennemi);
  };
  /** PNJ relevés par Questie : faction amicale vue en jeu (« A », « H », « AH »), qui l'emporte sur la table du jeu. */
  const amitie = new Map<number, string>();
  const ouvertPnj = (id: number, camp: "alliance" | "horde") => {
    const a = amitie.get(id);
    if (a) return a.includes(camp === "alliance" ? "A" : "H");
    return ouvertA(creatures.get(id)?.faction ?? 0, camp);
  };

  // --- Noms français.
  const nomsCreatures = new Map<number, string>();
  const nomsDecor = new Map<number, string>();
  const titres = new Map<number, string>();
  // En anglais, les noms d'origine de CMaNGOS suffisent ; en français, ceux d'AzerothCore.
  if (!EN) {
    for (const l of lignes(await locale("creature_template_locale.sql"), "creature_template_locale")) if (l.locale === "frFR" && l.Name) nomsCreatures.set(n(l.entry), String(l.Name));
    for (const l of lignes(await locale("gameobject_template_locale.sql"), "gameobject_template_locale")) if (l.locale === "frFR" && l.name) nomsDecor.set(n(l.entry), String(l.name));
    for (const l of lignes(await locale("quest_template_locale.sql"), "quest_template_locale")) if (l.locale === "frFR" && l.Title) titres.set(n(l.ID), String(l.Title));
  }

  const creatures = new Map<number, { nom: string; faction: number; loot: number }>();
  for (const l of lignes(sql, "creature_template")) creatures.set(n(l.Entry), { nom: nomsCreatures.get(n(l.Entry)) ?? String(l.Name ?? ""), faction: n(l.Faction), loot: n(l.LootId) });
  const decor = new Map<number, string>();
  const lootDecor = new Map<number, number[]>();
  for (const l of lignes(sql, "gameobject_template")) {
    decor.set(n(l.entry), nomsDecor.get(n(l.entry)) ?? String(l.name ?? ""));
    // Coffres, plantes, caisses (type 3) : leur butin est l'entrée data1.
    if (n(l.type) === 3 && n(l.data1)) lootDecor.set(n(l.data1), [...(lootDecor.get(n(l.data1)) ?? []), n(l.entry)]);
  }
  const objetDeDepart = new Map<number, number>();
  for (const l of lignes(sql, "item_template")) if (n(l.startquest)) objetDeDepart.set(n(l.startquest), n(l.entry));

  // --- Qui donne, qui reçoit.
  const donneurs = new Map<number, Ref[]>();
  const receveurs = new Map<number, Ref[]>();
  const ajouter = (m: Map<number, Ref[]>, quete: number, r: Ref) => m.set(quete, [...(m.get(quete) ?? []), r]);
  for (const l of lignes(sql, "creature_questrelation")) ajouter(donneurs, n(l.quest), { t: "pnj", id: n(l.id), n: creatures.get(n(l.id))?.nom ?? "" });
  for (const l of lignes(sql, "gameobject_questrelation")) ajouter(donneurs, n(l.quest), { t: "decor", id: n(l.id), n: decor.get(n(l.id)) ?? "" });
  for (const l of lignes(sql, "creature_involvedrelation")) ajouter(receveurs, n(l.quest), { t: "pnj", id: n(l.id), n: creatures.get(n(l.id))?.nom ?? "" });
  for (const l of lignes(sql, "gameobject_involvedrelation")) ajouter(receveurs, n(l.quest), { t: "decor", id: n(l.id), n: decor.get(n(l.id)) ?? "" });

  // --- Quêtes.
  type Q = {
    id: number; titre: string; niveau: number; min: number; classes: number; races: number; type: number; zone: number;
    prev: number; suite: number; objectifs: string[];
    /** Cibles des objectifs : créatures à vaincre ou qui lâchent l'objet demandé, objets du décor à activer ou à fouiller. */
    ciblesPnj: number[]; ciblesDecor: number[]; objetsRequis: number[];
    objets: { id: number; n: string; q: number; choix: boolean; b: boolean }[]; sorts: string[]; argent: number;
  };
  const quetes = new Map<number, Q>();
  const connuesCmangos = new Set<number>();
  for (const l of lignes(sql, "quest_template")) {
    const id = n(l.entry);
    connuesCmangos.add(id);
    if (!quetesForever.has(id) || n(l.Method) === 1) continue;
    const depart = objetDeDepart.get(id);
    if (!donneurs.has(id) && !depart) continue;
    if (depart) ajouter(donneurs, id, { t: "objet", id: depart, n: nomsObjets.get(depart) ?? "", ...(enBase.has(depart) ? {} : { b: false }) });

    // Objectifs, rédigés à partir des données.
    const objectifs: string[] = [];
    const ciblesPnj: number[] = [];
    const ciblesDecor: number[] = [];
    const objetsRequis: number[] = [];
    for (let k = 1; k <= 4; k++) {
      const item = n(l[`ReqItemId${k}`]);
      const nb = n(l[`ReqItemCount${k}`]);
      if (item && nb) objetsRequis.push(item);
      if (item && nb) objectifs.push(`${V.rapporter} ${nb > 1 ? `${nb} × ` : ""}${nomsObjets.get(item) ?? `${V.objet} ${item}`}`);
    }
    for (let k = 1; k <= 4; k++) {
      const cible = n(l[`ReqCreatureOrGOId${k}`]);
      const nb = n(l[`ReqCreatureOrGOCount${k}`]);
      const sort = n(l[`ReqSpellCast${k}`]);
      if (!cible || !nb) continue;
      const nom = cible > 0 ? creatures.get(cible)?.nom : decor.get(-cible);
      if (!nom) continue;
      if (cible > 0) ciblesPnj.push(cible); else ciblesDecor.push(-cible);
      if (sort) objectifs.push(`${V.utiliser} ${nomsSorts.get(sort) ?? V.sortDemande} ${V.sur} ${nb > 1 ? `${nb} × ` : ""}${nom}`);
      else if (cible > 0) objectifs.push(`${V.vaincre} ${nb > 1 ? `${nb} × ` : ""}${nom}`);
      else objectifs.push(`${V.activer} ${nb > 1 ? `${nb} × ` : ""}${nom}`);
    }
    const objets: Q["objets"] = [];
    for (let k = 1; k <= 6; k++) {
      const item = n(l[`RewChoiceItemId${k}`]);
      if (item && nomsObjets.has(item)) objets.push({ id: item, n: nomsObjets.get(item)!, q: Math.max(1, n(l[`RewChoiceItemCount${k}`])), choix: true, b: enBase.has(item) });
    }
    for (let k = 1; k <= 4; k++) {
      const item = n(l[`RewItemId${k}`]);
      if (item && nomsObjets.has(item)) objets.push({ id: item, n: nomsObjets.get(item)!, q: Math.max(1, n(l[`RewItemCount${k}`])), choix: false, b: enBase.has(item) });
    }
    const sorts = [n(l.RewSpell), n(l.RewSpellCast)]
      .filter(Boolean)
      .map((s) => nomsSorts.get(enseigne.get(s) ?? s))
      .filter((s): s is string => !!s);
    quetes.set(id, {
      id, titre: titres.get(id) ?? String(l.Title ?? ""), niveau: n(l.QuestLevel), min: n(l.MinLevel), classes: n(l.RequiredClasses),
      races: n(l.RequiredRaces), type: n(l.Type), zone: n(l.ZoneOrSort), prev: n(l.PrevQuestId), suite: n(l.NextQuestInChain),
      objectifs, ciblesPnj, ciblesDecor, objetsRequis, objets, sorts: [...new Set(sorts)], argent: Math.max(0, n(l.RewOrReqMoney)),
    });
  }
  // --- Quêtes ajoutées par Forever : relevés en jeu des joueurs de Questie.
  const releve = dossierQuestie ? await lireQuestie(dossierQuestie, EN ? "enUS" : "frFR") : null;
  const zonesDeCarte = new Map(Object.entries(CARTES_JEU).filter(([, c]) => c.type === "zone").map(([s, c]) => [c.id, s]));
  const carteDeAire = (aire: number) => zonesDeCarte.get(releve?.uiMap.get(aire) ?? -1);
  if (releve) {
    for (const [id, p] of releve.pnj) {
      if (!creatures.has(id) && p.nom) creatures.set(id, { nom: p.nom, faction: 0, loot: 0 });
      if (p.amical) amitie.set(id, p.amical);
    }
    for (const [id, d] of releve.decor) if (!decor.has(id) && d.nom) decor.set(id, d.nom);
    for (const [id, o] of releve.objets) if (!nomsObjets.has(id) && o.nom) nomsObjets.set(id, o.nom);
    /** Toutes les cibles relevées d'une quête sont dans une instance (aucune carte de zone) : quête de donjon. */
    const enInstance = (ids: number[]) => {
      const vus = ids.map((id) => releve.pnj.get(id)).filter((p): p is LieuQuestie => !!p && !!p.zone);
      return vus.length > 0 && vus.every((p) => !p.points.some(([aire]) => carteDeAire(aire)));
    };
    const compte = { ajoutees: 0, skyborne: 0, sansDonneur: 0, donjons: 0 };
    for (const rq of releve.quetes.values()) {
      if (connuesCmangos.has(rq.id) || !rq.nom || !rq.niveau) continue;
      // Réservée aux Skyborne (aucune race d'origine dans le masque) : île de Zéphras, saisie à la main.
      if (rq.races && !(rq.races & (ALLIANCE | HORDE))) { compte.skyborne++; continue; }
      if (!rq.donneurs.pnj.length && !rq.donneurs.decor.length && !rq.donneurs.objet.length) { compte.sansDonneur++; continue; }
      for (const id of rq.donneurs.pnj) ajouter(donneurs, rq.id, { t: "pnj", id, n: creatures.get(id)?.nom ?? "" });
      for (const id of rq.donneurs.decor) ajouter(donneurs, rq.id, { t: "decor", id, n: decor.get(id) ?? "" });
      for (const id of rq.donneurs.objet) ajouter(donneurs, rq.id, { t: "objet", id, n: nomsObjets.get(id) ?? "", ...(enBase.has(id) ? {} : { b: false }) });
      for (const id of rq.receveurs.pnj) ajouter(receveurs, rq.id, { t: "pnj", id, n: creatures.get(id)?.nom ?? "" });
      for (const id of rq.receveurs.decor) ajouter(receveurs, rq.id, { t: "decor", id, n: decor.get(id) ?? "" });
      // Objectifs rédigés à partir des données : les relevés ne donnent ni les quantités ni l'action sur une créature.
      const objectifs = [
        ...rq.cibles.objets.map((id) => `${V.rapporter} ${nomsObjets.get(id) ?? `${V.objet} ${id}`}`),
        ...rq.cibles.pnj.map((id) => creatures.get(id)?.nom).filter((x): x is string => !!x).map((nom) => `${V.cible} ${nom}`),
        ...rq.cibles.decor.map((id) => decor.get(id)).filter((x): x is string => !!x).map((nom) => `${V.activer} ${nom}`),
      ];
      const ciblesPnj = [...rq.cibles.pnj];
      const ciblesDecor = [...rq.cibles.decor];
      for (const item of rq.cibles.objets) {
        const o = releve.objets.get(item);
        if (o && o.pnj.length <= 25) ciblesPnj.push(...o.pnj);
        if (o && o.decor.length <= 25) ciblesDecor.push(...o.decor);
      }
      const donjon = enInstance(ciblesPnj);
      if (donjon) compte.donjons++;
      const premier = releve.pnj.get(rq.donneurs.pnj[0] ?? -1);
      quetes.set(rq.id, {
        id: rq.id, titre: rq.nom, niveau: rq.niveau, min: 0, classes: CLASSES_QUETES_FOREVER[rq.id] ?? 0, races: rq.races,
        type: donjon ? 81 : 0, zone: premier?.zone ?? 0, prev: rq.prev, suite: rq.suite,
        objectifs, ciblesPnj, ciblesDecor, objetsRequis: [...rq.cibles.objets], objets: [], sorts: [], argent: 0,
      });
      compte.ajoutees++;
    }
    console.log(`Relevés Questie : ${compte.ajoutees} quêtes de Forever ajoutées (dont ${compte.donjons} de donjon, hors parcours) ; écartées : ${compte.skyborne} réservées aux Skyborne, ${compte.sansDonneur} sans donneur relevé.`);
  }

  // Qui lâche les objets demandés par les quêtes : monstres (butin direct) et objets du décor.
  const requis = new Set([...quetes.values()].flatMap((q) => q.objetsRequis));
  const sourcesPnj = new Map<number, Set<number>>();
  const sourcesDecor = new Map<number, Set<number>>();
  const lootVersPnj = new Map<number, number[]>();
  for (const [id, c] of creatures) if (c.loot) lootVersPnj.set(c.loot, [...(lootVersPnj.get(c.loot) ?? []), id]);
  for (const l of lignes(sql, "creature_loot_template")) {
    const item = n(l.item);
    if (!requis.has(item) || n(l.mincountOrRef) < 0) continue;
    for (const c of lootVersPnj.get(n(l.entry)) ?? []) sourcesPnj.set(item, (sourcesPnj.get(item) ?? new Set()).add(c));
  }
  for (const l of lignes(sql, "gameobject_loot_template")) {
    const item = n(l.item);
    if (!requis.has(item) || n(l.mincountOrRef) < 0) continue;
    for (const g of lootDecor.get(n(l.entry)) ?? []) sourcesDecor.set(item, (sourcesDecor.get(item) ?? new Set()).add(g));
  }
  for (const q of quetes.values()) {
    for (const item of q.objetsRequis) {
      // Au-delà de 25 sources, l'objet tombe un peu partout : la carte n'apprendrait rien.
      const p = [...(sourcesPnj.get(item) ?? [])];
      const d = [...(sourcesDecor.get(item) ?? [])];
      if (p.length <= 25) q.ciblesPnj.push(...p);
      if (d.length <= 25) q.ciblesDecor.push(...d);
    }
    q.ciblesPnj = [...new Set(q.ciblesPnj)];
    q.ciblesDecor = [...new Set(q.ciblesDecor)];
  }
  console.log(`${quetes.size} quêtes de l'Azeroth d'origine présentes dans Forever (${quetesForever.size} dans ses fichiers).`);

  // --- Positions des donneurs et receveurs cités.
  const { positions, tuilesLues } = await preparerPositions(sql, version, EN ? "enUS" : "frFR");
  const pnjCites = new Set<number>();
  const decorCites = new Set<number>();
  const citer = (r: Ref) => (r.t === "pnj" ? pnjCites.add(r.id) : r.t === "decor" ? decorCites.add(r.id) : null);

  // --- Quêtes de classe, en chaînes.
  const racesDe = (masque: number) => {
    const m = masque & (ALLIANCE | HORDE);
    if (!m || m === (ALLIANCE | HORDE)) return null;
    if (m === ALLIANCE) return ["Alliance"];
    if (m === HORDE) return ["Horde"];
    return RACES.filter(([, b]) => m & b).map(([r]) => (EN ? RACES_EN[r] ?? r : r));
  };
  const classes: Record<string, { titre: string; niveaux: [number, number]; races: string[] | null; quetes: number[] }[]> = {};
  const gardees = new Set<number>();
  for (const [slug, masque] of CLASSES) {
    // Quête de classe : réservée à cette classe (ou à deux au plus), hors fêtes et événements.
    const liste = [...quetes.values()].filter((q) => q.classes & masque && nbClasses(q.classes) <= 2 && !SAISONNIERES.has(q.zone));
    const ids = new Set(liste.map((q) => q.id));
    // Suite d'une quête : NextQuestInChain, sinon l'unique quête de classe qui la demande en préalable.
    const suivantes = new Map<number, number[]>();
    for (const q of liste) if (q.prev > 0 && ids.has(q.prev)) suivantes.set(q.prev, [...(suivantes.get(q.prev) ?? []), q.id]);
    const suite = (q: Q) => (q.suite && ids.has(q.suite) ? q.suite : (suivantes.get(q.id)?.length === 1 ? suivantes.get(q.id)![0] : 0));
    const aUnPrecedent = new Set<number>();
    for (const q of liste) { const s = suite(q); if (s) aUnPrecedent.add(s); }
    const vues = new Set<number>();
    const chaines: (typeof classes)[string] = [];
    const racines = liste.filter((q) => !aUnPrecedent.has(q.id)).sort((a, b) => a.min - b.min || a.niveau - b.niveau || a.id - b.id);
    for (const r of [...racines, ...liste]) {
      if (vues.has(r.id)) continue;
      const chaine: number[] = [];
      for (let q: Q | undefined = r; q && !vues.has(q.id); q = quetes.get(suite(q))) {
        vues.add(q.id);
        chaine.push(q.id);
      }
      const qs = chaine.map((id) => quetes.get(id)!);
      chaines.push({
        titre: qs[0].titre,
        niveaux: [Math.min(...qs.map((q) => q.min || q.niveau)), Math.max(...qs.map((q) => q.niveau))],
        races: racesDe(qs[0].races),
        quetes: chaine,
      });
    }
    // Doublons : une quête isolée qui ouvre déjà une chaîne plus longue (même titre, mêmes races) disparaît.
    const cle = (c: (typeof chaines)[number]) => `${c.races?.join("+") ?? "tous"}|`;
    const titresDe = (c: (typeof chaines)[number]) => c.quetes.map((id) => quetes.get(id)!.titre);
    const gardeesClasse: typeof chaines = [];
    for (const c of [...chaines].sort((a, b) => b.quetes.length - a.quetes.length)) {
      const t = titresDe(c);
      const double = gardeesClasse.some((g) => cle(g) === cle(c) && titresDe(g).slice(0, t.length).join("\u0000") === t.join("\u0000"));
      if (!double) gardeesClasse.push(c);
    }
    chaines.length = 0;
    chaines.push(...gardeesClasse);
    classes[slug] = chaines.sort((a, b) => a.niveaux[0] - b.niveaux[0] || a.niveaux[1] - b.niveaux[1] || a.titre.localeCompare(b.titre, "fr"));
  }
  for (const ch of Object.values(classes)) for (const c of ch) c.quetes.forEach((id) => gardees.add(id));
  for (const id of gardees) {
    for (const r of donneurs.get(id) ?? []) citer(r);
    for (const r of receveurs.get(id) ?? []) citer(r);
  }

  // --- Parcours par faction : quêtes de tous, données par un personnage non hostile.
  const pourTous = [...quetes.values()].filter((q) => (!q.classes || (q.classes & TOUTES_CLASSES) === TOUTES_CLASSES) && q.niveau > 0 && !TYPES_HORS_PARCOURS.has(q.type) && !SAISONNIERES.has(q.zone) && !CHAMPS_DE_BATAILLE.has(q.zone));
  for (const q of pourTous) {
    for (const r of donneurs.get(q.id) ?? []) citer(r);
    // Le guide de 1 à 60 place aussi sur la carte le PNJ à qui l'on rend la quête, et les cibles des objectifs.
    for (const r of receveurs.get(q.id) ?? []) citer(r);
  }
  for (const q of quetes.values()) {
    if (!q.classes || nbClasses(q.classes) <= 2) {
      q.ciblesPnj.forEach((id) => pnjCites.add(id));
      q.ciblesDecor.forEach((id) => decorCites.add(id));
    }
  }

  // Zone de jeu de chaque quête (ZoneOrSort > 0 : AreaTable, remontée jusqu'à la zone) : quand deux cartes se disputent un PNJ,
  // celle des quêtes qu'il donne ou reçoit l'emporte.
  const aires = new Map(lireCsv(await tableCsv("AreaTable", version, "frFR")).map((a) => [Number(a.ID), { parent: Number(a.ParentAreaID), nom: a.AreaName_lang ?? "" }]));
  const zoneDeAire = (id: number) => {
    let a = aires.get(id);
    for (let i = 0; a && a.parent && i < 5; i++) a = aires.get(a.parent) ?? a;
    return a ? slugLieu(a.nom) : "";
  };
  const preferences = new Map<number, Set<string>>();
  for (const q of quetes.values()) {
    const z = q.zone > 0 ? zoneDeAire(q.zone) : "";
    if (!z) continue;
    for (const r of [...(donneurs.get(q.id) ?? []), ...(receveurs.get(q.id) ?? [])]) {
      if (r.t === "pnj") preferences.set(r.id, (preferences.get(r.id) ?? new Set()).add(z));
    }
  }
  const posPnj = await positions("creature", "creature_spawn_entry", pnjCites, preferences);
  const posDecor = await positions("gameobject", "gameobject_spawn_entry", decorCites);
  // PNJ et objets apparus avec Forever : positions relevées en jeu (déjà en % de la carte de la zone, cadre de Forever).
  if (releve) {
    const completer = (pos: Map<number, Position>, lieux: Map<number, LieuQuestie>, ids: Set<number>) => {
      let nb = 0;
      for (const id of ids) {
        const l = lieux.get(id);
        if (pos.has(id) || !l) continue;
        const z: Position["z"] = {};
        for (const [aire, x, y] of l.points) {
          const s = carteDeAire(aire);
          if (!s) continue;
          const liste = (z[s] ??= []);
          if (liste.length < 40 && !liste.some(([u, v]) => Math.abs(u - x) < 1.2 && Math.abs(v - y) < 1.2)) liste.push([x, y]);
        }
        if (Object.keys(z).length) { pos.set(id, { z }); nb++; }
      }
      return nb;
    };
    console.log(`Relevés Questie : ${completer(posPnj, releve.pnj, pnjCites)} PNJ et ${completer(posDecor, releve.decor, decorCites)} objets du décor placés.`);
  }
  console.log(`${tuilesLues()} tuiles d'exploration lues.`);

  const zoneDe = (p?: Position) => {
    const z = Object.entries(p?.z ?? {}).sort((a, b) => b[1].length - a[1].length)[0];
    return z ? { lieu: z[0], x: z[1][0][0], y: z[1][0][1] } : null;
  };

  const parcours: Record<"alliance" | "horde", { lieu: string; quetes: number; niveaux: [number, number]; mediane: number; donneurs: { id: number; n: string; quetes: number; x: number; y: number }[] }[]> = { alliance: [], horde: [] };
  for (const camp of ["alliance", "horde"] as const) {
    const masque = camp === "alliance" ? ALLIANCE : HORDE;
    const parZone = new Map<string, { niveaux: number[]; donneurs: Map<number, { quetes: number; x: number; y: number }> }>();
    const autre = TERRITOIRES[camp === "alliance" ? "horde" : "alliance"];
    for (const q of pourTous) {
      if (q.races && !(q.races & masque)) continue;
      const pnj = (donneurs.get(q.id) ?? []).find((r) => r.t === "pnj" && ouvertPnj(r.id, camp) && zoneDe(posPnj.get(r.id)));
      if (!pnj) continue;
      const z = zoneDe(posPnj.get(pnj.id))!;
      // Les capitales ne sont pas une étape de la route : leurs quêtes renvoient vers les zones.
      if (autre.has(z.lieu) || VILLES.has(z.lieu) || z.lieu === ZEPHRAS) continue;
      const e = parZone.get(z.lieu) ?? { niveaux: [] as number[], donneurs: new Map<number, { quetes: number; x: number; y: number }>() };
      e.niveaux.push(q.niveau);
      const d = e.donneurs.get(pnj.id) ?? { quetes: 0, x: z.x, y: z.y };
      d.quetes++;
      e.donneurs.set(pnj.id, d);
      parZone.set(z.lieu, e);
    }
    const centile = (l: number[], p: number) => l[Math.min(l.length - 1, Math.floor(p * l.length))];
    parcours[camp] = [...parZone.entries()]
      .filter(([, e]) => e.niveaux.length >= 6)
      .map(([lieu, e]) => {
        // Les quêtes de haut niveau d'une capitale ou d'un village (chaînes de raid…) faussent la fourchette : écartées.
        const tri = [...e.niveaux].sort((a, b) => a - b);
        const med = centile(tri, 0.5);
        const l = tri.filter((v) => v <= med + 10 && v >= med - 12);
        return {
          lieu, quetes: l.length, niveaux: [centile(l, 0.1), centile(l, 0.9)] as [number, number], mediane: centile(l, 0.5),
          donneurs: [...e.donneurs.entries()].sort((a, b) => b[1].quetes - a[1].quetes).slice(0, 6)
            .map(([id, d]) => ({ id, n: creatures.get(id)?.nom ?? "", ...d })),
        };
      })
      .sort((a, b) => a.mediane - b.mediane || a.niveaux[0] - b.niveaux[0]);
  }

  // --- Assemblage.
  const ref = (r: Ref) => {
    const p = r.t === "pnj" ? posPnj.get(r.id) : r.t === "decor" ? posDecor.get(r.id) : undefined;
    const z = zoneDe(p);
    return { ...r, ...(z ? { l: z } : {}), ...(p?.d ? { donjon: p.d[0] } : {}) };
  };
  const fiches = Object.fromEntries([...gardees].map((id) => {
    const q = quetes.get(id)!;
    return [id, {
      titre: q.titre, niveau: q.niveau, min: q.min, races: racesDe(q.races),
      donneurs: (donneurs.get(id) ?? []).slice(0, 2).map(ref), receveurs: (receveurs.get(id) ?? []).slice(0, 2).map(ref),
      objectifs: q.objectifs, objets: q.objets, sorts: q.sorts, argent: q.argent,
    }];
  }));
  const source = `CMaNGOS classic-db (GPL v3), titres et noms français AzerothCore (GPL v2)${releve ? ", quêtes de Forever relevées en jeu par les joueurs de Questie (QuestieDB, GPL v3)" : ""}`;
  const donnees = { version: { jeu: version, source }, classes, quetes: fiches, parcours };
  await writeFile(path.join(process.cwd(), `content/quetes-jeu${suffixe}.json`), JSON.stringify(donnees));

  // --- Guide de 1 à 60 : pour chaque zone de la route, les quêtes dans l'ordre et les points de rassemblement.
  type Hub = { x: number; y: number; n: string[] };
  type EtapeGuide = {
    id: number; t: string; nv: number; min: number; ra: number; cl: number; grp: 1 | 0; obj: string[];
    g: number; gn: string; r: number; rn: string; rl: string | null; av: number;
    /** Cibles des objectifs dans la zone : points (en % de la carte) et centre du principal secteur. */
    cib: { p: [number, number][]; c: [number, number] } | null;
  };
  const guide: Record<"alliance" | "horde", { lieu: string; niveaux: [number, number]; hubs: Hub[]; etapes: EtapeGuide[] }[]> = { alliance: [], horde: [] };
  const quetesDeClasse = [...quetes.values()].filter((q) => q.classes && nbClasses(q.classes) <= 2 && !SAISONNIERES.has(q.zone) && q.niveau > 0 && q.niveau < 60);
  /** Où se trouvent les cibles d'une quête dans la zone : points fusionnés à 1,5 % près, et centre du secteur le plus dense. */
  const ciblesDans = (q: Q, lieu: string): EtapeGuide["cib"] => {
    const pts: [number, number][] = [];
    const ajouterPts = (p?: Position) => {
      for (const [u, v] of p?.z?.[lieu] ?? []) if (pts.length < 40 && !pts.some(([a, b]) => Math.abs(a - u) < 1.5 && Math.abs(b - v) < 1.5)) pts.push([u, v]);
    };
    q.ciblesPnj.forEach((id) => ajouterPts(posPnj.get(id)));
    q.ciblesDecor.forEach((id) => ajouterPts(posDecor.get(id)));
    if (!pts.length) return null;
    const voisins = (a: [number, number]) => pts.filter((b) => Math.hypot(a[0] - b[0], a[1] - b[1]) < 8);
    const coeur = voisins([...pts].sort((a, b) => voisins(b).length - voisins(a).length)[0]);
    const c: [number, number] = [
      Math.round((coeur.reduce((s, x) => s + x[0], 0) / coeur.length) * 10) / 10,
      Math.round((coeur.reduce((s, x) => s + x[1], 0) / coeur.length) * 10) / 10,
    ];
    return { p: pts.slice(0, 16), c };
  };
  const placer = (r: Ref | undefined) => {
    if (!r) return null;
    const p = r.t === "pnj" ? posPnj.get(r.id) : r.t === "decor" ? posDecor.get(r.id) : undefined;
    return zoneDe(p);
  };
  for (const camp of ["alliance", "horde"] as const) {
    const masque = camp === "alliance" ? ALLIANCE : HORDE;
    for (const z of parcours[camp]) {
      const depart = DEPARTS.has(z.lieu);
      const niveaux: [number, number] = depart ? [1, z.niveaux[1]] : z.niveaux;
      // Marges : 3 niveaux sous la fourchette (quêtes de niveau 10 de la Croisée, juste sous celle des Tarides), 6 au-dessus
      // (quêtes de Moulin-de-Tarren, de 39 à 41, au-dessus de celle des contreforts de Hautebrande).
      const [bas, haut] = [niveaux[0] - 3, niveaux[1] + 6];
      const hubs: Hub[] = [];
      // Deux PNJ à moins de 4 % de carte l'un de l'autre (un même village) forment un même point de rassemblement.
      const hubDe = (lieu: { lieu: string; x: number; y: number } | null, nom: string) => {
        if (!lieu || lieu.lieu !== z.lieu) return -1;
        let i = hubs.findIndex((h) => Math.hypot(h.x - lieu.x, h.y - lieu.y) < 4);
        if (i < 0) { hubs.push({ x: lieu.x, y: lieu.y, n: [] }); i = hubs.length - 1; }
        if (nom && !hubs[i].n.includes(nom)) hubs[i].n.push(nom);
        return i;
      };
      const etapes: EtapeGuide[] = [];
      for (const q of [...pourTous, ...quetesDeClasse]) {
        if (q.races && !(q.races & masque)) continue;
        if (q.niveau < bas || q.niveau > haut) continue;
        const d = (donneurs.get(q.id) ?? []).find((r) => r.t !== "pnj" || ouvertPnj(r.id, camp));
        const ld = placer(d);
        if (!d || !ld || ld.lieu !== z.lieu) continue;
        const rec = (receveurs.get(q.id) ?? [])[0];
        const lr = placer(rec);
        etapes.push({
          id: q.id, t: q.titre, nv: q.niveau, min: q.min, ra: q.races & (ALLIANCE | HORDE), cl: q.classes && nbClasses(q.classes) <= 2 ? q.classes : 0,
          grp: q.type === 1 ? 1 : 0, obj: q.objectifs,
          g: hubDe(ld, d.n), gn: d.n, r: hubDe(lr, rec?.n ?? ""), rn: rec?.n ?? "", rl: lr && lr.lieu !== z.lieu ? lr.lieu : null,
          av: q.prev > 0 ? q.prev : 0,
          cib: ciblesDans(q, z.lieu),
        });
      }
      // L'ordre de passage est calculé par race et par classe (lib/guide.ts) : ici, simple tri par niveau.
      etapes.sort((a, b) => (a.min || a.nv) - (b.min || b.nv) || a.nv - b.nv || a.id - b.id);
      // Une quête passe toujours après celle qu'elle demande d'avoir faite.
      for (let tour = 0; tour < 5; tour++) {
        let change = false;
        for (let i = 0; i < etapes.length; i++) {
          const j = etapes.findIndex((e) => e.id === etapes[i].av);
          if (j > i) { const [e] = etapes.splice(i, 1); etapes.splice(j, 0, e); change = true; i--; }
        }
        if (!change) break;
      }
      if (etapes.length >= 5) guide[camp].push({ lieu: z.lieu, niveaux, hubs, etapes });
    }
  }
  await writeFile(path.join(process.cwd(), `content/guide-jeu${suffixe}.json`), JSON.stringify({ version: donnees.version, guide }));
  console.log(`Guide 1-60 : ${(["alliance", "horde"] as const).map((c) => `${c} ${guide[c].length} zones, ${guide[c].reduce((s, z) => s + z.etapes.length, 0)} quêtes`).join(" ; ")}.`);
  console.log(`Quêtes de classe : ${Object.entries(classes).map(([c, ch]) => `${c} ${ch.reduce((s, x) => s + x.quetes.length, 0)} (${ch.length} chaînes)`).join(", ")}.`);
  console.log(`Parcours : Alliance ${parcours.alliance.length} zones, Horde ${parcours.horde.length} zones.`);
});
