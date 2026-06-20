# Preliminary Service Blueprint Research

> Status: review
> Date: 2026-06-20
> Parent orchestrator: journey-map
> Framework: service-blueprint
> Proposed canonical output: `research/journey-map-service-blueprint.md`
> Review page: `alignment/journey-map-formforge.html`

## Scope And Inputs

This packet maps the FormForge client-intake service in flat `research/` mode for the approved ICP: client-service solo consultants, coaches, and small agencies doing client intake/onboarding.

Approved framework set:

- `service-blueprint`
- `user-story-map`

Sources used:

- `research/icp.md`
- `research/competitive-analysis.md`
- `README.md`
- `CLAUDE.md`
- `src/server/ai/generate-form.ts`
- `src/server/db/schema.ts`
- `src/server/trpc/routers/form.ts`
- `src/server/trpc/routers/response.ts`
- `src/app/api/submit/[slug]/route.ts`
- `src/app/f/[slug]/client.tsx`
- `src/server/responses/csv-export.ts`

Source gaps:

- No `research/customer-feedback.md` exists.
- No target-buyer interviews, support tickets, product analytics, or live customer usage traces exist in this repo.
- The codebase proves available service mechanics, but not market demand or actual user success.

## Proposed Canonical Artifact

# Service Blueprint

> Based on: `research/icp.md`, `research/competitive-analysis.md`, README/product boundary, and observed implementation files
> Date: 2026-06-20
> Methodology: Shostack Service Blueprint
> Mode: Product-Exists (grounded by code, still customer-feedback-limited)

## Summary

FormForge's current service is strongest from "describe the needed intake form" through "publish a public link" and "receive structured submissions." The visible product loop already supports AI-generated fields, visual editing, conditional logic, immutable published snapshots, public submission, response review, basic response status, analytics, notification email, and CSV export.

The highest operational risk is after the respondent submits. ICP and competitive evidence both say the value of intake depends on reducing back-and-forth and moving answers into client work systems. The observed implementation currently provides response review, status labels, email notification, and CSV export, but no native Sheets/Notion/CRM/Zapier/Make/webhook/project-doc handoff. That makes post-submission routing the biggest service blueprint gap for the approved ICP.

## Service Stages

| Stage | Customer Action | Evidence/Touchpoint | Backstage Action | Support Process |
| --- | --- | --- | --- | --- |
| Trigger and evaluation | Consultant, coach, or agency realizes they need a client intake form for a new client, service, cohort, or project. | ICP trigger events: new client signed, new offer launches, onboarding delays, desire for more professional form than Google Forms. Competitive analysis frames the gap as deeper than generic form builders but lighter than client-management suites. | FormForge must make the first-use promise legible: describe, generate, edit, publish, submit, review/export. | Product positioning and onboarding content are not represented in code evidence; demand signal is research-backed, not customer-validated. |
| Sign-up and workspace entry | User creates or accesses an account and enters dashboard. | Auth routes exist under `src/app/(auth)/...`; dashboard routes exist under `src/app/(dashboard)/dashboard/page.tsx`. | Protected tRPC procedures associate forms with the authenticated user. | Clerk-authenticated user context and database user records support ownership; plan limits are checked in form creation. |
| AI-assisted draft creation | User describes the intake form they need. | README defines the core loop as "describe a form, review generated fields, edit visually, publish a public link, receive submissions, and review/export responses." `src/server/ai/generate-form.ts` accepts a natural-language prompt and returns title, description, field types, options, validations, required flags, and conditional-logic hints. | OpenAI call parses JSON into a schema; generated form and fields are persisted with a draft status and unique slug. | OpenAI API, database writes, field schema validation, slug generation, and plan-limit enforcement. |
| Visual edit and form configuration | User adjusts fields, required flags, conditional logic, settings, theme, and publication readiness. | Editor, field palette, conditional-logic builder, properties panel, settings page, and theme routes/components exist. `src/server/trpc/routers/form.ts` supports updates, duplicate, AI regeneration, publish, close, and settings including notifications, response limit, close date, redirect URL, success message, and GDPR consent. | Field records, form settings, and optional themes are updated. AI regeneration can replace a form definition. | Drizzle schema stores fields, validation, conditional logic, settings, theme, and status. Tests cover AI regeneration, settings, themes, and field types. |
| Publish and share | User publishes and sends the link to a client/respondent. | `publish` requires at least one field, creates a version snapshot, and marks the form published. Public route `src/app/f/[slug]/...` renders the respondent-facing form. | Immutable form version snapshots preserve what respondents saw when they submitted. | `formVersions` stores title, description, settings, theme, and fields snapshot; public route resolves latest/submitted version. |
| Respondent completion | External client completes the intake without being a FormForge buyer. | `src/app/f/[slug]/client.tsx` renders the public form, applies theme, includes Turnstile when configured, tracks completion start time, and handles redirect after success. `src/app/api/submit/[slug]/route.ts` validates published status, Turnstile, rate limits, close date, response limit, visible conditional fields, localized validation, and submission persistence. | API stores response and field responses; notification email is sent when configured. | Rate limiter, Turnstile, conditional logic evaluator, localized field validator, database inserts, notification email service. |
| Response review and triage | User reviews submitted intake answers, marks status, exports, and decides next client-work step. | `src/server/trpc/routers/response.ts` supports list, get by ID, stats, analytics, status update, bulk status update, delete, and CSV export. Schema supports response statuses: new, read, starred, archived. | Dashboard queries aggregate response counts, statuses, completion time, analytics, and field response values. | Database relations, analytics builder, CSV export builder with a 10,000-row cap and truncation flag. |
| Handoff into service delivery | User copies or exports answers into project docs, CRM, Notion, Sheets, kickoff notes, or client workspace. | ICP says manual copy/paste after submission is high-severity and high-frequency; competitive analysis says integrations and handoff are a major battleground. Observed product boundary includes review/export but defers provider integrations and webhooks in README. | Current product can export CSV and send notification emails, but does not complete native handoff to project systems. | CSV builder, notification email, and manual user process. No native webhook, CRM, Sheets, Notion, Zapier/Make, or project-management routing observed. |
| Retention and reuse | User duplicates, edits, regenerates, reuses, and monitors forms across clients/offers. | `duplicate`, `regenerateWithAI`, `close`, statuses, analytics, themes, and response review exist. ICP expects reuse/adaptation across clients and offers. | Form records and fields can be cloned or regenerated; response history remains tied to form and version snapshots. | Database ownership, versioning, response analytics, plan-limit checks, and theme validation. |
| Billing and expansion | User may hit limits or choose paid features after repeated use. | README describes Stripe-powered subscription billing and billing routes exist. `users.plan` and `getPlanLimits` are used for form-limit enforcement. | Checkout/webhook flow updates customer/subscription metadata and plan state. | Stripe integration, webhook handling, user plan records. README also says defer Stripe billing until the core loop is validated, so billing is present but not the journey's validation center. |
| Support and failure recovery | User or respondent encounters validation, bot, limit, version, or submission errors. | Public submit route returns errors for bot check, invalid Turnstile, form not found, not accepting, version missing, response limit, close date, validation failure, and internal error. Dashboard error route exists. | Errors are localized in submit path; server logs internal submission errors. | i18n utilities, error pages, validation, rate limit, Turnstile, and server logging. No customer-support workflow evidence exists. |

## Lines Of Interaction

### Line Of Interaction

The primary visible boundary runs between:

- Buyer/user and dashboard: prompt generation, editing, publishing, settings, response review, export.
- Respondent/client and public form: link open, field completion, validation, bot challenge, success message or redirect.

The service succeeds when both sides feel low-friction: the buyer creates a useful intake form quickly, and the respondent completes it without account friction.

### Line Of Visibility

Visible to buyer/user:

- Draft/published/closed status.
- Form fields, settings, theme, public slug, response count, response rows, status labels, analytics, CSV export, and email notifications when configured.

Visible to respondent:

- Public form, theme, fields, help text, validation messages, Turnstile challenge if configured, success message, redirect.

Not visible or weakly visible:

- Whether submitted answers are complete enough for kickoff beyond field-level required validation.
- Whether file or asset requests fully satisfy service-delivery needs.
- Whether exported answers have reached the buyer's actual work system.
- Whether the client has been followed up with after incomplete or low-quality answers.
- Whether AI-generated questions are high quality enough for a specific service niche before user review.

### Line Of Internal Interaction

Backstage processes depend on:

- AI generation and JSON schema parsing.
- Database ownership and plan-limit enforcement.
- Form field persistence and conditional logic resolution.
- Version snapshot creation at publish time.
- Public submission validation and persistence.
- Notification email dispatch.
- Response analytics and CSV export.

The main internal handoff is from published form snapshot to response records. The current service does not have an internal handoff from response records into external client-work systems.

### Line Of Implementation

Implementation infrastructure includes:

- Next.js App Router and tRPC.
- PostgreSQL through Drizzle ORM.
- OpenAI for AI form generation.
- Clerk-style authenticated user context implied by auth routes and user ownership.
- Cloudflare Turnstile for public anti-bot submission.
- Email notification service.
- Stripe billing records and webhooks.

Deferred or absent infrastructure relevant to the service blueprint:

- Durable provider integrations.
- Webhooks/API handoff.
- Durable file storage details beyond file-upload field semantics.
- CRM/project-management routing.
- Customer-feedback collection or support lifecycle.

## Operational Gap Analysis

| Gap Type | Stage | Description | Severity | Evidence |
| --- | --- | --- | --- | --- |
| Evidence gap | Trigger and evaluation | The repo has strong desk research and product code but no direct customer-feedback file, interviews, win/loss notes, analytics, or support tickets. | High | Missing `research/customer-feedback.md`; ICP and competitive analysis both flag customer-validation gaps. |
| Fail point | AI-assisted draft creation | AI-generated forms may omit service-specific intake details, ask weak questions, or produce conditional logic that needs human correction. | Medium | `generate-form.ts` uses schema validation and conditional-logic hints, but there is no customer-quality evidence for generated intake forms. |
| Fail point | Publish and share | Publishing requires a form snapshot and at least one field, but the blueprint lacks evidence for pre-publish quality checks against the ICP's completeness job. | Medium | `publish` checks non-empty fields and snapshots; ICP pain is missing details/assets, not only missing fields. |
| Wait point | Respondent completion | Turnstile, required fields, file-upload expectations, conditional logic, or validation can slow completion, especially on mobile or for external clients. | Medium | Public submit path validates Turnstile, visible fields, required rules, limits, and close date; ICP says respondent friction matters. |
| Bottleneck | Response review and triage | The owner-operator still has to inspect new submissions and decide whether they are ready for kickoff. | High | Response statuses exist, but no automated completeness scoring, missing-asset workflow, or follow-up loop is observed. |
| Handoff gap | Handoff into service delivery | CSV export and notification email do not by themselves move answers into the buyer's project docs, CRM, Notion, Sheets, kickoff notes, or task system. | High | ICP rates manual copy/paste high severity/high frequency; competitive analysis calls integrations and handoff a battleground; README defers provider integrations and webhooks. |
| Evidence gap | Handoff into service delivery | The service does not expose status that a submission has been transferred, assigned, reconciled, or used in kickoff. | High | Schema tracks response status only as new/read/starred/archived; no downstream sync or work-system state is visible in observed code. |
| Fail point | Notification and support | Notification email is fire-and-forget and caught with `console.error`, so a missed notification may not be surfaced to the user. | Medium | Submit route sends notification asynchronously and catches errors with `console.error`; no retry/support path observed. |
| Bottleneck | Billing and expansion | Billing exists in README/code, but README says billing should be deferred until core loop validation. Premature billing emphasis could distract from journey validation. | Low-medium | README Fresh Start Bootstrap Note says defer Stripe billing until the core loop is validated. |

## Evidence Matrix

| Claim | Evidence Source | Evidence Type | Confidence |
| --- | --- | --- | --- |
| The active ICP needs client intake/onboarding, not generic form creation. | `research/icp.md` primary ICP and trigger events. | Approved research | High |
| FormForge's current product loop covers describe, generate, edit, publish, submit, review, and export. | README Fresh Start Bootstrap Note; observed routes and routers. | Observed plus stated product boundary | High |
| AI generation creates structured form definitions with field types, validation, required flags, options, and conditional logic hints. | `src/server/ai/generate-form.ts`. | Observed code | High |
| Published forms use immutable snapshots, protecting response interpretation after later edits. | `src/server/trpc/routers/form.ts`; `src/server/db/schema.ts`; submit route version lookup. | Observed code | High |
| Public submission has meaningful reliability controls. | Submit route uses rate limiting, Turnstile, status checks, close/response limits, conditional logic, localized validation, and persistence. | Observed code | High |
| Response review exists but downstream workflow handoff is thin. | Response router supports statuses, analytics, CSV export; README defers integrations/webhooks; no native CRM/Sheets/Notion/Zapier/Make routing observed. | Observed code plus product boundary | High |
| Handoff is the most important service gap for the ICP. | ICP pain map rates manual copy/paste high severity/high frequency; competitive analysis says integrations and handoff are a major battleground. | Approved research plus inference | Medium-high |
| Customer success and generated-form quality remain unvalidated. | No `research/customer-feedback.md`; competitive analysis source gaps; no usage analytics or interviews. | Source absence | High |

## Assumptions And Confidence Register

| Assumption | Status | Confidence | What Would Change It |
| --- | --- | --- | --- |
| Product-exists mode is appropriate for this run. | Approved in YAML and supported by production code evidence. | High | User changes mode or product boundary. |
| The highest-value journey is client intake for consultants, coaches, and small agencies. | Approved ICP. | High | New ICP approval or customer evidence contradicting Candidate A. |
| Post-submission handoff is more operationally important than billing for the first validated loop. | Inferred from ICP, competitive analysis, and README deferral note. | Medium-high | Customer interviews showing paid conversion fails before handoff matters, or usage showing exports are enough. |
| CSV/email notification is enough for initial validation but not enough for durable differentiation. | Inferred from current product boundary and competitor integration breadth. | Medium | Buyers validate CSV/email as sufficient for repeated paid use. |
| AI-generated first drafts reduce blank-page work but need human review. | Supported by code and ICP pain, but not customer validated. | Medium | Usability tests or interviews showing generated output is consistently ready-to-send, or often unusable. |

## Source Coverage Gaps

- No real customer language beyond secondary/desk research.
- No observed onboarding analytics for first prompt, first publish, first response, or first export.
- No failed-submission telemetry, notification-delivery data, or support cases.
- No hands-on competitor trial comparing actual intake setup and handoff time.
- No proof that external clients complete FormForge forms at higher rates or with better completeness than Google Forms, Tally, Typeform, or manual questionnaires.

## Proposed File Changes After Approval

If approved, the parent orchestrator should:

- Write `research/journey-map-service-blueprint.md` with the proposed canonical artifact above.
- Archive `research/_working/preliminary-service-blueprint-research.md`.
- Archive the review page snapshot.
- Leave `research/_working/journey-map-run.yaml` unchanged except for completion inferred by the new canonical intermediate's existence.
- Recalculate pending frameworks from the manifest and filesystem; next pending framework should be `user-story-map`.

## Framework Review Gates

Required approval questions for the review page:

- Evidence coverage: Is the evidence sufficient to approve this service blueprint as the service-blueprint intermediate?
- Assumptions/confidence: Are the confidence levels and source gaps acceptable?
- Proposed file changes: Should the parent write `research/journey-map-service-blueprint.md` from this reviewed packet after approval?

## Parent Loop Handoff

When this page is approved, the parent `$journey-map` run should write the canonical service-blueprint intermediate and then recalculate pending frameworks. Because `user-story-map` remains selected and no canonical `research/journey-map-user-story-map.md` exists yet, the next heavy phase should be the user-story-map framework.
