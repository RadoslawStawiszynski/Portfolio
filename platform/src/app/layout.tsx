// platform/src/app/layout.tsx
import type { Metadata } from "next";
import { headers, cookies } from "next/headers";
import "./globals.css";
import { getPortfolioBySlug } from "@/lib/portfolio";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export const metadata: Metadata = {
  title: {
    template: "%s | PortfolioHub",
    default: "PortfolioHub",
  },
  description: "Multi-user portfolio platform",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const cookieStore = await cookies();

  const slug = headersList.get("x-portfolio-slug");
  const cookieTheme = cookieStore.get("portfolio-theme")?.value;

  let theme = "light";
  if (slug) {
    const portfolio = await getPortfolioBySlug(slug);
    const payloadTheme = (portfolio?.theme as string | undefined) ?? "light";
    theme = cookieTheme ?? payloadTheme;
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
      </body>
    </html>
  );
}
