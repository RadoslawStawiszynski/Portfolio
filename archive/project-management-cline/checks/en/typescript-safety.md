---
name: TypeScript Safety
description: Ensure strong typing, no any, proper generics
---

Review PR for TypeScript type safety.

Flag as failing if:
- Usage of `any` type
- Missing or incorrect return types / parameter types
- Unsafe type assertions (`as any`, `!`)
- New code without proper interfaces or types for complex objects
- Unused type definitions

Suggest better types where possible.

