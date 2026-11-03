import Link from "next/link";

export default function IntrouvableEn() {
  return (
    <div className="wrap contenu centre">
      <span hidden data-introuvable />
      <p className="surtitre">Error 404</p>
      <h1 className="titre" style={{ fontSize: 40 }}>You got lost on the way</h1>
      <p className="doux">This page does not exist, or no longer does. Jobwow will walk you back to the bar.</p>
      <div className="actions-bandeau" style={{ justifyContent: "center" }}>
        <Link href="/en/" className="btn btn-or" data-cta="retour-404-en">Home</Link>
        <Link href="/en/leveling-guide/" className="btn btn-contour" data-cta="guide-404-en">Leveling guide 1-60</Link>
      </div>
    </div>
  );
}
