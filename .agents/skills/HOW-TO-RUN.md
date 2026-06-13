# Jak uruchamiać skille agentów — PortfolioHub

## Dostępne skille

| Plik | Rola | Modyfikuje pliki? | Kiedy uruchamiać |
|------|------|-------------------|-----------------|
| `audit-agent.md` | Diagnostyka projektu (8 przebiegów) | NIE (read-only) | Przed nową fazą / po serii commitów |
| `sync-progress.md` | Aktualizacja PLAN.md + CHANGELOG.md | TAK (docs only) | Po sesji developerskiej |
| `session-handoff.md` | Zapis stanu sesji do `.remember/` | TAK (`.remember/`) | Na końcu każdej sesji |

---

## GitHub Copilot (VS Code — Agent Mode) ← GŁÓWNA METODA

### Jak otworzyć tryb agenta:
1. VS Code → panel Copilot Chat (ikona czatu)
2. Kliknij **"Agent"** (nie "Ask" ani "Edit")
3. Model: ustaw na **Claude Haiku 4.5** (szybki, tani) lub **Claude Sonnet** (dokładniejszy)

### Uruchamianie skilla:

**Opcja A — wklej zawartość skilla:**
```
Otwórz .agents/skills/audit-agent.md i wklej całą zawartość do chatu
```

**Opcja B — powiedz agentowi żeby przeczytał plik:**
```
Przeczytaj plik .agents/skills/audit-agent.md i wykonaj wszystkie instrukcje które w nim znajdziesz.
Repo root: /home/rspro/Dokumenty/1.CODE/2.Portfolio
```

**Opcja C — skrót per skill:**

```
# audit-agent:
Przeczytaj i wykonaj: /home/rspro/Dokumenty/1.CODE/2.Portfolio/.agents/skills/audit-agent.md

# sync-progress:
Przeczytaj i wykonaj: /home/rspro/Dokumenty/1.CODE/2.Portfolio/.agents/skills/sync-progress.md

# session-handoff:
Przeczytaj i wykonaj: /home/rspro/Dokumenty/1.CODE/2.Portfolio/.agents/skills/session-handoff.md
```

### Rekomendowane modele per skill:
| Skill | Model | Powód |
|-------|-------|-------|
| `audit-agent` | Claude Haiku 4.5 | Dużo komend bash, mało analizy — szybki i tani |
| `sync-progress` | Claude Haiku 4.5 | Regex + edycja tekstu — mechaniczne |
| `session-handoff` | Claude Haiku 4.5 | Krótkie, proste — bez sensu płacić więcej |

---

## Cline (VS Code extension z Ollama/OpenRouter)

### Uruchomienie:
1. Otwórz Cline w VS Code
2. Wklej prompt jako nowe zadanie:

```
Masz zadanie do wykonania. Przeczytaj plik ze skillem i wykonaj go krok po kroku.

Skill: /home/rspro/Dokumenty/1.CODE/2.Portfolio/.agents/skills/audit-agent.md

Zasady:
- Wykonaj WSZYSTKIE kroki opisane w pliku
- Nie modyfikuj kodu aplikacji (tylko plik wynikowy audytu)
- Zapisz wynik do .agents/audit/audit-YYYY-MM-DD.md
```

### Rekomendowane modele Ollama dla poszczególnych skillów:
| Skill | Model Ollama | Alternatywa |
|-------|-------------|-------------|
| `audit-agent` | `qwen2.5-coder:32b` | `llama3.1:70b` |
| `sync-progress` | `qwen2.5-coder:14b` | `llama3.1:8b` |
| `session-handoff` | `llama3.1:8b` | `mistral:7b` |

```bash
# Przykład uruchomienia przez terminal:
cat /home/rspro/Dokumenty/1.CODE/2.Portfolio/.agents/skills/audit-agent.md | \
  ollama run qwen2.5-coder:32b
```

---

## Continue (VS Code extension)

1. Otwórz Continue w VS Code
2. W oknie chatu wklej:

```
@file .agents/skills/audit-agent.md

Wykonaj wszystkie kroki z tego pliku. 
Repo root: /home/rspro/Dokumenty/1.CODE/2.Portfolio
Zapisz wynik do .agents/audit/audit-DZISIAJ.md
```

---

## Claude Code (terminal)

```bash
cd /home/rspro/Dokumenty/1.CODE/2.Portfolio

# Powiedz Claude żeby użył skilla:
# "Uruchom skill audit-agent"
# "Wykonaj sync-progress"
# "Zapisz session-handoff"

# Lub bezpośrednio przez Skill tool (wbudowane w Claude Code):
# /skill audit-agent
```

---

## Przykładowy przepływ pracy (workflow)

### Typowa sesja developerska:

```
1. START SESJI:
   → Copilot Agent: "Przeczytaj .agents/skills/audit-agent.md i wykonaj"
   → Sprawdź raport: .agents/audit/audit-YYYY-MM-DD.md
   → Jeśli 0 CRITICAL — zaczynam pracę

2. PODCZAS SESJI:
   → Pracuję z Claude Code (implementacja)
   → Commity jak zwykle

3. KONIEC SESJI:
   → Copilot Agent: "Przeczytaj .agents/skills/sync-progress.md i wykonaj"
   → PLAN.md i CHANGELOG.md zaktualizowane automatycznie
   
   → Copilot Agent: "Przeczytaj .agents/skills/session-handoff.md i wykonaj"
   → .remember/now.md zaktualizowany — następna sesja wie co robić
```

### Przed nową fazą:
```
1. audit-agent   → raport diagnostyczny
2. sync-progress → PLAN.md/CHANGELOG.md aktualne
3. session-handoff → stan zapisany
4. → Zaczynam Fazę 2 z Claude Code
```

---

## Częste pytania

**Q: Czy mogę uruchomić kilka skillów naraz?**  
A: Lepiej kolejno — każdy skill ma swój zakres i pisanie do tych samych plików jednocześnie może powodować konflikty.

**Q: Audit modyfikuje kod?**  
A: NIE. `audit-agent.md` jest read-only. Jedyny plik który tworzy to `.agents/audit/audit-YYYY-MM-DD.md`.

**Q: Co jeśli `sync-progress` oznaczy coś błędnie jako [x]?**  
A: Sprawdź diff przed mergeiem do `staging`. Skill bazuje wyłącznie na ID tasków w commitach — jeśli commit message zawiera `B8.5`, oznaczy B8.5 jako done.

**Q: Jak często puszczać `session-handoff`?**  
A: Raz na koniec sesji. Plik `.remember/now.md` jest buforem — nadpisuje się za każdym razem.
