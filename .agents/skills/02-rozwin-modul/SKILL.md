---
name: 02-rozwin-modul
description: Brief description of what this skill does
skill: Rozwinięcie modułu — stworzenie PLAN_N
model: qwen3.6:35b
when: Nowy moduł/domena wymaga własnego pliku PLAN
ref: AI_PROJECT_WORKFLOW.md §8 Prompt #2
---

# Skill: Rozwinięcie modułu

```
Na podstawie docs/PLAN_INDEX.md i docs/PLAN_1.md stwórz szczegółowy PLAN_[N].md dla modułu: [nazwa modułu].

KONTEKST:
[Wklej relevantne sekcje z PLAN_1 lub PLAN_INDEX — lub napisz "@codebase kontekst dla modułu X"]

ZAKRES MODUŁU:
- Co wchodzi w zakres: [lista]
- Co jest poza zakresem: [lista]
- Zależności od innych modułów: [PLAN_X §Y.Z]

WYMAGANIA CO DO FORMATU:
- Użyj szablonu z workflow/PLAN/PLAN_TEMPLATE.md
- Sekcje 1-3: architektura i kluczowe decyzje projektowe
- Sekcje 4+: implementacja (zadania [o] / [ ])
- Zaznacz zależności między sekcjami i innymi PLANami explicite
- Flaguj wszystkie nierozstrzygnięte kwestie jako [?] z deadlinem jeśli wiadomy
- Na końcu: zaproponuj listę Kanban tasków (nie twórz ich)
- IGNORUJ zawartość między tagami <!--HUMAN i /HUMAN-->

WAŻNE:
- Nie zmieniaj PLAN_1.md §1 (architektura globalna)
- Aktualizuj PLAN_INDEX.md po stworzeniu nowego PLAN_N
```
