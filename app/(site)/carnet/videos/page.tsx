import type { Metadata } from "next";
import Link from "next/link";
import { videosChaine } from "@/modules/veille";
import { Ariane } from "@/components/Ariane";
import { VideosChaine } from "@/components/VideosChaine";
import { languesDe } from "@/lib/anglais";
import { SITE } from "@/lib/site";

// La liste suit la chaîne : relue au plus une fois par heure.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Les vidéos de Jobwow — le Journal en images",
  description: "Les séances de jeu de Jobwow sur WoW Forever, de 1 à 60, découpées en chapitres par zone et par niveau.",
  alternates: { canonical: "/carnet/videos/", languages: languesDe("/carnet/videos/") },
};

export default async function VideosJobwow() {
  const videos = await videosChaine(SITE.youtubeChaine);
  return (
    <>
      <section className="bandeau-page">
        <div className="wrap">
          <Ariane etapes={[{ nom: "Le Carnet de Jobwow", href: "/carnet/" }, { nom: "Les vidéos" }]} />
          <p className="surtitre">Le Journal de Jobwow en images</p>
          <h1>Les vidéos de Jobwow</h1>
          <p className="chapo">
            Chaque séance de jeu sur WoW Forever, de 1 à 60. Les chapitres de chaque vidéo suivent les zones traversées et les
            niveaux gagnés. Le récit de la semaine reste dans le <Link href="/carnet/">Carnet</Link>.
          </p>
        </div>
      </section>
      <div className="wrap contenu">
        <VideosChaine videos={videos} />
      </div>
    </>
  );
}
