# Praktyczne przykłady checków dla Continue.dev

**Wersja: 1.0** | **Data: kwiecień 2026**  
**Cel:** Gotowe szablony checków do folderu `.continue/checks/`  
**Jak używać:**
1. Utwórz folder `.continue/checks/` w root repozytorium.
2. Skopiuj każdy blok poniżej do osobnego pliku `.md` (np. `security.md`, `performance.md`).
3. Commit i push → Continue automatycznie uruchomi je na każdym PR.

Każdy check ma:
- `name` – widoczny w GitHub Status Check
- `description` – krótki opis
- prompt – szczegółowy, gotowy do użycia

---

## 1. Security Review (`security.md`)

```markdown
---
name: Security Review
description: Flagi hardcoded secrets, brak walidacji, SQL injection, logging sensitive data
---

Review this pull request for security issues.

Flag as failing if any of these are true:
- Hardcoded API keys, tokens, passwords, secrets in source files or config
- New API endpoints or routes without proper input validation / sanitization
- SQL queries built with string concatenation (instead of prepared statements / ORM)
- Sensitive data (PII, credentials, tokens) logged to stdout, console, or logs
- Use of insecure random functions (Math.random in JS/TS) or weak crypto
- New dependencies with known high/critical vulnerabilities

If none of these issues are found, pass the check with short positive summary.
