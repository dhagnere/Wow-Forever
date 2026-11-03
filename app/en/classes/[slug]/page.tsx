import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CLASSES, trouverClasse } from "@/content/classes";
import { Ariane } from "@/components/Ariane";
import { IconeClasse } from "@/components/IconeClasse";
import { IconeRace } from "@/components/IconeRace";
import { SortsClasse } from "@/components/SortsClasse";
import { FamiliersClasse } from "@/components/FamiliersClasse";
import { ECRAN_CLASSE, fondBandeau } from "@/lib/ecrans";
import { familiersDeClasse, sortsDeClasse } from "@/lib/sorts";
import { combinaisons } from "@/lib/guide";
import { ARMURES_EN, CLASSES_EN, classeDepuisEn, lienGuideEn, nomRaceEn, ROLES_EN } from "@/lib/anglais";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return CLASSES.map((c) => ({ slug: CLASSES_EN[c.slug].slug }));
}

const lire = (slug: string) => trouverClasse(classeDepuisEn(slug) ?? "");

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = lire((await params).slug);
  if (!c) return {};
  const nom = CLASSES_EN[c.slug].nom;
  const en = `/en/classes/${CLASSES_EN[c.slug].slug}/`;
  return {
    title: `${nom} in WoW Forever: spells, talents and leveling`,
    description: `${nom} in WoW Forever: roles (${c.roles.map((r) => ROLES_EN[r] ?? r).join(", ").toLowerCase()}), playable races, spells and talents of each specialisation, and a leveling guide for every race.`,
    alternates: { canonical: en, languages: { fr: `/classes/${c.slug}/`, en, "x-default": `/classes/${c.slug}/` } },
  };
}

export default async function ClasseEn({ params }: Props) {
  const c = lire((await params).slug);
  if (!c) notFound();
  const nom = CLASSES_EN[c.slug].nom;
  const slugEn = CLASSES_EN[c.slug].slug;
  const sorts = sortsDeClasse(c.slug, "en");
  const familiers = familiersDeClasse(c.slug, "en");
  const guides = combinaisons().filter((x) => x.classe.slug === c.slug);

  return (
    <>
      <section className="bandeau-page" style={fondBandeau(ECRAN_CLASSE[c.slug] ?? "salle-des-thanes")}>
        <div className="wrap" style={{ display: "flex", flexWrap: "wrap", gap: 36, alignItems: "center" }}>
          <IconeClasse slug={c.slug} couleur={c.couleur} taille={150} />
          <div style={{ flex: "1 1 480px" }}>
            <Ariane langue="en" etapes={[{ nom: "Classes", href: "/en/classes/" }, { nom }]} />
            <h1>The {nom}</h1>
            <ul className="puces">
              {c.roles.map((r) => <li key={r} className="puce">{ROLES_EN[r] ?? r}</li>)}
              <li className="puce puce-douce">Armour: {ARMURES_EN[c.armure] ?? c.armure}</li>
            </ul>
            <div className="actions-bandeau">
              {sorts ? <a href="#sorts" className="btn btn-or" data-cta="sorts-classe-en">Spells and talents</a> : null}
              {sorts ? <Link href={`/en/classes/${slugEn}/talents/`} className="btn btn-contour" data-cta="calculateur-classe-en">Talent calculator</Link> : null}
              <a href="#guides" className="btn btn-contour" data-cta="guide-classe-en">Leveling guide</a>
            </div>
          </div>
        </div>
      </section>

      <div className="wrap contenu">
        <div className="colonnes">
          <div className="colonne-principale">
            <section aria-labelledby="t-guides" id="guides">
              <h2 id="t-guides" className="section-titre" style={{ fontSize: 26 }}>Playable races and leveling guides</h2>
              <p className="doux" style={{ marginTop: 0 }}>Each race starts in its own zone: pick yours for the {nom.toLowerCase()} guide from 1 to 60.</p>
              <ul className="guide-zone-classes" style={{ listStyle: "none", padding: 0, display: "flex", flexWrap: "wrap", gap: 10 }}>
                {guides.map(({ race }) => (
                  <li key={race.slug}>
                    <Link href={lienGuideEn(race.slug, c.slug)} className="lien-icone choix-pastille" data-cta="guide-classe-race-en">
                      <IconeRace race={race.nom} taille={28} />
                      {nomRaceEn(race.slug)}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            {sorts ? (
              <SortsClasse langue="en" slugClasse={c.slug} nomClasse={nom} version={sorts.version} specialisations={sorts.specialisations} lienCalculateur={`/en/classes/${slugEn}/talents/`} />
            ) : null}

            {familiers ? <FamiliersClasse langue="en" classe={nom} familiers={familiers} /> : null}
          </div>

          <aside className="colonne-laterale">
            <div className="encadre cadre">
              <h2>Other classes</h2>
              <ul style={{ margin: 0, padding: 0, listStyle: "none", fontSize: 15, display: "flex", flexDirection: "column", gap: 6 }}>
                {CLASSES.filter((x) => x.slug !== c.slug).map((x) => (
                  <li key={x.slug}>
                    <Link href={`/en/classes/${CLASSES_EN[x.slug].slug}/`} className="lien-icone">
                      <IconeClasse slug={x.slug} couleur={x.couleur} taille={28} />
                      {CLASSES_EN[x.slug].nom}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
