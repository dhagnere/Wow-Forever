import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DUREE_VALIDITE_JOURS, guildeParJeton } from "@/modules/veille";
import { LIBELLES_GUILDE } from "@/components/Guildes";
import { dateLongue } from "@/lib/site";
import { FormulaireGuilde } from "../../FormulaireGuilde";
import { confirmerActivite } from "../../actions";

export const dynamic = "force-dynamic";

// Le lien contient un secret : jamais indexé, jamais transmis aux sites ouverts depuis la page.
export const metadata: Metadata = { title: "Modifier la fiche de ma guilde", robots: { index: false, follow: false }, referrer: "no-referrer" };

type Props = { params: Promise<{ jeton: string }>; searchParams: Promise<{ confirme?: string }> };

export default async function ModifierGuilde({ params, searchParams }: Props) {
  const { jeton } = await params;
  const g = await guildeParJeton(jeton);
  if (!g) notFound();
  const confirme = (await searchParams).confirme === "1";
  const etat = g.statut === "en_attente" ? "en relecture, pas encore publiée" : g.aRelire ? "publiée, modifications en relecture" : "publiée";
  return (
    <div className="wrap contenu">
      <div style={{ maxWidth: 820 }}>
        <p className="surtitre">Fiche {etat}</p>
        <h1 className="titre" style={{ marginTop: 0 }}>{g.nom}</h1>
        <p className="doux">Dernière mise à jour le {dateLongue(g.majLe)}. {g.statut === "publiee" ? <Link href={`/guildes/${g.slug}/`}>Voir la fiche publique</Link> : null}</p>

        <div className="encadre" style={{ padding: 20, margin: "20px 0" }}>
          {confirme ? <p className="info" role="status" style={{ marginTop: 0 }}>C&apos;est noté : la fiche repasse en tête du tableau.</p> : null}
          <p style={{ marginTop: 0 }}>
            Rien n&apos;a changé ? Confirmez que la guilde est toujours active : la fiche remonte en tête du tableau. Sans confirmation ni
            modification pendant {DUREE_VALIDITE_JOURS} jours, elle n&apos;est plus affichée.
          </p>
          <form action={confirmerActivite}>
            <input type="hidden" name="jeton" value={jeton} />
            <button type="submit" className="btn btn-or" data-cta="confirmer-guilde">Toujours actifs</button>
          </form>
        </div>

        <h2>Modifier la fiche</h2>
        <FormulaireGuilde fiche={g} jeton={jeton} libelles={LIBELLES_GUILDE} />
        <p className="doux" style={{ fontSize: 13, marginTop: 20 }}>Ne partagez pas l&apos;adresse de cette page : elle permet de modifier la fiche.</p>
      </div>
    </div>
  );
}
