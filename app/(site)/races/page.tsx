import type { Metadata } from "next";
import Link from "next/link";
import { RACES_ORIGINE, SKYBORNE } from "@/content/monde";
import { languesDe } from "@/lib/anglais";
import { Ariane } from "@/components/Ariane";
import { IconesRace } from "@/components/IconeRace";
import { fondBandeau } from "@/lib/ecrans";
import { slugRace, traitsDeRace, versionSorts } from "@/lib/sorts";
import { TraitsRaciaux } from "@/components/TraitsRaciaux";


export const metadata: Metadata = {
  title: "Les races de WoW Forever",
  description: "Les races jouables de World of Warcraft: Forever et leurs traits raciaux, dont les Skyborne, nouvelle race ouverte à l'Alliance comme à la Horde.",
  alternates: { canonical: "/races/", languages: languesDe("/races/") },
};

export default function Races() {
  return (
    <>
      <section className="bandeau-page" style={fondBandeau("ile-de-zephras")}>
        <div className="wrap">
          <Ariane etapes={[{ nom: "Races" }]} />
          <p className="surtitre">Le Registre · Races</p>
          <h1>Les races de WoW Forever</h1>
          <p className="chapo">Huit races héritées de l&apos;Azeroth d&apos;origine, et une nouvelle venue : les Skyborne.</p>
        </div>
      </section>
      <div className="wrap contenu sections" style={{ gap: 48 }}>
        <Link href="/races/skyborne/" className="encadre-chaud cadre" style={{ textDecoration: "none", color: "var(--texte)" }}>
          <div className="lien-icone" style={{ gap: 18, alignItems: "flex-start" }}>
            <IconesRace race="Skyborne" taille={72} />
            <div>
              <p className="surtitre">Nouvelle race jouable</p>
              <h2 className="titre" style={{ margin: "0 0 8px", fontSize: 30 }}>{SKYBORNE.nom}</h2>
            </div>
          </div>
          <p style={{ margin: "0 0 12px", color: "var(--texte-chaud)" }}>{SKYBORNE.resume}</p>
          <span style={{ color: "var(--or-clair)", fontWeight: 700 }}>Lire la fiche</span>
        </Link>
        <section aria-labelledby="t-origine">
          <h2 id="t-origine" className="section-titre" style={{ fontSize: 26 }}>Races de l&apos;Azeroth d&apos;origine</h2>
          <div className="tableau-boite">
            <table>
              <thead><tr><th scope="col">Race</th><th scope="col">Faction</th></tr></thead>
              <tbody>
                {RACES_ORIGINE.map((r) => (
                  <tr key={r.nom}>
                    <td style={{ fontWeight: 600 }}><span className="lien-icone"><IconesRace race={r.nom} taille={40} />{r.nom}</span></td>
                    <td>{r.faction}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="doux" style={{ fontSize: 15 }}>Une fiche par race sera publiée au fil des semaines, avec les classes conseillées.</p>
        </section>

        <section aria-labelledby="t-traits">
          <h2 id="t-traits" className="section-titre" style={{ fontSize: 26 }}>Traits raciaux</h2>
          <p className="doux" style={{ marginTop: 0 }}>
            Les capacités de chaque race, actives puis passives, telles que les décrivent les fichiers du jeu de Forever. Plusieurs sont
            nouvelles par rapport à l&apos;Azeroth d&apos;origine, et certaines changent selon la classe.
          </p>
          <div className="races-traits">
            {RACES_ORIGINE.map((r) => (
              <article key={r.nom} id={slugRace(r.nom)} className="race-traits">
                <header className="lien-icone">
                  <IconesRace race={r.nom} taille={44} />
                  <div>
                    <h3>{r.nom}</h3>
                    <p className="sort-meta">{r.faction}</p>
                  </div>
                </header>
                <TraitsRaciaux traits={traitsDeRace(slugRace(r.nom))} />
              </article>
            ))}
            <article id="skyborne" className="race-traits">
              <header className="lien-icone">
                <IconesRace race="Skyborne" taille={44} />
                <div>
                  <h3><Link href="/races/skyborne/">Skyborne (Éolides)</Link></h3>
                  <p className="sort-meta">Alliance ou Horde</p>
                </div>
              </header>
              <TraitsRaciaux traits={traitsDeRace("skyborne")} factions={SKYBORNE.factionsCapacites} />
            </article>
          </div>
          <p className="doux note-donnees">
            Données lues dans les fichiers du jeu grâce à <a href="https://wago.tools" rel="noopener noreferrer">wago.tools</a>
            {versionSorts() ? `, version ${versionSorts()}` : ""}. « X » marque une valeur que les fichiers ne précisent pas. Noms, textes et
            icônes : © Blizzard Entertainment.
          </p>
        </section>
      </div>
    </>
  );
}
