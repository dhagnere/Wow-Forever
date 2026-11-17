/**
 * Jobwow incrusté dans les vidéos du Journal (script `npm run carnet:incrustation`, sur le PC de Jobwow) :
 * médaillon de Jobwow en bas à gauche, bulle de réplique humoristique, sous-titres de ce qui se passe à l'écran,
 * miniature YouTube en image de départ, clips verticaux de 30 secondes. Pas de voix.
 *
 * Les moments viennent des repères de la sonde (EternalProbe ou RouteProbe), datés par l'heure du PC ; la narration
 * est gardée dans un fichier `.narration.json` à côté de la vidéo, modifiable dans l'atelier vidéo (artefact), puis
 * relue au rendu. Fonctions pures : sharp et ffmpeg restent dans scripts/incrustation-video.ts.
 */
import { COULEUR_GENRE, GENRES_MOMENT, listeRepliques, ordreMelange, remplir, type GenreMoment } from "@/content/repliques-jobwow";
import { PERSONNAGES, personnageDuJeu, personnageVideo } from "@/content/personnages";
import { CARTES_JEU } from "@/content/cartes-jeu";
import { heureLocale, niveauAtteint, type ValeurLua } from "@/lib/videoCarnet";
import { lieuParNom } from "@/lib/cartes";

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
  /** Voix de la bulle (npm run carnet:voix) : fichier relatif à la narration, texte dit, durée en secondes. */
  voix?: string;
  voixTexte?: string;
  dureeVoix?: number;
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
  /** Fichiers assemblés (« nom|durée ») : une vidéo ajoutée ou retirée refait l'assemblage et la narration. */
  sources?: string[];
  /** Relue et validée dans l'Atelier : `npm run carnet` peut faire le rendu. */
  valide?: boolean;
  valideLe?: string;
  /** Miniature faite dans l'Atelier (JPEG en data URL), écrite à côté de la narration par `npm run carnet`. */
  miniatureImage?: string | null;
  /**
   * Partie d'une longue soirée (lib/parties.ts) : morceau de la vidéo de la journée rendu par cette narration ;
   * les secondes des moments et des clips comptent depuis son début, `dureeVideo` est sa durée.
   */
  extrait?: { debut: number; duree: number };
  partie?: { numero: number; total: number; journee: string };
  /** Personnage des vidéos (content/personnages.ts : « thesham »…) ; absent : Jobwow le tavernier. */
  profil?: string;
  /** Moments repris d'une narration déjà relue (soirée découpée après coup) : l'Atelier marque la relecture faite. */
  relue?: string;
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
export function sousTitre(genre: GenreMoment, v: Evenement["valeurs"], serie = "Journal de Jobwow"): string {
  switch (genre) {
    case "intro": return [serie, v.zone, v.niveau ? `niveau ${v.niveau}` : null].filter(Boolean).join(" · ");
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
  /** Graine des répliques (la vidéo par défaut) : deux parties d'une même vidéo n'ont pas les mêmes répliques. */
  graine?: string;
  /** Personnage des vidéos (content/personnages.ts) ; sinon d'après le nom joué, sinon Jobwow. */
  profil?: string | null;
}): Narration {
  const fin = o.fin ?? o.debut + o.dureeVideo * 1000;
  const position = o.position ?? ((h: number) => (h - o.debut) / 1000);
  const personnage = personnageJoue(o.evenements, o.debut, fin);
  const evts = personnage ? o.evenements.filter((e) => e.personnage === personnage) : [];
  const perso = o.profil ? personnageVideo(o.profil) : personnageDuJeu(personnage) ?? personnageVideo();
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
  const g = graine(o.graine ?? o.video);
  // chaque liste est servie dans un ordre propre à la vidéo, sans redite avant d'avoir tout servi
  const rangs = new Map<string, number>();
  const piocher = (cle: string, liste: string[]) => {
    const r = rangs.get(cle) ?? 0;
    rangs.set(cle, r + 1);
    return liste[ordreMelange(liste.length, g ^ graine(cle))[r % liste.length]];
  };
  let morts = 0;

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
  const gardes: Moment[] = [{ seconde: 0, duree: 6, genre: "intro", bulle: "", sousTitre: sousTitre("intro", { zone, niveau }, perso.serie) }];
  const libre = (m: Moment) => gardes.every((x) => m.seconde >= x.seconde + x.duree + ECART_MOMENTS || m.seconde + m.duree + ECART_MOMENTS <= x.seconde);
  for (const m of [...candidats].sort((a, b) => PRIORITE[a.genre] - PRIORITE[b.genre] || a.seconde - b.seconde)) {
    if (!libre(m)) continue;
    if (m.genre === "quete" && gardes.some((x) => x.genre === "quete" && Math.abs(x.seconde - m.seconde) < ECART_QUETES)) continue;
    gardes.push(m);
  }
  gardes.sort((a, b) => a.seconde - b.seconde);
  const moments = gardes.map((m) => {
    const v = (m as Moment & { _valeurs?: Evenement["valeurs"] })._valeurs ?? { zone, niveau };
    if (m.genre === "mort") morts++;
    // palier de niveau, choix d'une capacité, mort répétée : leurs propres répliques
    const { cle, liste } = listeRepliques(m.genre, { niveau: v.niveau, demons: Boolean(v.demons), morts }, perso.repliques);
    return { seconde: m.seconde, duree: m.duree, genre: m.genre, bulle: remplir(piocher(cle, liste), v), sousTitre: m.sousTitre };
  });

  return {
    format: 1,
    video: o.video,
    titre: o.titre,
    miniature: o.miniature,
    introSecondes: o.miniature ? (o.introSecondes ?? 4) : 0,
    dureeVideo: Math.round(o.dureeVideo * 10) / 10,
    personnage,
    ...(perso.id !== "jobwow" ? { profil: perso.id } : {}),
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
  if (x.profil !== undefined && !(typeof x.profil === "string" && x.profil in PERSONNAGES)) e.push(`Personnage inconnu : « ${String(x.profil)} » (au choix : ${Object.keys(PERSONNAGES).join(", ")}).`);
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
  if (x.extrait !== undefined && !(x.extrait && x.extrait.debut >= 0 && x.extrait.duree > 0)) e.push("Morceau de la vidéo (partie) invalide.");
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
  /**
   * Carte de fin (16/11/2026, demandée par Jobwow) : le jeu s'éteint en fondu au noir (image et son) sur `fondu`
   * secondes, puis la carte (« la suite de l'aventure », miniature de la partie suivante, adresse du site) apparaît
   * en fondu et reste `secondes` secondes, le temps d'y poser les éléments de fin de YouTube.
   */
  outro?: { fichier: string; secondes: number; fondu: number } | null;
  audio: boolean;                     // la vidéo a une piste son
  dureeJeu: number;                   // durée de la partie de jeu rendue
  /** Médaillon permanent (Jobwow) ; null pour un personnage qui n'apparaît qu'aux moments forts. */
  medaillons: { normal: string; mort: string; niveau: string; x: number; y: number; hauteur: number } | null;
  /**
   * Personnage qui surgit à chaque moment (Jobwow TheSham) : buste détouré, monté du bas de l'image en 0,3 s,
   * redescendu en 0,3 s à la fin du moment ; posé sous la bulle façon bande dessinée.
   */
  apparitions?: { x: number; y: number; hauteur: number; variantes: { fichier: string; intervalles: [number, number][] }[] } | null;
  etats: { mort: [number, number][]; niveau: [number, number][]; parle: [number, number][] };
  calques: Calque[];                  // bulles et sous-titres, aux heures de la partie de jeu
  /** Voix des bulles, aux heures de la partie de jeu ; le son du jeu baisse pendant qu'elles parlent. */
  voix?: { fichier: string; debut: number; fin: number }[];
}

/** Volume du jeu pendant que Jobwow parle, et de sa voix. */
export const VOLUME_JEU_SOUS_VOIX = 0.35;
export const VOLUME_VOIX = 1.6;

/** La voix d'un moment, si elle a été faite pour le texte actuel de la bulle (sinon elle est périmée). */
export function voixAJour(m: Moment): boolean {
  return Boolean(m.voix && m.bulle.trim() && m.voixTexte === m.bulle);
}

/** Durée de la montée (et de la descente) du personnage qui surgit aux moments forts. */
export const APPARITION = 0.3;

/**
 * Intervalles d'apparition d'un personnage « evenements » : les moments à bulle, deux moments à moins de 1,5 s
 * l'un de l'autre réunis (le buste reste à l'écran au lieu de redescendre aussitôt), chaque intervalle d'au moins
 * deux montées. Rangés par variante : « mort » pendant une mort, « niveau » pendant un niveau, sinon « normal ».
 */
export function intervallesApparition(moments: Pick<Moment, "seconde" | "duree" | "genre" | "bulle">[], dureeJeu: number):
  Record<"normal" | "mort" | "niveau", [number, number][]> {
  const out: Record<"normal" | "mort" | "niveau", [number, number][]> = { normal: [], mort: [], niveau: [] };
  let dernier: { v: "normal" | "mort" | "niveau"; i: [number, number] } | null = null;
  for (const m of [...moments].filter((x) => x.bulle.trim()).sort((a, b) => a.seconde - b.seconde)) {
    const v = m.genre === "mort" ? "mort" : m.genre === "niveau" ? "niveau" : "normal";
    const a = Math.max(0, m.seconde), b = Math.min(dureeJeu, Math.max(m.seconde + m.duree, m.seconde + 2 * APPARITION + 0.2));
    if (b <= a) continue;
    if (dernier && dernier.v === v && a - dernier.i[1] < 1.5) { dernier.i[1] = Math.max(dernier.i[1], b); continue; }
    const i: [number, number] = [a, b];
    out[v].push(i);
    dernier = { v, i };
  }
  return out;
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
  // coupe exacte à la durée du jeu : à la jonction de deux enregistrements assemblés, la première image du fichier
  // suivant porte un horodatage qui, sans cette coupe, étirait la vidéo jusqu'à la fin de la soirée (16/11/2026)
  const coupe = `trim=duration=${n2(p.dureeJeu)},setpts=PTS-STARTPTS,`;
  // mise à la taille : en paysage on garde toute l'image ; en vertical, on recadre le centre
  lignes.push(vertical
    ? `[0:v]${coupe}scale=-2:${H},crop=${W}:${H},setsar=1,fps=30,format=yuv420p[jeu]`
    : `[0:v]${coupe}scale=${W}:${H}:force_original_aspect_ratio=decrease,pad=${W}:${H}:(ow-iw)/2:(oh-ih)/2,setsar=1,fps=30,format=yuv420p[jeu]`);
  let k = 1;
  let audioJeu = "[0:a]";
  const coupeA = `atrim=duration=${n2(p.dureeJeu)},asetpts=PTS-STARTPTS,`;
  if (!p.audio) {
    entrees.push(["-f", "lavfi", "-t", n2(p.dureeJeu), "-i", "anullsrc=r=48000:cl=stereo"]);
    audioJeu = `[${k++}:a]`;
  }
  const voix = p.voix ?? [];
  if (!voix.length) {
    lignes.push(`${audioJeu}${p.audio ? coupeA : ""}aresample=48000,aformat=channel_layouts=stereo[aj]`);
  } else {
    // le jeu baisse pendant que Jobwow parle ; chaque voix est décalée à son heure et prolongée de silence,
    // pour que le mélange (ffmpeg 4.1 : amix divise par le nombre d'entrées) garde un volume constant
    const sous = voix.map((x) => `between(t,${n2(x.debut)},${n2(x.fin)})`).join("+");
    lignes.push(`${audioJeu}${p.audio ? coupeA : ""}aresample=48000,aformat=channel_layouts=stereo,volume=${VOLUME_JEU_SOUS_VOIX}:enable='${sous}'[ajeu]`);
    const noms: string[] = [];
    voix.forEach((x, i) => {
      entrees.push(["-i", x.fichier]);
      const ms = Math.max(0, Math.round(x.debut * 1000));
      lignes.push(`[${k++}:a]aresample=48000,aformat=channel_layouts=stereo,adelay=${ms}|${ms},apad,volume=${VOLUME_VOIX}[vx${i}]`);
      noms.push(`[vx${i}]`);
    });
    lignes.push(`[ajeu]${noms.join("")}amix=inputs=${voix.length + 1}:duration=first:dropout_transition=0,volume=${voix.length + 1}[aj]`);
  }
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
  const calques: { fichier: string; x: string; y: string; quand: string }[] = [];
  if (m) {
    const rebond = `${m.y}-if(gt(${intervalles(p.etats.parle, decal)},0),8*abs(sin(7*t)),0)`;
    calques.push({ fichier: m.normal, x: String(m.x), y: rebond, quand: `gte(t,${n2(decal)})` });
    if (p.etats.mort.length) calques.push({ fichier: m.mort, x: String(m.x), y: rebond, quand: intervalles(p.etats.mort, decal) });
    if (p.etats.niveau.length) calques.push({ fichier: m.niveau, x: String(m.x), y: rebond, quand: intervalles(p.etats.niveau, decal) });
  }
  const ap = p.apparitions;
  // une entrée par variante (normale, grise à la mort, dorée au niveau) : le buste monte du bas en 0,3 s au début de
  // chaque moment et redescend en 0,3 s à la fin
  for (const va of ap?.variantes ?? []) {
    if (!va.intervalles.length) continue;
    const glisse = va.intervalles.map(([a, b]) => {
      const d = n2(a + decal), f = n2(b + decal);
      return `between(t,${d},${f})*${ap!.hauteur}*(max(0,1-(t-${d})/${APPARITION})+max(0,1-(${f}-t)/${APPARITION}))`;
    }).join("+");
    calques.push({ fichier: va.fichier, x: String(ap!.x), y: `${ap!.y}+${glisse}`, quand: intervalles(va.intervalles, decal) });
  }
  for (const c of p.calques) calques.push({ fichier: c.fichier, x: c.x, y: c.y, quand: `between(t,${n2(c.debut + decal)},${n2(c.fin + decal)})` });
  const finV = p.outro ? "[vc]" : "[vf]", finA = p.outro ? "[ac]" : "[af]";
  calques.forEach((c, i) => {
    entrees.push(["-i", c.fichier]);
    const sortie = i === calques.length - 1 ? finV : `[v${i + 1}c]`;
    lignes.push(`${v}[${k++}:v]overlay=x='${c.x}':y='${c.y}':eval=frame:enable='${c.quand}'${sortie}`);
    v = sortie;
  });
  if (!calques.length) lignes.push(`${v}null${finV}`);
  lignes.push(`${a}anull${finA}`);
  if (p.outro) {
    // fondu au noir de la fin du jeu, puis la carte de fin, qui apparaît en fondu, sur un silence
    const fin = decal + p.dureeJeu, f = Math.min(p.outro.fondu, p.dureeJeu);
    lignes.push(`[vc]fade=t=out:st=${n2(fin - f)}:d=${n2(f)}[vn]`);
    lignes.push(`[ac]afade=t=out:st=${n2(fin - f)}:d=${n2(f)}[an]`);
    entrees.push(["-loop", "1", "-framerate", "30", "-t", n2(p.outro.secondes), "-i", p.outro.fichier]);
    const ov = k++;
    entrees.push(["-f", "lavfi", "-t", n2(p.outro.secondes), "-i", "anullsrc=r=48000:cl=stereo"]);
    const oa = k++;
    lignes.push(`[${ov}:v]scale=${W}:${H}:force_original_aspect_ratio=increase,crop=${W}:${H},setsar=1,fps=30,format=yuv420p,fade=t=in:st=0:d=1.2[carte]`);
    lignes.push(`[vn][an][carte][${oa}:a]concat=n=2:v=1:a=1[vf][af]`);
  }
  return { entrees, graphe: lignes.join(";\n") };
}

/**
 * Chapitres YouTube tirés des moments de la narration (zones, niveaux, élites, trajets, repères) :
 * le premier à 0:00, chacun d'au moins 10 secondes, décalés de l'image de départ (introSecondes).
 */
export function chapitresNarration(n: Pick<Narration, "moments" | "introSecondes" | "dureeVideo">): {
  liste: { seconde: number; titre: string }[]; valides: boolean; zones: string[]; niveaux: [number, number] | null;
} {
  const decalage = n.introSecondes > 0 ? n.introSecondes : 0;
  const moments = [...n.moments].sort((a, b) => a.seconde - b.seconde);
  const intro = moments.find((m) => m.genre === "intro");
  const parties = (intro?.sousTitre ?? "").split(" · ").map((x) => x.trim()).filter((x) => x && !/^journal de /i.test(x));
  const zoneDepart = parties.find((x) => !/^niveau/i.test(x));
  const niveauDepart = Number((parties.find((x) => /^niveau/i.test(x)) ?? "").replace(/\D/g, "")) || null;
  const sansPoint = (t: string) => t.replace(/\s*[.:]\s*$/, "").trim();
  const PRIORITE: Partial<Record<GenreMoment, number>> = { zone: 5, niveau: 4, exploit: 3, trajet: 2, marqueur: 2, vol: 1 };
  const candidats: { seconde: number; titre: string; p: number }[] = [];
  const zones: string[] = zoneDepart ? [zoneDepart] : [];
  const niveaux: number[] = niveauDepart ? [niveauDepart] : [];
  for (const m of moments) {
    const st = m.sousTitre ?? "";
    let titre = "";
    if (m.genre === "zone") { const z = st.replace(/^Arrivée\s*:\s*/i, "").replace(/\.$/, "").trim(); if (z && !zones.includes(z)) zones.push(z); titre = `Arrivée : ${z}`; }
    else if (m.genre === "niveau") { const x = Number((st.match(/\d+/) ?? [])[0]); if (x) { niveaux.push(x); titre = `Niveau ${x}`; } }
    else if (m.genre === "exploit") titre = sansPoint(st);
    else if (m.genre === "trajet") titre = sansPoint(st);
    else if (m.genre === "vol") titre = "En vol";
    else if (m.genre === "marqueur") titre = sansPoint(st);
    if (titre && PRIORITE[m.genre]) candidats.push({ seconde: m.seconde + decalage, titre, p: PRIORITE[m.genre]! });
  }
  // au plus 60 chapitres : les moins importants partent d'abord
  for (let p = 1; candidats.length > 59 && p <= 4; p++) for (let i = candidats.length - 1; i >= 0 && candidats.length > 59; i--) if (candidats[i].p === p) candidats.splice(i, 1);
  const liste = [{ seconde: 0, titre: ["Début", zoneDepart, niveauDepart ? `niveau ${niveauDepart}` : null].filter(Boolean).join(" · ") }];
  for (const c of candidats) {
    const dernier = liste[liste.length - 1];
    if (c.seconde - dernier.seconde < 10) {
      // trop proche : réuni avec le précédent (deux titres au plus)
      if (dernier.titre.split(" · ").length < 3 && !dernier.titre.includes(c.titre)) dernier.titre += ` · ${c.titre}`;
      continue;
    }
    if (n.dureeVideo && c.seconde > n.dureeVideo + decalage - 10) continue;
    liste.push({ seconde: Math.floor(c.seconde), titre: c.titre });
  }
  // pour le titre et les liens : les zones qui ont une carte (pas les sous-zones, une auberge…)
  const grandes = zones.filter((z) => lieuParNom(z));
  return { liste, valides: liste.length >= 3, zones: grandes.length ? grandes : zones, niveaux: niveaux.length ? [Math.min(...niveaux), Math.max(...niveaux)] : null };
}
