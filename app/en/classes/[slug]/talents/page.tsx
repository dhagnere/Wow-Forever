import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CLASSES, trouverClasse } from "@/content/classes";
import { Ariane } from "@/components/Ariane";
import { IconeClasse } from "@/components/IconeClasse";
import { CalculateurTalents, type ArbreVue } from "@/components/CalculateurTalents";
import { iconeSort, sortsDeClasse } from "@/lib/sorts";
import { ECRAN_CLASSE, fondBandeau } from "@/lib/ecrans";
import { POINTS_MAX } from "@/lib/calculateur";
import { CLASSES_EN, classeDepuisEn } from "@/lib/anglais";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return CLASSES.map((c) => ({ slug: CLASSES_EN[c.slug].slug }));
}

const lire = (slug: string) => trouverClasse(classeDepuisEn(slug) ?? "");

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = lire((await params).slug);
  if (!c) return {};
  const nom = CLASSES_EN[c.slug].nom;
  const en = `/en/classes/${CLASSES_EN[c.slug].slug}/talents/`;
  return {
    title: `${nom} talent calculator for WoW Forever`,
    description: `Plan your ${nom.toLowerCase()} build in WoW Forever: the three talent trees from the game files, ${POINTS_MAX} points at level 60, and a link to share.`,
    alternates: { canonical: en, languages: { fr: `/classes/${c.slug}/talents/`, en, "x-default": `/classes/${c.slug}/talents/` } },
  };
}

export default async function CalculateurEn({ params }: Props) {
  const c = lire((await params).slug);
  const sorts = c ? sortsDeClasse(c.slug, "en") : null;
  if (!c || !sorts) notFound();
  const nom = CLASSES_EN[c.slug].nom;
  const slugEn = CLASSES_EN[c.slug].slug;

  const arbres: ArbreVue[] = sorts.specialisations.map((s) => ({
    slug: s.slug,
    nom: s.nom,
    icone: s.icone ? iconeSort(s.icone) : "",
    talents: s.talents.map((t) => ({
      id: t.id, nom: t.nom, icone: t.icone ? iconeSort(t.icone) : "", palier: t.palier, colonne: t.colonne, rangs: t.rangs, niveau: t.niveau,
      description: t.premier, descriptions: t.descriptions ?? [t.premier], prerequisId: t.prerequisId, prerequis: t.prerequis, actif: t.actif,
    })),
  }));
  const noms = sorts.specialisations.map((s) => s.nom);

  return (
    <>
      <section className="bandeau-page" style={fondBandeau(ECRAN_CLASSE[c.slug] ?? "salle-des-thanes")}>
        <div className="wrap" style={{ display: "flex", flexWrap: "wrap", gap: 28, alignItems: "center" }}>
          <IconeClasse slug={c.slug} couleur={c.couleur} taille={96} />
          <div style={{ flex: "1 1 420px" }}>
            <Ariane langue="en" etapes={[{ nom: "Classes", href: "/en/classes/" }, { nom, href: `/en/classes/${slugEn}/` }, { nom: "Talent calculator" }]} />
            <h1>{nom} talent calculator</h1>
            <p className="chapo" style={{ margin: 0 }}>
              Spend your {POINTS_MAX} points across {noms.slice(0, -1).join(", ")} and {noms[noms.length - 1]}, then share your build link with your guild.
            </p>
          </div>
        </div>
      </section>

      <div className="wrap contenu">
        <CalculateurTalents langue="en" classe={nom} arbres={arbres} />
        <p className="doux note-donnees">
          Trees read from Forever&apos;s game files thanks to <a href="https://wago.tools" rel="noopener noreferrer">wago.tools</a>, version {sorts.version}.
          One point per level from level 10; each tier requires 5 more points in the tree. Forever only publishes the first rank of most talents so far;
          further ranks will show as soon as a game version includes them. A build link works in both languages. Names, texts and icons: © Blizzard Entertainment.
        </p>
        <p>
          <Link href={`/en/classes/${slugEn}/#sorts`}>Back to {nom.toLowerCase()} spells</Link>
          {" · "}Other classes:{" "}
          {CLASSES.filter((x) => x.slug !== c.slug).map((x, i) => (
            <span key={x.slug}>{i ? ", " : ""}<Link href={`/en/classes/${CLASSES_EN[x.slug].slug}/talents/`}>{CLASSES_EN[x.slug].nom}</Link></span>
          ))}
        </p>
      </div>
    </>
  );
}
