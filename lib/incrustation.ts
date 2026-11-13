/**
 * Jobwow incrusté dans les vidéos du Journal (script `npm run carnet:incrustation`, sur le PC de Jobwow) :
 * médaillon de Jobwow en bas à gauche, bulle de réplique humoristique, sous-titres de ce qui se passe à l'écran,
 * miniature YouTube en image de départ, clips verticaux de 30 secondes. Pas de voix.
 *
 * Les moments viennent des repères de la sonde (EternalProbe ou RouteProbe), datés par l'heure du PC ; la narration
 * est gardée dans un fichier `.narration.json` à côté de la vidéo, modifiable dans l'atelier vidéo (artefact), puis
 * relue au rendu. Fonctions pures : sharp et ffmpeg restent dans scripts/incrustation-video.ts.
 */
import { COULEUR_GENRE, GENRES_MOMENT, replique, type GenreMoment } from "@/content/repliques-jobwow";
import { CARTES_JEU } from "@/content/cartes-jeu";
import { heureLocale, niveauAtteint, type ValeurLua } from "@/lib/videoCarnet";

// ——— Événements de la sonde utiles à la narration ———

export interface Evenement {
  heure: number;            // heure du PC (ms, heure locale sans fuseau, comme heureLocale)
  genre: Exclude<GenreMoment, "intro"> | "reprise";   // « reprise » : début d'un enregistrement (état remis à zéro)
  valeurs: { zone?: string; niveau?: string; nom?: string; titre?: string; demons?: boolean };
  personnage: string;
}

const NOMS_CARTES = new Map(Object.values(CARTES_JEU).map((c) => [c.id, c.nom]));

const listeDe = (v: ValeurLua | undefined): ValeurLua[] =>
  Array.isArray(v) ? v : v && typeof v === "object" ? Object.keys(v).filter((k) => /^\d+$/.test(k)).sort((a, b) => +a - +b).map((k) => (v as Record<string, ValeurLua>)[k]) : [];

/** Événements d'un enregistrement, datés par les repères d'horloge (« clock ») comme les chapitres. */
export function evenementsEnregistrement(enr: Record<string, ValeurLua>, personnage: string): Evenement[] {
  const out: Evenement[] = [];
  let ref: { t: number; heure: number } | null = null;
  let zone: string | undefined;
  let aPlacer = false;
  for (const brut of listeDe(enr.events)) {
    const p = String(brut).split("|");
    const t = Number(p[0]);
    if (!Number.isFinite(t)) continue;
    if (p[1] === "clock") {
      const h = heureLocale(p[3] ?? "");
      if (h !== null) ref = { t, heure: h };
      // un nouvel enregistrement peut être un autre personnage ou un autre lieu : on repart de zéro
      if (p[2] === "debut" && h !== null) { zone = undefined; aPlacer = true; out.push({ heure: h, genre: "reprise", valeurs: {}, personnage }); }
      continue;
    }
    const zoneAvant = zone;
    if (p[1] === "zone" && p[2] && p[2] !== "nil") zone = p[2];
    // première position d'un enregistrement : la zone d'après la carte du jeu
    if (p[1] === "pos" && aPlacer) { aPlacer = false; zone = zone ?? NOMS_CARTES.get(Number(p[2])); }
    if (!ref) continue;
    const heure = ref.heure + Math.round((t - ref.t) * 1000);
    const e = (genre: Evenement["genre"], valeurs: Evenement["valeurs"] = {}) =>
      out.push({ heure, genre, valeurs: { zone, ...valeurs }, personnage });
    switch (p[1]) {
      case "zone": if (zone && zone !== zoneAvant) e("zone"); break;
      case "level": if (p[2]) e("niveau", { niveau: String(niveauAtteint(p)) }); break;
      case "mark": if (p[2]) e("marqueur", { titre: p.slice(2).join("|").trim() }); break;
      case "mort": e("mort", { zone: p[2] && p[2] !== "?" ? p[2] : zone }); break;
      case "exploit": if (p[2]) e("exploit", { nom: p[2] }); break;
      case "trainer": if (p[2]) e("entraineur", { nom: p[2], demons: /d[ée]mon/i.test(p[8] ?? "") }); break;
      case "livre": if (p[3]) e("grimoire", { titre: p[3] }); break;
      case "turnin": if (p[3] && p[3] !== "nil") e("quete", { titre: p[3] }); break;
      case "trajet": if (p[2] === "debut") e("trajet", { titre: p[3] }); break;
      case "vol": if (p[2] === "depart") e("vol"); break;
    }
  }
  return out;
}

/** Tous les événements de la sauvegarde : l'enregistrement en cours et ceux des autres personnages mis de côté. */
export function evenementsSonde(db: ValeurLua): Evenement[] {
  if (!db || typeof db !== "object" || Array.isArray(db)) return [];
  const racine = db as Record<string, ValeurLua>;
  const out = evenementsEnregistrement(racine, String(racine.personnage ?? "?"));
  for (const cle of ["archives", "departGarde"]) {
    const v = racine[cle];
    if (!v || typeof v !== "object" || Array.isArray(v)) continue;
    if (cle === "departGarde") out.push(...evenementsEnregistrement(v as Record<string, ValeurLua>, String((v as Record<string, ValeurLua>).personnage ?? racine.personnage ?? "?")));
    else for (const [nom, enr] of Object.entries(v)) {
      if (enr && typeof enr === "object" && !Array.isArray(enr)) out.push(...evenementsEnregistrement(enr as Record<string, ValeurLua>, nom));
    }
  }
  return out.sort((a, b) => a.heure - b.heure);
}

// ——— Narration : le contenu du fichier .narration.json ———

export interface Moment {
  seconde: number;          // dans la vidéo de jeu (avant l'image de départ)
  duree: number;            // durée d'affichage de la bulle et du sous-titre
  genre: GenreMoment;
  bulle: string;            // réplique de Jobwow ("" : pas de bulle)
  sousTitre: string;        // ce qui se passe à l'écran ("" : pas de sous-titre)
}
export interface ClipVertical { debut: number; duree: number; titre: string }
export interface Narration {
  format: 1;
  video: string;            // chemin de la vidéo de jeu (absolu, ou relatif au fichier .narration.json)
  titre: string;
  miniature: string | null; // miniature YouTube, montrée en image de départ
  introSecondes: number;
  dureeVideo: number;
  personnage: string | null;
  moments: Moment[];
  clips: ClipVertical[];
}

/** Priorité d'un genre quand deux moments se chevauchent (le plus petit l'emporte). */
const PRIORITE: Record<GenreMoment, number> = {
  intro: 0, niveau: 1, exploit: 2, mort: 3, zone: 4, grimoire: 5, entraineur: 6, trajet: 7, marqueur: 8, vol: 9, quete: 10,
};
const DUREE_MOMENT = 5;
const ECART_MOMENTS = 1;          // secondes libres entre deux bulles
const ECART_QUETES = 120;         // une quête rendue commentée toutes les deux minutes au plus
const DUREE_CLIP = 30;

/** Ce qui se passe à l'écran, en clair (sous-titre). */
export function sousTitre(genre: GenreMoment, v: Evenement["valeurs"]): string {
  switch (genre) {
    case "intro": return ["Journal de Jobwow", v.zone, v.niveau ? `niveau ${v.niveau}` : null].filter(Boolean).join(" · ");
    case "zone": return `Arrivée : ${v.zone}`;
    case "niveau": return `Niveau ${v.niveau} atteint${Number(v.niveau) % 2 === 0 ? " : nouveaux sorts chez l'entraîneur" : ""}.`;
    case "mort": return `Mort${v.zone ? ` (${v.zone})` : ""} : retour au corps.`;
    case "exploit": return `${v.nom} vaincu (élite).`;
    case "entraineur": return v.demons ? `Entraîneur de démons : choix d'une capacité.` : `Entraîneur : ${v.nom}, nouveaux sorts appris.`;
    case "grimoire": return `Grimoire acheté : clic droit dessus dans les sacs pour l'apprendre.`;
    case "quete": return `Quête rendue : ${v.titre}.`;
    case "trajet": return `Embarquement${v.titre ? ` : ${v.titre}` : ""}.`;
    case "vol": return `Départ en vol.`;
    case "marqueur": return v.titre ?? "";
  }
}

/** Petit hachage stable : la même vidéo donne toujours les mêmes répliques, deux vidéos en donnent d'autres. */
function graine(texte: string): number {
  let h = 2166136261;
  for (let i = 0; i < texte.length; i++) h = Math.imul(h ^ texte.charCodeAt(i), 16777619);
  return Math.abs(h);
}

/** Le personnage joué pendant la vidéo : celui qui a le plus d'événements dans son intervalle. */
function personnageJoue(evts: Evenement[], debut: number, fin: number): string | null {
  const n = new Map<string, number>();
  for (const e of evts) if (e.heure >= debut && e.heure <= fin) n.set(e.personnage, (n.get(e.personnage) ?? 0) + 1);
  return [...n.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
}

/**
 * Narration de départ d'une vidéo : une intro, puis un moment par repère fort (niveau, élite, mort, zone, grimoire,
 * entraîneur, trajet, repère posé, vol, quête rendue), sans chevauchement, et trois clips verticaux au plus.
 */
export function preparerNarration(o: {
  video: string; debut: number; dureeVideo: number; evenements: Evenement[]; miniature: string | null; titre: string; introSecondes?: number;
  /** Séance de plusieurs fichiers assemblés : position d'une heure du PC dans la vidéo (null entre deux fichiers). */
  fin?: number; position?: (heure: number) => number | null;
}): Narration {
  const fin = o.fin ?? o.debut + o.dureeVideo * 1000;
  const position = o.position ?? ((h: number) => (h - o.debut) / 1000);
  const personnage = personnageJoue(o.evenements, o.debut, fin);
  const evts = personnage ? o.evenements.filter((e) => e.personnage === personnage) : [];
  // état au départ : dernière zone et dernier niveau connus avant la vidéo
  let zone: string | undefined, niveau: string | undefined;
  for (const e of evts) {
    if (e.heure > o.debut) break;
    if (e.genre === "reprise") { zone = undefined; niveau = undefined; continue; }
    zone = e.valeurs.zone ?? zone;
    if (e.genre === "niveau") niveau = e.valeurs.niveau;
  }
  // niveau de départ inconnu : celui d'avant la première montée de niveau de la vidéo
  if (!niveau) {
    const premier = evts.find((e) => e.heure > o.debut && e.genre === "niveau");
    if (premier) niveau = String(Number(premier.valeurs.niveau) - 1);
  }
  if (!zone) zone = evts.find((e) => e.heure > o.debut && e.valeurs.zone)?.valeurs.zone;
  const g = graine(o.video);
  const rangs = new Map<GenreMoment, number>();
  const prochaine = (genre: GenreMoment) => { const r = (rangs.get(genre) ?? g % 97); rangs.set(genre, r + 1); return r; };

  const candidats: Moment[] = [];
  for (const e of evts) {
    if (e.genre === "reprise" || e.heure <= o.debut || e.heure >= fin - 3000) continue;
    const pos = position(e.heure);
    if (pos === null || pos >= o.dureeVideo - 3) continue;
    candidats.push({
      seconde: Math.round(pos * 10) / 10,
      duree: DUREE_MOMENT,
      genre: e.genre,
      bulle: "",
      sousTitre: sousTitre(e.genre, e.valeurs),
      ...{ _valeurs: e.valeurs },
    } as Moment);
  }
  // les plus importants d'abord, sans chevauchement
  const gardes: Moment[] = [{ seconde: 0, duree: 6, genre: "intro", bulle: "", sousTitre: sousTitre("intro", { zone, niveau }) }];
  const libre = (m: Moment) => gardes.every((x) => m.seconde >= x.seconde + x.duree + ECART_MOMENTS || m.seconde + m.duree + ECART_MOMENTS <= x.seconde);
  for (const m of [...candidats].sort((a, b) => PRIORITE[a.genre] - PRIORITE[b.genre] || a.seconde - b.seconde)) {
    if (!libre(m)) continue;
    if (m.genre === "quete" && gardes.some((x) => x.genre === "quete" && Math.abs(x.seconde - m.seconde) < ECART_QUETES)) continue;
    gardes.push(m);
  }
  gardes.sort((a, b) => a.seconde - b.seconde);
  const moments = gardes.map((m) => {
    const v = (m as Moment & { _valeurs?: Evenement["valeurs"] })._valeurs ?? { zone, niveau };
    // entraîneur de démons : la réplique du choix de capacité
    const rang = m.genre === "entraineur" && v.demons ? 3 : prochaine(m.genre);
    return { seconde: m.seconde, duree: m.duree, genre: m.genre, bulle: replique(m.genre, rang, v), sousTitre: m.sousTitre };
  });

  return {
    format: 1,
    video: o.video,
    titre: o.titre,
    miniature: o.miniature,
    introSecondes: o.miniature ? (o.introSecondes ?? 4) : 0,
    dureeVideo: Math.round(o.dureeVideo * 10) / 10,
    personnage,
    moments,
    clips: choisirClips(moments, o.dureeVideo),
  };
}

/** Clips verticaux : autour des trois moments les plus forts (niveau, élite, mort, grimoire), 30 secondes chacun. */
export function choisirClips(moments: Moment[], dureeVideo: number, nombre = 3): ClipVertical[] {
  const forts = moments.filter((m) => ["niveau", "exploit", "mort", "grimoire"].includes(m.genre))
    .sort((a, b) => PRIORITE[a.genre] - PRIORITE[b.genre] || a.seconde - b.seconde);
  const out: ClipVertical[] = [];
  for (const m of forts) {
    if (out.length >= nombre) break;
    const debut = Math.max(0, Math.min(m.seconde - 12, dureeVideo - DUREE_CLIP));
    if (out.some((c) => Math.abs(c.debut - debut) < DUREE_CLIP)) continue;
    out.push({ debut: Math.round(debut * 10) / 10, duree: Math.min(DUREE_CLIP, dureeVideo), titre: m.sousTitre.replace(/[.:].*$/, "").trim() });
  }
  return out.sort((a, b) => a.debut - b.debut);
}

/** Erreurs d'une narration relue (fichier modifié à la main ou dans l'atelier), en français ; [] si elle est bonne. */
export function verifierNarration(n: unknown): string[] {
  const e: string[] = [];
  const x = n as Partial<Narration>;
  if (!x || typeof x !== "object") return ["Le fichier n'est pas une narration."];
  if (x.format !== 1) e.push("Format inconnu (attendu : 1).");
  if (!x.video || typeof x.video !== "string") e.push("Chemin de la vidéo manquant.");
  if (!Array.isArray(x.moments)) e.push("Liste des moments manquante.");
  for (const [i, m] of (x.moments ?? []).entries()) {
    if (!(GENRES_MOMENT as readonly string[]).includes(m.genre)) e.push(`Moment ${i + 1} : genre inconnu « ${m.genre} ».`);
    if (!(m.seconde >= 0) || !(m.duree > 0)) e.push(`Moment ${i + 1} : début ou durée invalide.`);
    if (typeof x.dureeVideo === "number" && m.seconde > x.dureeVideo) e.push(`Moment ${i + 1} : après la fin de la vidéo.`);
    if ((m.bulle ?? "").length > 140) e.push(`Moment ${i + 1} : bulle trop longue (140 caractères au plus).`);
  }
  for (const [i, c] of (x.clips ?? []).entries()) {
    if (!(c.debut >= 0) || !(c.duree > 0) || c.duree > 60) e.push(`Clip ${i + 1} : début ou durée invalide (60 s au plus).`);
  }
  return e;
}

/** Apostrophes et espaces insécables à la française pour l'affichage. */
export function typographie(t: string): string {
  return t.replace(/'/g, "’").replace(/ ([!?:;])/g, " $1").replace(/« /g, "« ").replace(/ »/g, " »");
}

export const couleurBulle = (g: GenreMoment) => COULEUR_GENRE[g];

// ——— Graphe ffmpeg ———

export interface Calque { fichier: string; x: string; y: string; debut: number; fin: number }
export interface PlanRendu {
  largeur: number; hauteur: number;
  intro: { fichier: string; secondes: number } | null;
  audio: boolean;                     // la vidéo a une piste son
  dureeJeu: number;                   // durée de la partie de jeu rendue
  medaillons: { normal: string; mort: string; niveau: string; x: number; y: number; hauteur: number };
  etats: { mort: [number, number][]; niveau: [number, number][]; parle: [number, number][] };
  calques: Calque[];                  // bulles et sous-titres, aux heures de la partie de jeu
}

const n2 = (v: number) => (Math.round(v * 100) / 100).toString();
const intervalles = (l: [number, number][], decal: number) =>
  l.length ? l.map(([a, b]) => `between(t,${n2(a + decal)},${n2(b + decal)})`).join("+") : "0";

/**
 * Entrées et graphe ffmpeg d'un rendu : image de départ (avec un silence), partie de jeu mise à la taille de sortie,
 * médaillon (normal, gris à la mort, doré au niveau, petit rebond quand Jobwow « parle »), bulles et sous-titres.
 * L'entrée 0 est la vidéo de jeu (déjà découpée par -ss/-t pour un clip).
 */
export function grapheRendu(p: PlanRendu): { entrees: string[][]; graphe: string } {
  const W = p.largeur, H = p.hauteur;
  const entrees: string[][] = [];
  const lignes: string[] = [];
  const decal = p.intro?.secondes ?? 0;
  const vertical = H > W;
  // mise à la taille : en paysage on garde toute l'image ; en vertical, on recadre le centre
  lignes.push(vertical
    ? `[0:v]scale=-2:${H},crop=${W}:${H},setsar=1,fps=30,format=yuv420p[jeu]`
    : `[0:v]scale=${W}:${H}:force_original_aspect_ratio=decrease,pad=${W}:${H}:(ow-iw)/2:(oh-ih)/2,setsar=1,fps=30,format=yuv420p[jeu]`);
  let k = 1;
  let audioJeu = "[0:a]";
  if (!p.audio) {
    entrees.push(["-f", "lavfi", "-t", n2(p.dureeJeu), "-i", "anullsrc=r=48000:cl=stereo"]);
    audioJeu = `[${k++}:a]`;
  }
  lignes.push(`${audioJeu}aresample=48000,aformat=channel_layouts=stereo[aj]`);
  let v = "[jeu]", a = "[aj]";
  if (p.intro) {
    entrees.push(["-loop", "1", "-framerate", "30", "-t", n2(p.intro.secondes), "-i", p.intro.fichier]);
    const iv = k++;
    entrees.push(["-f", "lavfi", "-t", n2(p.intro.secondes), "-i", "anullsrc=r=48000:cl=stereo"]);
    const ia = k++;
    lignes.push(`[${iv}:v]scale=${W}:${H}:force_original_aspect_ratio=increase,crop=${W}:${H},setsar=1,fps=30,format=yuv420p,fade=t=out:st=${n2(p.intro.secondes - 0.5)}:d=0.5[intro]`);
    lignes.push(`[intro][${ia}:a][jeu][aj]concat=n=2:v=1:a=1[v0][a0]`);
    v = "[v0]"; a = "[a0]";
  }
  // médaillons : normal hors image de départ, puis gris (mort) et doré (niveau) par-dessus
  const m = p.medaillons;
  const rebond = `${m.y}-if(gt(${intervalles(p.etats.parle, decal)},0),8*abs(sin(7*t)),0)`;
  const calques: { fichier: string; x: string; y: string; quand: string }[] = [
    { fichier: m.normal, x: String(m.x), y: rebond, quand: `gte(t,${n2(decal)})` },
  ];
  if (p.etats.mort.length) calques.push({ fichier: m.mort, x: String(m.x), y: rebond, quand: intervalles(p.etats.mort, decal) });
  if (p.etats.niveau.length) calques.push({ fichier: m.niveau, x: String(m.x), y: rebond, quand: intervalles(p.etats.niveau, decal) });
  for (const c of p.calques) calques.push({ fichier: c.fichier, x: c.x, y: c.y, quand: `between(t,${n2(c.debut + decal)},${n2(c.fin + decal)})` });
  calques.forEach((c, i) => {
    entrees.push(["-i", c.fichier]);
    const sortie = i === calques.length - 1 ? "[vf]" : `[v${i + 1}c]`;
    lignes.push(`${v}[${k++}:v]overlay=x='${c.x}':y='${c.y}':eval=frame:enable='${c.quand}'${sortie}`);
    v = sortie;
  });
  if (!calques.length) lignes.push(`${v}null[vf]`);
  lignes.push(`${a}anull[af]`);
  return { entrees, graphe: lignes.join(";\n") };
}
