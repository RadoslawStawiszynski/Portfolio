---
title: Zasady projektu dla Cline — wersja szczegółowa
version: 1.0
date: 2026-04-26
language: pl
for: Cline AI Assistant (VS Code)
ref: AI_PROJECT_WORKFLOW.md
---

# Zasady projektu dla Cline

> Ten plik jest rozszerzeniem `.clinerules`. Zawiera szczegółowe instrukcje zachowania agenta.
> Skrócona wersja operacyjna: `.clinerules` w root projektu.

---

## 1. Jak zaczynać każde zadanie

Zanim napiszesz pierwszą linię kodu:

1. **Zapytaj o PLAN** — do którego pliku PLAN należy to zadanie (`PLAN_N §X.Y`)?
2. **Przeczytaj kontekst** — relevantną sekcję PLAN, nie cały plik
3. **Potwierdź zakres** — "Rozumiem, że mam zrobić X w zakresie Y. Zacząć?"
4. **Sprawdź zależności** — czy jest `[!]` blokujące to zadanie?

Jeśli człowiek nie podał numeru PLAN — zapytaj. Nie zgaduj.

---

## 2. Jak aktualizować PLAN podczas pracy

### Zmiana statusu — schemat

```markdown
# Przed (status w pliku PLAN):

- [o] Implementacja walidacji JWT

# Po wykonaniu:

- [v] Implementacja walidacji JWT — 2026-04-28
```

### Gdy napotkasz problem

```markdown
- [!] Implementacja walidacji JWT — ZABLOKOWANE
  - → Przyczyna: brak biblioteki jose w package.json
  - → Czeka na: decyzja człowieka (jose vs jsonwebtoken)
```

### Gdy znajdziesz coś wartego uwagi

Nie wpisuj do PLAN — dodaj do `TODO.md` danego modułu:

```markdown
## Obserwacje

- [ ] Walidacja JWT nie obsługuje tokenów z algorytmem RS256 — warto sprawdzić
```

---

## 3. Zasady komentarzy w plikach PLAN

| Tag                           | Co robisz                                                                                       |
| ----------------------------- | ----------------------------------------------------------------------------------------------- |
| `<!--HUMAN ... /HUMAN-->`     | IGNORUJESZ całkowicie — to notatki prywatne człowieka                                           |
| `<!--AI-NOTE ... /AI-NOTE-->` | Odpowiadasz na notatkę, następnie zamieniasz tag na `<!--AI-RESOLVED data: ... /AI-RESOLVED-->` |
| `> **[Decyzja RRRR-MM-DD]**`  | Czytasz jako kontekst, nie modyfikujesz                                                         |

---

## 4. Kiedy pytać, a kiedy działać

### Działaj bez pytania gdy:

- Implementujesz kod zgodny z istniejącym PLAN `[o]` lub `[~]`
- Aktualizujesz statusy `[~]` → `[v]` po wykonaniu
- Dodajesz obserwacje do `TODO.md`
- Naprawiasz błąd opisany w tasku

### ZAWSZE pytaj gdy:

- Zadanie wymaga zmiany architektury (szczególnie `PLAN_1.md §1`)
- Odkrywasz że zakres jest większy niż opis taska
- Nie wiesz do którego PLAN należy zmiana
- Chcesz oznaczyć coś jako `[x]` (pominięte) — tylko człowiek decyduje
- Zależność między modułami jest niejasna

---

## 5. Format odpowiedzi po wykonaniu zadania

Użyj zawsze tego schematu:

```
✅ Wykonano: [jednozdaniowy opis co zrobiono]

📄 PLAN zaktualizowany:
   PLAN_N §X.Y: [o] → [v] 2026-XX-XX

⚠️  Do decyzji człowieka:
   [lista [?] które wymagają odpowiedzi — jeśli brak, pomiń sekcję]

📋 Dodano do TODO.md (src/modul/TODO.md):
   [lista obserwacji — jeśli brak, pomiń sekcję]

🔍 Sugestie do code review:
   - [konkretna rzecz do sprawdzenia]
   - [edge case do przetestowania]
```

---

## 6. Czego NIE wolno zmieniać bez explicit zgody

1. `PLAN_1.md §1` — architektura globalna projektu ("konstytucja")
2. Statusy `[x]` (pominięte) — tylko człowiek może odwrócić decyzję o pominięciu
3. Priorytety zadań (`[o]` vs `[ ]`) — człowiek decyduje co jest aktywne
4. `docs/DECISIONS.md` — tylko człowiek dodaje wpisy, agent może proponować

---

## 7. Zarządzanie TODO.md

TODO.md to **tymczasowy bufor**, nie archiwum:

```markdown
# Workflow TODO.md:

1. Ty (agent) dodajesz obserwacje podczas pracy z kodem
2. Człowiek przegląda i decyduje co realizować
3. Podczas Periodic Review (sekcja 11 w AI_PROJECT_WORKFLOW.md):
   - Pozycje [v] zostają (historia!) z adnotacją "zebrano do PLAN_N §X.Y — data"
   - Pozycje [ ] dostają nowe taski Kanban lub trafiają do PLAN
```

Każdy moduł ma swój `TODO.md`. Root-level `TODO.md` dla rzeczy cross-modułowych.

---

## 8. Commit messages — format

```
[PLAN_N §X.Y] typ: opis w jednej linii (max 72 znaki)

Opcjonalny paragraf wyjaśniający DLACZEGO (nie CO — kod mówi co).
```

Typy: `feat` / `fix` / `plan` / `refactor` / `review` / `docs` / `test`

Przykłady:

```
[PLAN_2 §2.1] feat: walidacja JWT w middleware auth
[PLAN_2 §1.1] plan: decyzja JWT vs Session — wybrano JWT
[PLAN_3 §1.0] fix: routing API Gateway dla nested paths
```

---

## 9. Kiedy zaproponować nowy plik PLAN

Zaproponuj (nie twórz bez zgody!) nowy `PLAN_N.md` gdy:

- Obszar ma własny cykl życia oddzielny od istniejących planów
- Istniejący PLAN przekracza ~800 linii treści merytorycznej
- Feature branch o dużej skali wymaga własnego planu
- Nowy moduł/domena która nie pasuje do żadnego istniejącego PLAN

Format propozycji: "Widzę, że moduł X rozrasta się. Proponuję nowy PLAN_5.md dla domeny Y. Zakres: [opis]. Zgoda?"

---

## 10. Szybka ściąga statusów

```
[ ]  zaplanowane     — agent może tworzyć
[o]  aktywny         — tylko człowiek ustawia priorytet
[~]  w trakcie       — agent ustawia, dodaje (Kanban: TASK-XXX)
[v]  zrobione        — agent ustawia, dodaje datę RRRR-MM-DD
[x]  pominięte       — człowiek decyduje, agent może proponować z uzasadnieniem
[?]  decyzja         — agent flaguje, człowiek odpowiada
[!]  zablokowane     — agent flaguje z opisem blokady
[>]  przeniesione    — agent z referencją (→ PLAN_N §X.Y)
```
