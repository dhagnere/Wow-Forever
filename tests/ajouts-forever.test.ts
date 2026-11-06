import { describe, expect, it, vi } from "vitest";
import { QUETES_FOREVER, SECTEUR_A_RELEVER, TITRE_EN_A_CONFIRMER } from "@/content/ajouts-forever";
import { avecAjoutsForever, guidePour, planifier, raceGuide } from "@/lib/guide";
import { carte } from "@/lib/cartes";
import { lireBlocRemarques } from "@/modules/veille/guides/relecture";

vi.mock("server-only", () => ({}));

describe("quêtes ajoutées par Forever", () => {
  it("ont un identifiant unique à partir de 9100001, une zone qui existe et une source", () => {
    const ids = QUETES_FOREVER.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const q of QUETES_FOREVER) {
      expect(q.id).toBeGreaterThanOrEqual(9100001);
      expect(carte(q.lieu), q.lieu).toBeTruthy();
      expect(q.source.length).toBeGreaterThan(10);
      for (const o of q.objectifs) expect(o).toMatch(/^(Rapporter|Vaincre|Parler|Explorer|Utiliser|Remettre|Escorter|Libérer)/);
    }
  });

  it("entrent dans le guide de leur faction, à leur place, et pas dans celui de l'autre faction", () => {
    const durotar = guidePour(raceGuide("orc")!, "chasseur")[0];
    const etape = durotar.etapes.find((e) => e.id === 9100001)!;
    expect(etape.t).toBe("Armes égarées");
    const saisie = QUETES_FOREVER.find((q) => q.id === 9100001)!;
    if (saisie.cibles?.length) expect(etape.cib).not.toBeNull();
    else expect(etape.obj[0]).toContain(SECTEUR_A_RELEVER.fr);
    const ordre = planifier(durotar).flatMap((a) => a.actions.map((x) => `${x.a}:${durotar.etapes[x.q].id}`));
    expect(ordre.indexOf("prendre:9100001")).toBeGreaterThan(ordre.indexOf("rendre:4641"));
    expect(ordre.indexOf("rendre:9100001")).toBeGreaterThan(ordre.indexOf("prendre:9100001"));
    for (const z of guidePour(raceGuide("humain")!, "guerrier")) expect(z.etapes.some((e) => e.id === 9100001)).toBe(false);
  });

  it("ne modifient pas les données en cache et signalent un titre anglais inconnu", () => {
    const z = guidePour(raceGuide("orc")!, "chasseur")[0];
    const sans = { ...z, etapes: z.etapes.filter((e) => e.id !== 9100001), hubs: z.hubs.map((h) => ({ ...h, n: [...h.n] })) };
    const avant = JSON.stringify(sans);
    const en = avecAjoutsForever(sans, "horde", "chasseur", "en");
    expect(JSON.stringify(sans)).toBe(avant);
    expect(en.etapes.find((e) => e.id === 9100001)!.t).toContain(TITRE_EN_A_CONFIRMER);
  });
});

describe("import de remarques dans la relecture", () => {
  it("lit une étape par ligne et ignore le reste", () => {
    expect(lireBlocRemarques("prendre:4641 | oui |\nprendre:788 | non | Gornek | après le rendu\nn'importe quoi\nfaire:12 | X")).toEqual([
      { etape: "prendre:4641", verifie: true, remarque: "" },
      { etape: "prendre:788", verifie: false, remarque: "Gornek | après le rendu" },
      { etape: "faire:12", verifie: true, remarque: "" },
    ]);
  });
});
