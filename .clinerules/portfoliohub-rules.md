# PortfolioHub — Zasady dla agentów AI

## Identyfikacja projektu
Projekt: PortfolioHub (wielodostępna platforma portfolio)
Repo: /home/rspro/Dokumenty/1.CODE/2.Portfolio
Plan: PLAN.md (źródło prawdy)
Changelog: CHANGELOG.md

## Git — OBOWIĄZKOWE
- Pracuj na gałęzi `dev`
- Nigdy nie pushuj bezpośrednio do `main` lub `staging`
- Format commitów: type(scope): opis
  Typy: feat, fix, chore, docs, refactor, test, style, perf, ci
- Jeden commit na jeden ukończony task

## Przed każdym zadaniem
1. git branch — upewnij się że jesteś na `dev`
2. Przeczytaj PLAN.md §2 (ADR) — decyzje są wiążące
3. Przeczytaj odpowiednią fazę z PLAN.md §20

## Stack — zatwierdzone ADR (niezmienne)
- Next.js 15 (App Router) + TypeScript 5
- Payload CMS 3
- PostgreSQL 16 (Neon prod / Docker dev)
- Redis (Upstash prod / Docker dev)
- Tailwind CSS 4 + shadcn/ui
- Cloudflare R2 (storage) + Resend (email)
- Vercel (hosting) — Docker TYLKO lokalnie

## Logging
- Używaj: import { logger } from "@/lib/logger"
- Nigdy: console.log w kodzie produkcyjnym
- Logger: pino (JSON w prod, pretty w dev)

## Zakończenie zadania — update
- Oznacz task w PLAN.md: - [x] TASK_ID Opis (2026-MM-DD, Agent: Cline)
- Zaktualizuj CHANGELOG.md w sekcji [Unreleased]
