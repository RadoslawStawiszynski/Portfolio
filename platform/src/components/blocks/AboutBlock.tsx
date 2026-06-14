import Image from "next/image";
import type { AboutData } from "@/types/blocks";

interface Props {
  data: unknown;
  portfolioSlug: string;
}

export function AboutBlock({ data }: Props) {
  const d = data as AboutData;
  return (
    <section className="py-16 px-4 bg-[var(--color-bg-alt)]">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-10 items-center">
        {d.photoUrl && (
          <Image
            src={d.photoUrl}
            alt="Zdjęcie"
            width={160}
            height={160}
            className="w-40 h-40 rounded-full object-cover shrink-0 border-4 border-[var(--color-accent)]"
          />
        )}
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold text-[var(--color-primary)] mb-4">
            O mnie
          </h2>
          <p className="text-[var(--color-text)] leading-relaxed whitespace-pre-line">
            {d.bio}
          </p>
        </div>
      </div>
    </section>
  );
}
