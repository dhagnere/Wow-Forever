/**
 * Lecture des images d'un enregistrement (demandée par Jobwow le 19/11/2026) : ffmpeg ne décode que les images clés
 * (une par seconde chez Warcraft Recorder), découpe les zones de config/analyse-video.ts, et la reconnaissance de texte
 * (tesseract.js, données françaises et anglaises livrées par npm, rien n'est envoyé sur Internet) lit le lieu, le
 * niveau et le nom ; la couleur de l'image et la barre de vie de la cible se mesurent sans lecture. Un texte n'est relu
 * que si sa zone a changé. Le résultat est gardé dans `.incrustation/analyse/` : un enregistrement n'est lu qu'une fois.
 */
import { execFile } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import ffmpeg from "@ffmpeg-installer/ffmpeg";
import sharp from "sharp";
import { ANALYSE_VIDEO, zoneALEchelle, type Zone } from "@/config/analyse-video";
import { nettoyerLieu, nettoyerNom, VERSION_ANALYSE, type Analyse, type Echantillon } from "@/lib/analyseVideo";
import { derniereVersion, tableCsv } from "@/modules/veille/objets/wago";
import { lireCsv } from "@/modules/veille/scripts/_bases-libres";

type Lecteur = { recognize: (img: Buffer) => Promise<{ data: { text: string; confidence: number } }>; setParameters: (p: Record<string, string>) => Promise<unknown>; terminate: () => Promise<unknown> };
let lecteurs: { texte: Lecteur; chiffres: Lecteur } | null = null;

async function lecteursOcr() {
  if (lecteurs) return lecteurs;
  const { createWorker, PSM } = await import("tesseract.js");
  const req = createRequire(path.join(process.cwd(), "package.json"));
  const dossierLangue = (l: string) => path.join(path.dirname(req.resolve(`@tesseract.js-data/${l}/package.json`)), "4.0.0_best_int");
  const texte = (await createWorker("fra", 1, { langPath: dossierLangue("fra"), cacheMethod: "none", gzip: true })) as unknown as Lecteur;
  await texte.setParameters({ tessedit_pageseg_mode: String(PSM.SINGLE_LINE), user_defined_dpi: "300" });
  const chiffres = (await createWorker("eng", 1, { langPath: dossierLangue("eng"), cacheMethod: "none", gzip: true })) as unknown as Lecteur;
  await chiffres.setParameters({ tessedit_pageseg_mode: String(PSM.SINGLE_LINE), tessedit_char_whitelist: "0123456789", user_defined_dpi: "300" });
  lecteurs = { texte, chiffres };
  return lecteurs;
}
export async function fermerLecteurs() {
  if (!lecteurs) return;
  await lecteurs.texte.terminate(); await lecteurs.chiffres.terminate();
  lecteurs = null;
}

/** Texte doré (lieu, nom) : rouge et vert forts, bleu faible ; agrandi avant le seuil, texte noir sur blanc. */
async function imageOr(rgb: Buffer, z: Zone, echelle = 4): Promise<Buffer> {
  const { data, info } = await sharp(rgb, { raw: { width: z.w, height: z.h, channels: 3 } })
    .resize({ width: z.w * echelle, kernel: "lanczos3" }).raw().toBuffer({ resolveWithObject: true });
  const out = Buffer.alloc(info.width * info.height);
  for (let p = 0, q = 0; q < out.length; p += 3, q++) {
    const r = data[p], g = data[p + 1], b = data[p + 2];
    out[q] = r > 95 && g > 70 && r - b > 45 && g - b > 25 ? 0 : 255;
  }
  return sharp(out, { raw: { width: info.width, height: info.height, channels: 1 } }).median(3)
    .extend({ top: 20, bottom: 20, left: 20, right: 20, background: "#ffffff" }).png().toBuffer();
}

/** Chiffres clairs du médaillon de niveau : le disque seul (l'anneau est écarté), agrandi, noir sur blanc. */
async function imageNiveau(rgb: Buffer, z: Zone): Promise<Buffer> {
  const E = Math.max(4, Math.round(216 / z.w));
  const { data, info } = await sharp(rgb, { raw: { width: z.w, height: z.h, channels: 3 } }).greyscale()
    .resize({ width: z.w * E, kernel: "lanczos3" }).raw().toBuffer({ resolveWithObject: true });
  const out = Buffer.alloc(info.width * info.height, 255), cx = info.width / 2, cy = info.height / 2, R = (12.5 / 36) * info.width;
  for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) {
    const k = y * info.width + x;
    if ((x - cx) ** 2 + (y - cy) ** 2 < R * R && data[k] > 135) out[k] = 0;
  }
  return sharp(out, { raw: { width: info.width, height: info.height, channels: 1 } }).median(5)
    .extend({ top: 40, bottom: 40, left: 40, right: 40, background: "#ffffff" }).png().toBuffer();
}

/** Écart moyen entre deux zones (0 à 255) : on ne relit un texte que si sa zone a changé. */
function ecart(a: Buffer | null, b: Buffer): number {
  if (!a || a.length !== b.length) return 255;
  let s = 0;
  for (let i = 0; i < a.length; i += 3) s += Math.abs(a[i] - b[i]) + Math.abs(a[i + 1] - b[i + 1]) + Math.abs(a[i + 2] - b[i + 2]);
  return s / (a.length);
}

/** Saturation moyenne des pixels non noirs (null pour une image presque noire : chargement). */
function saturation(rgb: Buffer): number | null {
  let s = 0, n = 0, total = 0;
  for (let i = 0; i < rgb.length; i += 3, total++) {
    const mx = Math.max(rgb[i], rgb[i + 1], rgb[i + 2]), mn = Math.min(rgb[i], rgb[i + 1], rgb[i + 2]);
    if (mx < 25) continue;
    s += (mx - mn) / mx; n++;
  }
  return n < total * 0.2 ? null : Math.round((s / n) * 1000) / 1000;
}

/** Barre de vie verte de la cible présente. */
function cibleVisible(rgb: Buffer): boolean {
  let vert = 0, n = 0;
  for (let i = 0; i < rgb.length; i += 3, n++) if (rgb[i + 1] > 110 && rgb[i + 1] > rgb[i] * 1.5 && rgb[i + 1] > rgb[i + 2] * 1.5) vert++;
  return vert > n * 0.3;
}

function lancer(args: string[]): Promise<string> {
  return new Promise((ok, ko) => execFile(ffmpeg.path, args, { maxBuffer: 256 * 1024 * 1024 }, (e, _o, err) => (e ? ko(new Error(String(err).slice(-800))) : ok(String(err)))));
}

/**
 * Analyse d'un enregistrement, gardée dans `cache` (dossier) : relue telle quelle si le fichier n'a pas changé.
 * `largeur`/`hauteur` : taille de l'image ; `journal` : avancement affiché.
 */
export async function analyserEnregistrement(fichier: string, cache: string, o: { largeur: number; hauteur: number; duree: number }, journal = console.log): Promise<Analyse> {
  mkdirSync(cache, { recursive: true });
  const taille = statSync(fichier).size;
  const fCache = path.join(cache, `${path.basename(fichier)}.analyse.json`);
  if (existsSync(fCache)) {
    try {
      const a = JSON.parse(readFileSync(fCache, "utf8")) as Analyse;
      if (a.version === VERSION_ANALYSE && a.taille === taille) return a;
    } catch { /* refaite */ }
  }
  const t0 = Date.now();
  journal(`Analyse de l'image : ${path.basename(fichier)} (${Math.round(o.duree / 60)} min)…`);
  const Z = Object.fromEntries(Object.entries(ANALYSE_VIDEO.zones).map(([k, z]) => [k, zoneALEchelle(z, o.largeur, o.hauteur)])) as Record<keyof typeof ANALYSE_VIDEO.zones, Zone>;
  const V = ANALYSE_VIDEO.vue, VZ = zoneALEchelle(V, o.largeur, o.hauteur);
  const tmp = path.join(cache, `${path.basename(fichier)}.tmp`);
  mkdirSync(tmp, { recursive: true });
  const sorties = { lieu: Z.lieu, niveau: Z.niveau, nom: Z.nom, cible: Z.cible, vue: { x: 0, y: 0, w: V.sortieW, h: V.sortieH } };
  const noms = Object.keys(sorties) as (keyof typeof sorties)[];
  const graphe = [`[0:v]showinfo,split=${noms.length}${noms.map((n) => `[s_${n}]`).join("")}`,
    ...noms.map((n) => n === "vue" ? `[s_vue]crop=${VZ.w}:${VZ.h}:${VZ.x}:${VZ.y},scale=${V.sortieW}:${V.sortieH}[o_vue]` : `[s_${n}]crop=${sorties[n].w}:${sorties[n].h}:${sorties[n].x}:${sorties[n].y}[o_${n}]`)].join(";");
  const log = await lancer(["-hide_banner", "-skip_frame", "nokey", "-i", fichier, "-filter_complex", graphe,
    ...noms.flatMap((n) => ["-map", `[o_${n}]`, "-f", "rawvideo", "-pix_fmt", "rgb24", "-vsync", "0", "-y", path.join(tmp, `${n}.raw`)])]);
  const temps = [...log.matchAll(/pts_time:\s*([\d.]+)/g)].map((m) => Number(m[1]));
  const brut = Object.fromEntries(noms.map((n) => [n, readFileSync(path.join(tmp, `${n}.raw`))])) as Record<keyof typeof sorties, Buffer>;
  const tailleDe = (n: keyof typeof sorties) => sorties[n].w * sorties[n].h * 3;
  const nb = Math.min(temps.length, ...noms.map((n) => Math.floor(brut[n].length / tailleDe(n))));
  const { texte, chiffres } = await lecteursOcr();
  const der: Record<string, { img: Buffer | null; val: string | number | null }> = { lieu: { img: null, val: null }, niveau: { img: null, val: null }, nom: { img: null, val: null } };
  const echantillons: Echantillon[] = [];
  let lectures = 0;
  for (let i = 0; i < nb; i++) {
    const morceau = (n: keyof typeof sorties) => brut[n].subarray(i * tailleDe(n), (i + 1) * tailleDe(n));
    const lire = async (n: "lieu" | "niveau" | "nom") => {
      const img = morceau(n);
      if (ecart(der[n].img, img) < 6) return der[n].val;
      lectures++;
      der[n].img = Buffer.from(img);
      if (n === "niveau") {
        const r = await chiffres.recognize(await imageNiveau(img, Z.niveau));
        const v = Number(r.data.text.trim());
        der[n].val = r.data.confidence >= 60 && Number.isInteger(v) && v >= 1 && v <= 60 ? v : null;
      } else {
        const r = await texte.recognize(await imageOr(img, Z[n]));
        der[n].val = n === "lieu" ? nettoyerLieu(r.data.text) : nettoyerNom(r.data.text);
      }
      return der[n].val;
    };
    echantillons.push({
      t: Math.round(temps[i] * 10) / 10,
      lieu: (await lire("lieu")) as string | null,
      niveau: (await lire("niveau")) as number | null,
      nom: i % 30 === 0 || der.nom.val === null ? (await lire("nom")) as string | null : (der.nom.val as string | null),
      saturation: saturation(morceau("vue")),
      cible: cibleVisible(morceau("cible")),
    });
  }
  rmSync(tmp, { recursive: true, force: true });
  const a: Analyse = { version: VERSION_ANALYSE, fichier: path.basename(fichier), taille, duree: o.duree, echantillons };
  writeFileSync(fCache, JSON.stringify(a), "utf8");
  journal(`  ${nb} images, ${lectures} lectures de texte, ${Math.round((Date.now() - t0) / 1000)} s.`);
  return a;
}

/**
 * Noms des lieux du jeu en français (table AreaTable de Forever, lue sur wago.tools par le PC de Jobwow), pour ramener
 * une lecture abîmée au nom exact (lib/analyseVideo.ts, lexiqueDepuisNoms). Gardés un mois dans `fichier` ; sans
 * Internet, la liste gardée sert encore, sinon une liste vide (la soirée sert alors de lexique). Noms © Blizzard Entertainment.
 */
export async function lieuxDuJeu(fichier: string, journal = console.log): Promise<string[]> {
  let garde: { t: number; noms: string[] } | null = null;
  try { garde = JSON.parse(readFileSync(fichier, "utf8")); } catch { /* pas encore lus */ }
  if (garde && Date.now() - garde.t < 30 * 86400000 && garde.noms?.length) return garde.noms;
  try {
    const aires = lireCsv(await tableCsv("AreaTable", await derniereVersion()));
    const zephras = aires.find((a) => a.ID === "16593")?.ContinentID;
    const noms = [...new Set(aires
      .filter((a) => ["0", "1", zephras].includes(a.ContinentID) || a.ParentAreaID === "16593")
      .map((a) => (a.AreaName_lang ?? "").trim())
      .filter((n) => n.length >= 3 && !/test|unused|\bdnt\b|\bzz|\[|copy|placeholder/i.test(n)))];
    if (noms.length < 200) throw new Error(`${noms.length} noms seulement`);
    mkdirSync(path.dirname(fichier), { recursive: true });
    writeFileSync(fichier, JSON.stringify({ t: Date.now(), noms }), "utf8");
    journal(`Noms des lieux du jeu : ${noms.length} (wago.tools), gardés un mois.`);
    return noms;
  } catch (e) {
    journal(`Noms des lieux du jeu indisponibles (${e instanceof Error ? e.message : e}) : ${garde?.noms?.length ? "liste gardée utilisée" : "lieux tirés des lectures de la soirée"}.`);
    return garde?.noms ?? [];
  }
}
