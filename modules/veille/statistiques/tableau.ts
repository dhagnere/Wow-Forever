import { pool } from "../db/pool";
import { NOMS_SOURCES, type Source } from "./classement";

/** Tableau de bord d'audience : chiffres d'une période comparés à la période précédente de même durée. */

export interface Compteurs {
  visiteurs: number;
  visites: number;
  pagesVues: number;
  lectureMoyenneS: number;
  pagesParVisite: number;
  partUnePage: number;
}

export interface LignePage { chemin: string; vues: number; dureeMoyenneS: number; partLueJusquauBout: number | null; partFacebook: number }
export interface LigneCta { nom: string; affichages: number; clics: number; taux: number }
export interface Repartition { cle: string; nom: string; nombre: number; part: number }

export interface Tableau {
  jours: number;
  debut: Date;
  fin: Date;
  actuel: Compteurs;
  precedent: Compteurs;
  parJour: { jour: string; visiteurs: number; visites: number; pagesVues: number }[];
  sources: Repartition[];
  appareils: Repartition[];
  pages: LignePage[];
  ctas: LigneCta[];
  sorties: { lien: string; clics: number }[];
  creneaux: number[][]; // [jour de la semaine 0 = lundi][heure 0-23] : pages vues
  enseignements: string[];
}

/** Visites : suites de pages vues d'un même visiteur, séparées par moins de 30 minutes. */
const VISITES = `
  WITH v AS (
    SELECT visiteur, cree_le, source, chemin, duree_s, lecture,
           CASE WHEN cree_le - lag(cree_le) OVER (PARTITION BY visiteur ORDER BY cree_le) <= interval '30 minutes' THEN 0 ELSE 1 END AS debut_visite
      FROM stats_vues WHERE cree_le >= $1 AND cree_le < $2
  ), n AS (
    SELECT *, sum(debut_visite) OVER (PARTITION BY visiteur ORDER BY cree_le) AS num FROM v
  )
  SELECT visiteur, num, min(cree_le) AS debut, count(*)::int AS pages,
         (array_agg(source ORDER BY cree_le) FILTER (WHERE source <> 'interne'))[1] AS source
    FROM n GROUP BY visiteur, num`;

async function compteurs(debut: Date, fin: Date): Promise<Compteurs> {
  const { rows } = await pool().query<{
    visiteurs: number; visites: number; pages_vues: number; lecture: number | null; une_page: number;
  }>(
    `WITH visites AS (${VISITES})
     SELECT (SELECT count(*)::int FROM (SELECT DISTINCT visiteur, (cree_le AT TIME ZONE 'Europe/Paris')::date FROM stats_vues WHERE cree_le >= $1 AND cree_le < $2) d) AS visiteurs,
            (SELECT count(*)::int FROM visites) AS visites,
            (SELECT count(*)::int FROM stats_vues WHERE cree_le >= $1 AND cree_le < $2) AS pages_vues,
            (SELECT avg(duree_s)::float FROM stats_vues WHERE cree_le >= $1 AND cree_le < $2 AND duree_s > 0) AS lecture,
            (SELECT count(*)::int FROM visites WHERE pages = 1) AS une_page`,
    [debut, fin],
  );
  const r = rows[0];
  return {
    visiteurs: r.visiteurs,
    visites: r.visites,
    pagesVues: r.pages_vues,
    lectureMoyenneS: Math.round(r.lecture ?? 0),
    pagesParVisite: r.visites ? r.pages_vues / r.visites : 0,
    partUnePage: r.visites ? r.une_page / r.visites : 0,
  };
}

function repartir(lignes: { cle: string; nombre: number }[], noms: (cle: string) => string): Repartition[] {
  const total = lignes.reduce((n, l) => n + l.nombre, 0);
  return lignes.map((l) => ({ ...l, nom: noms(l.cle), part: total ? l.nombre / total : 0 })).sort((a, b) => b.nombre - a.nombre);
}

const NOMS_APPAREILS: Record<string, string> = { mobile: "Mobile", tablette: "Tablette", ordinateur: "Ordinateur" };

export async function tableauStatistiques(jours = 30, maintenant = new Date()): Promise<Tableau> {
  const j = [7, 30, 90, 365].includes(jours) ? jours : 30;
  const fin = maintenant;
  const debut = new Date(fin.getTime() - j * 86_400_000);
  const debutPrecedent = new Date(debut.getTime() - j * 86_400_000);
  const db = pool();
  const p = [debut, fin];

  const [actuel, precedent, parJour, sources, appareils, pages, ctas, sorties, creneaux] = await Promise.all([
    compteurs(debut, fin),
    compteurs(debutPrecedent, debut),
    db.query<{ jour: string; visiteurs: number; visites: number; pages_vues: number }>(
      `WITH visites AS (${VISITES}),
            j AS (SELECT to_char(g, 'YYYY-MM-DD') AS jour FROM generate_series(($1 AT TIME ZONE 'Europe/Paris')::date, ($2 AT TIME ZONE 'Europe/Paris')::date, interval '1 day') g),
            v AS (SELECT to_char(cree_le AT TIME ZONE 'Europe/Paris', 'YYYY-MM-DD') AS jour, count(DISTINCT visiteur)::int AS visiteurs, count(*)::int AS pages_vues
                    FROM stats_vues WHERE cree_le >= $1 AND cree_le < $2 GROUP BY 1),
            s AS (SELECT to_char(debut AT TIME ZONE 'Europe/Paris', 'YYYY-MM-DD') AS jour, count(*)::int AS visites FROM visites GROUP BY 1)
       SELECT j.jour, COALESCE(v.visiteurs, 0) AS visiteurs, COALESCE(s.visites, 0) AS visites, COALESCE(v.pages_vues, 0) AS pages_vues
         FROM j LEFT JOIN v USING (jour) LEFT JOIN s USING (jour) ORDER BY j.jour`,
      p,
    ),
    db.query<{ cle: string; nombre: number }>(`WITH visites AS (${VISITES}) SELECT COALESCE(source, 'interne') AS cle, count(*)::int AS nombre FROM visites GROUP BY 1`, p),
    db.query<{ cle: string; nombre: number }>("SELECT appareil AS cle, count(DISTINCT visiteur)::int AS nombre FROM stats_vues WHERE cree_le >= $1 AND cree_le < $2 GROUP BY 1", p),
    db.query<{ chemin: string; vues: number; duree: number | null; lue: number; facebook: number }>(
      `SELECT chemin, count(*)::int AS vues, avg(duree_s) FILTER (WHERE duree_s > 0)::float AS duree,
              (count(*) FILTER (WHERE lecture >= 90))::float / NULLIF(count(*) FILTER (WHERE lecture IS NOT NULL), 0) AS lue,
              (count(*) FILTER (WHERE source = 'facebook'))::float / count(*) AS facebook
         FROM stats_vues WHERE cree_le >= $1 AND cree_le < $2 GROUP BY chemin ORDER BY vues DESC LIMIT 30`,
      p,
    ),
    db.query<{ nom: string; affichages: number; clics: number }>(
      `SELECT nom, count(*) FILTER (WHERE type = 'cta_vue')::int AS affichages, count(*) FILTER (WHERE type = 'cta_clic')::int AS clics
         FROM stats_actions WHERE type IN ('cta_vue', 'cta_clic') AND cree_le >= $1 AND cree_le < $2 GROUP BY nom ORDER BY clics DESC, affichages DESC`,
      p,
    ),
    db.query<{ lien: string; clics: number }>(
      "SELECT nom AS lien, count(*)::int AS clics FROM stats_actions WHERE type = 'sortie' AND cree_le >= $1 AND cree_le < $2 GROUP BY nom ORDER BY clics DESC LIMIT 10",
      p,
    ),
    db.query<{ jour: number; heure: number; n: number }>(
      `SELECT (extract(isodow FROM cree_le AT TIME ZONE 'Europe/Paris')::int - 1) AS jour, extract(hour FROM cree_le AT TIME ZONE 'Europe/Paris')::int AS heure, count(*)::int AS n
         FROM stats_vues WHERE cree_le >= $1 AND cree_le < $2 GROUP BY 1, 2`,
      p,
    ),
  ]);

  const grille = Array.from({ length: 7 }, () => Array<number>(24).fill(0));
  for (const c of creneaux.rows) grille[c.jour][c.heure] = c.n;

  const t: Tableau = {
    jours: j,
    debut,
    fin,
    actuel,
    precedent,
    parJour: parJour.rows.map((r) => ({ jour: r.jour, visiteurs: r.visiteurs, visites: r.visites, pagesVues: r.pages_vues })),
    sources: repartir(sources.rows, (c) => NOMS_SOURCES[c as Source] ?? c),
    appareils: repartir(appareils.rows, (c) => NOMS_APPAREILS[c] ?? c),
    pages: pages.rows.map((r) => ({
      chemin: r.chemin, vues: r.vues, dureeMoyenneS: Math.round(r.duree ?? 0), partLueJusquauBout: r.lue, partFacebook: r.facebook ?? 0,
    })),
    ctas: ctas.rows.map((r) => ({ ...r, taux: r.affichages ? r.clics / r.affichages : 0 })),
    sorties: sorties.rows,
    creneaux: grille,
    enseignements: [],
  };
  t.enseignements = enseignements(t);
  return t;
}

const JOURS = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"];
const pct = (x: number) => `${Math.round(x * 100)} %`;

export function evolution(actuel: number, precedent: number): number | null {
  if (!precedent) return null;
  return (actuel - precedent) / precedent;
}

/** « Ce qu'il faut retenir » : quelques phrases tirées des chiffres, sans interprétation hasardeuse. */
export function enseignements(t: Pick<Tableau, "actuel" | "precedent" | "sources" | "ctas" | "creneaux" | "pages">): string[] {
  const phrases: string[] = [];
  if (!t.actuel.pagesVues) return ["Aucune visite mesurée sur la période. Le module démarre : revenez dans quelques jours."];

  const e = evolution(t.actuel.visiteurs, t.precedent.visiteurs);
  if (e !== null) {
    phrases.push(e >= 0
      ? `L'audience progresse : ${pct(e)} de visiteurs de plus que sur la période précédente.`
      : `L'audience recule de ${pct(-e)} par rapport à la période précédente. Deux baisses de suite : revoir le rythme de publication.`);
  }

  const externes = t.sources.filter((s) => s.cle !== "interne");
  const totalExt = externes.reduce((n, s) => n + s.nombre, 0);
  if (externes[0] && totalExt) {
    phrases.push(`Première source de visites : ${externes[0].nom} (${pct(externes[0].nombre / totalExt)}).`);
    const google = externes.find((s) => s.cle === "google");
    const partGoogle = google ? google.nombre / totalExt : 0;
    if (partGoogle < 0.1) phrases.push(`Google n'apporte que ${pct(partGoogle)} des visites : enrichir les fiches de référence et leurs titres.`);
  }

  let max = 0;
  let j = -1;
  let h = -1;
  t.creneaux.forEach((heures, jour) => heures.forEach((n, heure) => {
    if (n > max) { max = n; j = jour; h = heure; }
  }));
  if (j >= 0) {
    phrases.push(`Créneau le plus fréquenté : le ${JOURS[j]} vers ${h} h. Publier vers ${(h + 23) % 24} h pour être prêt.`);
  }

  const ctasMesures = t.ctas.filter((c) => c.affichages >= 50);
  if (ctasMesures.length) {
    const meilleur = [...ctasMesures].sort((a, b) => b.taux - a.taux)[0];
    phrases.push(`Bouton le plus efficace : « ${meilleur.nom} », cliqué par ${pct(meilleur.taux)} de ceux qui le voient.`);
    const faible = ctasMesures.filter((c) => c.nom.startsWith("lettre") && c.taux < 0.01);
    if (faible.length) phrases.push(`À revoir : ${faible.map((c) => `« ${c.nom} »`).join(", ")} sous 1 % de clics. Changer le libellé ou la place.`);
  }

  const lue = t.pages.filter((p) => p.vues >= 20 && (p.partLueJusquauBout ?? 0) >= 0.4 && p.chemin.startsWith("/articles/"));
  if (lue[0]) phrases.push(`${lue[0].chemin} est lu jusqu'au bout par ${pct(lue[0].partLueJusquauBout ?? 0)} des lecteurs : le sujet mérite une suite ou un guide.`);

  return phrases;
}

/** Export CSV, jour par jour (séparateur point-virgule, lisible par Excel en français). */
export function csvParJour(t: Pick<Tableau, "parJour">): string {
  const lignes = [["jour", "visiteurs", "visites", "pages vues"], ...t.parJour.map((d) => [d.jour, d.visiteurs, d.visites, d.pagesVues])];
  return "﻿" + lignes.map((l) => l.join(";")).join("\r\n") + "\r\n";
}
