// platform/src/components/blocks/PortfolioRenderer.tsx
import { logger } from "@/lib/logger";
import { BLOCK_REGISTRY, type RegisteredBlockType } from "./registry";
import type { BlockDoc, HeroData } from "@/types/blocks";
import { PortfolioNav } from "@/components/ui/PortfolioNav";

export type { BlockDoc };

const SECTION_LABELS: Partial<Record<string, string>> = {
  hero: "Start",
  about: "O mnie",
  experience: "Doświadczenie",
  skills: "Umiejętności",
  education: "Edukacja",
  contact: "Kontakt",
};

interface Props {
  blocks: BlockDoc[];
  portfolioSlug: string;
}

export function PortfolioRenderer({ blocks, portfolioSlug }: Props) {
  if (blocks.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-[var(--color-muted)]">
          To portfolio nie ma jeszcze żadnych bloków.
        </p>
      </main>
    );
  }

  const sections = blocks.map((b) => ({
    id: b.type,
    label: SECTION_LABELS[b.type] ?? b.type,
  }));

  const heroBlock = blocks.find((b) => b.type === "hero");
  const heroData = heroBlock?.data as HeroData | undefined;
  const identity = heroData
    ? { name: heroData.title, subtitle: heroData.subtitle, avatarUrl: heroData.avatarUrl }
    : undefined;

  return (
    <>
      <PortfolioNav sections={sections} identity={identity} />
      <main className="pt-14">
        {blocks.map((block) => {
          const Component = BLOCK_REGISTRY[block.type as RegisteredBlockType];
          if (!Component) {
            logger.warn({ blockType: block.type, portfolioSlug }, "Unknown block type — skipping");
            return null;
          }
          return (
            <div
              key={block.id}
              id={block.type}
              data-block={block.type}
              className="scroll-mt-14"
              {...(block.themeOverride ? { "data-theme": block.themeOverride } : {})}
            >
              <Component data={block.data} portfolioSlug={portfolioSlug} />
            </div>
          );
        })}
      </main>
    </>
  );
}
