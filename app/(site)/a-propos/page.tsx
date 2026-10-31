import type { Metadata } from "next";
import { Ariane } from "@/components/Ariane";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: "Qui est Silfax ?", alternates: { canonical: "/a-propos/" } };

export default function APropos() {
  return (
    <div className="wrap contenu">
      <Ariane etapes={[{ nom: "Qui est Silfax ?" }]} />
      <article className="article corps">
        <h1>Qui est Silfax ?</h1>
        <p>[Présentation de Silfax : parcours de joueur, première découverte d&apos;Azeroth, ce qui l&apos;a ramené vers Forever.]</p>
        <h2>Comment le site est fait</h2>
        <p>Chaque matin, un outil repère les nouvelles sur WoW Forever dans les sources françaises et étrangères, les traduit et prépare des brouillons. Silfax les relit, ajoute son avis de joueur et décide de ce qui est publié. Aucun article ne paraît sans cette relecture.</p>
        <p>Les guides, les fiches et le carnet sont écrits à la main, à partir du jeu.</p>
        <h2>Nous suivre</h2>
        <p>Chaque article publié part aussi sur la <a href={SITE.facebook} rel="noopener noreferrer">Page Facebook Azeroth Forever</a>, entre 8h et 22h.</p>
      </article>
    </div>
  );
}
