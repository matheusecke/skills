# Technical planning guidelines

## When to plan

A separate plan starts **only after explicit approval of the spec**.

- **Tier 1:** usually omit; create if the user asks or coordination warrants it.
- **Tier 2:** create if sequential dependencies, cross-module contracts, multiple work sessions, or handoff risk make decomposition valuable. Otherwise the approved spec is sufficient.
- **Tier 3:** always create a structured plan.

Use repository conventions; otherwise `docs/development/plans/YYYY-MM-DD-<slug>-implementation.md`. Record `status`, `tier`, `updated`, `reference_commit`, and a link or path to the approved spec. Do not assume any future execution tool or orchestration.

The same task structure applies whenever a plan exists. Tier and risk decide how many tasks, steps, and bullets are warranted. A simple plan may be a single task with a few steps and no milestone. A complex plan may use several milestones, shared interfaces, explicit non-sequential dependencies, and integrated checks.

**Tasks and Steps follow their documented execution order by default. Explicit dependencies are described only when they introduce non-sequential prerequisites, parallel execution opportunities or cross-component coordination requirements.**

State that convention once, near the start of the plan. Sequential order needs no restatement. Describe a special dependency in one sentence where it applies — at plan level, between milestones, or immediately before the affected task's Objective — and do not add a Dependencies section. State allowed parallelism explicitly. Keep integration prerequisites across components visible. Dependency analysis stays part of planning.

## Planning principles

Write `Milestone N`, `Task N`, and `Step N` in full. Do not use `M1`, `T1`, or `T1.1` as the primary names. Add a milestone only for a real phase boundary.

The plan is a **technical execution map**. Reference approved contracts instead of restating them. Describe the work in natural language. Another reader must be able to execute and review it without rediscovering what changes or consulting a separate scenario list.

Do not include test implementation code (`describe`, fixtures, mocks, assertions). Include production code only when a signature, algorithm, or technical contract would otherwise stay ambiguous, and keep that snippet minimal. Give a command only when it was verified in the repository, and do not claim that check already ran.

Prefer direct drafting. For genuinely complex coordination, an optional skeleton — milestones, a stable file inventory, and any non-sequential dependencies — may come first, then tasks expand incrementally. The skeleton is not an approval gate. Every task presented for approval already uses the task structure below. Do not submit placeholder tasks.

Prefer vertical slices with a cohesive, verifiable outcome. Avoid empty scaffolding and layer-by-layer splits that do not change that outcome. Keep each test with the task that owns the behavior. Include schema, migration, and regression work when the change needs them.

When automated tests apply and repository practice supports it, prefer this order and skip any stage that does not: define regressions and expected behavior; confirm the previous behavior; implement the change; run focused checks; synchronize documentation; run any further validation. Follow the project's test scope and file patterns. Include mandatory CI/CD, coverage, and other required checks, and do not omit one silently. Do not plan tests for layers or file kinds the project normally does not test, unless explicitly required or justified and approved. Do not require a failing test first when the activity or the project does not support it. Do not add a stage only to match this list, and do not prescribe an execution tool, red-green-refactor checklist, branch strategy, worktree, agent split, or commit sequence.

A general validation matrix is optional. Add one only when it adds concrete value: shared-contract traceability across tasks, integrated acceptance between applications, cross-cutting scenarios that belong to no single task, or a repository-specific requirement. When it exists, do not reproduce the Steps' tests in full. An identifier from the spec or the matrix may accompany a scenario; it does not replace the scenario. The spec remains the source of truth; do not copy it into the plan.

Do not add tables, indexes, or summaries that only restate the tasks.

## Task structure

**Task N — Title**

**Objective**

The discrete, observable result, stated briefly.

**Scope**

The file inventory only. One short entry per file: the operation (`Create`, `Modify`, `Test`, `Docs`, `Remove`, or an equivalent) and a concrete path. Use a path confirmed in the investigation, or a new path the change requires; mark that new file as an addition. Mark a conditional change as conditional. Do not name methods, functions, interfaces, or contracts, and do not describe the change.

**Steps**

The ordered technical work: tests, implementation, documentation, and checks. Follow [Step structure](#step-structure).

A task is complete when its actions and the verifications that apply to it are satisfied. Criteria that span tasks belong at the milestone close or in the plan's integrated validation, and only when the Steps do not already state them.

Scope lists the files. Steps describe the execution. Every file in Scope is identifiable in at least one Step, and every file a Step changes appears in Scope. Repeating a file name is appropriate; do not repeat a whole description, and do not add a matrix or section for this correspondence.

## Step structure

Each Step is one logical stage with a descriptive title: `Step N — Title`. State a single action as a short paragraph. When the stage contains distinct changes, scenarios, or checks, list them as bullets in execution order.

Each relevant action identifies the file, the methods, functions, interfaces, or contracts involved when they apply, the concrete change, and the expected behavior or the responsibility that stays. Name methods the investigation identified; do not invent them. Another agent must be able to tell what to change in each method from the Steps alone.

Do not repeat the full path on every bullet when those bullets are grouped under the same file. Related methods may share a bullet when the change is cohesive. Do not fold distinct responsibilities into one generic instruction.

When an automated test applies, name the test file that matches the project's patterns. Each distinct behavior gets its own bullet with the condition and the expected result. When none applies, state the pertinent verification instead of inventing test infrastructure. A Step is understandable on its own: do not use identifiers such as `V1–V4` or `AC03` as the description of a check.

A documentation action follows [Documentation synchronization](#documentation-synchronization). Independent checks — focused tests, contract or integration checks, regressions, static checks, and any mandatory CI/CD or coverage gate — each get a bullet when they apply.

Do not repeat one sentence across bullets, turn a trivial condition into its own task, or add a bullet with no technical content. Keep bullets that belong to one stage inside that Step. Do not create a Step only to fill a standard sequence.

## Documentation synchronization

Bind each documentation update to the task that changes the related behavior. Do not collect those updates into a generic final task. List the document in Scope with `Docs`. In the Step, state the rule, contract, or description to update, and the old or incompatible statements to correct. Documents that need different updates stay separate. A functional change is not complete until that internal documentation matches the implementation. Schedule the update after the implementation and the focused checks it describes. This workflow only schedules that work; it does not edit operational documents before the behavior exists.

When the spec records that no document applies and does not justify a new one, record documentation as `N/A` in Scope and do not add a documentation step. Preserve historical records: change an ADR only when that change is appropriate, and leave the past decision intact.

When documents are updated, include one consistency check that no applicable document still describes a replaced rule or contract. Place that check where it can see those updates; tasks may share it. The check confirms the updates. It does not replace them, and it does not repeat scenarios the Steps already state in full. Do not add a milestone or a documentation-only task solely for the check.

## Review and approval

- Trace spec requirements, acceptance behaviors, and documentation impacts to the plan, or state why no change is needed.
- Check execution order, special dependencies, and milestone boundaries.
- Confirm each task matches [Task structure](#task-structure) and [Step structure](#step-structure).
- Confirm Files, Interfaces / Methods, Dependencies, and Acceptance are not required task sections.
- Confirm documentation follows [Documentation synchronization](#documentation-synchronization).
- Confirm a validation matrix, if present, is not required to understand a Step.
- Check applicable tests, mandatory verification gates, migrations, errors, compatibility, and exclusions.
- Ensure the plan neither contradicts the approved spec nor invents product or architecture choices.

Resolve editorial or decomposition issues internally. If a behavioral or material architectural uncertainty arises, return to the spec and seek renewed approval before completing the plan. Mark `awaiting_approval`, present the plan, and **stop**. Once approved, set `approved` and hand off documents only.
