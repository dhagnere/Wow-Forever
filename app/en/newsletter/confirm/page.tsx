import type { Metadata } from "next";
import Link from "next/link";
import { confirmerLettre } from "@/app/(site)/lettre/actions";

export const dynamic = "force-dynamic";
// The link holds a secret token: not indexed, not passed on to another site.
export const metadata: Metadata = { title: "Confirm your sign-up", robots: { index: false, follow: false }, referrer: "no-referrer" };

type Props = { searchParams: Promise<{ jeton?: string; invalide?: string }> };

export default async function ConfirmNewsletter({ searchParams }: Props) {
  const p = await searchParams;
  const jeton = String(p.jeton ?? "").slice(0, 100);
  return (
    <div className="wrap contenu article corps">
      <p className="surtitre">The Tavern&apos;s newsletter</p>
      {p.invalide || !jeton ? (
        <>
          <h1>This link is no longer valid</h1>
          <p>It has expired (48 hours) or has already been used. If your sign-up is not confirmed yet, <Link href="/en/newsletter/">sign up again</Link>: a new link will be sent.</p>
        </>
      ) : (
        <>
          <h1>One last step</h1>
          <p>Click to confirm your sign-up to the newsletter. It arrives every Sunday, and you can leave it at any time.</p>
          <form action={confirmerLettre}>
            <input type="hidden" name="jeton" value={jeton} />
            <input type="hidden" name="langue" value="en" />
            <button type="submit" className="btn btn-or">Confirm my sign-up</button>
          </form>
        </>
      )}
    </div>
  );
}
