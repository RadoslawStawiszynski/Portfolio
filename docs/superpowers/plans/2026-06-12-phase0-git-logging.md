# Faza 0 Finał + Git Branching + Logging — Plan Implementacji

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Cel:** Domknąć Fazę 0 (context files, Docker scaffold, env), wdrożyć trójgałęziową strategię git (`main`/`staging`/`dev`) i system logowania projektu — tak żeby Faza 1 mogła ruszyć na czystym fundamencie.

**Architektura:**
- Git: `main` (produkcja) ← `staging` (integracja/QA) ← `dev` (codzienna praca). Feature branches odchodzą od `dev`, PR wchodzi do `staging`, po weryfikacji merge do `main` + ręczny deploy na Vercel.
- Logi projektu: CHANGELOG.md (Keep a Changelog + Conventional Commits) + narzędzie `pino` w Next.js (wdrożone w Fazie 1 po scaffold).
- Docker: lokalny dev z PostgreSQL + Redis (`docker-compose.dev.yml`) — produkcja wyłącznie Vercel + managed services.

**Tech Stack:** git, Node 20, Docker + Docker Compose, pino, Next.js 15 (przyszłość), Vercel CLI

---

## Zadania do wykonania przez agenta (automatable)

### Task 1: Git — utwórz gałęzie `staging` i `dev`

**Files:**
- Modify: `.gitignore` (jeśli trzeba)
- Create: `docs/git-workflow.md`

- [ ] **Step 1: Upewnij się, że jesteś na `main` i masz czyste drzewo**

```bash
cd /home/rspro/Dokumenty/1.CODE/2.Portfolio
git checkout main
git status
```

Oczekiwane: `On branch main`, brak uncommitted changes (lub tylko M PLAN.md).  
Jeśli są uncommitted changes → zrób commit przed dalszymi krokami.

- [ ] **Step 2: Commit bieżących zmian w PLAN.md i .gitignore**

```bash
git add PLAN.md .gitignore
git commit -m "chore: update PLAN.md v1.3 + gitignore"
```

- [ ] **Step 3: Utwórz gałąź `staging` z `main`**

```bash
git checkout -b staging
git push -u origin staging
```

Oczekiwane: `Branch 'staging' set up to track remote branch 'staging' from 'origin'.`

- [ ] **Step 4: Utwórz gałąź `dev` z `staging`**

```bash
git checkout -b dev
git push -u origin dev
```

Oczekiwane: `Branch 'dev' set up to track remote branch 'dev' from 'origin'.`

- [ ] **Step 5: Wróć na `dev` jako domyślną gałąź pracy**

```bash
git checkout dev
git branch -a
```

Oczekiwane: lista zawiera `main`, `staging`, `dev` + remote counterparts. Gwiazdka przy `dev`.

- [ ] **Step 6: Utwórz `docs/git-workflow.md` z zasadami**

```markdown
# Git Workflow — PortfolioHub

## Gałęzie

| Gałąź     | Rola                                      | Deploy         |
|-----------|-------------------------------------------|----------------|
| `main`    | Produkcja — tylko stabilny, przetestowany kod | Vercel PROD (ręczny) |
| `staging` | Integracja / QA — tu trafiają gotowe feature-y | Vercel Preview (auto) |
| `dev`     | Aktywna praca — bieżące zmiany            | Lokalnie       |

## Workflow

```
feature/xyz ──┐
              ▼
             dev ──PR──► staging ──(testy OK)──PR──► main ──► vercel --prod
```

1. Nową funkcję zacznij od: `git checkout -b feature/nazwa dev`
2. Commity robisz na feature branchu
3. PR: `feature/nazwa` → `staging`  
4. Jeśli staging OK → PR: `staging` → `main`
5. Deploy na Vercel: `vercel --prod` (ręcznie po akceptacji Radosława)

## Konwencja commitów (Conventional Commits)

```
<type>(<scope>): <opis po angielsku>

feat(blocks): add hero block renderer
fix(auth): resolve JWT refresh loop
chore(docker): add healthchecks to postgres service
docs(readme): update setup instructions
refactor(api): extract portfolio fetcher to lib
test(blocks): add unit tests for experience block
style(ui): align hero section padding
```

### Typy
- `feat` — nowa funkcja
- `fix` — naprawa błędu
- `chore` — konfiguracja, zależności, tooling
- `docs` — dokumentacja
- `refactor` — refaktoryzacja bez zmiany zachowania
- `test` — testy
- `style` — formatowanie, whitespace (bez logiki)
- `perf` — optymalizacja wydajności
- `ci` — CI/CD

## Zasady

- `main` i `staging` — NIGDY bezpośredni push. Tylko przez PR.
- `git push` do `origin main` wyłącznie po akceptacji Radosława.
- Każdy PR musi mieć opis co zmienia i jak testować.
- Squash commits przy merge do `staging` (czystsza historia).
```

- [ ] **Step 7: Commit dokumentu workflow**

```bash
git add docs/git-workflow.md
git commit -m "docs(git): add branching strategy and commit conventions"
```

---

### Task 2: CHANGELOG.md — historia projektu

**Files:**
- Create: `CHANGELOG.md` (root)

- [ ] **Step 1: Utwórz CHANGELOG.md**

Format: [Keep a Changelog](https://keepachangelog.com/) + Conventional Commits.

```markdown
# Changelog

All notable changes to PortfolioHub are documented here.  
Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)  
Versioning: [Semantic Versioning](https://semver.org/)

---

## [Unreleased]

### Infrastructure
- Git branching strategy: `main` / `staging` / `dev`
- CHANGELOG.md initialized
- CLAUDE.md and agent context files
- Docker Compose dev environment scaffold

---

## [0.3.0] — 2026-06-11

### Infrastructure
- Upstash Redis instance created and configured (H13.3)
- Cloudflare R2 bucket `portfoliohub` created + API keys (H13.4)
- Resend account created, domain korp-cbm.com verified (H13.5)
- `.env.local` updated with service credentials

---

## [0.2.0] — 2026-05-23

### Infrastructure
- Vercel project "portfolio" created and linked with GitHub (H13.1)
- Vercel: auto-deploy disabled (Ignored Build Step = exit 1)
- Vercel: Root Directory = platform, Framework = Next.js
- SSH key generated and added to GitHub

### Project
- Repository reorganized: `platform/`, `portfolios/`, `archive/`, `side-quests/` (P3.1–P3.10)
- `.gitignore` and `README.md` updated

---

## [0.1.0] — 2026-05-19

### Project
- 10 ADRs approved (ADR-001 through ADR-010)
- Initial project structure and management system created
- PLAN.md v1.0 initialized
```

- [ ] **Step 2: Commit**

```bash
git add CHANGELOG.md
git commit -m "docs(changelog): initialize project history"
```

---

### Task 3: CLAUDE.md — kontekst dla Claude Code (AI19.1)

**Files:**
- Create: `CLAUDE.md` (root projektu)

- [ ] **Step 1: Utwórz CLAUDE.md**

```markdown
# CLAUDE.md — PortfolioHub

## Projekt

**PortfolioHub** — wielodostępna platforma portfolio.  
Każdy użytkownik ma własne portfolio złożone z edytowalnych bloków (hero, about, experience, skills, contact…).  
Własne domeny/subdomeny, panel admina, motywy.

**Repo:** `/home/rspro/Dokumenty/1.CODE/2.Portfolio`  
**Główny plan:** `PLAN.md` — czytaj przed każdym zadaniem (§2 ADR, §20 Roadmap)

## Stack

```
Next.js 15 (App Router) + TypeScript 5
Tailwind CSS 4 + shadcn/ui + Radix UI
Payload CMS 3 (CMS + auth)
PostgreSQL 16 — Neon (prod) / Docker (dev)
Redis — Upstash (prod) / Docker (dev)
Cloudflare R2 (storage) + Resend (email)
Vercel (hosting) + Cloudflare (DNS/CDN)
Docker Compose — TYLKO lokalne dev
```

## Struktura repo

```
platform/          ← Next.js 15 + Payload CMS (główna aplikacja)
portfolios/        ← Dane portfeli (Radosław, Miłosz, Martyna, CBM)
archive/           ← Stare pliki do odniesienia
side-quests/       ← Projekty poboczne (gry, Python)
docs/              ← Dokumentacja, plany, ADR
PLAN.md            ← Główny dokument zarządzania projektem
CHANGELOG.md       ← Historia zmian projektu
```

## Git workflow

| Gałąź     | Rola                    |
|-----------|-------------------------|
| `main`    | Produkcja (tylko stable) |
| `staging` | QA / integracja         |
| `dev`     | Aktywna praca           |

Szczegóły: `docs/git-workflow.md`

## Zasady dla agentów

1. **Przeczytaj PLAN.md §2 (ADR)** przed implementacją — decyzje są wiążące
2. **Zaznaczaj ukończone taski**: `- [x] TASK_ID Opis (2026-MM-DD, Agent: Claude)`
3. **Pracuj na gałęzi `dev`** — nie na `main`
4. **git push** do origin — tylko na `dev` lub `staging`, NIE na `main` bez zgody Radosława
5. **Jeden task naraz** — nie zaczynaj następnego przed commit poprzedniego
6. **Testy przed "done"** — sprawdź w przeglądarce lub uruchom testy
7. **Nie usuwaj plików** — archiwizuj do `archive/`
8. **Komentarze w kodzie tylko WHY** — nie co robi kod

## Zmienne środowiskowe

Plik: `platform/.env.local` (nigdy nie commituj)  
Szablon: `platform/.env.example`

Wymagane zmienne: patrz `platform/.env.example`

## Jak uruchomić lokalnie

```bash
cd platform
docker compose -f docker-compose.dev.yml up -d   # PostgreSQL + Redis
npm install
npm run dev                                        # http://localhost:3000
```

## Ważne decyzje (ADR — NIEZMIENNE bez konsultacji)

- ADR-001: Next.js 15 (App Router) — framework
- ADR-002: Payload CMS 3 — CMS i admin
- ADR-003: PostgreSQL 16 + Neon — baza danych
- ADR-004: Vercel (free tier) — hosting
- ADR-005: Cloudflare — DNS/CDN
- ADR-006: Tailwind CSS 4 — stylowanie
- ADR-007: shadcn/ui + Radix — komponenty UI
- ADR-008: Docker — TYLKO lokalne dev
- ADR-009: PL + EN — języki
- ADR-010: Cloudflare R2 — storage

## Logging aplikacji

Biblioteka: `pino` (JSON structured logging)  
Plik: `platform/src/lib/logger.ts`  
Dev: pretty-print przez `pino-pretty`  
Prod: JSON logi → Vercel log drains
```

- [ ] **Step 2: Commit**

```bash
git add CLAUDE.md
git commit -m "docs(claude): add CLAUDE.md project context for AI agents (AI19.1)"
```

---

### Task 4: Pliki kontekstowe dla agentów (AI19.2–AI19.5)

**Files:**
- Create: `.agents/CONTEXT.md`
- Create: `.clinerules`

- [ ] **Step 1: Utwórz `.agents/CONTEXT.md`**

```markdown
# Agent Context — PortfolioHub

## Project

Multi-user portfolio platform. Each portfolio = header + list of blocks (hero, about, experience, skills, contact, projects, etc.). Block-based CMS with custom domains.

## Stack

- **Runtime:** Node 20 LTS
- **Framework:** Next.js 15 (App Router) + TypeScript 5
- **CMS:** Payload CMS 3 (auth + admin + REST/GraphQL API)
- **Styling:** Tailwind CSS 4 + shadcn/ui + Radix UI
- **DB:** PostgreSQL 16 (Neon prod / Docker dev)
- **Cache:** Redis (Upstash prod / Docker dev)
- **Storage:** Cloudflare R2
- **Email:** Resend
- **Hosting:** Vercel (prod), Docker Compose (dev only)

## Repo Structure

```
platform/src/
  app/              ← Next.js App Router pages
  components/       ← React components (blocks/, ui/, layout/)
  lib/              ← Utilities (logger.ts, db.ts, redis.ts)
  payload/          ← Payload CMS collections, config
  middleware.ts     ← Subdomain routing
platform/
  docker-compose.dev.yml
  .env.example
```

## Key Constraints

- All ADRs (ADR-001..ADR-010) in PLAN.md §2 are LOCKED — do not change without human approval
- Never commit .env.local or any secrets
- Docker is for local dev ONLY (not production)
- git push to main requires explicit human approval
- Work on `dev` branch, PRs go to `staging` first

## Active Phase

Faza 1 — Foundation (Next.js scaffold + Payload CMS + Docker Compose)

## Completed

- Faza 0: ADRs, repo reorganization, Vercel setup, Upstash/R2/Resend credentials
- Git: main/staging/dev branches
```

- [ ] **Step 2: Utwórz `.clinerules`**

```markdown
# Cline Rules — PortfolioHub

## Working directory
/home/rspro/Dokumenty/1.CODE/2.Portfolio

## Branch
Always work on `dev`. Never push directly to `main`.

## Before any task
1. Read PLAN.md §2 (ADR decisions — binding)
2. Read the relevant phase from PLAN.md §20 (Roadmap)
3. Check git branch: must be `dev`

## Code style
- TypeScript strict mode
- Tailwind CSS 4 (no CSS modules unless necessary)
- shadcn/ui components from `@/components/ui/`
- pino for all logging (never console.log in production code)
- Zod for all runtime validation

## Commits
Format: `type(scope): description`  
Types: feat, fix, chore, docs, refactor, test, style, perf, ci

## Never
- Commit .env files
- Push to main without human approval
- Delete files (archive to archive/ instead)
- Change ADR decisions without human consultation
- Add console.log in production code
```

- [ ] **Step 3: Commit**

```bash
git add .agents/ .clinerules
git commit -m "docs(agents): add agent context files and clinerules (AI19.2, AI19.4)"
```

---

### Task 5: `platform/.env.example` — szablon zmiennych środowiskowych (K12.3 + K12.6)

**Files:**
- Create: `platform/.env.example`
- Create: `platform/.env.local.example`

- [ ] **Step 1: Utwórz `platform/.env.example`**

```env
# ============================================================
# PortfolioHub — Environment Variables Template
# Copy to .env.local and fill in real values
# NEVER commit .env.local
# ============================================================

# === DATABASE (Neon PostgreSQL) ===
DATABASE_URL=postgresql://user:password@ep-xxx.eu-central-1.aws.neon.tech/portfoliohub?sslmode=require

# === REDIS (Upstash) ===
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxx

# === PAYLOAD CMS ===
PAYLOAD_SECRET=change-to-random-string-min-32-chars

# === CLOUDFLARE R2 (Storage) ===
R2_ACCOUNT_ID=xxx
R2_ACCESS_KEY_ID=xxx
R2_SECRET_ACCESS_KEY=xxx
R2_BUCKET_NAME=portfoliohub
R2_PUBLIC_URL=https://pub-xxx.r2.dev

# === RESEND (Email) ===
RESEND_API_KEY=re_xxx
RESEND_FROM_EMAIL=noreply@korp-cbm.com

# === APP CONFIG ===
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_PLATFORM_DOMAIN=korp-cbm.com
NODE_ENV=development

# === VERCEL (only needed for CLI operations) ===
# VERCEL_TOKEN=xxx
```

- [ ] **Step 2: Utwórz `platform/.env.local.example` (dla Docker dev)**

```env
# ============================================================
# PortfolioHub — Local Development (Docker) Variables
# Use this when running via docker-compose.dev.yml
# ============================================================

# Local PostgreSQL (Docker)
DATABASE_URL=postgresql://portfoliohub:portfoliohub@localhost:5432/portfoliohub

# Local Redis (Docker)
UPSTASH_REDIS_REST_URL=redis://localhost:6379
UPSTASH_REDIS_REST_TOKEN=

# Payload CMS
PAYLOAD_SECRET=local-dev-secret-change-in-production-min32

# R2 — użyj prawdziwych kluczy nawet lokalnie (R2 jest zewnętrzne)
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=portfoliohub-dev
R2_PUBLIC_URL=

# Resend — użyj prawdziwych kluczy lub test mode
RESEND_API_KEY=re_xxx

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_PLATFORM_DOMAIN=localhost
NODE_ENV=development
RESEND_FROM_EMAIL=noreply@korp-cbm.com
```

- [ ] **Step 3: Commit**

```bash
git add platform/.env.example platform/.env.local.example
git commit -m "chore(env): add .env.example templates (K12.3, K12.6)"
```

---

### Task 6: `platform/Dockerfile` — multi-stage build (K12.1)

**Files:**
- Create: `platform/Dockerfile`
- Create: `platform/.dockerignore`

- [ ] **Step 1: Utwórz `platform/.dockerignore`**

```dockerignore
node_modules
.next
.env.local
.env.*.local
npm-debug.log*
.git
.gitignore
README.md
```

- [ ] **Step 2: Utwórz `platform/Dockerfile`**

```dockerfile
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

# deps stage — install only production deps
FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci

# builder stage — build Next.js
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# runner stage — minimal production image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

- [ ] **Step 3: Commit**

```bash
git add platform/Dockerfile platform/.dockerignore
git commit -m "chore(docker): add multi-stage Dockerfile for local dev (K12.1)"
```

---

### Task 7: `platform/docker-compose.dev.yml` — lokalne środowisko dev (K12.2 + K12.4)

**Files:**
- Create: `platform/docker-compose.dev.yml`

- [ ] **Step 1: Utwórz `platform/docker-compose.dev.yml`**

```yaml
# LOCAL DEVELOPMENT ONLY — not used in production
# Prod: Vercel + Neon + Upstash (managed services)
name: portfoliohub-dev

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
      target: builder
    volumes:
      - .:/app
      - /app/node_modules
      - /app/.next
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
    env_file:
      - .env.local
    command: npm run dev
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy

  postgres:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_USER: portfoliohub
      POSTGRES_PASSWORD: portfoliohub
      POSTGRES_DB: portfoliohub
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U portfoliohub -d portfoliohub"]
      interval: 5s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    restart: unless-stopped
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 3s
      retries: 5

volumes:
  postgres_data:
  redis_data:
```

- [ ] **Step 2: Commit**

```bash
git add platform/docker-compose.dev.yml
git commit -m "chore(docker): add docker-compose.dev.yml with postgres+redis+healthchecks (K12.2, K12.4)"
```

---

### Task 8: `platform/src/lib/logger.ts` — architektura logowania aplikacji

**Files:**
- Create: `platform/src/lib/logger.ts`
- Modify: `platform/package.json` (dodać pino jako dependency — po scaffold Next.js)

> **Uwaga:** Ten plik zostaje wersjonowany TERAZ jako architektura, ale `npm install pino` dopiero po scaffold Next.js (Task 9 Faza 1). Plik można od razu commitować — zostanie użyty gdy pojawi się `package.json`.

- [ ] **Step 1: Utwórz `platform/src/lib/` i `logger.ts`**

```bash
mkdir -p /home/rspro/Dokumenty/1.CODE/2.Portfolio/platform/src/lib
```

```typescript
// platform/src/lib/logger.ts
// Singleton pino logger. Use instead of console.log everywhere.
// Dev: pretty-printed via pino-pretty
// Prod: JSON → Vercel log drains

import pino from "pino";

const isDev = process.env.NODE_ENV === "development";

export const logger = pino({
  level: process.env.LOG_LEVEL ?? (isDev ? "debug" : "info"),
  ...(isDev && {
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "HH:MM:ss",
        ignore: "pid,hostname",
      },
    },
  }),
});

export type Logger = typeof logger;
```

- [ ] **Step 2: Utwórz `platform/src/lib/index.ts` — barrel export**

```typescript
export { logger } from "./logger";
```

- [ ] **Step 3: Commit**

```bash
git add platform/src/
git commit -m "feat(logger): add pino logger singleton architecture (to install after Next.js scaffold)"
```

---

## Zadania wymagające akcji użytkownika (nie automatable)

### Task 9: H13.2 — Neon PostgreSQL (USER ACTION)

Krok po kroku:

1. Wejdź na https://neon.tech → Sign up / Login
2. Utwórz nowy projekt: **Name:** `portfoliohub`, **Region:** `eu-central-1`
3. Skopiuj `DATABASE_URL` z dashboardu (Connection Details → Connection string)
4. Wklej do `platform/.env.local`:
   ```
   DATABASE_URL=postgresql://...@ep-xxx.eu-central-1.aws.neon.tech/portfoliohub?sslmode=require
   ```
5. Zaktualizuj PLAN.md: zmień `- [ ] **H13.2**` na `- [x] **H13.2** ... (2026-06-XX)`

### Task 10: H13.9 — Zmienne env na Vercel (USER ACTION — po H13.2)

Gdy masz wszystkie klucze z .env.local:

```bash
cd /home/rspro/Dokumenty/1.CODE/2.Portfolio/platform
vercel env add DATABASE_URL production
vercel env add UPSTASH_REDIS_REST_URL production
vercel env add UPSTASH_REDIS_REST_TOKEN production
vercel env add PAYLOAD_SECRET production
vercel env add R2_ACCOUNT_ID production
vercel env add R2_ACCESS_KEY_ID production
vercel env add R2_SECRET_ACCESS_KEY production
vercel env add R2_BUCKET_NAME production
vercel env add R2_PUBLIC_URL production
vercel env add RESEND_API_KEY production
vercel env add RESEND_FROM_EMAIL production
vercel env add NEXT_PUBLIC_APP_URL production
vercel env add NEXT_PUBLIC_PLATFORM_DOMAIN production
```

Lub przez Vercel Dashboard → Project → Settings → Environment Variables.

### Task 11: H13.6 + D11.1 — Domena + DNS (USER ACTION — można odłożyć na Fazę 5)

> Nie blokuje developmentu. Można pominąć na razie.

1. W panelu rejestratora (seohost.pl?) zmień nameservery korp-cbm.com na:
   - `ns1.cloudflare.com`
   - `ns2.cloudflare.com`
2. Poczekaj na propagację DNS (kilka godzin)
3. W Cloudflare dodaj rekordy:
   - `A  korp-cbm.com    → 76.76.21.21` (Vercel IP)
   - `CNAME  *.korp-cbm.com  → cname.vercel-dns.com`
4. W Vercel Dashboard → Domains: dodaj `korp-cbm.com` i `*.korp-cbm.com`

---

## Self-Review Checklist

- [x] Git workflow documented + gałęzie `staging` i `dev`
- [x] CHANGELOG.md z historią projektu
- [x] CLAUDE.md (AI19.1) — kompletny kontekst
- [x] .agents/CONTEXT.md (AI19.2) — dla agentów
- [x] .clinerules (AI19.4) — reguły dla Cline
- [x] .env.example + .env.local.example (K12.3, K12.6)
- [x] Dockerfile (K12.1)
- [x] docker-compose.dev.yml + healthchecks (K12.2, K12.4)
- [x] logger.ts — architektura logowania
- [x] Instrukcje dla użytkownika: Neon (H13.2), Vercel env (H13.9), DNS (H13.6)
- [ ] AI19.3 (OLLAMA_PROMPT.md) — pominiete, niska priorytetowość na ten moment
- [ ] AI19.5 (.agents/skills/) — odłożone na gdy będą konkretne fazy do coverage
