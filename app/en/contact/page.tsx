import type { Metadata } from "next";
import { Ariane } from "@/components/Ariane";
import { SITE } from "@/lib/site";
import { fondBandeau } from "@/lib/ecrans";

export const metadata: Metadata = {
  title: "Contact",
  alternates: { canonical: "/en/contact/", languages: { fr: "/contact/", en: "/en/contact/", "x-default": "/contact/" } },
};

export default function ContactEn() {
  const sujet = encodeURIComponent("Message for La Taverne Éternelle");
  return (
    <>
      <section className="bandeau-page bandeau-mince" style={fondBandeau("cite-de-dalaran")}>
        <div className="wrap">
          <Ariane langue="en" etapes={[{ nom: "Contact" }]} />
          <h1>Write to the Tavern</h1>
        </div>
      </section>
      <div className="wrap contenu">
        <article className="article corps">
          <p>
            A mistake in an article, information to report, a partnership proposal, a guild to present: Jobwow reads every message and replies
            within a few days. Messages in English are welcome.
          </p>
          <p><a href={`mailto:${SITE.contact}?subject=${sujet}`} className="btn btn-or" data-cta="contact-courriel-en">Write to {SITE.contact}</a></p>
          <h2>Corrections</h2>
          <p>
            A reported and verified mistake is corrected in the article, with the date of the correction. Please give the address of the page
            and, if possible, the source that contradicts the article.
          </p>
        </article>
      </div>
    </>
  );
}
