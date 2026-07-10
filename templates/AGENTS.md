# Production Next.js agent guide

This document governs every change in this repository. Prefer the closest nested `AGENTS.md` when one gives more specific direction; never weaken security, correctness, accessibility, or verification requirements below.

## Operating principles

- Inspect the existing architecture, package scripts, conventions, and relevant tests before changing code. Make the smallest coherent change.
- Use installed versions and official documentation for unstable APIs. Do not invent APIs, environment variables, migrations, or provider configuration.
- State assumptions that materially affect behavior. Ask before choosing a vendor, billing-impacting service, irreversible data operation, or public API contract not already established.
- Preserve user changes and unrelated work. Do not replace configuration, lockfiles, generated files, or secrets wholesale.
- Build complete vertical slices: user-visible states, authorization, validation, error handling, telemetry where available, and tests belong with the feature.

## Architecture

- Use the App Router for new routes. Keep `page`, `layout`, `loading`, `error`, `not-found`, route handlers, metadata, and middleware thin and conventionally located.
- Default to React Server Components. Add `"use client"` only at the smallest interactive boundary; never make a whole route client-side merely to use a browser hook.
- Fetch and mutate on the server. Keep browser code free of secrets and privileged database/API access. Pass serializable, minimal props through client boundaries.
- Separate route composition, feature UI, domain logic, data access, and integrations. Reuse existing feature/module boundaries rather than generic dumping grounds.
- Validate all untrusted input at the server boundary: route params, search params, forms, actions, webhooks, and route handlers. Return stable user-facing errors and log useful safe context.
- Treat Server Actions and Route Handlers as public mutation boundaries: authenticate, authorize the specific resource/action, validate input, mutate, revalidate affected data, and define idempotency where retries are possible.
- Keep database access server-only, use transactions for related writes, avoid N+1 queries, and make schema/data migrations reviewable and reversible when practical.

## TypeScript and UI

- Keep TypeScript strict. Model domain data explicitly; do not use `any`, unsafe casts, ignored compiler errors, or non-null assertions to suppress uncertainty.
- Compose accessible semantic HTML first. Every control needs an accessible name, visible focus treatment, keyboard operation, and appropriate labels/errors.
- Design loading, empty, success, offline/degraded, permission-denied, and error states. Do not leave a spinner or blank page as the only failure behavior.
- Use responsive layouts without assuming a viewport, pointer type, color scheme, or JavaScript availability. Respect reduced motion and maintain color contrast.
- Use `next/image`, `next/font`, and metadata APIs where they fit. Supply meaningful image `alt` text; use empty alt only for decorative images.

## Security and privacy

- Never commit credentials, tokens, private keys, production data, or `.env*` files. Document required variable names in `.env.example` without values.
- Expose only intentionally public values prefixed with `NEXT_PUBLIC_`. Consider all client-visible values public.
- Enforce authorization on the server for every protected read and write; UI visibility is not authorization. Scope queries by tenant/owner and avoid insecure direct object references.
- Prevent injection with parameterized data APIs, validated input, and no unsafe HTML. Verify webhook signatures before processing trusted events.
- Avoid logging secrets and personal data. Add rate limits, request-size limits, and abuse controls to public expensive endpoints when infrastructure supports them.
- Review redirects, external URLs, uploads, cookies, CORS, and security headers as trust boundaries. Do not weaken them to make a test pass.

## Performance, reliability, and SEO

- Choose rendering and caching deliberately. Keep personalized data dynamic and scoped; define invalidation after mutations. Do not cache authenticated responses in shared caches.
- Stream slow independent work with `Suspense` where it improves perceived performance. Parallelize independent server work and avoid client waterfalls.
- Keep client bundles small: isolate client components, dynamically import genuinely heavy optional UI, and do not ship server-only libraries to the browser.
- Add route-level metadata, canonical URLs, robots/sitemap behavior, and structured data only when accurate.
- Handle expected failures near their source. Use error boundaries, retry-safe writes, and timeouts/cancellation for external calls where appropriate.

## Testing and delivery

- Add or update tests for changed behavior. Prefer unit tests for domain logic, integration tests for server/data boundaries, and browser tests for critical journeys.
- Run the repository's relevant formatter, linter, typecheck, test suite, and production build before handoff. If a command cannot run, report the exact command, blocker, and unverified risk.
- Inspect changed files and avoid unrelated formatting churn. Keep commits focused and never stage secrets.
- In the handoff, state what changed, how it was verified, and any material follow-up or operational requirement. Do not claim a check passed unless it ran successfully.

## Decision checklist

Before declaring work complete, verify: correct server/client boundary; input validation; authentication and authorization; loading/error/empty states; accessibility; caching/invalidation; metadata when user-facing; tests; and production build viability.
