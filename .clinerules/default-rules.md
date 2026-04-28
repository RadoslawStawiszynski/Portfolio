# Reguły projektu dla Cline — AI Project Workflow
# Pełna dokumentacja: rules/AI_PROJECT_WORKFLOW.md

## Język i komunikacja

- Odpowiadaj zawsze po polsku, chyba że zapytanie jest w innym języku
- Zadawaj pytania zanim zaczniesz — nie zakładaj zakresu
- Jeśli coś jest nierozstrzygnięte → oznacz [?] i zapytaj człowieka

## Trzy prawa tego projektu

1. Historia nigdy nie znika — używaj [x] z uzasadnieniem, nie usuwaj
2. Plan to źródło prawdy, nie kod — aktualizuj PLAN gdy implementacja odbiega
3. Agent wykonuje, człowiek decyduje o kierunku — proponuj, nie narzucaj architektury

## Praca z plikami PLAN

Pliki PLAN znajdziesz w `docs/` lub `workflow/PLAN/`. Format: `PLAN_N.md`.

### Statusy zadań (ZAWSZE używaj dokładnie tych markerów)

```
[ ]  — zaplanowane, nierozpoczęte
[o]  — aktywny priorytet
[~]  — w trakcie (dodaj: Kanban: TASK-XXX)
[v]  — zrobione (dodaj datę: — RRRR-MM-DD)
[x]  — pominięte/anulowane (ZAWSZE dodaj → Powód:)
[?]  — wymaga decyzji człowieka
[!]  — zablokowane przez zależność
[>]  — przeniesione (dodaj referencję docelową)
```

### Zasady aktualizacji PLAN

- Po wykonaniu zadania: zaktualizuj status [~] → [v] z datą
- Jeśli napotkasz problem: oznacz [!] z opisem blokady
- Odkrycia i obserwacje: dodaj do `TODO.md` modułu (nie do PLAN)
- Nigdy nie zmieniaj `PLAN_1.md §1` (architektura globalna) bez explicit zgody człowieka
- Zawsze pisz `PLAN_2 §3.1` zamiast "jak wcześniej wspomniano"

### Komentarze w PLAN

```
<!--HUMAN ... /HUMAN-->   ← IGNORUJ całkowicie, nie czytaj, nie cytuj
<!--AI-NOTE ... /AI-NOTE--> ← Odpowiedz i oznacz jako AI-RESOLVED
```

## Kanban i taski

Tytuł taska: `[PLAN_N §X.Y] Krótki opis — max 60 znaków`
Commit: `[PLAN_N §X.Y] typ: opis` (typ: feat / fix / plan / refactor / review)
Branch: `feature/PLAN_N-opis` lub `fix/PLAN_N-co-naprawiamy`

## Modele AI w projekcie

- `qwen3.6:35b` — główny agent planowania i kodowania
- `gemma4:e4b` — code review, niezależna weryfikacja
- `nomic-embed-text-v2-moe` — embeddingi RAG
- Zasada: jeden task = jeden model główny, nie przełączaj w połowie

## Czego nie rób

- Nie usuwaj historii z PLAN (zawsze [x] + powód)
- Nie zmieniaj architektury bez zaznaczenia [?] i pytania
- Nie dawaj całych plików PLAN do kontekstu gdy niepotrzebne — używaj RAG
- Nie twórz Kanban tasków bez prośby człowieka
- Nie oznaczaj [v] bez potwierdzenia że zadanie faktycznie działa

## Szablon odpowiedzi po wykonaniu zadania

```
✅ Wykonano: [co zrobiono]
📝 PLAN zaktualizowany: PLAN_N §X.Y → [v] 2026-XX-XX
⚠️  Do decyzji: [jeśli są [?]]
📋 Dodano do TODO.md: [jeśli odkryto coś wartego uwagi]
🔍 Proponuję sprawdzić podczas review: [lista]
```
