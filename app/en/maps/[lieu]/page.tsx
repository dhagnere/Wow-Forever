import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Ariane } from "@/components/Ariane";
import { FigureCarte, LienLieu } from "@/components/Cartes";
import { GuideDeLaZoneEn } from "@/components/ChoixGuideEn";
import { Vignette } from "@/components/Visuels";
import { guidesPassantPar } from "@/lib/guide";
import { lieu, lieuParNom, tousLesLieux } from "@/lib/cartes";
import { ecranParNom, fondBandeau } from "@/lib/ecrans";
import { CONTINENTS_EN, lieuDepuisEn, LIEUX_EN, nomDonjonEn, nomLieuEn, pageLieuEn, RACES_DEPART_EN } from "@/lib/anglais";

type Props = { params: Promise<{ lieu: string }> };

export function generateStaticParams() {
  return tousLesLieux().filter((l) => LIEUX_EN[l]).map((l) => ({ lieu: LIEUX_EN[l] }));
}

const niveaux = (min: number, max: number) => (min === max ? `${min}` : `${min} to ${max}`);
const lire = (slugEn: string) => lieu(lieuDepuisEn(slugEn) ?? "");
/** Nom anglais d'un donjon ; à défaut (raid pas encore nommé), une mention à compléter plutôt qu'un nom inventé. */
const donjonEn = (nom: string) => nomDonjonEn(nom) ?? (nom.startsWith("[") ? "[Name to be confirmed]" : nom);
/** « 40 dans l'Azeroth d'origine » → « 40 in original Azeroth ». */
const joueursEn = (j: string) => j.replace(/^(\d+)( dans l'Azeroth d'origine)?$/, (_, n, o) => `${n} players${o ? " in original Azeroth" : ""}`);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const l = lire((await params).lieu);
  if (!l) return { title: "Place not found" };
  const nom = nomLieuEn(l.slug) ?? l.carte.nom;
  const continent = CONTINENTS_EN[l.carte.continent] ?? l.carte.continent;
  const niv = l.niveau ? `, levels ${niveaux(l.niveau.min, l.niveau.max)}` : "";
  return {
    title: `${nom}: map and guide — WoW Forever`,
    description: `${nom} in WoW Forever, game map (${continent}${niv}): dungeons, starting zones and neighbouring zones to continue the road.`,
    alternates: { canonical: pageLieuEn(l.slug), languages: { fr: `/cartes/${l.slug}/`, en: pageLieuEn(l.slug), "x-default": `/cartes/${l.slug}/` } },
  };
}

export default async function LieuEn({ params }: Props) {
  const l = lire((await params).lieu);
  if (!l) notFound();
  const nom = nomLieuEn(l.slug) ?? l.carte.nom;
  const continentFr = l.carte.type === "continent" ? l.carte.nom : l.carte.continent;
  const continent = l.carte.type === "continent" ? nom : CONTINENTS_EN[continentFr] ?? continentFr;
  const ancre = continentFr === "Kalimdor" ? "#kalimdor" : continentFr === "Royaumes de l'Est" ? "#eastern-kingdoms" : "#zephras";
  const fond = l.carte.continent === "Kalimdor" ? "kalimdor" : l.carte.continent === "Royaumes de l'Est" ? "royaumes-de-l-est" : "ile-de-zephras";
  const guides = guidesPassantPar(l.slug).length > 0;
  const slugContinent = lieuParNom(continentFr);
  return (
    <>
      <section className="bandeau-page" style={fondBandeau(fond)}>
        <div className="wrap">
          <Ariane langue="en" etapes={[{ nom: "World maps", href: "/en/maps/" }, { nom: continent, href: `/en/maps/${ancre}` }, { nom }]} />
          <p className="surtitre">{l.carte.type === "continent" ? "Continent" : continent}{l.niveau ? ` · levels ${niveaux(l.niveau.min, l.niveau.max)}` : ""}</p>
          <h1>{nom}</h1>
          {l.fiche || guides ? (
            <div className="actions-bandeau">
              {guides ? <a href="#guide-1-60" className="btn btn-or" data-cta="guide-zone-bandeau-en">Do this zone with the 1-60 guide</a> : null}
              {l.fiche ? <Link href={l.fiche.lien} hrefLang="fr" className={guides ? "btn btn-contour" : "btn btn-or"} data-cta="fiche-lieu-en">Forever zone page (in French)</Link> : null}
            </div>
          ) : null}
        </div>
      </section>
      <div className="wrap contenu">
        <div className="colonnes">
          <div className="colonne-principale">
            <FigureCarte slug={l.slug} langue="en" legende={`Map: ${nom} · click to enlarge`} priorite />

            <dl className="g4" style={{ margin: "0 0 32px" }}>
              <div className="encadre"><dt className="surtitre">Continent</dt><dd style={{ margin: 0, fontWeight: 600 }}>{continent}</dd></div>
              <div className="encadre"><dt className="surtitre">Levels</dt><dd style={{ margin: 0, fontWeight: 600 }}>{l.niveau ? niveaux(l.niveau.min, l.niveau.max) : "—"}</dd></div>
              <div className="encadre"><dt className="surtitre">Dungeons</dt><dd style={{ margin: 0, fontWeight: 600 }}>{l.donjons.length + l.raids.length || "None"}</dd></div>
              <div className="encadre"><dt className="surtitre">New content</dt><dd style={{ margin: 0, fontWeight: 600 }}>{l.niveau?.forever || l.fiche ? "Specific to Forever" : "Original Azeroth"}</dd></div>
            </dl>

            <GuideDeLaZoneEn lieu={l.slug} nom={nom} />

            {l.departs.length ? (
              <section aria-labelledby="t-depart" style={{ marginBottom: 32 }}>
                <h2 id="t-depart" className="section-titre" style={{ fontSize: 24 }}>Starting zone</h2>
                <ul>
                  {l.departs.map((d) => {
                    const capitale = lieuParNom(d.capitale);
                    return (
                      <li key={d.races}>
                        <strong>{RACES_DEPART_EN[d.races] ?? d.races}</strong> ({d.faction === "Alliance ou Horde" ? "Alliance or Horde" : d.faction})
                        {capitale && capitale !== l.slug ? <>: capital <Link href={pageLieuEn(capitale)}>{nomLieuEn(capitale) ?? d.capitale}</Link></> : null}.
                      </li>
                    );
                  })}
                </ul>
              </section>
            ) : null}

            {l.donjons.length || l.raids.length ? (
              <section aria-labelledby="t-donjons" style={{ marginBottom: 32 }}>
                <h2 id="t-donjons" className="section-titre" style={{ fontSize: 24 }}>Dungeons and raids</h2>
                <div className="tableau-boite">
                  <table>
                    <thead><tr><th scope="col">Dungeon</th><th scope="col">Levels or players</th></tr></thead>
                    <tbody>
                      {l.donjons.map((d) => (
                        <tr key={d.nom}><td style={{ fontWeight: 600 }}><span className="lien-icone">{ecranParNom(d.nom) ? <Vignette nom={d.nom} /> : null}{donjonEn(d.nom)}</span></td><td>{niveaux(d.min, d.max)}</td></tr>
                      ))}
                      {l.raids.map((r) => (
                        <tr key={r.nom}><td style={{ fontWeight: 600 }}><span className="lien-icone">{ecranParNom(r.nom) ? <Vignette nom={r.nom} /> : null}{donjonEn(r.nom)}</span></td><td>{joueursEn(r.joueurs)}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            ) : null}

            {l.voisins.length ? (
              <section aria-labelledby="t-voisins">
                <h2 id="t-voisins" className="section-titre" style={{ fontSize: 24 }}>To continue the road</h2>
                <ul className="liste-lieux">
                  {l.voisins.map((v) => (
                    <li key={v.slug}><LienLieu slug={v.slug} nom={nomLieuEn(v.slug) ?? v.nom} langue="en" /> <span className="doux">levels {niveaux(v.niveau.min, v.niveau.max)}</span></li>
                  ))}
                </ul>
              </section>
            ) : null}
          </div>
          <aside className="colonne-laterale">
            <div className="encadre cadre">
              <h2>Explore</h2>
              <ul style={{ margin: 0, paddingLeft: 18, fontSize: 15, lineHeight: 1.8 }}>
                <li><Link href="/en/maps/">All maps</Link></li>
                <li><Link href="/en/leveling-guide/">Leveling guide 1-60</Link></li>
                {continent !== nom && slugContinent ? <li><Link href={pageLieuEn(slugContinent)}>Map: {continent}</Link></li> : null}
              </ul>
            </div>
            <p className="doux" style={{ fontSize: 13 }}>Map read from the WoW Forever game files thanks to <a href="https://wago.tools" rel="noopener noreferrer">wago.tools</a>.</p>
          </aside>
        </div>
      </div>
    </>
  );
}
