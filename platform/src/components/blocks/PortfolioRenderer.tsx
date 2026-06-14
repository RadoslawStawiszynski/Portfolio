// platform/src/components/blocks/PortfolioRenderer.tsx
import { logger } from "@/lib/logger";
import { BLOCK_REGISTRY, type RegisteredBlockType } from "./registry";
import type { BlockDoc } from "@/types/blocks";

export type { BlockDoc };

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

  return (
    <main>
      {blocks.map((block) => {
        const Component = BLOCK_REGISTRY[block.type as RegisteredBlockType];
        if (!Component) {
          logger.warn({ blockType: block.type, portfolioSlug }, "Unknown block type — skipping");
          return null;
        }
        return (
          <div
            key={block.id}
            data-block={block.type}
            {...(block.themeOverride ? { "data-theme": block.themeOverride } : {})}
          >
            <Component data={block.data?.pl ?? {}} portfolioSlug={portfolioSlug} />
          </div>
        );
      })}
    </main>
  );
}
