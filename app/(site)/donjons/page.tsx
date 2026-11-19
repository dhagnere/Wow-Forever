import type { Metadata } from "next";
import Link from "next/link";
import { DONJONS, NOTE_DONJONS } from "@/content/monde";
import { DONJONS_ORIGINE, RAIDS, TRANCHES, dansTranche } from "@/content/reference";
import { lieuParNom, pageLieu } from "@/lib/cartes";
import { nombreDeBoss } from "@/lib/donjons";
import { listerPublies } from "@/modules/veille";
import { languesDe } from "@/lib/anglais";
import { Ariane } from "@/components/Ariane";
import { FilArticles } from "@/components/Articles";
import { dateLongue } from "@/lib/site";
import { ECRAN_DONJON, fondBandeau } from "@/lib/ecrans";
import { Vignette } from "@/components/Visuels";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Donjons et raids de WoW Forever",
  description: "Tous les donjons de WoW Forever par niveau : boss dans l'ordre, butin, entrée sur la carte et quêtes, nouveaux donjons repérés en bêta et raids annoncés.",
  alternates: { canonical: "/donjons/", languages: languesDe("/donjons/") },
};

export default async function Donjons() {
  const articles = await listerPublies({ rubrique: "donjons-raids", limite: 5 });
  return (
    <>
      <section className="bandeau-page" style={fondBandeau("ruines-de-lordaeron")}>
        <div className="wrap">
          <Ariane etapes={[{ nom: "Monde", href: "/zones/" }, { nom: "Donjons et raids" }]} />
          <p className="surtitre">La Cave · Donjons et raids</p>
          <h1>Donjons et raids de WoW Forever</h1>
          <p className="chapo">Les {DONJONS_ORIGINE.length} donjons de l&apos;Azeroth d&apos;origine rangés par niveau, avec leurs boss, leur butin dans Forever, l&apos;entrée sur la carte et leurs quêtes. Puis les nouveaux donjons de Forever et les raids annoncés.</p>
          <p className="doux" style={{ margin: "12px 0 0", fontSize: 14 }}>Mis à jour le {dateLongue("2026-11-19")} par Jobwow</p>
        </div>
      </section>
      <div className="wrap contenu">
        <div className="colonnes">
          <div className="colonne-principale" style={{ gap: 48 }}>
            <section aria-labelledby="t-niveaux">
              <h2 id="t-niveaux" className="section-titre" style={{ fontSize: 26, marginBottom: 6 }}>Un donjon à votre niveau</h2>
              <p className="doux" style={{ marginTop: 0 }}>Chaque fiche donne les boss dans l&apos;ordre, ce qu&apos;ils laissent tomber dans Forever, l&apos;entrée sur la carte de la zone et les quêtes à prendre avant d&apos;y aller.</p>
              {TRANCHES.map(([a, b]) => {
                const liste = DONJONS_ORIGINE.filter((d) => dansTranche(d.min, [a, b]));
                if (!liste.length) return null;
                return (
                  <div key={a} style={{ marginBottom: 22 }}>
                    <h3 style={{ margin: "0 0 8px", fontSize: 19 }}>Niveaux {a} à {b}</h3>
                    <div className="tableau-boite">
                      <table>
                        <thead><tr><th scope="col">Donjon</th><th scope="col">Niveaux</th><th scope="col" className="masque-mobile">Entrée</th><th scope="col" className="num">Boss</th></tr></thead>
                        <tbody>
                          {liste.map((d) => {
                            const z = lieuParNom(d.zone);
                            const n = nombreDeBoss(d.slug);
                            return (
                              <tr key={d.slug}>
                                <td style={{ fontWeight: 600 }}><span className="lien-icone"><Vignette nom={d.nom} /><Link href={`/donjons/${d.slug}/`}>{d.nom}</Link></span></td>
                                <td>{d.min}-{d.max}</td>
                                <td className="masque-mobile">{z ? <Link href={pageLieu(z)}>{d.zone}</Link> : d.zone}</td>
                                <td className="num">{n ?? "–"}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}
            </section>
            <section aria-labelledby="t-nouveaux">
              <h2 id="t-nouveaux" className="section-titre" style={{ fontSize: 26, marginBottom: 6 }}>Nouveaux donjons repérés en bêta</h2>
              <p className="doux" style={{ marginTop: 0 }}>{NOTE_DONJONS}</p>
              <div className="tableau-boite">
                <table>
                  <thead><tr><th scope="col">Donjon</th><th scope="col">Accessible dès le niveau</th><th scope="col">Fiche</th></tr></thead>
                  <tbody>
                    {DONJONS.map((d) => (
                      <tr key={d.slug}><td style={{ fontWeight: 600 }}><span className="lien-icone">{ECRAN_DONJON[d.slug] ? <Vignette ecran={ECRAN_DONJON[d.slug]} /> : null}{d.nom}</span></td><td>{d.niveau}</td><td><Link href={`/donjons/${d.slug}/`}>Lire</Link></td></tr>
                    ))}
                    <tr><td colSpan={3} className="doux">[Cinq autres donjons annoncés : noms et niveaux à compléter au lancement]</td></tr>
                  </tbody>
                </table>
              </div>
              <p style={{ fontSize: 15 }}><Link href="/guides/liste-des-donjons/">La liste des donjons en un coup d&apos;œil</Link></p>
            </section>
            <section id="raids" aria-labelledby="t-raids" className="encadre cadre" style={{ padding: 24 }}>
              <p className="surtitre">10 et 20 joueurs</p>
              <h2 id="t-raids" style={{ margin: "0 0 8px", fontSize: 22 }}>Raids</h2>
              <p className="doux" style={{ margin: "0 0 12px" }}>
                Blizzard annonce des raids à 10 et 20 joueurs, dont un raid à 20 au <Link href="/zones/mont-hyjal/">Mont Hyjal</Link>, ouverture annoncée pour décembre. Boss, butin et stratégies seront ajoutés ici dès leur ouverture.
              </p>
              <div className="tableau-boite">
                <table>
                  <thead><tr><th scope="col">Raid</th><th scope="col">Joueurs</th><th scope="col" className="masque-mobile">Zone</th><th scope="col">Statut</th></tr></thead>
                  <tbody>
                    {RAIDS.map((r) => (
                      <tr key={r.nom}>
                        <td style={{ fontWeight: 600 }}><span className="lien-icone"><Vignette nom={r.nom} />{r.lien ? <Link href={r.lien}>{r.nom}</Link> : r.nom}</span></td>
                        <td>{r.joueurs}</td>
                        <td className="masque-mobile">{r.zone}</td>
                        <td className="doux">{r.statut}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
            <section className="encadre-nuit" aria-labelledby="t-monter">
              <h2 id="t-monter" className="titre" style={{ margin: "0 0 8px", fontSize: 24, color: "var(--or-clair)" }}>Monter de 1 à 60</h2>
              <p style={{ margin: "0 0 14px", color: "#cfc7b4" }}>Le parcours de Jobwow, écrit au fil du jeu, zone par zone, avec les quêtes à ne pas rater. Gratuit, en français.</p>
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
