# Technical planning guidelines

## When to plan

A separate plan starts **only after explicit approval of the spec**.

- **Tier 1:** usually omit; create if the user asks or coordination warrants it.
- **Tier 2:** create if sequential dependencies, cross-module contracts, multiple work sessions, or handoff risk make decomposition valuable. Otherwise the approved spec is sufficient.
- **Tier 3:** always create a structured plan.

Use repository conventions; otherwise `docs/development/plans/YYYY-MM-DD-<slug>-implementation.md`. Record `status`, `tier`, `updated`, `reference_commit` and a link/path to the approved spec. Do not assume any future execution tool or orchestration.

## Detail policy

The plan is a **technical execution map**, not a duplicate spec or prewritten patch. Reference already-approved contracts and decisions instead of restating them. Be technically specific without creating speculative code.

Prefer direct drafting. Only for genuinely complex coordination first outline milestones, a stable file/interface map and task dependencies, validate them, and then expand tasks incrementally. This is an internal drafting technique, **not** a mandatory approval gate.

Each meaningful task should make clear:

1. **Outcome:** discrete, observable change.
2. **Scope:** likely paths/modules and their responsibilities; distinguish known files from anticipated additions.
3. **Dependencies:** prior tasks, shared contracts and invariants to preserve.
4. **Technical guidance:** behavior, integration boundaries, constraints and important decisions (link to spec sections).
5. **Validation:** behavior-based test scenarios, expected results, and appropriate commands when verified from the repo.

Group tests with the behavior they validate. Prefer vertical slices when they produce cohesive, verifiable outcomes; avoid empty scaffolding tasks and gratuitous layer-by-layer splitting. Include schema, migration, documentation and regression considerations when actually needed.

### Code and test presentation

- **Do not include test implementation code** (`describe`, fixtures, mocks, assertions, etc.). Express tests as inputs/conditions, actions, and expected outcomes.
- Include **production code only if indispensable** to remove ambiguity in a contract, algorithm, or transformation. Prefer concise signatures, payloads, pseudocode-free descriptions, or a minimal productive snippet as appropriate. Do not prewrite complete file implementations.
- Explicitly identify regression tests for bug fixes and meaningful acceptance, boundary, integration, and failure scenarios for new behavior.
- Favor test-driven sequencing when the repository supports it, but do not impose an implementation framework, red-green-refactor step list, branch strategy, worktree, agents, or commits in the plan.
- Give exact commands only when verified against the repo; otherwise identify the checks without inventing commands or claiming they were run.

## Internal review and approval

- Trace all relevant spec requirements and acceptance behaviors to the plan or explicitly explain why no change is needed.
- Check task dependencies, milestone order, shared interfaces and responsibility boundaries for consistency.
- Ensure the plan neither contradicts the approved spec nor invents product/architecture choices.
- Check test/validation coverage, migrations, errors, compatibilities, and out-of-scope boundaries as applicable.
- Keep the plan independently usable without conversational context while avoiding repeated spec text.

Resolve purely editorial/decomposition issues internally. If a behavioral or material architectural uncertainty arises, return to the spec and seek renewed approval before completing the plan. Mark `awaiting_approval`, present the plan, and **stop**. Once approved, set `approved` and hand off documents only.
