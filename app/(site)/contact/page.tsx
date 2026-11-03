import type { Metadata } from "next";
import { Ariane } from "@/components/Ariane";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: "Contact", alternates: { canonical: "/contact/" } };

export default function Contact() {
  const sujet = encodeURIComponent("Message pour la Taverne Éternelle");
  return (
    <div className="wrap contenu">
      <Ariane etapes={[{ nom: "Contact" }]} />
      <article className="article corps">
        <h1>Écrire à la Taverne</h1>
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
  );
}
