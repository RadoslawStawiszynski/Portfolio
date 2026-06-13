---
name: Bezpieczeństwo TypeScript
description: Zapewnia silne typowanie, brak any, właściwe użycie generics
---

Przejrzyj pull request pod kątem bezpieczeństwa typów TypeScript.

Oznacz jako NIEZALICZONE jeśli:
- Użycie typu `any`
- Brakujące lub nieprawidłowe typy zwracane / typy parametrów
- Niebezpieczne asercje typów (`as any`, `!` non-null assertion)
- Nowy kod bez właściwych interfejsów lub typów dla złożonych obiektów
- Nieużywane definicje typów

Zaproponuj lepsze typy tam gdzie to możliwe.
