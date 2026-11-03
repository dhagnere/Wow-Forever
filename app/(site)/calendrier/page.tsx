import type { Metadata } from "next";
import Link from "next/link";
import { ECHEANCES, MAJ_CALENDRIER } from "@/content/calendrier";
import { Ariane } from "@/components/Ariane";
import { dateLongue } from "@/lib/site";
import { fondBandeau } from "@/lib/ecrans";

export const metadata: Metadata = {
  title: "WoW Forever : date et heure de sortie, raids, Hardcore",
  description: "Sortie de WoW Forever le 5 novembre à minuit (heure de Paris), ouverture des raids le 9 décembre, mode Hardcore et contenus de l'été 2027.",
  alternates: { canonical: "/calendrier/" },
};

function quand(debut: string | null, periode?: string): string {
  if (!debut) return periode ?? "Date à annoncer";
  if (/^\d{4}-\d{2}-\d{2}$/.test(debut)) return dateLongue(`${debut}T12:00:00Z`);
  // Les heures sont déjà en heure de Paris.
  const [jour, heure] = debut.split("T");
  return `${dateLongue(`${jour}T12:00:00Z`)} à ${heure === "00:00" ? "minuit" : heure.replace(":", " h ")}`;
}

export default function Calendrier() {
  return (
    <>
      <section className="bandeau-page" style={fondBandeau("royaumes-de-l-est")}>
        <div className="wrap">
          <Ariane etapes={[{ nom: "Le Comptoir", href: "/actualites/" }, { nom: "Calendrier" }]} />
          <p className="surtitre">Le Comptoir · dates clés</p>
          <h1>Le calendrier de <span className="accent">WoW Forever</span></h1>
          <p className="chapo">Sortie, raids, Hardcore : toutes les dates annoncées, en heure de Paris. Ajoutez-les à votre agenda, il vous préviendra la veille.</p>
          <p className="doux" style={{ margin: "12px 0 0", fontSize: 14 }}>Mis à jour le {dateLongue(`${MAJ_CALENDRIER}T12:00:00Z`)} par Jobwow</p>
          <div className="actions-bandeau">
            <a href="/agenda-taverne.ics" className="btn btn-or" data-cta="agenda-ics">Ajouter à mon agenda</a>
            <Link href="/lettre/" className="btn btn-contour" data-cta="lettre-calendrier">Être prévenu par la Lettre</Link>
          </div>
        </div>
      </section>
      <div className="wrap contenu">
        <ol className="frise">
          {ECHEANCES.map((e) => (
            <li key={e.id} className={e.debut ? undefined : "frise-a-venir"}>
              <p className="surtitre">{quand(e.debut, e.periode)}</p>
              <h2>{e.titre}</h2>
              <p>{e.description}</p>
              <p><Link href={e.lien}>En savoir plus</Link></p>
            </li>
          ))}
        </ol>
        <p className="doux" style={{ fontSize: 14, maxWidth: 760 }}>
          Le fichier d&apos;agenda ne contient que les dates annoncées par Blizzard. Les autres y entreront dès leur annonce : un agenda abonné au
          fichier les recevra seul. Sur iPhone, ouvrez le lien dans Safari ; sur Android, importez le fichier dans Google Agenda.
        </p>
      </div>
    </>
  );
}
