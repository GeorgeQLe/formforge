# Preliminary ICP Research Packet - FormForge

Status: review-stage working packet
Date: 2026-06-07
Skill: icp
Scope mode: flat `research/` single-product mode
Canonical files not written: `research/icp.md`, `research/icp-search-log.md`, `research/.progress.yaml`

## Approval Boundary

This packet rebuilds FormForge ICP research from first principles. It is a non-canonical working artifact. The intended post-approval canonical outputs are:

- `research/icp.md` - canonical ICP report using the required downstream parser headings.
- `research/icp-search-log.md` - raw query/source/evidence/scoring log.
- `research/.progress.yaml` - optional manifest entries for materially different deferred/revisit product surfaces if the user approves parking secondary paths.

No canonical research, spec, or task file has been written in this stage.

## Source Context

### Repo Evidence

- `research/concept-brief.md` defines FormForge as an AI-assisted form builder for quickly creating public forms: describe the needed form, review generated fields, edit visually, publish a public link, receive submissions, and review/export responses.
- `research/concept-brief.md` frames the broad beneficiary hypothesis as "individuals and small teams," but explicitly says this is not yet an ICP selection.
- `src/server/ai/generate-form.ts` shows the implemented AI wedge: prompt to structured form definition with title, description, field types, validation, options, and conditional logic hints.
- `src/app/page.tsx` presents the product to unauthenticated users as natural-language form creation plus drag-and-drop editing and response analytics.
- `tasks/todo.md` and `README.md` show an older/broader product surface with billing, collaboration/API experiments, file uploads, analytics, Turnstile, versioning, themes, and i18n-related work. The concept brief explicitly warns not to rebuild that old app feature-for-feature before ICP validation.

### Product Boundary Used For This Redo

The research treats the current viable product promise as:

1. A form creator describes a form.
2. AI drafts a usable form structure.
3. The creator edits it visually.
4. The creator publishes a public link.
5. Respondents submit.
6. The creator reviews or exports responses.

Deferred or unproven surfaces include full CRM ownership, contract/payment flows, client portals, durable integrations, quote-estimator engines, event check-in, volunteer schedule management, HR compliance workflows, and enterprise procurement.

## First-Principles Market Frame

Forms are not a standalone job. A form is an input boundary between someone who needs information and someone who has it. Demand becomes economically meaningful when the submitted information moves a paid or operational workflow forward.

The key selection question is therefore not "who needs forms?" Almost everyone does. The useful question is: "Which user repeatedly needs a new or modified public data-collection flow, suffers when setup or response handling is slow, can adopt self-serve software, and already has a reason to pay for better intake?"

From that frame, FormForge should prefer segments where:

- The form creator and budget owner are close to the work.
- Form setup is frequent or variable enough that AI drafting matters.
- The submitted information directly affects revenue, delivery quality, or avoidable labor.
- Respondents are external enough that the form must look professional and be easy to complete.
- The first useful workflow can survive with a link, response dashboard, export, file upload, notifications, and basic logic.
- The segment is not blocked from early adoption by HIPAA/FERPA/HR compliance, enterprise procurement, deep integrations, or specialized workflow infrastructure.

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

- If FormForge remains only a generic form builder, Typeform/Tally/Jotform/FIllout are difficult to beat.
- Some users want all-in-one contracts, payments, schedulers, portals, reminders, and CRM. The early ICP must be the subset that wants better intake without migrating their whole business system.

Current rank: 1.

### Candidate B - Small service businesses using quote/lead qualification forms

Who they are:

- Local services, contractors, studios, agencies, and B2B service businesses that use forms to capture inquiries, qualify leads, collect job details, and start a quote or booking process.

Pain evidence:

- The economic pain can be high: slow follow-up, poor lead quality, incomplete project details, and quotes going cold.
- Competitors market around instant estimates, lead status tracking, automatic reminders, CRM handoff, and lead pipelines.

Accessibility:

- High in theory because many small businesses self-serve and already use web forms.
- Lower for FormForge's current core because serious value often requires pricing logic, follow-up, CRM, SMS/email, and industry-specific qualification.

Value potential:

- High when tied to measurable lost leads or quote delays.

WTP signal:

- Moderate to strong in verticals where a closed job is valuable.

Risks:

- This quickly becomes a quote-estimator/CRM product, not just an AI form builder.
- Generic "small businesses needing lead forms" is too broad unless narrowed by vertical and trigger event.

Current rank: 2 as a revisit/pivot candidate, not primary.

### Candidate C - Small event organizers and community operators

Who they are:

- Workshop hosts, sports clubs, community groups, churches, PTAs, school groups, creator communities, and small business/event teams collecting registrations, RSVPs, waivers, dietary needs, session choices, or feedback.

Pain evidence:

- Registration data, rosters, capacity limits, reminders, no-login access, mobile completion, and exports matter.
- Event and signup competitors emphasize no-login respondents, waitlists, reminder emails/SMS, Google Sheets sync, and clean rosters.

Accessibility:

- Moderate. Many organizers search for lightweight tools and can share links.
- Buying can be episodic and often tied to one event cycle.

Value potential:

- Moderate to high during event cycles, but less frequent than client-service intake for many users.

WTP signal:

- Mixed. Business/professional events and sports/event programs may pay; community groups and PTAs often prefer free/ad-free/low-cost tools.

Risks:

- The best product for this segment is usually more signup/event-management-specific: capacity, slots, waitlists, reminders, attendee edits, check-in, payments, and rosters.

Current rank: 3.

### Candidate D - Nonprofits, schools, and volunteer coordinators

Who they are:

- Nonprofit staff, volunteer coordinators, school/PTA leaders, church admins, community groups, and small charity teams collecting volunteer applications, donation forms, event registrations, and supporter surveys.

Pain evidence:

- Digital forms reduce paper/spreadsheet overhead, coordinate volunteers, and collect donation/event data.
- Nonprofit-oriented vendors emphasize volunteer signups, donations, event registration, Mailchimp/CRM/Sheets integrations, discounts, and supporter data.

Accessibility:

- Moderate. The tools are familiar, and public links work.
- Buying is constrained by budgets, committees, nonprofit discounts, and free alternatives.

Value potential:

- Operational value is real, but economic urgency is less direct than revenue-related intake or lead qualification.

WTP signal:

- Weak to mixed. Discounting and free alternatives are central in this category.

Risks:

- This segment may require donation payments, volunteer scheduling, nonprofit CRM, compliance, accessibility, and low-cost/ad-free expectations.

Current rank: 4.

### Candidate E - Internal HR/ops teams at small businesses

Who they are:

- Small-business HR, admin, operations, and team leads who need job applications, onboarding forms, approval/request forms, employee feedback, and routine internal data collection.

Pain evidence:

- HR and operations form builders market around employee lifecycle, job applications, e-signatures, policy acknowledgments, applications, reviews, and internal process automation.
- User sentiment suggests Google Forms alone often cannot handle approval routing without add-ons.

Accessibility:

- Moderate to low for early FormForge because internal ops users often need permissions, e-signatures, routing, records, HR/ATS/HRIS integrations, compliance, and secure storage.

Value potential:

- Moderate. Internal time savings can be meaningful, but the buying path is less direct and more sensitive to trust/compliance.

WTP signal:

- Moderate in businesses with formal HR workflows, but generic small teams can use Google Forms/Sheets.

Risks:

- The path drifts toward HR workflow software rather than a lightweight public form builder.

Current rank: 5.

## Primary ICP Selection

Recommended primary ICP for approval:

Client-service solo consultants, coaches, and small agencies doing client intake/onboarding.

Why this is the strongest first-principles fit:

1. The workflow is repeated and variable. Each new client, offer, project, cohort, audit, or program can require a different intake form.
2. The value is tied to paid delivery, not abstract data collection. Missing intake data delays kickoff, creates rework, or hurts the client experience.
3. The buyer and user are close together. Owner-operators and small teams can self-serve without enterprise procurement.
4. The respondent experience matters. Their clients are external and often paying; a polished form is part of the provider's perceived professionalism.
5. The current FormForge loop can satisfy a meaningful first slice without becoming a CRM, event platform, donation processor, or HR system.
6. WTP evidence is better than generic forms because the segment already buys adjacent tools: Typeform/Paperform for polish, HoneyBook/Dubsado for client workflows, Pixelform/intake tools for intake-specific needs, and Zapier/Sheets/Notion for handoff.

The strongest caveat:

FormForge should not position the initial ICP as "anyone who needs forms quickly." That puts it against free/low-cost general form builders and makes AI generation a commodity feature. The sharper problem is "client-service operators need a usable, professional intake flow fast, without manually building forms or migrating their whole workflow stack."

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

## Primary ICP Deep Profile

### Customer Profile

Buyer persona:

- Owner-operator, founder, principal consultant, coach, agency owner, operations coordinator, or client-success/project manager inside a small service business.

Budget owner:

- Usually the business owner or department lead. In small agencies, the ops/project lead may recommend tools, but the owner controls spend.

Geographic focus:

- Initial focus can remain English-speaking US/Canada/UK/Australia-style service businesses because the current repo and concept are English-first and no market-specific compliance wedge is being claimed. This is not a regulatory selection; it is a practical discovery/accessibility starting point.

Business model and go-to-market motion:

- B2B SaaS PLG/self-serve with solo-operator prosumer adoption.
- Buyer and user are often the same person.
- The primary motion should be validated around self-serve discovery and evaluation behavior, not enterprise sales.

Named account examples to verify before outbound:

These are illustrative public account types, not validated prospects. Sizes are approximate public-profile ranges and should be verified before any outbound or account-based work.

| Account | Approx size | Industry | Why it fits the ICP pattern |
| --- | ---: | --- | --- |
| Orbit Media Studios | 20-50 | Web design/content agency | Project intake, client discovery, and website/content briefs are repeated external-client workflows. |
| Animalz | 50-200 | Content marketing agency | Client onboarding and content briefing require structured information from external stakeholders. |
| Siege Media | 50-200 | Content/content marketing agency | Repeated new-client and campaign intake across content projects. |
| KlientBoost | 100-250 | Performance marketing agency | Paid client onboarding and campaign details create structured intake needs. |
| SmartBug Media | 100-250 | Digital agency/consultancy | Service delivery spans clients, forms, requests, and project handoff. |
| Single Grain | 50-200 | Digital marketing agency | Repeated client acquisition/onboarding and campaign intake. |
| The Futur | 10-50 | Creative business education/coaching | Coach/consultant-style programs and applications can require branded forms. |
| GrowthMentor | 10-50 | Coaching/mentor marketplace | Mentor/client application and onboarding flows are structurally relevant, though marketplace dynamics may differ. |

Named-account confidence: low to moderate. These examples help shape customer discovery targets; they are not evidence that these companies need or would buy FormForge.

### User Profile(s)

Daily users:

- Solo provider creating forms personally.
- Agency/project coordinator preparing client onboarding or project brief forms.
- Coach/program operator preparing applications, discovery forms, progress check-ins, or testimonials.

Skill level:

- Comfortable with SaaS tools, templates, Google Workspace, Notion, and simple automations.
- Does not want to hand-code forms or build logic trees from scratch.
- Often willing to edit generated output but wants the first draft to remove blank-page work.

Goals:

- Get the right client information before kickoff.
- Avoid chasing missing files, links, goals, access, and preferences.
- Look polished and credible to clients.
- Keep form setup fast enough to customize per service or client type.
- Export or route answers into the existing work system.

Frustrations:

- Blank form setup takes too long.
- Google Forms can look amateur for premium client work.
- Typeform-style tools can hit response/branding/feature limits.
- All-in-one client systems can be too heavy or force workflow migration.
- Submitted data often needs manual copy/paste into project docs, CRM, or spreadsheets.

### Trigger Events

Ranked by urgency and frequency:

1. New paid client signed or discovery call booked. The provider needs a client intake form now.
2. New service offer, package, audit, cohort, or retainer process launches. Existing forms no longer fit.
3. Provider notices onboarding delays from missing client information or files.
4. Provider wants a more professional client-facing form than Google Forms.
5. Existing tool hits response limits, branding limits, file upload limits, or price increases.
6. Provider wants to avoid moving fully into HoneyBook/Dubsado or similar suites.
7. Provider needs a recurring progress check-in, testimonial, project feedback, or renewal questionnaire.

### Current State Journey

1. The provider closes a client, schedules a discovery call, launches a program, or starts a project.
2. They decide what they need to know: goals, background, contact details, files, links, access, timeline, budget, preferences, constraints, and stakeholders.
3. They start from memory, a template, a previous form, a Google Doc, a Typeform/Jotform/Tally draft, or a client-management platform.
4. They manually create fields, labels, help text, required flags, options, file-upload requests, and conditional branches.
5. They send the link to the client.
6. The client submits incomplete answers or files across multiple channels.
7. The provider follows up through email, Slack, text, or calls.
8. The provider copies answers into a project board, CRM, Notion doc, kickoff notes, or spreadsheet.
9. The kickoff proceeds, is delayed, or starts with avoidable ambiguity.

### Pain Map

| Pain | Severity | Frequency | Evidence strength | Notes |
| --- | --- | --- | --- | --- |
| Blank-page form creation | Medium-high | High | Medium | AI generation directly targets this if forms vary by service/project. |
| Chasing missing client details/assets | High | High | Strong | Intake/agency competitors and user sentiment repeatedly name back-and-forth. |
| Poor client-facing professionalism | Medium-high | Medium-high | Medium | Google Forms is commonly framed as basic/amateur for premium service workflows. |
| Response limits and pricing friction | Medium | Medium | Strong | Typeform/Jotform limits and Tally free/unlimited positioning make this visible. |
| Manual copy/paste after submission | High | High | Strong | Users describe forms as only the first step; data must reach project workflows. |
| Heavy all-in-one workflow migration | Medium-high | Medium | Medium | HoneyBook/Dubsado alternatives show buyers want client flow support, but some resist migration. |
| Compliance/security anxiety | Medium | Low-medium | Medium | Stronger in accounting/legal/health; choose less regulated services first. |

### Current Alternatives (User Perspective)

Manual:

- Email questionnaires.
- Google Docs or PDFs.
- Spreadsheet checklists.
- Reusing a previous client intake form.

General form builders:

- Google Forms for free/basic collection.
- Typeform for polished conversational forms.
- Tally for generous free forms and submissions.
- Jotform for templates, payments, signatures, integrations, and higher-complexity forms.
- Fillout/Paperform/forms.app and similar alternatives for builder polish, database/integration fit, or pricing.

Client-service suites and portals:

- HoneyBook and Dubsado for broader client workflows.
- Pixelform, Dashform, Intake, Agencify, Agency Handy, Formaloo AgencyOS, Brieform, and similar intake/client-onboarding tools.

Automation stacks:

- Google Forms or Typeform -> Zapier/Make -> Sheets/Notion/CRM/email.

User-language themes:

- "I need everything in one link."
- "I do not want to chase clients across email."
- "Google Forms is fine but looks cheap."
- "The form is easy; the mess is what happens after submission."
- "I do not want to move my CRM, invoicing, and calendar just to solve intake."

### Market Sizing

Top-down reference points:

- SBA's 2025 small business profile reports 36.2 million US small businesses and 4.88 million in Professional, Scientific, and Technical Services.
- BLS reports 155,800 US meeting/convention/event planners for the event candidate, useful as a comparator for Candidate C.
- Independent Sector reports about 1.9 million registered nonprofit and philanthropic organizations nationwide, useful as a comparator for Candidate D.

Bottom-up estimate for primary ICP:

- TAM proxy: US small professional-service businesses that sell services requiring client discovery/intake. Start with SBA Professional, Scientific, and Technical Services small-business count: 4.88M.
- SAM hypothesis: 5-15% of that broad pool may run repeated external client intake/onboarding with enough form variance and client-facing polish needs to consider a paid intake/form tool. That yields roughly 240k-730k possible US accounts before subtracting industry/compliance mismatch.
- SOM discovery target: 500-2,000 early accounts in agencies/coaches/consultants/bookkeepers/creative studios would be enough to validate the wedge.

Confidence:

- Medium for broad TAM. Low for SAM/SOM because the exact share of service businesses with repeated, paid intake needs requires customer discovery or stronger dataset work.

### Stated Value Drivers

What appears to matter in the customer's own framing:

- Faster setup from a plain-English description.
- Less back-and-forth collecting required information.
- Professional, branded first impression.
- Client can complete the intake without an account.
- File uploads, conditional fields, and required fields capture complete answers.
- Easy CSV/Sheets export or downstream handoff.
- Avoiding response caps, branding limitations, or unintuitive builder complexity.
- Not being forced into an all-in-one platform migration.

Likely aha moment:

- "I described the client/project and got a good enough intake form in minutes, then edited it and sent a polished link without rebuilding from scratch."

#### Willingness-to-Pay Signals

Paid alternatives:

- Typeform paid plans include AI form creation and response limits.
- HoneyBook starts at a paid monthly tier and includes lead forms, client portals, templates, contracts, invoices, and AI.
- Dubsado annual pricing includes lead capture forms and client workflow capabilities.
- Pixelform markets directly to coaches with paid form pricing and coach-specific templates.
- Intake/client-portal tools target professional onboarding and document collection.

Budget owner/context:

- Owner-operator or small agency lead pays from operating/software budget.
- WTP is strongest when the form supports paid onboarding or repeat client work.

Current spend/time-cost proxies:

- Existing spend on client-service suites, form builders, schedulers, automation tools, or manual assistant/ops time.
- Time cost appears in repeated setup, follow-up, and copy/paste after submission.

Switching-cost tolerance:

- Moderate. They may switch a form builder if importing/rebuilding is quick.
- Low for all-in-one migration. Many do not want to move CRM, invoicing, or calendar just to improve intake.

Economic urgency:

- High when missing intake delays kickoff or creates poor first impressions.
- Medium when the need is only aesthetic or one-off.

Pricing sensitivity cues:

- Generic form builders face strong free-tier pressure from Tally, Google Forms, Jotform starter, and many Typeform alternatives.
- A client-intake-specific promise can tolerate more spend than generic "AI forms," but only if it is clearly tied to saved time and better client delivery.

### Customer ↔ User Dynamics

Post-purchase relationship:

- In solo businesses, buyer, admin, and daily user are the same person.
- In small agencies, the owner may buy, while an operations coordinator or project manager creates and edits forms.
- Respondents are external clients or prospective clients. Their experience affects the buyer's perceived value even though they do not pay FormForge.

Onboarding/admin dynamics:

- The buyer expects fast setup, probably starting from a prompt or a template.
- They may need to reuse and adapt forms across clients/offers.
- They want the form to fit existing client workflow rather than force an operational migration.

### Discovery & Evaluation Behavior

Where they find solutions:

- Google searches for client intake form templates/tools, Typeform alternatives, Google Forms alternatives, HoneyBook/Dubsado alternatives, and service-specific intake forms.
- Peer communities for consultants, coaches, agencies, freelancers, no-code builders, and small businesses.
- Tool directories, template galleries, SaaS comparison posts, and competitor landing pages.

What they compare:

- Google Forms vs Typeform/Tally/Jotform/Paperform.
- Generic form builder vs client-management suite.
- Dedicated intake/client-portal tool vs simple form + automation stack.

How they choose:

- Does it produce a usable form quickly?
- Does the form look credible to clients?
- Can clients complete it without friction?
- Are file uploads/logic/required fields/exports available?
- Will it avoid response caps or branding limits?
- Does it fit the existing workflow without forcing tool migration?

## Additional ICPs

### Candidate B - Small Service Lead/Quote Forms

Customer Profile:

- Owner/operators or small teams in local services, contractors, studios, agencies, and service businesses that qualify inbound leads or generate quote requests.
- Budget exists when the form creates measurable lead value.

User Profile:

- Owner, office manager, sales coordinator, or marketer.

Trigger Events:

- Website lead volume increases.
- Missed follow-ups or quote delays become visible.
- A new ad campaign, service line, or quote workflow launches.
- Current website contact form lacks qualification detail.

Current State Journey:

- Customer fills contact/quote form.
- Team reviews incomplete info.
- Team manually estimates or calls for missing details.
- Lead goes cold if response is slow.
- Data moves into a sheet, CRM, or inbox.

Pain Map:

- Lead quality, quote delay, missing scope details, no instant follow-up, manual CRM entry.

Current Alternatives:

- Website contact forms, CRM web forms, Google Forms, Typeform/Jotform/Tally, quote-estimator tools, service-business CRMs, custom calculator forms.

Market Sizing:

- Broad TAM is huge across 36.2M US small businesses, but usable SAM requires vertical narrowing.

Stated Value Drivers and WTP:

- Strongest value is faster qualified lead response and fewer stale leads.
- WTP is better where one closed job is valuable.
- Current FormForge fit is lower because the core value often needs pricing logic, CRM, SMS/email follow-up, pipeline status, and vertical-specific qualification.

Customer ↔ User Dynamics:

- Buyer is owner/manager; users may be sales/admin; respondent is prospective customer.

Discovery & Evaluation:

- Searches for quote form, estimator, lead capture, CRM forms, service-business lead follow-up, and contractor quote tools.

Verdict:

- Revisit as a different product surface if the project pivots toward lead qualification or quote workflows.

### Candidate C - Small Event And Community Organizers

Customer Profile:

- Community groups, workshops, sports clubs, PTAs, churches, schools, event hosts, and small professional event teams.

User Profile:

- Organizer, volunteer lead, admin, event planner, community manager.

Trigger Events:

- New event, workshop, roster, volunteer day, class, fundraiser, tournament, or campaign.
- Need to collect attendee information and manage capacity quickly.

Current State Journey:

- Organizer creates registration/RSVP/signup form.
- Shares link by email/social/text.
- Tracks responses in a sheet or dashboard.
- Manages waitlist, no-shows, reminders, rosters, and exports manually.

Pain Map:

- Capacity limits, no-login completion, reminders, waitlists, roster visibility, attendee edits, staff/volunteer coordination.

Current Alternatives:

- Google Forms, Eventbrite, Jotform, SignUpGenius, Signup Haven, Formgrid, Sendtable, Lome, event-specific registration tools.

Market Sizing:

- BLS reports 155,800 US meeting/convention/event planners; community/nonprofessional event organizers are much broader but harder to size.

Stated Value Drivers and WTP:

- Value centers on no-login mobile signup, clean roster, reminders, capacity/waitlist handling, and export.
- WTP is mixed; business events may pay, community groups prefer free/low-cost.

Customer ↔ User Dynamics:

- Organizer buys/uses; attendees/volunteers complete. Respondent experience is central.

Discovery & Evaluation:

- Searches for Google Forms alternative, event registration form, signup sheet, volunteer signup, no-login RSVP, CSV export.

Verdict:

- Good problem, but likely requires event/signup-specific capabilities early. Keep as secondary.

### Candidate D - Nonprofits, Schools, Volunteer Coordinators

Customer Profile:

- Small nonprofit teams, school/PTA admins, churches, volunteer coordinators, charity event operators.

User Profile:

- Volunteer coordinator, admin, fundraising/event lead, school/community organizer.

Trigger Events:

- Fundraiser, volunteer recruitment cycle, campaign, school year, donation drive, event registration, supporter survey.

Current State Journey:

- Create volunteer/donation/event form.
- Share link across email/social/community channels.
- Track submissions in sheets or CRM.
- Send reminders, coordinate volunteers, export data, and reconcile donations.

Pain Map:

- Paper/spreadsheet drift, volunteer coordination, donation/event forms, supporter data handoff, reminders, low budget, need for integrations.

Current Alternatives:

- Google Forms, Jotform nonprofit templates/discounts, Gravity Forms, Wufoo, Lome, SignUpGenius alternatives, donor/volunteer platforms.

Market Sizing:

- Independent Sector reports 1.9M registered nonprofit/philanthropic organizations nationally. Actual serviceable early market is far smaller because many are inactive, small, budget-constrained, or already tied to donor/CRM tools.

Stated Value Drivers and WTP:

- Less paperwork, quick volunteer/event forms, donation/supporter data, integration with Sheets/Mailchimp/CRM.
- WTP is weak to mixed due to discounts/free expectations.

Customer ↔ User Dynamics:

- Staff/volunteer admin buys/uses; donors/volunteers complete. Committees or directors may influence spend.

Discovery & Evaluation:

- Searches for nonprofit form builder, volunteer signup, SignUpGenius alternative, donation/event registration forms, discounts.

Verdict:

- Keep as lower-ranked unless FormForge intentionally focuses on nonprofit/volunteer workflows and low-cost/ad-free positioning.

### Candidate E - Internal HR/Ops Forms

Customer Profile:

- Small business HR/admin/ops teams needing job applications, onboarding documents, approvals, employee feedback, and internal request forms.

User Profile:

- HR generalist, office manager, founder, operations lead, hiring manager.

Trigger Events:

- Hiring cycle, onboarding, policy acknowledgment, annual review, compliance need, manager request workflow, paper-process pain.

Current State Journey:

- Create form or PDF.
- Send to employees/managers/candidates.
- Track completions.
- Route approvals/signatures.
- Store records in HR/payroll/ATS systems or spreadsheets.

Pain Map:

- Routing/approval, e-signature, compliance storage, candidate screening, recordkeeping, internal permissions.

Current Alternatives:

- Jotform HR, Typeform application forms, Google Forms, HRIS/payroll software, ATS forms, e-signature tools, Power Automate/AppSheet.

Market Sizing:

- Broad SMB base is large, but serviceable market depends on compliance appetite and integration needs.

Stated Value Drivers and WTP:

- Faster form setup, reduced paper, consistent records, e-signature, routing. WTP exists in formal HR, but trust/compliance matters.

Customer ↔ User Dynamics:

- HR/admin buys or recommends; employees/candidates/respondents complete; leadership may own budget.

Discovery & Evaluation:

- Searches HR form builder, job application form, approval workflow, employee onboarding forms, e-signature.

Verdict:

- Lower early fit. The first useful version would need HR-specific compliance/routing trust before generic AI form generation is compelling.

## Cross-ICP Analysis

### Shared Pains

- People need to get structured information from someone else.
- Blank-page form setup is annoying.
- Existing free tools are "good enough" for simple cases.
- Value grows when the form feeds a real workflow after submission.
- Respondent friction matters: no-login, mobile completion, clear questions, and professional presentation affect completion.
- CSV/Sheets/export and notifications are recurring minimum expectations.

### Conflicts

| Conflict | Candidate A | Candidate B | Candidate C | Candidate D | Candidate E |
| --- | --- | --- | --- | --- | --- |
| Workflow after submission | Client kickoff/project docs | Lead pipeline/quote/follow-up | Roster/check-in/reminders | Volunteer/donor/CRM | HRIS/ATS/records |
| Compliance burden | Low-medium if avoiding regulated sectors | Low-medium by vertical | Low | Medium | Medium-high |
| WTP pattern | Service-delivery software budget | Lead/revenue budget | Event budget | Discount/free constrained | HR/admin budget |
| Best wedge | Intake speed + professional client experience | Quote/lead qualification | No-login registration/roster | Low-cost volunteer/donation/event forms | Secure routing/e-signature |
| Risk of overbuilding | Portals/contracts/payments | CRM/estimator/SMS | Event management | Donor/volunteer CRM | HR workflow/compliance |

### Build/Validation Sequence Rationale

Problem-space sequence, not feature prescription:

1. Validate Candidate A first because it has the best fit with FormForge's existing loop and strongest combination of pain, WTP, accessibility, and low regulatory burden.
2. Keep Candidate B as the highest-value revisit path if early discovery shows client intake is not urgent enough or if users keep asking for lead/quote workflows.
3. Keep Candidate C as a secondary path if discovery points toward registration rather than client intake.
4. Defer Candidate D unless nonprofit/volunteer discovery reveals an unusually strong budget-backed wedge.
5. Defer Candidate E until the product is ready to handle trust, routing, signatures, and compliance expectations.

### Product-Line / Manifest Implications

If approved, I recommend the canonical stage either:

- Minimal option: keep `research/.progress.yaml` absent and record secondary paths inside `research/icp.md` only.
- More skill-complete option: create `research/.progress.yaml` with FormForge active and deferred/revisit product-path entries for:
  - `lead-quote-forms` - status `revisit_candidate`.
  - `event-registration-signups` - status `deferred`.
  - `nonprofit-volunteer-forms` - status `deferred`.
  - `hr-ops-forms` - status `deferred`.

My recommendation is the more skill-complete option because the rejected candidates imply materially different product surfaces. It should not create product directories or run downstream work for those paths.

## Evidence Matrix

| Claim | Evidence | Inference | Confidence | Assumption status | Decision impact |
| --- | --- | --- | --- | --- | --- |
| Generic AI form generation is no longer enough as a wedge. | Typeform pricing includes AI-powered form creation; Typeform help explains AI creation/editing; Jotform and Fillout expose AI form builder surfaces; newer AI-native competitors exist. | AI is becoming table-stakes in form builders. FormForge needs an ICP-specific job, not generic AI. | High | Evidence-backed | Approve narrow ICP, not "anyone needing forms". |
| Generic form builders are price competitive. | Tally offers unlimited forms/submissions for free within fair use; Jotform free starter exists but pushes upgrades for limits; Typeform paid plans include strict response tiers. | Users comparing generic form tools will anchor against free/cheap alternatives. | High | Evidence-backed | Do not select an ICP whose only pain is "forms take time." |
| Client-service intake has stronger early fit than generic SMB forms. | Pixelform, Dashform, Intake, Agencify, Brieform, HoneyBook, and Dubsado all target client intake/onboarding, assets, forms, lead forms, templates, and client workflows. | There is a visible cluster of tools around professional intake and client workflow. | Medium-high | Evidence-backed | Select Candidate A unless user has a strong strategic constraint. |
| Candidate A has WTP beyond free tools. | HoneyBook starts with paid client-experience plans; Dubsado annual plans include lead capture/forms; Pixelform charges for coach-focused intake; Typeform/Paperform/FIllout/Jotform paid tiers exist. | Service providers already pay for adjacent polish, client workflow, and forms. | Medium-high | Evidence-backed | Candidate A has credible paid adoption path. |
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

## Proposed Canonical File Changes After Approval

### `research/icp.md`

Write canonical ICP report with:

- Primary ICP: client-service solo consultants, coaches, and small agencies doing client intake/onboarding.
- Required top-level sections:
  - `## Customer Profile`
  - `## User Profile(s)`
  - `## Trigger Events`
  - `## Current State Journey`
  - `## Pain Map`
  - `## Current Alternatives (User Perspective)`
  - `## Market Sizing`
  - `## Stated Value Drivers`
  - `## Customer ↔ User Dynamics`
  - `## Discovery & Evaluation Behavior`
  - `## Additional ICPs`
  - `## Cross-ICP Analysis`
  - `## Signals for Downstream Research`
  - `## Next Steps`

### `research/icp-search-log.md`

Write the raw research log:

- Query list and findings.
- Source URLs by category.
- Marketplace side preflight.
- Business model classification evidence.
- Candidate scoring rationale.
- Evidence gaps and confidence notes.

### `research/.progress.yaml`

Optional, approval-dependent:

- Add `product_paths[]` entries for materially different secondary surfaces with `source_skill: icp`, `pipeline_stage: icp`, status values, and evidence refs.
- Do not create product directories yet.

Proposed entries if approved:

- `lead-quote-forms` - revisit candidate.
- `event-registration-signups` - deferred.
- `nonprofit-volunteer-forms` - deferred.
- `hr-ops-forms` - deferred.

## Approval Questions For The Alignment Page

The review page should ask the user to decide:

1. Whether Candidate A is the approved primary ICP direction.
2. Whether the evidence coverage is sufficient for a canonical ICP write.
3. Whether to include or skip the optional `.progress.yaml` secondary-path manifest.
4. Whether the canonical file destinations are approved.

Feedback-only YAML should be accepted for section-specific concerns before final approval.
