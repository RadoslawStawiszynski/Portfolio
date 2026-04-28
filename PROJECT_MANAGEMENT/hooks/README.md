# Hooks — Automatyzacje workflow

> Hooki to skrypty uruchamiane automatycznie przed/po zadaniach agenta lub podczas pracy z projektem.
> Mogą być używane z: Cline (custom hooks), Continue.dev, git hooks, lub ręcznie z CLI.

---

## Zawartość folderu

| Plik | Kiedy | Co robi |
|------|-------|---------|
| `przed_zadaniem.sh` | Przed uruchomieniem agenta | RAG query, ładuje kontekst PLAN, sprawdza blokady |
| `po_zadaniu.sh` | Po wykonaniu zadania | Aktualizuje CHANGELOG, weryfikuje statusy PLAN |
| `indeksuj_rag.sh` | Po zmianie plików PLAN | Przeindeksowuje dokumenty do lokalnego RAG |
| `tygodniowy_przeglad.sh` | Piątek wieczór | Zbiera TODO.md, generuje raport stanu projektu |

---

## Jak używać z Cline

Cline (od wersji 3.x) obsługuje custom hooks w `.vscode/cline-hooks.json`:

```json
{
  "beforeTask": ["bash hooks/przed_zadaniem.sh"],
  "afterTask": ["bash hooks/po_zadaniu.sh"],
  "onPlanChange": ["bash hooks/indeksuj_rag.sh"]
}
```

## Jak używać z git

Skopiuj skrypty do `.git/hooks/` lub użyj `husky`:

```bash
# Przykład: uruchom po każdym commicie
cp hooks/po_zadaniu.sh .git/hooks/post-commit
chmod +x .git/hooks/post-commit
```

## Zmienne środowiskowe

Skrypty korzystają z tych zmiennych (możesz ustawić w `.env`):

```bash
PROJECT_NAME="NazwaProjektu"
PLAN_DIR="docs"           # Katalog z plikami PLAN
RAG_MODEL="nomic-embed-text-v2-moe"
OLLAMA_URL="http://localhost:11434"
```
