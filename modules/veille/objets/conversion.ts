import { parse } from "csv-parse/sync";
import { normaliser } from "../collecte/texte";

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
}

export interface LigneCategorie { classe: number; sousClasse: number; nom: string; nomLong: string }
export interface LigneEnsemble { id: number; nom: string }

type Ligne = Record<string, string>;

/** Les catégories abandonnées par le jeu gardent un nom anglais suivi de « (OBSOLETE) » : elles deviennent « Autres ». */
function nomLisible(nom: string, sousCategorie: boolean): string {
  const n = nom.trim();
  return /\(OBSOLETE\)/i.test(n) ? (sousCategorie ? "Autres" : "Autres objets") : n;
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

export function convertirObjets(sparseCsv: string, itemCsv: string): LigneObjet[] {
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
    });
  }
  return resultat;
}

export function convertirCategories(classesCsv: string, sousClassesCsv: string): LigneCategorie[] {
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
  for (const c of classes) ajouter({ classe: entier(c.ClassID), sousClasse: -1, nom: nomLisible(c.ClassName_lang ?? "", false), nomLong: "" });
  for (const s of sous) {
    ajouter({
      classe: entier(s.ClassID),
      sousClasse: entier(s.SubClassID),
      nom: nomLisible(s.DisplayName_lang ?? "", true),
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
