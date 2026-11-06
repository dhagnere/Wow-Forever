import type { Metadata } from "next";
import Link from "next/link";
import { seDesinscrire } from "@/app/(site)/lettre/actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Unsubscribe from the newsletter", robots: { index: false, follow: false }, referrer: "no-referrer" };

type Props = { searchParams: Promise<{ a?: string; s?: string; fait?: string; invalide?: string }> };

export default async function UnsubscribeNewsletter({ searchParams }: Props) {
  const p = await searchParams;
  const a = String(p.a ?? "").slice(0, 12);
  const s = String(p.s ?? "").slice(0, 100);
  return (
    <div className="wrap contenu article corps">
      <p className="surtitre">The Tavern&apos;s newsletter</p>
      {p.fait ? (
        <>
          <h1>Done</h1>
          <p>Your address has been deleted: you will not receive the newsletter any more. The Tavern&apos;s door stays open, and you can <Link href="/en/newsletter/">come back whenever you like</Link>.</p>
        </>
      ) : p.invalide || !a || !s ? (
        <>
          <h1>This link is not valid</h1>
          <p>You may already be unsubscribed. Otherwise, use the link at the bottom of the last newsletter you received, or write to us from the <Link href="/en/contact/">Contact</Link> page.</p>
        </>
      ) : (
        <>
          <h1>Leave the newsletter?</h1>
          <p>One click, and your address is deleted from the list. No other newsletter will be sent.</p>
          <form action={seDesinscrire}>
            <input type="hidden" name="a" value={a} />
            <input type="hidden" name="s" value={s} />
            <input type="hidden" name="langue" value="en" />
            <button type="submit" className="btn btn-or">Unsubscribe</button>
          </form>
        </>
      )}
    </div>
  );
}
