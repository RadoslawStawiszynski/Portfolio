# PortfolioHub

Wielodostępna platforma portfolio — każdy użytkownik tworzy własną wizytówkę online,
edytowalną przez przeglądarkę, z własną domeną lub subdomeną.

**Status:** In development — Phase 0 (reorganizacja + konfiguracja usług)

## Dokumentacja

- [PLAN.md](PLAN.md) — główny plan projektu, decyzje architektoniczne (ADR), roadmap

## Struktura repozytorium

```
2.Portfolio/
├── platform/              ← KOD PLATFORMY (Next.js 15 + Payload CMS 3)
├── portfolios/            ← DANE PORTFELI
│   ├── radek-stawiszynski/
│   ├── milosz-gawlik/
│   ├── martyna-stawiszynska/
│   └── cbm-firma/
├── docs/                  ← DOKUMENTACJA
├── PROJECT_MANAGEMENT/    ← ZARZĄDZANIE PROJEKTEM
├── side-quests/           ← PROJEKTY POBOCZNE (gry, Python)
├── archive/               ← ARCHIWUM (stary kod)
└── hooks/                 ← SKRYPTY AUTOMATYZACJI
```

## Tech Stack

```
Frontend:  Next.js 15 (App Router) + TypeScript
Styling:   Tailwind CSS 4 + CSS Custom Properties
CMS:       Payload CMS 3
Database:  PostgreSQL 16 (Neon)
Cache:     Redis (Upstash)
Storage:   Cloudflare R2
Email:     Resend
Hosting:   Vercel
DNS/CDN:   Cloudflare
```

## Portfolio na platformie

| Portfolio | Typ | Subdomena |
|-----------|-----|-----------|
| Radosław Stawiszyński | CV + PM | radek.korp-cbm.com |
| Miłosz Gawlik | CV + IT | milosz.korp-cbm.com |
| Martyna Stawiszyńska | Autorka książek | martyna.korp-cbm.com |
| CBM | Portfolio firmy | korp-cbm.com |

## Lokalne środowisko dev

```bash
# Wymagane: Docker + Node.js 20+
cd platform
cp .env.local.example .env.local
# (wypełnij zmienne z usług Vercel/Neon/Upstash/R2)
docker compose -f docker-compose.dev.yml up -d   # PostgreSQL + Redis
npm install
npm run dev
```

## Deployment

Automatyczny deploy przez GitHub Actions → Vercel przy każdym push na `main`.
