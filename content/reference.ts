/**
 * Repères de l'Azeroth d'origine (WoW Classic), dont Forever reprend la carte.
 * Niveaux indicatifs : ils varient légèrement selon les guides et peuvent changer dans Forever.
 * À compléter avec les résultats des dossiers de la veille (npm run veille:dossier) et les relevés en jeu.
 * Les éléments propres à Forever reprennent les informations déjà publiées sur le site (bêta 1.60.1).
 */

export const MISE_A_JOUR_REFERENCE = "2026-11-01";

export type Continent = "Royaumes de l'Est" | "Kalimdor" | "[À confirmer]";

export interface ZoneDepart {
  races: string;
  faction: "Alliance" | "Horde" | "Alliance ou Horde";
  lieu: string;
  zone: string;
  capitale: string;
  continent: Continent;
  lien?: string;
  forever?: boolean;
}

export const ZONES_DEPART: ZoneDepart[] = [
  { races: "Humains", faction: "Alliance", lieu: "Vallée de Northshire", zone: "Forêt d'Elwynn", capitale: "Hurlevent", continent: "Royaumes de l'Est" },
  { races: "Nains et Gnomes", faction: "Alliance", lieu: "Vallée de Frigecrête (Coldridge Valley) [nom français à vérifier]", zone: "Dun Morogh", capitale: "Forgefer", continent: "Royaumes de l'Est" },
  { races: "Elfes de la nuit", faction: "Alliance", lieu: "Sombrevallon (Shadowglen)", zone: "Teldrassil", capitale: "Darnassus", continent: "Kalimdor" },
  { races: "Orcs et Trolls", faction: "Horde", lieu: "Vallée des Épreuves", zone: "Durotar", capitale: "Orgrimmar", continent: "Kalimdor" },
  { races: "Taurens", faction: "Horde", lieu: "Camp Narache", zone: "Mulgore", capitale: "Les Pitons-du-Tonnerre", continent: "Kalimdor" },
  { races: "Morts-vivants", faction: "Horde", lieu: "Le Glas (Deathknell)", zone: "Clairières de Tirisfal", capitale: "Fossoyeuse", continent: "Royaumes de l'Est" },
  { races: "Skyborne", faction: "Alliance ou Horde", lieu: "Village de Thendal", zone: "Île de Zéphras (une version par faction)", capitale: "[À confirmer]", continent: "[À confirmer]", lien: "/zones/ile-de-zephras/", forever: true },
];

export interface ZoneNiveau {
  nom: string;
  min: number;
  max: number;
  continent: Continent;
  lien?: string;
  forever?: boolean;
  /** Niveaux non confirmés. */
  incertain?: boolean;
}

export const ZONES_NIVEAUX: ZoneNiveau[] = [
  { nom: "Forêt d'Elwynn", min: 1, max: 10, continent: "Royaumes de l'Est" },
  { nom: "Dun Morogh", min: 1, max: 10, continent: "Royaumes de l'Est" },
  { nom: "Clairières de Tirisfal", min: 1, max: 10, continent: "Royaumes de l'Est" },
  { nom: "Teldrassil", min: 1, max: 10, continent: "Kalimdor" },
  { nom: "Durotar", min: 1, max: 10, continent: "Kalimdor" },
  { nom: "Mulgore", min: 1, max: 10, continent: "Kalimdor" },
  { nom: "Île de Zéphras", min: 1, max: 10, continent: "[À confirmer]", lien: "/zones/ile-de-zephras/", forever: true, incertain: true },
  { nom: "Marche de l'Ouest", min: 10, max: 20, continent: "Royaumes de l'Est" },
  { nom: "Loch Modan", min: 10, max: 20, continent: "Royaumes de l'Est" },
  { nom: "Forêt des Pins-Argentés", min: 10, max: 20, continent: "Royaumes de l'Est" },
  { nom: "Sombrivage", min: 10, max: 20, continent: "Kalimdor" },
  { nom: "Les Tarides", min: 10, max: 25, continent: "Kalimdor" },
  { nom: "Les Carmines", min: 15, max: 25, continent: "Royaumes de l'Est" },
  { nom: "Les Serres-Rocheuses", min: 15, max: 27, continent: "Kalimdor" },
  { nom: "Ashenvale", min: 18, max: 30, continent: "Kalimdor" },
  { nom: "Bois de la Pénombre", min: 18, max: 30, continent: "Royaumes de l'Est" },
  { nom: "Les Paluns", min: 20, max: 30, continent: "Royaumes de l'Est" },
  { nom: "Contreforts de Hautebrande (Hillsbrad)", min: 20, max: 30, continent: "Royaumes de l'Est" },
  { nom: "Mille pointes", min: 25, max: 35, continent: "Kalimdor" },
  { nom: "Désolace", min: 30, max: 40, continent: "Kalimdor" },
  { nom: "Hautes-terres d'Arathi", min: 30, max: 40, continent: "Royaumes de l'Est" },
  { nom: "Montagnes d'Alterac", min: 30, max: 40, continent: "Royaumes de l'Est" },
  { nom: "Vallée de Strangleronce", min: 30, max: 45, continent: "Royaumes de l'Est" },
  { nom: "Rives Claires", min: 35, max: 45, continent: "[À confirmer]", lien: "/zones/rives-claires/", forever: true, incertain: true },
  { nom: "Marécage d'Âprefange", min: 35, max: 45, continent: "Kalimdor" },
  { nom: "Terres ingrates", min: 35, max: 45, continent: "Royaumes de l'Est" },
  { nom: "Marais des Chagrins", min: 35, max: 45, continent: "Royaumes de l'Est" },
  { nom: "Féralas", min: 40, max: 50, continent: "Kalimdor" },
  { nom: "Les Hinterlands", min: 40, max: 50, continent: "Royaumes de l'Est" },
  { nom: "Tanaris", min: 40, max: 50, continent: "Kalimdor" },
  { nom: "Gorge des Vents brûlants", min: 43, max: 50, continent: "Royaumes de l'Est" },
  { nom: "Azshara", min: 45, max: 55, continent: "Kalimdor" },
  { nom: "Terres foudroyées", min: 45, max: 55, continent: "Royaumes de l'Est" },
  { nom: "Cratère d'Un'Goro", min: 48, max: 55, continent: "Kalimdor" },
  { nom: "Gangrebois", min: 48, max: 55, continent: "Kalimdor" },
  { nom: "Steppes ardentes", min: 50, max: 58, continent: "Royaumes de l'Est" },
  { nom: "Maleterres de l'Ouest", min: 51, max: 58, continent: "Royaumes de l'Est" },
  { nom: "Maleterres de l'Est", min: 53, max: 60, continent: "Royaumes de l'Est" },
  { nom: "Berceau-de-l'Hiver", min: 55, max: 60, continent: "Kalimdor" },
  { nom: "Silithus", min: 55, max: 60, continent: "Kalimdor" },
  { nom: "Défilé de Deuillevent", min: 55, max: 60, continent: "Royaumes de l'Est" },
  { nom: "Mont Hyjal", min: 60, max: 60, continent: "Kalimdor", lien: "/zones/mont-hyjal/", forever: true },
];

/** Zones dont les niveaux ne sont pas encore connus. */
export const ZONES_SANS_NIVEAU: { nom: string; lien: string }[] = [{ nom: "Shen'dralar", lien: "/zones/shendralar/" }];

export const TRANCHES: [number, number][] = [[1, 10], [10, 20], [20, 30], [30, 40], [40, 50], [50, 60]];

/** Tranche d'une zone ou d'un donjon : celle où commence sa fourchette de niveaux (le niveau 60 compte dans 50–60). */
export function dansTranche(min: number, [a, b]: [number, number]): boolean {
  return min >= a && (b === 60 ? min <= 60 : min < b);
}

export interface DonjonReference {
  nom: string;
  min: number;
  max: number;
  zone: string;
  continent: Continent;
  lien?: string;
}

export const DONJONS_ORIGINE: DonjonReference[] = [
  { nom: "Gouffre de Ragefeu", min: 13, max: 18, zone: "Orgrimmar", continent: "Kalimdor" },
  { nom: "Les Mortemines", min: 17, max: 26, zone: "Marche de l'Ouest", continent: "Royaumes de l'Est" },
  { nom: "Cavernes des Lamentations", min: 17, max: 24, zone: "Les Tarides", continent: "Kalimdor" },
  { nom: "Donjon d'Ombrecroc", min: 22, max: 30, zone: "Forêt des Pins-Argentés", continent: "Royaumes de l'Est" },
  { nom: "Profondeurs de Brassenoire", min: 24, max: 32, zone: "Ashenvale", continent: "Kalimdor" },
  { nom: "La Prison", min: 24, max: 32, zone: "Hurlevent", continent: "Royaumes de l'Est" },
  { nom: "Gnomeregan", min: 29, max: 38, zone: "Dun Morogh", continent: "Royaumes de l'Est" },
  { nom: "Kraal de Tranchebauge", min: 29, max: 38, zone: "Les Tarides", continent: "Kalimdor" },
  { nom: "Monastère écarlate", min: 34, max: 45, zone: "Clairières de Tirisfal", continent: "Royaumes de l'Est" },
  { nom: "Souilles de Tranchebauge", min: 37, max: 46, zone: "Les Tarides", continent: "Kalimdor" },
  { nom: "Uldaman", min: 41, max: 51, zone: "Terres ingrates", continent: "Royaumes de l'Est" },
  { nom: "Zul'Farrak", min: 44, max: 54, zone: "Tanaris", continent: "Kalimdor" },
  { nom: "Maraudon", min: 46, max: 55, zone: "Désolace", continent: "Kalimdor" },
  { nom: "Temple d'Atal'Hakkar", min: 50, max: 56, zone: "Marais des Chagrins", continent: "Royaumes de l'Est" },
  { nom: "Profondeurs de Rochenoire", min: 52, max: 60, zone: "Mont Rochenoire", continent: "Royaumes de l'Est" },
  { nom: "Pic de Rochenoire (inférieur et supérieur)", min: 55, max: 60, zone: "Mont Rochenoire", continent: "Royaumes de l'Est" },
  { nom: "Hache-Tripes", min: 55, max: 60, zone: "Féralas", continent: "Kalimdor" },
  { nom: "Scholomance", min: 58, max: 60, zone: "Maleterres de l'Ouest", continent: "Royaumes de l'Est" },
  { nom: "Stratholme", min: 58, max: 60, zone: "Maleterres de l'Est", continent: "Royaumes de l'Est" },
];

export interface RaidReference {
  nom: string;
  joueurs: string;
  zone: string;
  statut: string;
  lien?: string;
}

export const RAIDS: RaidReference[] = [
  { nom: "[Raid du Mont Hyjal, nom à confirmer]", joueurs: "20", zone: "Mont Hyjal", statut: "Annoncé dans Forever, ouverture prévue en décembre (date à confirmer)", lien: "/zones/mont-hyjal/" },
  { nom: "Repaire d'Onyxia", joueurs: "40 dans l'Azeroth d'origine", zone: "Marécage d'Âprefange", statut: "Présence dans Forever non confirmée" },
  { nom: "Cœur du Magma", joueurs: "40 dans l'Azeroth d'origine", zone: "Mont Rochenoire", statut: "Présence dans Forever non confirmée" },
  { nom: "Repaire de l'Aile noire", joueurs: "40 dans l'Azeroth d'origine", zone: "Mont Rochenoire", statut: "Présence dans Forever non confirmée" },
  { nom: "Zul'Gurub", joueurs: "20 dans l'Azeroth d'origine", zone: "Vallée de Strangleronce", statut: "Présence dans Forever non confirmée" },
  { nom: "Ruines d'Ahn'Qiraj", joueurs: "20 dans l'Azeroth d'origine", zone: "Silithus", statut: "Présence dans Forever non confirmée" },
  { nom: "Temple d'Ahn'Qiraj", joueurs: "40 dans l'Azeroth d'origine", zone: "Silithus", statut: "Présence dans Forever non confirmée" },
  { nom: "Naxxramas", joueurs: "40 dans l'Azeroth d'origine", zone: "Maleterres de l'Est", statut: "Présence dans Forever non confirmée" },
];
