import { readFile } from "node:fs/promises";
import path from "node:path";

/**
 * Relevés en jeu des joueurs de Questie, pour les quêtes ajoutées par WoW Forever (inconnues de CMaNGOS et d'AzerothCore).
 *
 * Source : dépôt QuestieDB (https://github.com/Questie/QuestieDB, licence GPL v3 consentie par l'équipe Questie), dossiers
 * « traces » seulement. Ils sont produits par l'outil QuestieTrace à partir de ce que les joueurs ont vu en jeu (plus de
 * 200 000 fichiers d'enregistrement au 14/11/2026). Le reste des données Forever de QuestieDB (base de départ « delta-base »,
 * correctifs saisis) vient en partie de Wowhead : il n'est jamais lu ici. Les adresses Wowhead écrites en commentaire dans
 * les relevés sont ignorées avec les commentaires.
 *
 * Aucun texte de quête n'est repris (`objectivesText` n'est pas lu) : seulement les titres, les niveaux, les PNJ, les
 * objets et leurs positions. Lecture sans exécuter le Lua : les fichiers sont des tables générées, analysées ici.
 */

export type ValeurLua = number | string | boolean | null | ValeurLua[] | { [cle: string]: ValeurLua };

/** Analyse une valeur Lua littérale (nombres, chaînes, nil, tables en liste ou à clés [n]=…), à partir de `debut`. */
export function lireValeurLua(texte: string, debut = 0): { valeur: ValeurLua; fin: number } {
  let i = debut;
  const blancs = () => { while (i < texte.length && /\s/.test(texte[i])) i++; };
  const valeur = (): ValeurLua => {
    blancs();
    const c = texte[i];
    if (c === "{") {
      i++;
      const liste: ValeurLua[] = [];
      const cles: Record<string, ValeurLua> = {};
      let avecCles = false;
      for (;;) {
        blancs();
        if (texte[i] === "}") { i++; break; }
        if (texte[i] === "[") {
          i++;
          const cle = valeur();
          blancs();
          if (texte[i] !== "]") throw new Error(`Lua : « ] » attendu en ${i}`);
          i++;
          blancs();
          if (texte[i] !== "=") throw new Error(`Lua : « = » attendu en ${i}`);
          i++;
          cles[String(cle)] = valeur();
          avecCles = true;
        } else {
          liste.push(valeur());
        }
        blancs();
        if (texte[i] === "," || texte[i] === ";") { i++; continue; }
        if (texte[i] === "}") { i++; break; }
        throw new Error(`Lua : « , » ou « } » attendu en ${i}`);
      }
      return avecCles ? { ...Object.fromEntries(liste.map((v, k) => [String(k + 1), v])), ...cles } : liste;
    }
    if (c === '"' || c === "'") {
      const q = c;
      i++;
      let s = "";
      while (i < texte.length && texte[i] !== q) {
        if (texte[i] === "\\") {
          const e = texte[i + 1];
          s += e === "n" ? "\n" : e === "t" ? "\t" : e;
          i += 2;
          continue;
        }
        s += texte[i++];
      }
      i++;
      return s;
    }
    const m = /^(nil|true|false|-?\d+(?:\.\d+)?(?:e-?\d+)?)/.exec(texte.slice(i, i + 40));
    if (!m) throw new Error(`Lua : valeur illisible en ${i} (« ${texte.slice(i, i + 20)} »)`);
    i += m[0].length;
    return m[0] === "nil" ? null : m[0] === "true" ? true : m[0] === "false" ? false : Number(m[0]);
  };
  const v = valeur();
  return { valeur: v, fin: i };
}

/** Retire les commentaires Lua d'une ligne (hors chaînes) : les relations écartées et les liens Wowhead disparaissent. */
export function sansCommentaires(texte: string): string {
  return texte
    .split("\n")
    .map((ligne) => {
      let dans: string | null = null;
      for (let k = 0; k < ligne.length; k++) {
        const c = ligne[k];
        if (dans) { if (c === "\\") k++; else if (c === dans) dans = null; continue; }
        if (c === '"' || c === "'") dans = c;
        else if (c === "-" && ligne[k + 1] === "-") return ligne.slice(0, k);
      }
      return ligne;
    })
    .join("\n");
}

/** Blocs `[id] = { … }` d'un fichier de relevés : identifiant → champs `[xxxKeys.champ] = valeur` (premier relevé gardé). */
export function blocsReleves(texte: string): Map<number, Record<string, ValeurLua>> {
  const propre = sansCommentaires(texte);
  const res = new Map<number, Record<string, ValeurLua>>();
  const debutBloc = /^\s*\[(\d+)\]\s*=\s*\{/gm;
  let m: RegExpExecArray | null;
  while ((m = debutBloc.exec(propre))) {
    const champs: Record<string, ValeurLua> = {};
    let i = m.index + m[0].length;
    for (;;) {
      while (i < propre.length && /[\s,]/.test(propre[i])) i++;
      if (propre[i] === "}" || i >= propre.length) break;
      const c = /^\[(\w+)Keys\.(\w+)\]\s*=\s*/.exec(propre.slice(i, i + 80));
      if (!c) break;
      i += c[0].length;
      const { valeur, fin } = lireValeurLua(propre, i);
      if (!(c[2] in champs)) champs[c[2]] = valeur;
      i = fin;
    }
    debutBloc.lastIndex = i;
    if (Object.keys(champs).length) res.set(Number(m[1]), champs);
  }
  return res;
}

/** Table de traduction l10n (`[id] = "nom"` ou `[id] = {"nom", …}`) : identifiant → nom. */
export function nomsTraduits(texte: string): Map<number, string> {
  const res = new Map<number, string>();
  const ligne = /^\[(\d+)\] = \{?"((?:[^"\\]|\\.)*)"/gm;
  let m: RegExpExecArray | null;
  while ((m = ligne.exec(texte))) res.set(Number(m[1]), m[2].replace(/\\(.)/g, "$1"));
  return res;
}

/** Liste d'identifiants dans une table Lua : `{{1,2}}` → groupe 0, `{nil,{3}}` → groupe 1. */
const groupe = (v: ValeurLua | undefined, k: number): number[] => {
  if (!Array.isArray(v)) return [];
  const g = v[k];
  if (!Array.isArray(g)) return [];
  return g.map((x) => (Array.isArray(x) ? x[0] : x)).filter((x): x is number => typeof x === "number");
};
const nombres = (v: ValeurLua | undefined): number[] => (Array.isArray(v) ? v.filter((x): x is number => typeof x === "number") : []);

export interface QueteQuestie {
  id: number; nom: string; niveau: number; races: number;
  donneurs: { pnj: number[]; decor: number[]; objet: number[] };
  receveurs: { pnj: number[]; decor: number[] };
  /** Cibles des objectifs : créatures, objets du décor, objets à rapporter. */
  cibles: { pnj: number[]; decor: number[]; objets: number[] };
  prev: number; suite: number;
}
export interface LieuQuestie { id: number; nom: string; zone: number; points: [number, number, number][]; amical: string }
export interface ObjetQuestie { id: number; nom: string; pnj: number[]; decor: number[] }

/** Lit les relevés de QuestieDB pour Forever. `dossier` : racine d'un clone de QuestieDB. */
export async function lireQuestie(dossier: string, locale: "frFR" | "enUS" = "frFR") {
  const traces = path.join(dossier, "src", "corrections", "Forever", "traces");
  const l10n = path.join(dossier, "l10n", "Forever", "traces");
  const lire = (f: string) => readFile(f, "utf8");
  const [q, rel, pnj, decor, objets, zones] = await Promise.all([
    lire(path.join(traces, "foreverQuestTraces.lua")),
    lire(path.join(traces, "foreverQuestRelationTraces.lua")),
    lire(path.join(traces, "foreverNpcTraces.lua")),
    lire(path.join(traces, "foreverObjectTraces.lua")),
    lire(path.join(traces, "foreverItemTraces.lua")),
    lire(path.join(dossier, "support", "Forever", "Zones", "areaIdToUiMapId.lua")),
  ]);
  const fr = locale === "frFR"
    ? await Promise.all(["lookupQuests", "lookupNpcs", "lookupObjects", "lookupItems"].map((d) => lire(path.join(l10n, d, "frFR.lua")).then(nomsTraduits, () => new Map<number, string>())))
    : [new Map<number, string>(), new Map<number, string>(), new Map<number, string>(), new Map<number, string>()];
  const [titresFr, pnjFr, decorFr, objetsFr] = fr;

  const relations = blocsReleves(rel);
  const quetes = new Map<number, QueteQuestie>();
  for (const [id, c] of blocsReleves(q)) {
    const r = relations.get(id) ?? {};
    const obj = c.objectives;
    quetes.set(id, {
      id,
      nom: titresFr.get(id) ?? String(c.name ?? ""),
      niveau: typeof c.questLevel === "number" ? c.questLevel : 0,
      races: typeof c.requiredRaces === "number" ? c.requiredRaces : 0,
      donneurs: { pnj: groupe(c.startedBy_add, 0), decor: groupe(c.startedBy_add, 1), objet: groupe(c.startedBy_add, 2) },
      receveurs: { pnj: groupe(c.finishedBy_add, 0), decor: groupe(c.finishedBy_add, 1) },
      cibles: { pnj: groupe(obj, 0), decor: groupe(obj, 1), objets: groupe(obj, 2) },
      prev: nombres(r.preQuestSingle)[0] ?? 0,
      suite: typeof r.nextQuestInChain === "number" ? r.nextQuestInChain : 0,
    });
  }
  const lieux = (texte: string, noms: Map<number, string>) => {
    const res = new Map<number, LieuQuestie>();
    for (const [id, c] of blocsReleves(texte)) {
      const points: [number, number, number][] = [];
      const sp = c.spawns;
      if (sp && typeof sp === "object" && !Array.isArray(sp)) {
        for (const [zone, liste] of Object.entries(sp)) {
          if (!Array.isArray(liste)) continue;
          for (const p of liste) if (Array.isArray(p) && typeof p[0] === "number" && typeof p[1] === "number" && p[0] >= 0) points.push([Number(zone), p[0], p[1]]);
        }
      }
      res.set(id, { id, nom: noms.get(id) ?? String(c.name ?? ""), zone: typeof c.zoneID === "number" ? c.zoneID : 0, points, amical: typeof c.friendlyToFaction === "string" ? c.friendlyToFaction : "" });
    }
    return res;
  };
  const listeObjets = new Map<number, ObjetQuestie>();
  for (const [id, c] of blocsReleves(objets)) listeObjets.set(id, { id, nom: objetsFr.get(id) ?? String(c.name ?? ""), pnj: nombres(c.npcDrops_add), decor: nombres(c.objectDrops_add) });
  // Zone (AreaTable) → carte du jeu (UiMap) : une sous-zone renvoie à la carte de sa zone.
  const uiMap = new Map<number, number>();
  for (const m of zones.matchAll(/^\s*\[(\d+)\]\s*=\s*(\d+),/gm)) if (Number(m[2])) uiMap.set(Number(m[1]), Number(m[2]));
  return { quetes, pnj: lieux(pnj, pnjFr), decor: lieux(decor, decorFr), objets: listeObjets, uiMap };
}

export type ReleveQuestie = Awaited<ReturnType<typeof lireQuestie>>;
