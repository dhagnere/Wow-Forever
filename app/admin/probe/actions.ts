"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { declinerGuideProbe, deposerGuideProbe, lireGuideProbe, parcoursProbePublies, publierGuideProbe, type PorteeProbe } from "@/modules/veille";
import { exigerAdmin } from "@/lib/admin";
import { guideDepuisExport, lireExport, porteeConseillee, verifierGuide, versParcoursReleves, type GuideProbe, type Verification } from "@/lib/probe";
import { cheminAnglais } from "@/lib/anglais";

const PAGE = "/admin/probe/";
const PORTEES: PorteeProbe[] = ["classe", "race", "faction"];
const portee = (v: FormDataEntryValue | null): PorteeProbe | null => (PORTEES.includes(String(v) as PorteeProbe) ? (String(v) as PorteeProbe) : null);

/** Code collé depuis /ep export : lu, analysé, vérifié, rangé « à valider ». Rien n'est publié à ce stade. */
export async function analyserCode(f: FormData): Promise<void> {
  await exigerAdmin();
  let id: number;
  try {
    const g = guideDepuisExport(lireExport(String(f.get("code") ?? "")));
    const p = porteeConseillee(g);
    id = await deposerGuideProbe({
      personnage: g.personnage, race: g.race, classe: g.classe, faction: g.faction, partie: g.partie,
      portee: p, guide: g, verification: verifierGuide(g, p, await parcoursProbePublies()),
    });
  } catch (e) {
    redirect(`${PAGE}?erreur=${encodeURIComponent(e instanceof Error ? e.message : "Code illisible.")}`);
  }
  revalidatePath(PAGE);
  redirect(`${PAGE}?ok=${id}#guide-${id}`);
}

/** Pages du guide à rafraîchir après une publication ou un retrait, en français et en anglais. */
function rafraichir(v: Verification) {
  for (const page of v.pages) {
    const fr = `/guides/parcours/${page.race}/${page.classe}/`;
    revalidatePath(fr);
    const en = cheminAnglais(fr);
    if (en) revalidatePath(en);
  }
}

/**
 * Publication : nouvelle vérification avec la portée choisie et les autres guides déjà publiés. Un guide qui rendrait un
 * parcours injouable n'est pas publié.
 */
export async function publier(f: FormData): Promise<void> {
  await exigerAdmin();
  const id = Number(f.get("id"));
  const p = portee(f.get("portee"));
  const ligne = Number.isInteger(id) ? await lireGuideProbe(id) : null;
  if (!ligne || !p) redirect(`${PAGE}?erreur=${encodeURIComponent("Guide introuvable.")}`);
  const g = ligne.guide as GuideProbe;
  const autres = (await parcoursProbePublies()).filter((r) => !ligne.releves.some((x) => x.race === r.race && x.lieu === r.lieu && x.source === r.source));
  const v = verifierGuide(g, p, autres);
  if (!v.ok) {
    redirect(`${PAGE}?erreur=${encodeURIComponent(`Publication refusée : ${v.problemes[0]}`)}#guide-${id}`);
  }
  const source = `EternalProbe, ${g.personnage || "personnage inconnu"}, guide n° ${id}`;
  await publierGuideProbe(id, p, v, versParcoursReleves(g, p, source));
  rafraichir(v);
  revalidatePath(PAGE);
  redirect(`${PAGE}?publie=${id}#guide-${id}`);
}

export async function ecarter(f: FormData): Promise<void> {
  await exigerAdmin();
  const id = Number(f.get("id"));
  if (Number.isInteger(id)) await declinerGuideProbe(id, "ecarte");
  revalidatePath(PAGE);
  redirect(PAGE);
}

/** Retire un guide publié : les pages reviennent à l'ordre d'avant. Il reste dans l'historique, republiable. */
export async function retirer(f: FormData): Promise<void> {
  await exigerAdmin();
  const id = Number(f.get("id"));
  const ligne = Number.isInteger(id) ? await lireGuideProbe(id) : null;
  if (ligne && (await declinerGuideProbe(id, "retire"))) rafraichir(ligne.verification as Verification);
  revalidatePath(PAGE);
  redirect(`${PAGE}#guide-${id}`);
}
