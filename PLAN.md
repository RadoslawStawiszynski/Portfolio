# PLAN GŁÓWNY — PortfolioHub Platform

```
Wersja:    1.4
Data:      2026-06-12
Autor:     Radosław Stawiszyński + Claude (Sonnet 4.6)
Status:    ACTIVE — Faza 0 UKOŃCZONA, Faza 1 (Next.js 15 scaffold) w toku
Repo:      https://github.com/RadoslawStawiszynski/Portfolio.git
```

> **Dla agentów AI (Claude Code, Ollama, Gemini CLI, Copilot):**
> Ten plik to główny dokument zarządzania projektem. Przed każdym zadaniem przeczytaj §2 (Decyzje),
> §3 (Struktura repo) i odpowiednią fazę z §20 (Roadmap). Każdy task ma checkbox `- [ ]`.
> Oznaczaj ukończone jako `- [x]` i dodawaj datę. Decyzje z §2 są wiążące — nie zmieniaj ich
> bez konsultacji z człowiekiem.

> **⚠️ ZASADA GIT PUSH — KRYTYCZNA:**
> `git push` na GitHub (`origin main`) WYŁĄCZNIE po:
> 1. Ukończeniu projektu lub konkretnej fazy
> 2. Przejściu wszystkich testów lokalnych
> 3. Wyraźnej zgody Radosława
>
> Commity lokalne są OK na bieżąco. Push = świadoma decyzja człowieka, nie agenta.

---

## SPIS TREŚCI

1. [Wizja i cel projektu](#1-wizja-i-cel-projektu)
2. [Decyzje projektowe (ADR)](#2-decyzje-projektowe-adr) ← **MIEJSCE NA DECYZJE**
3. [Reorganizacja repozytorium](#3-reorganizacja-repozytorium)
4. [Architektura platformy](#4-architektura-platformy)
5. [Tech Stack](#5-tech-stack)
6. [System bloków — serce platformy](#6-system-blokow)
7. [Typy portfolio](#7-typy-portfolio)
8. [Backend API](#8-backend-api)
9. [Frontend publiczny](#9-frontend-publiczny)
10. [Panel administracyjny](#10-panel-administracyjny)
11. [System domen i subdomen](#11-system-domen)
12. [Docker i konteneryzacja](#12-docker)
13. [Hosting i infrastruktura](#13-hosting)
14. [Bezpieczeństwo](#14-bezpieczenstwo)
15. [SEO i wydajność](#15-seo-wydajnosc)
16. [Testy i QA](#16-testy)
17. [Migracja i wdrożenie portfeli](#17-migracja-portfeli)
18. [Side quests — projekty poboczne](#18-side-quests)
19. [AI Workflow — praca z wieloma agentami](#19-ai-workflow)
20. [Roadmap i fazy](#20-roadmap)
21. [Status — co zbudowane / co nie](#21-status)
22. [Backlog — co jeszcze warto zbudować](#22-backlog)

---

## 1. WIZJA I CEL PROJEKTU

### 1.1 Opis platformy

**PortfolioHub** to wielodostępna platforma online, na której każdy użytkownik
może stworzyć swoją unikalną wizytówkę/portfolio w internecie. Każde portfolio
jest w pełni edytowalne przez właściciela przez przeglądarkę — bez wiedzy technicznej.

**Kluczowe założenia:**

- Portfolio to zestaw **bloków/sekcji** — każdy blok jest osobnym elementem
- Typy bloków: O mnie, CV/Doświadczenie, Projekty, Książki, Galeria, Usługi, Kontakt, Blog, i inne
- Każde portfolio może mieć **własną domenę lub subdomenę**
- Różne typy portfolio: CV osobiste, Prezentacja autora, Portfolio firmy, Prezentacja projektu
- Estetyczny, responsywny frontend z systemem motywów (jasny/ciemny + warianty)
- Panel admina: globalny (zarządzanie platformą) + indywidualny (każdy użytkownik swój)

### 1.2 Pierwsze portfolio (launch MVP)

| Portfolio             | Typ                      | Domena docelowa                 | Właściciel |
| --------------------- | ------------------------ | ------------------------------- | ---------- |
| Radosław Stawiszyński | CV + PM Portfolio        | radek.korp-cbm.com lub osobna   | Radosław   |
| Miłosz Gawlik         | CV + IT Portfolio        | milosz.korp-cbm.com lub osobna  | Miłosz     |
| Martyna Stawiszyńska  | Autorka książek          | martyna.korp-cbm.com lub osobna | Martyna    |
| CBM                   | Portfolio firmy + usługi | korp-cbm.com                    | Radosław   |

### 1.3 Zasady projektowe

- **Edytowalność first** — każdy widoczny element ma swój odpowiednik w adminie
- **Block-based** — treść = kolekcja bloków z konfiguracją (kolejność, widoczność, dane)
- **Mobile-first** — projektujemy od 375px, rozszerzamy na desktop
- **WCAG AA** — dostępność to wymóg, nie opcja
- **Docker-native** — każde środowisko (dev/staging/prod) to ten sam kontener
- **AI-friendly** — pliki, struktura i komentarze zrozumiałe dla agentów AI

---

## 2. DECYZJE PROJEKTOWE (ADR)

> **Instrukcja:** Każda otwarta decyzja oznaczona `[?]` czeka na decyzję człowieka.
> Zatwierdzone decyzje mają status `[✓]`. Odrzucone mają `[✗]`.
> Agenci AI nie mogą zmieniać statusu decyzji — tylko ludzie.

---

### ADR-001 — Framework frontend

**Status:** `[✓]` ZATWIERDZONE  
**Opcje:**

- `[A]` **Next.js 15 (App Router) + TypeScript** — SSR/SSG, React, Vercel zero-config ← REKOMENDACJA
- `[B]` Astro 5 + TypeScript — lżejszy, island architecture, HTML-first
- `[C]` Nuxt 4 (Vue 3) — jeśli preferujesz Vue

**Uzasadnienie A:** Radosław zna podstawy React, duży ekosystem, naturalna integracja z Payload CMS,
SSR = najlepsze SEO, preview deployments.  
**Decyzja:** `[A]` Next.js 15 (App Router) + TypeScript  
**Data decyzji:** 2026-05-23

---

### ADR-002 — Backend / CMS

**Status:** `[✓]` ZATWIERDZONE  
**Opcje:**

- `[A]` **Payload CMS 3** — open-source, TypeScript, headless, admin w tym samym repo ← REKOMENDACJA
- `[B]` Strapi 5 — popularny headless CMS, REST/GraphQL, plugin ecosystem
- `[C]` Custom backend (Next.js API Routes + Prisma) — pełna kontrola, więcej pracy

**Uzasadnienie A:** Payload CMS 3 działa natywnie z Next.js 15, generuje TypeScript types automatycznie,
wbudowany panel admina (można go dostosować), open-source, self-hosted.  
**Decyzja:** `[A]` Payload CMS 3  
**Data decyzji:** 2026-05-23

---

### ADR-003 — Baza danych

**Status:** `[✓]` ZATWIERDZONE  
**Opcje:**

- `[A]` **PostgreSQL** — ACID, strukturalne, Prisma ORM, Neon/Supabase free tier ← REKOMENDACJA
- `[B]` MongoDB — elastyczne schematy (document-based), dobry dla block content
- `[C]` SQLite — prosty, bez infrastruktury, tylko dla małej skali

**Uzasadnienie A:** PostgreSQL = stabilny, dojrzały, ACID compliance, świetna integracja z Payload CMS.
Dla platformy wielodostępnej strukturalne relacje są ważne. Neon i Supabase oferują darmowe hosty PostgreSQL.  
**Decyzja:** `[A]` PostgreSQL 16 — hostowany na Neon (free tier) lub Supabase  
**Data decyzji:** 2026-05-23

---

### ADR-004 — Hosting i deployment

**Status:** `[✓]` ZATWIERDZONE  
**Kontekst:** Seohost.pl SH 2 = shared PHP hosting, nie obsługuje Node.js ani Docker.
Next.js wymaga Node.js runtime — shared hosting PHP jest niezgodny.
Docker jest używany **wyłącznie do lokalnego development** (nie produkcja).  
**Opcje:**

- `[A]` VPS (Hetzner CX22 ~6€/mies.) — Docker + Node.js, pełna kontrola
- `[B]` **Vercel (Next.js) + darmowe usługi** — zero-config, darmowe, zero serwera ← WYBRANA
- `[C]` Seohost.pl HOSTING SH 2 — PHP hosting, niezgodny z Next.js

**Stack produkcyjny (Vercel-only, koszt 0 PLN/mies):**
| Serwis | Rola | Free tier |
|--------|------|-----------|
| Vercel | Next.js hosting, SSR, API Routes | 100GB bandwidth |
| Neon lub Supabase | PostgreSQL | 512MB DB free |
| Upstash | Redis (sessions, cache) | 10k req/dzień |
| Cloudflare R2 | Pliki, obrazy, CV PDF | 10GB/mies free |
| Resend | Emaile (zaproszenia) | 3000 maili/mies |
| Cloudflare | DNS + CDN | bezpłatnie |

**Docker = tylko lokalne środowisko dev** (docker-compose.dev.yml).  
**Seohost.pl** — nie jest potrzebny dla tej architektury. Można nie odnawiać.  
**Decyzja:** `[B]` Vercel + Neon + Upstash + Cloudflare R2 + Resend  
**Data decyzji:** 2026-05-23

---

### ADR-005 — Cloudflare

**Status:** `[✓]` ZATWIERDZONE  
**Decyzja:** DNS i CDN przez Cloudflare. Domena korp-cbm.com i wszystkie subdomeny przez Cloudflare.
SSL termination przez Cloudflare (Full Strict mode).  
**Data decyzji:** 2026-05-23

---

### ADR-006 — System motywów (themes)

**Status:** `[✓]` ZATWIERDZONE  
**Opcje:**

- `[A]` **CSS Custom Properties + Tailwind** — elastyczny system tokenów, łatwy switch ← REKOMENDACJA
- `[B]` Wbudowane preset-themes w Payload CMS
- `[C]` Zewnętrzny design system (shadcn/ui, Radix Themes)

**Motywy do zaimplementowania (z ADR-008):**
- `light` — jasny beż + ciemna zieleń (domyślny)
- `dark` — ciemna zieleń + złoto
- `retro-terminal` — czarny CRT + terminal green + amber (patrz ADR-008)

**Decyzja:** `[A]` CSS Custom Properties + Tailwind  
**Data decyzji:** 2026-05-23

---

### ADR-007 — Multi-tenancy (jak obsłużyć wiele portfolio)

**Status:** `[✓]` ZATWIERDZONE  
**Opcje:**

- `[A]` **Subdomain-based** (milosz.korp-cbm.com, radek.korp-cbm.com) — jedno repo, routing po subdomenie ← MVP
- `[B]` Custom domain per portfolio (wymagane DNS CNAME na każdą domenę) ← wersja premium
- `[C]` Path-based (/portfolio/milosz, /portfolio/radek) — prostsze technicznie, słabszy branding

**Decyzja:** `[A → B]` Subdomeny jako MVP, następnie custom domeny jako opcja premium.
Obsługiwane są również zupełnie inne domeny (np. `moje-portfolio.com.pl`) przez CNAME.
Vercel natywnie obsługuje custom domains per deployment.  
**Data decyzji:** 2026-05-23

---

### ADR-008 — Paleta kolorów i motywy

**Status:** `[✓]` ZATWIERDZONE  

**Motyw 1 — `light` (domyślny):**
| Token | HEX | Użycie |
|-------|-----|--------|
| `--color-primary` | `#1A1F00` | nagłówki, główne CTA |
| `--color-secondary` | `#3A4605` | akcenty, linki |
| `--color-accent` | `#E19D29` | highlights |
| `--color-bg` | `#F5F3F2` | główne tło |
| `--color-bg-alt` | `#D8D2CF` | sekcje alternujące |
| `--color-muted` | `#8D8179` | tekst pomocniczy |

**Motyw 2 — `dark`:**
Odwrócona paleta — `--color-bg: #1A1F00`, `--color-text: #F5F3F2`, `--color-accent: #E19D29`

**Motyw 3 — `retro-terminal`:**
| Token | HEX | Użycie |
|-------|-----|--------|
| `--color-primary` | `#00FF41` | terminal green — główne akcenty |
| `--color-secondary` | `#00CC33` | ciemniejszy zielony |
| `--color-accent` | `#FFCC00` | amber — highlights |
| `--color-bg` | `#0A0A0A` | deep black CRT |
| `--color-bg-alt` | `#0F1A0F` | lekko zielony czarny |
| `--color-text` | `#D4E8D4` | soft green text |
| `--color-muted` | `#5A8A5A` | muted terminal |
| `--font-mono` | `"JetBrains Mono"` | monospace font |
Efekty opcjonalne: migający kursor, CSS scanlines, typewriter na hero.

**Decyzja:** Wszystkie 3 motywy zatwierdzone. Każde portfolio może wybrać swój motyw.  
**Data decyzji:** 2026-05-23

---

### ADR-009 — Język platformy

**Status:** `[✓]` ZATWIERDZONE  
**Decyzja:** Platforma wspiera PL i EN. Przełącznik per portfolio. Domyślny język: PL.
Każdy blok ma wersję PL i EN (opcjonalnie).  
**Data decyzji:** 2026-05-23

---

### ADR-010 — Storage mediów (zdjęcia, PDF, pliki)

**Status:** `[✓]` ZATWIERDZONE  
**Kontekst:** Docker nie jest używany na produkcji (ADR-004 [B] = Vercel).
Vercel nie obsługuje lokalnych woluminów plików — potrzebny jest zewnętrzny storage.

**Opcje:**
- `[A]` Cloudflare R2 — S3-compatible, 10GB/mies free, CDN global ← WYBRANA
- `[B]` Cloudinary — optymalizacja obrazów, free tier 25 kredytów/mies
- `[C]` Vercel Blob — natywna integracja z Vercel, free 512MB

**Decyzja:** `[A]` Cloudflare R2 jako główny storage:
- Pliki: `r2://portfoliohub/[portfolio-slug]/images/`, `.../cv/`
- Image optimization: Next.js Image component (built-in WebP/resize) + Cloudflare Image Resizing
- Lokalny sync: pliki pobierane/wgrywane przez Cloudflare R2 API lub wrangler CLI
- Backup: automatyczny snapshot R2 → drugi bucket (opcjonalnie)

**Data decyzji:** 2026-05-23

---

## DIALOG — Otwarte dyskusje projektowe

> Miejsce na pytania, niejasności i decyzje wymagające rozmowy.
> Każdy wątek: `[OPEN]` (do rozstrzygnięcia) lub `[RESOLVED]` (zakończony).
> Agenci AI nie tworzą tu wątków — tylko opisują problem przez `<!-- AGENT_NOTE -->`.

---

### DIALOG-001 — ADR-004: Konflikt hosting vs Next.js `[RESOLVED]`

**Problem:** seohost.pl SH 2 (PHP) nie obsługuje Node.js → niezgodne z Next.js 15.
**Wynik:** Decyzja zmieniona na Vercel + Neon + Cloudflare R2 (koszt 0 PLN/mies).
Docker = wyłącznie lokalne środowisko dev.
**Data:** 2026-05-23

---

### DIALOG-002 — ADR-010: Jak działa storage na Cloudflare R2 `[RESOLVED]`

**Problem:** Brak wiedzy jak obsługiwać pliki bez lokalnego serwera/Docker.
**Wynik:** Cloudflare R2 — S3-compatible object storage, 10GB free.
Upload przez panel admina → API → R2. Lokalny dostęp przez wrangler CLI lub AWS SDK.
Sync lokalny: `wrangler r2 object get/put` lub eksport przez panel Cloudflare.
**Data:** 2026-05-23

---

<!-- Nowe wątki dodawaj tutaj -->

---

## 3. REORGANIZACJA REPOZYTORIUM

> **Stan obecny:** Bałagan w root — pliki HTML, obrazy, foldery Python, duplikaty CV,
> folder `kopia/` z gotowym PHP portfolio Miłosza, folder `PROJECT_MANAGEMENT/` z planami.

### 3.1 Proponowana nowa struktura repozytorium

```
2.Portfolio/                          ← root repo
│
├── PLAN.md                           ← ten plik
├── README.md                         ← zaktualizowany opis platformy
├── .gitignore                        ← do uzupełnienia
│
├── platform/                         ← KOD PLATFORMY (główna aplikacja)
│   ├── src/
│   ├── public/
│   ├── docker-compose.yml
│   ├── Dockerfile
│   ├── package.json
│   ├── next.config.ts
│   └── README.md
│
├── portfolios/                        ← DANE PORTFELI (JSON / migracje)
│   ├── radek-stawiszynski/
│   │   ├── data/                     ← JSON z danymi (import do DB)
│   │   └── assets/                   ← zdjęcia, CV PDF
│   ├── milosz-gawlik/
│   │   ├── data/
│   │   └── assets/
│   ├── martyna-stawiszynska/
│   │   ├── data/
│   │   └── assets/
│   └── cbm-firma/
│       ├── data/
│       └── assets/
│
├── docs/                              ← DOKUMENTACJA
│   ├── PLAN.md                        ← symlink do root PLAN.md
│   ├── DECISIONS.md                   ← rejestr decyzji (osobny plik)
│   ├── CHANGELOG.md
│   ├── adr/                           ← Architecture Decision Records
│   └── api/                           ← dokumentacja API
│
├── PROJECT_MANAGEMENT/                ← ZARZĄDZANIE PROJEKTEM (zostaje)
│   ├── docs/                          ← stare PLAN_1, PLAN_2 (archiwum)
│   ├── checks/
│   ├── skills/
│   └── workflow/
│
├── archive/                           ← ARCHIWUM (stary kod do referencji)
│   ├── old-html-portfolio/            ← stare pliki HTML (index.html, etc.)
│   ├── kopia-milosz-php/              ← kopia/ PHP portfolio Miłosza
│   └── games-html/                    ← 1_key_v1.html, 2_snake_v2.html, etc.
│
├── side-quests/                       ← PROJEKTY POBOCZNE
│   ├── python-programs/               ← prog_python/
│   ├── games/                         ← proste gry HTML
│   └── admin-dashboard-extras/        ← dodatkowe narzędzia admin
│
└── .agents/                           ← KONFIGURACJA AGENTÓW AI
    ├── skills/                        ← skills dla Cline/Claude
    ├── CONTEXT.md                     ← kontekst dla agentów
    └── MEMORY.md                      ← pamięć projektu
```

### 3.2 Zadania reorganizacji

- [x] **P3.1** Utwórz folder `platform/` (2026-05-23)
- [x] **P3.2** Utwórz folder `portfolios/` ze strukturą per-portfolio (2026-05-23)
- [x] **P3.3** Przenieś stare pliki HTML do `archive/old-html-portfolio/` (2026-05-23)
- [x] **P3.4** Przenieś `kopia/` do `archive/kopia-milosz-php/` (2026-05-23)
- [x] **P3.5** Utwórz folder `side-quests/` i przenieś `prog_python/` + gry HTML (2026-05-23)
- [x] **P3.6** Utwórz `.gitignore` (2026-05-23)
- [x] **P3.7** Zaktualizuj README.md (2026-05-23)
- [x] **P3.8** Git remote → SSH, pierwszy push na GitHub (2026-05-23)
- [x] **P3.9** Skopiuj CV Radosława do `portfolios/radek-stawiszynski/assets/cv/` (2026-05-23)
- [x] **P3.10** Skopiuj CV Miłosza + dane JSON do `portfolios/milosz-gawlik/` (2026-05-23)

---

## 4. ARCHITEKTURA PLATFORMY

### 4.1 Diagram systemu

```
┌──────────────────────────────────────────────────────────────────────┐
│                         Cloudflare                                   │
│  korp-cbm.com | *.korp-cbm.com | własne domeny (CNAME)             │
│  DNS + CDN + DDoS + SSL termination                                  │
└───────────┬──────────────────────────────┬───────────────────────────┘
            │ HTTPS                         │ R2 API (media)
            ▼                               ▼
┌───────────────────────┐      ┌────────────────────────┐
│        Vercel         │      │    Cloudflare R2        │
│                       │      │    (object storage)     │
│  ┌─────────────────┐  │      │  portfolios/            │
│  │  Next.js 15     │  │      │    radek/images/        │
│  │  App Router     │  │      │    radek/cv/            │
│  │  + Payload CMS  │  │      │    milosz/images/       │
│  │  (API Routes)   │  │      └────────────────────────┘
│  └────────┬────────┘  │
│           │            │      ┌────────────────────────┐
│  ┌────────▼────────┐  │      │    Neon / Supabase      │
│  │  Edge Middleware│  │      │    PostgreSQL 16         │
│  │  (subdomain     │◄─┼──────│    (portfolios, blocks, │
│  │   routing)      │  │      │     users, media meta)  │
│  └─────────────────┘  │      └────────────────────────┘
│                       │
│  Auto-deploy:         │      ┌────────────────────────┐
│  GitHub → Vercel      │      │    Upstash Redis        │
│  Preview per PR       │      │    (sessions, cache,    │
└───────────────────────┘      │     rate limiting)      │
                               └────────────────────────┘
```

### 4.2 Routing po subdomenach

```
korp-cbm.com                   → redirect do www.korp-cbm.com / landing
www.korp-cbm.com               → CBM portfolio (firma)
radek.korp-cbm.com             → Portfolio Radosława
milosz.korp-cbm.com            → Portfolio Miłosza
martyna.korp-cbm.com           → Portfolio Martyny
admin.korp-cbm.com             → Główny panel admina platformy
[slug].korp-cbm.com            → Nowe portfolio (generyczne)
```

### 4.3 Warstwy aplikacji

| Warstwa           | Rola                           | Technologia                     |
| ----------------- | ------------------------------ | ------------------------------- |
| **Hosting / Proxy** | SSL, routing subdomen, CDN   | Vercel + Cloudflare             |
| **Frontend**        | SSR/SSG, publiczne portfolio | Next.js 15 + TypeScript         |
| **CMS / Admin**     | Edycja treści, zarządzanie   | Payload CMS 3                   |
| **API**             | REST endpoints, auth         | Next.js API Routes + Payload    |
| **Database**        | Dane portfolio, bloki, users | PostgreSQL 16 — Neon/Supabase   |
| **Cache**           | Sesje, rate limiting         | Redis — Upstash serverless      |
| **Storage**         | Obrazy, CV PDF, media        | Cloudflare R2                   |
| **Email**           | Zaproszenia, kontakt         | Resend                          |
| **DNS / CDN**       | Domain routing, SSL          | Cloudflare                      |

---

## 5. TECH STACK

### 5.1 Stack główny (wszystkie ADR zatwierdzone)

```
Frontend:     Next.js 15 (App Router) + TypeScript 5
Styling:      Tailwind CSS 4 + CSS Custom Properties (motywy: light, dark, retro-terminal)
UI Base:      shadcn/ui + Radix UI (accessibility)
Animacje:     Framer Motion 11
Icons:        Lucide React
Forms:        React Hook Form + Zod
CMS/Admin:    Payload CMS 3
Database:     PostgreSQL 16 — Neon lub Supabase (free tier)
Cache:        Redis — Upstash serverless (free tier)
Auth:         Payload CMS auth (JWT + refresh tokens)
Storage:      Cloudflare R2 (10GB free) — obrazy, CV PDF
Email:        Resend (3000 maili/mies free) — zaproszenia, kontakt
Hosting:      Vercel (free tier) — Next.js, SSR, API Routes, custom domains
DNS/CDN:      Cloudflare — korp-cbm.com + subdomeny wildcard
Analytics:    Umami (self-hosted na Vercel lub Railway) lub Plausible cloud
Monitoring:   UptimeRobot (ping)
Containers:   Docker + Docker Compose — TYLKO lokalne środowisko dev
CI/CD:        GitHub Actions → Vercel auto-deploy
```

### 5.2 Wersje do zanotowania

```json
{
  "node": ">=20.x LTS",
  "next": "15.x",
  "typescript": "5.x",
  "tailwindcss": "4.x",
  "payload": "3.x",
  "react": "19.x",
  "postgres": "16.x",
  "redis": "7.x",
  "docker": ">=26.x",
  "docker-compose": ">=2.x"
}
```

---

## 6. SYSTEM BLOKÓW

> Serce platformy. Każde portfolio = nagłówek + lista bloków w określonej kolejności.
> Każdy blok ma typ, dane (JSON), widoczność, kolejność i motyw.

### 6.1 Dostępne typy bloków

| ID             | Nazwa          | Opis                                          | MVP? |
| -------------- | -------------- | --------------------------------------------- | ---- |
| `hero`         | Hero / Baner   | Zdjęcie, imię, tytuł, tagline, CTA buttons    | ✅   |
| `about`        | O mnie         | Paragraf tekstu, zdjęcie opcjonalne           | ✅   |
| `experience`   | Doświadczenie  | Timeline CRUD (rola, firma, daty, opis)       | ✅   |
| `skills`       | Umiejętności   | Tagi z kategoriami, progress bars opcjonalnie | ✅   |
| `education`    | Edukacja       | Lista szkół/kursów                            | ✅   |
| `contact`      | Kontakt        | Formularz + dane kontaktowe + social links    | ✅   |
| `projects`     | Projekty       | Grid kart projektów z filtrowaniem            | ✅   |
| `books`        | Książki        | Okładki + opisy + linki do zakupu             | ✅   |
| `services`     | Usługi         | Lista usług firmy z ikonami                   | ✅   |
| `gallery`      | Galeria        | Grid zdjęć                                    | ✅   |
| `testimonials` | Opinie         | Cytaty klientów/współpracowników              | ⚡   |
| `timeline`     | Oś czasu       | Generyczna oś czasu zdarzeń                   | ⚡   |
| `stats`        | Statystyki     | Liczniki (lata doświadczenia, projekty, etc.) | ⚡   |
| `cta`          | CTA            | Wezwanie do działania (baner z przyciskiem)   | ⚡   |
| `faq`          | FAQ            | Accordion z pytaniami i odpowiedziami         | ⚡   |
| `blog-preview` | Ostatnie wpisy | Link do bloga / ostatnie posty                | 🔮   |
| `embed`        | Osadzone media | YouTube, PDF, Calendly, mapy                  | 🔮   |
| `custom-html`  | Custom HTML    | Surowy HTML dla zaawansowanych                | 🔮   |

> ✅ MVP | ⚡ v1.1 | 🔮 przyszłość

### 6.2 Schemat bloku w bazie danych

```typescript
interface Block {
  id: string; // UUID
  portfolioId: string; // FK do portfolio
  type: BlockType; // enum z tabeli wyżej
  order: number; // kolejność wyświetlania
  visible: boolean; // czy widoczny
  themeOverride?: string; // opcjonalny override motywu bloku
  data: {
    // zawartość — per typ bloku
    pl: BlockData; // wersja polska
    en?: BlockData; // wersja angielska (opcjonalna)
  };
  createdAt: Date;
  updatedAt: Date;
}
```

### 6.3 Schemat portfolio

```typescript
interface Portfolio {
  id: string;
  slug: string; // milosz-gawlik (URL slug)
  customDomain?: string; // opcjonalna własna domena
  subdomain: string; // milosz (w *.korp-cbm.com)
  ownerId: string; // FK do User
  type: "cv" | "author" | "company" | "project" | "custom";
  theme: string; // nazwa motywu
  colorScheme: "light" | "dark" | "auto";
  language: "pl" | "en" | "pl-en";
  seoTitle?: string;
  seoDescription?: string;
  seoImage?: string; // OG image
  cvPdfPl?: string; // path do CV PDF (PL)
  cvPdfEn?: string; // path do CV PDF (EN)
  analyticsId?: string; // Umami site ID
  blocks: Block[]; // wszystkie bloki
  isPublished: boolean;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 7. TYPY PORTFOLIO

### 7.1 CV Portfolio (Radosław, Miłosz)

**Domyślne bloki:** hero → about → experience (timeline) → skills → education → contact

**Dane wejściowe:** CV PDF (PL+EN), pliki JSON z `kopia/data/`

**Cechy specyficzne:**

- Dwujęzyczność PL/EN
- Przycisk "Pobierz CV" (pobiera PDF w języku aktywnym; fallback PL jeśli brak EN)
- Sidebar kontaktowy (na desktop)
- Timeline doświadczenia z filtrowaniem (PM / IT / inne)

### 7.2 Portfolio Autorki (Martyna Stawiszyńska)

**Domyślne bloki:** hero → about → books → testimonials → contact

**Cechy specyficzne:**

- Blok `books` z okładkami, opisem, gatunkiem, rokiem, linkami do zakupu
- Galeria zdjęć (eventy, spotkania z czytelnikami)
- Bio literackie (dłuższa forma niż CV)
- Social media autorki (FB, Instagram, Goodreads)
- Formularz kontaktowy (zaproszenia na spotkania, współpraca)

### 7.3 Portfolio Firmy CBM

**Domyślne bloki:** hero → about → services → projects → stats → testimonials → contact

**Cechy specyficzne:**

- Logo firmy prominentne
- Blok `services` z ikonami i cenami (opcjonalnie)
- Portfolio realizacji (blok `projects`)
- Dane firmowe (NIP, adres, godziny pracy)
- Mapa / lokalizacja (embed)

### 7.4 Portfolio Projektu / Generyczne

**Domyślne bloki:** hero → about → gallery → contact

**Cechy specyficzne:** w pełni konfigurowalne przez admina

---

## 8. BACKEND API

### 8.1 Endpointy API

| Method | Endpoint                       | Opis                        | Auth        |
| ------ | ------------------------------ | --------------------------- | ----------- |
| GET    | `/api/portfolio/[slug]`        | Dane portfolio (publiczne)  | brak        |
| GET    | `/api/portfolio/[slug]/blocks` | Lista bloków                | brak        |
| POST   | `/api/contact/[portfolioId]`   | Formularz kontaktowy        | brak        |
| GET    | `/api/admin/portfolios`        | Lista portfeli              | admin       |
| POST   | `/api/admin/portfolios`        | Nowe portfolio              | admin       |
| PATCH  | `/api/admin/portfolios/[id]`   | Edycja portfolio            | owner/admin |
| DELETE | `/api/admin/portfolios/[id]`   | Usuń portfolio              | admin       |
| POST   | `/api/admin/blocks`            | Nowy blok                   | owner/admin |
| PATCH  | `/api/admin/blocks/[id]`       | Edycja bloku                | owner/admin |
| DELETE | `/api/admin/blocks/[id]`       | Usuń blok                   | owner/admin |
| POST   | `/api/admin/blocks/reorder`    | Zmień kolejność bloków      | owner/admin |
| POST   | `/api/admin/upload`            | Upload pliku (zdjęcia, PDF) | owner/admin |
| DELETE | `/api/admin/files/[id]`        | Usuń plik                   | owner/admin |
| GET    | `/api/admin/users`             | Lista użytkowników          | admin       |
| POST   | `/api/admin/invite`            | Wyślij zaproszenie email    | admin       |
| PATCH  | `/api/admin/users/[id]`        | Edycja usera                | admin       |
| GET    | `/api/analytics/[portfolioId]` | Statystyki                  | owner/admin |
| GET    | `/api/health`                  | Healthcheck Docker          | brak        |

### 8.2 Zadania backend

- [x] **B8.1** Skonfiguruj Payload CMS 3 z PostgreSQL (2026-06-12, Agent: Claude)
- [x] **B8.2** Zdefiniuj kolekcje Payload: `portfolios`, `blocks`, `users`, `media` (2026-06-12, Agent: Claude)
- [x] **B8.3** Implement subdomain routing w Next.js middleware (wykryj subdomenę, załaduj portfolio) (2026-06-12, Agent: Claude)
- [ ] **B8.4** Implement custom domain routing (CNAME → portfolio match w DB)
- [x] **B8.5** API endpoint formularz kontaktowy z rate limiting (Redis) (2026-06-13, Agent: Claude)
- [ ] **B8.6** System zaproszeń: generowanie tokenów, email przez Resend/Brevo
- [ ] **B8.7** Upload handler: przyjmij plik, zwaliduj (typ/rozmiar), zapisz do volume
- [ ] **B8.8** Analytics endpoint: licznik odwiedzin per portfolio (Redis incr → PostgreSQL batch)
- [ ] **B8.9** Healthcheck endpoint (`/api/health` → 200 OK + status DB)
- [ ] **B8.10** Implement RBAC: `superadmin`, `admin`, `owner` role

---

## 9. FRONTEND PUBLICZNY

### 9.1 Strony publiczne

| Strona           | URL                                      | Opis                    |
| ---------------- | ---------------------------------------- | ----------------------- |
| Landing Platform | korp-cbm.com                             | Strona główna platformy |
| Portfolio page   | [subdomain].korp-cbm.com                 | Dynamiczne portfolio    |
| Blok projektu    | [subdomain].korp-cbm.com/projects/[slug] | Szczegóły projektu      |
| Blok książki     | [subdomain].korp-cbm.com/books/[slug]    | Szczegóły książki       |
| Kontakt          | [subdomain].korp-cbm.com/#contact        | Formularz kontaktowy    |

### 9.2 Zadania frontend

- [x] **F9.1** Scaffold Next.js 15 App Router z TypeScript i Tailwind CSS 4 (2026-06-12, Agent: Claude)
- [ ] **F9.2** Implement middleware subdomain routing
- [ ] **F9.3** Utwórz `PortfolioRenderer` — komponent który renderuje listę bloków
- [ ] **F9.4** Zaimplementuj każdy blok jako osobny komponent (Hero, About, Experience, etc.)
- [ ] **F9.5** System motywów (CSS Custom Properties, light/dark/auto, cookie persistence)
- [ ] **F9.6** Responsywność — mobile-first, testowane na 375px / 768px / 1280px
- [ ] **F9.7** Płynne animacje (Framer Motion: fade-in, slide-up, staggered)
- [ ] **F9.8** Nawigacja z scroll-spy (podświetlenie aktywnej sekcji)
- [ ] **F9.9** Formularz kontaktowy z validacją Zod + Server Action
- [ ] **F9.10** OG / OpenGraph meta tagi per portfolio (SEO)
- [ ] **F9.11** Sitemap.xml generowane dynamicznie per portfolio
- [ ] **F9.12** "Pobierz CV" — pobiera PDF w aktywnym języku (fallback PL)
- [ ] **F9.13** Cookie consent banner (GDPR) z preferencjami zapisanymi w cookie
- [ ] **F9.14** Landing page platformy (korp-cbm.com) z prezentacją możliwości
- [ ] **F9.15** Strona 404 per portfolio

### 9.3 Wymagania UX

- Czas ładowania pierwszej strony < 2s (LCP)
- Lighthouse score ≥ 90 (Performance, Accessibility, SEO)
- WCAG 2.1 AA na wszystkich komponentach
- Print stylesheet dla CV portfolio (Ctrl+P = czytelne CV)

---

## 10. PANEL ADMINISTRACYJNY

### 10.1 Poziomy dostępu

| Rola         | Dostęp                                                                  |
| ------------ | ----------------------------------------------------------------------- |
| `superadmin` | Wszystko: tworzenie portfeli, zarządzanie userami, ustawienia platformy |
| `admin`      | Zarządzanie przypisanymi portfelami, zaproszenia                        |
| `owner`      | Tylko swoje portfolio (edycja bloków, media, ustawienia)                |

### 10.2 Sekcje panelu admina (owner / admin)

```
Dashboard
├── Moje portfolio — podgląd + edycja bloków
├── Bloki
│   ├── Lista bloków (drag-drop do zmiany kolejności)
│   ├── Dodaj blok (wybór typu)
│   └── Edycja bloku (formularz per typ)
├── Media
│   ├── Biblioteka plików
│   └── Upload (zdjęcia, PDF CV)
├── Ustawienia portfolio
│   ├── Domena / subdomena
│   ├── Motyw i kolory
│   ├── Język
│   └── SEO (tytuł, opis, OG)
├── Statystyki
│   ├── Odwiedziny (dzienny/tygodniowy/miesięczny wykres)
│   ├── Kraje / urządzenia
│   └── Najpopularniejsze sekcje
├── Kontakt
│   └── Wiadomości z formularza kontaktowego
└── Zegar serwera (live)
```

### 10.3 Sekcje panelu superadmin (dodatkowo)

```
Superadmin
├── Wszystkie portfolio (lista, aktywne, nieaktywne)
├── Użytkownicy
│   ├── Lista userów
│   ├── Edycja usera (role, reset hasła)
│   └── Wyślij zaproszenie (email z tokenem)
├── Ustawienia platformy
│   ├── SMTP config (wysyłka emaili)
│   ├── Cloudflare API token (automatyczne DNS)
│   └── Storage config (lokalny/Cloudflare R2)
├── Statystyki globalne
│   └── Łączne odwiedziny, aktywni userzy, media storage
└── System
    ├── Logi
    ├── Backup / eksport danych
    └── Health status (DB, Redis, storage)
```

### 10.4 Zadania panel admina

- [ ] **A10.1** Skonfiguruj Payload CMS admin panel jako base (trasa `/admin`)
- [ ] **A10.2** Dodaj custom widoki per sekcja (drag-drop bloków w Payload)
- [ ] **A10.3** Zaimplementuj drag-drop reorder bloków (React DnD lub @dnd-kit)
- [ ] **A10.4** Formularze edycji dla każdego typu bloku
- [ ] **A10.5** Uploader mediów z podglądem (obrazy) i validacją rozmiaru (max 10MB)
- [ ] **A10.6** System statystyk: Redis counter → chart (Recharts lub Chart.js)
- [ ] **A10.7** Zegar cyfrowy serwera (live, odświeżany co sekundę przez WebSocket lub polling)
- [ ] **A10.8** Todo list dla każdego usera (CRUD) przechowywany w DB
- [ ] **A10.9** Zarządzanie motywem/layoutem z podglądem live
- [ ] **A10.10** System zaproszeń: formularz email → token → link aktywacyjny
- [ ] **A10.11** Zmiana hasła i danych profilu admina
- [ ] **A10.12** Eksport CV do PDF (generowany z bloków experience/skills/education)
- [ ] **A10.13** Skrzynka wiadomości z formularza kontaktowego
- [ ] **A10.14** Backup danych (eksport JSON całego portfolio)
- [ ] **A10.15** Panel limitów serwisów (przycisk "Sprawdź limity") — odpytuje API Neon, Upstash, Cloudflare R2 i wyświetla zużycie vs limit (storage, bandwidth, requests); wyświetla ostrzeżenie gdy zużycie > 80% limitu free tier
- [ ] **A10.16** System alertów przekroczenia limitów — gdy zużycie > 80% free tier któregokolwiek serwisu: czerwony banner w adminie + email powiadomienie przez Resend; progi: Neon storage >80%, R2 storage/operacje >80%, Upstash bandwidth >80%
- [ ] **A10.17** Centrum płatności i kart — sekcja w adminie wylistowująca wszystkie zewnętrzne serwisy (Neon, Upstash, R2, Resend, Vercel, Cloudflare) z: linkiem do dashboardu, datą ważności karty kredytowej (ręcznie wprowadzana), przypomnieniem 30 dni przed wygaśnięciem (email + banner), statusem free/paid

---

## 11. SYSTEM DOMEN

### 11.1 Subdomain routing (middleware Next.js)

```typescript
// platform/src/middleware.ts
// Wykrywa subdomenę z request.headers.host
// Mapuje subdomenę na portfolioId z PostgreSQL (cache Redis)
// Ustawia header x-portfolio-id dla dalszych Server Components
```

### 11.2 Konfiguracja Cloudflare (subdomain wildcard)

```
Rekord DNS:  *.korp-cbm.com  →  CNAME → serwer (A record VPS IP)
SSL:         Wildcard certificate przez Cloudflare (auto)
Proxy:       orange-cloud ON (CDN aktywne)
```

### 11.3 Custom domain (dla portfolio premium)

- Właściciel domeny ustawia CNAME: `portfolio.mojadomena.pl → korp-cbm.com`
- W panelu admina wpisuje domenę
- Platforma weryfikuje CNAME (DNS lookup) przed aktywacją
- Cloudflare R2 / Caddy automatycznie wystawia SSL przez Let's Encrypt

### 11.4 Zadania domenowe

- [x] **D11.1** Skonfiguruj wildcard DNS `*.korp-cbm.com` w Cloudflare — A record → 76.76.21.21, proxied=false (2026-06-12, Agent: Claude)
- [ ] **D11.2** Skonfiguruj Caddy/Nginx jako reverse proxy obsługujący wildcard
- [x] **D11.3** Implement Next.js middleware dla subdomain routing (2026-06-12, Agent: Claude)
- [ ] **D11.4** Implement weryfikacja custom domain (DNS CNAME check)
- [ ] **D11.5** Utwórz subdomain per portfolio w tabeli `portfolios` (`subdomain` field)

---

## 12. DOCKER I KONTENERYZACJA

### 12.1 Struktura Docker Compose — TYLKO lokalne dev

> Docker NIE jest używany na produkcji (Vercel + managed services).
> Docker Compose = wygodne środowisko lokalne symulujące produkcję.

```yaml
# platform/docker-compose.dev.yml (TYLKO LOCAL DEV)
services:
  app:      # Next.js 15 (port 3000) — hot-reload
  postgres: # PostgreSQL 16 (port 5432) — zastępuje Neon lokalnie
  redis:    # Redis 7 (port 6379) — zastępuje Upstash lokalnie

volumes:
  postgres_data:
  redis_data:

# Brak: Caddy (Vercel robi routing), R2 (używaj .env z kluczami R2 na dev)
```

### 12.2 Dockerfile (Next.js + Payload) — dla lokalnego dev

```dockerfile
FROM node:20-alpine AS base
# Multi-stage build: deps → builder → runner
# runner = standalone Next.js output
# Używany TYLKO lokalnie przez docker-compose.dev.yml
```

### 12.3 Środowiska

| Środowisko    | Plik                     | Hosting     | Opis                       |
| ------------- | ------------------------ | ----------- | -------------------------- |
| `development` | `docker-compose.dev.yml` | Lokalny     | Hot-reload, PostgreSQL/Redis w Docker |
| `preview`     | brak (auto)              | Vercel      | Auto-deploy z każdego PR   |
| `production`  | brak (auto)              | Vercel      | Deploy z main branch       |

### 12.4 Zmienne środowiskowe

```env
# .env.example (do uzupełnienia)
DATABASE_URL=postgresql://user:pass@postgres:5432/portfoliohub
REDIS_URL=redis://redis:6379
PAYLOAD_SECRET=zmień-na-mocny-sekret-min-32-znaki
NEXTAUTH_SECRET=
NEXTAUTH_URL=https://admin.korp-cbm.com
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM=noreply@korp-cbm.com
CLOUDFLARE_API_TOKEN=         # opcjonalnie (auto DNS)
UPLOADS_DIR=/app/uploads
PLATFORM_DOMAIN=korp-cbm.com
```

### 12.5 Zadania Docker (lokalne dev)

- [x] **K12.1** Utwórz `platform/Dockerfile` (multi-stage, Node 20 Alpine) — dla lokalnego dev (2026-06-12, Agent: Claude)
- [x] **K12.2** Utwórz `platform/docker-compose.dev.yml` (development, hot-reload, PostgreSQL + Redis) (2026-06-12, Agent: Claude)
- [x] **K12.3** Utwórz `platform/.env.example` z wszystkimi zmiennymi (DATABASE_URL, REDIS_URL, R2_*, RESEND_*) (2026-06-12, Agent: Claude)
- [x] **K12.4** Skonfiguruj healthchecks dla PostgreSQL i Redis w docker-compose.dev.yml (2026-06-12, Agent: Claude)
- [x] **K12.5** GitHub Actions workflow: lint + typecheck (push NIE triggeruje deploy — deploy jest ręczny) (2026-06-12, Agent: Claude)
- [x] **K12.6** Utwórz `platform/.env.local.example` — zmienne dla lokalnego dev z Docker (2026-06-12, Agent: Claude)
- [x] **K12.7** Vercel: ustaw "Deploy on push" = OFF lub branch protection — deploy TYLKO po manual approve (2026-05-23)

---

## 13. HOSTING I INFRASTRUKTURA

### 13.1 Decyzja hostingowa (ADR-004 — ZATWIERDZONE)

**Wybrany model: Vercel + darmowe usługi (koszt 0 PLN/mies)**

| Usługa | Koszt | Rola |
|--------|-------|------|
| Vercel | $0 (free tier) | Next.js hosting, SSR, API Routes, custom domains |
| Neon | $0 (free 512MB) | PostgreSQL 16 |
| Upstash | $0 (10k req/dzień) | Redis |
| Cloudflare R2 | $0 (10GB/mies) | Storage plików i mediów |
| Cloudflare DNS | $0 | DNS + CDN + SSL |
| Resend | $0 (3000 maili/mies) | Email |

**Docker = wyłącznie lokalne dev** — `docker-compose.dev.yml` uruchamia PostgreSQL + Redis lokalnie.
**seohost.pl** — nie jest potrzebny. Można nie odnawiać po wygaśnięciu.

> **Kiedy warto rozważyć VPS?** Gdy ruch wzrośnie znacząco, pojawi się potrzeba
> Payload CMS na osobnym serwerze, lub gdy darmowe tiery okażą się niewystarczające.
> Na ten moment Vercel + free services w pełni pokrywa potrzeby 4 portfolio.

### 13.2 Cloudflare konfiguracja

```
1. Dodaj domenę korp-cbm.com do Cloudflare
2. Nameservery: podmień u rejestratora na ns1.cloudflare.com / ns2.cloudflare.com
3. DNS Records:
   - A    korp-cbm.com        → [IP VPS]  (proxied ✓)
   - A    *.korp-cbm.com      → [IP VPS]  (proxied ✓)
   - MX   korp-cbm.com        → mail.korp-cbm.com (opcjonalnie)
4. SSL: Full (strict) — wymaga ważnego certa na serwerze (Caddy to robi)
5. Page Rules:
   - korp-cbm.com/* → Cache Level: Standard
   - admin.korp-cbm.com/* → Cache Level: Bypass
```

### 13.3 Zadania hosting

- [x] **H13.1** Utwórz konto Vercel + połącz z GitHub repo (2026-05-23)
- [x] **H13.2** Utwórz bazę PostgreSQL na Neon, zapisz DATABASE_URL (2026-06-12) — ep-floral-brook.eu-central-1
- [x] **H13.3** Utwórz konto Upstash + Redis instance, zapisz REDIS_URL (2026-06-11)
- [x] **H13.4** Utwórz Cloudflare R2 bucket `portfoliohub` + klucze API (2026-06-11)
- [x] **H13.5** Utwórz konto Resend + zweryfikuj domenę korp-cbm.com (2026-06-11)
- [x] **H13.6** Przenieś domenę korp-cbm.com do Cloudflare — nameservery już aktywne (2026-06-12, Agent: Claude)
- [x] **H13.7** Ustaw DNS records: CNAME korp-cbm.com → cname.vercel-dns.com, A *.korp-cbm.com → 76.76.21.21 (2026-06-12, Agent: Claude)
- [x] **H13.8** Dodaj custom domains w Vercel (korp-cbm.com, *.korp-cbm.com) (2026-06-12, Agent: Claude)
- [x] **H13.9** Skonfiguruj zmienne środowiskowe w Vercel (14 vars) (2026-06-12, Agent: Claude)
- [ ] **H13.10** First produkcyjny deploy (`vercel --prod` z CLI po testach)
- [ ] **H13.11** Skonfiguruj UptimeRobot ping monitoring na korp-cbm.com

---

## 14. BEZPIECZEŃSTWO

- [ ] **S14.1** HTTPS everywhere (Caddy auto SSL, Cloudflare)
- [ ] **S14.2** CSRF protection (Payload CMS wbudowane + Next.js CSRF tokens)
- [ ] **S14.3** Rate limiting na formularzu kontaktowym (Redis — max 5 req/15min per IP)
- [ ] **S14.4** Rate limiting na logowaniu admina (max 10 prób/15min)
- [ ] **S14.5** Sanityzacja danych wejściowych (Zod na wszystkich formach)
- [ ] **S14.6** XSS protection — React domyślnie, sanityzacja custom HTML (DOMPurify)
- [ ] **S14.7** SQL injection — ORM (Prisma/Payload) zabezpiecza przez prepared statements
- [ ] **S14.8** .env nigdy w repo (`.gitignore` + `.env.example`)
- [ ] **S14.9** Hasła bcrypt (Payload CMS używa domyślnie)
- [ ] **S14.10** Tokens zaproszeń — jednorazowe, ważne 48h, hashowane w DB
- [ ] **S14.11** Upload validation: MIME type check (nie tylko rozszerzenie), max 10MB, image tylko jpeg/png/webp
- [ ] **S14.12** Admin na osobnej subdomenie `admin.korp-cbm.com` + opcjonalnie Cloudflare Access (IP whitelist)
- [ ] **S14.13** Content Security Policy header (Caddy middleware)
- [ ] **S14.14** Regularne `docker compose pull` + rebuild (aktualizacje bezpieczeństwa)
- [ ] **S14.15** Backup szyfrowany (jeśli wrażliwe dane)

---

## 15. SEO I WYDAJNOŚĆ

- [ ] **P15.1** Metadata API Next.js — dynamiczne title/description per portfolio
- [ ] **P15.2** OpenGraph tagi per portfolio (og:title, og:description, og:image)
- [ ] **P15.3** sitemap.xml generowany dynamicznie (Next.js sitemap() function)
- [ ] **P15.4** robots.txt per subdomena
- [ ] **P15.5** Strukturyzowane dane (Schema.org: Person, Organization)
- [ ] **P15.6** Lazy loading obrazów (Next.js Image component)
- [ ] **P15.7** Fonty self-hosted przez Next.js font optimization (brak FOUT)
- [ ] **P15.8** Prefetch na hover dla linków wewnętrznych
- [ ] **P15.9** ISR (Incremental Static Regeneration) dla bloków portfolio — revalidate co 60s
- [ ] **P15.10** CSS Critical Path inline (Tailwind auto-purge)
- [ ] **P15.11** Cloudflare Cache dla statycznych assetów (1 rok)
- [ ] **P15.12** Kompresja brotli/gzip przez Caddy
- [ ] **P15.13** Lighthouse CI w GitHub Actions (fail jeśli score < 90)
- [ ] **P15.14** Print stylesheet dla CV portfolio

---

## 16. TESTY I QA

- [ ] **T16.1** Unit testy komponentów React (Vitest + Testing Library)
- [ ] **T16.2** Unit testy logiki bloków (renderowanie, validacja danych)
- [ ] **T16.3** Integration testy API (Supertest — formularz kontaktowy, auth)
- [ ] **T16.4** E2E testy (Playwright — scenariusze: wyświetl portfolio, wyślij formularz, zaloguj admin)
- [ ] **T16.5** Visual regression testy (Playwright screenshots — ciemny/jasny motyw)
- [ ] **T16.6** Testy dostępności (axe-core w Playwright)
- [ ] **T16.7** GitHub Actions: uruchom testy na każdy PR
- [ ] **T16.8** Testy subdomain routing (middleware)
- [ ] **T16.9** Testy upload pliku (type, size validation)
- [ ] **T16.10** Load test (k6) — symulacja 100 równoczesnych użytkowników

---

## 17. MIGRACJA I WDROŻENIE PORTFELI

### 17.1 Miłosz Gawlik — CV Portfolio

**Źródło danych:** `kopia/data/*.json` (gotowe!) + `kopia/CV Miłosz Gawlik.pdf`  
**Status istniejącego kodu:** Kompletny PHP portfolio w `kopia/` — do zmigowania do blokowego systemu.

- [ ] **M17.1** Utwórz `portfolios/milosz-gawlik/data/` z plikami JSON (skopiuj z `kopia/data/`)
- [ ] **M17.2** Napisz skrypt migracji JSON → PostgreSQL dla portfolio Miłosza
- [ ] **M17.3** Skopiuj CV PDF do `portfolios/milosz-gawlik/assets/`
- [ ] **M17.4** Przetestuj portfolio na `milosz.korp-cbm.com` (dev)
- [ ] **M17.5** Ustaw bloki: hero, about, experience, skills, education, contact
- [ ] **M17.6** Dodaj dwujęzyczność PL/EN

### 17.2 Radosław Stawiszyński — CV + PM Portfolio

**Źródło danych:** `CV_RadekS/` + `PLAN_1.md`, `PLAN_2.md`  
**Status:** Plany gotowe, kod NIE zaimplementowany.

- [ ] **M17.7** Utwórz `portfolios/radek-stawiszynski/data/` z plikami JSON na podstawie CV
- [ ] **M17.8** Skopiuj CV PDF (PL + EN) do `portfolios/radek-stawiszynski/assets/`
- [ ] **M17.9** Ustaw bloki: hero (PM positioning), about, experience (PM timeline), skills (PM + Tech), education, contact
- [ ] **M17.10** Dodaj sekcję projektów PM (z PLAN_1 §6.2)
- [ ] **M17.11** Motyw: ciemna zieleń + złoto (paleta z PLAN_1 §5)

### 17.3 Martyna Stawiszyńska — Portfolio Autorki

**Źródło danych:** Do zebrania od Martyny  
**Status:** Brak danych — do zebrania.

- [ ] **M17.12** Zbierz dane od Martyny: bio, zdjęcia, lista książek (tytuł, rok, opis, okładka, linki)
- [ ] **M17.13** Utwórz `portfolios/martyna-stawiszynska/data/`
- [ ] **M17.14** Ustaw bloki: hero, about (bio literackie), books, gallery, contact
- [ ] **M17.15** Motyw dla autorki (estetyczny, literacki — do uzgodnienia z Martyną)
- [ ] **M17.16** Social media linki (Facebook, Instagram, Goodreads)

### 17.4 CBM — Portfolio Firmy

**Źródło danych:** Do zebrania  
**Status:** Stara strona korp-cbm.com — do zastąpienia nową.

- [ ] **M17.17** Zbierz dane firmy: opis, usługi, realizacje, dane kontaktowe
- [ ] **M17.18** Utwórz `portfolios/cbm-firma/data/`
- [ ] **M17.19** Ustaw bloki: hero (logo + tagline), about, services, projects (realizacje), contact
- [ ] **M17.20** Logo CBM + firmowe kolory

---

## 18. SIDE QUESTS — PROJEKTY POBOCZNE

> Projekty poboczne w `side-quests/` — każdy ma swój mini-README i plik TODO.

### 18.1 Gry HTML (`side-quests/games/`)

**Pliki:** 1_key_v1.html, 2_snake_v2.html, 3_number_letter_v2.html, 4_sudoku_v1.html

- [ ] **SQ18.1** Przenieś do `side-quests/games/`
- [ ] **SQ18.2** Dodaj mini-README z opisem każdej gry
- [ ] **SQ18.3** Opcjonalnie: dodaj jako blok `embed` w portfolio Radosława (sekcja "Projekty")

### 18.2 Programy Python (`side-quests/python-programs/`)

**Pliki:** zawartość `prog_python/`

- [ ] **SQ18.4** Przenieś do `side-quests/python-programs/`
- [ ] **SQ18.5** Dodaj README z opisem każdego programu
- [ ] **SQ18.6** Najciekawsze projekty Python → jako "projekty" w portfolio Radosława

### 18.3 Admin Dashboard Extras

> Dodatkowe narzędzia dla panelu admina (z `kopia/zadania_dodatkowe.md`):

- [ ] **SQ18.7** Zaawansowany licznik odwiedzin (statystyki z wykresami w panelu admina)
- [ ] **SQ18.8** Zegar cyfrowy serwera w panelu admina (live refresh)
- [ ] **SQ18.9** Todo list z bazą danych (CRUD) dla każdego usera
- [ ] **SQ18.10** System layout/kolorystyki w panelu (wybór motywu z podglądem)

### 18.4 CI/CD Dashboard

- [ ] **SQ18.11** Mini dashboard statusu pipeline — widoczny w panelu admina
- [ ] **SQ18.12** GitHub webhooks → powiadomienie w panelu o nowym deploy

---

## 19. AI WORKFLOW — PRACA Z WIELOMA AGENTAMI

> Projekt będzie rozwijany przez różne platformy AI: Claude Code, Ollama (lokalne modele),
> Gemini CLI, Copilot. Poniższe zasady zapewniają spójność pracy.

### 19.1 Zasady dla agentów AI

1. **Zawsze czytaj §2 (ADR) przed implementacją** — decyzje są wiążące
2. **Zaznaczaj ukończone taski** — `- [x] TASK_ID Opis (2026-MM-DD, Agent: nazwa)`
3. **Nie zmieniaj statusu ADR** — to robi tylko człowiek
4. **Przy konflikcie** — opisz problem w komentarzu `<!-- AGENT_NOTE: ... -->` i zatrzymaj się
5. **Jeden task na raz** — nie rozpoczynaj następnego przed ukończeniem poprzedniego
6. **Testuj przed oznaczeniem jako done** — uruchom testy lub sprawdź w przeglądarce
7. **Nie usuwaj danych** — archiwizuj zamiast usuwać (nie kasuj plików bez pytania)
8. **Komentarze w kodzie tylko WHY** — nie co robi kod (imiona zmiennych mówią co)

### 19.2 Kontekst dla Ollama (lokalnych modeli)

```markdown
<!-- OLLAMA_CONTEXT (dołącz do prompta) -->

Projekt: PortfolioHub — wielodostępna platforma portfolio
Stack: Next.js 15, TypeScript, Tailwind CSS 4, Payload CMS 3, PostgreSQL, Docker
Repo: /home/rspro/Dokumenty/1.CODE/2.Portfolio
Główny plik planu: PLAN.md
Zatwierdzone decyzje: ADR-005 (Cloudflare), ADR-009 (PL+EN)
Oczekujące decyzje: ADR-001 (framework), ADR-002 (CMS), ADR-003 (DB), ADR-004 (hosting)
Aktywna faza: Faza 1 — Fundament Docker + DB (Next.js 15 scaffold + Payload CMS)
```

### 19.3 Context files dla agentów

- [x] **AI19.1** Utwórz `CLAUDE.md` w root projektu (kontekst dla Claude Code) (2026-06-12, Agent: Claude)
- [x] **AI19.2** Utwórz `.agents/CONTEXT.md` z opisem projektu i stack dla agentów (2026-06-12, Agent: Claude)
- [ ] **AI19.3** Utwórz `OLLAMA_PROMPT.md` — gotowy do wklejenia kontekst dla Ollama
- [x] **AI19.4** Utwórz `.clinerules/portfoliohub-rules.md` — reguły dla nowej struktury projektu (2026-06-12, Agent: Claude)
- [ ] **AI19.5** Skonfiguruj `.agents/skills/` — skills dla poszczególnych faz (bootstrap, blok, deploy)

---

## 20. ROADMAP I FAZY

### Faza 0 — Przygotowanie (1–2 dni)

```
- [x] Zatwierdź decyzje ADR-001 przez ADR-010 (2026-05-23)
- [x] Reorganizacja repo — P3.1–P3.10 (2026-05-23, commit 54fa46e)
- [x] .gitignore + README.md zaktualizowane (2026-05-23)
- [x] SSH key GitHub wygenerowany i dodany (2026-05-23)
- [x] Vercel CLI zainstalowany i zalogowany (2026-05-23)
- [x] Vercel projekt "portfolio" utworzony + linked z GitHub (2026-05-23)
- [x] Vercel: auto-deploy wyłączony (Ignored Build Step = exit 1) (2026-05-23)
- [x] Vercel: Root Directory = platform, Framework = Next.js (2026-05-23)
- [x] Neon — utwórz projekt PostgreSQL (region: eu-central-1) → DATABASE_URL (H13.2) (2026-06-12)
- [x] Upstash — utwórz Redis instance → UPSTASH_REDIS_REST_URL + TOKEN (2026-06-11)
- [x] Cloudflare R2 — utwórz bucket "portfoliohub" → klucze API (2026-06-11)
- [x] Resend — zweryfikuj domenę korp-cbm.com → RESEND_API_KEY (2026-06-11)
- [x] Zmienne środowiskowe → vercel env add (14 vars) (H13.9) (2026-06-12, Agent: Claude)
- [x] Przenieś domenę korp-cbm.com do Cloudflare + DNS wildcard (H13.6, H13.7, D11.1) (2026-06-12, Agent: Claude)
- [x] Dodaj domeny w Vercel (H13.8) (2026-06-12, Agent: Claude)
- [x] Utwórz CLAUDE.md i context files (AI19.1, AI19.2, AI19.4) (2026-06-12, Agent: Claude)
- [x] Git branching: main/staging/dev (2026-06-12, Agent: Claude)
- [x] CHANGELOG.md + docs/git-workflow.md (2026-06-12, Agent: Claude)
- [x] Docker scaffold: Dockerfile + docker-compose.dev.yml + .env.example (K12.1-K12.4, K12.6) (2026-06-12, Agent: Claude)
- [x] Logger architektura: platform/src/lib/logger.ts (pino) (2026-06-12, Agent: Claude)
```

### Faza 1 — Fundament Docker + DB (3–5 dni)

```
- [x] Scaffold Next.js 15 + TypeScript + Tailwind CSS 4 (F9.1) (2026-06-12, Agent: Claude)
- [x] Konfiguracja Payload CMS 3 + PostgreSQL (B8.1, B8.2) (2026-06-12, Agent: Claude)
- [x] Docker Compose dev environment (K12.2, K12.3) ← ukończone w Fazie 0
- [x] Schemat bazy danych (Portfolio, Block, User, Media) (B8.2) (2026-06-12, Agent: Claude)
- [ ] Podstawowe API endpoints (B8.5 — formularz kontaktowy, rate limiting)
- [x] Subdomain routing middleware (B8.3, D11.3) (2026-06-12, Agent: Claude)
```

### Faza 2 — Bloki i Frontend (5–7 dni)

```
- [ ] PortfolioRenderer + system bloków (F9.3, F9.4)
- [ ] Implementacja bloków MVP: hero, about, experience, skills, education, contact
- [ ] System motywów light/dark (F9.5, ADR-006)
- [ ] Responsywność (F9.6)
- [ ] Animacje (F9.7)
- [ ] Cookie consent (F9.13)
```

### Faza 3 — Panel Admina (5–7 dni)

```
- [ ] Payload CMS admin customization (A10.1, A10.2)
- [ ] Drag-drop reorder bloków (A10.3)
- [ ] Formularze edycji per blok (A10.4)
- [ ] Upload mediów (A10.5)
- [ ] Statystyki (A10.6)
- [ ] Todo list (A10.8)
- [ ] System zaproszeń (A10.10)
- [ ] Zmiana motywu z podglądem (A10.9)
```

### Faza 4 — Migracja portfeli (3–5 dni)

```
- [ ] Miłosz Gawlik portfolio (M17.1–M17.6)
- [ ] Radosław Stawiszyński portfolio (M17.7–M17.11)
- [ ] Dane od Martyny + jej portfolio (M17.12–M17.16)
- [ ] CBM portfolio (M17.17–M17.20)
```

### Faza 5 — Deployment + SEO (2–3 dni)

```
- [ ] Konfiguracja Vercel + połączenie z GitHub repo (H13.1)
- [ ] Konfiguracja Neon, Upstash, R2, Resend (H13.2–H13.5)
- [ ] DNS: korp-cbm.com + wildcard *.korp-cbm.com → Vercel (H13.6–H13.8)
- [ ] Zmienne środowiskowe w Vercel Dashboard (H13.9)
- [ ] SEO, sitemap, OG tags (P15.1–P15.14)
- [ ] Monitoring UptimeRobot (H13.11)
- [ ] ✅ Testy lokalne PASSED → git push origin main → Vercel auto-deploy (H13.10)
```

> **GATE przed push:** Wszystkie testy z Fazy 6 muszą przejść. Push = decyzja Radosława.

### Faza 6 — Testy i finalizacja (2–3 dni)

```
- [ ] Unit + E2E testy (T16.1–T16.10)
- [ ] Lighthouse audit (P15.13)
- [ ] Bezpieczeństwo review (S14.1–S14.15)
- [ ] UAT z użytkownikami (Miłosz, Martyna)
- [ ] Launch 🚀
```

### Faza 7 — Side quests i rozszerzenia (ongoing)

```
- [ ] Side quests (SQ18.1–SQ18.12)
- [ ] Bloki ⚡ (testimonials, timeline, stats, cta, faq)
- [ ] Blog per portfolio
- [ ] Custom domain (ADR-007 opcja B)
- [ ] Generator CV PDF z bloków
```

---

## 21. STATUS — CO ZBUDOWANE / CO NIE

### ✅ Zbudowane (istniejący kod)

| Element               | Lokalizacja                         | Opis                                                         |
| --------------------- | ----------------------------------- | ------------------------------------------------------------ |
| PHP Portfolio Miłosza | `kopia/`                            | Kompletne: index.php, admin, data/JSON, Docker, testy, PL+EN |
| Architektura globalna | `PROJECT_MANAGEMENT/docs/PLAN_1.md` | Next.js, stack, ADR (draft)                                  |
| Frontend plan         | `PROJECT_MANAGEMENT/docs/PLAN_2.md` | Komponenty, struktura, animacje (draft)                      |
| Stare HTML portfolio  | root                                | index.html, styles.css (korp-cbm.com stary)                  |
| CV Radosława          | `CV_RadekS/`                        | PDF PL + EN + DOCX                                           |
| CV Quick View         | `CV_RadekS_Qiuck_view_update/`      | index.html z quick view                                      |

### ❌ Nie zbudowane (do implementacji)

| Element                      | Faza   | Priority |
| ---------------------------- | ------ | -------- |
| Platform Next.js 15 scaffold | Faza 1 | 🔴       |
| Payload CMS 3 konfiguracja   | Faza 1 | 🔴       |
| System bloków                | Faza 2 | 🔴       |
| Panel admina (nowy)          | Faza 3 | 🔴       |
| Subdomain routing            | Faza 1 | 🔴       |
| Docker prod stack            | Faza 5 | 🔴       |
| Portfolio Radosława          | Faza 4 | 🟡       |
| Portfolio Martyny            | Faza 4 | 🟡       |
| Portfolio CBM                | Faza 4 | 🟡       |
| System zaproszeń email       | Faza 3 | 🟡       |
| Statystyki odwiedzin         | Faza 3 | 🟡       |
| Generator CV PDF             | Faza 7 | ⚪       |
| Blog per portfolio           | Faza 7 | ⚪       |

---

## 22. BACKLOG — CO JESZCZE WARTO ZBUDOWAĆ

> Sekcja na pomysły i przyszłe rozszerzenia. Nie blokują MVP.

### 22.1 Funkcjonalności produktowe

- **Generator CV PDF** — generuj PDF z bloków experience/skills (Puppeteer lub @react-pdf/renderer)
- **Blog per portfolio** — każdy właściciel może prowadzić bloga (blok `blog-preview` + strona)
- **Integracja GitHub** — auto-import pinned repos jako projekty (GitHub API)
- **Integracja LinkedIn** — import danych z LinkedIn (w ramach możliwości API)
- **QR code** — generowany QR code do portfolio (dla wizytówek)
- **Analityka real-time** — live visitor counter w adminie
- **Eksport do formatów** — eksport portfolio jako statyczny HTML do pobrania
- **Portfolio builder wizard** — kreator krok-po-kroku dla nowych użytkowników
- **Template gallery** — gotowe szablony do jednego kliknięcia

### 22.2 Funkcjonalności techniczne

- **Redis Queue** (Bull) — asynchroniczne zadania (wysyłka emaili, generowanie PDF)
- **WebSockets** — live preview w adminie (edytuj blok, widzisz zmiany natychmiast)
- **Image optimization** — automatyczne resize i WebP konwersja przy upload
- **CDN integration** — Cloudflare R2 zamiast lokalnego storage (dla skali)
- **Multi-region** — deploy na kilka regionów (Cloudflare Workers)
- **API publiczne** — REST API dla zewnętrznych narzędzi (Zapier, n8n integracje)
- **Webhooks** — powiadomienia o nowych wiadomościach (Slack, email, Discord)
- **Two-factor auth** — TOTP (Google Authenticator) dla admina

### 22.3 Uwagi i obserwacje

- Seohost.pl SH 2 to shared hosting — przed deployem Docker ustal czy masz VPS lub kup VPS (Hetzner CX22 ok. 6€/mies to dobry wybór)
- `kopia/` folder zawiera wartościowy kod PHP (testy, Docker, admin) — zachowaj jako referencję w `archive/`
- System bloków to największa inwestycja czasowa — warto zaplanować go starannie przed implementacją
- Payload CMS 3 + Next.js 15 = naturalna para, ale wymagają Node.js 20+ (nie PHP)
- Cloudflare wildcard SSL + Caddy = zero konfiguracji Let's Encrypt, działa automatycznie
- Dla Ollama (lokalnych modeli) — upewnij się że CONTEXT.md jest zawsze aktualny i dołączony do prompta

---

## Appendix A — Rejestr zmian PLAN.md

| Data       | Wersja | Zmiana                                              | Przez             |
| ---------- | ------ | --------------------------------------------------- | ----------------- |
| 2026-05-23 | 1.0    | Inicjalne stworzenie — pełna architektura platformy | Claude Sonnet 4.6 |
| 2026-05-23 | 1.1    | Zatwierdzono ADR-001÷010; zmiana hostingu na Vercel; dodano DIALOG; retro-terminal theme | Radosław + Claude |
| 2026-05-23 | 1.2    | Reorganizacja repo (commit 54fa46e); zasada git push tylko po testach i zgodzie Radosława | Radosław + Claude |
| 2026-05-23 | 1.3    | Faza 0 częściowo ukończona: Vercel skonfigurowany, SSH GitHub, P3.1-P3.10 done | Radosław + Claude |
| 2026-06-12 | 1.4    | Faza 0 UKOŃCZONA: DNS skonfigurowany (H13.6-H13.8, D11.1), system pamięci AI, access.md | Radosław + Claude |

---

## Appendix B — Linki i zasoby

| Zasób                | Link                                                  |
| -------------------- | ----------------------------------------------------- |
| Repo GitHub          | https://github.com/RadoslawStawiszynski/Portfolio.git |
| Next.js 15 docs      | https://nextjs.org/docs                               |
| Payload CMS 3 docs   | https://payloadcms.com/docs                           |
| Tailwind CSS 4 docs  | https://tailwindcss.com/docs                          |
| Caddy docs           | https://caddyserver.com/docs                          |
| Hetzner Cloud        | https://www.hetzner.com/cloud                         |
| Cloudflare Dashboard | https://dash.cloudflare.com                           |
| shadcn/ui            | https://ui.shadcn.com                                 |
| Framer Motion        | https://www.framer.com/motion                         |

---

_Ostatnia aktualizacja: 2026-06-12 v1.4 — Faza 0 UKOŃCZONA_  
_Następna aktualizacja: Po ukończeniu Fazy 1 (Next.js 15 scaffold + Payload CMS 3)_
