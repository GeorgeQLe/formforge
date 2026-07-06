# Preliminary Journey Map Research

> Review-stage working packet for `alignment/journey-map-formforge.html`.
> Date: 2026-07-06
> Status: review, pending final compiled YAML approval
> Canonical target after approval: `research/journey-map.md`

## Proposed Canonical Artifact

# Journey Map

> Based on: `research/journey-map-service-blueprint.md`, `research/journey-map-user-story-map.md`, `research/icp.md`, `research/competitive-analysis.md`, README/product boundary
> Date: 2026-07-06
> Mode: Product-Exists (grounded by code, customer-feedback-limited)
> Frameworks applied: Service Blueprint, User Story Map

## Summary

FormForge's unified customer journey centers on client-service intake: a consultant, coach, or small-agency operator needs a fast, polished way to collect the right client information before kickoff or delivery work. The current product loop already covers the walking skeleton from AI-assisted draft creation through public submission, response review, status triage, analytics, and CSV export.

The journey risk is not basic form creation. It is the post-submission transition from "a response arrived" to "this client is ready for kickoff or delivery." Both approved journey frameworks identify intake completeness, response readiness, and handoff into the user's real work system as the highest-leverage gaps. The evidence is strong that FormForge can support the minimum collection loop; confidence is lower on which handoff destination or follow-up workflow matters first because direct customer feedback is still missing.

## User Journeys

### Owner-Operator Consultant / Coach

Entry point: a new paid client, program, discovery call, audit, or package requires structured intake.

Core use case: create a useful intake form quickly, tailor it to the client or offer, send a credible public link, review the response, and move answers into delivery work.

Happy path:

1. Recognizes the intake need at the moment a client or offer becomes active.
2. Describes the needed form in plain language or starts manually.
3. Reviews and edits generated fields, required flags, help text, conditional logic, success messaging, and theme.
4. Publishes a versioned public form and shares the link with the client.
5. Client submits answers without a FormForge account.
6. Provider receives notification, reviews the response, marks status, and exports or copies answers into project docs, CRM, Notion, Sheets, kickoff notes, or another work system.
7. Provider duplicates, regenerates, or adapts the form for the next client.

Decision points:

- Is the generated draft complete enough to send?
- Does the public form look professional enough for premium client work?
- Did the client provide the assets, context, access, and preferences needed for kickoff?
- Is CSV/email enough, or does the provider need a cleaner handoff into delivery systems?

Failure modes:

- AI output misses service-specific questions.
- Client submits incomplete or unclear answers.
- File, asset, access, or stakeholder details are missing.
- Response notification fails or is missed.
- User still copy/pastes answers across multiple tools after submission.

### Agency / Operations Coordinator

Entry point: repeated client onboarding, project briefs, or service-specific intake across accounts.

Core use case: standardize intake enough for repeat work while preserving client-specific tailoring.

Happy path:

1. Starts from a prior form, generated draft, or manual template.
2. Edits fields and settings for the current client/service.
3. Publishes a stable link and collects responses from external stakeholders.
4. Reviews readiness across multiple responses or projects.
5. Exports answers or routes them into the agency's operating system.
6. Improves the intake base over time using duplicate, regenerate, analytics, and response patterns.

Decision points:

- Is this form reusable or a one-off?
- Which answer gaps delay delivery most often?
- Which downstream handoff destination should become the standard?

Failure modes:

- Repeated submissions accumulate but do not become delivery-ready artifacts.
- Broad integrations are requested before the highest-value destination is known.
- Teams, templates, and API expectations arrive before the core loop is validated.

### External Client / Respondent

Entry point: receives a public intake link from the provider.

Core use case: provide information, files, preferences, links, and constraints with minimal friction.

Happy path:

1. Opens the public form without creating an account.
2. Sees only relevant fields when conditional logic applies.
3. Completes required fields and fixes validation errors inline.
4. Receives a success message or redirect.
5. Does not need a follow-up email for information the form should have captured.

Failure modes:

- Required fields or file requests are unclear.
- Turnstile, validation, or mobile friction blocks completion.
- Submitted answers satisfy field validation but are not useful enough for the provider's actual work.

## Customer Lifecycle

| Stage | User State | Product Touchpoints | Evidence | Confidence |
| --- | --- | --- | --- | --- |
| Trigger | A provider needs a client intake artifact for a new client, offer, cohort, audit, or project. | Marketing promise, dashboard entry, create-new-form path. | ICP trigger events; Service Blueprint trigger stage; User Story Map activity backbone. | High |
| Discovery | User compares basic/free forms, polished builders, and client-service suites. | README product boundary; future positioning/onboarding. | Competitive analysis: free builders, general form platforms, HoneyBook/Dubsado suite pressure. | Medium-high |
| Evaluation | User decides whether a focused intake builder is faster and lighter than generic forms or suites. | First-use promise: describe, generate, edit, publish, submit, review/export. | ICP value drivers; competitive gap hypothesis. | Medium |
| Onboarding | User signs in and starts a form. | Auth/dashboard routes; plan-limit-backed form creation. | Service Blueprint sign-up/workspace stage. | High for product support, low for customer behavior evidence |
| Aha Moment | User describes the client/project and sees a good-enough form draft in minutes. | AI generation route and structured form creation. | ICP blank-page pain; README core loop; User Story Map draft activity. | Medium-high |
| Configuration | User edits fields, settings, conditional logic, theme, notifications, limits, and success behavior. | Editor, field palette, properties, settings, publish flow. | Service Blueprint visual edit stage; User Story Map tailor activity. | High |
| Publish | User creates a stable public link and shares it. | Publish mutation, form version snapshots, public route. | Service Blueprint publish stage; User Story Map publish/share activity. | High |
| Transaction | If paid conversion is relevant, value should connect to repeated client work, not generic AI forms. | Stripe exists but README says defer billing until core loop validation. | README billing deferral; competitive free-tier pressure. | Medium |
| Client Completion | External respondent completes the public form. | Public form renderer, validation, Turnstile, conditional fields, success/redirect. | Service Blueprint respondent completion; User Story Map complete-intake stories. | High for product support, medium for friction assumptions |
| Review | Provider reviews responses, statuses, stats, analytics, and field answers. | Response router, response list/detail, status labels, bulk update, analytics. | Service Blueprint response review; User Story Map review readiness. | High |
| Handoff | Provider moves answers into project docs, CRM, Notion, Sheets, kickoff notes, or service workflow. | CSV export, notification email, manual process. | ICP manual copy/paste pain; competitive integration battleground; both framework gaps. | Medium-high |
| Retention | User duplicates, regenerates, adapts, closes, monitors, and improves forms across clients/offers. | Duplicate, AI regenerate, response counts, analytics, themes. | Service Blueprint retention/reuse; User Story Map reuse/improve. | Medium-high |
| Expansion | Agency/team/library/integration/API depth may matter after the loop is validated. | Billing and deferred infrastructure notes. | User Story Map R3+ candidates; README deferred scope. | Medium |
| Advocacy | User recommends FormForge if intake becomes visibly faster, more professional, and less follow-up-heavy. | No current explicit advocacy surface. | Inferred from ICP value drivers; no direct evidence. | Hypothesized |
| Churn | User leaves if generic builders are good enough, suites absorb the workflow, AI drafts disappoint, or handoff remains manual. | Competing alternatives and current handoff thinness. | Competitive risks; Service Blueprint handoff gap. | Medium-high |
| Recovery | User needs clear error handling, notification reliability, and follow-up paths after failed submissions or incomplete answers. | Error pages, submit-route validation errors, notification logging. | Service Blueprint support/failure recovery; User Story Map failure visibility stories. | Medium |

## Critical Moments

| Moment | Why It Wins Or Loses The User | Supporting Evidence | Confidence |
| --- | --- | --- | --- |
| First useful AI draft | If the generated form is close enough, FormForge beats blank-page setup; if it is generic or weak, the user returns to templates or prior forms. | ICP blank-page pain; AI generation implementation; User Story Map draft activity. | Medium-high |
| Pre-publish confidence | The user must trust that the form captures the right service-specific details before sending it to a client. | Service Blueprint publish quality gap; User Story Map preview/completeness stories. | Medium |
| Respondent completion | The external client must complete the form without account friction, validation confusion, or unclear asset requests. | Public form and submit route; ICP respondent friction; User Story Map complete-intake activity. | Medium-high |
| Response readiness | The provider must know whether the answer set is complete enough for kickoff or delivery. | Service Blueprint response-review bottleneck; User Story Map readiness-signal stories. | Medium-high |
| Handoff into real work | The journey only becomes operationally valuable when answers reach project docs, CRM, Notion, Sheets, kickoff notes, or the delivery workflow. | ICP manual copy/paste pain; competitive integration battleground; both journey frameworks. | Medium-high |

## Evidence Matrix

| Claim | Supporting Framework(s) | Evidence | Confidence |
| --- | --- | --- | --- |
| The journey should focus on client-service intake/onboarding, not generic form creation. | Service Blueprint, User Story Map | Approved ICP and both framework summaries center on consultants, coaches, and small agencies. | High |
| FormForge currently supports the walking skeleton from draft to public submission and CSV export. | Service Blueprint, User Story Map | README core loop; framework evidence from AI generation, editor, publish snapshots, public submit, response router, and export. | High |
| AI-assisted drafting is useful but not durable differentiation by itself. | User Story Map | ICP blank-page pain plus competitive analysis showing AI creation across incumbents. | High |
| Intake completeness and response readiness are core journey risks. | Service Blueprint, User Story Map | Framework gap analysis highlights weak pre-publish quality checks, missing completeness scoring, and follow-up needs. | Medium-high |
| Post-submission handoff is the highest-value unresolved stage. | Service Blueprint, User Story Map | ICP manual copy/paste pain; competitive integrations; current CSV/email-only boundary. | Medium-high |
| Billing, teams, APIs, webhooks, and broad integrations should wait until the core loop and first handoff need are validated. | User Story Map, Service Blueprint | README deferral note; story-map release slicing; competitive breadth risk. | Medium-high |
| Direct customer evidence is still the largest confidence gap. | Service Blueprint, User Story Map | No `research/customer-feedback.md`, interviews, analytics, support tickets, or win/loss notes. | High |

## Stage Detail Index

| Detail Artifact | Coverage |
| --- | --- |
| `research/journey-map-service-blueprint.md` | Operational stages, front-stage/backstage/support processes, lines of visibility, fail points, wait points, bottlenecks, and handoff gaps. |
| `research/journey-map-user-story-map.md` | Activity backbone, user tasks, release slicing, walking skeleton, R2/R3+ story candidates, and readiness/handoff story gaps. |
| `research/icp.md` | Approved ICP, trigger events, current-state journey, pain map, value drivers, and willingness-to-pay signals. |
| `research/competitive-analysis.md` | Competitive alternatives, free-tier pressure, suite gravity, AI commoditization, integration battleground, and client-intake whitespace hypothesis. |

## Journey Gaps

| Gap | Why It Matters | Suggested Owner After Approval |
| --- | --- | --- |
| Direct customer evidence | Current journey confidence is based on approved research, product code, and competitive evidence, not target-buyer interviews or usage data. | Customer feedback/discovery before hardening roadmap assumptions. |
| First-success instrumentation | The journey cannot yet prove first prompt, first publish, first response, first export, or repeat-use behavior. | `lifecycle-metrics` if measurement must precede product-loop decisions. |
| Intake completeness criteria | Field validation does not prove the response is useful enough for kickoff or delivery. | `onboarding-map` if activation/first-success criteria need sharper definition. |
| Handoff destination priority | Evidence says handoff matters, but not whether Sheets, Notion, CRM, Zapier/Make, webhooks, project docs, or agent-operable access should come first. | `conversion-map`, `retention-map`, or customer interviews depending on whether the blocker is purchase proof, repeat use, or workflow retention. |
| Notification/support recovery | Missed notifications, failed submissions, and incomplete responses lack a visible recovery workflow. | `lifecycle-metrics` or support research if reliability risk blocks validation. |

## Product Path Implications

The active flat FormForge path remains appropriate. The journey evidence does not promote deferred product paths. Lead/quote, event registration, nonprofit volunteer, and HR operations flows still imply materially different lifecycle stages, operational states, or willingness-to-pay constraints and should remain parked unless customer evidence changes the active intake scope.

## Next Steps

After approval and canonical write, the first likely downstream blocker is lifecycle instrumentation and stage metrics. The synthesis exposes unresolved first-prompt, first-publish, first-response, first-export, handoff, and readiness signals that affect whether FormForge can validate the client-intake loop before positioning and UX choices harden.

## Evidence Coverage And Assumptions

| Topic | Coverage | Confidence | Caveat |
| --- | --- | --- | --- |
| Active ICP | Approved `research/icp.md` | High | ICP is desk-research-backed, not interview-confirmed. |
| Product loop support | README and prior framework code checks | High | This synthesis did not re-run code inspection beyond approved intermediates. |
| Competitive pressure | Approved `research/competitive-analysis.md` | Medium-high | Pricing and feature facts are time-sensitive. |
| Handoff priority | ICP + competitive + both journey frameworks | Medium-high | Exact destination priority is unknown. |
| Customer behavior | Source absence | Low-medium | No direct feedback, analytics, or support evidence exists. |

## Proposed File Changes

On approval:

- Write canonical `research/journey-map.md` with the approved synthesis.
- Archive `research/_working/preliminary-journey-map-research.md` under `docs/history/archive/YYYY-MM-DD/HHMMSS/research/_working/preliminary-journey-map-research.md`.
- Archive consumed `research/_working/journey-map-run.yaml` under `docs/history/archive/YYYY-MM-DD/HHMMSS/research/_working/journey-map-run.yaml`.
- Remove active working packet and run manifest after archive.
- Update `research/.progress.yaml` active FormForge `pipeline_stage` to `journey-map`.
- Convert `alignment/journey-map-formforge.html` to confirmed with the approval record preserved.

Do not write canonical research until final compiled YAML approval.
