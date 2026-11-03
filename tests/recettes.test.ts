import { describe, expect, it } from "vitest";
import { convertirRecettes } from "@/modules/veille/objets/conversion";

describe("recettes des métiers", () => {
  const t = {
    SkillLine: "DisplayName_lang,ID,CategoryID\nForge,164,11\nTest Profession [DNT],999,11\nArcane,237,7",
    SkillLineAbility: "ID,SkillLine,Spell,MinSkillLineRank,TrivialSkillLineRankLow,TrivialSkillLineRankHigh\n1,164,16994,1,320,340\n2,237,5000,1,0,0\n3,999,6000,1,0,0",
    SpellEffect: "ID,Effect,EffectItemType,EffectTriggerSpell,EffectBasePointsF,SpellID\n1,24,12784,0,1,16994\n2,24,12784,0,1,5000\n3,24,12784,0,1,6000",
    SpellReagents: "ID,SpellID,Reagent_0,Reagent_1,ReagentCount_0,ReagentCount_1\n1,16994,12360,12810,20,6",
    SpellName: "ID,Name_lang\n16994,Déchireuse en arcanite",
    ItemEffect: "ID,TriggerType,SpellID\n77,6,16994",
    ItemXItemEffect: "ID,ItemEffectID,ItemID\n1,77,12835",
    ItemSparse: "ID,RequiredSkillRank\n12835,300\n12784,0",
  };
  it("lit le métier, les composants, les paliers et les plans qui l'apprennent", () => {
    const r = convertirRecettes(t, new Set([12784, 12360, 12810, 12835]));
    expect(r).toEqual([{
      sort: 16994, nom: "Déchireuse en arcanite", objet: 12784, quantite: 1, metier: "Forge", rang: 300, jaune: 320, gris: 340,
      composants: [{ o: 12360, n: 20 }, { o: 12810, n: 6 }], recette: 12835,
    }]);
  });
  it("écarte les sorts de classe, les métiers de test et les objets absents de Forever", () => {
    expect(convertirRecettes(t, new Set([12360]))).toEqual([]);
  });
});
