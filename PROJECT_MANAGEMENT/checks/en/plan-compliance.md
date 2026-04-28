---
name: Plan Compliance Check
description: Verify that code changes match the PLAN document specification (AI_PROJECT_WORKFLOW)
---

Review this pull request for compliance with the project PLAN documents.

Find the relevant PLAN_N.md file referenced in the branch name or commit messages (format: [PLAN_N §X.Y]).

Flag as failing if any of these are true:
- The implementation diverges from the architecture described in PLAN_1.md §1 without a documented decision
- A task is marked complete ([v]) but the implementation is missing key requirements from the PLAN section
- New code introduces a dependency or pattern not reflected in any PLAN file
- The commit message doesn't follow the format [PLAN_N §X.Y] type: description
- A PLAN section status was not updated (still [~] or [o]) after the feature was implemented
- Architecture decisions were made that should be recorded in DECISIONS.md but aren't

If the PR doesn't reference any PLAN, note this but don't fail — not all commits are feature work.

Provide specific PLAN file references in your feedback (e.g., "PLAN_2 §3.1 specifies X but the implementation does Y").
