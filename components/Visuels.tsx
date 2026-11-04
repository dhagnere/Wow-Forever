import type { CSSProperties } from "react";
import type { SlugEcran } from "@/config/ecrans";
import { ecranParNom, nomEcran, urlEcran } from "@/lib/ecrans";
import { nomDonjonEn, nomZoneEn } from "@/lib/anglais";

/** Nom de l'écran en anglais : celui du donjon ou de la zone dans le jeu, sinon le nom français. */
const nomEcranEn = (slug: SlugEcran) => {
  const n = nomEcran(slug);
  return nomDonjonEn(n) ?? nomZoneEn(n);
};

/**
 * Visuel d'une carte ou d'une vignette : écran de chargement du jeu quand on en donne un,
 * sinon un dégradé teinté (CSS).
 */
export function Visuel({ hauteur, texte, teinte, ecran, langue = "fr" }: { hauteur: number | string; texte?: string; teinte?: string; ecran?: SlugEcran; langue?: "fr" | "en" }) {
  const style: CSSProperties = { height: hauteur };
  if (teinte && !ecran) {
    style.background = `radial-gradient(ellipse at 30% 25%, ${teinte}55, transparent 55%), linear-gradient(160deg, #3a2e24, #2b1d14 70%)`;
  }
  return (
    <span className={ecran ? "visuel visuel-ecran" : "visuel"} style={style} aria-hidden={texte ? undefined : true}>
      {ecran ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={urlEcran(ecran, 800)} srcSet={`${urlEcran(ecran, 800)} 800w, ${urlEcran(ecran, 1600)} 1600w`} sizes="(max-width: 760px) 100vw, 50vw" alt="" loading="lazy" title={langue === "en" ? `Loading screen: ${nomEcranEn(ecran)} · © Blizzard Entertainment` : `Écran de chargement : ${nomEcran(ecran)} · © Blizzard Entertainment`} />
      ) : null}
      {texte ? <span className="visuel-texte">{texte}</span> : null}
    </span>
  );
}

/** Illustration en tête de fiche, avec sa légende. */
export function IllustrationEcran({ ecran, legende, langue = "fr" }: { ecran: SlugEcran; legende?: string; langue?: "fr" | "en" }) {
  const en = langue === "en";
  return (
    <figure className="illustration-ecran">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={urlEcran(ecran, 1600)}
        srcSet={`${urlEcran(ecran, 800)} 800w, ${urlEcran(ecran, 1600)} 1600w`}
        sizes="(max-width: 900px) 100vw, 760px"
        alt={en ? `Game loading screen: ${nomEcranEn(ecran)}` : `Écran de chargement du jeu : ${nomEcran(ecran)}`}
        loading="lazy"
      />
      <figcaption>{legende ?? (en ? `Loading screen: ${nomEcranEn(ecran)}` : `Écran de chargement : ${nomEcran(ecran)}`)} · © Blizzard Entertainment</figcaption>
    </figure>
  );
}

/** Petite vignette d'un donjon ou d'un raid, retrouvé par son slug ou par son nom. */
export function Vignette({ ecran, nom }: { ecran?: SlugEcran; nom?: string }) {
  const slug = ecran ?? (nom ? ecranParNom(nom) : undefined);
  if (!slug) return null;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={urlEcran(slug, 800)} alt="" width={96} height={44} loading="lazy" className="vignette-ecran" />;
}
