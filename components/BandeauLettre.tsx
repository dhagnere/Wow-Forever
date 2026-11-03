"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const CLE = "taverne-bandeau-lettre-ferme";

/** Bandeau bas, sur mobile, après la moitié de la lecture. Refermable ; une fois fermé, il ne revient plus pendant la visite. */
export function BandeauLettre() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    let ferme = false;
    try {
      ferme = sessionStorage.getItem(CLE) === "1";
    } catch {}
    if (ferme || !window.matchMedia("(max-width: 760px)").matches) return;
    const surveiller = () => {
      const h = document.documentElement;
      if (h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight) > 0.5) {
        setVisible(true);
        window.removeEventListener("scroll", surveiller);
      }
    };
    window.addEventListener("scroll", surveiller, { passive: true });
    return () => window.removeEventListener("scroll", surveiller);
  }, []);
  if (!visible) return null;
  return (
    <div className="bandeau-lettre" role="region" aria-label="La Lettre de la Taverne">
      <p>La Taverne chaque dimanche dans votre boîte.</p>
      <Link href="/lettre/" className="btn btn-or btn-petit" data-cta="lettre-bandeau">Recevoir la Lettre</Link>
      <button
        type="button"
        className="bandeau-lettre-fermer"
        aria-label="Fermer"
        onClick={() => {
          setVisible(false);
          try {
            sessionStorage.setItem(CLE, "1");
          } catch {}
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
      </button>
    </div>
  );
}
