import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Vérifiez votre boîte de réception", robots: { index: false, follow: true } };

export default function Confirmer() {
  return (
    <div className="wrap contenu article corps">
      <p className="surtitre">Presque fini</p>
      <h1>Vérifiez votre boîte de réception</h1>
      <p>Jobwow vient de vous envoyer un message. Cliquez sur le lien qu&apos;il contient pour confirmer votre inscription : sans ce clic, aucune Lettre ne partira.</p>
      <p className="doux">Rien reçu dans les cinq minutes ? Regardez dans les courriers indésirables, ou <Link href="/lettre/">recommencez l&apos;inscription</Link>.</p>
    </div>
  );
}
