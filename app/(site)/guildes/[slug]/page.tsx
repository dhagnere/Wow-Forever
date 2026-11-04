import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FACTIONS, lireGuilde } from "@/modules/veille";
import { languesDe } from "@/lib/anglais";
import { Ariane } from "@/components/Ariane";
import { CarteGuilde } from "@/components/Guildes";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const g = await lireGuilde((await params).slug);
  if (!g) return { title: "Guilde introuvable" };
  return {
    title: `${g.nom} (${FACTIONS[g.faction]}, ${g.serveur}) — guilde WoW Forever`,
    description: g.description.slice(0, 155),
    alternates: { canonical: `/guildes/${g.slug}/`, languages: languesDe(`/guildes/${g.slug}/`) },
  };
}

export default async function FicheGuilde({ params }: Props) {
  const g = await lireGuilde((await params).slug);
  if (!g) notFound();
  return (
    <div className="wrap contenu">
      <Ariane etapes={[{ nom: "Tableau des guildes", href: "/guildes/" }, { nom: g.nom }]} />
      <div style={{ maxWidth: 760 }}>
        <CarteGuilde g={g} complete />
        <p className="doux" style={{ fontSize: 14, marginTop: 20 }}>
          Fiche rédigée par la guilde et relue par Jobwow. <Link href="/guildes/">Voir toutes les guildes</Link> ·{" "}
          <Link href="/guildes/inscrire/">Inscrire la vôtre</Link>
        </p>
      </div>
    </div>
  );
}
