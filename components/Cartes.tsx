import Link from "next/link";
import { carte, pageLieu, urlCarte } from "@/lib/cartes";
import { nomLieuEn, pageLieuEn } from "@/lib/anglais";

type Langue = "fr" | "en";
const nomDe = (slug: string, l: Langue) => (l === "en" ? nomLieuEn(slug) : undefined) ?? carte(slug)?.nom ?? slug;
const pageDe = (slug: string, l: Langue) => (l === "en" ? pageLieuEn(slug) : pageLieu(slug));

/** Carte du jeu, cliquable pour l'ouvrir en grand. */
export function FigureCarte({ slug, legende, priorite = false, langue = "fr" }: { slug: string; legende?: string; priorite?: boolean; langue?: Langue }) {
  const c = carte(slug);
  if (!c) return null;
  const nom = nomDe(slug, langue);
  const mot = langue === "en" ? "Map: " : "Carte : ";
  return (
    <figure className="figure-carte">
      <a href={urlCarte(slug, 1000)} target="_blank" rel="noopener" aria-label={langue === "en" ? `Open the full-size map: ${nom}` : `Ouvrir en grand la carte : ${nom}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={urlCarte(slug, 1000)}
          srcSet={`${urlCarte(slug, 500)} 500w, ${urlCarte(slug, 1000)} 1000w`}
          sizes="(max-width: 900px) 100vw, 760px"
          width={1000}
          height={667}
          alt={`${mot}${nom}`}
          loading={priorite ? "eager" : "lazy"}
        />
      </a>
      <figcaption>{legende ?? `${mot}${nom}`} · © Blizzard Entertainment</figcaption>
    </figure>
  );
}

/** Vignette de carte avec le nom du lieu et, si on le connaît, son niveau : lien vers la page du lieu. */
export function CarteLieu({ slug, detail, langue = "fr" }: { slug: string; detail?: string; langue?: Langue }) {
  const c = carte(slug);
  if (!c) return null;
  return (
    <Link href={pageDe(slug, langue)} className="carte-lieu">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={urlCarte(slug, 500)} alt="" width={500} height={333} loading="lazy" />
      <span className="carte-lieu-texte">
        <strong>{nomDe(slug, langue)}</strong>
        {detail ? <small>{detail}</small> : null}
      </span>
    </Link>
  );
}

/** Lien texte vers la page d'un lieu, avec une petite vignette de sa carte. */
export function LienLieu({ slug, nom, langue = "fr" }: { slug: string; nom: string; langue?: Langue }) {
  return (
    <Link href={pageDe(slug, langue)} className="lien-icone lien-lieu">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={urlCarte(slug, 500)} alt="" width={60} height={40} loading="lazy" className="vignette-carte" />
      {nom}
    </Link>
  );
}
