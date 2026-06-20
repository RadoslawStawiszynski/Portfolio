import { getPayload } from "payload";
import config from "@payload-config";
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

function extractBlockData(doc: Record<string, unknown>, type: string): Record<string, unknown> {
  switch (type) {
    case "hero": {
      const h = (doc.heroData ?? {}) as Record<string, unknown>;
      const ctaLabel = h.ctaLabel as string | undefined;
      const ctaHref = h.ctaHref as string | undefined;
      return {
        title: h.title ?? "",
        subtitle: h.subtitle,
        avatarUrl: h.avatarUrl,
        cta: ctaLabel && ctaHref ? { label: ctaLabel, href: ctaHref } : undefined,
      };
    }
    case "about": {
      const a = (doc.aboutData ?? {}) as Record<string, unknown>;
      return { bio: a.bio ?? "", photoUrl: a.photoUrl };
    }
    case "experience": {
      const e = (doc.experienceData ?? {}) as Record<string, unknown>;
      const items = (e.items as Record<string, unknown>[] | undefined) ?? [];
      return {
        items: items.map((item) => ({
          company: item.company ?? "",
          role: item.role ?? "",
          startDate: item.startDate ?? "",
          endDate: item.endDate as string | undefined,
          description: item.description as string | undefined,
        })),
      };
    }
    case "skills": {
      const s = (doc.skillsData ?? {}) as Record<string, unknown>;
      const cats = (s.categories as Record<string, unknown>[] | undefined) ?? [];
      return {
        categories: cats.map((cat) => ({
          name: cat.name ?? "",
          skills: String(cat.skills ?? "")
            .split("\n")
            .map((sk) => sk.trim())
            .filter(Boolean),
        })),
      };
    }
    case "education": {
      const ed = (doc.educationData ?? {}) as Record<string, unknown>;
      const items = (ed.items as Record<string, unknown>[] | undefined) ?? [];
      return {
        items: items.map((item) => ({
          school: item.school ?? "",
          degree: item.degree ?? "",
          field: item.field ?? "",
          startYear: Number(item.startYear ?? 0),
          endYear: item.endYear != null ? Number(item.endYear) : undefined,
        })),
      };
    }
    case "contact": {
      const c = (doc.contactData ?? {}) as Record<string, unknown>;
      return {
        email: c.email as string | undefined,
        phone: c.phone as string | undefined,
        linkedin: c.linkedin as string | undefined,
        github: c.github as string | undefined,
        showForm: Boolean(c.showForm ?? true),
      };
    }
    default:
      return {};
  }
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
    data: extractBlockData(doc as unknown as Record<string, unknown>, doc.type as string),
  })) satisfies import("@/types/blocks").BlockDoc[];
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
