// platform/src/app/(portfolio)/page.tsx
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { getPortfolioBySlug, getBlocksBySlug } from "@/lib/portfolio";
import { PortfolioRenderer } from "@/components/blocks/PortfolioRenderer";

export default async function PortfolioPage() {
  const slug = (await headers()).get("x-portfolio-slug");

  if (!slug) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-24">
        <h1 className="text-4xl font-bold text-(--color-primary)">PortfolioHub</h1>
        <p className="text-lg text-(--color-muted)">
          Multi-user portfolio platform
        </p>
      </main>
    );
  }

  const [portfolio, blocks] = await Promise.all([
    getPortfolioBySlug(slug),
    getBlocksBySlug(slug),
  ]);

  if (!portfolio) notFound();

  return <PortfolioRenderer blocks={blocks} portfolioSlug={slug} />;
}
