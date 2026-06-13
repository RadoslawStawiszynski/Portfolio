---
skill: Bootstrap nowego projektu
model: qwen3.6:35b
when: Nowy projekt — tworzenie PLAN_INDEX + PLAN_1
ref: AI_PROJECT_WORKFLOW.md §8 Faza 0
---

# Skill: Bootstrap nowego projektu

Skopiuj poniższy prompt do Cline. Wypełnij sekcje `[...]`.

---

```
Jesteś architektem oprogramowania. Stwórz plan projektu zgodnie z konwencją AI_PROJECT_WORKFLOW.md.

PROJEKT:
[Opis projektu — 3-10 zdań. Co robi, dla kogo, główne wymagania, skala]

TECH STACK (wstępny lub do zaproponowania):
[Lista technologii lub napisz "zaproponuj na podstawie wymagań"]

TWOJE ZADANIA:
1. Stwórz docs/PLAN_INDEX.md — mapa całości, podział na moduły
2. Stwórz docs/PLAN_1.md — architektura globalna, tech stack, kluczowe decyzje (ADR)
3. Zaproponuj listę pozostałych plików PLAN_N z ich zakresem (nie twórz ich jeszcze)
4. W każdym pliku użyj formatu z rules/AI_PROJECT_WORKFLOW.md (statusy, frontmatter, historia)
5. Oznacz wszystkie nierozstrzygnięte kwestie jako [?]
6. IGNORUJ zawartość między tagami <!--HUMAN i /HUMAN-->

OGRANICZENIA:
- Jeden PLAN = jeden moduł/domena semantyczna
- Podziel na nowy plik gdy obszar przekracza ~800 linii merytorycznych
- Historia nie znika — używaj [x] z uzasadnieniem zamiast usuwania
- Nie twórz Kanban tasków — zrobię to sam po zatwierdzeniu planów
- Architektura w PLAN_1 §1 = "konstytucja" — szczególna uwaga na solidność

ODPOWIEDŹ: Najpierw PLAN_INDEX.md (propozycja struktury), potem PLAN_1.md.
Czekaj na moje zatwierdzenie przed tworzeniem kolejnych planów.
```

---

## Po otrzymaniu odpowiedzi

1. Przejrzyj PLAN_INDEX.md — czy podział na moduły ma sens?
2. Przejrzyj PLAN_1.md §1 (architektura) — czy jesteś zadowolony?
3. Zatwierdź lub popraw — PRZED przejściem do PLAN_2, PLAN_3...
4. Uruchom: `bash hooks/indeksuj_rag.sh` (po instalacji Ollama)
5. Stwórz pierwsze taski Kanban na podstawie `[o]` w PLAN_1
