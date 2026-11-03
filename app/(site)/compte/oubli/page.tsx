import type { Metadata } from "next";
import Link from "next/link";
import { Ariane } from "@/components/Ariane";
import { FormulaireOubli } from "../Formulaires";

export const metadata: Metadata = { title: "Mot de passe oublié", robots: { index: false, follow: false } };

export default function Oubli() {
  return (
    <div className="wrap contenu" style={{ maxWidth: 620 }}>
      <Ariane etapes={[{ nom: "Mon compte", href: "/compte/" }, { nom: "Mot de passe oublié" }]} />
      <h1>Mot de passe oublié</h1>
      <p>Indiquez l&apos;adresse de votre compte : vous recevrez un lien pour choisir un nouveau mot de passe.</p>
      <div className="encadre cadre" style={{ padding: 24 }}><FormulaireOubli /></div>
      <p><Link href="/compte/?mode=connexion">Revenir à la connexion</Link></p>
    </div>
  );
}
