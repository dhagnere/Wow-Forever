import { normaliser } from "../collecte/tri";

export function slugifier(titre: string): string {
  const base = normaliser(titre).split(" ").filter(Boolean).slice(0, 12).join("-");
  return base.slice(0, 90).replace(/-+$/, "") || "article";
}
