import type { Metadata } from "next";
import Link from "next/link";
import { Ariane } from "@/components/Ariane";
import { SITE } from "@/lib/site";
import { fondBandeau } from "@/lib/ecrans";

export const metadata: Metadata = {
  title: "Legal notice",
  alternates: { canonical: "/en/legal-notice/", languages: { fr: "/mentions-legales/", en: "/en/legal-notice/", "x-default": "/mentions-legales/" } },
};

export default function LegalNotice() {
  return (
    <>
      <section className="bandeau-page bandeau-mince" style={fondBandeau("ruines-de-lordaeron")}>
        <div className="wrap">
          <Ariane langue="en" etapes={[{ nom: "Legal notice" }]} />
          <h1>Legal notice</h1>
        </div>
      </section>
      <div className="wrap contenu">
        <article className="article corps">
          <p className="info" role="note">
            This is a translation provided for convenience. The <Link href="/mentions-legales/" hrefLang="fr">French version</Link> is the reference text.
          </p>
          <h2>Publisher</h2>
          <p>
            Site published on a non-professional basis by Jobwow (pseudonym). In accordance with the French law on confidence in the digital economy,
            the publisher&apos;s identity has been provided to the host. Contact: <a href={`mailto:${SITE.contact}`}>{SITE.contact}</a>.
          </p>
          <p>Publication director: Jobwow. [SIRET number to be added in case of paid activity.]</p>
          <h2>Host</h2>
          <p>Scalingo SAS, 13 rue Jacques Peirotes, 67000 Strasbourg, France — scalingo.com. [Address to be checked at publication.]</p>
          <h2>Intellectual property</h2>
          <p>
            Independent fan site, not affiliated with Blizzard Entertainment. World of Warcraft and Warcraft are trademarks of Blizzard Entertainment.
            Game screenshots are used under the tolerance Blizzard grants to fan sites and remain the property of Blizzard Entertainment.
          </p>
          <p>The site&apos;s texts belong to their author. Information taken from other sites is rewritten and its sources are credited with a link.</p>
          <h2 id="cookies">Personal data and cookies</h2>
          <p>
            The site uses Google Tag Manager for audience measurement. No measurement or advertising cookie is set without your consent: on your
            first visit, a banner lets you accept or refuse. Your choice is kept for six months in your browser, then you are asked again. You can
            change it at any time with the “Manage cookies” link at the bottom of every page.
          </p>
          <p>
            The site also measures its audience with its own tool, without cookies and without keeping any IP address. Each processing, the
            newsletter included, is detailed in the <Link href="/en/privacy/">privacy policy</Link>.
          </p>
          <h2>Credits</h2>
          <p>
            Class, race and item icons, loading screens illustrating the pages, world maps: World of Warcraft: Forever game files, read thanks to{" "}
            <a href="https://wago.tools" rel="noopener noreferrer">wago.tools</a>. They remain the property of Blizzard Entertainment and are used
            under the tolerance granted to fan sites.
          </p>
          <p>
            Header images of some articles: official artwork released by Blizzard Entertainment for the press and fan sites. It remains the property
            of Blizzard Entertainment, and its credit is shown under each image.
          </p>
          <p>
            Item database: names, descriptions, levels, prices and icons come from the World of Warcraft: Forever game files, read through the{" "}
            <a href="https://wago.tools" rel="noopener noreferrer">wago.tools</a> service. They remain the property of Blizzard Entertainment and are
            reproduced for information, on a non-commercial fan site.
          </p>
          <p>
            Spells and talents on class pages: names, descriptions, values and icons come from the same game files, read thanks to{" "}
            <a href="https://wago.tools" rel="noopener noreferrer">wago.tools</a>. They remain the property of Blizzard Entertainment.
          </p>
          <p>
            “Where to find it” (monsters, drop chances, vendors, chests, quests and locations), class quests and the 1-60 leveling guide: original
            Azeroth data from the free community databases <a href="https://github.com/cmangos/classic-db" rel="noopener noreferrer">CMaNGOS classic-db</a>{" "}
            (GPL v3 licence) and <a href="https://github.com/azerothcore/azerothcore-wotlk" rel="noopener noreferrer">AzerothCore</a> for French names
            (GPL v2 licence). They may differ in WoW Forever. Quest guides only reuse titles, names and positions; objectives are summarised by the
            Tavern, without reusing the game&apos;s texts.
          </p>
          <p>
            English articles are translated from the French articles with the help of an AI model, then published under the same responsibility.
            Jobwow&apos;s take is a faithful translation of the French one.
          </p>
          <h2>Affiliate links</h2>
          <p>Some links are marked as affiliate links: they may earn the site a commission, at no extra cost to you.</p>
        </article>
      </div>
    </>
  );
}
