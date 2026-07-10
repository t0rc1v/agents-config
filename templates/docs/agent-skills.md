# Agent skill policy

The repository bundles three local, reviewable skills under `.agents/skills/`:

- `nextjs-architecture` for App Router, rendering, data, and mutation design.
- `nextjs-quality` for test selection, accessibility review, and delivery checks.
- `nextjs-security` for authentication, authorization, trust boundaries, and secret handling.

It also preloads these reviewed third-party snapshots:

- `find-skills`, `frontend-design`, `shadcn`, and `tdd`.
- `vercel-composition-patterns`, `vercel-react-best-practices`, and `web-design-guidelines`.

Use `shadcn` only when the project has `components.json` or explicitly adopts shadcn/ui. The skill contains shell-command guidance; inspect any proposed CLI operation and diff before applying it.

## Maintainer update flow

The source snapshots live in this configuration repository's `.agents/skills/` directory. `skills-lock.json` records their upstream source and content hash; the installer distributes the mirrored copies in `templates/.agents/skills/`.

1. Run `npx skills update --project --yes` in this repository.
2. Review every source change, especially instructions containing commands or external integrations.
3. Run `npm run sync:skills`, then `npm run check && npm test`.
4. Commit `skills-lock.json`, source skills, and mirrored templates together; release a new SemVer tag.

The weekly update workflow opens a pull request only. It never merges source changes automatically.

Install specialist skills only when the project has a concrete need. Review their source before committing it, pin or document the source revision, and remove skills that no longer serve a project.

Suggested skills.sh starting points:

```bash
# Advanced App Router and caching patterns
npx skills add https://github.com/wshobson/agents --skill nextjs-app-router-patterns
```

Treat a skill as executable project guidance: it may affect code, commands, and external integrations. Do not install a skill that asks for secrets or broad destructive actions without a deliberate review.
