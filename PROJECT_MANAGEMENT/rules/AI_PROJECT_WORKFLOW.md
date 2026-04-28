# AI Project Workflow — Zasady i Konwencje

> Wersja: 1.0 | Autor: Human + Claude | Data: 2026-04-26
> Przeznaczenie: Workflow dla projektów solo z Cline Kanban + lokalne modele AI

---

## Spis treści

1. [Filozofia i zasady](#1-filozofia-i-zasady)
2. [Struktura plików projektu](#2-struktura-plików-projektu)
3. [Format pliku PLAN](#3-format-pliku-plan)
4. [System statusów](#4-system-statusów)
5. [Komentarze i notatki](#5-komentarze-i-notatki)
6. [Format pliku TODO.md](#6-format-pliku-todomd)
7. [Modele AI — przypisanie ról](#7-modele-ai--przypisanie-ról)
8. [Workflow krok po kroku](#8-workflow-krok-po-kroku)
9. [Integracja z Cline Kanban](#9-integracja-z-cline-kanban)
10. [Strategia git i gałęzi](#10-strategia-git-i-gałęzi)
11. [Przegląd i rewizja planu](#11-przegląd-i-rewizja-planu)
12. [Szablony promptów](#12-szablony-promptów)
13. [Zasady których nie pominam](#13-zasady-których-nie-pominam)

---

## 1. Filozofia i zasady

### Trzy prawa tego workflow

**1. Historia nigdy nie znika.**
Nic nie jest usuwane. Rzeczy są oznaczane statusem `[x]` (pominięte) lub przenoszone z adnotacją. Każdy plik PLAN jest żywym dokumentem historycznym.

**2. Plan to źródło prawdy, nie kod.**
Kod jest implementacją planu. Jeśli plan i kod się rozmijają — aktualizujesz plan, nie ignorujesz rozmijanie.

**3. Agent wykonuje, człowiek decyduje o kierunku.**
Agent projektuje, proponuje, koduje. Człowiek zatwierdza kierunki, ocenia jakość, wyznacza priorytety. Nie odwrotnie.

### Uczciwe zastrzeżenia do oryginalnego pomysłu

- **Limit 2000 linii na plik** zamieniam na podział **semantyczny** (jeden plik = jeden moduł/domena). Linie to zły miernik — plik może mieć 2000 linii komentarzy. Jeśli plik przekracza ~800 linii treści merytorycznej — to sygnał do podziału.
- **PLAN nie jest tasklist.** To mapa architektury + historia decyzji. Drobne zadania żyją w Kanban, nie w PLAN.
- **TODO.md to tymczasowy bufor**, nie docelowy nośnik wiedzy. Agent zbiera go i integruje do PLAN.

---

## 2. Struktura plików projektu

```
project-root/
│
├── _ai/                          # Katalog systemu AI — NIE commituj wrażliwych danych
│   ├── WORKFLOW.md               # Ten plik (lub link do niego)
│   ├── PROMPTS.md                # Szablony promptów dla agenta
│   ├── models.yaml               # Konfiguracja modeli (patrz sekcja 7)
│   └── rag/                      # Indeks RAG (lokalny, gitignore)
│       ├── index/
│       └── .gitignore
│
├── docs/
│   ├── PLAN_INDEX.md             # Mapa wszystkich plików PLAN (master)
│   ├── PLAN_1.md                 # Architektura i fundament projektu
│   ├── PLAN_2.md                 # Moduł/domena A
│   ├── PLAN_3.md                 # Moduł/domena B
│   ├── PLAN_N.md                 # Każdy plik = jeden obszar semantyczny
│   ├── CHANGELOG.md              # Automatycznie uzupełniany przez agenta
│   └── DECISIONS.md              # Rejestr ważnych decyzji projektowych
│
├── src/
│   ├── module-a/
│   │   └── TODO.md               # Lokalny bufor TODO dla modułu
│   ├── module-b/
│   │   └── TODO.md
│   └── ...
│
├── TODO.md                       # Główny bufor TODO (root-level)
├── README.md
└── .gitignore
```

### Zasady nazewnictwa PLAN

| Plik | Zawartość |
|------|-----------|
| `PLAN_INDEX.md` | Mapa wszystkich planów, cross-referencje, status całości |
| `PLAN_1.md` | Zawsze: wizja projektu, architektura globalna, tech stack, ADR |
| `PLAN_2.md` | Pierwszy moduł/domena (np. backend core) |
| `PLAN_3.md` | Drugi moduł/domena (np. API layer) |
| `PLAN_N.md` | Agent tworzy nowy plik gdy obszar wymaga oddzielnego planu |

**Kiedy dzielić na nowy plik PLAN:**
- Obszar ma własny cykl życia (np. infrastruktura vs. logika biznesowa)
- Plik przekracza ~800 linii treści merytorycznej
- Agent stwierdza że sekcja wymaga osobnego planu sub-projektu
- Nowa gałąź projektu (feature branch o dużej skali)

---

## 3. Format pliku PLAN

Każdy plik PLAN ma identyczną strukturę. Agent musi jej przestrzegać.

```markdown
---
plan_id: PLAN_2
project: NazwaProjektu
module: auth-system
version: 1.3
created: 2026-04-26
updated: 2026-04-28
status: active
parent: PLAN_1
children: []
agent_model: qwen3.6:35b
review_model: gemma4:e4b
tags: [backend, authentication, security]
---

# PLAN_2 — System Autentykacji

<!--HUMAN
Notatka prywatna: rozważam OAuth zamiast własnego JWT.
Sprawdzić najpierw czy biblioteka X ma aktywne wsparcie.
/HUMAN-->

## Kontekst i zakres

Krótki opis czego ten plan dotyczy, jaka jest jego rola w projekcie,
co jest poza jego zakresem.

**Zależności:** PLAN_1 §3.2 (Tech Stack), PLAN_3 §1 (API Gateway)
**Wejście:** Wymagania z PLAN_1
**Wyjście:** Gotowy moduł auth do użycia przez PLAN_3

---

## [o] 1. Architektura modułu

Opis architektury, diagramy (ASCII lub link), kluczowe decyzje.

### [v] 1.1 Wybór podejścia — JWT vs Session

> Decyzja: JWT (stateless) — uzasadnienie w DECISIONS.md §2026-04-26

- [v] Analiza opcji przeprowadzona
- [v] JWT wybrany — lżejszy dla planowanej skali
- [x] Session-based — pominięte, wymaga sticky sessions → zbyt duże koszty infra
  - → Alternatywa zapisana w DECISIONS.md jako opcja na przyszłość

### [o] 1.2 Schemat tokenów

- [o] Access token: 15min TTL
- [o] Refresh token: 7 dni, rotacja przy każdym użyciu
- [ ] Blacklista tokenów (Redis)

<!--HUMAN
Zastanawiam się czy 15min to nie za krótko dla mobile app.
Może 30min? Do decyzji po testach UX.
/HUMAN-->

---

## [o] 2. Implementacja

### [~] 2.1 Middleware auth

- [v] Szkielet middleware — 2026-04-27
- [~] Walidacja JWT — w trakcie (Kanban: TASK-042)
- [ ] Rate limiting per user
- [ ] Integracja z PLAN_3 §2.4

### [ ] 2.2 Endpointy

- [ ] POST /auth/login
- [ ] POST /auth/refresh
- [ ] POST /auth/logout
- [x] DELETE /auth/all-sessions — pominięte w MVP
  - → Agent: Proponuję dodać w PLAN_2 v2.0 lub osobnym PLAN_5

---

## [?] 3. Obszary nierozstrzygnięte

- [?] Czy 2FA w zakresie MVP czy post-MVP? — czeka na decyzję człowieka
- [?] Email verification flow — zależność od PLAN_4 (Email Service)

---

## Historia zmian

| Data | Wersja | Zmiana | Przez |
|------|--------|--------|-------|
| 2026-04-26 | 1.0 | Inicjalne stworzenie planu | Agent (qwen3.6:35b) |
| 2026-04-27 | 1.1 | §1.1 zamknięty, decyzja JWT | Human |
| 2026-04-28 | 1.2 | §2.1 rozpoczęty, Kanban TASK-042 | Agent |
| 2026-04-28 | 1.3 | Korekta TTL tokenów | Human |

---

## Powiązane zasoby

- Kanban tasks: TASK-040, TASK-041, TASK-042
- Branch: `feature/auth-system`
- Commit refs: (uzupełniane przez agenta)
- Zewnętrzne: [RFC 7519 - JWT](https://tools.ietf.org/html/rfc7519)
```

---

## 4. System statusów

### Znaczniki dla zadań i sekcji

| Marker | Znaczenie | Kto ustawia |
|--------|-----------|-------------|
| `[ ]` | Zaplanowane, nierozpoczęte | Agent / Human |
| `[o]` | Do zrobienia (priorytet aktywny) | Human / Agent |
| `[~]` | W trakcie realizacji | Agent (automatycznie) |
| `[v]` | Zrobione — z datą | Agent po review Human |
| `[x]` | Pominięte / anulowane — z uzasadnieniem | Human / Agent |
| `[?]` | Wymaga decyzji / nierozstrzygnięte | Agent flaguje, Human decyduje |
| `[!]` | Zablokowane przez zależność | Agent flaguje |
| `[>]` | Przeniesione do innego PLAN lub sekcji | Agent z referencją |

### Zasady używania statusów

1. **`[x]` nigdy nie gubi historii** — zawsze z `→ Powód:` lub `→ Alternatywa:` na następnej linii
2. **`[v]` z datą** — format: `[v] Nazwa zadania — 2026-04-27`
3. **`[~]` z referencją Kanban** — format: `[~] Nazwa — (Kanban: TASK-042)`
4. **`[?]` z terminem** — jeśli decyzja potrzebna do daty: `[?] Decyzja: 2FA scope — deadline: 2026-05-01`
5. Agent może proponować `[x]` z uzasadnieniem — ostateczna decyzja należy do człowieka

### Status pliku PLAN (w frontmatter)

```yaml
status: draft      # Tworzony przez agenta, nie zatwierdzony
status: active     # Aktywny, w trakcie realizacji
status: paused     # Wstrzymany — powód w pierwszej sekcji
status: complete   # Wszystkie sekcje [v]
status: archived   # Historyczny, nie edytowany
```

---

## 5. Komentarze i notatki

### Komentarz prywatny (AI ignoruje)

```markdown
<!--HUMAN
Tutaj piszę co chcę — myśli, wątpliwości, notatki robocze.
Agent nie bierze tego pod uwagę przy planowaniu ani kodowaniu.
/HUMAN-->
```

**Zasada:** Agent ma w swoim system prompt instrukcję: `Ignoruj zawartość między tagami <!--HUMAN i /HUMAN-->. Nie analizuj, nie cytuj, nie odnosź się do tej treści.`

### Komentarz dla agenta (AI czyta i odpowiada)

```markdown
<!--AI-NOTE
Zastanów się czy ta sekcja wymaga osobnego PLAN_5.
Sprawdź zależności z PLAN_3 §2.
/AI-NOTE-->
```

Agent przy następnym uruchomieniu odpowiada na `AI-NOTE` przez dodanie komentarza lub aktualizację planu, a następnie usuwa tag (lub oznacza jako `AI-RESOLVED`).

### Notatka decyzyjna (widoczna dla wszystkich)

```markdown
> **[Decyzja 2026-04-27]** JWT zamiast Session — Human
> Uzasadnienie: Planowana skala nie wymaga sticky sessions.
> Alternatywa zachowana w DECISIONS.md §1.
```

---

## 6. Format pliku TODO.md

TODO.md to **tymczasowy bufor** obserwacji i pomysłów. Pojawia się lokalnie przy kodzie, agent okresowo zbiera go do PLAN.

```markdown
---
module: auth-system
source_plan: PLAN_2
last_collected: 2026-04-26
---

# TODO — auth-system

<!-- Dodawaj obserwacje podczas pracy z kodem -->
<!-- Agent zbiera te punkty do odpowiedniego PLAN podczas rewizji -->

## Pilne

- [ ] Rate limiting brakuje w middleware — dodać przed deploy
- [ ] Token blacklist nie działa przy jednoczesnych requestach

## Pomysły / ulepszenia

- [ ] Może warto rozważyć PKCE dla mobile flow?
- [ ] Logger auth events do osobnego strumienia

## Wątpliwości

- [?] Czy refresh token powinien być httpOnly cookie czy localStorage?
  - Implikacje: CSRF vs XSS trade-off

<!--HUMAN
Ten problem z rate limitingiem wychodzi podczas moich testów
na szybkim połączeniu — przy normalnym ruchu pewnie OK.
/HUMAN-->

## Zebrane (nie usuwaj — historia)

- [v] Dodać refresh token rotation — zebrane do PLAN_2 §1.2 — 2026-04-27
- [x] Osobny service dla 2FA — pominięte w MVP — 2026-04-26
```

### Zasady TODO.md

1. Każdy moduł ma swój lokalny TODO.md
2. Root-level TODO.md dla rzeczy cross-modułowych
3. Agent zbiera TODO.md podczas **Periodic Review** (sekcja 11)
4. Po zebraniu — pozycja zostaje z `[v]` i referencją do PLAN (historia!)
5. Człowiek może dodawać do TODO.md w dowolnym momencie

---

## 7. Modele AI — przypisanie ról

### Twoje modele i ich role

```yaml
# _ai/models.yaml

models:
  planning_primary:
    name: qwen3.6:35b
    role: Główny agent planowania i kodowania
    use_for:
      - Tworzenie i aktualizacja plików PLAN
      - Implementacja zadań z Kanban
      - Analiza architektury
      - Zbieranie TODO.md i integracja do PLAN
    context_window: duży — może obsłużyć kilka plików PLAN naraz
    temperature: 0.3  # Niskie — chcemy konsekwencji, nie kreatywności

  review:
    name: gemma4:e4b
    role: Code review i weryfikacja niezależna
    use_for:
      - Code review przed merge
      - Weryfikacja czy implementacja zgadza się z PLAN
      - "Devil's advocate" — kwestionowanie decyzji
      - Propozycje alternatywnych podejść
    temperature: 0.5

  embeddings:
    name: nomic-embed-text-v2-moe
    role: Lokalny silnik embeddingów (RAG)
    use_for:
      - Indeksowanie wszystkich plików PLAN
      - Semantyczne wyszukiwanie kontekstu przed każdym zadaniem
      - "Pamięć projektu" bez przeklejania całych plików
    note: >
      Uruchamiaj pipeline RAG (embed → search → rerank) przed każdym
      dużym zadaniem planistycznym. Agent otrzymuje tylko relevantny
      kontekst zamiast wszystkich plików.

  reranker:
    name: MedAIBase/Qwen3-VL-Reranker:2b
    role: Reranker wyników RAG + analiza wizualna
    use_for:
      - Poprawianie trafności wyników wyszukiwania po embeddingach
      - Analiza screenshotów UI / diagramów / szkiców
      - Reranking zadań według priorytetu semantycznego
    note: >
      Model VL (Vision-Language) — może czytać obrazy. Użyj gdy
      masz screenshot designu lub diagram do analizy przez agenta.
```

### Jak używać RAG w praktyce (lokalnie)

```bash
# Skrypt _ai/rag/index.sh — uruchom po każdej większej zmianie PLAN

# 1. Indeksowanie (nomic-embed-text-v2-moe przez Ollama)
ollama embed nomic-embed-text-v2-moe docs/PLAN_*.md

# 2. Przed zadaniem agenta: wyszukaj kontekst
# Zapytanie: "auth token refresh mechanism"
# → nomic zwraca chunki
# → Qwen3-VL-Reranker sortuje według trafności
# → Top 3-5 chunków trafia do prompta agenta

# Alternatywa gotowa: Cline ma wbudowane MCP dla RAG
# Skonfiguruj @cline/mcp-memory lub własny serwer RAG
```

**Praktyczna zasada:** Zamiast dawać agentowi wszystkie PLAN_*.md naraz (przepełnienie kontekstu), używaj RAG żeby wyciągać tylko relevantne sekcje. To szczególnie ważne przy projektach z 5+ plikami PLAN.

### Model którego brakuje — propozycja

Rozważ dodanie modelu do **szybkich odpowiedzi i klasyfikacji zadań:**

- `qwen3.6:8b` lub `gemma3:4b` — lekki model do: klasyfikowania TODO, szybkiej odpowiedzi na proste pytania, pre-processingu przed głównym modelem
- Dlaczego: `qwen3.6:35b` to armatnia kula — nie warto go angażować do sprawdzenia "do którego PLAN należy ten TODO item"

---

## 8. Workflow krok po kroku

### Faza 0 — Bootstrap nowego projektu

```
1. Napisz do agenta ogólny opis projektu (patrz Prompt #1)
2. Agent tworzy: PLAN_INDEX.md + PLAN_1.md (architektura globalna)
3. Ty przeglądasz PLAN_1.md i zatwierdzasz lub korygujesz
4. Agent rozbija na moduły → tworzy PLAN_2.md, PLAN_3.md itd.
5. Ty zatwierdzasz podział modułów
6. Agent wypełnia każdy PLAN szczegółami (osobne zadania Kanban)
7. Uruchamiasz indeks RAG
```

### Faza 1 — Dzienna praca

```
1. Przejrzyj Cline Kanban — które taski [o] są do realizacji
2. Przed uruchomieniem agenta: RAG query dla kontekstu zadania
3. Agent wykonuje task, aktualizuje status w PLAN ([~] → [v])
4. Ty robisz code review (model: gemma4:e4b jako drugi głos)
5. Merge lub iteracja
6. Jeśli podczas pracy wychodzą obserwacje → dodaj do TODO.md
```

### Faza 2 — Praca z gałęziami

```
feature/nazwa-funkcji
    ↓
Nowy PLAN_N.md lub sekcja w istniejącym PLAN
    ↓
Agent koduje
    ↓
Ty testujesz lokalnie w VSCode
    ↓
Code review (gemma4:e4b)
    ↓
Merge do main
    ↓
PLAN aktualizowany ([~] → [v] + commit ref)
```

### Faza 3 — Periodic Review (co tydzień lub po milestone)

```
1. Agent zbiera wszystkie TODO.md (Prompt #4)
2. Agent rewiduje PLAN_INDEX.md
3. Agent proponuje: kierunki rozwoju, debt techniczny, ryzyka
4. Ty decydujesz co wchodzi do planu
5. Nowe sekcje tworzą nowe taski w Kanban
```

---

## 9. Integracja z Cline Kanban

### Mapowanie PLAN → Kanban

Każda sekcja `[o]` lub `[ ]` w PLAN to potencjalny task Kanban. Agent tworzy taski wg schematu:

```
Task title: [PLAN_2 §2.1] Middleware auth — walidacja JWT
Description: Implementacja walidacji JWT w middleware. Szczegóły: PLAN_2 §2.1
Labels: auth, backend, PLAN_2
Priority: based on [o] vs [ ] vs [?]
Linked tasks: zależności z §2.2 (blokowane przez ten task)
```

### Konwencja tytułów tasków

```
[PLAN_N §X.Y] Krótki opis — max 60 znaków
```

Przykłady:
- `[PLAN_2 §2.1] JWT middleware walidacja`
- `[PLAN_3 §1.0] API Gateway routing setup`
- `[PLAN_1 §ADR] Decyzja: wybór bazy danych`

### Statusy Kanban ↔ PLAN statusy

| Kanban | PLAN |
|--------|------|
| Backlog | `[ ]` |
| Todo | `[o]` |
| In Progress | `[~]` |
| Review | `[~]` + flaga |
| Done | `[v] — data` |
| Cancelled | `[x] — powód` |

Agent synchronizuje statusy podczas każdego uruchomienia.

---

## 10. Strategia git i gałęzi

### Konwencja gałęzi

```
main                    — Stabilny, zawsze deployowalny
develop                 — Integracja przed releasem (opcjonalnie przy solo)

feature/PLAN_N-krótki-opis    — Nowa funkcja z konkretnego PLAN
fix/PLAN_N-co-naprawiamy      — Naprawa buga
refactor/nazwa                — Refaktoryzacja
review/PLAN_N-milestone       — Gałąź do code review milestone'u
```

Przykłady:
```
feature/PLAN_2-auth-jwt
feature/PLAN_3-api-gateway
fix/PLAN_2-token-refresh-race-condition
```

### Commit messages — konwencja

```
[PLAN_N §X.Y] typ: krótki opis

feat: nowa funkcja
fix: naprawa buga
plan: aktualizacja PLAN / TODO / dokumentacji
refactor: zmiana bez nowej funkcji
review: po code review
```

Przykłady:
```
[PLAN_2 §2.1] feat: JWT middleware walidacja tokenów
[PLAN_2 §1.1] plan: zaktualizowano decyzję JWT vs Session
[PLAN_3 §1.0] fix: routing API Gateway dla nested routes
```

---

## 11. Przegląd i rewizja planu

### Kiedy uruchamiać rewizję

- Co tydzień (solo: piątek przed weekendem)
- Po zamknięciu milestone'u
- Po wejściu nowych wymagań
- Gdy agent podczas pracy flaguje `[?]` lub `[!]`

### Co robi agent podczas rewizji (Prompt #4)

1. Skanuje wszystkie TODO.md → integruje do PLAN
2. Sprawdza `[~]` czy nie są zbyt długo w tym statusie
3. Sprawdza `[!]` (zablokowane) → czy blokada dalej aktualna
4. Proponuje kierunki rozwoju na podstawie postępu
5. Identyfikuje technical debt
6. Aktualizuje PLAN_INDEX.md
7. Aktualizuje CHANGELOG.md

### Co NIE zmienia się automatycznie podczas rewizji

- Status `[x]` (tylko człowiek może odwrócić decyzję o pominięciu)
- Architektura w PLAN_1 (wymaga świadomej decyzji człowieka)
- Priorytety (człowiek decyduje co jest `[o]` a co `[ ]`)

---

## 12. Szablony promptów

### Prompt #1 — Inicjalny bootstrap projektu

```
Jesteś architektem oprogramowania. Stwórz plan projektu zgodnie z konwencją AI_PROJECT_WORKFLOW.md.

PROJEKT:
[Opis projektu — 3-10 zdań. Co robi, dla kogo, główne wymagania]

TECH STACK (wstępny lub do zaproponowania):
[Lista lub "zaproponuj"]

TWOJE ZADANIA:
1. Stwórz PLAN_INDEX.md — mapa całości, podział na moduły
2. Stwórz PLAN_1.md — architektura globalna, tech stack, kluczowe decyzje (ADR)
3. Zaproponuj listę pozostałych plików PLAN z ich zakresem (nie twórz ich jeszcze)
4. W każdym pliku użyj formatu z _ai/WORKFLOW.md (statusy, frontmatter, historia)
5. Oznacz nierozstrzygnięte kwestie jako [?]
6. IGNORUJ zawartość między tagami <!--HUMAN i /HUMAN-->

OGRANICZENIA:
- Jeden PLAN = jeden moduł/domena semantyczna
- Podziel na nowy plik gdy obszar przekracza ~800 linii merytorycznych
- Historia nie znika — używaj [x] z uzasadnieniem zamiast usuwania
- Nie twórz Kanban tasków — to zrobię sam po zatwierdzeniu planów

ODPOWIEDŹ: Najpierw PLAN_INDEX.md, potem PLAN_1.md. Czekaj na moje zatwierdzenie przed tworzeniem kolejnych planów.
```

---

### Prompt #2 — Rozwinięcie modułu (PLAN_N)

```
Na podstawie PLAN_INDEX.md i PLAN_1.md stwórz szczegółowy PLAN_[N].md dla modułu: [nazwa modułu].

KONTEKST (z RAG lub ręcznie):
[Wklej relevantne sekcje z PLAN_1 lub PLAN_INDEX]

ZAKRES MODUŁU:
[Co wchodzi w zakres, co jest na zewnątrz]

WYMAGANIA:
- Użyj formatu z WORKFLOW.md
- Sekcje 1-3: architektura i kluczowe decyzje
- Sekcje 4+: implementacja (zadania [o] / [ ])
- Oznacz zależności między sekcjami i innymi PLANami
- Flaguj nierozstrzygnięte kwestie jako [?]
- Zaproponuj Kanban tasks na końcu (lista, nie twórz ich)
- IGNORUJ zawartość między tagami <!--HUMAN i /HUMAN-->
```

---

### Prompt #3 — Wykonanie zadania z Kanban

```
Wykonaj task: [PLAN_N §X.Y] [tytuł taska]

KONTEKST PLANU:
[Relevantny fragment PLAN_N — lub użyj RAG]

ZADANIE:
[Szczegółowy opis z Kanban]

ZASADY:
- Implementuj zgodnie z architekturą w PLAN_N §1
- Aktualizuj status w PLAN_N: [o] lub [~] → [v] z datą i commit ref
- Jeśli napotkasz nieoczekiwany problem → oznacz [!] z opisem
- Jeśli odkryjesz coś wartego uwagi → dodaj do TODO.md danego modułu
- Nie zmieniaj architektury bez zaznaczenia [?] i powiadomienia
- Po zakończeniu: zaproponuj co sprawdzić podczas code review

IGNORUJ zawartość między tagami <!--HUMAN i /HUMAN-->
```

---

### Prompt #4 — Periodic Review (rewizja planu)

```
Przeprowadź przegląd projektu [NazwaProjektu].

PLIKI DO PRZEJRZENIA:
- docs/PLAN_INDEX.md
- docs/PLAN_*.md (wszystkie)
- Wszystkie TODO.md w projekcie
- CHANGELOG.md

TWOJE ZADANIA:
1. ZBIERZ: Wszystkie pozycje z TODO.md → zaproponuj integrację do odpowiednich PLANów
   - Pozycje [v] zostawiaj z adnotacją "zebrano do PLAN_N §X.Y — data"
   - Nie usuwaj niczego

2. ZIDENTYFIKUJ:
   - Sekcje [~] starsze niż 7 dni — czy są zablokowane?
   - Sekcje [!] — czy blokada dalej aktualna?
   - Niespójności między PLANami

3. ZAPROPONUJ (oddzielnie, nie zmieniaj planów bez zgody):
   a) Kierunki rozwoju na kolejny sprint
   b) Technical debt wymagający uwagi
   c) Ryzyka projektowe które widzisz
   d) Czy potrzebny jest nowy plik PLAN_N?

4. AKTUALIZUJ:
   - PLAN_INDEX.md (statusy modułów)
   - CHANGELOG.md (dodaj wpis z datą)

5. PYTANIA DO CZŁOWIEKA:
   - Lista [?] które czekają na decyzję
   - Rekomendacja priorytetu dla każdego

IGNORUJ zawartość między tagami <!--HUMAN i /HUMAN-->
FORMAT: Najpierw raport (co znalazłeś), potem propozycje, na końcu pytania.
```

---

### Prompt #5 — Code Review (gemma4:e4b)

```
Jesteś niezależnym reviewerem kodu. Przeprowadź code review.

PLAN REFERENCYJNY:
[Wklej sekcję PLAN_N §X.Y której dotyczy implementacja]

KOD DO REVIEW:
[Kod lub diff]

SPRAWDŹ:
1. Czy implementacja jest zgodna z PLAN? Gdzie odbiega?
2. Błędy, edge cases, bezpieczeństwo
3. Jakość kodu (czytelność, nazewnictwo, struktura)
4. Czy są przypadki testowe dla kluczowej logiki?
5. Technical debt który warto teraz zaadresować

ODPOWIEDŹ:
- Ocena ogólna: APPROVE / REQUEST CHANGES / NEEDS DISCUSSION
- Lista konkretnych uwag (każda z priorytetem: BLOCKER / MAJOR / MINOR / SUGGESTION)
- Propozycje co dodać do TODO.md jeśli nie naprawiamy teraz
- Czy wymagana jest aktualizacja PLAN?
```

---

### Prompt #6 — Przebudowa istniejącego projektu

```
Przeprowadź analizę istniejącego projektu i dostosuj do workflow AI_PROJECT_WORKFLOW.md.

PROJEKT:
[Opis co projekt robi, jaki jest obecny stan]

STRUKTURA PLIKÓW:
[Lista katalogów/plików lub tree output]

TWOJE ZADANIA:
1. Zaproponuj podział na moduły (przyszłe PLAN_N)
2. Zidentyfikuj co jest już zrobione → będzie [v]
3. Zidentyfikuj tech debt i niedokończone elementy → będzie [o] lub [!]
4. Zaproponuj priorytet pracy: co najpierw opisać / zrefaktoryzować
5. Stwórz PLAN_1.md dla tego projektu (architektura obecna + docelowa)

WAŻNE: Obecny stan projektu jest punkt startowy, nie cel.
Zachowaj historię decyzji jeśli ją znasz.
```

---

## 13. Zasady których nie pominam

### Zasady dodatkowe (punkt 13 z Twoich wymagań)

**Zasada spójności modeli.**
Jeden task = jeden model główny. Nie przełączaj modelu w połowie zadania. Jeśli zacząłeś z qwen3.6:35b — skończ z nim. gemma4:e4b wchodzi jako drugi głos (review), nie jako zamiennik.

**Zasada minimalnego kontekstu.**
Nie dawaj agentowi więcej kontekstu niż potrzebuje. RAG + odpowiednia sekcja PLAN > wszystkie pliki PLAN naraz. Duży kontekst = większy koszt obliczeniowy + większa szansa halucynacji.

**Zasada jawności `[x]`.**
Każde `[x]` musi mieć uzasadnienie. "Bo tak" nie jest uzasadnieniem. Uzasadnienie chroni Cię przed powracaniem do tych samych decyzji za 3 miesiące.

**Zasada atomowości tasków.**
Task Kanban powinien być realizowalny w 1-4 godziny. Jeśli sekcja PLAN jest zbyt duża → podziel ją na subsections, każda = osobny task.

**Zasada przeglądu przed nowym projektem.**
Zanim zaczniesz nowy PLAN → przejrzyj PLAN_INDEX.md. Może funkcja już jest planowana w innym module?

**Zasada wersjonowania PLANów.**
Frontmatter `version` to nie kosmetyka. Bump wersji przy każdej znaczącej zmianie kierunku. Pozwala śledzić ewolucję decyzji.

**Zasada "agent proponuje, human zatwierdza architekturę".**
Agent może tworzyć nowe sekcje PLAN, ale nie może zmieniać `PLAN_1.md §1` (architektura globalna) bez Twojej explicit zgody. To jest konstytucja projektu.

**Zasada czytelnych referencji.**
Zawsze pisz `PLAN_2 §3.1` a nie "jak wspomniano wcześniej". Za 6 miesięcy nie będziesz pamiętał co było "wcześniej".

**Zasada DECISIONS.md.**
Każda nieoczywista decyzja trafia do `docs/DECISIONS.md` z datą, kontekstem, alternatywami i uzasadnieniem. Szczególnie `[x]` dla ważnych opcji.

**Zasada nie-doskonałości.**
Plan nie musi być idealny żeby zacząć. PLAN_1 v1.0 będzie niedoskonały — to OK. Lepsza iteracja niż paraliż planowania.

---

## Szybka ściąga — statusy i tagi

```markdown
Statusy zadań:  [ ] [ o ] [~] [v] [x] [?] [!] [>]
                plan  aktyw  trak done skip  dec  blok  przenieś

Komentarz prywatny (AI ignoruje):
<!--HUMAN  ...  /HUMAN-->

Komentarz dla AI:
<!--AI-NOTE  ...  /AI-NOTE-->

Decyzja:
> **[Decyzja RRRR-MM-DD]** Treść — Human/Agent

Frontmatter status:  draft / active / paused / complete / archived

Branch naming:  feature/PLAN_N-opis
Commit format:  [PLAN_N §X.Y] typ: opis
Task title:     [PLAN_N §X.Y] Krótki opis
```

---

*Dokument jest żywy — aktualizuj go gdy workflow ewoluuje.*
*Wersja tego pliku też powinna mieć historię zmian na dole.*

| Data | Zmiana |
|------|--------|
| 2026-04-26 | Wersja inicjalna |
