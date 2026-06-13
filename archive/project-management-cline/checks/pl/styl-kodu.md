---
name: Styl Kodu i Dobre Praktyki
description: Sprawdza czysty kod, SOLID, DRY, sensowne nazwy zmiennych i funkcji
---

Przejrzyj pull request pod kątem stylu kodu i dobrych praktyk.

Oznacz jako NIEZALICZONE jeśli:
- Bardzo długie funkcje (> 80 linii) lub klasy z za dużą liczbą odpowiedzialności
- Magic numbers/strings bez stałych (np. `if status == 3` zamiast `if status == STATUS_ACTIVE`)
- Słabe nazewnictwo zmiennych/funkcji (pojedyncze litery, niejasne nazwy jak `data`, `temp`, `x`)
- Nieużywane zmienne, importy lub martwy kod
- Złożone zagnieżdżone warunki bez early returns lub ekstrakcji do funkcji
- Naruszenie zasady DRY (powtórzona logika w kilku miejscach)

Zaproponuj konkretny refaktor gdy check nie przechodzi.
