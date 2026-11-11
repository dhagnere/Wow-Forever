import type { Metadata } from "next";
import Link from "next/link";
import { Ariane } from "@/components/Ariane";
import { SITE } from "@/lib/site";
import { fondBandeau } from "@/lib/ecrans";

export const metadata: Metadata = {
  title: "Who is Jobwow?",
  description: "Jobwow, Horde Undead and innkeeper of La Taverne Éternelle: who he is, how the site is made, where the information comes from.",
  alternates: { canonical: "/en/about/", languages: { fr: "/a-propos/", en: "/en/about/", "x-default": "/a-propos/" } },
};

export default function AboutEn() {
  return (
    <>
      <section className="bandeau-page" style={fondBandeau("cite-de-dalaran")}>
        <div className="wrap">
          <Ariane langue="en" etapes={[{ nom: "Who is Jobwow?" }]} />
          <div className="presentation-auteur">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/jobwow-512.png" width={200} height={200} alt="Jobwow's avatar: a figure with a starry hat, round glasses and a glowing orb staff" className="avatar-jobwow" />
            <div>
              <p className="surtitre">The innkeeper</p>
              <h1>Who is Jobwow?</h1>
              <p className="chapo">A Horde Undead, Jobwow keeps the bar of La Taverne Éternelle and tells what happens in the world, to players of both factions.</p>
            </div>
          </div>
        </div>
      </section>
      <div className="wrap contenu">
        <article className="article corps">
          <p>[Introduction of Jobwow: player background, first discovery of Azeroth, what brought him back to Forever.]</p>
          <h2>Why a tavern?</h2>
          <p>
            The tavern is the inn where adventurers meet and where news travels. « Éternelle » translates Forever. The site does the same: every
            morning, it gathers what matters about WoW Forever, first in French, then translated into English.
          </p>
          <h2>How the site is made</h2>
          <p>
            Every morning, a tool spots WoW Forever news in French and foreign sources, translates it and prepares drafts. Jobwow reviews them, adds
            his take and decides what gets published. No article appears without this review. English articles are then translated from the
            published French ones.
          </p>
          <p>The guides, the pages and the notebook are written by hand, from the game.</p>
          <h2>The Tavern&apos;s charter</h2>
          <ul>
            <li><strong>Sources credited.</strong> Every piece of information taken from another site links back to it. Never a rumour presented as a fact.</li>
            <li><strong>New articles.</strong> News is rewritten, never copied. At most one short quote, always attributed.</li>
            <li><strong>Visible corrections.</strong> A reported and verified mistake is corrected, with its date. <Link href="/en/contact/">Report a mistake</Link>.</li>
            <li><strong>Declared independence.</strong> Independent fan site, not affiliated with Blizzard Entertainment. World of Warcraft and Warcraft are trademarks of Blizzard Entertainment.</li>
          </ul>
          <h2>Follow us</h2>
          <p>
            Every published article goes out on the <a href={SITE.facebook} rel="noopener noreferrer">La Taverne Éternelle Facebook page</a>, between
            8 am and 10 pm (Paris time). To get everything on Sunday, there is <Link href="/en/newsletter/">the newsletter</Link>; to talk about it,{" "}
            <Link href="/en/community/">the community</Link>.
          </p>
          <p>
            Jobwow&apos;s play sessions, recorded without any paid guide, are on <Link href="/en/notebook/videos/">the videos page</Link>
            {SITE.youtube ? <> and on <a href={SITE.youtube} rel="noopener noreferrer">the Tavern&apos;s YouTube channel</a></> : null}.
          </p>
        </article>
      </div>
    </>
  );
}
