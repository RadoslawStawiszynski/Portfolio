"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

interface Section {
  id: string;
  label: string;
}

interface Identity {
  name: string;
  subtitle?: string;
  avatarUrl?: string;
}

interface Props {
  sections: Section[];
  identity?: Identity;
}

export function PortfolioNav({ sections, identity }: Props) {
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

  const showIdentity = identity && activeId !== "hero";

  return (
    <nav
      aria-label="Nawigacja portfolio"
      className="fixed top-0 left-0 right-0 z-40 bg-[var(--color-bg)]/80 backdrop-blur-md border-b border-[var(--color-bg-alt)]"
    >
      <div className="flex items-center gap-2 px-4 py-2 max-w-5xl mx-auto">
        {/* Nav links */}
        <ul className="flex items-center gap-1 overflow-x-auto flex-1 [&::-webkit-scrollbar]:hidden">
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

        {/* Identity — appears after scrolling past hero */}
        <div
          className={`flex items-center gap-2 shrink-0 transition-all duration-300 ${
            showIdentity
              ? "opacity-100 translate-x-0"
              : "opacity-0 translate-x-4 pointer-events-none"
          }`}
          aria-hidden={!showIdentity}
        >
          {identity?.avatarUrl && (
            <Image
              src={identity.avatarUrl}
              alt={identity.name}
              width={28}
              height={28}
              className="w-7 h-7 rounded-full object-cover border border-[var(--color-accent)] shrink-0"
            />
          )}
          <div className="hidden sm:block text-right">
            <p className="text-xs font-bold text-[var(--color-primary)] font-mono leading-none">
              {identity?.name}<span className="cursor-blink">_</span>
            </p>
            {identity?.subtitle && (
              <p className="text-xs text-[var(--color-muted)] leading-none mt-0.5 truncate max-w-[140px]">
                {identity.subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
