import type { Metadata } from "next";
import Link from "next/link";
import { Ariane } from "@/components/Ariane";
import { FormulaireLettre } from "./FormulaireLettre";
import { fondBandeau } from "@/lib/ecrans";

export const metadata: Metadata = {
  title: "La Lettre de la Taverne : WoW Forever chaque dimanche",
  description: "Chaque dimanche à 10 h : le billet de Jobwow, les cinq nouvelles de la semaine sur WoW Forever, un tuyau de jeu et la prochaine date à retenir.",
  alternates: { canonical: "/lettre/" },
};

export default function Lettre() {
  return (
    <>
      <section className="bandeau-page" style={fondBandeau("cite-de-dalaran")}>
        <div className="wrap">
          <Ariane etapes={[{ nom: "Le Comptoir", href: "/actualites/" }, { nom: "La Lettre" }]} />
          <p className="surtitre">Chaque dimanche à 10 h</p>
          <h1>La Lettre de <span className="accent">la Taverne</span></h1>
          <p className="chapo">Une semaine de WoW Forever en cinq minutes de lecture, servie par Jobwow avec le café du dimanche.</p>
        </div>
      </section>
      <div className="wrap contenu colonnes-lettre">
        <div>
          <h2 className="section-titre" style={{ fontSize: 24 }}>Au menu de chaque Lettre</h2>
          <ul className="liste-lettre">
            <li><strong>Le billet de Jobwow</strong> : ce qu&apos;il a vu passer au comptoir cette semaine.</li>
            <li><strong>Les cinq nouvelles</strong> qu&apos;il ne fallait pas rater.</li>
            <li><strong>Le tuyau</strong> : une astuce de jeu, testée et expliquée.</li>
            <li><strong>La prochaine date</strong> du <Link href="/calendrier/">calendrier</Link>.</li>
          </ul>
          <p className="doux">Gratuite, sans publicité. Une confirmation vous est envoyée par courriel : l&apos;inscription n&apos;est valable qu&apos;après votre clic.</p>
        </div>
        <div className="encadre cadre" style={{ padding: 24 }}>
          <FormulaireLettre />
          <p className="doux" style={{ fontSize: 13, margin: "14px 0 0" }}>
            Votre adresse sert uniquement à l&apos;envoi de la Lettre, par notre prestataire Brevo. Détails dans la <Link href="/confidentialite/">politique de confidentialité</Link>.
          </p>
        </div>
      </div>
    </>
  );
}
