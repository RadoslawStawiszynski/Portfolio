---
name: Przegląd Wydajności
description: Wykrywa problemy N+1, ciężkie pętle, zbędne re-rendery
---

Przejrzyj pull request pod kątem problemów wydajnościowych.

Oznacz jako NIEZALICZONE jeśli:
- Nowe zapytania do bazy danych wewnątrz pętli (problem N+1)
- Nieefektywne algorytmy (O(n²) gdzie O(n) jest możliwe)
- Zbędne re-rendery w React/Vue/Svelte (brakuje memo, keys, itp.)
- Ciężkie operacje w gorących ścieżkach (np. w request handlerach, w pętlach renderowania)
- Ładowanie całych zbiorów danych zamiast paginacji lub filtrowania

Podaj konkretne sugestie optymalizacji.
