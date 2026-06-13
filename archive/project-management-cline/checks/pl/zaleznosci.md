---
name: Zależności i Podatności
description: Sprawdza zmiany w package.json i bezpieczeństwo zależności
---

Przejrzyj zmiany w plikach package.json / lock files.

Oznacz jako NIEZALICZONE jeśli:
- Nowa zależność z known high/critical vulnerability
- Major version bump bez uzasadnienia w opisie PR
- Dodawanie ciężkich zależności do frontend bundle (sprawdź rozmiar)
- Użycie porzuconych (deprecated) pakietów

Podaj listę podatnych pakietów i zaproponuj alternatywy lub poprawki.
