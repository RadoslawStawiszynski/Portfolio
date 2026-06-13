import type { EducationData } from "@/types/blocks";

interface Props {
  data: unknown;
  portfolioSlug: string;
}

export function EducationBlock({ data }: Props) {
  const d = data as EducationData;
  return (
    <section className="py-16 px-4 bg-[var(--color-bg)]">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl lg:text-3xl font-bold text-[var(--color-primary)] mb-8">
          Wykształcenie
        </h2>
        <div className="space-y-6">
          {d.items.map((item, i) => (
            <div
              key={i}
              className="p-6 rounded-xl bg-[var(--color-bg-alt)]"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
                <h3 className="text-lg font-semibold text-[var(--color-primary)]">
                  {item.school}
                </h3>
                <span className="text-sm text-[var(--color-muted)]">
                  {item.startYear}–{item.endYear ?? "obecnie"}
                </span>
              </div>
              <p className="text-[var(--color-text)]">
                {item.degree} · {item.field}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
