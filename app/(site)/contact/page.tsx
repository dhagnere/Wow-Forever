import type { Metadata } from "next";
import { languesDe } from "@/lib/anglais";
import { Ariane } from "@/components/Ariane";
import { SITE } from "@/lib/site";
import { fondBandeau } from "@/lib/ecrans";

export const metadata: Metadata = { title: "Contact", alternates: { canonical: "/contact/", languages: languesDe("/contact/") } };

export default function Contact() {
  const sujet = encodeURIComponent("Message pour la Taverne Éternelle");
  return (
    <>
      <section className="bandeau-page bandeau-mince" style={fondBandeau("cite-de-dalaran")}>
        <div className="wrap">
          <Ariane etapes={[{ nom: "Contact" }]} />
          
          <h1>Écrire à la Taverne</h1>
        </div>
      </section>
    <div className="wrap contenu">
      <article className="article corps">
        <p>
          Une erreur dans un article, une information à signaler, une proposition de partenariat, une guilde à présenter : Jobwow lit tous les
          messages et répond sous quelques jours.
        </p>
        <p><a href={`mailto:${SITE.contact}?subject=${sujet}`} className="btn btn-or" data-cta="contact-courriel">Écrire à {SITE.contact}</a></p>
        <h2>Corrections</h2>
        <p>
          Une erreur signalée et vérifiée est corrigée dans l&apos;article, avec la date de la correction. Merci d&apos;indiquer l&apos;adresse de
          la page et, si possible, la source qui contredit l&apos;article.
        </p>
      </article>
    </div>
    </>
  );
}
