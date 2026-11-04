import type { Metadata } from "next";
import Link from "next/link";
import { ECHEANCES, MAJ_CALENDRIER } from "@/content/calendrier";
import { Ariane } from "@/components/Ariane";
import { HeureLocale } from "@/components/HeureLocale";
import { fondBandeau } from "@/lib/ecrans";
import { cheminAnglais } from "@/lib/anglais";

export const metadata: Metadata = {
  title: "WoW Forever: launch date and time, raids, Hardcore",
  description: "WoW Forever launches on 5 November at midnight (Paris time), raids open on 9 December, then Hardcore mode and summer 2027 content.",
  alternates: { canonical: "/en/calendar/", languages: { fr: "/calendrier/", en: "/en/calendar/", "x-default": "/calendrier/" } },
};

const dateEn = (iso: string) => new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Paris" }).format(new Date(iso));

function quand(debut: string | null, periode?: string) {
  if (!debut) return periode ?? "Date to be announced";
  if (/^\d{4}-\d{2}-\d{2}$/.test(debut)) return dateEn(`${debut}T12:00:00Z`);
  // Heure de Paris, affichée à l'heure du visiteur.
  return <HeureLocale iso={debut} langue="en" />;
}

/** Lien de l'échéance vers la page anglaise quand elle existe (ancre comprise). */
function lienEn(lien: string) {
  const [chemin, ancre] = lien.split("#");
  return `${cheminAnglais(chemin) ?? chemin}${ancre ? `#${ancre}` : ""}`;
}

export default function CalendarEn() {
  return (
    <>
      <section className="bandeau-page" style={fondBandeau("royaumes-de-l-est")}>
        <div className="wrap">
          <Ariane langue="en" etapes={[{ nom: "News", href: "/en/news/" }, { nom: "Calendar" }]} />
          <p className="surtitre">The Bar · key dates</p>
          <h1>The <span className="accent">WoW Forever</span> calendar</h1>
          <p className="chapo">Launch, raids, Hardcore: every announced date, in your own time zone. Add them to your calendar, it will remind you the day before.</p>
          <p className="doux" style={{ margin: "12px 0 0", fontSize: 14 }}>Updated on {dateEn(`${MAJ_CALENDRIER}T12:00:00Z`)} by Jobwow</p>
          <div className="actions-bandeau">
            <a href="/en/tavern-calendar.ics" className="btn btn-or" data-cta="agenda-ics-en">Add to my calendar</a>
            <Link href="/en/newsletter/" className="btn btn-contour" data-cta="lettre-calendrier-en">Get notified by the newsletter</Link>
          </div>
        </div>
      </section>
      <div className="wrap contenu">
        <ol className="frise">
          {ECHEANCES.map((e) => (
            <li key={e.id} className={e.debut ? undefined : "frise-a-venir"}>
              <p className="surtitre">{quand(e.debut, e.en.periode)}</p>
              <h2>{e.en.titre}</h2>
              <p>{e.en.description}</p>
              <p><Link href={lienEn(e.lien)}>Find out more</Link></p>
            </li>
          ))}
        </ol>
        <p className="doux" style={{ fontSize: 14, maxWidth: 760 }}>
          The calendar file only contains dates announced by Blizzard. The others will be added as soon as they are announced: a calendar
          subscribed to the file will receive them automatically. On iPhone, open the link in Safari; on Android, import the file into Google Calendar.
        </p>
      </div>
    </>
  );
}
