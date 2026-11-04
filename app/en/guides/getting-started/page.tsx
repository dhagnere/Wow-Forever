import type { Metadata } from "next";
import Link from "next/link";
import { HeureLocale } from "@/components/HeureLocale";
import { Ariane } from "@/components/Ariane";
import { SITE } from "@/lib/site";
import { fondBandeau } from "@/lib/ecrans";
import { pageZoneEn } from "@/lib/anglais";

export const metadata: Metadata = {
  title: "Getting started in WoW Forever",
  description: "Launch date and time, subscription, choosing your class, race and realm: everything you need to get started in WoW Forever.",
  alternates: { canonical: "/en/guides/getting-started/", languages: { fr: "/guides/bien-demarrer/", en: "/en/guides/getting-started/", "x-default": "/guides/bien-demarrer/" } },
};

export default function GettingStarted() {
  return (
    <>
      <section className="bandeau-page" style={fondBandeau("royaumes-de-l-est")}>
        <div className="wrap">
          <Ariane langue="en" etapes={[{ nom: "Guides" }, { nom: "Getting started" }]} />
          <h1>Getting started in WoW Forever</h1>
          <p className="chapo">The guide for newcomers and returning players alike: what to know before your first evening of play.</p>
        </div>
      </section>
      <div className="wrap contenu">
        <div className="colonnes">
          <article className="colonne-principale corps" style={{ gap: 0 }}>
            <h2>When can you play?</h2>
            <p>The launch is worldwide: 4 November at 3 pm Pacific time, which is midnight on 5 November in France. All realms open at the same time. For you, that will be <HeureLocale iso="2026-11-05T00:00" langue="en" />.</p>
            <h2>Do you need to buy the game?</h2>
            <p>No. Forever is included in the World of Warcraft subscription or game time. The editions sold in the shop are optional: they add bonuses and codes to invite friends, who can play for free from 5 to 11 November. The new <Link href="/en/races/skyborne/">Skyborne</Link> race requires one of the higher editions.</p>
            <h2>Which class should you pick?</h2>
            <p>It all depends on how you like to play. The <Link href="/en/classes/">class pages</Link> detail spells, talents and playable races. [Jobwow&apos;s personal advice for a first character.]</p>
            <div className="actions-bandeau" style={{ margin: "4px 0 20px" }}>
              <Link href="/en/classes/" className="btn btn-or" data-cta="classes-debuter-en">Choose my class</Link>
              {SITE.discord ? <a href={SITE.discord} className="btn btn-contour" rel="noopener noreferrer" data-cta="discord-debuter-en">Join the Tavern on Discord</a> : null}
            </div>
            <h2>What changes compared to Classic?</h2>
            <ul>
              <li>The level cap stays at 60.</li>
              <li>More than 1,000 new quests spread between levels 1 and 60.</li>
              <li>Nine new dungeons and raids for 10 and 20 players.</li>
              <li>New zones: <Link href={pageZoneEn("mont-hyjal")}>Mount Hyjal</Link>, <Link href={pageZoneEn("rives-claires")}>Riverglades</Link>, <Link href={pageZoneEn("ile-de-zephras")}>Zephras Isle</Link> and <Link href={pageZoneEn("shendralar")}>Shen&apos;dralar</Link>.</li>
              <li>A new playable race, the Skyborne, and new race and class combinations.</li>
            </ul>
            <h2>Where to start, where to go next?</h2>
            <p>
              Each race has its own <Link href="/en/guides/starting-zones/">starting zone</Link>. For the rest of the journey, the{" "}
              <Link href="/en/guides/zones-by-level/">zones by level</Link>, the <Link href="/en/guides/dungeon-list/">dungeon list</Link> and the{" "}
              <Link href="/en/leveling-guide/">leveling guide</Link> give the steps from 1 to 60.
            </p>
            <h2>Choosing your realm</h2>
            <p>[Realm types offered at launch and Jobwow&apos;s advice: to be completed when the servers open.]</p>
          </article>
          <aside className="colonne-laterale">
            <div className="encadre-nuit">
              <h2 className="titre" style={{ margin: "0 0 6px", fontSize: 19, color: "var(--or-clair)" }}>Leveling guide 1-60</h2>
              <p style={{ margin: "0 0 14px", fontSize: 15, color: "#cfc7b4" }}>Quest by quest, for your race and class, with your progress saved.</p>
              <Link href="/en/leveling-guide/" className="btn btn-or">Open the guide</Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
