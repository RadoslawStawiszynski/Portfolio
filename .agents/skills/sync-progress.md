# Skill: Sync Progress

## Rola i zasady

Jesteś **agentem synchronizacji postępu** projektu PortfolioHub.  
Twoje zadanie to **aktualizacja dokumentacji** tak, aby odzwierciedlała faktyczny stan kodu w repo.

**Zasady:**
- Modyfikujesz TYLKO: `PLAN.md` i `CHANGELOG.md`
- Nie dotykasz kodu aplikacji ani konfiguracji
- Każda zmiana musi być uzasadniona konkretnym commitem git
- Na koniec tworzysz jeden commit z wszystkimi zmianami
- Nie spekulujesz — tylko to co widać w `git log`

---

## Kontekst projektu

**Repo root:** `/home/rspro/Dokumenty/1.CODE/2.Portfolio`  
**Aplikacja:** `platform/` — Next.js 15 + Payload CMS 3  
**Branch:** `dev`  
**PLAN.md:** główne źródło prawdy o taskach — checkboxy `- [ ]` → `- [x]`  
**CHANGELOG.md:** format Keep a Changelog (`## [Unreleased]`, `### Added/Fixed/Changed`)

---

## Krok 1 — Ustal zakres commitów do przeanalizowania

```bash
# Znajdź ostatni commit synchronizacji (docs(sync):)
LAST_SYNC=$(git -C /home/rspro/Dokumenty/1.CODE/2.Portfolio log --oneline --grep="docs(sync):" -1 --format="%H" 2>/dev/null)

if [ -n "$LAST_SYNC" ]; then
  echo "Ostatni sync: $LAST_SYNC"
  git -C /home/rspro/Dokumenty/1.CODE/2.Portfolio log --oneline ${LAST_SYNC}..HEAD
else
  echo "Brak poprzedniego synca — analizuję ostatnie 30 commitów"
  git -C /home/rspro/Dokumenty/1.CODE/2.Portfolio log --oneline -30
fi
```

Zapamiętaj listę commitów do przeanalizowania.

---

## Krok 2 — Wyciągnij ID tasków z commitów

Z każdego commita wyciągnij ID tasków w formacie `X99.99` (np. `B8.5`, `F9.1`, `K12.5`, `D11.3`, `H13.9`, `A10.1`, `M17.1`).

```bash
# Wyciągnij wszystkie ID tasków z commitów
git -C /home/rspro/Dokumenty/1.CODE/2.Portfolio log --oneline ${LAST_SYNC:+${LAST_SYNC}..}HEAD \
  | grep -oE '[A-Z][0-9]+\.[0-9]+' | sort -u
```

Zbuduj listę: `{ taskId: "B8.5", commitMsg: "feat(api): POST /api/contact — ...", date: "2026-06-13" }`

---

## Krok 3 — Zaktualizuj checkboxy w PLAN.md

Dla każdego znalezionego task ID:

1. Przeczytaj PLAN.md i znajdź linię zawierającą `**X99.99**`
2. Jeśli linia ma `- [ ]` → zmień na `- [x]` i dodaj `(YYYY-MM-DD, Agent: Claude)`
3. Jeśli linia ma już `- [x]` → pozostaw bez zmian

```bash
# Przykład szukania
grep -n "B8\.5\|F9\.2" /home/rspro/Dokumenty/1.CODE/2.Portfolio/PLAN.md
```

**Aktualizuj też sekcję Roadmap (§20):**  
W bloku kodu danej Fazy znajdź odpowiednie linie i oznacz jako `[x]` — np.:
```
- [x] Podstawowe API endpoints (B8.5 — formularz kontaktowy, rate limiting) (2026-06-13, Agent: Claude)
```

**Reguła:** Jeśli wszystkie linie w Fazie mają `[x]` → zaktualizuj nagłówek statusu planu (linia `Status:` na górze PLAN.md).

---

## Krok 4 — Zaktualizuj CHANGELOG.md

```bash
# Przeczytaj CHANGELOG.md
cat /home/rspro/Dokumenty/1.CODE/2.Portfolio/CHANGELOG.md
```

Dla każdego commita który NIE jest jeszcze w CHANGELOG.md:

1. Sklasyfikuj commit według prefiksu:
   - `feat(...)` → `### Added`
   - `fix(...)` → `### Fixed`
   - `chore(...)` → `### Changed` lub pomiń (jeśli czysto techniczne)
   - `docs(...)` → pomiń (wewnętrzne)
   - `refactor(...)` → `### Changed`

2. Dodaj nowy wpis pod `## [Unreleased]` → odpowiednia sekcja `### Added/Fixed/Changed`

3. Format wpisu:
   ```markdown
   - Opis zmiany w języku polskim — co dodano/naprawiono i dlaczego (ID_TASKU)
   ```

**Nie duplikuj** wpisów które już istnieją w CHANGELOG.md.

---

## Krok 5 — Sprawdź spójność

```bash
# Policz otwarte i zamknięte taski
echo "Zamknięte:" && grep -c "\[x\]" /home/rspro/Dokumenty/1.CODE/2.Portfolio/PLAN.md
echo "Otwarte:" && grep -c "\[ \]" /home/rspro/Dokumenty/1.CODE/2.Portfolio/PLAN.md

# Sprawdź czy są taski [x] które nie mają daty
grep "\[x\]" /home/rspro/Dokumenty/1.CODE/2.Portfolio/PLAN.md | grep -v "202[0-9]-[0-9][0-9]-[0-9][0-9]" | head -10
```

Jeśli `[x]` bez daty → dodaj dzisiejszą datę i `Agent: Claude` (tylko dla tasków które mają odpowiedniki w commitach).

---

## Krok 6 — Commit

```bash
TODAY=$(date +%Y-%m-%d)

git -C /home/rspro/Dokumenty/1.CODE/2.Portfolio add PLAN.md CHANGELOG.md
git -C /home/rspro/Dokumenty/1.CODE/2.Portfolio commit -m "docs(sync): update progress — session ${TODAY}

Zaktualizowane checkboxy: [lista task IDs]
CHANGELOG: [liczba nowych wpisów] nowych wpisów"
```

---

## Krok 7 — Raport końcowy (tylko na stdout, nie zapisuj do pliku)

Wydrukuj krótkie podsumowanie:

```
=== SYNC PROGRESS REPORT ===
Data: YYYY-MM-DD
Zakres: od [SHA] do HEAD ([N] commitów)

Zaktualizowane taski w PLAN.md:
  [x] B8.5 — POST /api/contact (2026-06-13)
  [x] F9.2 — Subdomain routing middleware (2026-06-12)

Nowe wpisy w CHANGELOG.md:
  + POST /api/contact z rate limitingiem (B8.5)

Status Faz:
  Faza 0: UKOŃCZONA (14/14 tasków)
  Faza 1: 6/6 core tasków ✓ — brak otwartych
  Faza 2: 0/6 tasków (nie rozpoczęta)

Commit: [SHA] docs(sync): update progress — session YYYY-MM-DD
============================
```
