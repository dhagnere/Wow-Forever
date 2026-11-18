/**
 * Rangement des vidéos du Journal par personnage (demandé par Jobwow le 18/11/2026) : chaque personnage a son dossier
 * dans D:\WOW (« Journal de Jobwow », « Journal de Jobwow TheSham »…) et ses noms de fichiers (« journal-jobwow_… »,
 * « journal-thesham_… », rendu « .jobwow.mp4 », « .thesham.mp4 »). Utilisé par `npm run carnet`.
 *
 * - Chaque enregistrement de Warcraft Recorder est rendu au personnage demandé (--personnage), sinon à celui que la
 *   sonde a vu jouer pendant l'enregistrement, sinon à celui de l'enregistrement le plus proche du même jour.
 * - Une journée déjà préparée garde le personnage de sa narration ; si la narration dit un autre personnage que le
 *   dossier où elle est (changé dans l'Atelier, ou préparée avant le 18/11), la journée est déplacée chez lui.
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, renameSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { PERSONNAGES, personnageDuJeu, personnageVideo, type PersonnageVideo } from "@/content/personnages";
import { personnageJoue, type Evenement, type Narration } from "@/lib/incrustation";

export interface EnregistrementDate { debut: number; duree: number }

/** Personnage de chaque enregistrement (même ordre que la liste donnée). */
export function personnagesDesEnregistrements<T extends EnregistrementDate>(clips: T[], evenements: Evenement[], forcer?: string | null): PersonnageVideo[] {
  if (forcer) return clips.map(() => personnageVideo(forcer));
  const vus = clips.map((c) => personnageDuJeu(personnageJoue(evenements, c.debut, c.debut + c.duree * 1000)));
  const jour = (c: T) => new Date(c.debut).toISOString().slice(0, 10);
  return clips.map((c, i) => {
    if (vus[i]) return vus[i]!;
    // sans repère de sonde : le personnage de l'enregistrement le plus proche du même jour
    let meilleur: { p: PersonnageVideo; d: number } | null = null;
    clips.forEach((x, j) => {
      if (!vus[j] || jour(x) !== jour(c)) return;
      const d = Math.abs(x.debut - c.debut);
      if (!meilleur || d < meilleur.d) meilleur = { p: vus[j]!, d };
    });
    return (meilleur as { p: PersonnageVideo } | null)?.p ?? personnageVideo();
  });
}

/** Nom de journée d'un personnage : « journal-thesham_2026-11-18 » (clé : « 2026-11-18 » ou « 2026-11-18_20h30 »). */
export const nomJournee = (p: PersonnageVideo, cle: string) => `${p.prefixe}_${cle}`;

/** Fichiers d'une journée dans un dossier : la journée elle-même et ses parties (« _p2 »). */
export function fichiersDeJournee(dossier: string, nom: string): string[] {
  if (!existsSync(dossier)) return [];
  const bas = nom.toLowerCase();
  return readdirSync(dossier).filter((f) => {
    const l = f.toLowerCase();
    return l.startsWith(`${bas}.`) || new RegExp(`^${bas.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}_p\\d+[. ]`).test(l);
  });
}

/** Personnage que disent les narrations d'une journée : la plus récente validée, sinon la plus récente ; null sans narration. */
export function personnageDesNarrations(fichiers: string[]): PersonnageVideo | null {
  const lues = fichiers.filter((f) => /\.narration(?: ?\(\d+\))?\.json$/i.test(f) && existsSync(f)).map((f) => {
    try { return { n: JSON.parse(readFileSync(f, "utf8")) as Narration, t: statSync(f).mtimeMs }; } catch { return null; }
  }).filter((x): x is { n: Narration; t: number } => !!x).sort((a, b) => b.t - a.t);
  if (!lues.length) return null;
  const choisie = lues.find((x) => x.n.valide) ?? lues[0];
  return personnageVideo(choisie.n.profil);
}

const remplacerDebut = (texte: string, avant: string, apres: string) =>
  texte.toLowerCase().startsWith(avant.toLowerCase()) ? apres + texte.slice(avant.length) : texte;

/**
 * Déplace une journée d'un personnage chez un autre : fichiers du dossier renommés (préfixe) et rangés dans le dossier
 * du nouveau personnage, copies des Téléchargements renommées sur place (la commande les reprend ensuite comme
 * d'habitude), chemins des narrations et du découpage recalculés, personnage et série mis à jour. Une narration pas
 * encore relue est mise de côté (.narration.avant.json) : elle sera préparée de nouveau avec les répliques du nouveau
 * personnage. Rend la liste des déplacements, pour le journal de la commande.
 */
export function reclasserJournee(o: {
  cle: string; de: PersonnageVideo; vers: PersonnageVideo; dossierDe: string; dossierVers: string; telechargements?: string | null;
}): string[] {
  const avant = nomJournee(o.de, o.cle), apres = nomJournee(o.vers, o.cle);
  const journal: string[] = [];
  mkdirSync(o.dossierVers, { recursive: true });
  const ajuster = (fichier: string) => {
    if (!/\.(narration(?:\.avant)?|parties)(?: ?\(\d+\))?\.json$/i.test(fichier)) return;
    let x: Record<string, unknown>;
    try { x = JSON.parse(readFileSync(fichier, "utf8")) as Record<string, unknown>; } catch { return; }
    // vidéo : un fichier de la journée change de nom ; un enregistrement d'origine (dans D:\WOW) garde le sien
    if (typeof x.video === "string" && !path.isAbsolute(x.video) && !/^[A-Za-z]:[\\/]/.test(x.video)) {
      const nomVideo = path.basename(x.video);
      if (nomVideo.toLowerCase().startsWith(avant.toLowerCase())) x.video = remplacerDebut(nomVideo, avant, apres);
      else x.video = path.relative(o.dossierVers, path.resolve(o.dossierDe, x.video)) || nomVideo;
    }
    if (typeof x.miniature === "string") x.miniature = remplacerDebut(path.basename(x.miniature), avant, apres);
    const partie = x.partie as { journee?: string } | undefined;
    if (partie?.journee) partie.journee = apres;
    if (Array.isArray(x.moments)) {
      const n = x as unknown as Narration;
      if (o.vers.id === "jobwow") delete n.profil; else n.profil = o.vers.id;
      const serie = (t: string) => (t.startsWith(`${o.de.serie} ·`) || t === o.de.serie ? o.vers.serie + t.slice(o.de.serie.length) : t);
      n.titre = serie(n.titre ?? "");
      for (const m of n.moments) if (m.genre === "intro") m.sousTitre = serie(m.sousTitre);
    }
    writeFileSync(fichier, JSON.stringify(x, null, 2), "utf8");
  };
  // 1. le dossier du personnage d'avant
  for (const f of fichiersDeJournee(o.dossierDe, avant)) {
    const de = path.join(o.dossierDe, f), vers = path.join(o.dossierVers, remplacerDebut(f, avant, apres));
    if (existsSync(vers) && path.resolve(vers) !== path.resolve(de)) { journal.push(`déjà présent, laissé : ${vers}`); continue; }
    renameSync(de, vers);
    ajuster(vers);
    journal.push(`${de} → ${vers}`);
  }
  // 2. les copies des Téléchargements (narrations validées, découpage déplacé dans l'Atelier)
  const t = o.telechargements;
  if (t && existsSync(t) && path.resolve(t) !== path.resolve(o.dossierDe)) {
    for (const f of fichiersDeJournee(t, avant)) {
      if (!/\.json$/i.test(f)) continue;
      const de = path.join(t, f), vers = path.join(t, remplacerDebut(f, avant, apres));
      renameSync(de, vers);
      ajuster(vers);
      journal.push(`${de} → ${vers}`);
    }
  }
  // 3. les narrations pas encore relues sont refaites pour le nouveau personnage
  for (const f of fichiersDeJournee(o.dossierVers, apres)) {
    if (!/\.narration\.json$/i.test(f)) continue;
    const plein = path.join(o.dossierVers, f);
    try {
      const n = JSON.parse(readFileSync(plein, "utf8")) as Narration;
      const relue = n.valide || n.relue;
      const telechargee = t ? fichiersDeJournee(t, f.replace(/\.narration\.json$/i, "")).some((x) => /\.narration/i.test(x)) : false;
      if (!relue && !telechargee) {
        renameSync(plein, plein.replace(/\.narration\.json$/i, ".narration.avant.json"));
        journal.push(`pas encore relue, préparée de nouveau pour ${o.vers.nom} : ${f}`);
      }
    } catch { /* illisible : laissée */ }
  }
  return journal;
}

/** Tous les personnages, pour chercher une journée déjà préparée chez l'un d'eux. */
export const tousLesPersonnages = () => Object.values(PERSONNAGES);
