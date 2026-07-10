---
name: nextjs-security
description: Secure Next.js application features and review trust boundaries. Use for authentication, authorization, sessions, database access, Server Actions, Route Handlers, webhooks, forms, uploads, redirects, third-party integrations, environment variables, security headers, or security incident fixes.
---

# Next.js security review

Read `references/trust-boundaries.md` for the complete boundary checklist. Apply the checks to the actual flow, not only the UI.

## Review method

1. Identify the actor, data classification, entry point, side effect, and downstream systems.
2. Authenticate the caller where required and authorize the exact action and resource on the server. Scope every query by its tenant/owner.
3. Parse and validate all untrusted input; constrain uploads, redirects, URLs, pagination, and expensive queries.
4. Keep secrets and privileged integrations server-only. Avoid sensitive values in props, logs, URLs, error messages, and `NEXT_PUBLIC_*` variables.
5. Verify signatures for provider webhooks before processing. Design repeated delivery and mutation retries to be safe.
6. Add focused tests for denied access and invalid input, then document any infrastructure control assumed but not present in this repository.

## Stop conditions

Pause for user direction before choosing an identity provider, payment service, data retention policy, compliance posture, or production security control that changes cost, legal exposure, or operations.
