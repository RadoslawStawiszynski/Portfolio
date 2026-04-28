---
project: Portfolio Professional — Radosław Stawiszyński
version: 1.0
created: 2026-04-28
updated: 2026-04-28
---

# DECISIONS.md — Rejestr decyzji projektowych

> Rejestr wszystkich decyzji architektury i kierunku projektu.
> Każda decyzja zawiera: kontekst, opcje, uzasadnienie i konsekwencje.

---

## Decyzje zatwierdzone

### [Decyzja 2026-04-28] Profil portfolio: Project Manager
- **Kontekst:** Radosław aplikuje na stanowiska programisty, ale ma silne doświadczenie PM
- **Decyzja:** Portfolio pozycjonuje jako PM z kompetencjami technicznymi
- **Uzasadnienie:** Doświadczenie kierowania zespołami 15+ osób, biurem projektowym, logistyką
- **Alternatywa:** Pozycjonowanie jako Full-Stack Developer — odrzucone (słabsza różnicjacja)
- **Konsekwencje:** Wszystkie moduły portfolio muszą wspierać profil PM

### [Decyzja 2026-04-28] Domena: radoslaw-staw.korp-cbm.com
- **Kontekst:** Istnieje domena korp-cbm.com w posiadaniu Radosława
- **Decyzja:** Portfolio na subdomenie radoslaw-staw.korp-cbm.com
- **Uzasadnienie:** Profesjonalna nazwa, spójna z marką, łatwa do zapamiętania
- **Konsekwencje:** Konfiguracja DNS przez Cloudflare dashboard

### [Decyzja 2026-04-28] Struktura repozytorium: monorepo
- **Kontekst:** Frontend + CMS + Backend w jednym projekcie
- **Decyzja:** Monorepo z Next.js + Payload CMS
- **Uzasadnienie:** Mniejsza złożoność, TypeScript sharing types, łatwiejszy deploy
- **Alternatywa:** Polyrepo (oddzielne repo dla frontend i CMS) — odrzucone (większa złożoność)

---

## Decyzje oczekujące na zatwierdzenie

### [?] Decyzja: Framework frontend — Next.js vs Astro
- **Plan:** ADR-001 w PLAN_1 §4
- **Deadline:** 2026-05-05
- **Proponowana:** Next.js 15 (App Router)
- **Uzasadnienie:** Radosław zna React, Payload CMS integruje się naturalnie, SSR = lepsze SEO
- **Status:** CZEKA NA DECYZJĘ

### [?] Decyzja: CMS — Payload CMS vs Sanity.io
- **Plan:** ADR-002 w PLAN_1 §4
- **Deadline:** 2026-05-05
- **Proponowana:** Payload CMS (open-source)
- **Uzasadnienie:** Darmowy, self-hosted, TypeScript-native, w tym samym repo
- **Status:** CZEKA NA DECYZJĘ

### [?] Decyzja: Baza danych — PostgreSQL vs MongoDB
- **Plan:** ADR-003 w PLAN_1 §4
- **Deadline:** 2026-05-05
- **Proponowana:** PostgreSQL (Railway)
- **Uzasadnienie:** Strukturalne dane portfolio, Prisma ORM, stable
- **Status:** CZEKA NA DECYZJĘ

### [?] Decyzja: Hosting — Vercel vs GitHub Pages vs Netlify
- **Plan:** ADR-004 w PLAN_1 §4
- **Deadline:** 2026-05-05
- **Proponowana:** Vercel + Cloudflare DNS
- **Uzasadnienie:** Zero-config dla Next.js, PR previews, darmowy SSL
- **Status:** CZEKA NA DECYZJĘ

### [?] Decyzja: Paleta kolorów — WCAG compliance
- **Plan:** §5 w PLAN_1
- **Deadline:** 2026-05-05
- **Oryginalna:** #2E3604, #4E5E07, #E19D29, #D8D2CF, #8D8179
- **Propozycja korekty:** #1A1F00, #3A4605, #E19D29 (na ciemnym), #D8D2CF, #8D8179
- **Problem:** Oryginał nie spełnia WCAG AA (kontrast 2.5:1 i 1.6:1)
- **Status:** CZEKA NA DECYZJĘ

### [?] Decyzja: Blog w portfolio — tak czy nie?
- **Plan:** §7.2 w PLAN_1
- **Deadline:** 2026-05-05
- **Proponowana:** Tak, ale optional na start
- **Uzasadnienie:** Blog wzmacnia profil PM (case studies, thought leadership)
- **Status:** CZEKA NA DECYZJĘ

### [?] Decyzja: GitHub auto-import — automatyczny czy ręczny?
- **Plan:** §7.2 w PLAN_1
- **Deadline:** 2026-05-05
- **Proponowana:** GitHub API + ręczne case studies
- **Uzasadnienie:** Automatyczny import bez case studies jest pusty — lepsze ręczne opisy
- **Status:** CZEKA NA DECYZJĘ

### [?] Decyzja: Certyfikaty PM — które?
- **Plan:** §6.1 w PLAN_1
- **Deadline:** 2026-05-15
- **Proponowane (HIGH priority):** PSM I + Jira/Confluence
- **Status:** CZEKA NA DECYZJĘ

### [?] Decyzja: Analytics — Plausible vs Umami
- **Plan:** §7.2 w PLAN_1
- **Deadline:** 2026-05-05
- **Propozycja:** Umami (self-hosted, darmowy)
- **Status:** CZEKA NA DECYZJĘ

---

## Historia zmian

| Data | Decyzja | Autor |
|------|---------|-------|
| 2026-04-28 | Profil PM, Domena, Struktura monorepo | Agent (qwen3.6:35b) |