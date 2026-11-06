import type { Metadata } from "next";
import Link from "next/link";
import { seDesinscrire } from "../actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Se désinscrire de la Lettre", robots: { index: false, follow: false }, referrer: "no-referrer" };

type Props = { searchParams: Promise<{ a?: string; s?: string; fait?: string; invalide?: string }> };

export default async function DesinscriptionLettre({ searchParams }: Props) {
  const p = await searchParams;
  const a = String(p.a ?? "").slice(0, 12);
  const s = String(p.s ?? "").slice(0, 100);
  return (
    <div className="wrap contenu article corps">
      <p className="surtitre">La Lettre de la Taverne</p>
      {p.fait ? (
        <>
          <h1>C&apos;est fait</h1>
          <p>Votre adresse est effacée : vous ne recevrez plus la Lettre. La porte de la Taverne reste ouverte, et vous pouvez <Link href="/lettre/">revenir quand vous voulez</Link>.</p>
        </>
      ) : p.invalide || !a || !s ? (
        <>
          <h1>Ce lien n&apos;est pas valable</h1>
          <p>Vous êtes peut-être déjà désinscrit. Sinon, utilisez le lien en bas de la dernière Lettre reçue, ou écrivez-nous depuis la page <Link href="/contact/">Contact</Link>.</p>
        </>
      ) : (
        <>
          <h1>Quitter la Lettre ?</h1>
          <p>Un clic, et votre adresse est effacée de la liste. Aucune autre Lettre ne partira.</p>
          <form action={seDesinscrire}>
            <input type="hidden" name="a" value={a} />
            <input type="hidden" name="s" value={s} />
            <button type="submit" className="btn btn-or">Me désinscrire</button>
          </form>
        </>
      )}
    </div>
  );
}
