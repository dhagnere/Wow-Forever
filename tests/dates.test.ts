import { describe, expect, it } from "vitest";
import { dateCourte, dateLongue } from "@/lib/site";

describe("dates en français", () => {
  it("écrit « 1er » pour le premier du mois", () => {
    expect(dateLongue("2026-11-01T12:00:00Z")).toBe("1er novembre 2026");
    expect(dateCourte("2026-11-01T12:00:00Z")).toMatch(/^1er nov/);
  });
  it("ne touche pas aux autres jours", () => {
    expect(dateLongue("2026-11-11T12:00:00Z")).toBe("11 novembre 2026");
    expect(dateLongue("2026-11-21T12:00:00Z")).toBe("21 novembre 2026");
  });
});
