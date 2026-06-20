import type { AboutData } from "@/types/blocks";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

interface Props {
  data: unknown;
  portfolioSlug: string;
}

export function AboutBlock({ data }: Props) {
  const d = data as AboutData;
  return (
    <section className="py-16 px-4 bg-[var(--color-bg-alt)]">
      <AnimatedSection className="max-w-4xl mx-auto">
        <h2 className="text-2xl lg:text-3xl font-bold text-[var(--color-primary)] mb-6">
          O mnie
        </h2>
        <p className="text-[var(--color-text)] leading-relaxed whitespace-pre-line text-base lg:text-lg">
          {d.bio}
        </p>
      </AnimatedSection>
    </section>
  );
}
