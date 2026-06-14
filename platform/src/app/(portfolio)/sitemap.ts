import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { getPortfolioBySlug } from "@/lib/portfolio";

const PLATFORM_DOMAIN =
  process.env.NEXT_PUBLIC_PLATFORM_DOMAIN ?? "korp-cbm.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slug = (await headers()).get("x-portfolio-slug");
  if (!slug) return [];

  const portfolio = await getPortfolioBySlug(slug);
  if (!portfolio || !(portfolio.isPublished as boolean | undefined)) return [];

  const baseUrl = (portfolio.customDomain as string | undefined)
    ? `https://${portfolio.customDomain as string}`
    : `https://${slug}.${PLATFORM_DOMAIN}`;

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
