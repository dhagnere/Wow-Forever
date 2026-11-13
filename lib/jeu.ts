/** Noms internes du jeu (UnitRace, UnitClass) pour les slugs du guide : partagés par l'addon et par /admin/probe. */

/** Race telle que la renvoie UnitRace("player") (deuxième valeur). Skyborne : à relever en jeu, guide ouvert à la faction. */
export const RACE_JEU: Record<string, string | null> = {
  humain: "Human",
  nain: "Dwarf",
  "elfe-de-la-nuit": "NightElf",
  gnome: "Gnome",
  orc: "Orc",
  "mort-vivant": "Scourge",
  tauren: "Tauren",
  troll: "Troll",
  "skyborne-alliance": null,
  "skyborne-horde": null,
};

/** Classe telle que la renvoie UnitClass("player") (deuxième valeur). */
export const CLASSE_JEU: Record<string, string> = {
  guerrier: "WARRIOR",
  paladin: "PALADIN",
  chasseur: "HUNTER",
  voleur: "ROGUE",
  pretre: "PRIEST",
  chaman: "SHAMAN",
  mage: "MAGE",
  demoniste: "WARLOCK",
  druide: "DRUID",
};
