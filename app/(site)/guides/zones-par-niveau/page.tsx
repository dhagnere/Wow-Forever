import type { Metadata } from "next";
import Link from "next/link";
import { TRANCHES, ZONES_NIVEAUX, ZONES_SANS_NIVEAU, DONJONS_ORIGINE, dansTranche } from "@/content/reference";
import { Ariane } from "@/components/Ariane";
import { ArticlesLies } from "@/components/ArticlesLies";
import { AvertissementReference } from "@/components/AvertissementReference";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Zones par niveau de WoW Forever, de 1 à 60",
  description: "Toutes les zones de WoW Forever classées par niveau, de 1 à 60, avec leur continent et les donjons de chaque tranche.",
  alternates: { canonical: "/guides/zones-par-niveau/" },
};

function niveaux(min: number, max: number) {
  return min === max ? `${min}` : `${min}–${max}`;
}

export default function ZonesParNiveau() {
  return (
    <>
      <section className="bandeau-page">
        <div className="wrap">
          <Ariane etapes={[{ nom: "Guides", href: "/guides/bien-demarrer/" }, { nom: "Zones par niveau" }]} />
          <h1>Zones par niveau</h1>
          <p className="chapo">De 1 à 60, les zones à parcourir tranche par tranche, avec les donjons à portée.</p>
        </div>
      </section>
      <div className="wrap contenu">
        <AvertissementReference />
        <nav aria-label="Tranches de niveau" className="onglets">
          {TRANCHES.map(([a, b]) => <a key={a} href={`#niveaux-${a}`}>Niveaux {a}–{b}</a>)}
        </nav>
        <div className="colonnes">
          <div className="colonne-principale">
            {TRANCHES.map(([a, b]) => {
              const zones = ZONES_NIVEAUX.filter((z) => dansTranche(z.min, [a, b]));
              const donjons = DONJONS_ORIGINE.filter((d) => dansTranche(d.min, [a, b]));
              return (
                <section key={a} id={`niveaux-${a}`} aria-labelledby={`t-${a}`}>
                  <h2 id={`t-${a}`} className="section-titre" style={{ fontSize: 26 }}>Niveaux {a} à {b}</h2>
                  <div className="tableau-boite">
                    <table>
                      <thead><tr><th scope="col">Zone</th><th scope="col">Niveaux</th><th scope="col">Continent</th></tr></thead>
                      <tbody>
                        {zones.map((z) => (
                          <tr key={z.nom}>
                            <td style={{ fontWeight: 600 }}>
                              {z.lien ? <Link href={z.lien}>{z.nom}</Link> : z.nom}
                              {z.forever ? <span className="puce" style={{ marginLeft: 8, fontSize: 12 }}>Forever</span> : null}
                            </td>
                            <td>{niveaux(z.min, z.max)}{z.incertain ? <span className="doux"> (à confirmer)</span> : null}</td>
                            <td className="doux">{z.continent}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {donjons.length ? (
                    <p className="doux" style={{ fontSize: 15, marginTop: 10 }}>
                      Donjons de la tranche : {donjons.map((d) => `${d.nom} (${niveaux(d.min, d.max)})`).join(", ")}.{" "}
                      <Link href="/guides/liste-des-donjons/">Tous les donjons</Link>
                    </p>
                  ) : null}
                </section>
              );
            })}
            <section aria-labelledby="t-inconnu">
              <h2 id="t-inconnu" className="section-titre" style={{ fontSize: 22 }}>Niveaux encore inconnus</h2>
              <p>
                {ZONES_SANS_NIVEAU.map((z, i) => <span key={z.nom}>{i ? ", " : ""}<Link href={z.lien}>{z.nom}</Link></span>)} : nouvelle
                zone de Forever dont les niveaux n&apos;ont pas encore été communiqués.
              </p>
            </section>
            <ArticlesLies pilier="guides/zones-par-niveau" />
          </div>
          <aside className="colonne-laterale">
            <div className="encadre cadre">
              <h2>Guides liés</h2>
              <ul style={{ margin: 0, paddingLeft: 20, fontSize: 15 }}>
                <li><Link href="/guides/zones-de-depart/">Zones de départ</Link></li>
                <li><Link href="/guides/liste-des-donjons/">Liste des donjons</Link></li>
                <li><Link href="/zones/">Les nouvelles zones de Forever</Link></li>
              </ul>
            </div>
            <div className="encadre">
              <h2>Le parcours de Silfax</h2>
              <p className="doux" style={{ margin: "0 0 10px", fontSize: 15 }}>La route réellement suivie, semaine après semaine.</p>
              <Link href="/carnet/">Ouvrir le carnet</Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
