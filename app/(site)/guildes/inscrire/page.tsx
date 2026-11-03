import type { Metadata } from "next";
import Link from "next/link";
import { Ariane } from "@/components/Ariane";
import { LIBELLES_GUILDE } from "@/components/Guildes";
import { FormulaireGuilde } from "../FormulaireGuilde";
import { fondBandeau } from "@/lib/ecrans";

export const metadata: Metadata = {
  title: "Inscrire ma guilde au tableau",
  description: "Inscription gratuite des guildes francophones de WoW Forever au tableau de la Taverne Éternelle.",
  alternates: { canonical: "/guildes/inscrire/" },
};

export default function InscrireGuilde() {
  return (
    <>
      <section className="bandeau-page bandeau-mince" style={fondBandeau("vallee-d-alterac")}>
        <div className="wrap">
          <Ariane etapes={[{ nom: "Tableau des guildes", href: "/guildes/" }, { nom: "Inscrire ma guilde" }]} />
          <p className="surtitre">Gratuit · relu sous 48 heures</p>
          <h1>Inscrire ma guilde</h1>
        </div>
      </section>
    <div className="wrap contenu">
      <div style={{ maxWidth: 820 }}>
        <p>
          Une fiche par guilde. Une fois publiée, partagez son adresse à vos futures recrues. Pensez à la mettre à jour : les fiches récentes
          passent en tête du <Link href="/guildes/">tableau</Link>.
        </p>
        <FormulaireGuilde libelles={LIBELLES_GUILDE} />
        <p className="doux" style={{ fontSize: 13, marginTop: 20 }}>
          Aucune adresse électronique n&apos;est demandée. Les informations saisies sont publiques une fois la fiche validée. Pour supprimer une
          fiche, <Link href="/contact/">écrivez-nous</Link>.
        </p>
      </div>
    </div>
    </>
  );
}
