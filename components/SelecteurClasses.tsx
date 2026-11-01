"use client";

import Link from "next/link";
import { useState } from "react";
import { IconeClasse } from "./IconeClasse";

export interface ClasseResume { slug: string; nom: string; couleur: string; roles: string[]; armure: string; presentation: string }

/** Onglets d'icônes : choisir une classe affiche son portrait en quelques lignes et le lien vers sa fiche. */
export function SelecteurClasses({ classes }: { classes: ClasseResume[] }) {
  const [choix, setChoix] = useState(0);
  const c = classes[choix];
  return (
    <div>
      <div className="onglets-classes" role="tablist" aria-label="Choisir une classe">
        {classes.map((x, i) => (
          <button
            key={x.slug}
            type="button"
            role="tab"
            id={`onglet-${x.slug}`}
            aria-selected={i === choix}
            aria-controls="panneau-classe"
            tabIndex={i === choix ? 0 : -1}
            onClick={() => setChoix(i)}
            onKeyDown={(e) => {
              const pas = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
              if (!pas) return;
              e.preventDefault();
              const n = (choix + pas + classes.length) % classes.length;
              setChoix(n);
              document.getElementById(`onglet-${classes[n].slug}`)?.focus();
            }}
          >
            <IconeClasse slug={x.slug} couleur={x.couleur} taille={44} />
            {x.nom}
          </button>
        ))}
      </div>
      <div className="panneau-classe" role="tabpanel" id="panneau-classe" aria-labelledby={`onglet-${c.slug}`}>
        <IconeClasse slug={c.slug} couleur={c.couleur} taille={84} />
        <div style={{ flex: "1 1 380px" }}>
          <p className="surtitre" style={{ color: c.couleur === "#ffffff" ? "var(--or-clair)" : c.couleur }}>{c.roles.join(" · ")} · {c.armure}</p>
          <h2>{c.nom}</h2>
          <p style={{ margin: 0, color: "var(--texte-chaud)" }}>{c.presentation}</p>
        </div>
        <Link href={`/classes/${c.slug}/`} className="btn btn-contour">Ouvrir la fiche →</Link>
      </div>
    </div>
  );
}
