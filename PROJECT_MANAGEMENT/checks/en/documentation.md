---
name: Documentation & Comments
description: Ensure public APIs and important logic are documented
---

Review PR for documentation quality.

Flag as failing if:
- New public functions / API endpoints without JSDoc / comments
- Changed logic without updated comments
- Complex algorithm without explanation
- New environment variables without description in README or .env.example

Suggest good comment style.
