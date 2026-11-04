import type { Metadata } from "next";
import Link from "next/link";
import { Ariane } from "@/components/Ariane";
import { SITE } from "@/lib/site";
import { fondBandeau } from "@/lib/ecrans";

export const metadata: Metadata = {
  title: "Support the Tavern",
  description: "La Taverne Éternelle is free and without intrusive ads. A one-off or monthly donation pays for hosting and the time spent.",
  alternates: { canonical: "/en/support/", languages: { fr: "/soutenir/", en: "/en/support/", "x-default": "/soutenir/" } },
};

const FINANCE: [string, string][] = [
  ["Hosting", "the site, its database and its backups, hosted in France."],
  ["The morning watch", "the tool that reads sources from around the world and prepares the translated drafts."],
  ["The domain name", "so the Tavern keeps its address."],
  ["Jobwow's time", "reviewing, checking, writing the guides and keeping the Discord bar."],
];

export default function SupportEn() {
  const ouvert = !!(SITE.donPonctuel || SITE.donMensuel);
  return (
    <>
      <section className="bandeau-page" style={fondBandeau("excavations-les-paluns")}>
        <div className="wrap">
          <Ariane langue="en" etapes={[{ nom: "Support the Tavern" }]} />
          <p className="surtitre">A mug for the innkeeper</p>
          <h1>Support <span className="accent">the Tavern</span></h1>
          <p className="chapo">
            The Tavern is free, for everyone, and will stay that way. If it helps you, you can buy a round: that is what keeps the door open.
          </p>
          {ouvert ? (
            <div className="actions-bandeau">
              {SITE.donPonctuel ? <a href={SITE.donPonctuel} className="btn btn-or" rel="noopener noreferrer" target="_blank" data-cta="don-ponctuel-en">Buy Jobwow a mug</a> : null}
              {SITE.donMensuel ? <a href={SITE.donMensuel} className={SITE.donPonctuel ? "btn btn-contour" : "btn btn-or"} rel="noopener noreferrer" target="_blank" data-cta="don-mensuel-en">Support every month</a> : null}
            </div>
          ) : (
            <p className="doux" style={{ marginTop: 18 }}>Donations open soon. Meanwhile, the best support is free: tell people around you about the Tavern.</p>
          )}
        </div>
      </section>
      <div className="wrap contenu article corps">
        <h2>What donations pay for</h2>
        <ul>{FINANCE.map(([quoi, detail]) => <li key={quoi}><strong>{quoi}</strong>: {detail}</li>)}</ul>

        <h2>What does not change</h2>
        <ul>
          <li>All content stays free. No article, guide or tool is reserved for donors.</li>
          <li>A donation buys no influence: Jobwow&apos;s views remain his own, and partnerships are always disclosed.</li>
          <li>No promised reward the Tavern could not deliver.</li>
        </ul>

        <h2>Good to know</h2>
        <p>
          Donations go through {SITE.plateformeDon || "[donation platform]"}, which handles the payment: the Tavern never sees your bank
          details. They are made to a private individual and give no right to a tax reduction. A monthly donation stops in one click from your
          account on the platform.
        </p>

        <h2>Help without paying</h2>
        <ul>
          <li>Share an article or a guide that helped you.</li>
          <li>Subscribe to <Link href="/en/newsletter/">the newsletter</Link> and follow the <a href={SITE.facebook} rel="noopener noreferrer">Facebook page</a>.</li>
          <li>Register your guild on the <Link href="/en/guilds/">guild board</Link>.</li>
          <li>Report a mistake: <Link href="/en/contact/">write to us</Link>.</li>
        </ul>
      </div>
    </>
  );
}
