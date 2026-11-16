/**
 * Jobwow incrusté dans les vidéos du Journal, sur le PC de Jobwow (jamais sur le serveur du site) :
 *
 *   npm run carnet:incrustation -- "<vidéo, dossier de vidéos ou fichier .narration.json>" \
 *     [--miniature <image>] [--sonde <EternalProbe.lua>] [--preparer] [--sans-clips] [--sortie <dossier>] [--ecart 30] [--par-fichier]
 *
 * Un dossier (celui de Warcraft Recorder) : les vidéos sont rangées par séance comme pour carnet:video (plus de 30 minutes
 * d'écart, nouvelle séance) et assemblées sans réencodage dans « Journal de Jobwow » (ou --sortie) ; --par-fichier garde
 * une vidéo par fichier. Un fichier seul donne une vidéo. Pour chaque vidéo (ou séance assemblée) :
 * 1. la narration (`<vidéo>.narration.json`) est préparée si elle n'existe pas encore : intro, moments forts tirés des
 *    repères de la sonde (niveau, élite, mort, zone, grimoire, entraîneur, trajet, quête rendue), répliques de Jobwow,
 *    sous-titres, trois clips verticaux. Elle se relit et se corrige dans l'atelier vidéo (artefact), puis on relance ;
 * 2. `<vidéo>.jobwow.mp4` : miniature YouTube en image de départ, médaillon de Jobwow en bas à gauche, bulles, sous-titres ;
 * 3. `<vidéo>.clip-1.mp4`… : clips verticaux 1080 × 1920 de 30 secondes (sauf --sans-clips).
 * --preparer s'arrête après la narration. Miniature : --miniature, sinon `<vidéo>.miniature.jpg|png` à côté de la vidéo.
 *
 * `npm run carnet` (dossier D:\WOW, depuis le 15/11/2026) fait l'étape suivante de chaque journée, à chaque lancement :
 * - les vidéos d'une même journée sont assemblées en une seule (« Journal de Jobwow/journal-jobwow_<date>.mp4 »), avec
 *   une seule narration ; une vidéo ajoutée ensuite refait l'assemblage et la narration (l'ancienne gardée en .avant.json) ;
 * - la narration validée dans l'Atelier (bouton « Valider », fichier enregistré dans les Téléchargements, miniature
 *   comprise) est reprise d'elle-même : la miniature est écrite à côté et placée en image de départ ;
 * - une narration validée et pas encore rendue est rendue (vidéo 16:9 et clips verticaux).
 * --ecart <minutes> découpe par séance au lieu de la journée.
 *
 * Longues soirées (depuis le 15/11/2026) : une journée de plus de 20 minutes est découpée d'office en parties de 15 à
 * 20 minutes (lib/parties.ts), coupées en fin de chapitre (embarquement, vol, arrivée dans une zone, quête rendue,
 * niveau, pause entre deux enregistrements), jamais pendant une mort, un élite ou un objectif à moitié fait. Le
 * découpage est écrit dans `<journée>.parties.json` (déplaçable dans l'Atelier, repris des Téléchargements comme la
 * narration) ; chaque partie a sa narration `<journée>_p<n>.narration.json`, sa miniature, son `.youtube.txt`, sa vidéo
 * `<journée>_p<n>.jobwow.mp4` et ses clips, tirés de la vidéo de la journée sans la recouper. --sans-parties garde une
 * seule vidéo ; une journée déjà préparée d'un seul tenant le reste, sauf avec --decouper.
 * Encodage H.264 (preset veryfast, CRF 20) : compter quelques minutes par heure de vidéo.
 */
import { spawn, execFile } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, renameSync, statSync, unlinkSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import ffmpeg from "@ffmpeg-installer/ffmpeg";
import sharp from "sharp";
import { COULEUR_GENRE } from "@/content/repliques-jobwow";
import {
  chapitresNarration, evenementsSonde, grapheRendu, preparerNarration, typographie, verifierNarration, voixAJour,
  type Calque, type Evenement, type Moment, type Narration,
} from "@/lib/incrustation";
import { chapitres, descriptionVideo, heureLocale, horodatage, lireSauvegardeSonde, positionDans, reperesRouteProbe, seances, SONDES, titreVideo, DOSSIER_VIDEOS, type Clip, type Repere, type Seance } from "@/lib/videoCarnet";
import {
  choisirParties, coupesPossibles, coupesProposees, memesBornes, nomPartie, PARTIE_MAX, repriseDansPartie, seanceDePartie, signauxSonde, verifierDecoupage,
  type Decoupage, type Signal,
} from "@/lib/parties";

const COMPTES_WOW = "C:\\WOW\\world of Warcraft\\_forever_\\WTF\\Account";
const EXTENSIONS = new Set([".mp4", ".mkv", ".mov"]);
const AVATAR = path.join(process.cwd(), "public/images/jobwow-512.png");
const POLICE_BULLE = "Georgia, Palatino Linotype, TeX Gyre Pagella, serif Bold";
const POLICE_ST = "Segoe UI Semibold, Inter SemiBold, DejaVu Sans Bold, sans-serif";

const option = (nom: string) => { const i = process.argv.indexOf(`--${nom}`); return i > 0 ? process.argv[i + 1] : undefined; };
// PowerShell retire souvent le « -- » de npm run, et npm garde alors les options pour lui : « preparer » sans tirets
// et la variable npm_config_<nom> valent aussi
const MOTS = ["preparer", "sans-clips", "par-fichier", "sans-parties", "decouper"];
const drapeau = (nom: string) =>
  process.argv.includes(`--${nom}`) || process.argv.includes(nom) || process.env[`npm_config_${nom.replace(/-/g, "_")}`] === "true";
const sansExt = (f: string) => f.slice(0, -path.extname(f).length);

function journalFfmpeg(args: string[]): Promise<string> {
  return new Promise((ok) => execFile(ffmpeg.path, args, { maxBuffer: 16 * 1024 * 1024 }, (_e, _o, err) => ok(String(err))));
}

function encoder(args: string[]): Promise<void> {
  return new Promise((ok, ko) => {
    const p = spawn(ffmpeg.path, args, { stdio: ["ignore", "inherit", "inherit"] });
    p.on("close", (code) => (code === 0 ? ok() : ko(new Error(`ffmpeg s'est arrêté (code ${code}).`))));
  });
}

async function infos(video: string): Promise<{ duree: number; audio: boolean }> {
  const j = await journalFfmpeg(["-hide_banner", "-i", video]);
  const m = /Duration:\s*(\d+):(\d+):(\d+(?:\.\d+)?)/.exec(j);
  if (!m) throw new Error(`Durée illisible : ${video}`);
  return { duree: +m[1] * 3600 + +m[2] * 60 + +m[3], audio: /Stream #.*Audio:/.test(j) };
}

function debutDe(video: string, duree: number): number {
  const h = heureLocale(path.basename(video));
  if (h !== null) return h;
  const f = statSync(video).mtime;
  return Date.UTC(f.getFullYear(), f.getMonth(), f.getDate(), f.getHours(), f.getMinutes(), f.getSeconds()) - Math.round(duree * 1000);
}

function sauvegardesSonde(): string[] {
  const donnee = option("sonde");
  if (donnee) return [donnee];
  if (!existsSync(COMPTES_WOW)) return [];
  return readdirSync(COMPTES_WOW)
    .flatMap((c) => SONDES.map((s) => path.join(COMPTES_WOW, c, "SavedVariables", s.fichier)))
    .filter((f) => existsSync(f));
}

// ——— Images incrustées (sharp) ———

const echapper = (t: string) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

async function texteImage(texte: string, police: string, taille: number, largeur: number, couleur: string, centre = false) {
  return sharp({
    text: {
      text: `<span foreground="${couleur}">${echapper(typographie(texte))}</span>`,
      font: `${police} ${taille}`, width: largeur, rgba: true, wrap: "word", align: centre ? "centre" : "left", dpi: 72,
    },
  }).png().toBuffer({ resolveWithObject: true });
}

/** Portrait de Jobwow dans un médaillon rond (bois, liseré), son nom sur un cartouche ; gris à la mort, doré au niveau. */
async function medaillon(diametre: number, etat: "normal" | "mort" | "niveau", sortie: string): Promise<{ l: number; h: number }> {
  const bord = Math.round(diametre * 0.085);
  const tot = diametre + 2 * bord;
  const cart = Math.round(diametre * 0.16);
  // retouche « Taverne » (choisie le 14/11) : parties claires assombries (la capture est presque blanche), couleur
  // et netteté rendues, touche chaude, bords du cercle assombris pour que Jobwow ressorte sur le jeu
  const chaud = Buffer.from(`<svg width="${diametre}" height="${diametre}"><rect width="${diametre}" height="${diametre}" fill="#c98a3a" fill-opacity="0.16"/></svg>`);
  const vignette = Buffer.from(`<svg width="${diametre}" height="${diametre}"><defs><radialGradient id="g" cx="50%" cy="42%" r="62%"><stop offset="55%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#000" stop-opacity="0.75"/></radialGradient></defs><rect width="${diametre}" height="${diametre}" fill="url(#g)"/></svg>`);
  const retouche = await sharp(AVATAR).extract({ left: 96, top: 20, width: 320, height: 320 }).resize(diametre, diametre)
    .modulate({ brightness: 0.7, saturation: 1.2 }).linear(1.15, 4).sharpen({ sigma: 1 })
    .composite([{ input: chaud, blend: "soft-light" }, { input: vignette }]).png().toBuffer();
  let portrait = sharp(retouche);
  if (etat === "mort") portrait = portrait.grayscale().modulate({ brightness: 0.8 });
  const rond = Buffer.from(`<svg width="${diametre}" height="${diametre}"><circle cx="${diametre / 2}" cy="${diametre / 2}" r="${diametre / 2}" fill="#fff"/></svg>`);
  const visage = await portrait.composite([{ input: rond, blend: "dest-in" }]).png().toBuffer();
  const liseré = etat === "niveau" ? "#f2c94c" : etat === "mort" ? "#9aa4ad" : "#d6a840";
  const epais = etat === "niveau" ? bord * 0.55 : bord * 0.3;
  const hTot = tot + Math.round(cart * 0.55);
  const cadre = Buffer.from(`<svg width="${tot}" height="${hTot}" xmlns="http://www.w3.org/2000/svg">
    <circle cx="${tot / 2}" cy="${tot / 2}" r="${tot / 2 - 1}" fill="#5c3e1e"/>
    <circle cx="${tot / 2}" cy="${tot / 2}" r="${tot / 2 - bord * 0.45}" fill="none" stroke="${liseré}" stroke-width="${epais}"/>
  </svg>`);
  const nom = await texteImage("Jobwow", "Georgia, TeX Gyre Schola, serif Bold", Math.round(cart * 0.62), 400, "#f3e6c8");
  const lc = (nom.info.width ?? 100) + cart;
  const cartouche = Buffer.from(`<svg width="${lc}" height="${cart}"><rect x="1.5" y="1.5" width="${lc - 3}" height="${cart - 3}" rx="8" fill="#5c3e1e" stroke="${liseré}" stroke-width="3"/></svg>`);
  await sharp(cadre).composite([
    { input: visage, left: bord, top: bord },
    { input: cartouche, left: Math.round((tot - lc) / 2), top: hTot - cart },
    { input: nom.data, left: Math.round((tot - (nom.info.width ?? 0)) / 2), top: hTot - cart + Math.round((cart - (nom.info.height ?? 0)) / 2) },
  ]).png().toFile(sortie);
  return { l: tot, h: hTot };
}

/** Bulle parchemin, bord de la couleur du moment, pointe en bas à gauche vers le médaillon. */
async function bulle(texte: string, couleur: string, largeurMax: number, taille: number, sortie: string): Promise<{ l: number; h: number }> {
  const pad = Math.round(taille * 0.8);
  const t = await texteImage(texte, POLICE_BULLE, taille, largeurMax - 2 * pad, "#3b2a14");
  const l = (t.info.width ?? 0) + 2 * pad, hb = (t.info.height ?? 0) + 2 * pad, pointe = Math.round(taille * 1.1);
  const ep = Math.max(4, Math.round(taille / 7));
  const svg = Buffer.from(`<svg width="${l + 8}" height="${hb + pointe + 8}" xmlns="http://www.w3.org/2000/svg">
    <rect x="${ep / 2 + 6}" y="${ep / 2 + 6}" width="${l - ep}" height="${hb - ep}" rx="22" fill="#000" fill-opacity="0.35"/>
    <path d="M${pad + 6} ${hb - ep} L${pad - pointe * 0.5} ${hb + pointe} L${pad + pointe * 1.1} ${hb - ep} Z" fill="#f3e6c8" stroke="${couleur}" stroke-width="${ep}" stroke-linejoin="round"/>
    <rect x="${ep / 2}" y="${ep / 2}" width="${l - ep}" height="${hb - ep}" rx="22" fill="#f3e6c8" stroke="${couleur}" stroke-width="${ep}"/>
    <path d="M${pad + 6 + ep} ${hb - ep * 1.5} L${pad + pointe * 1.1 - ep} ${hb - ep * 1.5}" stroke="#f3e6c8" stroke-width="${ep * 1.6}"/>
  </svg>`);
  await sharp(svg).composite([{ input: t.data, left: pad, top: pad }]).png().toFile(sortie);
  return { l: l + 8, h: hb + pointe + 8 };
}

/** Sous-titre blanc sur bandeau sombre arrondi, centré. */
async function bandeau(texte: string, largeurMax: number, taille: number, sortie: string): Promise<{ l: number; h: number }> {
  const pad = Math.round(taille * 0.55);
  const t = await texteImage(texte, POLICE_ST, taille, largeurMax - 2 * pad, "#ffffff", true);
  const l = (t.info.width ?? 0) + 2 * pad, h = (t.info.height ?? 0) + 2 * pad;
  const fond = Buffer.from(`<svg width="${l}" height="${h}"><rect width="${l}" height="${h}" rx="12" fill="#000" fill-opacity="0.72"/></svg>`);
  await sharp(fond).composite([{ input: t.data, left: pad, top: pad }]).png().toFile(sortie);
  return { l, h };
}

// ——— Rendus ———

interface Gabarit { W: number; H: number; diametre: number; medX: number; medBas: number; bulleL: number; bulleT: number; stL: number; stT: number; stBas: number; stDecalX: number; bulleAuDessus: boolean }
const PAYSAGE: Gabarit = { W: 1920, H: 1080, diametre: 270, medX: 50, medBas: 90, bulleL: 680, bulleT: 44, stL: 1150, stT: 44, stBas: 50, stDecalX: 150, bulleAuDessus: false };
const VERTICAL: Gabarit = { W: 1080, H: 1920, diametre: 330, medX: 50, medBas: 520, bulleL: 960, bulleT: 54, stL: 960, stT: 52, stBas: 200, stDecalX: 0, bulleAuDessus: true };

async function rendre(n: Narration, video: string, audio: boolean, g: Gabarit, sortie: string, travail: string,
  morceau: { debut: number; duree: number } | null, miniature: string | null, dossierNarration: string) {
  mkdirSync(travail, { recursive: true });
  const suf = morceau ? `v${Math.round(morceau.debut)}` : "p";
  const med = {
    normal: path.join(travail, `med-${suf}-normal.png`), mort: path.join(travail, `med-${suf}-mort.png`), niveau: path.join(travail, `med-${suf}-niveau.png`),
  };
  const dim = await medaillon(g.diametre, "normal", med.normal);
  await medaillon(g.diametre, "mort", med.mort);
  await medaillon(g.diametre, "niveau", med.niveau);
  const medY = g.H - dim.h - g.medBas;
  const debut = morceau?.debut ?? 0;
  const dureeJeu = morceau?.duree ?? n.dureeVideo;
  const dedans = (m: Moment) => m.seconde + m.duree > debut && m.seconde < debut + dureeJeu;
  const moments = n.moments.filter(dedans).map((m) => ({ ...m, seconde: Math.max(0, m.seconde - debut) }));
  const calques: Calque[] = [];
  for (const [i, m] of moments.entries()) {
    const fin = Math.min(dureeJeu, m.seconde + m.duree);
    if (m.bulle.trim()) {
      const f = path.join(travail, `bulle-${suf}-${i}.png`);
      const b = await bulle(m.bulle, COULEUR_GENRE[m.genre], g.bulleL, g.bulleT, f);
      const x = g.bulleAuDessus ? g.medX + 10 : g.medX + dim.l - 14;
      const y = g.bulleAuDessus ? medY - b.h - 10 : medY + 60 - b.h;
      calques.push({ fichier: f, x: String(x), y: String(Math.max(20, y)), debut: m.seconde, fin });
    }
    if (m.sousTitre.trim()) {
      const f = path.join(travail, `st-${suf}-${i}.png`);
      await bandeau(m.sousTitre, g.stL, g.stT, f);
      calques.push({ fichier: f, x: `(W-w)/2+${g.stDecalX}`, y: `H-h-${g.stBas}`, debut: m.seconde, fin });
    }
  }
  const avecBulle = moments.filter((m) => m.bulle.trim()).map((m) => [m.seconde, Math.min(dureeJeu, m.seconde + m.duree)] as [number, number]);
  // voix des bulles (npm run carnet:voix) : seulement celles faites pour le texte actuel, et entières dans le morceau
  const voix = n.moments
    .filter((m) => voixAJour(m) && m.seconde >= debut && m.seconde + (m.dureeVoix ?? 0) <= debut + dureeJeu)
    .map((m) => ({ fichier: path.resolve(dossierNarration, m.voix!), debut: m.seconde - debut, fin: m.seconde - debut + (m.dureeVoix ?? m.duree) }))
    .filter((x) => existsSync(x.fichier));
  const perimees = n.moments.filter((m) => m.voix && !voixAJour(m)).length;
  if (!morceau && perimees) console.log(`${perimees} voix ne correspondent plus au texte de leur bulle : relancez npm run carnet:voix pour les refaire.`);
  const { entrees, graphe } = grapheRendu({
    largeur: g.W, hauteur: g.H, audio, dureeJeu,
    intro: miniature && n.introSecondes > 0 ? { fichier: miniature, secondes: n.introSecondes } : null,
    medaillons: { ...med, x: g.medX, y: medY, hauteur: dim.h },
    etats: {
      parle: avecBulle,
      mort: moments.filter((m) => m.genre === "mort").map((m) => [m.seconde, Math.min(dureeJeu, m.seconde + m.duree + 6)]),
      niveau: moments.filter((m) => m.genre === "niveau").map((m) => [m.seconde, Math.min(dureeJeu, m.seconde + m.duree)]),
    },
    calques,
    voix,
  });
  const fichierGraphe = path.join(travail, `graphe-${suf}.txt`);
  writeFileSync(fichierGraphe, graphe, "utf8");
  // une partie ne rend que son morceau de la vidéo de la journée (-ss avant -i : recherche rapide, coupe exacte au réencodage)
  const dec = n.extrait?.debut ?? 0;
  const source = morceau ? ["-ss", String(dec + morceau.debut), "-t", String(morceau.duree), "-i", video]
    : n.extrait ? ["-ss", String(dec), "-t", String(n.extrait.duree), "-i", video] : ["-i", video];
  await encoder([
    "-hide_banner", "-y", "-loglevel", "error", "-stats",
    ...source, ...entrees.flat(),
    "-filter_complex_script", fichierGraphe, "-map", "[vf]", "-map", "[af]",
    "-c:v", "libx264", "-preset", "veryfast", "-crf", "20", "-pix_fmt", "yuv420p",
    "-c:a", "aac", "-b:a", "160k", "-movflags", "+faststart", sortie,
  ]);
}

/** Miniature remise à 1920 × 1080 en JPEG (ffmpeg ne lit pas toujours le WebP). */
async function miniaturePrete(f: string | null, travail: string): Promise<string | null> {
  if (!f) return null;
  if (!existsSync(f)) { console.log(`Miniature introuvable : ${f} (pas d'image de départ).`); return null; }
  mkdirSync(travail, { recursive: true });
  const sortie = path.join(travail, "miniature.jpg");
  await sharp(f).resize(1920, 1080, { fit: "cover" }).jpeg({ quality: 92 }).toFile(sortie);
  return sortie;
}

/** Une vidéo par journée (heure du PC) : toutes les vidéos d'un même jour, dans l'ordre. */
function parJour(clips: Clip[]): Seance[] {
  const jours = new Map<string, Clip[]>();
  for (const c of [...clips].sort((a, b) => a.debut - b.debut)) {
    const j = new Date(c.debut).toISOString().slice(0, 10);
    jours.set(j, [...(jours.get(j) ?? []), c]);
  }
  return [...jours.values()].map((cs) => ({
    clips: cs, debut: cs[0].debut, fin: Math.max(...cs.map((c) => c.debut + c.duree * 1000)), duree: cs.reduce((t, c) => t + c.duree, 0),
  }));
}

/** Miniature faite dans l'Atelier (data URL) : écrite en `<base>.miniature.jpg`, la narration ne garde que le nom. */
function sortirMiniature(n: Narration, fichierN: string): boolean {
  const m = /^data:image\/(?:jpeg|jpg|png|webp);base64,(.+)$/.exec(n.miniatureImage ?? "");
  if (!m) { if (n.miniatureImage !== undefined) { delete n.miniatureImage; return true; } return false; }
  const nom = `${path.basename(fichierN, ".narration.json")}.miniature.jpg`;
  writeFileSync(path.join(path.dirname(fichierN), nom), Buffer.from(m[1], "base64"));
  n.miniature = nom;
  if (!(n.introSecondes > 0)) n.introSecondes = 4;
  delete n.miniatureImage;
  console.log(`Miniature de l'Atelier : ${path.join(path.dirname(fichierN), nom)}`);
  return true;
}

/**
 * Narration validée dans l'Atelier, enregistrée dans les Téléchargements (« <base>.narration.json », ou « (1) »…) ou
 * déposée dans D:\WOW : reprise si elle est plus récente que celle du dossier et porte sur les mêmes vidéos.
 */
const DOSSIER_TELECHARGEMENTS = process.env.DOSSIER_TELECHARGEMENTS ?? path.join(os.homedir(), "Downloads");

/** Le nom d'un fichier de l'Atelier et ses doublons du navigateur (« (1) », « (2) »…). */
function motifCopies(fichier: string, suffixe: string): RegExp {
  const nom = path.basename(fichier, suffixe);
  const fin = suffixe.replace(/\.json$/, "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`^${nom.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}${fin}(?: ?\\(\\d+\\))?\\.json$`, "i");
}

/**
 * Rangement dans D:\WOW (demandé par Jobwow le 16/11/2026) : une fois le fichier de l'Atelier repris dans « Journal de
 * Jobwow », ses copies des Téléchargements (doublons « (1) » compris) sont retirées. Tout reste dans le dossier WOW.
 */
function rangerTelecharges(fichier: string, suffixe: string): void {
  const d = DOSSIER_TELECHARGEMENTS;
  if (!existsSync(d) || path.resolve(d) === path.resolve(path.dirname(fichier))) return;
  const motif = motifCopies(fichier, suffixe);
  for (const f of readdirSync(d)) {
    if (!motif.test(f)) continue;
    try { unlinkSync(path.join(d, f)); } catch { /* ouvert ailleurs : laissé */ }
  }
}

/** Copie du même fichier enregistrée par l'Atelier (Téléchargements, « (1) »…) ou déposée dans D:\WOW, plus récente. */
function plusRecentAilleurs(fichier: string, suffixe: string): { f: string; t: number } | null {
  const motif = motifCopies(fichier, suffixe);
  const dossiers = [...new Set([DOSSIER_TELECHARGEMENTS, DOSSIER_VIDEOS, path.dirname(fichier)])];
  let meilleur: { f: string; t: number } | null = null;
  for (const d of dossiers) {
    if (!existsSync(d)) continue;
    for (const f of readdirSync(d)) {
      const plein = path.join(d, f);
      if (!motif.test(f) || path.resolve(plein) === path.resolve(fichier)) continue;
      const t = statSync(plein).mtimeMs;
      if (!meilleur || t > meilleur.t) meilleur = { f: plein, t };
    }
  }
  if (!meilleur) return null;
  if (existsSync(fichier) && statSync(fichier).mtimeMs >= meilleur.t) return null;
  return meilleur;
}

function reprendreValidee(fichierN: string, sources: string[] | null): void {
  const meilleur = plusRecentAilleurs(fichierN, ".narration.json");
  if (!meilleur) return;
  let n: Narration;
  try { n = JSON.parse(readFileSync(meilleur.f, "utf8")) as Narration; } catch { console.log(`Narration illisible : ${meilleur.f}`); return; }
  if (!n.valide) return;
  if (sources && n.sources && JSON.stringify(n.sources) !== JSON.stringify(sources)) {
    console.log(`${meilleur.f} : validée pour d'autres vidéos que celles du jour (vidéos ajoutées depuis), ignorée.`);
    return;
  }
  if (sources && !n.sources) n.sources = sources;
  sortirMiniature(n, fichierN);
  writeFileSync(fichierN, JSON.stringify(n, null, 2), "utf8");
  rangerTelecharges(fichierN, ".narration.json");
  console.log(`Narration validée rangée dans le dossier WOW : ${meilleur.f} → ${fichierN}${n.miniatureImage ? " (miniature comprise)" : ""}`);
}

function miniatureVoisine(video: string): string | null {
  const base = sansExt(video);
  for (const ext of [".miniature.jpg", ".miniature.png", ".miniature.webp", ".jpg", ".png", ".webp"]) if (existsSync(base + ext)) return base + ext;
  return null;
}

async function main() {
  // sans cible donnée : le dossier D:\WOW, où se font toutes les opérations vidéo
  const premier = process.argv[2];
  const cible = premier && !premier.startsWith("--") && !MOTS.includes(premier) ? premier : DOSSIER_VIDEOS;
  const usage = 'Usage : npm run carnet:incrustation [-- "<vidéo, dossier ou .narration.json, D:\\WOW par défaut>"] [--miniature <image>] [--sonde <fichier>] [--preparer] [--sans-clips]';
  if (!cible || cible.startsWith("--") || !existsSync(cible)) { console.error(`${cible ? `Introuvable : « ${cible} ».\n` : ""}${usage}`); process.exit(1); }

  let evenements: Evenement[] | null = null;
  let reperes: Repere[] = [];
  let signaux: Signal[] = [];
  const chargerSonde = () => {
    if (evenements) return;
    evenements = [];
    for (const f of sauvegardesSonde()) {
      const db = lireSauvegardeSonde(readFileSync(f, "utf8"));
      evenements.push(...evenementsSonde(db));
      reperes.push(...reperesRouteProbe(db));
      signaux.push(...signauxSonde(db));
      console.log(`Repères de la sonde : ${f}`);
    }
    evenements.sort((a, b) => a.heure - b.heure);
    reperes = reperes.sort((a, b) => a.heure - b.heure);
    signaux = signaux.sort((a, b) => a.heure - b.heure);
    if (!evenements.length) console.log("Aucun repère de sonde : seule l'intro sera commentée (/reload en jeu pour sauvegarder, ou --sonde <fichier>).");
  };

  /**
   * Découpage d'une longue soirée : repris de l'Atelier (Téléchargements) s'il a été déplacé, relu s'il porte sur les
   * mêmes vidéos, sinon calculé d'après la sonde. Une partie dont les bornes ont changé repart d'une narration neuve.
   */
  const partiesDeLaJournee = async (nom: string, video: string, s: Seance, sources: string[], dossier: string) => {
    chargerSonde();
    const fichierD = path.join(dossier, `${nom}.parties.json`);
    const memesSources = (d: Partial<Decoupage>) => !d.sources || JSON.stringify(d.sources) === JSON.stringify(sources);
    const ailleurs = plusRecentAilleurs(fichierD, ".parties.json");
    if (ailleurs) {
      try {
        const x = JSON.parse(readFileSync(ailleurs.f, "utf8")) as Decoupage;
        const err = verifierDecoupage(x);
        if (err.length) console.log(`${ailleurs.f} : découpage ignoré.\n- ${err.join("\n- ")}`);
        else if (!memesSources(x)) console.log(`${ailleurs.f} : découpage fait pour d'autres vidéos (vidéos ajoutées depuis), ignoré.`);
        else {
          writeFileSync(fichierD, JSON.stringify(x, null, 2), "utf8");
          rangerTelecharges(fichierD, ".parties.json");
          console.log(`Découpage déplacé dans l'Atelier rangé dans le dossier WOW : ${ailleurs.f} → ${fichierD}`);
        }
      } catch { console.log(`Découpage illisible : ${ailleurs.f}`); }
    }
    let dec: Decoupage | null = null;
    if (existsSync(fichierD)) {
      try {
        dec = JSON.parse(readFileSync(fichierD, "utf8")) as Decoupage;
        if (verifierDecoupage(dec).length || !memesSources(dec)) dec = null;
      } catch { dec = null; }
    }
    if (!dec) {
      const coupes = coupesPossibles({ seance: s, dureeVideo: s.duree, signaux });
      const parties = choisirParties(coupes, s.duree);
      dec = { format: 1, video: path.relative(dossier, video) || path.basename(video), dureeVideo: Math.round(s.duree * 10) / 10, sources, parties, coupes: coupesProposees(coupes, parties) };
      writeFileSync(fichierD, JSON.stringify(dec, null, 2), "utf8");
      console.log(`${nom} : soirée de ${horodatage(s.duree)} découpée en ${parties.length} parties (${fichierD}) :`);
      for (const p of parties) console.log(`  partie ${p.numero} : ${horodatage(p.debut)} → ${horodatage(p.debut + p.duree)} (${horodatage(p.duree)})${p.coupe ? `, coupe : ${p.coupe}` : ""}`);
    }
    const total = dec.parties.length;
    // narration entière déjà relue, mise de côté par --decouper : ses moments sont repris dans chaque partie
    let reprise: Narration | null = null;
    const fichierEntier = path.join(dossier, `${nom}.narration.avant.json`);
    if (existsSync(fichierEntier)) {
      try {
        const x = JSON.parse(readFileSync(fichierEntier, "utf8")) as Narration;
        if (!x.partie && !verifierNarration(x).length && JSON.stringify(x.sources ?? []) === JSON.stringify(sources)) reprise = x;
      } catch { /* illisible : narrations neuves */ }
    }
    if (reprise) console.log(`${nom} : les moments relus de la narration entière (${reprise.moments.length}) sont repris dans les parties.`);
    // parties en trop d'un ancien découpage : mises de côté
    for (let k = total + 1; existsSync(path.join(dossier, `${nomPartie(nom, k)}.narration.json`)); k++) {
      const f = path.join(dossier, `${nomPartie(nom, k)}.narration.json`);
      renameSync(f, f.replace(/\.narration\.json$/, ".narration.avant.json"));
    }
    return dec.parties.map((p) => {
      const fichierP = path.join(dossier, `${nomPartie(nom, p.numero)}.narration.json`);
      const sourcesP = [...sources, `partie ${p.numero}/${total}|${p.debut.toFixed(1)}|${p.duree.toFixed(1)}`];
      if (existsSync(fichierP)) {
        try {
          const a = JSON.parse(readFileSync(fichierP, "utf8")) as Narration;
          if (!memesBornes(a.extrait, p) || (a.sources && JSON.stringify(a.sources) !== JSON.stringify(sourcesP))) {
            renameSync(fichierP, fichierP.replace(/\.narration\.json$/, ".narration.avant.json"));
            console.log(`${nomPartie(nom, p.numero)} : coupe déplacée ou vidéos changées, narration refaite (l'ancienne est gardée en .narration.avant.json).`);
          }
        } catch { /* illisible : refaite plus bas par verifierNarration */ }
      }
      return {
        video, seance: seanceDePartie(s, p), fichierN: fichierP,
        sources: sourcesP,
        partie: { numero: p.numero, total, journee: nom, debut: p.debut, duree: p.duree, reprise },
      };
    });
  };

  // vidéos à traiter : une narration, un fichier, ou un dossier rangé par séances (une longue soirée : une par partie)
  type InfoPartie = { numero: number; total: number; journee: string; debut: number; duree: number; reprise?: Narration | null };
  const travaux: { video: string; seance: Seance | null; fichierN?: string; sources?: string[]; partie?: InfoPartie }[] = [];
  const parNarration = cible.endsWith(".narration.json");
  const bilan: string[] = [];
  if (parNarration) {
    const n = JSON.parse(readFileSync(cible, "utf8")) as Narration;
    travaux.push({ video: path.resolve(path.dirname(cible), n.video), seance: null, fichierN: cible });
  } else if (statSync(cible).isDirectory()) {
    const sortieDossier = option("sortie") ?? path.join(cible, "Journal de Jobwow");
    const fichiers = readdirSync(cible).sort()
      .filter((nom) => EXTENSIONS.has(path.extname(nom).toLowerCase()) && !/\.(jobwow|clip-\d+)\.mp4$/i.test(nom))
      .map((nom) => path.join(cible, nom));
    const clips: Clip[] = [];
    for (const f of fichiers) { const { duree } = await infos(f); clips.push({ fichier: f, debut: debutDe(f, duree), duree }); }
    // une vidéo par journée (ou par séance avec --ecart, ou par fichier avec --par-fichier)
    const groupes = drapeau("par-fichier") ? clips.map((c) => ({ clips: [c], debut: c.debut, fin: c.debut + c.duree * 1000, duree: c.duree }))
      : option("ecart") ? seances(clips, Number(option("ecart"))) : parJour(clips);
    const parJourVu = new Map<string, number>();
    for (const s of groupes) {
      mkdirSync(sortieDossier, { recursive: true });
      const d = new Date(s.debut).toISOString();
      const jour = d.slice(0, 10);
      parJourVu.set(jour, (parJourVu.get(jour) ?? 0) + 1);
      const plusieurs = groupes.filter((g) => new Date(g.debut).toISOString().slice(0, 10) === jour).length > 1;
      const nom = plusieurs ? `journal-jobwow_${jour}_${d.slice(11, 16).replace(":", "h")}` : `journal-jobwow_${jour}`;
      const sources = s.clips.map((c) => `${path.basename(c.fichier)}|${c.duree.toFixed(1)}`);
      const fichierN = path.join(sortieDossier, `${nom}.narration.json`);
      let change = false;
      if (existsSync(fichierN)) {
        try {
          const ancienne = JSON.parse(readFileSync(fichierN, "utf8")) as Narration;
          change = !!ancienne.sources && JSON.stringify(ancienne.sources) !== JSON.stringify(sources);
        } catch { change = true; }
      }
      let video = s.clips[0].fichier;
      if (s.clips.length > 1) {
        video = path.join(sortieDossier, `${nom}${path.extname(s.clips[0].fichier).toLowerCase()}`);
        if (!existsSync(video) || change) {
          const liste = path.join(sortieDossier, `${nom}.liste.txt`);
          writeFileSync(liste, s.clips.map((c) => `file '${c.fichier.replace(/\\/g, "/").replace(/'/g, "'\\''")}'`).join("\n"), "utf8");
          console.log(`Assemblage de ${s.clips.length} fichiers (${horodatage(s.duree)}) : ${video}`);
          await encoder(["-hide_banner", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", liste, "-c", "copy", "-movflags", "+faststart", video]);
        } else console.log(`Déjà assemblée : ${video}`);
      }
      if (change) {
        renameSync(fichierN, fichierN.replace(/\.narration\.json$/, ".narration.avant.json"));
        console.log(`Vidéos ajoutées ou retirées pour ${nom} : narration refaite (l'ancienne est gardée en .narration.avant.json).`);
      }
      // longue soirée : des parties de 15 à 20 minutes (une journée déjà préparée d'un seul tenant le reste, sauf --decouper)
      if (!drapeau("sans-parties") && s.duree > PARTIE_MAX && (!existsSync(fichierN) || drapeau("decouper"))) {
        if (existsSync(fichierN)) {
          renameSync(fichierN, fichierN.replace(/\.narration\.json$/, ".narration.avant.json"));
          console.log(`${nom} : narration d'un seul tenant mise de côté (.narration.avant.json), la soirée est découpée en parties.`);
        }
        for (const p of await partiesDeLaJournee(nom, video, s, sources, sortieDossier)) travaux.push(p);
        continue;
      }
      travaux.push({ video, seance: s, fichierN, sources });
    }
  } else travaux.push({ video: cible, seance: null });
  if (!travaux.length) { console.error(`Aucune vidéo trouvée dans ${cible}.`); process.exit(1); }

  // titre, description et chapitres pour YouTube, relus par l'Atelier (refaits à chaque passage)
  const site = (process.env.SITE_URL ?? "https://www.taverne-eternelle.fr").replace(/\/+$/, "");
  const ecrireYoutube = (base: string, seance: Seance, n?: Narration, partie?: InfoPartie) => {
    // chapitres tirés de la narration (ses moments couvrent toute la journée, ou toute la partie), sinon des repères de la sonde
    const parNarr = n ? chapitresNarration(n) : null;
    const chap = parNarr && parNarr.valides ? parNarr : chapitres(seance, reperes);
    writeFileSync(`${base}.youtube.txt`, [`TITRE :`, titreVideo(seance, chap, partie?.numero), "", "DESCRIPTION :", descriptionVideo(seance, chap, site, undefined, partie)].join("\n"), "utf8");
  };
  for (const { video, seance: seanceConnue, fichierN: donne, sources, partie } of travaux) {
    const fichierN = donne ?? `${sansExt(video)}.narration.json`;
    const base = sansExt(fichierN).replace(/\.narration$/, "");
    const nomCourt = path.basename(base);
    const travail = path.join(path.dirname(fichierN), ".incrustation", nomCourt);
    const { duree, audio } = await infos(video);
    if (!parNarration) reprendreValidee(fichierN, sources ?? null);
    let n: Narration;
    if (existsSync(fichierN)) {
      n = JSON.parse(readFileSync(fichierN, "utf8")) as Narration;
      if (sortirMiniature(n, fichierN)) writeFileSync(fichierN, JSON.stringify(n, null, 2), "utf8");
      const erreurs = verifierNarration(n);
      if (erreurs.length) { console.error(`${fichierN} :\n- ${erreurs.join("\n- ")}`); process.exit(1); }
      console.log(`Narration relue : ${fichierN} (${n.moments.length} moments, ${n.clips.length} clips)`);
      if (seanceConnue) { chargerSonde(); ecrireYoutube(base, seanceConnue, n, partie); }
      // miniature donnée par son nom : à côté de la narration
      if (n.miniature && !path.isAbsolute(n.miniature) && !/^[A-Za-z]:[\\/]/.test(n.miniature)) n.miniature = path.join(path.dirname(fichierN), n.miniature);
    } else {
      chargerSonde();
      const debut = seanceConnue?.debut ?? debutDe(video, duree);
      const seance: Seance = seanceConnue ?? { clips: [{ fichier: video, debut, duree }], debut, fin: debut + duree * 1000, duree };
      const chap = chapitres(seance, reperes);
      n = preparerNarration({
        video: path.relative(path.dirname(fichierN), video) || path.basename(video), debut, dureeVideo: partie ? partie.duree : duree, evenements: (evenements as Evenement[] | null) ?? [], fin: seance.fin,
        position: (h) => positionDans(seance, h),
        // une partie : pas de miniature voisine (celle de la journée entière ne la décrit pas), elle se choisit dans l'Atelier
        miniature: option("miniature") ?? (partie ? null : miniatureVoisine(video) ?? (seance.clips.length > 1 ? miniatureVoisine(seance.clips[0].fichier) : null)),
        titre: titreVideo(seance, chap, partie?.numero),
        graine: partie ? `${path.basename(video)}#partie-${partie.numero}` : undefined,
      });
      if (partie) {
        n.extrait = { debut: partie.debut, duree: partie.duree };
        n.partie = { numero: partie.numero, total: partie.total, journee: partie.journee };
        if (partie.reprise) {
          const intro = n.moments[0]?.genre === "intro" ? n.moments[0] : null;
          const { moments, clips } = repriseDansPartie(partie.reprise, partie, intro);
          n.moments = moments;
          n.clips = clips;
          n.relue = partie.reprise.valideLe ?? new Date().toISOString();
          if (partie.reprise.personnage) n.personnage = partie.reprise.personnage;
        }
      }
      if (n.miniature) n.miniature = path.resolve(n.miniature);
      if (sources) n.sources = sources;
      writeFileSync(fichierN, JSON.stringify(n, null, 2), "utf8");
      ecrireYoutube(base, seance, n, partie);
      console.log(n.relue
        ? `Narration préparée : ${fichierN} (${n.moments.length} moments et ${n.clips.length} clips repris de ta relecture). Dans l'Atelier : miniature, puis validation.`
        : `Narration préparée : ${fichierN} (${n.moments.length} moments, ${n.clips.length} clips). À relire dans l'atelier vidéo.`);
      if (!n.miniature) console.log("Miniature : elle se choisit dans l'Atelier, avec la relecture (ou --miniature <image>).");
    }
    const etiquette = partie ? `${nomCourt} (partie ${partie.numero} sur ${partie.total}, ${horodatage(partie.duree)})` : nomCourt;
    if (drapeau("preparer")) { bilan.push(`${etiquette} : narration prête, à relire et valider dans l'Atelier.`); continue; }
    const sortie = `${base}.jobwow.mp4`;
    if (!parNarration && !n.valide) { bilan.push(`${etiquette} : à relire et valider dans l'Atelier (ouvre le dossier D:\\WOW), puis relance npm run carnet.`); continue; }
    if (!parNarration && existsSync(sortie) && statSync(sortie).mtimeMs > statSync(fichierN).mtimeMs) { bilan.push(`${etiquette} : déjà rendue (${path.basename(sortie)}).`); continue; }

    const mini = await miniaturePrete(option("miniature") ?? n.miniature, travail);
    console.log(`Rendu 16:9 : ${sortie}`);
    await rendre(n, video, audio, PAYSAGE, sortie, travail, null, mini, path.dirname(fichierN));
    if (!drapeau("sans-clips")) {
      for (const [i, c] of n.clips.entries()) {
        const s = `${base}.clip-${i + 1}.mp4`;
        console.log(`Clip vertical ${i + 1} (${c.titre}) : ${s}`);
        await rendre(n, video, audio, VERTICAL, s, travail, { debut: c.debut, duree: Math.min(c.duree, (n.extrait?.duree ?? duree) - c.debut) }, null, path.dirname(fichierN));
      }
    }
    bilan.push(`${etiquette} : rendue → ${path.basename(sortie)}${n.clips.length && !drapeau("sans-clips") ? ` et ${n.clips.length} clip(s)` : ""}. À envoyer sur YouTube (miniature : ${n.miniature ? path.basename(n.miniature) : "aucune"}).`);
  }
  console.log("\n— Où en est chaque vidéo —");
  for (const b of bilan) console.log(`• ${b}`);
  console.log("L'Atelier vidéo de Jobwow montre les mêmes étapes : ouvre-y le dossier D:\\WOW.");
}

main().catch((e) => { console.error(e instanceof Error ? e.message : e); process.exit(1); });
