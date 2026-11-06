import type { Metadata } from "next";
import Link from "next/link";
import { Ariane } from "@/components/Ariane";
import { FormulaireLettre } from "@/app/(site)/lettre/FormulaireLettre";
import { fondBandeau } from "@/lib/ecrans";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "The Tavern's newsletter: WoW Forever every Sunday",
  description: "Every Sunday at 10 am (Paris time): Jobwow's column, the five WoW Forever news of the week, a gameplay tip and the next date to remember.",
  alternates: { canonical: "/en/newsletter/", languages: { fr: "/lettre/", en: "/en/newsletter/", "x-default": "/lettre/" } },
};

export default function NewsletterEn() {
  return (
    <>
      <section className="bandeau-page" style={fondBandeau("cite-de-dalaran")}>
        <div className="wrap">
          <Ariane langue="en" etapes={[{ nom: "News", href: "/en/news/" }, { nom: "The newsletter" }]} />
          <p className="surtitre">Every Sunday at 10 am, Paris time</p>
          <h1>The Tavern&apos;s <span className="accent">newsletter</span></h1>
          <p className="chapo">A week of WoW Forever in a five-minute read, served by Jobwow with the Sunday coffee.</p>
        </div>
      </section>
      <div className="wrap contenu colonnes-lettre">
        <div>
          <h2 className="section-titre" style={{ fontSize: 24 }}>In every issue</h2>
          <ul className="liste-lettre">
            <li><strong>Jobwow&apos;s column</strong>: what he saw pass by the bar this week.</li>
            <li><strong>The five news</strong> you should not have missed.</li>
            <li><strong>The tip</strong>: a gameplay trick, tested and explained.</li>
            <li><strong>The next date</strong> from the <Link href="/en/calendar/">calendar</Link>.</li>
          </ul>
          <p className="doux">Free, no ads. A confirmation is sent by email: your sign-up only counts after your click.</p>
        </div>
        <div className="encadre cadre" style={{ padding: 24 }}>
          <FormulaireLettre langue="en" />
          <p className="doux" style={{ fontSize: 13, margin: "14px 0 0" }}>
            Your address is only used to send the newsletter, kept by the site and never sold. Details in the{" "}
            <Link href="/confidentialite/" hrefLang="fr">privacy policy</Link> (in French).
          </p>
        </div>
      </div>
    </>
  );
}
