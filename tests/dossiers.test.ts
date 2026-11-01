import { describe, expect, it } from "vitest";
import { DOSSIERS, FENETRE_DOSSIERS_HEURES } from "@/config/dossiers";
import { SOURCES } from "@/config/sources";

describe("dossiers de référence", () => {
  it("couvre zones de départ, donjons et zones par niveau", () => {
    expect(DOSSIERS.map((d) => d.id)).toEqual(["zones-depart", "donjons", "zones-niveaux"]);
  });
  it("donne des identifiants uniques, distincts des sources quotidiennes, et un thème à chaque recherche", () => {
    const ids = DOSSIERS.flatMap((d) => d.sources.map((s) => s.id));
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.some((id) => SOURCES.some((s) => s.id === id))).toBe(false);
    expect(DOSSIERS.flatMap((d) => d.sources).every((s) => s.theme && s.url.startsWith("https://news.google.com/rss/search?q="))).toBe(true);
  });
  it("cherche sur 60 jours", () => {
    expect(FENETRE_DOSSIERS_HEURES).toBe(1440);
  });
});
