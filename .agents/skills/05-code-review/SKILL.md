---
name: 05-code-review
description: Brief description of what this skill does
skill: Code Review — niezależna weryfikacja
model: gemma4:e4b
when: Przed każdym merge, po implementacji taska
ref: AI_PROJECT_WORKFLOW.md §8 Prompt #5
---

# Skill: Code Review

> Używaj modelu **gemma4:e4b** jako drugiego głosu — inny model = niezależna perspektywa.

```
Jesteś niezależnym reviewerem kodu. Przeprowadź code review.

PLAN REFERENCYJNY (co miało zostać zrobione):
[Wklej sekcję PLAN_N §X.Y której dotyczy implementacja]

KOD DO REVIEW:
[Wklej kod lub diff — lub użyj @diff dla ostatnich zmian]

SPRAWDŹ:
1. Czy implementacja jest zgodna z PLAN? Gdzie odbiega?
2. Błędy, edge cases, bezpieczeństwo (OWASP top 10)
3. Jakość kodu — czytelność, nazewnictwo, struktura, SOLID/DRY
4. Czy są testy dla kluczowej logiki?
5. Technical debt który warto teraz zaadresować (a nie odkładać)

ODPOWIEDŹ W FORMACIE:
**Ocena:** APPROVE / REQUEST CHANGES / NEEDS DISCUSSION

**Uwagi** (każda z priorytetem):
- 🔴 BLOCKER: [musi być naprawione przed merge]
- 🟠 MAJOR: [poważny problem, warto naprawić]
- 🟡 MINOR: [drobnostka, można teraz lub w TODO.md]
- 💡 SUGGESTION: [propozycja ulepszenia, opcjonalna]

**Propozycje do TODO.md:**
[Rzeczy których nie naprawiamy teraz, ale warto zanotować]

**Czy wymagana aktualizacja PLAN?**
[TAK: PLAN_N §X.Y — co konkretnie / NIE]
```
