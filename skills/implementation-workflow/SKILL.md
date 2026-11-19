---
name: implementation-workflow
description: Implement or resume an approved software spec or implementation plan. Execute directly with full-plan, milestone, or task-sized scope as applicable; respect repository testing and CI requirements, verify results, and preserve resumable progress across sessions.
---

# Implementation Workflow

Execute approved software changes in the current agent context. This skill implements and verifies; `planning-workflow` owns discovery, specification, formal planning, and artifact approvals.

## Rules

- The approved spec governs behavior, contracts, and architectural decisions. When a corresponding formal plan exists, use **plan execution**; never bypass an unapproved or incompatible plan by switching to spec execution.
- Execute directly; do not dispatch implementation or review subagents. Do not reopen settled requirements or create a formal plan during execution.
- Respect the user's execution boundary. Continue without routine approval checkpoints inside that boundary; stop when it is reached.
- Follow repository conventions and mandatory CI/CD gates. Verification must be evidenced, not assumed.
- Keep one consolidated, persistent execution checkpoint. Protect preexisting and unrelated changes.

## Execution continuity

Once execution begins, continue until the authorized Task, Milestone, or full scope is completed, or a concrete blocker prevents further safe progress. Completion includes implementation, applicable documentation, required verification, and diff review. Do not enter an unselected scope.

Do not end the turn or report final status while authorized work remains actionable. Inspection, internal planning, checkpoints, partial implementation, and identifying next steps are not stopping points. Handle recoverable failures, unexpected complexity, and ordinary technical adjustments autonomously.

Before declaring a blocker, investigate feasible in-scope alternatives and complete independent work that can proceed safely. Record the concrete impediment, evidence, alternatives attempted, affected scope, and external action or material decision needed. Respect explicit user interruption; harness or runtime interruptions cannot be prevented by this skill, so preserve an accurate checkpoint when possible.

## 1. Identify and prepare

1. Use the provided spec/plan paths, or locate the corresponding artifacts through targeted repository inspection. Follow repository conventions (defaults: `docs/development/specs/` and `docs/development/plans/`). Confirm approval from the conversation: a clear request to execute the presented spec or plan counts as approval. The artifact's existence alone is insufficient; if authorization is unclear, ask.
2. If an approved plan exists, read [plan execution](references/plan-execution.md). If no formal plan exists and the spec is approved, read [spec execution](references/spec-execution.md). If a formal plan is unapproved, contradictory, or materially stale, resolve that before editing.
3. Read [progress guidelines](references/progress-guidelines.md) and [testing guidelines](references/testing-guidelines.md). Load applicable repository instructions (`AGENTS.md`, `CLAUDE.md`, etc.).
4. Inspect branch, HEAD, working tree, relevant preexisting changes, and the source artifacts' Git baseline when available. Revalidate material assumptions affected by changes; a changed SHA alone is not a blocker. Find relevant testing patterns, documentation and quality gates. Keep this check proportional; do not redo the planning investigation.
5. Find and reconcile an existing checkpoint with the actual code and Git state before resuming. Do not require a clean working tree or overwrite unrelated work. Do not silently switch branches, create worktrees, reset/discard changes, or modify history.

## 2. Choose how far to execute

Use the scope the user already specified; otherwise, explain the applicable modes briefly and ask once. A recommendation may be offered but does not override the choice.

| Flow | Modes |
| --- | --- |
| Plan | `FULL` (all remaining Tasks), `MILESTONE` (next incomplete Milestone, only if one exists), `TASK` (next incomplete Task) |
| Spec | `FULL` (all remaining requirements), `TASK` (one cohesive, verifiable increment) |

Spec execution must **not** generate a Task inventory or seek approval of task decomposition before asking the execution mode. The agent identifies logical Tasks as needed while implementing. No `CUSTOM` mode or artificial Milestones.

An interrupted scope may be resumed without choosing again when the user asks to continue. Once a scope has completed, starting another requires a new instruction; do not assume consent to continue the whole implementation. If the user specifies a particular planned Task/Milestone, check prerequisites before executing it.

## 3. Implement and checkpoint

Initialize or update `.development/executions/<source-name>/progress.md` as described in [progress guidelines](references/progress-guidelines.md).

Follow the selected flow's Task discipline. For each authorized increment: inspect relevant code, implement approved behavior using project patterns, verify via [testing guidelines](references/testing-guidelines.md), update applicable internal documentation with the change, review the relevant diff, and record only verified progress. Use meaningful intermediate checkpoints for long work or decisions, not a log of every action.

Keep moving within the authorized scope unless a material blocker or decision arises. Never silently omit an applicable Step, requirement, documentation update, or mandatory gate.

## 4. Autonomy and deviations

Resolve ordinary technical details, equivalent adjustments to renamed code, and necessary proportionate local refactors without asking. Small improvements in the modified area are acceptable when safe and directly relevant; do not broaden the change for incidental cleanup.

Record significant optional refactors or architectural improvements outside the approved scope and continue the original work. Do not implement them without authorization; report the opportunity with its evidence, benefit, risks, and scope impact.

Escalate unresolved material changes to approved behavior, contracts, architecture, scope, or required quality gates only when a decision is indispensable for safe progress. If approved artifacts change, revalidate affected work and preserve unaffected progress.

## 5. Verify and stop

Use focused checks for Tasks; verify relevant interactions at Milestone boundaries and appropriate broader checks at full completion. Directly review spec compliance and implementation quality; do not claim independent review. Mark work complete only when applicable verification supports it. Record missing, failed, blocked, or stale checks truthfully.

At the authorized boundary, update `progress.md` and report changes, checks/results, limitations, and remaining work. Separate **execution-scope completion** from **overall implementation completion**. Stop without beginning the next scope.

Commits, pushes, PRs, merges, and deployments require their own authorization or applicable repository instructions; none is imposed as a completion prerequisite by this skill. Follow the user's language and repository conventions for communication and generated artifacts.
