import { SOURCES, FENETRE_HEURES } from "@/config/sources";
import { pool } from "./db/pool";
import { lireToutes } from "./collecte/flux";
import { classer } from "./collecte/tri";
import { rediger } from "./redaction/redacteur";
import * as depot from "./articles/depot";
import { config } from "./config";
import type { Sujet } from "./types";

export interface BilanPassage {
  mode: "essai" | "quotidien";
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
    score: s.score,
    detail: s.detailScore,
    elements: s.elements.map((e) => ({ source: e.sourceNom, langue: e.langue, titre: e.titre, url: e.url, publieLe: e.publieLe })),
  };
}

/**
 * Passage de veille.
 *  - essai : collecte et classement seulement, sans rédaction (aucun coût d'API).
 *  - quotidien : rédige les meilleurs sujets non encore traités en brouillons.
 * La revue complète est enregistrée dans veille_revues.
 */
export async function passage(mode: "essai" | "quotidien", journal: (m: string) => void = console.log): Promise<BilanPassage> {
  const maintenant = new Date();
  const lus = await lireToutes(SOURCES);
  const elements = lus.flatMap((r) => r.elements);
  const sujets = classer(elements, maintenant, FENETRE_HEURES);
  const traites = await depot.sujetsDejaTraites(sujets.map((s) => s.cle));

  const bilan: BilanPassage = {
    mode,
    sources: lus.map((r) => ({ id: r.source.id, nom: r.source.nom, elements: r.elements.length, erreur: r.erreur })),
    elementsLus: elements.length,
    sujetsRetenus: sujets.length,
    dejaTraites: sujets.filter((s) => traites.has(s.cle)).length,
    brouillons: [],
    echecs: [],
  };
  journal(`${elements.length} éléments lus, ${sujets.length} sujets retenus, ${bilan.dejaTraites} déjà traités.`);

  if (mode === "quotidien") {
    const aRediger = sujets.filter((s) => !traites.has(s.cle)).slice(0, config.brouillonsParJour());
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

export interface Revue {
  id: number;
  jour: string;
  creeLe: Date;
  mode: "essai" | "quotidien";
  bilan: BilanPassage;
  sujets: (ReturnType<typeof resumeSujet> & { dejaTraite: boolean })[];
}

export async function derniereRevue(): Promise<Revue | null> {
  const { rows } = await pool().query(
    "SELECT id, to_char(jour, 'YYYY-MM-DD') AS jour, cree_le, mode, bilan, sujets FROM veille_revues ORDER BY cree_le DESC LIMIT 1",
  );
  const l = rows[0];
  return l ? { id: l.id, jour: l.jour, creeLe: l.cree_le, mode: l.mode, bilan: l.bilan, sujets: l.sujets } : null;
}
