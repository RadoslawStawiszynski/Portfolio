"use client";
import { motion } from "framer-motion";
import type { ServicesData } from "@/types/blocks";

interface Props {
  data: unknown;
  portfolioSlug: string;
}

const gridVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

export function ServicesBlock({ data }: Props) {
  const d = data as ServicesData;
  if (!d.items?.length) return null;

  return (
    <section className="py-16 px-4 bg-[var(--color-bg-alt)]">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl lg:text-3xl font-bold text-[var(--color-primary)] mb-10">
          Usługi
        </h2>

        <motion.div
          variants={gridVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {d.items.map((item, i) => (
            <motion.div
              key={i}
              variants={cardVariants}
              className="flex flex-col gap-3 p-6 rounded-xl bg-[var(--color-bg)] border border-[var(--color-muted)]/20 hover:border-[var(--color-primary)]/50 transition-colors"
            >
              {item.icon && (
                <span className="text-3xl" role="img" aria-hidden>
                  {item.icon}
                </span>
              )}
              <h3 className="font-semibold text-[var(--color-text)] text-lg leading-snug">
                {item.name}
              </h3>
              {item.description && (
                <p className="text-sm text-[var(--color-muted)] leading-relaxed flex-1">
                  {item.description}
                </p>
              )}
              {item.price && (
                <span className="mt-auto pt-3 border-t border-[var(--color-bg-alt)] text-sm font-semibold text-[var(--color-accent)]">
                  {item.price}
                </span>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
