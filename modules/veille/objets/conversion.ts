import { parse } from "csv-parse/sync";
import { normaliser } from "../collecte/texte";
import { calculer, type Caracteristique, type TablesCaracteristiques } from "./caracteristiques";

/**
 * Conversion des tables du jeu (ItemSparse, Item, ItemClass, ItemSubClass, ItemSet) en lignes de la base d'objets.
 * Fonctions pures : aucune lecture réseau ni écriture en base.
 */

export interface LigneObjet {
  id: number;
  nom: string;
  nomRecherche: string;
  description: string;
  classe: number;
  sousClasse: number;
  qualite: number;
  niveauObjet: number;
  niveauRequis: number;
  emplacement: number;
  lien: number;
  classesAutorisees: number;
  prixVente: number;
  prixAchat: number;
  pile: number;
  exemplairesMax: number;
  vitesseMs: number;
  casesSac: number;
  ensemble: number | null;
  icone: number;
  caracteristiques: Caracteristique[];
  armure: number | null;
  degatsMin: number | null;
  degatsMax: number | null;
}

export interface LigneCategorie { classe: number; sousClasse: number; nom: string; nomLong: string }
export interface LigneEnsemble { id: number; nom: string }

type Ligne = Record<string, string>;

/** Les catégories abandonnées par le jeu gardent un nom anglais suivi de « (OBSOLETE) » : elles deviennent « Autres ». */
function nomLisible(nom: string, sousCategorie: boolean, en = false): string {
  const n = nom.trim();
  if (!/\(OBSOLETE\)/i.test(n)) return n;
  if (en) return sousCategorie ? "Other" : "Other items";
  return sousCategorie ? "Autres" : "Autres objets";
}

function lignes(csv: string): Ligne[] {
  return parse(csv, { columns: true, skip_empty_lines: true, relax_column_count: true, bom: true }) as Ligne[];
}

function entier(v: string | undefined, defaut = 0): number {
  const n = Number(v);
  return Number.isFinite(n) ? Math.trunc(n) : defaut;
}

/** Colonnes indispensables : si wago.tools change le format, l'import s'arrête au lieu de remplir la base de zéros. */
function exigerColonnes(table: string, l: Ligne | undefined, colonnes: string[]) {
  if (!l) throw new Error(`Table ${table} vide.`);
  const manquantes = colonnes.filter((c) => !(c in l));
  if (manquantes.length) throw new Error(`Table ${table} : colonnes absentes (${manquantes.join(", ")}).`);
}

/** Niveau maximal des personnages de Forever : un objet qui exige davantage n'est pas obtenable. */
export const NIVEAU_MAX = 60;

/**
 * Objets internes laissés par les développeurs dans les fichiers du jeu : objets de test, équipement des monstres,
 * objets périmés ou provisoires (préfixe entre crochets : [PÉRIMÉ], [PH], [DNT]…). Ils n'existent pas pour les joueurs.
 */
const MOTIFS_INTERNES = [
  /^\s*\[/, /^(old)?\s*monst(er|re)\s*-/i, /\btest(ing)?\b/i, /\bdeprecated\b/i, /\bunused\b/i, /\(old\)/i, /^old[A-Z ]/,
  /\bdebug\b/i, /\bplaceholder\b/i, /^QA|\bQA\b/, /\bDNT\b/, /^zz/i, /\bPH\b/, /\bDEP$/, /\(PT\)/,
  // Équipement de démonstration (« 90 Epic Warrior Helm ») et gabarits non traduits.
  /^\d+\s+(green|blue|purple|epic|rare)\b/i, /\bquest item\b/i, /\btemplate item\b/i, /\btransmog ui\b/i, /\bresist \w+ gear\b/i, /^tome of /i,
];

export function objetInterne(nom: string, niveauRequis: number): boolean {
  return niveauRequis > NIVEAU_MAX || MOTIFS_INTERNES.some((m) => m.test(nom));
}

export function convertirObjets(sparseCsv: string, itemCsv: string, tables?: TablesCaracteristiques): LigneObjet[] {
  const sparse = lignes(sparseCsv);
  const items = lignes(itemCsv);
  exigerColonnes("ItemSparse", sparse[0], ["ID", "Display_lang", "Description_lang", "OverallQualityID", "ItemLevel", "RequiredLevel", "InventoryType", "Bonding", "AllowableClass", "SellPrice", "BuyPrice"]);
  exigerColonnes("Item", items[0], ["ID", "ClassID", "SubclassID", "IconFileDataID"]);
  const parId = new Map(items.map((i) => [entier(i.ID), i]));
  const resultat: LigneObjet[] = [];
  for (const s of sparse) {
    const id = entier(s.ID);
    const item = parId.get(id);
    const nom = (s.Display_lang ?? "").trim();
    if (!item || !nom || id <= 0 || objetInterne(nom, entier(s.RequiredLevel))) continue;
    const calcul = tables ? calculer(s, entier(item.ClassID), entier(item.SubclassID), tables) : { caracteristiques: [], armure: null, degatsMin: null, degatsMax: null };
    resultat.push({
      id,
      nom,
      nomRecherche: normaliser(nom),
      description: (s.Description_lang ?? "").trim(),
      classe: entier(item.ClassID),
      sousClasse: entier(item.SubclassID),
      qualite: entier(s.OverallQualityID, 1),
      niveauObjet: entier(s.ItemLevel),
      niveauRequis: entier(s.RequiredLevel),
      emplacement: entier(s.InventoryType),
      lien: entier(s.Bonding),
      classesAutorisees: entier(s.AllowableClass, -1),
      prixVente: Math.max(0, entier(s.SellPrice)),
      prixAchat: Math.max(0, entier(s.BuyPrice)),
      pile: entier(s.Stackable, 1),
      exemplairesMax: entier(s.MaxCount),
      vitesseMs: entier(s.ItemDelay),
      casesSac: entier(s.ContainerSlots),
      ensemble: entier(s.ItemSet) > 0 ? entier(s.ItemSet) : null,
      icone: entier(item.IconFileDataID),
      ...calcul,
    });
  }
  return resultat;
}

/** `en` : tables lues en anglais (version anglaise du site). */
export function convertirCategories(classesCsv: string, sousClassesCsv: string, en = false): LigneCategorie[] {
  const classes = lignes(classesCsv);
  const sous = lignes(sousClassesCsv);
  exigerColonnes("ItemClass", classes[0], ["ClassID", "ClassName_lang"]);
  exigerColonnes("ItemSubClass", sous[0], ["ClassID", "SubClassID", "DisplayName_lang", "VerboseName_lang"]);
  const vues = new Set<string>();
  const resultat: LigneCategorie[] = [];
  const ajouter = (l: LigneCategorie) => {
    const cle = `${l.classe}/${l.sousClasse}`;
    if (vues.has(cle) || !l.nom) return;
    vues.add(cle);
    resultat.push(l);
  };
  for (const c of classes) ajouter({ classe: entier(c.ClassID), sousClasse: -1, nom: nomLisible(c.ClassName_lang ?? "", false, en), nomLong: "" });
  for (const s of sous) {
    ajouter({
      classe: entier(s.ClassID),
      sousClasse: entier(s.SubClassID),
      nom: nomLisible(s.DisplayName_lang ?? "", true, en),
      nomLong: /\(OBSOLETE\)/i.test(s.DisplayName_lang ?? "") ? "" : (s.VerboseName_lang ?? "").trim(),
    });
  }
  return resultat;
}

export function convertirEnsembles(csv: string): LigneEnsemble[] {
  const l = lignes(csv);
  exigerColonnes("ItemSet", l[0], ["ID", "Name_lang"]);
  return l.map((e) => ({ id: entier(e.ID), nom: (e.Name_lang ?? "").trim() })).filter((e) => e.id > 0 && e.nom);
}

export interface LigneRecette {
  sort: number;
  nom: string;
  objet: number;
  quantite: number;
  metier: string;
  /** Rang de métier requis (indiqué par l'objet « Recette », sinon par la table du métier). */
  rang: number;
  /** La recette devient jaune, puis grise (plus de point de métier) à ces rangs. */
  jaune: number;
  gris: number;
  composants: { o: number; n: number }[];
  /** Objet « Recette » (plan, patron, formule…) qui l'apprend, s'il existe. */
  recette: number | null;
}

/**
 * Recettes des métiers : sort de fabrication (SkillLineAbility), objet créé (SpellEffect, effet 24), composants
 * (SpellReagents), métier (SkillLine), objet qui apprend la recette (ItemEffect, déclenchement 6 ou sort « apprendre »).
 */
export function convertirRecettes(t: {
  SkillLineAbility: string; SpellEffect: string; SpellReagents: string; SpellName: string; SkillLine: string; ItemEffect: string; ItemXItemEffect: string; ItemSparse: string;
}, objetsConnus: Set<number>): LigneRecette[] {
  const metiers = new Map(lignes(t.SkillLine).filter((s) => ["9", "11"].includes(s.CategoryID) && !/DNT|test/i.test(s.DisplayName_lang ?? ""))
    .map((s) => [entier(s.ID), (s.DisplayName_lang ?? "").trim()]));
  const cree = new Map<number, { objet: number; quantite: number }>();
  const apprend = new Map<number, number>(); // sort « apprendre » → sort de fabrication
  for (const e of lignes(t.SpellEffect)) {
    if (e.Effect === "24" && entier(e.EffectItemType) > 0) cree.set(entier(e.SpellID), { objet: entier(e.EffectItemType), quantite: Math.max(1, Math.round(Number(e.EffectBasePointsF) || 1)) });
    if (e.Effect === "36" && entier(e.EffectTriggerSpell) > 0) apprend.set(entier(e.SpellID), entier(e.EffectTriggerSpell));
  }
  const noms = new Map(lignes(t.SpellName).map((s) => [entier(s.ID), (s.Name_lang ?? "").trim()]));
  const composants = new Map(lignes(t.SpellReagents).map((r) => [entier(r.SpellID),
    [0, 1, 2, 3, 4, 5, 6, 7].map((k) => ({ o: entier(r[`Reagent_${k}`]), n: entier(r[`ReagentCount_${k}`]) })).filter((c) => c.o > 0 && c.n > 0)]));
  const rangRequis = new Map(lignes(t.ItemSparse).map((s) => [entier(s.ID), entier(s.RequiredSkillRank)]));
  const effetParId = new Map(lignes(t.ItemEffect).map((e) => [entier(e.ID), e]));
  const recetteParSort = new Map<number, number>();
  for (const x of lignes(t.ItemXItemEffect)) {
    const e = effetParId.get(entier(x.ItemEffectID));
    if (!e) continue;
    const sort = e.TriggerType === "6" ? entier(e.SpellID) : apprend.get(entier(e.SpellID));
    if (sort && !recetteParSort.has(sort) && objetsConnus.has(entier(x.ItemID))) recetteParSort.set(sort, entier(x.ItemID));
  }
  const vues = new Set<number>();
  const resultat: LigneRecette[] = [];
  for (const a of lignes(t.SkillLineAbility)) {
    const sort = entier(a.Spell);
    const metier = metiers.get(entier(a.SkillLine));
    const c = cree.get(sort);
    if (!metier || !c || vues.has(sort) || !objetsConnus.has(c.objet)) continue;
    vues.add(sort);
    const recette = recetteParSort.get(sort) ?? null;
    const rangObjet = recette ? rangRequis.get(recette) ?? 0 : 0;
    resultat.push({
      sort, nom: noms.get(sort) ?? "", objet: c.objet, quantite: c.quantite, metier,
      rang: rangObjet || entier(a.MinSkillLineRank), jaune: entier(a.TrivialSkillLineRankLow), gris: entier(a.TrivialSkillLineRankHigh),
      composants: (composants.get(sort) ?? []).filter((x) => objetsConnus.has(x.o)), recette,
    });
  }
  return resultat;
}
