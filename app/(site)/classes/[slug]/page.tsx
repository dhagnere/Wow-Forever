import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CLASSES, trouverClasse } from "@/content/classes";
import { estPilier } from "@/config/taxonomie";
import { Ariane } from "@/components/Ariane";
import { Embleme } from "@/components/Visuels";
import { ArticlesLies } from "@/components/ArticlesLies";
import { dateLongue } from "@/lib/site";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = trouverClasse((await params).slug);
  if (!c) return {};
  return {
    title: `Guide du ${c.nom} sur WoW Forever`,
    description: `${c.nom} sur WoW Forever : rôles (${c.roles.join(", ").toLowerCase()}), races possibles, conseils pour bien débuter et équipement.`,
    alternates: { canonical: `/classes/${c.slug}/` },
  };
}

export default async function PageClasse({ params }: Props) {
  const c = trouverClasse((await params).slug);
  if (!c) notFound();
  const pilier = `classes/${c.slug}`;

  return (
    <>
      <section className="bandeau-page">
        <div className="wrap" style={{ display: "flex", flexWrap: "wrap", gap: 36, alignItems: "center" }}>
          <span style={{ width: 150, flex: "none" }}><Embleme nom={c.nom} couleur={c.couleur} /></span>
          <div style={{ flex: "1 1 480px" }}>
            <Ariane etapes={[{ nom: "Classes", href: "/classes/" }, { nom: c.nom }]} />
            <h1>Le {c.nom}</h1>
            <p className="chapo" style={{ marginBottom: 18 }}>{c.presentation}</p>
            <ul className="puces">
              {c.roles.map((r) => <li key={r} className="puce">{r}</li>)}
              <li className="puce puce-douce">Armure : {c.armure}</li>
            </ul>
          </div>
        </div>
      </section>

      <div className="wrap contenu">
        <div className="colonnes">
          <div className="colonne-principale">
            <section aria-labelledby="t-pour">
              <h2 id="t-pour" className="section-titre" style={{ fontSize: 26 }}>Fait pour vous si…</h2>
              <div className="g3">
                {c.pourVous.map((p) => (
                  <div key={p.titre} className="encadre cadre">
                    <h3 style={{ margin: "0 0 6px", fontSize: 18, color: "var(--or-clair)" }}>{p.titre}</h3>
                    <p className="doux" style={{ margin: 0, fontSize: 15 }}>{p.texte}</p>
                  </div>
                ))}
              </div>
            </section>

            <section aria-labelledby="t-races">
              <h2 id="t-races" className="section-titre" style={{ fontSize: 26 }}>Races possibles</h2>
              <div className="tableau-boite">
                <table>
                  <thead><tr><th scope="col">Race</th><th scope="col">Faction</th><th scope="col">Statut</th></tr></thead>
                  <tbody>
                    {c.races.map((r) => (
                      <tr key={r.race}>
                        <td style={{ fontWeight: 600 }}>{r.lien ? <Link href={r.lien}>{r.race}</Link> : r.race}</td>
                        <td>{r.faction}</td>
                        <td className="doux">{r.statut}</td>
                      </tr>
                    ))}
                    <tr><td colSpan={3} className="doux">[Autres combinaisons annoncées par Forever : à compléter dès confirmation]</td></tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section aria-labelledby="t-debut">
              <h2 id="t-debut" className="section-titre" style={{ fontSize: 26 }}>Bien débuter</h2>
              <ol style={{ margin: 0, paddingLeft: 22, display: "flex", flexDirection: "column", gap: 10 }}>
                {c.debuter.map((d) => <li key={d.titre}><strong>{d.titre}</strong> {d.texte}</li>)}
              </ol>
            </section>

            <section aria-labelledby="t-equip">
              <h2 id="t-equip" className="section-titre" style={{ fontSize: 26 }}>Équipement conseillé</h2>
              <p className="doux" style={{ margin: 0 }}>[Tableau par rôle et par palier de niveau : à remplir dès les premiers relevés en jeu, à partir du 5 novembre.]</p>
            </section>

            {estPilier(pilier) ? <ArticlesLies pilier={pilier} /> : null}
          </div>

          <aside className="colonne-laterale">
            <div className="encadre cadre">
              <h2>Autres classes</h2>
              <ul style={{ margin: 0, paddingLeft: 20, fontSize: 15 }}>
                {CLASSES.filter((x) => x.slug !== c.slug).map((x) => <li key={x.slug}><Link href={`/classes/${x.slug}/`}>{x.nom}</Link></li>)}
              </ul>
            </div>
            <p className="doux" style={{ margin: 0, fontSize: 14 }}>Guide mis à jour le {dateLongue(c.misAJour)} par Silfax.</p>
          </aside>
        </div>
      </div>
    </>
  );
}
