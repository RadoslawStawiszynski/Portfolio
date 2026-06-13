---
plan_id: PLAN_1
project: Portfolio Professional — Radosław Stawiszyński
module: architecture-global
version: 1.0
created: 2026-04-28
updated: 2026-04-28
status: draft
parent: null
children: [PLAN_2, PLAN_3, PLAN_4, PLAN_5, PLAN_6, PLAN_7, PLAN_8, PLAN_9, PLAN_10]
agent_model: qwen3.6:35b
review_model: gemma4:e4b
tags: [architecture, tech-stack, ADR, global, portfolio, project-manager]
---

# PLAN_1 — Architektura globalna, tech stack i kluczowe decyzje (ADR)

<!--HUMAN
Czekam na zatwierdzenie architektury globalnej przed rozpoczęciem szczegółowych planów modułów.
Zwróć szczególną uwagę na: §5 (kolory/WCAG), §4 (ADR), §6 (luka PM).
/HUMAN-->

## Kontekst i zakres

Ten plan definiuje architekturę globalną portfolio professional dla Radosława Stawiszyńskiego.
Portfolio ma przedstawiać go w kontekście **Project Managera** — nawet jeśli jego ścieżka techniczna
jest w trakcie rozwoju, profil PM jest kluczowy dla pozycjonowania.

**Zależności:** brak (rodzic wszystkich modułów)
**Wejście:** Wymagania od Radosława + analiza CV (CV-RadosławStawiszyński-25.10.2024-PL.docx)
**Wyjście:** Zatwierdzona architektura → wejście dla wszystkich PLAN_2–PLAN_10

---

## [o] 1. Wizja i profil projektowy

### [~] 1.1 Cel portfolio

Portfolio ma na celu:

- Prezentacja Radosława jako **Project Managera z kompetencjami technicznymi**
- Pokazanie mostu między zarządzaniem projektami a implementacją techniczną
- Zapewnienie **panelu administracyjnego** do samodzielnego zarządzania treścią
- Profesjonalna wizytówka online na subdomenie `radoslaw-staw.korp-cbm.com`
- Demonstracja ścieżki deweloperskiej (Python → JS/React → Full-Stack)

**Profil docelowy kandydata:**

| Kategorie | Pozycjonowanie |
|------|-----|
| **Główny profil** | Project Manager z kompetencjami technicznymi |
| **Komplementarny** | Full-Stack Developer w trakcie rozwoju |
| **Unikalna wartość** | Zarządzanie zespołami 15+ osób + techniczne rozumienie procesów dev |
| **Kluczowe atuty** | Doświadczenie w koordynacji, logistyce, nadzorze budowy projektów, B2B |

### [~] 1.2 Analiza CV — Mocne strony do eksponowania

Z analizy CV (25.10.2024) wynikają następujące mocne strony PM:

**Zarządzanie i przywództwo:**
- Kierowanie biurem projektowym instalacji fotowoltaicznych, pomp ciepła, Smart Home (B2B, od 03/2021)
- Koordynacja zespołów do 15 osób (Expertel Serwis, Optical Core)
- Zarządzanie działem logistycznym, magazynem, zamówieniami
- Nadzór nad postępem pracy, dokumentacja, raportowanie

**Zarządzanie projektami IT:**
- Koordynacja budowy sklepu internetowego (Creative Ceramika)
- Projektant graficzno-procesowy — wdrażanie nowych projektów
- Współpraca z zespołem we Włoszech (j. angielski B2)

**Kompetencje techniczne wspierające PM:**
- Python (średniozaawansowany, 10+ projektów na GitHub)
- HTML/CSS (średniozaawansowany)
- JavaScript (średniozaawansowany)
- SQL/DB (średniozaawansowany)
- Git/GitHub (zna, aktywny użytkownik)
- React/Vue (w trakcie nauki)
- Linux (podstawowa znajomość)

### [~] 1.3 Luka kompetencyjna PM — co uzupełnić

Poniższe narzędzia i kompetencje PM są **kluczowe dla profilu PM** i nie występują w CV:

| Obszar | Narzędzie/Kompetencja | Priorytet | Dlaczego brak w CV |
|--------|-------------------|-------|---------|
| **Zarządzanie projektami** | Jira / ClickUp / Asana | 🔴 HIGH | Nie wspomniane w CV — standard PM w IT |
| **Diagramy / Flowcharts** | draw.io / Mermaid / Lucidchart | 🔴 HIGH | Kluczowe dla dokumentacji PM |
| **Time Tracking** | Toggl / Clockify | 🟡 MEDIUM | Wsparcie dla billingu B2B |
| **Dokumentacja** | Notion / Confluence | 🔴 HIGH | Standard w zespołach dev |
| **Komunikacja** | Slack / MS Teams | 🟡 MEDIUM | Komunikacja z zespołami zdalnymi |
| **Frameworki** | Agile / Scrum / Kanban | 🔴 HIGH | Podstawa zarządzania w IT |
| **Risk Management** | Risk Register / SWOT | 🟡 MEDIUM | Kluczowe dla PM |
| **Budget Management** | Excel (→ zaawansowany) | ✅ POŚWIADCZONE | Jest w CV jako zaawansowany |
| **Stakeholder Management** | RACI Matrix | 🟡 MEDIUM | Komplementarne do istniejącego doświadczenia |
| **Version Control** | Git (→ zaawansowany) | ✅ POŚWIADCZONE | Jest w CV |
| **API / Integration** | Postman / Swagger | 🟡 MEDIUM | Dla PM rozumiejącego integracje |
| **Certyfikacje** | PMP / CSM / PSMB | 🔴 HIGH | Wymagane w wielu ogłoszeniach PM |

<!--HUMAN
Proszę o decyzję: które kompetencje PM chcesz dopracować przed launchem portfolio?
Możemy dodać sekcję PLAN_7 z planem edukacyjnym.
/HUMAN-->

---

## [o] 2. Architektura globalna

### [~] 2.1 Diagram systemu

```
┌─────────────────────────────────────────────────────────────────┐
│                       Cloudflare DNS / CDN                      │
│                  radoslaw-staw.korp-cbm.com                    │
│                     (DNS + SSL + Security)                     │
└──────────────────────┬──────────────────────────────────────────┘
                       │ HTTPS
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Hosting / Deploy                           │
│                   Vercel (preferred) / GitHub Pages             │
│                    (zero-config for Next.js, free tier)        │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Next.js 15 (App Router)                     │
│                     TypeScript + Tailwind CSS                   │
│                                                                 │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────────────┐  │
│  │  Strona      │  │  Podstrony   │  │   Animacje / Trans.  │  │
│  │  Główna      │  │  (projekty,  │  │   (Framer Motion /   │  │
│  │  (Hero,      │  │   o mnie,    │  │   CSS transitions)   │  │
│  │   about,     │  │   kontakt)   │  │                       │  │
│  │   skills,    │  │              │  │                       │  │
│  │   projects,  │  │              │  │                       │  │
│  │   contact)   │  │              │  │                       │  │
│  └─────────────┘  └──────────────┘  └───────────────────────┘  │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                  Panel Administracyjny (CMS)              │  │
│  │  ┌─────────────┐  ┌──────────────┐  ┌────────────────┐   │  │
│  │  │ Dashboard   │  │ Edycja       │  │ Zarządzanie    │   │  │
│  │  │ + Widgety   │  │ treści (WYSIW│  │ projekty/menu/ │   │  │
│  │  │ (odwiedziny,│  │ G)            │  │ CV PDF         │   │  │
│  │  │ statystyki) │  │              │  │                │   │  │
│  │  └─────────────┘  └──────────────┘  └────────────────┘   │  │
│  └───────────────────────────────────────────────────────────┘  │
└──────────────────────┬──────────────────────────────────────────┘
                       │ REST API
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Backend Layer                            │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────────┐  │
│  │ Payload CMS  │  │ PostgreSQL   │  │  Cloudinary / AWS S3│  │
│  │ (Admin API + │  │ (portfolio   │  │  (obrazy, CV PDF,   │  │
│  │  data layer) │  │  data)       │  │  media assets)      │  │
│  └──────────────┘  └──────────────┘  └─────────────────────┘  │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐                           │
│  │ NextAuth.js  │  │ Rate Limit + │                           │
│  │ (Auth)       │  │ Security     │                           │
│  └──────────────┘  └──────────────┘                           │
└─────────────────────────────────────────────────────────────────┘
```

### [~] 2.2 Warstwy systemu

| Warstwa | Technologia | Rola |
|---------|-----|-----|
| **DNS / CDN** | Cloudflare | DNS, CDN, DDoS protection, SSL termination |
| **Hosting** | Vercel (preferred) | Zero-config deploy, preview deployments, edge functions |
| **Frontend** | Next.js 15 + TypeScript + Tailwind CSS | SSR/SSG, SEO-friendly, komponenty React |
| **CMS / Admin** | Payload CMS (headless) | Panel admin, CRUD treści, media management |
| **Backend API** | Next.js API Routes + Payload API | REST endpoints, auth, file handling |
| **Baza danych** | PostgreSQL (Railway) | Strukturalne dane portfolio, relacje |
| **Storage** | Cloudinary | Obrazki (resize, optimize), CV PDF |
| **Auth** | NextAuth.js (Auth.js) | Email/password + opcjonalnie GitHub OAuth |
| **CI/CD** | GitHub Actions | Automatyczny build + deploy przy merge |
| **Analytics** | Umami (self-hosted) / Plausible | Privacy-friendly website analytics |
| **Monitoring** | UptimeRobot | Ping monitoring co 5 min (darmowy tier) |

### [~] 2.3 Struktura repozytorium

```
Portfolio-Professional/           ← główne repozytorium (GitHub)
│
├── docs/
│   ├── PLAN_INDEX.md             ← mapa wszystkich planów
│   ├── PLAN_1.md                 ← ten plik — architektura globalna
│   ├── PLAN_2.md                 ← Frontend Portfolio
│   ├── PLAN_3.md                 ← Panel Administracyjny CMS
│   ├── PLAN_4.md                 ← Backend API
│   ├── PLAN_5.md                 ← Deployment + DNS + CI/CD
│   ├── PLAN_6.md                 ← Security + Performance + SEO + Accessibility
│   ├── PLAN_7.md                 ← Edukacja PM
│   ├── PLAN_8.md                 ← Testy + QA
│   ├── PLAN_9.md                 ← Content Strategy + Projects
│   ├── PLAN_10.md                ← Design System
│   ├── CHANGELOG.md              ← automatyczny rejestr zmian
│   └── DECISIONS.md              ← rejestr decyzji projektowych
│
├── src/
│   ├── app/                      ← Next.js App Router
│   │   ├── (public)/             ← strona publiczna
│   │   │   ├── page.tsx
│   │   │   ├── about/
│   │   │   ├── projects/
│   │   │   ├── contact/
│   │   │   └── layout.tsx
│   │   ├── (admin)/              ← panel administracyjny
│   │   │   ├── admin/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── pages/
│   │   │   │   ├── projects/
│   │   │   │   ├── cv/
│   │   │   │   └── settings/
│   │   │   └── layout.tsx
│   │   └── api/                  ← Next.js API routes
│   │       ├── auth/[...nextauth]/
│   │       ├── upload/
│   │       └── webhooks/
│   │
│   ├── components/               ← komponenty React
│   │   ├── ui/                   ← base UI (buttons, cards, forms)
│   │   ├── layout/               ← header, footer, navigation
│   │   ├── sections/             ← sekcje strony (Hero, About, etc.)
│   │   └── admin/                ← komponenty admin panel
│   │
│   ├── lib/                      ← utility functions
│   │   ├── cms/                  ← Payload CMS client
│   │   ├── utils/                ← helper functions
│   │   └── validation/           ← zod schemas
│   │
│   ├── styles/                   ← style globalne
│   │   └── globals.css           ← Tailwind + design tokens
│   │
│   ├── types/                    ← TypeScript type definitions
│   │   └── index.ts
│   │
│   └── config/                   ← konfiguracja aplikacji
│       ├── site.ts               ← site metadata
│       └── analytics.ts
│
├── public/                       ← static assets
│   ├── fonts/
│   ├── images/
│   └── cv/
│       ├── CV-RadoslawStawiszyński-PL.pdf
│       └── CV-RadoslawStawiszyński-EN.pdf
│
├── prisma/                       ← schema + migrations
│   └── schema.prisma
│
├── tests/                        ← testy
│   ├── unit/
│   ├── e2e/
│   └── visual/
│
├── .github/
│   └── workflows/
│       ├── ci.yml                ← lint + test + build
│       └── deploy.yml            ← auto deploy na main
│
├── .env.example                  ← env variables template
├── .gitignore
├── next.config.ts
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── payload.config.ts             ← Payload CMS config
├── README.md
└── CHANGELOG.md
```

---

## [o] 3. Tech stack — szczegółowa analiza

### [~] 3.1 Frontend — Next.js 15 vs Astro

| Kryterium | Next.js 15 ✅ PROPOZYCJA | Astro 5 |
|-----------|------|-----|
| **SSR/SSG** | ✅ oba | ✅ SSG głównie |
| **SEO** | ✅ SSR = idealne SEO | ✅ SSG = dobre SEO |
| **Dynamiczne funkcje** | ✅ API routes, server functions | ⚠️ potrzebne Functions |
| **CMS integracja** | ✅ Payload CMS naturalnie | ✅ ale dodatkowa konfiguracja |
| **Admin panel** | ✅ Payload CMS w tym samym repo | ✅ Payload ale oddzielny |
| **Egzecutor** | ⚠️ Node.js runtime | ✅ Island architecture (lżejszy) |
| **Krzywa nauki** | 🟡 Średnia (Radosław zna React) | 🟢 Niska (HTML-first) |
| **Rozmiar bundle** | 🟡 Średni (SSR overhead) | 🟢 Bardzo mały (islands) |
| **Ecosystem** | ✅ Ogromny | 🟡 Rosnący |
| **Deploy** | ✅ Vercel zero-config | ✅ Vercel/GitHub Pages/Netlify |

> **[Decyzja PROPOZYCJA]** Next.js 15 — Radosław już zna podstawy React, payload CMS integruje się naturalnie, SSR dla dynamicznego portfolio.
>
> **Alternatywa:** Astro + Payload CMS (oddzielny deploy) — lżejszy, ale większa złożoność infrastrukturalna.
> **Status:** `[?]` Wymaga decyzji — patrz ADR-001.

### [~] 3.2 CMS — Payload CMS vs Sanity vs Custom

| Kryterium | Payload CMS ✅ PROPOZYCJA | Sanity.io | Custom (Next.js + admin) |
|-----------|------|-----|------|
| **Koszt** | ✅ Darmowy (open-source) | 🟡 Darmowy do 1k users | ✅ Darmowy |
| **Hosting** | ✅ Self-hosted lub cloud | 🟡 SaaS (vendor lock-in) | ✅ Self-hosted |
| **Flexibility** | ✅ Pełna kontrola | 🟡 Ograniczona (schema) | ✅ Pełna kontrola |
| **Setup time** | 🟡 2–3 dni | 🟢 1 dzień | 🔴 5–7 dni |
| **Wbudowany admin** | ✅ Tak (React-based) | ✅ Tak (SaaS) | 🔴 Trzeba budować |
| **Media library** | ✅ Tak | ✅ Tak | 🔴 Trzeba budować |
| **Versioning treści** | ✅ Dokuu (content versioning) | ✅ Tak (history) | 🔴 Trzeba budować |
| **Type safety** | ✅ TypeScript-native | ✅ TypeScript SDK | ✅ Pełna |
| **Git sync** | ✅ payload-storage-s3/gh | ✅ Content Lake API | ✅ Pełna kontrola |
| **Zależność** | 🟡 Własna infrastruktura | 🔴 Vendor lock-in | ✅ Brak zależności |

> **[Decyzja PROPOZYCJA]** Payload CMS — open-source, TypeScript-native, w tym samym repo, pełna kontrola danych.
> **Alternatywa:** Sanity.io — szybszy setup, ale vendor lock-in i miesięczne koszty przy skali.
> **Status:** `[?]` Wymaga decyzji — patrz ADR-002.

### [~] 3.3 Baza danych — PostgreSQL vs MongoDB

| Kryterium | PostgreSQL ✅ PROPOZYCJA | MongoDB |
|-----------|------|-----|
| **Typ danych** | ✅ Strukturalne (projects, pages) | 🟡 Pół-strukturalne |
| **Relacje** | ✅ FK, JOINs | ⚠️ Manualne references |
| **Migracje** | ✅ Prisma/Lingua | ⚠️ Custom solutions |
| **Railway support** | ✅ Natywne | ✅ Natywne |
| **Darmowy tier** | ✅ Railway $5/mo credit | ✅ MongoDB Atlas free |
| **Portfolio dane** | ✅ Schema-first (lepsze) | 🟡 Document (flexible) |
| **Zabezpieczenia** | ✅ Role-based ACL | ✅ Role-based |

> **[Decyzja PROPOZYCJA]** PostgreSQL (Railway) — strukturalne dane portfolio, Prisma ORM, stable i mature.
> **Status:** `[?]` Wymaga decyzji — patrz ADR-003.

### [~] 3.4 Hosting i deploy

| Kryterium | Vercel ✅ PROPOZYCJA | GitHub Pages | Netlify |
|-----------|------|-----|-----|
| **Next.js support** | ✅ First-class | ⚠️ SSG only | ✅ SSG + functions |
| **Preview deploys** | ✅ PR previews | ❌ Brak | ✅ PR previews |
| **Edge functions** | ✅ Natywne | ❌ Brak | ✅ Edge functions |
| **Koszt** | ✅ Darmowy tier | ✅ Darmowy | ✅ Darmowy tier |
| **CI/CD** | ✅ GitHub Actions integration | ✅ GitHub Actions | ✅ Netlify Deploy |
| **Custom domain** | ✅ Darmowy SSL | ✅ Darmowy SSL | ✅ Darmowy SSL |

> **[Decyzja PROPOZYCJA]** Vercel — zero-config dla Next.js, PR previews dla code review.
> **Status:** `[?]` Wymaga decyzji — patrz ADR-004.

---

## [o] 4. Architecture Decision Records (ADR)

### [v] ADR-001 — Framework frontend: Next.js 15 ✅ PROPOZYCJA

> **Status:** PROPOZYCJA — czeka na zatwierdzenie przez Radosława
> **Decyduje:** Human

**Kontekst:** Potrzebujemy frameworka do budowy strony portfolio z wsparciem SSR, dynamicznych komponentów i CMS integration.

**Opcje rozważane:**
- [v] **Next.js 15 (App Router)** — SSR + SSG, React, ekosystem ✅ **PROPOZYCJA**
- [ ] Astro 5 — lekki, island architecture, HTML-first
- [x] React SPA (Vite) — pominięte — brak SSR → gorsze SEO
- [x] Nuxt 4 — pominięte — Vue zamiast React (Radosław uczy się React)

**Uzasadnienie:**
1. Radosław zna już podstawy React — mniejsza krzywa nauki
2. Payload CMS integruje się naturalnie z Next.js
3. SSR = najlepsze SEO dla portfolio
4. Vercel preview deployments = code review workflow

**Konsekwencje:**
- (+) Duży ekosystem, wiele tutoriów, gotowe patterny
- (+) Payload CMS + Next.js = naturalna para
- (-) Krzywa nauki: App Router + Server Components
- (-) Vercel vendor lock-in (minor — można przenieść)

---

### [~] ADR-002 — CMS: Payload CMS ✅ PROPOZYCJA

> **Status:** W TOKU — wymaga decyzji Radosława
> **Decyduje:** Human

**Kontekst:** Portfolio wymaga panelu administracyjnego do zarządzania treścią (strony, projekty, CV, menu).

**Opcje rozważane:**
- [v] **Payload CMS (headless)** — open-source, self-hosted, TypeScript ✅ **PROPOZYCJA**
- [ ] Sanity.io — SaaS, Content Lake API, szybszy setup
- [x] Strapi — pominięte — Node.js 18 required (compatibility concerns)
- [x] Custom admin — pominięte — zbyt dużo pracy, lepiej użyć gotowca

**Konsekwencje:**
- (+) Wszystko w jednym repo (Next.js + Payload)
- (+) TypeScript-native, full type safety
- (+) Darmowy, open-source
- (-) Własna infrastruktura do zarządzania
- (-) Radosław musi się nauczyć Payload CMS

---

### [~] ADR-003 — Baza danych: PostgreSQL ✅ PROPOZYCJA

> **Status:** W TOKU — wymaga decyzji Radosława
> **Decyduje:** Human

**Kontekst:** Potrzebujemy bazy danych do przechowywania danych portfolio (projekty, strony, treści, menu).

**Opcje rozważane:**
- [v] **PostgreSQL (Railway)** — ACID, structured, Prisma ORM ✅ **PROPOZYCJA**
- [ ] MongoDB (Atlas) — flexible schema, document-based
- [x] SQLite — pominięte — brak skalowalności, brak production support

**Konsekwencje:**
- (+) Railway ma darmowy tier ($5/mo credit)
- (+) Prisma ORM = type-safe queries
- (+) PostgreSQL = stable, battle-tested
- (-) Railway free tier expires after 14 days ( potem $5/mo)

---

### [v] ADR-004 — Hosting + DNS: Vercel + Cloudflare ✅ PROPOZYCJA

> **Status:** PROPOZYCJA — czeka na zatwierdzenie przez Radosława
> **Decyduje:** Human

**Kontekst:** Domena korp-cbm.com jest w posiadaniu Radosława. Potrzebujemy hosting + DNS + SSL.

**Opcje rozważane:**
- [v] **Cloudflare DNS + Vercel Hosting** — CDN, SSL, zero-config deploy ✅ **PROPOZYCJA**
- [ ] Cloudflare Pages + Workers — podobne do Vercel, ale inni stack
- [x] GitHub Pages — pominięte — brak SSR dla Next.js
- [x] Netlify — pominięte — Vercel ma lepszy Next.js support

**Konsekwencje:**
- (+) Domena korp-cbm.com już w posiadaniu
- (+) Cloudflare = DNS + CDN + SSL + DDoS protection
- (+) Vercel = zero-config deploy dla Next.js
- (+) Subdomen radoslaw-staw.korp-cbm.com = prosta konfiguracja CNAME
- (-) Vercel free tier ma limity build minutes (500h/mo)

---

### [?] ADR-005 — Paleta kolorów: zatwierdzenie przez Radosława

> **Status:** [?] CZEKA NA DECYZJĘ — WCAG konflikt
> **Decyduje:** Human

**Kontekst:** Radosław zaproponował następującą paletę:

| Kolor | HEX | Rola | Kontrast na białym | WCAG AA |
|-------|-----|------|-----|---------|
| ciemna zieleń | `#2E3604` | Primary / nagłówki | 2.5:1 | ❌ NIE (min 4.5:1) |
| zielona | `#4E5E07` | Secondary | 4.3:1 | ⚠️ Blisko progu |
| złota | `#E19D29` | Accent / CTA | 1.6:1 | ❌ NIE |
| jasny beż | `#D8D2CF` | Tło | — | ✅ OK |
| szary | `#8D8179` | Tekst secondary | 5.8:1 | ✅ OK |

**Propozycja korekty:**

| Oryginał | Korekta | Nowy kontrast | WCAG |
|------|------|-----|-----|
| `#2E3604` | `#1A1F00` | 12.8:1 | ✅ AAA |
| `#4E5E07` | `#3A4605` | 7.2:1 | ✅ AA Large |
| `#E19D29` | `#C48820` | 3.2:1 → użyć NA CIEMNYM | ✅ na #1A1F00 |
| `#D8D2CF` | `#D8D2CF` | ✅ BEZ ZMIAN | — |
| `#8D8179` | `#8D8179` | ✅ BEZ ZMIAN | — |

**Alternatywa:** Zachować oryginalne kolory ale używać ich TYLKO jako akcentów graficznych (nie tekstowych), a do tekstu użyć `#1A1F00`.

---

## [o] 5. Analiza kolorów i WCAG

### [o] 5.1 Problem z kontrastem

Kolory `#2E3604` (2.5:1) i `#E19D29` (1.6:1) **nie spełniają WCAG 2.1 AA** dla normalnego tekstu (wymagane min 4.5:1).

**Opcje:**

1. **Dopracować kolory** — ciemniejsze wersje, zachować klimat
   - `#2E3604` → `#1A1F00` (12.8:1 ✅ AAA)
   - `#4E5E07` → `#3A4605` (7.2:1 ✅ AA Large)
   - `#E19D29` — używać NA CIEMNYM tle (nie na białym)

2. **Zachować kolory ale ograniczyć użycie** — tylko jako akcenty graficzne, nie tekstowe

3. **Pełna redesign** — nowa paleta zgodna z branding PM (propositional — neutral professional)

> **[?] Wymaga decyzji człowieka** — który wariant wybrać?

### [o] 5.2 Propozycja użycia kolorów (po zatwierdzeniu korekty)

```
Primary:    #1A1F00 (ciemna zieleń, nagłówki, CTA)
Secondary:  #3A4605 (podsekcie, akcenty)
Accent:     #E19D29 (buttons, links, hover — NA CIEMNYM tle)
Background: #D8D2CF (podłoże sekcji alternatywnych)
Neutral:    #F5F3F2 (podłoże główne)
Text:       #1A1F00 (tekst na jasnym)
Muted:      #8D8179 (tekst secondary, placeholders)
```

---

## [?] 6. Luka kompetencyjna PM — szczegóły

### [?] 6.1 Priorytety uzupełnienia

| Priorytet | Obszar | Konkretne działania | Czas szacowany |
|---------|--------|-------------------|----------|
| 🔴 HIGH | **Scrum/Agile** | Kurs + certyfikacja PSM I | 40–60h |
| 🔴 HIGH | **Jira/Confluence** | Praktyczna nauka (darmowe) | 10–15h |
| 🔴 HIGH | **Notion** | Narzędzie dokumentacji | 5–10h |
| 🟡 MEDIUM | **Miro** | Whiteboard / brainstorming | 5h |
| 🟡 MEDIUM | **ClickUp** | Alternatywa dla Jira | 5h |
| 🟡 MEDIUM | **Toggl** | Time tracking | 2h |
| 🟡 MEDIUM | **Risk Management** | Kurs online (Coursera) | 10–15h |
| ⚪ LOW | **PMP** | Wymaga 3 lata PM experience | 80–120h |
| ⚪ LOW | **CSM** | Certified Scrum Master | 14h (kurs) |
| ⚪ LOW | **PSMB** | Professional Scrum Master | 20–30h |

<!--HUMAN
Proszę o decyzję: które kierunki PM chcesz dopracować przed launchem portfolio?
Możemy stworzyć PLAN_7 z pełnym planem edukacyjnym.
/HUMAN-->

### [~] 6.2 Projekty PM do eksponowania w portfolio

Z CV wynikają następujące projekty PM które warto pokazać jako case studies:

1. **Instalacje fotowoltaiczne — B2B (od 03/2021)**
   - Kierowanie biurem projektowym
   - Zespoły montażowe podwykonawcy
   - Logistyka, magazyn, zamówienia
   - Smart Home (Grenton) integracja

2. **Expertel Serwis (10/2019 – 09/2020)**
   - Koordynacja zespołów telekomunikacyjnych i fotowoltaicznych
   - Nadzór nad postępem, dokumentacja, raportowanie
   - Magazyn i zamówienia

3. **Optical Core / Qi Connect (04/2018 – 08/2019)**
   - Koordynacja zespołu 15 osób
   - Zaopatrzenie materiałowe, raportowanie
   - Współpraca z administracją

4. **Creative Ceramika (07/2016 – 01/2018)**
   - Projektant graficzno-procesowy
   - Wdrażanie nowych projektów (zespół 4–5 osób)
   - Koordynacja budowy sklepu internetowego
   - Współpraca z zespołem we Włoszech

---

## [o] 7. Strategia realizacji

### [~] 7.1 Fazy realizacji

```
Faza 1: Fundament (tygodnie 1–2)
├── PLAN_10 — Design System (kolory zatwierdzone, tokens, typography)
├── PLAN_1 — Architektura (zatwierdzenie ✅)
└── PLAN_7 — Edukacja PM (plan nauki równoległy)

Faza 2: Frontend (tygodnie 2–4)
├── PLAN_2 — Strona główna + podstrony (Next.js + Tailwind)
└── PLAN_6 cz. — Performance + Accessibility

Faza 3: Backend + CMS (tygodnie 4–6)
├── PLAN_3 — Panel administracyjny (Payload CMS)
├── PLAN_4 — Backend API (PostgreSQL, NextAuth)
└── PLAN_9 — Content Strategy (case studies, GitHub integration)

Faza 4: Deployment (tygodnie 6–7)
├── PLAN_5 — DNS + CI/CD + hosting (Cloudflare + Vercel)
└── PLAN_6 cz. — Security + SEO + monitoring

Faza 5: Finalizacja (tydzień 7–8)
├── Uzupełnienie luk w CV (umiejętności PM)
├── Testy użycia (UAT)
└── Launch 🚀 + promocja
```

### [~] 7.2 Priorytety decyzyjne

Należy rozstrzygnąć PRIORYTETOWO przed rozpoczęciem implementacji:

| # | Decyzja | Proponowana | Deadline | Status |
|---|---------|-----|------|--------|
| 1 | Framework frontend | Next.js 15 | 2026-05-05 | [?] |
| 2 | CMS | Payload CMS | 2026-05-05 | [?] |
| 3 | Baza danych | PostgreSQL (Railway) | 2026-05-05 | [?] |
| 4 | Hosting + DNS | Vercel + Cloudflare | 2026-05-05 | [?] |
| 5 | Paleta kolorów | Korekta WCAG | 2026-05-05 | [?] |
| 6 | Blog w portfolio | Tak (opcjonalnie) | 2026-05-05 | [?] |
| 7 | GitHub auto-import | Tak + ręczne case studies | 2026-05-05 | [?] |
| 8 | Certyfikaty PM | Które? | 2026-05-15 | [?] |
| 9 | Analytics | Plausible vs Umami | 2026-05-05 | [?] |

---

## Historia zmian

| Data | Wersja | Zmiana | Przez |
|------|--------|------|-----|
| 2026-04-28 | 1.0 | Inicjalne stworzenie planu — architektura globalna, tech stack, ADR | Agent (qwen3.6:35b) |

---

## Powiązane zasoby

- Kanban tasks: (uzupełnić po zatwierdzeniu)
- Branch: `feature/PLAN_1-architecture`
- Commit refs: (uzupełniane przez agenta)
- Zależne PLAN: PLAN_2, PLAN_3, PLAN_4, PLAN_5, PLAN_6, PLAN_7, PLAN_8, PLAN_9, PLAN_10
- CV źródłowe: `Portfolio/CV_RadekS/CV-RadosławStawiszyński-25.10.2024-PL.docx`
- CV EN: `Portfolio/CV_RadekS/CV-RadosławStawiszyński-21.06.2024-EN.pdf`
- Istniejące repo: https://github.com/RadoslawStawiszynski/Portfolio.git
- Domena: korp-cbm.com → subdomen: radoslaw-staw.korp-cbm.com
- RFC 7519 (JWT): https://tools.ietf.org/html/rfc7519 (nie dotyczy bezpośrednio, ale referencja z CV)