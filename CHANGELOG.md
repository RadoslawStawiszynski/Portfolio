# Changelog

All notable changes to PortfolioHub are documented here.  
Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)  
Versioning: [Semantic Versioning](https://semver.org/)

---

## [Unreleased]

### Added
- `PortfolioRenderer` Server Component + `BLOCK_REGISTRY` — renderuje portfolio z listy bloków Payload (F9.3)
- 6 bloków MVP: HeroBlock, AboutBlock, ExperienceBlock, SkillsBlock, EducationBlock, ContactBlock (F9.4)
- `ContactForm` client component z obsługą formularza (F9.4)
- `ThemeToggle` client component — przełącznik motywów z zapisem do cookie (F9.5)
- `/dev/[slug]` route — lokalny podgląd portfolio bez subdomeny (F9.3)
- `getPortfolioBySlug` + `getBlocksBySlug` — helpery do odczytu danych portfolio z Payload (F9.3)
- `POST /api/contact` — endpoint formularza kontaktowego z walidacją Zod, rate limitingiem Redis (3 req/15 min per IP) i wysyłką emaili przez Resend (B8.5)
- Pole `contactEmail` w kolekcji Portfolios — edytowalne w admin panelu
- `lib/redis.ts` — singleton Upstash Redis
- `lib/rate-limit.ts` — helper rate limitingu per IP
- `.nvmrc` — Node.js 20 pinned, zgodnie z CI

### Changed
- Reorganizacja route groups: `app/` → `app/(portfolio)/` i `app/(payload)/` dla czystszego podziału CMS/portfolio
- `next.config.ts`: dodano `serverExternalPackages` dla pino (poprawny SSR bundling)
- `tsconfig.json`: ustawiono `target: "ES2017"`

### Fixed
- Przeniesiono `BlockDoc` do `@/types/blocks` + `getBlocksBySlug` mapuje do `BlockDoc[]` — eliminuje podwójne asercje `as unknown as BlockDoc[]` na stronach
- Dodano guard `DATABASE_URL` z `throw` w `payload.config.ts` — fail fast przy brakującym env (W1)
- Poprawiono `.env.local.example`: `@upstash/redis` wymaga HTTPS REST URL, nie TCP (C1)
- Dodano dummy Upstash vars do CI env — zapobiega crashowi build step przy brakujących zmiennych (C2)
- Zamieniono `<img>` na `<Image />` (next/image) w `AboutBlock` i `HeroBlock` — poprawa LCP (W3)
- Dodano guard `PAYLOAD_SECRET` z `throw` w `payload.config.ts` — analogicznie do `redis.ts` (I1)
- Poprawiono dokumentację S14.3 w PLAN.md: "5 req" → "3 req/15 min" — zgodność z implementacją (W6)

### Foundation (Faza 1)
- Next.js 15 App Router scaffold — TypeScript 5, Tailwind CSS 4, 3-theme CSS token system (F9.1)
- Payload CMS 3 configured with `@payloadcms/db-postgres` (Neon PostgreSQL) (B8.1)
- Payload collections: Users (RBAC: superadmin/admin/owner), Portfolios, Blocks, Media (B8.2)
- Subdomain routing middleware — extracts `x-portfolio-slug` from host header (B8.3, D11.3)
- GitHub Actions CI: lint + typecheck on push to dev/staging (K12.5)
- Added `graphql` dependency (required by @payloadcms/next internals)

---

## [0.4.0] — 2026-06-12 — Faza 0 ukończona

### Infrastructure
- DNS skonfigurowany przez Cloudflare API: `korp-cbm.com` CNAME → `cname.vercel-dns.com`, `*.korp-cbm.com` A → `76.76.21.21` (H13.6, H13.7, D11.1)
- Domeny `korp-cbm.com` i `*.korp-cbm.com` dodane do projektu Vercel (H13.8)
- `CLOUDFLARE_API_TOKEN` i `CLOUDFLARE_ZONE_ID` dodane do `.env.local`
- Neon PostgreSQL skonfigurowany, `DATABASE_URL` zapisany — pooler eu-central-1 (H13.2)
- 14 zmiennych środowiskowych dodanych do Vercel Production (H13.9)

### Project
- `docs/access.md` — rejestr serwisów, statusów DNS i Vercel (bez sekretów)
- System pamięci AI (`memory/`) — eliminuje powtarzanie kroków między sesjami

### Documentation
- Git branching strategy: `main` / `staging` / `dev` (local + remote)
- CLAUDE.md i context files agentów AI (AI19.1, AI19.2, AI19.4)
- Docker scaffold: Dockerfile, docker-compose.dev.yml, .env.example (K12.1–K12.4, K12.6)
- `pino` logger architecture: `platform/src/lib/logger.ts`
- CHANGELOG.md initialized, `docs/git-workflow.md`
- PLAN.md v1.4 — status Fazy 0 zaktualizowany

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
- PLAN.md v1.0 initialized with full roadmap and architecture
