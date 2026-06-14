// platform/src/app/(portfolio)/dev/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPortfolioBySlug, getBlocksBySlug, buildPortfolioMetadata } from "@/lib/portfolio";
import { PortfolioRenderer } from "@/components/blocks/PortfolioRenderer";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const portfolio = await getPortfolioBySlug(slug);
  if (!portfolio) return {};

  return buildPortfolioMetadata(portfolio, slug);
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
