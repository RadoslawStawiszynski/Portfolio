"use client";

interface Props {
  currentLang: "pl" | "en";
}

export function LangToggle({ currentLang }: Props) {
  function select(lang: "pl" | "en") {
    if (lang === currentLang) return;
    document.cookie = `portfolio-lang=${lang}; path=/; max-age=31536000; SameSite=Lax`;
    window.location.reload();
  }

  return (
    <div className="flex gap-1 rounded-full bg-(--color-bg-alt) p-1 shadow-lg border border-(--color-muted)/20">
      {(["pl", "en"] as const).map((lang) => (
        <button
          key={lang}
          onClick={() => select(lang)}
          aria-pressed={currentLang === lang}
          className={`w-8 h-8 rounded-full text-xs font-bold font-mono uppercase transition-colors ${
            currentLang === lang
              ? "bg-(--color-accent) text-(--color-bg)"
              : "text-(--color-muted) hover:bg-(--color-bg) hover:text-(--color-text)"
          }`}
        >
          {lang}
        </button>
      ))}
    </div>
  );
}
