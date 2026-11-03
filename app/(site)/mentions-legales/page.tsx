import type { Metadata } from "next";
import { Ariane } from "@/components/Ariane";
import { SITE } from "@/lib/site";
import { fondBandeau } from "@/lib/ecrans";

export const metadata: Metadata = { title: "Mentions légales", alternates: { canonical: "/mentions-legales/" } };

export default function MentionsLegales() {
  return (
    <>
      <section className="bandeau-page bandeau-mince" style={fondBandeau("ruines-de-lordaeron")}>
        <div className="wrap">
          <Ariane etapes={[{ nom: "Mentions légales" }]} />
          
          <h1>Mentions légales</h1>
        </div>
      </section>
    <div className="wrap contenu">
      <article className="article corps">
        <h2>Éditeur</h2>
        <p>
          Site édité à titre non professionnel par Jobwow (pseudonyme). Conformément à la loi pour la confiance dans l&apos;économie numérique,
          l&apos;identité de l&apos;éditeur a été communiquée à l&apos;hébergeur. Contact : <a href={`mailto:${SITE.contact}`}>{SITE.contact}</a>.
        </p>
        <p>Directeur de la publication : Jobwow. [Numéro SIRET à ajouter en cas d&apos;activité rémunérée.]</p>
        <h2>Hébergeur</h2>
        <p>Scalingo SAS, 13 rue Jacques Peirotes, 67000 Strasbourg, France — scalingo.com. [Adresse à vérifier au moment de la publication.]</p>
        <h2>Propriété intellectuelle</h2>
        <p>{SITE.mentionBlizzard} Les captures d&apos;écran du jeu sont utilisées dans le cadre de la tolérance accordée par Blizzard aux sites de fans et restent la propriété de Blizzard Entertainment.</p>
        <p>Les textes du site sont la propriété de leur auteur. Les informations reprises d&apos;autres sites sont reformulées et leurs sources sont citées avec un lien.</p>
        <h2 id="cookies">Données personnelles et cookies</h2>
        <p>
          Le site utilise Google Tag Manager pour la mesure d&apos;audience. Aucun cookie de mesure ou de publicité n&apos;est déposé sans
          votre accord : à votre première visite, une bannière vous permet d&apos;accepter ou de refuser. Votre choix est conservé six mois
          dans votre navigateur, puis la question vous est reposée. Vous pouvez le modifier à tout moment avec le lien « Gérer les cookies »
          en bas de page.
        </p>
        <p>
          Le site mesure aussi son audience avec son propre outil, sans cookie ni adresse IP conservée. Le détail de chaque traitement, la Lettre
          comprise, figure dans la <a href="/confidentialite/">politique de confidentialité</a>.
        </p>
        <h2>Crédits</h2>
        <p>
          Icônes des classes, des races et des objets, écrans de chargement qui illustrent les pages, cartes du monde : fichiers du jeu World of Warcraft: Forever, lus grâce à{" "}
          <a href="https://wago.tools" rel="noopener noreferrer">wago.tools</a>. Elles restent la propriété de Blizzard Entertainment et sont
          utilisées dans le cadre de la tolérance accordée aux sites de fans.
        </p>
        <p>
          Base de données des objets : noms, descriptions, niveaux, prix et icônes proviennent des fichiers du jeu World of Warcraft: Forever,
          lus grâce au service <a href="https://wago.tools" rel="noopener noreferrer">wago.tools</a>. Ils restent la propriété de Blizzard Entertainment
          et sont reproduits à titre informatif, dans le cadre d&apos;un site de fans non commercial.
        </p>
        <h2>Liens affiliés</h2>
        <p>Certains liens sont signalés comme affiliés : ils peuvent rapporter une commission au site, sans surcoût pour vous.</p>
      </article>
    </div>
    </>
  );
}
