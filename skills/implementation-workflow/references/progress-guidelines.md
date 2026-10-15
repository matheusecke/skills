# Progress and Recovery Guidelines

Keep **one consolidated checkpoint per implementation**, supporting long execution, context compaction, session changes, and handoff to another agent. This is operational state, not a copy of the spec, plan, code, or raw logs.

## Location and identity

Default: `.development/executions/<source-name>/progress.md`, using the approved plan filename stem when present, otherwise the spec filename stem. Follow a different established repository location when applicable.

Reuse one record across Task, Milestone, and Full execution sessions. Before creating one, look for matching records and reconcile them with the actual artifacts. Do not overwrite an unrelated run. If the same source needs a genuinely independent run, use a distinct directory. If spec execution later gains an approved plan, locate and carry forward its existing checkpoint rather than silently splitting the history.

## Content

Use these five sections, keeping them brief:

```md
# Implementation Progress

## Context
- Flow: plan-execution | spec-execution
- Spec: <path>
- Plan: <path, if any>
- Branch / baseline: <branch and reference SHA, if available>
- Last observed HEAD: <SHA, if available>
- Relevant preexisting changes: <short description, if any>

## Overall Progress
- Status: IN_PROGRESS
- Task 1 — <title>: COMPLETED (verification: <brief evidence>)
- Task 2 — <title>: IN_PROGRESS
- Final verification: PENDING

## Current Execution
- Mode: FULL | MILESTONE | TASK
- Scope: <authorized boundary>
- Status: IN_PROGRESS

## Current Checkpoint
- Position: <Task and Step if applicable>
- Completed / remaining: <short factual summary>
- Relevant changes: <files or components>
- Verification: <check, result, scope; currency if relevant>
- Next action: <one specific resumable action>

## Decisions & Blockers
- <active decision or concise consequential decision; otherwise none>
```

Omit inapplicable fields. For **plan execution**, retain original Task/Milestone IDs; do not restate Steps. For **spec execution**, record emergent `Task N` items as identified. Do not require an upfront Task inventory or equate all currently identified Tasks with all spec requirements.

## States

- **Overall:** `IN_PROGRESS`, `BLOCKED`, `COMPLETED`.
- **Current execution:** `IN_PROGRESS`, `PAUSED`, `BLOCKED`, `COMPLETED`.
- **Task:** `PENDING`, `IN_PROGRESS`, `BLOCKED`, `COMPLETED`.

The authorized execution scope can be `COMPLETED` while the overall implementation remains `IN_PROGRESS`. Overall completion also requires the applicable final verification; completed Tasks alone are not sufficient. Checks may be `PASS`, `FAIL`, `NOT_RUN`, `BLOCKED`, or `NOT_APPLICABLE`; mark stale evidence explicitly.

## Checkpoints

Initialize before the first implementation edit. Update when a scope is chosen/changed, when starting or verifying a Task, on significant progress within a long Task, on consequential decisions or blockers, and when pausing or finishing. Update before a predictable context handoff when possible. Do not rewrite the file after every command or trivial Step.

Keep the **latest reliable state**, with concise completed Task evidence and only consequential decisions. Replace obsolete checkpoints rather than appending a diary. Preserve which work remains, which checks passed, what changed since those checks, and the next safe action.

## Resume and reconcile

1. Read the checkpoint and referenced approved artifacts.
2. Inspect current branch, HEAD, working tree, and relevant code; uncommitted work cannot be assessed from SHAs alone.
3. Confirm which recorded outcomes and checks remain valid; distinguish preexisting changes from the execution's work.
4. Selectively revalidate stale or uncertain work; avoid redoing valid Tasks or all historical checks without cause.
5. Correct the checkpoint and resume the previously authorized unfinished scope, or use the new scope the user explicitly chose.

If a checkpoint is missing or unreliable, reconstruct only facts supported by current artifacts and evidence, and record uncertainty. If a scope has already completed, do not automatically begin the next scope.

For a material discovery, record its impact, pending user decision, and what will be needed to resume. When a spec/plan is revised and approved, reopen/revalidate only affected work; preserve unaffected progress.

At the selected execution boundary, record its true status, verification evidence, remaining work, and next action. Keep the checkpoint after full completion.
