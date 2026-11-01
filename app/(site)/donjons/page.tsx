import type { Metadata } from "next";
import Link from "next/link";
import { DONJONS, NOTE_DONJONS } from "@/content/monde";
import { listerPublies } from "@/modules/veille";
import { Ariane } from "@/components/Ariane";
import { FilArticles } from "@/components/Articles";
import { dateLongue } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Donjons et raids de WoW Forever",
  description: "Les nouveaux donjons de WoW Forever repérés en bêta, leur niveau d'accès, et les raids à 10 et 20 joueurs annoncés.",
  alternates: { canonical: "/donjons/" },
};

export default async function Donjons() {
  const articles = await listerPublies({ rubrique: "donjons-raids", limite: 5 });
  return (
    <>
      <section className="bandeau-page">
        <div className="wrap">
          <Ariane etapes={[{ nom: "Monde", href: "/zones/" }, { nom: "Donjons et raids" }]} />
          <h1>Donjons et raids de WoW Forever</h1>
          <p className="chapo">Neuf donjons inédits et des raids à 10 et 20 joueurs sont annoncés. Cette page est complétée au fil des annonces et des découvertes en jeu.</p>
          <p className="doux" style={{ margin: "12px 0 0", fontSize: 14 }}>Mis à jour le {dateLongue("2026-10-31")} par Silfax</p>
        </div>
      </section>
      <div className="wrap contenu">
        <div className="colonnes">
          <div className="colonne-principale" style={{ gap: 48 }}>
            <section aria-labelledby="t-nouveaux">
              <h2 id="t-nouveaux" className="section-titre" style={{ fontSize: 26, marginBottom: 6 }}>Nouveaux donjons repérés en bêta</h2>
              <p className="doux" style={{ marginTop: 0 }}>{NOTE_DONJONS}</p>
              <div className="tableau-boite">
                <table>
                  <thead><tr><th scope="col">Donjon</th><th scope="col">Accessible dès le niveau</th><th scope="col">Fiche</th></tr></thead>
                  <tbody>
                    {DONJONS.map((d) => (
                      <tr key={d.slug}><td style={{ fontWeight: 600 }}>{d.nom}</td><td>{d.niveau}</td><td><Link href={`/donjons/${d.slug}/`}>Lire</Link></td></tr>
                    ))}
                    <tr><td colSpan={3} className="doux">[Cinq autres donjons annoncés : noms et niveaux à compléter au lancement]</td></tr>
                  </tbody>
                </table>
              </div>
              <p style={{ fontSize: 15 }}><Link href="/guides/liste-des-donjons/">Voir aussi la liste complète, avec les donjons de l&apos;Azeroth d&apos;origine</Link></p>
            </section>
            <section id="raids" aria-labelledby="t-raids" className="encadre cadre" style={{ padding: 24 }}>
              <p className="surtitre">10 et 20 joueurs</p>
              <h2 id="t-raids" style={{ margin: "0 0 8px", fontSize: 22 }}>Raids</h2>
              <p className="doux" style={{ margin: 0 }}>
                Blizzard annonce des raids à 10 et 20 joueurs, dont un raid à 20 au <Link href="/zones/mont-hyjal/">Mont Hyjal</Link>, ouverture annoncée pour décembre. Boss, butin et stratégies seront ajoutés ici dès leur ouverture.
              </p>
            </section>
            <section className="encadre-nuit" aria-labelledby="t-monter">
              <h2 id="t-monter" className="titre" style={{ margin: "0 0 8px", fontSize: 24, color: "var(--or-clair)" }}>Monter de 1 à 60</h2>
              <p style={{ margin: "0 0 14px", color: "#cfc7b4" }}>Le parcours de Silfax, écrit au fil du jeu, zone par zone, avec les quêtes à ne pas rater. Gratuit, en français.</p>
              <Link href="/carnet/" className="btn btn-or">Suivre le parcours</Link>
            </section>
          </div>
          <aside className="colonne-laterale">
            <div className="encadre">
              <h2>Derniers articles du thème</h2>
              <FilArticles articles={articles} vide="Bientôt." />
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
