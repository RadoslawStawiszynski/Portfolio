import Link from "next/link";

const PLATFORM_DOMAIN =
  process.env.NEXT_PUBLIC_PLATFORM_DOMAIN ?? "korp-cbm.com";

const FEATURES = [
  {
    icon: "🧩",
    title: "Blokowa budowa",
    body: "Hero, O mnie, Doświadczenie, Umiejętności, Edukacja, Kontakt — każdy blok edytowalny w panelu admina bez dotykania kodu.",
  },
  {
    icon: "🎨",
    title: "10 motywów",
    body: "Od klasycznego jasnego przez Earth i Synthwave po Retro Terminal. Motywy przełączają się bez przeładowania strony.",
  },
  {
    icon: "🌐",
    title: "Własna domena",
    body: `Subdomeny (*.${PLATFORM_DOMAIN}) lub własna domena przez rekord CNAME — zero konfiguracji po stronie platformy.`,
  },
  {
    icon: "📬",
    title: "Formularz kontaktowy",
    body: "Walidacja Zod, ochrona rate-limit, wysyłka przez Resend. Gotowe do użycia po podaniu adresu email w adminie.",
  },
];

const EXAMPLES = [
  {
    name: "Radosław Stawiszyński",
    role: "Product Manager / Scrum Master",
    slug: "radek",
  },
  {
    name: "Miłosz Gawlik",
    role: "Portfolio IT",
    slug: "milosz",
  },
  {
    name: "Martyna Stawiszyńska",
    role: "Autorka książek",
    slug: "martyna",
  },
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      {/* ── Hero ── */}
      <section className="flex min-h-screen flex-col items-center justify-center px-6 py-24 text-center">
        <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-[var(--color-accent)]">
          Portfolio Platform
        </p>
        <h1 className="text-5xl font-bold leading-tight text-[var(--color-primary)] md:text-7xl">
          Portfolio
          <span className="text-[var(--color-accent)]">Hub</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg text-[var(--color-muted)] md:text-xl">
          Profesjonalne portfolio dla każdego. Własna domena, edytowalne bloki,
          wiele motywów — gotowe w minuty.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <a
            href={`https://radek.${PLATFORM_DOMAIN}`}
            className="rounded-full bg-[var(--color-accent)] px-6 py-3 text-sm font-semibold text-[var(--color-bg)] shadow hover:opacity-90 transition-opacity"
          >
            Zobacz przykład →
          </a>
          <Link
            href="/admin"
            className="rounded-full border border-[var(--color-bg-alt)] px-6 py-3 text-sm font-semibold text-[var(--color-text)] hover:bg-[var(--color-bg-alt)] transition-colors"
          >
            Panel admina
          </Link>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="bg-[var(--color-bg-alt)] px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-[var(--color-primary)]">
            Co oferuje platforma?
          </h2>
          <div className="grid gap-8 sm:grid-cols-2">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl bg-[var(--color-bg)] p-6 shadow-sm"
              >
                <div className="mb-3 text-3xl" aria-hidden="true">
                  {f.icon}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-[var(--color-primary)]">
                  {f.title}
                </h3>
                <p className="text-sm leading-relaxed text-[var(--color-muted)]">
                  {f.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Examples ── */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-[var(--color-primary)]">
            Aktywne portfolio
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {EXAMPLES.map((e) => (
              <a
                key={e.slug}
                href={`https://${e.slug}.${PLATFORM_DOMAIN}`}
                className="group rounded-2xl border border-[var(--color-bg-alt)] p-6 transition-colors hover:border-[var(--color-accent)]"
              >
                <div className="mb-3 h-10 w-10 rounded-full bg-[var(--color-accent)] opacity-70 transition-opacity group-hover:opacity-100" aria-hidden="true" />
                <p className="font-semibold text-[var(--color-primary)]">
                  {e.name}
                </p>
                <p className="mt-1 text-sm text-[var(--color-muted)]">
                  {e.role}
                </p>
                <p className="mt-3 text-sm font-medium text-[var(--color-accent)]">
                  {e.slug}.{PLATFORM_DOMAIN} →
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-[var(--color-bg-alt)] px-6 py-8 text-center text-sm text-[var(--color-muted)]">
        <p>
          PortfolioHub &copy; {new Date().getFullYear()} &mdash;{" "}
          <Link
            href="/admin"
            className="transition-colors hover:text-[var(--color-accent)]"
          >
            Panel admina
          </Link>
        </p>
      </footer>
    </div>
  );
}
