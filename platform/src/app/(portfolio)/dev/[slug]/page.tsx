// platform/src/app/(portfolio)/dev/[slug]/page.tsx
import type { Metadata } from "next";
import { cookies } from "next/headers";
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

  const cookieStore = await cookies();
  const cookieLang = cookieStore.get("portfolio-lang")?.value as "pl" | "en" | undefined;

  const [portfolio, blocks] = await Promise.all([
    getPortfolioBySlug(slug),
    getBlocksBySlug(slug, cookieLang ?? "pl"),
  ]);

  if (!portfolio) notFound();

  return <PortfolioRenderer blocks={blocks} portfolioSlug={slug} />;
}
