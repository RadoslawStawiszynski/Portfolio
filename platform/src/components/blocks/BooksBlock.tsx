"use client";
import { motion } from "framer-motion";
import type { BooksData } from "@/types/blocks";

interface Props {
  data: unknown;
  portfolioSlug: string;
}

const gridVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

export function BooksBlock({ data }: Props) {
  const d = data as BooksData;
  if (!d.items?.length) return null;

  return (
    <section className="py-16 px-4 bg-[var(--color-bg-alt)]">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl lg:text-3xl font-bold text-[var(--color-primary)] mb-10">
          Książki
        </h2>

        {/* mobile: horizontal scroll; desktop: grid */}
        <div className="overflow-x-auto pb-4 -mx-4 px-4 md:overflow-visible md:px-0">
          <motion.div
            variants={gridVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="flex gap-5 md:grid md:grid-cols-2 lg:grid-cols-3"
            style={{ minWidth: "max-content" }}
          >
            {d.items.map((book, i) => (
              <motion.div
                key={i}
                variants={cardVariants}
                className="w-52 md:w-auto flex flex-col rounded-xl overflow-hidden border border-[var(--color-muted)]/30 bg-[var(--color-bg)] hover:border-[var(--color-primary)]/60 transition-colors"
              >
                {/* okładka */}
                <div className="aspect-[2/3] bg-[var(--color-bg-alt)] relative overflow-hidden">
                  {book.coverUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={book.coverUrl}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[var(--color-muted)] text-4xl select-none">
                      📖
                    </div>
                  )}
                  {/* badge dostępności */}
                  <span
                    className={`absolute top-2 right-2 text-[0.65rem] font-semibold px-2 py-0.5 rounded-full ${
                      book.isAvailable
                        ? "bg-emerald-900/80 text-emerald-300"
                        : "bg-[var(--color-bg)]/80 text-[var(--color-muted)]"
                    }`}
                  >
                    {book.isAvailable ? "dostępna" : "niedostępna"}
                  </span>
                </div>

                {/* treść karty */}
                <div className="p-4 flex flex-col flex-1 gap-2">
                  <h3 className="font-semibold text-[var(--color-text)] leading-tight line-clamp-2">
                    {book.title}
                  </h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-[var(--color-muted)]">{book.year}</span>
                    {book.genre && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-bg-alt)] text-[var(--color-muted)] border border-[var(--color-muted)]/20">
                        {book.genre}
                      </span>
                    )}
                  </div>
                  {book.description && (
                    <p className="text-sm text-[var(--color-muted)] leading-relaxed line-clamp-3 mt-1">
                      {book.description}
                    </p>
                  )}
                  {book.buyUrl && book.isAvailable && (
                    <a
                      href={book.buyUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-auto pt-3 text-sm font-semibold text-[var(--color-primary)] hover:text-[var(--color-accent)] transition-colors"
                    >
                      Kup →
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
