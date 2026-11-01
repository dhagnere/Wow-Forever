import type { Metadata } from "next";
import Link from "next/link";
import { DONJONS, NOTE_DONJONS } from "@/content/monde";
import { DONJONS_ORIGINE, RAIDS } from "@/content/reference";
import { Ariane } from "@/components/Ariane";
import { ArticlesLies } from "@/components/ArticlesLies";
import { AvertissementReference } from "@/components/AvertissementReference";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Liste des donjons et raids de WoW Forever",
  description: "Tous les donjons de WoW Forever par niveau : nouveaux donjons repérés en bêta, donjons de l'Azeroth d'origine et raids annoncés.",
  alternates: { canonical: "/guides/liste-des-donjons/" },
};

export default function ListeDesDonjons() {
  return (
    <>
      <section className="bandeau-page">
        <div className="wrap">
          <Ariane etapes={[{ nom: "Guides", href: "/guides/bien-demarrer/" }, { nom: "Liste des donjons" }]} />
          <h1>Liste des donjons et raids</h1>
          <p className="chapo">Les nouveaux donjons de Forever, ceux de l&apos;Azeroth d&apos;origine, et les raids, classés par niveau.</p>
        </div>
      </section>
      <div className="wrap contenu">
        <AvertissementReference />
        <div className="colonnes">
          <div className="colonne-principale">
            <section aria-labelledby="t-nouveaux">
              <h2 id="t-nouveaux" className="section-titre" style={{ fontSize: 26 }}>
                Nouveaux donjons de Forever <span className="puce" style={{ fontSize: 13, verticalAlign: "middle" }}>Forever</span>
              </h2>
              <p className="doux" style={{ marginTop: 0 }}>{NOTE_DONJONS}</p>
              <div className="tableau-boite">
                <table>
                  <thead><tr><th scope="col">Donjon</th><th scope="col">Dès le niveau</th><th scope="col">Zone</th></tr></thead>
                  <tbody>
                    {DONJONS.map((d) => (
                      <tr key={d.slug}><td style={{ fontWeight: 600 }}><Link href={`/donjons/${d.slug}/`}>{d.nom}</Link></td><td>{d.niveau}</td><td className="doux">[À confirmer]</td></tr>
                    ))}
                    <tr><td colSpan={3} className="doux">[Cinq autres donjons annoncés : noms et niveaux à compléter au lancement]</td></tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section aria-labelledby="t-origine">
              <h2 id="t-origine" className="section-titre" style={{ fontSize: 26 }}>Donjons de l&apos;Azeroth d&apos;origine</h2>
              <p className="doux" style={{ marginTop: 0 }}>Niveaux conseillés dans le jeu d&apos;origine. Leur présence et leurs niveaux dans Forever restent à confirmer.</p>
              <div className="tableau-boite">
                <table>
                  <thead><tr><th scope="col">Donjon</th><th scope="col">Niveaux</th><th scope="col">Zone</th><th scope="col">Continent</th></tr></thead>
                  <tbody>
                    {DONJONS_ORIGINE.map((d) => (
                      <tr key={d.nom}><td style={{ fontWeight: 600 }}>{d.nom}</td><td>{d.min}–{d.max}</td><td>{d.zone}</td><td className="doux">{d.continent}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section aria-labelledby="t-raids">
              <h2 id="t-raids" className="section-titre" style={{ fontSize: 26 }}>Raids</h2>
              <p className="doux" style={{ marginTop: 0 }}>Forever annonce des raids à 10 et 20 joueurs. Les raids d&apos;origine sont listés pour mémoire.</p>
              <div className="tableau-boite">
                <table>
                  <thead><tr><th scope="col">Raid</th><th scope="col">Joueurs</th><th scope="col">Zone</th><th scope="col">Statut</th></tr></thead>
                  <tbody>
                    {RAIDS.map((r) => (
                      <tr key={r.nom}>
                        <td style={{ fontWeight: 600 }}>{r.lien ? <Link href={r.lien}>{r.nom}</Link> : r.nom}</td>
                        <td>{r.joueurs}</td>
                        <td>{r.zone}</td>
                        <td className="doux">{r.statut}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <ArticlesLies pilier="guides/liste-des-donjons" />
          </div>
          <aside className="colonne-laterale">
            <div className="encadre cadre">
              <h2>Guides liés</h2>
              <ul style={{ margin: 0, paddingLeft: 20, fontSize: 15 }}>
                <li><Link href="/donjons/">Donjons et raids : actualité</Link></li>
                <li><Link href="/guides/zones-par-niveau/">Zones par niveau</Link></li>
                <li><Link href="/guides/zones-de-depart/">Zones de départ</Link></li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
