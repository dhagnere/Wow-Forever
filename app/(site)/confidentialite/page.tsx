import type { Metadata } from "next";
import Link from "next/link";
import { languesDe } from "@/lib/anglais";
import { Ariane } from "@/components/Ariane";
import { SITE } from "@/lib/site";
import { fondBandeau } from "@/lib/ecrans";

export const metadata: Metadata = { title: "Politique de confidentialité", alternates: { canonical: "/confidentialite/", languages: languesDe("/confidentialite/") } };

export default function Confidentialite() {
  return (
    <>
      <section className="bandeau-page bandeau-mince" style={fondBandeau("salle-des-thanes")}>
        <div className="wrap">
          <Ariane etapes={[{ nom: "Confidentialité" }]} />
          
          <h1>Politique de confidentialité</h1>
        </div>
      </section>
    <div className="wrap contenu">
      <article className="article corps">
        <p>La Taverne Éternelle collecte le moins de données possible. Voici lesquelles, pourquoi, et comment exercer vos droits.</p>

        <h2>Mesure d&apos;audience du site, sans cookie</h2>
        <p>
          Le site compte ses visites avec son propre outil, hébergé chez Scalingo en France. Il ne dépose aucun cookie et n&apos;enregistre ni votre
          adresse IP ni aucun identifiant durable : chaque visiteur reçoit un code anonyme recalculé chaque jour, impossible à relier d&apos;un jour
          à l&apos;autre. Sont mesurés la page vue, le site d&apos;où vous venez, le type d&apos;appareil, la durée et la part de lecture, les clics
          sur les boutons du site, et les pages introuvables. Le pays est estimé d&apos;après le fuseau horaire de votre navigateur (jamais d&apos;après
          votre adresse IP), avec la langue de celui-ci. Les mots tapés dans la recherche du site sont comptés à part, sans lien avec vous ni avec
          vos autres pages ; une adresse électronique, un lien ou un long nombre n&apos;est jamais gardé. Ces chiffres servent à savoir quels articles
          sont lus et ce qui manque au site, pour mieux écrire les suivants.
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
          clic, qui efface votre adresse de la liste. Les abonnés de l&apos;édition anglaise sont gardés dans une liste à part, avec les mêmes règles.
        </p>

        <h2>Votre compte joueur</h2>
        <p>
          Le compte est facultatif. Il sert à vous connecter, à sauvegarder votre progression dans le guide de 1 à 60 et, si vous cochez la case,
          à recevoir la Lettre. Nous gardons votre pseudo, votre adresse électronique, une empreinte de votre mot de passe (jamais le mot de passe
          lui-même), les quêtes que vous avez cochées et le nombre de quêtes faites chaque jour. Ces données sont hébergées chez Scalingo, en France,
          et ne servent à rien d&apos;autre.
        </p>
        <p>
          Rester connecté demande un cookie, <code>taverne_joueur</code>, déposé seulement quand vous vous connectez et valable trente jours. Il ne sert
          qu&apos;à vous reconnaître et à aucune mesure d&apos;audience ; « Me déconnecter » l&apos;efface. Depuis la page « Mon compte », vous changez de mot de
          passe, arrêtez la Lettre ou supprimez votre compte : tout est alors effacé, progression comprise. Une demande de nouveau mot de passe
          passe par un message envoyé par Brevo, avec un lien valable une heure.
        </p>

        <h2>Tableau des guildes</h2>
        <p>
          Les guildes s&apos;inscrivent sans compte ni adresse électronique. Les informations saisies sont publiques une fois la fiche validée.
          Une empreinte de la connexion, sans l&apos;adresse IP en clair, limite le nombre de fiches déposées par jour.
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
    </>
  );
}
