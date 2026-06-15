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
