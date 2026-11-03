import type { Metadata } from "next";
import Link from "next/link";
import { Ariane } from "@/components/Ariane";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: "Politique de confidentialité", alternates: { canonical: "/confidentialite/" } };

export default function Confidentialite() {
  return (
    <div className="wrap contenu">
      <Ariane etapes={[{ nom: "Confidentialité" }]} />
      <article className="article corps">
        <h1>Politique de confidentialité</h1>
        <p>La Taverne Éternelle collecte le moins de données possible. Voici lesquelles, pourquoi, et comment exercer vos droits.</p>

        <h2>Mesure d&apos;audience du site, sans cookie</h2>
        <p>
          Le site compte ses visites avec son propre outil, hébergé chez Scalingo en France. Il ne dépose aucun cookie et n&apos;enregistre ni votre
          adresse IP ni aucun identifiant durable : chaque visiteur reçoit un code anonyme recalculé chaque jour, impossible à relier d&apos;un jour
          à l&apos;autre. Sont mesurés la page vue, le site d&apos;où vous venez, le type d&apos;appareil, la durée et la part de lecture, ainsi que
          les clics sur les boutons du site. Ces chiffres servent à savoir quels articles sont lus, pour mieux écrire les suivants.
        </p>

        <h2>Google Tag Manager et Google Analytics</h2>
        <p>
          Ces outils ne se chargent qu&apos;avec votre accord, donné dans le bandeau d&apos;arrivée. Vous pouvez le retirer à tout moment par le lien
          « Gérer les cookies » en pied de page. Les données sont alors traitées par Google, y compris hors de l&apos;Union européenne.
        </p>

        <h2>La Lettre de la Taverne</h2>
        <p>
          Votre adresse électronique sert uniquement à l&apos;envoi de la Lettre. Elle est conservée par notre prestataire Brevo, entreprise française,
          jamais revendue ni prêtée. L&apos;inscription se fait en double validation ; chaque Lettre contient un lien de désinscription en un
          clic, qui efface votre adresse de la liste.
        </p>

        <h2>Contenus intégrés</h2>
        <p>
          Les vidéos YouTube sont intégrées en mode « confidentialité renforcée » (youtube-nocookie.com) : YouTube ne dépose de cookie
          qu&apos;au lancement de la vidéo. Les liens vers Discord et Facebook ne transmettent rien avant votre clic.
        </p>

        <h2>Vos droits</h2>
        <p>
          Vous pouvez demander l&apos;accès, la rectification ou l&apos;effacement de vos données en écrivant à <a href={`mailto:${SITE.contact}`}>{SITE.contact}</a>.
          En cas de désaccord, vous pouvez saisir la CNIL (cnil.fr). Voir aussi les <Link href="/mentions-legales/">mentions légales</Link>.
        </p>
      </article>
    </div>
  );
}
