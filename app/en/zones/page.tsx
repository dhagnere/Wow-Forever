import type { Metadata } from "next";
import Link from "next/link";
import { ZONES } from "@/content/monde";
import { ZONES_EN } from "@/content/monde-en";
import { Ariane } from "@/components/Ariane";
import { Visuel } from "@/components/Visuels";
import { ECRAN_ZONE, fondBandeau } from "@/lib/ecrans";
import { pageZoneEn } from "@/lib/anglais";

export const metadata: Metadata = {
  title: "WoW Forever zones",
  description: "Mount Hyjal, Riverglades, Zephras Isle, Shen'dralar: the new zones of World of Warcraft: Forever.",
  alternates: { canonical: "/en/zones/", languages: { fr: "/zones/", en: "/en/zones/", "x-default": "/zones/" } },
};

export default function ZonesEn() {
  return (
    <>
      <section className="bandeau-page" style={fondBandeau("kalimdor")}>
        <div className="wrap">
          <Ariane langue="en" etapes={[{ nom: "World" }]} />
          <p className="surtitre">The Map Room · Zones</p>
          <h1>The world of WoW Forever</h1>
          <p className="chapo">Four new zones, nine new dungeons and raids for 10 and 20 players.</p>
        </div>
      </section>
      <div className="wrap contenu sections" style={{ gap: 48 }}>
        <section aria-labelledby="t-zones">
          <h2 id="t-zones" className="section-titre">New zones</h2>
          <div className="g2">
            {ZONES.map((z) => {
              const e = ZONES_EN[z.slug];
              return (
                <Link key={z.slug} href={pageZoneEn(z.slug)} className="carte cadre">
                  <Visuel hauteur={160} ecran={ECRAN_ZONE[z.slug]} langue="en" />
                  <div className="carte-corps">
                    <p className="surtitre">Level {e?.niveau ?? z.niveau}</p>
                    <h3>{e?.nom ?? z.nom}</h3>
                    <p className="doux" style={{ margin: "6px 0 0", fontSize: 15 }}>{e?.resume ?? z.resume}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
        <section className="encadre-chaud cadre">
          <h2 className="titre" style={{ margin: "0 0 8px", fontSize: 24, color: "var(--or-clair)" }}>Dungeons and raids</h2>
          <p style={{ margin: "0 0 14px", color: "var(--texte-chaud)" }}>The new dungeons spotted in the beta, their entry level and the announced raids.</p>
          <div className="boutons" style={{ justifyContent: "flex-start" }}>
            <Link href="/en/dungeons/" className="btn btn-or">See the dungeons</Link>
            <Link href="/en/guides/zones-by-level/" className="btn btn-contour">All zones by level</Link>
            <Link href="/en/guides/starting-zones/" className="btn btn-contour">Starting zones</Link>
          </div>
        </section>
      </div>
    </>
  );
}
