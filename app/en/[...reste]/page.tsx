import { notFound } from "next/navigation";

/** Adresse inconnue sous /en/ : page introuvable en anglais, dans le cadre anglais. */
export default function Inconnue() {
  notFound();
}
