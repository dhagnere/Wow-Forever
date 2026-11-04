import type { Metadata } from "next";
import Link from "next/link";
import { DONJONS } from "@/content/monde";
import { NOTE_DONJONS_EN } from "@/content/monde-en";
import { Ariane } from "@/components/Ariane";
import { Vignette } from "@/components/Visuels";
import { ECRAN_DONJON, fondBandeau } from "@/lib/ecrans";
import { nomDonjonEn, pageDonjonEn, pageZoneEn } from "@/lib/anglais";

export const metadata: Metadata = {
  title: "WoW Forever dungeons and raids",
  description: "The new WoW Forever dungeons spotted in the beta, their entry level, and the announced raids for 10 and 20 players.",
  alternates: { canonical: "/en/dungeons/", languages: { fr: "/donjons/", en: "/en/dungeons/", "x-default": "/donjons/" } },
};

export default function DonjonsEn() {
  return (
    <>
      <section className="bandeau-page" style={fondBandeau("ruines-de-lordaeron")}>
        <div className="wrap">
          <Ariane langue="en" etapes={[{ nom: "World", href: "/en/zones/" }, { nom: "Dungeons and raids" }]} />
          <p className="surtitre">The Cellar · Dungeons and raids</p>
          <h1>WoW Forever dungeons and raids</h1>
          <p className="chapo">Nine new dungeons and raids for 10 and 20 players are announced. This page is completed as announcements and in-game discoveries come in.</p>
          <p className="doux" style={{ margin: "12px 0 0", fontSize: 14 }}>Updated on 31 October 2026 by Jobwow</p>
        </div>
      </section>
      <div className="wrap contenu">
        <div className="colonne-principale" style={{ gap: 48, maxWidth: 860 }}>
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
            <p style={{ fontSize: 15 }}><Link href="/en/guides/dungeon-list/">See also the full list, with the dungeons of original Azeroth</Link></p>
          </section>
          <section id="raids" aria-labelledby="t-raids" className="encadre cadre" style={{ padding: 24 }}>
            <p className="surtitre">10 and 20 players</p>
            <h2 id="t-raids" style={{ margin: "0 0 8px", fontSize: 22 }}>Raids</h2>
            <p className="doux" style={{ margin: 0 }}>
              Blizzard announces raids for 10 and 20 players, including a 20-player raid on <Link href={pageZoneEn("mont-hyjal")}>Mount Hyjal</Link>, opening announced for December.
              Bosses, loot and strategies will be added here as soon as they open.
            </p>
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
