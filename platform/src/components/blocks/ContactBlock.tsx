// platform/src/components/blocks/ContactBlock.tsx
import type { ContactData } from "@/types/blocks";
import { ContactForm } from "@/components/ui/ContactForm";

interface Props {
  data: unknown;
  portfolioSlug: string;
}

export function ContactBlock({ data, portfolioSlug }: Props) {
  const d = data as ContactData;
  return (
    <section className="py-16 px-4 bg-[var(--color-bg-alt)]">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl lg:text-3xl font-bold text-[var(--color-primary)] mb-8">
          Kontakt
        </h2>
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="space-y-3 shrink-0">
            {d.email && (
              <p className="text-[var(--color-text)]">
                <span className="text-[var(--color-muted)] mr-2">Email:</span>
                <a href={`mailto:${d.email}`} className="text-[var(--color-accent)] hover:underline">
                  {d.email}
                </a>
              </p>
            )}
            {d.phone && (
              <p className="text-[var(--color-text)]">
                <span className="text-[var(--color-muted)] mr-2">Tel:</span>
                <a href={`tel:${d.phone}`} className="hover:underline">
                  {d.phone}
                </a>
              </p>
            )}
            {d.linkedin && (
              <p className="text-[var(--color-text)]">
                <span className="text-[var(--color-muted)] mr-2">LinkedIn:</span>
                <a href={d.linkedin} target="_blank" rel="noreferrer" className="text-[var(--color-accent)] hover:underline">
                  Profil
                </a>
              </p>
            )}
            {d.github && (
              <p className="text-[var(--color-text)]">
                <span className="text-[var(--color-muted)] mr-2">GitHub:</span>
                <a href={d.github} target="_blank" rel="noreferrer" className="text-[var(--color-accent)] hover:underline">
                  Profil
                </a>
              </p>
            )}
          </div>
          {d.showForm && <ContactForm portfolioSlug={portfolioSlug} />}
        </div>
      </div>
    </section>
  );
}
