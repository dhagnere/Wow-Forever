/**
 * Heures et dates à l'heure du visiteur. Les dates du site sont écrites en heure de Paris (« 2026-11-05T00:00 ») ;
 * le navigateur les affiche dans son propre fuseau horaire. Fonctions pures, sans dépendance au navigateur.
 */

export const FUSEAU_SITE = "Europe/Paris";

/** Décalage (en minutes) d'un fuseau à un instant donné : heure locale − heure universelle. */
function decalage(fuseau: string, instant: number): number {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", { timeZone: fuseau, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })
      .formatToParts(new Date(instant)).map((x) => [x.type, x.value]),
  );
  const local = Date.UTC(Number(p.year), Number(p.month) - 1, Number(p.day), Number(p.hour) % 24, Number(p.minute));
  return Math.round((local - instant) / 60000);
}

/** Instant (ms) d'une heure de Paris écrite « AAAA-MM-JJTHH:MM », changement d'heure compris. */
export function instantParis(iso: string): number {
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(iso);
  if (!m) throw new Error(`Heure de Paris illisible : ${iso}`);
  const naif = Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]), Number(m[4]), Number(m[5]));
  // Deux passes : le décalage dépend de l'instant, qui dépend du décalage.
  let t = naif - decalage(FUSEAU_SITE, naif) * 60000;
  t = naif - decalage(FUSEAU_SITE, t) * 60000;
  return t;
}

/** « minuit », « 18 h », « 18 h 30 ». */
export function heureFr(instant: number, fuseau: string): string {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat("fr-FR", { timeZone: fuseau, hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(new Date(instant)).map((x) => [x.type, x.value]),
  );
  const h = Number(p.hour) % 24;
  const mn = Number(p.minute);
  if (h === 0 && mn === 0) return "minuit";
  if (h === 12 && mn === 0) return "midi";
  return mn ? `${h} h ${String(mn).padStart(2, "0")}` : `${h} h`;
}

/** « 5 novembre 2026 » (avec l'année) ou « 5 novembre ». */
export function jourFr(instant: number, fuseau: string, annee = true): string {
  return new Intl.DateTimeFormat("fr-FR", { timeZone: fuseau, day: "numeric", month: "long", ...(annee ? { year: "numeric" } : {}) }).format(new Date(instant));
}
