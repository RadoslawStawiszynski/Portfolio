// platform/src/components/ui/ThemeToggle.tsx
"use client";
import { useState } from "react";

const BASE_THEMES = [
  { value: "light", icon: "☀️", label: "Jasny"  },
  { value: "dark",  icon: "🌙", label: "Ciemny" },
] as const;

const RETRO_THEMES = [
  { value: "retro-terminal", icon: "🖥️",  label: "Terminal"   },
  { value: "synthwave",      icon: "🌃",  label: "Synthwave"  },
  { value: "amber",          icon: "🟡",  label: "Amber"      },
  { value: "cyberpunk",      icon: "⚡",  label: "Cyberpunk"  },
  { value: "teal-coral",     icon: "🪸",  label: "Teal Coral" },
  { value: "earth",          icon: "🌍",  label: "Earth"      },
  { value: "slate-rose",     icon: "🌹",  label: "Slate Rose" },
  { value: "olive-gold",     icon: "🫒",  label: "Olive Gold" },
] as const;

type Theme =
  | (typeof BASE_THEMES)[number]["value"]
  | (typeof RETRO_THEMES)[number]["value"];

function setTheme(theme: Theme) {
  document.cookie = `portfolio-theme=${theme}; path=/; max-age=31536000; SameSite=Lax`;
  document.documentElement.dataset.theme = theme;
}

export function ThemeToggle({ currentTheme }: { currentTheme: string }) {
  const [panelOpen, setPanelOpen] = useState(false);
  const [active, setActive] = useState(currentTheme);

  const isRetro = RETRO_THEMES.some((t) => t.value === active);

  function handleSelect(theme: Theme) {
    setTheme(theme);
    setActive(theme);
    setPanelOpen(false);
  }

  return (
    <div className="flex flex-col items-end gap-2">
      {panelOpen && (
        <div className="grid grid-cols-4 gap-1.5 rounded-xl bg-(--color-bg-alt) p-2 shadow-xl border border-(--color-muted)/30">
          {RETRO_THEMES.map((t) => (
            <button
              key={t.value}
              onClick={() => handleSelect(t.value)}
              title={t.label}
              aria-pressed={active === t.value}
              className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-transform hover:scale-110 ${
                active === t.value
                  ? "bg-(--color-accent)/30 ring-2 ring-(--color-accent)"
                  : "hover:bg-(--color-bg)"
              }`}
            >
              {t.icon}
            </button>
          ))}
        </div>
      )}

      <div className="flex gap-1 rounded-full bg-(--color-bg-alt) p-1 shadow-lg border border-(--color-muted)/20">
        {BASE_THEMES.map((t) => (
          <button
            key={t.value}
            onClick={() => handleSelect(t.value)}
            title={t.label}
            aria-pressed={active === t.value}
            className={`w-8 h-8 rounded-full text-sm transition-colors ${
              active === t.value
                ? "bg-(--color-accent) text-(--color-bg)"
                : "hover:bg-(--color-bg) text-(--color-text)"
            }`}
          >
            {t.icon}
          </button>
        ))}
        <button
          onClick={() => setPanelOpen((o) => !o)}
          title="Motywy retro"
          aria-pressed={isRetro}
          className={`w-8 h-8 rounded-full text-sm transition-colors ${
            isRetro || panelOpen
              ? "bg-(--color-accent) text-(--color-bg)"
              : "hover:bg-(--color-bg) text-(--color-text)"
          }`}
        >
          💻
        </button>
      </div>
    </div>
  );
}
