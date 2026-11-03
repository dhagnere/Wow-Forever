import type { Metadata } from "next";
import Link from "next/link";
import { Ariane } from "@/components/Ariane";
import { FormulaireReinitialisation } from "../Formulaires";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Nouveau mot de passe", robots: { index: false, follow: false }, referrer: "no-referrer" };

type Props = { searchParams: Promise<{ jeton?: string }> };

export default async function Reinitialiser({ searchParams }: Props) {
  const jeton = String((await searchParams).jeton ?? "").slice(0, 100);
  return (
    <div className="wrap contenu" style={{ maxWidth: 620 }}>
      <Ariane etapes={[{ nom: "Mon compte", href: "/compte/" }, { nom: "Nouveau mot de passe" }]} />
      <h1>Choisir un nouveau mot de passe</h1>
      {jeton ? (
        <div className="encadre cadre" style={{ padding: 24 }}><FormulaireReinitialisation jeton={jeton} /></div>
      ) : (
        <p>Ce lien est incomplet. <Link href="/compte/oubli/">Demander un nouveau lien</Link>.</p>
      )}
    </div>
  );
}
