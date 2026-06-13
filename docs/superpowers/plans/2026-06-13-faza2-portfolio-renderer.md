# Faza 2 — PortfolioRenderer i bloki MVP — Plan implementacji

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wyrenderować działające portfolio z blokami pobranymi z Payload CMS, z obsługą 3 motywów (cookie > Payload) i responsywnym layoutem mobile-first.

**Architecture:** Server Components + Block Registry. `PortfolioRenderer` pobiera bloki przez Payload Local API (bez HTTP), mapuje `block.type` → komponent przez rejestr, renderuje server-side. Motyw ładowany w `layout.tsx` server-side z Payload, nadpisywalny cookiem odwiedzającego przez `ThemeToggle` (Client Component).

**Tech Stack:** Next.js 15 App Router, Payload CMS 3 Local API, TypeScript, Tailwind CSS 4, shadcn/ui

---

## Mapa plików

```
platform/src/
  types/
    blocks.ts                       ← NOWY: 6 TypeScript interfaces (HeroData…ContactData)
  lib/
    portfolio.ts                    ← NOWY: getPortfolioBySlug(), getBlocksBySlug()
  middleware.ts                     ← MODYFIKACJA: obsługa /dev/[slug] na localhost
  components/
    blocks/
      HeroBlock.tsx                 ← NOWY: Server Component
      AboutBlock.tsx                ← NOWY: Server Component
      ExperienceBlock.tsx           ← NOWY: Server Component
      SkillsBlock.tsx               ← NOWY: Server Component
      EducationBlock.tsx            ← NOWY: Server Component
      ContactBlock.tsx              ← NOWY: Server Component (używa ContactForm)
      registry.ts                   ← NOWY: BLOCK_REGISTRY map
      PortfolioRenderer.tsx         ← NOWY: Server Component, iteruje bloki
    ui/
      ThemeToggle.tsx               ← NOWY: Client Component, cookie + dataset.theme
      ContactForm.tsx               ← NOWY: Client Component, fetch POST /api/contact
  app/
    layout.tsx                      ← MODYFIKACJA: theme server-side z Payload + cookie
    page.tsx                        ← MODYFIKACJA: prod route, czyta x-portfolio-slug
    dev/
      [slug]/
        page.tsx                    ← NOWY: local dev route
```

**Uwaga:** `platform/src/payload/collections/Portfolios.ts` już ma pole `theme` (linie 49-57) — nie wymaga zmian.

---

## Task 1: Typy danych bloków

**Files:**
- Create: `platform/src/types/blocks.ts`

- [ ] **Step 1: Utwórz plik z interfejsami**

```typescript
// platform/src/types/blocks.ts

export interface HeroData {
  title: string;
  subtitle?: string;
  avatarUrl?: string;
  cta?: { label: string; href: string };
}

export interface AboutData {
  bio: string;
  photoUrl?: string;
}

export interface ExperienceData {
  items: Array<{
    company: string;
    role: string;
    startDate: string;
    endDate?: string;
    description?: string;
  }>;
}

export interface SkillsData {
  categories: Array<{
    name: string;
    skills: string[];
  }>;
}

export interface EducationData {
  items: Array<{
    school: string;
    degree: string;
    field: string;
    startYear: number;
    endYear?: number;
  }>;
}

export interface ContactData {
  email?: string;
  phone?: string;
  linkedin?: string;
  github?: string;
  showForm: boolean;
}
```

- [ ] **Step 2: Sprawdź TypeScript**

```bash
cd /home/rspro/Dokumenty/1.CODE/2.Portfolio/platform
npx tsc --noEmit
```

Oczekiwany wynik: brak błędów (brak outputu).

- [ ] **Step 3: Commit**

```bash
git -C /home/rspro/Dokumenty/1.CODE/2.Portfolio add platform/src/types/blocks.ts
git -C /home/rspro/Dokumenty/1.CODE/2.Portfolio commit -m "feat(types): add block data interfaces — HeroData…ContactData (F9.3)"
```

---

## Task 2: Portfolio lib helpers

**Files:**
- Create: `platform/src/lib/portfolio.ts`
- Modify: `platform/src/lib/index.ts`

- [ ] **Step 1: Utwórz `lib/portfolio.ts`**

```typescript
// platform/src/lib/portfolio.ts
import { getPayload } from "payload";
import config from "@payload-config";

export async function getPortfolioBySlug(slug: string) {
  const payload = await getPayload({ config });
  const result = await payload.find({
    collection: "portfolios",
    where: { subdomain: { equals: slug } },
    limit: 1,
  });
  return result.docs[0] ?? null;
}

export async function getBlocksBySlug(slug: string) {
  const portfolio = await getPortfolioBySlug(slug);
  if (!portfolio) return [];

  const payload = await getPayload({ config });
  const result = await payload.find({
    collection: "blocks",
    where: {
      and: [
        { portfolio: { equals: portfolio.id } },
        { visible: { equals: true } },
      ],
    },
    sort: "order",
    limit: 100,
  });
  return result.docs;
}
```

- [ ] **Step 2: Dodaj eksporty do `lib/index.ts`**

Dopisz na końcu `platform/src/lib/index.ts`:

```typescript
export { getPortfolioBySlug, getBlocksBySlug } from "./portfolio";
```

- [ ] **Step 3: Sprawdź TypeScript**

```bash
cd /home/rspro/Dokumenty/1.CODE/2.Portfolio/platform
npx tsc --noEmit
```

Oczekiwany wynik: brak błędów.

- [ ] **Step 4: Commit**

```bash
git -C /home/rspro/Dokumenty/1.CODE/2.Portfolio add platform/src/lib/portfolio.ts platform/src/lib/index.ts
git -C /home/rspro/Dokumenty/1.CODE/2.Portfolio commit -m "feat(lib): add getPortfolioBySlug + getBlocksBySlug helpers (F9.3)"
```

---

## Task 3: Middleware — obsługa `/dev/[slug]` na localhost

**Files:**
- Modify: `platform/src/middleware.ts`

Middleware nie aktywuje subdomeny na `localhost`. Dodajemy obsługę trasy `/dev/[slug]` — ustawia `x-portfolio-slug` tak jak subdomena, żeby `layout.tsx` i `page.tsx` działały identycznie lokalnie.

- [ ] **Step 1: Zaktualizuj middleware**

Zastąp całą zawartość `platform/src/middleware.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";

const PLATFORM_DOMAIN =
  process.env.NEXT_PUBLIC_PLATFORM_DOMAIN || "korp-cbm.com";

const RESERVED = new Set(["www", "admin", "api"]);

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  const host = hostname.split(":")[0];
  const pathname = request.nextUrl.pathname;

  // Local dev: /dev/[slug] → ustaw x-portfolio-slug z URL
  if (host === "localhost" || host === "127.0.0.1") {
    const devMatch = pathname.match(/^\/dev\/([^/]+)/);
    if (devMatch) {
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("x-portfolio-slug", devMatch[1]);
      return NextResponse.next({ request: { headers: requestHeaders } });
    }
    return NextResponse.next();
  }

  // Prod: subdomain routing
  const subdomain = host.endsWith(`.${PLATFORM_DOMAIN}`)
    ? host.slice(0, host.length - PLATFORM_DOMAIN.length - 1)
    : null;

  if (!subdomain || RESERVED.has(subdomain)) {
    return NextResponse.next();
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-portfolio-slug", subdomain);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
```

- [ ] **Step 2: Sprawdź TypeScript**

```bash
cd /home/rspro/Dokumenty/1.CODE/2.Portfolio/platform
npx tsc --noEmit
```

Oczekiwany wynik: brak błędów.

- [ ] **Step 3: Commit**

```bash
git -C /home/rspro/Dokumenty/1.CODE/2.Portfolio add platform/src/middleware.ts
git -C /home/rspro/Dokumenty/1.CODE/2.Portfolio commit -m "feat(middleware): handle /dev/[slug] route for local portfolio preview"
```

---

## Task 4: HeroBlock

**Files:**
- Create: `platform/src/components/blocks/HeroBlock.tsx`

- [ ] **Step 1: Utwórz komponent**

```tsx
// platform/src/components/blocks/HeroBlock.tsx
import type { HeroData } from "@/types/blocks";

interface Props {
  data: unknown;
  portfolioSlug: string;
}

export function HeroBlock({ data }: Props) {
  const d = data as HeroData;
  return (
    <section className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-16 lg:py-24 bg-[var(--color-bg)]">
      {d.avatarUrl && (
        <img
          src={d.avatarUrl}
          alt={d.title}
          className="w-24 h-24 lg:w-32 lg:h-32 rounded-full mb-6 object-cover border-4 border-[var(--color-accent)]"
        />
      )}
      <h1 className="text-4xl lg:text-6xl font-bold text-[var(--color-primary)] mb-4 max-w-3xl">
        {d.title}
      </h1>
      {d.subtitle && (
        <p className="text-lg lg:text-xl text-[var(--color-muted)] mb-8 max-w-2xl">
          {d.subtitle}
        </p>
      )}
      {d.cta && (
        <a
          href={d.cta.href}
          className="inline-block bg-[var(--color-accent)] text-[var(--color-bg)] px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
        >
          {d.cta.label}
        </a>
      )}
    </section>
  );
}
```

- [ ] **Step 2: Sprawdź TypeScript**

```bash
cd /home/rspro/Dokumenty/1.CODE/2.Portfolio/platform && npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git -C /home/rspro/Dokumenty/1.CODE/2.Portfolio add platform/src/components/blocks/HeroBlock.tsx
git -C /home/rspro/Dokumenty/1.CODE/2.Portfolio commit -m "feat(blocks): add HeroBlock component (F9.4)"
```

---

## Task 5: AboutBlock

**Files:**
- Create: `platform/src/components/blocks/AboutBlock.tsx`

- [ ] **Step 1: Utwórz komponent**

```tsx
// platform/src/components/blocks/AboutBlock.tsx
import type { AboutData } from "@/types/blocks";

interface Props {
  data: unknown;
  portfolioSlug: string;
}

export function AboutBlock({ data }: Props) {
  const d = data as AboutData;
  return (
    <section className="py-16 px-4 bg-[var(--color-bg-alt)]">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-10 items-center">
        {d.photoUrl && (
          <img
            src={d.photoUrl}
            alt="Zdjęcie"
            className="w-40 h-40 rounded-full object-cover shrink-0 border-4 border-[var(--color-accent)]"
          />
        )}
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold text-[var(--color-primary)] mb-4">
            O mnie
          </h2>
          <p className="text-[var(--color-text)] leading-relaxed whitespace-pre-line">
            {d.bio}
          </p>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Sprawdź TypeScript**

```bash
cd /home/rspro/Dokumenty/1.CODE/2.Portfolio/platform && npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git -C /home/rspro/Dokumenty/1.CODE/2.Portfolio add platform/src/components/blocks/AboutBlock.tsx
git -C /home/rspro/Dokumenty/1.CODE/2.Portfolio commit -m "feat(blocks): add AboutBlock component (F9.4)"
```

---

## Task 6: ExperienceBlock

**Files:**
- Create: `platform/src/components/blocks/ExperienceBlock.tsx`

- [ ] **Step 1: Utwórz komponent**

```tsx
// platform/src/components/blocks/ExperienceBlock.tsx
import type { ExperienceData } from "@/types/blocks";

interface Props {
  data: unknown;
  portfolioSlug: string;
}

function formatPeriod(startDate: string, endDate?: string): string {
  const fmt = (d: string) => {
    const [y, m] = d.split("-");
    const months = ["sty","lut","mar","kwi","maj","cze","lip","sie","wrz","paź","lis","gru"];
    return m ? `${months[parseInt(m) - 1]} ${y}` : y;
  };
  return `${fmt(startDate)} — ${endDate ? fmt(endDate) : "obecnie"}`;
}

export function ExperienceBlock({ data }: Props) {
  const d = data as ExperienceData;
  return (
    <section className="py-16 px-4 bg-[var(--color-bg)]">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl lg:text-3xl font-bold text-[var(--color-primary)] mb-8">
          Doświadczenie
        </h2>
        <ol className="relative border-l border-[var(--color-bg-alt)] space-y-10">
          {d.items.map((item, i) => (
            <li key={i} className="ml-6">
              <span className="absolute -left-2 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-accent)]" />
              <p className="text-sm text-[var(--color-muted)] mb-1">
                {formatPeriod(item.startDate, item.endDate)}
              </p>
              <h3 className="text-lg font-semibold text-[var(--color-primary)]">
                {item.role}
              </h3>
              <p className="text-[var(--color-secondary)] font-medium mb-2">
                {item.company}
              </p>
              {item.description && (
                <p className="text-[var(--color-text)] leading-relaxed">
                  {item.description}
                </p>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Sprawdź TypeScript**

```bash
cd /home/rspro/Dokumenty/1.CODE/2.Portfolio/platform && npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git -C /home/rspro/Dokumenty/1.CODE/2.Portfolio add platform/src/components/blocks/ExperienceBlock.tsx
git -C /home/rspro/Dokumenty/1.CODE/2.Portfolio commit -m "feat(blocks): add ExperienceBlock component (F9.4)"
```

---

## Task 7: SkillsBlock

**Files:**
- Create: `platform/src/components/blocks/SkillsBlock.tsx`

- [ ] **Step 1: Utwórz komponent**

```tsx
// platform/src/components/blocks/SkillsBlock.tsx
import type { SkillsData } from "@/types/blocks";

interface Props {
  data: unknown;
  portfolioSlug: string;
}

export function SkillsBlock({ data }: Props) {
  const d = data as SkillsData;
  return (
    <section className="py-16 px-4 bg-[var(--color-bg-alt)]">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl lg:text-3xl font-bold text-[var(--color-primary)] mb-8">
          Umiejętności
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {d.categories.map((cat, i) => (
            <div key={i}>
              <h3 className="text-sm font-semibold uppercase tracking-widest text-[var(--color-muted)] mb-3">
                {cat.name}
              </h3>
              <div className="flex flex-wrap gap-2">
                {cat.skills.map((skill, j) => (
                  <span
                    key={j}
                    className="px-3 py-1 text-sm rounded-full bg-[var(--color-bg)] text-[var(--color-text)] border border-[var(--color-bg-alt)]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Sprawdź TypeScript**

```bash
cd /home/rspro/Dokumenty/1.CODE/2.Portfolio/platform && npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git -C /home/rspro/Dokumenty/1.CODE/2.Portfolio add platform/src/components/blocks/SkillsBlock.tsx
git -C /home/rspro/Dokumenty/1.CODE/2.Portfolio commit -m "feat(blocks): add SkillsBlock component (F9.4)"
```

---

## Task 8: EducationBlock

**Files:**
- Create: `platform/src/components/blocks/EducationBlock.tsx`

- [ ] **Step 1: Utwórz komponent**

```tsx
// platform/src/components/blocks/EducationBlock.tsx
import type { EducationData } from "@/types/blocks";

interface Props {
  data: unknown;
  portfolioSlug: string;
}

export function EducationBlock({ data }: Props) {
  const d = data as EducationData;
  return (
    <section className="py-16 px-4 bg-[var(--color-bg)]">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl lg:text-3xl font-bold text-[var(--color-primary)] mb-8">
          Wykształcenie
        </h2>
        <div className="space-y-6">
          {d.items.map((item, i) => (
            <div
              key={i}
              className="p-6 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-bg-alt)]"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
                <h3 className="text-lg font-semibold text-[var(--color-primary)]">
                  {item.school}
                </h3>
                <span className="text-sm text-[var(--color-muted)]">
                  {item.startYear}–{item.endYear ?? "obecnie"}
                </span>
              </div>
              <p className="text-[var(--color-text)]">
                {item.degree} · {item.field}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Sprawdź TypeScript**

```bash
cd /home/rspro/Dokumenty/1.CODE/2.Portfolio/platform && npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git -C /home/rspro/Dokumenty/1.CODE/2.Portfolio add platform/src/components/blocks/EducationBlock.tsx
git -C /home/rspro/Dokumenty/1.CODE/2.Portfolio commit -m "feat(blocks): add EducationBlock component (F9.4)"
```

---

## Task 9: ContactBlock + ContactForm

**Files:**
- Create: `platform/src/components/ui/ContactForm.tsx`
- Create: `platform/src/components/blocks/ContactBlock.tsx`

`ContactForm` to Client Component z fetch do `POST /api/contact` (B8.5). `ContactBlock` to Server Component który renderuje dane kontaktowe i opcjonalnie formularz.

- [ ] **Step 1: Utwórz `ContactForm.tsx` (Client Component)**

```tsx
// platform/src/components/ui/ContactForm.tsx
"use client";

import { useState } from "react";

interface Props {
  portfolioSlug: string;
}

export function ContactForm({ portfolioSlug }: Props) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const form = e.currentTarget;
    const body = {
      portfolioSlug,
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setStatus("success");
      } else {
        const json = await res.json().catch(() => ({}));
        setErrorMsg(
          json.error === "rate_limit_exceeded"
            ? "Zbyt wiele wiadomości. Spróbuj za 15 minut."
            : "Błąd wysyłania. Spróbuj ponownie."
        );
        setStatus("error");
      }
    } catch {
      setErrorMsg("Błąd połączenia. Spróbuj ponownie.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <p className="text-[var(--color-accent)] font-medium">
        Wiadomość wysłana! Odezwę się wkrótce.
      </p>
    );
  }

  const inputClass =
    "w-full px-4 py-2 rounded-lg bg-[var(--color-bg)] border border-[var(--color-bg-alt)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-lg">
      <input
        name="name"
        required
        minLength={2}
        placeholder="Imię i nazwisko"
        className={inputClass}
      />
      <input
        name="email"
        type="email"
        required
        placeholder="Adres email"
        className={inputClass}
      />
      <textarea
        name="message"
        required
        minLength={10}
        rows={5}
        placeholder="Wiadomość (min. 10 znaków)"
        className={inputClass}
      />
      {status === "error" && (
        <p className="text-red-500 text-sm">{errorMsg}</p>
      )}
      <button
        type="submit"
        disabled={status === "loading"}
        className="px-8 py-3 bg-[var(--color-accent)] text-[var(--color-bg)] font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {status === "loading" ? "Wysyłanie…" : "Wyślij wiadomość"}
      </button>
    </form>
  );
}
```

- [ ] **Step 2: Utwórz `ContactBlock.tsx` (Server Component)**

```tsx
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
```

- [ ] **Step 3: Sprawdź TypeScript**

```bash
cd /home/rspro/Dokumenty/1.CODE/2.Portfolio/platform && npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git -C /home/rspro/Dokumenty/1.CODE/2.Portfolio add platform/src/components/ui/ContactForm.tsx platform/src/components/blocks/ContactBlock.tsx
git -C /home/rspro/Dokumenty/1.CODE/2.Portfolio commit -m "feat(blocks): add ContactBlock + ContactForm client component (F9.4, B8.5)"
```

---

## Task 10: Block Registry + PortfolioRenderer

**Files:**
- Create: `platform/src/components/blocks/registry.ts`
- Create: `platform/src/components/blocks/PortfolioRenderer.tsx`

- [ ] **Step 1: Utwórz `registry.ts`**

```typescript
// platform/src/components/blocks/registry.ts
import { HeroBlock } from "./HeroBlock";
import { AboutBlock } from "./AboutBlock";
import { ExperienceBlock } from "./ExperienceBlock";
import { SkillsBlock } from "./SkillsBlock";
import { EducationBlock } from "./EducationBlock";
import { ContactBlock } from "./ContactBlock";

export const BLOCK_REGISTRY = {
  hero: HeroBlock,
  about: AboutBlock,
  experience: ExperienceBlock,
  skills: SkillsBlock,
  education: EducationBlock,
  contact: ContactBlock,
} as const;

export type RegisteredBlockType = keyof typeof BLOCK_REGISTRY;
```

- [ ] **Step 2: Utwórz `PortfolioRenderer.tsx`**

```tsx
// platform/src/components/blocks/PortfolioRenderer.tsx
import { logger } from "@/lib/logger";
import { BLOCK_REGISTRY, type RegisteredBlockType } from "./registry";

export interface BlockDoc {
  id: string;
  type: string;
  themeOverride?: string | null;
  data: { pl: unknown; en?: unknown };
}

interface Props {
  blocks: BlockDoc[];
  portfolioSlug: string;
}

export function PortfolioRenderer({ blocks, portfolioSlug }: Props) {
  if (blocks.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-[var(--color-muted)]">
          To portfolio nie ma jeszcze żadnych bloków.
        </p>
      </main>
    );
  }

  return (
    <main>
      {blocks.map((block) => {
        const Component = BLOCK_REGISTRY[block.type as RegisteredBlockType];
        if (!Component) {
          logger.warn({ blockType: block.type, portfolioSlug }, "Unknown block type — skipping");
          return null;
        }
        return (
          <div
            key={block.id}
            data-block={block.type}
            {...(block.themeOverride ? { "data-theme": block.themeOverride } : {})}
          >
            <Component data={block.data?.pl ?? {}} portfolioSlug={portfolioSlug} />
          </div>
        );
      })}
    </main>
  );
}
```

- [ ] **Step 3: Sprawdź TypeScript**

```bash
cd /home/rspro/Dokumenty/1.CODE/2.Portfolio/platform && npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git -C /home/rspro/Dokumenty/1.CODE/2.Portfolio add platform/src/components/blocks/registry.ts platform/src/components/blocks/PortfolioRenderer.tsx
git -C /home/rspro/Dokumenty/1.CODE/2.Portfolio commit -m "feat(blocks): add BLOCK_REGISTRY + PortfolioRenderer Server Component (F9.3)"
```

---

## Task 11: System motywów — ThemeToggle + layout.tsx

**Files:**
- Create: `platform/src/components/ui/ThemeToggle.tsx`
- Modify: `platform/src/app/layout.tsx`

- [ ] **Step 1: Utwórz `ThemeToggle.tsx` (Client Component)**

```tsx
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
```

- [ ] **Step 2: Zaktualizuj `layout.tsx` — theme server-side**

Zastąp całą zawartość `platform/src/app/layout.tsx`:

```tsx
// platform/src/app/layout.tsx
import type { Metadata } from "next";
import { headers, cookies } from "next/headers";
import "./globals.css";
import { getPortfolioBySlug } from "@/lib/portfolio";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export const metadata: Metadata = {
  title: {
    template: "%s | PortfolioHub",
    default: "PortfolioHub",
  },
  description: "Multi-user portfolio platform",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const cookieStore = await cookies();

  const slug = headersList.get("x-portfolio-slug");
  const cookieTheme = cookieStore.get("portfolio-theme")?.value;

  let theme = "light";
  if (slug) {
    const portfolio = await getPortfolioBySlug(slug);
    const payloadTheme = (portfolio?.theme as string | undefined) ?? "light";
    theme = cookieTheme ?? payloadTheme;
  }

  return (
    <html
      lang="pl"
      data-theme={slug ? theme : undefined}
      suppressHydrationWarning
    >
      <body>
        {children}
        {slug && <ThemeToggle currentTheme={theme} />}
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Sprawdź TypeScript**

```bash
cd /home/rspro/Dokumenty/1.CODE/2.Portfolio/platform && npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git -C /home/rspro/Dokumenty/1.CODE/2.Portfolio add platform/src/components/ui/ThemeToggle.tsx platform/src/app/layout.tsx
git -C /home/rspro/Dokumenty/1.CODE/2.Portfolio commit -m "feat(theme): ThemeToggle client component + layout.tsx server-side theme (F9.5)"
```

---

## Task 12: Routing — page.tsx (prod) + dev/[slug]/page.tsx

**Files:**
- Modify: `platform/src/app/page.tsx`
- Create: `platform/src/app/dev/[slug]/page.tsx`

- [ ] **Step 1: Zaktualizuj `app/page.tsx` (trasa produkcyjna)**

Zastąp całą zawartość `platform/src/app/page.tsx`:

```tsx
// platform/src/app/page.tsx
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { getPortfolioBySlug, getBlocksBySlug } from "@/lib/portfolio";
import { PortfolioRenderer, type BlockDoc } from "@/components/blocks/PortfolioRenderer";

export default async function PortfolioPage() {
  const slug = (await headers()).get("x-portfolio-slug");

  if (!slug) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-24">
        <h1 className="text-4xl font-bold text-[var(--color-primary)]">PortfolioHub</h1>
        <p className="text-lg text-[var(--color-muted)]">
          Multi-user portfolio platform
        </p>
      </main>
    );
  }

  const [portfolio, blocks] = await Promise.all([
    getPortfolioBySlug(slug),
    getBlocksBySlug(slug),
  ]);

  if (!portfolio) notFound();

  return <PortfolioRenderer blocks={blocks as unknown as BlockDoc[]} portfolioSlug={slug} />;
}
```

- [ ] **Step 2: Utwórz dev route `app/dev/[slug]/page.tsx`**

```tsx
// platform/src/app/dev/[slug]/page.tsx
import { notFound } from "next/navigation";
import { getPortfolioBySlug, getBlocksBySlug } from "@/lib/portfolio";
import { PortfolioRenderer, type BlockDoc } from "@/components/blocks/PortfolioRenderer";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function DevPortfolioPage({ params }: Props) {
  const { slug } = await params;

  const [portfolio, blocks] = await Promise.all([
    getPortfolioBySlug(slug),
    getBlocksBySlug(slug),
  ]);

  if (!portfolio) notFound();

  return <PortfolioRenderer blocks={blocks as unknown as BlockDoc[]} portfolioSlug={slug} />;
}
```

- [ ] **Step 3: Sprawdź TypeScript**

```bash
cd /home/rspro/Dokumenty/1.CODE/2.Portfolio/platform && npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git -C /home/rspro/Dokumenty/1.CODE/2.Portfolio add platform/src/app/page.tsx platform/src/app/dev/
git -C /home/rspro/Dokumenty/1.CODE/2.Portfolio commit -m "feat(routing): portfolio page (prod + dev/[slug] routes) (F9.3)"
```

---

## Task 13: Dane testowe + weryfikacja manualna

**Files:** brak (dane przez Payload Admin UI lub curl)

Celem jest zobaczenie działającego portfolio z blokami w przeglądarce pod `localhost:3000/dev/radek`.

- [ ] **Step 1: Uruchom dev server**

```bash
cd /home/rspro/Dokumenty/1.CODE/2.Portfolio/platform
docker compose -f docker-compose.dev.yml up -d
npm run dev
```

Oczekiwany wynik: `✓ Ready on http://localhost:3000`

- [ ] **Step 2: Zaloguj się do admin i dodaj dane testowe**

Otwórz `http://localhost:3000/admin` w przeglądarce.

**A) Utwórz użytkownika admin** (jeśli nie istnieje):
Formularz first-register wypełni się automatycznie przy pierwszym wejściu.

**B) Utwórz portfolio "radek":**
- Collections → Portfolios → Create
- `subdomain`: `radek`
- `owner`: wybierz użytkownika admina
- `type`: `cv`
- `theme`: `dark`
- `isPublished`: zaznacz
- Save

**C) Dodaj blok Hero:**
- Collections → Blocks → Create
- `portfolio`: wybierz `radek`
- `type`: `hero`
- `order`: `1`
- `visible`: zaznacz
- `data.pl` (JSON):
```json
{
  "title": "Radosław Stawiszyński",
  "subtitle": "Full-stack developer & entrepreneur",
  "cta": { "label": "Napisz do mnie", "href": "#contact" }
}
```
- Save

**D) Dodaj blok About:**
- Collections → Blocks → Create
- `portfolio`: `radek`, `type`: `about`, `order`: `2`, `visible`: zaznacz
- `data.pl`:
```json
{
  "bio": "Tworzę aplikacje webowe od 10 lat. Specjalizuję się w Next.js, TypeScript i architekturze systemów SaaS."
}
```
- Save

**E) Dodaj blok Contact:**
- Collections → Blocks → Create
- `portfolio`: `radek`, `type`: `contact`, `order`: `3`, `visible`: zaznacz
- `data.pl`:
```json
{
  "email": "radoslaw@example.com",
  "github": "https://github.com/radek",
  "showForm": true
}
```
- Save

- [ ] **Step 3: Sprawdź w przeglądarce**

Otwórz `http://localhost:3000/dev/radek`.

Oczekiwany wynik:
- Strona renderuje 3 sekcje: Hero → About → Contact
- Motyw `dark` zaaplikowany (ciemne tło)
- W prawym dolnym rogu 3 przyciski motywu (☀️ 🌙 💻)
- Kliknięcie ☀️ zmienia tło na jasne natychmiastowo (bez przeładowania)
- Formularz kontaktowy widoczny w sekcji Contact

- [ ] **Step 4: Test formularza kontaktowego**

Wypełnij formularz na stronie i wyślij. Oczekiwany wynik: "Wiadomość wysłana!"
(Resend musi być skonfigurowany w `.env.local` — jeśli nie, sprawdź logi serwera w terminalu)

- [ ] **Step 5: Test 404**

Otwórz `http://localhost:3000/dev/nieistniejace`.
Oczekiwany wynik: strona 404 Next.js.

- [ ] **Step 6: Sprawdź responsywność**

W DevTools → Toggle device toolbar:
- `375px` — single column, wszystko czytelne
- `768px` — 2 kolumny w SkillsBlock i About (jeśli jest zdjęcie)
- `1280px` — pełna szerokość

- [ ] **Step 7: Oznacz taski jako done w PLAN.md**

```bash
# W PLAN.md zmień:
# - [ ] **F9.3** → - [x] **F9.3** ... (2026-06-13, Agent: Claude)
# - [ ] **F9.4** → - [x] **F9.4** ... (2026-06-13, Agent: Claude)
# - [ ] **F9.5** → - [x] **F9.5** ... (2026-06-13, Agent: Claude)
# - [ ] **F9.6** → - [x] **F9.6** ... (2026-06-13, Agent: Claude)
```

- [ ] **Step 8: Commit końcowy**

```bash
git -C /home/rspro/Dokumenty/1.CODE/2.Portfolio add PLAN.md
git -C /home/rspro/Dokumenty/1.CODE/2.Portfolio commit -m "docs: mark F9.3 F9.4 F9.5 F9.6 done — PortfolioRenderer + MVP blocks + themes (2026-06-13)"
```
