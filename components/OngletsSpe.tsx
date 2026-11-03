"use client";

import { Children, useEffect, useId, useState, type ReactNode } from "react";

/**
 * Onglets des spécialisations d'une classe. Les trois panneaux sont rendus par le serveur et présents dans la page
 * (moteurs de recherche compris) ; seul le panneau choisi est affiché. Une adresse en #spe-<slug> ouvre l'onglet voulu.
 */
export function OngletsSpe({ onglets, children, langue = "fr" }: { onglets: { slug: string; nom: string; icone: string }[]; children: ReactNode; langue?: "fr" | "en" }) {
  const panneaux = Children.toArray(children);
  const [actif, setActif] = useState(0);
  const base = useId();

  useEffect(() => {
    const lire = () => {
      const i = onglets.findIndex((o) => `#spe-${o.slug}` === window.location.hash);
      if (i >= 0) setActif(i);
    };
    lire();
    window.addEventListener("hashchange", lire);
    return () => window.removeEventListener("hashchange", lire);
  }, [onglets]);

  const choisir = (i: number) => {
    setActif(i);
    history.replaceState(null, "", `#spe-${onglets[i].slug}`);
  };

  return (
    <div className="spes">
      <div role="tablist" aria-label={langue === "en" ? "Specialisations" : "Spécialisations"} className="onglets-spe">
        {onglets.map((o, i) => (
          <button
            key={o.slug}
            type="button"
            role="tab"
            id={`${base}-o${i}`}
            aria-selected={i === actif}
            aria-controls={`${base}-p${i}`}
            tabIndex={i === actif ? 0 : -1}
            onClick={() => choisir(i)}
            onKeyDown={(e) => {
              if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
              const j = (i + (e.key === "ArrowRight" ? 1 : onglets.length - 1)) % onglets.length;
              choisir(j);
              document.getElementById(`${base}-o${j}`)?.focus();
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {o.icone ? <img src={o.icone} alt="" width={36} height={36} className="icone-jeu" /> : null}
            {o.nom}
          </button>
        ))}
      </div>
      {panneaux.map((p, i) => (
        <div
          key={onglets[i]?.slug ?? i}
          role="tabpanel"
          id={`${base}-p${i}`}
          aria-labelledby={`${base}-o${i}`}
          hidden={i !== actif}
          className="panneau-spe"
        >
          {p}
        </div>
      ))}
    </div>
  );
}
