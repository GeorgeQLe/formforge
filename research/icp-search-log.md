# FormForge ICP Search And Evidence Log

Status: confirmed
Date confirmed: 2026-06-15
Source alignment page: `alignment/icp-formforge.html`
Source working packet archived at: `docs/history/archive/2026-06-15/105625/research/_working/preliminary-icp-research.md`

## Approval Record

Final compiled approval YAML approved:

- Flat FormForge scope and current product boundary.
- Candidate A as the primary ICP: client-service consultants, coaches, and small agencies doing client intake/onboarding.
- Evidence coverage as sufficient for canonical ICP writing.
- `research/.progress.yaml` creation with deferred/revisit product paths and no product directories.
- Canonical writes to `research/icp.md`, `research/icp-search-log.md`, and optional `research/.progress.yaml`.

No section feedback or clarification requests were included.

## Source Context

### Repo Evidence

- `research/concept-brief.md` defines FormForge as an AI-assisted form builder for quickly creating public forms: describe the needed form, review generated fields, edit visually, publish a public link, receive submissions, and review/export responses.
- `research/concept-brief.md` frames the broad beneficiary hypothesis as "individuals and small teams," but explicitly says this is not yet an ICP selection.
- `src/server/ai/generate-form.ts` shows the implemented AI wedge: prompt to structured form definition with title, description, field types, validation, options, and conditional logic hints.
- `src/app/page.tsx` presents the product to unauthenticated users as natural-language form creation plus drag-and-drop editing and response analytics.
- `tasks/todo.md` and `README.md` show an older/broader product surface with billing, collaboration/API experiments, file uploads, analytics, Turnstile, versioning, themes, and i18n-related work. The concept brief explicitly warns not to rebuild that old app feature-for-feature before ICP validation.

### Product Boundary Used

The research treats the current viable product promise as:

1. A form creator describes a form.
2. AI drafts a usable form structure.
3. The creator edits it visually.
4. The creator publishes a public link.
5. Respondents submit.
6. The creator reviews or exports responses.

Deferred or unproven surfaces include full CRM ownership, contract/payment flows, client portals, durable integrations, quote-estimator engines, event check-in, volunteer schedule management, HR compliance workflows, and enterprise procurement.

## Marketplace Side Preflight

FormForge is not a marketplace. It is primarily B2B SaaS with product-led/self-serve adoption and some prosumer/solo-operator usage.

Material sides:

- Customer/buyer side: the person or small team creating forms and reviewing responses.
- User side: often the same as the buyer in solo and small-team segments; sometimes an ops/admin teammate uses the tool after the owner chooses it.
- Respondent side: clients, leads, attendees, volunteers, applicants, or customers who complete the form. Respondents do not pay FormForge, but their experience changes customer value because poor completion, confusion, or missing details damage the creator's workflow.

Excluded side:

- Respondents are not treated as ICP candidates because they are not the customer side for this product. Their needs are captured as value drivers and risks inside each buyer/customer ICP.

Business model classification:

- Primary: B2B SaaS (PLG/self-serve).
- Secondary: B2C/prosumer edge for solo consultants, coaches, creators, and operators.
- Not classified as marketplace/platform, B2B2C, open-core, or API/developer-first for the initial ICP.

Evidence:

- The concept brief and code show a self-serve builder and public form loop.
- Typeform, Tally, Jotform, Fillout, Paperform, Pixelform, HoneyBook, and Dubsado all show self-serve pricing or free-trial patterns for adjacent buyers.
- Typeform and Jotform have added AI form creation, which means "AI form generation" is no longer unique by itself.
- Tally's free/unlimited positioning and the number of low-cost Typeform alternatives mean generic form building is highly price competitive.

## Broad Research Queries And Findings

Minimum broad-query requirement met: 12+ query strategies before final candidate prioritization.

| Query strategy | Representative query | Finding |
| --- | --- | --- |
| AI form-builder landscape | `AI form builder generate forms natural language Typeform Jotform Fillout Tally Paperform pricing features 2026` | AI generation is now an expected feature in major and newer form tools, not a standalone moat. |
| Generic alternatives/pricing | `form builder alternatives Typeform Jotform Tally Fillout pricing submission limits free plan 2026` | The market has many free or low-cost competitors; response limits, branding, and advanced logic are common switching triggers. |
| Client intake | `client intake forms consultants coaches agencies pain points onboarding questionnaire tools Dubsado HoneyBook Paperform Typeform` | Intake is tied to paid work, professional first impressions, missing client details, and repeated onboarding workflows. |
| Small-business lead/quote forms | `small business quote request lead capture forms pain points online forms CRM follow up` | Lead/quote use cases have strong economic urgency but quickly require lead scoring, estimates, CRM/pipeline, and immediate follow-up. |
| Event registration | `event registration form software pain points small event organizers RSVP registration forms attendee data exports` | Event organizers need structured registration data, capacity/waitlist controls, reminders, attendee roster, and exports. |
| Nonprofit/volunteer forms | `volunteer signup form software nonprofit pain points volunteer coordinators Google Forms Jotform pricing discounts` | Nonprofits and schools have real operational pain but strong free/discount expectations. |
| No-code/natural-language research | `AI no code form builder natural language workflow automation non technical users research 2025` | Research and user sentiment support natural language as helpful for non-experts, but real workflows still need review/editing and integration clarity. |
| Official pricing/WTP | `Typeform pricing responses per month Basic 2026 official`, `Jotform pricing free plan submissions forms 2026 official`, `Tally pricing free plan unlimited forms submissions 2026 official`, `Fillout pricing free plan submissions forms AI form builder 2026 official` | Paid alternatives prove budget existence, but free tiers and cheap alternatives create pricing pressure for generic use. |
| Client-intake competitors | `client intake form builder consultants agencies onboarding questionnaire pain points Dubsado HoneyBook Typeform Reddit 2026` | Specialized intake tools market around fewer emails, collecting assets/files, professional onboarding, and avoiding migration to all-in-one suites. |
| Lead/quote competitors | `quote request form software home services small business lead capture follow up pain 2026` | Quote tools emphasize estimates, lead tracking, status, and reminders more than form creation alone. |
| Event/community signup competitors | `event registration software small organizers RSVP forms attendee roster Google Sheets export pain 2026` | Event/signup tools emphasize no-login respondents, reminders, waitlists, slots, rosters, and Google Sheets. |
| HR/internal ops | `HR job application form builder small business hiring screening forms pain Jotform Typeform 2026` | HR forms have strong use cases, but compliance, e-signature, routing, and HRIS/ATS fit become blockers earlier. |

## ICP Candidate Shortlist

### Candidate A - Client-service solo consultants, coaches, and small agencies doing client intake/onboarding

Who they are:

- Independent consultants, business/health/executive coaches, boutique agencies, creative studios, fractional operators, accountants/bookkeepers, and similar service providers that need structured information before kickoff or recurring client work.

Pain evidence:

- Intake affects paid work directly: missing details delay kickoff, create rework, and make the provider look unprofessional.
- Specialized competitors frame the problem as scattered onboarding emails, client document collection, asset collection, manual copy/paste, response limits, and poor client experience.
- The pain repeats every time a provider launches a new service, signs a new client, updates an onboarding process, or runs a new cohort/program.

Accessibility:

- High. These buyers are often owner-operators or small teams, search for templates/tools, and can self-serve.
- They use public links, Squarespace/WordPress/Kajabi embeds, Google Sheets, Notion, HoneyBook, Dubsado, and Zapier-style workflows.

Value potential:

- High enough for early focus because the form supports revenue delivery and avoids manual follow-up.
- AI drafting matters because service intake varies by offer, client type, and deliverable.

WTP signal:

- Moderate to strong. Adjacent spend exists across Typeform, Paperform, Pixelform, HoneyBook, Dubsado, intake/client-portal products, and automation stacks.
- WTP is strongest for users who see the form as part of a client experience and delivery workflow, not merely as a survey.

Risks:

- If FormForge remains only a generic form builder, Typeform/Tally/Jotform/Fillout are difficult to beat.
- Some users want all-in-one contracts, payments, schedulers, portals, reminders, and CRM. The early ICP must be the subset that wants better intake without migrating their whole business system.

Current rank: 1.

### Candidate B - Small service businesses using quote/lead qualification forms

Current rank: 2 as a revisit/pivot candidate, not primary.

Evidence summary:

- Economic pain can be high: slow follow-up, poor lead quality, incomplete project details, and quotes going cold.
- Competitors market around instant estimates, lead status tracking, automatic reminders, CRM handoff, and lead pipelines.
- This quickly becomes a quote-estimator/CRM product, not just an AI form builder.

### Candidate C - Small event organizers and community operators

Current rank: 3.

Evidence summary:

- Registration data, rosters, capacity limits, reminders, no-login access, mobile completion, and exports matter.
- Buying can be episodic and often tied to one event cycle.
- The best product for this segment is usually more signup/event-management-specific: capacity, slots, waitlists, reminders, attendee edits, check-in, payments, and rosters.

### Candidate D - Nonprofits, schools, and volunteer coordinators

Current rank: 4.

Evidence summary:

- Digital forms reduce paper/spreadsheet overhead, coordinate volunteers, and collect donation/event data.
- Nonprofit-oriented vendors emphasize volunteer signups, donations, event registration, Mailchimp/CRM/Sheets integrations, discounts, and supporter data.
- Discounting and free alternatives are central in this category.

### Candidate E - Internal HR/ops teams at small businesses

Current rank: 5.

Evidence summary:

- HR and operations form builders market around employee lifecycle, job applications, e-signatures, policy acknowledgments, applications, reviews, and internal process automation.
- Internal ops users often need permissions, e-signatures, routing, records, HR/ATS/HRIS integrations, compliance, and secure storage.
- The path drifts toward HR workflow software rather than a lightweight public form builder.

## Primary ICP Selection

Recommended and approved primary ICP:

Client-service solo consultants, coaches, and small agencies doing client intake/onboarding.

Why this is the strongest first-principles fit:

1. The workflow is repeated and variable. Each new client, offer, project, cohort, audit, or program can require a different intake form.
2. The value is tied to paid delivery, not abstract data collection. Missing intake data delays kickoff, creates rework, or hurts the client experience.
3. The buyer and user are close together. Owner-operators and small teams can self-serve without enterprise procurement.
4. The respondent experience matters. Their clients are external and often paying; a polished form is part of the provider's perceived professionalism.
5. The current FormForge loop can satisfy a meaningful first slice without becoming a CRM, event platform, donation processor, or HR system.
6. WTP evidence is better than generic forms because the segment already buys adjacent tools: Typeform/Paperform for polish, HoneyBook/Dubsado for client workflows, Pixelform/intake tools for intake-specific needs, and Zapier/Sheets/Notion for handoff.

Strongest caveat:

- FormForge should not position the initial ICP as "anyone who needs forms quickly." That puts it against free/low-cost general form builders and makes AI generation a commodity feature.
- The sharper problem is "client-service operators need a usable, professional intake flow fast, without manually building forms or migrating their whole workflow stack."

## Value x Accessibility Scoring

Scores are 1-5. Value combines pain intensity and WTP quality but keeps them separate in the rationale.

| Candidate | Pain intensity | WTP quality | Accessibility | Product-fit risk | Overall | Rank |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Client-service consultants/coaches/agencies | 4.4 | 4.0 | 4.3 | 4.1 | 4.2 | 1 |
| Small-service lead/quote forms | 4.5 | 4.2 | 3.6 | 2.8 | 3.8 | 2 |
| Event/community organizers | 3.8 | 3.0 | 3.5 | 3.1 | 3.4 | 3 |
| Nonprofits/schools/volunteer coordinators | 3.9 | 2.4 | 3.2 | 3.0 | 3.1 | 4 |
| Internal HR/ops small teams | 3.4 | 3.3 | 2.7 | 2.6 | 3.0 | 5 |

Scoring rationale:

- Candidate A has lower maximum economic upside than quote/lead forms, but much better fit to FormForge's first validated loop.
- Candidate B has strong pain and WTP, but the value driver is often quote/lead workflow after submission, not form creation. That makes it a stronger pivot/revisit path than the primary ICP.
- Candidate C has clear workflow pain but episodic buying and signup-specific needs.
- Candidate D has high operational friction but weaker WTP because of discounts, free tools, and budget constraints.
- Candidate E has real form needs but trust/compliance/workflow routing requirements create early adoption friction.

## Evidence Matrix

| Claim | Evidence | Inference | Confidence | Assumption status | Decision impact |
| --- | --- | --- | --- | --- | --- |
| Generic AI form generation is no longer enough as a wedge. | Typeform pricing includes AI-powered form creation; Typeform help explains AI creation/editing; Jotform and Fillout expose AI form builder surfaces; newer AI-native competitors exist. | AI is becoming table-stakes in form builders. FormForge needs an ICP-specific job, not generic AI. | High | Evidence-backed | Approve narrow ICP, not "anyone needing forms". |
| Generic form builders are price competitive. | Tally offers unlimited forms/submissions for free within fair use; Jotform free starter exists but pushes upgrades for limits; Typeform paid plans include strict response tiers. | Users comparing generic form tools will anchor against free/cheap alternatives. | High | Evidence-backed | Do not select an ICP whose only pain is "forms take time." |
| Client-service intake has stronger early fit than generic SMB forms. | Pixelform, Dashform, Intake, Agencify, Brieform, HoneyBook, and Dubsado all target client intake/onboarding, assets, forms, lead forms, templates, and client workflows. | There is a visible cluster of tools around professional intake and client workflow. | Medium-high | Evidence-backed | Select Candidate A unless user has a strong strategic constraint. |
| Candidate A has WTP beyond free tools. | HoneyBook starts with paid client-experience plans; Dubsado annual plans include lead capture/forms; Pixelform charges for coach-focused intake; Typeform/Paperform/Fillout/Jotform paid tiers exist. | Service providers already pay for adjacent polish, client workflow, and forms. | Medium-high | Evidence-backed | Candidate A has credible paid adoption path. |
| The strongest Candidate A risk is after-submission workflow. | Reddit and competitor pages repeatedly frame forms as only the first step; users discuss Zapier/Sheets/Notion/CRM, follow-up, assets, and client portals. | FormForge must validate whether first-loop form/export is enough or whether users immediately require workflow handoff. | Medium | Provisional | Discovery should ask about minimum acceptable post-submission workflow. |
| Lead/quote forms have high value but lower fit to current loop. | ScopeForm, Quotify, Quoterform, Quote Box, Requo, and service-business lead tools emphasize estimates, status, reminders, CRM/follow-up. | The value is tied to lead conversion and quoting, not just form creation. | Medium-high | Evidence-backed | Park as revisit candidate; do not make primary without pivot. |
| Event/community organizers need signup-specific operations. | Formgrid, Signup Haven, Lome, SignUpVibe, EventForm, and Reddit examples emphasize rosters, reminders, waitlists, capacity, no-login, and Sheets sync. | Generic form creation is insufficient when signup logistics matter. | Medium-high | Evidence-backed | Keep Candidate C secondary. |
| Nonprofit/school/volunteer segments have real pain but weaker WTP. | Jotform nonprofit, Gravity Forms nonprofit, SureForms nonprofit, Lome, and Signup Haven all target the segment with discounts/free trials and low-cost signup tooling. | Discount/free expectations reduce early monetization quality. | Medium | Evidence-backed | Defer unless mission/brand strategy prioritizes this segment. |
| HR/internal ops has real need but higher trust/compliance burden. | Jotform HR, Typeform HR/application pages, HR form builders, and user discussions mention e-signature, approvals, employee lifecycle, job applications. | The product would need routing, records, signatures, and compliance earlier. | Medium | Evidence-backed | Keep lower-ranked. |
| US small business base is large enough; narrow SAM remains uncertain. | SBA reports 36.2M US small businesses and 4.88M small Professional/Scientific/Technical Services businesses. | Enough top-down market exists, but serviceable market must be narrowed by use case and repeated intake frequency. | Medium | Partially inferred | Market size should not drive primary selection alone. |

## Source Coverage By Category

Competitors/general form builders:

- Typeform pricing and AI docs.
- Jotform pricing and AI/form-builder docs.
- Tally pricing/help.
- Fillout pricing and AI tool surfaces.
- Paperform/Formgrid/Tally comparison pages.

Client intake/client workflow:

- Pixelform for coaches.
- Dashform client onboarding.
- Intake document collection.
- Agencify agency onboarding.
- HoneyBook and Dubsado pricing/features.
- Brieform/Formaloo/Agency Handy-style client-intake pages.
- Reddit/anecdotal threads on agency/client onboarding and all-in-one migration friction.

Lead/quote:

- ScopeForm.
- Quotify.
- Quoterform.
- Quote Box.
- Requo/Zaplify-style follow-up tools.
- Reddit/anecdotal lead follow-up discussions.

Events/community:

- Formgrid event registration.
- Signup Haven.
- Sendtable/Lome/SignUpVibe/EventForm/SignMeUp.
- Reddit/anecdotal event registration needs.

Nonprofits/volunteer:

- Jotform nonprofit.
- Gravity Forms nonprofit.
- SureForms nonprofit.
- Donorfy/GiveForms/Lome/Signup Haven.
- Reddit/anecdotal volunteer signup discussions.

HR/internal ops:

- Jotform HR form builder.
- Typeform HR/application pages.
- HR form templates/builders.
- Reddit/anecdotal approval/e-signature needs.

Market sizing:

- SBA 2025 small business count and industry profile.
- BLS event planner occupational outlook.
- Independent Sector nonprofit sector count.

Research and user behavior:

- AIAP no-code workflow builder paper.
- Reddit/anecdotal threads on no-code AI automation complexity.

## Source Coverage Gaps

- No first-party customer interviews or proprietary FormForge usage logs.
- Named-account sizes for Candidate A are illustrative and need verification before outbound.
- SAM/SOM estimates are inferred from broad datasets and competitor presence, not from a dedicated market-sizing dataset.
- Pricing sensitivity is based on competitor pricing and user sentiment, not FormForge-specific willingness-to-pay tests.
- Compliance constraints for accounting, legal, health/wellness, education, and HR need deeper validation before targeting those subsegments.
- This research did not inspect G2/Capterra reviews deeply because public access and recency vary; doing so could improve user-language evidence.

## Assumptions And Confidence Register

| Assumption | Confidence | Evidence status | What would change it |
| --- | --- | --- | --- |
| Client-service intake is the best initial ICP. | Medium-high | Supported by competitor cluster and product-fit reasoning. | Interviews show buyers need portals/contracts/payments before forms matter. |
| AI drafting is valuable when forms vary by service/client. | Medium | Supported by AI builder adoption and no-code research. | Users say templates are enough and AI adds little. |
| Post-submission workflow is the biggest risk for Candidate A. | Medium-high | Supported by user sentiment and competitor positioning. | Users accept CSV/export/manual handoff for first version. |
| Generic small-business lead forms are too broad. | High | Supported by quote/lead tool specialization. | A narrow vertical emerges with form-only pain and low CRM need. |
| Nonprofit/volunteer WTP is weaker. | Medium | Supported by discounts/free/ad-free competitors. | Discovery finds budget-backed nonprofit operations segment with urgent paid need. |
| HR/internal ops is not a good first ICP. | Medium | Supported by compliance/routing/e-signature needs. | A low-compliance internal ops segment emerges with simple public-form needs. |
| English-speaking service businesses are the first geographic focus. | Medium | Based on current product/language and discovery practicality. | User has proprietary evidence of another geography/language opportunity. |

## Rejected Or Lower-Confidence Findings

- "Target everyone who dislikes Typeform pricing." Rejected because Tally and many alternatives already compete on free/cheap form building.
- "Target nonprofits first because they need many forms." Lower confidence because budgets and free/discount expectations weaken WTP.
- "Target event organizers first." Lower confidence because event/signup workflows require slots, waitlists, reminders, and rosters earlier than client intake.
- "Target local service quote forms first." Lower confidence as primary because the best version is likely quote-estimator/CRM-adjacent.
- "Target HR forms first." Rejected for early ICP due to compliance, routing, signatures, and recordkeeping requirements.
- "AI generation alone is the value proposition." Rejected because incumbents and startups already offer AI form creation.
