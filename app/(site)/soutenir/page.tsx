import type { Metadata } from "next";
import Link from "next/link";
import { languesDe } from "@/lib/anglais";
import { Ariane } from "@/components/Ariane";
import { SITE } from "@/lib/site";
import { fondBandeau } from "@/lib/ecrans";

export const metadata: Metadata = {
  title: "Soutenir la Taverne",
  description: "La Taverne Éternelle est gratuite et sans publicité envahissante. Un don ponctuel ou mensuel paie l'hébergement et le temps passé.",
  alternates: { canonical: "/soutenir/", languages: languesDe("/soutenir/") },
};

const FINANCE: [string, string][] = [
  ["L'hébergement", "le site, sa base de données et ses sauvegardes, hébergés en France."],
  ["La veille du matin", "l'outil qui lit les sources du monde entier et prépare les brouillons traduits."],
  ["Le nom de domaine", "pour que la Taverne garde son adresse."],
  ["Le temps de Jobwow", "relire, vérifier, écrire les guides et tenir le comptoir du Discord."],
];

export default function Soutenir() {
  const ouvert = !!(SITE.donPonctuel || SITE.donMensuel);
  return (
    <>
      <section className="bandeau-page" style={fondBandeau("excavations-les-paluns")}>
        <div className="wrap">
          <Ariane etapes={[{ nom: "Soutenir la Taverne" }]} />
          <p className="surtitre">Une chope pour le tavernier</p>
          <h1>Soutenir <span className="accent">la Taverne</span></h1>
          <p className="chapo">
            La Taverne est gratuite, pour tout le monde, et le restera. Si elle vous rend service, vous pouvez payer une tournée : c&apos;est ce qui
            garde la porte ouverte.
          </p>
          {ouvert ? (
            <div className="actions-bandeau">
              {SITE.donPonctuel ? <a href={SITE.donPonctuel} className="btn btn-or" rel="noopener noreferrer" target="_blank" data-cta="don-ponctuel">Offrir une chope à Jobwow</a> : null}
              {SITE.donMensuel ? <a href={SITE.donMensuel} className={SITE.donPonctuel ? "btn btn-contour" : "btn btn-or"} rel="noopener noreferrer" target="_blank" data-cta="don-mensuel">Soutenir chaque mois</a> : null}
            </div>
          ) : (
            <p className="doux" style={{ marginTop: 18 }}>Les dons ouvrent bientôt. En attendant, le meilleur soutien reste gratuit : parler de la Taverne autour de vous.</p>
          )}
        </div>
      </section>
      <div className="wrap contenu article corps">
        <h2>Ce que financent les dons</h2>
        <ul>{FINANCE.map(([quoi, detail]) => <li key={quoi}><strong>{quoi}</strong> : {detail}</li>)}</ul>

        <h2>Ce qui ne change pas</h2>
        <ul>
          <li>Tout le contenu reste gratuit. Aucun article, guide ni outil n&apos;est réservé aux donateurs.</li>
          <li>Un don n&apos;achète aucune influence : les avis de Jobwow restent les siens, et les partenariats sont toujours signalés.</li>
          <li>Pas de contrepartie promise que la Taverne ne pourrait pas tenir.</li>
        </ul>

        <h2>Bon à savoir</h2>
        <p>
          Les dons sont versés par {SITE.plateformeDon || "[plateforme de dons]"}, qui encaisse le paiement : la Taverne ne voit jamais vos
          coordonnées bancaires. Ils sont faits à un particulier et ne donnent pas droit à une réduction d&apos;impôt. Un don mensuel s&apos;arrête
          en un clic depuis votre compte sur la plateforme.
        </p>

        <h2>Aider sans payer</h2>
        <ul>
          <li>Partager un article ou un guide qui vous a servi.</li>
          <li>Vous abonner à <Link href="/lettre/">la Lettre</Link> et suivre la <a href={SITE.facebook} rel="noopener noreferrer">Page Facebook</a>.</li>
          <li>Inscrire votre guilde au <Link href="/guildes/">tableau des guildes</Link>.</li>
          <li>Signaler une erreur : <Link href="/contact/">écrivez-nous</Link>.</li>
        </ul>
      </div>
    </>
  );
}
