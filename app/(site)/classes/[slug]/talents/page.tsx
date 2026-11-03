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

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return CLASSES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = trouverClasse((await params).slug);
  if (!c) return {};
  return {
    title: `Calculateur de talents du ${c.nom} sur WoW Forever`,
    description: `Préparez votre build de ${c.nom.toLowerCase()} sur WoW Forever : les trois arbres de talents du jeu, ${POINTS_MAX} points au niveau 60, et un lien à partager.`,
    alternates: { canonical: `/classes/${c.slug}/talents/` },
  };
}

export default async function PageCalculateur({ params }: Props) {
  const c = trouverClasse((await params).slug);
  const sorts = c ? sortsDeClasse(c.slug) : null;
  if (!c || !sorts) notFound();

  const arbres: ArbreVue[] = sorts.specialisations.map((s) => ({
    slug: s.slug,
    nom: s.nom,
    icone: s.icone ? iconeSort(s.icone) : "",
    talents: s.talents.map((t) => ({
      id: t.id, nom: t.nom, icone: t.icone ? iconeSort(t.icone) : "", palier: t.palier, colonne: t.colonne, rangs: t.rangs, niveau: t.niveau,
      description: t.premier, descriptions: t.descriptions ?? [t.premier], prerequisId: t.prerequisId, prerequis: t.prerequis, actif: t.actif,
    })),
  }));

  return (
    <>
      <section className="bandeau-page" style={fondBandeau(ECRAN_CLASSE[c.slug] ?? "salle-des-thanes")}>
        <div className="wrap" style={{ display: "flex", flexWrap: "wrap", gap: 28, alignItems: "center" }}>
          <IconeClasse slug={c.slug} couleur={c.couleur} taille={96} />
          <div style={{ flex: "1 1 420px" }}>
            <Ariane etapes={[{ nom: "L'Armurerie", href: "/classes/" }, { nom: c.nom, href: `/classes/${c.slug}/` }, { nom: "Calculateur de talents" }]} />
            <h1>Calculateur de talents du {c.nom}</h1>
            <p className="chapo" style={{ margin: 0 }}>
              Répartissez vos {POINTS_MAX} points entre {sorts.specialisations.map((s) => s.nom).join(", ").replace(/, ([^,]*)$/, " et $1")},
              puis partagez le lien de votre build avec votre guilde.
            </p>
          </div>
        </div>
      </section>

      <div className="wrap contenu">
        <CalculateurTalents classe={c.nom} arbres={arbres} />
        <p className="doux note-donnees">
          Arbres lus dans les fichiers du jeu de Forever grâce à <a href="https://wago.tools" rel="noopener noreferrer">wago.tools</a>,
          version {sorts.version}. Un point par niveau à partir du niveau 10 ; chaque palier demande 5 points de plus dans l&apos;arbre.
          Forever ne publie encore que le premier rang de chaque talent ; les rangs suivants s&apos;afficheront dès qu&apos;une version du jeu les contiendra. Noms, textes et icônes : © Blizzard Entertainment.
        </p>
        <p>
          <Link href={`/classes/${c.slug}/#sorts`}>Revenir aux sorts du {c.nom.toLowerCase()}</Link>
          {" · "}
          Autres classes :{" "}
          {CLASSES.filter((x) => x.slug !== c.slug).map((x, i) => (
            <span key={x.slug}>{i ? ", " : ""}<Link href={`/classes/${x.slug}/talents/`}>{x.nom}</Link></span>
          ))}
        </p>
      </div>
    </>
  );
}
