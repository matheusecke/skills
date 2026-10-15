# Spec Execution

Implement directly from an approved spec **only when no corresponding formal implementation plan exists**. The spec governs behavior, contracts, boundaries, and approved architecture; implementation sequencing and local technical choices emerge during execution.

## Understand before editing

Read the spec and inspect the relevant implementation, dependencies, project conventions, tests, CI/CD requirements, and internal documentation. Investigate only enough to implement safely; do not repeat requirements discovery or produce a formal plan.

If a material product/architecture decision is missing, or the work is substantially more complex than the spec anticipated, pause and recommend returning to `planning-workflow` when appropriate. Do not improvise approved requirements.

## Modes and emergent Tasks

- `FULL`: implement remaining spec requirements through as many logical increments as needed without stopping at each Task.
- `TASK`: identify and finish **one** cohesive, verifiable increment; checkpoint and stop for the user to review progress and decide whether to continue.

Do **not** prepare or present a complete Task breakdown before selecting a mode, and do **not** ask the user to approve task decomposition.

Name operational increments `Task 1 — Title`, `Task 2 — Title`, etc., as they emerge. A Task is a meaningful outcome (ideally a vertical behavior slice), not an arbitrary file or layer. Include its relevant implementation, checks, and documentation together; one small spec may have one Task.

Record only Tasks discovered so far in `progress.md`. Preserve stable identifiers, and refine remaining Tasks as needed without renumbering completed ones. These operational Tasks do not require the formal `Objective / Scope / Steps` plan format.

## Implement and verify

For each increment, determine the smallest suitable technical approach, inspect the affected code and callers, make the changes, apply [testing guidelines](testing-guidelines.md), update applicable documentation, and review the result against the spec. Record completion only when the increment and required verification are satisfied.

Make ordinary technical decisions autonomously within the approved spec. Treat significant recommended refactoring outside its scope, material contract changes, and unexpectedly complex planning needs under the parent skill's decision rules. Do not add unapproved product behavior.

In `TASK` mode, do not stop after an internal edit if the logical increment is not yet coherent or verified. In `FULL` mode, continue until the full spec is satisfied or blocked. After all recorded Tasks are complete, still compare the actual implementation with **every approved requirement** before marking overall completion; the emergent Task list may be incomplete.

If a formal plan is later approved, switch future work to plan execution after reconciling prior progress; do not reset validated work automatically.
