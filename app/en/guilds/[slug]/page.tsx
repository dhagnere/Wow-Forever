import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { lireGuilde } from "@/modules/veille";
import { Ariane } from "@/components/Ariane";
import { CarteGuilde } from "@/components/Guildes";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const g = await lireGuilde((await params).slug);
  if (!g) return { title: "Guild not found" };
  const fr = `/guildes/${g.slug}/`;
  const en = `/en/guilds/${g.slug}/`;
  return {
    title: `${g.nom} (${g.faction === "alliance" ? "Alliance" : "Horde"}, ${g.serveur}) — WoW Forever guild`,
    description: g.description.slice(0, 155),
    alternates: { canonical: en, languages: { fr, en, "x-default": fr } },
  };
}

export default async function GuildEn({ params }: Props) {
  const g = await lireGuilde((await params).slug);
  if (!g) notFound();
  return (
    <div className="wrap contenu">
      <Ariane langue="en" etapes={[{ nom: "Guild board", href: "/en/guilds/" }, { nom: g.nom }]} />
      <div style={{ maxWidth: 760 }}>
        <CarteGuilde g={g} complete langue="en" />
        <p className="doux" style={{ fontSize: 14, marginTop: 20 }}>
          Listing written by the guild, in its own language, and reviewed by Jobwow. <Link href="/en/guilds/">See all guilds</Link> ·{" "}
          <Link href="/en/guilds/register/">Register yours</Link>
        </p>
      </div>
    </div>
  );
}
