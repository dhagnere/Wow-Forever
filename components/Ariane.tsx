import Link from "next/link";
import { JsonLd } from "./JsonLd";
import { SITE } from "@/lib/site";

export interface Etape {
  nom: string;
  href?: string;
}

export function Ariane({ etapes }: { etapes: Etape[] }) {
  const toutes = [{ nom: "Accueil", href: "/" }, ...etapes];
  return (
    <nav className="ariane" aria-label="Fil d'Ariane">
      <ol>
        {toutes.map((e, i) => (
          <li key={i}>{e.href && i < toutes.length - 1 ? <Link href={e.href}>{e.nom}</Link> : <span aria-current="page">{e.nom}</span>}</li>
        ))}
      </ol>
      <JsonLd
        donnees={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: toutes.map((e, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: e.nom,
            ...(e.href ? { item: `${SITE.url}${e.href}` } : {}),
          })),
        }}
      />
    </nav>
  );
}
