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

- Logo firmy pominentne
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
- [x] **F9.2** Implement middleware subdomain routing (2026-06-12, Agent: Claude) ← zrealizowane jako B8.3/D11.3
- [x] **F9.3** Utwórz `PortfolioRenderer` — komponent który renderuje listę bloków (2026-06-13, Agent: Claude)
- [x] **F9.4** Zaimplementuj każdy blok jako osobny komponent (Hero, About, Experience, Skills, Education, Contact) (2026-06-13, Agent: Claude)
- [x] **F9.5** System motywów (CSS Custom Properties, light/dark/retro-terminal, cookie persistence) (2026-06-13, Agent: Claude)
- [x] **F9.6** Responsywność — mobile-first, Tailwind md:/lg: breakpoints (375px/768px/1280px) (2026-06-13, Agent: Claude)
- [x] **F9.7** Płynne animacje (Framer Motion: fade-in, slide-up, staggered) (2026-06-14, Agent: Claude)
- [x] **F9.8** Nawigacja z scroll-spy (podświetlenie aktywnej sekcji) (2026-06-14, Agent: Claude)
- [x] **F9.9** Formularz kontaktowy z validacją Zod + Server Action (2026-06-14, Agent: Claude)
- [x] **F9.10** OG / OpenGraph meta tagi per portfolio (SEO) (2026-06-14, Agent: Claude)
- [x] **F9.11** Sitemap.xml generowane dynamicznie per portfolio (2026-06-14, Agent: Claude)
- [x] **F9.12** "Pobierz CV" — pobiera PDF w aktywnym języku (fallback PL) (2026-06-14, Agent: Claude)
- [x] **F9.13** Cookie consent banner (GDPR) z preferencjami zapisanymi w cookie (2026-06-14, Agent: Claude)
- [x] **F9.14** Landing page platformy (korp-cbm.com) z prezentacją możliwości (2026-06-14, Agent: Claude)
- [x] **F9.15** Strona 404 per portfolio (2026-06-14, Agent: Claude)

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
Rekord DNS:  *.korp-cbm.com  →  CNAME → cname.vercel-dns.com  (proxied 🟠)
             korp-cbm.com    →  CNAME → cname.vercel-dns.com  (proxied 🟠)
SSL:         Wildcard certificate przez Cloudflare (auto, mode: Full)
Proxy:       orange-cloud ON (CDN aktywne) — Cloudflare terminuje SSL, Vercel serwuje Next.js
```

### 11.3 Custom domain (dla portfolio premium)

- Właściciel domeny ustawia CNAME: `portfolio.mojadomena.pl → korp-cbm.com`
- W panelu admina wpisuje domenę
- Platforma weryfikuje CNAME (DNS lookup) przed aktywacją
- Cloudflare R2 / Caddy automatycznie wystawia SSL przez Let's Encrypt

### 11.4 Zadania domenowe

- [x] **D11.1** Skonfiguruj wildcard DNS `*.korp-cbm.com` w Cloudflare — CNAME → cname.vercel-dns.com, proxied 🟠 (2026-06-18, poprawione — pierwotnie A record/proxied=false)
- [x] **D11.2** Reverse proxy — obsługiwany przez Vercel (nie Caddy/Nginx; ADR-004) (2026-06-16)
- [x] **D11.3** Implement Next.js middleware dla subdomain routing (2026-06-12, Agent: Claude)
- [x] **D11.3b** Subdomain routing na dev — `radek.localhost`, `milosz.localhost`, `martyna.localhost` działają lokalnie bez `/etc/hosts` (2026-06-20, Agent: Claude)
- [ ] **D11.4** Implement weryfikacja custom domain (DNS CNAME check)
- [x] **D11.5** Subdomain field w tabeli `portfolios` — pole `subdomain` istnieje od początku (Faza 1) (2026-06-12, Agent: Claude)

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

> ⚠️ **UWAGA:** Ta sekcja była pierwotnie napisana z myślą o VPS (Caddy). Po wyborze Vercel (ADR-004)
> instrukcje DNS zostały zaktualizowane. Nie używamy VPS ani Caddy — hosting to Vercel.

```
1. Nameservery: ns1.cloudflare.com / ns2.cloudflare.com (już aktywne ✓)
2. DNS Records (Cloudflare jako proxy przed Vercel):
   - CNAME  korp-cbm.com    → cname.vercel-dns.com  (proxied 🟠)
   - CNAME  *.korp-cbm.com  → cname.vercel-dns.com  (proxied 🟠)
   - MX     korp-cbm.com    → mail.korp-cbm.com (opcjonalnie)
3. SSL/TLS mode w Cloudflare: Full
   (NIE Strict — Vercel nie ma własnego certa dla wildcard *.korp-cbm.com
    gdy ruch przechodzi przez Cloudflare proxy; Full szyfruje tunel CF→Vercel)
4. Cache Rules (Cloudflare):
   - *.korp-cbm.com/*         → Cache Level: Standard
   - admin.korp-cbm.com/*     → Cache Level: Bypass

Jak to działa:
  Przeglądarka → Cloudflare (SSL wildcard, CDN) → Vercel (Next.js + Payload)
  Cloudflare terminuje SSL swoim wildcard certem — Vercel nie musi mieć certa dla *.korp-cbm.com
```

### 13.3 Zadania hosting

- [x] **H13.1** Utwórz konto Vercel + połącz z GitHub repo (2026-05-23)
- [x] **H13.2** Utwórz bazę PostgreSQL na Neon, zapisz DATABASE_URL (2026-06-12) — ep-floral-brook.eu-central-1
- [x] **H13.3** Utwórz konto Upstash + Redis instance, zapisz REDIS_URL (2026-06-11)
- [x] **H13.4** Utwórz Cloudflare R2 bucket `portfoliohub` + klucze API (2026-06-11)
- [x] **H13.5** Utwórz konto Resend + zweryfikuj domenę korp-cbm.com (2026-06-11)
- [x] **H13.6** Przenieś domenę korp-cbm.com do Cloudflare — nameservery już aktywne (2026-06-12, Agent: Claude)
- [x] **H13.7** Ustaw DNS records w Cloudflare: CNAME korp-cbm.com + CNAME *.korp-cbm.com → cname.vercel-dns.com (proxied 🟠), SSL mode: Full (2026-06-18, poprawione — było A/proxied=false)
- [x] **H13.8** Dodaj custom domains w Vercel (korp-cbm.com, *.korp-cbm.com) (2026-06-12, Agent: Claude)
- [x] **H13.9** Skonfiguruj zmienne środowiskowe w Vercel (14 vars) (2026-06-12, Agent: Claude)
- [x] **H13.10** First produkcyjny deploy — app live na korp-cbm.com (2026-06-16, Agent: Claude)
- [ ] **H13.11** Skonfiguruj UptimeRobot ping monitoring na korp-cbm.com

---

## 14. BEZPIECZEŃSTWO

- [ ] **S14.1** HTTPS everywhere (Caddy auto SSL, Cloudflare)
- [ ] **S14.2** CSRF protection (Payload CMS wbudowane + Next.js CSRF tokens)
- [x] **S14.3** Rate limiting na formularzu kontaktowym (Redis — max 3 req/15min per IP) (2026-06-13, Agent: Claude)
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

**Źródło danych:** `portfolios/milosz-gawlik/data/*.json` (gotowe) + `kopia/CV Miłosz Gawlik.pdf`  
**Status:** Zaseedowane — 6 bloków aktywnych na `milosz.localhost:3000`, konto owner: `milosz@portfoliohub.dev`

- [x] **M17.1** Dane JSON dostępne w `portfolios/milosz-gawlik/data/` (przeniesione z `kopia/data/`) (2026-06-16)
- [x] **M17.2** Seed script `scripts/seed-milosz.ts` — JSON → PostgreSQL (2026-06-20, Agent: Claude)
- [x] **M17.3** Skopiuj CV PDF do `portfolios/milosz-gawlik/assets/` + wgraj do R2 (2026-06-20, Agent: Claude — upload-cv.ts, R2 key: milosz/cv/cv-milosz-pl.pdf)
- [x] **M17.4** Portfolio działa na `milosz.localhost:3000` (dev) (2026-06-20, Agent: Claude)
- [x] **M17.5** Bloki: hero, about, experience (5 pozycji), skills (4 kat.), education, contact (2026-06-20, Agent: Claude)
- [ ] **M17.6** Dodaj dwujęzyczność PL/EN

### 17.2 Radosław Stawiszyński — CV + PM Portfolio

**Źródło danych:** CV Radosława (pełne dane zaseedowane) + `portfolios/radek-stawiszynski/`  
**Status:** Zaseedowane — 6 bloków z pełnym CV, `radek.localhost:3000` działa, owner=superadmin.

- [x] **M17.7** Dane CV zaseedowane przez `scripts/seed-radek.ts` (2026-06-20, Agent: Claude)
- [x] **M17.8** Skopiuj CV PDF (PL + EN) do `portfolios/radek-stawiszynski/assets/` + wgraj do R2 (2026-06-20, Agent: Claude — R2 keys: radek/cv/cv-radek-pl.pdf, radek/cv/cv-radek-en.pdf)
- [x] **M17.9** Bloki: hero, about, experience (5 pozycji PM), skills (6 kat.), education (3 wpisy), contact (2026-06-20, Agent: Claude)
- [x] **M17.10** Dodaj sekcję projektów PM — blok `projects` (2026-06-20, Agent: Claude — 4 projekty: PortfolioHub, AI, DB Connector, Nancy Card)
- [x] **M17.11** Ustaw motyw `retro-terminal` dla portfolio radek (2026-06-20, Agent: Claude — ustawiony w upload-cv.ts + seed-neon.ts)

### 17.3 Martyna Stawiszyńska — Portfolio Autorki

**Źródło danych:** `portfolios/martyna-stawiszynska/v1-nancy-card/dane-nancy-ai/dane.md`  
**Status:** Zaseedowane — 4 bloki (hero, about, skills, contact), konto: `martyna.stawiszynska@gmail.com`

> **v1-nancy-card** to standalone prototyp (Next.js + Supabase Auth, panel admin, CRUD postów i palet kolorów).
> Zawiera `dane-nancy-ai/dane.md` i `dane-nancy-ai/zrodla.md` — gotowe treści i źródła do użycia w platformie.
> Docelowo portfolio Martyny będzie częścią PortfolioHub — v1 zostaje jako archiwum referencyje i bank danych.

- [x] **M17.11** Przenieś `nancy_card` do `portfolios/martyna-stawiszynska/v1-nancy-card/` (2026-06-16, Claude)
- [x] **M17.12** Treści z `dane-nancy-ai/dane.md` użyte w seed-martyna.ts (2026-06-20, Agent: Claude)
- [x] **M17.13** Seed script `scripts/seed-martyna.ts` + bloki w DB (2026-06-20, Agent: Claude)
- [x] **M17.14** Dodaj blok `books` (lista książek Payload fields + TypeScript types + React scroll/grid + okładki + link kup) i `gallery` (4-col grid + lightbox z nawigacją) — nowe typy bloków (2026-06-27, Agent: Claude)
- [ ] **M17.15** Motyw dla autorki — ustal z Martyną (propozycja: `slate-rose` lub custom)
- [x] **M17.16** Social media linki (Facebook, Instagram, Goodreads) w bloku contact — refactor na generyczną listę linków (2026-06-27, Agent: Claude)

### 17.4 CBM — Portfolio Firmy

**Źródło danych:** Do zebrania  
**Status:** Stara strona korp-cbm.com — do zastąpienia nową.

- [x] **M17.17** Zbierz dane firmy: opis, usługi, realizacje, dane kontaktowe (2026-06-27, Agent: Claude)
- [x] **M17.18** Utwórz `portfolios/cbm-firma/data/` (2026-06-27, Agent: Claude)
- [x] **M17.19** Ustaw bloki: hero (logo + tagline), about, services, projects (realizacje), contact (2026-06-27, Agent: Claude)
- [x] **M17.20** Logo CBM + firmowe kolory (2026-06-27, Agent: Claude)

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

### 18.5 Lokalny Asystent AI — Ollama + Qwen (`side-quests/local-ai-assistant/`)

**Źródło:** `1.CODE/API_test_v1/` → przeniesiono do `side-quests/local-ai-assistant/`
**Co to jest:** eksperyment z lokalnym LLM — custom Modelfile dla Qwen3-Coder-30B z polskim promptem systemowym + skrypt diagnostyczny środowiska ML (torch, tensorflow, scikit-learn, numpy, pandas).

- [x] **SQ18.13** Przenieś `API_test_v1/` do `side-quests/local-ai-assistant/` (2026-06-16, Claude)
- [x] **SQ18.14** Napisz README: co to jest, po co, jak uruchomić (Ollama + `ollama create MyAsystent`) (2026-06-16, Claude)
- [ ] **SQ18.15** Opisz stos: Python, Ollama, Qwen3-Coder, psutil — jako showcase "Local AI Dev Setup"
- [ ] **SQ18.16** Dodaj jako projekt w portfolio Radosława: "Lokalny asystent AI" z tagami `AI`, `Ollama`, `Python`, `LLM`

### 18.6 DB Connector — GUI do baz danych (`side-quests/db-connector/`)

**Źródło:** `1.CODE/App_LogDB/` → przeniesiono do `side-quests/db-connector/`
**Co to jest:** desktopowa aplikacja Python/Tkinter do łączenia z PostgreSQL, MSSQL i IBM DB2. 3-warstwowa architektura, szyfrowanie Fernet, walidacja, logger, PyInstaller packaging.

- [x] **SQ18.24** Przenieś `App_LogDB/` do `side-quests/db-connector/` (2026-06-16, Claude)
- [x] **SQ18.25** Napisz README z opisem architektury i instrukcją uruchomienia (2026-06-16, Claude)
- [ ] **SQ18.26** Dodaj screenshot okna aplikacji do README
- [ ] **SQ18.27** Dodaj jako projekt w portfolio Radosława z tagami `Python`, `Desktop`, `Database`

### 18.7 Profesjonalizacja projektów — upgrade do CV/portfolio

> Wszystkie projekty w `side-quests/` i `portfolios/` są aktualnie słabe lub szkieletowe. Ten punkt pilnuje żeby każdy z nich był gotowy do pokazania rekruterowi.

**Kryteria "projekt gotowy do CV":**
- ma README z opisem, technologiami, screenshotami/linkami
- ma działający deploy lub instrukcję uruchomienia
- ma wyraźnie opisany "problem który rozwiązuje" i "czego się nauczyłem"
- kod jest posprzątany (usunięte debug prints, komentarze po polsku zastąpione angielskim)

**Checklist per projekt:**

- [ ] **SQ18.17** `side-quests/games/` — 4 gry HTML: dodaj screenshoty, deploy na GH Pages, opis mechaniki
- [ ] **SQ18.18** `side-quests/python-programs/` — 4 programy Python: README, opis algorytmu, przykład uruchomienia
- [ ] **SQ18.19** `side-quests/local-ai-assistant/` — Ollama setup: README gotowe ✓, dodaj diagram architektury
- [ ] **SQ18.20** `portfolios/radek-stawiszynski/` — uzupełnij dane JSON: projekty, doświadczenie, umiejętności z CV
- [ ] **SQ18.21** Zrób research `side-quests/` i oceń które projekty mają potencjał CV vs które tylko archiwizować
- [ ] **SQ18.22** Dla każdego projektu wybranego do CV: napisz 2-3 zdania pitch po angielsku (do sekcji projects na portfolio)
- [x] **SQ18.23** Zbadaj projekty w `1.CODE/` — App_LogDB → db-connector, nancy_card → portfolios/martyna/v1, Nowy_system → system-setup, mmtychy.pl — osobny duży projekt (nie ruszamy), pozostałe do oceny (2026-06-16, Claude)

### 18.8 System Setup Assistant (`side-quests/system-setup/`)

**Źródło:** `1.CODE/Nowy_system/` → przeniesiono do `side-quests/system-setup/`
**Co to jest:** punkt startowy do aplikacji/skryptu uruchamianego po świeżej instalacji systemu — lista aplikacji do zainstalowania (Windows, `lista_aplikacji.txt`).

- [x] **SQ18.28** Przenieś `Nowy_system/` do `side-quests/system-setup/` (2026-06-16, Claude)
- [ ] **SQ18.29** Przepisz listę aplikacji na skrypt instalacyjny (Winget / Chocolatey lub Bash dla Linux)
- [ ] **SQ18.30** Dodaj konfiguracje: `.gitconfig`, VS Code extensions (`extensions.json`), terminal settings
- [ ] **SQ18.31** Napisz README: "post-install setup for a developer workstation"
- [ ] **SQ18.32** Opcjonalnie: prosta TUI w Pythonie (menu checkboxów aplikacji do zainstalowania)

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
Oczekujące decyzje: (wszystkie ADR-001÷010 zatwierdzone)
Aktywna faza: Faza 4 — Migracja portfeli (treść do admina: radek, milosz, martyna, cbm)
```

### 19.3 Context files dla agentów

- [x] **AI19.1** Utwórz `CLAUDE.md` w root projektu (kontekst dla Claude Code) (2026-06-12, Agent: Claude)
- [x] **AI19.2** Utwórz `.agents/CONTEXT.md` z opisem projektu i stack dla agentów (2026-06-12, Agent: Claude)
- [ ] **AI19.3** Utwórz `OLLAMA_PROMPT.md` — gotowy do wklejenia kontekst dla Ollama
- [x] **AI19.4** Utwórz `.clinerules/portfoliohub-rules.md` — reguły dla nowej struktury projektu (2026-06-12, Agent: Claude)
- [ ] **AI19.5** Skonfiguruj `.agents/skills/` — skills dla poszczególnych faz (bootstrap, blok, deploy)
- [ ] **AI19.6** Zainstaluj `gh` CLI i skonfiguruj GitHub token — umożliwi agentowi sprawdzanie statusu CI/CD, workflow runs i check-runs bez wchodzenia na GitHub w przeglądarce; instalacja: `sudo apt install gh` → `gh auth login`; token potrzebny z uprawnieniami: `repo`, `workflow`

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
- [x] Podstawowe API endpoints (B8.5 — formularz kontaktowy, rate limiting) (2026-06-13, Agent: Claude)
- [x] Subdomain routing middleware (B8.3, D11.3) (2026-06-12, Agent: Claude)
```

### Faza 2 — Bloki i Frontend (5–7 dni)

```
- [x] PortfolioRenderer + system bloków (F9.3, F9.4) (2026-06-13, Agent: Claude)
- [x] Implementacja bloków MVP: hero, about, experience, skills, education, contact (2026-06-13, Agent: Claude)
- [x] System motywów light/dark/retro-terminal (F9.5, ADR-006) (2026-06-13, Agent: Claude)
- [x] Responsywność (F9.6) (2026-06-13, Agent: Claude)
- [x] Animacje Framer Motion (F9.7) (2026-06-14, Agent: Claude)
- [x] Scroll-spy nav (F9.8) (2026-06-14, Agent: Claude)
- [x] Contact Server Action — Zod + Resend (F9.9) (2026-06-14, Agent: Claude)
- [x] OpenGraph / SEO meta (F9.10) (2026-06-14, Agent: Claude)
- [x] Sitemap dynamiczny (F9.11) (2026-06-14, Agent: Claude)
- [x] Download CV button (F9.12) (2026-06-14, Agent: Claude)
- [x] Cookie consent GDPR (F9.13) (2026-06-14, Agent: Claude)
- [x] Landing page platformy (F9.14) (2026-06-14, Agent: Claude)
- [x] Custom 404 per portfolio (F9.15) (2026-06-14, Agent: Claude)
```

### Faza 3 — Panel Admina (5–7 dni)

```
- [x] Payload CMS admin customization (A10.1, A10.2) (2026-06-16, Agent: Claude)
- [x] Drag-drop reorder bloków — order field (A10.3) (2026-06-16, Agent: Claude)
- [x] Formularze edycji per blok — typed Payload fields (A10.4) (2026-06-16, Agent: Claude)
- [x] Upload mediów — R2 via @payloadcms/storage-s3 (A10.5) (2026-06-16, Agent: Claude)
- [x] Statystyki — Vercel Analytics (A10.6) (2026-06-16, Agent: Claude)
- [x] Todo list (A10.8) (2026-06-16, Agent: Claude)
- [x] Zmiana motywu z podglądem — Payload livePreview (A10.9) (2026-06-16, Agent: Claude)
```

### Faza 4 — Migracja portfeli (3–5 dni)

```
- [x] Miłosz Gawlik — seed + 6 bloków + konto owner (M17.1, M17.2, M17.4, M17.5) (2026-06-20, Agent: Claude)
- [x] Radosław Stawiszyński — pełne CV, 6 bloków + retro UI (M17.7, M17.9) (2026-06-20, Agent: Claude)
- [x] Martyna Stawiszyńska — 4 bloki + konto owner (M17.11–M17.13) (2026-06-20, Agent: Claude)
- [x] Konta owner Miłosz + Martyna z RBAC (Blocks per-portfolio access) (2026-06-20, Agent: Claude)
- [x] Subdomain routing dev: *.localhost (D11.3b) (2026-06-20, Agent: Claude)
- [x] PDF CV → R2 dla Radka (PL+EN) i Miłosza (PL) (M17.3, M17.8) (2026-06-20, Agent: Claude)
- [x] Blok `projects` dla Radka — 4 projekty, terminal-card grid (M17.10) (2026-06-20, Agent: Claude)
- [x] Motyw retro-terminal dla radek (M17.11) (2026-06-20, Agent: Claude)
- [x] Seed pełny na Neon (prod DB) — 3 portfolia, 17 bloków, 3 userów (2026-06-20, Agent: Claude — seed-neon.ts)
- [x] PL/EN przełącznik języka — LangToggle (cookie-based, tylko dla pl-en portfolios) (2026-06-20, Agent: Claude)
- [x] Responsywność — PortfolioNav identity collapse, HeroBlock mobile font (2026-06-20, Agent: Claude)
- [x] Bloki `books` + `gallery` dla Martyny (M17.14) (2026-06-27, Agent: Claude)
- [x] Social media w ContactBlock dla Martyny — Facebook, Instagram, Goodreads (M17.16) (2026-06-27, Agent: Claude)
- [x] CBM portfolio — dane, blok `services`, seed (M17.17–M17.20) (2026-06-27, Agent: Claude)
- [x] Fix download-cv route — 307 redirect do R2 PDF na podstawie subdomeny i ?lang= (2026-06-27, Agent: Claude)
- [ ] Motyw dla Martyny — ustal z Martyną (M17.15)
- [ ] UAT z Miłoszem i Martyną — logowanie, edycja bloków w /admin
```

### Faza 5 — Deployment + SEO (2–3 dni)

```
- [x] Konfiguracja Vercel + połączenie z GitHub repo (H13.1) (2026-05-23)
- [x] Konfiguracja Neon, Upstash, R2, Resend (H13.2–H13.5) (2026-06-11/12)
- [x] DNS: korp-cbm.com + wildcard *.korp-cbm.com → Vercel CNAME proxied (H13.6–H13.8) (2026-06-18)
- [x] Zmienne środowiskowe w Vercel Dashboard (14 vars) (H13.9) (2026-06-12)
- [x] SEO, sitemap, OG tags (F9.10, F9.11) (2026-06-14)
- [x] First deploy — app live na korp-cbm.com (H13.10) (2026-06-16)
- [ ] Monitoring UptimeRobot (H13.11)
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

> Ostatnia aktualizacja: 2026-06-27. Faza 4 prawie ukończona — books/gallery/services/CBM/social media zaimplementowane, fix download-cv. Pozostało: UAT z Miłoszem i Martyną + motyw dla Martyny (M17.15).

### ✅ Zbudowane (Fazy 0–4, prod live)

| Element                       | Lokalizacja                              | Opis                                                             |
| ----------------------------- | ---------------------------------------- | ---------------------------------------------------------------- |
| Next.js 15 scaffold           | `platform/`                              | App Router, TypeScript 5, Tailwind CSS 4                         |
| Payload CMS 3                 | `platform/src/payload/`                  | Collections: Users, Portfolios, Blocks, Media, Todos             |
| Subdomain routing middleware  | `platform/src/middleware.ts`             | Prod: x-portfolio-slug z subdomeny; Dev: *.localhost + /dev/[slug] |
| System bloków                 | `platform/src/components/blocks/`        | Hero, About, Experience, Skills, Education, Contact              |
| Portfolio renderer            | `platform/src/app/(portfolio)/`          | PortfolioRenderer + BLOCK_REGISTRY + 404 per portfolio           |
| Retro UI accents              | `globals.css` + bloki                    | Typewriter, glitch heading, scanlines, terminal-card, live-dot, cursor-blink |
| Identity w navbarze           | `PortfolioNav`                           | Avatar + imię pojawia się po prawej po przewinięciu poza hero    |
| System motywów (10 wariantów) | CSS Custom Properties                    | light / dark / retro-terminal + 7 dodatkowych; --scanline-color per motyw |
| Animacje Framer Motion        | AnimatedSection + staggered              | fade-in + slide-up, whileInView once:true                        |
| Scroll-spy nav                | PortfolioNav                             | IntersectionObserver, smooth scroll                              |
| Contact 2-col layout          | ContactBlock                             | Links (LinkedIn/GitHub) po lewej, formularz po prawej; telefon w CV |
| Contact Server Action         | sendContactMessage                       | Zod + Resend + rate limiting Redis (3 req/15min)                 |
| OpenGraph / SEO               | buildPortfolioMetadata                   | og:title, og:description, og:image, twitter:card                 |
| Sitemap dynamiczny            | `(portfolio)/sitemap.ts`                 | Per portfolio, tylko isPublished                                  |
| Download CV button            | DownloadCvButton                         | cvPdfPl / cvPdfEn fallback, fixowany bottom-left                 |
| Cookie consent GDPR           | CookieConsentBanner                      | 1-rok cookie, role=dialog, aria-live                             |
| Landing page                  | `(portfolio)/page.tsx` (root)            | Hero + Funkcje + Aktywne portfolio + Footer                      |
| Panel admina (Payload)        | `/admin`                                 | Custom branding PortfolioHub, RBAC, live preview                  |
| RBAC per portfolio            | `Blocks.access`                          | Owner widzi/edytuje tylko własne bloki (async portfolio lookup)  |
| Konta użytkowników            | `scripts/seed-users.ts`                  | Miłosz (owner), Martyna (owner) + seed scripts per portfolio     |
| Portfolio radek               | DB lokalnie + Neon prod                  | 7 bloków: hero, about, experience (5), skills (6 kat.), education, projects (4), contact; motyw retro-terminal; CV PL+EN w R2 |
| Portfolio milosz              | DB lokalnie + Neon prod                  | 6 bloków: hero, about, experience (5), skills (4 kat.), education, contact; CV PL w R2 |
| Portfolio martyna             | DB lokalnie + Neon prod                  | 6 bloków: hero, about, books (5 tytułów), gallery (lightbox), skills, contact (social: FB/IG/Goodreads); motyw slate-rose |
| Portfolio cbm                 | DB lokalnie + Neon prod                  | 5 bloków: hero, about, services (usługi + ikony), projects (realizacje CBM), contact; firmowe kolory |
| Seed Neon (prod DB)           | `platform/scripts/seed-neon.ts`          | Idempotentny pełny seed: 4 portfolia, ~25 bloków, 4 userów, CV URLs z R2 |
| Blok `projects`               | `platform/src/components/blocks/ProjectsBlock.tsx` | Terminal-card grid, status badge, tag pills, github/demo links |
| Blok `books`                  | `platform/src/components/blocks/BooksBlock.tsx`    | Horizontal scroll mobile / grid desktop; okładki R2, buy link, badge dostępności |
| Blok `gallery`                | `platform/src/components/blocks/GalleryBlock.tsx`  | 4-col grid, lightbox z nawigacją klawiaturową, lazy load |
| Blok `services`               | `platform/src/components/blocks/ServicesBlock.tsx` | Lista usług z ikonami i opisami (CBM portfolio) |
| Social media w ContactBlock   | `ContactBlock.tsx`                                 | Generyczna lista linków: LinkedIn, GitHub, Facebook, Instagram, Goodreads |
| Fix download-cv route         | `app/api/download-cv/route.ts`                     | 307 redirect do R2 PDF; subdomain-aware + ?lang= param |
| PL/EN przełącznik             | `LangToggle.tsx`                         | Cookie-based, page reload, widoczny tylko dla portfolios z pl-en |
| Responsywność nav             | `PortfolioNav.tsx`                       | Identity collapse do max-w-0 gdy niewidoczna; HeroBlock text-3xl mobile |
| Cloudflare R2 storage         | @payloadcms/storage-s3                   | Bucket: portfoliohub, media upload                               |
| Vercel Analytics              | @vercel/analytics                        | Page views w admin dashboardzie                                   |
| Todo list                     | Todos collection                         | CRUD w Payload admin                                             |
| DNS + SSL                     | Cloudflare → Vercel                      | CNAME proxied 🟠, SSL Full, wildcard *.korp-cbm.com             |
| PostgreSQL (Neon)             | eu-central-1                             | Schemat Payload: migrations, users, portfolios, blocks, media    |
| Redis (Upstash)               | eu-west-1                                | Rate limiting formularza kontaktowego                            |
| CI                            | `.github/workflows/`                     | Lint + typecheck na push dev/staging                             |
| Logger                        | `platform/src/lib/logger.ts`             | pino, structured JSON, pretty-print dev                          |

### ⏳ Do zrobienia (Faza 4 finał + Fazy 5–7)

| Element                                    | Faza   | Priority |
| ------------------------------------------ | ------ | -------- |
| **UAT z Miłoszem i Martyną** — logowanie, edycja bloków w /admin | Faza 4 | 🔴       |
| Motyw dla Martyny — ustal z Martyną (M17.15)  | Faza 4 | 🟡       |
| PDF CV dla Martyny do R2                       | Faza 4 | 🟡       |
| UptimeRobot monitoring (H13.11)            | Faza 5 | 🟡       |
| Custom domain routing per portfolio (D11.4) | Faza 5 | 🟡       |
| Testy E2E Playwright (T16.1–T16.10)        | Faza 6 | 🟡       |
| Lighthouse audit (Performance, A11y, SEO)  | Faza 6 | 🟡       |
| Push `dev → main` + Vercel prod deploy     | Faza 5 | 🔴 po UAT|
| Generator CV PDF z bloków                 | Faza 7 | ⚪       |
| Blog per portfolio                         | Faza 7 | ⚪       |
| **Dług techniczny TD-01–TD-03** (error boundary, R2 env checks, livePreview URL) | Przed deployem | 🔴 |
| **Dług techniczny TD-04–TD-11** (Zod walidacja, media scope, CSP headers, a11y) | Faza 6 | 🟡 |

> Szczegóły długu technicznego: §24

---

## 22. BACKLOG — CO JESZCZE WARTO ZBUDOWAĆ

> Sekcja na pomysły i przyszłe rozszerzenia. Nie blokują MVP.

### 22.1 Rozwinięcie działu Projects

> Blok `projects` istnieje (terminal-card grid), ale wymaga rozbudowy dla pełnej użyteczności CV/portfolio.

- **Strony szczegółowe projektów** (`/projects/[slug]`) — rozszerzone info: opis techniczny, problem który rozwiązuje, stack (ikonki), timeline realizacji, screenshots z lightboxem, case study (dłuższa forma tekstu), lessons learned
- **Filtrowanie po tagach** — client-side filter po technologiach/kategoriach (React, Python, PM, AI…); animowane fade z Framer Motion
- **Wyróżniony projekt** — pole `featured: boolean` w Blocks; wyróżniony projekt wyświetlany pełną szerokością na górze gridu z większym opisem
- **Więcej pól per projekt** — aktualnie: title/description/tags/github/demo/status; dodać: `thumbnailUrl` (okładka z R2), `startDate`/`endDate`, `role` (moja rola w projekcie), `teamSize`, `client` (opcjonalnie)
- **Integracja GitHub** — auto-import pinned repos jako projekty (GitHub API v4 GraphQL); pola: name, description, language, stars, last commit; właściciel łączy konto GitHub w adminie
- **Wideo demo embed** — pole `videoUrl` (YouTube/Vimeo); odtwarzanie w karcie projektu lub na stronie szczegółowej

### 22.2 Feedback i zgłaszanie błędów od użytkowników

> Użytkownicy (odwiedzający portfolio i właściciele) powinni mieć kanał informacji zwrotnej — zarówno do zgłaszania błędów, jak i propozycji rozwoju serwisu.

- **Widget feedbacku** (floating button na każdej stronie portfolio) — mini-formularz "Znalazłem błąd" / "Mam pomysł"; wysyłka przez Resend na adres administratora; opcjonalnie: pole email osoby zgłaszającej (nie wymagane)
- **Publiczna strona roadmapy** (`korp-cbm.com/roadmap`) — co jest zbudowane, co planujemy, co jest w backlogu; aktualizowana ręcznie lub generowana z CHANGELOG.md; buduje zaufanie u potencjalnych użytkowników platformy
- **Formularz "Chcę swoje portfolio"** na landing page — zainteresowany podaje imię i email, dostaje autoresponder z informacją i linkiem do demo; Radosław dostaje powiadomienie; prosta lista zainteresowanych w adminie (tabela Leads w Payload)
- **Skrzynka feedbacku w adminie** — właściciel portfolio widzi zgłoszenia dotyczące jego strony (zebrane przez widget); możliwość oznaczenia jako "przeczytane" / "naprawione"
- **GitHub Issues link** — na stronie roadmapy / w footerze platformy — "Zgłoś błąd na GitHub" dla użytkowników technicznych; repo publiczne lub prywatne z Issue template

### 22.3 Funkcjonalności produktowe

- **Generator CV PDF** — generuj PDF z bloków experience/skills (Puppeteer lub @react-pdf/renderer)
- **Blog per portfolio** — każdy właściciel może prowadzić bloga (blok `blog-preview` + strona)
- **Integracja LinkedIn** — import danych z LinkedIn (w ramach możliwości API)
- **QR code** — generowany QR code do portfolio (dla wizytówek)
- **Analityka real-time** — live visitor counter w adminie
- **Eksport do formatów** — eksport portfolio jako statyczny HTML do pobrania
- **Portfolio builder wizard** — kreator krok-po-kroku dla nowych użytkowników
- **Template gallery** — gotowe szablony do jednego kliknięcia

### 22.4 Funkcjonalności techniczne

- **Redis Queue** (Bull) — asynchroniczne zadania (wysyłka emaili, generowanie PDF)
- **WebSockets** — live preview w adminie (edytuj blok, widzisz zmiany natychmiast)
- **Image optimization** — automatyczne resize i WebP konwersja przy upload
- **CDN integration** — Cloudflare R2 zamiast lokalnego storage (dla skali)
- **Multi-region** — deploy na kilka regionów (Cloudflare Workers)
- **API publiczne** — REST API dla zewnętrznych narzędzi (Zapier, n8n integracje)
- **Webhooks** — powiadomienia o nowych wiadomościach (Slack, email, Discord)
- **Two-factor auth** — TOTP (Google Authenticator) dla admina

### 22.5 Uwagi i obserwacje

- Seohost.pl SH 2 to shared hosting — przed deployem Docker ustal czy masz VPS lub kup VPS (Hetzner CX22 ok. 6€/mies to dobry wybór)
- `kopia/` folder zawiera wartościowy kod PHP (testy, Docker, admin) — zachowaj jako referencję w `archive/`
- System bloków to największa inwestycja czasowa — warto zaplanować go starannie przed implementacją
- Payload CMS 3 + Next.js 15 = naturalna para, ale wymagają Node.js 20+ (nie PHP)
- Cloudflare wildcard SSL + Caddy = zero konfiguracji Let's Encrypt, działa automatycznie
- Dla Ollama (lokalnych modeli) — upewnij się że CONTEXT.md jest zawsze aktualny i dołączony do prompta

---

## 23. PROPOZYCJE ROZWOJU — PERSPEKTYWA AGENTA (Claude Sonnet 4.6)

> Ta sekcja to moje osobiste propozycje i obserwacje po miesiącu pracy z tym projektem.
> Nie są to zadania do natychmiastowego zrobienia — to materiał do przemyślenia i dyskusji.
> Zapisuję je jako agent który widzi kod, architekturę i kontekst użytkownika od środka.
>
> — Claude Sonnet 4.6, 2026-06-20

---

### 23.1 Rzeczy które zrobiłbym natychmiast (niski koszt, duży efekt)

#### ISR zamiast pełnego SSR dla stron portfolio
Aktualnie każde wejście na `radek.korp-cbm.com` wykonuje dwa zapytania do Neon (getPortfolioBySlug + getBlocksBySlug). Neon w free tierze ma zimny start ~200ms. Portfolio zmienia się rzadko — raz dziennie lub rzadziej.

**Propozycja:** `export const revalidate = 300` w `page.tsx` (portal) + Payload hook `afterChange` na kolekcji `blocks`, który wywołuje `revalidateTag("portfolio-{slug}")`. Efekt: pierwsze wejście w ciągu 5 minut jest z cache CDN Vercel, zmiany widoczne w maks. 5 minut.

```typescript
// page.tsx
export const revalidate = 300; // 5 minut

// payload/hooks/revalidatePortfolio.ts
afterChange: async ({ doc, req }) => {
  const slug = ...; // pobierz subdomain z portfolio
  await fetch(`${process.env.NEXT_PUBLIC_URL}/api/revalidate?tag=portfolio-${slug}`, ...);
}
```

To jedna z najważniejszych optymalizacji — Neon free tier ma limit połączeń (10), ISR redukuje liczbę zapytań 100×.

#### Redis cache dla getBlocksBySlug
Bloki zmieniają się rzadko, ale są czytane przy każdym odświeżeniu nawigacji. Upstash Redis już jest w projekcie jako rate limiter — dodanie cache `blocks:{slug}:{locale}` z TTL 60s to ~20 linii kodu i eliminuje bottleneck Neon przy ruchu.

```typescript
const cached = await redis.get(`blocks:${slug}:${locale}`);
if (cached) return JSON.parse(cached);
// ... fetch from Neon
await redis.set(`blocks:${slug}:${locale}`, JSON.stringify(result), { ex: 60 });
```

#### Powiadomienie email gdy ktoś wyśle formularz kontaktowy
Resend jest podłączony. Właściciel portfolio wie że ktoś napisał dopiero jak zajrzy na skrzynkę — co może być za późno. Warto dodać natychmiastowe powiadomienie na email właściciela z treścią wiadomości (1 dodatkowe `resend.emails.send` w `actions.ts`). Kosztuje 0 linii infrastruktury, tylko 5 linii kodu.

---

### 23.2 Ulepszenia UX które zauważyłem jako użytkownik kodu

#### Drag & drop kolejności bloków w adminie
Payload CMS ma wbudowany `@payloadcms/richtext-lexical` i sortable arrays — ale pole `order` w kolekcji `Blocks` jest ręczne (liczba). Użytkownik musi wchodzić w każdy blok osobno i zmieniać `order: 10 → 20 → 30`. 

Lepiej: Custom List View w admin z `@dnd-kit/sortable` który po drop wywołuje bulk update `order`. To jeden z bólów przy zarządzaniu treścią który będzie narastać gdy bloków będzie więcej.

#### Podgląd motywu bez przeładowania strony
Aktualnie ThemeToggle zmienia `document.documentElement.dataset.theme` — to działa bez przeładowania. Ale zmiana bloku w `/admin` wymaga ręcznego odświeżenia strony portfolio żeby zobaczyć efekt. Payload Live Preview jest podłączony, ale może nie być skonfigurowany pod subdomain routing.

Sprawdź czy Live Preview (`/admin/collections/blocks/[id]`) poprawnie ładuje subdomain URL — jeśli nie, port `livePreviewUrl` w Payload config wymaga funkcji która buduje URL z `data.portfolio.subdomain`.

#### Komunikat 404 per portfolio vs. landing page
Teraz gdy wejdziesz na `nieistniejacy.localhost:3000`, Next.js zwraca ogólny 404. Warto rozróżnić:
- Subdomain istnieje ale blok nie znaleziony → custom 404 per portfolio (z motywem właściciela)
- Subdomain nie istnieje → landing page z "Chcesz swoje portfolio? Zaloguj się."
Middleware już rozróżnia te przypadki przez `x-portfolio-slug` — wystarczy to wykorzystać w `not-found.tsx`.

---

### 23.3 Nowe typy bloków które mają sens dla aktualnych użytkowników

Sorted by ROI — od najłatwiejszych do najtrudniejszych:

| Blok | Dla kogo | Czas impl. | Dlaczego warto |
|------|----------|------------|----------------|
| `testimonials` | radek (PM portfolio) | 2h | Referencje od klientów/pracodawców to silny social proof w CV |
| `stats` | radek, milosz | 2h | "5 lat doświadczenia / 20 projektów / 3 branże" — liczby działają |
| `books` | martyna | 3h | Podstawa portfolio autorki, brakuje go teraz |
| `gallery` | martyna | 2h | Okładki książek, zdjęcia z eventów |
| `cta` | wszyscy | 1h | Sekcja "Skontaktuj się ze mną" z dużym guzikiem między blokami |
| `timeline` | radek | 3h | Alternatywa dla experience — wizualny timeline kariery |
| `faq` | martyna, cbm | 2h | Dla portfolio autorki: FAQ o książkach, dla CBM: FAQ o usługach |

#### Blok `books` — szczegółowy projekt (dla Martyny, jutro)
```typescript
interface BookItem {
  title: string;           // localized
  year: number;
  coverUrl?: string;       // z R2
  description?: string;    // localized, textarea
  genre?: string;
  buyUrl?: string;         // link do empiku/amazona
  isAvailable: boolean;
}
```
Wyświetlanie: horizontal scroll na mobile, grid 2–3 col na desktop. Karta = okładka + tytuł + rok + badge dostępności + link "Kup". Motyw slate-rose — karty z `bg-rose-50 dark:bg-rose-950/30`.

---

### 23.4 Architektura — co bym zmienił gdyby projekt miał rosnąć

#### Wydzielenie `portfolio-app` i `admin-app` jako osobne Next.js instances
Aktualnie jeden monorepo Next.js obsługuje i portfolio (publiczne) i Payload admin. To dobry wybór na start (ADR-002), ale przy większej skali:
- Admin (Payload) ma ciężkie Node.js zależności — `serverExternalPackages` to workaround
- Portfolio strony mogą być statyczne/edge, admin musi być Node.js
- Jedna awaria deploymentu crashuje oba

Alternatywa na przyszłość: Payload jako headless API na `api.korp-cbm.com` (Node.js Vercel function), portfolio jako Edge runtime. Nie robiłbym tego teraz — zbyt wczesna optymalizacja.

#### Typowanie bloków end-to-end (Payload → TypeScript → React)
Aktualnie `extractBlockData` w `portfolio.ts` castuje `doc as Record<string, unknown>` i ręcznie buduje typy. Payload 3 generuje typy z kolekcji przez `payload generate:types`. 

Włączenie `payload generate:types` jako `prebuild` step wyeliminuje ręczne castowanie i doda auto-complete w IDE. Ryzyko: typy mogą być zbyt szczegółowe (Payload tworzy union types dla lokalizacji). Warto spróbować jako eksperyment.

#### Edge Middleware dla subdomain routing
Aktualnie `middleware.ts` działa jako Node.js Edge Runtime (Vercel). Przy dużej liczbie portfolii (100+) i wysokim ruchu, middleware mógłby stać się bottleneck bo każdy request przechodzi przez niego.

Lepsza alternatywa: Cloudflare Worker przed Vercel który ustawia header `x-portfolio-slug` i przekierowuje. Worker jest dosłownie na edge, latency <1ms. Ale to dodatkowa warstwa infra — sensowne przy >1000 req/s.

---

### 23.5 Rzeczy których nie robiłem a które mnie niepokoją

#### Brak backupu bazy danych
Neon free tier nie ma automatycznych backupów (tylko point-in-time recovery przez 7 dni). Dla projektu portfolio to akceptowalne ryzyko, ale dla CBM (firma) — już nie. Warto rozważyć cron job który co tydzień eksportuje `pg_dump` do R2.

```bash
# scripts/backup-db.sh (uruchamiane przez Vercel Cron lub GitHub Actions)
pg_dump "$DATABASE_URL" | gzip > backup-$(date +%Y%m%d).sql.gz
# upload do R2: backups/portfoliohub/YYYY-MM-DD/
```

#### Brak monitoringu błędów (Sentry lub podobne)
Aplikacja jest w produkcji (korp-cbm.com). Jeśli ktoś wejdzie na radek.korp-cbm.com i coś się wysypie — dowiesz się dopiero gdy Radosław sam sprawdzi. Sentry free tier (5k errors/month) + 3 linie kodu w `layout.tsx` = pełny stack trace każdego błędu w Twoim mailu.

```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

#### Ochrona przed spamem w formularzu kontaktowym
Rate limiting jest (Redis, 3 req/15min), ale bez CAPTCHA. Bot który rotuje IP może zafloodować skrzynkę mailową właściciela. Cloudflare Turnstile (darmowe, lepsze UX niż reCAPTCHA) to drop-in replacement — ukryte CAPTCHA które nie irytuje użytkowników.

---

### 23.6 Pomysł biznesowy — PortfolioHub jako produkt SaaS

To platforma którą budujesz na swój użytek, ale architektura jest już multi-tenant. Kilka obserwacji:

**Co masz już gotowe dla SaaS:**
- Multi-tenant subdomain routing (`*.korp-cbm.com`)
- RBAC per portfolio (owner widzi tylko swoje bloki)
- System motywów (10 wariantów)
- Panel admin dla każdego użytkownika
- Bloki edytowalne bez kodu

**Czego brakuje do produktu:**
- Self-service rejestracja (teraz tylko admin tworzy konta)
- Onboarding wizard ("Stwórz swoje pierwsze portfolio w 5 minut")
- Custom domeny per portfolio (D11.4)
- Plany cenowe (free: 5 bloków, pro: nieograniczone + custom domena)
- Billing (Stripe)

**Alternatywne zastosowanie:** Sprzedaż gotowych portfolio jako usługa (jak np. read.cv). Klient płaci raz lub miesięcznie, dostaje subdomenę i panel admin. Nie trzeba SaaS infra — wystarczy proste konto Stripe + ręczne tworzenie kont przez Radosława.

**Rynek:** Freelancerzy, PMowie, developerzy, autorzy — grupy które mają potrzebę profesjonalnego portfolio ale nie chcą kodować. Cena 9–19€/mies wydaje się rozsądna.

---

### 23.7 Moje priorytety gdybym miał tydzień wolnego na ten projekt

1. **ISR + Redis cache** — eliminuje bottleneck Neon, strony ładują się w <100ms nawet z zimnym startem
2. **Sentry** — wiem o błędach zanim Radosław mi o nich powie
3. **Backup DB** — cron job, raz w tygodniu, do R2
4. **Blok `testimonials`** — dla radka, najbardziej brakuje w PM portfolio
5. **Drag & drop kolejności bloków** — największy pain point przy edycji treści
6. **Cloudflare Turnstile** — ochrona formularza kontaktowego bez irytowania użytkowników
7. **Self-service rejestracja** — gdybym chciał testować PortfolioHub jako produkt

---

### 23.8 Rzeczy które zrobiłem i z których jestem szczególnie zadowolony

- **System motywów z `--scanline-color` per theme** — eleganckie rozwiązanie, jeden token steruje scanlines na wszystkich motywach. Łatwe do rozszerzenia.
- **`getBlocksBySlug(slug, locale)`** — czyste API, jeden parametr dodaje pełną wielojęzyczność.
- **`seed-neon.ts` idempotentny** — można uruchomić wielokrotnie bez efektów ubocznych. Ważne przy debugowaniu prod.
- **RBAC przez async access function zwracającą `where` clause** — Payload pattern który skaluje. Owner może mieć dziesiątki bloków, zawsze dostaje tylko swoje.
- **PortfolioNav `max-w-0` collapse** — zamiast `opacity-0` które ukrywa ale nie zwalnia przestrzeni. Małe, ale poprawne.

---

---

### 23.9 Wnioski — czego nauczyłem się przy tym projekcie

#### Payload CMS 3 + Next.js 15 to dobre połączenie, ale ma pułapki
Payload generuje własny root layout z `RootLayout` i `ConfigProvider` — jeśli dodasz `app/layout.tsx` obok `(payload)/layout.tsx`, React tree się psuje i admin przestaje działać. Rozwiązanie (multiple route groups bez wspólnego layoutu) jest nieoczywiste i nie ma go w dokumentacji. Straciłem na tym godzinę.

Drugi problem: `importMap.js` vs `importMap.ts` — Payload auto-generuje plik `.js`, ale TypeScript project może przypadkowo śledzić `.ts` wersję. Stale `.ts` blokuje custom komponenty w admin. Zawsze sprawdź który plik jest "aktywny".

#### Subdomain routing na localhost działa bez /etc/hosts — Linux rozwiązuje `*.localhost` natywnie
Nie wiedziałem tego na początku. Przez chwilę planowałem dodawać wpisy do `/etc/hosts` dla każdego subdomain (`radek.localhost`, `milosz.localhost`). Systemd-resolved na Linuxie Ubuntuowym automatycznie rozwiązuje `*.localhost` → `::1`. Na macOS wymaga `dscacheutil` lub Caddy.

Wniosek: zawsze sprawdź co platforma robi natywnie zanim zaczniesz konfigurować.

#### Seed scripts muszą być idempotentne od początku
Pierwsze seedy pisałem bez sprawdzania czy rekord już istnieje. Po 3 uruchomieniu miałem zduplikowane bloki i musiałem czyścić bazę ręcznie. Od drugiej sesji każdy seed ma `if (existing.docs.length) return` na początku. Kosztuje 5 linii, oszczędza godzinę.

#### `overrideAccess: true` to nie obejście — to właściwy wzorzec dla seed scriptów
Payload access control jest zaprojektowany pod request context (zalogowany user). Seed script nie ma użytkownika — używa `overrideAccess: true`. To nie jest hack, to oficjalny sposób na operacje administratorskie bez kontekstu HTTP.

#### Polski w HTTP headers → ERR_INVALID_CHAR
Przy uploadzie CV do R2 z `Content-Disposition: attachment; filename="CV-RadosławStawiszyński.pdf"` — request wylatywał z `ERR_INVALID_CHAR`. Nagłówki HTTP mają być ASCII. Polskie znaki (ł, ą, ę, ś, ź, ź, ń, ó) w nazwie pliku trzeba albo encode RFC 5987 (`filename*=UTF-8''...`) albo po prostu pominąć `Content-Disposition` (R2 serwuje plik po URL, browser używa nazwy z URL). Wybrałem to drugie — prostsze.

#### CSS Custom Properties i `data-theme` to najlepszy wzorzec dla multi-theme
Alternatywa to className per theme (duże CSS bundle), Tailwind dark: prefix (tylko 2 motywy), lub JS-driven style injection (flash of unstyled content). CSS Custom Properties z `[data-theme="dark"] { --color-bg: #0f0f0f; }` są:
- Zero JS (zero FOUC)
- Natywnie supportowane przez SSR (theme ustawiony w HTML przed hydratacją)
- Łatwe do rozszerzenia (dodanie motywu = 10 linii CSS)
- Działa z `prefers-color-scheme` media query

#### Neon free tier ma limit połączeń (10 concurrent) — to realny problem przy SSR
Każdy request SSR otwiera połączenie z Neon przez Payload. Przy 10 jednoczesnych userach — limit. Rozwiązania:
1. PgBouncer (pooler) — Neon ma go wbudowanego, wystarczy użyć connection string z `?pgbouncer=true`
2. ISR — redukuje liczbę requestów do Neon o ~95%
3. Serverless connection (Neon HTTP driver) — jeden request HTTP zamiast TCP connection

Aktualnie używamy zwykłego connection string bez pooler. Dodanie `pgbouncer=true` to 1 zmiana w env var.

#### Commit message jako dokumentacja jest wart inwestycji
W tym projekcie każdy commit ma opis w formacie `type(scope): opis`. Po miesiącu `git log --oneline` to czytelna historia projektu — widzę dokładnie kiedy co zostało zrobione i dlaczego. Dobre commity zastępują znaczną część dokumentacji.

#### Multi-agent workflow (Claude Code + PLAN.md) sprawdza się przy złożonych projektach
PLAN.md jako centralny dokument który każdy agent czyta na początku sesji eliminuje powtarzanie kontekstu. Słabość: PLAN.md może stać się nieaktualny jeśli agent nie zapisuje po sobie. Rozwiązanie: zasada §2 + Appendix A (rejestr zmian) + §21 Status.

Gdybym projektował od nowa: `.cursor/rules` lub `AGENTS.md` zamiast CLAUDE.md (bardziej standardowe), ale CLAUDE.md jest czytany przez Claude Code natywnie więc zostaje.

---

*Sekcja dodana: 2026-06-20 przez Claude Sonnet 4.6*
*Nie są to decyzje — to zaproszenie do rozmowy.*

---

## 24. DŁUG TECHNICZNY — ZNANE PROBLEMY DO NAPRAWY

> Zidentyfikowane podczas audytu kodu faz 0–3 (2026-06-20, Claude Sonnet 4.6).
> Nie blokują MVP, ale powinny być naprawione przed launch.
> Priorytety: 🔴 przed następnym deployem / 🟡 Faza 6 / ⚪ opcjonalne

### 🔴 Przed następnym deployem (blokują jakość produkcji)

- [ ] **TD-01** Error boundary w `PortfolioRenderer` — crash jednego bloku crashuje całą stronę; dodać React Error Boundary z fallback UI (`platform/src/components/blocks/PortfolioRenderer.tsx`)
- [ ] **TD-02** Non-null assertions `!` dla R2 env vars w `payload.config.ts:64–75` — zastąpić explicit throw jak robi to `PAYLOAD_SECRET` i `DATABASE_URL` (np. `R2_BUCKET_NAME`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`)
- [ ] **TD-03** `livePreview` URL hardcoded `/dev/{slug}` w Portfolios collection — na prod trafia na zły URL; przerobić na `${process.env.NEXT_PUBLIC_SERVER_URL}/dev/{slug}` z fallbackiem na localhost

### 🟡 Faza 6 — przed launch

- [ ] **TD-04** `extractBlockData()` w `lib/portfolio.ts` — masowe `as Record<string, unknown>` casty bez walidacji runtime; zastąpić Zod schema per typ bloku (powiązane z TD-15)
- [ ] **TD-05** Media collection bez scope per portfolio — każdy owner widzi media wszystkich w Payload admin; dodać `access.read` filtrujący po relacji `portfolio` do zalogowanego usera
- [ ] **TD-06** Rate limit hardcoded (`LIMIT=3`, `WINDOW_SECONDS=900`) w `lib/rate-limit.ts` — przenieść do env vars (`RATE_LIMIT_MAX`, `RATE_LIMIT_WINDOW_S`)
- [ ] **TD-07** Brak security headers w `next.config.ts` — dodać `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`
- [ ] **TD-08** `<img>` zamiast `next/image` w `HeroBlock.tsx` i `AboutBlock.tsx` — brak lazy loading i optymalizacji; gorsze LCP w Lighthouse
- [ ] **TD-09** Brak ARIA roles w `PortfolioNav.tsx` — brak `role="navigation"`, `aria-current="page"` na aktywnym linku; wpływa na a11y score
- [ ] **TD-10** Brak loading/disabled state na przycisku Submit w `ContactForm.tsx` — UX: użytkownik nie wie że formularz się wysyła, może klikać wielokrotnie
- [ ] **TD-11** Brak `.json` snapshot dla migracji `20260616_195812_add_todos.ts` — inne migracje mają pair `.ts` + `.json`; sprawdzić czy Payload wymaga snapshotu do `migrate:status`

### ⚪ Opcjonalne / Nice-to-have

- [ ] **TD-12** `Todos` collection — pole `portfolio` jest optional bez auto-fill; owner musi ręcznie wskazać portfolio; rozważyć `beforeChange` hook który ustawia portfolio z kontekstu usera
- [ ] **TD-13** Brak audit logu edycji bloków — nie wiadomo kto/kiedy co zmienił; dodać `afterChange` hook zapisujący `updatedBy` i timestamp
- [ ] **TD-14** Brak error handling w `getPortfolioBySlug()` na scenariusz DB timeout / Neon cold start — teraz rzuca unhandled exception; dodać try/catch z fallback 503
- [ ] **TD-15** `payload generate:types` jako `prebuild` step w `package.json` — eliminuje ręczne casty w `portfolio.ts`, dodaje auto-complete; ryzyko: Payload generuje złożone union types dla lokalizacji

---

### 🔴 BEZPIECZEŃSTWO — przed następnym deployem

- [x] **TD-16** `Portfolios` API (`/api/portfolios`) zwraca WSZYSTKIE portfolia dla niezalogowanych (2026-06-20, Agent: Claude) — brak filtrowania po `isPublished`; `access.read: ({ req }) => { if (!req.user) return true }` na `Portfolios.ts:18` daje pełny odczyt; naprawić: `return { isPublished: { equals: true } }` dla gości (`platform/src/payload/collections/Portfolios.ts:17-21`)

### 🟡 BEZPIECZEŃSTWO — Faza 6

- [ ] **TD-17** `Media` collection — brak `create/update/delete` access functions; Payload 3 domyślnie wymaga auth dla mutacji (bezpieczne), ale dowolny zalogowany user może uploadować media do cudzego portfolio; dodać access filtrujący po relacji do własnych portfolii (`platform/src/payload/collections/Media.ts`)
- [ ] **TD-18** Rate limit race condition — `redis.incr(key)` + `redis.expire(key, ...)` to dwie osobne operacje; przy równoległych requestach TTL może nie zostać ustawiony; zamienić na atomowe Lua script lub `pipeline()` (`platform/src/lib/rate-limit.ts:6-18`)
- [ ] **TD-19** X-Forwarded-For jako jedyne źródło IP w rate limiterze — spoofable przez klienta; na Vercel+Cloudflare header jest wiarygodny, ale warto dodać komentarz WHY i rozważyć `x-real-ip` jako fallback (`platform/src/app/(portfolio)/actions.ts:51-52`, `app/api/contact/route.ts:38-39`)
- [ ] **TD-20** Brak walidacji formatu subdomeny — pole `subdomain` w Portfolios nie ma regex; można wpisać `../admin`, `my portfolio!` itp.; dodać `validate: (val) => /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/.test(val)` (`platform/src/payload/collections/Portfolios.ts:36-43`)

---

### 🔴 CI/CD — przed następnym deployem

- [x] **TD-21** CI nie buduje aplikacji — `.github/workflows/ci.yml` (2026-06-20, Agent: Claude) uruchamia tylko `lint` + `typecheck`; błąd buildu wykrywany dopiero przez Vercel przy deploy; dodać job `build` z `npm run build` (potrzebuje env vars jak w typecheck step)

### 🟡 CI/CD — Faza 6

- [ ] **TD-22** Brak `/api/health` endpointu — monitoring (UptimeRobot, powiązane z H13.11) i load balancer nie mają punktu do sprawdzenia stanu aplikacji; dodać `platform/src/app/api/health/route.ts` zwracający `{ status: "ok", timestamp }` z kodem 200
- [ ] **TD-23** Brak centralnej walidacji env vars na starcie — kod używa `process.env.X!` assertions w różnych miejscach; awaria przy brakującej zmiennej objawia się runtime errorem głęboko w kodzie; dodać `platform/src/lib/env.ts` z Zod schema i importować w `payload.config.ts`

### ⚪ CI/CD — Opcjonalne

- [ ] **TD-24** `@upstash/redis` używa HTTP REST API — lokalny Docker Redis (TCP) jest niekompatybilny; developerzy muszą używać prawdziwych kredencjałów Upstash nawet w dev; udokumentować w `.env.local.example` i README

---

### ⚪ BRAKUJĄCE BLOKI — Faza 7

- [x] **TD-25** (częściowo) `books`, `gallery`, `services` zaimplementowane (2026-06-27, Agent: Claude) — pozostałe bez pól: `testimonials`, `timeline`, `stats`, `cta`, `faq`; nadal widoczne w dropdown admina bez pól i bez renderowania; priorytet następny: `testimonials` i `stats` (Radek). Szczegółowy projekt bloków: §23.3

---

## Appendix A — Rejestr zmian PLAN.md

| Data       | Wersja | Zmiana                                              | Przez             |
| ---------- | ------ | --------------------------------------------------- | ----------------- |
| 2026-05-23 | 1.0    | Inicjalne stworzenie — pełna architektura platformy | Claude Sonnet 4.6 |
| 2026-05-23 | 1.1    | Zatwierdzono ADR-001÷010; zmiana hostingu na Vercel; dodano DIALOG; retro-terminal theme | Radosław + Claude |
| 2026-05-23 | 1.2    | Reorganizacja repo (commit 54fa46e); zasada git push tylko po testach i zgodzie Radosława | Radosław + Claude |
| 2026-05-23 | 1.3    | Faza 0 częściowo ukończona: Vercel skonfigurowany, SSH GitHub, P3.1-P3.10 done | Radosław + Claude |
| 2026-06-12 | 1.4    | Faza 0 UKOŃCZONA: DNS skonfigurowany (H13.6-H13.8, D11.1), system pamięci AI, access.md | Radosław + Claude |
| 2026-06-14 | 1.5    | Faza 2 UKOŃCZONA: F9.7–F9.15 (Framer Motion, nav, contact SA, SEO, sitemap, CV, GDPR, landing, 404) | Radosław + Claude |
| 2026-06-16 | 1.6    | Faza 3 UKOŃCZONA: A10.1–A10.9 (admin branding, R2, Analytics, Todos, livePreview), deploy na Vercel prod | Radosław + Claude |
| 2026-06-18 | 1.7    | DNS poprawiony: A record/proxied=false → CNAME/proxied🟠, SSL mode Full (H13.7 fix) | Radosław + Claude |
| 2026-06-20 | 1.8    | Audyt: §21 status zaktualizowany, §11.2 DNS poprawione, D11.1/D11.2/H13.10 zaznaczone, Faza 5 checkboxy | Radosław + Claude |
| 2026-06-20 | 1.9    | Faza 4 (większość done): seed Neon, blok projects, CV→R2, motyw radek, LangToggle PL/EN, responsywność; §17 M17.3/M17.8/M17.10/M17.11 done; §21 zaktualizowane | Radosław + Claude |
| 2026-06-20 | 2.0    | Nowa sekcja §23: propozycje rozwoju, pomysły architektoniczne i wnioski z projektu (perspektywa agenta AI) | Claude Sonnet 4.6 |
| 2026-06-20 | 2.1    | Audyt kodu faz 0–3: §24 Dług techniczny (TD-01–TD-15), §21 Do zrobienia zaktualizowane o TD priorytety | Claude Sonnet 4.6 |
| 2026-06-20 | 2.2    | §24 rozszerzony o audyt 3 dodatkowych obszarów: bezpieczeństwo (TD-16–TD-20), CI/CD (TD-21–TD-24), brakujące bloki (TD-25) | Claude Sonnet 4.6 |
| 2026-06-27 | 2.3    | Faza 4 prawie done: M17.14 (books+gallery), M17.16 (social media), M17.17–M17.20 (CBM), fix download-cv; §17/§20/§21/§24 zaktualizowane | Claude Sonnet 4.6 |
| 2026-06-27 | 2.4    | §22 rozszerzony: 22.1 Rozwinięcie działu Projects (6 punktów), 22.2 Feedback i zgłaszanie błędów (5 punktów); renumeracja 22.2→22.4, 22.3→22.5 | Radosław + Claude |

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

_Ostatnia aktualizacja: 2026-06-27 v2.4 — §22 rozszerzony: Projects + Feedback/Bug reporting_  
_Następna aktualizacja: Po UAT z Miłoszem i Martyną_
