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

## Next Steps

### High Priority
- [ ] **Testing:** No test files exist yet -- add unit tests for field validation logic and integration tests for tRPC routers
- [ ] **Error handling:** Add global error boundaries and tRPC error formatting for user-facing messages
- [ ] **Form submission validation:** Wire up Turnstile verification server-side in the submit route
- [ ] **Response limits:** Enforce `responseLimit` and `closeDate` settings when accepting submissions
- [ ] **GDPR consent:** Render the consent checkbox when `gdprConsentEnabled` is true in the form renderer
- [ ] **Redirect after submit:** Honor `redirectUrl` and `successMessage` settings post-submission

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
