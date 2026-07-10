# App Router boundary reference

Choose a Server Component for data access, cookies/headers access, secure configuration, and non-interactive rendering. Choose a Client Component only for stateful browser interaction, effects, event handlers, or browser APIs; pass it minimal serializable data.

For a mutation: authenticate, authorize resource ownership, parse/validate input, mutate with a transaction where related writes must agree, record safe telemetry, then revalidate the precise affected path/tag. Design retries to be idempotent when the caller or provider can repeat requests.

Prefer static rendering for public stable content, dynamic rendering for request-specific content, and explicitly scoped invalidation for cached shared data. Personalized data and responses containing credentials must not be put in a shared cache.
