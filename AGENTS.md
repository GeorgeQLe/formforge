# FormForge agent instructions

## Workflow

Global rules in `~/AGENTS.md` apply (subagent use, CI, secrets, storage); this section adds repo workflow only.

- Plan before non-trivial work (3+ steps or architectural decisions). If something goes sideways, stop and re-plan.
- Subagents: only for independent work, with one complete brief each. Run batch work as a script, not a long-lived agent.
- Verify before calling work done: run the tests, check logs, show it works. Routine verification runs inside the current step.
- Prefer the simplest change that fixes the root cause; touch only what is needed. For non-trivial changes, ask whether there is a cleaner way.
- Given a bug report, investigate the logs and failing tests and fix it without hand-holding.
- Revision feedback: move the artifact to the requested final state; do not re-add rejected framing.
- Commit sequential work directly on the primary branch unless asked for a branch; parallel agent write lanes use separate branches and a review step before landing. Commit and push finished tracked changes unless told not to.

## Parallel work in the monorepo

- When running as one of several parallel agents, never run a command that changes the shared lockfile (`pnpm install`, `pnpm add`, `npm install`, `yarn add`). Stage dependency changes in one serial session before parallel work starts; if you need a new dependency mid-task, stop and ask for it centrally.
- Parallel agents write only inside their own package directory; check that planned scopes do not overlap before launching them.

## Tasks

- Full plan in `tasks/roadmap.md`, current phase in `tasks/todo.md` with checkable items; mark progress as you go and add a short review section when done.
- After a correction from George, record the pattern in `tasks/lessons.md`; review it at session start.
