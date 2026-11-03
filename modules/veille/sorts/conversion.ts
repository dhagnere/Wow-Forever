import { parse } from "csv-parse/sync";
import { decrire, dureeFr, lireVariables, nombreFr, type DonneesSort, type EffetSort, type Variables } from "./description";

/**
 * Sorts et talents de chaque classe, par spécialisation, lus dans les fichiers du jeu (wago.tools) :
 *  - sorts : lignes de compétence de la classe (SkillLineAbility), rangs regroupés, niveau d'apprentissage (SpellLevels) ;
 *  - talents : arbres (TalentTab, Talent), paliers et rangs ;
 *  - descriptions remplies par description.ts, coût, temps d'incantation, recharge et portée.
 * Les sorts passifs, cachés ou déclenchés par un autre sort (effets de talents, procs) ne sont pas listés ;
 * les runes de la Saison de la découverte (AcquireMethod 3) non plus.
 */

type Ligne = Record<string, string>;
const lire = (csv: string) => parse(csv, { columns: true, skip_empty_lines: true, relax_column_count: true, bom: true }) as Ligne[];
const n = (v: string | undefined) => (Number.isFinite(Number(v)) ? Number(v) : 0);

export const TABLES_SORTS = [
  "SkillLineAbility", "SpellName", "Spell", "SpellLevels", "SpellMisc", "SpellEffect", "SpellDuration", "SpellCastTimes",
  "SpellRange", "SpellRadius", "SpellCooldowns", "SpellPower", "SpellAuraOptions", "SpellTargetRestrictions",
  "SpellDescriptionVariables", "SpellXDescriptionVariables", "TalentTab", "Talent",
] as const;
export type TablesSorts = Record<(typeof TABLES_SORTS)[number], string>;

/** Spécialisation : arbre de talents du jeu ↔ ligne de compétence qui porte les sorts de l'école. */
export const SPECIALISATIONS: Record<string, { masque: number; specs: { arbre: number; ligne: number; nom: string }[] }> = {
  guerrier: { masque: 1, specs: [{ arbre: 161, ligne: 26, nom: "Armes" }, { arbre: 164, ligne: 256, nom: "Fureur" }, { arbre: 163, ligne: 257, nom: "Protection" }] },
  paladin: { masque: 2, specs: [{ arbre: 382, ligne: 594, nom: "Sacré" }, { arbre: 383, ligne: 267, nom: "Protection" }, { arbre: 381, ligne: 184, nom: "Vindicte" }] },
  chasseur: { masque: 4, specs: [{ arbre: 361, ligne: 50, nom: "Maîtrise des bêtes" }, { arbre: 363, ligne: 163, nom: "Précision" }, { arbre: 362, ligne: 51, nom: "Survie" }] },
  voleur: { masque: 8, specs: [{ arbre: 182, ligne: 253, nom: "Assassinat" }, { arbre: 181, ligne: 38, nom: "Combat" }, { arbre: 183, ligne: 39, nom: "Finesse" }] },
  pretre: { masque: 16, specs: [{ arbre: 201, ligne: 613, nom: "Discipline" }, { arbre: 202, ligne: 56, nom: "Sacré" }, { arbre: 203, ligne: 78, nom: "Ombre" }] },
  chaman: { masque: 64, specs: [{ arbre: 261, ligne: 375, nom: "Élémentaire" }, { arbre: 263, ligne: 373, nom: "Amélioration" }, { arbre: 262, ligne: 374, nom: "Restauration" }] },
  mage: { masque: 128, specs: [{ arbre: 81, ligne: 237, nom: "Arcanes" }, { arbre: 41, ligne: 8, nom: "Feu" }, { arbre: 61, ligne: 6, nom: "Givre" }] },
  demoniste: { masque: 256, specs: [{ arbre: 302, ligne: 355, nom: "Affliction" }, { arbre: 303, ligne: 354, nom: "Démonologie" }, { arbre: 301, ligne: 593, nom: "Destruction" }] },
  druide: { masque: 1024, specs: [{ arbre: 283, ligne: 574, nom: "Équilibre" }, { arbre: 281, ligne: 134, nom: "Combat farouche" }, { arbre: 282, ligne: 573, nom: "Restauration" }] },
};

export interface RangSort {
  id: number;
  rang: number | null;
  niveau: number;
  cout: string | null;
  description: string;
}

export interface Sort {
  nom: string;
  icone: number;
  /** Sort obtenu par un talent (ses rangs suivants s'apprennent ensuite chez le maître de classe). */
  talent: boolean;
  incantation: string;
  recharge: string | null;
  portee: string | null;
  rangs: RangSort[];
}

export interface Talent {
  id: number;
  nom: string;
  icone: number;
  palier: number;
  colonne: number;
  rangs: number;
  /** Niveau du personnage requis pour le premier point (10 au premier palier, puis 5 de plus par palier). */
  niveau: number;
  /** Description au premier et au dernier rang. */
  premier: string;
  dernier: string;
  prerequis: string | null;
  /** Le talent donne un sort à lancer (et pas un simple bonus permanent). */
  actif: boolean;
}

export interface Specialisation {
  slug: string;
  nom: string;
  icone: number;
  sorts: Sort[];
  talents: Talent[];
}

export interface BilanSorts {
  classes: Record<string, Specialisation[]>;
  icones: number[];
  incompletes: number;
}

const PASSIF = 0x40;
const CACHE = 0x80;
const CANALISE = 0x4 | 0x40;
/** Effets « apprendre un sort » : leur sort déclenché n'est pas un effet secondaire. */
const EFFETS_APPRENTISSAGE = new Set([36, 57]);

const slugifier = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function texteCout(p: Ligne | undefined): string | null {
  if (!p) return null;
  const type = n(p.PowerType);
  const valeur = n(p.ManaCost);
  const pct = n(p.PowerCostPct);
  if (pct > 0) return `${nombreFr(pct, 1)} % du mana de base`;
  if (valeur <= 0) return null;
  switch (type) {
    case 0: return `${nombreFr(valeur)} mana`;
    case 1: return `${nombreFr(valeur / 10)} rage`;
    case 2: return `${nombreFr(valeur)} focalisation`;
    case 3: return `${nombreFr(valeur)} énergie`;
    default: return null;
  }
}

export function convertirSorts(csv: TablesSorts): BilanSorts {
  // Apostrophes unifiées : « Invocation d’eau » et « Invocation d'eau » sont le même sort.
  const noms = new Map(lire(csv.SpellName).map((l) => [n(l.ID), (l.Name_lang ?? "").replace(/[’ʼ]/g, "'")]));
  const textes = new Map(lire(csv.Spell).map((l) => [n(l.ID), l]));
  const niveaux = new Map<number, Ligne>();
  for (const l of lire(csv.SpellLevels)) if (n(l.DifficultyID) === 0) niveaux.set(n(l.SpellID), l);
  const divers = new Map<number, Ligne>();
  for (const l of lire(csv.SpellMisc)) if (n(l.DifficultyID) === 0) divers.set(n(l.SpellID), l);
  const durees = new Map(lire(csv.SpellDuration).map((l) => [n(l.ID), n(l.Duration)]));
  const incantations = new Map(lire(csv.SpellCastTimes).map((l) => [n(l.ID), n(l.Base)]));
  const portees = new Map(lire(csv.SpellRange).map((l) => [n(l.ID), n(l.RangeMax_0)]));
  const rayons = new Map(lire(csv.SpellRadius).map((l) => [n(l.ID), n(l.Radius)]));
  const recharges = new Map<number, Ligne>();
  for (const l of lire(csv.SpellCooldowns)) if (n(l.DifficultyID) === 0) recharges.set(n(l.SpellID), l);
  const couts = new Map<number, Ligne>();
  for (const l of lire(csv.SpellPower)) if (n(l.OrderIndex) === 0) couts.set(n(l.SpellID), l);
  const auras = new Map<number, Ligne>();
  for (const l of lire(csv.SpellAuraOptions)) if (n(l.DifficultyID) === 0) auras.set(n(l.SpellID), l);
  const cibles = new Map<number, Ligne>();
  for (const l of lire(csv.SpellTargetRestrictions)) if (n(l.DifficultyID) === 0) cibles.set(n(l.SpellID), l);
  const variablesParId = new Map(lire(csv.SpellDescriptionVariables).map((l) => [n(l.ID), l.Variables]));
  const communes: Variables = new Map();
  for (const texte of variablesParId.values()) for (const [k, v] of lireVariables(texte)) if (!communes.has(k)) communes.set(k, v);
  const variables = new Map<number, string>();
  for (const l of lire(csv.SpellXDescriptionVariables)) variables.set(n(l.SpellID), variablesParId.get(n(l.SpellDescriptionVariablesID)) ?? "");

  const effets = new Map<number, EffetSort[]>();
  const declenches = new Set<number>();
  for (const l of lire(csv.SpellEffect)) {
    if (n(l.DifficultyID) !== 0) continue;
    const id = n(l.SpellID);
    const e: EffetSort = {
      index: n(l.EffectIndex), effet: n(l.Effect), aura: n(l.EffectAura), base: n(l.EffectBasePointsF), variance: n(l.Variance),
      periode: n(l.EffectAuraPeriod), ciblesChainees: n(l.EffectChainTargets), rayon: Math.max(rayons.get(n(l.EffectRadiusIndex_0)) ?? 0, rayons.get(n(l.EffectRadiusIndex_1)) ?? 0),
      pointsParRessource: n(l.EffectPointsPerResource), amplitude: n(l.EffectAmplitude), misc: n(l.EffectMiscValue_0), declencheur: n(l.EffectTriggerSpell),
      coefficientChaine: n(l.EffectChainAmplitude),
    };
    if (!effets.has(id)) effets.set(id, []);
    effets.get(id)!.push(e);
    if (e.declencheur && !EFFETS_APPRENTISSAGE.has(e.effet) && e.declencheur !== id) declenches.add(e.declencheur);
  }
  for (const liste of effets.values()) liste.sort((a, b) => a.index - b.index);

  const cache = new Map<number, DonneesSort | undefined>();
  const chercher = (id: number): DonneesSort | undefined => {
    if (cache.has(id)) return cache.get(id);
    const nom = noms.get(id);
    let d: DonneesSort | undefined;
    if (nom !== undefined) {
      const m = divers.get(id);
      const a = auras.get(id);
      const duree = m ? durees.get(n(m.DurationIndex)) : undefined;
      d = {
        id, nom, description: textes.get(id)?.Description_lang ?? "",
        duree: duree === undefined || duree === 0 ? null : duree,
        effets: effets.get(id) ?? [],
        charges: n(a?.ProcCharges), chance: n(a?.ProcChance), cumul: n(a?.CumulativeAura),
        ciblesMax: n(cibles.get(id)?.MaxTargets),
        niveauMaxCible: n(cibles.get(id)?.MaxTargetLevel),
        portee: m ? portees.get(n(m.RangeIndex)) ?? 0 : 0,
        variables: variables.get(id) ?? "",
      };
    }
    cache.set(id, d);
    return d;
  };

  let incompletes = 0;
  const description = (id: number, texte?: string) => {
    const d = chercher(id);
    if (!d) return "";
    const r = decrire(d, chercher, texte ?? d.description, communes);
    if (!r.complet) incompletes++;
    return r.texte;
  };

  const talentsParArbre = new Map<number, Ligne[]>();
  const sortsDeTalent = new Set<number>();
  /** Niveau auquel le talent devient accessible, pour son sort de rang 1. */
  const niveauTalent = new Map<number, number>();
  for (const t of lire(csv.Talent)) {
    const arbre = n(t.TabID);
    niveauTalent.set(n(t.SpellRank_0), 10 + n(t.TierID) * 5);
    if (!talentsParArbre.has(arbre)) talentsParArbre.set(arbre, []);
    talentsParArbre.get(arbre)!.push(t);
    for (let k = 0; k < 9; k++) if (n(t[`SpellRank_${k}`])) sortsDeTalent.add(n(t[`SpellRank_${k}`]));
  }
  const arbres = new Map(lire(csv.TalentTab).map((l) => [n(l.ID), l]));
  const capacites = lire(csv.SkillLineAbility);

  const icones = new Set<number>();
  const classes: BilanSorts["classes"] = {};

  for (const [slug, classe] of Object.entries(SPECIALISATIONS)) {
    classes[slug] = classe.specs.map((spec) => {
      // Sorts de la ligne de compétence, rangs regroupés par nom.
      const groupes = new Map<string, { nom: string; talent: boolean; ids: number[] }>();
      for (const c of capacites) {
        if (n(c.SkillLine) !== spec.ligne) continue;
        const masque = n(c.ClassMask);
        if (masque && !(masque & classe.masque)) continue;
        if (n(c.AcquireMethod) === 3) continue;
        const id = n(c.Spell);
        const nom = noms.get(id);
        const m = divers.get(id);
        const nv = niveaux.get(id);
        if (!nom || !m || !nv || n(nv.SpellLevel) <= 0) continue;
        if (n(m.Attributes_0) & (PASSIF | CACHE)) continue;
        const talent = sortsDeTalent.has(id);
        // Sans masque de classe, seul un sort au niveau d'apprentissage renseigné est un vrai sort (Innervation).
        if (!talent && (declenches.has(id) || (!masque && n(nv.BaseLevel) <= 0))) continue;
        // Effet secondaire d'un talent (« Transi », retour de mana…) : portée « partout », jamais lancé par le joueur.
        if (!talent && (portees.get(n(m.RangeIndex)) ?? 0) >= 1000) continue;
        // « Piège d'immolation » et « Piège d'Immolation » : même sort, la casse varie d'un rang à l'autre.
        const cle = nom.toLocaleLowerCase("fr");
        const g = groupes.get(cle) ?? { nom, talent: false, ids: [] };
        g.talent ||= talent;
        g.ids.push(id);
        groupes.set(cle, g);
      }

      const sorts: Sort[] = [];
      for (const { nom, ...g } of groupes.values()) {
        const rangs = [...new Set(g.ids)].map((id) => {
          const sousTitre = textes.get(id)?.NameSubtext_lang ?? "";
          const r = /(\d+)/.exec(sousTitre);
          const niveau = Math.max(n(niveaux.get(id)?.SpellLevel), niveauTalent.get(id) ?? 0);
          return { id, rang: r ? Number(r[1]) : null, niveau, cout: texteCout(couts.get(id)), description: description(id) };
        }).sort((a, b) => a.niveau - b.niveau || (a.rang ?? 0) - (b.rang ?? 0) || a.id - b.id);
        // Un même rang en double (deux versions du sort) : on garde la première.
        const vus = new Set<string>();
        const uniques = rangs.filter((r) => {
          const cle = `${r.rang ?? "-"}`;
          if (vus.has(cle)) return false;
          vus.add(cle);
          return true;
        });
        const dernier = uniques[uniques.length - 1];
        const m = divers.get(dernier.id)!;
        const icone = n(m.SpellIconFileDataID);
        if (icone) icones.add(icone);
        const ms = incantations.get(n(m.CastingTimeIndex)) ?? 0;
        const canalise = (n(m.Attributes_1) & CANALISE) !== 0;
        const rc = recharges.get(dernier.id);
        const recharge = Math.max(n(rc?.RecoveryTime), n(rc?.CategoryRecoveryTime));
        const portee = portees.get(n(m.RangeIndex)) ?? 0;
        sorts.push({
          nom, icone, talent: g.talent,
          incantation: canalise ? "Canalisé" : ms > 0 ? `Incantation ${dureeFr(ms)}` : "Instantané",
          recharge: recharge >= 1500 ? `Recharge ${dureeFr(recharge)}` : null,
          portee: portee > 5 ? `Portée ${nombreFr(portee)} m` : portee > 0 ? "Corps à corps" : null,
          rangs: uniques,
        });
      }
      sorts.sort((a, b) => a.rangs[0].niveau - b.rangs[0].niveau || a.nom.localeCompare(b.nom, "fr"));

      // Talents de l'arbre.
      const lignes = talentsParArbre.get(spec.arbre) ?? [];
      const nomTalent = new Map(lignes.map((t) => [n(t.ID), noms.get(n(t.SpellRank_0)) ?? ""]));
      const talents: Talent[] = lignes.flatMap((t) => {
        const ids = Array.from({ length: 9 }, (_, k) => n(t[`SpellRank_${k}`])).filter(Boolean);
        if (!ids.length || !noms.get(ids[0])) return [];
        const m = divers.get(ids[0]);
        const icone = n(m?.SpellIconFileDataID);
        if (icone) icones.add(icone);
        const palier = n(t.TierID);
        const pre = n(t.PrereqTalent_0);
        return [{
          id: n(t.ID), nom: noms.get(ids[0])!, icone, palier, colonne: n(t.ColumnIndex), rangs: ids.length,
          niveau: 10 + palier * 5,
          premier: description(ids[0]),
          dernier: ids.length > 1 ? description(ids[ids.length - 1]) : "",
          prerequis: pre ? nomTalent.get(pre) || null : null,
          actif: !(n(m?.Attributes_0) & PASSIF),
        }];
      }).sort((a, b) => a.palier - b.palier || a.colonne - b.colonne);

      const arbre = arbres.get(spec.arbre);
      const icone = n(arbre?.SpellIconID);
      if (icone) icones.add(icone);
      return { slug: slugifier(spec.nom), nom: spec.nom, icone, sorts, talents };
    });
  }

  return { classes, icones: [...icones].sort((a, b) => a - b), incompletes };
}
