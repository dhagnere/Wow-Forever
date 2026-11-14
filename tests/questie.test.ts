import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { blocsReleves, lireQuestie, lireValeurLua, nomsTraduits, sansCommentaires } from "@/modules/veille/scripts/_questie";

const QUETES = `local ForeverQuestTraces = QuestieLoader:CreateModule("ForeverQuestTraces")
function ForeverQuestTraces:Load()
    local questKeys = QuestieDB.questKeys
    return {
        [90902] = {
            [questKeys.name] = "Rediscovering the Light",
            [questKeys.questLevel] = 2,
            [questKeys.objectives] = {{{259377}}},
            [questKeys.objectivesText] = {"Texte du jeu, jamais repris."},
            [questKeys.startedBy_add] = {{244808}},
            [questKeys.finishedBy_add] = {{244808}},
        },
        [90813] = {
            [questKeys.name] = "Pay \\"Dirt\\"!",
            [questKeys.questLevel] = 53,
            [questKeys.objectives] = {nil,nil,{{243203}}},
            [questKeys.startedBy_add] = {nil,{651262}},
            [questKeys.requiredRaces] = 4294967373,
        },
    }
end`;
const RELATIONS = `function X:Load()
        [90813] = { -- Pay Dirt! https://wowhead.com/forever/quest=90813
            -- 90812 "Ignorée" https://wowhead.com/forever/quest=90812
            -- [questKeys.preQuestSingle] = {111},
            [questKeys.preQuestSingle] = {90902},
            [questKeys.nextQuestInChain] = 90999,
        },
end`;
const PNJ = `        [244808] = {
            [npcKeys.name] = "Aramis Hammerhand",
            [npcKeys.spawns] = {[85]={{31.01,66.24},{-1,-1}}},
            [npcKeys.zoneID] = 85,
            [npcKeys.friendlyToFaction] = "H",
            [npcKeys.friendlyToFaction] = "AH",
        },`;
const OBJETS = `        [243203] = {
            [itemKeys.name] = "Humongous Crystal",
            [itemKeys.npcDrops_add] = {3782,3784},
        },`;
const ZONES = `ZoneDB.private.areaIdToUiMapIdOverride = [[return {
    [0] = 0, -- Existing fail-safe
    [85] = 1420, -- Tirisfal Glades
}]]`;
const TITRES_FR = `l10n.questLookup["frFR"] = loadstring([[return {
[90902] = {"Redécouverte de la Lumière", {"Texte du jeu."}},
}]])`;

describe("relevés Questie (quêtes de Forever)", () => {
  it("lit les valeurs Lua littérales", () => {
    expect(lireValeurLua("{nil,{651262}}").valeur).toEqual([null, [651262]]);
    expect(lireValeurLua("{[85]={{31.01,66.24}}}").valeur).toEqual({ 85: [[31.01, 66.24]] });
    expect(lireValeurLua('"a \\"b\\""').valeur).toBe('a "b"');
  });

  it("ignore les commentaires, donc les liens Wowhead et les relations écartées", () => {
    expect(sansCommentaires('x = 1 -- https://wowhead.com\n-- [k] = 2\ny = "--pas un commentaire"')).toBe('x = 1 \n\ny = "--pas un commentaire"');
    const r = blocsReleves(RELATIONS).get(90813)!;
    expect(r.preQuestSingle).toEqual([90902]);
    expect(JSON.stringify(r)).not.toContain("wowhead");
  });

  it("garde le premier relevé d'un champ répété", () => {
    expect(blocsReleves(PNJ).get(244808)!.friendlyToFaction).toBe("H");
  });

  it("lit les titres traduits", () => {
    expect(nomsTraduits(TITRES_FR).get(90902)).toBe("Redécouverte de la Lumière");
  });

  it("assemble quêtes, PNJ, objets et cartes sans reprendre le texte des quêtes", async () => {
    const racine = await mkdtemp(path.join(os.tmpdir(), "questie-"));
    const traces = path.join(racine, "src/corrections/Forever/traces");
    const l10n = path.join(racine, "l10n/Forever/traces/lookupQuests");
    const zones = path.join(racine, "support/Forever/Zones");
    await Promise.all([mkdir(traces, { recursive: true }), mkdir(l10n, { recursive: true }), mkdir(zones, { recursive: true })]);
    await Promise.all([
      writeFile(path.join(traces, "foreverQuestTraces.lua"), QUETES),
      writeFile(path.join(traces, "foreverQuestRelationTraces.lua"), RELATIONS),
      writeFile(path.join(traces, "foreverNpcTraces.lua"), PNJ),
      writeFile(path.join(traces, "foreverObjectTraces.lua"), ""),
      writeFile(path.join(traces, "foreverItemTraces.lua"), OBJETS),
      writeFile(path.join(zones, "areaIdToUiMapId.lua"), ZONES),
      writeFile(path.join(l10n, "frFR.lua"), TITRES_FR),
    ]);
    const r = await lireQuestie(racine);
    const q = r.quetes.get(90902)!;
    expect(q).toMatchObject({ nom: "Redécouverte de la Lumière", niveau: 2, donneurs: { pnj: [244808] }, receveurs: { pnj: [244808] }, cibles: { pnj: [259377] } });
    expect(JSON.stringify(q)).not.toContain("Texte du jeu");
    expect(r.quetes.get(90813)).toMatchObject({ nom: 'Pay "Dirt"!', donneurs: { decor: [651262] }, cibles: { objets: [243203] }, prev: 90902, suite: 90999 });
    // Masque de races au-delà de 32 bits (Skyborne) : les races d'origine restent lisibles sur les bits bas.
    expect(r.quetes.get(90813)!.races & 0xff).toBe(1 | 4 | 8 | 64);
    // Le point {-1,-1} (dans une instance) est écarté.
    expect(r.pnj.get(244808)!.points).toEqual([[85, 31.01, 66.24]]);
    expect(r.objets.get(243203)!.pnj).toEqual([3782, 3784]);
    expect(r.uiMap.get(85)).toBe(1420);
    expect(r.uiMap.has(0)).toBe(false);
  });
});
