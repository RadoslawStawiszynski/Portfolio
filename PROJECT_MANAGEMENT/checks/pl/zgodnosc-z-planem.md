---
name: Zgodność z Planem Projektu
description: Weryfikuje czy zmiany w kodzie są zgodne ze specyfikacją PLAN (AI_PROJECT_WORKFLOW)
---

Przejrzyj ten pull request pod kątem zgodności z dokumentami PLAN projektu.

Znajdź odpowiedni plik PLAN_N.md na podstawie nazwy gałęzi lub wiadomości commitów (format: [PLAN_N §X.Y]).

Oznacz jako NIEZALICZONE jeśli którykolwiek z poniższych punktów jest prawdziwy:
- Implementacja odbiega od architektury opisanej w PLAN_1.md §1 bez udokumentowanej decyzji
- Zadanie jest oznaczone jako ukończone [v] ale implementacja brakuje kluczowych wymagań z sekcji PLAN
- Nowy kod wprowadza zależność lub wzorzec nieodzwierciedlony w żadnym pliku PLAN
- Wiadomość commitu nie jest zgodna z formatem: [PLAN_N §X.Y] typ: opis
- Status sekcji PLAN nie został zaktualizowany po zaimplementowaniu funkcji (nadal [~] lub [o])
- Podjęto decyzje architektoniczne które powinny być odnotowane w DECISIONS.md, ale nie są

Jeśli PR nie odwołuje się do żadnego PLAN — zaznacz to, ale nie fail — nie wszystkie commity są pracą nad funkcjami.

Podaj konkretne referencje do pliku PLAN w swoich uwagach (np. "PLAN_2 §3.1 określa X, ale implementacja robi Y").
