// platform/src/components/blocks/ExperienceBlock.tsx
"use client";
import { motion } from "framer-motion";
import type { ExperienceData } from "@/types/blocks";

interface Props {
  data: unknown;
  portfolioSlug: string;
}

const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" as const } },
};

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
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl lg:text-3xl font-bold text-[var(--color-primary)] mb-8">
          Doświadczenie
        </h2>
        <motion.ol
          variants={listVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="relative border-l border-[var(--color-bg-alt)] space-y-10"
        >
          {d.items.map((item, i) => (
            <motion.li key={i} variants={itemVariants} className="ml-6">
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
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  );
}
