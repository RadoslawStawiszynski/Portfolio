# Git Workflow — PortfolioHub

## Gałęzie

| Gałąź     | Rola                                            | Deploy                     |
|-----------|-------------------------------------------------|----------------------------|
| `main`    | Produkcja — tylko stabilny, przetestowany kod   | Vercel PROD (ręczny)       |
| `staging` | Integracja / QA — tu trafiają gotowe feature-y  | Vercel Preview (auto)      |
| `dev`     | Aktywna praca — bieżące zmiany                  | Lokalnie (Docker)          |

## Workflow

```
feature/xyz ──┐
              ▼
             dev ──PR──► staging ──(testy OK)──PR──► main ──► vercel --prod
```

1. Nową funkcję zacznij od: `git checkout -b feature/nazwa dev`
2. Commity robisz na feature branchu
3. PR: `feature/nazwa` → `staging`
4. Jeśli staging OK → PR: `staging` → `main`
5. Deploy na Vercel: `vercel --prod` (ręcznie po akceptacji Radosława)

## Konwencja commitów (Conventional Commits)

```
<type>(<scope>): <opis>

feat(blocks): add hero block renderer
fix(auth): resolve JWT refresh loop
chore(docker): add healthchecks to postgres service
docs(readme): update setup instructions
refactor(api): extract portfolio fetcher to lib
test(blocks): add unit tests for experience block
style(ui): align hero section padding
```

### Typy

| Typ        | Kiedy                                          |
|------------|------------------------------------------------|
| `feat`     | Nowa funkcja                                   |
| `fix`      | Naprawa błędu                                  |
| `chore`    | Konfiguracja, zależności, tooling              |
| `docs`     | Dokumentacja                                   |
| `refactor` | Refaktoryzacja bez zmiany zachowania           |
| `test`     | Testy                                          |
| `style`    | Formatowanie, whitespace (bez logiki)          |
| `perf`     | Optymalizacja wydajności                       |
| `ci`       | CI/CD pipeline                                 |

## Zasady

- `main` i `staging` — **NIGDY** bezpośredni push. Tylko przez PR.
- `git push` do `origin main` wyłącznie po akceptacji Radosława.
- Każdy PR musi mieć opis: co zmienia i jak testować.
- Squash commits przy merge do `staging` (czystsza historia).
- Agent AI zawsze pracuje na `dev` (lub feature branch z `dev`).
