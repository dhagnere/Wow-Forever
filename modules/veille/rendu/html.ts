import sanitizeHtml from "sanitize-html";
import { marked } from "marked";

/**
 * Filtrage du HTML : tout contenu affiché sur le site passe par ici.
 * Garde-fou à ne jamais affaiblir (voir CLAUDE.md).
 */
const OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: ["p", "h2", "h3", "h4", "ul", "ol", "li", "strong", "em", "a", "blockquote", "code", "pre", "br", "hr", "table", "thead", "tbody", "tr", "th", "td", "iframe"],
  allowedAttributes: {
    a: ["href", "title", "rel", "target"],
    iframe: ["src", "title", "allow", "allowfullscreen", "loading"],
    th: ["scope"],
  },
  allowedSchemes: ["http", "https", "mailto"],
  allowProtocolRelative: false,
  // Seules les vidéos YouTube peuvent être intégrées.
  allowedIframeHostnames: ["www.youtube-nocookie.com", "www.youtube.com"],
  transformTags: {
    a: (tagName, attribs) => {
      const externe = /^https?:\/\//i.test(attribs.href ?? "");
      return {
        tagName,
        attribs: externe ? { ...attribs, rel: "noopener noreferrer nofollow", target: "_blank" } : attribs,
      };
    },
    iframe: (tagName, attribs) => ({ tagName, attribs: { ...attribs, loading: "lazy" } }),
  },
};

export function nettoyerHtml(html: string): string {
  return sanitizeHtml(html, OPTIONS);
}

/** Markdown → HTML filtré. */
export function markdownVersHtml(md: string): string {
  return nettoyerHtml(marked.parse(md, { async: false, gfm: true }) as string);
}

/** Texte brut, sans aucune balise, espaces resserrés. */
export function texteBrut(html: string): string {
  return sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} })
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}
