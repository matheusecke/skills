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

The plan is a **technical execution map**. Reference approved contracts instead of restating them. Name the files, interfaces, methods, and responsibilities identified in the investigation. Describe implementation in natural language and specify scenarios and expected results. Another reader must be able to execute and review the plan without rediscovering what changes or consulting a separate scenario list.

Express each scenario as inputs, conditions, and expected outcomes. Do not include test implementation code (`describe`, fixtures, mocks, assertions). Include production code only when a signature, algorithm, or technical contract would otherwise stay ambiguous, and keep that snippet minimal. Identify regression coverage for a bug fix, and the acceptance, boundary, integration, and failure scenarios the change needs. Give a command only when it was verified in the repository, and do not claim that check already ran.

Prefer direct drafting. For genuinely complex coordination, an optional skeleton — milestones, a stable file and interface map, and any non-sequential dependencies — may come first, then tasks expand incrementally. The skeleton is not an approval gate. Every task presented for approval already uses the task structure below. Do not submit placeholder tasks.

Prefer vertical slices with a cohesive, verifiable outcome. Avoid empty scaffolding and layer-by-layer splits that do not change that outcome. Keep each test with the task that owns the behavior. Include schema, migration, and regression work when the change needs them.

When repository practice supports it, prefer this order and skip any stage that does not apply: define regressions and expected behavior; confirm the previous behavior; implement the change; run focused checks; synchronize documentation; run any further validation. Do not require a failing test first when the activity or the project does not support it. Do not add a stage only to match this list, and do not prescribe an execution tool, red-green-refactor checklist, branch strategy, worktree, agent split, or commit sequence.

A general validation matrix is optional. Add one only when it adds concrete value: shared-contract traceability across tasks, integrated acceptance between applications, cross-cutting scenarios that belong to no single task, or a repository-specific requirement. When it exists, do not reproduce the Steps' tests in full. An identifier from the spec or the matrix may accompany a scenario; it does not replace the scenario. The spec remains the source of truth; do not copy it into the plan.

Do not add tables, indexes, or summaries that only restate the tasks.

## Task structure

**Task N — Title**

**Objective**

The discrete, observable result, stated briefly.

**Scope**

The map of affected files and the responsibility of each change. Organize by concrete file or component. Mark each entry `Create`, `Modify`, `Test`, `Docs`, `Remove`, or an equivalent. Under each file, name the relevant methods, functions, interfaces, or contracts and state briefly what changes or stays. Keep the file and its technical responsibility adjacent.

Distinguish paths confirmed in the repository from additions the change requires. Mark a conditional change as conditional. Do not invent paths or methods the investigation did not verify. Several helper methods that share one responsibility may share one bullet; independent changes stay individually identifiable. Do not turn Scope into a second description of the Steps.

Scope answers which files and components are affected, and what each change is responsible for.

When no internal document applies and a new one is not justified, record documentation as `N/A` here and do not add a documentation step.

**Steps**

The ordered execution, including the tests, implementation, documentation, and checks that apply. Follow [Step structure](#step-structure).

A task is complete when its actions and the verifications that apply to it are satisfied. Criteria that span tasks belong at the milestone close or in the plan's integrated validation, and only when the Steps do not already state them. Do not repeat those scenarios there.

Keep the three sections distinct. Objective states the result. Scope maps the changes. Steps order the work and the checks. Do not repeat full paragraphs across them, and do not restate a spec contract when a reference and an implementation note suffice.

## Step structure

Each Step is one logical stage with a descriptive title: `Step N — Title`. State a single action as a short paragraph. When the stage contains distinct changes, scenarios, or checks, list them as bullets in execution order. Each bullet states the behavior, the responsibility, and the expected result, and names the file, method, or interface when that identification matters.

A Step is understandable on its own. Do not use identifiers such as `V1–V4` or `AC03` as the description of a test.

Separate logically distinct actions. Group equivalent methods or test cases that share the same responsibility and expected result.

- Different test behaviors each get a bullet with the input or condition and the expected result. When they span files or functional areas, group the bullets by file or area inside the same Step.
- Independent changes, such as a DTO, a controller, and a service, each get a bullet: where the change happens, what changes, and which contract stays.
- Helper methods in one cohesive change may share a bullet when the affected methods and their responsibility stay explicit.
- Documents with different updates each get a bullet: path, the rule or contract to change, and the old or incompatible statements to correct.
- Independent checks — focused tests, integration or contract checks, regressions, and static checks — each get a bullet. Name a command only when the repository verifies it. Do not invent commands, files, or paths.

Do not repeat the Scope text in full. Do not repeat one sentence across bullets, turn a trivial condition into its own task, or add a bullet with no technical content. Keep bullets that belong to one stage inside that Step. Do not create a Step only to fill a standard sequence.

## Documentation synchronization

Bind each documentation update to the task that changes the related behavior. Do not collect those updates into a generic final task. Name each affected document in Scope. In the Step, state the rule, contract, or behavior to update, including old references and incompatible statements to correct. Identify documents that need different updates separately. A functional change is not complete until that internal documentation matches the implementation. Schedule the update after the implementation and the focused checks it describes. This workflow only schedules that work; it does not edit operational documents before the behavior exists.

When the spec records that no document applies and does not justify a new one, mark documentation `N/A` in Scope and do not add a documentation step. Preserve historical records: change an ADR only when that change is appropriate, and leave the past decision intact.

When documents are updated, include one consistency check that no applicable document still describes a replaced rule or contract. Place that check where it can see those updates; tasks may share it. The check confirms the updates. It does not replace them, and it does not repeat scenarios the Steps already state in full. Do not add a milestone or a documentation-only task solely for the check.

## Review and approval

- Trace spec requirements, acceptance behaviors, and documentation impacts to the plan, or state why no change is needed.
- Check execution order, special dependencies, milestone boundaries, shared interfaces, and responsibility boundaries.
- Confirm every task uses Objective, Scope, and Steps. Scope associates methods and contracts with their files. Steps are self-contained. Distinct actions and test scenarios are separate bullets; equivalent items that share one responsibility stay together.
- Confirm Files, Interfaces / Methods, Dependencies, and Acceptance are not required task sections.
- Confirm documentation updates sit with the functional change, with paths in Scope and concrete rule updates in Steps. When documents change, a consistency check covers the replaced rules and contracts. When none apply, documentation is `N/A` and no documentation step was added.
- Confirm a validation matrix, if present, adds traceability the Steps do not already provide and is not required to understand a Step.
- Ensure the plan neither contradicts the approved spec nor invents product or architecture choices.
- Check tests, migrations, errors, compatibility, and out-of-scope boundaries as applicable.
- Keep the plan usable without the conversation, and do not repeat the spec.

Resolve editorial or decomposition issues internally. If a behavioral or material architectural uncertainty arises, return to the spec and seek renewed approval before completing the plan. Mark `awaiting_approval`, present the plan, and **stop**. Once approved, set `approved` and hand off documents only.
