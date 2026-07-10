# Next.js agent configuration

Reusable, versioned instructions and skills for AI agents building production-ready Next.js applications. It ships as a zero-dependency CLI, so the consuming app receives plain, reviewable files rather than a runtime dependency.

## Use it in a new app

Create the app first, then run this from its root:

```bash
npx github:t0rc1v/agents-config init
```

The command installs:

- `AGENTS.md` — global engineering rules and delivery gates.
- `.agents/skills/` — focused skills for architecture, quality, and security.
- `.github/` — CI and dependency-update defaults.
- `.editorconfig`, `docs/architecture.md`, and `docs/decisions/README.md` — durable project conventions.
- `.agents-config/manifest.json` — the file hashes and version used for safe updates.

The baseline also includes reviewed snapshots of frontend-design, shadcn, TDD, skill discovery, and Vercel's React/UI skills. See `templates/docs/agent-skills.md` for the full list and maintenance policy.

Use `--skip-skills` for an instructions-only install, `--dry-run` to preview, and `--force` only when deliberately replacing locally edited managed files.

## Sync safely

Run the same source from the consuming app:

```bash
npx github:t0rc1v/agents-config sync
```

`sync` updates files that are unchanged since their last managed version and leaves edited files untouched, reporting them as conflicts. Commit the installed files, including `.agents-config/manifest.json`, so the team shares the exact agent baseline. To deliberately replace a local modification, run `sync --force`.

## Releases and pinning

Use Semantic Versioning. After the initial commit, create the first annotated release tag:

```bash
git tag -a v0.1.0 -m "v0.1.0"
git push origin main --tags
```

For later releases, let npm update the version, commit, and tag together:

```bash
npm version minor
git push origin main --follow-tags
```

Consumers can opt into the latest default branch or pin a repeatable baseline:

```bash
npx github:t0rc1v/agents-config#v1.0.0 init
npx github:t0rc1v/agents-config#v1.0.0 sync
```

Keep breaking changes to the managed file layout for a major version. The installer intentionally has no package-manager assumptions; the CI template detects npm, pnpm, yarn, or bun.

## Skills ecosystem and maintenance

The source configuration tracks third-party skill origins in `skills-lock.json`; `npm run sync:skills` mirrors them into the distributable templates. Refresh source skills with `npx skills update --project --yes`, review the changes, run checks, and release a new tag. A weekly GitHub Action opens (but never merges) an update pull request.

Add specialist capabilities per project through [skills.sh](https://www.skills.sh):

```bash
npx skills add vercel-labs/agent-skills --skill vercel-react-best-practices
npx skills add https://github.com/wshobson/agents --skill nextjs-app-router-patterns
```

Review third-party skill contents before committing them. Treat skills as source code with the same supply-chain scrutiny as dependencies.

## Maintainer checks

```bash
npm test
npm run check
npm pack --dry-run
```
