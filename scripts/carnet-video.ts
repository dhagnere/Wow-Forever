/**
 * Journal de Jobwow en vidéo, sur le PC de Jobwow (jamais sur le serveur du site) :
 *
 *   npm run carnet:video -- "<dossier des vidéos de Warcraft Recorder>" [--sortie <dossier>] [--ecart 30] [--routeprobe <RouteProbe.lua>]
 *
 * 1. range les vidéos dans l'ordre chronologique (date et heure du nom de fichier, sinon date du fichier) ;
 * 2. les regroupe par séance de jeu (plus de 30 minutes entre deux fichiers : nouvelle séance) ;
 * 3. assemble chaque séance en une vidéo, sans réencodage (ffmpeg, copie des flux) ;
 * 4. écrit à côté le titre et la description à coller dans YouTube Studio, avec les chapitres calculés à partir des
 *    repères de RouteProbe (zones, niveaux, /rp mark), datés par l'heure du PC.
 *
 * Le logo vient du filigrane de la chaîne (YouTube Studio > Personnalisation > Image de marque) : aucun réencodage.
 * L'envoi sur YouTube reste manuel : faire glisser la vidéo dans YouTube Studio et coller le texte.
 */
import { execFile } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import ffmpeg from "@ffmpeg-installer/ffmpeg";
import { chapitres, descriptionVideo, heureLocale, horodatage, lireTableLua, reperesRouteProbe, seances, titreVideo, type Clip, type Repere } from "@/lib/videoCarnet";

const SITE = (process.env.SITE_URL ?? "https://www.taverne-eternelle.fr").replace(/\/+$/, "");
const COMPTES_WOW = "C:\\WOW\\world of Warcraft\\_forever_\\WTF\\Account";
const EXTENSIONS = new Set([".mp4", ".mkv", ".mov"]);

function option(nom: string): string | undefined {
  const i = process.argv.indexOf(`--${nom}`);
  return i > 0 ? process.argv[i + 1] : undefined;
}

function lancer(args: string[]): Promise<string> {
  return new Promise((resoudre, rejeter) => {
    execFile(ffmpeg.path, args, { maxBuffer: 16 * 1024 * 1024 }, (e, _out, err) => {
      // « ffmpeg -i » seul se termine en erreur (pas de sortie) : on garde son journal pour la durée
      if (e && !args.includes("-f")) return resoudre(String(err));
      if (e) return rejeter(new Error(String(err).slice(-800)));
      resoudre(String(err));
    });
  });
}

/** Durée d'une vidéo en secondes, lue dans le journal de ffmpeg (« Duration: 00:12:34.56 »). */
async function duree(fichier: string): Promise<number> {
  const journal = await lancer(["-hide_banner", "-i", fichier]);
  const m = /Duration:\s*(\d+):(\d+):(\d+(?:\.\d+)?)/.exec(journal);
  if (!m) throw new Error(`Durée illisible : ${fichier}`);
  return +m[1] * 3600 + +m[2] * 60 + +m[3];
}

/** Heure locale du fichier : celle du nom (Warcraft Recorder), sinon fin d'écriture moins la durée. */
function debutDe(fichier: string, secondes: number): number {
  const nom = heureLocale(path.basename(fichier));
  if (nom !== null) return nom;
  const fin = statSync(fichier).mtime;
  const local = Date.UTC(fin.getFullYear(), fin.getMonth(), fin.getDate(), fin.getHours(), fin.getMinutes(), fin.getSeconds());
  return local - Math.round(secondes * 1000);
}

/** Sauvegardes de RouteProbe trouvées dans l'installation de WoW (un fichier par compte), ou celle donnée en option. */
function sauvegardesRouteProbe(): string[] {
  const donnee = option("routeprobe");
  if (donnee) return [donnee];
  if (!existsSync(COMPTES_WOW)) return [];
  return readdirSync(COMPTES_WOW)
    .map((compte) => path.join(COMPTES_WOW, compte, "SavedVariables", "RouteProbe.lua"))
    .filter((f) => existsSync(f));
}

function nomSeance(debut: number, n: number): string {
  const d = new Date(debut).toISOString();
  return `journal-jobwow_${d.slice(0, 10)}_${d.slice(11, 16).replace(":", "h")}${n > 1 ? `_${n}` : ""}`;
}

async function main() {
  const dossier = process.argv[2];
  if (!dossier || dossier.startsWith("--") || !existsSync(dossier)) {
    console.error('Usage : npm run carnet:video -- "<dossier des vidéos de Warcraft Recorder>" [--sortie <dossier>] [--ecart 30]');
    process.exit(1);
  }
  const sortie = option("sortie") ?? path.join(dossier, "Journal de Jobwow");
  const ecart = Number(option("ecart") ?? 30);
  mkdirSync(sortie, { recursive: true });

  // 1. vidéos de Warcraft Recorder (sous-dossiers compris), dans l'ordre chronologique
  const fichiers: string[] = [];
  const parcourir = (d: string) => {
    for (const nom of readdirSync(d)) {
      const f = path.join(d, nom);
      if (f === sortie) continue;
      if (statSync(f).isDirectory()) parcourir(f);
      else if (EXTENSIONS.has(path.extname(nom).toLowerCase())) fichiers.push(f);
    }
  };
  parcourir(dossier);
  if (!fichiers.length) { console.error(`Aucune vidéo dans ${dossier}.`); process.exit(1); }
  const clips: Clip[] = [];
  for (const f of fichiers) {
    const d = await duree(f);
    clips.push({ fichier: f, debut: debutDe(f, d), duree: d });
  }

  // 2. repères de RouteProbe
  const reperes: Repere[] = [];
  for (const f of sauvegardesRouteProbe()) {
    reperes.push(...reperesRouteProbe(lireTableLua(readFileSync(f, "utf8"))));
    console.log(`Repères RouteProbe : ${f}`);
  }
  reperes.sort((a, b) => a.heure - b.heure);
  if (!reperes.length) console.log("Aucun repère RouteProbe trouvé : les vidéos n'auront qu'un chapitre de départ (pensez à /reload en jeu pour sauvegarder).");

  // 3 et 4. une vidéo et un texte par séance
  const parJour = new Map<string, number>();
  for (const s of seances(clips, ecart)) {
    const jour = new Date(s.debut).toISOString().slice(0, 10);
    parJour.set(jour, (parJour.get(jour) ?? 0) + 1);
    const nom = nomSeance(s.debut, parJour.get(jour)!);
    const video = path.join(sortie, `${nom}${path.extname(s.clips[0].fichier).toLowerCase()}`);
    if (existsSync(video)) {
      console.log(`Déjà assemblée : ${video}`);
    } else {
      const liste = path.join(sortie, `${nom}.liste.txt`);
      writeFileSync(liste, s.clips.map((c) => `file '${c.fichier.replace(/\\/g, "/").replace(/'/g, "'\\''")}'`).join("\n"), "utf8");
      console.log(`Assemblage de ${s.clips.length} fichier(s), ${horodatage(s.duree)} : ${video}`);
      await lancer(["-hide_banner", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", liste, "-c", "copy", "-movflags", "+faststart", video]);
    }
    const c = chapitres(s, reperes);
    const texte = [
      `TITRE (${titreVideo(s, c).length} caractères sur 100) :`,
      titreVideo(s, c),
      "",
      "DESCRIPTION :",
      descriptionVideo(s, c, SITE),
      "",
      `— ${c.valides ? `${c.liste.length} chapitres` : "pas assez de repères pour des chapitres (3 au moins)"}` +
        `${c.personnage ? ` · personnage : ${c.personnage}` : ""} · fichiers : ${s.clips.map((x) => path.basename(x.fichier)).join(", ")}`,
    ].join("\n");
    writeFileSync(path.join(sortie, `${nom}.youtube.txt`), texte, "utf8");
    console.log(`Texte YouTube : ${path.join(sortie, `${nom}.youtube.txt`)}`);
  }
  console.log(`Terminé. Faites glisser chaque vidéo dans YouTube Studio et collez le titre et la description de son fichier .youtube.txt.`);
}

main().catch((e) => { console.error(e instanceof Error ? e.message : e); process.exit(1); });
