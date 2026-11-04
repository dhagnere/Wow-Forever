import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ZONES } from "@/content/monde";
import { ZONES_EN } from "@/content/monde-en";
import { Ariane } from "@/components/Ariane";
import { IllustrationEcran } from "@/components/Visuels";
import { FigureCarte } from "@/components/Cartes";
import { GuideDeLaZoneEn } from "@/components/ChoixGuideEn";
import { ECRAN_ZONE, fondBandeau } from "@/lib/ecrans";
import { lieuParNom } from "@/lib/cartes";
import { pageLieuEn, pageZoneEn, zoneDepuisEn } from "@/lib/anglais";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return Object.values(ZONES_EN).map((z) => ({ slug: z.slug }));
}

function lire(slug: string) {
  const fr = zoneDepuisEn(slug);
  const z = ZONES.find((x) => x.slug === fr);
  return z && ZONES_EN[z.slug] ? { z, e: ZONES_EN[z.slug] } : null;
}

const dateEn = (d: string) => new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Paris" }).format(new Date(d));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const r = lire((await params).slug);
  if (!r) return {};
  const fr = `/zones/${r.z.slug}/`;
  const en = pageZoneEn(r.z.slug);
  return { title: `${r.e.nom} — WoW Forever zone`, description: r.e.resume, alternates: { canonical: en, languages: { fr, en, "x-default": fr } } };
}

export default async function ZoneEn({ params }: Props) {
  const r = lire((await params).slug);
  if (!r) notFound();
  const { z, e } = r;
  const lieu = lieuParNom(z.nom);
  return (
    <>
      <section className="bandeau-page" style={fondBandeau(ECRAN_ZONE[z.slug] ?? "kalimdor")}>
        <div className="wrap">
          <Ariane langue="en" etapes={[{ nom: "World", href: "/en/zones/" }, { nom: e.nom }]} />
          {z.nouvelle ? <p className="surtitre">New zone</p> : null}
          <h1>{e.nom}</h1>
          <p className="chapo">{e.resume}</p>
        </div>
      </section>
      <div className="wrap contenu">
        <div className="colonnes">
          <div className="colonne-principale">
            <IllustrationEcran ecran={ECRAN_ZONE[z.slug] ?? "kalimdor"} langue="en" legende={ECRAN_ZONE[z.slug] === z.slug ? undefined : "Until Blizzard publishes this zone's loading screen, a neighbouring one"} />
            <dl className="g4" style={{ margin: 0 }}>
              {[["Continent", e.continent], ["Level", e.niveau], ["Status", e.statut], ["Access", e.acces]].map(([t, v]) => (
                <div key={t} className="encadre">
                  <dt className="surtitre">{t}</dt>
                  <dd style={{ margin: 0, fontWeight: 600 }}>{v}</dd>
                </div>
              ))}
            </dl>
            {lieu ? (
              <section aria-labelledby="t-carte" style={{ marginBottom: 8 }}>
                <h2 id="t-carte" className="section-titre" style={{ fontSize: 26 }}>Zone map</h2>
                <FigureCarte slug={lieu} langue="en" legende={`Map: ${e.nom}, from the game files · click to enlarge`} />
                <p style={{ marginTop: -12 }}><Link href={pageLieuEn(lieu)}>See the place on the world maps, with its neighbours</Link></p>
                <GuideDeLaZoneEn lieu={lieu} nom={e.nom} />
              </section>
            ) : null}
            <section aria-labelledby="t-attend">
              <h2 id="t-attend" className="section-titre" style={{ fontSize: 26 }}>What awaits you</h2>
              {e.paragraphes.map((p) => <p key={p}>{p}</p>)}
            </section>
            <section aria-labelledby="t-activites">
              <h2 id="t-activites" className="section-titre" style={{ fontSize: 26 }}>Activities</h2>
              <div className="g3">
                {e.activites.map((a) => (
                  <div key={a.titre} className="encadre cadre">
                    <h3 style={{ margin: "0 0 6px", fontSize: 18, color: "var(--or-clair)" }}>{a.titre}</h3>
                    <p className="doux" style={{ margin: 0, fontSize: 15 }}>{a.texte}</p>
                  </div>
                ))}
              </div>
            </section>
            <section className="sources" aria-labelledby="t-fiabilite">
              <h2 id="t-fiabilite">Sources and reliability</h2>
              <p style={{ margin: 0 }}>{e.fiabilite}</p>
            </section>
          </div>
          <aside className="colonne-laterale">
            <div className="encadre cadre">
              <h2>The other new zones</h2>
              <ul style={{ margin: 0, paddingLeft: 20, fontSize: 15 }}>
                {ZONES.filter((x) => x.slug !== z.slug && ZONES_EN[x.slug]).map((x) => (
                  <li key={x.slug}><Link href={pageZoneEn(x.slug)}>{ZONES_EN[x.slug].nom}</Link> <span className="doux">— {ZONES_EN[x.slug].niveau}</span></li>
                ))}
              </ul>
            </div>
            <p className="doux" style={{ margin: 0, fontSize: 14 }}>Page updated on {dateEn(z.misAJour)} by Jobwow.</p>
          </aside>
        </div>
      </div>
    </>
  );
}
