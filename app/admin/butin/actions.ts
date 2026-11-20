"use server";

import { redirect } from "next/navigation";
import { enregistrerReleveButin, lireReleveButin, supprimerSerieButin } from "@/modules/veille";
import { exigerAdmin } from "@/lib/admin";

const PAGE = "/admin/butin/";

/** Texte collé depuis /tt butin : lu, vérifié, puis enregistré (une même série remplace ses chiffres). */
export async function importer(f: FormData): Promise<void> {
  await exigerAdmin();
  let message: string;
  try {
    const r = lireReleveButin(String(f.get("texte") ?? ""));
    const { creatures, victoires } = await enregistrerReleveButin(r);
    message = `${creatures} créature(s), ${victoires} victoire(s), série ${r.serie}`;
  } catch (e) {
    redirect(`${PAGE}?erreur=${encodeURIComponent(e instanceof Error ? e.message : "Relevé illisible.")}`);
  }
  redirect(`${PAGE}?ok=${encodeURIComponent(message)}`);
}

export async function supprimerSerie(f: FormData): Promise<void> {
  await exigerAdmin();
  const serie = String(f.get("serie") ?? "");
  if (serie) await supprimerSerieButin(serie);
  redirect(`${PAGE}?supprime=${encodeURIComponent(serie)}`);
}
