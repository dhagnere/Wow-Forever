import type { NextConfig } from "next";

const config: NextConfig = {
  // Adresses en « /classes/druide/ », comme prévu dans le plan de lancement.
  trailingSlash: true,
  poweredByHeader: false,
  serverExternalPackages: ["pg", "rss-parser", "sanitize-html", "sharp"],
  experimental: {
    // Envoi d'images depuis l'espace de relecture : 8 Mo par image, deux images au plus par envoi.
    serverActions: { bodySizeLimit: "18mb" },
    proxyClientMaxBodySize: "18mb",
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
      {
        source: "/admin/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default config;
