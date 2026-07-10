# Verification reference

Use a unit test when input/output logic can be isolated. Use an integration test for validation, authorization, persistence, cache invalidation, and handler/action behavior. Use a browser test for navigation, form submission, focus management, client hydration, and a high-value end-to-end flow.

`next build` is a release gate, not merely a compilation check: it surfaces route rendering, server/client boundary, environment, and static-generation problems. A passing development server does not replace it.

Test the expected failure paths introduced by a change. Assert visible outcomes and stable contracts rather than implementation details.
