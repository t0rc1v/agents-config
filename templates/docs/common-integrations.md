# Common Next.js integrations

Use this guide only when the relevant dependency is already present in `package.json` or the project explicitly selects it. It records safe defaults without making any vendor mandatory. Check the installed version and official documentation before adding configuration, environment variables, or API calls.

## Identity and billing

- **Clerk:** authenticate and authorize on the server for every protected read and write. Scope data by the authenticated user and, where applicable, organization or tenant. Verify inbound webhooks before syncing identity data, and make webhook handling idempotent.
- **Polar:** create checkout, portal, and fulfillment flows from trusted server code. Treat verified webhook events and a server-side entitlement record as the source of truth; never grant access solely from browser state or a redirect result. Reconcile retries and out-of-order events safely.

## Data and retrieval

- **Neon and Drizzle ORM:** keep connection setup and queries in server-only modules. Define schemas and migrations in version control, review generated SQL, and use transactions for related writes. Do not expose database URLs or privileged clients to the browser.
- **Chroma Cloud:** keep credentials and collection administration server-side. Authorize every document before embedding, retrieval, or deletion; isolate tenant data with the project's chosen collection/metadata strategy. Validate retrieved content before using it in an application response or tool workflow.

## AI and agent workflows

- **Vercel AI SDK:** call model providers from server code, validate request and tool inputs, and enforce authorization before accessing user data. Stream with cancellation and clear failure states; log safe operational metadata without prompts, secrets, or personal data unless retention has been explicitly approved.
- **LangChain Deep Agents:** give agents narrow, typed tools with explicit authorization and bounded inputs/outputs. Treat model output, retrieved text, and tool arguments as untrusted. Add budgets, timeouts, tracing with redaction, and human confirmation for consequential or irreversible actions.

## Async work, email, and rate limits

- **Inngest:** model events as versioned contracts and make each function retry-safe and idempotent. Use stable idempotency keys for external side effects, validate event data at the consumer, and document schedules, ownership, and failure handling.
- **Resend:** send email only from trusted server code. Validate recipient and template data, avoid sensitive content in logs, and make sends retry-safe to prevent duplicates. Verify provider webhooks before using delivery or bounce events.
- **Upstash:** use a stable, privacy-conscious key derived from the authenticated actor or trusted request context for Redis-backed caches and rate limits. Decide and document whether a dependency outage should fail open or closed, especially for abuse-sensitive endpoints.

## Files and testing

- **UploadThing:** authorize the upload initiation endpoint, enforce allowed file types and size limits, and verify ownership before serving, processing, or deleting a file. Treat the resulting file URL and metadata as untrusted until validated; keep any webhook processing idempotent.
- **Playwright:** cover critical user journeys and authorization-sensitive paths with deterministic fixtures. Keep test credentials out of the repository, isolate test data, and avoid relying on production services or shared state.

## Styling

- **Tailwind CSS:** follow the project's installed Tailwind major version and existing CSS/configuration convention. Keep responsive, accessible states explicit; do not introduce a new config style or global reset merely because another project uses one.

## Integration checklist

For every adopted service, document its environment-variable names (without values), ownership, data classification, webhook/signature requirements, retry and idempotency behavior, rate limits, failure mode, and the focused tests that cover the boundary.
