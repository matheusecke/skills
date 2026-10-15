# Technical planning guidelines

## When to plan

A separate plan starts **only after explicit approval of the spec**.

- **Tier 1:** usually omit; create if the user asks or coordination warrants it.
- **Tier 2:** create if sequential dependencies, cross-module contracts, multiple work sessions, or handoff risk make decomposition valuable. Otherwise the approved spec is sufficient.
- **Tier 3:** always create a structured plan.

Use repository conventions; otherwise `docs/development/plans/YYYY-MM-DD-<slug>-implementation.md`. Record `status`, `tier`, `updated`, `reference_commit` and a link/path to the approved spec. Do not assume any future execution tool or orchestration.

The same task and step structure applies whenever a plan exists. Tier and risk decide how many tasks, steps, and bullets are warranted, and how deep each one is. They do not remove required sections, and they do not justify filler. A simple plan may be a single task with a few steps and no milestone. A complex plan may use several milestones, shared interfaces, dependencies, and integrated checks.

## Naming

Write these labels in full:

- `Milestone 1`, `Milestone 2`, and so on
- `Task 1`, `Task 2`, and so on
- `Step 1`, `Step 2`, and so on

Do not use `M1`, `T1`, or `T1.1` as the primary names. Add a milestone only for a real phase boundary. Do not wrap a small plan in an artificial milestone.

## Detail policy

The plan is a **technical execution map**, not a duplicate spec or prewritten patch. Reference already-approved contracts and decisions instead of restating them. Be technically specific without creating speculative code. Another agent or developer must be able to execute the plan without rediscovering which files or methods change.

Prefer direct drafting. Only for genuinely complex coordination, first outline milestones, a stable file/interface map, and task dependencies, then expand tasks incrementally. That skeleton is optional. It is an internal drafting technique, **not** a mandatory approval gate. Every task included in the plan presented for approval already uses the full structure below; do not submit placeholder tasks that omit sections.

Prefer vertical slices when they produce cohesive, verifiable outcomes. Avoid empty scaffolding tasks and gratuitous layer-by-layer splitting. Include schema, migration, and regression work when the change actually needs them. Keep each test with the task that owns the behavior it validates.

### Task structure

Every task uses this structure. Keep each section concise, and do not omit one merely to shorten the plan. If a section truly does not apply, write `N/A` and a short justification.

**Task N — Title**

**Objective**

The discrete outcome and the observable result.

**Files**

Concrete paths, each marked with its operation:

- `Create`
- `Modify`
- `Test`
- `Docs`
- `Remove`, when a file is deleted or retired

Distinguish paths confirmed in the repository from additions the change requires.

**Interfaces / Methods**

The interfaces, functions, methods, contracts, and integration points involved. For each, say whether it is created, changed, or preserved, and state its responsibility. Point to the approved spec for the behavior; describe the delta rather than copying the spec.

**Steps**

The ordered technical actions for this task. Follow [Step structure](#step-structure).

**Dependencies**

Prior tasks, shared contracts, and invariants this task relies on. Use `N/A` with a reason when it has none.

**Acceptance**

Objective completion criteria. Include the checks that the task's behavior, tests, and applicable documentation agree.

### Step structure

Each Step is one logical stage of execution. Give it a descriptive title and a clear objective. Add a short introduction only when the title does not already make that objective obvious.

A step with a single action can state that action in one short paragraph. When the stage contains more than one change, file, method, or test scenario, list them as bullets inside that same Step. Each bullet is one identifiable change, scenario, or check. Name the file, method, interface, and behavior whenever they are known. Keep execution order. Do not repeat the same sentence in every bullet, split a trivial condition into its own task, or add a bullet with no technical content. Do not promote each bullet into its own Step when the bullets belong to the same stage, and do not merge distinct actions into one long paragraph.

In particular:

- Give different test scenarios their own bullets. State the input or condition and the expected result in each one. Do not collapse them into a single generic line. When scenarios belong to different test files or functional areas, group the bullets by that file or area inside the same Step.
- Give each service, controller, interface, or method its own bullet when the Step changes more than one. State where the change happens, what changes, and which behavior or contract stays. "Update the DTO, controller, and service" is not enough.
- Give each document its own bullet. Name the path, the rule or contract to change, the content that must change, and the statements about the old behavior that must be corrected or removed. "Update the documentation" is not enough.
- Separate independent verification into its own bullets: focused tests, integration or contract checks, regressions, and static checks. Give a concrete command only when it was verified in the repository. Do not invent commands, test files, or paths.

The following shape shows how to split a behavioral change that has several tests, code touchpoints, and documents. It is not a required step count and not a real contract. Drop any stage that does not apply, and do not add the missing stages back as empty steps. Replace every placeholder with repository evidence:

**Step 1 — Define the regressions**

In the focused test file for this behavior, add:

- **Omitted input:** the input, the condition, and the existing behavior that must remain.
- **Explicit empty input:** the input, the condition, and the result that must change.

**Step 2 — Verify the current behavior**

Run the new scenarios and record whether they already pass or fail. Use a command only if it was verified in the repository.

**Step 3 — Implement the contract**

- **DTO file and type:** the distinction to preserve and the validation that stays.
- **Service and method:** the behavior to change and the contract to keep.
- **Controller and method:** what it continues to delegate, without new business logic.

**Step 4 — Run the focused tests**

Run the suite that covers the new scenarios and confirm they pass. Name the command only when it was verified in the repository. If a second test file covers the same change, give that file its own bullet and its own expected result.

**Step 5 — Synchronize internal documentation**

- **Rules document, by path:** the rule text to replace and the statements of the old behavior to remove.
- **Published contract, by path:** the accepted values, errors, and behaviors that must match the implementation.

**Step 6 — Run the remaining verification**

- **Regression:** the existing behavior that must still hold.
- **Static checks:** the repository's relevant build, lint, or typecheck command, when that command is known.
- **Stale documentation:** confirm that no applicable document still describes a replaced rule or contract.

### Documentation in the plan

Bind each documentation update to the task that changes the related behavior. Do not leave documentation exclusively as a generic task at the end.

For every affected document, the owning task specifies:

- the file path
- the rule or contract to update
- the content that must change
- references to the old behavior that must be removed or corrected
- how implementation, tests, and documentation will be checked against each other

A functional change that modifies business rules, contracts, or documented behavior is not complete until the corresponding internal documentation describes the implemented behavior. When a corresponding document exists, or the spec justifies a new one, put that work in the owning task's Steps and Acceptance. This workflow does not implement the product; it must still make that work explicit. When the spec records that no document applies and does not justify a new one, mark `Docs` as `N/A` with that reason and do not add a documentation step or a documentation check.

Place documentation steps after the implementation and the focused tests they describe. Do not update operational documentation during planning, or in an early plan step, to describe functionality that is not implemented yet.

Preserve historical documents. Change an ADR or other decision record only when that change is appropriate, and do not rewrite a past decision as if it had never been made.

When tasks update documentation, end the plan with a verification that no applicable document continues to describe a rule or contract the change replaced. That check confirms the earlier updates. It does not replace them. Make it the last step of the last task that can see every documentation update. Do not add a milestone or a documentation-only task solely for this check.

### Sequencing

When the repository practice supports it, order the work as:

1. Define regressions and expected behavior.
2. Verify the current behavior or the relevant failure.
3. Implement the change.
4. Run the focused tests.
5. Update the related documentation.
6. Run any further verification the change needs.

Skip stages that do not apply. Do not invent a test-first sequence for a change that has no behavioral test. Do not impose a red-green-refactor checklist, branch strategy, worktree, agent split, or commit sequence.

### Code and test presentation

- **Do not include test implementation code** (`describe`, fixtures, mocks, assertions, and similar). Express each scenario as inputs, conditions, and expected outcomes.
- Include **production code only if indispensable** to remove ambiguity in a contract, algorithm, or transformation. Prefer a concise signature, payload, or a minimal snippet. Do not prewrite complete file implementations.
- Identify regression coverage for bug fixes, and meaningful acceptance, boundary, integration, and failure scenarios for new behavior. Use a separate bullet for each distinct scenario.
- Give exact commands only when verified against the repo; otherwise name the checks without inventing commands or claiming they were run.
- Keep enough technical precision for execution. Do not add detail that does not help the reader carry out or review the change.

## Internal review and approval

- Trace all relevant spec requirements, acceptance behaviors, and documentation impacts to the plan, or explicitly explain why no change is needed.
- Check task dependencies, milestone order, shared interfaces, and responsibility boundaries for consistency.
- Confirm every task has Objective, Files, Interfaces / Methods, Steps, Dependencies, and Acceptance. Accept `N/A` only with a justification.
- Confirm that Steps covering multiple changes or scenarios use separate bullets, and that distinct test scenarios are not collapsed into one generic bullet.
- Confirm documentation updates sit with the functional change. When documents change, a final check covers replaced rules and contracts. When none apply, `Docs: N/A` is justified and no documentation step was added.
- Ensure the plan neither contradicts the approved spec nor invents product or architecture choices.
- Check test and validation coverage, migrations, errors, compatibility, and out-of-scope boundaries as applicable.
- Keep the plan independently usable without conversational context while avoiding repeated spec text.

Resolve purely editorial or decomposition issues internally. If a behavioral or material architectural uncertainty arises, return to the spec and seek renewed approval before completing the plan. Mark `awaiting_approval`, present the plan, and **stop**. Once approved, set `approved` and hand off documents only.
