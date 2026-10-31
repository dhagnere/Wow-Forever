import { describe, expect, it } from "vitest";
import { classer, cleUrl, parleDeForever, regrouper, similarite } from "@/modules/veille/collecte/tri";
import type { Element } from "@/modules/veille/types";

const maintenant = new Date("2026-11-06T06:37:00Z");

function el(p: Partial<Element>): Element {
  return {
    sourceId: "wowhead", sourceNom: "Wowhead", langue: "en", poids: 3, video: false,
    titre: "WoW Forever: new dungeon Hall of Thanes datamined", url: "https://www.wowhead.com/news/1",
    resume: "", publieLe: new Date("2026-11-06T02:00:00Z"), ...p,
  };
}

describe("filtrage", () => {
  it("garde un sujet qui parle de Forever et du jeu", () => {
    expect(parleDeForever({ titre: "WoW Forever : la date de sortie", resume: "" })).toBe(true);
  });
  it("écarte un sujet sans rapport", () => {
    expect(parleDeForever({ titre: "Forever 21 ferme ses magasins", resume: "" })).toBe(false);
    expect(parleDeForever({ titre: "WoW Midnight patch notes", resume: "" })).toBe(false);
  });
  it("reconnaît le coréen", () => {
    expect(parleDeForever({ titre: "와우 포에버 신규 던전 공개", resume: "" })).toBe(true);
  });
});

describe("doublons", () => {
  it("normalise les URL de suivi", () => {
    expect(cleUrl("https://www.wowhead.com/news/1/?utm_source=x#top")).toBe(cleUrl("https://wowhead.com/news/1"));
  });
  it("rapproche deux titres sur le même sujet", () => {
    expect(similarite("New dungeon Hall of Thanes datamined in Forever", "Hall of Thanes dungeon datamined")).toBeGreaterThanOrEqual(0.5);
    expect(similarite("Skyborne racial abilities", "Hall of Thanes dungeon datamined")).toBe(0);
  });
  it("regroupe les reprises et ignore les URL identiques", () => {
    const groupes = regrouper([
      el({}),
      el({ sourceId: "blizzard-watch", sourceNom: "Blizzard Watch", poids: 2, url: "https://blizzardwatch.com/a", titre: "Hall of Thanes dungeon datamined for WoW Forever" }),
      el({ url: "https://www.wowhead.com/news/1?utm_campaign=rss" }),
      el({ url: "https://www.wowhead.com/news/2", titre: "Skyborne racial abilities revealed for WoW Forever" }),
    ]);
    expect(groupes).toHaveLength(2);
    expect(groupes[0]).toHaveLength(2);
  });
});

describe("score du jour", () => {
  it("place un sujet repris par trois sites devant une rumeur isolée", () => {
    const sujets = classer(
      [
        el({ sourceId: "reddit", sourceNom: "Reddit", poids: 1, url: "https://reddit.com/r/x", titre: "Rumor: WoW Forever hardcore servers delayed" }),
        el({}),
        el({ sourceId: "bw", sourceNom: "Blizzard Watch", poids: 2, url: "https://blizzardwatch.com/a", titre: "Hall of Thanes dungeon datamined for WoW Forever" }),
        el({ sourceId: "jh", sourceNom: "JudgeHype", langue: "fr", poids: 2, url: "https://judgehype.com/a", titre: "WoW Forever : le donjon Hall of Thanes datamined" }),
      ],
      maintenant,
      36,
    );
    expect(sujets[0].titre).toContain("Hall of Thanes");
    expect(sujets[0].score).toBeGreaterThan(sujets[1].score);
  });
  it("écarte les sujets de plus de 36 heures", () => {
    expect(classer([el({ publieLe: new Date("2026-11-04T00:00:00Z") })], maintenant, 36)).toHaveLength(0);
  });
  it("donne un bonus aux vidéos et aux sources étrangères", () => {
    const [video] = classer([el({ video: true })], maintenant, 36);
    const [fr] = classer([el({ langue: "fr" })], maintenant, 36);
    expect(video.detailScore.video).toBe(1.5);
    expect(video.detailScore.etranger).toBe(1);
    expect(fr.detailScore.etranger).toBe(0);
  });
});
