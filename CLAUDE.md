# CLAUDE.md — PortfolioHub

## Projekt

**PortfolioHub** — wielodostępna platforma portfolio.  
Każdy użytkownik ma własne portfolio złożone z edytowalnych bloków (hero, about, experience, skills, contact, projects…).  
Własne domeny/subdomeny, panel admina, motywy jasny/ciemny.

**Repo:** `/home/rspro/Dokumenty/1.CODE/2.Portfolio`  
**Główny plan:** `PLAN.md` — czytaj przed każdym zadaniem (§2 ADR, §20 Roadmap)  
**Historia zmian:** `CHANGELOG.md`  
**Git workflow:** `docs/git-workflow.md`

## Stack

```
Next.js 15 (App Router) + TypeScript 5
Tailwind CSS 4 + shadcn/ui + Radix UI
Payload CMS 3 (CMS + auth + admin)
PostgreSQL 16 — Neon (prod) / Docker (dev)
Redis — Upstash (prod) / Docker (dev)
Cloudflare R2 (storage mediów) + Resend (email)
Vercel (hosting SSR/API) + Cloudflare (DNS/CDN)
Docker Compose — TYLKO lokalne dev
pino — structured JSON logging
```

## Struktura repo

```
platform/          ← Next.js 15 + Payload CMS (główna aplikacja)
  src/
    app/           ← App Router — multiple root layouts
      (portfolio)/ ← Portfolio pages: layout.tsx + page.tsx + dev/[slug]/
      (payload)/   ← Payload CMS admin + API — własny layout z RootProvider
    components/    ← React components (blocks/, ui/, layout/)
    lib/           ← Utilities: logger.ts, db.ts, redis.ts
    payload/       ← Payload CMS collections i config
    middleware.ts  ← Subdomain routing
  docker-compose.dev.yml
  Dockerfile
  .env.example
portfolios/        ← Dane portfeli (Radosław, Miłosz, Martyna, CBM)
archive/           ← Stare pliki do odniesienia
side-quests/       ← Projekty poboczne (gry, Python)
docs/              ← Dokumentacja, plany, ADR
PLAN.md            ← Główny plan projektu
CHANGELOG.md       ← Historia zmian
```

## Git Workflow

| Gałąź     | Rola                     | Deploy                |
|-----------|--------------------------|-----------------------|
| `main`    | Produkcja (tylko stable) | Vercel PROD (ręczny)  |
| `staging` | QA / integracja          | Vercel Preview (auto) |
| `dev`     | Aktywna praca            | Lokalnie (Docker)     |

Szczegóły: `docs/git-workflow.md`

## Zasady dla agentów AI

1. **Przeczytaj PLAN.md §2 (ADR)** przed implementacją — decyzje są wiążące i niezmienne bez zgody Radosława
2. **Zaznaczaj ukończone taski**: `- [x] TASK_ID Opis (2026-MM-DD, Agent: Claude)`
3. **Pracuj na gałęzi `dev`** — nigdy bezpośrednio na `main`
4. **git push** — tylko na `dev` lub `staging`, NIE na `main` bez zgody Radosława
5. **Jeden task naraz** — commit przed przejściem do następnego
6. **Testy przed "done"** — sprawdź w przeglądarce lub uruchom testy
7. **Nie usuwaj plików** — archiwizuj do `archive/`
8. **Komentarze w kodzie tylko WHY** — nie co robi kod
9. **Nie używaj `console.log`** w kodzie produkcyjnym — używaj `logger` z `@/lib/logger`
10. **Aktualizuj CHANGELOG.md** przy każdej znaczącej zmianie

## Zmienne środowiskowe

Plik: `platform/.env.local` (nigdy nie commituj — jest w .gitignore)  
Szablon: `platform/.env.example`  
Docker dev: `platform/.env.local.example`

## Jak uruchomić lokalnie

```bash
cd platform
cp .env.local.example .env.local   # wypełnij brakujące klucze
docker compose -f docker-compose.dev.yml up -d   # PostgreSQL + Redis
npm install
npm run dev                         # http://localhost:3000
npm run typecheck                   # TypeScript check (tsc --noEmit)
npm run lint                        # ESLint
rm -rf .next && npm run dev         # reset cache + restart po zmianie struktury
```

## Zatwierdzone decyzje ADR (NIEZMIENNE)

| ADR | Decyzja |
|-----|---------|
| ADR-001 | Next.js 15 (App Router) — framework |
| ADR-002 | Payload CMS 3 — CMS i admin panel |
| ADR-003 | PostgreSQL 16 + Neon — baza danych |
| ADR-004 | Vercel (free tier) — hosting |
| ADR-005 | Cloudflare — DNS/CDN/SSL |
| ADR-006 | Tailwind CSS 4 — stylowanie |
| ADR-007 | shadcn/ui + Radix — komponenty UI |
| ADR-008 | Docker — TYLKO lokalne dev, nie produkcja |
| ADR-009 | PL + EN — języki interfejsu |
| ADR-010 | Cloudflare R2 — storage mediów |

## Znane pułapki

- **Multiple root layouts** — brak `app/layout.tsx` jest zamierzony. Portfolio używa
  `(portfolio)/layout.tsx`, admin `(payload)/layout.tsx` z Payload `RootLayout`.
  Dodanie `app/layout.tsx` zepsuje admin (ConfigProvider poza drzewem React).
- **pino w serverExternalPackages** — `next.config.ts` musi zawierać
  `serverExternalPackages: ["pino", "pino-pretty", "thread-stream", "sonic-boom"]`
  inaczej worker thread crasha przy starcie.
- **DATABASE_URL lokalnie** — użyj Docker PostgreSQL:
  `postgresql://portfoliohub:portfoliohub@localhost:5432/portfoliohub`
  Neon (chmura) zakomentowany w `.env.local` — odkomentuj tylko przy deploy.
- **Port konflikty** — jeśli 3000 zajęty, Next.js auto-przełącza na 3003.
  `pkill -f "next dev"` zabija stare instancje.
- **Stary cache `.next`** — po zmianie struktury plików: `rm -rf .next`

## Logging aplikacji

- **Biblioteka:** `pino` (JSON structured logging)
- **Plik:** `platform/src/lib/logger.ts` — singleton, importuj jako `import { logger } from "@/lib/logger"`
- **Dev:** pretty-print przez `pino-pretty` (kolorowe, czytelne)
- **Prod:** JSON logi → Vercel log drains
- **Poziomy:** `error`, `warn`, `info`, `debug`
- **Nigdy:** `console.log` w kodzie produkcyjnym
