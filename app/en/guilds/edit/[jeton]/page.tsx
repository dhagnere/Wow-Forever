import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DUREE_VALIDITE_JOURS, guildeParJeton } from "@/modules/veille";
import { LIBELLES_GUILDE_EN } from "@/components/Guildes";
import { FormulaireGuilde } from "@/app/(site)/guildes/FormulaireGuilde";
import { confirmerActivite } from "@/app/(site)/guildes/actions";

export const dynamic = "force-dynamic";

// Le lien contient un secret : jamais indexé, jamais mesuré, jamais transmis aux sites ouverts depuis la page.
export const metadata: Metadata = { title: "Edit my guild listing", robots: { index: false, follow: false }, referrer: "no-referrer" };

type Props = { params: Promise<{ jeton: string }>; searchParams: Promise<{ confirme?: string }> };

const dateEn = (d: Date) => new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Paris" }).format(d);

export default async function EditGuild({ params, searchParams }: Props) {
  const { jeton } = await params;
  const g = await guildeParJeton(jeton);
  if (!g) notFound();
  const confirme = (await searchParams).confirme === "1";
  const etat = g.statut === "en_attente" ? "under review, not published yet" : g.aRelire ? "published, changes under review" : "published";
  return (
    <div className="wrap contenu">
      <div style={{ maxWidth: 820 }}>
        <p className="surtitre">Listing {etat}</p>
        <h1 className="titre" style={{ marginTop: 0 }}>{g.nom}</h1>
        <p className="doux">Last updated on {dateEn(g.majLe)}. {g.statut === "publiee" ? <Link href={`/en/guilds/${g.slug}/`}>See the public listing</Link> : null}</p>

        <div className="encadre" style={{ padding: 20, margin: "20px 0" }}>
          {confirme ? <p className="info" role="status" style={{ marginTop: 0 }}>Noted: the listing is back at the top of the board.</p> : null}
          <p style={{ marginTop: 0 }}>
            Nothing has changed? Confirm the guild is still active: the listing moves back to the top of the board. Without confirmation or edit
            for {DUREE_VALIDITE_JOURS} days, it is no longer shown.
          </p>
          <form action={confirmerActivite}>
            <input type="hidden" name="jeton" value={jeton} />
            <input type="hidden" name="langue" value="en" />
            <button type="submit" className="btn btn-or" data-cta="confirmer-guilde-en">Still active</button>
          </form>
        </div>

        <h2>Edit the listing</h2>
        <FormulaireGuilde fiche={g} jeton={jeton} libelles={LIBELLES_GUILDE_EN} langue="en" />
        <p className="doux" style={{ fontSize: 13, marginTop: 20 }}>Do not share the address of this page: it lets anyone edit the listing.</p>
      </div>
    </div>
  );
}
