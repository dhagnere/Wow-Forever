import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { urlAutorisationTiktok } from "@/modules/veille";
import { exigerAdmin } from "@/lib/admin";

export const dynamic = "force-dynamic";

/** Envoie vers TikTok pour autoriser la publication ; un jeton aléatoire protège le retour. */
export async function GET() {
  await exigerAdmin();
  const etat = randomBytes(24).toString("base64url");
  (await cookies()).set("af_tiktok_etat", etat, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/reseaux/tiktok/", maxAge: 600 });
  redirect(urlAutorisationTiktok(etat));
}
