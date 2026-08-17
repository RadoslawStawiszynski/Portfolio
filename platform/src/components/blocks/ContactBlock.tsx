import type { ContactData } from "@/types/blocks";
import { ContactForm } from "@/components/ui/ContactForm";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

interface Props {
  data: unknown;
  portfolioSlug: string;
}

const SOCIAL_LINKS = [
  { key: "linkedin",  label: "LinkedIn",   icon: "💼" },
  { key: "github",    label: "GitHub",     icon: "💻" },
  { key: "facebook",  label: "Facebook",   icon: "📘" },
  { key: "instagram", label: "Instagram",  icon: "📸" },
  { key: "goodreads", label: "Goodreads",  icon: "📚" },
] as const;

export function ContactBlock({ data, portfolioSlug }: Props) {
  const d = data as ContactData;

  const activeLinks = SOCIAL_LINKS.filter(
    ({ key }) => !!d[key as keyof ContactData]
  );

  return (
    <>
      <section className="py-16 px-4 bg-[var(--color-bg-alt)]">
        <AnimatedSection className="max-w-4xl mx-auto">
          <h2
            className="glitch-heading text-2xl lg:text-3xl font-bold text-[var(--color-primary)] mb-3"
            data-text="Kontakt"
          >
            Kontakt
          </h2>
          <p className="text-[var(--color-muted)] mb-10">
            Masz pytanie lub propozycję współpracy? Napisz — odpiszę wkrótce.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Left column — social links */}
            {activeLinks.length > 0 && (
              <div className="flex flex-col gap-3">
                {activeLinks.map(({ key, label, icon }) => (
                  <a
                    key={key}
                    href={d[key as keyof ContactData] as string}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 px-5 py-3 rounded-lg border border-[var(--color-bg-alt)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors text-sm text-[var(--color-text)] font-mono"
                  >
                    <span className="text-lg">{icon}</span>
                    <span>{label}</span>
                  </a>
                ))}
              </div>
            )}

            {/* Right column — contact form */}
            {d.showForm && (
              <div>
                <ContactForm portfolioSlug={portfolioSlug} />
              </div>
            )}
          </div>
        </AnimatedSection>
      </section>

      <footer className="py-6 px-4 bg-[var(--color-bg)] border-t border-[var(--color-bg-alt)]">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-[var(--color-muted)]">
          <span>© {new Date().getFullYear()} PortfolioHub</span>
          <span className="text-xs opacity-60">Zbudowano z Next.js i Payload CMS</span>
        </div>
      </footer>
    </>
  );
}
