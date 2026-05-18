# History

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
