---
title: Project Rules for Cline — Detailed Version (English)
version: 1.0
date: 2026-04-26
language: en
for: Cline AI Assistant (VS Code)
ref: AI_PROJECT_WORKFLOW.md
---

# Project Rules for Cline

> English mirror of `cline_zasady_projektu_pl.md`.
> Compact operational version: `.clinerules` in project root.

---

## 1. How to start every task

Before writing a single line of code:

1. **Ask for the PLAN** — which PLAN file does this task belong to (`PLAN_N §X.Y`)?
2. **Read only the relevant context** — don't load entire PLAN files
3. **Confirm scope** — "I understand I need to do X within scope Y. Proceed?"
4. **Check dependencies** — is there a `[!]` blocking this task?

If the human didn't provide a PLAN number — ask. Don't guess.

---

## 2. How to update PLAN files during work

### Status change pattern

```markdown
# Before (in PLAN file):
- [o] Implement JWT validation

# After completion:
- [v] Implement JWT validation — 2026-04-28
```

### When you encounter a blocker

```markdown
- [!] Implement JWT validation — BLOCKED
  - → Reason: missing jose library in package.json
  - → Waiting for: human decision (jose vs jsonwebtoken)
```

### When you discover something worth noting

Don't write to PLAN — add to the module's `TODO.md`:

```markdown
## Observations

- [ ] JWT validation doesn't handle RS256 algorithm tokens — worth investigating
```

---

## 3. Comment tags in PLAN files

| Tag | Action |
|-----|--------|
| `<!--HUMAN ... /HUMAN-->` | IGNORE completely — private human notes |
| `<!--AI-NOTE ... /AI-NOTE-->` | Respond to the note, then replace with `<!--AI-RESOLVED date: ... /AI-RESOLVED-->` |
| `> **[Decision YYYY-MM-DD]**` | Read as context, do not modify |

---

## 4. When to ask vs. when to act

### Act without asking when:
- Implementing code aligned with existing `[o]` or `[~]` PLAN item
- Updating statuses `[~]` → `[v]` after completion
- Adding observations to `TODO.md`
- Fixing a bug described in the task

### ALWAYS ask when:
- The task requires changing architecture (especially `PLAN_1.md §1`)
- You discover the scope is larger than the task description
- You don't know which PLAN the change belongs to
- You want to mark something as `[x]` (skipped) — human decides
- Module dependencies are unclear

---

## 5. Response format after completing a task

Always use this template:

```
✅ Done: [one-sentence description of what was done]

📄 PLAN updated:
   PLAN_N §X.Y: [o] → [v] 2026-XX-XX

⚠️  Human decisions needed:
   [list of [?] items — omit section if none]

📋 Added to TODO.md (src/module/TODO.md):
   [list of observations — omit section if none]

🔍 Review suggestions:
   - [specific thing to check]
   - [edge case to test]
```

---

## 6. What CANNOT be changed without explicit approval

1. `PLAN_1.md §1` — global project architecture ("the constitution")
2. `[x]` statuses (skipped) — only human can reverse a skip decision
3. Task priorities (`[o]` vs `[ ]`) — human decides what is active
4. `docs/DECISIONS.md` — only human adds entries, agent may propose

---

## 7. Commit message format

```
[PLAN_N §X.Y] type: description in one line (max 72 chars)

Optional paragraph explaining WHY (not WHAT — code shows what).
```

Types: `feat` / `fix` / `plan` / `refactor` / `review` / `docs` / `test`

Examples:
```
[PLAN_2 §2.1] feat: JWT validation in auth middleware
[PLAN_2 §1.1] plan: JWT vs Session decision — JWT selected
[PLAN_3 §1.0] fix: API Gateway routing for nested paths
```

---

## 8. Quick reference — status markers

```
[ ]  planned        — agent can create
[o]  active         — human sets priority
[~]  in progress    — agent sets, adds (Kanban: TASK-XXX)
[v]  done           — agent sets, adds date YYYY-MM-DD
[x]  skipped        — human decides, agent may propose with justification
[?]  decision       — agent flags, human answers
[!]  blocked        — agent flags with blocker description
[>]  moved          — agent with reference (→ PLAN_N §X.Y)
```
