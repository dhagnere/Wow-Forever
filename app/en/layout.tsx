import type { Metadata } from "next";
import { CadreEn } from "@/components/CadreEn";
import { Mesure } from "@/components/Mesure";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: { default: `${SITE.nom} — WoW Forever leveling guide, classes and talents`, template: `%s · ${SITE.nom}` },
  description: "WoW Forever leveling guide from 1 to 60 for every race and class, with quests on the map, spells, talents and a talent calculator.",
  openGraph: { siteName: SITE.nom, locale: "en_GB", type: "website" },
};

export default function LayoutAnglais({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CadreEn>{children}</CadreEn>
      <Mesure />
    </>
  );
}
