import type { Metadata } from "next";
import Link from "next/link";
import { ZONES_DEPART } from "@/content/reference";
import { Ariane } from "@/components/Ariane";
import { ArticlesLies } from "@/components/ArticlesLies";
import { AvertissementReference } from "@/components/AvertissementReference";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Zones de départ de WoW Forever, race par race",
  description: "Où commence chaque race dans WoW Forever : lieu de départ, zone des niveaux 1 à 10, capitale et continent, Skyborne compris.",
  alternates: { canonical: "/guides/zones-de-depart/" },
};

export default function ZonesDeDepart() {
  return (
    <>
      <section className="bandeau-page">
        <div className="wrap">
          <Ariane etapes={[{ nom: "Guides", href: "/guides/bien-demarrer/" }, { nom: "Zones de départ" }]} />
          <h1>Zones de départ</h1>
          <p className="chapo">Chaque race commence dans son propre coin d&apos;Azeroth, du niveau 1 au niveau 10 environ, avant de rejoindre les zones partagées.</p>
        </div>
      </section>
      <div className="wrap contenu">
        <AvertissementReference />
        <div className="colonnes">
          <div className="colonne-principale">
            <section aria-labelledby="t-tableau">
              <h2 id="t-tableau" className="section-titre" style={{ fontSize: 26 }}>Race par race</h2>
              <div className="tableau-boite">
                <table>
                  <thead>
                    <tr><th scope="col">Races</th><th scope="col">Faction</th><th scope="col">Lieu de départ</th><th scope="col">Zone (1–10)</th><th scope="col">Capitale</th><th scope="col">Continent</th></tr>
                  </thead>
                  <tbody>
                    {ZONES_DEPART.map((z) => (
                      <tr key={z.races}>
                        <td style={{ fontWeight: 600 }}>
                          {z.races}
                          {z.forever ? <span className="puce" style={{ marginLeft: 8, fontSize: 12 }}>Forever</span> : null}
                        </td>
                        <td>{z.faction}</td>
                        <td>{z.lieu}</td>
                        <td>{z.lien ? <Link href={z.lien}>{z.zone}</Link> : z.zone}</td>
                        <td>{z.capitale}</td>
                        <td className="doux">{z.continent}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section aria-labelledby="t-skyborne" className="encadre-chaud cadre">
              <h2 id="t-skyborne" className="titre" style={{ margin: "0 0 8px", fontSize: 22, color: "var(--or-clair)" }}>Le cas des Skyborne</h2>
              <p style={{ margin: "0 0 10px", color: "var(--texte-chaud)" }}>
                Seule race de Forever ouverte aux deux factions, les Skyborne commencent tous sur l&apos;île de Zéphras, au village de Thendal,
                chaque faction dans sa propre version de la zone. La race demande l&apos;une des éditions supérieures du jeu.
              </p>
              <p style={{ margin: 0 }}>
                <Link href="/races/skyborne/">Fiche des Skyborne</Link> · <Link href="/zones/ile-de-zephras/">Fiche de l&apos;île de Zéphras</Link>
              </p>
            </section>

            <section aria-labelledby="t-apres">
              <h2 id="t-apres" className="section-titre" style={{ fontSize: 26 }}>Et après le niveau 10 ?</h2>
              <p>
                Les zones des niveaux 10 à 20 prennent le relais : Marche de l&apos;Ouest, Loch Modan, Forêt des Pins-Argentés, Sombrivage,
                Les Tarides. Le détail, niveau par niveau, est dans <Link href="/guides/zones-par-niveau/">les zones par niveau</Link>.
              </p>
              <p className="doux">[Conseil de Silfax : quelle zone de départ choisir pour un premier personnage, et pourquoi.]</p>
            </section>

            <ArticlesLies pilier="guides/zones-de-depart" />
          </div>
          <aside className="colonne-laterale">
            <div className="encadre cadre">
              <h2>Guides liés</h2>
              <ul style={{ margin: 0, paddingLeft: 20, fontSize: 15 }}>
                <li><Link href="/guides/bien-demarrer/">Bien démarrer sur WoW Forever</Link></li>
                <li><Link href="/guides/zones-par-niveau/">Zones par niveau</Link></li>
                <li><Link href="/guides/liste-des-donjons/">Liste des donjons</Link></li>
                <li><Link href="/races/">Les races</Link></li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
