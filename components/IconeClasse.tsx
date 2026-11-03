/**
 * Icône officielle de la classe, tirée des fichiers du jeu (npm run icones:jeu, © Blizzard Entertainment),
 * dans un cadre or éclairé de la couleur de la classe.
 */
export function IconeClasse({ slug, couleur, taille = 64, nom }: { slug: string; couleur: string; taille?: number | string; nom?: string }) {
  const px = typeof taille === "number" ? taille : 128;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/images/jeu/classes/${slug}.png`}
      width={px}
      height={px}
      alt={nom ?? ""}
      aria-hidden={nom ? undefined : true}
      loading="lazy"
      className="icone-classe icone-jeu"
      style={{ width: taille, height: "auto", ["--lueur" as string]: couleur }}
    />
  );
}
