import { writeFile } from "node:fs/promises";
import path from "node:path";
import { derniereVersion, tableCsv } from "../objets/wago";
import { objetInterne } from "../objets/conversion";
import { lancer } from "./_lanceur";
import { VILLES, lignes, lireCsv, lireDump, n, preparerPositions, type Position } from "./_bases-libres";

/**
 * Guides de quêtes : quêtes de classe (chaînes, donneurs, objectifs, récompenses) et parcours de montée en niveau
 * par faction (zones dans l'ordre des niveaux, principaux donneurs).
 *
 *   npm run base:quetes -- <dump CMaNGOS classic-db (.sql ou .sql.gz)> <dossier db_world d'AzerothCore>
 *
 * Données de l'Azeroth d'origine : CMaNGOS classic-db (GPL v3), titres et noms français AzerothCore (GPL v2). Seules
 * les quêtes encore présentes dans les fichiers de Forever (table QuestV2) sont gardées. Aucun texte de quête n'est
 * repris : les objectifs sont rédigés à partir des données (objets à rapporter, créatures à vaincre).
 * Résultat : content/quetes-jeu.json, lu par les pages /guides/quetes-de-classe/ et /guides/parcours/.
 */

const CLASSES: [string, number][] = [
  ["guerrier", 1], ["paladin", 2], ["chasseur", 4], ["voleur", 8], ["pretre", 16], ["chaman", 64], ["mage", 128], ["demoniste", 256], ["druide", 1024],
];
const TOUTES_CLASSES = 1503;
const RACES: [string, number][] = [
  ["Humain", 1], ["Orc", 2], ["Nain", 4], ["Elfe de la nuit", 8], ["Mort-vivant", 16], ["Tauren", 32], ["Gnome", 64], ["Troll", 128],
];
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
const nbClasses = (m: number) => [1, 2, 4, 8, 16, 64, 128, 256, 1024].filter((b) => m & b).length;

/** Types de quêtes laissés hors du parcours : JcJ, raid, donjon (on les fait en groupe, pas en suivant la route). */
const TYPES_HORS_PARCOURS = new Set([41, 62, 81]);

type Ref = { t: "pnj" | "decor" | "objet"; id: number; n: string; b?: boolean };

lancer("base:quetes", async () => {
  const [fichierDump, dossierLocales] = process.argv.slice(2);
  if (!fichierDump || !dossierLocales) throw new Error("Usage : npm run base:quetes -- <dump CMaNGOS> <dossier db_world AzerothCore>");
  const sql = await lireDump(fichierDump);
  const locale = async (f: string) => (await import("node:fs/promises")).readFile(path.join(dossierLocales, f), "utf8");
  const version = await derniereVersion();

  const [questV2, itemSparse, spellName, spellEffect, factionTemplate] = await Promise.all(
    ["QuestV2", "ItemSparse", "SpellName", "SpellEffect", "FactionTemplate"].map((t) => tableCsv(t, version)),
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

  // --- Noms français.
  const nomsCreatures = new Map<number, string>();
  const nomsDecor = new Map<number, string>();
  const titres = new Map<number, string>();
  for (const l of lignes(await locale("creature_template_locale.sql"), "creature_template_locale")) if (l.locale === "frFR" && l.Name) nomsCreatures.set(n(l.entry), String(l.Name));
  for (const l of lignes(await locale("gameobject_template_locale.sql"), "gameobject_template_locale")) if (l.locale === "frFR" && l.name) nomsDecor.set(n(l.entry), String(l.name));
  for (const l of lignes(await locale("quest_template_locale.sql"), "quest_template_locale")) if (l.locale === "frFR" && l.Title) titres.set(n(l.ID), String(l.Title));

  const creatures = new Map<number, { nom: string; faction: number }>();
  for (const l of lignes(sql, "creature_template")) creatures.set(n(l.Entry), { nom: nomsCreatures.get(n(l.Entry)) ?? String(l.Name ?? ""), faction: n(l.Faction) });
  const decor = new Map<number, string>();
  for (const l of lignes(sql, "gameobject_template")) decor.set(n(l.entry), nomsDecor.get(n(l.entry)) ?? String(l.name ?? ""));
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
    prev: number; suite: number; objectifs: string[]; objets: { id: number; n: string; q: number; choix: boolean; b: boolean }[]; sorts: string[]; argent: number;
  };
  const quetes = new Map<number, Q>();
  for (const l of lignes(sql, "quest_template")) {
    const id = n(l.entry);
    if (!quetesForever.has(id) || n(l.Method) === 1) continue;
    const depart = objetDeDepart.get(id);
    if (!donneurs.has(id) && !depart) continue;
    if (depart) ajouter(donneurs, id, { t: "objet", id: depart, n: nomsObjets.get(depart) ?? "", ...(enBase.has(depart) ? {} : { b: false }) });

    // Objectifs, rédigés à partir des données.
    const objectifs: string[] = [];
    for (let k = 1; k <= 4; k++) {
      const item = n(l[`ReqItemId${k}`]);
      const nb = n(l[`ReqItemCount${k}`]);
      if (item && nb) objectifs.push(`Rapporter ${nb > 1 ? `${nb} × ` : ""}${nomsObjets.get(item) ?? `objet ${item}`}`);
    }
    for (let k = 1; k <= 4; k++) {
      const cible = n(l[`ReqCreatureOrGOId${k}`]);
      const nb = n(l[`ReqCreatureOrGOCount${k}`]);
      const sort = n(l[`ReqSpellCast${k}`]);
      if (!cible || !nb) continue;
      const nom = cible > 0 ? creatures.get(cible)?.nom : decor.get(-cible);
      if (!nom) continue;
      if (sort) objectifs.push(`Utiliser ${nomsSorts.get(sort) ?? "le sort demandé"} sur ${nb > 1 ? `${nb} × ` : ""}${nom}`);
      else if (cible > 0) objectifs.push(`Vaincre ${nb > 1 ? `${nb} × ` : ""}${nom}`);
      else objectifs.push(`Activer ${nb > 1 ? `${nb} × ` : ""}${nom}`);
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
      objectifs, objets, sorts: [...new Set(sorts)], argent: Math.max(0, n(l.RewOrReqMoney)),
    });
  }
  console.log(`${quetes.size} quêtes de l'Azeroth d'origine présentes dans Forever (${quetesForever.size} dans ses fichiers).`);

  // --- Positions des donneurs et receveurs cités.
  const { positions, tuilesLues } = await preparerPositions(sql, version);
  const pnjCites = new Set<number>();
  const decorCites = new Set<number>();
  const citer = (r: Ref) => (r.t === "pnj" ? pnjCites.add(r.id) : r.t === "decor" ? decorCites.add(r.id) : null);

  // --- Quêtes de classe, en chaînes.
  const racesDe = (masque: number) => {
    const m = masque & (ALLIANCE | HORDE);
    if (!m || m === (ALLIANCE | HORDE)) return null;
    if (m === ALLIANCE) return ["Alliance"];
    if (m === HORDE) return ["Horde"];
    return RACES.filter(([, b]) => m & b).map(([r]) => r);
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
  const pourTous = [...quetes.values()].filter((q) => (!q.classes || (q.classes & TOUTES_CLASSES) === TOUTES_CLASSES) && q.niveau > 0 && !TYPES_HORS_PARCOURS.has(q.type) && !SAISONNIERES.has(q.zone));
  for (const q of pourTous) for (const r of donneurs.get(q.id) ?? []) if (r.t === "pnj") pnjCites.add(r.id);

  const posPnj = await positions("creature", "creature_spawn_entry", pnjCites);
  const posDecor = await positions("gameobject", "gameobject_spawn_entry", decorCites);
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
      const pnj = (donneurs.get(q.id) ?? []).find((r) => r.t === "pnj" && ouvertA(creatures.get(r.id)?.faction ?? 0, camp) && zoneDe(posPnj.get(r.id)));
      if (!pnj) continue;
      const z = zoneDe(posPnj.get(pnj.id))!;
      // Les capitales ne sont pas une étape de la route : leurs quêtes renvoient vers les zones.
      if (autre.has(z.lieu) || VILLES.has(z.lieu)) continue;
      const e = parZone.get(z.lieu) ?? { niveaux: [] as number[], donneurs: new Map<number, { quetes: number; x: number; y: number }>() };
      e.niveaux.push(q.niveau);
      const d = e.donneurs.get(pnj.id) ?? { quetes: 0, x: z.x, y: z.y };
      d.quetes++;
      e.donneurs.set(pnj.id, d);
      parZone.set(z.lieu, e);
    }
    const centile = (l: number[], p: number) => l[Math.min(l.length - 1, Math.floor(p * l.length))];
    parcours[camp] = [...parZone.entries()]
      .filter(([, e]) => e.niveaux.length >= 8)
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
  const donnees = { version: { jeu: version, source: "CMaNGOS classic-db (GPL v3), titres et noms français AzerothCore (GPL v2)" }, classes, quetes: fiches, parcours };
  await writeFile(path.join(process.cwd(), "content/quetes-jeu.json"), JSON.stringify(donnees));
  console.log(`Quêtes de classe : ${Object.entries(classes).map(([c, ch]) => `${c} ${ch.reduce((s, x) => s + x.quetes.length, 0)} (${ch.length} chaînes)`).join(", ")}.`);
  console.log(`Parcours : Alliance ${parcours.alliance.length} zones, Horde ${parcours.horde.length} zones.`);
});
