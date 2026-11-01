import { useId } from "react";
import { ICONES_CLASSES, TAILLE_ICONES } from "@/content/icones-classes";

/**
 * Icône de classe façon jeu de rôle : cadre biseauté or et bronze, fond teinté de la couleur de la classe,
 * pictogramme éclairé. Dessins game-icons.net, licence CC BY 3.0 (crédit dans les mentions légales).
 */
export function IconeClasse({ slug, couleur, taille = 64, nom }: { slug: string; couleur: string; taille?: number | string; nom?: string }) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const icone = ICONES_CLASSES[slug];
  const echelle = 42 / TAILLE_ICONES;
  return (
    <svg
      viewBox="0 0 64 64"
      width={taille}
      height={taille}
      className="icone-classe"
      role={nom ? "img" : undefined}
      aria-label={nom}
      aria-hidden={nom ? undefined : true}
    >
      <defs>
        <linearGradient id={`${id}c`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f6dc9a" />
          <stop offset=".45" stopColor="#a87a28" />
          <stop offset="1" stopColor="#3b2a12" />
        </linearGradient>
        <radialGradient id={`${id}f`} cx=".35" cy=".3" r=".9">
          <stop offset="0" stopColor={couleur} stopOpacity=".75" />
          <stop offset=".55" stopColor="#2a2522" />
          <stop offset="1" stopColor="#0f0e0d" />
        </radialGradient>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fffaf0" />
          <stop offset="1" stopColor={couleur} />
        </linearGradient>
        <filter id={`${id}o`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1.2" stdDeviation="1.2" floodColor="#000" floodOpacity=".9" />
        </filter>
      </defs>
      <rect x="0" y="0" width="64" height="64" rx="7" fill={`url(#${id}c)`} />
      <rect x="3.5" y="3.5" width="57" height="57" rx="4.5" fill="#0f0e0d" />
      <rect x="5" y="5" width="54" height="54" rx="3.5" fill={`url(#${id}f)`} />
      {icone ? (
        <g transform={`translate(11 11) scale(${echelle})`} filter={`url(#${id}o)`} fill={`url(#${id}g)`}>
          {icone.chemins.map((d, i) => <path key={i} d={d} />)}
        </g>
      ) : null}
      <path d="M5 8.5 A3.5 3.5 0 0 1 8.5 5 H55.5 A3.5 3.5 0 0 1 59 8.5 V26 Q32 34 5 26 Z" fill="#fff" opacity=".07" />
      <rect x="5" y="5" width="54" height="54" rx="3.5" fill="none" stroke="#000" strokeOpacity=".6" strokeWidth="1" />
    </svg>
  );
}
