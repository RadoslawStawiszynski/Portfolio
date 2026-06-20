import type { ContactData } from "@/types/blocks";
import { ContactForm } from "@/components/ui/ContactForm";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

interface Props {
  data: unknown;
  portfolioSlug: string;
}

export function ContactBlock({ data, portfolioSlug }: Props) {
  const d = data as ContactData;
  const hasLinks = d.phone || d.linkedin || d.github;

  return (
    <>
      <section className="py-16 px-4 bg-[var(--color-bg-alt)]">
        <AnimatedSection className="max-w-2xl mx-auto">
          <h2 className="text-2xl lg:text-3xl font-bold text-[var(--color-primary)] mb-3">
            Kontakt
          </h2>
          <p className="text-[var(--color-muted)] mb-8">
            Masz pytanie lub propozycję współpracy? Napisz — odpiszę wkrótce.
          </p>

          {hasLinks && (
            <div className="flex flex-wrap gap-4 mb-8">
              {d.phone && (
                <a
                  href={`tel:${d.phone}`}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--color-bg-alt)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors text-sm text-[var(--color-text)]"
                >
                  <span>📞</span> {d.phone}
                </a>
              )}
              {d.linkedin && (
                <a
                  href={d.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--color-bg-alt)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors text-sm text-[var(--color-text)]"
                >
                  <span>💼</span> LinkedIn
                </a>
              )}
              {d.github && (
                <a
                  href={d.github}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--color-bg-alt)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors text-sm text-[var(--color-text)]"
                >
                  <span>💻</span> GitHub
                </a>
              )}
            </div>
          )}

          {d.showForm && <ContactForm portfolioSlug={portfolioSlug} />}
        </AnimatedSection>
      </section>

      {/* Stopka */}
      <footer className="py-6 px-4 bg-[var(--color-bg)] border-t border-[var(--color-bg-alt)]">
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-[var(--color-muted)]">
          <span>© {new Date().getFullYear()} PortfolioHub</span>
          <span className="text-xs opacity-60">Zbudowano z Next.js i Payload CMS</span>
        </div>
      </footer>
    </>
  );
}
