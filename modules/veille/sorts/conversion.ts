import { parse } from "csv-parse/sync";
import { decrire, definirLangue, dureeFr, lireVariables, nombreFr, type DonneesSort, type EffetSort, type Langue, type Variables } from "./description";

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
  "SpellDescriptionVariables", "SpellXDescriptionVariables", "TalentTab", "Talent", "CreatureFamily", "PetLoyalty",
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
  /** Description au premier rang. */
  premier: string;
  /**
   * Description de chaque rang (null : rang absent des fichiers). Forever ne publie aujourd'hui que le premier rang ;
   * les suivants s'afficheront d'eux-mêmes quand une version du jeu les contiendra (npm run sorts:jeu).
   */
  descriptions: (string | null)[];
  prerequis: string | null;
  /** Talent à remplir entièrement avant celui-ci (identifiant dans le même arbre). */
  prerequisId: number | null;
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

/** Technique de familier, avec les familles qui peuvent l'apprendre (null : toutes). */
export interface TechniqueFamilier extends Sort {
  familles: string[] | null;
}

export interface FamilleFamilier {
  nom: string;
  icone: number;
  techniques: string[];
}

export interface Familiers {
  /** « partage » : techniques communes à plusieurs familles (chasseur) ; « groupe » : propres à chaque démon (démoniste). */
  mode: "partage" | "groupe";
  familles: FamilleFamilier[];
  techniques: TechniqueFamilier[];
  /** Niveaux de loyauté du familier, du premier au dernier (chasseur). */
  loyaute?: string[];
}

/** Traits raciaux : ligne de compétence raciale du jeu → slug de la race sur le site. */
export const LIGNES_RACIALES: Record<string, number> = {
  humain: 754, nain: 101, "elfe-de-la-nuit": 126, gnome: 753, orc: 125, "mort-vivant": 220, tauren: 124, troll: 733, skyborne: 2980,
};

/** Masques de classe du jeu → nom affiché. */
const CLASSES_MASQUE: [number, string][] = [
  [1, "Guerrier"], [2, "Paladin"], [4, "Chasseur"], [8, "Voleur"], [16, "Prêtre"], [64, "Chaman"], [128, "Mage"], [256, "Démoniste"], [1024, "Druide"],
];

export interface TraitRacial {
  nom: string;
  icone: number;
  passif: boolean;
  /** Incantation, recharge, portée, coût : vide pour un trait passif. */
  details: string[];
  /** Une variante par groupe de classes (classes null : toutes les classes). */
  variantes: { classes: string[] | null; description: string }[];
}

/** Lignes du jeu : techniques apprises par le dressage du chasseur, et techniques communes à toutes les bêtes. */
const DRESSAGE = 261;
const COMMUNES_BETES = 270;

export interface BilanSorts {
  classes: Record<string, Specialisation[]>;
  races: Record<string, TraitRacial[]>;
  familiers: Record<string, Familiers>;
  icones: number[];
  incompletes: number;
}

/** Nom affiché d'un talent dont les fichiers ne donnent ni le nom ni l'effet. */
export const TALENT_NON_PUBLIE = "[Talent pas encore publié]";

/** Libellés des fiches, en français et en anglais (version anglaise du site). */
const TEXTES = {
  fr: {
    passif: "Passif", canalise: "Canalisé", instantane: "Instantané", incantation: "Incantation", recharge: "Recharge", portee: "Portée", unite: "\u00a0m",
    melee: "Corps à corps", manaBase: " % du mana de base", mana: "mana", rage: "rage", focalisation: "focalisation", energie: "énergie",
    nonPublie: TALENT_NON_PUBLIE,
    classes: ["Guerrier", "Paladin", "Chasseur", "Voleur", "Prêtre", "Chaman", "Mage", "Démoniste", "Druide"],
  },
  en: {
    passif: "Passive", canalise: "Channeled", instantane: "Instant", incantation: "Cast", recharge: "Cooldown", portee: "Range", unite: " yd",
    melee: "Melee range", manaBase: "% of base mana", mana: "mana", rage: "rage", focalisation: "focus", energie: "energy",
    nonPublie: "[Talent not yet released]",
    classes: ["Warrior", "Paladin", "Hunter", "Rogue", "Priest", "Shaman", "Mage", "Warlock", "Druid"],
  },
};
let T: (typeof TEXTES)["fr"] = TEXTES.fr;

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
  if (pct > 0) return `${nombreFr(pct, 1)}${T.manaBase}`;
  if (valeur <= 0) return null;
  switch (type) {
    case 0: return `${nombreFr(valeur)} ${T.mana}`;
    case 1: return `${nombreFr(valeur / 10)} ${T.rage}`;
    case 2: return `${nombreFr(valeur)} ${T.focalisation}`;
    case 3: return `${nombreFr(valeur)} ${T.energie}`;
    default: return null;
  }
}

const nomClasse = (bit: number) => T.classes[CLASSES_MASQUE.findIndex(([b]) => b === bit)];

/** Conversion dans une langue : « fr » avec les tables en français, « en » avec les tables en anglais. */
export function convertirSorts(csv: TablesSorts, langue: Langue = "fr"): BilanSorts {
  definirLangue(langue);
  T = TEXTES[langue];
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
  const nomsDeTalent = new Set([...sortsDeTalent].map((id) => noms.get(id)).filter((x): x is string => !!x));
  const arbres = new Map(lire(csv.TalentTab).map((l) => [n(l.ID), l]));
  const capacites = lire(csv.SkillLineAbility);

  const icones = new Set<number>();
  const classes: BilanSorts["classes"] = {};

  /** Sorts d'une ou plusieurs lignes de compétence, rangs regroupés par nom. masqueClasse 0 : familiers (aucun masque). */
  const sortsDeLignes = (lignes: Set<number>, masqueClasse: number, exclus: Set<string> = new Set(), familier = false): Sort[] => {
    const groupes = new Map<string, { nom: string; talent: boolean; ids: number[] }>();
    for (const c of capacites) {
      if (!lignes.has(n(c.SkillLine))) continue;
      const masque = n(c.ClassMask);
      if (masque && masqueClasse && !(masque & masqueClasse)) continue;
      if (n(c.AcquireMethod) === 3) continue;
      const id = n(c.Spell);
      const nom = noms.get(id);
      const m = divers.get(id);
      const nv = niveaux.get(id);
      if (!nom || !m || !nv || n(nv.SpellLevel) <= 0 || exclus.has(nom)) continue;
      // Les techniques passives des familiers (résistances, armure naturelle) s'apprennent : on les garde.
      if (n(m.Attributes_0) & (familier ? CACHE : PASSIF | CACHE)) continue;
      const talent = sortsDeTalent.has(id);
      // Familiers : les techniques du familier sont « déclenchées » par le dressage du chasseur, ce qui ne les écarte pas ;
      // un talent du maître (Intimidation) n'est pas une technique du familier.
      if (familier) {
        if (talent || nomsDeTalent.has(nom)) continue;
        const cle = nom.toLocaleLowerCase("fr");
        const g = groupes.get(cle) ?? { nom, talent: false, ids: [] };
        g.ids.push(id);
        groupes.set(cle, g);
        continue;
      }
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
      // Un même rang en double (deux versions du sort) : on garde celle qui a une description.
      const parRang = new Map<string, (typeof rangs)[number]>();
      for (const r of rangs) {
        const cle = `${r.rang ?? "-"}`;
        const deja = parRang.get(cle);
        if (!deja || (!deja.description && r.description)) parRang.set(cle, r);
      }
      const uniques = rangs.filter((r) => parRang.get(`${r.rang ?? "-"}`) === r);
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
        incantation: n(m.Attributes_0) & PASSIF ? T.passif : canalise ? T.canalise : ms > 0 ? `${T.incantation} ${dureeFr(ms)}` : T.instantane,
        recharge: recharge >= 1500 ? `${T.recharge} ${dureeFr(recharge)}` : null,
        // 50 000 m : valeur interne du jeu pour « sans limite », sans intérêt pour le joueur.
        portee: portee >= 1000 ? null : portee > 5 ? `${T.portee} ${nombreFr(portee)}${T.unite}` : portee > 0 ? T.melee : null,
        rangs: uniques,
      });
    }
    sorts.sort((a, b) => a.rangs[0].niveau - b.rangs[0].niveau || a.nom.localeCompare(b.nom, "fr"));
    return sorts;
  };

  for (const [slug, classe] of Object.entries(SPECIALISATIONS)) {
    classes[slug] = classe.specs.map((spec) => {
      const sorts = sortsDeLignes(new Set([spec.ligne]), classe.masque);

      // Talents de l'arbre.
      const lignes = talentsParArbre.get(spec.arbre) ?? [];
      const nomTalent = new Map(lignes.map((t) => [n(t.ID), noms.get(n(t.SpellRank_0)) || T.nonPublie]));
      const talents: Talent[] = lignes.flatMap((t) => {
        const ids = Array.from({ length: 9 }, (_, k) => n(t[`SpellRank_${k}`])).filter(Boolean);
        if (!ids.length) return [];
        // Talent présent dans l'arbre mais dont le sort n'est pas encore publié (fichier chiffré) : gardé, pour que
        // l'arbre et les prérequis restent justes.
        const nom = noms.get(ids[0]) || T.nonPublie;
        const m = divers.get(ids[0]);
        const icone = n(m?.SpellIconFileDataID);
        if (icone) icones.add(icone);
        const palier = n(t.TierID);
        const pre = n(t.PrereqTalent_0);
        return [{
          id: n(t.ID), nom, icone, palier, colonne: n(t.ColumnIndex), rangs: ids.length,
          niveau: 10 + palier * 5,
          premier: description(ids[0]),
          descriptions: ids.map((id, k) => (k === 0 ? description(id) : noms.has(id) && textes.get(id)?.Description_lang ? description(id) : null)),
          prerequis: pre ? nomTalent.get(pre) || null : null,
          prerequisId: pre || null,
          actif: !(n(m?.Attributes_0) & PASSIF),
        }];
      }).sort((a, b) => a.palier - b.palier || a.colonne - b.colonne);

      const arbre = arbres.get(spec.arbre);
      const icone = n(arbre?.SpellIconID);
      if (icone) icones.add(icone);
      // Le slug reste le nom français (adresses et ancres stables) ; en anglais, le nom vient de l'arbre du jeu.
      return { slug: slugifier(spec.nom), nom: langue === "en" ? arbre?.Name_lang || spec.nom : spec.nom, icone, sorts, talents };
    });
  }

  // Familiers : bêtes du chasseur (familles apprivoisables) et démons du démoniste.
  const familles = lire(csv.CreatureFamily).filter((f) => n(f.SkillLine_0) && f.Name_lang && n(f.ID) !== 28);
  const parLigne = new Map<number, { noms: string[]; icone: number; bete: boolean }>();
  for (const f of familles) {
    const ligne = n(f.SkillLine_0);
    const g = parLigne.get(ligne) ?? { noms: [], icone: n(f.IconFileID), bete: n(f.PetFoodMask) > 0 };
    if (!g.noms.includes(f.Name_lang)) g.noms.push(f.Name_lang);
    g.icone ||= n(f.IconFileID);
    parLigne.set(ligne, g);
  }
  const groupe = (bete: boolean) => [...parLigne.entries()]
    .filter(([, g]) => g.bete === bete)
    .map(([ligne, g]) => ({ ligne, nom: g.noms.join(" / "), icone: g.icone, sorts: sortsDeLignes(new Set([ligne]), 0, new Set(), true) }))
    .filter((g) => g.sorts.length)
    .sort((a, b) => a.nom.localeCompare(b.nom, "fr"));

  const betes = groupe(true);
  const nomsBetes = new Set(betes.flatMap((b) => b.sorts.map((x) => x.nom)));
  // Techniques communes à toutes les bêtes, puis celles que seul le dressage du chasseur connaît (résistances, armure…).
  // Seules comptent les techniques que le dressage enseigne : la ligne commune porte aussi des sorts internes (« Attaque rapide IV »).
  const enseignees = new Set(sortsDeLignes(new Set([DRESSAGE]), 0, new Set(), true).map((t) => t.nom));
  const toutesBetes = sortsDeLignes(new Set([COMMUNES_BETES]), 0, nomsBetes, true).filter((t) => enseignees.has(t.nom));
  const dressage = sortsDeLignes(new Set([DRESSAGE]), 0, new Set([...nomsBetes, ...toutesBetes.map((c) => c.nom), "Dressage des bêtes"]), true);
  const techniquesBetes: TechniqueFamilier[] = [
    ...sortsDeLignes(new Set(betes.map((b) => b.ligne)), 0, new Set(), true).map((t) => {
      const ont = betes.filter((b) => b.sorts.some((x) => x.nom === t.nom)).map((b) => b.nom);
      return { ...t, familles: ont.length === betes.length ? null : ont };
    }),
    ...[...toutesBetes, ...dressage].map((t) => ({ ...t, familles: null })),
  ].sort((a, b) => a.rangs[0].niveau - b.rangs[0].niveau || a.nom.localeCompare(b.nom, "fr"));

  const demons = groupe(false);
  const familiers: BilanSorts["familiers"] = {
    chasseur: {
      mode: "partage",
      familles: betes.map((b) => ({ nom: b.nom, icone: b.icone, techniques: b.sorts.map((x) => x.nom) })),
      techniques: techniquesBetes,
      loyaute: lire(csv.PetLoyalty)
        .sort((a, b) => n(a.ID) - n(b.ID))
        .map((l) => (l.Name_lang ?? "").replace(/^\([^)]*\)\s*/, "").trim())
        // Les deux dernières lignes sont techniques (« Cap de loyauté », « Inutilisé »).
        .filter((nom) => nom && !/^(cap de loyauté|inutilisé|loyalty cap|unused)$/i.test(nom)),
    },
    demoniste: {
      mode: "groupe",
      familles: demons.map((d) => ({ nom: d.nom, icone: d.icone, techniques: d.sorts.map((x) => x.nom) })),
      techniques: demons.flatMap((d) => d.sorts.map((x) => ({ ...x, familles: [d.nom] }))),
    },
  };
  for (const f of Object.values(familiers)) for (const g of f.familles) if (g.icone) icones.add(g.icone);

  // Traits raciaux : passifs compris, variantes par classe regroupées sous un même nom.
  const races: BilanSorts["races"] = {};
  for (const [race, ligne] of Object.entries(LIGNES_RACIALES)) {
    const traits = new Map<string, TraitRacial & { ordre: number }>();
    capacites.forEach((c, ordre) => {
      if (n(c.SkillLine) !== ligne || n(c.AcquireMethod) === 3) return;
      const id = n(c.Spell);
      const nom = noms.get(id);
      const m = divers.get(id);
      if (!nom || !m || n(m.Attributes_0) & CACHE) return;
      const passif = (n(m.Attributes_0) & PASSIF) !== 0;
      const masque = n(c.ClassMask);
      const classes = masque > 0 && (masque & 0x5df) !== 0x5df ? CLASSES_MASQUE.filter(([b]) => masque & b).map(([b]) => nomClasse(b)) : null;
      const texte = description(id);
      const t = traits.get(nom) ?? (() => {
        const icone = n(m.SpellIconFileDataID);
        if (icone) icones.add(icone);
        const ms = incantations.get(n(m.CastingTimeIndex)) ?? 0;
        const rc = recharges.get(id);
        const recharge = Math.max(n(rc?.RecoveryTime), n(rc?.CategoryRecoveryTime));
        const portee = portees.get(n(m.RangeIndex)) ?? 0;
        const details = passif ? [] : [
          (n(m.Attributes_1) & CANALISE) ? T.canalise : ms > 0 ? `${T.incantation} ${dureeFr(ms)}` : T.instantane,
          recharge >= 1500 ? `${T.recharge} ${dureeFr(recharge)}` : null,
          portee > 5 && portee < 1000 ? `${T.portee} ${nombreFr(portee)}${T.unite}` : null,
          texteCout(couts.get(id)),
        ].filter((x): x is string => !!x);
        return { nom, icone, passif, details, variantes: [], ordre };
      })();
      const meme = t.variantes.find((v) => v.description === texte);
      if (meme) {
        if (meme.classes && classes) meme.classes = [...new Set([...meme.classes, ...classes])];
        else meme.classes = null;
      } else {
        t.variantes.push({ classes, description: texte });
      }
      traits.set(nom, t);
    });
    // Actifs d'abord, puis passifs, dans l'ordre du jeu.
    races[race] = [...traits.values()]
      .sort((a, b) => Number(a.passif) - Number(b.passif) || a.ordre - b.ordre)
      .map(({ ordre: _ordre, ...t }) => ({
        ...t,
        // Une variante qui couvre toutes les classes vaut pour tout le monde.
        variantes: t.variantes.map((v) => ({
          ...v,
          classes: v.classes && v.classes.length < CLASSES_MASQUE.length ? CLASSES_MASQUE.map(([b]) => nomClasse(b)).filter((x) => v.classes!.includes(x)) : null,
        })),
      }));
  }

  return { classes, races, familiers, icones: [...icones].sort((a, b) => a - b), incompletes };
}
