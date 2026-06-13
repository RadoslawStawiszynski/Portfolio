---
name: Code Style & Best Practices
description: Enforce clean code, SOLID, DRY, meaningful names
---

Review the PR for code style and best practices.

Flag as failing if:
- Very long functions (> 80 lines) or classes with too many responsibilities
- Magic numbers/strings without constants
- Poor variable/function naming (single letters, vague names)
- Unused variables, imports or dead code
- Complex nested conditionals without early returns or extraction
- Violation of DRY principle (repeated logic)

Suggest concrete refactors when failing.
