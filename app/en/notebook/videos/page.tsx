import type { Metadata } from "next";
import Link from "next/link";
import { videosChaine } from "@/modules/veille";
import { Ariane } from "@/components/Ariane";
import { VideosChaine } from "@/components/VideosChaine";
import { SITE } from "@/lib/site";

// The list follows the channel: read again at most once an hour.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Jobwow's videos — the Journal on screen",
  description: "Jobwow's play sessions on WoW Forever, from 1 to 60, recorded without any paid guide and split into chapters by zone and level.",
  alternates: { canonical: "/en/notebook/videos/", languages: { fr: "/carnet/videos/", en: "/en/notebook/videos/", "x-default": "/carnet/videos/" } },
};

export default async function JobwowVideos() {
  const videos = await videosChaine(SITE.youtubeChaine);
  return (
    <>
      <section className="bandeau-page">
        <div className="wrap">
          <Ariane langue="en" etapes={[{ nom: "Jobwow's Notebook", href: "/en/notebook/" }, { nom: "Videos" }]} />
          <p className="surtitre">Jobwow&apos;s Journal on screen</p>
          <h1>Jobwow&apos;s videos</h1>
          <p className="chapo">
            Every play session on WoW Forever, recorded without any paid guide. Each video has chapters for the zones crossed and the levels
            gained. The weekly story stays in the <Link href="/en/notebook/">Notebook</Link>. The videos are in French.
          </p>
        </div>
      </section>
      <div className="wrap contenu">
        <VideosChaine videos={videos} langue="en" />
      </div>
    </>
  );
}
