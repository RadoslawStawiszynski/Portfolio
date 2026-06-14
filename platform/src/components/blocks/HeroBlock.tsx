import Image from "next/image";
import type { HeroData } from "@/types/blocks";

interface Props {
  data: unknown;
  portfolioSlug: string;
}

export function HeroBlock({ data }: Props) {
  const d = data as HeroData;
  return (
    <section className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-16 lg:py-24 bg-[var(--color-bg)]">
      {d.avatarUrl && (
        <Image
          src={d.avatarUrl}
          alt={d.title}
          width={128}
          height={128}
          className="w-24 h-24 lg:w-32 lg:h-32 rounded-full mb-6 object-cover border-4 border-[var(--color-accent)]"
        />
      )}
      <h1 className="text-4xl lg:text-6xl font-bold text-[var(--color-primary)] mb-4 max-w-3xl">
        {d.title}
      </h1>
      {d.subtitle && (
        <p className="text-lg lg:text-xl text-[var(--color-muted)] mb-8 max-w-2xl">
          {d.subtitle}
        </p>
      )}
      {d.cta && (
        <a
          href={d.cta.href}
          className="inline-block bg-[var(--color-accent)] text-[var(--color-bg)] px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
        >
          {d.cta.label}
        </a>
      )}
    </section>
  );
}
