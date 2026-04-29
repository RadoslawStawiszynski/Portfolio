---
plan_id: PLAN_2
project: Portfolio Professional — Radosław Stawiszyński
module: frontend-portfolio
version: 1.0
created: 2026-04-28
updated: 2026-04-28
status: active
parent: PLAN_1
children: []
agent_model: qwen3.6:35b
review_model: gemma4:e4b
tags: [frontend, nextjs, react, tailwind, portfolio]
---

# PLAN_2 — Frontend Portfolio

<!--HUMAN
Decyzja zatwierdzona: Next.js 15 (App Router) + React + Tailwind CSS
"Lubie REACTA" — Radosław preferuje React ecosystem
/HUMAN-->

## Kontekst i zakres

Ten plan szczegółowo opisuje frontend portfolio professional dla Radosława Stawiszyńskiego.
Portfolio jest pozycjonowane jako **Project Manager z kompetencjami technicznymi** — każdy komponent,
sekcja i animacja musi to odzwierciedlać.

**Zależności:** PLAN_1 §2 (architektura globalna), PLAN_10 §1 (design system tokens), PLAN_4 §1 (backend API)
**Wejście:** Zatwierdzony tech stack (Next.js 15), design tokens z PLAN_10, struktura danych z PLAN_4
**Wyjście:** SSR/SSG strony, komponenty React, style Tailwind, animacje, responsywność

---

## [o] 1. Architektura frontend

### [~] 1.1 Stack technologiczny

| Element | Technologia | Wersja | Dlaczego |
|-----|---------|---|------|---|
| **Framework** | Next.js | 15 (App Router) | SSR/SSG, Vercel zero-config, ecosystem |
| **Język** | TypeScript | 5.x | Type safety, autocompletion, refactoring |
| **Style** | Tailwind CSS | 4.x | Utility-first, design tokens, dark mode |
| **UI Library** | Radix UI + Headless UI | latest | Accessibility, keyboard navigation, unstyled |
| **Animacje** | Framer Motion | 11.x | Production-ready, spring physics, gesture |
| **Icons** | Lucide React | latest | Lightweight, SVG-based, tree-shakeable |
| **Forms** | React Hook Form + Zod | latest | Validation, type-safe, no re-renders |
| **Data fetching** | Server Components + Server Actions | next/app | SSR, streaming, zero client JS |
| **Fonts** | Next.js Font Optimization | next | Auto self-hosting, no layout shift |
| **Linting** | ESLint + Prettier | latest | Code consistency |

### [~] 1.2 Struktura plików (Next.js App Router)

```
src/
├── app/
│   ├── (public)/                    ← Routing group — strona publiczna
│   │   ├── layout.tsx               ← Shared layout (header, footer)
│   │   ├── page.tsx                 ← Strona główna — Hero
│   │   ├── about/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx            ← O mnie
│   │   ├── projects/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx            ← Lista projektów
│   │   │   └── [slug]/
│   │   │       └── page.tsx        ← Szczegóły projektu (case study)
│   │   ├── contact/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx            ← Formularz kontaktowy
│   │   └── blog/                    ← (opcjonalnie, patrz DECISION)
│   │       ├── layout.tsx
│   │       └── [slug]/
│   │           └── page.tsx
│   │
│   ├── (admin)/                     ← Routing group — panel admin
│   │   ├── layout.tsx
│   │   └── admin/
│   │       ├── layout.tsx
│   │       ├── page.tsx             ← Dashboard
│   │       ├── pages/               ← Zarządzanie podstronami
│   │       ├── projects/            ← Zarządzanie projektami
│   │       ├── cv/                  ← Upload CV PDF
│   │       ├── menu/                ← Edycja nawigacji
│   │       └── settings/            ← Ustawienia
│   │
│   ├── api/                         ← Next.js API Routes
│   │   ├── auth/[...nextauth]/
│   │   │   └── route.ts            ← NextAuth handler
│   │   ├── upload/
│   │   │   └── route.ts            ← File upload handler
│   │   └── webhooks/
│   │       └── github/
│   │           └── route.ts        ← GitHub webhook
│   │
│   ├── globals.css                  ← Global styles + Tailwind imports
│   ├── favicon.ico
│   └── manifest.json               ← PWA manifest (opcjonalnie)
│
├── components/
│   ├── ui/                          ← Base UI components (szablonowe)
│   │   ├── button/
│   │   │   ├── Button.tsx           ← Primary, secondary, ghost variants
│   │   │   └── index.ts
│   │   ├── card/
│   │   │   ├── Card.tsx
│   │   │   └── index.ts
│   │   ├── input/
│   │   ├── modal/
│   │   ├── navigation/
│   │   ├── section/
│   │   └── index.ts                ← Barrel export
│   │
│   ├── layout/                      ← Layout komponenty
│   │   ├── Header/
│   │   │   ├── Header.tsx           ← Sticky header z nawigacją
│   │   │   ├── Nav.tsx              ← Menu (desktop + mobile hamburger)
│   │   │   ├── MobileMenu.tsx       ← Slide-in mobile menu
│   │   │   └── index.ts
│   │   ├── Footer/
│   │   │   ├── Footer.tsx           ← Links, social, copyright
│   │   │   └── index.ts
│   │   ├── Breadcrumb/
│   │   └── index.ts
│   │
│   ├── sections/                    ← Sekcje strony głównej
│   │   ├── Hero/
│   │   │   ├── Hero.tsx             ← Animated hero z PM positioning
│   │   │   ├── ParticleBackground.tsx ← Subtle animated particles
│   │   │   └── index.ts
│   │   ├── About/
│   │   │   ├── About.tsx            ← O mnie z timeline
│   │   │   ├── PMtimeline.tsx       ← Timeline PM doświadczenia
│   │   │   └── index.ts
│   │   ├── Skills/
│   │   │   ├── Skills.tsx           ← Skills z categoriami i progress
│   │   │   ├── SkillCategory.tsx    ← Kategoria (PM, Tech, Soft)
│   │   │   └── index.ts
│   │   ├── Projects/
│   │   │   ├── Projects.tsx         ← Grid projektów z filtrami
│   │   │   ├── ProjectCard.tsx      ← Karta projektu
│   │   │   ├── ProjectFilter.tsx    ← Filtrowanie (PM, Dev, Design)
│   │   │   └── index.ts
│   │   ├── Contact/
│   │   │   ├── Contact.tsx          ← Formularz kontaktowy
│   │   │   ├── ContactForm.tsx      ← Form z validation
│   │   │   └── index.ts
│   │   └── index.ts
│   │
│   └── admin/                       ← Admin panel komponenty
│       ├── DashboardWidget.tsx
│       ├── RichTextEditor.tsx
│       ├── ProjectForm.tsx
│       ├── CvUploader.tsx
│       └── index.ts
│
├── lib/                             ← Utility
│   ├── cms/
│   │   ├── payload.ts              ← Payload CMS client
│   │   └── content-types.ts        ← TypeScript interfaces
│   ├── utils/
│   │   ├── cn.ts                   ← Tailwind class merging
│   │   ├── date.ts                 ← Date formatting
│   │   └── seo.ts                  ← SEO helper functions
│   └── validation/
│       ├── contactSchema.ts        ← Zod schema for contact form
│       └── projectSchema.ts        ← Zod schema for project CRUD
│
├── hooks/                           ← Custom React hooks
│   ├── useIntersectionObserver.ts  ← Intersection observer
│   ├── useLocalStorage.ts          ← Local storage with SSR fallback
│   ├── useMediaQuery.ts            ← Media queries in React
│   └── useScrollDirection.ts       ← Scroll direction (header hide/show)
│
├── styles/
│   └── design-tokens.css           ← CSS custom properties (design tokens)
│
├── types/                           ← TypeScript types
│   ├── project.ts                  ← Project, Page, Skill types
│   ├── navigation.ts               ← Nav item type
│   └── index.ts
│
└── config/                          ← App configuration
    ├── site.ts                     ← Site metadata
    ├── navigation.ts               ← Nav structure
    └── analytics.ts                ← Analytics config
```

### [~] 1.3 Routing struktura

| URL | Strona | Component | Fetching |
|-----|-----|--------|------|
| `/` | Strona główna (Hero + overview) | Hero, About snippet, Skills snippet, Projects snippet, Contact snippet | Server Component + data from CMS |
| `/about` | O mnie | About page z PM timeline | Server Component |
| `/projects` | Lista projektów | Projects grid z filtrami | Server Component + CMS data |
| `/projects/[slug]` | Szczegóły projektu (case study) | Project detail z tech stack, rolą, wynikami | Server Component + CMS data |
| `/contact` | Formularz kontaktowy | Contact form z info o Radosławie | Client Component + Server Action |
| `/admin` | Dashboard admin | Dashboard z widgetami | SSR + auth guarded |
| `/admin/pages` | Zarządzanie podstronami | CRUD pages | SSR + auth guarded |
| `/admin/projects` | Zarządzanie projektami | CRUD projects | SSR + auth guarded |
| `/admin/cv` | Upload CV | CV PDF upload | SSR + auth guarded |
| `/admin/menu` | Edycja menu | Drag-drop menu edit | SSR + auth guarded |
| `/admin/settings` | Ustawienia | Site settings | SSR + auth guarded |

---

## [o] 2. Strona główna — szczegółowy opis

### [v] 2.1 Hero section ✅ PROPOZYCJA ZATWIERDZONA

> **Status:** Sekcja zatwierdzona w PLAN_1 jako profil PM

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│   [Animated particles background]                        │
│                                                          │
│   Hi, I'm Radosław                                       │
│   Project Manager with Technical Depth                   │
│                                                          │
│   I lead technical teams, bridge the gap between          │
│   business goals and engineering.                         │
│   Currently building my own portfolio.                   │
│                                                          │
│   [View My Projects] [Download CV] [Contact Me]         │
│                                                          │
│   [Tech Stack Icons — subtle]                            │
│   Python  TypeScript  React  SQL  Git  PM Tools         │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**Specyfikacja komponentu `Hero`:**

| Element | Szczegóły |
|-----|--------|
| **Tło** | Subtle particle animation (canvas, max 30 particles, low opacity) |
| **Nagłówek** | "Hi, I'm Radosław" — `text-5xl md:text-7xl font-bold` — primary color |
| **Podtytuł** | "Project Manager with Technical Depth" — `text-xl md:text-2xl` — secondary |
| **Opis** | 2–3 zdania o PM profile — `text-lg` — muted text color |
| **CTA Buttons** | 3 przyciski: "View My Projects" (primary), "Download CV" (secondary), "Contact Me" (outline) |
| **Tech Stack Icons** | 6 ikon technologii — minimal, inline — nie jako primary focus |
| **Scroll indicator** | Subtle bouncing arrow na dole sekcji |
| **Animacja** | Fade-in + slide-up dla tekstu (staggered), particles loop |

### [~] 2.2 About snippet (strona główna)

```
┌──────────────────────────────────────────────────────────┐
│  About — quick overview                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │ 🎯 PM Lead   │  │ ⚙️ Tech      │  │ 📊 Results   │   │
│  │ 5+ years     │  │ Python+TS    │  │ 15+ people   │   │
│  │ managing     │  │ Full-stack   │  │ teams led    │   │
│  │              │  │ dev journey  │  │ PV projects  │   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
│                                                          │
│  [Read More About Me →]                                 │
└──────────────────────────────────────────────────────────┘
```

### [~] 2.3 Skills snippet (strona główna)

```
┌──────────────────────────────────────────────────────────┐
│  Skills — categorized                                    │
│  ┌─────────────────────┐  ┌─────────────────────┐       │
│  │ 📋 Project Mgmt     │  │ 💻 Technical        │       │
│  │ Agile/Scrum/Kanban  │  │ Python ★★★★☆       │       │
│  │ Jira/Confluence     │  │ TypeScript ★★★☆☆   │       │
│  │ Risk/Budget Mgmt    │  │ React ★★☆☆☆ (in    │       │
│  │                     │  │  progress)          │       │
│  └─────────────────────┘  │ SQL/DB ★★★☆☆       │       │
│  ┌─────────────────────┐  │ Git/GitHub ★★★☆☆   │       │
│  │ 🤝 Soft Skills      │  │ HTML/CSS ★★★☆☆     │       │
│  │ Leadership          │  └─────────────────────┘       │
│  │ Communication       │                                │
│  │ Team Coordination   │  [View All Skills →]           │
│  └─────────────────────┘                                │
└──────────────────────────────────────────────────────────┘
```

### [~] 2.4 Projects snippet (strona główna)

```
┌──────────────────────────────────────────────────────────┐
│  Featured Projects                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │  PV Office   │  │ Expertel     │  │ Optical Core │   │
│  │  B2B         │  │ Serwis       │  │ Qi Connect   │   │
│  │  [PM] [Log]  │  │ [Coord]      │  │ [Coord]      │   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
│                                                          │
│  [View All Projects →]                                  │
└──────────────────────────────────────────────────────────┘
```

### [~] 2.5 Contact snippet (strona główna)

```
┌──────────────────────────────────────────────────────────┐
│  Let's Work Together                                     │
│  Have a project to manage? I can help.                   │
│  [Contact Me →]                                          │
└──────────────────────────────────────────────────────────┘
```

---

## [o] 3. Podstrony

### [~] 3.1 About page — "O mnie"

```
┌──────────────────────────────────────────────────────────┐
│  About Radosław                                          │
│  ┌─────────────┐                                         │
│  │  [Foto     │   Hi, I'm Radosław Stawiszyński          │
│  │   Radosław] │   Project Manager transitioning into   │
│  │             │   full-stack development.              │
│  │             │                                         │
│  │             │   With 5+ years managing teams and     │
│  │             │   technical projects, I bring a unique  │
│  │             │   perspective...                        │
│  │             │                                         │
│  │             │   [Read Full Profile →]                │
│  └─────────────┘                                         │
└──────────────────────────────────────────────────────────┘
```

**Sekcje podstrony:**

1. **Bio** — 2–3 akapity o PM profilu + ścieżce dev
2. **PM Timeline** — interaktywna timeline (Creative Ceramika → Optical Core → Expertel → CBM B2B)
3. **Tech Journey** — ścieżka nauki programowania (Python → HTML/CSS → JS → React)
4. **Tools I Use** — kategorie narzędzi PM + Tech
5. **Education** — Akademia Humastyczno-Ekonomiczna, studia przerwane, liceum
6. **Languages** — Polski (native), English B2, German A1
7. **Certifications** — sekcja do uzupełnienia (certyfikaty PM)

### [~] 3.2 Projects page — lista projektów

**Filtrowanie:**
- Wszystkie | PM Projects | Dev Projects | Design Projects

**Widok:** Grid 3 kolumny (desktop), 2 (tablet), 1 (mobile)

**Każdy projekt jako karta:**
- Miniatura/zdjęcie
- Tytuł projektu
- Krótki opis (2 linie)
- Tagi (PM, Python, React, etc.)
- Link do szczegółów

### [~] 3.3 Project detail page — case study

**Struktura case study:**

| Sekcja | Treść |
|------|-----|
| **Header** | Tytuł, data, rolа, tech stack |
| **Challenge** | Problem do rozwiązania |
| **My Role** | Co dokładnie robił Radosław |
| **Solution** | Podejście i implementacja |
| **Results** | Wymierniki sukcesu |
| **Lessons Learned** | Co się nauczył |
| **Tech Details** (dla Dev projects) | Szczegóły techniczne, link do GitHub |
| **Photos** (dla PM projects) | Zdjęcia z realizacji |

### [~] 3.4 Contact page

| Element | Szczegóły |
|------|--------|
| **Formularz** | Imię, email, temat, treść wiadomości |
| **Validation** | Zod schema + real-time feedback |
| **Wysyłanie** | Server Action (Next.js) |
| **Informacje kontaktowe** | email, telefon, LinkedIn (do uzupełnienia) |
| **Download CV** | Linki do PL i EN wersji PDF |

---

## [?] 4. Animacje i interakcje

### [o] 4.1 Animacje globalne

| Animacja | Kiedy | Jak długo | Easing |
|------|----|------|---|--|
| **Page transitions** | Przy nawigacji między podstronami | 300ms | ease-out |
| **Hero fade-in** | Przy ładowaniu strony | 600ms staggered | ease-in-out |
| **Scroll reveal** | Gdy elementy wchodzą w viewport | 400ms | ease-out |
| **Card hover** | Najedź na kartę projektu | 200ms | ease-out |
| **Button press** | Kliknięcie przycisku | 150ms | spring |
| **Mobile menu** | Otwieranie/zamykanie | 350ms | ease-in-out |
| **Skill bar animation** | Animacja progress bar skills | 800ms | ease-out |

### [?] 4.2 Poziom animacji

> [?] Czy animacje mają być subtelne czy bardziej wyraziste?

- [ ] **Subtelne** — barely noticeable, professional, clean
- [ ] **Balanced** (PROPOZYCJA) — widoczne ale nie abstrakcyjne
- [ ] **Expressive** — wyraźne, dynamiczne, więcej motion

**Uzasadnienie:** Jako PM portfolio powinen być **professional** ale nie nudny. Animacje pokazują że rozumiem UX — ale nie jestem "designerem".

---

## [o] 5. Responsywność i dark mode

### [~] 5.1 Breakpoints

| Breakpoint | Szerokość | Urządzenie |
|------|------|-------|
| **sm** | 640px | Large phone |
| **md** | 768px | Tablet |
| **lg** | 1024px | Small laptop |
| **xl** | 1280px | Desktop |
| **2xl** | 1536px | Large desktop |

### [~] 5.2 Responsive strategia

- **Mobile-first** — base styles dla mobile, potem `md:`, `lg:` augment
- **Touch targets** — min 44×44px na mobile
- **Font sizing** — `text-sm` na mobile → `text-lg` na desktop
- **Grid columns** — 1 (mobile) → 2 (tablet) → 3 (desktop)
- **Navigation** — hamburger menu na mobile, full nav na desktop
- **Hero** — tekst większy, bardziej wyrazisty na desktop

### [~] 5.3 Dark mode

- **Toggle** — switch w headerze (ikona słońce/księżyc)
- **Storage** — `localStorage` z fallback na system preference
- **Colors** — wszystkie kolory mają light + dark variant w Tailwind config
- **Images** — niektóre grafiki mogą mieć dark variant (SVG)
- **Preference** — `prefers-color-scheme` jako default

---

## [~] 6. Implementacja

### [~] 6.1 Struktura projektu (poza root src/)

```
Portfolio-Professional/
│
├── next.config.ts                  ← Next.js config
├── tailwind.config.ts              ← Tailwind config + design tokens
├── tsconfig.json                   ← TypeScript config
├── package.json
├── postcss.config.mjs
│
├── src/
│   ├── app/                       ← Next.js App Router (jak wyżej §1.2)
│   ├── components/                ← Components (jak wyżej §1.2)
│   ├── lib/                       ← Lib (jak wyżej §1.2)
│   ├── hooks/                     ← Custom hooks (jak wyżej §1.2)
│   ├── styles/                    ← Styles (jak wyżej §1.2)
│   ├── types/                     ← Types (jak wyżej §1.2)
│   └── config/                    ← Config (jak wyżej §1.2)
│
├── public/
│   ├── images/
│   │   ├── hero/
│   │   │   └── bg-particles.png   ← Particle bg texture (opcjonalnie)
│   │   ├── about/
│   │   │   └── radoslav-photo.jpg ← Foto Radosława (do uzupełnienia)
│   │   ├── projects/
│   │   │   ├── pv-office.jpg
│   │   │   ├── expertel.jpg
│   │   │   └── creative-ceramika.jpg
│   │   └── icons/
│   │       ├── favicon.svg
│   │       └── social/
│   ├── cv/
│   │   ├── CV-RadoslawStawiszyński-PL.pdf
│   │   └── CV-RadoslawStawiszyński-EN.pdf
│   └── fonts/                     ← Custom fonts (Next.js auto-served)
│
├── tests/
│   ├── unit/
│   ├── e2e/
│   └── visual/
│
├── .env.example
├── .gitignore
├── README.md
└── CHANGELOG.md
```

### [~] 6.2 Tailwind config — design tokens

```typescript
// tailwind.config.ts
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "hsl(var(--color-primary))",   // #1A1F00 (korekta WCAG)
          light: "hsl(var(--color-primary-light))",
          dark: "hsl(var(--color-primary-dark))",
        },
        secondary: {
          DEFAULT: "hsl(var(--color-secondary))", // #3A4605 (korekta WCAG)
          light: "hsl(var(--color-secondary-light))",
        },
        accent: {
          DEFAULT: "hsl(var(--color-accent))",    // #E19D29 (używana na ciemnym)
          hover: "hsl(var(--color-accent-hover))",
        },
        background: {
          DEFAULT: "hsl(var(--color-bg))",        // #F5F3F2
          secondary: "hsl(var(--color-bg-secondary))", // #D8D2CF
        },
        text: {
          primary: "hsl(var(--color-text-primary))", // #1A1F00
          secondary: "hsl(var(--color-text-secondary))", // #8D8179
        },
      },
      fontFamily: {
        heading: ["var(--font-heading)", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      spacing: {
        "section": "clamp(4rem, 8vw, 8rem)",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
        "bounce-slow": "bounce 3s infinite",
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("tailwindcss-animate")],
};
```

### [o] 6.3 Font proposal

| Użycie | Font | Why |
|------|-----|---|
| **Headings** | Inter (700, 800) | Professional, clean, PM-appropriate |
| **Body** | Inter (400, 500) | Readability, system font fallback |
| **Code/Tech** | Fira Code (400) | For tech stack sections |
| **Accent/Quote** | Playfair Display (700) | For hero quote (optional) |

> [?] Czy Inter jest OK jako główny font? Alternatywy: DM Sans, Source Sans 3, Lato

---

## [?] 7. Obszary nierozstrzygnięte

### [?] 7.1 Blog — tak, nie, czy potem?
- [?] Blog w portfolio — tak, nie, czy po launchu?
- Deadline: 2026-05-05

### [?] 7.2 Poziom animacji
- [?] Subtelne / Balanced / Expressive?
- Deadline: 2026-05-05

### [?] 7.3 Font
- [?] Inter OK jako główny? Alternatywy?
- Deadline: 2026-05-05

### [?] 7.4 Zdjęcie profilowe
- [?] Czy użyć zdjęcia z CV (IMG_9882.JPEG) czy nowe?
- Deadline: 2026-05-05

### [?] 7.5 Social links
- [?] LinkedIn, GitHub, inne?
- Deadline: 2026-05-05

---

## Historia zmian

| Data | Wersja | Zmiana | Przez |
|------|--------|--|-----|
| 2026-04-28 | 1.0 | Inicjalne stworzenie planu — Frontend Portfolio | Agent (qwen3.6:35b) |

---

## Powiązane zasoby

- Kanban tasks: (uzupełnić)
- Branch: `feature/PLAN_2-frontend`
- Commit refs: (uzupełniane przez agenta)
- Zależne PLAN: PLAN_1 (architektura), PLAN_10 (design system), PLAN_4 (backend API)
- Framework: Next.js 15 ✅ ZATWIERDZONY przez Radosława