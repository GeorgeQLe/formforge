# FormForge Strategic Group Map Framework Roadmap

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
- [ ] Verify review artifacts, task docs, page script, and git diff.
- [ ] Commit and push intended tracked changes.

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
