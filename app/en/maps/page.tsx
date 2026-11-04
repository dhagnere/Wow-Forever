import type { Metadata } from "next";
import Link from "next/link";
import { Ariane } from "@/components/Ariane";
import { CarteLieu, FigureCarte } from "@/components/Cartes";
import { fondBandeau } from "@/lib/ecrans";
import { zonesDuContinent } from "@/lib/cartes";
import { nomLieuEn, pageLieuEn } from "@/lib/anglais";

export const metadata: Metadata = {
  title: "WoW Forever world maps: Kalimdor, Eastern Kingdoms, Zephras Isle",
  description: "Maps of Kalimdor, the Eastern Kingdoms and Zephras Isle in WoW Forever, and every zone with its level range, dungeons and neighbouring zones.",
  alternates: { canonical: "/en/maps/", languages: { fr: "/cartes/", en: "/en/maps/", "x-default": "/cartes/" } },
};

const VILLES = ["hurlevent", "forgefer", "darnassus", "orgrimmar", "thunder-bluff", "fossoyeuse"];
const niveaux = (min?: number, max?: number) => (min === undefined ? undefined : min === max ? `Level ${min}` : `Levels ${min} to ${max}`);

export default function CartesEn() {
  return (
    <>
      <section className="bandeau-page" style={fondBandeau("kalimdor")}>
        <div className="wrap">
          <Ariane langue="en" etapes={[{ nom: "World maps" }]} />
          <p className="surtitre">The Map Room</p>
          <h1>Maps of the <span className="accent">world</span></h1>
          <p className="chapo">Two continents, a new island and more than forty zones. Pick a place: its map, levels, dungeons and the road ahead.</p>
          <nav className="actions-bandeau" aria-label="Go to continent">
            <a href="#eastern-kingdoms" className="btn btn-or">Eastern Kingdoms</a>
            <a href="#kalimdor" className="btn btn-contour">Kalimdor</a>
            <a href="#zephras" className="btn btn-contour">Zephras Isle</a>
          </nav>
        </div>
      </section>
      <div className="wrap contenu sections" style={{ gap: 56 }}>
        {(["Royaumes de l'Est", "Kalimdor"] as const).map((continent) => {
          const slug = continent === "Kalimdor" ? "kalimdor" : "royaumes-de-l-est";
          const ancre = continent === "Kalimdor" ? "kalimdor" : "eastern-kingdoms";
          const nom = nomLieuEn(slug) ?? continent;
          const zones = zonesDuContinent(continent).filter((z) => !VILLES.includes(z.slug))
            .sort((a, b) => (a.niveau?.min ?? 99) - (b.niveau?.min ?? 99) || (nomLieuEn(a.slug) ?? a.nom).localeCompare(nomLieuEn(b.slug) ?? b.nom, "en"));
          const villes = zonesDuContinent(continent).filter((z) => VILLES.includes(z.slug));
          return (
            <section key={continent} id={ancre} aria-labelledby={`t-${ancre}`}>
              <h2 id={`t-${ancre}`} className="section-titre">{nom}</h2>
              <div className="colonnes-carte">
                <FigureCarte slug={slug} langue="en" legende={`Map: ${nom} · click to enlarge`} />
                <div>
                  <p className="doux" style={{ marginTop: 0 }}>
                    {zones.length} zones, sorted by level. <Link href="/en/leveling-guide/">The full route from 1 to 60</Link>.
                  </p>
                  {villes.length ? (
                    <p className="doux">
                      Capitals: {villes.map((v, i) => <span key={v.slug}>{i ? ", " : ""}<Link href={pageLieuEn(v.slug)}>{nomLieuEn(v.slug) ?? v.nom}</Link></span>)}.
                    </p>
                  ) : null}
                </div>
              </div>
              <div className="grille-lieux">
                {zones.map((z) => <CarteLieu key={z.slug} slug={z.slug} langue="en" detail={niveaux(z.niveau?.min, z.niveau?.max) ?? "Level to be confirmed"} />)}
              </div>
            </section>
          );
        })}
        <section id="zephras" aria-labelledby="t-zephras">
          <h2 id="t-zephras" className="section-titre">{nomLieuEn("ile-de-zephras") ?? "Zephras Isle"}</h2>
          <div className="colonnes-carte">
            <FigureCarte slug="ile-de-zephras" langue="en" />
            <p className="doux" style={{ marginTop: 0 }}>
              New in Forever, the Skyborne starting island floats away from both continents.{" "}
              <Link href={pageLieuEn("ile-de-zephras")}>Open its page</Link>.
            </p>
          </div>
        </section>
        <p className="doux" style={{ fontSize: 13 }}>Maps read from the WoW Forever game files thanks to <a href="https://wago.tools" rel="noopener noreferrer">wago.tools</a>. © Blizzard Entertainment.</p>
      </div>
    </>
  );
}
