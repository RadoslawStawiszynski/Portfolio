---
skill: Wykonanie zadania z Kanban
model: qwen3.6:35b
when: Realizacja konkretnego taska — codzienne użycie
ref: AI_PROJECT_WORKFLOW.md §8 Prompt #3
---

# Skill: Wykonanie zadania z Kanban

```
Wykonaj task: [PLAN_N §X.Y] [tytuł taska]

KONTEKST PLANU:
[Wklej relevantną sekcję PLAN_N §X.Y — lub użyj: @codebase PLAN_N §X.Y]

ZADANIE:
[Szczegółowy opis z Kanban — co konkretnie ma być zrobione]

ZASADY PODCZAS PRACY:
- Implementuj zgodnie z architekturą w PLAN_N §1 (nie odbiegaj bez [?])
- Aktualizuj status w PLAN_N po zakończeniu: [o]/[~] → [v] z datą i commit ref
- Napotkałeś nieoczekiwany problem → oznacz [!] z opisem i powiadom
- Odkryłeś coś wartego uwagi → dodaj do src/[moduł]/TODO.md, nie do PLAN
- Nie zmieniaj zakresu bez zaznaczenia [?] i pytania do mnie
- IGNORUJ zawartość między tagami <!--HUMAN i /HUMAN-->

PO ZAKOŃCZENIU UŻYJ FORMATU:
✅ Wykonano: [jednozdaniowy opis]
📄 PLAN zaktualizowany: PLAN_N §X.Y → [v] RRRR-MM-DD
⚠️  Do decyzji: [lista [?] jeśli są]
📋 Dodano do TODO.md: [lista obserwacji jeśli są]
🔍 Sugestie do code review: [lista]
```
