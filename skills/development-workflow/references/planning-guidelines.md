# Technical planning guidelines

## When to plan

A separate plan starts **only after explicit approval of the spec**.

- **Tier 1:** usually omit; create if the user asks or coordination warrants it.
- **Tier 2:** create if sequential dependencies, cross-module contracts, multiple work sessions, or handoff risk make decomposition valuable. Otherwise the approved spec is sufficient.
- **Tier 3:** always create a structured plan.

Use repository conventions; otherwise `docs/development/plans/YYYY-MM-DD-<slug>-implementation.md`. Record `status`, `tier`, `updated`, `reference_commit`, and a link or path to the approved spec. Do not assume any future execution tool or orchestration.

The same task structure applies whenever a plan exists. Tier and risk decide how many tasks, steps, and bullets are warranted. A simple plan may be a single task with a few steps and no milestone. A complex plan may use several milestones, shared interfaces, dependencies, and integrated checks.

## Planning principles

Write `Milestone N`, `Task N`, and `Step N` in full. Do not use `M1`, `T1`, or `T1.1` as the primary names. Add a milestone only for a real phase boundary.

The plan is a **technical execution map**. Reference approved contracts instead of restating them. Name the files, interfaces, methods, and responsibilities identified in the investigation. Describe implementation in natural language, specify scenarios and expected results, and state dependencies and verifiable completion criteria. Another reader must be able to execute the plan without rediscovering what changes.

Express each scenario as inputs, conditions, and expected outcomes. Do not include test implementation code (`describe`, fixtures, mocks, assertions). Include production code only when a signature, algorithm, or technical contract would otherwise stay ambiguous, and keep that snippet minimal. Identify regression coverage for a bug fix, and the acceptance, boundary, integration, and failure scenarios the change needs. Give a command only when it was verified in the repository, and do not claim that check already ran.

Prefer direct drafting. For genuinely complex coordination, an optional skeleton — milestones, a stable file and interface map, and task dependencies — may come first, then tasks expand incrementally. The skeleton is not an approval gate. Every task presented for approval already uses the task structure below. Do not submit placeholder tasks.

Prefer vertical slices with a cohesive, verifiable outcome. Avoid empty scaffolding and layer-by-layer splits that do not change that outcome. Keep each test with the task that owns the behavior. Include schema, migration, and regression work when the change needs them.

When repository practice supports it, prefer this order and skip any stage that does not apply: define regressions and expected behavior; confirm the previous behavior; implement the change; run focused checks; synchronize documentation; run any further validation. Do not require a failing test first when the activity or the project does not support it. Do not add a stage only to match this list, and do not prescribe an execution tool, red-green-refactor checklist, branch strategy, worktree, agent split, or commit sequence.

## Task structure

**Task N — Title**

- **Objective:** the discrete, observable result.
- **Files:** concrete paths, each marked `Create`, `Modify`, `Test`, `Docs`, or `Remove`. Distinguish paths confirmed in the repository from additions the change requires.
- **Interfaces / Methods:** interfaces, functions, methods, contracts, and integration points. For each, state whether it is created, changed, or preserved, and its responsibility. Point to the spec for the behavior and describe the delta. Omit this section, or write `N/A`, when a purely documentary or verification task involves none.
- **Steps:** the ordered technical actions. Follow [Step structure](#step-structure).
- **Dependencies:** prior tasks, shared contracts, and invariants. Write `None` when there are none.
- **Acceptance:** objective completion criteria, including agreement among the task's behavior, tests, and applicable documentation.

Keep each section concise. Objective, Files, Steps, and Acceptance stay. Omit **Interfaces / Methods** only in the case above. A missing dependency needs no justification beyond `None`.

## Step structure

Each Step is one logical stage with a descriptive title. State a single action as a short paragraph. When the stage contains distinct changes, scenarios, or checks, list them as bullets in execution order. Each bullet states the behavior, the responsibility, and the expected result, and names the file, method, or interface the investigation identified.

Separate logically distinct actions. Group equivalent methods or test cases that share the same responsibility and expected result.

- Different test behaviors each get a bullet with the input or condition and the expected result. When they span files or functional areas, group the bullets by file or area inside the same Step.
- Independent changes, such as a DTO, a controller, and a service, each get a bullet: where the change happens, what changes, and which contract stays.
- Helper methods in one cohesive change may share a bullet when the affected methods and their responsibility stay explicit.
- Documents with different updates each get a bullet: path, the rule or contract to change, and the old or incompatible statements to correct.
- Independent checks — focused tests, integration or contract checks, regressions, and static checks — each get a bullet. Name a command only when the repository verifies it. Do not invent commands, files, or paths.

Do not repeat one sentence across bullets, turn a trivial condition into its own task, or add a bullet with no technical content. Keep bullets that belong to one stage inside that Step.

Illustrative shape, not a required count or a real contract:

**Step 1 — Define the regressions**

In the focused test file:

- **Omitted input:** the input, the condition, and the behavior that must remain.
- **Explicit empty input:** the input, the condition, and the result that must change.

**Step 2 — Implement the contract**

- **DTO and validation:** the distinction to preserve.
- **Service method:** the behavior to change and the contract that stays.
- **Controller method:** what it continues to delegate, without new business logic.

## Documentation synchronization

Bind each documentation update to the task that changes the related behavior. Do not collect those updates into a generic final task. For every affected document, name its path and the rule, contract, or behavior to update, including old references and incompatible statements to correct. A functional change is not complete until that internal documentation matches the implementation. Schedule the update after the implementation and the focused checks it describes. This workflow only schedules that work; it does not edit operational documents before the behavior exists.

When the spec records that no document applies and does not justify a new one, mark documentation `N/A` and do not add a documentation step. Preserve historical records: change an ADR only when that change is appropriate, and leave the past decision intact.

When documents are updated, include one consistency check that no applicable document still describes a replaced rule or contract. Place that check where it can see those updates. The check confirms them; it does not replace per-task updates. Do not add a milestone or a documentation-only task solely for the check.

## Review and approval

- Trace spec requirements, acceptance behaviors, and documentation impacts to the plan, or state why no change is needed.
- Check dependencies, milestone order, shared interfaces, and responsibility boundaries.
- Confirm each task has Objective, Files, Steps, and Acceptance, plus Interfaces / Methods unless that section is omitted or marked `N/A` as allowed above. Dependencies are `None` when absent.
- Confirm distinct actions and test scenarios are separate bullets, and equivalent items that share one responsibility stay together.
- Confirm documentation updates sit with the functional change. When documents change, a consistency check covers the replaced rules and contracts. When none apply, documentation is `N/A` and no documentation step was added.
- Ensure the plan neither contradicts the approved spec nor invents product or architecture choices.
- Check tests, migrations, errors, compatibility, and out-of-scope boundaries as applicable.
- Keep the plan usable without the conversation, and do not repeat the spec.

Resolve editorial or decomposition issues internally. If a behavioral or material architectural uncertainty arises, return to the spec and seek renewed approval before completing the plan. Mark `awaiting_approval`, present the plan, and **stop**. Once approved, set `approved` and hand off documents only.
