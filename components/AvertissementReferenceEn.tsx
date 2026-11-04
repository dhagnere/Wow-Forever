import { MISE_A_JOUR_REFERENCE } from "@/content/reference";

const dateEn = (d: string) => new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Paris" }).format(new Date(d));

/** Bandeau des pages de référence (version anglaise). */
export function AvertissementReferenceEn() {
  return (
    <p className="info" role="note" style={{ margin: "0 0 32px" }}>
      <strong>Landmarks from original Azeroth.</strong> Forever reuses the map of the original game: these levels come from it and remain
      indicative, to be confirmed in game. Elements specific to Forever are flagged. Updated on {dateEn(MISE_A_JOUR_REFERENCE)} by Jobwow.
    </p>
  );
}
