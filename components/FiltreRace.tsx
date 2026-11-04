"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

const ALLIANCE = ["Humain", "Nain", "Elfe de la nuit", "Gnome", "Human", "Dwarf", "Night Elf"];

/**
 * Filtre des quêtes de classe par race : masque les chaînes réservées à d'autres races (attribut data-races :
 * noms de races, « Alliance » ou « Horde » ; vide pour toutes). Sans JavaScript, tout reste affiché.
 */
export function FiltreRace({ races, children, langue = "fr" }: { races: string[]; children: ReactNode; langue?: "fr" | "en" }) {
  const [race, setRace] = useState("");
  const boite = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = boite.current;
    if (!el) return;
    const faction = race ? (ALLIANCE.includes(race) ? "Alliance" : "Horde") : "";
    el.querySelectorAll<HTMLElement>("[data-races]").forEach((c) => {
      const r = c.dataset.races ? c.dataset.races.split("|") : [];
      c.hidden = !!race && r.length > 0 && !r.includes(race) && !r.includes(faction);
    });
    // Une tranche dont toutes les chaînes sont masquées disparaît aussi.
    el.querySelectorAll<HTMLElement>("[data-tranche]").forEach((t) => {
      t.hidden = ![...t.querySelectorAll<HTMLElement>("[data-races]")].some((c) => !c.hidden);
    });
  }, [race]);

  return (
    <div ref={boite}>
      <p className="filtre-race">
        <label>
          {langue === "en" ? "My race:" : "Ma race :"}{" "}
          <select value={race} onChange={(e) => setRace(e.target.value)}>
            <option value="">{langue === "en" ? "All" : "Toutes"}</option>
            {races.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </label>
      </p>
      {children}
    </div>
  );
}
