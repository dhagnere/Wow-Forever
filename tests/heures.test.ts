import { describe, expect, it } from "vitest";
import { heureFr, instantParis, jourFr } from "@/lib/heures";

describe("heures à l'heure du visiteur", () => {
  it("convertit l'heure de Paris, changement d'heure compris", () => {
    // Novembre : Paris en UTC+1 ; juillet : UTC+2.
    expect(new Date(instantParis("2026-11-05T00:00")).toISOString()).toBe("2026-11-04T23:00:00.000Z");
    expect(new Date(instantParis("2027-07-01T20:30")).toISOString()).toBe("2027-07-01T18:30:00.000Z");
  });

  it("affiche la sortie à l'heure de Montréal, de Paris et de La Réunion", () => {
    const sortie = instantParis("2026-11-05T00:00");
    expect(`${jourFr(sortie, "America/Toronto")} à ${heureFr(sortie, "America/Toronto")}`).toBe("4 novembre 2026 à 18 h");
    expect(`${jourFr(sortie, "Europe/Paris")} à ${heureFr(sortie, "Europe/Paris")}`).toBe("5 novembre 2026 à minuit");
    expect(heureFr(sortie, "Indian/Reunion")).toBe("3 h");
    expect(heureFr(instantParis("2026-11-05T12:00"), "Europe/Brussels")).toBe("midi");
    expect(heureFr(instantParis("2026-11-05T18:30"), "Europe/Paris")).toBe("18 h 30");
  });
});
