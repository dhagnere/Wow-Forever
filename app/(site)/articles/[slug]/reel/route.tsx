import { ImageResponse } from "next/og";
import { cookies } from "next/headers";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { COOKIE_SESSION, jetonValide, lireImage, lireParSlug } from "@/modules/veille";
import { trouverRubrique } from "@/config/taxonomie";
import { domaineSite, phraseAppel } from "@/config/reseaux";

export const dynamic = "force-dynamic";

/**
 * Image verticale 1080 × 1920 du Reel : image d'en-tête en fond, logo, rubrique, titre, accroche, phrase d'appel.
 * Publique pour un article en ligne ; réservée à l'administration pour un brouillon.
 * Elle sert de base à la vidéo (modules/veille/reels/video.ts).
 */
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const article = await lireParSlug((await params).slug);
  if (!article || article.statut === "supprime") return new Response("Introuvable", { status: 404 });
  if (article.statut !== "publie" && !(await jetonValide((await cookies()).get(COOKIE_SESSION)?.value))) {
    return new Response("Introuvable", { status: 404 });
  }
  // Images fournies en données intégrées : aucune requête réseau (le générateur refuse les adresses locales).
  const imageUne = article.image ? await lireImage(article.image.id, "une") : null;
  const fond = imageUne ? `data:image/jpeg;base64,${imageUne.donnees.toString("base64")}` : null;
  const logo = `data:image/png;base64,${(await readFile(path.join(process.cwd(), "public/images/logo-silfax-192.png"))).toString("base64")}`;
  const rubrique = trouverRubrique(article.rubrique)?.nom ?? "";
  const titre = article.titre;
  const taille = titre.length > 90 ? 64 : titre.length > 60 ? 74 : 86;
  const accroche = (article.accrocheFacebook || article.chapo).slice(0, 140);

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: "#0b1020", color: "#f8f2e2" }}>
        {fond ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={fond} alt="" width={1080} height={1920} style={{ position: "absolute", inset: 0, width: 1080, height: 1920, objectFit: "cover" }} />
        ) : (
          <div style={{ position: "absolute", inset: 0, display: "flex", background: "radial-gradient(ellipse at 30% 25%, rgba(232,192,106,0.35), transparent 55%), linear-gradient(170deg, #182a48 0%, #0b1020 60%, #070b16 100%)" }} />
        )}
        <div style={{ position: "absolute", inset: 0, display: "flex", background: "linear-gradient(180deg, rgba(7,11,22,0.75) 0%, rgba(7,11,22,0.25) 30%, rgba(7,11,22,0.55) 55%, rgba(7,11,22,0.95) 100%)" }} />
        <div style={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%", height: "100%", padding: "120px 90px 150px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logo} alt="" width={120} height={120} />
            <div style={{ display: "flex", fontSize: 50, fontWeight: 700, letterSpacing: 5 }}>
              AZEROTH&nbsp;<span style={{ color: "#d9a94a" }}>FOREVER</span>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 26, background: "rgba(7,11,22,0.82)", border: "2px solid rgba(217,169,74,0.55)", borderRadius: 18, padding: "44px 42px" }}>
            <div style={{ display: "flex", fontSize: 36, letterSpacing: 6, color: "#e8c06a", textTransform: "uppercase" }}>{rubrique}</div>
            <div style={{ display: "flex", fontSize: taille, fontWeight: 700, lineHeight: 1.12 }}>{titre}</div>
            {accroche ? <div style={{ display: "flex", fontSize: 40, lineHeight: 1.3, color: "#ddd5c3" }}>{accroche}</div> : null}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14, border: "4px solid #d9a94a", borderRadius: 18, padding: "34px 38px", background: "rgba(7,11,22,0.85)" }}>
            <div style={{ display: "flex", fontSize: 38, lineHeight: 1.3 }}>{phraseAppel().replace(/^👉\s*/, "")}</div>
            <div style={{ display: "flex", fontSize: 34, color: "#e8c06a", fontWeight: 700 }}>{domaineSite()}</div>
          </div>
        </div>
      </div>
    ),
    { width: 1080, height: 1920, headers: { "Cache-Control": "private, no-store" } },
  );
}
