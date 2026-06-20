# Setup Cline + Ollama + Kanban + Auto Routing Modeli

Masz bardzo sensowny kierunek: **Cline + lokalne modele + duże projekty + workflow Kanban**.
To da się zrobić, ale trzeba oddzielić **3 warstwy pracy**, bo jeden model nie powinien robić wszystkiego.

## Najpierw brutalna prawda

Na Twoim sprzęcie:

- **CPU:** i7-13620H
- **RAM:** 32 GB
- **GPU:** RTX 4060 8GB

Jeden duży model `27B/35B` nie powinien obsługiwać całego pipeline'u Cline przy bardzo dużych projektach. **To nieefektywne.**

## Najlepsza architektura dla Ciebie

Podziel role modeli:

### 1. Planner / PM / Kanban / Analiza tasków

**Model lekki i szybki:** `gemma4:e4b`

**Zadania:**

- Tworzenie tasków
- Rozbijanie sprintów
- Analiza backlogu
- Plan refactoru
- Priorytetyzacja

### 2. Main Coding Model

**Model:** `qwen3.6:27b`

**Zadania:**

- Implementacja modułów
- Refactoring
- Praca z dużymi plikami
- Analiza architektury
- Generowanie kodu

### 3. Heavy Architect Mode

**Model:** `qwen3.6:35b`

**Używać tylko do:**

- Redesign systemu
- Migration plan
- Złożona analiza
- Security review
- Wieloetapowe decyzje

> **Uwaga:** Nie używaj tego jako daily driver.

## Czy Cline może sam wybierać modele?

**Oficjalnie:** Nie w pełni autonomicznie. Cline standardowo używa jednego aktywnego provider/model per sesja/task.

**Ale:** Możesz zbudować workflow.

## Jak to zrobić praktycznie

### OPCJA A (Najlepsza) — Profiles / Presets w Cline

Stwórz profile:

| Profile       | Rola      | Model         |
| :------------ | :-------- | :------------ |
| **Profile 1** | Planner   | `gemma4:e4b`  |
| **Profile 2** | Developer | `qwen3.6:27b` |
| **Profile 3** | Architect | `qwen3.6:35b` |

I przełączasz się jednym kliknięciem.

### OPCJA B — MCP Router (bardziej zaawansowane)

Można zrobić local router:

- OpenWebUI
- LiteLLM
- OpenRouter lokalny proxy
- Custom MCP gateway

**Logika routingu:**

- Task zawiera "plan" -> `gemma`
- Task zawiera "code" -> `qwen27b`
- Task zawiera "architecture" -> `qwen35b`

To już półprofesjonalny setup.

## Kanban w Cline + lokalne modele

Tak — bardzo dobry pomysł.

### Jak ustawić

W **Cline Tasks / Kanban**:

**Kolumny:**

1. Backlog
2. Ready
3. In Progress
4. Review
5. Done
6. Blocked

### Workflow modeli

#### 1. Tworzenie backlogu

Uruchamiasz: `gemma4:e4b`

**Prompt:**

> Analyze project and create 50 kanban tasks grouped by frontend/backend/devops/security

#### 2. Realizacja tasku

Przełączasz na: `qwen3.6:27b`

**Prompt:**

> Complete task #17 preserving architecture.

#### 3. Strategic review

Przełączasz na: `qwen3.6:35b`

**Prompt:**

> Review all completed tasks and redesign weak areas.

## Jak połączyć z Ollama w Cline

W **provider settings**:

- **Provider:** Ollama
- **Base URL:** `http://localhost:11434`

**Modele:**

- `qwen3.6:27b`
- `qwen3.6:35b`
- `gemma4:e4b`

## Co bym zrobił na Twoim laptopie

- **Domyślny model:** `gemma4:e4b` (bo szybki)
- **Task execution:** `qwen3.6:27b`
- **Tylko wyjątkowo:** `35b`

## Ważne dla dużych projektów

Dołóż **embedding model**:

Masz: `nomic-embed-text-v2-moe`

**Świetnie!** Użyj go do **RAG / codebase retrieval**.

Wtedy Cline nie musi ładować całego projektu do prompta. To gigantycznie poprawi wydajność.

## Najmocniejsza rada

> **Duże projekty ≠ duży model.**
>
> **Duże projekty to:**
>
> - Embeddings
> - Retrieval
> - Task decomposition
> - Kanban
> - Mniejsze modele wyspecjalizowane

Jeśli chcesz, mogę Ci rozpisać **PRO setup Cline + Ollama + Kanban + auto routing modeli + duże projekty webowe 2026**, dokładnie pod Twój laptop.
