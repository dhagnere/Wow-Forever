import { parse } from "csv-parse/sync";

/**
 * Caractéristiques d'un objet calculées comme le fait le jeu, à partir de ses tables (wago.tools) :
 *  - bonus (Force, Endurance, résistances…) : budget du niveau d'objet (RandPropPoints) × part de chaque bonus (StatPercentEditor) ;
 *  - dégâts des armes : DPS de la table de dégâts × vitesse, étalés selon la variance de l'arme ;
 *  - armure : total du niveau d'objet × coefficient de l'emplacement × coefficient de qualité (boucliers : table propre).
 * Vérifié sur des objets connus (Lame-tonnerre : +5 Agilité, +8 Endurance ; Heaume Coeur-de-lion : 565 d'armure ;
 * Déchireuse en arcanite : 153 à 256). Les objets légendaires ont des dégâts propres : ils ne sont pas calculés.
 */

type Ligne = Record<string, string>;
const lire = (csv: string) => parse(csv, { columns: true, skip_empty_lines: true, relax_column_count: true, bom: true }) as Ligne[];

export interface Caracteristique { type: number; valeur: number }
export interface Calcul { caracteristiques: Caracteristique[]; armure: number | null; degatsMin: number | null; degatsMax: number | null }

export interface TablesCaracteristiques {
  budgets: Map<number, Ligne>;
  degats: Record<"une" | "deux" | "distance" | "jet" | "baguette" | "uneCaster" | "deuxCaster", Map<number, Ligne>>;
  armureQualite: Map<number, Ligne>;
  armureTotale: Map<number, Ligne>;
  armureEmplacement: Map<number, Ligne>;
  armureBouclier: Map<number, Ligne>;
}

/** Tables dont dépend le calcul, à lire en plus d'ItemSparse et d'Item. */
export const TABLES_CARACTERISTIQUES = [
  "RandPropPoints", "ItemDamageOneHand", "ItemDamageTwoHand", "ItemDamageRanged", "ItemDamageThrown", "ItemDamageWand",
  "ItemDamageOneHandCaster", "ItemDamageTwoHandCaster", "ItemArmorQuality", "ItemArmorTotal", "ArmorLocation", "ItemArmorShield",
] as const;

const parCle = (csv: string, cle: string) => new Map(lire(csv).map((l) => [Number(l[cle] ?? l.ID), l]));

export function preparerTables(csv: Record<(typeof TABLES_CARACTERISTIQUES)[number], string>): TablesCaracteristiques {
  return {
    budgets: parCle(csv.RandPropPoints, "ID"),
    degats: {
      une: parCle(csv.ItemDamageOneHand, "ItemLevel"),
      deux: parCle(csv.ItemDamageTwoHand, "ItemLevel"),
      distance: parCle(csv.ItemDamageRanged, "ItemLevel"),
      jet: parCle(csv.ItemDamageThrown, "ItemLevel"),
      baguette: parCle(csv.ItemDamageWand, "ItemLevel"),
      uneCaster: parCle(csv.ItemDamageOneHandCaster, "ItemLevel"),
      deuxCaster: parCle(csv.ItemDamageTwoHandCaster, "ItemLevel"),
    },
    armureQualite: parCle(csv.ItemArmorQuality, "ID"),
    armureTotale: parCle(csv.ItemArmorTotal, "ItemLevel"),
    armureEmplacement: parCle(csv.ArmorLocation, "ID"),
    armureBouclier: parCle(csv.ItemArmorShield, "ItemLevel"),
  };
}

/** Colonne de budget selon l'emplacement (0 : tête, torse, jambes, deux mains… ; 4 : distance, reliques). */
export function indiceEmplacement(emplacement: number): number | null {
  if ([1, 4, 5, 7, 17, 20].includes(emplacement)) return 0;
  if ([3, 6, 8, 10, 12].includes(emplacement)) return 1;
  if ([2, 9, 11, 14, 16, 23].includes(emplacement)) return 2;
  if ([13, 21, 22].includes(emplacement)) return 3;
  if ([15, 25, 26, 28].includes(emplacement)) return 4;
  return null;
}

const nombre = (v: string | undefined) => (Number.isFinite(Number(v)) ? Number(v) : 0);

/** Arme à lancer de sorts (bâtons et dagues de mage) : drapeau du jeu ITEM_FLAG2_CASTER_WEAPON. */
const ARME_DE_LANCEUR = 0x200;

export function calculer(s: Ligne, classe: number, sousClasse: number, t: TablesCaracteristiques): Calcul {
  const niveau = nombre(s.ItemLevel);
  const qualite = nombre(s.OverallQualityID);
  const emplacement = nombre(s.InventoryType);
  const resultat: Calcul = { caracteristiques: [], armure: null, degatsMin: null, degatsMax: null };

  // Bonus.
  const i = indiceEmplacement(emplacement);
  const budgets = t.budgets.get(niveau);
  if (i !== null && budgets) {
    const colonne = qualite >= 4 ? "Epic" : qualite === 3 ? "Superior" : "Good";
    const budget = nombre(budgets[`${colonne}_${i}`]);
    for (let k = 0; k < 10; k++) {
      const type = Math.trunc(nombre(s[`StatModifier_bonusStat_${k}`]));
      const part = nombre(s[`StatPercentEditor_${k}`]);
      if (type <= 0 && part <= 0) continue;
      const valeur = Math.round((budget * part) / 10000);
      if (valeur > 0 && type >= 0) resultat.caracteristiques.push({ type, valeur });
    }
  }

  // Dégâts des armes (classe 2), sauf légendaires et au-delà.
  const vitesse = nombre(s.ItemDelay) / 1000;
  if (classe === 2 && vitesse > 0 && qualite < 5) {
    const lanceur = (nombre(s.Flags_1) & ARME_DE_LANCEUR) !== 0;
    const table = sousClasse === 19 ? t.degats.baguette
      : emplacement === 25 || sousClasse === 16 ? t.degats.jet
      : [15, 26].includes(emplacement) ? t.degats.distance
      : emplacement === 17 ? (lanceur ? t.degats.deuxCaster : t.degats.deux)
      : lanceur ? t.degats.uneCaster : t.degats.une;
    const dps = nombre(table.get(niveau)?.[`Quality_${qualite}`]);
    if (dps > 0) {
      const variance = nombre(s.DmgVariance);
      const moyenne = dps * vitesse;
      resultat.degatsMin = Math.max(1, Math.floor(moyenne * (1 - variance / 2)));
      resultat.degatsMax = Math.max(resultat.degatsMin, Math.round(moyenne * (1 + variance / 2)));
    }
  }

  // Armure (classe 4) : tissu, cuir, mailles, plaques ; boucliers à part.
  if (classe === 4) {
    const colonnes: Record<number, [string, string]> = { 1: ["Cloth", "Clothmodifier"], 2: ["Leather", "Leathermodifier"], 3: ["Mail", "Chainmodifier"], 4: ["Plate", "Platemodifier"] };
    let armure = 0;
    if (colonnes[sousClasse]) {
      const [total, coef] = colonnes[sousClasse];
      armure = nombre(t.armureTotale.get(niveau)?.[total]) * nombre(t.armureEmplacement.get(emplacement)?.[coef]) * nombre(t.armureQualite.get(niveau)?.[`Qualitymod_${qualite}`]);
    } else if (sousClasse === 6) {
      armure = nombre(t.armureBouclier.get(niveau)?.[`Quality_${qualite}`]);
    }
    if (armure >= 1) resultat.armure = Math.round(armure);
  }
  return resultat;
}

/** Noms français des bonus (types de caractéristique du jeu). */
export const NOMS_CARACTERISTIQUES: Record<number, string> = {
  0: "Mana", 1: "Vie", 3: "Agilité", 4: "Force", 5: "Intelligence", 6: "Esprit", 7: "Endurance",
  12: "Score de défense", 13: "Score d'esquive", 14: "Score de parade", 15: "Score de blocage",
  31: "Score de toucher", 32: "Score de coup critique", 35: "Score de résilience", 36: "Score de hâte", 37: "Score d'expertise",
  38: "Puissance d'attaque", 39: "Puissance d'attaque à distance", 41: "Soins", 42: "Dégâts des sorts", 43: "Mana toutes les 5 s",
  45: "Puissance des sorts", 46: "Vie toutes les 5 s", 47: "Pénétration des sorts", 48: "Valeur de blocage", 50: "Armure supplémentaire",
  51: "Résistance au Feu", 52: "Résistance au Givre", 53: "Résistance au Sacré", 54: "Résistance à l'Ombre", 55: "Résistance à la Nature", 56: "Résistance aux Arcanes",
};

/** Les bonus principaux s'affichent en blanc (« +8 Endurance »), les autres en vert, comme dans le jeu. */
export function bonusPrincipal(type: number): boolean {
  return [0, 1, 3, 4, 5, 6, 7, 51, 52, 53, 54, 55, 56].includes(type);
}
