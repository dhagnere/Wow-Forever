import Link from "next/link";
import { CLASSES } from "@/content/classes";
import { combinaisons, guidesPassantPar, raceGuide } from "@/lib/guide";
import { IconeClasse } from "./IconeClasse";
import { IconeRace } from "./IconeRace";

/** Choix du guide de 1 à 60 par classe : chaque classe, puis la race qui la joue. */
export function ChoixGuideParClasse({ cta = "guide-accueil" }: { cta?: string }) {
  const c = combinaisons();
  return (
    <div className="choix-classes">
      {CLASSES.map((classe) => {
        const races = c.filter((x) => x.classe.slug === classe.slug).map((x) => x.race);
        if (!races.length) return null;
        return (
          <div key={classe.slug} className="choix-classe" style={{ ["--teinte" as string]: classe.couleur }}>
            <p className="choix-classe-titre">
              <IconeClasse slug={classe.slug} couleur={classe.couleur} taille={44} />
              <strong>{classe.nom}</strong>
            </p>
            <ul>
              {races.map((r) => (
                <li key={r.slug}>
                  <Link href={`/guides/parcours/${r.slug}/${classe.slug}/`} className="lien-icone" data-cta={cta}>
                    <IconeRace race={r.nom} taille={24} />
                    {r.nom}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

/** Encart d'une page de zone : suivre cette zone dans le guide de 1 à 60, pour chaque race et classe qui y passe. */
export function GuideDeLaZone({ lieu, nom }: { lieu: string; nom: string }) {
  const guides = guidesPassantPar(lieu);
  if (!guides.length) return null;
  return (
    <section id="guide-1-60" aria-labelledby="t-guide-zone" className="encadre-chaud guide-zone">
      <p className="surtitre" style={{ margin: 0 }}>Guide de 1 à 60</p>
      <h2 id="t-guide-zone" style={{ margin: "4px 0 6px", fontSize: 24 }}>Faire {nom} quête par quête</h2>
      <p style={{ margin: "0 0 14px" }}>
        Choisissez votre race et votre classe : le guide ouvre directement cette zone, avec les PNJ et les monstres sur la carte, la route tracée
        et votre progression à cocher.
      </p>
      <div className="guide-zone-races">
        {guides.map(({ race, classes }) => (
          <div key={race.slug} className="guide-zone-race">
            <span className="lien-icone" style={{ gap: 8 }}>
              <IconeRace race={race.nom} taille={28} />
              <strong>{raceGuide(race.slug)?.nom}</strong>
            </span>
            <span className="guide-zone-classes">
              {classes.map((cl) => {
                const c = CLASSES.find((x) => x.slug === cl)!;
                return (
                  <Link key={cl} href={`/guides/parcours/${race.slug}/${cl}/#zone-${lieu}`} title={`${race.nom} ${c.nom.toLowerCase()}`} aria-label={`Guide ${race.nom} ${c.nom.toLowerCase()}, ${nom}`} data-cta="guide-zone">
                    <IconeClasse slug={cl} couleur={c.couleur} taille={32} />
                  </Link>
                );
              })}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
