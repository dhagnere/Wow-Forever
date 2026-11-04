import type { Metadata } from "next";
import Link from "next/link";
import { Ariane } from "@/components/Ariane";
import { SITE } from "@/lib/site";
import { fondBandeau } from "@/lib/ecrans";

export const metadata: Metadata = {
  title: "Community: the Tavern's Discord and Facebook page",
  description: "Join the Tavern's WoW Forever players: help for beginners, guild recruitment, screenshots and Hardcore on the Tavern's Discord.",
  alternates: { canonical: "/en/community/", languages: { fr: "/communaute/", en: "/en/community/", "x-default": "/communaute/" } },
};

/** Les salons gardent leur nom français : c'est celui du serveur Discord. */
const SALONS: [string, string][] = [
  ["#comptoir", "the Tavern's articles, as soon as they are published"],
  ["#entraide-debutants", "no question is silly, especially in the first week"],
  ["#classes", "one thread per class, to compare talents and gear"],
  ["#guildes-recrutement", "French-speaking guilds recruit here"],
  ["#captures", "your best pictures of Azeroth"],
  ["#hardcore", "for those who only die once"],
];

export default function CommunityEn() {
  return (
    <>
      <section className="bandeau-page" style={fondBandeau("iles-des-sombrelances")}>
        <div className="wrap">
          <Ariane langue="en" etapes={[{ nom: "News", href: "/en/news/" }, { nom: "Community" }]} />
          <p className="surtitre">Among players</p>
          <h1>The <span className="accent">Tavern</span> community</h1>
          <p className="chapo">The news is read on the site; it is discussed on Discord. Pull up a chair.</p>
          <div className="actions-bandeau">
            {SITE.discord ? (
              <a href={SITE.discord} className="btn btn-or" rel="noopener noreferrer" data-cta="discord-communaute-en">Join the Discord</a>
            ) : (
              <span className="btn btn-or" aria-disabled="true">Discord: opening soon</span>
            )}
            <a href={SITE.facebook} className="btn btn-contour" rel="noopener noreferrer" data-cta="facebook-communaute-en">Follow the Facebook page</a>
          </div>
        </div>
      </section>
      <div className="wrap contenu article corps">
        <p>The Tavern&apos;s Discord is mostly French-speaking: English-speaking players are welcome, and the channels keep their French names.</p>
        <h2>The channels</h2>
        <ul>
          {SALONS.map(([nom, role]) => <li key={nom}><strong>{nom}</strong>: {role}.</li>)}
        </ul>
        <h2>House rules</h2>
        <ul>
          <li>Respect for everyone, beginners included. No insults, no harassment, no shocking content.</li>
          <li>No selling of gold, accounts or leveling services.</li>
          <li>A link to another site, yes, if it answers the question asked. Advertising, no.</li>
          <li>Rumours are flagged as such. Information without a source remains a rumour.</li>
        </ul>
        <h2>Running a guild?</h2>
        <p>List it on the <Link href="/en/guilds/">guild board</Link>: it is free, and players looking for a home go through there.</p>
        <p>A question for Jobwow, a mistake in an article? <Link href="/en/contact/">Write to him</Link>.</p>
      </div>
    </>
  );
}
