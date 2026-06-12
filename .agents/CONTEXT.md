# Agent Context — PortfolioHub

## Project

Multi-user portfolio platform. Each portfolio = header + ordered list of blocks (hero, about, experience, skills, contact, projects, etc.). Block-based CMS with custom domains/subdomains, admin panel, themes.

**Repo:** `/home/rspro/Dokumenty/1.CODE/2.Portfolio`  
**Active branch:** `dev`  
**Active phase:** Faza 1 — Foundation (Next.js 15 + Payload CMS + Docker)

## Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node 20 LTS |
| Framework | Next.js 15 (App Router) + TypeScript 5 |
| CMS | Payload CMS 3 (auth + admin REST/GraphQL API) |
| Styling | Tailwind CSS 4 + shadcn/ui + Radix UI |
| Animations | Framer Motion 11 |
| Forms | React Hook Form + Zod |
| Database | PostgreSQL 16 — Neon (prod) / Docker (dev) |
| Cache | Redis — Upstash (prod) / Docker (dev) |
| Storage | Cloudflare R2 |
| Email | Resend |
| Logging | pino + pino-pretty (dev) |
| Hosting | Vercel (prod) + Docker Compose (dev only) |
| DNS/CDN | Cloudflare |

## Repo Structure

```
platform/src/
  app/              ← Next.js App Router pages and layouts
  components/
    blocks/         ← Block renderers (hero, about, experience…)
    ui/             ← shadcn/ui base components
    layout/         ← Header, Footer, Navigation
  lib/
    logger.ts       ← pino singleton — use everywhere instead of console.log
    db.ts           ← PostgreSQL client
    redis.ts        ← Upstash Redis client
  payload/
    collections/    ← Payload CMS collection definitions
    config.ts       ← Payload main config
  middleware.ts     ← Subdomain routing logic
platform/
  docker-compose.dev.yml  ← LOCAL DEV: postgres + redis
  Dockerfile              ← Multi-stage build (local dev only)
  .env.example            ← Variable template (production)
  .env.local.example      ← Variable template (local Docker dev)
```

## Key Constraints

- All ADRs (ADR-001..ADR-010) in PLAN.md §2 are **LOCKED** — do not change without Radosław approval
- Never commit `.env.local` or any real secrets
- Docker is for local dev ONLY (not production)
- `git push` to `main` requires explicit human approval
- Work on `dev` branch, PRs go to `staging` first, then `main`
- Use `logger` from `@/lib/logger`, never `console.log` in production code

## Completed (Faza 0)

- ADR-001..ADR-010 approved
- Repo reorganized: platform/, portfolios/, archive/, side-quests/
- Vercel project linked, auto-deploy disabled
- Upstash Redis, Cloudflare R2, Resend — accounts + credentials
- Git: main/staging/dev branches created
- CLAUDE.md, CHANGELOG.md, git-workflow.md
- Docker scaffold: Dockerfile, docker-compose.dev.yml
- Logger architecture: platform/src/lib/logger.ts

## Pending (Faza 0 — user action required)

- H13.2: Neon PostgreSQL → DATABASE_URL (user: create at neon.tech)
- H13.9: Vercel env vars (user: `vercel env add` for each key)
- H13.6 + D11.1: Cloudflare DNS migration + wildcard (can defer to Faza 5)
