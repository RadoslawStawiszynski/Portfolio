# Checks — Automatyczne przeglądy kodu

> Szablony checków dla Continue.dev (PR checks) i Cline (code review prompts).
> Każdy plik = jeden obszar weryfikacji z gotowym promptem dla modelu AI.

---

## Struktura

```
checks/
├── pl/                          ← Polskie wersje (używaj z Cline po polsku)
│   ├── bezpieczenstwo.md
│   ├── styl-kodu.md
│   ├── testy.md
│   ├── wydajnosc.md
│   ├── dokumentacja.md
│   ├── zaleznosci.md
│   ├── dostepnosc.md
│   ├── typescript-bezpieczenstwo.md
│   └── zgodnosc-z-planem.md     ← NOWY: specyficzny dla AI_PROJECT_WORKFLOW
│
└── en/                          ← Angielskie wersje (dla Continue.dev / GitHub)
    ├── security.md
    ├── code-style.md
    ├── testing.md
    ├── performance.md
    ├── documentation.md
    ├── dependencies.md
    ├── accessibility.md
    ├── typescript-safety.md
    └── plan-compliance.md       ← NOWY: specyficzny dla AI_PROJECT_WORKFLOW
```

---

## Jak używać z Continue.dev (GitHub PR checks)

1. Skopiuj pliki z `en/` do `.continue/checks/` w swoim projekcie
2. Commit i push → Continue uruchamia je automatycznie na każdym PR
3. Każdy check pojawia się jako osobny GitHub Status Check

## Jak używać z Cline (review na żądanie)

Skopiuj treść pliku do chatu Cline, dodając kontekst:

```
@diff [zawartość wybranego check]
```

Przykład dla polskiego code review:
```
Przejrzyj poniższe zmiany. [zawartość checks/pl/styl-kodu.md]
@diff
```

## Ocena dostępnych checków

| Check | Priorytet | Kiedy użyć |
|-------|-----------|------------|
| `bezpieczenstwo` / `security` | 🔴 ZAWSZE | Każdy PR z kodem |
| `zgodnosc-z-planem` / `plan-compliance` | 🔴 ZAWSZE | Każdy PR w tym projekcie |
| `testy` / `testing` | 🟠 WYSOKI | PR z nową logiką |
| `styl-kodu` / `code-style` | 🟡 ŚREDNI | PR review przed merge |
| `wydajnosc` / `performance` | 🟡 ŚREDNI | Gdy dotykasz hot paths |
| `zaleznosci` / `dependencies` | 🟡 ŚREDNI | PR z package.json |
| `typescript` | 🟡 ŚREDNI | Projekty TypeScript |
| `dokumentacja` / `documentation` | 🟢 NISKI | Publiczne API, biblioteki |
| `dostepnosc` / `accessibility` | 🟢 NISKI | PR z UI |

---

## Ważna uwaga techniczna

Pliki checków dla Continue.dev **muszą** zaczynać się od raw frontmatter (`---`), nie od bloku kodu `` ```markdown ``.
Przykład poprawnego formatu — patrz dowolny plik w `en/` lub `pl/`.
