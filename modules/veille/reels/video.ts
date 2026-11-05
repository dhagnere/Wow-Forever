import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import ffmpeg from "@ffmpeg-installer/ffmpeg";

/** Durée du Reel, en secondes (Facebook accepte de 3 à 90 s). */
export const DUREE_REEL_S = 10;
const IMAGES_PAR_S = 30;

export class ErreurVideo extends Error {}

/**
 * Fils de calcul de l'encodeur. Laissé libre, x264 en ouvre une fois et demie le nombre de processeurs que voit
 * le conteneur, ceux de toute la machine chez l'hébergeur : plus d'1 Go de mémoire avec 48 fils, et ffmpeg est
 * tué par le système. Avec 2 fils et une file d'attente courte, il reste vers 230 Mo, en quelques secondes.
 */
const FILS = "2";

/** Paramètres ffmpeg : léger zoom avant sur l'image fixe, piste audio silencieuse, H.264 + AAC, 1080 × 1920. */
export function argumentsFfmpeg(image: string, sortie: string, duree = DUREE_REEL_S): string[] {
  const images = duree * IMAGES_PAR_S;
  return [
    "-hide_banner", "-loglevel", "error", "-y",
    "-filter_threads", "1", "-filter_complex_threads", "1",
    "-loop", "1", "-i", image,
    "-f", "lavfi", "-i", "anullsrc=r=44100:cl=stereo",
    "-filter_complex",
    `[0:v]scale=1188:2112,zoompan=z='min(zoom+0.0003,1.06)':d=${images}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1080x1920:fps=${IMAGES_PAR_S},format=yuv420p[v]`,
    "-map", "[v]", "-map", "1:a",
    "-t", String(duree),
    "-c:v", "libx264", "-preset", "veryfast", "-crf", "23", "-profile:v", "high", "-r", String(IMAGES_PAR_S),
    "-threads", FILS, "-x264-params", "rc-lookahead=10:sync-lookahead=0:sliced-threads=1",
    "-c:a", "aac", "-b:a", "64k",
    "-shortest", "-movflags", "+faststart",
    sortie,
  ];
}

/** Motif lisible d'un échec de ffmpeg (sans la ligne de commande, trop longue pour être utile). */
export function motifEchec(e: { killed?: boolean; signal?: NodeJS.Signals | null; code?: number | string | null; message: string }, sortieErreur: string): string {
  if (e.signal === "SIGKILL") return "ffmpeg arrêté par le système, sans doute faute de mémoire dans le conteneur.";
  if (e.killed) return "ffmpeg n'a pas fini dans le délai de 120 secondes.";
  const detail = sortieErreur.trim() || e.message.split("\n")[0];
  return `ffmpeg : ${detail.slice(0, 500)}${e.signal ? ` (signal ${e.signal})` : e.code != null ? ` (code ${e.code})` : ""}`;
}

/** Fabrique la vidéo MP4 du Reel à partir de son image verticale (PNG ou JPEG). */
export async function videoDepuisImage(image: Buffer, duree = DUREE_REEL_S): Promise<Buffer> {
  const dossier = await mkdtemp(path.join(tmpdir(), "reel-"));
  try {
    const entree = path.join(dossier, "image.png");
    const sortie = path.join(dossier, "reel.mp4");
    await writeFile(entree, image);
    await new Promise<void>((ok, ko) => {
      execFile(ffmpeg.path, argumentsFfmpeg(entree, sortie, duree), { timeout: 120_000 }, (e, _out, err) =>
        e ? ko(new ErreurVideo(motifEchec(e, String(err ?? "")))) : ok(),
      );
    });
    return await readFile(sortie);
  } finally {
    await rm(dossier, { recursive: true, force: true });
  }
}

/** Récupère l'image verticale du Reel auprès du site (route /articles/<slug>/reel/), puis fabrique la vidéo. */
export async function videoReel(urlImage: string, cookie?: string): Promise<Buffer> {
  const r = await fetch(urlImage, { headers: cookie ? { cookie } : {}, signal: AbortSignal.timeout(30_000) });
  if (!r.ok || !(r.headers.get("content-type") ?? "").startsWith("image/")) {
    throw new ErreurVideo(`Image du Reel indisponible (HTTP ${r.status}).`);
  }
  return videoDepuisImage(Buffer.from(await r.arrayBuffer()));
}
