import type { ContactData } from "@/types/blocks";
import { ContactForm } from "@/components/ui/ContactForm";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

interface Props {
  data: unknown;
  portfolioSlug: string;
}

export function ContactBlock({ data, portfolioSlug }: Props) {
  const d = data as ContactData;
  const hasLinks = d.linkedin || d.github;

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
            {/* Left column — identity links */}
            <div className="flex flex-col gap-4">
              {hasLinks && (
                <div className="flex flex-col gap-3">
                  {d.linkedin && (
                    <a
                      href={d.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-3 px-5 py-3 rounded-lg border border-[var(--color-bg-alt)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors text-sm text-[var(--color-text)] font-mono"
                    >
                      <span className="text-lg">💼</span>
                      <span>LinkedIn</span>
                    </a>
                  )}
                  {d.github && (
                    <a
                      href={d.github}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-3 px-5 py-3 rounded-lg border border-[var(--color-bg-alt)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors text-sm text-[var(--color-text)] font-mono"
                    >
                      <span className="text-lg">💻</span>
                      <span>GitHub</span>
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Right column — contact form */}
            {d.showForm && (
              <div>
                <ContactForm portfolioSlug={portfolioSlug} />
              </div>
            )}
          </div>
        </AnimatedSection>
      </section>

      {/* Stopka */}
      <footer className="py-6 px-4 bg-[var(--color-bg)] border-t border-[var(--color-bg-alt)]">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-[var(--color-muted)]">
          <span>© {new Date().getFullYear()} PortfolioHub</span>
          <span className="text-xs opacity-60">Zbudowano z Next.js i Payload CMS</span>
        </div>
      </footer>
    </>
  );
}
