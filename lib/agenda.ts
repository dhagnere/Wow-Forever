import { ECHEANCES, type Echeance } from "@/content/calendrier";

/** Échappement des textes du format iCalendar (RFC 5545). */
function echapper(t: string): string {
  return t.replace(/\\/g, "\\\\").replace(/;/g, "\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
}

/** Lignes de plus de 75 octets repliées, comme l'exige le format. */
function plier(ligne: string): string {
  const morceaux: string[] = [];
  let reste = ligne;
  while (Buffer.byteLength(reste) > 75) {
    let n = 75;
    while (Buffer.byteLength(reste.slice(0, n)) > 75) n--;
    morceaux.push(reste.slice(0, n));
    reste = ` ${reste.slice(n)}`;
  }
  morceaux.push(reste);
  return morceaux.join("\r\n");
}

function horodatage(d: Date): string {
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function lignesEvenement(e: Echeance, siteUrl: string, maintenant: Date): string[] {
  if (!e.debut) return [];
  const url = `${siteUrl}${e.lien}`;
  const journee = /^\d{4}-\d{2}-\d{2}$/.test(e.debut);
  const date = e.debut.replace(/-/g, "").replace(/:/g, "");
  const lignes = [
    "BEGIN:VEVENT",
    `UID:${e.id}@taverne-eternelle`,
    `DTSTAMP:${horodatage(maintenant)}`,
    journee ? `DTSTART;VALUE=DATE:${date}` : `DTSTART;TZID=Europe/Paris:${date}00`,
    journee ? "" : "DURATION:PT1H",
    `SUMMARY:${echapper(`${e.titre} — WoW Forever`)}`,
    `DESCRIPTION:${echapper(`${e.description}\nTout le détail à la Taverne : ${url}`)}`,
    `URL:${url}`,
    // Rappel la veille : l'agenda renvoie vers la Taverne à chaque échéance.
    "BEGIN:VALARM", "ACTION:DISPLAY", `DESCRIPTION:${echapper(e.titre)}`, "TRIGGER:-P1D", "END:VALARM",
    "END:VEVENT",
  ];
  return lignes.filter(Boolean);
}

/** Fichier .ics des dates annoncées, à ajouter en un clic à l'agenda du téléphone. */
export function fichierAgenda(siteUrl: string, maintenant = new Date()): string {
  const lignes = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//La Taverne Eternelle//Calendrier WoW Forever//FR",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:WoW Forever — La Taverne Éternelle",
    "X-WR-TIMEZONE:Europe/Paris",
    "BEGIN:VTIMEZONE", "TZID:Europe/Paris",
    "BEGIN:STANDARD", "DTSTART:19701025T030000", "RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU", "TZOFFSETFROM:+0200", "TZOFFSETTO:+0100", "TZNAME:CET", "END:STANDARD",
    "BEGIN:DAYLIGHT", "DTSTART:19700329T020000", "RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU", "TZOFFSETFROM:+0100", "TZOFFSETTO:+0200", "TZNAME:CEST", "END:DAYLIGHT",
    "END:VTIMEZONE",
    ...ECHEANCES.flatMap((e) => lignesEvenement(e, siteUrl, maintenant)),
    "END:VCALENDAR",
  ];
  return lignes.map(plier).join("\r\n") + "\r\n";
}
