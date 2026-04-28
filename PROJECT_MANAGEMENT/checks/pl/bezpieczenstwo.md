---
name: Przegląd Bezpieczeństwa
description: Wykrywa hardcoded secrets, brak walidacji, SQL injection, logowanie wrażliwych danych
---

Przejrzyj ten pull request pod kątem bezpieczeństwa.

Oznacz jako NIEZALICZONE jeśli którykolwiek z poniższych punktów jest prawdziwy:
- Zakodowane na stałe klucze API, tokeny, hasła lub sekrety w plikach źródłowych lub konfiguracji
- Nowe endpointy API lub trasy bez odpowiedniej walidacji / sanityzacji danych wejściowych
- Zapytania SQL budowane przez konkatenację ciągów (zamiast prepared statements lub ORM)
- Wrażliwe dane (PII, dane uwierzytelniające, tokeny) logowane na stdout, konsolę lub do logów
- Użycie niezabezpieczonych funkcji losowych (Math.random w JS/TS) lub słabej kryptografii
- Nowe zależności z known high/critical vulnerabilities

Jeśli żaden z powyższych problemów nie wystąpił — zalicz check z krótkim pozytywnym podsumowaniem.
