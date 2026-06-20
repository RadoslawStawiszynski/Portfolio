# GitHub Copilot — Instrukcje agenta PortfolioHub

## Projekt

**PortfolioHub** — wielodostępna platforma portfolio.  
**Repo:** `/home/rspro/Dokumenty/1.CODE/2.Portfolio`  
**Aplikacja:** `platform/` — Next.js 15 + Payload CMS 3 + TypeScript + PostgreSQL

Przed każdym zadaniem przeczytaj:
- `.agents/CONTEXT.md` — aktualny stan projektu i kontekst
- `PLAN.md` — roadmapa i zadania (§2 ADR są niezmienne)

---

## Dostępne skille

Skille to pliki z instrukcjami dla agenta. Aby wykonać skill:
1. Przeczytaj wskazany plik
2. Wykonaj wszystkie kroki opisane w środku
3. Nie pomijaj żadnego przrzebiegu

| Skill | Plik | Kiedy uruchamiać | Model |
|-------|------|-----------------|-------|
| `audit-agent` | `.agents/skills/audit-agent.md` | Przed nową fazą, po serii commitów | Claude Haiku 4.5 |
| `sync-progress` | `.agents/skills/sync-progress.md` | Po sesji — aktualizuje PLAN.md i CHANGELOG.md | Claude Haiku 4.5 |
| `session-handoff` | `.agents/skills/session-handoff.md` | Na koniec sesji — zapisuje stan do `.remember/` | Claude Haiku 4.5 |
| `05-code-review` | `.agents/skills/05-code-review/SKILL.md` | Przed każdym merge, po implementacji taska | gemma4:e4b (Ollama) |
| `04-przeglad-tygodniowy` | `.agents/skills/04-przeglad-tygodniowy/SKILL.md` | W piątek lub po milestone | Claude Sonnet |
| `03-wykonaj-zadanie` | `.agents/skills/03-wykonaj-zadanie/SKILL.md` | Realizacja konkretnego taska | Claude Sonnet |
| `02-rozwin-modul` | `.agents/skills/02-rozwin-modul/SKILL.md` | Nowy moduł wymaga planu | Claude Sonnet |
| `01-bootstrap-projektu` | `.agents/skills/01-bootstrap-projektu/SKILL.md` | Nowy projekt | Claude Sonnet |

### Jak wywołać skill

Użytkownik może napisać np.:
- `uruchom audit-agent`
- `wykonaj sync-progress`
- `zrób code review`
- `session-handoff`

→ Przeczytaj odpowiedni plik SKILL.md i wykonaj wszystkie instrukcje.

---

## Zasady projektu (NIENARUSZALNE)

- **Nigdy nie commituj** `.env.local` ani żadnych prawdziwych sekretów
- **Pracuj na gałęzi `dev`** — nie na `main`
- **`git push` do `main`** wymaga jawnej zgody Radosława
- **Nie używaj `console.log`** — używaj `logger` z `@/lib/logger`
- **ADR-001..ADR-010** są zatwierdzone i niezmienne (patrz `PLAN.md §2`)
- **Docker** — tylko lokalne dev, nie produkcja
- **Komentarze w kodzie** — tylko WHY, nie co robi kod
- **Nie usuwaj plików** — archiwizuj do `archive/`

---

## Stack (skrót)

```
Next.js 15 (App Router) + TypeScript 5
Tailwind CSS 4 (CSS-first, brak tailwind.config.ts)
Payload CMS 3 — CMS + auth + admin
PostgreSQL 16 — Neon (prod) / Docker (dev)
Redis — Upstash (prod) / Docker (dev)
Cloudflare R2 (media) + Resend (email)
Vercel (hosting) + Cloudflare (DNS/CDN)
pino — structured JSON logging
```

---

## Typowy workflow sesji

```
1. START:   uruchom audit-agent          → raport w .agents/audit/
2. PRACA:   implementacja z Claude Code  → commity na dev
3. KONIEC:  uruchom sync-progress        → PLAN.md + CHANGELOG.md aktualne
            uruchom session-handoff      → .remember/now.md zaktualizowany
```
