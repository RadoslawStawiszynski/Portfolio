"use client";
import { useEffect, useState } from "react";

interface Section {
  id: string;
  label: string;
}

interface Props {
  sections: Section[];
}

export function PortfolioNav({ sections }: Props) {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? "");

  // sections is stable — passed from a server component, not re-created on client re-renders
  useEffect(() => {
    const observers = sections.map(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveId(id);
        },
        { threshold: 0.05, rootMargin: "-56px 0px -60% 0px" }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((obs) => obs?.disconnect());
  }, [sections]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  if (sections.length <= 1) return null;

  return (
    <nav
      aria-label="Nawigacja portfolio"
      className="fixed top-0 left-0 right-0 z-40 bg-[var(--color-bg)]/80 backdrop-blur-md border-b border-[var(--color-bg-alt)]"
    >
      <ul className="flex items-center gap-1 overflow-x-auto px-4 py-2 max-w-5xl mx-auto [&::-webkit-scrollbar]:hidden">
        {sections.map(({ id, label }) => (
          <li key={id} className="shrink-0">
            <button
              onClick={() => scrollTo(id)}
              aria-current={activeId === id ? ("location" as const) : undefined}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-[var(--color-accent)] focus-visible:outline-offset-2 ${
                activeId === id
                  ? "text-[var(--color-accent)] border-b-2 border-[var(--color-accent)]"
                  : "text-[var(--color-muted)] hover:text-[var(--color-text)]"
              }`}
            >
              {label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
