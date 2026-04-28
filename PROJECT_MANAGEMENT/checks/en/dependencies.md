---
name: Dependencies & Vulnerabilities
description: Check package.json changes and security
---

Review changes in package.json / lock files.

Flag as failing if:
- New dependency with known high/critical vulnerability
- Major version bump without justification
- Adding heavy dependencies to frontend bundle
- Using deprecated packages

List exact vulnerable packages and suggest alternatives/fixes.

