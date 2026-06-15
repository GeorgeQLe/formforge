# Preliminary Customer Discovery Research - FormForge

Status: Stage 2 review working packet
Date: 2026-06-15
Skill: customer-discovery
Scope mode: flat `research/` single-product mode
Canonical files not written: `research/icp.md`, `research/icp-search-log.md`, `research/.progress.yaml`
Approved alignment page: `alignment/customer-discovery-formforge.html`

## Approval Boundary

This packet is the approved Stage 2 non-canonical research artifact for FormForge customer discovery. It uses the user-approved scope: fresh-start pre-product discovery for the describe, edit, publish, submit, and review loop.

This packet does not approve or write canonical artifacts. Stage 3 should only write canonical research after the user reviews the Stage 2 alignment page and provides final compiled approval YAML.

## Research Scope Approved

FormForge is treated as a fresh-start AI-assisted form builder prototype. The initial product loop is:

1. A creator describes the form they need.
2. AI drafts a usable form structure.
3. The creator reviews and edits fields visually.
4. The creator publishes a public link.
5. Respondents submit the form.
6. The creator reviews or exports responses.

Non-goals for this research stage:

- Do not rebuild the old app feature-for-feature.
- Do not make billing, teams, API access, webhooks, durable file storage, provider integrations, or full i18n part of the first validated loop.
- Do not select implementation architecture, schema, or UI spec.
- Do not write canonical `research/icp.md` until Stage 3 approval.

## Sources Used

### Repo Sources

| Source | Observation | Confidence |
| --- | --- | --- |
| `research/concept-brief.md` | Defines the fresh-start loop and broad beneficiary hypothesis of individuals and small teams. | High |
| `research/concept-brief-interview.md` | Records user confirmation that the broad concept and constraints were reasonable. | High |
| `research/_working/preliminary-icp-research.md` | Prior ICP packet used only as seed context, not canonical evidence. | Medium |
| `README.md` | Confirms the repo was desk-flipped and the new implementation should validate one core loop before deferred infrastructure. | High |
| `package.json` | Shows a built historical app stack, but the concept brief supersedes it for fresh-start product scope. | Medium |
| `tasks/todo.md` | Shows prior broad production surface and deferred feature pressure. Useful as cautionary context. | Medium |

### Web Sources Checked

| Source | Key evidence used | URL |
| --- | --- | --- |
| Typeform pricing | Core plans include AI-powered form creation, conditional logic, integrations, and response limits; Basic starts around $29/month monthly with 100 responses/month, Plus and Business expand responses and users. | https://www.typeform.com/pricing |
| Jotform pricing | Jotform positions a broad form platform with 35M+ users, 20,000+ templates, 150+ integrations, drag-and-drop, AI, payments, workflows, nonprofit and education discounts. | https://www.jotform.com/pricing/ |
| Tally pricing | Tally offers unlimited forms and submissions for free under fair-use guidelines; paid Pro starts at $24/month and adds branding, collaboration, partial submissions, analytics, custom domains, CSS, and integrations. | https://tally.so/pricing |
| Fillout pricing | Fillout includes unlimited forms on all plans, CSV export, integrations, field validation, conditional hiding, resume-in-progress forms, close dates, and advanced conversion/enterprise features. | https://www.fillout.com/pricing |
| HoneyBook home/pricing | HoneyBook targets small service businesses, consultants, coaches, creatives, and client-service operators with lead forms, questionnaires, CRM, proposals, contracts, payments, automations, and plans starting around $29/month annual. | https://www.honeybook.com/ |
| Dubsado home | Dubsado targets client-service entrepreneurs with lead capture, branded forms, questionnaires, proposals, contracts, client portals, workflows, invoices, and onboarding. | https://www.dubsado.com/ |
| Paperform home | Paperform positions as a form builder for SMBs with templates, payments, bookings, calculations, and workflow use cases. | https://paperform.co/ |
| Eventbrite/EventMobi public references | Event registration demand often includes ticketing, rosters, check-in, attendee apps, reminders, and event-specific workflows beyond simple forms. | https://www.eventbrite.com/ and https://eventmobi.com/ |

## Business Model And Side Coverage

FormForge is not a marketplace. The likely model is B2B SaaS with a product-led/self-serve motion and a prosumer edge.

Material sides:

- Buyer/creator: the person or small team that creates and reviews forms.
- Operator/user: often the same person in solo businesses; sometimes an assistant, coordinator, or operations teammate.
- Respondent: clients, leads, attendees, volunteers, customers, applicants, or community members who fill the form. Respondents influence value through completion quality but are not the paying ICP.

Excluded side:

- Respondents are not ranked as ICP candidates because they do not buy FormForge. Their needs should be captured inside buyer value drivers, especially mobile completion, trust, clarity, and error handling.

## Executive Findings

### Finding 1: The strongest early ICP is client-service solo operators and small service teams with repeated intake/onboarding needs.

Claim: Client-service providers have the best current combination of urgency, accessibility, repeated form variation, and willingness to pay.

Evidence:

- HoneyBook and Dubsado both organize their value around client relationships, lead capture, questionnaires, proposals, contracts, invoices, onboarding, and automation.
- HoneyBook lists consultants, coaches, agencies, creatives, event services, professional services, personal services, and home/real-estate services as business types.
- Dubsado explicitly ties branded forms, lead qualification forms, questionnaires, onboarding, workflows, and client portals to a polished client experience.
- The FormForge concept loop can produce value before full CRM replacement when scoped to intake/questionnaire creation plus response review/export.

Inference:

- This segment repeatedly needs forms that differ by service, offer, cohort, project type, or client context.
- The buyer is close to the work and can adopt self-serve tools without enterprise procurement.
- The submitted data directly affects paid delivery quality and client experience.

Confidence: Medium-high.

Decision impact:

- Stage 3 canonical research should likely make this the primary ICP, unless the user has contrary customer evidence.

### Finding 2: Generic AI form generation is a weak standalone wedge.

Claim: FormForge should not position only around natural-language form generation.

Evidence:

- Typeform pricing lists AI-powered form creation as a feature on core plans.
- Jotform advertises AI and a broad form-builder platform with a large template/integration surface.
- Tally and Fillout compete aggressively on free/unlimited usage and advanced form functionality, even without relying only on AI as the headline.

Inference:

- AI-assisted form creation is increasingly table stakes in the form-builder category.
- FormForge's defensible early promise needs to pair AI drafting with a narrower job: producing a professional intake/qualification form quickly enough to reduce follow-up, rework, and setup friction.

Confidence: High.

Decision impact:

- Treat "AI form builder" as mechanism. Treat "fast professional intake workflow for client-service operators" as the candidate value wedge.

### Finding 3: Lead/quote qualification is attractive but risks turning FormForge into CRM or quote-estimation software too early.

Claim: Small service businesses using quote or lead forms are a credible secondary candidate, but should be a revisit/pivot path.

Evidence:

- HoneyBook and Dubsado both tie lead capture to proposals, contracts, payments, workflows, and follow-up.
- FormForge's fresh-start constraints defer CRM, billing, provider integrations, webhooks, and full workflow automation.

Inference:

- Revenue urgency is strong, but the first useful product could be blocked by follow-up automation, lead status, quote logic, scheduling, CRM handoff, or vertical-specific estimate fields.
- The segment should be narrowed only after interview evidence identifies a vertical where a form-only first wedge is enough.

Confidence: Medium.

Decision impact:

- Keep as secondary/revisit candidate; do not broaden primary ICP to all lead forms.

### Finding 4: Event/community registration and nonprofit/volunteer coordination have real pain but weaker early-fit economics.

Claim: These segments are useful comparison cases but not the best primary ICP for FormForge's first loop.

Evidence:

- Event tools emphasize registration, ticketing, attendee lists, check-in, reminders, event pages, and analytics.
- Jotform and Fillout both offer nonprofit/education discounts, signaling price sensitivity and category-specific expectations.
- Tally offers unlimited forms/submissions for free, creating a high bar for generic signup/volunteer forms.

Inference:

- Event and nonprofit workflows can quickly require roster management, time slots, reminders, waiver/payment handling, volunteer scheduling, or donation systems.
- WTP is uneven, especially where groups are volunteer-led or budget-constrained.

Confidence: Medium.

Decision impact:

- Use these as lower-priority ICPs unless specific customer interviews show frequent paid pain without event-management or nonprofit CRM requirements.

### Finding 5: Internal HR/ops is less aligned with a lightweight public-form first loop.

Claim: HR/admin/internal ops teams may need forms, but the segment is a poor first ICP for this pre-product loop.

Evidence:

- Typeform and Jotform both serve HR/enterprise-oriented use cases with higher-plan security, team, compliance, and workflow features.
- FormForge fresh-start constraints defer enterprise security, team permissions, routing, and durable integrations.

Inference:

- Internal workflows often require approvals, permissions, compliance posture, records retention, HRIS/ATS integration, and auditability earlier than the core loop provides.

Confidence: Medium.

Decision impact:

- Do not choose internal HR/ops as the primary ICP without strong contrary evidence.

## ICP Candidate Ranking

| Rank | Candidate | Pain urgency | Access | WTP signal | Fit with first loop | Main risk | Confidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Client-service solo operators and small service teams doing intake/onboarding | High | High | Moderate-high | High | Some users want all-in-one CRM/contracts/payments | Medium-high |
| 2 | Small service businesses using lead/quote qualification forms | High | Medium-high | Moderate-high | Medium | Quickly becomes quote/CRM/follow-up software | Medium |
| 3 | Small event/community organizers | Medium | Medium | Mixed | Medium | Needs event-specific rosters, waitlists, reminders, tickets | Medium |
| 4 | Nonprofit/school/volunteer coordinators | Medium | Medium | Weak-mixed | Medium | Free/discount expectations and scheduling/donation needs | Medium-low |
| 5 | Small-business HR/admin/internal ops teams | Medium | Medium-low | Mixed | Low-medium | Compliance, permissions, internal routing, integrations | Medium-low |

## Primary Candidate: Client-Service Intake Operators

### Who They Are

Independent consultants, coaches, fractional operators, boutique agencies, creative studios, professional service providers, personal-service providers, and small client-service teams that need structured information before a paid engagement, cohort, project, consultation, or recurring service.

### Jobs To Be Done

- When a new lead or client needs to be qualified or onboarded, create a professional intake form quickly so the provider can collect enough context without a long email thread.
- When a service offer changes, update the intake questions without rebuilding the workflow from scratch.
- When a client submits information, review/export the responses and start delivery with fewer missing details.
- When a client first interacts with the business, make the intake experience feel credible and easy.

### Trigger Events

- Launching a new service, cohort, workshop, package, or consulting offer.
- Signing a new client or preparing kickoff.
- Repeatedly receiving incomplete lead/client information by email or calls.
- Switching away from Google Forms, Typeform, or a heavy CRM because the current setup is either too generic or too operationally heavy.
- Standardizing a messy manual onboarding workflow after enough client volume creates rework.

### Current Alternatives

- Google Forms or Microsoft Forms for free basic collection.
- Typeform, Jotform, Tally, Fillout, and Paperform for polished forms.
- HoneyBook, Dubsado, and similar client-flow suites for all-in-one CRM, proposals, contracts, payments, scheduling, and portals.
- Notion/Airtable/Sheets plus manual email follow-up.
- Custom website forms or embedded contact forms.

### Desired Outcomes

- Reduce time from "I need an intake form" to a usable published form.
- Improve completeness and quality of submitted client information.
- Make the form feel professional enough for external clients.
- Avoid migrating into a full business-management suite before the user wants one.
- Keep response review/export simple enough for solo operators and assistants.

### Value Drivers

- Faster setup for variable intake forms.
- Better first impression than a rough generic form.
- Less manual follow-up for missing details.
- Easier reuse/editing of form patterns across services.
- Lower cognitive load than full CRM/workflow suites.

### Adoption Risks

- If the product lacks branded appearance, users may stay with Typeform, Tally, Fillout, Paperform, HoneyBook, or Dubsado.
- If response handling is too thin, users may prefer tools with CRM, portal, or automation features.
- If AI output requires too much cleanup, the "fast" promise fails.
- If integrations are absent, some users may not accept export-only workflows.

## Secondary Candidates

### Lead/Quote Qualification Forms

This candidate has strong revenue urgency. It should be revisited when FormForge can test verticalized lead intake for a specific service category. The risk is that high-value lead forms often require quote estimation, scheduling, CRM status, reminders, or fast follow-up automation.

### Event And Community Registration

This candidate has clear form needs but a lower fit with a generic first loop. Event users often need capacity controls, waitlists, rosters, reminders, ticketing/payments, attendee edits, and check-in.

### Nonprofit And Volunteer Coordination

This candidate has operational pain but weaker WTP. Free/discounted tools are common, and workflows can need scheduling, donor/volunteer CRM, waivers, accessibility, and committee approval.

### Internal HR/Admin Ops

This candidate is likely too compliance- and integration-sensitive for the first lightweight public-form loop.

## Evidence Matrix

| Claim | Evidence | Inference | Confidence | Assumption status | Decision impact |
| --- | --- | --- | --- | --- | --- |
| Client-service intake is the strongest early ICP | HoneyBook and Dubsado center client-service workflows around leads, forms/questionnaires, onboarding, proposals, contracts, payments, portals, and automation; FormForge concept supports form creation/review/export. | Intake is tied to paid delivery and repeated setup, but FormForge can start below all-in-one CRM scope. | Medium-high | Needs direct interviews with consultants/coaches/agencies. | Select as primary candidate for Stage 3 unless user has contrary evidence. |
| AI generation alone is not enough | Typeform includes AI-powered form creation; Jotform includes AI and broad templates/integrations; Tally/Fillout compete with generous free/feature sets. | AI is a mechanism, not sufficient differentiation. | High | Assumes buyer sees comparable AI features as substitutes. | Position around job-specific speed and outcome, not "AI form builder" alone. |
| Lead/quote forms are attractive but risky | Client-service suites connect lead capture with proposals/contracts/payments/follow-up; FormForge defers CRM, billing, webhooks, and integrations. | Quote workflows may demand features outside the first loop. | Medium | Needs vertical-specific interview evidence. | Keep as revisit/pivot candidate. |
| Events/nonprofits are not first priority | Event tools emphasize ticketing/registration/check-in; Jotform/Fillout nonprofit discounts and Tally free unlimited suggest price pressure. | Pain exists, but WTP and workflow fit are less favorable. | Medium | Needs segment interviews before rejecting entirely. | Keep as lower-priority candidates. |
| HR/internal ops is poor first fit | Larger form tools sell HR/enterprise/security/workflow use cases; FormForge defers permissions, compliance, routing, integrations. | Internal ops buyers likely need trust and workflow depth earlier. | Medium-low | Could change for very small teams with simple forms. | Do not choose as primary ICP now. |

## Source Coverage And Gaps

Covered:

- Current official pricing/feature pages for Typeform, Jotform, Tally, Fillout.
- Current official positioning for HoneyBook, Dubsado, and Paperform.
- Repo concept, bootstrap interview, prior seed ICP packet, README, package state, and task backlog.
- Business model and side-coverage check.

Gaps:

- No direct customer interviews with consultants, coaches, agencies, event organizers, nonprofits, or HR/admin teams.
- No paid-search keyword data or conversion data for intake-specific searches.
- No Reddit/community quote mining included in this pass.
- No quantified market sizing by candidate.
- No direct tests of AI-generated form quality against real intake examples.
- No willingness-to-pay interviews for a FormForge-specific offer.

## Alternatives And Lower-Confidence Findings

- Alternative: choose small service lead/quote forms as primary. Rejected for now because the value is attractive but the first product likely needs quote logic and follow-up workflow sooner than the approved loop includes.
- Alternative: choose event/community registration as primary. Rejected for now because event management-specific requirements can overtake form creation.
- Alternative: choose nonprofits/volunteer coordinators. Rejected for now because WTP and budget friction look weaker.
- Alternative: choose generic "individuals and small teams." Rejected because it is too broad to guide discovery, messaging, or first product constraints.
- Lower-confidence finding: client-service users may accept export-only response handling before integrations. This requires interviews.

## Confidence Register

| Conclusion | Confidence | What would raise confidence | What would lower confidence |
| --- | --- | --- | --- |
| Primary ICP should be client-service intake operators | Medium-high | Interviews showing repeated intake setup pain and acceptance of a lightweight form-first tool | Interviews showing users demand all-in-one CRM/payment/portal features before switching |
| AI is not a standalone wedge | High | More competitor pages adding AI form generation | Discovery showing a niche where FormForge's AI quality is uniquely better |
| Lead/quote is secondary | Medium | Interviews showing quote flows require CRM/estimation/follow-up | A vertical where simple AI-generated qualification forms directly improve close rate |
| Events/nonprofits are lower priority | Medium | Evidence of low WTP or event-specific blocker needs | Evidence of frequent paid use cases without ticketing/scheduling/reminders |
| HR/internal ops is lower priority | Medium-low | Evidence of compliance/integration needs | Small teams using public-ish internal forms with low trust requirements |

## Proposed Canonical Artifact Changes For Stage 3

Only after final Stage 2 approval:

- Write `research/icp.md` with a canonical ICP report naming client-service intake operators as the recommended primary ICP, plus secondary/revisit candidates.
- Write `research/icp-search-log.md` with query/source/evidence notes from this and prior seed research, clearly marked by date and source class.
- Optionally update `research/.progress.yaml` only if the user wants parked secondary product paths. Default recommendation: do not create product paths yet.
- Archive this working packet under `docs/history/archive/YYYY-MM-DD/HHMMSS/research/_working/preliminary-customer-discovery-research.md`.
- Remove the active working packet after canonical artifacts are written.

## Stage 3 Approval Questions For Review Page

The Stage 2 alignment page should ask the user to approve or revise:

- Whether client-service intake operators are the right primary ICP candidate.
- Whether the source coverage is sufficient for canonical research.
- Whether the confidence labels and gaps are acceptable.
- Whether the proposed canonical paths are approved.
- Whether any glossary additions should be included.

## Glossary Candidates

| Term | Proposed definition |
| --- | --- |
| Client-service intake | A form-based workflow for collecting structured information from a lead or client before qualification, onboarding, kickoff, or delivery. |
| Respondent side | The non-paying party who fills out a form; important to product value but not the paying ICP for FormForge. |
| Form-first wedge | A narrow entry point where FormForge delivers value through faster form creation and response review before broader CRM/workflow features are added. |
