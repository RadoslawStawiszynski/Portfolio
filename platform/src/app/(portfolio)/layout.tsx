// platform/src/app/(portfolio)/layout.tsx
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { headers, cookies } from "next/headers";
import "../globals.css";
import { getPortfolioBySlug } from "@/lib/portfolio";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LangToggle } from "@/components/ui/LangToggle";
import { DownloadCvButton } from "@/components/ui/DownloadCvButton";
import { CookieConsentBanner } from "@/components/ui/CookieConsentBanner";

export const metadata: Metadata = {
  title: {
    template: "%s | PortfolioHub",
    default: "PortfolioHub",
  },
  description: "Multi-user portfolio platform",
};

export default async function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const cookieStore = await cookies();

  const slug = headersList.get("x-portfolio-slug");
  const cookieTheme = cookieStore.get("portfolio-theme")?.value;
  const cookieLang = cookieStore.get("portfolio-lang")?.value as "pl" | "en" | undefined;

  let theme = "light";
  let cvPdfPl: string | undefined;
  let cvPdfEn: string | undefined;
  let portfolioLang: "pl" | "en" | "pl-en" = "pl";
  let selectedLang: "pl" | "en" = "pl";

  if (slug) {
    const portfolio = await getPortfolioBySlug(slug);
    const payloadTheme = (portfolio?.theme as string | undefined) ?? "light";
    theme = cookieTheme ?? payloadTheme;
    cvPdfPl = portfolio?.cvPdfPl as string | undefined;
    cvPdfEn = portfolio?.cvPdfEn as string | undefined;
    portfolioLang = (portfolio?.language as "pl" | "en" | "pl-en" | undefined) ?? "pl";

    // selectedLang: cookie override when portfolio supports that language
    if (portfolioLang === "pl-en" && cookieLang) {
      selectedLang = cookieLang;
    } else if (portfolioLang === "en") {
      selectedLang = "en";
    } else {
      selectedLang = "pl";
    }
  }

  const showLangToggle = slug && portfolioLang === "pl-en";

  return (
    <html
      lang={selectedLang}
      data-theme={slug ? theme : undefined}
      suppressHydrationWarning
    >
      <body>
        {children}
        {slug && <CookieConsentBanner />}
        {/* Fixed bottom-right: theme toggle + optional lang toggle */}
        {slug && (
          <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
            {showLangToggle && <LangToggle currentLang={selectedLang} />}
            <ThemeToggle currentTheme={theme} />
          </div>
        )}
        {slug && (cvPdfPl || cvPdfEn) && (
          <DownloadCvButton
            urlPl={cvPdfPl}
            urlEn={cvPdfEn}
            portfolioLang={selectedLang}
          />
        )}
        <Analytics />
      </body>
    </html>
  );
}
