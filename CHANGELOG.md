# Changelog

All notable changes to PortfolioHub are documented here.  
Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)  
Versioning: [Semantic Versioning](https://semver.org/)

---

## [Unreleased]

## [2026-07-07] v2.7 — System zaproszeniowy (INV-01–INV-09)

### Added
- `PlatformSettings` Global w Payload — feature flag `invitationsEnabled` (domyślnie wyłączony)
- Kolekcja `WaitlistRequests` — zgłoszenia z landing page, hook afterChange → email do superadmina
- Kolekcja `InvitationTokens` — SHA-256 hash tokenów, TTL 48h, statusy active/used/expired
- `POST /api/waitlist` — przyjmuje zgłoszenia, rate limit 3/IP/h, sprawdza flagę invitationsEnabled
- `POST /api/admin/invite` — generuje UUID token → SHA-256 hash → email zaproszeniowy Resend
- `SendInviteButton` — custom Payload component w widoku WaitlistRequest
- `GET /api/cron/expire-tokens` — wygasza aktywne tokeny po 48h, chroniony CRON_SECRET
- GitHub Actions workflow `expire-tokens.yml` — cron codziennie 00:00 UTC
- Strona `/join?token=UUID` — walidacja tokenu, rejestracja użytkownika + portfolio z placeholderami
- Landing page: sekcja "Chcesz własne portfolio?" widoczna gdy invitationsEnabled=true
- `createPlaceholderBlocks()` — 6 bloków placeholder dla nowego portfolio (hero, about, experience, skills, education, contact)
- Nowe env vars: `CRON_SECRET`, `SUPERADMIN_EMAIL`

---

### Added (2026-06-27 — Faza 4 finał)
- Blok `books` (`BooksBlock.tsx`) — Payload fields (tytuł/rok/gatunek/okładka/buyUrl/dostępność), TypeScript interface `BookItem`, React: horizontal scroll na mobile, 2–3 col grid na desktop, lazy-load okładek z R2, badge dostępności, link "Kup" (M17.14)
- Blok `gallery` (`GalleryBlock.tsx`) — Payload fields (zdjęcia + podpisy), 4-col masonry grid, lightbox z nawigacją klawiaturową (Escape/strzałki), `aria-modal` + focus trap (M17.14)
- Blok `services` (`ServicesBlock.tsx`) — lista usług z ikonami Lucide i opisami; use case: CBM portfolio (M17.19, TD-25 partial)
- Portfolio CBM (korp-cbm.com / www.korp-cbm.com) — 5 bloków: hero z logo, about, services (3 pakiety), projects (4 realizacje), contact; seed `scripts/seed-cbm.ts`; dane w `portfolios/cbm-firma/data/` (M17.17–M17.20)
- Social media w `ContactBlock` — generyczna lista linków: LinkedIn, GitHub, Facebook, Instagram, Goodreads; ikonki SVG per platforma; refactor — zastąpiono hardcoded LinkedIn/GitHub dynamiczną tablicą (M17.16)
- Wzbogacone CV Martyny — dodano bio, linki wydawnicze, seed `scripts/seed-martyna.ts` zaktualizowany o books i gallery (M17.14)

### Fixed (2026-06-27)
- `download-cv` route — 307 redirect do R2 PDF na podstawie subdomeny (x-portfolio-slug header) i `?lang=` query param; wcześniej zwracał 404 lub niepoprawny plik

### Fixed (poprzednia sesja)
- `Portfolios` API access control (TD-16): goście API widzą tylko `isPublished: true` portfolia zamiast wszystkich (`Portfolios.ts:18`)
- CI workflow (TD-21): dodano job `build` uruchamiany po lint+typecheck — build failures są teraz wykrywane w CI zanim dotrą do Vercel (`.github/workflows/ci.yml`)

### Added (poprzednia sesja)
- §24 Dług techniczny w PLAN.md — 25 zadań TD z priorytetami (przed deployem / Faza 6 / opcjonalne); wynik audytu kodu faz 0–3 obejmujący jakość kodu, bezpieczeństwo, CI/CD i brakujące bloki

### Docs
- PLAN.md v2.3 — §17 M17.14/M17.16/M17.17–M17.20 zaznaczone done; §21 status i tabela zbudowane zaktualizowane; §24 TD-25 częściowo resolved; Appendix A v2.3
- Usunięto hasła z `TODO.md` (plaintext credentials nie powinny być w git)

---

### Fixed (poprzednia sesja)
- DNS/SSL konfiguracja: PLAN.md §13.2 zaktualizowany z VPS-era na Vercel (CNAME proxied 🟠, SSL Full zamiast Strict) — błąd w H13.7 gdzie użyto A record + proxied=false zamiast CNAME + proxied=true

### Added
- `(portfolio)/not-found.tsx` — custom 404 page; slug-aware komunikat ("Portfolio X nie istnieje" lub generyczny); CTA "Strona główna" (gdy slug znany, dev-aware href) + "PortfolioHub →"; `rel="noopener noreferrer"`; `aria-hidden` na dekoracyjnym "404"; CSS Custom Properties aktywnego motywu (F9.15)
- `LandingPage` — landing page platformy na `korp-cbm.com`; sekcje: Hero (tagline + CTA), Funkcje (4 karty), Aktywne portfolio (3 przykłady), Footer; metadane SEO (title + description); CSS Custom Properties `:root` light theme (F9.14)
- `CookieConsentBanner` — GDPR bottom bar; `cookie-consent` cookie (1 rok); "Akceptuję" / "Odrzuć"; pojawia się tylko przy braku zgody; `role="dialog"`, `aria-live="polite"`, `focus-visible` na przyciskach (F9.13)
- `DownloadCvButton` — fixed bottom-left button dla pobierania CV; EN portfolio preferuje `cvPdfEn`, fallback `cvPdfPl`; ukryty gdy brak URL (F9.12)
- Pola `cvPdfPl` i `cvPdfEn` w kolekcji Portfolios — URL do CV PDF edytowalne w Payload admin (F9.12)
- `(portfolio)/sitemap.ts` — dynamiczny `sitemap.xml` per portfolio: tylko opublikowane (`isPublished`), URL z `customDomain` lub `{slug}.korp-cbm.com` (F9.11)
- `buildPortfolioMetadata` helper w `lib/portfolio.ts` — generuje Next.js `Metadata` (og:title, og:description, og:image, twitter:card) z pól Payload: `seoTitle`, `seoDescription`, `seoImage` (F9.10)
- `generateMetadata` w `(portfolio)/page.tsx` i `dev/[slug]/page.tsx` — per-portfolio OpenGraph i Twitter meta tagi (F9.10)
- `sendContactMessage` Server Action — walidacja Zod z komunikatami po polsku, rate limiting per IP (`next/headers`), Resend email, zwraca `ContactState` (F9.9)
- Animacje wejścia Framer Motion 12: fade-in + slide-up dla wszystkich 6 bloków portfolio (F9.7)
- `PortfolioNav` — sticky top navigation bar z scroll-spy: `IntersectionObserver` podświetla aktywną sekcję podczas scrollowania, klik płynnie przewija do sekcji (F9.8)
- `AnimatedSection` — współdzielony klient wrapper (`whileInView`, `once: true`) używany przez HeroBlock, AboutBlock, ContactBlock
- Staggered list animations: ExperienceBlock (timeline items), SkillsBlock (kategorie + tagi scale-in), EducationBlock (karty)
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
- `(portfolio)/layout.tsx` — dynamiczny atrybut `lang` na `<html>` wg `portfolioLang` (EN portfolio → `lang="en"`) (F9.12)
- `ContactForm` — migracja z `fetch("/api/contact")` na `useActionState` + Server Action; Zod field-level błędy wyświetlane per pole z `aria-invalid` i `aria-describedby` (F9.9)
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
