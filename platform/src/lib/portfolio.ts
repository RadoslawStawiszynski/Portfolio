import { getPayload } from "payload";
import config from "@payload-config";
import type { BlockDoc } from "@/types/blocks";
import type { Metadata } from "next";

export async function getPortfolioBySlug(slug: string) {
  const payload = await getPayload({ config });
  const result = await payload.find({
    collection: "portfolios",
    where: { subdomain: { equals: slug } },
    limit: 1,
  });
  return result.docs[0] ?? null;
}

export async function getBlocksBySlug(slug: string) {
  const payload = await getPayload({ config });

  const portfolioResult = await payload.find({
    collection: "portfolios",
    where: { subdomain: { equals: slug } },
    limit: 1,
  });
  const portfolio = portfolioResult.docs[0];
  if (!portfolio) return [];

  const blocksResult = await payload.find({
    collection: "blocks",
    where: {
      and: [
        { portfolio: { equals: portfolio.id } },
        { visible: { equals: true } },
      ],
    },
    sort: "order",
    limit: 100,
  });
  return blocksResult.docs.map((doc) => ({
    id: String(doc.id),
    type: doc.type as string,
    themeOverride: (doc.themeOverride as string | null | undefined) ?? null,
    data: doc.data as { pl: unknown; en?: unknown },
  })) satisfies BlockDoc[];
}

export function buildPortfolioMetadata(
  portfolio: NonNullable<Awaited<ReturnType<typeof getPortfolioBySlug>>>,
  slug: string
): Metadata {
  const title = (portfolio.seoTitle as string | null | undefined) ?? slug;
  const description = (portfolio.seoDescription as string | null | undefined) ?? undefined;

  const seoImageRaw = portfolio.seoImage;
  const seoImageUrl =
    typeof seoImageRaw === "object" && seoImageRaw !== null
      ? ((seoImageRaw as { url?: string }).url ?? undefined)
      : undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: seoImageUrl ? [{ url: seoImageUrl }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: seoImageUrl ? [seoImageUrl] : undefined,
    },
  };
}
