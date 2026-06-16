## Project Summary

FormForge was built as an AI-powered form builder for individuals and small teams: natural-language form generation, drag-and-drop editing, public submissions, conditional logic, analytics, themes, billing, file uploads, notifications, and early collaboration/API concepts.

The repo is a substantial Next.js app, not an empty project. It has a working-looking implementation surface across dashboard, public form rendering, tRPC routers, Stripe, Clerk, OpenAI, Neon/Drizzle, Resend, S3, and Turnstile. The project is also overloaded: the current task log mixes production features, remediation work, infrastructure hardening, billing migration, and prototype experiments. Recent history shows a large burst of corrective and expansion commits on 2026-05-18 and 2026-05-19 after an initial scaffold on 2026-03-12.

The desk flip should preserve product learning and non-code assets only. Do not carry forward source code, dependencies, database schema, or infrastructure configuration.

## What Went Wrong

- The project started with too much production surface before the core workflow was proven. Commit `ed38353` on 2026-03-12 scaffolded editor, renderer, auth, and billing together. The README and `tasks/todo.md` show the same broad surface: AI generation, drag-and-drop editing, Stripe billing, analytics, conditional logic, file uploads, email, bot protection, themes, and response management.
- Remediation followed the scaffold instead of preceding it. On 2026-03-16, commits `78113cc`, `33ad2bd`, `afd76c2`, and `8fa86e1` added failing tests and fixes for settings validation, CSV export limits, Turnstile behavior, and rate limiting. On 2026-05-18, commits `763fede`, `6aeac0c`, `760d3cf`, `c6c5192`, `2fb1430`, `f3b54c8`, and `17ec6df` continued the same pattern with validation/router coverage, error handling, Turnstile verification, response settings, GDPR consent, redirects, and CSV hardening.
- Billing and portfolio operating-model concerns landed before the product had a calibrated adoption path. Commits `c3b1e86`, `79bd67b`, and `c8dc9e2` on 2026-04-13 and 2026-04-14 replaced the README with Phase 7 billing documentation and migrated Stripe lookup keys/metadata. `tasks/manual-todo.md` still has unresolved Stripe Dashboard setup, including products, prices, webhook endpoint, API version pinning, and env cleanup.
- Scope continued expanding after remediation. On 2026-05-19, commits added or recorded AI regeneration, rate limiting, env validation, team collaboration prototype, API access prototype, form versioning, accessibility, and i18n. The log shows at least 12 feature/docs commits on one day, which is a strong signal that implementation momentum outran product sequencing.
- Prototype-first work arrived late and inside the old app. Team collaboration and API access were correctly treated as local-only experiments in `tasks/todo.md` and `tasks/history.md`, but they were added after the app already had durable auth, billing, database, and public submission infrastructure. The fresh start should run these experiments before committing to multi-tenant storage, billing seats, API keys, or provider integrations.
- Build/deploy confidence remained fragile. Multiple history entries record `pnpm build` blocked by missing or invalid Clerk/public env configuration before build-time validation was added. The project also has no CI task completed, and cleanup still lists missing `.env.example`, missing CI, duplicate slug generation, direct OpenAI env access, and missing database indexes.
- Documentation became a running execution ledger rather than a stable spec set. There is no `specs/` or `docs/` directory. `tasks/todo.md` contains the richest product and implementation details, but it is a backlog/runbook hybrid with many completed implementation notes. `tasks/history.md` has valuable lessons, but it is post-hoc ship history, not a clean product specification.

## Salvageable Specs & Designs

- `README.md` - partially valid. Good concise product, billing tier, entity model, and Stripe contract summary, but it is skewed toward billing migration and not a complete product brief.
- `tasks/todo.md` - partially valid. Contains the best feature inventory, current-state notes, and deferred-infrastructure decisions, but many sections are implementation-specific and tied to the old architecture.
- `tasks/history.md` - valid. Strong source of lessons, residual risks, and what each feature was meant to accomplish; use as an autopsy record, not as implementation guidance.
- `tasks/manual-todo.md` - partially valid. Useful Stripe operating checklist and lookup-key pricing intent, but the exact dashboard/API-version instructions should be revalidated in the new project before use.
- `tasks/archive/2026-04-14-todo.md` - stale. Historical backlog snapshot; only useful for tracing how the billing/documentation phase evolved.
- `tasks/archive/2026-04-14-manual-todo.md` - stale. Historical manual Stripe checklist superseded by `tasks/manual-todo.md`.
- `src/app/(dashboard)/experiments/team-collaboration/page.tsx` - partially valid as a design artifact only. Preserve the workflow idea: invite draft, pending invite row, role changes, member removal, form-level sharing, and explicitly deferred team infrastructure.
- `src/app/(dashboard)/experiments/api-access/page.tsx` - partially valid as a design artifact only. Preserve the workflow idea: API key preview, scopes, request examples, response/error previews, and explicitly deferred API-key infrastructure.

## Salvageable Assets

- `src/app/favicon.ico` - project-owned icon surface if it visually represents FormForge; inspect before reuse.
- `public/file.svg` - likely generic starter asset; reuse only if it fits the new brand.
- `public/globe.svg` - generic starter asset; probably not worth carrying forward.
- `public/next.svg` - framework starter asset; do not treat as brand.
- `public/vercel.svg` - hosting starter asset; do not treat as brand.
- `public/window.svg` - generic starter asset; probably not worth carrying forward.
- Product copy from `tasks/todo.md`: "AI-powered form builder", "describe forms in natural language", "fully functional, publishable form instantly", and the feature list around visual editing, conditional logic, file uploads, theming, notifications, and billing. Preserve as copy raw material, not final marketing.
- Pricing intent from `README.md` and `tasks/manual-todo.md`: Free, Pro, and Business tiers; lookup keys `formforge.pro.monthly` and `formforge.business.monthly`; manual checklist also proposes yearly keys. Revalidate prices before reuse because README and manual checklist disagree on monthly amounts.

## Lessons for the Fresh Start

- Start with the user journey, not infrastructure. The first prototype should prove: describe a form, edit it, publish it, submit a response, and review/export responses.
- Keep auth, billing, teams, API access, webhooks, durable file storage, and enterprise controls out of the first build unless they are required to test the core loop.
- Create file-backed specs before code. Use separate product brief, UI spec, data contract, and technical plan files instead of letting `tasks/todo.md` become the only source of truth.
- Treat experiments as disposable artifacts. Team collaboration, API access, webhook integrations, i18n, and partial responses should be clickable/readable prototypes before durable schema or provider setup.
- Add verification with the first workflow. For the new repo, CI, `.env.example`, local smoke tests, and production-build validation should exist before feature volume increases.
- Make billing a late integration. Preserve tier intent, but do not wire Stripe until the free/pro product boundaries are proven with real form-building workflows.
- Avoid dependency-heavy scaffolding. Pick the smallest stack that supports the first workflow and defer external services until the workflow demands them.
- Keep product copy and domain decisions separate from code. The old repo contains useful wording and feature intent, but code-level architecture should not be migrated.

## Recommended Bootstrap Input

Build a fresh FormForge prototype: an AI-assisted form builder for individuals and small teams. The first product loop is: a user describes a form in natural language, reviews generated fields, edits fields visually, publishes a public form link, receives submissions, and reviews/export responses. Start prototype-first with file-backed specs and a narrow local implementation. Defer Stripe billing, teams, API keys, webhooks, durable file storage, provider-specific integrations, and full i18n until the core form creation and submission loop is validated. Preserve product lessons from the old repo: public form accessibility, immutable published form snapshots, response export, clear error handling, consent settings, and explicit deferred-infrastructure notes for future collaboration/API/webhook work.
