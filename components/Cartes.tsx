import Link from "next/link";
import { carte, pageLieu, urlCarte } from "@/lib/cartes";

/** Carte du jeu, cliquable pour l'ouvrir en grand. */
export function FigureCarte({ slug, legende, priorite = false }: { slug: string; legende?: string; priorite?: boolean }) {
  const c = carte(slug);
  if (!c) return null;
  return (
    <figure className="figure-carte">
      <a href={urlCarte(slug, 1000)} target="_blank" rel="noopener" aria-label={`Ouvrir en grand la carte : ${c.nom}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={urlCarte(slug, 1000)}
          srcSet={`${urlCarte(slug, 500)} 500w, ${urlCarte(slug, 1000)} 1000w`}
          sizes="(max-width: 900px) 100vw, 760px"
          width={1000}
          height={667}
          alt={`Carte : ${c.nom}`}
          loading={priorite ? "eager" : "lazy"}
        />
      </a>
      <figcaption>{legende ?? `Carte : ${c.nom}`} · © Blizzard Entertainment</figcaption>
    </figure>
  );
}

/** Vignette de carte avec le nom du lieu et, si on le connaît, son niveau : lien vers la page du lieu. */
export function CarteLieu({ slug, detail }: { slug: string; detail?: string }) {
  const c = carte(slug);
  if (!c) return null;
  return (
    <Link href={pageLieu(slug)} className="carte-lieu">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={urlCarte(slug, 500)} alt="" width={500} height={333} loading="lazy" />
      <span className="carte-lieu-texte">
        <strong>{c.nom}</strong>
        {detail ? <small>{detail}</small> : null}
      </span>
    </Link>
  );
}

/** Lien texte vers la page d'un lieu, avec une petite vignette de sa carte. */
export function LienLieu({ slug, nom }: { slug: string; nom: string }) {
  return (
    <Link href={pageLieu(slug)} className="lien-icone lien-lieu">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={urlCarte(slug, 500)} alt="" width={60} height={40} loading="lazy" className="vignette-carte" />
      {nom}
    </Link>
  );
}
