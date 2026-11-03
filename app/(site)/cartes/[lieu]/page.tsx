import type { Metadata } from "next";
import Link from "next/link";
import { GuideDeLaZone } from "@/components/ChoixGuide";
import { guidesPassantPar } from "@/lib/guide";
import { notFound } from "next/navigation";
import { Ariane } from "@/components/Ariane";
import { FigureCarte, LienLieu } from "@/components/Cartes";
import { Vignette } from "@/components/Visuels";
import { lieu, lieuParNom, pageLieu, tousLesLieux } from "@/lib/cartes";
import { ecranParNom, fondBandeau } from "@/lib/ecrans";

type Props = { params: Promise<{ lieu: string }> };

export function generateStaticParams() {
  return tousLesLieux().map((l) => ({ lieu: l }));
}

function niveaux(min: number, max: number) {
  return min === max ? `${min}` : `${min} à ${max}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const l = lieu((await params).lieu);
  if (!l) return { title: "Lieu introuvable" };
  const niv = l.niveau ? `, niveaux ${niveaux(l.niveau.min, l.niveau.max)}` : "";
  return {
    title: `${l.carte.nom} : carte et guide — WoW Forever`,
    description: `${l.carte.nom} dans WoW Forever, carte du jeu (${l.carte.continent}${niv}) : donjons, zones de départ et zones voisines pour poursuivre la route.`,
    alternates: { canonical: pageLieu(l.slug) },
  };
}

export default async function PageLieu({ params }: Props) {
  const l = lieu((await params).lieu);
  if (!l) notFound();
  const continent = l.carte.type === "continent" ? l.carte.nom : l.carte.continent;
  const ancre = continent === "Kalimdor" ? "#kalimdor" : continent === "Royaumes de l'Est" ? "#royaumes-de-l-est" : "#zephras";
  const fond = l.carte.continent === "Kalimdor" ? "kalimdor" : l.carte.continent === "Royaumes de l'Est" ? "royaumes-de-l-est" : "ile-de-zephras";
  return (
    <>
      <section className="bandeau-page" style={fondBandeau(fond)}>
        <div className="wrap">
          <Ariane etapes={[{ nom: "Cartes du monde", href: "/cartes/" }, { nom: continent, href: `/cartes/${ancre}` }, { nom: l.carte.nom }]} />
          <p className="surtitre">{l.carte.type === "continent" ? "Continent" : continent}{l.niveau ? ` · niveaux ${niveaux(l.niveau.min, l.niveau.max)}` : ""}</p>
          <h1>{l.carte.nom}</h1>
          {l.fiche || guidesPassantPar(l.slug).length ? (
            <div className="actions-bandeau">
              {guidesPassantPar(l.slug).length ? <a href="#guide-1-60" className="btn btn-or" data-cta="guide-zone-bandeau">Faire cette zone avec le guide de 1 à 60</a> : null}
              {l.fiche ? <Link href={l.fiche.lien} className={guidesPassantPar(l.slug).length ? "btn btn-contour" : "btn btn-or"} data-cta="fiche-lieu">Lire la fiche Forever : {l.fiche.nom}</Link> : null}
            </div>
          ) : null}
        </div>
      </section>
      <div className="wrap contenu">
        <div className="colonnes">
          <div className="colonne-principale">
            <FigureCarte slug={l.slug} legende={`Carte : ${l.carte.nom} · cliquer pour agrandir`} priorite />

            <dl className="g4" style={{ margin: "0 0 32px" }}>
              <div className="encadre"><dt className="surtitre">Continent</dt><dd style={{ margin: 0, fontWeight: 600 }}>{continent}</dd></div>
              <div className="encadre"><dt className="surtitre">Niveaux</dt><dd style={{ margin: 0, fontWeight: 600 }}>{l.niveau ? niveaux(l.niveau.min, l.niveau.max) : "—"}</dd></div>
              <div className="encadre"><dt className="surtitre">Donjons</dt><dd style={{ margin: 0, fontWeight: 600 }}>{l.donjons.length + l.raids.length || "Aucun"}</dd></div>
              <div className="encadre"><dt className="surtitre">Nouveauté</dt><dd style={{ margin: 0, fontWeight: 600 }}>{l.niveau?.forever || l.fiche ? "Propre à Forever" : "Azeroth d'origine"}</dd></div>
            </dl>

            <GuideDeLaZone lieu={l.slug} nom={l.carte.nom} />

            {l.departs.length ? (
              <section aria-labelledby="t-depart" style={{ marginBottom: 32 }}>
                <h2 id="t-depart" className="section-titre" style={{ fontSize: 24 }}>Zone de départ</h2>
                <ul>
                  {l.departs.map((d) => (
                    <li key={d.races}>
                      <strong>{d.races}</strong> ({d.faction}) : premiers pas à {d.lieu}{d.capitale && !d.capitale.startsWith("[") ? `, capitale ${d.capitale}` : ""}.
                    </li>
                  ))}
                </ul>
                <p className="doux" style={{ fontSize: 14 }}><Link href="/guides/zones-de-depart/">Toutes les zones de départ</Link></p>
              </section>
            ) : null}

            {l.donjons.length || l.raids.length ? (
              <section aria-labelledby="t-donjons" style={{ marginBottom: 32 }}>
                <h2 id="t-donjons" className="section-titre" style={{ fontSize: 24 }}>Donjons et raids</h2>
                <div className="tableau-boite">
                  <table>
                    <thead><tr><th scope="col">Donjon</th><th scope="col">Niveaux ou joueurs</th></tr></thead>
                    <tbody>
                      {l.donjons.map((d) => (
                        <tr key={d.nom}><td style={{ fontWeight: 600 }}><span className="lien-icone">{ecranParNom(d.nom) ? <Vignette nom={d.nom} /> : null}{d.nom}</span></td><td>{niveaux(d.min, d.max)}</td></tr>
                      ))}
                      {l.raids.map((r) => (
                        <tr key={r.nom}><td style={{ fontWeight: 600 }}><span className="lien-icone">{ecranParNom(r.nom) ? <Vignette nom={r.nom} /> : null}{r.lien ? <Link href={r.lien}>{r.nom}</Link> : r.nom}</span></td><td>{r.joueurs}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="doux" style={{ fontSize: 14 }}><Link href="/guides/liste-des-donjons/">Tous les donjons et raids par niveau</Link></p>
              </section>
            ) : null}

            {l.voisins.length ? (
              <section aria-labelledby="t-voisins">
                <h2 id="t-voisins" className="section-titre" style={{ fontSize: 24 }}>Pour poursuivre la route</h2>
                <ul className="liste-lieux">
                  {l.voisins.map((v) => (
                    <li key={v.slug}><LienLieu slug={v.slug} nom={v.nom} /> <span className="doux">niveaux {niveaux(v.niveau.min, v.niveau.max)}</span></li>
                  ))}
                </ul>
              </section>
            ) : null}
          </div>
          <aside className="colonne-laterale">
            <div className="encadre cadre">
              <h2>Explorer</h2>
              <ul style={{ margin: 0, paddingLeft: 18, fontSize: 15, lineHeight: 1.8 }}>
                <li><Link href="/cartes/">Toutes les cartes</Link></li>
                <li><Link href="/guides/zones-par-niveau/">Zones par niveau</Link></li>
                <li><Link href="/guides/zones-de-depart/">Zones de départ</Link></li>
                <li><Link href="/zones/">Les nouvelles zones de Forever</Link></li>
                {continent !== l.carte.nom && lieuParNom(continent) ? <li><Link href={pageLieu(lieuParNom(continent)!)}>Carte : {continent}</Link></li> : null}
              </ul>
            </div>
            <p className="doux" style={{ fontSize: 13 }}>Carte lue dans les fichiers de WoW Forever grâce à <a href="https://wago.tools" rel="noopener noreferrer">wago.tools</a>.</p>
          </aside>
        </div>
      </div>
    </>
  );
}
