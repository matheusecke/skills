# Plan Execution

Use this flow whenever a corresponding formal implementation plan exists and has been approved. The plan gives the execution structure; the approved spec governs requirements and contracts.

## Read the plan

Identify each `Task N` with its `Objective`, `Scope`, and `Steps`, any `Milestone N`, execution order, special dependencies, applicable checks, and documentation actions. Follow Tasks and Steps in documented order unless the plan explicitly states otherwise. Do not restructure, renumber, or recreate the plan.

Check for material drift or contradictions before implementation without repeating discovery. Refer unresolved decisions to the parent workflow.

## Execution boundary

- `FULL`: remaining Tasks in order.
- `MILESTONE`: remaining Tasks of the next incomplete Milestone (only if present).
- `TASK`: next incomplete Task.

Resume an incomplete Task/Milestone first unless the user directs otherwise. A specifically requested Task or Milestone may be targeted when prerequisites are satisfied. Never silently add unselected prerequisite Tasks; surface the dependency and obtain a scope decision.

## Task execution

- **Objective:** confirm the observable outcome.
- **Scope:** use the documented file/operation inventory. Inspect the relevant files; Scope says *where*, not *how*. If paths have changed or an additional file is necessary, investigate and make only equivalent, local adjustments autonomously. Escalate material scope changes.
- **Steps:** perform the concrete changes in order, including applicable tests, checks, and internal documentation updates. Use project-compatible verification rather than imposing test layers or commands not supported by the repository. Keep contracts and specified regression scenarios intact.

An obsolete method name, file path, or command is not permission to skip a Step. Verify an equivalent adjustment. If a Step materially conflicts with the approved spec, stop to resolve the inconsistency; do not replace the design unilaterally.

Document behavior changes with their corresponding Task, not as an unrelated final cleanup. Respect historical documents. Use [testing guidelines](testing-guidelines.md) for applicable test and CI/CD expectations.

## Task and scope completion

Mark a Task `COMPLETED` only after its Objective, applicable Steps, requirements, documentation, and required checks have been satisfied and its changes reviewed. Record evidence in `progress.md`; unresolved required verification prevents completion.

At a Milestone boundary, check applicable integration among its Tasks. At full-plan completion, check cross-Task behavior, spec coverage, documentation, and required overall gates. For partial execution, validate only the authorized completed scope and relevant dependencies; do not require unfinished future Tasks to be complete.

Close the current execution at its chosen boundary. Mark the **overall plan** complete only when all planned work and applicable final verification have passed.
