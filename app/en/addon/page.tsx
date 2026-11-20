import type { Metadata } from "next";
import Link from "next/link";
import { Ariane } from "@/components/Ariane";
import { languesDe } from "@/lib/anglais";
import { SITE } from "@/lib/site";
import { fondBandeau } from "@/lib/ecrans";
import { lienDemandeAddon } from "@/lib/addonDemande";

export const metadata: Metadata = {
  title: "TaverneRoutes addon: the Tavern's in-game guide",
  description:
    "TaverneRoutes, La Taverne Éternelle's guide addon for WoW Forever: routes recorded in game by Jobwow, step by step. Free, on request by email.",
  alternates: { canonical: "/en/addon/", languages: languesDe("/addon/") },
};

const ETAPES: [string, string][] = [
  ["Write to the Tavern", "the button below prepares the email; give your in-game name, your race and class, and your game client language (French or English)."],
  ["Get the archive", "Jobwow replies with the latest TaverneRoutes version as a .zip file."],
  ["Install it", "unzip the archive into your game's Interface\\AddOns folder, then restart WoW Forever or type /reload."],
];

export default function AddonEn() {
  return (
    <>
      <section className="bandeau-page" style={fondBandeau("kalimdor")}>
        <div className="wrap">
          <Ariane langue="en" etapes={[{ nom: "Leveling guide", href: "/en/leveling-guide/" }, { nom: "TaverneRoutes addon" }]} />
          <p className="surtitre">The Tavern&apos;s guide, in the game</p>
          <h1>The <span className="accent">TaverneRoutes</span> addon</h1>
          <p className="chapo">The routes Jobwow records while playing, followed right in the game, step by step. Free, on request by email.</p>
          <div className="actions-bandeau">
            <a href={lienDemandeAddon("en")} className="btn btn-or" data-cta="addon-demande-en">Request the addon</a>
            <Link href="/en/leveling-guide/" className="btn btn-contour" data-cta="addon-guide-site-en">See the guide on the site</Link>
          </div>
        </div>
      </section>

      <div className="wrap contenu prose" style={{ maxWidth: 820 }}>
        <h2>What TaverneRoutes does</h2>
        <ul>
          <li>It follows the <strong>routes recorded in game</strong> by Jobwow with his TaverneTrace recorder, not a copied commercial guide.</li>
          <li>It relies on the <strong>Questie</strong> quest database to place NPCs and objectives.</li>
          <li>Guidance to the next step goes through the <strong>Shortest Path Forever</strong> addon.</li>
          <li>The guide window is organised in tabs, to keep the screen clear.</li>
        </ul>
        <p className="doux">
          Routes grow with Jobwow&apos;s evenings in game: not every race and class is covered yet. The guide on the site already covers all 56 race and class
          combinations.
        </p>

        <h2>Get it in three steps</h2>
        <ol>
          {ETAPES.map(([titre, texte]) => (
            <li key={titre}><strong>{titre}</strong>: {texte}</li>
          ))}
        </ol>
        <p>
          <a href={lienDemandeAddon("en")} className="btn btn-or" data-cta="addon-demande-bas-en">Request the addon</a>
        </p>
        <p className="doux" style={{ fontSize: 15 }}>
          Your mail app does not open? Write directly to <a href={`mailto:${SITE.contact}`}>{SITE.contact}</a>, subject &quot;TaverneRoutes addon request&quot;. Your address is
          only used to reply to you; it is not added to any list.
        </p>

        <h2>Good to know</h2>
        <ul>
          <li>TaverneRoutes is an unofficial fan addon. It never accepts or turns in a quest for you.</li>
          <li>It is built on Questie, released under the GPL v3 licence: TaverneRoutes follows the same licence.</li>
          <li>
            To keep up between versions: <Link href="/en/newsletter/">the Sunday newsletter</Link> and <Link href="/en/notebook/videos/">the video journal</Link> (in French).
          </li>
        </ul>
      </div>
    </>
  );
}
