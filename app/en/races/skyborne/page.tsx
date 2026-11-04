import type { Metadata } from "next";
import Link from "next/link";
import { SKYBORNE } from "@/content/monde";
import { SKYBORNE_EN } from "@/content/monde-en";
import { Ariane } from "@/components/Ariane";
import { IconesRace } from "@/components/IconeRace";
import { TraitsRaciaux } from "@/components/TraitsRaciaux";
import { fondBandeau } from "@/lib/ecrans";
import { traitsDeRace, versionSorts } from "@/lib/sorts";
import { CLASSES_EN, FACTIONS_CAPACITES_EN, lienGuideEn, pageZoneEn } from "@/lib/anglais";
import { CLASSES } from "@/content/classes";
import { IconeClasse } from "@/components/IconeClasse";

export const metadata: Metadata = {
  title: "Skyborne: the new WoW Forever race",
  description: "Skyborne: origins, classes by faction, racial abilities and how to unlock the new WoW Forever race.",
  alternates: { canonical: "/en/races/skyborne/", languages: { fr: "/races/skyborne/", en: "/en/races/skyborne/", "x-default": "/races/skyborne/" } },
};

const dateEn = (d: string) => new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Paris" }).format(new Date(d));
const slugClasse = (nom: string) => CLASSES.find((c) => c.nom === nom)?.slug ?? "";

export default function SkyborneEn() {
  const s = SKYBORNE_EN;
  return (
    <>
      <section className="bandeau-page" style={fondBandeau("ile-de-zephras")}>
        <div className="wrap">
          <Ariane langue="en" etapes={[{ nom: "Races", href: "/en/races/" }, { nom: "Skyborne" }]} />
          <div className="presentation-auteur">
            <IconesRace race="Skyborne" taille={96} />
            <div>
              <p className="surtitre">New playable race</p>
              <h1>{s.nom}</h1>
              <p className="chapo">{s.resume}</p>
            </div>
          </div>
        </div>
      </section>
      <div className="wrap contenu">
        <div className="colonnes">
          <div className="colonne-principale">
            <section aria-labelledby="t-origine">
              <h2 id="t-origine" className="section-titre" style={{ fontSize: 26 }}>Where do they come from?</h2>
              {s.origine.map((p) => <p key={p}>{p}</p>)}
              <p><Link href={pageZoneEn("ile-de-zephras")}>Read the Zephras Isle page</Link></p>
            </section>

            <section aria-labelledby="t-ordres">
              <h2 id="t-ordres" className="section-titre" style={{ fontSize: 26 }}>Two orders, two factions</h2>
              <p>The choice is made at character creation. It decides which classes are open and one of the racial abilities.</p>
              <div className="g2">
                {SKYBORNE.ordres.map((o) => (
                  <div key={o.faction} className="encadre cadre">
                    <p className="surtitre">{o.faction}</p>
                    <h3 style={{ margin: "0 0 6px" }}>{s.ordres[o.faction]?.nom ?? o.anglais}</h3>
                    <p className="doux" style={{ margin: "0 0 8px", fontSize: 15 }}>{s.ordres[o.faction]?.texte}</p>
                    <p style={{ margin: 0, fontSize: 15 }}>Classes: {o.classes.map((c) => CLASSES_EN[slugClasse(c)]?.nom ?? c).join(", ")}</p>
                  </div>
                ))}
              </div>
            </section>

            <section aria-labelledby="t-capacites">
              <h2 id="t-capacites" className="section-titre" style={{ fontSize: 26 }}>Racial abilities</h2>
              <p className="doux">
                Names and effects read from the game files{versionSorts() ? ` (version ${versionSorts()})` : ""}. Two abilities depend on the faction,
                according to the beta; the others are shared by all Skyborne.
              </p>
              <TraitsRaciaux langue="en" traits={traitsDeRace("skyborne", "en")} factions={FACTIONS_CAPACITES_EN} />
            </section>

            <section aria-labelledby="t-guide-skyborne" className="encadre-chaud guide-zone">
              <p className="surtitre" style={{ margin: 0 }}>Leveling guide 1-60</p>
              <h2 id="t-guide-skyborne" className="section-titre" style={{ fontSize: 26, margin: "4px 0 8px" }}>Leveling a Skyborne from 1 to 60</h2>
              <p style={{ margin: "0 0 14px" }}>
                Start on <Link href={pageZoneEn("ile-de-zephras")}>Zephras Isle</Link>, then follow your faction&apos;s road, quest by quest, with NPCs
                and monsters on the map and your progress to tick. Pick your order and class:
              </p>
              <div className="guide-zone-races">
                {SKYBORNE.ordres.map((o) => {
                  const race = o.faction === "Alliance" ? "skyborne-alliance" : "skyborne-horde";
                  return (
                    <div key={o.faction} className="guide-zone-race">
                      <span className="lien-icone" style={{ gap: 8 }}>
                        <IconesRace race="Skyborne" taille={28} />
                        <strong>{s.ordres[o.faction]?.nom}</strong> <span className="doux">({o.faction})</span>
                      </span>
                      <span className="guide-zone-classes">
                        {o.classes.map(slugClasse).filter(Boolean).map((cl) => {
                          const c = CLASSES.find((x) => x.slug === cl)!;
                          return (
                            <Link key={cl} href={lienGuideEn(race, cl)} className="lien-icone choix-pastille" data-cta="guide-skyborne-en">
                              <IconeClasse slug={cl} couleur={c.couleur} taille={24} />
                              {CLASSES_EN[cl].nom}
                            </Link>
                          );
                        })}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>

            <section aria-labelledby="t-acces">
              <h2 id="t-acces" className="section-titre" style={{ fontSize: 26 }}>How to play a Skyborne?</h2>
              {s.acces.map((p) => <p key={p}>{p}</p>)}
            </section>

            <section className="avis" aria-labelledby="t-avis">
              <div className="avis-titre"><span className="avatar" aria-hidden="true">S</span><h2 id="t-avis">Jobwow&apos;s take</h2></div>
              <p className="doux" style={{ margin: 0 }}>{s.avis}</p>
            </section>

            <section className="sources" aria-labelledby="t-sources">
              <h2 id="t-sources">Sources</h2>
              <ul>{s.sources.map((x) => <li key={x}>{x}</li>)}</ul>
            </section>
          </div>
          <aside className="colonne-laterale">
            <p className="doux" style={{ margin: 0, fontSize: 14 }}>Page updated on {dateEn(SKYBORNE.misAJour)} by Jobwow.</p>
          </aside>
        </div>
      </div>
    </>
  );
}
