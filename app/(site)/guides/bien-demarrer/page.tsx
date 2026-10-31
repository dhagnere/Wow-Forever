import type { Metadata } from "next";
import Link from "next/link";
import { Ariane } from "@/components/Ariane";
import { ArticlesLies } from "@/components/ArticlesLies";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Bien démarrer sur WoW Forever",
  description: "Date et heure de sortie, abonnement, choix de la classe, de la race et du serveur : tout pour bien démarrer sur WoW Forever.",
  alternates: { canonical: "/guides/bien-demarrer/" },
};

export default function BienDemarrer() {
  return (
    <>
      <section className="bandeau-page">
        <div className="wrap">
          <Ariane etapes={[{ nom: "Guides" }, { nom: "Bien démarrer" }]} />
          <h1>Bien démarrer sur WoW Forever</h1>
          <p className="chapo">Le guide pour les débutants comme pour les revenants : ce qu&apos;il faut savoir avant le premier soir de jeu.</p>
        </div>
      </section>
      <div className="wrap contenu">
        <div className="colonnes">
          <article className="colonne-principale corps" style={{ gap: 0 }}>
            <h2>Quand peut-on jouer ?</h2>
            <p>Le lancement est mondial : le 4 novembre à 15h, heure du Pacifique, soit le 5 novembre à minuit en France. Tous les serveurs ouvrent en même temps.</p>
            <h2>Faut-il acheter le jeu ?</h2>
            <p>Non. Forever est compris dans l&apos;abonnement à World of Warcraft ou dans le temps de jeu. Les éditions vendues en boutique sont facultatives : elles ajoutent des bonus et des codes pour inviter des amis, qui pourront jouer gratuitement du 5 au 11 novembre. La nouvelle race <Link href="/races/skyborne/">Skyborne</Link> demande l&apos;une des éditions supérieures.</p>
            <h2>Quelle classe choisir ?</h2>
            <p>Tout dépend de votre façon de jouer. Les <Link href="/classes/">fiches de classe</Link> détaillent rôles, points forts et races possibles. [Conseil personnel de Silfax pour un premier personnage.]</p>
            <h2>Qu&apos;est-ce qui change par rapport à Classic ?</h2>
            <ul>
              <li>Le niveau maximal reste fixé à 60.</li>
              <li>Plus de 1 000 nouvelles quêtes réparties entre les niveaux 1 et 60.</li>
              <li>Neuf donjons inédits et des raids à 10 et 20 joueurs.</li>
              <li>De nouvelles zones : <Link href="/zones/mont-hyjal/">Mont Hyjal</Link>, <Link href="/zones/rives-claires/">Rives Claires</Link>, <Link href="/zones/ile-de-zephras/">île de Zéphras</Link> et <Link href="/zones/shendralar/">Shen&apos;dralar</Link>.</li>
              <li>Une nouvelle race jouable, les Skyborne, et de nouvelles combinaisons race et classe.</li>
            </ul>
            <h2>Choisir son serveur</h2>
            <p>[Types de serveurs proposés au lancement et conseils de Silfax : à compléter à l&apos;ouverture.]</p>
            <div style={{ marginTop: 32 }}><ArticlesLies pilier="guides/bien-demarrer" titre="Articles pour bien démarrer" /></div>
          </article>
          <aside className="colonne-laterale">
            <div className="encadre-nuit">
              <h2 className="titre" style={{ margin: "0 0 6px", fontSize: 19, color: "var(--or-clair)" }}>Le carnet de Silfax</h2>
              <p style={{ margin: "0 0 14px", fontSize: 15, color: "#cfc7b4" }}>De 1 à 60, une semaine après l&apos;autre, chaque dimanche à 18h.</p>
              <Link href="/carnet/" className="btn btn-or">Ouvrir le carnet</Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
