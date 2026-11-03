import { readFileSync } from "node:fs";
import path from "node:path";
import { CLASSES } from "@/content/classes";
import { SKYBORNE } from "@/content/monde";
import { NIVEAUX_ZEPHRAS, QUETES_ZEPHRAS, type QueteZephras } from "@/content/zephras";
import { carte } from "./cartes";

/**
 * Guide de 1 à 60 : content/guide-jeu.json (npm run base:quetes), adapté à une race et une classe.
 *  - départ dans la zone de sa race, sans passer par celles des autres races ;
 *  - jusqu'au niveau 30, zones du continent de départ seulement (on ne traverse pas l'océan au niveau 12) ;
 *  - quêtes réservées à d'autres races ou d'autres classes retirées, quêtes de classe gardées à leur place.
 * Les Skyborne commencent sur l'île de Zéphras (quêtes saisies à la main dans content/zephras.ts), puis suivent la route de
 * leur faction à partir du niveau 10, sur les deux continents (le port d'arrivée reste à confirmer).
 */

export interface Hub { x: number; y: number; n: string[] }
export interface EtapeGuide {
  id: number; t: string; nv: number; min: number; ra: number; cl: number; grp: 0 | 1; obj: string[];
  g: number; gn: string; r: number; rn: string; rl: string | null; av: number;
  /** Cibles des objectifs dans la zone (points en % de la carte) et centre du secteur principal. */
  cib: { p: [number, number][]; c: [number, number] } | null;
}
export interface ZoneGuide { lieu: string; niveaux: [number, number]; hubs: Hub[]; etapes: EtapeGuide[] }

export interface RaceGuide {
  slug: string; nom: string; faction: "alliance" | "horde"; bit: number; depart: string;
  /** Skyborne : ordre de la faction, et classes ouvertes par cet ordre. */
  skyborne?: { ordre: string; classes: string[] };
}

const slugClasse = (nom: string) => CLASSES.find((c) => c.nom === nom)?.slug ?? "";
const ordre = (faction: "Alliance" | "Horde") => SKYBORNE.ordres.find((o) => o.faction === faction)!;
/** Masque des races de chaque faction, tel que le portent les quêtes réservées à toute une faction. */
const MASQUE_FACTION = { alliance: 1 | 4 | 8 | 64, horde: 2 | 16 | 32 | 128 } as const;
export const ZEPHRAS = "ile-de-zephras";

export const RACES_GUIDE: RaceGuide[] = [
  { slug: "humain", nom: "Humain", faction: "alliance", bit: 1, depart: "foret-d-elwynn" },
  { slug: "nain", nom: "Nain", faction: "alliance", bit: 4, depart: "dun-morogh" },
  { slug: "elfe-de-la-nuit", nom: "Elfe de la nuit", faction: "alliance", bit: 8, depart: "teldrassil" },
  { slug: "gnome", nom: "Gnome", faction: "alliance", bit: 64, depart: "dun-morogh" },
  { slug: "orc", nom: "Orc", faction: "horde", bit: 2, depart: "durotar" },
  { slug: "mort-vivant", nom: "Mort-vivant", faction: "horde", bit: 16, depart: "clairieres-de-tirisfal" },
  { slug: "tauren", nom: "Tauren", faction: "horde", bit: 32, depart: "mulgore" },
  { slug: "troll", nom: "Troll", faction: "horde", bit: 128, depart: "durotar" },
  {
    slug: "skyborne-alliance", nom: "Skyborne", faction: "alliance", bit: 0, depart: ZEPHRAS,
    skyborne: { ordre: ordre("Alliance").nom, classes: ordre("Alliance").classes.map(slugClasse).filter(Boolean) },
  },
  {
    slug: "skyborne-horde", nom: "Skyborne", faction: "horde", bit: 0, depart: ZEPHRAS,
    skyborne: { ordre: ordre("Horde").nom, classes: ordre("Horde").classes.map(slugClasse).filter(Boolean) },
  },
];

/** Nom à afficher : « Skyborne (Alliance) » pour distinguer les deux ordres. */
export const nomRace = (r: RaceGuide) => (r.skyborne ? `${r.nom} (${r.faction === "alliance" ? "Alliance" : "Horde"})` : r.nom);

export const BITS_CLASSES: Record<string, number> = {
  guerrier: 1, paladin: 2, chasseur: 4, voleur: 8, pretre: 16, chaman: 64, mage: 128, demoniste: 256, druide: 1024,
};

const DEPARTS = new Set(RACES_GUIDE.filter((r) => !r.skyborne).map((r) => r.depart));

let cache: { version: { jeu: string; source: string }; guide: Record<"alliance" | "horde", ZoneGuide[]> } | null | undefined;
function donnees() {
  if (cache === undefined) {
    try {
      cache = JSON.parse(readFileSync(path.join(process.cwd(), "content/guide-jeu.json"), "utf8"));
    } catch {
      cache = null;
    }
  }
  return cache;
}

export const versionGuide = () => donnees()?.version ?? null;
export const raceGuide = (slug: string) => RACES_GUIDE.find((r) => r.slug === slug);

/** Combinaisons jouables (races de chaque classe, hors Skyborne qui démarrent sur l'île de Zéphras). */
export function combinaisons(): { race: RaceGuide; classe: (typeof CLASSES)[number] }[] {
  const res: { race: RaceGuide; classe: (typeof CLASSES)[number] }[] = [];
  for (const race of RACES_GUIDE) {
    for (const c of CLASSES) {
      if (race.skyborne ? race.skyborne.classes.includes(c.slug) : c.races.some((r) => r.race === race.nom)) res.push({ race, classe: c });
    }
  }
  return res;
}

export const cleGuide = (race: RaceGuide, classe: string) => `${race.faction}:${race.slug}:${classe}`;

export function libelleGuide(cle: string): { nom: string; lien: string } {
  const [, race, classe] = cle.split(":");
  const r = raceGuide(race);
  const c = CLASSES.find((x) => x.slug === classe);
  return { nom: `Guide de 1 à 60 · ${r ? nomRace(r) : race} ${c?.nom.toLowerCase() ?? classe}`, lien: `/guides/parcours/${race}/${classe}/` };
}

/**
 * Étape de l'île de Zéphras, d'après les quêtes saisies dans content/zephras.ts (aucune tant que rien n'est relevé en jeu).
 * Les PNJ d'un même village forment un point, comme ailleurs.
 */
export function zoneZephras(race: RaceGuide, classe: string, quetes: QueteZephras[] = QUETES_ZEPHRAS): ZoneGuide {
  const hubs: Hub[] = [];
  const hubDe = (p: { nom: string; x: number; y: number } | undefined) => {
    if (!p) return -1;
    let i = hubs.findIndex((h) => Math.hypot(h.x - p.x, h.y - p.y) < 4);
    if (i < 0) { hubs.push({ x: p.x, y: p.y, n: [] }); i = hubs.length - 1; }
    if (!hubs[i].n.includes(p.nom)) hubs[i].n.push(p.nom);
    return i;
  };
  const etapes: EtapeGuide[] = quetes
    .filter((q) => (!q.faction || q.faction === race.faction) && (!q.classes?.length || q.classes.includes(classe)))
    .map((q) => {
      const rendre = q.rendre ?? q.donneur;
      const pts = q.cibles ?? [];
      const c: [number, number] | null = pts.length
        ? [Math.round((pts.reduce((s, p) => s + p[0], 0) / pts.length) * 10) / 10, Math.round((pts.reduce((s, p) => s + p[1], 0) / pts.length) * 10) / 10]
        : null;
      return {
        id: q.id, t: q.titre, nv: q.niveau, min: q.min ?? 0, ra: 0, cl: q.classes?.length ? q.classes.reduce((m, s) => m | (BITS_CLASSES[s] ?? 0), 0) : 0,
        grp: q.groupe ? 1 : 0, obj: q.objectifs, g: hubDe(q.donneur), gn: q.donneur.nom, r: hubDe(rendre), rn: rendre.nom, rl: null,
        av: q.avant ?? 0, cib: c ? { p: pts, c } : null,
      } as EtapeGuide;
    })
    .sort((a, b) => (a.min || a.nv) - (b.min || b.nv) || a.nv - b.nv || a.id - b.id);
  return { lieu: ZEPHRAS, niveaux: NIVEAUX_ZEPHRAS ?? [1, 10], hubs, etapes };
}

export function guidePour(race: RaceGuide, classe: string): ZoneGuide[] {
  const d = donnees();
  const bitClasse = BITS_CLASSES[classe] ?? 0;
  if (race.skyborne) {
    // Après l'île : la route de la faction à partir du niveau 10, hors zones de départ des autres races ; seules les
    // quêtes ouvertes à toute la faction (ou à tous) sont gardées, faute de masque de race propre aux Skyborne.
    const masque = MASQUE_FACTION[race.faction];
    const suite = (d?.guide[race.faction] ?? [])
      .filter((z) => !DEPARTS.has(z.lieu) && z.niveaux[0] >= 10)
      .map((z) => ({ ...z, etapes: z.etapes.filter((e) => (!e.ra || e.ra === masque) && (!e.cl || e.cl & bitClasse)) }))
      .filter((z) => z.etapes.length >= 4);
    return [zoneZephras(race, classe), ...suite];
  }
  const continent = carte(race.depart)?.continent;
  if (!d) return [];
  return d.guide[race.faction]
    .filter((z) => z.lieu === race.depart || !DEPARTS.has(z.lieu) || z.niveaux[0] >= 12)
    .filter((z) => z.lieu === race.depart || z.niveaux[1] >= 30 || carte(z.lieu)?.continent === continent)
    .map((z) => ({ ...z, etapes: z.etapes.filter((e) => (!e.ra || e.ra & race.bit) && (!e.cl || e.cl & bitClasse)) }))
    .filter((z) => z.etapes.length >= 4)
    // La zone de départ ouvre toujours la route.
    .sort((a, b) => Number(b.lieu === race.depart) - Number(a.lieu === race.depart));
}

// --- Ordre de passage : on simule le joueur dans la zone.

export type TypeAction = "prendre" | "faire" | "rendre";
export interface Action { a: TypeAction; q: number }
export interface Arret {
  /** Position sur la carte (null : à faire hors de la zone, par exemple rendre une quête ailleurs). */
  x: number | null;
  y: number | null;
  type: "pnj" | "cible" | "ailleurs";
  hub: number;
  actions: Action[];
}

const RAYON_CIBLES = 7;

/**
 * Ordre logique d'une zone, quête par quête :
 *  - une quête se prend à son niveau (niveau minimal atteint) et seulement si sa quête préalable a été rendue ;
 *  - elle se rend après avoir atteint ses cibles (monstres à vaincre, objets à ramasser), jamais avant ;
 *  - à chaque point, on rend tout ce qui est fini puis on prend tout ce qui est disponible ;
 *  - on va toujours au plus proche : cible d'une quête en cours, PNJ à qui rendre, PNJ qui propose une quête.
 * Le niveau du joueur suit les quêtes rendues ; s'il manque des niveaux pour la suite, on l'avance au plus juste.
 */
export function planifier(z: { niveaux: [number, number]; hubs: Hub[]; etapes: EtapeGuide[] }): Arret[] {
  const E = z.etapes;
  const ids = new Map(E.map((e, i) => [e.id, i]));
  const etat = E.map(() => "dispo" as "dispo" | "prise" | "finie" | "rendue");
  const arrets: Arret[] = [];
  let niveau = Math.max(1, z.niveaux[0]);
  let ici: { x: number; y: number } | null = null;

  const minimum = (e: EtapeGuide) => e.min || Math.max(1, e.nv - 2);
  const prealableRendu = (e: EtapeGuide) => !e.av || !ids.has(e.av) || etat[ids.get(e.av)!] === "rendue";
  const disponible = (i: number) => etat[i] === "dispo" && minimum(E[i]) <= niveau && prealableRendu(E[i]);
  const distance = (p: { x: number; y: number }) => (ici ? Math.hypot(p.x - ici.x, p.y - ici.y) : 0);
  // Une quête sans cible sur la carte (lettre à remettre, objectif hors de la zone) est faite dès qu'elle est prise.
  const finieDesLaPrise = (e: EtapeGuide) => !e.cib;

  const arreter = (a: Omit<Arret, "actions">, actions: Action[]) => {
    if (!actions.length) return;
    const dernier = arrets[arrets.length - 1];
    if (dernier && dernier.type === a.type && dernier.hub === a.hub && dernier.x === a.x && dernier.y === a.y) dernier.actions.push(...actions);
    else arrets.push({ ...a, actions });
    if (a.x !== null && a.y !== null) ici = { x: a.x, y: a.y };
  };

  const rendre = (i: number, actions: Action[]) => {
    etat[i] = "rendue";
    niveau = Math.max(niveau, E[i].nv - 1);
    actions.push({ a: "rendre", q: i });
  };

  /** Au point de rassemblement h : rendre ce qui est fini, prendre ce qui est disponible, tant qu'il y a du nouveau. */
  const auPoint = (h: number) => {
    const actions: Action[] = [];
    for (let encore = true; encore; ) {
      encore = false;
      E.forEach((e, i) => {
        if (etat[i] === "finie" && (e.r === h || (e.r < 0 && !e.rl && e.g === h))) { rendre(i, actions); encore = true; }
      });
      E.forEach((e, i) => {
        if (e.g === h && disponible(i)) {
          etat[i] = finieDesLaPrise(e) ? "finie" : "prise";
          actions.push({ a: "prendre", q: i });
          if (finieDesLaPrise(e) && e.obj.length) actions.push({ a: "faire", q: i });
          encore = true;
        }
      });
    }
    arreter({ x: z.hubs[h].x, y: z.hubs[h].y, type: "pnj", hub: h }, actions);
  };

  for (let tour = 0; tour < 2000; tour++) {
    // Les quêtes à rendre hors de la zone sont notées à part, dès que leurs objectifs sont faits.
    const ailleurs: Action[] = [];
    E.forEach((e, i) => { if (etat[i] === "finie" && e.r < 0 && e.rl) rendre(i, ailleurs); });
    if (ailleurs.length) arreter({ x: null, y: null, type: "ailleurs", hub: -1 }, ailleurs);

    type Cible = { x: number; y: number; faire: () => void };
    const choix: Cible[] = [];
    E.forEach((e, i) => {
      if (etat[i] === "prise" && e.cib) {
        const [x, y] = e.cib.c;
        choix.push({
          x, y,
          faire: () => {
            // Toutes les quêtes en cours dont les cibles sont dans le même secteur se font ensemble.
            const actions: Action[] = [];
            E.forEach((f, j) => {
              if (etat[j] === "prise" && f.cib && Math.hypot(f.cib.c[0] - x, f.cib.c[1] - y) < RAYON_CIBLES) { etat[j] = "finie"; actions.push({ a: "faire", q: j }); }
            });
            arreter({ x, y, type: "cible", hub: -1 }, actions);
          },
        });
      }
      const h = etat[i] === "finie" && e.r >= 0 ? e.r : etat[i] === "finie" && e.r < 0 && !e.rl && e.g >= 0 ? e.g : disponible(i) && e.g >= 0 ? e.g : -1;
      if (h >= 0) choix.push({ x: z.hubs[h].x, y: z.hubs[h].y, faire: () => auPoint(h) });
    });
    if (choix.length) {
      choix.sort((a, b) => distance(a) - distance(b))[0].faire();
      continue;
    }
    // Plus rien à faire au niveau actuel : on gagne le niveau qui manque pour la quête la plus accessible.
    const restantes = E.map((e, i) => i).filter((i) => etat[i] === "dispo" && E[i].g >= 0 && prealableRendu(E[i]));
    if (!restantes.length) break;
    niveau = Math.min(...restantes.map((i) => minimum(E[i])));
  }
  return arrets;
}

let parZone: Map<string, { race: RaceGuide; classes: string[] }[]> | undefined;
/** Guides (race et classes) dont la route passe par cette zone, pour proposer le guide depuis la page de la zone. */
export function guidesPassantPar(lieu: string): { race: RaceGuide; classes: string[] }[] {
  if (!parZone) {
    parZone = new Map();
    for (const { race, classe } of combinaisons()) {
      for (const z of guidePour(race, classe.slug)) {
        const liste: { race: RaceGuide; classes: string[] }[] = parZone.get(z.lieu) ?? [];
        let e = liste.find((x) => x.race.slug === race.slug);
        if (!e) { e = { race, classes: [] }; liste.push(e); }
        if (!e.classes.includes(classe.slug)) e.classes.push(classe.slug);
        parZone.set(z.lieu, liste);
      }
    }
  }
  return parZone.get(lieu) ?? [];
}
