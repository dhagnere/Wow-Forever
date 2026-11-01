import type { CSSProperties } from "react";

/**
 * Visuels générés en CSS, en attendant les illustrations et captures définitives.
 * Pour utiliser une image, remplacer <Visuel> par <img src="/images/…" alt="…">.
 */
export function Visuel({ hauteur, texte, teinte }: { hauteur: number | string; texte?: string; teinte?: string }) {
  const style: CSSProperties = { height: hauteur };
  if (teinte) {
    style.background = `radial-gradient(ellipse at 30% 25%, ${teinte}55, transparent 55%), linear-gradient(160deg, #3a2e24, #1c1b1a 70%)`;
  }
  return (
    <span className="visuel" style={style} aria-hidden={texte ? undefined : true}>
      {texte ? <span className="visuel-texte">{texte}</span> : null}
    </span>
  );
}
