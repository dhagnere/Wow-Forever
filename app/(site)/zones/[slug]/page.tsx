import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ZONES } from "@/content/monde";
import { estPilier } from "@/config/taxonomie";
import { Ariane } from "@/components/Ariane";
import { ArticlesLies } from "@/components/ArticlesLies";
import { dateLongue } from "@/lib/site";
import { ECRAN_ZONE, fondBandeau, nomEcran } from "@/lib/ecrans";
import { IllustrationEcran } from "@/components/Visuels";
import { FigureCarte } from "@/components/Cartes";
import { GuideDeLaZone } from "@/components/ChoixGuide";
import { lieuParNom, pageLieu } from "@/lib/cartes";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = (await params).slug;
  const zone = ZONES.find((x) => x.slug === slug);
  if (!zone) return {};
  return { title: `${zone.nom} — zone de WoW Forever`, description: zone.resume, alternates: { canonical: `/zones/${zone.slug}/` } };
}

export default async function PageZone({ params }: Props) {
  const slug = (await params).slug;
  const z = ZONES.find((x) => x.slug === slug);
  if (!z) notFound();
  const pilier = `zones/${z.slug}`;
  return (
    <>
      <section className="bandeau-page" style={fondBandeau(ECRAN_ZONE[z.slug] ?? "kalimdor")}>
        <div className="wrap">
          <Ariane etapes={[{ nom: "Monde", href: "/zones/" }, { nom: z.nom }]} />
          {z.nouvelle ? <p className="surtitre">Nouvelle zone</p> : null}
          <h1>{z.nom}</h1>
          <p className="chapo">{z.resume}</p>
        </div>
      </section>
      <div className="wrap contenu">
        <div className="colonnes">
          <div className="colonne-principale">
            <IllustrationEcran ecran={ECRAN_ZONE[z.slug] ?? "kalimdor"} legende={ECRAN_ZONE[z.slug] === z.slug ? undefined : `En attendant l'écran de la zone, pas encore publié par Blizzard : ${nomEcran(ECRAN_ZONE[z.slug] ?? "kalimdor")}`} />
            <dl className="g4" style={{ margin: 0 }}>
              {[["Continent", z.continent], ["Niveau", z.niveau], ["Statut", z.statut], ["Accès", z.acces]].map(([t, v]) => (
                <div key={t} className="encadre">
                  <dt className="surtitre">{t}</dt>
                  <dd style={{ margin: 0, fontWeight: 600 }}>{v}</dd>
                </div>
              ))}
            </dl>
            {lieuParNom(z.nom) ? (
              <section aria-labelledby="t-carte" style={{ marginBottom: 8 }}>
                <h2 id="t-carte" className="section-titre" style={{ fontSize: 26 }}>Carte de la zone</h2>
                <FigureCarte slug={lieuParNom(z.nom)!} legende={`Carte : ${z.nom}, dans les fichiers du jeu · cliquer pour agrandir`} />
                <p style={{ marginTop: -12 }}><Link href={pageLieu(lieuParNom(z.nom)!)}>Voir le lieu sur les cartes du monde, avec ses voisines</Link></p>
                <GuideDeLaZone lieu={lieuParNom(z.nom)!} nom={z.nom} />
              </section>
            ) : null}
            <section aria-labelledby="t-attend">
              <h2 id="t-attend" className="section-titre" style={{ fontSize: 26 }}>Ce qui vous attend</h2>
              {z.paragraphes.map((p) => <p key={p}>{p}</p>)}
            </section>
            <section aria-labelledby="t-activites">
              <h2 id="t-activites" className="section-titre" style={{ fontSize: 26 }}>Activités</h2>
              <div className="g3">
                {z.activites.map((a) => (
                  <div key={a.titre} className="encadre cadre">
                    <h3 style={{ margin: "0 0 6px", fontSize: 18, color: "var(--or-clair)" }}>{a.titre}</h3>
                    <p className="doux" style={{ margin: 0, fontSize: 15 }}>{a.texte}</p>
                  </div>
                ))}
              </div>
            </section>
            <section className="sources" aria-labelledby="t-fiabilite">
              <h2 id="t-fiabilite">Sources et fiabilité</h2>
              <p style={{ margin: 0 }}>{z.fiabilite}</p>
            </section>
            {estPilier(pilier) ? <ArticlesLies pilier={pilier} /> : null}
          </div>
          <aside className="colonne-laterale">
            <div className="encadre cadre">
              <h2>Les autres nouvelles zones</h2>
              <ul style={{ margin: 0, paddingLeft: 20, fontSize: 15 }}>
                {ZONES.filter((x) => x.slug !== z.slug).map((x) => <li key={x.slug}><Link href={`/zones/${x.slug}/`}>{x.nom}</Link> <span className="doux">— {x.niveau}</span></li>)}
              </ul>
            </div>
            <p className="doux" style={{ margin: 0, fontSize: 14 }}>Fiche mise à jour le {dateLongue(z.misAJour)} par Jobwow.</p>
          </aside>
        </div>
      </div>
    </>
  );
}
