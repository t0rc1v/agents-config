# Trust-boundary checklist

**Client to server:** validate shape, size, type, and business rules; authenticate; authorize the requested resource; rate-limit expensive public operations; use safe errors.

**Server to data store:** use a server-only client, parameterized queries/ORM APIs, least-privilege credentials, and tenant/owner scopes. Use transactions for related writes.

**External provider to server:** verify the official signature over the raw required payload, identify replay behavior, set timeouts, and treat provider data as untrusted until validated.

**Server to browser:** avoid leaking secrets or private fields through serialized props, redirects, URLs, caching, logs, or errors. Only `NEXT_PUBLIC_*` variables are intentionally browser-visible.
