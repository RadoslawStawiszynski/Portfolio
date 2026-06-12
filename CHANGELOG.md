# Changelog

All notable changes to PortfolioHub are documented here.  
Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)  
Versioning: [Semantic Versioning](https://semver.org/)

---

## [Unreleased]

### Infrastructure
- Git branching strategy: `main` / `staging` / `dev`
- CHANGELOG.md initialized
- CLAUDE.md and agent context files (AI19.1–AI19.4)
- Docker Compose dev environment scaffold (K12.1, K12.2, K12.4)
- `.env.example` templates (K12.3, K12.6)
- `pino` logger architecture (platform/src/lib/logger.ts)

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
