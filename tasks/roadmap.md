# FormForge Journey Map Synthesis Review Roadmap

## Objective

Synthesize the approved Service Blueprint and User Story Map intermediates into a review-stage unified journey map proposal, then stop for artifact approval before writing canonical `research/journey-map.md`.

## Scope Basis

- Active product path: flat `research/`
- Run manifest: `research/_working/journey-map-run.yaml`
- Completed intermediates: `research/journey-map-service-blueprint.md` and `research/journey-map-user-story-map.md`
- Canonical synthesis absent: `research/journey-map.md`

## Non-Goals

- Do not write canonical `research/journey-map.md` before approval.
- Do not archive the run manifest in this review-stage session.
- Do not change product code, dependencies, lockfiles, `.agents/project.json`, or GitHub Actions.

## Plan

- [x] Resolve synthesis state from manifest and filesystem.
- [x] Read approved ICP, competitive analysis, Service Blueprint, User Story Map, README, and progress manifest context.
- [x] Write non-canonical synthesis working packet: `research/_working/preliminary-journey-map-research.md`.
- [x] Build synthesis approval page: `alignment/journey-map-formforge.html`.
- [x] Update central alignment index.
- [x] Verify review artifacts, page script/includes, and git diff.

---

# FormForge Journey Map User Story Map Finalization Roadmap

## Objective

Consume the approved user-story-map framework findings YAML, write the canonical user-story-map intermediate, archive the consumed review-stage artifacts, and hand the parent journey-map loop to synthesis.

## Approval Input

The user provided final compiled YAML approving:

- Evidence coverage for the user-story-map intermediate with known gaps.
- Preserving assumptions and confidence levels.
- Proposed file change: write `research/journey-map-user-story-map.md`.

## Non-Goals

- Do not run new journey research or alter the approved user-story-map findings.
- Do not synthesize `research/journey-map.md` in this approval-consumption step.
- Do not change product code, dependencies, lockfiles, `.agents/project.json`, or GitHub Actions.

## Plan

- [x] Reconcile approval YAML with the active user-story-map working packet and journey-map run manifest.
- [x] Write approved canonical artifact: `research/journey-map-user-story-map.md`.
- [x] Archive and remove active working packet: `research/_working/preliminary-user-story-map-research.md`.
- [x] Archive the user-story-map review page snapshot and preserve the approval record.
- [x] Recalculate manifest-selected framework progress and identify synthesis readiness.
- [x] Verify artifact structure, archive state, synthesis-ready state, and git diff.
- [x] Commit and push intended tracked changes.

---

# FormForge Journey Map User Story Map Framework Roadmap

## Objective

Run the next pending journey-map framework, User Story Map, for the approved FormForge journey-map run and produce review-stage artifacts only.

## Scope Basis

- Active product path: flat `research/`
- Approved journey-map run manifest: `research/_working/journey-map-run.yaml`
- Completed framework: Service Blueprint
- Next pending framework: User Story Map

## Non-Goals

- Do not write canonical `research/journey-map-user-story-map.md` before artifact approval.
- Do not synthesize final `research/journey-map.md` in this session.
- Do not change product code, dependencies, lockfiles, `.agents/project.json`, or GitHub Actions.

## Plan

- [x] Resolve journey-map state and confirm User Story Map is the only pending framework.
- [x] Gather approved ICP, competitive analysis, service blueprint, README, and product-surface evidence.
- [x] Write non-canonical working packet: `research/_working/preliminary-user-story-map-research.md`.
- [x] Build the User Story Map findings review page: `alignment/user-story-map-formforge.html`.
- [x] Update central alignment index for the new review page.
- [x] Verify review artifacts, page script/includes, and git diff.
- [x] Commit and push intended tracked changes.

---

# FormForge Journey Map Service Blueprint Finalization Roadmap

## Objective

Consume the approved service-blueprint framework findings YAML, write the canonical service-blueprint intermediate, archive the consumed review-stage artifacts, and hand the parent journey-map loop to the next pending framework.

## Approval Input

The user provided final compiled YAML approving:

- Evidence coverage for the service-blueprint intermediate.
- Confidence levels and visible customer-feedback gaps.
- Proposed file change: write `research/journey-map-service-blueprint.md`.

## Non-Goals

- Do not run new journey research or alter the approved service-blueprint findings.
- Do not run the `user-story-map` heavy phase in this approval-consumption step.
- Do not synthesize `research/journey-map.md` yet.
- Do not change product code, dependencies, lockfiles, or GitHub Actions.

## Plan

- [x] Reconcile approval YAML with the active service-blueprint working packet and journey-map run manifest.
- [x] Write approved canonical artifact: `research/journey-map-service-blueprint.md`.
- [x] Archive and remove active working packet: `research/_working/preliminary-service-blueprint-research.md`.
- [x] Archive the service-blueprint review page snapshot and preserve the approval record.
- [x] Recalculate manifest-selected framework progress and identify the next pending framework.
- [x] Verify artifact structure, archive state, pending-framework state, and git diff.
- [x] Commit and push intended tracked changes.

---

# FormForge Journey Map Stage 1 Scope Gate Roadmap

## Objective

Create the journey-map framework-selection review page for the active flat FormForge research scope, then stop for compiled YAML approval before writing a run manifest or running framework research.

## Scope Basis

- Active product path: flat `research/` from `research/.progress.yaml`.
- Hard prerequisite: `research/icp.md` exists and is confirmed.
- Soft context available: `research/competitive-analysis.md`, README, CLAUDE, package metadata, and existing alignment pages.
- No active journey-map run manifest or canonical journey-map artifact exists.

## Non-Goals

- Do not perform synthesized journey research in Stage 1.
- Do not write `research/_working/journey-map-run.yaml`.
- Do not write canonical `research/journey-map.md` or framework intermediates.
- Do not change product code, dependencies, lockfiles, or GitHub Actions.

## Plan

- [x] Resolve active scope and journey-map state from filesystem and progress manifest.
- [x] Gather minimal scope evidence from ICP, competitive analysis, README, CLAUDE, and package metadata.
- [x] Build review alignment page: `alignment/journey-map-formforge.html`.
- [x] Update central alignment index for the new review page.
- [x] Verify the page includes scope evidence, framework-selection gates, agent routing, TTS script, and no synthesized journey findings.
- [x] Stop for compiled YAML approval before creating the run manifest or running a framework.

---

# FormForge Competitive Analysis Stage 3 Finalization Roadmap

## Objective

Consume the approved competitive-analysis synthesis YAML, write the canonical competitive landscape report and search log, archive the consumed working state, and mark the synthesis alignment page confirmed.

## Approval Input

The user provided final compiled YAML on 2026-06-19 approving:

- Synthesis conclusion: `approve_synthesis`
- Evidence coverage: `sufficient_with_gaps`
- Artifact destination: `research/competitive-analysis.md; research/competitive-analysis-search-log.md`
- Deferred path implications: `preserve_no_promotion`
- Post-approval route: `approve_customer_lifecycle_install`

## Non-Goals

- Do not run new competitor research or change the approved synthesis unless verification finds a blocker.
- Do not promote deferred product paths.
- Do not change product code, dependencies, lockfiles, or GitHub Actions.

## Plan

- [x] Reconcile final approval YAML with the active synthesis working packet and review page.
- [x] Write canonical artifacts: `research/competitive-analysis.md` and `research/competitive-analysis-search-log.md`.
- [x] Archive and remove consumed working state: synthesis packet and run manifest.
- [x] Mark `alignment/competitive-analysis-synthesis-formforge.html` confirmed with the approval record preserved.
- [x] Update `research/.progress.yaml` and central alignment index.
- [x] Verify artifact structure, archive state, confirmed page controls, and git diff.
- [x] Commit and push intended tracked changes.

---

# FormForge Competitive Analysis Synthesis Roadmap

## Objective

Build the Stage 2 synthesis review for the approved FormForge competitive-analysis framework set without writing canonical `research/competitive-analysis.md` before final artifact approval.

## Scope Basis

- Active product path: flat `research/`
- Approved run manifest: `research/_working/competitive-analysis-run.yaml`
- Approved intermediates: Porter Five Forces, SWOT, Feature/Pricing Matrix, and Strategic Group Map
- Requested shortcut: `$competitive-analysis --synthesize`

## Non-Goals

- Do not overwrite or create canonical `research/competitive-analysis.md` until final compiled YAML approval.
- Do not change product code, dependencies, lockfiles, or GitHub Actions.
- Do not run downstream positioning, journey-map, GTM, or MVP-gap work in this session.

## Plan

- [x] Resolve synthesis state from the manifest and approved intermediate files.
- [x] Read the approved intermediate artifacts, ICP, source logs, and pack availability context.
- [x] Refresh volatile competitor/pricing/source facts with current web checks where needed.
- [x] Write the non-canonical synthesis working packet.
- [x] Build the synthesis review alignment page.
- [x] Update the central alignment index.
- [x] Verify artifact structure, page controls, script syntax, and git diff.
- [x] Commit and push intended tracked changes.

---

# FormForge Strategic Group Map Framework Roadmap

## Stage 3 Finalization

The user returned complete final compiled YAML on 2026-06-18 approving the Strategic Group Map artifact:

- Axis selection: `approve_axes`
- Whitespace and crowded zones: `approve_whitespace`
- Evidence matrix: `sufficient_with_gaps`
- Proposed file changes: `approve_scope`
- Artifact destination: `research/competitive-analysis-strategic-group-map.md`

- [x] Reconcile approval YAML with the active Strategic Group Map working packet and page.
- [x] Write approved canonical artifact: `research/competitive-analysis-strategic-group-map.md`.
- [x] Archive and remove active working packet: `research/_working/preliminary-strategic-group-map-research.md`.
- [x] Mark `alignment/strategic-group-map-formforge.html` confirmed with the approval record preserved.
- [x] Update central alignment index.
- [x] Verify artifact structure, archive state, confirmed page controls, and git diff.
- [x] Commit and push intended tracked changes.

---

## Objective

Run the next pending competitive-analysis framework, Strategic Group Map, for the flat FormForge client-service intake ICP and produce review-stage artifacts only.

## Scope Basis

- Active product path: `research/`
- Approved framework manifest: `research/_working/competitive-analysis-run.yaml`
- Completed frameworks: Porter Five Forces, SWOT, and Feature/Pricing Matrix
- Next pending framework: `strategic-group-map`

## Non-Goals

- Do not write canonical `research/competitive-analysis-strategic-group-map.md` before artifact approval.
- Do not synthesize final `research/competitive-analysis.md` in this session.
- Do not change product code, dependencies, lockfiles, or GitHub Actions.

## Plan

- [x] Resolve run state and confirm Strategic Group Map is the only pending framework.
- [x] Gather approved ICP, existing framework outputs, and current public source evidence.
- [x] Write the non-canonical Strategic Group Map working packet.
- [x] Build the Strategic Group Map review alignment page.
- [x] Update the central alignment index.
- [x] Verify review artifacts, task docs, page script, and git diff.
- [x] Commit and push intended tracked changes.

---

# FormForge Feature/Pricing Matrix Stage 3 Finalization Roadmap

## Objective

Consume the approved Feature/Pricing Matrix artifact YAML, write the canonical matrix, archive the approved working packet, and mark the alignment page confirmed.

## Approval Input

The user provided final compiled YAML on 2026-06-18 approving:

- Evidence coverage with listed source gaps.
- Canonical artifact destination: `research/competitive-analysis-feature-pricing-matrix.md`.
- Proposed file changes: write canonical intermediate, archive working packet, and confirm `alignment/feature-pricing-matrix-formforge.html`.

## Non-Goals

- Do not run new competitor research unless verification finds a substantive blocker.
- Do not run Strategic Group Map or competitive-analysis synthesis in this step.
- Do not change product code, dependencies, lockfiles, or GitHub Actions.

## Plan

- [x] Reconcile approval YAML with the Feature/Pricing Matrix working packet and review page.
- [x] Archive review-stage Feature/Pricing Matrix artifacts.
- [x] Write canonical Feature/Pricing Matrix report: `research/competitive-analysis-feature-pricing-matrix.md`.
- [x] Mark `alignment/feature-pricing-matrix-formforge.html` confirmed and preserve approval decisions.
- [x] Update central alignment index if needed.
- [x] Verify canonical artifact, archive state, confirmed page controls, and git diff.
- [x] Commit and push intended tracked changes.

---

# FormForge Feature/Pricing Alignment Interaction Fix Roadmap

## Objective

Fix `alignment/feature-pricing-matrix-formforge.html` so pricing anchors are visible without canvas rendering and section feedback controls reliably open, switch, close, and compile their matching feedback panels.

## Scope

- Replace the canvas-only pricing anchor chart with static HTML/CSS bar markup.
- Preserve the existing "View as table" price-table fallback.
- Refactor section feedback handling to find panels from the containing section.
- Harden local feedback YAML compilation so it no-ops when no feedback option is selected.
- Verify page script syntax, core page interactions, and whitespace-safe diff.

## Non-Goals

- Do not change the underlying feature/pricing research findings.
- Do not modify shared alignment TTS loading unless it blocks the requested interactions.
- Do not touch unrelated product code, dependencies, lockfiles, or GitHub Actions.

## Plan

- [x] Update task tracking docs with this execution plan.
- [x] Replace the pricing canvas with readable HTML/CSS bars.
- [x] Update feedback panel lookup and local YAML handling.
- [x] Verify inline JavaScript syntax and interaction-critical markup/script paths.
- [x] Record verification results in `tasks/todo.md`.
- [x] Commit and push intended tracked changes.

---

# FormForge Competitive Analysis SWOT Framework Roadmap

## Stage 3 Finalization

The user returned complete final compiled YAML on 2026-06-16 approving the revised SWOT artifact:

- SWOT Matrix: `approve_matrix`
- Evidence Matrix: `sufficient_with_gaps`
- Assumptions And Gaps: `preserve`
- Artifact destination: `research/competitive-analysis-swot.md`
- Proposed file changes: `approve_scope`

- [x] Reconcile approval YAML with the active SWOT working packet and review page.
- [x] Write canonical `research/competitive-analysis-swot.md` from the approved packet.
- [x] Archive and remove `research/_working/preliminary-swot-research.md`.
- [x] Convert `alignment/swot-formforge.html` to confirmed and preserve the approval record.
- [x] Verify canonical artifact, archive state, confirmed page, and git diff.
- [x] Commit and push intended tracked changes.

---

## Objective

Run the next pending competitive-analysis framework, SWOT, for the flat FormForge client-service intake ICP and produce review-stage artifacts only.

## Scope Basis

- Active product path: `research/`
- Approved framework manifest: `research/_working/competitive-analysis-run.yaml`
- Completed framework: `research/competitive-analysis-porter-five-forces.md`
- Next pending framework: `swot`

## Non-Goals

- Do not write canonical `research/competitive-analysis-swot.md` before artifact approval.
- Do not run Feature/Pricing Matrix, Strategic Group Map, or synthesis in this session.
- Do not change product code, dependencies, lockfiles, or GitHub Actions.
- Do not touch unrelated local changes in `.agents/project.json` or `desk-flip-report.md`.

## Plan

- [x] Gather current repo, ICP, and Porter context for product-grounded strengths/weaknesses.
- [x] Run cited web/source research for external opportunities and threats.
- [x] Write the non-canonical SWOT working packet.
- [x] Build the SWOT review alignment page.
- [x] Update the central alignment index if needed.
- [x] Verify review artifacts, task docs, and git diff.
- [x] Commit and push intended tracked changes.

## Stage 2 Revision

The user returned complete gate answers with `approval_status: not-approved` and an approved-with-edits note asking whether agent-first MCP and CLI access could be a compelling competitive wedge.

- [x] Check current competitor/API evidence for whether MCP/CLI-style agent-first access is a differentiated wedge.
- [x] Revise the non-canonical SWOT working packet and review page with the finding.
- [x] Keep canonical `research/competitive-analysis-swot.md` unwritten until a final approval payload is returned.
- [x] Verify review artifacts, task docs, and git diff.
- [x] Commit and push intended tracked changes.

---

# FormForge Competitive Analysis Scope Approval Roadmap

## Objective

Prepare the Stage 1 competitive-analysis scope gate for the active flat FormForge research path before any market synthesis or framework research is run.

## Scope Basis

- Active product path: `research/`
- Approved ICP: client-service consultants, coaches, and small agencies doing client intake/onboarding.
- Current product boundary: AI-assisted form builder prototype focused on describe, generate, edit, publish, submit, review, and export.
- This stage is limited to scope evidence, source plan, framework selection, output paths, assumptions, and approval gates.

## Non-Goals

- Do not run competitor web research in Stage 1.
- Do not rank competitors, make findings, or write canonical competitive-analysis deliverables before approval.
- Do not create a run manifest before compiled scope YAML approval.
- Do not change product code.

## Plan

- [x] Resolve active research scope from `research/.progress.yaml`.
- [x] Read approved ICP and repo context needed for scope selection.
- [x] Write the scope-selection alignment page at `alignment/competitive-analysis-formforge.html`.
- [x] Update the central alignment index.
- [x] Verify review page gates, index entry, and git diff.
- [x] Stop for compiled YAML approval before running framework research.

---

# FormForge Competitive Analysis Porter Framework Roadmap

## Objective

Consume the approved competitive-analysis scope YAML and run the first selected framework, Porter's Five Forces, for the flat FormForge client-service intake ICP.

## Approval Input

The user provided compiled YAML on 2026-06-15 approving:

- Flat FormForge scope and client-service intake ICP.
- All four frameworks: Porter Five Forces, SWOT, Feature/Pricing Matrix, and Strategic Group Map.
- Source plan and citation requirement.
- Proposed output paths.

## Non-Goals

- Do not write canonical `research/competitive-analysis-porter-five-forces.md` before Porter artifact approval.
- Do not run SWOT, Feature/Pricing Matrix, Strategic Group Map, or synthesis in this session.
- Do not change product code or GitHub Actions.

## Plan

- [x] Record the approved framework manifest at `research/_working/competitive-analysis-run.yaml`.
- [x] Gather current ICP/product context and Porter framework instructions.
- [x] Run cited web/source research for the market boundary and five forces.
- [x] Write the non-canonical Porter working packet.
- [x] Build/update the Porter review alignment page.
- [x] Verify outputs, task docs, and git diff.
- [x] Commit and push intended tracked changes.

---

# FormForge Porter Five Forces Stage 3 Finalization Roadmap

## Objective

Consume the approved Porter Five Forces artifact YAML, write the canonical Porter artifact, archive the approved working packet, and mark the alignment page confirmed.

## Approval Input

The user provided final compiled YAML on 2026-06-15 approving:

- Evidence coverage with stated source gaps.
- Client-service intake market boundary and alternative set.
- Force ratings: rivalry high, new entrants high, substitutes high, buyer power high, supplier power moderate.
- Canonical artifact destination: `research/competitive-analysis-porter-five-forces.md`.

## Non-Goals

- Do not run new framework research unless verification finds a substantive blocker.
- Do not run SWOT, Feature/Pricing Matrix, Strategic Group Map, or competitive-analysis synthesis in this step.
- Do not change product code or GitHub Actions.

## Plan

- [x] Reconcile the approval YAML against the active working packet and review page.
- [x] Archive the current Porter review alignment page and working packet.
- [x] Write `research/competitive-analysis-porter-five-forces.md` from the approved packet.
- [x] Convert `alignment/porter-five-forces-formforge.html` to confirmed and preserve approval decisions.
- [x] Update `alignment/index.html` if confirmation metadata changes.
- [x] Verify canonical artifact, archive state, confirmed page controls, and git diff.
- [x] Commit and push intended tracked changes.

---

# FormForge Stage 3 ICP Finalization Roadmap

## Objective

Finalize the approved FormForge ICP research cycle by writing canonical ICP artifacts, creating the approved secondary-path manifest, archiving review-stage working files, and marking the ICP alignment page confirmed.

## Approval Input

The user provided final compiled YAML on 2026-06-15 approving:

- Flat FormForge scope and current product boundary.
- Candidate A as the primary ICP: client-service consultants, coaches, and small agencies doing client intake/onboarding.
- Evidence coverage as sufficient for canonical ICP writing.
- Creation of `research/.progress.yaml` with deferred/revisit product path entries, without creating directories.
- Canonical writes to `research/icp.md`, `research/icp-search-log.md`, and optional `research/.progress.yaml`.

## Non-Goals

- Do not create secondary product-path directories.
- Do not run downstream competitive analysis, positioning, monetization, GTM, specs, or implementation work.
- Do not change GitHub Actions.

## Plan

- [x] Reconfirm the active ICP working packet and alignment page are still review-stage.
- [x] Archive the review-stage ICP alignment page and working packet under `docs/history/archive/2026-06-15/<timestamp>/`.
- [x] Write `research/icp.md` from the approved working packet using canonical ICP headings.
- [x] Write `research/icp-search-log.md` with query, evidence, scoring, source coverage, and gap details.
- [x] Create `research/.progress.yaml` with active FormForge scope plus approved deferred/revisit entries.
- [x] Convert `alignment/icp-formforge.html` from review to confirmed and preserve the approval record.
- [x] Update `alignment/index.html` so ICP is shown as confirmed.
- [ ] Verify required sections, removed working packet, archive paths, and git diff.
- [ ] Commit and push intended tracked changes.

---

# FormForge Stage 2 Customer Discovery Roadmap

## Objective

Complete the approved Stage 2 customer-discovery research for FormForge's fresh-start describe-edit-publish-submit-review loop.

## Approval Input

The user approved the Stage 1 scope gates on 2026-06-15:

- Fresh-start pre-product discovery scope.
- 12-category web/repo source plan.
- Non-canonical working packet at `research/_working/preliminary-customer-discovery-research.md`.
- Stage 2 evidence matrix, source gaps, confidence register, and review-page format gate.

## Non-Goals

- Do not write or update canonical files such as `research/icp.md`.
- Do not create implementation specs or product roadmap tasks from the research.
- Do not execute child framework artifacts as canonical deliverables in this stage.

## Plan

- [ ] Reconfirm repo context and prior seed artifacts.
- [ ] Run current web/source checks across approved source categories.
- [ ] Synthesize a non-canonical customer-discovery working packet.
- [ ] Update `alignment/customer-discovery-formforge.html` as a Stage 2 review page.
- [ ] Update `alignment/index.html` if needed.
- [ ] Verify files render and no canonical research files changed.
- [ ] Commit and push the intended tracked changes if verification passes.

---

# FormForge Product-Path Retirement Roadmap — 2026-08-24

## Objective

Archive the active FormForge research product path after the owner concluded
that standalone deployment is not economically justified relative to the
integration, compliance, infrastructure, billing, deliverability, and customer
support burden.

## Plan

- [x] Preserve the flat `research/` evidence directory and all evidence refs.
- [x] Remove FormForge from `active_paths` and mark the main path archived.
- [x] Record the dated archive rationale and a high-bar revisit condition.
- [x] Leave materially different deferred/revisit candidates unchanged.
- [x] Validate YAML structure and diff hygiene.
- [x] Commit and push the manifest and task record.
