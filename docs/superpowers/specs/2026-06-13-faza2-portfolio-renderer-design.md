# Faza 2 — PortfolioRenderer i system bloków MVP

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Wyrenderować działające portfolio z blokami pobranymi z Payload CMS, z obsługą motywów i responsywnym layoutem.

**Architecture:** Server Components + Block Registry. `PortfolioRenderer` pobiera bloki przez Payload Local API (bez HTTP), mapuje `block.type` na komponent przez rejestr, renderuje server-side. Motyw ładowany server-side z Payload, nadpisywalny cookiem odwiedzającego.

**Tech Stack:** Next.js 15 App Router, Payload CMS 3 Local API, TypeScript, Tailwind CSS 4, shadcn/ui

---

## 1. Routing

### Produkcja (subdomain)
- `radek.korp-cbm.com/` → middleware ustawia nagłówek `x-portfolio-slug: radek`
- `app/page.tsx` czyta header przez `headers()` z `next/headers`
- Brak `x-portfolio-slug` → `404` lub landing page platformy

### Local dev (bez subdomeny)
- `localhost:3000/dev/radek` → `app/dev/[slug]/page.tsx`
- Ta sama logika co `app/page.tsx`, slug pochodzi z params zamiast headera
- Trasa wyłącznie do developmentu — można chronić przez `NODE_ENV` check

---

## 2. Przepływ danych

```
Payload CMS (PostgreSQL)
        ↓ getPayload() — Local API
getPortfolioBySlug(slug)        → portfolio (theme, contactEmail, ...)
getBlocksBySlug(slug)           → Block[] posortowane wg order, filtered visible=true
        ↓
layout.tsx                      → czyta motyw (cookie > Payload), ustawia data-theme na <html>
        ↓
PortfolioRenderer               → iteruje bloki, BLOCK_REGISTRY[block.type] → komponent
        ↓
HeroBlock | AboutBlock | ExperienceBlock | SkillsBlock | EducationBlock | ContactBlock
(każdy: Server Component, dostaje data.pl as TypowaneDane)
```

### `lib/portfolio.ts` — dwie funkcje pomocnicze

```typescript
export async function getPortfolioBySlug(slug: string): Promise<Portfolio | null>
export async function getBlocksBySlug(slug: string): Promise<Block[]>
```

Obie używają `getPayload({ config })` i Payload Local API. Sortowanie bloków: `order ASC`. Filtr: `visible: { equals: true }`.

---

## 3. Struktura plików

```
platform/src/
  app/
    page.tsx                        ← prod: czyta x-portfolio-slug z headers()
    layout.tsx                      ← theme server-side: cookie > Payload > "light"
    dev/
      [slug]/
        page.tsx                    ← local dev: slug z params
  components/
    blocks/
      PortfolioRenderer.tsx         ← iteruje bloki, lookup w rejestrze
      registry.ts                   ← BLOCK_REGISTRY: Record<BlockType, ComponentType>
      HeroBlock.tsx
      AboutBlock.tsx
      ExperienceBlock.tsx
      SkillsBlock.tsx
      EducationBlock.tsx
      ContactBlock.tsx
    ui/
      ThemeToggle.tsx               ← "use client", cookie + dataset.theme
  lib/
    portfolio.ts                    ← getPortfolioBySlug, getBlocksBySlug
  types/
    blocks.ts                       ← HeroData, AboutData, ExperienceData, SkillsData, EducationData, ContactData
```

---

## 4. Typy danych bloków

```typescript
// types/blocks.ts

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
    startDate: string;    // format "YYYY-MM"
    endDate?: string;     // brak = "obecnie"
    description?: string;
  }>;
}

export interface SkillsData {
  categories: Array<{
    name: string;         // np. "Frontend", "Backend"
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
  showForm: boolean;      // true = renderuj formularz (POST /api/contact)
}
```

---

## 5. Block Registry

```typescript
// components/blocks/registry.ts
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

Bloki spoza rejestru (np. `gallery`, `projects`) — `PortfolioRenderer` je pomija (loguje warning przez `logger.warn`).

---

## 6. PortfolioRenderer

```typescript
// components/blocks/PortfolioRenderer.tsx
// Server Component

interface Props {
  blocks: Block[];
  portfolioSlug: string;
}

export function PortfolioRenderer({ blocks, portfolioSlug }: Props) {
  return (
    <main>
      {blocks.map((block) => {
        const Component = BLOCK_REGISTRY[block.type as RegisteredBlockType];
        if (!Component) return null;
        return (
          <section key={block.id} data-block={block.type}>
            <Component data={block.data.pl} portfolioSlug={portfolioSlug} />
          </section>
        );
      })}
    </main>
  );
}
```

---

## 7. System motywów

### Pole w Payload (`Portfolios.ts`)
```typescript
{
  name: "theme",
  type: "select",
  defaultValue: "light",
  options: [
    { label: "Light", value: "light" },
    { label: "Dark", value: "dark" },
    { label: "Retro Terminal", value: "retro-terminal" },
  ],
}
```

### Server-side w `layout.tsx`
```typescript
const slug = (await headers()).get("x-portfolio-slug");
const cookieTheme = (await cookies()).get("portfolio-theme")?.value;
const portfolio = slug ? await getPortfolioBySlug(slug) : null;
const theme = cookieTheme ?? portfolio?.theme ?? "light";
// <html data-theme={theme}>
```

Priorytet: **cookie odwiedzającego > Payload default > "light"**

### `ThemeToggle` (Client Component)
- 3 przyciski: Light / Dark / Retro Terminal
- Kliknięcie: `document.cookie = "portfolio-theme=VALUE; path=/; max-age=31536000"` + `document.documentElement.dataset.theme = VALUE`
- Brak router refresh — zmiana natychmiastowa

`globals.css` ma już CSS Custom Properties dla wszystkich 3 motywów — bez zmian.

---

## 8. Responsywność

Mobile-first, Tailwind CSS 4 breakpointy:

| Breakpoint | Zakres | Zastosowanie |
|-----------|--------|--------------|
| domyślny | < 768px | single column, `px-4`, stack pionowy |
| `md:` | 768px–1279px | 2 kolumny gdzie sensowne (skills categories) |
| `lg:` | ≥ 1280px | hero z avatarem obok tekstu, max-width container |

Każdy blok ma własne klasy Tailwind — brak osobnych plików CSS.

---

## 9. Język

MVP: tylko `data.pl`. Pole `data.en` ignorowane. Przełącznik językowy — Faza 3 lub 4.

---

## 10. Obsługa błędów

- Portfolio nie znalezione → `notFound()` (Next.js 404)
- Blok z nieznanym `type` → pominięty + `logger.warn`
- `data.pl` pusty lub null → blok renderuje placeholder ("Brak danych — uzupełnij w panelu admina")
- Błąd Payload → `error.tsx` boundary Next.js (do stworzenia)

---

## 11. Integracja z B8.5

`ContactBlock` z `showForm: true` renderuje formularz który POSTuje do `/api/contact` (już zaimplementowany w B8.5). `portfolioSlug` przekazywany jako props do `ContactBlock` → do ciała requestu.

---

## Poza zakresem tej specyfikacji (Spec 2)

- Animacje Framer Motion (F9.7)
- Cookie consent banner (F9.13)
- OG/OpenGraph meta (F9.10)
- Sitemap (F9.11)
- Formularz kontaktowy frontend (F9.9) — ContactBlock renderuje formularz ale bez pełnego UX (loading state, sukces/błąd) — to Spec 2
