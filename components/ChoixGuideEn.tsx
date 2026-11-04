import Link from "next/link";
import { CLASSES } from "@/content/classes";
import { combinaisons, guidesPassantPar, RACES_GUIDE } from "@/lib/guide";
import { lienGuideEn, nomClasseEn, nomRaceEn, ORDRES_EN } from "@/lib/anglais";
import { IconeClasse } from "./IconeClasse";
import { IconeRace } from "./IconeRace";

/** Choix du guide de 1 à 60 (version anglaise) : chaque classe, puis la race qui la joue. */
export function ChoixGuideParClasseEn({ cta = "guide-accueil-en" }: { cta?: string }) {
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
              <strong>{nomClasseEn(classe.slug)}</strong>
            </p>
            <ul>
              {races.map((r) => (
                <li key={r.slug}>
                  <Link href={lienGuideEn(r.slug, classe.slug)} className="lien-icone" data-cta={cta}>
                    <IconeRace race={r.nom} taille={24} />
                    {nomRaceEn(r.slug)}
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

/** Choix par race, puis classe. */
export function ChoixGuideParRaceEn() {
  return (
    <div className="choix-guide">
      {RACES_GUIDE.map((r) => (
        <div key={r.slug} className="choix-race">
          <p className="lien-icone" style={{ gap: 10, margin: "0 0 8px" }}>
            <IconeRace race={r.nom} taille={36} />
            <strong>{r.skyborne ? `Skyborne, ${ORDRES_EN[r.faction]}` : nomRaceEn(r.slug)}</strong> <span className="doux">· {r.faction === "alliance" ? "Alliance" : "Horde"}</span>
          </p>
          <ul>
            {combinaisons().filter((c) => c.race.slug === r.slug).map(({ classe }) => (
              <li key={classe.slug}>
                <Link href={lienGuideEn(r.slug, classe.slug)} className="lien-icone" data-cta="guide-choix-en">
                  <IconeClasse slug={classe.slug} couleur={classe.couleur} taille={28} />
                  {nomClasseEn(classe.slug)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

/** Encart d'une page de zone (version anglaise) : suivre cette zone dans le guide de 1 à 60. */
export function GuideDeLaZoneEn({ lieu, nom }: { lieu: string; nom: string }) {
  const guides = guidesPassantPar(lieu);
  if (!guides.length) return null;
  return (
    <section id="guide-1-60" aria-labelledby="t-guide-zone" className="encadre-chaud guide-zone">
      <p className="surtitre" style={{ margin: 0 }}>Leveling guide 1-60</p>
      <h2 id="t-guide-zone" style={{ margin: "4px 0 6px", fontSize: 24 }}>Do {nom} quest by quest</h2>
      <p style={{ margin: "0 0 14px" }}>
        Pick your race and class: the guide opens this zone directly, with NPCs and monsters on the map, the route drawn and your progress to tick.
      </p>
      <div className="guide-zone-races">
        {guides.map(({ race, classes }) => (
          <div key={race.slug} className="guide-zone-race">
            <span className="lien-icone" style={{ gap: 8 }}>
              <IconeRace race={race.nom} taille={28} />
              <strong>{nomRaceEn(race.slug)}</strong>
            </span>
            <span className="guide-zone-classes">
              {classes.map((cl) => {
                const c = CLASSES.find((x) => x.slug === cl)!;
                const titre = `${nomRaceEn(race.slug)} ${nomClasseEn(cl)}`;
                return (
                  <Link key={cl} href={`${lienGuideEn(race.slug, cl)}#zone-${lieu}`} title={titre} aria-label={`${titre} guide, ${nom}`} data-cta="guide-zone-en">
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
