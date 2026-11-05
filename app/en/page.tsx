import type { Metadata } from "next";
import Link from "next/link";
import { CLASSES } from "@/content/classes";
import { listerPubliesEn } from "@/modules/veille";
import { CarteArticle } from "@/components/Articles";
import { IconeClasse } from "@/components/IconeClasse";
import { JsonLd } from "@/components/JsonLd";
import { ChoixGuideParClasseEn } from "@/components/ChoixGuideEn";
import { CLASSES_EN } from "@/lib/anglais";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: `WoW Forever leveling guide 1-60, classes and talents · ${SITE.nom}` },
  description: "Level from 1 to 60 in WoW Forever with a quest-by-quest guide for your race and class: NPCs and monsters on zoomable maps, the route drawn, progress saved. Spells, talents and a talent calculator for every class.",
  alternates: { canonical: "/en/", languages: { fr: "/", en: "/en/", "x-default": "/" } },
};

export const dynamic = "force-dynamic";

export default async function AccueilAnglais() {
  const nouvelles = await listerPubliesEn({ limite: 3 }).catch(() => []);
  return (
    <>
      <JsonLd donnees={{ "@context": "https://schema.org", "@type": "WebSite", name: SITE.nom, url: `${SITE.url}/en/`, inLanguage: "en" }} />
      <section className="heros">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="heros-image"
          src="/images/heros-accueil-1920.jpg"
          srcSet="/images/heros-accueil-960.jpg 960w, /images/heros-accueil-1920.jpg 1920w"
          sizes="100vw"
          alt="Sunset over an Azeroth beach, a wreck stranded on the sand"
          fetchPriority="high"
        />
        <p className="heros-credit">Screenshot by Jobwow · © Blizzard Entertainment</p>
        <div className="wrap">
          <div className="heros-carte cadre">
            <p className="surtitre" style={{ fontSize: 15, letterSpacing: "0.22em", marginBottom: 14 }}>WoW Forever</p>
            <h1>Original Azeroth is back</h1>
            <span className="ornement" aria-hidden="true" />
            <p>A leveling guide from 1 to 60 for your race and class, quest by quest, with every NPC and monster on the map. Spells, talents and a talent calculator for all nine classes.</p>
            <div className="boutons">
              <a href="#guide-1-60" className="btn btn-or" data-cta="guide-heros-en">Follow the 1-60 guide</a>
              <Link href="/en/classes/" className="btn btn-contour" data-cta="classes-heros-en">Classes and talents</Link>
            </div>
          </div>
        </div>
      </section>

      <section id="guide-1-60" className="accueil-guide" aria-labelledby="t-guide-accueil">
        <div className="wrap">
          <div className="accueil-guide-tete">
            <div>
              <p className="surtitre" style={{ margin: 0 }}>The Tavern&apos;s guide</p>
              <h2 id="t-guide-accueil">From 1 to 60, quest by quest, for your class</h2>
              <p className="chapo" style={{ margin: 0 }}>
                Every quest in the right order: accept it, complete its objectives, turn it in, then move on. NPCs and monsters are placed on each
                zone map, the route is drawn with arrows, and a free account saves your progress day after day.
              </p>
            </div>
            <ul className="accueil-guide-points" aria-label="What the guide offers">
              <li><strong>Your class</strong>, with class quests in their place</li>
              <li><strong>Zoomable maps</strong> with NPCs, monsters and the route</li>
              <li><strong>Progress</strong> ticked and saved</li>
            </ul>
          </div>
          <p className="accueil-guide-consigne">Pick your class, then your race:</p>
          <ChoixGuideParClasseEn />
          <p className="doux" style={{ margin: "16px 0 0", fontSize: 14 }}>
            Or browse <Link href="/en/leveling-guide/">the Alliance and Horde routes</Link>.
          </p>
        </div>
      </section>

      <div className="wrap contenu sections">
        {nouvelles.length ? (
          <section aria-labelledby="t-une">
            <h2 id="t-une" className="section-titre">Latest news</h2>
            <div className="une">{nouvelles.map((a, i) => <CarteArticle key={a.id} article={a} grande={i === 0} langue="en" />)}</div>
            <p style={{ marginTop: 16 }}><Link href="/en/news/">All WoW Forever news</Link></p>
          </section>
        ) : null}

        <section aria-labelledby="t-voie" className="centre">
          <h2 id="t-voie" className="section-titre" style={{ fontSize: 34, marginBottom: 8 }}>Choose your path</h2>
          <span className="ornement" aria-hidden="true" />
          <p className="doux" style={{ margin: "0 auto 32px", maxWidth: 620 }}>
            Nine classes. For each one: spells by specialisation, the three talent trees, pets for hunters and warlocks, and a talent calculator.
          </p>
          <div className="g9">
            {CLASSES.map((c) => (
              <Link key={c.slug} href={`/en/classes/${CLASSES_EN[c.slug].slug}/`} className="lien-classe">
                <IconeClasse slug={c.slug} couleur={c.couleur} taille="100%" />
                {CLASSES_EN[c.slug].nom}
              </Link>
            ))}
          </div>
        </section>

        <section className="encadre-chaud" aria-labelledby="t-francais">
          <h2 id="t-francais" style={{ marginTop: 0, fontSize: 22 }}>About this site</h2>
          <p style={{ margin: 0 }}>
            La Taverne Éternelle is a French fan site about WoW Forever, written by Jobwow, a Horde troll mage and innkeeper. The English section covers the
            leveling guide, classes, talents, races, the <Link href="/en/item-database/">item database</Link>, the{" "}
            <Link href="/en/maps/">world maps</Link>, the <Link href="/en/zones/">new zones</Link>, the <Link href="/en/dungeons/">dungeons</Link>{" "}
            and the <Link href="/en/guides/getting-started/">guides</Link>, with names taken from the English game files. Daily news and articles
            are translated from the French edition, usually within an hour of publication.
          </p>
        </section>
      </div>
    </>
  );
}
