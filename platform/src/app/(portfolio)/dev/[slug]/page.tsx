// platform/src/app/(portfolio)/dev/[slug]/page.tsx
import { notFound } from "next/navigation";
import { getPortfolioBySlug, getBlocksBySlug } from "@/lib/portfolio";
import { PortfolioRenderer } from "@/components/blocks/PortfolioRenderer";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function DevPortfolioPage({ params }: Props) {
  const { slug } = await params;

  const [portfolio, blocks] = await Promise.all([
    getPortfolioBySlug(slug),
    getBlocksBySlug(slug),
  ]);

  if (!portfolio) notFound();

  return <PortfolioRenderer blocks={blocks} portfolioSlug={slug} />;
}
