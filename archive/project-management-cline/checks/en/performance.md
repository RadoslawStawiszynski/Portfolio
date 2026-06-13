---
name: Performance Review
description: Check for N+1 queries, heavy loops, unnecessary renders
---

Review this pull request for performance issues.

Flag as failing if:
- New database queries inside loops (N+1 problem)
- Inefficient algorithms (O(n²) where O(n) is possible)
- Unnecessary re-renders in React/Vue/Svelte (missing memo, keys, etc.)
- Heavy operations in hot paths (e.g. in request handlers)
- Loading full datasets instead of pagination/filtering

Provide specific optimization suggestions.
