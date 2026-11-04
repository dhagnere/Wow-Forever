import type { Metadata } from "next";
import Link from "next/link";
import { DONJONS } from "@/content/monde";
import { NOTE_DONJONS_EN, STATUTS_RAIDS_EN } from "@/content/monde-en";
import { DONJONS_ORIGINE, RAIDS } from "@/content/reference";
import { Ariane } from "@/components/Ariane";
import { AvertissementReferenceEn } from "@/components/AvertissementReferenceEn";
import { Vignette } from "@/components/Visuels";
import { ECRAN_DONJON, fondBandeau } from "@/lib/ecrans";
import { lieuParNom } from "@/lib/cartes";
import { CONTINENTS_EN, joueursEn, lienEn, nomDonjonEn, nomZoneEn, pageDonjonEn, pageLieuEn } from "@/lib/anglais";

export const metadata: Metadata = {
  title: "WoW Forever dungeon and raid list",
  description: "Every WoW Forever dungeon by level: new dungeons spotted in the beta, dungeons of original Azeroth and announced raids.",
  alternates: { canonical: "/en/guides/dungeon-list/", languages: { fr: "/guides/liste-des-donjons/", en: "/en/guides/dungeon-list/", "x-default": "/guides/liste-des-donjons/" } },
};

/** Nom anglais ; un raid pas encore nommé garde sa mention à compléter. */
const nom = (n: string) => nomDonjonEn(n) ?? (n.startsWith("[") ? "[Mount Hyjal raid, name to be confirmed]" : n);
const zone = (z: string) => (lieuParNom(z) ? <Link href={pageLieuEn(lieuParNom(z)!)}>{nomZoneEn(z)}</Link> : nomZoneEn(z));

export default function DungeonList() {
  return (
    <>
      <section className="bandeau-page" style={fondBandeau("profondeurs-de-rochenoire")}>
        <div className="wrap">
          <Ariane langue="en" etapes={[{ nom: "Guides", href: "/en/guides/getting-started/" }, { nom: "Dungeon list" }]} />
          <h1>Dungeon and raid list</h1>
          <p className="chapo">Forever&apos;s new dungeons, those of original Azeroth, and the raids, sorted by level.</p>
        </div>
      </section>
      <div className="wrap contenu">
        <AvertissementReferenceEn />
        <div className="colonnes">
          <div className="colonne-principale">
            <section aria-labelledby="t-nouveaux">
              <h2 id="t-nouveaux" className="section-titre" style={{ fontSize: 26 }}>
                Forever&apos;s new dungeons <span className="puce" style={{ fontSize: 13, verticalAlign: "middle" }}>Forever</span>
              </h2>
              <p className="doux" style={{ marginTop: 0 }}>{NOTE_DONJONS_EN}</p>
              <div className="tableau-boite">
                <table>
                  <thead><tr><th scope="col">Dungeon</th><th scope="col">From level</th><th scope="col">Zone</th></tr></thead>
                  <tbody>
                    {DONJONS.map((d) => (
                      <tr key={d.slug}><td style={{ fontWeight: 600 }}><span className="lien-icone">{ECRAN_DONJON[d.slug] ? <Vignette ecran={ECRAN_DONJON[d.slug]} /> : null}<Link href={pageDonjonEn(d.slug)}>{nom(d.nom)}</Link></span></td><td>{d.niveau}</td><td className="doux">[To be confirmed]</td></tr>
                    ))}
                    <tr><td colSpan={3} className="doux">[Five other announced dungeons: names and levels to be completed at launch]</td></tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section aria-labelledby="t-origine">
              <h2 id="t-origine" className="section-titre" style={{ fontSize: 26 }}>Dungeons of original Azeroth</h2>
              <p className="doux" style={{ marginTop: 0 }}>Recommended levels in the original game. Their presence and levels in Forever remain to be confirmed.</p>
              <div className="tableau-boite">
                <table>
                  <thead><tr><th scope="col">Dungeon</th><th scope="col">Levels</th><th scope="col">Zone</th><th scope="col">Continent</th></tr></thead>
                  <tbody>
                    {DONJONS_ORIGINE.map((d) => (
                      <tr key={d.nom}><td style={{ fontWeight: 600 }}><span className="lien-icone"><Vignette nom={d.nom} />{nom(d.nom)}</span></td><td>{d.min}–{d.max}</td><td>{zone(d.zone)}</td><td className="doux">{CONTINENTS_EN[d.continent] ?? d.continent}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section aria-labelledby="t-raids">
              <h2 id="t-raids" className="section-titre" style={{ fontSize: 26 }}>Raids</h2>
              <p className="doux" style={{ marginTop: 0 }}>Forever announces raids for 10 and 20 players. The original raids are listed for reference.</p>
              <div className="tableau-boite">
                <table>
                  <thead><tr><th scope="col">Raid</th><th scope="col">Players</th><th scope="col">Zone</th><th scope="col">Status</th></tr></thead>
                  <tbody>
                    {RAIDS.map((r) => (
                      <tr key={r.nom}>
                        <td style={{ fontWeight: 600 }}><span className="lien-icone"><Vignette nom={r.nom} />{r.lien ? <Link href={lienEn(r.lien)}>{nom(r.nom)}</Link> : nom(r.nom)}</span></td>
                        <td>{joueursEn(r.joueurs)}</td>
                        <td>{zone(r.zone)}</td>
                        <td className="doux">{STATUTS_RAIDS_EN[r.statut] ?? r.statut}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
          <aside className="colonne-laterale">
            <div className="encadre cadre">
              <h2>Related guides</h2>
              <ul style={{ margin: 0, paddingLeft: 20, fontSize: 15 }}>
                <li><Link href="/en/dungeons/">Dungeons and raids</Link></li>
                <li><Link href="/en/guides/zones-by-level/">Zones by level</Link></li>
                <li><Link href="/en/guides/starting-zones/">Starting zones</Link></li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
