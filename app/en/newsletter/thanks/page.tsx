import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: "Welcome to the Tavern", robots: { index: false, follow: true } };

export default function Thanks() {
  return (
    <div className="wrap contenu article corps">
      <p className="surtitre">Sign-up confirmed</p>
      <h1>Welcome to the Tavern!</h1>
      <p>Your first newsletter arrives on Sunday at 10 am, Paris time. Meanwhile, the door is open.</p>
      <div className="actions-bandeau">
        <Link href="/en/guides/getting-started/" className="btn btn-or" data-cta="debuter-merci-en">Getting started in WoW Forever</Link>
        {SITE.discord ? <a href={SITE.discord} className="btn btn-contour" rel="noopener noreferrer" data-cta="discord-merci-en">Join the Discord</a> : null}
      </div>
    </div>
  );
}
