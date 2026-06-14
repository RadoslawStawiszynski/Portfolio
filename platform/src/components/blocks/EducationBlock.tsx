// platform/src/components/blocks/EducationBlock.tsx
"use client";
import { motion } from "framer-motion";
import type { EducationData } from "@/types/blocks";

interface Props {
  data: unknown;
  portfolioSlug: string;
}

const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

export function EducationBlock({ data }: Props) {
  const d = data as EducationData;
  return (
    <section className="py-16 px-4 bg-[var(--color-bg)]">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl lg:text-3xl font-bold text-[var(--color-primary)] mb-8">
          Wykształcenie
        </h2>
        <motion.div
          variants={listVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="space-y-6"
        >
          {d.items.map((item, i) => (
            <motion.div
              key={i}
              variants={cardVariants}
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
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
