# History

## 2026-05-20 — Public form i18n prototype

- Added a local English/Spanish i18n catalog for public form system copy and validation messages.
- Localized the public form renderer, GDPR consent copy/error, submit states, network/submission errors, success heading/default success message, and submit-route system errors.
- Threaded a non-durable locale through public `?locale=`/`?lang=` query params and the `_locale` submit payload without adding storage, middleware, or translated custom label infrastructure.
- Marked the i18n task complete and expanded the next webhook integrations item into a prototype-first plan.

### Ship Manifest

- **User goal:** Execute the next incomplete `$run` step, which was adding multi-language support for public form labels and validation messages without introducing full i18n infrastructure.
- **Changed files:** `src/lib/i18n.ts`, `src/lib/__tests__/i18n.test.ts`, `src/lib/field-types.ts`, `src/components/form-renderer/form-renderer.tsx`, `src/components/form-renderer/gdpr-consent.ts`, `src/components/form-renderer/__tests__/gdpr-consent.test.ts`, `src/app/f/[slug]/page.tsx`, `src/app/f/[slug]/client.tsx`, `src/app/f/[slug]/__tests__/public-submit-redirect.test.ts`, `src/app/api/submit/[slug]/route.ts`, `src/app/api/submit/__tests__/i18n.test.ts`, `src/app/api/submit/__tests__/rate-limit.test.ts`, `tasks/todo.md`, `tasks/history.md`.
- **Per-file purpose:** The i18n helper defines supported locales, fallback resolution, and message lookup; field validation uses localized Zod messages; the renderer and GDPR helper use catalog copy; the public page/client pass a query-derived locale; the submit route returns localized system/validation responses; tests cover fallback behavior, translated validation, and source wiring; task docs record completion and next work.
- **User-goal mapping:** Public respondents can now see FormForge-owned system copy and validation errors in English or Spanish through a local prototype path while user-authored labels/options remain unchanged until a durable translation model exists.
- **Tests run:** `pnpm test src/lib/__tests__/i18n.test.ts src/components/form-renderer/__tests__/gdpr-consent.test.ts src/app/api/submit/__tests__/i18n.test.ts` passed: 3 files, 10 tests. `pnpm test` passed: 26 files, 102 tests. `pnpm lint` passed. Bare `pnpm build` failed early on project-owned missing public env validation. `pnpm build` with local dummy public build env passed after network access was approved for Google Fonts.
- **Skipped tests:** No browser locale smoke test was run because the step is covered by helper/static tests, lint, and production build; translated custom field labels/options were intentionally deferred because there is no existing durable translation schema.
- **Warnings:** `pnpm` emitted the existing `.npmrc` warning `Failed to replace env in config: ${NODE_AUTH_TOKEN}` during test, lint, and build commands. Build emitted Next.js's existing middleware-to-proxy deprecation warning.
- **Adversarial review:** Checked that the implementation does not add locale middleware, database tables, paid translation services, or provider-specific infrastructure; server-side validation uses the same locale as the submitted renderer payload; unsupported locales fall back to English.
- **Residual risk:** Locale selection is query/body based and not persisted per form; user-authored labels, help text, options, notification emails, dashboard authoring UI, and locale-aware URLs remain deferred.
- **Rollback note:** Revert the i18n helper/tests, localized validator functions, renderer/GDPR/page/client/submit-route wiring, updated static tests, and task-doc entries.
- **Next command:** `$run`

## 2026-05-19 — Form renderer accessibility audit

- Added shared accessible description ID helpers for form field help/error wiring.
- Connected help text and validation errors with `aria-describedby` across text, email, number, textarea, dropdown, date, file upload, radio, checkbox, and rating fields.
- Improved grouped control semantics for choice/rating inputs, made file upload keyboard-accessible through the native file input, and announced submit success/error states with live regions.
- Marked the Accessibility audit task complete and expanded the next i18n item into an executable prototype-first plan.

### Ship Manifest

- **User goal:** Execute the next incomplete `$run` step, which was auditing the public form renderer for WCAG 2.1 AA-oriented source-level accessibility gaps.
- **Changed files:** `src/components/form-renderer/accessibility.ts`, `src/components/form-renderer/__tests__/accessibility.test.ts`, `src/components/form-renderer/form-renderer.tsx`, all field components under `src/components/form-renderer/fields/`, `tasks/todo.md`, `tasks/history.md`.
- **Per-file purpose:** The helper centralizes stable help/error IDs and `aria-describedby` composition; the test file locks the accessibility contract; the renderer announces submit states and GDPR consent errors; field components expose labels, help text, invalid state, grouped semantics, and keyboard-accessible upload behavior; task docs record completion and next work.
- **User-goal mapping:** Public form respondents now get stronger accessible names/descriptions, error associations, grouped control context, native keyboard file selection, and live submit feedback without a renderer redesign.
- **Tests run:** `pnpm test src/components/form-renderer/__tests__/accessibility.test.ts` passed: 1 file, 4 tests. `pnpm test` passed: 24 files, 96 tests. `pnpm lint` passed after removing unsupported ARIA attributes. `pnpm build` failed before compilation on project-owned public env validation because `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_APP_URL`, and `NEXT_PUBLIC_TURNSTILE_SITE_KEY` are unset.
- **Skipped tests:** Full production build completion is blocked by missing required public build env vars. No browser/screen-reader audit was run because the task explicitly started with source-level WCAG fixes and focused static assertions before adding new browser accessibility tooling.
- **Warnings:** `pnpm` emitted the existing `.npmrc` warning `Failed to replace env in config: ${NODE_AUTH_TOKEN}` during test, lint, and build commands.
- **Adversarial review:** Checked lint output for unsupported ARIA usage and corrected it instead of accepting warnings. Reviewed the final diff for overreach and kept changes scoped to the public renderer/fields plus task docs, with no new dependencies or storage/auth changes.
- **Residual risk:** Static/source tests cannot prove full WCAG 2.1 AA compliance or real assistive-technology behavior; a later browser accessibility pass with axe/manual keyboard and screen-reader checks is still needed before making a formal compliance claim.
- **Rollback note:** Revert the accessibility helper/test, renderer live-region/GDPR ARIA changes, field component ARIA/file-upload changes, and task-doc entries.
- **Next command:** `$run`

## 2026-05-19 — Form versioning

- Added immutable published form snapshots through `formVersions`, including form metadata, settings, theme reference, and ordered field definitions.
- Updated publish to create an incrementing version snapshot while draft edits continue to use mutable `forms` and `formFields`.
- Updated public rendering and submission to use the published version snapshot, submit `_formVersionId`, validate against the submitted snapshot, and store `formVersionId` on accepted responses.
- Marked the Form versioning task complete and expanded the next Accessibility audit item into an executable plan.

### Ship Manifest

- **User goal:** Execute the next incomplete `$run` step, which was tracking published versions so field changes do not break in-progress submissions.
- **Changed files:** `src/server/db/schema.ts`, `src/server/forms/versioning.ts`, `src/server/forms/__tests__/versioning.test.ts`, `src/server/trpc/routers/form.ts`, `src/server/trpc/routers/__tests__/integration.test.ts`, `src/app/f/[slug]/page.tsx`, `src/app/f/[slug]/client.tsx`, `src/app/f/[slug]/__tests__/public-submit-redirect.test.ts`, `src/components/form-renderer/form-renderer.tsx`, `src/app/api/submit/[slug]/route.ts`, `src/app/api/submit/__tests__/response-settings.test.ts`, `tasks/todo.md`, `tasks/history.md`.
- **Per-file purpose:** Schema adds version storage and response references; versioning helper creates deterministic snapshots; form router creates snapshots on publish; public page/client/renderer render and submit version IDs; submit route validates and persists against the snapshot; tests cover helper, publish, render wiring, and submit behavior; task docs record completion and next work.
- **User-goal mapping:** Published respondents now use immutable title/settings/theme/field snapshots, and accepted responses are tied to the exact version used for validation, so later field edits do not change an already-rendered submission contract.
- **Tests run:** `pnpm test src/server/forms/__tests__/versioning.test.ts src/server/trpc/routers/__tests__/integration.test.ts src/app/api/submit/__tests__/response-settings.test.ts 'src/app/f/[slug]/__tests__/public-submit-redirect.test.ts'` passed: 4 files, 22 tests. `pnpm test` passed: 23 files, 92 tests. `pnpm lint` passed. `pnpm build` with dummy public build env compiled successfully and ran TypeScript, then failed during prerender on Clerk rejecting `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_dummy`.
- **Skipped tests:** Full production build completion is blocked without a real Clerk publishable key for dashboard prerendering. No browser smoke test was run because this step changes server/schema/public-render contracts and is covered by Vitest plus TypeScript/lint; authenticated browser access remains Clerk-gated.
- **Warnings:** `pnpm` emitted the existing `.npmrc` warning `Failed to replace env in config: ${NODE_AUTH_TOKEN}`. `pnpm build` emitted Next.js's existing middleware-to-proxy deprecation warning.
- **Adversarial review:** Corrected the first implementation so public title/settings/theme and submit success/close/notification behavior come from the immutable version snapshot, not the mutable form record. Confirmed the submit route scopes submitted version IDs to the live form before validation and stores the chosen version ID on the response.
- **Residual risk:** The repo does not currently track Drizzle migration files, so the schema change still requires the existing target-environment `pnpm db:push` workflow before deployment. Version creation and form status update are not wrapped in an explicit transaction.
- **Rollback note:** Revert the version schema/relation changes, versioning helper/tests, publish snapshot creation, public render/submit version wiring, response-settings test updates, and task-doc entries.
- **Next command:** `$run`

## 2026-05-19 — API access design prototype

- Added a protected dashboard experiment at `/experiments/api-access` for calibrating API key creation, scope selection, request examples, and response/error expectations.
- Kept the prototype fixture/local-state only and documented deferred API infrastructure in the UI.
- Updated the Experiments sidebar link plus helper/static tests proving local-only behavior and isolation from database, tRPC, Clerk, billing, generated secrets, and real API routes.
- Marked the API access prototype complete and expanded the next form-versioning item into a durable-schema implementation plan.

### Ship Manifest

- **User goal:** Execute the next incomplete `$run` step, which was a prototype-first API access workflow without durable API key or public endpoint infrastructure.
- **Changed files:** `src/app/(dashboard)/experiments/api-access/page.tsx`, `src/app/(dashboard)/experiments/api-access/api-access-prototype.ts`, `src/app/(dashboard)/experiments/api-access/__tests__/api-access-prototype.test.ts`, `src/components/dashboard/sidebar.tsx`, `tasks/todo.md`, `tasks/history.md`.
- **Per-file purpose:** The experiment page provides the clickable local-state developer workflow; the helper file centralizes fixtures, scope labels, key masking, request samples, and response previews; the test file covers helper behavior and source isolation; the sidebar exposes the API experiment; task docs record completion and the next executable plan.
- **User-goal mapping:** The change lets the product team evaluate Business-plan API access concepts before adding key hashing/storage, token issuance, billing authorization, public endpoint versioning, durable rate limits, audit logs, webhook signatures, or developer docs.
- **Tests run:** `pnpm test 'src/app/(dashboard)/experiments/api-access/__tests__/api-access-prototype.test.ts'` passed: 1 file, 5 tests. `pnpm test` passed: 22 files, 88 tests. `pnpm lint` passed. `pnpm build` with syntactically valid dummy public build env passed and prerendered `/experiments/api-access`.
- **Skipped tests:** A full authenticated browser interaction smoke was not completed because the dashboard route is protected by Clerk middleware and unauthenticated local HTTP access rewrites to Clerk's signed-out flow. A local dev HTTP check reached the protected route and confirmed the middleware gate rather than a source compile/runtime error.
- **Warnings:** `pnpm` emitted the existing `.npmrc` warning `Failed to replace env in config: ${NODE_AUTH_TOKEN}`. `pnpm build` emitted Next.js's existing middleware-to-proxy deprecation warning. The first sandboxed build failed only because network access to Google Fonts was blocked; the network-approved build passed.
- **Adversarial review:** Confirmed the experiment imports no database, tRPC, Clerk, or billing modules, calls no `/api/` route, generates no real secrets, and uses only fixture data plus React local state for key drafts, scope changes, and response/error previews.
- **Residual risk:** Interaction behavior was validated by helper/static tests, production build, and unauthenticated route reachability rather than a signed-in browser session; visual polish and authenticated click behavior should be reviewed manually before stakeholder feedback.
- **Rollback note:** Remove the API-access experiment directory, revert the sidebar Experiments link, and revert the task-doc entries.
- **Next command:** `$run`

## 2026-05-19 — Team collaboration prototype

- Added a protected dashboard experiment at `/experiments/team-collaboration` for calibrating member invites, role changes, removals, and form-sharing expectations.
- Kept the prototype fixture/local-state only and documented deferred team infrastructure in the UI.
- Added an Experiments sidebar link plus helper/static tests proving local-only behavior and isolation from database, tRPC, Clerk, and billing imports.
- Marked the team collaboration prototype complete and expanded the next API-access item into a prototype-first plan.

### Ship Manifest

- **User goal:** Execute the next incomplete `$run` step, which was a prototype-first team/collaboration workflow without durable infrastructure.
- **Changed files:** `src/app/(dashboard)/experiments/team-collaboration/page.tsx`, `src/app/(dashboard)/experiments/team-collaboration/team-collaboration-prototype.ts`, `src/app/(dashboard)/experiments/team-collaboration/__tests__/team-collaboration-prototype.test.ts`, `src/components/dashboard/sidebar.tsx`, `tasks/todo.md`, `tasks/history.md`.
- **Per-file purpose:** The experiment page provides the clickable local-state workflow; the helper file centralizes fixtures, role labels, invite validation, and access descriptions; the test file covers helper behavior and source isolation; the sidebar exposes the experiment; task docs record completion and the next executable plan.
- **User-goal mapping:** The change lets the product team evaluate Business-plan collaboration concepts before adding team schema, invitations, multi-tenant auth, seat billing, audit logs, or email delivery.
- **Tests run:** `pnpm test 'src/app/(dashboard)/experiments/team-collaboration/__tests__/team-collaboration-prototype.test.ts'` passed: 1 file, 4 tests. `pnpm test` passed: 21 files, 83 tests. `pnpm lint` passed. `pnpm build` with required public build env passed and prerendered `/experiments/team-collaboration`.
- **Skipped tests:** A full authenticated browser interaction smoke was not completed because the dashboard route is protected by Clerk middleware and unauthenticated local HTTP access rewrites to Clerk's signed-out flow. Production build and source-level local-only checks cover compile/renderability and infrastructure isolation for this prototype.
- **Warnings:** `pnpm` emitted the existing `.npmrc` warning `Failed to replace env in config: ${NODE_AUTH_TOKEN}`. `pnpm build` emitted Next.js's existing middleware-to-proxy deprecation warning.
- **Adversarial review:** Confirmed the experiment imports no database, tRPC, Clerk, or billing modules, performs no persistence, and uses only fixture data plus React local state for invite, role, and removal interactions.
- **Residual risk:** Interaction behavior was validated by helper/static tests and production build rather than a signed-in browser session; visual polish and authenticated click behavior should be reviewed manually before using the prototype for stakeholder feedback.
- **Rollback note:** Remove the team-collaboration experiment directory, revert the sidebar Experiments link, and revert the task-doc entries.
- **Next command:** `$run`

## 2026-05-19 — Build-time environment validation

- Split environment validation into build-time public variable checks and full lazy runtime secret validation.
- Wired `next.config.ts` to fail early with a FormForge-owned build error when required public build variables are missing or invalid.
- Added focused Vitest coverage for build/runtime env validation and expanded the next team-collaboration task into a prototype-first plan.

### Ship Manifest

- **User goal:** Execute the next incomplete `$run` step, which was adding build-time env validation while preserving lazy runtime secret validation.
- **Changed files:** `src/env.ts`, `next.config.ts`, `src/__tests__/env.test.ts`, `tasks/todo.md`, `tasks/history.md`.
- **Per-file purpose:** `src/env.ts` defines separate build/runtime schemas and reusable validators; `next.config.ts` invokes the build validator before Next compilation; `env.test.ts` covers success and failure messages; task docs record completion and the next executable plan.
- **User-goal mapping:** The build now fails through project-owned validation before Clerk prerender errors when required public build variables are missing, while server-only secrets remain lazily checked at runtime.
- **Tests run:** `pnpm test` passed: 20 files, 79 tests. `pnpm lint` passed. `pnpm build` without env failed as expected with `FormForge build environment validation failed`. `pnpm build` with syntactically valid local public build env passed.
- **Skipped tests:** No browser smoke test was run because this step changes build/env validation and has executable coverage through Vitest, lint, and production build.
- **Warnings:** `pnpm` emitted the existing `.npmrc` warning `Failed to replace env in config: ${NODE_AUTH_TOKEN}`. `pnpm build` emitted Next.js's existing middleware-to-proxy deprecation warning.
- **Adversarial review:** Checked that build validation includes only public build variables, so database, Stripe secret, Resend, OpenAI, Turnstile secret, and AWS secrets are not forced during compile/prerender. Confirmed full runtime validation still rejects missing server secrets through `getEnv()`.
- **Residual risk:** A syntactically valid local Clerk publishable key proves the build pipeline, but it does not authenticate against a real Clerk instance.
- **Rollback note:** Revert the env validator split, the `next.config.ts` validation call, the env test file, and the task-doc entries.
- **Next command:** `$run`

## 2026-05-19 — Public and AI rate limiting

- Extracted public endpoint throttling into a reusable in-memory rate-limit helper with injectable store and clock support.
- Applied a 10 requests/minute form+IP limit to public submissions before Turnstile, validation, and persistence work.
- Applied a 5 requests/minute user-scoped limit to authenticated AI form generation before prompt parsing and OpenAI generation.
- Replaced placeholder rate-limit assertions with helper coverage and route wiring checks, then marked the rate-limiting task complete and expanded the env-validation task into the next executable plan.

### Ship Manifest

- **User goal:** Execute the next incomplete `$run` step, which was adding rate limits to public submission and AI generation endpoints.
- **Changed files:** `src/server/security/rate-limit.ts`, `src/server/security/__tests__/rate-limit.test.ts`, `src/app/api/submit/[slug]/route.ts`, `src/app/api/submit/__tests__/rate-limit.test.ts`, `src/app/api/ai/generate/route.ts`, `src/app/api/ai/generate/__tests__/rate-limit.test.ts`, `tasks/todo.md`, `tasks/history.md`.
- **Per-file purpose:** The rate-limit helper centralizes fixed-window throttling and client IP extraction; submit and AI routes enforce endpoint-specific limits; tests cover helper behavior and route ordering; task docs record completion and next work.
- **User-goal mapping:** The source changes prevent rapid repeat public submissions by form/IP and rapid repeat AI generation by authenticated user before expensive or persistent work runs.
- **Tests run:** `pnpm test src/server/security/__tests__/rate-limit.test.ts src/app/api/submit/__tests__/rate-limit.test.ts src/app/api/ai/generate/__tests__/rate-limit.test.ts` passed: 3 files, 9 tests. `pnpm test` passed: 19 files, 76 tests. `pnpm lint` passed. `pnpm build` compiled successfully and ran TypeScript before failing during prerender on missing Clerk configuration.
- **Skipped tests:** Full production build completion is blocked by `@clerk/clerk-react: Missing publishableKey` while prerendering `/forms/new`. No browser smoke test was run because this step changes server route gates and is covered by helper and static route-order tests.
- **Warnings:** `pnpm` emitted the existing `.npmrc` warning `Failed to replace env in config: ${NODE_AUTH_TOKEN}` during test, lint, and build commands. `pnpm build` emitted Next.js's middleware-to-proxy deprecation warning.
- **Adversarial review:** Checked that public submit throttling is keyed by both slug and client IP so one form/IP pair cannot exhaust unrelated form limits, that AI throttling uses the authenticated app user id, and that 429 responses occur before request body parsing, Turnstile verification, persistence, or OpenAI work.
- **Residual risk:** The limiter uses per-process memory, so limits reset on server restart and do not coordinate across multiple instances. A durable store such as Redis or Upstash is still needed before relying on these limits as production-grade abuse protection.
- **Rollback note:** Revert the shared rate-limit helper, route imports/checks, new/updated rate-limit tests, and task-doc updates.
- **Next command:** `$run`

## 2026-05-19 — AI form regeneration

- Added reusable AI form-definition generation so existing forms can be regenerated from an edited prompt plus current form context.
- Added an owner-scoped `form.regenerateWithAI` mutation that updates the form title/description, replaces the current fields, and resolves generated conditional-logic label hints to new field IDs.
- Added a regeneration action in the form editor with explicit replacement confirmation and cache refresh after the new field set is returned.
- Added regression coverage for conditional-logic mapping, router replacement behavior, and editor wiring, then marked the AI regeneration task complete and expanded the Rate limiting task into the next executable plan.

### Ship Manifest

- **User goal:** Execute the next incomplete `$run` step, which was allowing users to edit a generated form prompt and re-run AI.
- **Changed files:** `src/server/ai/generate-form.ts`, `src/server/ai/__tests__/generate-form.test.ts`, `src/server/trpc/routers/form.ts`, `src/server/trpc/routers/__tests__/integration.test.ts`, `src/app/(dashboard)/forms/[id]/edit/page.tsx`, `src/app/(dashboard)/forms/[id]/edit/__tests__/ai-regeneration.test.ts`, `tasks/todo.md`, `tasks/history.md`.
- **Per-file purpose:** The AI helper now supports reusable form-definition generation and conditional-logic resolution; the form router exposes authenticated regeneration and field replacement; the editor page adds prompt entry and explicit replacement confirmation; tests cover helper, router, and UI wiring; task docs record completion and the next plan.
- **User-goal mapping:** The source changes let an owner open an existing form, enter a revised prompt, confirm replacement, regenerate the AI field set, and continue editing the updated form.
- **Tests run:** `pnpm test src/server/ai/__tests__/generate-form.test.ts src/server/trpc/routers/__tests__/integration.test.ts 'src/app/(dashboard)/forms/[id]/edit/__tests__/ai-regeneration.test.ts'` passed: 3 files, 14 tests. `pnpm test` passed: 17 files, 69 tests. `pnpm lint` passed. `pnpm build` compiled successfully and ran TypeScript before failing during prerender on missing Clerk configuration.
- **Skipped tests:** Full production build completion is blocked by `@clerk/clerk-react: Missing publishableKey` while prerendering `/forms/new`. No browser smoke test was run because the current validation environment cannot complete the Clerk-backed dashboard build; editor wiring is covered by static source tests and TypeScript.
- **Warnings:** `pnpm` emitted the existing `.npmrc` warning `Failed to replace env in config: ${NODE_AUTH_TOKEN}` during test, lint, and build commands. `pnpm build` emitted Next.js's middleware-to-proxy deprecation warning.
- **Adversarial review:** Checked that regeneration verifies form ownership before reading fields or calling AI, sends current form context to the generation prompt, requires explicit UI confirmation before replacing fields, resets editor state from the returned server result, and resolves conditional logic against newly inserted field IDs.
- **Residual risk:** Field replacement is implemented as sequential update/delete/insert operations rather than an explicit database transaction; an interrupted regeneration could leave partial field state until transactional support is added. Existing responses keep field label snapshots, but old field IDs will not be used for new submissions after replacement.
- **Rollback note:** Revert the AI helper extraction, `form.regenerateWithAI` mutation, editor regeneration dialog, new tests, and task-doc updates.
- **Next command:** `$run`

## 2026-05-19 — Form duplication

- Added an owner-scoped `form.duplicate` tRPC mutation that reuses plan-limit enforcement, creates a draft copy with a fresh slug, and clones ordered fields without copying responses.
- Added a duplicate action to dashboard form cards that invalidates the form list and routes to the copied form editor.
- Added regression coverage for draft-copy metadata, field copying, and free-plan limit rejection.
- Marked the Form duplication task complete and expanded AI regeneration into the next executable plan.

### Ship Manifest

- **User goal:** Execute the next incomplete `$run` step, which was cloning an existing form with all fields.
- **Changed files:** `src/server/trpc/routers/form.ts`, `src/app/(dashboard)/dashboard/page.tsx`, `src/server/trpc/routers/__tests__/integration.test.ts`, `tasks/todo.md`, `tasks/history.md`.
- **Per-file purpose:** `form.ts` adds shared form-limit enforcement and the duplicate mutation; the dashboard page exposes the duplicate action; the integration test mock now supports bulk field inserts and covers duplicate behavior; task docs record completion and next work.
- **User-goal mapping:** The source changes let authenticated owners clone a form, preserve form settings/theme/fields, reset the new form to draft, and avoid copying responses.
- **Tests run:** `pnpm test src/server/trpc/routers/__tests__/integration.test.ts` passed: 1 file, 9 tests. `pnpm test` passed: 15 files, 64 tests. `pnpm lint` passed. `pnpm build` compiled successfully and ran TypeScript before failing during prerender on missing Clerk configuration.
- **Skipped tests:** Full production build completion is blocked by `@clerk/clerk-react: Missing publishableKey` while prerendering `/forms/new`. No browser click smoke test was run because the dashboard action is covered by compile/lint and the router behavior is covered by caller-level tests.
- **Warnings:** `pnpm` emitted the existing `.npmrc` warning `Failed to replace env in config: ${NODE_AUTH_TOKEN}` during test, lint, and build commands. `pnpm build` emitted Next.js's middleware-to-proxy deprecation warning.
- **Adversarial review:** Checked that the mutation verifies source ownership before cloning, enforces the same form count limit as create, writes `status: "draft"`, copies fields in ascending sort order, and has no path that reads or writes response tables.
- **Residual risk:** The duplicate persistence behavior is covered with the project’s in-memory Drizzle-style mock rather than a real Postgres transaction; a mid-clone field insert failure could leave a copied form without fields until a transaction is added.
- **Rollback note:** Revert the duplicate mutation/form-limit helper, dashboard duplicate action, integration test additions, and task-doc updates.
- **Next command:** `$run`

## 2026-05-19 — Theme CRUD

- Added owner-scoped theme CRUD through a new `theme` tRPC router.
- Added nullable `themes.userId` ownership in the schema so custom themes can be scoped to the authenticated user while system themes remain global/read-only.
- Built a `/themes` dashboard page for creating, editing, duplicating, previewing, and deleting custom themes, plus sidebar navigation.
- Added validation and source-level regression coverage for theme color tokens, router registration/scoping, delete-with-references behavior, and dashboard wiring.
- Marked the Theme CRUD task complete and expanded Form duplication into the next executable plan.

### Ship Manifest

- **User goal:** Execute the next incomplete `$run` step, which was adding Theme CRUD.
- **Changed files:** `src/server/db/schema.ts`, `src/server/themes/validation.ts`, `src/server/themes/__tests__/validation.test.ts`, `src/server/trpc/routers/theme.ts`, `src/server/trpc/routers/_app.ts`, `src/server/trpc/routers/__tests__/theme.test.ts`, `src/app/(dashboard)/themes/page.tsx`, `src/components/dashboard/sidebar.tsx`, `tasks/todo.md`, `tasks/history.md`.
- **Per-file purpose:** `schema.ts` adds theme ownership; `validation.ts` centralizes theme token/name validation; the theme router exposes owner-scoped CRUD; `_app.ts` registers it; the themes dashboard provides the management UI; the sidebar exposes navigation; tests cover validation and wiring; task docs record completion and next work.
- **User-goal mapping:** The source changes let authenticated users create, edit, list, duplicate, preview, and delete custom themes while preserving read-only system themes and blocking deletion while a user's form references the theme.
- **Tests run:** `pnpm test` passed: 15 files, 62 tests. `pnpm lint` passed. `pnpm build` compiled successfully and ran TypeScript before failing during prerender on missing Clerk configuration.
- **Skipped tests:** No browser screenshot was run because the existing test harness is Node/Vitest-focused and the production build cannot complete without Clerk configuration. Applying the database schema to a live environment was not run; use the existing `pnpm db:push` workflow with the target database when deploying this schema change.
- **Warnings:** `pnpm` emitted the existing `.npmrc` warning `Failed to replace env in config: ${NODE_AUTH_TOKEN}` during test, lint, and build commands. `pnpm build` emitted Next.js's middleware-to-proxy deprecation warning.
- **Adversarial review:** Checked that theme list visibility is limited to system themes plus the current user's themes, create stamps `ctx.user.id`, update/delete require both theme id and owner id, system themes cannot be edited or deleted, and delete checks current-user form references before removal.
- **Residual risk:** The router behavior is covered by validation and source-level tests rather than a full mocked Drizzle caller integration. The schema change requires an explicit database push/migration in the deployed environment before the new router can persist custom theme ownership.
- **Rollback note:** Revert the theme router/registration, schema ownership field, theme validation helper/tests, themes dashboard route, sidebar link, and task-doc updates.
- **Next command:** `$run`

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
