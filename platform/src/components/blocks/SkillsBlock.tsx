"use client";
import { motion } from "framer-motion";
import type { SkillsData } from "@/types/blocks";

interface Props {
  data: unknown;
  portfolioSlug: string;
}

const gridVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const categoryVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

const tagVariants = {
  hidden: { opacity: 0, scale: 0.85 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.25, ease: "easeOut" as const } },
};

export function SkillsBlock({ data }: Props) {
  const d = data as SkillsData;
  return (
    <section className="py-16 px-4 bg-[var(--color-bg-alt)]">
      <div className="max-w-4xl mx-auto">
        <h2
          className="glitch-heading text-2xl lg:text-3xl font-bold text-[var(--color-primary)] mb-10"
          data-text="Umiejętności"
        >
          Umiejętności
        </h2>
        <motion.div
          variants={gridVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {d.categories.map((cat, i) => (
            <motion.div key={i} variants={categoryVariants} className="terminal-card">
              <div className="terminal-card-header">{cat.name}</div>
              <div className="p-4 bg-[var(--color-bg)]">
                <motion.div
                  variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
                  className="flex flex-wrap gap-2"
                >
                  {cat.skills.map((skill, j) => (
                    <motion.span
                      key={j}
                      variants={tagVariants}
                      whileHover={{ scale: 1.07, y: -2 }}
                      className="px-3 py-1 text-sm font-mono rounded bg-[var(--color-bg-alt)] text-[var(--color-text)] border border-transparent hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] cursor-default transition-colors duration-150"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
