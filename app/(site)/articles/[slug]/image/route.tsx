import { ImageResponse } from "next/og";
import { lirePublie } from "@/modules/veille";
import { trouverRubrique } from "@/config/taxonomie";

// Image d'ouverture fabriquée par le site : titre, rubrique et logo. Aucun visuel tiers.
// Adresse fixe /articles/<slug>/image/, lue par Facebook (Open Graph) et par Google (données structurées).
const size = { width: 1200, height: 630 };

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const article = await lirePublie((await params).slug);
  const titre = article?.titre ?? "La Taverne Éternelle";
  const rubrique = article ? (trouverRubrique(article.rubrique)?.nom ?? "") : "WoW Forever en français";
  const taille = titre.length > 90 ? 50 : titre.length > 60 ? 58 : 66;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between",
          padding: "64px 72px", color: "#fbf1da",
          background: "radial-gradient(ellipse at 20% 15%, rgba(232,192,106,0.28), transparent 50%), linear-gradient(160deg, #3a2e24 0%, #2b1d14 65%, #141312 100%)",
          border: "12px solid #8a6418",
        }}
      >
        <div style={{ display: "flex", fontSize: 30, letterSpacing: 6, color: "#e8c06a", textTransform: "uppercase" }}>{rubrique}</div>
        <div style={{ display: "flex", fontSize: taille, fontWeight: 700, lineHeight: 1.12 }}>{titre}</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", fontSize: 40, fontWeight: 700, letterSpacing: 4 }}>
            LA TAVERNEAZEROTH&nbsp;<span style={{ color: "#e0a23b" }}>FOREVER</span>nbsp;<span style={{ color: "#e0a23b" }}>ÉTERNELLE</span>
          </div>
          <div style={{ display: "flex", fontSize: 26, color: "#b8ae99" }}>par Jobwow</div>
        </div>
      </div>
    ),
    { ...size, headers: { "Cache-Control": "public, max-age=3600, s-maxage=86400" } },
  );
}
