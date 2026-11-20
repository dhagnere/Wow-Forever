import { pool } from "../db/pool";

/**
 * Butin relevé en jeu par l'addon TaverneTrace : texte de « /tt butin » (format TTB1) collé dans /admin/butin.
 *
 *   TTB1
 *   v|<version de l'addon>
 *   s|<série>
 *   c|<créature ou g<coffre>>|<carte de l'instance>|<instance>|<nom>|<victoires>
 *   o|<créature>|<objet>|<fois vu>|<qualité>|<nom>
 *   fin|<nombre de créatures>
 *
 * Une série est le relevé cumulé d'un compte de jeu : réimporter la même série remplace ses chiffres (rien n'est compté
 * deux fois) ; les séries s'additionnent. La chance relevée d'un objet est « fois vu / victoires ».
 */

export interface ObjetReleve { id: number; vus: number; qualite: number; nom: string }
export interface CreatureReleve { cle: string; carte: number | null; instance: string; nom: string; victoires: number; objets: ObjetReleve[] }
export interface ReleveButin { version: string; serie: string; creatures: CreatureReleve[] }

const MAX_CREATURES = 5000;
const MAX_OBJETS = 200;

const entier = (v: string | undefined, nom: string, ligne: number): number => {
  if (!v || !/^\d{1,9}$/.test(v)) throw new Error(`Ligne ${ligne} : ${nom} illisible (« ${v ?? ""} »).`);
  return Number(v);
};
const texte = (v: string | undefined, max = 120) => (v ?? "").replace(/[\u0000-\u001f]/g, "").trim().slice(0, max);

/** Lit le texte collé ; lève une erreur claire au premier défaut (texte tronqué, ligne illisible, totaux faux). */
export function lireReleveButin(brut: string): ReleveButin {
  const lignes = brut.replace(/\r/g, "").split("\n").map((l) => l.trim()).filter(Boolean);
  if (lignes[0] !== "TTB1") throw new Error("Ce n'est pas un relevé de butin : le texte doit commencer par TTB1 (commande /tt butin de TaverneTrace).");
  let version = "", serie = "", fin: number | null = null;
  const creatures = new Map<string, CreatureReleve>();
  lignes.slice(1).forEach((l, i) => {
    const n = i + 2;
    const champs = l.split("|");
    switch (champs[0]) {
      case "v": version = texte(champs[1], 20); break;
      case "s": serie = texte(champs[1], 40); break;
      case "c": {
        const cle = champs[1] ?? "";
        if (!/^g?\d{1,9}$/.test(cle)) throw new Error(`Ligne ${n} : créature illisible (« ${cle} »).`);
        if (creatures.size >= MAX_CREATURES) throw new Error(`Plus de ${MAX_CREATURES} créatures : relevé refusé.`);
        creatures.set(cle, {
          cle, carte: champs[2] ? entier(champs[2], "carte", n) : null, instance: texte(champs[3]), nom: texte(champs[4]),
          victoires: entier(champs[5], "victoires", n), objets: [],
        });
        break;
      }
      case "o": {
        const c = creatures.get(champs[1] ?? "");
        if (!c) throw new Error(`Ligne ${n} : objet d'une créature inconnue (« ${champs[1] ?? ""} »).`);
        if (c.objets.length >= MAX_OBJETS) throw new Error(`Ligne ${n} : trop d'objets pour une créature.`);
        const o = { id: entier(champs[2], "objet", n), vus: entier(champs[3], "nombre de fois vu", n), qualite: entier(champs[4], "qualité", n), nom: texte(champs[5]) };
        if (o.vus > c.victoires) throw new Error(`Ligne ${n} : objet vu plus souvent que la créature n'a été vaincue.`);
        c.objets.push(o);
        break;
      }
      case "fin": fin = entier(champs[1], "total", n); break;
      default: throw new Error(`Ligne ${n} : ligne inconnue (« ${l.slice(0, 30)} »).`);
    }
  });
  if (fin === null) throw new Error("Relevé incomplet : la ligne « fin » manque (texte coupé à la copie ?).");
  if (fin !== creatures.size) throw new Error(`Relevé incomplet : ${creatures.size} créatures lues sur ${fin} annoncées.`);
  if (!/^[\w.-]{3,40}$/.test(serie)) throw new Error("Série du relevé absente ou illisible (TaverneTrace 1.2 ou plus récent).");
  return { version, serie, creatures: [...creatures.values()] };
}

/** Enregistre un relevé : remplace la série en une transaction. Renvoie le nombre de créatures et de victoires. */
export async function enregistrerReleveButin(r: ReleveButin): Promise<{ creatures: number; victoires: number }> {
  const client = await pool().connect();
  try {
    await client.query("BEGIN");
    await client.query("DELETE FROM butin_releve_creatures WHERE serie = $1", [r.serie]);
    for (const c of r.creatures) {
      await client.query(
        "INSERT INTO butin_releve_creatures (serie, creature, carte, instance, nom, victoires) VALUES ($1, $2, $3, $4, $5, $6)",
        [r.serie, c.cle, c.carte, c.instance, c.nom, c.victoires],
      );
      for (const o of c.objets) {
        await client.query(
          "INSERT INTO butin_releve_objets (serie, creature, objet, nom, qualite, vus) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT DO NOTHING",
          [r.serie, c.cle, o.id, o.nom, o.qualite, o.vus],
        );
      }
    }
    await client.query("COMMIT");
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
  return { creatures: r.creatures.length, victoires: r.creatures.reduce((s, c) => s + c.victoires, 0) };
}

/** Butin relevé, toutes séries additionnées, pour des créatures données (identifiants ou « g<coffre> »). */
export async function butinReleve(cles: string[]): Promise<Map<string, CreatureReleve>> {
  const liste = [...new Set(cles)].filter((c) => /^g?\d{1,9}$/.test(c)).slice(0, 2000);
  if (!liste.length) return new Map();
  return lire("WHERE c.creature = ANY($1::text[])", [liste]);
}

/** Butin relevé dans une instance (identifiant de carte ou nom), pour les donjons sans liste de boss. */
export async function butinReleveInstance(carte: number | null, nom: string): Promise<CreatureReleve[]> {
  return [...(await lire("WHERE c.carte = $1 OR lower(c.instance) = lower($2)", [carte, nom])).values()];
}

async function lire(condition: string, valeurs: unknown[]): Promise<Map<string, CreatureReleve>> {
  const { rows } = await pool().query<{ creature: string; carte: number | null; instance: string; nom: string; victoires: number; objets: ObjetReleve[] | null }>(
    `WITH c AS (
       SELECT creature, max(carte) AS carte, max(instance) AS instance, max(nom) AS nom, sum(victoires)::int AS victoires
         FROM butin_releve_creatures c ${condition} GROUP BY creature
     )
     SELECT c.*, (
       SELECT json_agg(json_build_object('id', o.objet, 'vus', o.vus, 'qualite', o.qualite, 'nom', o.nom) ORDER BY o.vus DESC, o.objet)
         FROM (SELECT objet, sum(vus)::int AS vus, max(qualite) AS qualite, max(nom) AS nom FROM butin_releve_objets WHERE creature = c.creature GROUP BY objet) o
     ) AS objets
     FROM c`,
    valeurs,
  );
  return new Map(rows.map((r) => [r.creature, { cle: r.creature, carte: r.carte, instance: r.instance, nom: r.nom, victoires: r.victoires, objets: r.objets ?? [] }]));
}

export interface SerieButin { serie: string; majLe: Date; creatures: number; victoires: number; objets: number }

/** Séries importées, la plus récente d'abord (page /admin/butin). */
export async function seriesButin(): Promise<SerieButin[]> {
  const { rows } = await pool().query<{ serie: string; maj_le: Date; creatures: number; victoires: number; objets: number }>(
    `SELECT c.serie, max(c.maj_le) AS maj_le, count(*)::int AS creatures, sum(c.victoires)::int AS victoires,
            (SELECT count(*)::int FROM butin_releve_objets o WHERE o.serie = c.serie) AS objets
       FROM butin_releve_creatures c GROUP BY c.serie ORDER BY max(c.maj_le) DESC`,
  );
  return rows.map((r) => ({ serie: r.serie, majLe: r.maj_le, creatures: r.creatures, victoires: r.victoires, objets: r.objets }));
}

export async function supprimerSerieButin(serie: string): Promise<void> {
  await pool().query("DELETE FROM butin_releve_creatures WHERE serie = $1", [serie]);
}
