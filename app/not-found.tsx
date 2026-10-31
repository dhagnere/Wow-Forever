import Link from "next/link";
import { SiteCadre } from "@/components/Cadre";

export default function Introuvable() {
  return (
    <SiteCadre>
      <div className="wrap contenu centre">
        <h1 className="titre" style={{ fontSize: 40 }}>Page introuvable</h1>
        <p className="doux">Ce chemin ne mène nulle part, même avec une carte de Kalimdor.</p>
        <Link href="/" className="btn btn-or">Retour à l&apos;accueil</Link>
      </div>
    </SiteCadre>
  );
}
