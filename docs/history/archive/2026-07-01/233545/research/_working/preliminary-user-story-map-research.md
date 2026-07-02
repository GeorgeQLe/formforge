# User Story Map

> Based on: `research/icp.md`, `research/competitive-analysis.md`, `research/journey-map-service-blueprint.md`, README/product boundary, and observed implementation files
> Date: 2026-07-02
> Methodology: Jeff Patton User Story Mapping
> Mode: Product-Exists (grounded by code, customer-feedback-limited)
> Review state: non-canonical working packet pending approval

## Summary

FormForge's story map backbone is the client-service intake loop: decide what information is needed, create a useful intake form, tailor it, publish a polished link, collect client responses, review readiness, and hand answers into service delivery. The current implementation already covers the thinnest end-to-end loop from AI-assisted draft to public submission and CSV export. The story-map gap is not basic form building; it is the transition from "response received" to "ready for kickoff or delivery work."

The walking skeleton is already visible in the product surface: create with AI or from scratch, edit fields, publish, collect a public response, review it, mark status, and export CSV. To become genuinely useful for the approved ICP, the next slice should strengthen intake completeness and handoff readiness before expanding billing, teams, APIs, or broad integrations.

## Activity Backbone

| Activity | Persona | Goal | Evidence |
| --- | --- | --- | --- |
| Recognize intake need | Owner-operator, consultant, coach, small-agency operator | Realize a new client, offer, cohort, or project needs a structured intake artifact now. | `research/icp.md` trigger events; current-state journey. |
| Draft intake form | Same buyer/user | Get from plain-language need to a usable first draft without blank-page setup. | ICP blank-page pain; README core loop; `src/app/api/ai/generate/route.ts`; `src/server/ai/generate-form.ts`. |
| Tailor form for client/service | Same buyer/user, sometimes ops coordinator | Adjust fields, wording, required flags, logic, theme, settings, and publication readiness. | ICP value drivers; editor and settings UI; `src/components/form-editor/*`; `src/server/trpc/routers/form.ts`. |
| Publish and share link | Buyer/user | Send a credible intake link to the client without respondent account friction. | README core loop; `publish` mutation; public route `src/app/f/[slug]/client.tsx`; immutable version snapshots. |
| Complete intake | External client/respondent | Submit required information, files, preferences, and constraints with minimal friction. | ICP respondent dynamic; public submit route validation; Turnstile; form renderer fields. |
| Review response readiness | Buyer/user | See what came in, triage new responses, and decide whether the client is ready for kickoff. | Service blueprint gap analysis; response list, stats, analytics, status update, detail pages. |
| Export or hand off answers | Buyer/user | Move intake answers into project docs, CRM, Notion, Sheets, kickoff notes, or service workflow. | ICP manual copy/paste pain; competitive analysis handoff gap; current CSV export. |
| Reuse and improve intake system | Buyer/user | Duplicate, regenerate, close, analyze, and adapt forms across clients or offers. | Dashboard duplicate; AI regenerate; statuses; analytics; service blueprint retention/reuse stage. |

## Story Map

### Activity: Recognize Intake Need

#### Task: Identify the intake job
| Priority | Story | Persona | Release |
| --- | --- | --- | --- |
| P1 | As a consultant, I want to start a form for a new client or service need, so that I can collect kickoff details before work begins. | Owner-operator | R1 |
| P2 | As an agency operator, I want intake examples aligned to my service type, so that I do not invent every question from scratch. | Agency/project coordinator | R2 |
| P3 | As a coach, I want to separate applications, onboarding, check-ins, and testimonials, so that each form matches the client moment. | Coach/program operator | R3+ |

#### Task: Decide what good intake must capture
| Priority | Story | Persona | Release |
| --- | --- | --- | --- |
| P1 | As a provider, I want to describe goals, background, files, links, access, timeline, budget, and preferences in my prompt, so that the draft starts from my actual client work. | Owner-operator | R1 |
| P2 | As a provider, I want completeness prompts for commonly missed client details, so that the form catches gaps before I send it. | Owner-operator | R2 |
| P3 | As an operator, I want saved intake criteria by offer type, so that repeated projects start from a known checklist. | Agency/project coordinator | R3+ |

### Activity: Draft Intake Form

#### Task: Generate or create the first draft
| Priority | Story | Persona | Release |
| --- | --- | --- | --- |
| P1 | As a provider, I want to create a form from a plain-language prompt, so that blank-page setup takes minutes instead of hours. | Owner-operator | R1 |
| P1 | As a provider, I want a fallback path to create a form manually, so that I am not blocked if AI output is wrong or unavailable. | Owner-operator | R1 |
| P2 | As a provider, I want AI output to include sensible labels, field types, required flags, validation, and conditional-logic hints, so that the draft is practical. | Owner-operator | R2 |
| P2 | As a provider, I want generation rate/error feedback, so that I know whether to retry, simplify, or switch to manual creation. | Owner-operator | R2 |

#### Task: Review AI quality
| Priority | Story | Persona | Release |
| --- | --- | --- | --- |
| P1 | As a provider, I want to preview the generated fields before publishing, so that weak or missing questions do not reach the client. | Owner-operator | R1 |
| P2 | As a provider, I want to regenerate a form from a revision request, so that I can steer the draft toward a specific client or service. | Owner-operator | R2 |
| P3 | As a provider, I want quality checks against intake completeness, so that the form flags missing files, access, stakeholder, or timeline questions. | Owner-operator | R3+ |

### Activity: Tailor Form For Client/Service

#### Task: Edit fields and logic
| Priority | Story | Persona | Release |
| --- | --- | --- | --- |
| P1 | As a provider, I want to add, remove, reorder, and edit fields, so that the intake matches my service. | Owner-operator | R1 |
| P1 | As a provider, I want field types for text, email, number, dropdown, radio, checkbox, textarea, date, rating, and file upload, so that I can collect common intake data. | Owner-operator | R1 |
| P2 | As a provider, I want conditional logic, so that clients only see relevant follow-up questions. | Owner-operator | R2 |
| P2 | As a provider, I want undo/redo and preview while editing, so that I can make changes without losing confidence. | Owner-operator | R2 |

#### Task: Configure client-facing experience
| Priority | Story | Persona | Release |
| --- | --- | --- | --- |
| P1 | As a provider, I want a title, description, required fields, and success message, so that the client understands what to submit. | Owner-operator | R1 |
| P2 | As a provider, I want notification emails, response limits, close dates, redirect URL, GDPR consent, and theme controls, so that the form fits my workflow and brand. | Owner-operator | R2 |
| P3 | As an agency operator, I want reusable themes and templates, so that repeated client forms stay consistent. | Agency/project coordinator | R3+ |

### Activity: Publish And Share Link

#### Task: Publish a stable form
| Priority | Story | Persona | Release |
| --- | --- | --- | --- |
| P1 | As a provider, I want to publish only when the form has fields, so that clients cannot receive an empty form. | Owner-operator | R1 |
| P1 | As a provider, I want submitted responses tied to the published version, so that later edits do not corrupt the meaning of earlier answers. | Owner-operator | R1 |
| P2 | As a provider, I want clear draft/published/closed states, so that I know whether clients can submit. | Owner-operator | R2 |

#### Task: Share with a respondent
| Priority | Story | Persona | Release |
| --- | --- | --- | --- |
| P1 | As a provider, I want a public link, so that a client can complete intake without a FormForge account. | Owner-operator | R1 |
| P2 | As a provider, I want the shared page to feel polished and credible, so that the client experience supports premium service work. | Owner-operator | R2 |
| P3 | As a provider, I want share tracking or delivery-state evidence, so that I know whether a client has started or stalled. | Owner-operator | R3+ |

### Activity: Complete Intake

#### Task: Fill and submit the form
| Priority | Story | Persona | Release |
| --- | --- | --- | --- |
| P1 | As a client respondent, I want to fill visible fields and submit successfully, so that I can give the provider what they need. | External client/respondent | R1 |
| P1 | As a client respondent, I want validation errors for missing or invalid answers, so that I can fix issues before submitting. | External client/respondent | R1 |
| P2 | As a client respondent, I want only relevant fields to appear, so that the form does not feel bloated. | External client/respondent | R2 |
| P2 | As a client respondent, I want a success message or redirect after submission, so that I know the intake was received. | External client/respondent | R2 |
| P3 | As a client respondent, I want file and asset requests to be clear enough that I attach the right materials the first time. | External client/respondent | R3+ |

#### Task: Protect submission reliability
| Priority | Story | Persona | Release |
| --- | --- | --- | --- |
| P1 | As a provider, I want bot/rate-limit protection, so that public links remain usable. | Owner-operator | R1 |
| P2 | As a provider, I want close-date and response-limit controls, so that stale or capped forms stop accepting answers. | Owner-operator | R2 |
| P3 | As a provider, I want submission failure visibility, so that missed notifications or validation problems do not silently delay kickoff. | Owner-operator | R3+ |

### Activity: Review Response Readiness

#### Task: See and triage responses
| Priority | Story | Persona | Release |
| --- | --- | --- | --- |
| P1 | As a provider, I want to see submitted responses for a form, so that I can begin client review. | Owner-operator | R1 |
| P1 | As a provider, I want response status labels for new, read, starred, and archived, so that I can triage basic follow-up. | Owner-operator | R1 |
| P2 | As a provider, I want response stats and recent activity, so that I can monitor whether intake is working. | Owner-operator | R2 |
| P2 | As a provider, I want bulk status updates, so that I can manage repeated submissions faster. | Agency/project coordinator | R2 |

#### Task: Judge completeness
| Priority | Story | Persona | Release |
| --- | --- | --- | --- |
| P1 | As a provider, I want to open a response and read field answers, so that I can decide whether kickoff can proceed. | Owner-operator | R1 |
| P2 | As a provider, I want a readiness signal for missing files, unclear answers, or incomplete client context, so that follow-up happens before the kickoff call. | Owner-operator | R2 |
| P3 | As a provider, I want follow-up requests tied to missing answers, so that clients can fix intake gaps without a new email thread. | Owner-operator | R3+ |

### Activity: Export Or Hand Off Answers

#### Task: Export collected data
| Priority | Story | Persona | Release |
| --- | --- | --- | --- |
| P1 | As a provider, I want to export responses as CSV, so that I can move intake data outside FormForge. | Owner-operator | R1 |
| P2 | As a provider, I want exports to preserve response metadata and field labels, so that project docs or spreadsheets remain understandable. | Owner-operator | R2 |
| P2 | As a provider, I want to know if export is truncated, so that large forms do not silently lose data. | Agency/project coordinator | R2 |

#### Task: Move answers into delivery workflow
| Priority | Story | Persona | Release |
| --- | --- | --- | --- |
| P1 | As a provider, I want at least one manual handoff path, so that I can get responses into my work system after submission. | Owner-operator | R1 |
| P2 | As a provider, I want a cleaner handoff to Sheets, Notion, CRM, kickoff docs, or project tools, so that I stop copy/pasting intake data. | Owner-operator | R2 |
| P3 | As an agency operator, I want workflow-specific handoff or agent-operable access, so that repeated client intake can become an operational system rather than another inbox. | Agency/project coordinator | R3+ |

### Activity: Reuse And Improve Intake System

#### Task: Reuse successful forms
| Priority | Story | Persona | Release |
| --- | --- | --- | --- |
| P1 | As a provider, I want to duplicate a form, so that I can adapt prior intake work for a new client or offer. | Owner-operator | R1 |
| P2 | As a provider, I want to regenerate or revise an existing form, so that I can specialize the same intake base for another project. | Owner-operator | R2 |
| P3 | As an agency operator, I want reusable intake libraries by service type, so that the team does not reinvent questions. | Agency/project coordinator | R3+ |

#### Task: Learn from usage
| Priority | Story | Persona | Release |
| --- | --- | --- | --- |
| P1 | As a provider, I want basic response counts, so that I know whether forms are being used. | Owner-operator | R1 |
| P2 | As a provider, I want completion time and recent submission analytics, so that I can spot friction. | Owner-operator | R2 |
| P3 | As a provider, I want intake quality and follow-up metrics, so that I can improve forms based on kickoff readiness, not only submission volume. | Owner-operator | R3+ |

## Release Slicing

### Release 1 - Walking Skeleton

**Outcome**: A client-service provider can create one intake form, publish it, collect a response, review it, and export the response manually.

| Activity | Task | Story Summary | Rationale |
| --- | --- | --- | --- |
| Recognize intake need | Identify the intake job | Start a form for a new client or service need. | Anchors the flow in the ICP trigger event. |
| Draft intake form | Generate or create first draft | Create from plain-language prompt or manually. | Solves blank-page setup enough to test the loop. |
| Tailor form | Edit fields and logic | Add, remove, reorder, and edit common fields. | Lets users correct AI output and match client work. |
| Publish/share | Publish stable form | Publish a form with versioned fields and a public link. | Makes respondent-facing collection possible. |
| Complete intake | Fill and submit | Respondent submits visible fields with validation. | Proves the two-sided buyer/respondent flow. |
| Review readiness | See and triage | Provider views responses and updates status. | Gives the buyer operational visibility. |
| Export/handoff | Export data | Provider exports CSV as the manual handoff path. | Covers minimum downstream transfer without integrations. |
| Reuse/improve | Reuse form | Provider duplicates or monitors response count. | Shows repeatability beyond a single one-off form. |

### Release 2 - Useful Client Intake Loop

**Outcome**: The flow becomes credible for repeated paid-client work by improving completeness, polish, monitoring, and first handoff beyond raw collection.

| Theme | Stories Included | Explicitly Deferred |
| --- | --- | --- |
| Intake quality | Completeness prompts, better AI field/logic quality, preview confidence, file/asset clarity. | Full vertical templates and automated follow-up workflows. |
| Client-facing professionalism | Themes, success messages, redirects, consent, close/limit controls. | Full client portal, contracts, payments, and scheduling. |
| Review readiness | Stats, analytics, bulk triage, readiness signal for missing files or unclear answers. | Automated kickoff-note generation and multi-user review. |
| Handoff | Preserve metadata in export, expose truncation, add one cleaner handoff path to the most validated destination. | Broad integration marketplace, webhooks/API platform, and agent-first operational layer. |

### Release 3+ - Operational Depth And Expansion

**Outcome**: FormForge becomes an intake operating layer for repeated service workflows instead of only a polished form builder.

| Theme | Candidate Stories | Why Later |
| --- | --- | --- |
| Workflow-specific handoff | Native Sheets/Notion/CRM/project-doc routing, webhook/API, agent-operable handoff. | Competitive analysis says handoff matters, but destination priority is not customer-validated. |
| Follow-up loop | Missing-answer requests, client completion status, reminder paths, delivery-readiness workflow. | Needs customer evidence on where follow-up happens today. |
| Reusable libraries | Intake templates by service type, offer-specific criteria, team libraries. | Useful after the core job and ICP segment are validated. |
| Business expansion | Billing, teams, API keys, durable file storage, collaboration. | README explicitly defers these until the core loop is validated. |

## Walking Skeleton

The thinnest deployable/testable path is:

1. Authenticated provider creates a form from a prompt or manual title.
2. Provider edits common fields and publishes the form.
3. FormForge snapshots the published field version.
4. External client opens the public link, completes visible fields, passes validation/anti-bot checks, and submits.
5. Provider sees the response, changes status, and exports CSV.

| Activity | Skeleton Story | Implementation Notes |
| --- | --- | --- |
| Recognize intake need | Start one intake form for one client/service need. | Existing dashboard and new-form path support entry. |
| Draft intake form | Generate or manually create the first draft. | Existing AI route and form creation route support this. |
| Tailor form | Edit/reorder common fields. | Existing editor palette/canvas/properties support field-level editing. |
| Publish/share | Publish a non-empty form and expose a public link. | Existing publish mutation snapshots fields and changes status. |
| Complete intake | Submit a public response with validation. | Existing public form and submit API cover this. |
| Review readiness | View response list/detail and mark status. | Existing response router and pages support this. |
| Export/handoff | Export responses as CSV. | Existing export builder and response page support this manual path. |
| Reuse/improve | Duplicate or regenerate forms and see basic counts. | Existing duplicate, regenerate, stats, and analytics cover early reuse. |

## Evidence Matrix

| Claim | Evidence Source | Evidence Type | Confidence |
| --- | --- | --- | --- |
| The story map should center on client-service intake/onboarding, not generic form creation. | `research/icp.md` approved primary ICP, trigger events, pain map, value drivers. | Approved research | High |
| The current product already covers a walking skeleton from draft to response export. | README core loop; `src/app/api/ai/generate/route.ts`; `src/server/trpc/routers/form.ts`; `src/app/api/submit/[slug]/route.ts`; `src/server/trpc/routers/response.ts`. | Observed code plus stated product boundary | High |
| AI-assisted drafting is valuable for blank-page setup but not enough for durable differentiation. | ICP blank-page pain; competitive analysis says AI creation is table stakes. | Approved research plus inference | High |
| Editing, preview, publish, immutable snapshots, public completion, and validation are core R1 stories. | Editor UI, publish mutation, form version schema, public form client, submit route. | Observed code | High |
| Post-submission readiness and handoff should be the main R2/R3 concern. | ICP manual copy/paste pain; competitive analysis handoff gap; service blueprint operational gap. | Approved research plus service blueprint | Medium-high |
| Broad integrations, API keys, billing, teams, and durable file storage should not dominate the walking skeleton. | README Fresh Start Bootstrap Note explicitly defers these until core loop validation. | Product boundary | High |
| Customer-feedback confidence remains limited. | No `research/customer-feedback.md`; service blueprint source gaps. | Source absence | High |

## Assumptions And Confidence Register

| Assumption | Status | Confidence | What Would Change It |
| --- | --- | --- | --- |
| Product-exists mode remains appropriate. | Supported by run manifest selection and observed product code. | High | User changes mode or scope. |
| Release labels are story-map slices, not committed engineering roadmap milestones. | Methodological assumption. | High | User requests roadmap/spec conversion. |
| CSV export is enough for the walking skeleton but not enough for durable ICP fit. | Inferred from ICP and competitive analysis. | Medium-high | Customer interviews show CSV/email is sufficient for repeated paid use. |
| Completeness/readiness matters before broad integrations. | Inferred from "chasing missing details/assets" and service blueprint gaps. | Medium | Discovery shows buyers primarily care about destination sync, not quality of answers. |
| Agent-operable handoff is a later candidate, not a near-term default. | Competitive analysis says Typeform MCP already exists and buyer demand is unvalidated. | Medium | Buyer evidence shows AI-forward agencies value workflow-specific MCP/CLI immediately. |

## Alternatives / Lower-Confidence Findings

- A feature-roadmap interpretation could push billing, teams, API keys, and durable storage earlier because the repo contains billing and experiments. This packet keeps those later because the README says to validate the core loop first and the ICP pain is intake/handoff, not account administration.
- A generic form-builder story map could emphasize templates, payments, signatures, and broad integrations. This packet keeps the backbone narrower because the approved ICP is client-service intake/onboarding.
- A handoff-first Release 1 could add one integration before deeper review readiness. That may be right after customer interviews, but current evidence does not identify the winning destination.

## Source Coverage Gaps

- No direct target-buyer interviews, usage analytics, support tickets, or win/loss notes.
- No customer evidence showing which handoff destination should come first.
- No observed completion-dropoff data for external clients.
- No proof that AI-generated intake questions are ready-to-send for specific service niches.
- No evidence yet on whether agent-first access is meaningful to nontechnical owner-operators.

## Proposed Canonical Artifact

If approved, write this working packet to:

- `research/journey-map-user-story-map.md`

Then the parent journey-map loop should infer both selected frameworks complete and move to synthesis on the next approved invocation.
