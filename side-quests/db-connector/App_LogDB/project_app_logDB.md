# Projekt aplikacji GUI do łączenia się z bazami danych

## Opis aplikacji:

Aplikacja desktopowa z interfejsem graficznym (GUI) umożliwiająca połączenie z różnymi bazami danych (PostgreSQL, MSSQL, IBM DB2). Aplikacja posiada funkcję wyboru bazy danych oraz pola do wpisania danych logowania (IP serwera, port, nazwa bazy, schemat, użytkownik, hasło). Dodatkowo oferuje przycisk "Ping" służący do zalogowania i testowania połączenia z wybraną bazą danych. Po kliknięciu przycisku "Ping" aplikacja wyświetla komunikat o powodzeniu lub braku połączenia wraz z przyczyną błędu (jeśli występuje). Aplikacja musi być zabezpieczona wielopoziomowo.

## Wymagania

Aplikacja powinna spełniać następujące wymagania:

- **Obsługa wielu baz danych:** Pozwala na łączenie się z bazami danych PostgreSQL, MSSQL i IBM DB2.
- **Graficzny interfejs użytkownika (GUI):** Ułatwia użytkownikom wpisywanie danych i interakcję z aplikacją.
- **Formularz wprowadzania danych:** Zawiera pola do wpisywania adresu IP serwera, portu, nazwy bazy danych, schematu, użytkownika i hasła.
- **Przycisk "Ping":** Pozwala użytkownikowi sprawdzić połączenie z bazą danych.
- **Komunikaty o błędach:** Informuje użytkownika o błędach połączenia i ich przyczynach.
- **Zabezpieczenia wielopoziomowe:** Chroni dane uwierzytelniające i dane przed nieautoryzowanym dostępem.
- **Plik wykonywalny:** Umożliwia uruchamianie aplikacji bez potrzeby instalowania Pythona.

## Propozycja projektu

**Architektura aplikacji:**

- Aplikacja będzie składać się z trzech głównych warstw:
  - **Warstwa prezentacji:** Zawiera GUI i obsługuje interakcję z użytkownikiem.
  - **Warstwa logiki biznesowej:** Implementuje logikę sprawdzania połączenia i komunikowania się z bazami danych.
  - **Warstwa dostępu do danych:** Obsługuje połączenia z bazami danych i wykonuje zapytania SQL.
- Warstwy będą komunikować się ze sobą za pomocą interfejsów API. (???)

**Technologie:**

- **Język programowania:** Python
- **Framework GUI:** Tkinter lub PyQt lub Kivy (w zależności od preferencji)
- **Biblioteki baz danych:**
  - psycopg2 (PostgreSQL)
  - pyodbc (MSSQL)
  - ibm_db (IBM DB2)
- **Narzędzie do tworzenia plików wykonywalnych:** PyInstaller lub cx_Freeze

**Warstwa prezentacji (GUI):**

- Główne okno aplikacji będzie zawierać formularz z polami do wpisywania danych:
  - Adres IP serwera
  - Port
  - Nazwa bazy danych
  - Schemat (opcjonalnie)
  - Użytkownik
  - Hasło
- Przycisk "Ping" będzie inicjować proces połączenia i sprawdzania.
- Wyświetlany będzie komunikat o powodzeniu połączenia lub jego braku wraz z informacją o błędzie. LUB
- Okno wewnętrze wynikowe - Wyświetli infromacje o powodzeniu lub błędzie połączenia wraz z ewentualnymi szczegółami błędu.

**Warstwa logiki biznesowej:**

- Zaimplementuje funkcję sprawdzania połączenia, która:
  - Pobierze dane z formularza GUI.
  - Utworzy połączenie z bazą danych za pomocą odpowiedniej biblioteki.
  - Wykona proste zapytanie SQL (np. SELECT 1), aby sprawdzić poprawność połączenia.
  - Zamknie połączenie z bazą danych.
- Zwróci informację o powodzeniu połączenia lub błędzie. (+obsługa błędów)

**Warstwa dostępu do danych:**

- Zapewni funkcje do łączenia się z bazami danych i wykonywania zapytań SQL.
- Użyje odpowiednich bibliotek baz danych (psycopg2, pyodbc, ibm_db) do komunikacji z bazami danych.
- Zabezpieczy dane uwierzytelniające przed nieautoryzowanym dostępem (np. szyfrowanie).

**Zabezpieczenia wielopoziomowe: (do rozważenia!)**

- Weryfikacja poświadczeń / Szyfrowanie danych uwierzytelniających (hasła) podczas przechowywania i przesyłania: Przed nawiązaniem połączenia z bazą danych, aplikacja powinna sprawdzać poprawność danych logowania, w tym hasło użytkownika. Propozycja użycia technik szyfrowania lub hashowania hasła w celu zwiększenia bezpieczeństwa. (Autoryzacja dostępu do funkcji na poziomie bazy danych.)
- Hasło jest przechowywane w sposób bezpieczny, na przykład poprzez używanie zmiennych środowiskowych lub plików konfiguracyjnych z ograniczonym dostępem.
- Ustawienie połączenia z bazą danych w trybie SSL/TLS, aby zabezpieczyć transmisję danych między aplikacją a bazą danych. W kodzie aplikacji ustawić odpowiednie parametry połączenia, aby wymusić użycie szyfrowanego połączenia. (czy to jest wymagane?)
- Stosowanie kontroli dostępu opartej na rolach, aby ograniczyć dostęp do funkcji aplikacji. (nie dotyczy?)
- Regularne aktualizacje oprogramowania i bibliotek w celu ochrony przed lukami bezpieczeństwa. (bez tej funkcjonalności?)
- Stosowanie zapór sieciowych i innych mechanizmów ochrony przed nieautoryzowanym dostępem do serwera bazy danych. (nie dotyczy?)
- Ograniczenie dostępu do kluczy API: Jeśli Twoja aplikacja wymaga dostępu do kluczy API baz danych, upewnij się, że są one przechowywane w bezpieczny sposób, na przykład w plikach konfiguracyjnych z ograniczonymi uprawnieniami dostępu.

**Dodatkowe funkcje:**

- Zapamiętywanie ostatnio używanych ustawień połączenia.
- Obsługa błędów w przypadku wystąpienia błędów, aplikacja powinna wyświetlać użytkownikowi odpowiednie komunikaty oraz ewentualnie proponować rozwiązania lub sugestie co do dalszych kroków.
- Możliwość zapisywania konfiguracji połączeń w plikach.
- Obsługa wielu języków.
- Dokumentacja użytkownika.

### Uwagi

- Powyższy projekt jest jedynie propozycją i może podlegać modyfikacjom w zależności od specyficznych potrzeb.
- Należy dokładnie przetestować aplikację pod kątem bezpieczeństwa przed jej wdrożeniem w środowisku produkcyjnym.
- Ważne jest, aby stosować aktualne wersje Pythona i bibliotek w celu zapewnienia
