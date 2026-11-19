/**
 * Moments tirés de l'image (demandé par Jobwow le 19/11/2026, à la place de la sonde) : à chaque image clé de
 * l'enregistrement (une par seconde chez Warcraft Recorder), on lit le lieu, le niveau, le nom du personnage, la cible et
 * la couleur de l'image (scripts/analyse-video.ts, config/analyse-video.ts). Ce module transforme ces relevés en
 * événements, au même format que ceux de la sonde, pour la narration, le découpage et le rangement par personnage :
 * - nouveau lieu (texte stable plusieurs secondes, jamais vu dans la soirée) ;
 * - niveau gagné (le chiffre du médaillon augmente) ;
 * - mort (l'image passe au gris, comme en esprit, plusieurs secondes de suite) ;
 * - et, comme avec la sonde : hécatombe, pas de chance, égaré (six minutes sans cible ni événement).
 */
import { ANALYSE_VIDEO } from "@/config/analyse-video";
import { CARTES_JEU } from "@/content/cartes-jeu";
import { PERSONNAGES } from "@/content/personnages";
import { dureeEnClair, type Evenement } from "@/lib/incrustation";
import type { Signal } from "@/lib/parties";
import type { Repere } from "@/lib/videoCarnet";

export const VERSION_ANALYSE = 1;

export interface Echantillon {
  t: number;                  // seconde dans l'enregistrement
  lieu: string | null;        // texte lu, déjà nettoyé
  niveau: number | null;
  nom: string | null;
  saturation: number | null;  // 0 à 1, null pour une image presque noire (écran de chargement)
  cible: boolean;
}
export interface Analyse { version: number; fichier: string; taille: number; duree: number; echantillons: Echantillon[] }

const sansAccent = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "");
const cle = (s: string) => sansAccent(s).toLowerCase().replace(/[^a-z0-9]+/g, "");

/** Distance d'édition (pour corriger une lettre mal lue). */
export function distance(a: string, b: string): number {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) {
    d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  }
  return d[a.length][b.length];
}
export const semblables = (a: string, b: string) => {
  const x = cle(a), y = cle(b);
  return !!x && !!y && distance(x, y) <= Math.max(1, Math.floor(Math.min(x.length, y.length) / 6));
};

/** Texte du lieu lu au-dessus de la minicarte : sans l'heure, sans les débris de bord, « … » pour un nom coupé. */
export function nettoyerLieu(brut: string): string | null {
  let s = brut.replace(/\s+/g, " ").replace(/[‘’`´]/g, "'").replace(/\d{1,2}\s*[:.]\s*\d{2}/g, " ");
  const coupe = /(\.\.|…)/.test(s);
  s = s.replace(/[.…]+/g, " ").replace(/[^A-Za-zÀ-ÖØ-öø-ÿ' -]/g, " ").replace(/\s+/g, " ").trim();
  // débris d'une ou deux lettres aux bords (cadre, bouton)
  s = s.split(" ").filter((m, i, t) => !(m.length <= 2 && (i === 0 || i === t.length - 1) && !/^(de|du|la|le|l'|d')$/i.test(m))).join(" ");
  // « Îles » lu « lles » : le Î passe mal ; apostrophes typographiques ramenées à une seule
  s = s.replace(/'{2,}/g, "'").replace(/ ' /g, "'").replace(/^[lI1|]les /, "Îles ").trim();
  if (s.replace(/[^A-Za-zÀ-ÿ]/g, "").length < 3) return null;
  return coupe ? `${s}…` : s;
}

/** Nom du personnage lu sur son cadre, rapproché des noms connus (content/personnages.ts). */
export function nettoyerNom(brut: string): string | null {
  // chiffres pris pour des lettres (« Jobw0w ») : rendus à leur lettre avant le tri
  const mots = brut.replace(/0/g, "o").replace(/1/g, "l").replace(/5/g, "s").replace(/[^A-Za-zÀ-ÿ ]/g, " ").split(/\s+/).filter((m) => m.length >= 3);
  if (!mots.length) return null;
  const lu = mots.join(" ");
  const connus = Object.values(PERSONNAGES).flatMap((p) => p.nomsEnJeu);
  // le nom connu le plus proche (lettres seules), s'il est assez proche ; sinon le texte lu
  let meilleur: { nom: string; d: number } | null = null;
  for (const n of connus) {
    const d = distance(cle(lu), cle(n));
    if (!meilleur || d < meilleur.d) meilleur = { nom: n, d };
  }
  return meilleur && meilleur.d <= Math.max(2, Math.floor(cle(meilleur.nom).length / 4)) ? meilleur.nom : lu;
}

/** Nom du personnage joué dans un enregistrement : le plus souvent lu. */
export function personnageDeLAnalyse(a: Analyse): string | null {
  const n = new Map<string, number>();
  for (const e of a.echantillons) if (e.nom) n.set(e.nom, (n.get(e.nom) ?? 0) + 1);
  return [...n.entries()].sort((x, y) => y[1] - x[1])[0]?.[0] ?? null;
}

/** Nom de zone du jeu quand le lieu en est une (« Durotar »), pour l'écrire comme le jeu. */
const ZONES = Object.values(CARTES_JEU).map((c) => c.nom);
function nomCanonique(lieu: string, connus: string[]): string {
  const zone = ZONES.find((z) => semblables(z, lieu));
  if (zone) return zone;
  // nom coupé (« Terres des Tranchec… ») : complété par un nom entier vu ailleurs dans la soirée
  if (lieu.endsWith("…")) {
    const debut = cle(lieu.slice(0, -1));
    const entier = connus.find((c) => !c.endsWith("…") && cle(c).startsWith(debut));
    if (entier) return entier;
  }
  return lieu;
}

/** Valeur gardée quand elle est lue `n` fois de suite (une lecture isolée est souvent une erreur). */
function stables<T>(valeurs: (T | null)[], egal: (a: T, b: T) => boolean, n: number): (T | null)[] {
  const out: (T | null)[] = [];
  let actuelle: T | null = null, candidate: T | null = null, vu = 0;
  for (const v of valeurs) {
    if (v === null) { out.push(actuelle); continue; }
    if (candidate !== null && egal(v, candidate)) vu++;
    else { candidate = v; vu = 1; }
    if (vu >= n) actuelle = candidate;
    out.push(actuelle);
  }
  return out;
}

/**
 * Événements d'un enregistrement analysé, datés à l'heure du PC (`debut` : heure de sa première image, ms), au nom
 * du personnage lu à l'image. `lieuxDejaVus` : les lieux déjà annoncés plus tôt dans la soirée (enregistrements
 * précédents), complété au fil de l'eau.
 */
export function evenementsDepuisAnalyse(a: Analyse, debut: number, lieuxDejaVus: Set<string> = new Set(), lieuxConnus: string[] = []): Evenement[] {
  const personnage = personnageDeLAnalyse(a) ?? "?";
  const ech = [...a.echantillons].sort((x, y) => x.t - y.t);
  const out: Evenement[] = [];
  const e = (t: number, genre: Evenement["genre"], valeurs: Evenement["valeurs"]) => out.push({ heure: debut + Math.round(t * 1000), genre, valeurs, personnage });
  out.push({ heure: debut, genre: "reprise", valeurs: {}, personnage });

  // lieux et niveaux stables
  const connus = [...lieuxConnus, ...ech.map((x) => x.lieu).filter((x): x is string => !!x && !x.endsWith("…"))];
  const lieux = stables(ech.map((x) => (x.lieu ? nomCanonique(x.lieu, connus) : null)), semblables, 3);
  const niveaux = stables(ech.map((x) => x.niveau && x.niveau >= 1 && x.niveau <= 60 ? x.niveau : null), (x, y) => x === y, 2);
  let lieu: string | null = null, niveau: number | null = null, dernierLieu = -Infinity;
  const lieuA: (string | undefined)[] = [];   // lieu courant à chaque relevé (pour situer une mort, un égarement)
  ech.forEach((x, i) => {
    const l = lieux[i];
    if (l && (!lieu || !semblables(l, lieu))) {
      lieu = l;
      const k = cle(l);
      // un lieu nouveau dans la soirée, au plus un toutes les 90 s
      if (!lieuxDejaVus.has(k) && x.t - dernierLieu >= 90) { e(x.t, "zone", { zone: l }); dernierLieu = x.t; }
      lieuxDejaVus.add(k);
    }
    const n = niveaux[i];
    if (n !== null) {
      if (niveau !== null && n > niveau && n - niveau <= 2) e(x.t, "niveau", { zone: lieu ?? undefined, niveau: String(n) });
      if (niveau === null || (n > niveau && n - niveau <= 2)) niveau = n;
    }
    lieuA.push(lieu ?? undefined);
  });

  // mort : le monde passe au gris (en esprit) au moins 5 s de suite ; une scène de nuit reste colorée (config)
  let gris = 0, mort = false;
  ech.forEach((x, i) => {
    if (x.saturation === null) return;
    if (x.saturation < ANALYSE_VIDEO.seuilGris) {
      gris++;
      if (!mort && gris >= 5) { mort = true; e(x.t - gris + 1, "mort", { zone: lieuA[i] }); }
    } else if (x.saturation > ANALYSE_VIDEO.seuilGris * 1.5) { gris = 0; mort = false; }
  });

  // égaré : six minutes sans cible, sans nouveau lieu ni niveau ni mort
  const actifs = new Set(out.filter((x) => x.genre !== "reprise").map((x) => Math.round((x.heure - debut) / 1000)));
  let depuis: number | null = null, iDepuis = 0;
  ech.forEach((x, i) => {
    const actif = x.cible || actifs.has(Math.round(x.t));
    if (actif) {
      if (depuis !== null && x.t - depuis >= 360) e(depuis + 150, "egare", { zone: lieuA[iDepuis], duree: dureeEnClair(x.t - depuis) });
      depuis = null;
    } else if (depuis === null) { depuis = x.t; iDepuis = i; }
  });

  // moments drôles, comme avec la sonde : hécatombe, pas de chance
  out.sort((p, q) => p.heure - q.heure);
  const droles: Evenement[] = [];
  let morts: number[] = [], dernierNiveau: { heure: number; niveau?: string } | null = null;
  for (const x of out) {
    if (x.genre === "niveau") dernierNiveau = { heure: x.heure, niveau: x.valeurs.niveau };
    if (x.genre !== "mort") continue;
    morts = [...morts.filter((t0) => x.heure - t0 < 15 * 60000), x.heure];
    if (morts.length >= 3) droles.push({ ...x, genre: "hecatombe", valeurs: { ...x.valeurs, nombre: String(morts.length) } });
    else if (dernierNiveau && x.heure - dernierNiveau.heure < 180000) droles.push({ ...x, genre: "malchance", valeurs: { ...x.valeurs, niveau: dernierNiveau.niveau } });
  }
  return [...out, ...droles].sort((p, q) => p.heure - q.heure);
}

/** Signaux pour le découpage d'une soirée en parties (fins de chapitre : lieu, niveau ; activité : mort). */
export function signauxDepuisEvenements(evts: Evenement[]): Signal[] {
  const out: Signal[] = [];
  for (const x of evts) {
    if (x.genre === "zone") out.push({ heure: x.heure, genre: "zone", personnage: x.personnage, texte: x.valeurs.zone });
    else if (x.genre === "niveau") out.push({ heure: x.heure, genre: "niveau", personnage: x.personnage, texte: x.valeurs.niveau });
    else if (x.genre === "mort") out.push({ heure: x.heure, genre: "mort", personnage: x.personnage });
  }
  return out;
}

/** Repères pour les chapitres YouTube : l'état au début de l'enregistrement (lieu|niveau), puis lieux et niveaux. */
export function reperesDepuisAnalyse(a: Analyse, debut: number, evts: Evenement[]): Repere[] {
  const personnage = personnageDeLAnalyse(a) ?? "?";
  const premiers = a.echantillons.filter((x) => x.t <= 60);
  const lieu = premiers.find((x) => x.lieu && !x.lieu.endsWith("…"))?.lieu ?? "";
  const niveau = premiers.find((x) => x.niveau)?.niveau ?? "";
  const out: Repere[] = [{ heure: debut, type: "etat", texte: `${lieu}|${niveau}`, personnage }];
  for (const x of evts) {
    if (x.genre === "zone" && x.valeurs.zone) out.push({ heure: x.heure, type: "zone", texte: x.valeurs.zone, personnage: x.personnage });
    else if (x.genre === "niveau" && x.valeurs.niveau) out.push({ heure: x.heure, type: "niveau", texte: x.valeurs.niveau, personnage: x.personnage });
  }
  return out;
}
