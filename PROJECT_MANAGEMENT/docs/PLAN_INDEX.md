---
plan_id: PLAN_INDEX
project: Portfolio Professional — Radosław Stawiszyński
module: project-overview
version: 1.1
created: 2026-04-28
updated: 2026-04-29
status: active
parent: null
children: [PLAN_1, PLAN_2, PLAN_3, PLAN_4, PLAN_5, PLAN_6, PLAN_7, PLAN_8, PLAN_9, PLAN_10]
agent_model: qwen3.6:35b
review_model: gemma4:e4b
tags: [index, overview, portfolio, project-manager]
---

# PLAN_INDEX — Portfolio Professional — Radosław Stawiszyński

> Centralny rejestr wszystkich plików PLAN. Agent aktualizuje podczas każdej Periodic Review.
> Nie edytuj ręcznie statusów — agent synchronizuje z plikami PLAN.

---

## Status projektu

| Obszar | Postęp | Status | Odpowiedzialny |
|-----|-------|--------|-----|
| Architektura globalna | 100% | complete | — |
| PLAN_1 — Architektura globalna | 100% | complete | — |
| PLAN_2 — Frontend Portfolio | 100% | complete | — |
| PLAN_3 — Panel Administracyjny CMS | 0% | — | — |
| PLAN_4 — Backend API | 0% | — | — |
| PLAN_5 — Deployment + DNS | 0% | — | — |
| PLAN_6 — Security + Performance + SEO + Accessibility | 0% | — | — |
| PLAN_7 — Edukacja PM (komplementarna) | 0% | — | — |
| PLAN_8 — Testy + QA | 0% | — | — |
| PLAN_9 — Content Strategy + Projects | 0% | — | — |
| PLAN_10 — Design System | 0% | — | — |
| CV Quick View | 100% | complete | — |

---

## Mapa plików PLAN

### PLAN_1 — Architektura globalna, tech stack i kluczowe decyzje (ADR)

**Status:** `complete` ✅  
**Zakres:** Wizja projektu, architektura globalna, tech stack, Architecture Decision Records (ADR), decyzje domeny i hosting
**Zależności:** brak (rodzic wszystkich modułów)
**Wejście:** Wymagania od Radosława + analiza CV
**Wyjście:** Zatwierdzona architektura → wejście dla wszystkich PLAN_2–PLAN_10

**Sekcje:**
- §1 Wizja i profil projektowy (kto, co, dlaczego, profil PM)
- §2 Architektura globalna (diagram systemu, warstwy)
- §3 Tech stack (warstwa po warstwie)
- §4 Decyzje architektoniczne (ADR)
- §5 Analiza kolorów i WCAG
- §6 Luka kompetencyjna PM (co dopracować w CV)
- §7 Strategia realizacji (fazy, timeline)

---

### PLAN_2 — Frontend Portfolio ✅ AKTYWNY

**Status:** `complete` ✅  
**Zakres:** Strona główna, podstrony, animacje, responsywność, dark/light mode — szczegóły Next.js + React + Tailwind
**Zależności:** PLAN_1 §2 (architektura), PLAN_10 §1 (design system)
**Wejście:** Zatwierdzony tech stack (Next.js 15), design tokens z PLAN_10, struktura danych z PLAN_4
**Wyjście:** SSR/SSG strony, komponenty React, style Tailwind, animacje, responsywność

**Zatwierdzone decyzje:**
- Framework: Next.js 15 (App Router) + React + TypeScript ✅
- Styl: Professional (nie creative, nie minimalistyczny) ✅
- Font: Inter (700/800 headings, 400/500 body) ✅
- Animacje: Balanced (widoczne ale nie abstrakcyjne) ✅

**Sekcje:**
- §1 Architektura frontend (struktura strony, nawigacja)
- §2 Strona główna (hero, about, skills, projects, contact)
- §3 Podstrony (o mnie, projekty szczegółowe, kontakt)
- §4 Animacje i interakcje
- §5 Responsywność i dark mode
- §6 Implementacja

---

### PLAN_3 — Panel Administracyjny CMS

**Status:** `—`  
**Zakres:** Dashboard, edycja treści, zarządzanie podstronami, menu, CV PDF, projekty portfolio
**Zależności:** PLAN_1 §3 (tech stack), PLAN_4 §1 (backend API)
**Wejście:** REST API z PLAN_4, auth z PLAN_4
**Wyjście:** W pełni funkcjonalny panel admin z CRUD operacjami

**Sekcje:**
- §1 Wybór CMS (Payload CMS vs Sanity vs custom)
- §2 Dashboard i widżety
- §3 Edycja treści strony głównej
- §4 Zarządzanie podstronami (CRUD)
- §5 Edycja menu/nawigacji
- §6 Upload CV PDF
- §7 Zarządzanie projektami portfolio
- §8 Implementacja

---

### PLAN_4 — Backend API

**Status:** `—`  
**Zakres:** REST API, authentication, baza danych, file storage, validation
**Zależności:** PLAN_1 §3 (tech stack), PLAN_3 §1 (wybór CMS)
**Wejście:** Schemat danych z PLAN_2 i PLAN_3
**Wyjście:** API endpoints, auth flow, storage layer

**Sekcje:**
- §1 Architektura API (REST vs GraphQL, Next.js API Routes)
- §2 Baza danych (schemat, migracje)
- §3 Authentication (NextAuth, roles)
- §4 File storage (Cloudinary/AWS S3)
- §5 Validation i sanitization
- §6 Rate limiting i security headers
- §7 Implementacja

---

### PLAN_5 — Deployment, DNS i CI/CD

**Status:** `—`  
**Zakres:** Cloudflare DNS, subdomen radoslaw-staw.korp-cbm.com, Vercel/GitHub Pages, GitHub Actions CI/CD
**Zależności:** PLAN_1 §4 (ADR-004), zatwierdzona domena
**Wejście:** Zatwierdzona architektura hostingowa
**Wyjście:** Działająca strona na subdomenie z automatycznym CI/CD

**Sekcje:**
- §1 Konfiguracja DNS w Cloudflare
- §2 Hosting (Vercel vs GitHub Pages vs Netlify)
- §3 CI/CD (GitHub Actions)
- §4 SSL/certyfikaty
- §5 Backup i rollback strategii
- §6 Domain verification

---

### PLAN_6 — Security, Performance, SEO, Accessibility

**Status:** `—`  
**Zakres:** CSP, rate limiting, XSS/CSRF, lazy loading, image optimization, SEO, WCAG 2.1 AA, Lighthouse
**Zależności:** PLAN_1 §5 (kolory/aksessibility), PLAN_4 §5–6 (security)
**Wejście:** Zaimplementowany frontend z PLAN_2 i backend z PLAN_4
**Wyjście:** Strona z wynikami Lighthouse >90 we wszystkich kategoriach

**Sekcje:**
- §1 Security (CSP, headers, XSS/CSRF)
- §2 Performance (lazy loading, code splitting, image optimization)
- §3 SEO (meta, sitemap, JSON-LD, Open Graph)
- §4 Accessibility (WCAG 2.1 AA)
- §5 Lighthouse CI targets

---

### PLAN_7 — Edukacja PM (komplementarna do portfolio)

**Status:** `—`  
**Zakres:** Narzędzia PM, certyfikacje, frameworki — co Radosław powinien opanować by wzmacnić profil PM
**Zależności:** PLAN_1 §6 (luka kompetencyjna)
**Wejście:** Lista luk z PLAN_1 §6
**Wyjście:** Plan edukacyjny z priorytetami i źródłami

**Sekcje:**
- §1 Narzędzia PM (Jira, ClickUp, Notion, Miro, Trello)
- §2 Frameworki (Agile, Scrum, Kanban)
- §3 Certyfikacje (PMP, CSM, PSMB)
- §4 Kursy online (Coursera, edX, Udemy)
- §5 Plan nauki (kolejność, czas, priorytety)

---

### PLAN_8 — Testy i QA

**Status:** `—`  
**Zakres:** Unit tests, E2E, visual regression, accessibility audit, Lighthouse CI w pipeline
**Zależności:** PLAN_2 (frontend), PLAN_4 (backend)
**Wejście:** Zaimplementowane komponenty i API
**Wyjście:** Suite testów z coverage i CI integration

**Sekcje:**
- §1 Unit tests (Jest)
- §2 E2E tests (Playwright)
- §3 Visual regression (Chromatic)
- §4 Accessibility audit (axe-core)
- §5 Lighthouse CI w pipeline
- §6 Strategie testów

---

### PLAN_9 — Content Strategy i Projekty

**Status:** `—`  
**Zakres:** Case study format, GitHub integration, blog (opcjonalny), social proof, CV PL+EN
**Zależności:** PLAN_2 (struktura projektu), PLAN_4 (API)
**Wejście:** Projekty Radosława z CV i GitHub
**Wyjście:** Gotowa struktura contentowa z case studies

**Sekcje:**
- §1 Struktura case study (szablon)
- §2 GitHub integration (automatyczny import projektów)
- §3 Projekty portfolio z CV (case studies)
- §4 Blog (opcjonalny)
- §5 Social proof i referencje
- §6 CV PL + EN wersje

---

### PLAN_10 — Design System

**Status:** `—`  
**Zakres:** Paleta kolorów, typography, spacing, components library, animation guidelines
**Zależności:** PLAN_1 §5 (kolory i WCAG)
**Wejście:** Zatwierdzona paleta kolorów od Radosława
**Wyjście:** Design tokens, component library, style guide

**Sekcje:**
- §1 Paleta kolorów (tokens, contrast verification)
- §2 Typography (font family, hierarchy, responsive sizing)
- §3 Spacing system (4px/8px grid)
- §4 Components library (buttons, cards, forms, navigation)
- §5 Animation guidelines (duration, easing, prefers-reduced-motion)

---

## CV Quick View — dodatkowy tool

**Status:** `complete` ✅  
**Zakres:** Minimalistyczna strona HTML z podglądem CV + generowanie PDF + obsługa PL/EN
**Lokalizacja:** `CV_RadekS_Qiuck_view_update/index.html`
**Funkcje:**
- ✅ Pełne dane CV (doświadczenie, edukacja, umiejętności, projekty)
- ✅ Przełącznik języka PL/EN
- ✅ Podgląd w przeglądarce
- ✅ Generowanie PDF (print)
- ✅ Responsywność
- ✅ Zdjęcie z CV
- ✅ Timeline doświadczenia

---

## Otwarte decyzje [?]

| PLAN | Sekcja | Pytanie | Deadline |
|--|--------|--|----|
| PLAN_1 §5 | Kolory — #2E3604 i #E19D29 nie spełniają WCAG AA na białym tle | Czy użyć ciemniejszych wersji dla tekstu? | 2026-05-05 |
| PLAN_3 §1 | Payload CMS vs Sanity.io vs custom admin panel | Wybór CMS do zarządzania treścią | 2026-05-05 |
| PLAN_2 §1 | Next.js (App Router) vs Astro + Frontmatter | Framework frontendowy | ✅ ZATWIERDZONY: Next.js 15 |
| PLAN_4 §1 | Next.js API Routes vs osobny backend (Node/Express) | Architektura backendu | 2026-05-05 |
| PLAN_5 §2 | Vercel vs GitHub Pages + Netlify | Hosting | 2026-05-05 |
| PLAN_9 §2 | Automatyczne ładowanie projektów z GitHub API vs ręczne case studies | Struktura portfolio | 2026-05-05 |
| PLAN_1 §4 | Blog w portfolio — tak czy nie? | Optional feature | 2026-05-05 |
| PLAN_1 §6 | Czy Radosław posiada już certyfikaty PM? | Weryfikacja do dodania w profilu | 2026-05-05 |
| PLAN_6 §4 | Analytics: Plausible vs Umami (self-hosted) | Privacy-friendly tracking | 2026-05-05 |
| PLAN_2 §4 | Poziom animacji | Subtelne / Balanced / Expressive? | 2026-05-05 |
| PLAN_2 §6 | Font | Inter OK? Alternatywy? | 2026-05-05 |
| PLAN_2 §7 | Zdjęcie profilowe | Zdjęcie z CV (IMG_9882.JPEG) czy nowe? | 2026-05-05 |
| PLAN_2 §7 | Social links | LinkedIn, GitHub, inne? | 2026-05-05 |

---

## Zablokowane zadania [!]

| PLAN | Sekcja | Blokada | Czeka na |
|--|--------|--|------|
| PLAN_3 | wszystkie | Zależne od PLAN_1 §4 (ADR) | ADR-002: wybór CMS |
| PLAN_4 | wszystkie | Zależne od PLAN_1 §3 i PLAN_3 §1 | Wybór tech stack i CMS |
| PLAN_5 | §1 | Domena w posiadaniu — konfiguracja do wykonania | DNS access |
| PLAN_5 | §2 | Zależne od PLAN_1 zatwierdzonego | Hosting decision |
| PLAN_7 | §1 | Zależne od PLAN_1 §6 (luka kompetencyjna) | Decyzja Radosława co rozwijać |
| PLAN_10 | §1 | Zależne od PLAN_1 §5 (kolory) | Zatwierdzenie palety kolorów |

---

## Technical debt do adresowania

| PLAN | Opis | Priorytet |
|--|------|------|
| PLAN_1 §5 | Kolory #2E3604 i #E19D29 — konieczna korekta dla WCAG AA | BLOCKER |
| PLAN_1 §6 | Brak certyfikatów PM w CV — do uzupełnienia przed launch | MAJOR |
| PLAN_9 §2 | GitHub API może nie pobrać wszystkich projektów (private repos) | MINOR |
| PLAN_4 | Brak doświadczenia z Next.js API — krzywa nauki | MAJOR |
| PLAN_3 | Payload CMS — nowy stack dla Radosława | MAJOR |

---

## Propozycja kolejności realizacji (fazy)

### Faza 1: Fundament (tygodnie 1–2) ✅ ZAKOŃCZONA
- [x] PLAN_1 — Architektura (zatwierdzenie)
- [x] PLAN_2 — Frontend Portfolio (szczegóły Next.js)
- [ ] PLAN_10 — Design System (kolejne)
- [ ] PLAN_7 — Edukacja PM (równoległe)

### Faza 2: Frontend (tygodnie 2–4)
- [ ] PLAN_2 — Implementacja (strona główna + podstrony)
- [ ] PLAN_6 — Performance + Accessibility

### Faza 3: Backend + CMS (tygodnie 4–6)
- [ ] PLAN_3 — Panel administracyjny
- [ ] PLAN_4 — Backend API
- [ ] PLAN_9 — Content strategy

### Faza 4: Deployment (tygodnie 6–7)
- [ ] PLAN_5 — DNS + CI/CD + hosting
- [ ] PLAN_8 — Testy + QA

### Faza 5: Finalizacja (tygodnie 7–8)
- [ ] Uzupełnienie luk w CV (umiejętności PM)
- [ ] Testy użycia (UAT)
- [ ] Launch 🚀

---

## Historia przeglądów (Periodic Review)

| Data | Co sprawdzono | Agent |
|--|--|
| 2026-04-28 | Inicjalne stworzenie indeksu z PLAN_1 | Agent (qwen3.6:35b) |
| 2026-04-29 | PLAN_1 complete ✅ + PLAN_2 complete ✅ + CV Quick View ✅ | Agent (qwen3.6:35b) |

---

## Powiązane zasoby

- CV źródłowe: `CV_RadekS/CV-RadosławStawiszyński-25.10.2024-PL.docx`
- CV EN: `CV_RadekS/CV-RadosławStawiszyński-21.06.2024-EN.pdf`
- CV Quick View: `CV_RadekS_Qiuck_view_update/index.html` ✅
- CV_photo: `CV_RadekS/STAWISZYŃSKI RADOSŁAW IMG_9882.JPEG`
- Istniejące repozytorium: https://github.com/RadoslawStawiszynski/Portfolio.git
- GitHub profil: https://github.com/RadoslawStawiszynski
- Istniejąca domena: korp-cbm.com (w posiadaniu Radosława)
- Celowany subdomen: radoslaw-staw.korp-cbm.com