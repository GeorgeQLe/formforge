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
- [ ] **Redirect after submit:** Honor `redirectUrl` and `successMessage` settings post-submission
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

### Medium Priority
- [ ] **CSV export:** Add a response export endpoint (the landing page advertises this feature)
- [ ] **Analytics dashboard:** Submission counts over time, completion rates, average completion time
- [ ] **Theme CRUD:** Users can currently assign themes but there's no UI to create/edit custom themes
- [ ] **Form duplication:** Clone an existing form with all its fields
- [ ] **AI regeneration:** Allow editing a generated form's prompt and re-running AI
- [ ] **Rate limiting:** Add rate limits to public submission and AI generation endpoints
- [ ] **Env validation at build time:** Currently lazy -- consider failing the build if vars are missing

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
