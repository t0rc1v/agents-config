---
name: nextjs-quality
description: Verify and improve Next.js application quality. Use when adding or reviewing features, fixing bugs, preparing a pull request, debugging a production issue, changing UI, tests, data boundaries, performance, accessibility, or deployment behavior.
---

# Next.js quality gate

Use this skill before declaring work complete. Read `references/verification.md` when selecting tests or investigating a failed production build.

## Verify in layers

1. Read existing scripts and run the smallest relevant checks while iterating.
2. Test pure domain logic with unit tests; test request/action/data boundaries with integration tests; test critical user journeys in a browser.
3. For UI changes, manually check keyboard navigation, focus visibility, labels/errors, narrow and wide viewports, loading, empty, and failure states.
4. Before handoff run formatter/lint, TypeScript, relevant tests, and `next build` (or the repository's production build command).
5. Inspect the diff for accidental generated changes, debug code, new secrets, and missing documentation/migrations.

## Report honestly

State exact commands that passed. For checks that cannot run, state the command, the blocking condition, the consequence, and the narrowest useful follow-up. Do not trade correctness for test-only code paths or hide failures with type suppressions.
