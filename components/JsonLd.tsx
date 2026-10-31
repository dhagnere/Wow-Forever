/** Données structurées pour Google. Le contenu est sérialisé, jamais interprété comme HTML. */
export function JsonLd({ donnees }: { donnees: Record<string, unknown> }) {
  const json = JSON.stringify(donnees).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
