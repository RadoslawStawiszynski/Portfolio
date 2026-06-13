---
name: Testing & Coverage
description: Require tests for new/changed logic
---

Review PR for test quality.

Flag as failing if:
- New or changed business logic without accompanying unit/integration tests
- Tests that only check happy path (no edge cases / error cases)
- Tests that mock too much (not testing real behavior)
- Low coverage on newly added code

If tests are good → suggest improvements if any.
