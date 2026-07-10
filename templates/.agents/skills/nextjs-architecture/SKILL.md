---
name: nextjs-architecture
description: Design and implement production-ready Next.js App Router features. Use for new routes, layouts, Server Components, Client Components, Server Actions, Route Handlers, data fetching, caching, authentication boundaries, metadata, migrations, or refactors that affect application architecture.
---

# Next.js architecture

Implement the smallest secure, typed, observable vertical slice. Read `references/app-router.md` when the rendering, cache, or server/client boundary is non-obvious.

## Workflow

1. Inspect the route tree, package versions, existing feature boundaries, and data/auth patterns.
2. Select the rendering boundary: Server Component by default; small Client Components only for browser state, events, or browser APIs.
3. Model input and output types. Validate external input at the server boundary and authorize the specific resource/action.
4. Implement reads close to the server consumer; group related writes transactionally; define cache invalidation after mutations.
5. Add route metadata and explicit loading, empty, denied, and error states where relevant.
6. Test behavior at the least costly meaningful layer, then run project quality gates.

## Non-negotiables

- Do not use a client component to access a secret or privileged data source.
- Treat a Server Action, Route Handler, webhook, and middleware as a security boundary, not just a transport choice.
- Do not cache user- or tenant-specific data in a shared response cache.
- Keep `page.tsx` and `layout.tsx` as composition layers; move reusable domain/data code out of the route folder when it clarifies ownership.
- Avoid post-hoc `useEffect` fetching when the data can be rendered on the server.
