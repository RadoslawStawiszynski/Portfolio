// platform/src/components/ui/ThemeToggle.tsx
"use client";
import { useState } from "react";

const THEMES = [
  { value: "light",          bg: "#f5f3f2", primary: "#1a1f00", label: "Jasny"       },
  { value: "dark",           bg: "#1a1f00", primary: "#f5f3f2", label: "Ciemny"      },
  { value: "retro-terminal", bg: "#0a0a0a", primary: "#00ff41", label: "Terminal"    },
  { value: "synthwave",      bg: "#0d0d1a", primary: "#ff79c6", label: "Synthwave"   },
  { value: "amber",          bg: "#0c0900", primary: "#ffb347", label: "Amber"       },
  { value: "cyberpunk",      bg: "#080c10", primary: "#7fffd4", label: "Cyberpunk"   },
  { value: "teal-coral",     bg: "#051214", primary: "#d76144", label: "Teal Coral"  },
  { value: "earth",          bg: "#111a1a", primary: "#ddc173", label: "Earth"       },
  { value: "slate-rose",     bg: "#1a2229", primary: "#d9afa8", label: "Slate Rose"  },
  { value: "olive-gold",     bg: "#131505", primary: "#e7c134", label: "Olive Gold"  },
] as const;

type Theme = (typeof THEMES)[number]["value"];

function setTheme(theme: Theme) {
  document.cookie = `portfolio-theme=${theme}; path=/; max-age=31536000; SameSite=Lax`;
  document.documentElement.dataset.theme = theme;
}

export function ThemeToggle({ currentTheme }: { currentTheme: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
      {open && (
        <div className="grid grid-cols-5 gap-1.5 rounded-xl bg-[var(--color-bg-alt)] p-2 shadow-xl border border-[var(--color-muted)]/30">
          {THEMES.map((t) => (
            <button
              key={t.value}
              onClick={() => { setTheme(t.value); setOpen(false); }}
              title={t.label}
              aria-pressed={currentTheme === t.value}
              className={`relative w-9 h-9 rounded-lg transition-transform hover:scale-110 ${
                currentTheme === t.value
                  ? "ring-2 ring-offset-1 ring-[var(--color-accent)] scale-110"
                  : ""
              }`}
              style={{ background: t.bg }}
            >
              <span
                className="absolute inset-[5px] rounded-md"
                style={{ background: t.primary }}
              />
            </button>
          ))}
        </div>
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Zmień motyw"
        className="w-9 h-9 rounded-full bg-[var(--color-bg-alt)] shadow-lg border border-[var(--color-muted)]/30 flex items-center justify-center text-lg hover:bg-[var(--color-bg)] transition-colors"
      >
        🎨
      </button>
    </div>
  );
}
