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
        <h2>Données personnelles et cookies</h2>
        <p>[À compléter avant l&apos;activation de la publicité : mesure d&apos;audience, cookies publicitaires, bannière de consentement, droits des personnes et contact.]</p>
        <h2>Liens affiliés</h2>
        <p>Certains liens sont signalés comme affiliés : ils peuvent rapporter une commission au site, sans surcoût pour vous.</p>
      </article>
    </div>
  );
}
