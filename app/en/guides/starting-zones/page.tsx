import type { Metadata } from "next";
import Link from "next/link";
import { ZONES_DEPART } from "@/content/reference";
import { LIEUX_DEPART_EN } from "@/content/monde-en";
import { Ariane } from "@/components/Ariane";
import { AvertissementReferenceEn } from "@/components/AvertissementReferenceEn";
import { LienLieu } from "@/components/Cartes";
import { fondBandeau } from "@/lib/ecrans";
import { lieuParNom } from "@/lib/cartes";
import { CONTINENTS_EN, lienEn, nomZoneEn, pageLieuEn, pageZoneEn, RACES_DEPART_EN } from "@/lib/anglais";

export const metadata: Metadata = {
  title: "WoW Forever starting zones, race by race",
  description: "Where each race begins in WoW Forever: starting area, zone for levels 1 to 10, capital and continent, Skyborne included.",
  alternates: { canonical: "/en/guides/starting-zones/", languages: { fr: "/guides/zones-de-depart/", en: "/en/guides/starting-zones/", "x-default": "/guides/zones-de-depart/" } },
};

const faction = (f: string) => (f === "Alliance ou Horde" ? "Alliance or Horde" : f);

export default function StartingZones() {
  return (
    <>
      <section className="bandeau-page" style={fondBandeau("ile-de-zephras")}>
        <div className="wrap">
          <Ariane langue="en" etapes={[{ nom: "Guides", href: "/en/guides/getting-started/" }, { nom: "Starting zones" }]} />
          <h1>Starting zones</h1>
          <p className="chapo">Each race starts in its own corner of Azeroth, from level 1 to about level 10, before joining the shared zones.</p>
        </div>
      </section>
      <div className="wrap contenu">
        <AvertissementReferenceEn />
        <div className="colonnes">
          <div className="colonne-principale">
            <section aria-labelledby="t-tableau">
              <h2 id="t-tableau" className="section-titre" style={{ fontSize: 26 }}>Race by race</h2>
              <div className="tableau-boite">
                <table>
                  <thead>
                    <tr><th scope="col">Races</th><th scope="col">Faction</th><th scope="col">Starting area</th><th scope="col">Zone (1–10)</th><th scope="col">Capital</th><th scope="col">Continent</th></tr>
                  </thead>
                  <tbody>
                    {ZONES_DEPART.map((z) => (
                      <tr key={z.races}>
                        <td style={{ fontWeight: 600 }}>
                          {RACES_DEPART_EN[z.races] ?? z.races}
                          {z.forever ? <span className="puce" style={{ marginLeft: 8, fontSize: 12 }}>Forever</span> : null}
                        </td>
                        <td>{faction(z.faction)}</td>
                        <td>{LIEUX_DEPART_EN[z.lieu] ?? z.lieu}</td>
                        <td>{lieuParNom(z.zone) ? <LienLieu slug={lieuParNom(z.zone)!} nom={nomZoneEn(z.zone)} langue="en" /> : z.lien ? <Link href={lienEn(z.lien)}>{nomZoneEn(z.zone)}</Link> : nomZoneEn(z.zone)}</td>
                        <td>{lieuParNom(z.capitale) ? <Link href={pageLieuEn(lieuParNom(z.capitale)!)}>{nomZoneEn(z.capitale)}</Link> : nomZoneEn(z.capitale)}</td>
                        <td className="doux">{CONTINENTS_EN[z.continent] ?? z.continent}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section aria-labelledby="t-skyborne" className="encadre-chaud cadre">
              <h2 id="t-skyborne" className="titre" style={{ margin: "0 0 8px", fontSize: 22, color: "var(--or-clair)" }}>The Skyborne case</h2>
              <p style={{ margin: "0 0 10px", color: "var(--texte-chaud)" }}>
                The only Forever race open to both factions, the Skyborne all start on Zephras Isle, in the village of Thendal, each faction in its
                own version of the zone. The race requires one of the game&apos;s higher editions.
              </p>
              <p style={{ margin: 0 }}>
                <Link href="/en/races/skyborne/">Skyborne page</Link> · <Link href={pageZoneEn("ile-de-zephras")}>Zephras Isle page</Link>
              </p>
            </section>

            <section aria-labelledby="t-apres">
              <h2 id="t-apres" className="section-titre" style={{ fontSize: 26 }}>And after level 10?</h2>
              <p>
                The zones for levels 10 to 20 take over: {["Marche de l'Ouest", "Loch Modan", "Forêt des Pins-Argentés", "Sombrivage", "Les Tarides"].map(nomZoneEn).join(", ")}. The level-by-level
                details are in <Link href="/en/guides/zones-by-level/">the zones by level</Link>, and the <Link href="/en/leveling-guide/">leveling guide</Link> takes you there quest by quest.
              </p>
              <p className="doux">[Jobwow&apos;s advice: which starting zone to choose for a first character, and why.]</p>
            </section>
          </div>
          <aside className="colonne-laterale">
            <div className="encadre cadre">
              <h2>Related guides</h2>
              <ul style={{ margin: 0, paddingLeft: 20, fontSize: 15 }}>
                <li><Link href="/en/guides/getting-started/">Getting started in WoW Forever</Link></li>
                <li><Link href="/en/guides/zones-by-level/">Zones by level</Link></li>
                <li><Link href="/en/guides/dungeon-list/">Dungeon list</Link></li>
                <li><Link href="/en/races/">The races</Link></li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
