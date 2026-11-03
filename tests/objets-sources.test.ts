import { describe, expect, it } from "vitest";
import { calculer, indiceEmplacement, preparerTables } from "@/modules/veille/objets/caracteristiques";
import { ouTrouver } from "@/modules/veille/objets/butin";

/** Tables réduites au strict nécessaire, valeurs relevées dans les fichiers de Forever. */
function tables() {
  const csv = (entete: string, ...lignes: string[]) => [entete, ...lignes].join("\n");
  return preparerTables({
    RandPropPoints: csv("ID,Epic_0,Epic_1,Epic_2,Epic_3,Epic_4,Superior_0,Superior_1,Superior_2,Superior_3,Superior_4,Good_0,Good_1,Good_2,Good_3,Good_4", "80,54,41,31,23,17,43,32,24,18,14,33,24,18,14,10"),
    ItemDamageOneHand: csv("ID,ItemLevel,Quality_0,Quality_1,Quality_2,Quality_3,Quality_4,Quality_5,Quality_6", "1,63,0,0,0,0,0,0,0"),
    ItemDamageTwoHand: csv("ID,ItemLevel,Quality_0,Quality_1,Quality_2,Quality_3,Quality_4,Quality_5,Quality_6", "1,63,0,0,0,53.9,0,0,0"),
    ItemDamageRanged: "ID,ItemLevel", ItemDamageThrown: "ID,ItemLevel", ItemDamageWand: "ID,ItemLevel",
    ItemDamageOneHandCaster: "ID,ItemLevel", ItemDamageTwoHandCaster: "ID,ItemLevel",
    ItemArmorQuality: csv("ID,Qualitymod_0,Qualitymod_1,Qualitymod_2,Qualitymod_3,Qualitymod_4", "61,0,1,1,1,1.35"),
    ItemArmorTotal: csv("ID,ItemLevel,Cloth,Leather,Mail,Plate", "1,61,0,0,0,523.2"),
    ArmorLocation: csv("ID,Clothmodifier,Leathermodifier,Chainmodifier,Platemodifier,Modifier", "1,0.8,0.8,0.8,0.8,0"),
    ItemArmorShield: "ID,ItemLevel",
  });
}

describe("caractéristiques des objets", () => {
  it("calcule les bonus comme le jeu (Lame-tonnerre)", () => {
    const s = { ItemLevel: "80", OverallQualityID: "5", InventoryType: "13", StatModifier_bonusStat_0: "3", StatPercentEditor_0: "2174", StatModifier_bonusStat_1: "7", StatPercentEditor_1: "3478", ItemDelay: "1900" };
    const r = calculer(s, 2, 7, tables());
    expect(r.caracteristiques).toEqual([{ type: 3, valeur: 5 }, { type: 7, valeur: 8 }]);
    expect(r.degatsMin).toBeNull(); // légendaire : dégâts propres, non calculés
  });

  it("calcule les dégâts d'une arme à deux mains et l'armure d'une pièce de plaques", () => {
    const reaper = calculer({ ItemLevel: "63", OverallQualityID: "3", InventoryType: "17", ItemDelay: "3800", DmgVariance: "0.5" }, 2, 1, tables());
    expect([reaper.degatsMin, reaper.degatsMax]).toEqual([153, 256]);
    const heaume = calculer({ ItemLevel: "61", OverallQualityID: "4", InventoryType: "1" }, 4, 4, tables());
    expect(heaume.armure).toBe(565);
  });

  it("range chaque emplacement dans la bonne colonne de budget", () => {
    expect(indiceEmplacement(1)).toBe(0);
    expect(indiceEmplacement(12)).toBe(1);
    expect(indiceEmplacement(16)).toBe(2);
    expect(indiceEmplacement(13)).toBe(3);
    expect(indiceEmplacement(15)).toBe(4);
    expect(indiceEmplacement(0)).toBeNull();
  });
});

describe("où trouver un objet", () => {
  it("donne les monstres, leur taux et leur position sur la carte", () => {
    const o = ouTrouver(1476)!; // Patte d'araignée cassée
    expect(o.monstres.length).toBeGreaterThan(3);
    expect(o.monstres[0].chance).toBeGreaterThan(40);
    expect(o.monstres.some((m) => m.zones.length && m.zones[0].points.every(([x, y]) => x >= 0 && x <= 100 && y >= 0 && y <= 100))).toBe(true);
  });

  it("place Lardeur dans la forêt d'Elwynn, pas dans la zone voisine, et lit les quêtes", () => {
    const lardeur = ouTrouver(1931)?.monstres.find((m) => m.id === 448);
    expect(lardeur?.zones[0]?.lieu).toBe("foret-d-elwynn");
    const lames = ouTrouver(19019)!; // Lame-tonnerre : récompense de quête
    expect(lames.quetes[0].titre).toMatch(/Lame-tonnerre/i);
  });
});
