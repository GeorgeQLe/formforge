# Strategic Group Map

> Based on: approved competitive-analysis scope, confirmed ICP, existing Porter/SWOT/Feature-Pricing intermediates, repo evidence, and current public source checks
> Date: 2026-06-18
> Methodology: Strategic Group Mapping
> Approval: `alignment/strategic-group-map-formforge.html`

## Based On

- Parent selected-framework manifest: `research/_working/competitive-analysis-run.yaml`.
- Confirmed ICP: client-service solo consultants, coaches, and small agencies doing client intake/onboarding (`research/icp.md`).
- Completed framework intermediates:
  - `research/competitive-analysis-porter-five-forces.md`
  - `research/competitive-analysis-swot.md`
  - `research/competitive-analysis-feature-pricing-matrix.md`
- Product boundary from `README.md`: AI-assisted form builder prototype focused on describe, generate fields, edit visually, publish a public link, receive submissions, and review/export responses.
- Current public source checks on 2026-06-18 across Typeform, Jotform, Tally, Fillout, Google Forms, HoneyBook, Dubsado, IntakeQ, Paperform, forms.app, Typeform MCP, and Jotform developer docs.

## Methodology

This map uses competitor public pages and prior approved framework evidence to cluster competitors by how they compete in the client-intake market boundary. It does not attempt a market-share ranking, product-quality review, or positioning recommendation.

Primary map axes:

1. **Client-workflow depth**: from broad/generic form collection to deep client-service or vertical intake workflow.
2. **Implementation footprint**: from low-burden self-serve form tool to higher-commitment suite, portal, practice-management, or operational migration.

These axes were selected because the approved ICP is not just collecting data. The ICP is trying to reduce blank-page setup, look professional to clients, avoid missing-information follow-up, and move submitted answers into client work without adopting a larger operating system unless needed.

## Axis Selection

| Axis | Why It Matters | Evidence | Confidence |
| --- | --- | --- | --- |
| Client-workflow depth | Separates generic form builders from products that bundle lead capture, onboarding, portals, reminders, contracts, invoices, secure sharing, or vertical intake workflows. | HoneyBook and Dubsado bundle forms with broader client operations; IntakeQ packages branded forms with e-signatures, reminders, attachments, secure sharing, and practice workflows; generic builders emphasize forms, submissions, logic, templates, and integrations. | High |
| Implementation footprint | Separates tools a solo provider can adopt for one form from platforms that imply workflow migration, suite adoption, compliance setup, or operational process change. | Tally, Fillout, forms.app, Google Forms, Typeform, and Paperform expose self-serve form-builder pricing and free/low-entry plans; HoneyBook and Dubsado sell business-management suites; IntakeQ sells vertical intake/practice-management modules. | High |
| Integration/automation maturity, as an overlay rather than a main axis | Integration depth changes how well a tool handles post-submission handoff, but it cuts across both generic builders and suites. | Tally documents Sheets/Notion/Airtable/Zapier/Make/webhooks; Paperform lists 2,000+ integrations and webhooks/API on higher plans; Jotform exposes broad integrations and APIs; Typeform has webhooks/integrations plus a beta MCP server. | Medium-high |

## Competitor Placement

| Competitor | Client-Workflow Depth | Implementation Footprint | Group | Evidence | Confidence |
| --- | --- | --- | --- | --- | --- |
| Google Forms | Low | Very low | Free/workspace-bundled collector | Google Forms presents online forms and surveys with question types, customization, sharing/embed, response charts, and Sheets export inside Google Workspace. Source: https://workspace.google.com/products/forms/ | High |
| Tally | Low-medium | Low | Generous free lightweight builder | Tally pricing emphasizes unlimited forms/submissions free within fair-use limits, conditional logic, file uploads, payments, redirects, integrations, and paid branding/domain upgrades. Source: https://tally.so/pricing | High |
| forms.app | Low-medium | Low | Low-cost AI-enabled general builder | forms.app pricing exposes a capable free plan with unlimited responses, 30+ field types, conditional logic, unlimited questions/views, AI form generator, and 500+ integrations. Source: https://forms.app/en/pricing | High |
| Fillout | Medium | Low-medium | Power general builder | Fillout pricing includes free unlimited forms/seats with response limits and paid tiers for higher response volume, conditional logic, payments, PDF generation, uploads, analytics, and business controls. Source: https://www.fillout.com/pricing | High |
| Typeform | Medium | Low-medium | Polished engagement/form platform | Typeform pricing includes AI-powered form creation, conditional logic, webhooks/integrations, response tiers, custom branding, analytics, Growth Flow, and enterprise options. Source: https://www.typeform.com/pricing | High |
| Paperform | Medium | Low-medium | Polished operational form builder | Paperform pricing lists AI form creation, unlimited forms, guided mode, conditional logic, payments, uploads, webhooks/API on higher tiers, and 2,000+ integrations. Source: https://paperform.co/pricing/ | High |
| Jotform | Medium-high | Low-medium | Broad form operations platform | Jotform pricing/product surface includes forms, apps, tables, inbox, report builder, Smart PDF Forms, Sign, Workflows, AI, HIPAA forms, secure forms, payments, widgets, and 200+ integrations. Source: https://www.jotform.com/pricing/ | Medium-high |
| HoneyBook | High | High | Client-service suite | HoneyBook pricing targets small service businesses and bundles lead forms, client portals, proposals/contracts, invoices, scheduling, automations, reporting, and AI. Source: https://www.honeybook.com/pricing | High |
| Dubsado | High | High | Client-service suite | Dubsado pricing bundles lead capture forms, client portals, contracts/proposals, invoices, payment plans, scheduling, workflows, email/calendar, and Zapier on Premier. Source: https://www.dubsado.com/pricing | High |
| IntakeQ | High | Medium-high | Vertical intake/practice-management | IntakeQ pricing packages branded forms with attachments, client/provider e-signatures, reminders, secure document sharing, export, HIPAA BAA, and practice-management tiers. Source: https://intakeq.com/pricing | High |

## Strategic Groups

### Group 1: Free Or Low-Friction Collectors

Members: Google Forms, Tally, forms.app, and parts of Fillout.

Shared traits:

- Compete on availability, generous free tiers, low setup burden, and basic-to-moderate form capability.
- Pull price-sensitive buyers away from paid generic intake tools.
- Usually do not require the buyer to migrate client operations.

How they compete:

- Google Forms competes through default availability and Sheets export.
- Tally, forms.app, and Fillout compete through generous free plans, modern builder UX, logic, and enough integrations to make basic workflows viable.

Synthesis input:

- This is the strongest "good enough" cluster. Any final synthesis should preserve that generic intake has a low price ceiling unless the workflow-specific pain is strong.

### Group 2: Polished General Form Platforms

Members: Typeform, Paperform, Jotform, Fillout.

Shared traits:

- Compete on richer builder capability, brand polish, logic, analytics, payments, integrations, API/webhook surfaces, templates, and increasingly AI creation.
- Serve many jobs beyond client-service intake.
- Keep implementation footprint lower than client-management suites, but some products can become operational platforms.

How they compete:

- Typeform is strongest as a polished engagement/form platform with AI and response-based pricing.
- Paperform is strongest as a visually polished operational form builder with payments, integrations, webhooks, and API access.
- Jotform is broadest as a form operations platform spanning forms, apps, tables, Sign, workflows, HIPAA, payments, and integrations.
- Fillout sits between generous/free builders and power form operations.

Synthesis input:

- This cluster crowds the middle of the map. It weakens any claim that FormForge can win with "AI forms plus logic" alone.

### Group 3: Client-Service Operating Suites

Members: HoneyBook and Dubsado.

Shared traits:

- Compete by owning the surrounding client workflow: lead capture, client portal, contracts/proposals, invoices/payments, scheduling, templates, workflows, automations, and reports.
- Higher implementation footprint because adoption can imply a larger workflow migration.
- Stronger fit for buyers who want client operations in one system.

How they compete:

- HoneyBook targets service businesses and bundles lead forms with client portal, payments, contracts, scheduling, AI, and automations.
- Dubsado similarly bundles lead capture forms with portals, invoices, proposals/contracts, scheduling, and workflows.

Synthesis input:

- This group creates both a threat and a possible gap. Suite buyers may not need FormForge, but suite-resistant buyers may want better intake without moving their CRM, invoicing, calendar, or portal.

### Group 4: Vertical Intake And Practice Workflow

Member: IntakeQ.

Shared traits:

- Competes on intake as a regulated or vertical workflow with reminders, signatures, attachments, secure sharing, export, and HIPAA/compliance support.
- Higher pricing is attached to operational and compliance depth, not generic form generation.

How it competes:

- IntakeQ demonstrates that specialized intake can sustain higher prices when it is bundled with workflow, security, reminders, signatures, and industry-specific needs.

Synthesis input:

- This is a willingness-to-pay proof point, not a direct recommendation to pursue regulated healthcare.

## Map Reading

| Zone | Competitors | Strategic Meaning | Confidence |
| --- | --- | --- | --- |
| Low workflow depth, low footprint | Google Forms, Tally, forms.app | Basic intake is commoditized and often free or near-free. | High |
| Medium workflow depth, low-to-medium footprint | Typeform, Paperform, Fillout, Jotform | The broad form-builder middle is crowded with AI, logic, integrations, payments, uploads, analytics, and API/webhook options. | High |
| High workflow depth, high footprint | HoneyBook, Dubsado | Suite products can absorb intake into broader client-service operations but may overshoot buyers who only want intake improvements. | High |
| High workflow depth, medium-high footprint | IntakeQ | Vertical intake shows higher WTP when workflow/security/compliance depth is core. | Medium-high |
| Potential gap: medium-high workflow depth, low-to-medium footprint | No direct incumbent proven from current evidence; FormForge hypothesis sits here if it becomes client-intake-specific without suite migration. | This is the map's main whitespace, but it is still a hypothesis until customer interviews validate suite resistance and workflow-specific WTP. | Medium |

## Whitespace And Crowded Zones

### Crowded Zones

1. **Generic form creation and AI-assisted first drafts.** Typeform, Paperform, forms.app, HoneyBook, and FormForge evidence all show AI form creation or AI features in-market. This zone is crowded and low-defensibility.
2. **Low-cost basic collection.** Google Forms, Tally, forms.app, and Fillout create strong price pressure for basic intake forms.
3. **Broad operational form platforms.** Jotform, Paperform, Typeform, and Fillout already compete on logic, uploads, payments, integrations, analytics, webhooks/API, and brand controls.
4. **Full client-service workflow suites.** HoneyBook and Dubsado compete from above for buyers who want intake plus contracts, invoices, portals, scheduling, and workflow automation.

### Whitespace Hypotheses

1. **Client-intake-specific workflow without suite migration.** The clearest map gap is a low-to-medium footprint tool that is more specific than a generic form builder but less migration-heavy than HoneyBook or Dubsado. Current evidence supports this as plausible, not proven.
2. **Post-submission handoff for service work.** The ICP's high-severity pain is not only form setup; it is missing details and moving answers into project docs, CRM, Notion, kickoff notes, or spreadsheets. Competitor integrations make this a battleground rather than empty space.
3. **Agent-operable intake handoff.** Typeform already has a beta MCP server and Jotform has broad APIs, so agent access alone is not empty space. A narrower agent workflow for creating, publishing, routing, and summarizing client-intake packets may still be underexplored, but direct buyer evidence is missing.

## Lower-Confidence Or Alternative Maps

### Alternative Axis Pair: Price Pressure vs Workflow Depth

This map would show free/general builders at low price and low-to-medium workflow depth, suites/vertical tools at higher price and high workflow depth, and Typeform/Paperform/Jotform/Fillout in the paid middle. It is useful for pricing synthesis but less useful for understanding adoption friction.

### Alternative Axis Pair: Developer/Agent Surface vs No-Code Buyer Fit

This map would separate products with mature APIs, webhooks, MCP, or integration surfaces from products primarily sold as no-code builders. It is relevant if FormForge later explores CLI/MCP as a wedge. It is not the primary map because the approved ICP is mostly owner-operators and small service teams, not developers.

## Evidence Matrix

| Claim | Source | Evidence Type | Inference | Confidence |
| --- | --- | --- | --- | --- |
| Low-cost/free generic collection is crowded. | Google Forms, Tally, forms.app, Fillout public pages | Public product/pricing evidence | Buyers can satisfy basic intake with free or low-cost alternatives. | High |
| The polished general-builder middle is crowded. | Typeform, Paperform, Jotform, Fillout public pages | Competitor feature/pricing evidence | AI creation, logic, uploads, payments, integrations, analytics, and API/webhook features are already common. | High |
| Client-service suites compete from above. | HoneyBook and Dubsado pricing pages | Competitor packaging evidence | Buyers who want broader client operations may choose a suite instead of a focused form tool. | High |
| Specialized intake supports higher WTP when workflow/security depth is present. | IntakeQ pricing page | Vertical pricing/workflow evidence | Intake becomes more valuable when bundled with attachments, signatures, reminders, secure sharing, compliance, and practice workflows. | Medium-high |
| The map's main plausible gap is client-intake-specific workflow without suite migration. | ICP current alternatives and pain map; HoneyBook/Dubsado suite breadth; generic-builder crowding | Approved ICP plus competitor inference | There may be a buyer segment that wants better intake without adopting a suite, but customer interviews are still needed. | Medium |
| Agent-operable intake is not empty space by itself. | Typeform MCP docs and Jotform developer docs | Developer-platform evidence | Mature competitors already expose agent/API-adjacent surfaces, so the potential wedge must be workflow-specific. | Medium |

## Assumptions And Confidence Register

| Assumption | Status | Confidence | What Would Change It |
| --- | --- | --- | --- |
| Client-workflow depth and implementation footprint are the right primary axes. | Evidence-backed by ICP and competitor packaging | High | Customer interviews showing the primary decision is instead price, design polish, compliance, or integrations. |
| HoneyBook/Dubsado adoption feels like migration for at least some target buyers. | Inferred from suite breadth and ICP statements about avoiding full client-system migration | Medium | Interviews showing target buyers prefer suite consolidation over lightweight intake. |
| Jotform sits closer to an operational platform than a lightweight builder. | Evidence-backed by forms/apps/tables/sign/workflows/HIPAA/payments/integrations breadth | Medium-high | Hands-on trial showing typical ICP buyers use only simple Jotform forms and ignore platform depth. |
| IntakeQ is a vertical proof point, not a primary direct competitor. | Evidence-backed by healthcare/practice-management framing | Medium-high | Discovery in regulated coaching, wellness, or therapy-adjacent segments showing direct overlap. |
| FormForge's potential gap is not yet validated. | Research-gap statement | High | Customer interviews, trials, or win/loss evidence validating willingness to pay for focused intake without suite migration. |

## Source Coverage Gaps

- No direct target-buyer interviews, win/loss notes, or customer calls.
- No hands-on product trials to test actual setup burden, AI quality, integration friction, or client-facing polish.
- No market-share, traffic, review-volume, retention, or funding analysis.
- Public pricing and product pages are time-sensitive and should be rechecked before canonical synthesis if a significant delay occurs.
- No direct tests of Typeform MCP, Jotform APIs, Tally webhooks, or Paperform APIs.

## Out Of Scope For This Intermediate

- Canonical `research/competitive-analysis.md`.
- `research/competitive-analysis-search-log.md`.
- Product code, architecture, implementation tasks, GTM recommendations, or positioning recommendations.
