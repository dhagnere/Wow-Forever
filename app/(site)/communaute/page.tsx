import type { Metadata } from "next";
import Link from "next/link";
import { Ariane } from "@/components/Ariane";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Communauté : le Discord et la Page de la Taverne",
  description: "Rejoignez les joueurs francophones de WoW Forever : entraide aux débutants, recrutement de guildes, captures et Hardcore sur le Discord de la Taverne.",
  alternates: { canonical: "/communaute/" },
};

const SALONS: [string, string][] = [
  ["#comptoir", "les articles de la Taverne, dès leur publication"],
  ["#entraide-debutants", "aucune question n'est bête, surtout la première semaine"],
  ["#classes", "un fil par classe, pour comparer talents et équipement"],
  ["#guildes-recrutement", "les guildes francophones recrutent ici"],
  ["#captures", "vos plus belles images d'Azeroth"],
  ["#hardcore", "pour ceux qui ne meurent qu'une fois"],
];

export default function Communaute() {
  return (
    <>
      <section className="bandeau-page">
        <div className="wrap">
          <Ariane etapes={[{ nom: "Le Comptoir", href: "/actualites/" }, { nom: "Communauté" }]} />
          <p className="surtitre">Entre joueurs</p>
          <h1>La communauté de <span className="accent">la Taverne</span></h1>
          <p className="chapo">Les nouvelles se lisent sur le site ; elles se discutent au Discord. Tirez une chaise.</p>
          <div className="actions-bandeau">
            {SITE.discord ? (
              <a href={SITE.discord} className="btn btn-or" rel="noopener noreferrer" data-cta="discord-communaute">Rejoindre le Discord</a>
            ) : (
              <span className="btn btn-or" aria-disabled="true">Discord : ouverture imminente</span>
            )}
            <a href={SITE.facebook} className="btn btn-contour" rel="noopener noreferrer" data-cta="facebook-communaute">Suivre la Page Facebook</a>
          </div>
        </div>
      </section>
      <div className="wrap contenu article corps">
        <h2>Les salons</h2>
        <ul>
          {SALONS.map(([nom, role]) => <li key={nom}><strong>{nom}</strong> : {role}.</li>)}
        </ul>
        <h2>Les règles de la maison</h2>
        <ul>
          <li>Respect de chacun, débutants compris. Pas d&apos;insulte, pas de harcèlement, pas de contenu choquant.</li>
          <li>Pas de vente d&apos;or, de comptes ni de services de montée de niveau.</li>
          <li>Un lien vers un autre site, oui, s&apos;il répond à la question posée. La publicité, non.</li>
          <li>Les rumeurs se signalent comme telles. Une information sans source reste une rumeur.</li>
        </ul>
        <h2>Vous dirigez une guilde ?</h2>
        <p>Inscrivez-la au <Link href="/guildes/">tableau des guildes</Link> : c&apos;est gratuit, et les joueurs qui cherchent une maison passent par là.</p>
        <p>Une question pour Jobwow, une erreur dans un article ? <Link href="/contact/">Écrivez-lui</Link>.</p>
      </div>
    </>
  );
}
