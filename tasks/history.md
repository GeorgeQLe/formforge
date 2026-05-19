# History

## 2026-05-19 — Response analytics dashboard

- Added an owner-scoped `response.analytics` tRPC procedure for a bounded 14-day response analytics range.
- Added deterministic analytics helper coverage for UTC day bucketing, average completion-time math, zero-response output, and stored-submission completion-rate semantics.
- Rendered an analytics section on the response dashboard with daily submission bars, range submission count, completion rate, and average completion time.
- Marked the analytics dashboard task complete and expanded the Theme CRUD task into the next executable plan.

### Ship Manifest

- **User goal:** Execute the next incomplete `$run` step, which was adding a response analytics dashboard.
- **Changed files:** `src/server/responses/analytics.ts`, `src/server/responses/__tests__/analytics.test.ts`, `src/server/trpc/routers/response.ts`, `src/server/trpc/routers/__tests__/response.test.ts`, `src/app/(dashboard)/forms/[id]/responses/page.tsx`, `tasks/todo.md`, `tasks/history.md`.
- **Per-file purpose:** `analytics.ts` centralizes analytics range and metric shaping; `analytics.test.ts` covers date buckets and metric semantics; `response.ts` exposes the owner-scoped analytics procedure; `response.test.ts` asserts the procedure keeps the ownership check before response reads; the response dashboard renders the new analytics; task docs record completion and next work.
- **User-goal mapping:** The source changes add submission counts over time, average completion time, and a clearly defined completion-rate display without adding new tracking infrastructure.
- **Tests run:** `pnpm test src/server/responses/__tests__/analytics.test.ts src/server/trpc/routers/__tests__/response.test.ts` passed: 2 files, 9 tests. `pnpm test` passed: 13 files, 52 tests. `pnpm lint` passed. `pnpm build` compiled successfully and ran TypeScript before failing during prerender on missing Clerk configuration.
- **Skipped tests:** No browser visual smoke test was run because this step uses existing dashboard query/render patterns and the build environment lacks Clerk configuration for dashboard prerender. Full production build completion is blocked by `@clerk/clerk-react: Missing publishableKey` while prerendering `/forms/new`.
- **Warnings:** `pnpm` emitted the existing `.npmrc` warning `Failed to replace env in config: ${NODE_AUTH_TOKEN}` during test, lint, and build commands. `pnpm build` also emitted Next.js's middleware-to-proxy deprecation warning.
- **Adversarial review:** Checked that analytics keeps the same form owner verification pattern as existing response procedures, does not introduce durable view tracking or new tables, uses bounded response reads, and labels completion rate as stored submissions only because started-but-abandoned visits are not tracked.
- **Residual risk:** The analytics UI was validated by lint/typecheck and helper tests rather than a browser screenshot; completion rate remains a placeholder based on stored submissions until a real started/submitted funnel model exists.
- **Rollback note:** Revert the analytics helper and test, the `response.analytics` procedure, the dashboard analytics section, and the two task-doc updates.
- **Next command:** `$run`

## 2026-05-18 — CSV response export hardening

- Extracted CSV response formatting into a deterministic helper used by the existing owner-scoped `response.exportCsv` tRPC mutation.
- Preserved stable CSV headers, proper escaping for commas/quotes/newlines, one row per response, missing field value blanks, and truncation metadata for the existing 10,000-row export cap.
- Changed empty exports to return a header-only CSV instead of an empty string, then marked the CSV export task complete and expanded the analytics dashboard task into the next executable plan.

### Ship Manifest

- **User goal:** Execute the next incomplete `$run` step, which was adding/hardening response CSV export.
- **Changed files:** `src/server/responses/csv-export.ts`, `src/server/trpc/routers/response.ts`, `src/server/trpc/routers/__tests__/response-export.test.ts`, `tasks/todo.md`, `tasks/history.md`.
- **Per-file purpose:** `csv-export.ts` centralizes CSV headers, escaping, row shaping, and truncation metadata; `response.ts` keeps owner-scoped database access and delegates formatting; `response-export.test.ts` covers CSV behavior directly; task docs record completion and the next executable plan.
- **User-goal mapping:** The source changes complete the advertised CSV export path with stable output and focused regression coverage for empty and populated exports.
- **Tests run:** `pnpm test src/server/trpc/routers/__tests__/response-export.test.ts` passed: 1 file, 4 tests. `pnpm test` passed: 12 files, 46 tests. `pnpm lint` passed. `pnpm build` compiled successfully and ran TypeScript before failing during prerender on missing Clerk configuration.
- **Skipped tests:** No browser download smoke test was run because this step targets the server export data contract and the existing UI already invokes `response.exportCsv`; production build completion is blocked by missing Clerk publishable key.
- **Warnings:** `pnpm` emitted the existing `.npmrc` warning `Failed to replace env in config: ${NODE_AUTH_TOKEN}` during test, lint, and build commands. `pnpm build` also emitted Next.js's middleware-to-proxy deprecation warning.
- **Adversarial review:** Checked that auth and form ownership remain in the protected tRPC procedure, empty exports no longer trigger an invalid field-response `IN ()` query, CSV values are escaped according to common CSV rules, and the row cap continues to report `truncated`.
- **Residual risk:** The router export path is covered through the formatting helper and source review rather than a full mocked tRPC database integration test for CSV export.
- **Rollback note:** Revert the CSV helper, the `response.exportCsv` delegation change, the response export test rewrite, and the two task-doc updates.
- **Next command:** `$run`

## 2026-05-18 — Redirect and success-message submission coverage

- Added route-level coverage proving successful public submissions return configured success messages and redirect URLs, with defaults when settings are absent.
- Added static wiring coverage proving the renderer forwards successful submit metadata and the public form client redirects only when a redirect URL is present.
- Marked the redirect-after-submit task complete and expanded the CSV export task into the next executable plan.

### Ship Manifest

- **User goal:** Execute the next incomplete `$run` step, which was honoring `redirectUrl` and `successMessage` settings post-submission.
- **Changed files:** `src/app/api/submit/__tests__/response-settings.test.ts`, `src/app/f/[slug]/__tests__/public-submit-redirect.test.ts`, `tasks/todo.md`, `tasks/history.md`.
- **Per-file purpose:** `response-settings.test.ts` now covers configured and default success response metadata; `public-submit-redirect.test.ts` covers renderer-to-client redirect wiring; task docs record completion and the next executable plan.
- **User-goal mapping:** The tests prove the existing submit route and public client honor the post-submission settings without changing runtime behavior.
- **Tests run:** `pnpm test src/app/api/submit/__tests__/response-settings.test.ts 'src/app/f/[slug]/__tests__/public-submit-redirect.test.ts'` passed: 2 files, 8 tests. `pnpm test` passed: 12 files, 44 tests. `pnpm lint` passed. `pnpm build` compiled successfully and ran TypeScript before failing during prerender on missing Clerk configuration.
- **Skipped tests:** No browser redirect flow was run because the current Vitest setup is node-focused; the route-level tests and static client wiring assertion cover the behavior this step targeted. Full production build completion is blocked by the environment missing Clerk publishable key.
- **Warnings:** `pnpm` emitted the existing `.npmrc` warning `Failed to replace env in config: ${NODE_AUTH_TOKEN}` during test, lint, and build commands. `pnpm build` also emitted Next.js's middleware-to-proxy deprecation warning.
- **Adversarial review:** Checked that redirect metadata is only returned after persistence succeeds, defaults remain stable when settings are absent, and the client only mutates `window.location.href` when the success callback receives a redirect URL.
- **Residual risk:** The browser navigation side effect is covered by source-level wiring rather than a real DOM/browser submission test.
- **Rollback note:** Revert the added redirect tests and the two task-doc updates.
- **Next command:** `$run`

## 2026-05-18 — GDPR consent checkbox rendering

- Added a client-side GDPR consent helper and required consent checkbox for public fill-mode forms when `gdprConsentEnabled` is true.
- Blocked submission locally with a user-facing consent error when required consent is unchecked, without adding consent persistence as a field response.
- Added focused Vitest coverage for consent validation and static renderer wiring, then marked the GDPR consent task complete and expanded the redirect/success-message task into the next execution plan.

### Ship Manifest

- **User goal:** Execute the next incomplete `$run` step, which was rendering and enforcing GDPR consent in the public form renderer.
- **Changed files:** `src/components/form-renderer/gdpr-consent.ts`, `src/components/form-renderer/form-renderer.tsx`, `src/components/form-renderer/__tests__/gdpr-consent.test.ts`, `tasks/todo.md`, `tasks/history.md`.
- **Per-file purpose:** `gdpr-consent.ts` centralizes consent validation; `form-renderer.tsx` renders the required checkbox and blocks submit when consent is missing; the test file covers helper behavior and renderer wiring; task docs record completion and the next executable plan.
- **User-goal mapping:** The source change directly renders the consent checkbox from the form setting and prevents public submissions until the respondent accepts it.
- **Tests run:** `pnpm test src/components/form-renderer/__tests__/gdpr-consent.test.ts` passed: 1 file, 4 tests. `pnpm test` passed: 11 files, 40 tests. `pnpm lint` passed. `pnpm build` compiled successfully and ran TypeScript before failing during prerender on missing Clerk configuration.
- **Skipped tests:** No browser/component submission flow was run because the current Vitest setup is node-focused; the helper test plus static wiring assertion cover the consent decision and renderer connection. Full production build completion is blocked by the environment missing Clerk publishable key.
- **Warnings:** `pnpm` emitted the existing `.npmrc` warning `Failed to replace env in config: ${NODE_AUTH_TOKEN}` during test, lint, and build commands. `pnpm build` also emitted Next.js's middleware-to-proxy deprecation warning.
- **Adversarial review:** Checked that consent is required only for `mode === "fill"` with `gdprConsentEnabled === true`, that preview/readonly modes stay unchanged, and that consent is not persisted as a field response without a schema-backed form-level audit record.
- **Residual risk:** The checkbox UI was validated by source-level tests and lint/build type checks rather than a browser interaction test, so DOM event behavior still depends on React runtime behavior.
- **Rollback note:** Revert the consent helper, renderer checkbox/state changes, consent test file, and the two task-doc updates.
- **Next command:** `$run`

## 2026-05-18 — Response limit and close date submission coverage

- Added route-level submit endpoint coverage for response-limit and close-date settings.
- Verified submissions below the response limit and before the close date are stored, while limit-reached and closed-form submissions return user-facing `400` responses without inserting responses.
- Marked the response-limits task complete and expanded the next GDPR consent task into a fresh-session implementation plan.

### Ship Manifest

- **User goal:** Execute the next incomplete `$run` step, which was hardening response-limit and close-date enforcement for public form submissions.
- **Changed files:** `src/app/api/submit/__tests__/response-settings.test.ts`, `tasks/todo.md`, `tasks/history.md`.
- **Per-file purpose:** The new route test file mocks Turnstile and database boundaries to cover accepted/rejected submission settings behavior; `tasks/todo.md` records completion and the next executable plan; `tasks/history.md` records the ship boundary.
- **User-goal mapping:** The test coverage directly proves the existing submit route enforces `responseLimit` and `closeDate` before persistence on rejected submissions.
- **Tests run:** `pnpm test src/app/api/submit/__tests__/response-settings.test.ts` passed: 1 file, 4 tests. `pnpm test` passed: 10 files, 36 tests. `pnpm lint` passed. `pnpm build` compiled successfully and ran TypeScript before failing during prerender on missing Clerk configuration.
- **Skipped tests:** No browser submission flow was run because this step targets server route behavior and the route-level mocked database test covers the acceptance/rejection branches. Full production build completion is blocked by the environment missing Clerk publishable key.
- **Warnings:** `pnpm` emitted the existing `.npmrc` warning `Failed to replace env in config: ${NODE_AUTH_TOKEN}` during test, lint, and build commands. `pnpm build` also emitted Next.js's middleware-to-proxy deprecation warning.
- **Adversarial review:** Checked that rejected settings branches stop before field loading and persistence, and that accepted branches still reach both `formResponses` and `fieldResponses` inserts.
- **Residual risk:** The database is mocked, so the tests validate route decision order and persistence intent rather than real Drizzle SQL execution.
- **Rollback note:** Remove `src/app/api/submit/__tests__/response-settings.test.ts` and revert the two task-doc updates.
- **Next command:** `$run`

## 2026-05-18 — Server-side Turnstile submission validation

- Added a server-side Turnstile helper that extracts submitted tokens, reads the secret through `getEnv()`, posts verification requests to Cloudflare, and returns deterministic boolean results for tests.
- Updated the public submit route to reject missing or failed Turnstile verification with user-facing `400` responses before loading or storing form submissions.
- Replaced static Turnstile route assertions with mocked-fetch unit coverage for missing tokens, failed verification, successful verification, remote IP forwarding, and Cloudflare request failures.
- Marked the form submission validation task complete.

### Ship Manifest

- **User goal:** Execute the next incomplete `$run` step, which was wiring server-side Turnstile verification into the submit route.
- **Changed files:** `src/server/security/turnstile.ts`, `src/app/api/submit/[slug]/route.ts`, `src/app/api/submit/__tests__/turnstile.test.ts`, `tasks/todo.md`, `tasks/history.md`.
- **Per-file purpose:** `turnstile.ts` centralizes token extraction and Cloudflare verification; the submit route enforces bot verification before accepting submissions; the Turnstile test file covers missing-token and mocked verification behavior; task docs record completion and the next executable item.
- **User-goal mapping:** The source changes directly enforce the posted Turnstile token on public submissions and prevent missing or failed tokens from reaching submission persistence.
- **Tests run:** `pnpm test src/app/api/submit/__tests__/turnstile.test.ts` passed: 1 file, 5 tests. `pnpm test` passed: 9 files, 32 tests. `pnpm lint` passed. `pnpm build` compiled successfully and type-checked before failing during prerender on missing Clerk configuration.
- **Skipped tests:** No browser submission flow was run because this step is covered at the server helper boundary and the build environment lacks a Clerk publishable key. The build blocker was `@clerk/clerk-react: Missing publishableKey` while prerendering `/forms/new`.
- **Warnings:** `pnpm` emitted the existing `.npmrc` warning `Failed to replace env in config: ${NODE_AUTH_TOKEN}` during test, lint, and build commands. `pnpm build` also emitted Next.js's middleware-to-proxy deprecation warning.
- **Adversarial review:** Checked the previous bypass where absent `_turnstileToken` skipped verification, verified the route now exits before database work on missing or failed tokens, and kept Cloudflare calls injectable so tests cannot accidentally hit the network.
- **Residual risk:** Route-level persistence behavior is not exercised with a mocked database in this change; coverage focuses on the new verification helper and the route gate relies on compile/lint validation.
- **Rollback note:** Revert `src/server/security/turnstile.ts`, the submit route Turnstile gate/import changes, the updated Turnstile tests, and the task-doc entries.
- **Next command:** `$run`

## 2026-05-18 — Error boundaries and tRPC error formatting

- Added App Router error boundaries for the root app, dashboard routes, and public form route with retry and safe navigation actions.
- Added normalized tRPC error formatting so clients receive user-facing messages, while Zod `BAD_REQUEST` validation details remain available in the error payload.
- Added unit coverage for the tRPC error formatter and marked the error-handling task complete.

### Ship Manifest

- **User goal:** Execute the next incomplete `$run` step, which was the high-priority error-handling task.
- **Changed files:** `src/app/error.tsx`, `src/app/(dashboard)/error.tsx`, `src/app/f/[slug]/error.tsx`, `src/server/trpc/error-formatting.ts`, `src/server/trpc/trpc.ts`, `src/server/trpc/__tests__/error-formatting.test.ts`, `tasks/todo.md`, `tasks/history.md`.
- **Per-file purpose:** Error boundary files provide user-facing fallback UI; `error-formatting.ts` centralizes tRPC response shaping; `trpc.ts` wires the formatter into tRPC; the formatter test covers masking and validation details; task docs record completion and the next executable step.
- **User-goal mapping:** The source changes directly add global/dashboard/public form error handling and normalized tRPC error responses requested by the selected task.
- **Tests run:** `pnpm test` passed: 9 test files, 29 tests. `pnpm lint` passed. `pnpm build` compiled successfully and then failed during prerender on missing Clerk configuration.
- **Skipped tests:** No additional browser/component harness was added because the current Vitest setup is node-focused and the error boundary behavior is framework-driven. `pnpm build` could not complete because Clerk has no publishable key configured in this environment: `@clerk/clerk-react: Missing publishableKey`.
- **Adversarial review:** Checked that unexpected tRPC messages are masked, known client errors map to safe messages, and Zod validation details are preserved only for `BAD_REQUEST`. Also verified the error boundaries use the existing UI primitives without changing shared button behavior.
- **Residual risk:** Error boundary rendering was validated by compile/lint rather than an end-to-end browser render because the production build is blocked by missing Clerk env.
- **Rollback note:** Revert the three error boundary files, `src/server/trpc/error-formatting.ts`, the formatter test, and the `trpc.ts` formatter hook.
- **Next command:** `$run`

## 2026-05-18 — Testing coverage for validation and routers

- Added field validation unit tests for text constraints, optional values, email, number, date, rating, file URL validation, choice options, checkbox selections, and full-form schemas.
- Added tRPC caller-level integration tests covering protected auth rejection, public slug lookup, form creation, free-plan form limits, update input validation, field sort ordering, and field ownership failures.
- Marked the testing task complete and expanded the next error-handling task into a fresh-session implementation plan.

### Ship Manifest

- **User goal:** Execute the next incomplete `$run` step, which was the high-priority testing task.
- **Changed files:** `src/lib/__tests__/field-types.test.ts`, `src/server/trpc/routers/__tests__/integration.test.ts`, `tasks/todo.md`, `tasks/history.md`.
- **Per-file purpose:** `field-types.test.ts` validates field-level and form-level schemas; `integration.test.ts` exercises tRPC procedures through `appRouter.createCaller` with a narrow in-memory DB mock; `tasks/todo.md` records task completion and next-step details; `tasks/history.md` records the ship boundary.
- **User-goal mapping:** The new tests directly cover field validation logic and tRPC router behavior requested by the completed task.
- **Tests run:** `pnpm test` passed: 8 test files, 26 tests. `pnpm lint` passed.
- **Skipped tests:** `pnpm build` was attempted and compiled successfully, but prerendering failed because Clerk has no `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`/publishable key configured for the dashboard route. This is an environment blocker rather than a source or type failure.
- **Adversarial review:** Reviewed the new tests for false positives: field tests call real validators, and router tests call real tRPC procedures rather than static source checks. The DB mock is intentionally narrow and should not be reused as broad persistence proof.
- **Residual risk:** Router integration tests do not exercise real Drizzle SQL generation or a real Postgres database. They validate procedure wiring, auth middleware behavior, input parsing, and expected router decisions.
- **Rollback note:** Remove the two new test files and revert the two task-doc updates.
- **Next command:** `$run`
