import Link from "next/link";
import { SiteCadre } from "@/components/Cadre";
import { Mesure } from "@/components/Mesure";

export default function Introuvable() {
  return (
    <SiteCadre>
      <div className="wrap contenu centre">
        <p className="surtitre">Erreur 404</p>
        <h1 className="titre" style={{ fontSize: 40 }}>Vous vous êtes égaré dans les Rives claires</h1>
        <p className="doux">Cette page n&apos;existe pas, ou plus. Jobwow vous raccompagne au comptoir.</p>
        <div className="actions-bandeau" style={{ justifyContent: "center" }}>
          <Link href="/actualites/" className="btn btn-or" data-cta="retour-404">Retour au Comptoir</Link>
          <Link href="/recherche/" className="btn btn-contour" data-cta="recherche-404">Chercher un article</Link>
        </div>
      </div>
      <Mesure />
    </SiteCadre>
  );
}
