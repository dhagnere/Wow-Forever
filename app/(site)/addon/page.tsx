import type { Metadata } from "next";
import Link from "next/link";
import { languesDe } from "@/lib/anglais";
import { Ariane } from "@/components/Ariane";
import { SITE } from "@/lib/site";
import { fondBandeau } from "@/lib/ecrans";
import { lienDemandeAddon } from "@/lib/addonDemande";

export const metadata: Metadata = {
  title: "Addon TaverneRoutes : le guide de la Taverne en jeu",
  description:
    "TaverneRoutes, l'addon guide de la Taverne Éternelle pour WoW Forever : les routes relevées en jeu par Jobwow, étape par étape. Gratuit, sur simple demande par courriel.",
  alternates: { canonical: "/addon/", languages: languesDe("/addon/") },
};

const ETAPES: [string, string][] = [
  ["Écrivez à la Taverne", "le bouton ci-dessous prépare le message ; indiquez votre pseudo, votre race et votre classe, et la langue de votre client (français ou anglais)."],
  ["Recevez l'archive", "Jobwow vous répond avec la dernière version de TaverneRoutes, en fichier .zip."],
  ["Installez-le", "décompressez l'archive dans le dossier Interface\\AddOns de votre jeu, puis relancez WoW Forever ou tapez /reload."],
];

export default function Addon() {
  return (
    <>
      <section className="bandeau-page" style={fondBandeau("kalimdor")}>
        <div className="wrap">
          <Ariane etapes={[{ nom: "Guides", href: "/guides/parcours/" }, { nom: "Addon TaverneRoutes" }]} />
          <p className="surtitre">Le guide de la Taverne, dans le jeu</p>
          <h1>Addon <span className="accent">TaverneRoutes</span></h1>
          <p className="chapo">
            Les routes que Jobwow relève en jouant, suivies directement en jeu, étape par étape. Gratuit, sur simple demande par courriel.
          </p>
          <div className="actions-bandeau">
            <a href={lienDemandeAddon("fr")} className="btn btn-or" data-cta="addon-demande">Demander l&apos;addon</a>
            <Link href="/guides/parcours/" className="btn btn-contour" data-cta="addon-guide-site">Voir le guide sur le site</Link>
          </div>
        </div>
      </section>

      <div className="wrap contenu prose" style={{ maxWidth: 820 }}>
        <h2>Ce que fait TaverneRoutes</h2>
        <ul>
          <li>Il suit les <strong>routes relevées en jeu</strong> par Jobwow avec son enregistreur TaverneTrace, et non un guide commercial recopié.</li>
          <li>Il s&apos;appuie sur la base de quêtes de <strong>Questie</strong> pour placer les PNJ et les objectifs.</li>
          <li>Le guidage vers l&apos;étape suivante passe par l&apos;addon <strong>Shortest Path Forever</strong>.</li>
          <li>La fenêtre du guide se range en onglets, pour garder l&apos;écran dégagé.</li>
        </ul>
        <p className="doux">
          Les routes s&apos;enrichissent au fil des soirées de Jobwow : toutes les races et toutes les classes ne sont pas encore couvertes. Le guide du site,
          lui, couvre déjà les 56 combinaisons de race et de classe.
        </p>

        <h2>Le recevoir en trois étapes</h2>
        <ol>
          {ETAPES.map(([titre, texte]) => (
            <li key={titre}><strong>{titre}</strong> : {texte}</li>
          ))}
        </ol>
        <p>
          <a href={lienDemandeAddon("fr")} className="btn btn-or" data-cta="addon-demande-bas">Demander l&apos;addon</a>
        </p>
        <p className="doux" style={{ fontSize: 15 }}>
          Votre messagerie ne s&apos;ouvre pas ? Écrivez directement à <a href={`mailto:${SITE.contact}`}>{SITE.contact}</a>, objet « Demande de l&apos;addon TaverneRoutes ».
          Votre adresse ne sert qu&apos;à vous répondre ; elle n&apos;est inscrite à aucune liste.
        </p>

        <h2>Bon à savoir</h2>
        <ul>
          <li>TaverneRoutes est un addon de fan, non officiel. Il ne prend ni ne rend aucune quête à votre place.</li>
          <li>Il est bâti sur Questie, distribué sous licence GPL v3 : TaverneRoutes suit la même licence.</li>
          <li>
            Pour suivre la Taverne entre deux versions : <Link href="/lettre/">la Lettre du dimanche</Link> et <Link href="/carnet/videos/">le Journal en vidéo</Link>.
          </li>
        </ul>
      </div>
    </>
  );
}
