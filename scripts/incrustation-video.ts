/**
 * Jobwow incrusté dans les vidéos du Journal, sur le PC de Jobwow (jamais sur le serveur du site) :
 *
 *   npm run carnet:incrustation -- "<vidéo, dossier de vidéos ou fichier .narration.json>" \
 *     [--miniature <image>] [--sonde <EternalProbe.lua>] [--preparer] [--sans-clips]
 *
 * Une vidéo fournie = une vidéo rendue (la séance suit la durée du fichier). Pour chaque vidéo :
 * 1. la narration (`<vidéo>.narration.json`) est préparée si elle n'existe pas encore : intro, moments forts tirés des
 *    repères de la sonde (niveau, élite, mort, zone, grimoire, entraîneur, trajet, quête rendue), répliques de Jobwow,
 *    sous-titres, trois clips verticaux. Elle se relit et se corrige dans l'atelier vidéo (artefact), puis on relance ;
 * 2. `<vidéo>.jobwow.mp4` : miniature YouTube en image de départ, médaillon de Jobwow en bas à gauche, bulles, sous-titres ;
 * 3. `<vidéo>.clip-1.mp4`… : clips verticaux 1080 × 1920 de 30 secondes (sauf --sans-clips).
 * --preparer s'arrête après la narration. Miniature : --miniature, sinon `<vidéo>.miniature.jpg|png` à côté de la vidéo.
 * Encodage H.264 (preset veryfast, CRF 20) : compter quelques minutes par heure de vidéo.
 */
import { spawn, execFile } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import ffmpeg from "@ffmpeg-installer/ffmpeg";
import sharp from "sharp";
import { COULEUR_GENRE } from "@/content/repliques-jobwow";
import {
  evenementsSonde, grapheRendu, preparerNarration, typographie, verifierNarration,
  type Calque, type Evenement, type Moment, type Narration,
} from "@/lib/incrustation";
import { chapitres, heureLocale, lireSauvegardeSonde, reperesRouteProbe, SONDES, titreVideo, type Repere } from "@/lib/videoCarnet";

const COMPTES_WOW = "C:\\WOW\\world of Warcraft\\_forever_\\WTF\\Account";
const EXTENSIONS = new Set([".mp4", ".mkv", ".mov"]);
const AVATAR = path.join(process.cwd(), "public/images/jobwow-512.png");
const POLICE_BULLE = "Georgia, Palatino Linotype, TeX Gyre Pagella, serif Bold";
const POLICE_ST = "Segoe UI Semibold, Inter SemiBold, DejaVu Sans Bold, sans-serif";

const option = (nom: string) => { const i = process.argv.indexOf(`--${nom}`); return i > 0 ? process.argv[i + 1] : undefined; };
const drapeau = (nom: string) => process.argv.includes(`--${nom}`);
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
  let portrait = sharp(AVATAR).extract({ left: 96, top: 20, width: 320, height: 320 }).resize(diametre, diametre);
  if (etat === "mort") portrait = portrait.grayscale().modulate({ brightness: 0.75 });
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
  morceau: { debut: number; duree: number } | null, miniature: string | null) {
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
  });
  const fichierGraphe = path.join(travail, `graphe-${suf}.txt`);
  writeFileSync(fichierGraphe, graphe, "utf8");
  const source = morceau ? ["-ss", String(morceau.debut), "-t", String(morceau.duree), "-i", video] : ["-i", video];
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

function miniatureVoisine(video: string): string | null {
  const base = sansExt(video);
  for (const ext of [".miniature.jpg", ".miniature.png", ".miniature.webp", ".jpg", ".png", ".webp"]) if (existsSync(base + ext)) return base + ext;
  return null;
}

async function main() {
  const cible = process.argv[2];
  const usage = 'Usage : npm run carnet:incrustation -- "<vidéo, dossier ou .narration.json>" [--miniature <image>] [--sonde <fichier>] [--preparer] [--sans-clips]';
  if (!cible || cible.startsWith("--") || !existsSync(cible)) { console.error(`${cible ? `Introuvable : « ${cible} ».\n` : ""}${usage}`); process.exit(1); }

  // vidéos à traiter : un fichier, un dossier (sans les rendus déjà faits), ou une narration
  const videos: string[] = [];
  if (cible.endsWith(".narration.json")) {
    const n = JSON.parse(readFileSync(cible, "utf8")) as Narration;
    videos.push(path.resolve(path.dirname(cible), n.video));
  } else if (statSync(cible).isDirectory()) {
    for (const nom of readdirSync(cible).sort()) {
      if (EXTENSIONS.has(path.extname(nom).toLowerCase()) && !/\.(jobwow|clip-\d+)\.mp4$/i.test(nom)) videos.push(path.join(cible, nom));
    }
  } else videos.push(cible);
  if (!videos.length) { console.error("Aucune vidéo trouvée."); process.exit(1); }

  let evenements: Evenement[] | null = null;
  let reperes: Repere[] = [];
  for (const video of videos) {
    const fichierN = `${sansExt(video)}.narration.json`;
    const travail = path.join(path.dirname(video), ".incrustation", path.basename(sansExt(video)));
    const { duree, audio } = await infos(video);
    let n: Narration;
    if (existsSync(fichierN)) {
      n = JSON.parse(readFileSync(fichierN, "utf8")) as Narration;
      const erreurs = verifierNarration(n);
      if (erreurs.length) { console.error(`${fichierN} :\n- ${erreurs.join("\n- ")}`); process.exit(1); }
      console.log(`Narration relue : ${fichierN} (${n.moments.length} moments, ${n.clips.length} clips)`);
    } else {
      if (!evenements) {
        evenements = [];
        for (const f of sauvegardesSonde()) {
          const db = lireSauvegardeSonde(readFileSync(f, "utf8"));
          evenements.push(...evenementsSonde(db));
          reperes.push(...reperesRouteProbe(db));
          console.log(`Repères de la sonde : ${f}`);
        }
        evenements.sort((a, b) => a.heure - b.heure);
        reperes = reperes.sort((a, b) => a.heure - b.heure);
        if (!evenements.length) console.log("Aucun repère de sonde : seule l'intro sera commentée (/reload en jeu pour sauvegarder, ou --sonde <fichier>).");
      }
      const debut = debutDe(video, duree);
      const seance = { clips: [{ fichier: video, debut, duree }], debut, fin: debut + duree * 1000, duree };
      n = preparerNarration({
        video: path.basename(video), debut, dureeVideo: duree, evenements,
        miniature: option("miniature") ?? miniatureVoisine(video), titre: titreVideo(seance, chapitres(seance, reperes)),
      });
      if (n.miniature) n.miniature = path.resolve(n.miniature);
      writeFileSync(fichierN, JSON.stringify(n, null, 2), "utf8");
      console.log(`Narration préparée : ${fichierN} (${n.moments.length} moments, ${n.clips.length} clips). À relire dans l'atelier vidéo.`);
      if (!n.miniature) console.log("Pas de miniature trouvée : ajoutez --miniature <image> ou « miniature » dans la narration pour l'image de départ.");
    }
    if (drapeau("preparer")) continue;

    const mini = await miniaturePrete(option("miniature") ?? n.miniature, travail);
    const sortie = `${sansExt(video)}.jobwow.mp4`;
    console.log(`Rendu 16:9 : ${sortie}`);
    await rendre(n, video, audio, PAYSAGE, sortie, travail, null, mini);
    if (!drapeau("sans-clips")) {
      for (const [i, c] of n.clips.entries()) {
        const s = `${sansExt(video)}.clip-${i + 1}.mp4`;
        console.log(`Clip vertical ${i + 1} (${c.titre}) : ${s}`);
        await rendre(n, video, audio, VERTICAL, s, travail, { debut: c.debut, duree: Math.min(c.duree, duree - c.debut) }, null);
      }
    }
  }
  console.log("Terminé. Envoyez la vidéo .jobwow.mp4 dans YouTube Studio, les clips en Shorts.");
}

main().catch((e) => { console.error(e instanceof Error ? e.message : e); process.exit(1); });
