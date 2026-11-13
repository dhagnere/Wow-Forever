import { CARTES_JEU } from "@/content/cartes-jeu";
import { QUETES_FOREVER } from "@/content/ajouts-forever";
import { PARCOURS_RELEVES, type ParcoursReleve } from "@/content/parcours-releves";
import { CLASSE_JEU, RACE_JEU } from "./jeu";
import { combinaisons, guidePour, nomRace, ordreDuGuide, raceGuide, RACES_GUIDE, type RaceGuide } from "./guide";
import { nomLieu } from "./quetes";

/**
 * Guides à valider de Probe (/admin/probe) : le code que donne /ep export dans EternalProbe, lu, converti en parcours
 * relevés (même format que content/parcours-releves.ts) et vérifié avant publication. Fonctions pures : la base est
 * dans modules/veille/probe.
 */

// ——— Lecture du code ———

export interface EvenementProbe { t: number; type: string; champs: string[] }
export interface ExportProbe {
  personnage: string;
  raceFichier: string;
  raceNom: string;
  classeFichier: string;
  faction: string;
  niveau: number;
  partie: string;
  /** Carte où se trouvait le personnage au début de l'enregistrement (avant la première position relevée). */
  carte: number | null;
  quetes: Map<number, string>;
  evenements: EvenementProbe[];
}

export const TAILLE_MAX_CODE = 4_000_000;

/** Lit le code de /ep export. Lève une erreur au message lisible (code tronqué, autre texte collé…). */
export function lireExport(code: string): ExportProbe {
  const brut = code.replace(/\s+/g, "");
  if (!brut) throw new Error("Aucun code collé.");
  if (brut.length > TAILLE_MAX_CODE) throw new Error("Code trop long : exportez une séance plus courte.");
  if (!brut.startsWith("EP1:")) throw new Error("Ce n'est pas un code d'EternalProbe : il doit commencer par « EP1: » (commande /ep export en jeu).");
  const corps = brut.slice(4);
  if (!/^[A-Za-z0-9+/]+=*$/.test(corps)) throw new Error("Le code contient des caractères inattendus : recopiez-le tel quel depuis la fenêtre du jeu.");
  const lignes = Buffer.from(corps, "base64").toString("utf8").split("\n");
  if (lignes[0] !== "EP|1") throw new Error("Version de code inconnue : mettez EternalProbe à jour.");
  const fin = lignes[lignes.length - 1].match(/^fin\|(\d+)$/);
  if (!fin || Number(fin[1]) !== lignes.length) throw new Error("Code incomplet : il a été coupé au collage. Recopiez-le en entier (bouton « Tout resélectionner », puis Ctrl+C).");
  const ctx = (lignes.find((l) => l.startsWith("ctx|")) ?? "ctx").split("|");
  const quetes = new Map<number, string>();
  const evenements: EvenementProbe[] = [];
  for (const l of lignes.slice(1, -1)) {
    const p = l.split("|");
    if (p[0] === "ctx") continue;
    if (p[0] === "q") {
      const id = Number(p[1]);
      if (Number.isFinite(id) && p[2]) quetes.set(id, p.slice(2).join("|"));
      continue;
    }
    const t = Number(p[0]);
    if (Number.isFinite(t) && p[1]) evenements.push({ t, type: p[1], champs: p.slice(2) });
  }
  return {
    personnage: ctx[1] ?? "", raceFichier: ctx[2] ?? "", raceNom: ctx[3] ?? "", classeFichier: ctx[4] ?? "",
    faction: ctx[5] ?? "", niveau: Number(ctx[6]) || 0, partie: ctx[7] ?? "", carte: Number(ctx[9]) || null, quetes, evenements,
  };
}

// ——— Conversion en parcours ———

const LIEU_PAR_CARTE = new Map(Object.entries(CARTES_JEU).filter(([, c]) => c.type === "zone").map(([lieu, c]) => [c.id, lieu]));
const RACE_PAR_FICHIER = new Map(Object.entries(RACE_JEU).filter(([, f]) => f).map(([slug, f]) => [f as string, slug]));
const CLASSE_PAR_FICHIER = new Map(Object.entries(CLASSE_JEU).map(([slug, f]) => [f, slug]));
const FOREVER_PAR_TITRE = new Map(QUETES_FOREVER.map((q) => [q.titre.toLowerCase(), q.id]));

export type Portee = "classe" | "race" | "faction";

export interface PointTrajet { zone: string; lieu: string | null; carte: number | null; x: number; y: number }
export interface TrajetProbe { nom: string; depart: PointTrajet; arrivee: PointTrajet | null; duree: number | null }

export interface GuideProbe {
  personnage: string;
  race: string | null;
  raceFichier: string;
  classe: string | null;
  faction: "alliance" | "horde" | null;
  niveaux: [number, number];
  partie: "depart" | "commune" | null;
  /** Zones dans l'ordre joué, chacune avec ses étapes « prendre:<id> », « faire:<id> », « rendre:<id> » (ids du guide). */
  zones: { lieu: string; etapes: string[] }[];
  /** Quêtes jouées que le guide ne connaît pas encore (souvent des quêtes propres à Forever) : à saisir dans ajouts-forever. */
  inconnues: { id: number; titre: string; lieu: string | null }[];
  trajets: TrajetProbe[];
  exploits: { nom: string; classement: string; lieu: string | null; x: number; y: number }[];
  evenements: number;
}

const nombre = (s: string | undefined) => (s !== undefined && s !== "nil" && s !== "" && Number.isFinite(Number(s)) ? Number(s) : null);

/** Convertit un export en guide : étapes par zone dans l'ordre joué, quêtes inconnues, trajets, élites. */
export function guideDepuisExport(e: ExportProbe): GuideProbe {
  let lieu: string | null = e.carte !== null ? LIEU_PAR_CARTE.get(e.carte) ?? null : null;
  // étapes jouées avant toute position connue : rangées dans la première zone relevée
  const enAttente: ["prendre" | "faire" | "rendre", number][] = [];
  let niveauMin = e.niveau || 0, niveauMax = e.niveau || 0;
  const zones: { lieu: string; etapes: string[] }[] = [];
  const parLieu = new Map<string, { lieu: string; etapes: string[] }>();
  const vues = new Set<string>();
  const inconnues = new Map<number, { id: number; titre: string; lieu: string | null }>();
  const trajets: TrajetProbe[] = [];
  const exploits: GuideProbe["exploits"] = [];
  let trajet: TrajetProbe | null = null;

  const changerCarte = (c: number | null) => {
    if (c !== null) lieu = LIEU_PAR_CARTE.get(c) ?? lieu;
    if (lieu && enAttente.length) for (const [a, id] of enAttente.splice(0)) etape(a, id);
  };
  const point = (champs: string[], depuis: number): PointTrajet => {
    const c = nombre(champs[depuis + 1]);
    return { zone: champs[depuis] ?? "", lieu: c !== null ? LIEU_PAR_CARTE.get(c) ?? null : null, carte: c, x: nombre(champs[depuis + 2]) ?? 0, y: nombre(champs[depuis + 3]) ?? 0 };
  };
  const idGuide = (idJeu: number, titre: string | undefined) => {
    const forever = titre ? FOREVER_PAR_TITRE.get(titre.toLowerCase()) : undefined;
    return forever ?? idJeu;
  };
  function etape(action: "prendre" | "faire" | "rendre", idJeu: number) {
    if (!lieu) { enAttente.push([action, idJeu]); return; }
    const titre = e.quetes.get(idJeu);
    const id = idGuide(idJeu, titre);
    const cle = `${action}:${id}`;
    if (vues.has(cle)) return;
    vues.add(cle);
    let z = parLieu.get(lieu);
    if (!z) { z = { lieu, etapes: [] }; parLieu.set(lieu, z); zones.push(z); }
    z.etapes.push(cle);
    if (titre && !inconnues.has(id)) inconnues.set(id, { id, titre, lieu });
  }

  for (const ev of e.evenements) {
    const c = ev.champs;
    switch (ev.type) {
      case "pos": changerCarte(nombre(c[0])); break;
      case "zone": changerCarte(nombre(c[1])); break;
      case "level": {
        const n = nombre(c[0]);
        if (n !== null) { niveauMax = Math.max(niveauMax, n); if (!niveauMin) niveauMin = n - 1; }
        break;
      }
      case "accept": { const id = nombre(c[0]); if (id !== null) etape("prendre", id); break; }
      case "obj": { const id = nombre(c[0]); if (id !== null) etape("faire", id); break; }
      case "turnin": { const id = nombre(c[0]); if (id !== null) etape("rendre", id); break; }
      case "trajet":
        if (c[0] === "debut") trajet = { nom: c[1] ?? "Trajet", depart: point(c, 2), arrivee: null, duree: null };
        else if (c[0] === "arrivee" && trajet) {
          trajet.arrivee = point(c, 2);
          trajet.duree = nombre(c[6]);
          trajets.push(trajet);
          trajet = null;
        } else if (c[0] === "annule") trajet = null;
        break;
      case "exploit": {
        const cc = nombre(c[2]);
        exploits.push({ nom: c[0] ?? "?", classement: c[1] ?? "", lieu: cc !== null ? LIEU_PAR_CARTE.get(cc) ?? null : null, x: nombre(c[3]) ?? 0, y: nombre(c[4]) ?? 0 });
        break;
      }
    }
  }

  const race = RACE_PAR_FICHIER.get(e.raceFichier)
    ?? (e.faction === "Alliance" ? "skyborne-alliance" : e.faction === "Horde" ? "skyborne-horde" : null);
  const faction = e.faction === "Alliance" ? "alliance" : e.faction === "Horde" ? "horde" : null;
  const classe = CLASSE_PAR_FICHIER.get(e.classeFichier) ?? null;

  // les quêtes que le guide connaît, pour cette race, dans la zone où elles ont été jouées, ne sont pas « inconnues »
  const r = race ? raceGuide(race) : undefined;
  if (r) {
    const connues = new Set<number>();
    for (const c of combinaisons().filter((x) => x.race.slug === r.slug)) {
      for (const z of guidePour(r, c.classe.slug)) for (const et of z.etapes) connues.add(et.id);
    }
    for (const id of [...inconnues.keys()]) if (connues.has(id)) inconnues.delete(id);
  }

  return {
    personnage: e.personnage, race, raceFichier: e.raceFichier, classe, faction,
    niveaux: [Math.max(1, niveauMin || 1), Math.max(niveauMin || 1, niveauMax || 1)],
    partie: e.partie === "depart" || e.partie === "commune" ? e.partie : null,
    zones, inconnues: [...inconnues.values()], trajets, exploits, evenements: e.evenements.length,
  };
}

/** Portée proposée d'office : la zone de départ vaut pour toutes les classes de la race, la partie commune pour toute la faction. */
export const porteeConseillee = (g: GuideProbe): Portee => (g.partie === "commune" ? "faction" : "race");

/** Races concernées par une portée. */
export function racesConcernees(g: GuideProbe, portee: Portee): RaceGuide[] {
  const r = g.race ? raceGuide(g.race) : undefined;
  if (!r) return [];
  if (portee !== "faction") return [r];
  return RACES_GUIDE.filter((x) => x.faction === r.faction);
}

/** Parcours relevés (format de content/parcours-releves.ts) tirés d'un guide, pour la portée choisie. */
export function versParcoursReleves(g: GuideProbe, portee: Portee, source: string): ParcoursReleve[] {
  const classe = portee === "classe" ? g.classe : null;
  return racesConcernees(g, portee).flatMap((race) =>
    g.zones.map((z) => ({ race: race.slug, classe, lieu: z.lieu, etapes: z.etapes, source })));
}

// ——— Vérification ———

export interface Verification {
  ok: boolean;
  problemes: string[];
  /** Étapes reprises par au moins un guide, sur le total des étapes jouées. */
  reconnues: number;
  total: number;
  pages: { race: string; classe: string; titre: string }[];
}

/**
 * Le guide reste-t-il jouable avec ce parcours en tête de zone ? Mêmes règles que tests/parcours-releves.test.ts :
 * prendre, puis faire, puis rendre, et la quête préalable rendue avant. Vérifié pour chaque race et classe concernée.
 */
export function verifierGuide(g: GuideProbe, portee: Portee, autres: ParcoursReleve[] = []): Verification {
  const problemes: string[] = [];
  if (!g.race) problemes.push("Race du personnage inconnue : le code ne dit pas à quel guide il s'applique.");
  if (portee === "classe" && !g.classe) problemes.push("Classe du personnage inconnue : choisissez la portée « toute la race ».");
  if (!g.zones.length) problemes.push("Aucune quête prise ni rendue dans ce code.");
  const parcours = [...versParcoursReleves(g, portee, "vérification"), ...autres, ...PARCOURS_RELEVES];
  const races = new Set(racesConcernees(g, portee).map((r) => r.slug));
  const reprises = new Set<string>();
  const pages: Verification["pages"] = [];
  for (const { race, classe } of combinaisons()) {
    if (!races.has(race.slug) || (portee === "classe" && classe.slug !== g.classe)) continue;
    let touche = false;
    for (const z of guidePour(race, classe.slug)) {
      const jouee = g.zones.find((x) => x.lieu === z.lieu);
      if (!jouee) continue;
      touche = true;
      const ordre = ordreDuGuide(z, race, classe.slug, parcours).flatMap((a) => a.actions.map((x) => `${x.a}:${z.etapes[x.q].id}`));
      for (const cle of jouee.etapes) if (ordre.includes(cle)) reprises.add(cle);
      const rang = new Map(ordre.map((c, i) => [c, i]));
      for (const e of z.etapes) {
        const p = rang.get(`prendre:${e.id}`), f = rang.get(`faire:${e.id}`), r = rang.get(`rendre:${e.id}`);
        const avant = e.av ? rang.get(`rendre:${e.av}`) : undefined;
        const ou = `${nomRace(race)} ${classe.nom.toLowerCase()}, ${nomLieu(z.lieu)} : « ${e.t} »`;
        if (p !== undefined && f !== undefined && f < p) problemes.push(`${ou} se ferait avant d'être prise.`);
        if (p !== undefined && r !== undefined && r < p) problemes.push(`${ou} se rendrait avant d'être prise.`);
        if (f !== undefined && r !== undefined && r < f) problemes.push(`${ou} se rendrait avant d'être faite.`);
        if (avant !== undefined && p !== undefined && p < avant) problemes.push(`${ou} se prendrait avant sa quête préalable.`);
      }
    }
    if (touche) pages.push({ race: race.slug, classe: classe.slug, titre: `${nomRace(race)} ${classe.nom.toLowerCase()}` });
  }
  const total = g.zones.reduce((s, z) => s + z.etapes.length, 0);
  if (g.race && g.zones.length && !pages.length) problemes.push("Aucun guide ne passe par les zones jouées.");
  return { ok: problemes.length === 0, problemes: [...new Set(problemes)].slice(0, 30), reconnues: reprises.size, total, pages };
}
