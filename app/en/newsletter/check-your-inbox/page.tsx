import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Check your inbox", robots: { index: false, follow: true } };

export default function CheckInbox() {
  return (
    <div className="wrap contenu article corps">
      <p className="surtitre">Almost done</p>
      <h1>Check your inbox</h1>
      <p>Jobwow has just sent you an email. Click the link inside to confirm your sign-up: without that click, no newsletter will be sent.</p>
      <p className="doux">Nothing within five minutes? Look in your spam folder, or <Link href="/en/newsletter/">sign up again</Link>.</p>
    </div>
  );
}
