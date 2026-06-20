"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import type { HeroData } from "@/types/blocks";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

interface Props {
  data: unknown;
  portfolioSlug: string;
}

function useTypewriter(text: string, delay = 600, speed = 38) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    setDisplayed("");
    const start = setTimeout(() => {
      let i = 0;
      const tick = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) clearInterval(tick);
      }, speed);
      return () => clearInterval(tick);
    }, delay);
    return () => clearTimeout(start);
  }, [text, delay, speed]);
  return displayed;
}

export function HeroBlock({ data }: Props) {
  const d = data as HeroData;
  const subtitle = useTypewriter(d.subtitle ?? "", 800, 35);

  return (
    <section
      className="relative scanlines min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-20 lg:py-32 bg-[var(--color-bg)]"
    >
      {d.avatarUrl && (
        <AnimatedSection delay={0} className="relative z-10">
          <Image
            src={d.avatarUrl}
            alt={d.title}
            width={128}
            height={128}
            className="w-28 h-28 lg:w-36 lg:h-36 rounded-full mb-6 object-cover border-4 border-[var(--color-accent)] shadow-lg"
          />
        </AnimatedSection>
      )}
      <AnimatedSection delay={0.1} className="relative z-10">
        <h1 className="text-4xl lg:text-6xl font-bold text-[var(--color-primary)] mb-3 max-w-3xl font-mono">
          {d.title}<span className="cursor-blink">_</span>
        </h1>
      </AnimatedSection>
      {d.subtitle && (
        <div className="relative z-10 mb-10">
          <p className="text-lg lg:text-xl text-[var(--color-muted)] max-w-2xl font-mono min-h-[1.75rem]">
            {subtitle}
            {subtitle.length < (d.subtitle?.length ?? 0) && (
              <span className="cursor-blink">▌</span>
            )}
          </p>
        </div>
      )}
      {d.cta && (
        <AnimatedSection delay={0.3} className="relative z-10">
          <a
            href={d.cta.href}
            className="inline-block bg-[var(--color-accent)] text-[var(--color-bg)] px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity shadow-md font-mono tracking-wide"
          >
            {d.cta.label}
          </a>
        </AnimatedSection>
      )}
    </section>
  );
}
