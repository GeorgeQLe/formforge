# FormForge - Project Vision & Next Steps

## Vision

FormForge is an AI-powered form builder that lets users describe forms in natural language and get a fully functional, publishable form instantly. It combines GPT-4o generation with a drag-and-drop visual editor, conditional logic, file uploads, theming, Stripe billing, and email notifications -- targeting individuals and small teams who need professional forms without the overhead of enterprise tools.

## What's Built (Current State)

### Core Stack
- **Framework:** Next.js 16 (App Router, React 19, Tailwind v4)
- **Auth:** Clerk (middleware protecting dashboard routes, public routes for form filling)
- **Database:** Neon Postgres via Drizzle ORM (users, themes, forms, form_fields, form_responses, field_responses)
- **API layer:** tRPC v11 with React Query (form, field, response, billing routers)
- **Payments:** Stripe subscriptions (free / pro @ $15 / business @ $39) with checkout, portal, and webhook handling
- **AI:** OpenAI GPT-4o for form generation from natural language prompts
- **Email:** Resend for submission notifications
- **File storage:** AWS S3 presigned upload flow
- **Bot protection:** Cloudflare Turnstile on public form submissions
- **Env validation:** Zod schema for all required env vars (lazy, server-only)

### Features Implemented
- Landing page with auth redirect
- Dashboard with form listing (status badges, response counts, loading/empty states)
- Form CRUD (create, update, delete, publish, close) with plan-limit enforcement
- 10 field types: text, email, number, textarea, dropdown, radio, checkbox, date, rating, file_upload
- Per-field Zod validation builder (min/max, pattern, file types, option sets)
- Drag-and-drop editor (dnd-kit): field palette, sortable canvas, properties panel
- Conditional logic system (show/hide fields based on other field values, AND/OR operators)
- Public form renderer at `/f/[slug]` with theme support
- Individual field renderer components for each field type
- Form submission API at `/api/submit/[slug]`
- Response viewer pages (list + detail)
- Form settings page
- AI generate endpoint at `/api/ai/generate`
- Billing page + Stripe webhook handler
- Sidebar navigation component
- UI component library (button, input, textarea, label, card, badge, dialog, select, toast)

## Phase 7: Portfolio Billing Operating Model (LexCorp) — Complete
> Code migration complete. Lookup keys, customerId→userId rename, metadata contract.
> Remaining Stripe Dashboard tasks in `tasks/manual-todo.md`.

---

## Next Steps

### High Priority
- [x] **Testing:** No test files exist yet -- add unit tests for field validation logic and integration tests for tRPC routers
- [x] **Error handling:** Add global error boundaries and tRPC error formatting for user-facing messages
  - Add App Router error boundaries where user-facing failures currently fall through to framework defaults:
    - `src/app/error.tsx` for global app errors.
    - `src/app/(dashboard)/error.tsx` for authenticated dashboard routes.
    - `src/app/f/[slug]/error.tsx` or route-local handling for public form-fill failures.
  - Keep pages usable and concise: show a clear title, short explanation, retry action where `reset()` is available, and navigation back to the safest relevant route.
  - Add tRPC server error formatting in `src/server/trpc/trpc.ts` so callers receive normalized messages without leaking implementation details. Preserve useful validation details for `BAD_REQUEST`/Zod input errors.
  - Update client-facing tRPC usage only where needed to surface the normalized messages in existing dashboard/form flows.
  - Tests first where practical:
    - Add unit tests for any extracted error-formatting helper.
    - Add static or component-level tests for the new error boundary files if the current test harness can cover them without adding a browser environment.
  - Validation: run `pnpm test`, `pnpm lint`, and `pnpm build` if required env vars are available. If build is blocked by missing Clerk env, record the exact blocker.
- [x] **Form submission validation:** Wire up Turnstile verification server-side in the submit route
  - Add server-side Turnstile verification to `src/app/api/submit/[slug]/route.ts` before accepting a public submission.
  - Use the posted Turnstile token already passed from the public form client/renderer. Reject missing or failed tokens with a user-facing `400` response.
  - Read the secret through the existing env helper in `src/env.ts`; do not read raw `process.env` directly in the route if the helper already exposes the value.
  - Keep local/test behavior deterministic: unit-test the verification helper with mocked `fetch` instead of calling Cloudflare.
  - Add or update tests under `src/app/api/submit/__tests__/turnstile.test.ts` for missing token, failed verification, and successful verification flow.
  - Validation: run `pnpm test`, `pnpm lint`, and `pnpm build` if required Clerk env vars are available. If build is blocked by missing Clerk publishable key, record the exact blocker.
  - Completed 2026-05-18: extracted `src/server/security/turnstile.ts`, required `_turnstileToken` before accepting public submissions, verified tokens server-side through Cloudflare with mocked-fetch unit coverage, and used the env helper for the Turnstile secret.
- [x] **Response limits:** Enforce `responseLimit` and `closeDate` settings when accepting submissions
  - Current route context: `src/app/api/submit/[slug]/route.ts` already checks `form.settings?.responseLimit` against `formResponses` count and checks `form.settings?.closeDate` before validating and storing responses.
  - Next execution should verify and harden that existing behavior instead of duplicating logic:
    - Add focused coverage under `src/app/api/submit/__tests__/` for accepting a submission below the response limit, rejecting when `total >= responseLimit`, accepting before `closeDate`, and rejecting after `closeDate`.
    - Mock Turnstile verification or pass through the helper boundary so response-limit and close-date assertions are not coupled to Cloudflare.
    - Confirm the route returns user-facing `400` errors and does not insert into `formResponses` or `fieldResponses` on rejected submissions.
    - If the route test harness is too expensive, extract narrow pure helpers for `isResponseLimitReached` and `isFormClosed` and cover those directly, then keep one route-level static/behavioral assertion that the helpers run before persistence.
  - Validation: run `pnpm test`, `pnpm lint`, and `pnpm build` if required Clerk env vars are available. If build is blocked by missing Clerk publishable key, record the exact blocker.
- Completed 2026-05-18: added route-level coverage for below-limit, limit-reached, before-close-date, and after-close-date submission behavior with mocked Turnstile and database boundaries; rejected submissions assert no persistence calls are made.
- [x] **GDPR consent:** Render the consent checkbox when `gdprConsentEnabled` is true in the form renderer
  - Current renderer context:
    - Public form page `src/app/f/[slug]/page.tsx` passes `form.settings` into `FormPageClient`.
    - Client wrapper `src/app/f/[slug]/client.tsx` passes Turnstile props into `FormRenderer`, but it does not appear to pass or render GDPR consent settings yet.
    - Form submission route `src/app/api/submit/[slug]/route.ts` validates fields from `formFields`; consent is a form-level setting, so the renderer can enforce required local consent without adding a database field response unless the product decision changes.
  - Implementation approach:
    - Thread `gdprConsentEnabled` from the public form settings into `src/components/form-renderer/form-renderer.tsx`.
    - Render a required consent checkbox near the submit controls when the setting is true, using existing form styling and avoiding nested card UI.
    - Block submit client-side with a clear field-level/user-facing error if consent is required but unchecked.
    - Include the consent state in the request body only if useful for future auditing; do not persist it as a field response unless the existing schema already supports a clear form-level consent record.
  - Tests first where practical:
    - Add focused component/helper tests if the current Vitest setup can cover the consent validation without adding a browser environment.
    - If component testing is too costly, extract a small pure helper such as `validateGdprConsent(enabled, accepted)` and cover it directly, plus add a static assertion that the renderer wires the checkbox and helper.
  - Validation: run `pnpm test`, `pnpm lint`, and `pnpm build` if required Clerk env vars are available. If build is blocked by missing Clerk publishable key, record the exact blocker.
  - Completed 2026-05-18: added client-side GDPR consent validation, rendered a required checkbox for public fill mode when `form.settings.gdprConsentEnabled` is true, and covered the helper plus renderer wiring with Vitest.
- [x] **Redirect after submit:** Honor `redirectUrl` and `successMessage` settings post-submission
  - Current context:
    - `src/app/api/submit/[slug]/route.ts` already returns `form.settings?.successMessage ?? "Thank you for your response!"` and `form.settings?.redirectUrl ?? null` in the successful JSON response.
    - `src/app/f/[slug]/client.tsx` already redirects with `window.location.href = data.redirectUrl` in `handleSubmitSuccess`.
    - `src/components/form-renderer/form-renderer.tsx` displays the success message locally before invoking `onSubmitSuccess`, but redirect behavior may make the message unobservable when a redirect URL exists.
  - Implementation approach:
    - Verify the existing API and client behavior with focused tests instead of duplicating code.
    - Add route-level coverage under `src/app/api/submit/__tests__/` proving custom `successMessage` and `redirectUrl` are returned after successful persistence.
    - Add a focused helper or static assertion for `PublicFormClient` redirect wiring if a browser/component harness is not available.
    - If behavior is incomplete, make the smallest source change needed to preserve the returned success message and trigger redirects only after a successful submission.
  - Validation: run `pnpm test`, `pnpm lint`, and `pnpm build` if required Clerk env vars are available. If build is blocked by missing Clerk publishable key, record the exact blocker.
  - Completed 2026-05-18: added route-level regression coverage proving successful submissions return configured/default `successMessage` and `redirectUrl`, plus static client/renderer wiring coverage proving redirects are triggered only after successful submissions that include a redirect URL.

### Medium Priority
- [x] **CSV export:** Add a response export endpoint (the landing page advertises this feature)
  - Current context:
    - Response data is stored in `formResponses` and `fieldResponses`; response list/detail surfaces already exist under dashboard routes.
    - Existing router tests include response-router coverage, so prefer adding export behavior near the existing response access patterns instead of creating a disconnected API path unless the codebase already has route conventions for downloads.
  - Implementation approach:
    - Inspect `src/server/trpc/routers/response.ts`, dashboard response pages, and schema relationships to find the narrowest authenticated export surface.
    - Add an owner-scoped CSV export procedure or endpoint for a single form's responses.
    - Include stable headers from form field labels, one row per response, and escape CSV values correctly for commas, quotes, and newlines.
    - Ensure export rejects unauthenticated users and forms not owned by the current user.
    - If adding a browser download route is simpler than tRPC for file semantics, keep the authorization logic shared or colocated with existing response access code.
  - Tests first where practical:
    - Add focused tests for CSV escaping, header generation, owner authorization, empty-response export, and at least one populated response row.
    - Reuse existing router test patterns and mocks rather than introducing a database dependency.
  - Validation: run `pnpm test`, `pnpm lint`, and `pnpm build` if required env vars are available. If build is blocked by missing Clerk publishable key, record the exact blocker.
  - Completed 2026-05-18: hardened the existing owner-scoped `response.exportCsv` procedure by extracting deterministic CSV formatting, returning stable header rows for empty exports, preserving the 10,000-row cap/truncation signal, and covering escaping, headers, populated rows, empty exports, and truncation metadata with Vitest.
- [x] **Analytics dashboard:** Submission counts over time, completion rates, average completion time
  - Current context:
    - `src/server/trpc/routers/response.ts` already exposes `stats` with total, new, today, and average completion time for a single form.
    - `src/app/(dashboard)/forms/[id]/responses/page.tsx` renders summary cards for the existing stats above the response table.
    - `formResponses` stores `submittedAt`, `status`, and nullable `completionTime`, but there is no explicit started/submitted funnel model for true completion-rate calculation.
  - Implementation approach:
    - Add a narrow analytics procedure near the existing response router stats for a single owner-scoped form.
    - Return submission counts grouped by day over a bounded default range, average completion time, and a clearly defined completion-rate placeholder derived only from available stored data unless a real started-view tracking model already exists.
    - Render the analytics on the response dashboard without introducing durable tracking infrastructure or new database tables in this step.
    - Prefer simple accessible table/list or lightweight CSS visualization over adding a chart dependency unless the codebase already has one.
  - Tests first where practical:
    - Add focused helper tests for day bucketing, average completion-time math, zero-response output, and completion-rate semantics.
    - Add router/static coverage that the analytics procedure performs the same form ownership check pattern as list/stats/export.
  - Validation: run `pnpm test`, `pnpm lint`, and `pnpm build` if required env vars are available. If build is blocked by missing Clerk publishable key, record the exact blocker.
  - Completed 2026-05-19: added an owner-scoped `response.analytics` procedure, deterministic analytics helper coverage, and a dashboard analytics section with 14-day daily submission counts, range average completion time, and stored-submission completion-rate semantics.
- [x] **Theme CRUD:** Users can currently assign themes but there's no UI to create/edit custom themes
  - Current context:
    - Theme assignment already exists in form settings/editor flows, and themes are persisted in the existing database schema.
    - There is no dashboard UI for listing, creating, editing, or deleting custom themes.
    - This step should not add billing, collaboration, or marketplace infrastructure.
  - Implementation approach:
    - Inspect the theme schema and current form settings usage to identify the narrowest owner-scoped CRUD surface.
    - Add protected tRPC procedures for listing, creating, updating, and deleting a user's custom themes, preserving any built-in/default theme behavior.
    - Add a dashboard theme management UI using existing form and UI primitives. Keep the first version focused on practical token editing such as name, colors, typography, and button styling already supported by the renderer.
    - Ensure delete behavior is safe when forms reference a theme: either block deletion with a clear error or detach affected forms explicitly if the existing schema supports that safely.
  - Tests first where practical:
    - Add focused tests for theme input validation, owner scoping, create/update behavior, and delete-with-references semantics.
    - Add static or component-level coverage for the dashboard route if the current test harness can cover it without adding a browser environment.
  - Validation: run `pnpm test`, `pnpm lint`, and `pnpm build` if required env vars are available. If build is blocked by missing Clerk publishable key, record the exact blocker.
  - Completed 2026-05-19: added owner-scoped theme CRUD procedures, a `/themes` dashboard management UI with token editing and preview, sidebar navigation, nullable custom-theme ownership in the schema, and tests covering validation, router scoping, delete-with-references semantics, and dashboard wiring.
- [x] **Form duplication:** Clone an existing form with all its fields
  - Current context:
    - Forms are managed through `src/server/trpc/routers/form.ts`.
    - Fields are stored separately in `formFields` and ordered by `sortOrder`; existing field procedures already enforce form ownership.
    - Form creation currently generates a new slug from a title and enforces plan limits.
  - Implementation approach:
    - Add an owner-scoped duplicate procedure near the existing form CRUD procedures.
    - Load the source form by `id` and `ctx.user.id`; reject missing or unauthorized forms with `NOT_FOUND`.
    - Reuse the same plan-limit check as `form.create` before cloning.
    - Insert a new draft form with a distinct slug and a clear copied title such as `<source title> copy`.
    - Copy description, settings, `themeId`, and all fields in their existing order, preserving field options, validation, conditional logic, labels, and required flags.
    - Do not copy responses or published/closed status.
    - Return the new form so the dashboard can navigate to the cloned editor.
    - Add a dashboard action where users naturally expect it, likely the form list card/menu or form settings page, using existing UI primitives.
  - Tests first where practical:
    - Add focused router tests or static/source tests proving the duplicate procedure is owner-scoped, enforces plan limits, inserts a draft form, copies fields, and does not copy responses.
    - Add static dashboard wiring coverage if the current Vitest setup cannot mount the client route.
  - Validation: run `pnpm test`, `pnpm lint`, and `pnpm build` if required env vars are available. If build is blocked by missing Clerk publishable key, record the exact blocker.
  - Completed 2026-05-19: added `form.duplicate`, reused plan-limit enforcement, cloned draft form metadata and ordered fields without responses, added a dashboard duplicate action that routes to the copied editor, and covered clone/limit behavior with Vitest.
- [x] **AI regeneration:** Allow editing a generated form's prompt and re-running AI
  - Current context:
    - Form generation is implemented in `src/app/api/ai/generate/route.ts` and `src/server/ai/generate-form.ts`.
    - New-form creation lives in `src/app/(dashboard)/forms/new/page.tsx`; editing existing forms lives in `src/app/(dashboard)/forms/[id]/edit/page.tsx` using `FormEditor`.
    - Existing generated forms do not appear to persist the original natural-language prompt, so regeneration may need a UI prompt input that sends the edited prompt plus current form context instead of relying on stored prompt history.
  - Implementation approach:
    - Inspect the AI generation route/helper and editor state model to identify the narrowest regeneration surface.
    - Prefer a prototype-level editor action that lets the owner enter or edit a prompt, calls the existing AI generation helper/route, and replaces or appends generated fields only after explicit user confirmation.
    - Avoid adding new durable prompt-history storage unless the current schema already has a clear field for it; if persistence is necessary, document the deferred storage decision before adding schema.
    - Preserve form ownership checks and plan/feature limits already enforced by existing create/update/field procedures.
    - Keep field IDs and conditional logic coherent if replacing fields: either regenerate a full field set and save through existing field APIs, or add a focused owner-scoped tRPC procedure that performs the replacement transactionally.
  - Tests first where practical:
    - Add focused tests for any prompt/context shaping helper and for regeneration route/procedure authorization.
    - Add static/editor wiring coverage if the current Vitest setup cannot mount the editor UI without a browser environment.
    - Cover the chosen replace/append semantics so regeneration cannot accidentally duplicate stale fields or mutate another user's form.
  - Validation: run `pnpm test`, `pnpm lint`, and `pnpm build` if required env vars are available. If build is blocked by missing Clerk publishable key, record the exact blocker.
  - Completed 2026-05-19: added an owner-scoped `form.regenerateWithAI` mutation, reusable AI form-definition helpers, explicit editor regeneration UI with replacement confirmation, and coverage for conditional logic mapping, router replacement behavior, and editor wiring.
- [x] **Rate limiting:** Add rate limits to public submission and AI generation endpoints
  - Current context:
    - `src/app/api/submit/[slug]/route.ts` accepts public form submissions and already validates Turnstile before persistence.
    - `src/app/api/ai/generate/route.ts` creates new AI-generated forms for authenticated users.
    - A placeholder test file exists at `src/app/api/submit/__tests__/rate-limit.test.ts`; inspect it before adding duplicate coverage.
    - The project does not currently show durable infrastructure for Redis, Upstash, or edge KV, so default to an in-memory/local helper unless explicit infrastructure is authorized.
  - Implementation approach:
    - Add a small server-side rate-limit helper with deterministic time-window behavior and injectable clock/store for tests.
    - Apply it to public submissions using a stable key such as IP plus form slug, after cheap request parsing but before database persistence.
    - Apply it to AI generation using the authenticated app user or Clerk user id so one account cannot spam form generation.
    - Return user-facing `429` JSON errors with a short retry message; avoid leaking internal keys or limits.
    - Keep the implementation swappable so a future durable store can replace the local store without changing route call sites.
  - Tests first where practical:
    - Cover allowed requests, blocked requests after the limit, window reset behavior, and separate keys not affecting each other.
    - Add route-level or static coverage proving both submit and AI generation routes call the limiter before expensive persistence or OpenAI work.
  - Validation: run `pnpm test`, `pnpm lint`, and `pnpm build` if required env vars are available. If build is blocked by missing Clerk publishable key, record the exact blocker.
  - Completed 2026-05-19: extracted a deterministic in-memory rate-limit helper, applied form+IP limits to public submissions and user-scoped limits to AI generation before expensive work, and added helper plus route wiring coverage.
- [ ] **Env validation at build time:** Currently lazy -- consider failing the build if vars are missing
  - Current context:
    - `src/env.ts` currently validates required environment variables lazily for server runtime access.
    - `pnpm build` already fails during prerender when Clerk publishable configuration is missing, but not through a clear project-owned env validation contract.
    - Existing validation runs consistently emit `.npmrc` warnings for missing `NODE_AUTH_TOKEN`; do not treat that package-manager warning as a FormForge runtime env requirement unless `src/env.ts` or deployment docs require it.
  - Implementation approach:
    - Inspect `src/env.ts`, Next config, and route/module import patterns to understand which variables are required at build time versus runtime-only server operations.
    - Add a narrow build-time validation path that fails early with clear, grouped messages for required public/client build variables and any server variables truly needed during prerender/build.
    - Preserve lazy server-only validation for secrets that are not needed to compile or prerender, so local test/lint workflows do not require production credentials.
    - Prefer a reusable helper or script wired into the existing `build` command if importing env validation directly from Next config would force secrets too early.
    - Update `.env.example` only if a required build-time variable is missing from the sample and the file exists or is created as part of this step.
  - Tests first where practical:
    - Add focused unit tests for the env validation helper using injected env maps.
    - Add source/static coverage proving the build path invokes the helper before `next build` or during Next config loading.
  - Validation: run `pnpm test`, `pnpm lint`, and `pnpm build`. If build intentionally fails for missing env, verify the failure message is project-owned and clearer than the current Clerk prerender error.

### Lower Priority
- [ ] **Team/collaboration features:** Business plan advertises 10 team members but no team model exists yet
- [ ] **API access:** Business plan includes API access -- design and expose a public REST or GraphQL API
- [ ] **Form versioning:** Track published versions so field changes don't break in-progress submissions
- [ ] **Accessibility audit:** Ensure form renderer meets WCAG 2.1 AA
- [ ] **i18n:** Multi-language support for form labels and validation messages
- [ ] **Webhook integrations:** Let users forward submissions to Zapier, Slack, etc.
- [ ] **Partial responses / save & resume:** Allow respondents to save progress on long forms

### Cleanup / Tech Debt
- [ ] Replace boilerplate README with project-specific documentation
- [ ] Add `.env.example` with all required variables from `src/env.ts`
- [ ] Deduplicate slug generation logic (exists in both `form.ts` router and `generate-form.ts`)
- [ ] Move OpenAI client initialization behind `getEnv()` instead of reading `process.env` directly
- [ ] Add database indexes on `forms.slug`, `forms.userId`, `formFields.formId` for query performance
- [ ] Set up CI (lint, type-check, tests) and pre-commit hooks
