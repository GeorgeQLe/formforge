## Summary

FormForge is an AI-assisted form builder for creating useful public forms quickly. A user describes the form they need, reviews generated fields, edits the form visually, publishes a public link, receives submissions, and reviews or exports responses.

The fresh-start concept should validate that core loop before rebuilding the old app's broader production surface. The product should be treated as a prototype-first business app until the target customer and strongest use case are proven.

## Problem Hypothesis

Individuals and small teams often need professional forms for intake, feedback, signups, requests, surveys, and lightweight data collection, but building a polished form still requires too much manual setup. Existing tools can be powerful, but users still spend time translating an intent into field structure, validation, copy, conditional logic, and response handling.

The core hypothesis is that natural-language form generation plus a practical editing and publishing workflow can reduce setup time enough to make FormForge meaningfully better for repeated lightweight form creation.

## Beneficiary Hypothesis

The initial beneficiary hypothesis is individuals and small teams who need professional forms quickly but do not want the operational overhead of enterprise form platforms.

Likely early beneficiary groups may include solo operators, consultants, small service businesses, internal team leads, creator businesses, and early-stage teams. This is intentionally not an ICP selection yet; the next research step should narrow which group has the most urgent and frequent problem.

## Product Category Guess

FormForge appears to sit in the AI-assisted productivity and lightweight SaaS category, specifically around form building, public data collection, and response management.

It may eventually overlap with survey tools, intake tools, no-code workflow tools, and customer-support or operations forms, but those category edges should remain hypotheses until ICP and market evidence are collected.

## Value Wedge

The likely value wedge is fast intent-to-form creation: users can describe the outcome they want and receive a usable draft form that can be edited, published, and used immediately.

Quality signals from the old project should be preserved as product principles, not implementation inheritance:

- Public forms should be accessible and resilient.
- Published form versions should be stable for respondents.
- Submission errors should be clear.
- Consent settings and response export should be available early enough to test real workflows.
- Collaboration, API access, webhooks, billing, durable file storage, and full i18n should stay deferred until demand is validated.

## Constraints

- Do not carry forward old source code, dependencies, database schema, or infrastructure configuration.
- Start from file-backed concept and research artifacts before implementation specs.
- Validate the core loop before adding broad production infrastructure.
- Keep the first build narrow: describe, generate, edit, publish, submit, review, and export.
- Treat teams, API keys, webhooks, billing, provider integrations, durable file storage, and full i18n as later experiments.
- Preserve useful lessons from the old repo while rejecting the old architecture and feature sequencing.

## Non-Goals

- Do not select an ICP in this concept step.
- Do not run competitive analysis or market validation here.
- Do not define UX variations, UI layout, roadmap phases, architecture, schema, or implementation tasks.
- Do not rebuild the old app feature-for-feature.
- Do not treat Stripe billing, collaboration, API access, or webhook integrations as part of the first validated product loop.

## Assumptions And Unknowns

- Assumption: natural-language form generation is valuable enough to be the first differentiator.
- Assumption: users will accept a generated draft if visual editing is fast and predictable.
- Assumption: individuals and small teams are a reasonable broad starting beneficiary group.
- Unknown: which specific user segment has the most urgent form-creation pain.
- Unknown: which form jobs are frequent and valuable enough to support paid usage.
- Unknown: whether AI-generated field structure, copy, validation, or conditional logic matters most.
- Unknown: what level of response management is needed for the first compelling use case.
- Unknown: whether users need integrations before the product is useful, or only after the core loop works.

## ICP Readiness

The concept is ready for ICP discovery, but not for product specification or implementation planning.

The ICP step should use this concept brief, the old repo's desk-flip report, and the old task/history docs as context. It should test these assumptions first:

- Which beneficiary segment has repeated, urgent form-building needs?
- Which form use cases are painful enough to switch or adopt a new tool?
- Is AI-assisted generation the primary value wedge, or is the faster edit-publish-response loop the real wedge?
- Which deferred capabilities are actually blockers for early adoption?

## Next Steps

Primary command: `$pack install business-discovery`

Other useful options:

- `$pack recommend` if the project direction changes away from a business app.
- `$research-roadmap` after business discovery tooling is available and concept/ICP artifacts exist.
