import { getPayload } from "payload";
import config from "@payload-config";

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
  const portfolio = await getPortfolioBySlug(slug);
  if (!portfolio) return [];

  const payload = await getPayload({ config });
  const result = await payload.find({
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
  return result.docs;
}
