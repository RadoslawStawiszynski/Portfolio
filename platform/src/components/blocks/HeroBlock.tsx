"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { HeroData } from "@/types/blocks";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

interface Props {
  data: unknown;
  portfolioSlug: string;
}

export function HeroBlock({ data }: Props) {
  const d = data as HeroData;
  const heroRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const obs = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { threshold: 0.15 }
    );
    obs.observe(hero);
    return () => obs.disconnect();
  }, []);

  return (
    <>
      {/* Sticky identity strip — pojawia się gdy hero znika z widoku */}
      <div
        className={`fixed top-10 left-0 right-0 z-30 transition-all duration-300 bg-[var(--color-bg)]/95 backdrop-blur-md border-b border-[var(--color-bg-alt)] shadow-sm ${
          scrolled
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <div className="max-w-5xl mx-auto px-4 py-2 flex items-center gap-3">
          {d.avatarUrl && (
            <Image
              src={d.avatarUrl}
              alt={d.title}
              width={36}
              height={36}
              className="w-9 h-9 rounded-full object-cover border-2 border-[var(--color-accent)] shrink-0"
            />
          )}
          <div className="min-w-0">
            <p className="text-sm font-bold text-[var(--color-primary)] leading-tight truncate">
              {d.title}
            </p>
            {d.subtitle && (
              <p className="text-xs text-[var(--color-muted)] truncate">{d.subtitle}</p>
            )}
          </div>
        </div>
      </div>

      {/* Pełny hero */}
      <section
        ref={heroRef}
        className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-20 lg:py-32 bg-[var(--color-bg)]"
      >
        {d.avatarUrl && (
          <AnimatedSection delay={0}>
            <Image
              src={d.avatarUrl}
              alt={d.title}
              width={128}
              height={128}
              className="w-28 h-28 lg:w-36 lg:h-36 rounded-full mb-6 object-cover border-4 border-[var(--color-accent)] shadow-lg"
            />
          </AnimatedSection>
        )}
        <AnimatedSection delay={0.1}>
          <h1 className="text-4xl lg:text-6xl font-bold text-[var(--color-primary)] mb-3 max-w-3xl">
            {d.title}
          </h1>
        </AnimatedSection>
        {d.subtitle && (
          <AnimatedSection delay={0.2}>
            <p className="text-lg lg:text-xl text-[var(--color-muted)] mb-10 max-w-2xl">
              {d.subtitle}
            </p>
          </AnimatedSection>
        )}
        {d.cta && (
          <AnimatedSection delay={0.3}>
            <a
              href={d.cta.href}
              className="inline-block bg-[var(--color-accent)] text-[var(--color-bg)] px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity shadow-md"
            >
              {d.cta.label}
            </a>
          </AnimatedSection>
        )}
      </section>
    </>
  );
}
