# Skill: Session Handoff

## Rola i zasady

Jesteś **agentem przekazania sesji** projektu PortfolioHub.  
Twoje zadanie to **zapisanie stanu sesji** do `.remember/` — żeby następna sesja (dowolny agent) wiedziała co zostało zrobione i co jest następne.

**Zasady:**
- Piszesz TYLKO do `.remember/now.md` i `.remember/today-YYYY-MM-DD.md`
- Czytasz: git log, PLAN.md, CHANGELOG.md
- Bądź konkretny — daty, SHA commitów, nazwy plików
- Nie analizuj kodu — tylko fakty z git i PLAN.md
- Cała operacja powinna zająć < 2 minuty

---

## Kontekst projektu

**Repo root:** `/home/rspro/Dokumenty/1.CODE/2.Portfolio`  
**Branch:** `dev`  
**Plik pamięci bieżącej:** `.remember/now.md` (nadpisuj — to bufor sesji)  
**Plik dzienny:** `.remember/today-YYYY-MM-DD.md` (dopisuj na końcu)

---

## Krok 1 — Zbierz dane z gita

```bash
TODAY=$(date +%Y-%m-%d)
NOW=$(date +%H:%M)

# Bieżący branch i ostatni commit
git -C /home/rspro/Dokumenty/1.CODE/2.Portfolio branch --show-current
git -C /home/rspro/Dokumenty/1.CODE/2.Portfolio log --oneline -1

# Commity od ostatniego handoff (szukaj "session-handoff" w commitach)
LAST_HANDOFF=$(git -C /home/rspro/Dokumenty/1.CODE/2.Portfolio log --oneline --grep="session-handoff\|handoff" -1 --format="%H" 2>/dev/null)

if [ -n "$LAST_HANDOFF" ]; then
  echo "=== COMMITY TEJ SESJI ==="
  git -C /home/rspro/Dokumenty/1.CODE/2.Portfolio log --oneline ${LAST_HANDOFF}..HEAD
else
  echo "=== OSTATNIE 15 COMMITÓW ==="
  git -C /home/rspro/Dokumenty/1.CODE/2.Portfolio log --oneline -15
fi

# Status zmian
git -C /home/rspro/Dokumenty/1.CODE/2.Portfolio status --short
```

---

## Krok 2 — Sprawdź aktywną fazę w PLAN.md

```bash
# Status Faz
grep -n "Faza [0-9]\|UKOŃCZON\|\- \[x\]\|\- \[ \]" /home/rspro/Dokumenty/1.CODE/2.Portfolio/PLAN.md \
  | grep -E "Faza|UKOŃCZON" | head -10

# Otwarte taski (pierwsze 15)
grep "\[ \]" /home/rspro/Dokumenty/1.CODE/2.Portfolio/PLAN.md | head -15

# Ostatnio zamknięte taski
grep "\[x\].*202[0-9]-[0-9][0-9]-[0-9][0-9]" /home/rspro/Dokumenty/1.CODE/2.Portfolio/PLAN.md | tail -10
```

---

## Krok 3 — Zapisz `.remember/now.md`

**Nadpisz** plik `.remember/now.md` tym szablonem (wypełnij danymi z kroków 1-2):

```markdown
## HH:MM | dev

[1-2 zdania co zostało zrobione w tej sesji. Konkretne nazwy tasków i plików.]

**Zrobione:**
- [x] TASK_ID — opis (np. B8.5 POST /api/contact z rate limitingiem Redis)
- [x] TASK_ID — opis

**Następne:**
- [ ] TASK_ID — opis (następny logiczny krok z PLAN.md)
- [ ] TASK_ID — opis

**Ostatni commit:** SHA — wiadomość
**Branch:** dev | **Commity przed origin:** N
```

---

## Krok 4 — Dopisz do `.remember/today-YYYY-MM-DD.md`

Plik dzienny — dopisz (nie nadpisuj) nowy blok na końcu:

```bash
TODAY=$(date +%Y-%m-%d)
HANDOFF_FILE="/home/rspro/Dokumenty/1.CODE/2.Portfolio/.remember/today-${TODAY}.md"

# Sprawdź czy plik istnieje
ls -la "$HANDOFF_FILE" 2>/dev/null || echo "Tworzę nowy plik dzienny"
```

Dopisz blok:
```markdown
## HH:MM | [opis sesji w 5 słowach]

**Wykonano:** [lista task IDs oddzielonych przecinkami]  
**Pliki:** [lista zmienionych plików]  
**Następne:** [następny task ID]
```

---

## Krok 5 — Commit handoff

```bash
TODAY=$(date +%Y-%m-%d)
NOW=$(date +%H:%M)

git -C /home/rspro/Dokumenty/1.CODE/2.Portfolio add .remember/now.md ".remember/today-${TODAY}.md" 2>/dev/null

# Commit tylko jeśli są zmiany
git -C /home/rspro/Dokumenty/1.CODE/2.Portfolio diff --cached --quiet || \
git -C /home/rspro/Dokumenty/1.CODE/2.Portfolio commit -m "chore(session-handoff): ${TODAY} ${NOW} — session state saved"
```

---

## Krok 6 — Podsumowanie na stdout

```
=== SESSION HANDOFF ===
Data: YYYY-MM-DD HH:MM
Branch: dev ([N] commitów przed origin)

Zrobione tej sesji:
  [x] B8.5 — POST /api/contact
  [x] Testy manualne — 400/404/429/200 ✓

Następne:
  [ ] F9.3 — PortfolioRenderer
  [ ] F9.4 — Bloki MVP (hero, about, experience, skills, contact)

Zapisano do: .remember/now.md + .remember/today-YYYY-MM-DD.md
======================
```
