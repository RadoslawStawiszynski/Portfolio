# Konfiguracja Cline — Opis Ustawień

## 🤖 Subagents

Pozwala Cline uruchamiać **równoległe, wyspecjalizowane agenty** do eksploracji kodu. Zamiast jednego sekwencyjnego procesu, kilka agentów może jednocześnie przeszukiwać różne części bazy kodu — przyspiesza to analizę dużych projektów.

---

## 🔧 Native Tool Call

Gdy model AI obsługuje **natywne wywołania funkcji** (`function calling`), Cline używa tego mechanizmu bezpośrednio zamiast własnej implementacji.

> **Efekt:** mniejszy narzut tokenów, wyższe prawdopodobieństwo poprawnego użycia narzędzi.

---

## ⚡ Parallel Tool Calling

Pozwala wykonywać **kilka wywołań narzędzi jednocześnie** (np. odczytać dwa pliki naraz). Skraca czas odpowiedzi, gdy operacje są od siebie niezależne.

---

## 📋 Strict Plan Mode

W trybie planowania (`Plan mode`) Cline **nie może edytować** żadnych plików — tylko analizuje i proponuje plan. Bez tej opcji mógłby przypadkowo modyfikować pliki już na etapie planowania.

---

## 🔄 Auto Compact

Gdy historia konwersacji rośnie i zbliża się do limitu kontekstu, Cline **automatycznie kompresuje** (podsumowuje) starsze fragmenty rozmowy. Bez tego musisz ręcznie czyścić kontekst.

---

## 🎯 Focus Chain

Utrzymuje **spójność kontekstu** między kolejnymi interakcjami — Cline "pamięta", na czym skupiał się w poprzednich krokach, co ogranicza błędy wynikające z utraty kontekstu przy długich sesjach.

---

## ⏰ Reminder Interval (1–10)

Co ile kroków/wiadomości Cline ma przypominać sobie instrukcje systemowe lub cel zadania:

- **`1`** — Przypomnienie przy każdej wiadomości (dokładniejsze, ale droższe tokenowo)
- **`10`** — Rzadsze przypomnienia (tańsze, ale model może "dryfować" od celu przy długich zadaniach)

---

## 📝 Editor

### ✨ Feature Tips

Wyświetla rotujące podpowiedzi podczas gdy model "myśli" (faza `thinking`). Pomaga odkrywać funkcje Cline, które możesz przeoczyć.

### 🖼️ Background Edit

Pozwala Cline edytować pliki **bez "kradnienia" focusu edytora** — kursor nie przeskakuje do zmienianego pliku. Przydatne gdy równolegle coś piszesz.

### 💾 Checkpoints

Zapisuje stan projektu w kluczowych momentach zadania (jak snapshoty). Pozwala cofnąć się do wcześniejszego punktu jeśli coś pójdzie nie tak — odpowiednik "undo" na poziomie całego zadania.

### 🌐 Cline Web Tools

Daje Cline dostęp do **przeglądania stron i wyszukiwania w internecie**. Bez tego Cline działa wyłącznie na lokalnych plikach i narzędziach.

---

## 🧪 Experimental

### ⚠️ Yolo Mode

Cline wykonuje wszystkie akcje **bez pytania o potwierdzenie** — automatycznie przechodzi z trybu `Plan` do `Act` i wyłącza zadawanie pytań.

> ⚠️ Używaj tylko gdy w pełni ufasz modelowi i rozumiesz ryzyko.

### ✅ Double-Check Completion

Po zakończeniu zadania Cline odrzuca pierwsze podsumowanie i **ponownie weryfikuje** swoją pracę względem oryginalnych wymagań przed zaakceptowaniem. Zmniejsza ryzyko, że model "udaje" że skończył.

### 🦥 Lazy Teammate Mode

Żart / easter egg — dla rozrywki, nie ma praktycznego zastosowania.

---

## 🚀 Advanced

### 🪝 Hooks

Pozwala uruchamiać **własne skrypty/komendy** w określonych momentach cyklu życia zadania (np. przed edycją pliku, po wykonaniu komendy). Zaawansowana automatyzacja przepływu pracy.

### 📺 MCP Display Mode

Kontroluje jak wyświetlane są odpowiedzi z serwerów MCP (Model Context Protocol) — np. czy pokazywać surowy JSON, sformatowany wynik, czy ukrywać szczegóły. Wpływa tylko na widok, nie na działanie.

---

## 🌐 Konfiguracja Przeglądarki

### 🚫 Disable Browser Tool Usage

Całkowicie wyłącza możliwość używania przeglądarki przez Cline. Gdy włączone, Cline nie może wykonywać żadnych akcji przeglądarkowych (otwieranie stron, klikanie, wpisywanie tekstu).

> **Przydatne:** gdy chcesz ograniczyć zakres działania modelu tylko do lokalnych plików.

### 📐 Viewport Size

Ustawia rozdzielczość wirtualnej przeglądarki używanej do screenshotów i interakcji:

- **`Large Desktop`** (1280x800) — standardowy desktop
- **`Small Desktop`** (900x600) — mniejszy ekran
- **`Tablet`** (768x1024) — orientacja pionowa tabletu
- **`Mobile`** (360x640) — symulacja telefonu

> **Ma znaczenie:** gdy testujesz responsywność UI — Cline "widzi" stronę tak jak urządzenie o danej rozdzielczości.

### 🔗 Use Remote Browser Connection

Zamiast uruchamiać nową instancję przeglądarki, Cline **łączy się z już działającym Chrome/Chromium** przez protokół debugowania (Chrome DevTools Protocol).

> Wymaga uruchomienia Chrome z flagą `--remote-debugging-port`. Dzięki temu Cline może operować na Twojej aktualnej sesji przeglądarki (z zalogowanymi kontami, ciasteczkami itp.).

### 🛤️ Chrome Executable Path _[Optional]_

Ścieżka do pliku wykonywalnego Chrome/Chromium.

- **Zostaw puste** — Cline sam znajdzie przeglądarkę.
- **Wypełnij** tylko gdy masz niestandardową instalację (np. kilka wersji Chrome) i chcesz wskazać konkretną.

### 🏷️ Custom Browser Arguments _[Optional]_

Dodatkowe flagi przekazywane przy uruchamianiu przeglądarki, oddzielone spacjami:

- **`--no-sandbox`** — wymagane w niektórych środowiskach Linux/Docker
- **`--disable-gpu`** — gdy brak karty graficznej
- **`--proxy-server=http://...`** — ruch przez proxy
