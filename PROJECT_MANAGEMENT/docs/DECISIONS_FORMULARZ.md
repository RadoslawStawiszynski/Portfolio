---
project: Portfolio Professional — Radosław Stawiszyński
type: decision-form
created: 2026-04-28
updated: 2026-04-28
status: waiting-for-human
---

# 📋 Formularz decyzyjny — Portfolio Professional

> Wypełnij tę tabelę — każda odpowiedź uruchomi odpowiedni etap implementacji.
> Odpowiedzi zapisz w pliku `.clinerules/portfolio-decisions.md` lub odpowiedz directly tutaj.

---

## 🔴 PRIORYTET 1 — Architektura (musi być przed kodem)

### 1.1 Framework frontend
> Portfolio ma być budowane na:

- [x] **Next.js 15** — React, SSR, Payload CMS (PROPOZYCJA)
- [ ] **Astro 5** — lżejszy, island architecture
- [ ] **Inne:** ___________

**Uzasadnienie (opcjonalne):**
<!--HUMAN
/-->

---

### 1.2 CMS (panel administracyjny)
> Panel do zarządzania treścią:

- [x] **Payload CMS** — open-source, w tym samym repo, TypeScript (PROPOZYCJA)
- [ ] **Sanity.io** — SaaS, szybszy setup
- [ ] **Własny admin panel** — full control, więcej pracy
- [ ] **Bez CMS** — wszystkie treści hard-coded / markdown files
- [ ] **Inne:** ___________

**Uzasadnienie (opcjonalne):**
<!--HUMAN
/-->

---

### 1.3 Baza danych
> Dane portfolio (projekty, strony, treści):

- [x] **PostgreSQL** — strukturalne, Prisma ORM, Railway (PROPOZYCJA)
- [ ] **MongoDB** — flexible schema, Atlas free tier
- [ ] **SQLite** — lokalna, bez zewnętrznych zależności
- [ ] **Headless CMS database** — Payload/Sanity自带
- [ ] **Inne:** ___________

**Uzasadnienie (opcjonalne):**
<!--HUMAN
/-->

---

### 1.4 Hosting
> Gdzie strona będzie hostowana:

- [x] **Vercel** — zero-config Next.js, PR previews (PROPOZYCJA)
- [ ] **GitHub Pages** — darmowy, ale tylko SSG
- [ ] **Netlify** — SSG + edge functions
- [ ] **Self-hosted** — własny serwer VPS
- [ ] **Inne:** ___________

**Uzasadnienie (opcjonalne):**
<!--HUMAN
/-->

---

## 🟡 PRIORYTET 2 — Design (przed frontendem)

### 2.1 Paleta kolorów
> Propozycja: `#2E3604`, `#4E5E07`, `#E19D29`, `#D8D2CF`, `#8D8179`

⚠️ **Uwaga:** Kolory `#2E3604` (kontrast 2.5:1) i `#E19D29` (1.6:1) **nie spełniają WCAG AA**.

- [x] **Użyć ciemniejszych wersji** — `#1A1F00`, `#3A4605`, zachować klimat (PROPOZYCJA)
- [ ] **Zachować kolory** — ale używać tylko jako akcentów graficznych
- [ ] **Nowa paleta** — redesign, neutralny branding PM
- [ ] **Moja paleta:** 
  - Kolor 1: ___________
  - Kolor 2: ___________
  - Kolor 3: ___________
  - Kolor 4: ___________
  - Kolor 5: ___________

**Uzasadnienie (opcjonalne):**
<!--HUMAN
/-->

---

### 2.2 Styl portfolio
> Jak ma wyglądać portfolio:

- [x] **Profesjonalne / corporate** — czyste, strukturalne, PM-ready
- [ ] **Kreatywne / designer** — animacje, non-standard layout
- [ ] **Minimalistyczne** — mniej jest więcej
- [ ] **Hybryda** — profesjonalna struktura + kreatywne akcenty
- [ ] **Inny styl:** ___________

**Uzasadnienie (opcjonalne):**
<!--HUMAN
/-->

---

## 🟡 PRIORYTET 3 — Zawartość (przed deploymentem)

### 3.1 Blog w portfolio
> Czy dodać sekcję bloga (wpisy o projektach, technologiach, doświadczeniu PM):

- [x] **Tak** — wzmacnia profil PM (PROPOZYCJA)
- [ ] **Nie** — tylko case studies i projekty
- [ ] **Potem** — dodać po launchem

**Uzasadnienie (opcjonalne):**
<!--HUMAN
/-->

---

### 3.2 GitHub auto-import
> Automatyczne ładowanie projektów z GitHub API vs ręczne case studies:

- [x] **GitHub API + ręczne case studies** — pół-automatyczny (PROPOZYCJA)
- [ ] **Tylko ręczne** — wszystkie case studies pisane ręcznie
- [ ] **Tylko automatyczny** — bez case studies, tylko listy projektów
- [ ] **Inne:** ___________

**Uzasadnienie (opcjonalne):**
<!--HUMAN
/-->

---

### 3.3 Projekty PM do eksponowania
> Które projekty z CV pokazać jako case studies? (zaznacz)

- [x] **Instalacje fotowoltaiczne B2B** (od 03/2021) — kierowanie biurem projektowym
- [x] **Expertel Serwis** (10/2019 – 09/2020) — koordynacja zespołów
- [x] **Optical Core / Qi Connect** (04/2018 – 08/2019) — koordynacja 15 osób
- [x] **Creative Ceramika** (07/2016 – 01/2018) — projektant, koordynacja sklepu
- [ ] **Dodatkowe projekty:** ___________

**Które projekty z GitHub dodać jako case studies:**
<!--HUMAN
Wymien projekty z GitHub które chcesz pokazać:
/-->

---

## 🟢 PRIORYTET 4 — Rozwój PM (równoległy)

### 4.1 Certyfikacje PM
> Które certyfikacje chcesz dopracować przed launchem?

- [ ] **PSM I** (Professional Scrum Master) — 40–60h nauki, eksam online
- [ ] **CSM** (Certified Scrum Master) — 14h kurs + certyfikat
- [ ] **PMP** — wymaga 3 lata PM experience, 80–120h nauki
- [ ] **PSMB** (Professional Scrum Master Beginner) — 20–30h
- [ ] **Żadnej** — skupiam się na narzędziach, nie certyfikatach

**Uzasadnienie (opcjonalne):**
<!--HUMAN
/-->

---

### 4.2 Narzędzia PM do nauki
> Które narzędzia PM chcesz opanować przed launchem? (zaznacz)

- [x] **Jira / Confluence** — standard w zespołach dev (PROPOZYCJA)
- [x] **Notion** — dokumentacja (PROPOZYCJA)
- [ ] **ClickUp** — alternatywa dla Jira
- [ ] **Miro** — whiteboard / brainstorming
- [ ] **Trello** — kanban dla projektów
- [ ] **Toggl** — time tracking
- [ ] **draw.io / Mermaid** — diagramy
- [ ] **Postman** — API testing (dla PM rozumiejącego integracje)

**Dodatkowe narzędzia:**
<!--HUMAN
/-->

---

### 4.3 Frameworki PM
> Które frameworki chcesz dodać do CV?

- [x] **Agile / Scrum** — podstawa zarządzania w IT (PROPOZYCJA)
- [x] **Kanban** — wizualizacja przepływu pracy
- [ ] **Waterfall** — tradycyjne zarządzanie
- [ ] **Lean / Six Sigma** — optymalizacja procesów
- [ ] **Inne:** ___________

**Uzasadnienie (opcjonalne):**
<!--HUMAN
/-->

---

## 🟢 PRIORYTET 5 — Deployment (przed launchem)

### 5.1 Analytics
> Narzędzie do śledzenia odwiedzin:

- [x] **Umami** — self-hosted, darmowy, privacy-friendly (PROPOZYCJA)
- [ ] **Plausible** — SaaS, darmowy tier, privacy-friendly
- [ ] **Google Analytics 4** — pełna analityka, ale nie privacy-friendly
- [ ] **Bez analytics** — nie potrzebuję

**Uzasadnienie (opcjonalne):**
<!--HUMAN
/-->

---

### 5.2 Subdomen konfiguracja
> DNS dla radoslaw-staw.korp-cbm.com:

- [ ] **Cloudflare CNAME** → Vercel (PROPOZYCJA — potrzebuję dostęp do Cloudflare dashboard)
- [ ] **Cloudflare A record** → IP Vercel
- [ ] **Inne:** ___________

**Czy masz dostęp do Cloudflare dashboard?**
- [x] **Tak** — podasz credentials
- [ ] **Nie** — skonfiguruję później

---

## ✅ PODSUMOWANIE DECYZJI

<!--HUMAN
Tutaj wpisz swoje ostateczne decyzje — skopiuj zaznaczone opcje:
/-->

```yaml
# Decyzje końcowe:

framework: "nextjs"         # nextjs | astro
cms: "payload"              # payload | sanity | custom | none
database: "postgresql"      # postgresql | mongodb | sqlite | cms-db
hosting: "vercel"           # vercel | github-pages | netlify | self-hosted
colors:                     # paleta kolorów
  primary: "#1A1F00"        # ciemna zieleń (skorygowana)
  secondary: "#3A4605"      # zielona (skorygowana)
  accent: "#E19D29"         # złota (używana na ciemnym tle)
  background: "#D8D2CF"     # jasny beż
  text-muted: "#8D8179"     # szary
style: "professional"       # professional | creative | minimalist | hybrid
blog: true                  # true | false
github-import: true         # true | false
certifications: ["PSM I"]   # lista certyfikatów
tools: ["jira", "notion"]   # lista narzędzi PM
frameworks: ["agile", "scrum", "kanban"]  # lista frameworków
analytics: "umami"          # umami | plausible | ga4 | none
dns: "cloudflare-cname"     # cloudflare-cname | cloudflare-a | inne
```

---

## 📋 Następne kroki po wypełnieniu formularza

1. **Czekaj na agenta** — zaktualizuje PLAN_1 z zatwierdzonymi decyzjami
2. **Agent przygotuje PLAN_10** — Design System z zatwierdzonymi kolorami
3. **Agent przygotuje PLAN_2** — Frontend Portfolio z zatwierdzonym frameworkiem
4. **Agent przygotuje PLAN_7** — Edukacja PM z planem nauki
5. **Implementacja zaczyna się**

---

_Wypełnij powyższe sekcje i odpowiedz na pytania — agent przetworzy decyzje i przystąpi do szczegółowych planów modułów._