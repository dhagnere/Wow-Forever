/**
 * Découpage d'une longue soirée en parties de 15 à 20 minutes (`npm run carnet`, depuis le 15/11/2026, demandé par Jobwow) :
 * toute journée de plus de 20 minutes est coupée automatiquement, aux moments qui ferment un chapitre (embarquement,
 * vol, arrivée dans une zone, quête rendue, niveau, pause entre deux enregistrements), jamais pendant une mort, un élite
 * ni un objectif de quête à moitié fait. Les parties sont numérotées par soirée (« partie 1, partie 2… »).
 *
 * Les coupes viennent de la sonde (EternalProbe ou RouteProbe), datées par l'heure du PC comme la narration. Le
 * découpage est gardé dans `<journée>.parties.json`, déplaçable dans l'Atelier ; chaque partie a sa narration
 * (`<journée>_p<n>.narration.json`), sa miniature, son titre et sa description. Fonctions pures : le script reste
 * dans scripts/incrustation-video.ts.
 */
import { heureLocale, positionDans, type Seance, type ValeurLua } from "@/lib/videoCarnet";

/** Durées en secondes : visée de 15 à 20 minutes, jamais plus de 20, jamais moins de 8 (sauf vidéo entière). */
export const PARTIE_MIN = 15 * 60;
export const PARTIE_MAX = 20 * 60;
export const PARTIE_PLANCHER = 8 * 60;

// ——— Signaux de la sonde utiles au découpage ———

export type GenreSignal =
  | "trajet" | "trajet-fin" | "vol" | "vol-fin" | "zone" | "quete" | "niveau"   // fins de chapitre
  | "mort" | "exploit" | "objectif" | "accepte";                                // activité en cours

export interface Signal {
  heure: number;           // heure du PC (ms, comme heureLocale)
  genre: GenreSignal;
  personnage: string;
  texte?: string;          // zone, titre de quête, nom du trajet, niveau
  quete?: string;          // identifiant de la quête (objectif, quête rendue, acceptée)
  objectif?: { rang: number; fait: number; requis: number };
}

const listeDe = (v: ValeurLua | undefined): ValeurLua[] =>
  Array.isArray(v) ? v : v && typeof v === "object" ? Object.keys(v).filter((k) => /^\d+$/.test(k)).sort((a, b) => +a - +b).map((k) => (v as Record<string, ValeurLua>)[k]) : [];

/** Signaux d'un enregistrement, datés par les repères d'horloge (« clock »), comme les moments de la narration. */
export function signauxEnregistrement(enr: Record<string, ValeurLua>, personnage: string): Signal[] {
  const out: Signal[] = [];
  let ref: { t: number; heure: number } | null = null;
  let zone: string | undefined;
  for (const brut of listeDe(enr.events)) {
    const p = String(brut).split("|");
    const t = Number(p[0]);
    if (!Number.isFinite(t)) continue;
    if (p[1] === "clock") {
      const h = heureLocale(p[3] ?? "");
      if (h !== null) ref = { t, heure: h };
      if (p[2] === "debut") zone = undefined;
      continue;
    }
    if (!ref) continue;
    const heure = ref.heure + Math.round((t - ref.t) * 1000);
    const s = (genre: GenreSignal, x: Partial<Signal> = {}) => out.push({ heure, genre, personnage, ...x });
    switch (p[1]) {
      case "zone":
        if (p[2] && p[2] !== "nil" && p[2] !== zone) { if (zone !== undefined) s("zone", { texte: p[2] }); zone = p[2]; }
        break;
      case "level": if (p[2]) s("niveau", { texte: p[2] }); break;
      case "turnin": s("quete", { quete: p[2], texte: p[3] && p[3] !== "nil" ? p[3] : undefined }); break;
      case "accept": s("accepte", { quete: p[2], texte: p[3] }); break;
      case "obj": {
        const rang = Number(p[3]), fait = Number(p[4]), requis = Number(p[5]);
        if (p[2] && Number.isFinite(fait) && Number.isFinite(requis)) s("objectif", { quete: p[2], objectif: { rang, fait, requis } });
        break;
      }
      case "mort": s("mort", { texte: p[2] }); break;
      case "exploit": s("exploit", { texte: p[2] }); break;
      case "trajet":
        if (p[2] === "debut") s("trajet", { texte: p[3] });
        else if (p[2] === "arrivee") s("trajet-fin", { texte: p[3] });
        break;
      case "vol":
        if (p[2] === "depart") s("vol");
        else if (p[2] === "arrivee") s("vol-fin");
        break;
    }
  }
  return out;
}

/** Tous les signaux de la sauvegarde : l'enregistrement en cours et ceux mis de côté (autres personnages, départ gardé). */
export function signauxSonde(db: ValeurLua): Signal[] {
  if (!db || typeof db !== "object" || Array.isArray(db)) return [];
  const racine = db as Record<string, ValeurLua>;
  const out = signauxEnregistrement(racine, String(racine.personnage ?? "?"));
  for (const cle of ["archives", "departGarde"]) {
    const v = racine[cle];
    if (!v || typeof v !== "object" || Array.isArray(v)) continue;
    if (cle === "departGarde") out.push(...signauxEnregistrement(v as Record<string, ValeurLua>, String((v as Record<string, ValeurLua>).personnage ?? racine.personnage ?? "?")));
    else for (const [nom, enr] of Object.entries(v)) {
      if (enr && typeof enr === "object" && !Array.isArray(enr)) out.push(...signauxEnregistrement(enr as Record<string, ValeurLua>, nom));
    }
  }
  return out.sort((a, b) => a.heure - b.heure);
}

// ——— Coupes possibles ———

export interface CoupePossible {
  seconde: number;         // dans la vidéo de la journée (assemblée)
  score: number;           // plus c'est haut, plus la coupe ferme bien un chapitre ; négatif : à éviter
  raison: string;          // en clair, pour l'Atelier et le bilan
}

/** Fins de chapitre : note, décalage de la coupe après l'événement (pour laisser finir la bulle), libellé. */
const FINS: Partial<Record<GenreSignal, { score: number; apres: number; libelle: (s: Signal) => string }>> = {
  trajet: { score: 100, apres: 8, libelle: (s) => `Embarquement${s.texte ? ` : ${s.texte}` : ""}` },
  vol: { score: 90, apres: 8, libelle: () => "Départ en vol" },
  "trajet-fin": { score: 85, apres: 2, libelle: (s) => `Arrivée du trajet${s.texte ? ` : ${s.texte}` : ""}` },
  "vol-fin": { score: 80, apres: 2, libelle: () => "Arrivée du vol" },
  zone: { score: 80, apres: 0.5, libelle: (s) => `Arrivée : ${s.texte}` },
  quete: { score: 60, apres: 6, libelle: (s) => `Quête rendue${s.texte ? ` : ${s.texte}` : ""}` },
  niveau: { score: 55, apres: 7, libelle: (s) => `Niveau ${s.texte}` },
};
const SCORE_PAUSE = 95;                 // entre deux enregistrements : la meilleure coupe qui soit
const BONUS_RIEN_EN_COURS = 15;         // quête rendue sans autre objectif entamé
const PAS_GRILLE = 15;                  // une coupe « calme » possible toutes les 15 secondes
const CALME_MAX = 25;                   // note d'un moment calme (60 s sans activité)
const INTERDIT = -300;
const MORT_AVANT = 10, MORT_APRES = 120;      // mort, puis retour au corps
const ELITE_AVANT = 45, ELITE_APRES = 5;      // combat contre un élite
const OBJECTIF_RECENT = 180;                  // objectif entamé il y a moins de 3 minutes : quête en cours
const PENALITE_OBJECTIF = 80;

/**
 * Toutes les coupes possibles d'une journée : fins de chapitre tirées de la sonde, pauses entre deux fichiers et,
 * toutes les 15 secondes, un moment plus ou moins calme. Chaque coupe perd des points pendant une mort, un élite ou
 * un objectif de quête à moitié fait.
 */
export function coupesPossibles(o: { seance: Seance; dureeVideo: number; signaux: Signal[]; personnage?: string | null }): CoupePossible[] {
  const D = o.dureeVideo;
  // le personnage joué : celui qui a le plus de signaux pendant la journée
  let personnage = o.personnage ?? null;
  if (!personnage) {
    const n = new Map<string, number>();
    for (const s of o.signaux) if (s.heure >= o.seance.debut && s.heure <= o.seance.fin) n.set(s.personnage, (n.get(s.personnage) ?? 0) + 1);
    personnage = [...n.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
  }
  const places = o.signaux
    .filter((s) => !personnage || s.personnage === personnage)
    .map((s) => ({ s, pos: positionDans(o.seance, s.heure) }))
    .filter((x): x is { s: Signal; pos: number } => x.pos !== null);

  const morts = places.filter((x) => x.s.genre === "mort").map((x) => x.pos);
  const elites = places.filter((x) => x.s.genre === "exploit").map((x) => x.pos);
  const activite = places.filter((x) => ["objectif", "exploit", "mort", "accepte"].includes(x.s.genre)).map((x) => x.pos).sort((a, b) => a - b);

  // quêtes entamées : dernier objectif avancé (et s'il reste à faire), effacées au rendu
  const progres = places.filter((x) => x.s.genre === "objectif" || x.s.genre === "quete").sort((a, b) => a.pos - b.pos);
  const enCours = (t: number): string | null => {
    const etat = new Map<string, { dernier: number; reste: Map<number, boolean>; titre?: string }>();
    for (const x of progres) {
      if (x.pos > t) break;
      const q = x.s.quete ?? "?";
      if (x.s.genre === "quete") { etat.delete(q); continue; }
      const e = etat.get(q) ?? { dernier: x.pos, reste: new Map<number, boolean>() };
      e.dernier = x.pos;
      e.reste.set(x.s.objectif!.rang, x.s.objectif!.fait < x.s.objectif!.requis);
      etat.set(q, e);
    }
    for (const [q, e] of etat) if (t - e.dernier <= OBJECTIF_RECENT && [...e.reste.values()].some(Boolean)) return q;
    return null;
  };

  // un départ (zeppelin, bateau, vol) ou une pause entre deux enregistrements : un objectif laissé en plan n'y change rien
  const ajuster = (seconde: number, score: number, raison: string, depart = false): CoupePossible => {
    if (morts.some((m) => seconde >= m - MORT_AVANT && seconde <= m + MORT_APRES)) return { seconde, score: INTERDIT, raison: `${raison} (pendant une mort : à éviter)` };
    if (elites.some((m) => seconde >= m - ELITE_AVANT && seconde <= m + ELITE_APRES)) return { seconde, score: INTERDIT, raison: `${raison} (combat contre un élite : à éviter)` };
    if (!depart && enCours(seconde)) return { seconde, score: score - PENALITE_OBJECTIF, raison: `${raison} (objectif de quête à moitié fait)` };
    return { seconde, score, raison };
  };

  const out: CoupePossible[] = [];
  const dedans = (t: number) => t > 1 && t < D - 1;
  // fins de chapitre
  for (const x of places) {
    const f = FINS[x.s.genre];
    if (!f) continue;
    const t = Math.round((x.pos + f.apres) * 10) / 10;
    if (!dedans(t)) continue;
    let score = f.score;
    if (x.s.genre === "quete" && !enCours(t)) score += BONUS_RIEN_EN_COURS;
    out.push(ajuster(t, score, f.libelle(x.s), x.s.genre === "trajet" || x.s.genre === "vol"));
  }
  // pauses entre deux enregistrements
  let avant = 0;
  for (const c of o.seance.clips.slice(0, -1)) {
    avant += c.duree;
    if (dedans(avant)) out.push(ajuster(Math.round(avant * 10) / 10, SCORE_PAUSE, "Pause entre deux enregistrements", true));
  }
  // moments calmes : loin de toute activité
  let i = 0;
  for (let t = PAS_GRILLE; t < D - 1; t += PAS_GRILLE) {
    while (i < activite.length - 1 && activite[i + 1] <= t) i++;
    const proches = [activite[i], activite[i + 1]].filter((a) => a !== undefined);
    const d = proches.length ? Math.min(...proches.map((a) => Math.abs(a - t))) : 60;
    out.push(ajuster(t, Math.round(CALME_MAX * Math.min(d, 60) / 60), "Moment calme"));
  }
  return out.sort((a, b) => a.seconde - b.seconde);
}

// ——— Choix des parties ———

export interface Partie {
  numero: number;          // 1, 2, 3… dans la soirée
  debut: number;           // seconde de départ dans la vidéo de la journée
  duree: number;
  coupe: string | null;    // raison de la coupe qui la termine (null pour la dernière)
}

const COUT_PARTIE = 40;                 // une partie de plus doit se mériter
const PENALITE_COURTE = 1 / 6;          // un point par 6 secondes sous les 15 minutes

/**
 * Les parties d'une journée : aucune coupe sous 20 minutes ; sinon le meilleur jeu de coupes (programmation
 * dynamique) où chaque partie dure de 8 à 20 minutes, au mieux de 15 à 20, en fermant au mieux chaque chapitre.
 */
export function choisirParties(coupes: CoupePossible[], dureeVideo: number): Partie[] {
  const D = dureeVideo;
  if (D <= PARTIE_MAX) return [{ numero: 1, debut: 0, duree: Math.round(D * 10) / 10, coupe: null }];
  // une coupe par seconde au plus (la meilleure)
  const parSeconde = new Map<number, CoupePossible>();
  for (const c of coupes) {
    const k = Math.round(c.seconde);
    if (!parSeconde.has(k) || parSeconde.get(k)!.score < c.score) parSeconde.set(k, c);
  }
  const noeuds: { seconde: number; score: number; raison: string | null }[] = [
    { seconde: 0, score: 0, raison: null },
    ...[...parSeconde.values()].filter((c) => c.seconde > 0 && c.seconde < D).sort((a, b) => a.seconde - b.seconde),
    { seconde: D, score: 0, raison: null },
  ];
  const meilleur: number[] = noeuds.map(() => -Infinity);
  const venu: number[] = noeuds.map(() => -1);
  meilleur[0] = 0;
  let debutFenetre = 0;
  for (let j = 1; j < noeuds.length; j++) {
    while (noeuds[j].seconde - noeuds[debutFenetre].seconde > PARTIE_MAX + 0.01) debutFenetre++;
    for (let i = debutFenetre; i < j; i++) {
      const L = noeuds[j].seconde - noeuds[i].seconde;
      if (L < PARTIE_PLANCHER || meilleur[i] === -Infinity) continue;
      const gain = meilleur[i] + noeuds[j].score - COUT_PARTIE - (L < PARTIE_MIN ? (PARTIE_MIN - L) * PENALITE_COURTE : 0);
      if (gain > meilleur[j]) { meilleur[j] = gain; venu[j] = i; }
    }
  }
  const fin = noeuds.length - 1;
  // aucune suite possible (coupes manquantes) : des parties égales de 20 minutes au plus
  if (venu[fin] < 0) {
    const n = Math.ceil(D / PARTIE_MAX);
    return Array.from({ length: n }, (_, k) => ({
      numero: k + 1, debut: Math.round((D * k / n) * 10) / 10, duree: Math.round((D / n) * 10) / 10, coupe: k < n - 1 ? "Coupe régulière" : null,
    }));
  }
  const chemin: number[] = [];
  for (let j = fin; j > 0; j = venu[j]) chemin.unshift(j);
  chemin.unshift(0);
  const parties: Partie[] = [];
  for (let k = 0; k < chemin.length - 1; k++) {
    const a = noeuds[chemin[k]], b = noeuds[chemin[k + 1]];
    parties.push({ numero: k + 1, debut: a.seconde, duree: Math.round((b.seconde - a.seconde) * 10) / 10, coupe: b.raison });
  }
  return parties;
}

// ——— Fichier du découpage (<journée>.parties.json) ———

export interface Decoupage {
  format: 1;
  video: string;                // vidéo de la journée (relative au fichier)
  dureeVideo: number;
  sources?: string[];           // fichiers assemblés, comme dans la narration
  parties: Partie[];
  /** Coupes proposées à l'Atelier pour déplacer une coupe (les meilleures, triées par seconde). */
  coupes: CoupePossible[];
  /** Coupe déplacée dans l'Atelier : `npm run carnet` refait les narrations des parties changées. */
  modifie?: boolean;
  modifieLe?: string;
}

/**
 * Les coupes gardées dans le fichier, pour l'Atelier : fins de chapitre et pauses, les coupes choisies, et de la grille
 * seulement les moments vraiment calmes (près d'une minute sans activité), une par minute au plus.
 */
export function coupesProposees(coupes: CoupePossible[], parties: Partie[]): CoupePossible[] {
  const choisies = new Set(parties.slice(1).map((p) => Math.round(p.debut * 10) / 10));
  let dernierCalme = -Infinity;
  return [...coupes].sort((a, b) => a.seconde - b.seconde).filter((c) => {
    if (choisies.has(Math.round(c.seconde * 10) / 10)) return true;
    if (!c.raison.startsWith("Moment calme")) return true;
    if (c.score < 20 || c.seconde - dernierCalme < 60) return false;
    dernierCalme = c.seconde;
    return true;
  }).slice(0, 400);
}

/** Erreurs d'un découpage relu (fichier de l'Atelier), en français ; [] s'il est bon. */
export function verifierDecoupage(d: unknown): string[] {
  const x = d as Partial<Decoupage>;
  if (!x || typeof x !== "object") return ["Le fichier n'est pas un découpage."];
  const e: string[] = [];
  if (x.format !== 1) e.push("Format inconnu (attendu : 1).");
  if (!Array.isArray(x.parties) || !x.parties.length) return [...e, "Liste des parties manquante."];
  let attendu = 0;
  for (const [i, p] of x.parties.entries()) {
    if (p.numero !== i + 1) e.push(`Partie ${i + 1} : numéro ${p.numero} inattendu.`);
    if (!(p.duree > 0)) e.push(`Partie ${i + 1} : durée invalide.`);
    if (Math.abs(p.debut - attendu) > 0.2) e.push(`Partie ${i + 1} : elle doit commencer à la fin de la précédente.`);
    attendu = p.debut + p.duree;
  }
  if (typeof x.dureeVideo === "number" && Math.abs(attendu - x.dureeVideo) > 1) e.push("Les parties ne couvrent pas toute la vidéo.");
  return e;
}

/** Les mêmes bornes, à un dixième de seconde près : sinon la narration de la partie est à refaire. */
export const memesBornes = (a: { debut: number; duree: number } | undefined, b: { debut: number; duree: number }) =>
  !!a && Math.abs(a.debut - b.debut) < 0.15 && Math.abs(a.duree - b.duree) < 0.15;

/**
 * La séance d'une partie : les morceaux des fichiers de la journée qu'elle couvre, aux heures du PC. Tout ce qui
 * travaille sur une séance (narration, chapitres, titre) marche alors sur la partie, secondes comptées depuis son début.
 */
export function seanceDePartie(s: Seance, p: { debut: number; duree: number }): Seance {
  const clips: Seance["clips"] = [];
  let avant = 0;
  for (const c of s.clips) {
    const a = Math.max(avant, p.debut), b = Math.min(avant + c.duree, p.debut + p.duree);
    if (b > a) clips.push({ fichier: c.fichier, debut: c.debut + Math.round((a - avant) * 1000), duree: b - a });
    avant += c.duree;
  }
  if (!clips.length) return { clips: [], debut: s.debut, fin: s.debut, duree: 0 };
  const der = clips[clips.length - 1];
  return { clips, debut: clips[0].debut, fin: der.debut + der.duree * 1000, duree: clips.reduce((t, c) => t + c.duree, 0) };
}

/** Nom des fichiers d'une partie : `<journée>_p<n>` (la narration, la vidéo rendue, la miniature, le texte YouTube). */
export const nomPartie = (journee: string, numero: number) => `${journee}_p${numero}`;
