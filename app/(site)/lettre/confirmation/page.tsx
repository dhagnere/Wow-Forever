import type { Metadata } from "next";
import Link from "next/link";
import { confirmerLettre } from "../actions";

export const dynamic = "force-dynamic";
// Le lien contient un jeton secret : ni indexé, ni transmis à un autre site.
export const metadata: Metadata = { title: "Confirmer votre inscription", robots: { index: false, follow: false }, referrer: "no-referrer" };

type Props = { searchParams: Promise<{ jeton?: string; invalide?: string }> };

export default async function ConfirmationLettre({ searchParams }: Props) {
  const p = await searchParams;
  const jeton = String(p.jeton ?? "").slice(0, 100);
  return (
    <div className="wrap contenu article corps">
      <p className="surtitre">La Lettre de la Taverne</p>
      {p.invalide || !jeton ? (
        <>
          <h1>Ce lien n&apos;est plus valable</h1>
          <p>Il a expiré (48 heures) ou a déjà servi. Si votre inscription n&apos;est pas confirmée, <Link href="/lettre/">recommencez-la</Link> : un nouveau lien partira.</p>
        </>
      ) : (
        <>
          <h1>Une dernière étape</h1>
          <p>Cliquez pour confirmer votre inscription à la Lettre. Vous la recevrez chaque dimanche, et pourrez la quitter à tout moment.</p>
          <form action={confirmerLettre}>
            <input type="hidden" name="jeton" value={jeton} />
            <button type="submit" className="btn btn-or">Confirmer mon inscription</button>
          </form>
        </>
      )}
    </div>
  );
}
