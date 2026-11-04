"use client";

import { useEffect, useState } from "react";
import { FUSEAU_SITE, heureFr, instantParis, jourFr } from "@/lib/heures";

/**
 * Heure de Paris affichée à l'heure du visiteur. Le serveur (et un navigateur sans JavaScript) montre l'heure de Paris ;
 * dans un autre fuseau, le navigateur affiche l'heure locale, l'heure de Paris restant indiquée entre parenthèses.
 *  - « complet » : « 4 novembre 2026 à 18 h (minuit à Paris) »
 *  - « court »   : « 4 novembre · 18 h »
 *  - « jour »    : « 4 novembre »
 */
export function HeureLocale({ iso, format = "complet", langue = "fr" }: { iso: string; format?: "complet" | "court" | "jour"; langue?: "fr" | "en" }) {
  const instant = instantParis(iso);
  const [fuseau, setFuseau] = useState(FUSEAU_SITE);
  useEffect(() => {
    try {
      const f = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (f) setFuseau(f);
    } catch { /* fuseau inconnu : heure de Paris */ }
  }, []);
  const ailleurs = fuseau !== FUSEAU_SITE && (heureFr(instant, fuseau) !== heureFr(instant, FUSEAU_SITE) || jourFr(instant, fuseau) !== jourFr(instant, FUSEAU_SITE));
  const quand = (f: string, annee: boolean) => (format === "court" ? `${jourFr(instant, f, false)} · ${heureFr(instant, f)}` : format === "jour" ? jourFr(instant, f, false) : `${jourFr(instant, f, annee)} à ${heureFr(instant, f)}`);
  if (langue === "en") {
    const jour = (f: string) => new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: f }).format(instant);
    const heure = (f: string) => new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: f }).format(instant);
    const quandEn = (f: string) => (format === "court" ? `${jour(f)} · ${heure(f)}` : format === "jour" ? jour(f) : `${jour(f)} at ${heure(f)}`);
    return (
      <time dateTime={new Date(instant).toISOString()} title={ailleurs ? `${quandEn(FUSEAU_SITE)}, Paris time` : undefined}>
        {quandEn(fuseau)}
        {format === "complet" ? <span className="doux">{ailleurs ? ` your time (${heure(FUSEAU_SITE)} in Paris)` : " (Paris time)"}</span> : null}
      </time>
    );
  }
  return (
    <time dateTime={new Date(instant).toISOString()} title={ailleurs ? `${quand(FUSEAU_SITE, true)}, heure de Paris` : undefined}>
      {quand(fuseau, true)}
      {format === "complet" ? <span className="doux">{ailleurs ? ` chez vous (${heureFr(instant, FUSEAU_SITE)} à Paris)` : " (heure de Paris)"}</span> : null}
    </time>
  );
}
