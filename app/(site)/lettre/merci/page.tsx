import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: "Bienvenue à la Taverne", robots: { index: false, follow: true } };

export default function Merci() {
  return (
    <div className="wrap contenu article corps">
      <p className="surtitre">Inscription confirmée</p>
      <h1>Bienvenue à la Taverne !</h1>
      <p>Votre première Lettre arrive dimanche, à 10 h. En attendant, la porte est ouverte.</p>
      <div className="actions-bandeau">
        <Link href="/guides/bien-demarrer/" className="btn btn-or" data-cta="debuter-merci">Bien débuter sur WoW Forever</Link>
        {SITE.discord ? <a href={SITE.discord} className="btn btn-contour" rel="noopener noreferrer" data-cta="discord-merci">Rejoindre le Discord</a> : null}
      </div>
    </div>
  );
}
