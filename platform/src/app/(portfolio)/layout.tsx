// platform/src/app/(portfolio)/layout.tsx
import type { Metadata } from "next";
import { headers, cookies } from "next/headers";
import "../globals.css";
import { getPortfolioBySlug } from "@/lib/portfolio";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { DownloadCvButton } from "@/components/ui/DownloadCvButton";

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

  let theme = "light";
  let cvPdfPl: string | undefined;
  let cvPdfEn: string | undefined;
  let portfolioLang: "pl" | "en" | "pl-en" = "pl";

  if (slug) {
    const portfolio = await getPortfolioBySlug(slug);
    const payloadTheme = (portfolio?.theme as string | undefined) ?? "light";
    theme = cookieTheme ?? payloadTheme;
    cvPdfPl = (portfolio?.cvPdfPl as string | undefined) ?? undefined;
    cvPdfEn = (portfolio?.cvPdfEn as string | undefined) ?? undefined;
    portfolioLang =
      (portfolio?.language as "pl" | "en" | "pl-en" | undefined) ?? "pl";
  }

  return (
    <html
      lang="pl"
      data-theme={slug ? theme : undefined}
      suppressHydrationWarning
    >
      <body>
        {children}
        {slug && <ThemeToggle currentTheme={theme} />}
        {slug && (cvPdfPl || cvPdfEn) && (
          <DownloadCvButton
            urlPl={cvPdfPl}
            urlEn={cvPdfEn}
            portfolioLang={portfolioLang}
          />
        )}
      </body>
    </html>
  );
}
