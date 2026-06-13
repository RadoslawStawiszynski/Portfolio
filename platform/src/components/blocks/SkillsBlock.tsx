import type { SkillsData } from "@/types/blocks";

interface Props {
  data: unknown;
  portfolioSlug: string;
}

export function SkillsBlock({ data }: Props) {
  const d = data as SkillsData;
  return (
    <section className="py-16 px-4 bg-[var(--color-bg-alt)]">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl lg:text-3xl font-bold text-[var(--color-primary)] mb-8">
          Umiejętności
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {d.categories.map((cat, i) => (
            <div key={i}>
              <h3 className="text-sm font-semibold uppercase tracking-widest text-[var(--color-muted)] mb-3">
                {cat.name}
              </h3>
              <div className="flex flex-wrap gap-2">
                {cat.skills.map((skill, j) => (
                  <span
                    key={j}
                    className="px-3 py-1 text-sm rounded-full bg-[var(--color-bg)] text-[var(--color-text)] border border-[var(--color-bg-alt)]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
