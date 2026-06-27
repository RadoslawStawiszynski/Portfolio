"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { GalleryData } from "@/types/blocks";

interface Props {
  data: unknown;
  portfolioSlug: string;
}

const gridVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.35, ease: "easeOut" as const } },
};

export function GalleryBlock({ data }: Props) {
  const d = data as GalleryData;
  const [lightbox, setLightbox] = useState<number | null>(null);

  if (!d.items?.length) return null;

  const current = lightbox !== null ? d.items[lightbox] : null;

  return (
    <section className="py-16 px-4 bg-[var(--color-bg)]">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl lg:text-3xl font-bold text-[var(--color-primary)] mb-10">
          Galeria
        </h2>

        <motion.div
          variants={gridVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3"
        >
          {d.items.map((item, i) => (
            <motion.button
              key={i}
              variants={itemVariants}
              onClick={() => setLightbox(i)}
              className="relative group aspect-square overflow-hidden rounded-lg bg-[var(--color-bg-alt)] focus-visible:outline-2 focus-visible:outline-[var(--color-primary)] focus-visible:outline-offset-2"
              aria-label={item.alt ?? item.caption ?? `Zdjęcie ${i + 1}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.imageUrl}
                alt={item.alt ?? item.caption ?? ""}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {item.caption && (
                <div className="absolute inset-0 bg-[var(--color-bg)]/70 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-3">
                  <span className="text-xs text-[var(--color-text)] leading-snug line-clamp-3">
                    {item.caption}
                  </span>
                </div>
              )}
            </motion.button>
          ))}
        </motion.div>
      </div>

      {/* lightbox */}
      <AnimatePresence>
        {lightbox !== null && current && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: 0.92 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.92 }}
              className="relative max-w-3xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={current.imageUrl}
                alt={current.alt ?? current.caption ?? ""}
                className="w-full max-h-[80vh] object-contain rounded-lg"
              />
              {current.caption && (
                <p className="text-center text-sm text-white/80 mt-3">{current.caption}</p>
              )}
              <div className="absolute top-2 right-2 flex gap-2">
                {lightbox > 0 && (
                  <button
                    onClick={() => setLightbox(lightbox - 1)}
                    className="w-9 h-9 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors flex items-center justify-center text-lg"
                    aria-label="Poprzednie"
                  >
                    ‹
                  </button>
                )}
                {lightbox < d.items.length - 1 && (
                  <button
                    onClick={() => setLightbox(lightbox + 1)}
                    className="w-9 h-9 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors flex items-center justify-center text-lg"
                    aria-label="Następne"
                  >
                    ›
                  </button>
                )}
                <button
                  onClick={() => setLightbox(null)}
                  className="w-9 h-9 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors flex items-center justify-center text-lg"
                  aria-label="Zamknij"
                >
                  ×
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
