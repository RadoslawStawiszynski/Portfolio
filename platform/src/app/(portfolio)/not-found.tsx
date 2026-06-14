import { headers } from "next/headers";

const PLATFORM_DOMAIN =
  process.env.NEXT_PUBLIC_PLATFORM_DOMAIN ?? "korp-cbm.com";

export default async function NotFound() {
  const slug = (await headers()).get("x-portfolio-slug");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center bg-[var(--color-bg)]">
      <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-[var(--color-accent)]">
        404
      </p>
      <h1 className="text-5xl font-bold text-[var(--color-primary)] md:text-7xl">
        Nie znaleziono
      </h1>
      <p className="mt-4 max-w-md text-lg text-[var(--color-muted)]">
        {slug
          ? `Portfolio "${slug}" nie istnieje lub nie jest opublikowane.`
          : "Ta strona nie istnieje."}
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        {slug && (
          <a
            href="/"
            className="rounded-full bg-[var(--color-accent)] px-6 py-3 text-sm font-semibold text-[var(--color-bg)] shadow hover:opacity-90 transition-opacity"
          >
            Strona główna
          </a>
        )}
        <a
          href={`https://${PLATFORM_DOMAIN}`}
          className="rounded-full border border-[var(--color-bg-alt)] px-6 py-3 text-sm font-semibold text-[var(--color-text)] hover:bg-[var(--color-bg-alt)] transition-colors"
        >
          PortfolioHub →
        </a>
      </div>
    </main>
  );
}
