/**
 * Vidéos du Journal de Jobwow (script `npm run carnet:video`, lancé sur le PC de Jobwow) : les fichiers de Warcraft
 * Recorder sont rangés dans l'ordre chronologique et regroupés par séance de jeu ; les chapitres YouTube viennent des
 * repères de RouteProbe (changements de zone, niveaux, marqueurs /rp mark), datés par l'heure du PC.
 * Fonctions pures : la lecture des fichiers et ffmpeg restent dans scripts/carnet-video.ts.
 */

import { CARTES_JEU } from "@/content/cartes-jeu";

// ——— Lecture de la sauvegarde de RouteProbe (SavedVariables, syntaxe de table Lua) ———

export type ValeurLua = string | number | boolean | null | ValeurLua[] | { [cle: string]: ValeurLua };

/** Sondes d'enregistrement : EternalProbe (deuxième génération) puis l'ancienne RouteProbe, même format d'événements. */
export const SONDES = [
  { fichier: "EternalProbe.lua", table: "EternalProbeDB" },
  { fichier: "RouteProbe.lua", table: "RouteProbeDB" },
] as const;

/** Table d'une sauvegarde de sonde, quelle que soit la sonde qui l'a écrite (null si aucune). */
export function lireSauvegardeSonde(texte: string): ValeurLua {
  for (const s of SONDES) {
    const db = lireTableLua(texte, s.table);
    if (db !== null) return db;
  }
  return null;
}

/** Lit `RouteProbeDB = { … }` (ou n'importe quelle table Lua écrite par le jeu). */
export function lireTableLua(texte: string, nom = "RouteProbeDB"): ValeurLua {
  const debut = texte.indexOf(nom);
  if (debut < 0) return null;
  let i = texte.indexOf("=", debut) + 1;
  const blanc = () => {
    for (;;) {
      while (i < texte.length && /\s/.test(texte[i])) i++;
      if (texte.startsWith("--", i)) { while (i < texte.length && texte[i] !== "\n") i++; continue; }
      break;
    }
  };
  const chaine = (): string => {
    const q = texte[i++];
    let s = "";
    while (i < texte.length && texte[i] !== q) {
      if (texte[i] === "\\") {
        const c = texte[i + 1];
        s += c === "n" ? "\n" : c === "t" ? "\t" : c;
        i += 2;
      } else s += texte[i++];
    }
    i++;
    return s;
  };
  const valeur = (): ValeurLua => {
    blanc();
    const c = texte[i];
    if (c === '"' || c === "'") return chaine();
    if (c === "{") return table();
    const m = /^(-?\d+(?:\.\d+)?(?:[eE][-+]?\d+)?|true|false|nil)/.exec(texte.slice(i, i + 40));
    if (!m) throw new Error(`Valeur Lua illisible à la position ${i}`);
    i += m[0].length;
    return m[0] === "true" ? true : m[0] === "false" ? false : m[0] === "nil" ? null : Number(m[0]);
  };
  const table = (): ValeurLua => {
    i++; // {
    const liste: ValeurLua[] = [];
    const objet: Record<string, ValeurLua> = {};
    let cles = false;
    for (;;) {
      blanc();
      if (texte[i] === "}") { i++; break; }
      if (texte[i] === "[") {
        i++;
        const cle = valeur();
        blanc(); i++; // ]
        blanc(); i++; // =
        objet[String(cle)] = valeur();
        cles = true;
      } else {
        const m = /^([A-Za-z_]\w*)\s*=/.exec(texte.slice(i, i + 80));
        if (m) { i += m[0].length; objet[m[1]] = valeur(); cles = true; } else liste.push(valeur());
      }
      blanc();
      if (texte[i] === "," || texte[i] === ";") i++;
    }
    if (!cles) return liste;
    liste.forEach((v, k) => { objet[String(k + 1)] = v; });
    return objet;
  };
  return valeur();
}

// ——— Chronologie des repères, en heure du PC ———

/**
 * Niveau atteint d'un événement « level » : la sonde 0.10.1 et suivantes notent le nouveau niveau (« level|5|nouveau ») ;
 * avant, elle notait celui que le jeu donnait encore à l'instant de la montée, l'ancien : on ajoute un.
 */
export function niveauAtteint(champs: string[]): number {
  const n = Number(champs[2]);
  return champs[3] === "nouveau" ? n : n + 1;
}

export type TypeRepere = "zone" | "niveau" | "marqueur" | "etat";   // « etat » : zone|niveau au début d'un enregistrement
export interface Repere { heure: number; type: TypeRepere; texte: string; personnage: string }

/** Heure du PC « 2026-11-11 21:04:13 » (heure locale, sans fuseau) → millisecondes, comparables aux noms de fichiers. */
export function heureLocale(texte: string): number | null {
  const m = /(\d{4})-(\d{2})-(\d{2})[ _T](\d{2})[-:.h](\d{2})[-:.m](\d{2})/.exec(texte);
  if (!m) return null;
  return Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +m[6]);
}

const NOMS_CARTES = new Map(Object.values(CARTES_JEU).map((c) => [c.id, c.nom]));

const listeDe = (v: ValeurLua | undefined): ValeurLua[] =>
  Array.isArray(v) ? v : v && typeof v === "object" ? Object.keys(v).filter((k) => /^\d+$/.test(k)).sort((a, b) => +a - +b).map((k) => (v as Record<string, ValeurLua>)[k]) : [];

/**
 * Repères d'un enregistrement : chaque événement « clock » (départ, reprise, marqueur, fin) donne l'heure du PC
 * correspondant à l'heure du jeu (GetTime) ; les événements suivants sont datés à partir de lui.
 */
export function reperesEnregistrement(enr: Record<string, ValeurLua>, personnage: string): Repere[] {
  const out: Repere[] = [];
  let ref: { t: number; heure: number } | null = null;
  // niveau à chaque repère d'horloge (EternalProbe : table « horloges ») : l'état au début d'un enregistrement
  const niveaux = new Map<number, number>();
  for (const h of listeDe(enr.horloges)) {
    const x = h as Record<string, ValeurLua>;
    if (x && typeof x === "object" && typeof x.t === "number" && typeof x.niveau === "number") niveaux.set(Math.round(x.t * 10), x.niveau);
  }
  let debut: { heure: number; niveau: number | null } | null = null;
  for (const brut of listeDe(enr.events)) {
    const p = String(brut).split("|");
    const t = Number(p[0]);
    if (!Number.isFinite(t)) continue;
    if (p[1] === "clock") {
      const h = heureLocale(p[3] ?? "");
      if (h !== null) ref = { t, heure: h };
      // nouvel enregistrement : l'état (zone, niveau) est donné à la première position qui suit
      if (p[2] === "debut" && h !== null) debut = { heure: h, niveau: niveaux.get(Math.round(t * 10)) ?? null };
      continue;
    }
    if (!ref) continue;
    const heure = ref.heure + Math.round((t - ref.t) * 1000);
    if (debut && p[1] === "pos") {
      const zone = NOMS_CARTES.get(Number(p[2])) ?? "";
      out.push({ heure: debut.heure, type: "etat", texte: `${zone}|${debut.niveau ?? ""}`, personnage });
      debut = null;
    }
    if (p[1] === "zone" && p[2] && p[2] !== "nil") out.push({ heure, type: "zone", texte: p[2], personnage });
    else if (p[1] === "level" && p[2]) out.push({ heure, type: "niveau", texte: String(niveauAtteint(p)), personnage });
    else if (p[1] === "mark" && p[2]) out.push({ heure, type: "marqueur", texte: p.slice(2).join("|"), personnage });
  }
  return out;
}

/** Tous les repères de la sauvegarde : l'enregistrement en cours et ceux mis de côté pour les autres personnages. */
export function reperesRouteProbe(db: ValeurLua): Repere[] {
  if (!db || typeof db !== "object" || Array.isArray(db)) return [];
  const racine = db as Record<string, ValeurLua>;
  const out = reperesEnregistrement(racine, String(racine.personnage ?? "?"));
  const archives = racine.archives;
  if (archives && typeof archives === "object" && !Array.isArray(archives)) {
    for (const [nom, enr] of Object.entries(archives)) {
      if (enr && typeof enr === "object" && !Array.isArray(enr)) out.push(...reperesEnregistrement(enr as Record<string, ValeurLua>, nom));
    }
  }
  return out.sort((a, b) => a.heure - b.heure);
}

// ——— Séances : fichiers rangés et regroupés ———

export interface Clip { fichier: string; debut: number; duree: number }
export interface Seance { clips: Clip[]; debut: number; fin: number; duree: number }

/** Les fichiers dans l'ordre chronologique ; un écart de plus de `ecartMaxMin` minutes ouvre une nouvelle séance. */
export function seances(clips: Clip[], ecartMaxMin = 30): Seance[] {
  const tries = [...clips].sort((a, b) => a.debut - b.debut);
  const out: Seance[] = [];
  for (const c of tries) {
    const s = out[out.length - 1];
    if (s && c.debut - s.fin <= ecartMaxMin * 60_000) {
      s.clips.push(c);
      s.fin = Math.max(s.fin, c.debut + c.duree * 1000);
      s.duree += c.duree;
    } else out.push({ clips: [c], debut: c.debut, fin: c.debut + c.duree * 1000, duree: c.duree });
  }
  return out;
}

/** Position d'une heure du PC dans la vidéo assemblée (en secondes), ou null si elle tombe entre deux fichiers. */
export function positionDans(s: Seance, heure: number): number | null {
  let avant = 0;
  for (const c of s.clips) {
    if (heure >= c.debut && heure <= c.debut + c.duree * 1000) return avant + (heure - c.debut) / 1000;
    avant += c.duree;
  }
  return null;
}

// ——— Chapitres YouTube ———

export interface Chapitre { seconde: number; titre: string }

/** « 0:00 », « 14:32 », « 1:02:05 » : le format que YouTube reconnaît dans la description. */
export function horodatage(seconde: number): string {
  const s = Math.max(0, Math.floor(seconde));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = String(s % 60).padStart(2, "0");
  return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${r}` : `${m}:${r}`;
}

const ECART_MIN_S = 10; // YouTube : chaque chapitre dure au moins 10 secondes

/**
 * Chapitres d'une séance : un premier chapitre à 0:00 (zone et niveau au départ), puis chaque arrivée dans une zone,
 * chaque niveau et chaque marqueur. Deux repères à moins de 10 secondes n'en font qu'un. YouTube n'affiche les chapitres
 * qu'à partir de trois : `valides` le dit.
 */
const DEPART_MS = 60_000;          // un repère de la première minute décrit le point de départ
const ETAT_MAX_MS = 6 * 3600_000;   // au-delà, un repère d'avant la séance ne dit plus rien de l'état du personnage

/** Le personnage joué pendant la séance : celui qui a le plus de repères dans son intervalle. */
export function personnageDe(s: Seance, reperes: Repere[]): string | null {
  const n = new Map<string, number>();
  for (const r of reperes) if (r.heure >= s.debut && r.heure <= s.fin) n.set(r.personnage, (n.get(r.personnage) ?? 0) + 1);
  return [...n.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
}

export function chapitres(s: Seance, tous: Repere[]): { liste: Chapitre[]; valides: boolean; zones: string[]; niveaux: [number, number] | null; personnage: string | null } {
  // seulement les repères du personnage joué (la sauvegarde garde aussi ceux des autres personnages)
  const personnage = personnageDe(s, tous);
  const reperes = personnage ? tous.filter((r) => r.personnage === personnage) : [];
  let zone: string | null = null;
  let niveau: number | null = null;
  for (const r of reperes) {
    if (r.heure > s.debut + DEPART_MS) break;
    if (r.heure < s.debut - ETAT_MAX_MS) continue;
    if (r.type === "zone") zone = r.texte;
    if (r.type === "niveau") niveau = Number(r.texte);
    // début d'un enregistrement : peut-être un autre personnage ou un autre lieu, on repart de son état
    if (r.type === "etat") { const [z, n] = r.texte.split("|"); zone = z || null; niveau = n ? Number(n) : null; }
  }
  const zones = zone ? [zone] : [];
  let nMin = niveau, nMax = niveau;
  const liste: Chapitre[] = [{ seconde: 0, titre: ["Début de la séance", zone, niveau ? `niveau ${niveau}` : null].filter(Boolean).join(" · ") }];
  for (const r of reperes) {
    if (r.type === "etat" || r.heure <= s.debut || r.heure > s.fin) continue;
    // zone et niveau de la première minute : déjà dans le chapitre de départ (un marqueur garde son chapitre)
    if (r.type !== "marqueur" && r.heure <= s.debut + DEPART_MS) continue;
    const pos = positionDans(s, r.heure);
    if (pos === null) continue;
    let titre: string | null = null;
    if (r.type === "zone" && r.texte !== zone) {
      zone = r.texte;
      if (!zones.includes(zone)) zones.push(zone);
      titre = `Arrivée : ${zone}`;
    } else if (r.type === "niveau") {
      const n = Number(r.texte);
      nMin = nMin === null ? n : Math.min(nMin, n);
      nMax = nMax === null ? n : Math.max(nMax, n);
      titre = `Niveau ${n}`;
    } else if (r.type === "marqueur") {
      titre = r.texte.trim();
    }
    if (!titre) continue;
    const dernier = liste[liste.length - 1];
    if (pos - dernier.seconde < ECART_MIN_S) {
      if (dernier.seconde > 0) dernier.titre = `${dernier.titre} · ${titre}`;
      continue;
    }
    liste.push({ seconde: pos, titre });
  }
  return { liste, valides: liste.length >= 3, zones, niveaux: nMin !== null && nMax !== null ? [nMin, nMax] : null, personnage };
}

// ——— Texte à coller dans YouTube Studio ———

const DATE_FR = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

/** Titre de 100 caractères au plus (limite de YouTube). */
export function titreVideo(s: Seance, info: { zones: string[]; niveaux: [number, number] | null }): string {
  const date = DATE_FR.format(new Date(s.debut)).replace(/^1 /, "1er ");
  const niv = info.niveaux ? (info.niveaux[0] === info.niveaux[1] ? ` · niveau ${info.niveaux[0]}` : ` · niveaux ${info.niveaux[0]} à ${info.niveaux[1]}`) : "";
  const zones = info.zones.length ? ` · ${info.zones.slice(0, 3).join(" → ")}` : "";
  const t = `Journal de Jobwow · ${date}${zones}${niv}`;
  return t.length <= 100 ? t : `${t.slice(0, 99)}…`;
}

export function descriptionVideo(s: Seance, info: { liste: Chapitre[]; valides: boolean; zones: string[] }, site: string): string {
  const lignes = [
    `Une séance de jeu sur WoW Forever${info.zones.length ? ` : ${info.zones.join(", ")}` : ""}.`,
    "",
    "Chapitres :",
    ...info.liste.map((c) => `${horodatage(c.seconde)} ${c.titre}`),
    "",
    `Le Carnet de Jobwow : ${site}/carnet/`,
    `Le guide de 1 à 60 : ${site}/guides/parcours/`,
    "",
    "La Taverne Éternelle, site de fans indépendant, non affilié à Blizzard Entertainment.",
  ];
  if (!info.valides) lignes.splice(2, info.liste.length + 2);
  return lignes.join("\n");
}
