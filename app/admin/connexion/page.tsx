import { redirect } from "next/navigation";
import { adminConnecte } from "@/lib/admin";
import { FormulaireConnexion } from "./Formulaire";

export const dynamic = "force-dynamic";

export default async function Connexion({ searchParams }: { searchParams: Promise<{ sortie?: string; mdp?: string }> }) {
  if (await adminConnecte().catch(() => null)) redirect("/admin/");
  const { sortie, mdp } = await searchParams;
  return (
    <>
      <h1 className="titre">Connexion</h1>
      <p className="doux">Espace d&apos;administration réservé.</p>
      {sortie ? <p className="info" role="status">Vous êtes déconnecté.</p> : null}
      {mdp ? <p className="info" role="status">Mot de passe changé. Reconnectez-vous avec le nouveau.</p> : null}
      <FormulaireConnexion />
    </>
  );
}
