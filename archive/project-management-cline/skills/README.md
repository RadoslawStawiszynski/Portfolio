# Skills — Szablony promptów dla agenta

> Skills to gotowe szablony promptów do wielokrotnego użycia. Każdy plik = jedno zadanie które często wykonujesz.
> Skopiuj treść prompta do Cline lub użyj jako custom slash command w Continue.dev.

---

## Zawartość

| Plik | Kiedy używać |
|------|-------------|
| `01_bootstrap_projektu.md` | Nowy projekt — tworzenie PLAN_INDEX + PLAN_1 |
| `02_rozwin_modul.md` | Tworzenie PLAN_N dla nowego modułu |
| `03_wykonaj_zadanie.md` | Realizacja konkretnego taska z Kanban |
| `04_przeglad_tygodniowy.md` | Piątkowy przegląd — zbieranie TODO, aktualizacja statusów |
| `05_code_review.md` | Code review przez gemma4:e4b jako drugi głos |
| `06_przebudowa_projektu.md` | Adaptacja istniejącego projektu do tego workflow |

---

## Jak używać w Cline

1. Otwórz plik skill który chcesz użyć
2. Wypełnij sekcje oznaczone `[...]`
3. Skopiuj do pola chat w Cline
4. Opcjonalnie dodaj `@codebase` na początku dla kontekstu z kodu

## Jak dodać jako slash command w Continue.dev

W pliku `.continue/config.json`:
```json
{
  "slashCommands": [
    {
      "name": "bootstrap",
      "description": "Bootstrap nowego projektu",
      "prompt": "[zawartość 01_bootstrap_projektu.md]"
    }
  ]
}
```
