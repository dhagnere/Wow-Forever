import { pool } from "../db/pool";
import { cheminMesurable, classerAppareil, classerSource, empreinteDuJour, estRobot } from "./classement";

/** Données envoyées par la page (composant <Mesure />). Tout est vérifié ici : rien n'est cru sur parole. */
export type Signal =
  | { t: "vue"; id: string; chemin: string; referent?: string; utm?: string; interne?: boolean }
  | { t: "fin"; id: string; duree: number; lecture: number }
  | { t: "cta_vue" | "cta_clic"; nom: string; chemin: string }
  | { t: "sortie"; lien: string; chemin: string };

export interface Contexte { ip: string; ua: string; hoteSite: string }

const ID = /^[a-z0-9]{8,40}$/i;
const NOM_CTA = /^[a-z0-9][a-z0-9-]{0,59}$/;

/** Les données de plus de 13 mois sont effacées (durée recommandée par la CNIL pour la mesure d'audience). */
const CONSERVATION = "13 months";

function sel(): string {
  const s = process.env.STATS_SEL ?? process.env.SESSION_SECRET ?? "";
  if (s.length < 16) throw new Error("STATS_SEL absent ou trop court (16 caractères minimum).");
  return s;
}

function sortieLisible(lien: unknown): string | null {
  if (typeof lien !== "string") return null;
  try {
    const u = new URL(lien);
    if (!/^https?:$/.test(u.protocol)) return null;
    // Hôte et chemin seulement : les paramètres peuvent contenir des données personnelles.
    return `${u.hostname.replace(/^www\./, "")}${u.pathname === "/" ? "" : u.pathname}`.slice(0, 200);
  } catch {
    return null;
  }
}

/** Enregistre un signal. Renvoie false si le signal est ignoré (robot, format inattendu, page non mesurée). */
export async function enregistrerSignal(s: Signal, c: Contexte): Promise<boolean> {
  if (estRobot(c.ua) || !s || typeof s !== "object") return false;
  const db = pool();
  if (s.t === "vue") {
    const chemin = cheminMesurable(s.chemin);
    if (!chemin || typeof s.id !== "string" || !ID.test(s.id)) return false;
    const source = s.interne ? "interne" : classerSource(typeof s.referent === "string" ? s.referent.slice(0, 500) : undefined, typeof s.utm === "string" ? s.utm.slice(0, 40) : undefined, c.hoteSite);
    await db.query(
      "INSERT INTO stats_vues (id, visiteur, chemin, source, appareil) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (id) DO NOTHING",
      [s.id, empreinteDuJour(sel(), c.ip, c.ua), chemin, source, classerAppareil(c.ua)],
    );
    if (Math.random() < 0.002) await purger();
    return true;
  }
  if (s.t === "fin") {
    if (typeof s.id !== "string" || !ID.test(s.id)) return false;
    const duree = Math.max(0, Math.min(3600, Math.round(Number(s.duree) || 0)));
    const lecture = Math.max(0, Math.min(100, Math.round(Number(s.lecture) || 0)));
    // Une page vue ne se termine qu'une fois, et seulement dans l'heure qui suit son ouverture.
    await db.query(
      "UPDATE stats_vues SET duree_s = $2, lecture = $3 WHERE id = $1 AND duree_s IS NULL AND cree_le > now() - interval '1 hour'",
      [s.id, duree, lecture],
    );
    return true;
  }
  if (s.t === "cta_vue" || s.t === "cta_clic") {
    const chemin = cheminMesurable(s.chemin);
    if (!chemin || typeof s.nom !== "string" || !NOM_CTA.test(s.nom)) return false;
    await db.query("INSERT INTO stats_actions (type, nom, chemin) VALUES ($1, $2, $3)", [s.t, s.nom, chemin]);
    return true;
  }
  if (s.t === "sortie") {
    const chemin = cheminMesurable(s.chemin);
    const lien = sortieLisible(s.lien);
    if (!chemin || !lien) return false;
    await db.query("INSERT INTO stats_actions (type, nom, chemin) VALUES ('sortie', $1, $2)", [lien, chemin]);
    return true;
  }
  return false;
}

export async function purger(): Promise<void> {
  await pool().query(`DELETE FROM stats_vues WHERE cree_le < now() - interval '${CONSERVATION}'`);
  await pool().query(`DELETE FROM stats_actions WHERE cree_le < now() - interval '${CONSERVATION}'`);
}
