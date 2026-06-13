---
name: Dokumentacja i Komentarze
description: Sprawdza czy publiczne API i ważna logika są udokumentowane
---

Przejrzyj pull request pod kątem jakości dokumentacji.

Oznacz jako NIEZALICZONE jeśli:
- Nowe publiczne funkcje / endpointy API bez JSDoc / komentarzy
- Zmieniona logika bez zaktualizowanych komentarzy
- Złożony algorytm bez wyjaśnienia DLACZEGO (nie CO — kod mówi co)
- Nowe zmienne środowiskowe bez opisu w README lub .env.example

Zaproponuj dobry styl komentarza gdy check nie przechodzi.
