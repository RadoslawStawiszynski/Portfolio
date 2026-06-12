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

## Completed (Faza 0) — ALL DONE 2026-06-12

- ADR-001..ADR-010 approved
- Repo reorganized: platform/, portfolios/, archive/, side-quests/
- Vercel project linked, auto-deploy disabled
- Neon PostgreSQL configured — pooler URL eu-central-1 (H13.2)
- Upstash Redis, Cloudflare R2, Resend — accounts + credentials (H13.3–H13.5)
- 14 Vercel env vars set (Production) (H13.9)
- DNS: korp-cbm.com CNAME → cname.vercel-dns.com, *.korp-cbm.com A → 76.76.21.21 (H13.6, H13.7, D11.1)
- Vercel domains: korp-cbm.com + *.korp-cbm.com added (H13.8)
- Git: main/staging/dev branches created (local + remote)
- CLAUDE.md, CHANGELOG.md, docs/git-workflow.md, docs/access.md
- Docker scaffold: Dockerfile, docker-compose.dev.yml, .env.example, .env.local.example
- Logger architecture: platform/src/lib/logger.ts (pino)
- Session memory system: prevents repeating steps across sessions

## Active — Faza 1 (Next.js 15 scaffold)

- F9.1: `npx create-next-app@latest` in platform/ (TypeScript, Tailwind, App Router)
- B8.1, B8.2: Payload CMS 3 + PostgreSQL configuration
- B8.3, D11.3: Subdomain routing middleware
- K12.5: GitHub Actions workflow (lint + test)
