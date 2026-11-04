import type { Metadata } from "next";
import Link from "next/link";
import { RACES_ORIGINE } from "@/content/monde";
import { Ariane } from "@/components/Ariane";
import { IconesRace } from "@/components/IconeRace";
import { TraitsRaciaux } from "@/components/TraitsRaciaux";
import { fondBandeau } from "@/lib/ecrans";
import { slugRace, traitsDeRace, versionSorts } from "@/lib/sorts";
import { FACTIONS_CAPACITES_EN, nomRaceEn } from "@/lib/anglais";

export const metadata: Metadata = {
  title: "WoW Forever races and racial traits",
  description: "The playable races of World of Warcraft: Forever and their racial traits, read from the game files, including the Skyborne, a new race open to both the Alliance and the Horde.",
  alternates: { canonical: "/en/races/", languages: { fr: "/races/", en: "/en/races/", "x-default": "/races/" } },
};

export default function RacesEn() {
  return (
    <>
      <section className="bandeau-page" style={fondBandeau("ile-de-zephras")}>
        <div className="wrap">
          <Ariane langue="en" etapes={[{ nom: "Races" }]} />
          <p className="surtitre">The Register · Races</p>
          <h1>The races of WoW Forever</h1>
          <p className="chapo">Eight races from original Azeroth, and a newcomer: the Skyborne, open to the Alliance and the Horde.</p>
        </div>
      </section>
      <div className="wrap contenu">
        <h2 className="section-titre" style={{ fontSize: 26 }}>Racial traits</h2>
        <p className="doux" style={{ marginTop: 0 }}>
          Each race&apos;s abilities, active then passive, as described in Forever&apos;s game files. Several are new compared to original Azeroth,
          and some change with your class.
        </p>
        <div className="races-traits">
          {RACES_ORIGINE.map((r) => {
            const slug = slugRace(r.nom);
            return (
              <article key={r.nom} id={slug} className="race-traits">
                <header className="lien-icone">
                  <IconesRace race={r.nom} taille={44} />
                  <div>
                    <h3>{nomRaceEn(slug)}</h3>
                    <p className="sort-meta">{r.faction}</p>
                  </div>
                </header>
                <TraitsRaciaux langue="en" traits={traitsDeRace(slug, "en")} />
              </article>
            );
          })}
          <article id="skyborne" className="race-traits">
            <header className="lien-icone">
              <IconesRace race="Skyborne" taille={44} />
              <div>
                <h3><Link href="/en/races/skyborne/">Skyborne</Link></h3>
                <p className="sort-meta">Alliance or Horde</p>
              </div>
            </header>
            <TraitsRaciaux langue="en" traits={traitsDeRace("skyborne", "en")} factions={FACTIONS_CAPACITES_EN} />
          </article>
        </div>
        <p className="doux note-donnees">
          Data read from the game files thanks to <a href="https://wago.tools" rel="noopener noreferrer">wago.tools</a>
          {versionSorts() ? `, version ${versionSorts()}` : ""}. “X” marks a value the files do not give. Names, texts and icons: © Blizzard Entertainment.
        </p>
      </div>
    </>
  );
}
