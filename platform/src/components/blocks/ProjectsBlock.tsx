"use client";
import { motion } from "framer-motion";
import type { ProjectsData } from "@/types/blocks";

interface Props {
  data: unknown;
  portfolioSlug: string;
}

const gridVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

const STATUS_LABEL: Record<string, string> = {
  "completed":   "✓ done",
  "in-progress": "⚡ aktywny",
  "archived":    "⌂ archiwum",
};

export function ProjectsBlock({ data }: Props) {
  const d = data as ProjectsData;
  return (
    <section className="py-16 px-4 bg-[var(--color-bg-alt)]">
      <div className="max-w-4xl mx-auto">
        <h2
          className="glitch-heading text-2xl lg:text-3xl font-bold text-[var(--color-primary)] mb-10"
          data-text="Projekty"
        >
          Projekty
        </h2>
        <motion.div
          variants={gridVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {d.items.map((item, i) => (
            <motion.div key={i} variants={cardVariants} className="terminal-card flex flex-col">
              <div className="terminal-card-header flex items-center justify-between">
                <span className="font-mono font-bold truncate">{item.title}</span>
                {item.status && (
                  <span className="text-[0.6rem] opacity-75 ml-2 shrink-0 font-mono">
                    {STATUS_LABEL[item.status] ?? item.status}
                  </span>
                )}
              </div>
              <div className="p-4 bg-[var(--color-bg)] flex flex-col flex-1 gap-3">
                {item.description && (
                  <p className="text-sm text-[var(--color-text)] leading-relaxed">
                    {item.description}
                  </p>
                )}
                {item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-auto">
                    {item.tags.map((tag, j) => (
                      <span
                        key={j}
                        className="px-2 py-0.5 text-xs font-mono rounded bg-[var(--color-bg-alt)] text-[var(--color-muted)] border border-transparent hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] cursor-default transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                {(item.url || item.githubUrl) && (
                  <div className="flex gap-3 pt-1 border-t border-[var(--color-bg-alt)] mt-1">
                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-mono text-[var(--color-accent)] hover:underline"
                      >
                        → demo
                      </a>
                    )}
                    {item.githubUrl && (
                      <a
                        href={item.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-mono text-[var(--color-muted)] hover:text-[var(--color-accent)] hover:underline"
                      >
                        → github
                      </a>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
