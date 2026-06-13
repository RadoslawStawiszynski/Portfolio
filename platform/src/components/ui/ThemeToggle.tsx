// platform/src/components/ui/ThemeToggle.tsx
"use client";

const THEMES = [
  { value: "light", label: "☀️" },
  { value: "dark", label: "🌙" },
  { value: "retro-terminal", label: "💻" },
] as const;

type Theme = (typeof THEMES)[number]["value"];

interface Props {
  currentTheme: string;
}

function setTheme(theme: Theme) {
  document.cookie = `portfolio-theme=${theme}; path=/; max-age=31536000; SameSite=Lax`;
  document.documentElement.dataset.theme = theme;
}

export function ThemeToggle({ currentTheme }: Props) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex gap-1 rounded-full bg-[var(--color-bg-alt)] p-1 shadow-lg border border-[var(--color-bg-alt)]">
      {THEMES.map((t) => (
        <button
          key={t.value}
          onClick={() => setTheme(t.value)}
          title={t.value}
          aria-pressed={currentTheme === t.value}
          className={`w-8 h-8 rounded-full text-sm transition-colors ${
            currentTheme === t.value
              ? "bg-[var(--color-accent)] text-[var(--color-bg)]"
              : "hover:bg-[var(--color-bg)] text-[var(--color-text)]"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
