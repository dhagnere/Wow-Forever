import { MISE_A_JOUR_REFERENCE } from "@/content/reference";
import { dateLongue } from "@/lib/site";

/** Bandeau des pages de référence : d'où viennent les données, et ce qui reste à confirmer. */
export function AvertissementReference() {
  return (
    <p className="info" role="note" style={{ margin: "0 0 32px" }}>
      <strong>Repères de l&apos;Azeroth d&apos;origine.</strong> Forever reprend la carte du jeu d&apos;origine : ces niveaux en
      sont tirés et restent indicatifs, à confirmer en jeu. Les éléments propres à Forever sont signalés.
      Mise à jour le {dateLongue(MISE_A_JOUR_REFERENCE)} par Silfax.
    </p>
  );
}
