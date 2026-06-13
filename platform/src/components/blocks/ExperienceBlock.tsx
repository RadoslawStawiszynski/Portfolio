import type { ExperienceData } from "@/types/blocks";

interface Props {
  data: unknown;
  portfolioSlug: string;
}

function formatPeriod(startDate: string, endDate?: string): string {
  const fmt = (d: string) => {
    const [y, m] = d.split("-");
    const months = ["sty","lut","mar","kwi","maj","cze","lip","sie","wrz","paź","lis","gru"];
    return m ? `${months[parseInt(m) - 1]} ${y}` : y;
  };
  return `${fmt(startDate)} — ${endDate ? fmt(endDate) : "obecnie"}`;
}

export function ExperienceBlock({ data }: Props) {
  const d = data as ExperienceData;
  return (
    <section className="py-16 px-4 bg-[var(--color-bg)]">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl lg:text-3xl font-bold text-[var(--color-primary)] mb-8">
          Doświadczenie
        </h2>
        <ol className="relative border-l border-[var(--color-bg-alt)] space-y-10">
          {d.items.map((item, i) => (
            <li key={i} className="ml-6">
              <span className="absolute -left-2 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-accent)]" />
              <p className="text-sm text-[var(--color-muted)] mb-1">
                {formatPeriod(item.startDate, item.endDate)}
              </p>
              <h3 className="text-lg font-semibold text-[var(--color-primary)]">
                {item.role}
              </h3>
              <p className="text-[var(--color-secondary)] font-medium mb-2">
                {item.company}
              </p>
              {item.description && (
                <p className="text-[var(--color-text)] leading-relaxed">
                  {item.description}
                </p>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
