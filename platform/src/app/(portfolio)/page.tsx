// platform/src/app/(portfolio)/page.tsx
import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import {
  getPortfolioBySlug,
  getBlocksBySlug,
  buildPortfolioMetadata,
} from "@/lib/portfolio";
import { PortfolioRenderer } from "@/components/blocks/PortfolioRenderer";
import { LandingPage } from "@/components/landing/LandingPage";

export async function generateMetadata(): Promise<Metadata> {
  const slug = (await headers()).get("x-portfolio-slug");
  if (!slug) {
    return {
      title: "PortfolioHub — Platforma portfolio",
      description: "Profesjonalne portfolio dla każdego. Własna domena, edytowalne bloki, wiele motywów.",
    };
  }

  const portfolio = await getPortfolioBySlug(slug);
  if (!portfolio) return {};

  return buildPortfolioMetadata(portfolio, slug);
}

export default async function PortfolioPage() {
  const slug = (await headers()).get("x-portfolio-slug");

  if (!slug) {
    return <LandingPage />;
  }

  const [portfolio, blocks] = await Promise.all([
    getPortfolioBySlug(slug),
    getBlocksBySlug(slug),
  ]);

  if (!portfolio) notFound();

  return <PortfolioRenderer blocks={blocks} portfolioSlug={slug} />;
}
