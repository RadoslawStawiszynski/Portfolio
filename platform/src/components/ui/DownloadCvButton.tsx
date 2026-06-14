"use client";

interface Props {
  urlPl?: string;
  urlEn?: string;
  portfolioLang: "pl" | "en" | "pl-en";
}

export function DownloadCvButton({ urlPl, urlEn, portfolioLang }: Props) {
  const url = portfolioLang === "en" && urlEn ? urlEn : (urlPl ?? urlEn);
  if (!url) return null;

  const label = portfolioLang === "en" ? "Download CV" : "Pobierz CV";

  return (
    <a
      href={url}
      download
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-full bg-[var(--color-accent)] text-[var(--color-bg)] px-4 py-2 text-sm font-semibold shadow-lg hover:opacity-90 transition-opacity"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
      {label}
    </a>
  );
}
