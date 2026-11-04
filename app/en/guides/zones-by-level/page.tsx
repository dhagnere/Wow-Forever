import type { Metadata } from "next";
import Link from "next/link";
import { TRANCHES, ZONES_NIVEAUX, ZONES_SANS_NIVEAU, DONJONS_ORIGINE, dansTranche } from "@/content/reference";
import { Ariane } from "@/components/Ariane";
import { AvertissementReferenceEn } from "@/components/AvertissementReferenceEn";
import { LienLieu } from "@/components/Cartes";
import { fondBandeau } from "@/lib/ecrans";
import { lieuParNom } from "@/lib/cartes";
import { CONTINENTS_EN, lienEn, nomDonjonEn, nomZoneEn } from "@/lib/anglais";

export const metadata: Metadata = {
  title: "WoW Forever zones by level, from 1 to 60",
  description: "Every WoW Forever zone sorted by level, from 1 to 60, with its continent and the dungeons of each level range.",
  alternates: { canonical: "/en/guides/zones-by-level/", languages: { fr: "/guides/zones-par-niveau/", en: "/en/guides/zones-by-level/", "x-default": "/guides/zones-par-niveau/" } },
};

const niveaux = (min: number, max: number) => (min === max ? `${min}` : `${min}–${max}`);

export default function ZonesByLevel() {
  return (
    <>
      <section className="bandeau-page" style={fondBandeau("kalimdor")}>
        <div className="wrap">
          <Ariane langue="en" etapes={[{ nom: "Guides", href: "/en/guides/getting-started/" }, { nom: "Zones by level" }]} />
          <h1>Zones by level</h1>
          <p className="chapo">From 1 to 60, the zones to travel through range by range, with the dungeons within reach. Click a zone to see its map.</p>
          <div className="actions-bandeau">
            <Link href="/en/maps/" className="btn btn-or" data-cta="cartes-niveaux-en">See the world maps</Link>
          </div>
        </div>
      </section>
      <div className="wrap contenu">
        <AvertissementReferenceEn />
        <nav aria-label="Level ranges" className="onglets">
          {TRANCHES.map(([a, b]) => <a key={a} href={`#niveaux-${a}`}>Levels {a}–{b}</a>)}
        </nav>
        <div className="colonnes">
          <div className="colonne-principale">
            {TRANCHES.map(([a, b]) => {
              const zones = ZONES_NIVEAUX.filter((z) => dansTranche(z.min, [a, b]));
              const donjons = DONJONS_ORIGINE.filter((d) => dansTranche(d.min, [a, b]));
              return (
                <section key={a} id={`niveaux-${a}`} aria-labelledby={`t-${a}`}>
                  <h2 id={`t-${a}`} className="section-titre" style={{ fontSize: 26 }}>Levels {a} to {b}</h2>
                  <div className="tableau-boite">
                    <table>
                      <thead><tr><th scope="col">Zone</th><th scope="col">Levels</th><th scope="col">Continent</th></tr></thead>
                      <tbody>
                        {zones.map((z) => (
                          <tr key={z.nom}>
                            <td style={{ fontWeight: 600 }}>
                              {lieuParNom(z.nom) ? <LienLieu slug={lieuParNom(z.nom)!} nom={nomZoneEn(z.nom)} langue="en" /> : z.lien ? <Link href={lienEn(z.lien)}>{nomZoneEn(z.nom)}</Link> : nomZoneEn(z.nom)}
                              {z.lien ? <Link href={lienEn(z.lien)} className="doux" style={{ marginLeft: 8, fontSize: 13 }}>page</Link> : null}
                              {z.forever ? <span className="puce" style={{ marginLeft: 8, fontSize: 12 }}>Forever</span> : null}
                            </td>
                            <td>{niveaux(z.min, z.max)}{z.incertain ? <span className="doux"> (to be confirmed)</span> : null}</td>
                            <td className="doux">{CONTINENTS_EN[z.continent] ?? z.continent}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {donjons.length ? (
                    <p className="doux" style={{ fontSize: 15, marginTop: 10 }}>
                      Dungeons in this range: {donjons.map((d) => `${nomDonjonEn(d.nom) ?? d.nom} (${niveaux(d.min, d.max)})`).join(", ")}.{" "}
                      <Link href="/en/guides/dungeon-list/">All dungeons</Link>
                    </p>
                  ) : null}
                </section>
              );
            })}
            <section aria-labelledby="t-inconnu">
              <h2 id="t-inconnu" className="section-titre" style={{ fontSize: 22 }}>Levels still unknown</h2>
              <p>
                {ZONES_SANS_NIVEAU.map((z, i) => <span key={z.nom}>{i ? ", " : ""}<Link href={lienEn(z.lien)}>{nomZoneEn(z.nom)}</Link></span>)}: a new
                Forever zone whose levels have not been announced yet.
              </p>
            </section>
          </div>
          <aside className="colonne-laterale">
            <div className="encadre cadre">
              <h2>Related guides</h2>
              <ul style={{ margin: 0, paddingLeft: 20, fontSize: 15 }}>
                <li><Link href="/en/guides/starting-zones/">Starting zones</Link></li>
                <li><Link href="/en/guides/dungeon-list/">Dungeon list</Link></li>
                <li><Link href="/en/zones/">Forever&apos;s new zones</Link></li>
                <li><Link href="/en/leveling-guide/">Leveling guide 1-60</Link></li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
