# Architecture

Keep this document current as the application becomes non-trivial.

## Product boundaries

- **Users and roles:** identities, tenants, permissions, and data ownership.
- **Core journeys:** critical paths and their success/failure behavior.
- **External systems:** provider, purpose, ownership, rate limits, and failure strategy.

## Technical boundaries

- **Routes:** App Router structure and which routes are public, protected, or administrative.
- **Data:** source of truth, schema/migration location, caching model, retention, and backup/restore ownership.
- **Authentication:** session model, authorization policy location, and tenant isolation approach.
- **Background work:** queues, schedules, idempotency strategy, and observability.

## Operational readiness

Document required environment-variable names in `.env.example`, deployment targets, CI commands, telemetry/error reporting, alert owners, and rollback steps. Never put secret values here.
