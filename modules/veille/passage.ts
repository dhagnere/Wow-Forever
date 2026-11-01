import { SOURCES, FENETRE_HEURES, type Source } from "@/config/sources";
import { DOSSIERS, FENETRE_DOSSIERS_HEURES } from "@/config/dossiers";
import { pool } from "./db/pool";
import { lireToutes } from "./collecte/flux";
import { classer } from "./collecte/tri";
import { detecterTheme, selectionVariee } from "./collecte/themes";
import { ErreurConfiguration, rediger } from "./redaction/redacteur";
import * as depot from "./articles/depot";
import { config } from "./config";
import type { Sujet } from "./types";

export type ModePassage = "essai" | "quotidien" | "dossier";

export interface BilanPassage {
  mode: ModePassage;
  /** Dossiers recherchés (mode dossier). */
  dossiers?: string[];
  sources: { id: string; nom: string; elements: number; erreur?: string }[];
  elementsLus: number;
  sujetsRetenus: number;
  dejaTraites: number;
  brouillons: { titre: string; slug: string; score: number }[];
  echecs: { sujet: string; raison: string }[];
}

function resumeSujet(s: Sujet) {
  return {
    cle: s.cle,
    titre: s.titre,
    theme: s.theme,
    pilier: s.pilier,
    score: s.score,
    detail: s.detailScore,
    elements: s.elements.map((e) => ({
      sourceId: e.sourceId, source: e.sourceNom, langue: e.langue, poids: e.poids, video: e.video,
      titre: e.titre, url: e.url, publieLe: e.publieLe, resume: e.resume.slice(0, 800),
    })),
  };
}

/**
 * Passage de veille.
 *  - essai : collecte et classement seulement, sans rédaction (aucun coût d'API).
 *  - quotidien : rédige les meilleurs sujets non encore traités en brouillons.
 * La revue complète est enregistrée dans veille_revues.
 */
export async function passage(
  mode: ModePassage,
  journal: (m: string) => void = console.log,
  options: { sources?: Source[]; fenetreHeures?: number; dossiers?: string[] } = {},
): Promise<BilanPassage> {
  const maintenant = new Date();
  const lus = await lireToutes(options.sources ?? SOURCES);
  const elements = lus.flatMap((r) => r.elements);
  const sujets = classer(elements, maintenant, options.fenetreHeures ?? FENETRE_HEURES);
  const traites = await depot.sujetsDejaTraites(sujets.map((s) => s.cle));

  const bilan: BilanPassage = {
    mode,
    dossiers: options.dossiers,
    sources: lus.map((r) => ({ id: r.source.id, nom: r.source.nom, elements: r.elements.length, erreur: r.erreur })),
    elementsLus: elements.length,
    sujetsRetenus: sujets.length,
    dejaTraites: sujets.filter((s) => traites.has(s.cle)).length,
    brouillons: [],
    echecs: [],
  };
  journal(`${elements.length} éléments lus, ${sujets.length} sujets retenus, ${bilan.dejaTraites} déjà traités.`);

  if (mode === "quotidien") {
    // Sélection variée : plafond par thème, pour alimenter toutes les pages de thème.
    const aRediger = selectionVariee(sujets.filter((s) => !traites.has(s.cle)), config.brouillonsParJour());
    for (const sujet of aRediger) {
      journal(`Rédaction : ${sujet.titre} (score ${sujet.score})`);
      const r = await rediger(sujet);
      if (!r.ok) {
        bilan.echecs.push({ sujet: sujet.titre, raison: r.raison });
        journal(`  échec : ${r.raison}`);
        continue;
      }
      const article = await depot.creerBrouillon(r.brouillon, sujet.cle);
      bilan.brouillons.push({ titre: article.titre, slug: article.slug, score: sujet.score });
    }
  }

  await pool().query("INSERT INTO veille_revues (mode, bilan, sujets) VALUES ($1, $2, $3)", [
    mode,
    JSON.stringify(bilan),
    JSON.stringify(sujets.map((s) => ({ ...resumeSujet(s), dejaTraite: traites.has(s.cle) }))),
  ]);
  return bilan;
}

type SujetRevue = ReturnType<typeof resumeSujet> & { dejaTraite: boolean };

export interface Revue {
  id: number;
  jour: string;
  creeLe: Date;
  mode: ModePassage;
  bilan: BilanPassage;
  sujets: SujetRevue[];
}

async function lireRevue(id?: number): Promise<Revue | null> {
  const { rows } = await pool().query(
    `SELECT id, to_char(jour, 'YYYY-MM-DD') AS jour, cree_le, mode, bilan, sujets FROM veille_revues
     WHERE ($1::int IS NULL OR id = $1) ORDER BY cree_le DESC LIMIT 1`,
    [id ?? null],
  );
  const l = rows[0];
  if (!l) return null;
  // « Déjà traité » est recalculé : un sujet rédigé depuis la revue n'est plus proposé.
  const sujets = l.sujets as SujetRevue[];
  const traites = await depot.sujetsDejaTraites(sujets.map((x) => x.cle));
  return { id: l.id, jour: l.jour, creeLe: l.cree_le, mode: l.mode, bilan: l.bilan, sujets: sujets.map((x) => ({ ...x, dejaTraite: traites.has(x.cle) })) };
}

/** Thème et pilier d'un sujet de revue (recalculés pour les revues antérieures au classement par thème). */
export function themeDe(x: SujetRevue): { theme: Sujet["theme"]; pilier: Sujet["pilier"] } {
  const s = versSujet(x);
  return { theme: s.theme, pilier: s.pilier };
}

export function derniereRevue(): Promise<Revue | null> {
  return lireRevue();
}

/* ---------- Rédaction à la demande, à partir d'une revue ---------- */

export const MAX_PAR_LANCEMENT = 30;

export interface EtatRedaction {
  enCours: boolean;
  total: number;
  faits: number;
  brouillons: { titre: string; id: number }[];
  echecs: { sujet: string; raison: string }[];
  debut: Date | null;
  fin: Date | null;
}

// État en mémoire du processus web : une seule rédaction à la fois.
const etat: EtatRedaction = { enCours: false, total: 0, faits: 0, brouillons: [], echecs: [], debut: null, fin: null };

export function etatRedaction(): EtatRedaction {
  return { ...etat, brouillons: [...etat.brouillons], echecs: [...etat.echecs] };
}

function versSujet(x: SujetRevue): Sujet {
  const elements: Sujet["elements"] = x.elements.map((e) => ({
      sourceId: e.sourceId ?? "revue",
      sourceNom: e.source,
      langue: e.langue,
      poids: e.poids ?? 1,
      video: !!e.video,
      titre: e.titre,
      url: e.url,
      resume: e.resume ?? "",
      publieLe: new Date(e.publieLe),
  }));
  // Les revues enregistrées avant le classement par thème n'ont ni thème ni pilier : on les recalcule.
  const theme = x.theme ? { rubrique: x.theme, pilier: x.pilier ?? null } : detecterTheme({ titre: x.titre, texte: elements.map((e) => `${e.titre} ${e.resume}`).join(" ") });
  return { cle: x.cle, titre: x.titre, theme: theme.rubrique, pilier: theme.pilier, score: x.score, detailScore: x.detail, elements };
}

export type Preparation = { ok: true; sujets: Sujet[] } | { ok: false; erreur: string };

/**
 * Réserve la rédaction des sujets choisis dans une revue (non encore traités, dans l'ordre du classement).
 * Sans `cles`, prend les meilleurs sujets non traités, dans la limite du nombre de brouillons par jour.
 */
export async function preparerRedaction(revueId?: number, cles?: string[]): Promise<Preparation> {
  if (etat.enCours) return { ok: false, erreur: `Une rédaction est déjà en cours (${etat.faits}/${etat.total}).` };
  if (!process.env.ANTHROPIC_API_KEY) return { ok: false, erreur: "ANTHROPIC_API_KEY n'est pas renseignée : la rédaction par IA est impossible." };
  const revue = await lireRevue(revueId);
  if (!revue) return { ok: false, erreur: "Aucune revue enregistrée. Lancer d'abord npm run veille:essai." };

  const libres = revue.sujets.filter((x) => !x.dejaTraite).map((x) => ({ ...x, ...themeDe(x) }));
  const choisis = cles ? libres.filter((x) => cles.includes(x.cle)) : selectionVariee(libres, config.brouillonsParJour());
  if (!choisis.length) return { ok: false, erreur: "Aucun sujet à rédiger : rien de coché, ou sujets déjà traités." };
  if (choisis.length > MAX_PAR_LANCEMENT) return { ok: false, erreur: `${MAX_PAR_LANCEMENT} sujets au plus par lancement.` };

  Object.assign(etat, { enCours: true, total: choisis.length, faits: 0, brouillons: [], echecs: [], debut: new Date(), fin: null });
  return { ok: true, sujets: choisis.map(versSujet) };
}

/** Rédige les sujets réservés par preparerRedaction. Chaque brouillon est enregistré dès qu'il est prêt. */
export async function redigerSujets(sujets: Sujet[], journal: (m: string) => void = console.log): Promise<EtatRedaction> {
  try {
    for (const sujet of sujets) {
      journal(`Rédaction : ${sujet.titre} (score ${sujet.score})`);
      try {
        const r = await rediger(sujet);
        if (r.ok) {
          const a = await depot.creerBrouillon(r.brouillon, sujet.cle);
          etat.brouillons.push({ titre: a.titre, id: a.id });
        } else {
          etat.echecs.push({ sujet: sujet.titre, raison: r.raison });
          journal(`  échec : ${r.raison}`);
        }
      } catch (e) {
        const raison = e instanceof Error ? e.message : String(e);
        etat.echecs.push({ sujet: sujet.titre, raison });
        journal(`  échec : ${raison}`);
        if (e instanceof ErreurConfiguration) {
          etat.faits++;
          journal("Rédaction interrompue : corriger le réglage avant de relancer.");
          break;
        }
      }
      etat.faits++;
    }
  } finally {
    etat.enCours = false;
    etat.fin = new Date();
  }
  return etatRedaction();
}

/* ---------- Dossiers de référence ---------- */

let dossierEnCours: { depuis: Date; dossiers: string[] } | null = null;

export function etatDossier() {
  return dossierEnCours ? { ...dossierEnCours } : null;
}

/**
 * Recherche les dossiers demandés (tous par défaut) sur 60 jours, sans rédaction ni coût d'API.
 * Le résultat est enregistré comme une revue : on y coche les sujets à rédiger.
 */
export async function rechercherDossiers(ids?: string[], journal: (m: string) => void = console.log): Promise<BilanPassage> {
  const choisis = DOSSIERS.filter((d) => !ids?.length || ids.includes(d.id));
  if (!choisis.length) throw new Error(`Dossier inconnu. Dossiers possibles : ${DOSSIERS.map((d) => d.id).join(", ")}.`);
  if (dossierEnCours) throw new Error("Une recherche de dossiers est déjà en cours.");
  dossierEnCours = { depuis: new Date(), dossiers: choisis.map((d) => d.nom) };
  try {
    journal(`Dossiers : ${choisis.map((d) => d.nom).join(", ")}`);
    return await passage("dossier", journal, {
      sources: choisis.flatMap((d) => d.sources),
      fenetreHeures: FENETRE_DOSSIERS_HEURES,
      dossiers: choisis.map((d) => d.nom),
    });
  } finally {
    dossierEnCours = null;
  }
}
