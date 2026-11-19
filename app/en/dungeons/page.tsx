import type { Metadata } from "next";
import Link from "next/link";
import { DONJONS } from "@/content/monde";
import { NOTE_DONJONS_EN, RAIDS_FOREVER_EN, STATUTS_RAIDS_EN } from "@/content/monde-en";
import { Ariane } from "@/components/Ariane";
import { Vignette } from "@/components/Visuels";
import { ECRAN_DONJON, fondBandeau } from "@/lib/ecrans";
import { joueursEn, lienEn, nomDonjonEn, nomZoneEn, pageDonjonEn, pageLieuEn, pageZoneEn } from "@/lib/anglais";
import { DONJONS_ORIGINE, RAIDS, TRANCHES, dansTranche } from "@/content/reference";
import { lieuParNom } from "@/lib/cartes";
import { nombreDeBoss } from "@/lib/donjons";

export const metadata: Metadata = {
  title: "WoW Forever dungeons and raids",
  description: "Every WoW Forever dungeon by level: bosses in order, loot, entrance on the map and quests, new dungeons spotted in the beta and announced raids.",
  alternates: { canonical: "/en/dungeons/", languages: { fr: "/donjons/", en: "/en/dungeons/", "x-default": "/donjons/" } },
};

const nomRaid = (n: string) => RAIDS_FOREVER_EN[n] ?? nomDonjonEn(n) ?? n;

export default function DonjonsEn() {
  return (
    <>
      <section className="bandeau-page" style={fondBandeau("ruines-de-lordaeron")}>
        <div className="wrap">
          <Ariane langue="en" etapes={[{ nom: "World", href: "/en/zones/" }, { nom: "Dungeons and raids" }]} />
          <p className="surtitre">The Cellar · Dungeons and raids</p>
          <h1>WoW Forever dungeons and raids</h1>
          <p className="chapo">The {DONJONS_ORIGINE.length} dungeons of original Azeroth sorted by level, with their bosses, their loot in Forever, the entrance on the map and their quests. Then Forever&apos;s new dungeons and the announced raids.</p>
          <p className="doux" style={{ margin: "12px 0 0", fontSize: 14 }}>Updated on 19 November 2026 by Jobwow</p>
        </div>
      </section>
      <div className="wrap contenu">
        <div className="colonne-principale" style={{ gap: 48, maxWidth: 860 }}>
          <section aria-labelledby="t-niveaux">
            <h2 id="t-niveaux" className="section-titre" style={{ fontSize: 26, marginBottom: 6 }}>A dungeon for your level</h2>
            <p className="doux" style={{ marginTop: 0 }}>Each page gives the bosses in order, what they drop in Forever, the entrance on the zone map and the quests to pick up before going.</p>
            {TRANCHES.map(([a, b]) => {
              const liste = DONJONS_ORIGINE.filter((d) => dansTranche(d.min, [a, b]));
              if (!liste.length) return null;
              return (
                <div key={a} style={{ marginBottom: 22 }}>
                  <h3 style={{ margin: "0 0 8px", fontSize: 19 }}>Levels {a} to {b}</h3>
                  <div className="tableau-boite">
                    <table>
                      <thead><tr><th scope="col">Dungeon</th><th scope="col">Levels</th><th scope="col" className="masque-mobile">Entrance</th><th scope="col" className="num">Bosses</th></tr></thead>
                      <tbody>
                        {liste.map((d) => {
                          const z = lieuParNom(d.zone);
                          const n = nombreDeBoss(d.slug);
                          return (
                            <tr key={d.slug}>
                              <td style={{ fontWeight: 600 }}><span className="lien-icone"><Vignette nom={d.nom} /><Link href={pageDonjonEn(d.slug)}>{nomDonjonEn(d.nom) ?? d.nom}</Link></span></td>
                              <td>{d.min}-{d.max}</td>
                              <td className="masque-mobile">{z ? <Link href={pageLieuEn(z)}>{nomZoneEn(d.zone)}</Link> : nomZoneEn(d.zone)}</td>
                              <td className="num">{n ?? "–"}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </section>
          <section aria-labelledby="t-nouveaux">
            <h2 id="t-nouveaux" className="section-titre" style={{ fontSize: 26, marginBottom: 6 }}>New dungeons spotted in the beta</h2>
            <p className="doux" style={{ marginTop: 0 }}>{NOTE_DONJONS_EN}</p>
            <div className="tableau-boite">
              <table>
                <thead><tr><th scope="col">Dungeon</th><th scope="col">Open from level</th><th scope="col">Page</th></tr></thead>
                <tbody>
                  {DONJONS.map((d) => (
                    <tr key={d.slug}>
                      <td style={{ fontWeight: 600 }}><span className="lien-icone">{ECRAN_DONJON[d.slug] ? <Vignette ecran={ECRAN_DONJON[d.slug]} /> : null}{nomDonjonEn(d.nom) ?? d.nom}</span></td>
                      <td>{d.niveau}</td>
                      <td><Link href={pageDonjonEn(d.slug)}>Read</Link></td>
                    </tr>
                  ))}
                  <tr><td colSpan={3} className="doux">[Five other announced dungeons: names and levels to be completed at launch]</td></tr>
                </tbody>
              </table>
            </div>
            <p style={{ fontSize: 15 }}><Link href="/en/guides/dungeon-list/">The dungeon list at a glance</Link></p>
          </section>
          <section id="raids" aria-labelledby="t-raids" className="encadre cadre" style={{ padding: 24 }}>
            <p className="surtitre">10 and 20 players</p>
            <h2 id="t-raids" style={{ margin: "0 0 8px", fontSize: 22 }}>Raids</h2>
            <p className="doux" style={{ margin: "0 0 12px" }}>
              Blizzard announces raids for 10 and 20 players, including a 20-player raid on <Link href={pageZoneEn("mont-hyjal")}>Mount Hyjal</Link>, opening announced for December.
              Bosses, loot and strategies will be added here as soon as they open.
            </p>
            <div className="tableau-boite">
              <table>
                <thead><tr><th scope="col">Raid</th><th scope="col">Players</th><th scope="col" className="masque-mobile">Zone</th><th scope="col">Status</th></tr></thead>
                <tbody>
                  {RAIDS.map((r) => (
                    <tr key={r.nom}>
                      <td style={{ fontWeight: 600 }}><span className="lien-icone"><Vignette nom={r.nom} />{r.lien ? <Link href={lienEn(r.lien)}>{nomRaid(r.nom)}</Link> : nomRaid(r.nom)}</span></td>
                      <td>{joueursEn(r.joueurs)}</td>
                      <td className="masque-mobile">{nomZoneEn(r.zone)}</td>
                      <td className="doux">{STATUTS_RAIDS_EN[r.statut] ?? r.statut}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
          <section className="encadre-nuit" aria-labelledby="t-monter">
            <h2 id="t-monter" className="titre" style={{ margin: "0 0 8px", fontSize: 24, color: "var(--or-clair)" }}>Leveling from 1 to 60</h2>
            <p style={{ margin: "0 0 14px", color: "#cfc7b4" }}>The quest-by-quest guide for your race and class, with NPCs and monsters on the map.</p>
            <Link href="/en/leveling-guide/" className="btn btn-or">Follow the guide</Link>
          </section>
        </div>
      </div>
    </>
  );
}
