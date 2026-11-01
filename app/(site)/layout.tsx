import { SiteCadre } from "@/components/Cadre";
import { MesureAudience } from "@/components/MesureAudience";
import { BandeauCookies } from "@/components/BandeauCookies";
import { SITE } from "@/lib/site";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteCadre>{children}</SiteCadre>
      {SITE.gtmId ? (
        <>
          <MesureAudience gtmId={SITE.gtmId} />
          <BandeauCookies />
        </>
      ) : null}
    </>
  );
}
