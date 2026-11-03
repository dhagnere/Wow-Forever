"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MENU_EN } from "@/lib/anglais";

/** Menu de la version anglaise. */
export function NavEn() {
  const chemin = usePathname() ?? "/en/";
  return (
    <nav className="nav" aria-label="Sections">
      {MENU_EN.map((m) => (
        <Link key={m.href} href={m.href} aria-current={(m.href === "/en/" ? chemin === "/en/" || chemin === "/en" : chemin.startsWith(m.href)) ? "page" : undefined}>
          {m.label}
        </Link>
      ))}
      <Link href="/" hrefLang="fr" lang="fr">Site en français</Link>
    </nav>
  );
}
