import type { Metadata } from "next";
import { Ariane } from "@/components/Ariane";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: "Mentions légales", alternates: { canonical: "/mentions-legales/" } };

export default function MentionsLegales() {
  return (
    <div className="wrap contenu">
      <Ariane etapes={[{ nom: "Mentions légales" }]} />
      <article className="article corps">
        <h1>Mentions légales</h1>
        <h2>Éditeur</h2>
        <p>[Nom et prénom de l&apos;éditeur, ou dénomination si micro-entreprise] · [Adresse postale ou domiciliation] · [Adresse électronique de contact]</p>
        <p>Directeur de la publication : [Nom].</p>
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
          [À compléter : outils réellement activés dans le conteneur Google Tag Manager (par exemple Google Analytics), durée de conservation
          des données, destinataires (Google), transferts hors Union européenne, droits des personnes et adresse de contact.]
        </p>
        <h2>Crédits</h2>
        <p>
          Icônes de classes : dessins des contributeurs de <a href="https://game-icons.net" rel="noopener noreferrer">game-icons.net</a>,
          sous licence <a href="https://creativecommons.org/licenses/by/3.0/deed.fr" rel="noopener noreferrer">Creative Commons BY 3.0</a>,
          recolorés et encadrés pour Azeroth Forever.
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
  );
}
