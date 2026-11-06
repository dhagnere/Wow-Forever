import type { Metadata } from "next";
import Link from "next/link";
import { Ariane } from "@/components/Ariane";
import { SITE } from "@/lib/site";
import { fondBandeau } from "@/lib/ecrans";

export const metadata: Metadata = {
  title: "Privacy policy",
  alternates: { canonical: "/en/privacy/", languages: { fr: "/confidentialite/", en: "/en/privacy/", "x-default": "/confidentialite/" } },
};

export default function Privacy() {
  return (
    <>
      <section className="bandeau-page bandeau-mince" style={fondBandeau("salle-des-thanes")}>
        <div className="wrap">
          <Ariane langue="en" etapes={[{ nom: "Privacy" }]} />
          <h1>Privacy policy</h1>
        </div>
      </section>
      <div className="wrap contenu">
        <article className="article corps">
          <p className="info" role="note">
            This is a translation provided for convenience. The <Link href="/confidentialite/" hrefLang="fr">French version</Link> is the reference text.
          </p>
          <p>La Taverne Éternelle collects as little data as possible. Here is which data, why, and how to exercise your rights.</p>

          <h2>Audience measurement, without cookies</h2>
          <p>
            The site counts its visits with its own tool, hosted by Scalingo in France. It sets no cookie and records neither your IP address nor any
            lasting identifier: each visitor gets an anonymous code recalculated every day, which cannot be linked from one day to the next. It measures
            the page viewed, the site you came from, the type of device, the time spent and the share read, clicks on the site&apos;s buttons, and pages
            not found. The country is estimated from your browser&apos;s time zone (never from your IP address), along with its language. Words typed in
            the site&apos;s search are counted separately, with no link to you or to your other pages; an email address, a link or a long number is never
            kept. These figures show which articles are read and what the site is missing, to write better ones.
          </p>

          <h2>Google Tag Manager and Google Analytics</h2>
          <p>
            These tools only load with your consent, given in the banner on arrival. You can withdraw it at any time with the « Gérer les cookies »
            (manage cookies) link at the bottom of French pages. The data is then processed by Google, including outside the European Union.
          </p>

          <h2>The Tavern&apos;s newsletter</h2>
          <p>
            Your email address is only used to send the newsletter, and is never sold or lent. It is kept in the site&apos;s database, hosted by
            Scalingo, in France. Sign-up uses double confirmation: a request that is never confirmed is deleted after seven days. Each newsletter
            contains a one-click unsubscribe link, which deletes your address. Messages are sent through our email provider, Resend (Resend, Inc.,
            United States), which only receives the address and the message to deliver; this transfer outside the European Union is [framework to be
            specified from Resend&apos;s data processing agreement].
          </p>

          <h2>Your player account</h2>
          <p>
            The account is optional. It lets you log in, save your progress in the 1-60 leveling guide and, if you tick the box, receive the newsletter.
            We keep your username, your email address, a fingerprint of your password (never the password itself), the quests you ticked and the number
            of quests done each day. This data is hosted by Scalingo, in France, and serves no other purpose.
          </p>
          <p>
            Staying logged in requires a cookie, <code>taverne_joueur</code>, set only when you log in and valid for thirty days. It is only used to
            recognise you and for no audience measurement; « Log out » removes it. From the account page, you can change your password, stop the
            newsletter or delete your account: everything is then erased, progress included. A new password request goes through a message sent by
            Resend, with a link valid for one hour.
          </p>

          <h2>Guild board</h2>
          <p>
            Guilds register without an account or email address. The information entered is public once the listing is approved. A connection
            fingerprint, without the IP address in clear, limits the number of listings per day.
          </p>

          <h2>Embedded content</h2>
          <p>
            YouTube videos are embedded in “privacy-enhanced” mode (youtube-nocookie.com): YouTube only sets a cookie when the video starts. Links to
            Discord and Facebook send nothing before you click.
          </p>

          <h2>Your rights</h2>
          <p>
            You can request access to, correction or deletion of your data by writing to <a href={`mailto:${SITE.contact}`}>{SITE.contact}</a>. In case
            of disagreement, you can refer the matter to the CNIL, the French data protection authority (cnil.fr). See also the{" "}
            <Link href="/en/legal-notice/">legal notice</Link>.
          </p>
        </article>
      </div>
    </>
  );
}
