import type { Metadata } from "next";
import Link from "next/link";
import { languesDe } from "@/lib/anglais";
import { Ariane } from "@/components/Ariane";
import { SITE } from "@/lib/site";
import { fondBandeau } from "@/lib/ecrans";

export const metadata: Metadata = {
  title: "Qui est Jobwow ?",
  description: "Jobwow, gnome mage et tavernier de la Taverne Éternelle : qui il est, comment le site est fait, d'où viennent les informations.",
  alternates: { canonical: "/a-propos/", languages: languesDe("/a-propos/") },
};

export default function APropos() {
  return (
    <>
      <section className="bandeau-page" style={fondBandeau("cite-de-dalaran")}>
        <div className="wrap">
          <Ariane etapes={[{ nom: "Qui est Jobwow ?" }]} />
          <div className="presentation-auteur">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/jobwow-512.png" width={200} height={200} alt="Jobwow, gnome mage au chapeau étoilé, lunettes rondes et bâton à orbe lumineux" className="avatar-jobwow" />
            <div>
              <p className="surtitre">Le tavernier</p>
              <h1>Qui est Jobwow ?</h1>
              <p className="chapo">Gnome mage, lunettes rondes, chapeau étoilé : Jobwow tient le comptoir de la Taverne Éternelle et raconte ce qui se passe dans le monde.</p>
            </div>
          </div>
        </div>
      </section>
    <div className="wrap contenu">
      <article className="article corps">
        <p>[Présentation de Jobwow : parcours de joueur, première découverte d&apos;Azeroth, ce qui l&apos;a ramené vers Forever.]</p>
        <h2>Pourquoi une taverne ?</h2>
        <p>
          La taverne, c&apos;est l&apos;auberge où les aventuriers se retrouvent et où circulent les nouvelles. « Éternelle » traduit Forever. Le site
          fait la même chose : il rassemble chaque matin ce qui compte sur WoW Forever, en français.
        </p>
        <h2>Comment le site est fait</h2>
        <p>
          Chaque matin, un outil repère les nouvelles sur WoW Forever dans les sources françaises et étrangères, les traduit et prépare des
          brouillons. Jobwow les relit, ajoute son avis et décide de ce qui est publié. Aucun article ne paraît sans cette relecture.
        </p>
        <p>Les guides, les fiches et le carnet sont écrits à la main, à partir du jeu.</p>
        <h2>La charte de la Taverne</h2>
        <ul>
          <li><strong>Des sources citées.</strong> Chaque information reprise d&apos;un autre site renvoie vers lui. Jamais de rumeur présentée comme un fait.</li>
          <li><strong>Des articles neufs.</strong> Les nouvelles sont réécrites, jamais copiées. Une citation courte au plus, toujours attribuée.</li>
          <li><strong>Des corrections visibles.</strong> Une erreur signalée et vérifiée est corrigée, avec sa date. <Link href="/contact/">Signaler une erreur</Link>.</li>
          <li><strong>Une indépendance affichée.</strong> {SITE.mentionBlizzard}</li>
        </ul>
        <h2>Nous suivre</h2>
        <p>
          Chaque article publié part sur la <a href={SITE.facebook} rel="noopener noreferrer">Page Facebook de la Taverne Éternelle</a>, entre 8h et 22h.
          Pour tout recevoir le dimanche, il y a <Link href="/lettre/">la Lettre</Link> ; pour en discuter, <Link href="/communaute/">la communauté</Link>.
        </p>
      </article>
    </div>
    </>
  );
}
