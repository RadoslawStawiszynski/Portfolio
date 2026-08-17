"use client";
import { motion } from "framer-motion";
import type { EducationData } from "@/types/blocks";

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
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

export function EducationBlock({ data }: Props) {
  const d = data as EducationData;
  return (
    <section className="py-16 px-4 bg-[var(--color-bg)]">
      <div className="max-w-4xl mx-auto">
        <h2
          className="glitch-heading text-2xl lg:text-3xl font-bold text-[var(--color-primary)] mb-8"
          data-text="Wykształcenie"
        >
          Wykształcenie
        </h2>
        <motion.ol
          variants={listVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="relative border-l border-[var(--color-accent)]/30 space-y-8"
        >
          {d.items.map((item, i) => {
            const isCurrent = !item.endYear;
            return (
              <motion.li key={i} variants={itemVariants} className="ml-6">
                <span className="absolute -left-2 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-accent)]" />
                <div className="terminal-card">
                  <div className="terminal-card-header">
                    <span className="font-mono font-bold">{item.school}</span>
                    <span className="ml-auto opacity-80 text-xs">
                      {item.startYear}–{isCurrent ? "obecnie" : item.endYear}
                    </span>
                  </div>
                  <div className="p-4 bg-[var(--color-bg-alt)]">
                    <p className="text-sm font-mono text-[var(--color-accent)] font-semibold mb-1">
                      {item.degree}
                    </p>
                    {item.field && (
                      <p className="text-sm text-[var(--color-text)]">{item.field}</p>
                    )}
                  </div>
                </div>
              </motion.li>
            );
          })}
        </motion.ol>
      </div>
    </section>
  );
}
