"use client";

import { useState } from "react";

/** Une source à situer : nom, détail, et ses points sur la carte d'une zone (en % de la carte). */
export interface PointCarte { cle: string; nom: string; detail: string; zone: { slug: string; nom: string; lien: string }; points: [number, number][] }

/** Carte de la zone, avec les points de la source choisie ; un clic sur « Voir sur la carte » change de source. */
export function CarteSources({ sources }: { sources: PointCarte[] }) {
  const [choix, setChoix] = useState(sources[0]?.cle);
  const active = sources.find((s) => s.cle === choix) ?? sources[0];
  if (!active) return null;
  return (
    <div className="carte-sources">
      <div className="carte-sources-carte">
        <p className="surtitre" style={{ margin: "0 0 8px" }}>{active.nom} · <a href={active.zone.lien}>{active.zone.nom}</a></p>
        <div className="carte-points">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`/images/jeu/cartes/${active.zone.slug}-1000.jpg`} alt={`Carte : ${active.zone.nom}, avec l'emplacement de ${active.nom}`} width={1000} height={667} />
          {active.points.map(([x, y], i) => (
            <span key={i} className="point-carte" style={{ left: `${x}%`, top: `${y}%` }} title={`${active.nom} : ${x.toLocaleString("fr-FR")}, ${y.toLocaleString("fr-FR")}`} />
          ))}
        </div>
        <p className="doux" style={{ fontSize: 13, margin: "6px 0 0" }}>
          {active.points.length > 1 ? `${active.points.length} emplacements` : "1 emplacement"}{" "}
          (coordonnées {active.points.slice(0, 3).map(([x, y]) => `${Math.round(x)}, ${Math.round(y)}`).join(" · ")}{active.points.length > 3 ? "…" : ""}) · © Blizzard Entertainment
        </p>
      </div>
      {sources.length > 1 ? (
        <ul className="carte-sources-liste" aria-label="Choisir l'emplacement à afficher">
          {sources.map((s) => (
            <li key={s.cle}>
              <button type="button" onClick={() => setChoix(s.cle)} aria-pressed={s.cle === active.cle}>
                <strong>{s.nom}</strong> <span>{s.detail} · {s.zone.nom}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
