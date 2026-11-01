import Script from "next/script";

/**
 * Google Tag Manager, en mode consentement (Consent Mode v2).
 * Tout est refusé par défaut : rien n'est mesuré avant l'accord du visiteur (exigence CNIL).
 * Le choix, gardé dans le navigateur, est relu à chaque page ; la bannière (BandeauCookies) le met à jour.
 * Placé dans la mise en page publique seulement : l'administration n'est pas mesurée.
 */

export const CLE_CONSENTEMENT = "af-consentement";
/** Durée de validité d'un choix : 6 mois, puis la question est reposée. */
export const DUREE_CHOIX_MS = 182 * 24 * 3600 * 1000;

export function MesureAudience({ gtmId }: { gtmId: string }) {
  if (!/^GTM-[A-Z0-9]+$/.test(gtmId)) return null;
  const code = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('consent', 'default', {
  ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'denied',
  wait_for_update: 500
});
try {
  var c = JSON.parse(localStorage.getItem('${CLE_CONSENTEMENT}') || 'null');
  if (c && c.choix === 'accepte' && Date.now() - c.date < ${DUREE_CHOIX_MS}) {
    gtag('consent', 'update', { ad_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'granted', analytics_storage: 'granted' });
  }
} catch (e) {}
gtag('js', new Date());
dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
var s = document.createElement('script');
s.async = true;
s.src = 'https://www.googletagmanager.com/gtm.js?id=${gtmId}';
document.head.appendChild(s);
`;
  return (
    <Script id="google-tag-manager" strategy="afterInteractive">
      {code}
    </Script>
  );
}
