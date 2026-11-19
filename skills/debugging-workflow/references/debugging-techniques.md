# Debugging Techniques

Apply techniques **selectively**, after aligning the relevant Git references. They support causal diagnosis—not code repair, mandatory TDD, or a universal checklist. Refer to [Root cause tracing](root-cause-tracing.md) for the core tracing discipline.

## Evidence inventory and reproduction

- Read complete relevant error messages, warnings, stack traces, correlated logs, and test output; keep exact codes, paths, and conditions.
- Establish observed vs. contractually expected behavior, reproduction prerequisites, frequency, input class, and environment.
- Prefer existing safe tests, known reproduction procedures, or sanitized trace evidence. An incident can be investigated without reproducing it locally; state the limitation.
- Check recent changes **only on the aligned references**: commits, config, dependencies, deploys, feature flags, environment drift, and external contracts where relevant.
- Avoid executing scripts against production, mutating databases, publishing messages, or initiating expensive/unsafe reproductions without explicit authorization. A diagnostic command's side effects matter even if it is called a “test.”

## Differential analysis

Compare the most relevant working and broken cases:

1. Find a truly comparable functional path, prior revision, or environment.
2. Establish the corresponding Git and deployment references, not merely branch names.
3. Compare calls, inputs, contracts, transformations, state, configuration, authorization, and temporal conditions as applicable.
4. Identify differences that could produce the specific symptom.
5. Seek confirming or contradicting evidence rather than treating correlation as causation.

Avoid exhaustive comparison of unrelated code. Read a reference implementation deeply enough to understand the relevant behavior without automatically loading an entire repository.

## Hypothesis-driven checks

Write a concise falsifiable hypothesis, preferably in the form:

> The observed failure occurs because **X** happens under condition **Y**; evidence **Z** supports it. If this is correct, we should observe **W**.

Then:

- Choose the smallest safe observation or experiment that discriminates it from alternatives.
- Change only one investigative variable when possible; do not bundle multiple interventions.
- Record the result and whether the hypothesis is confirmed, weakened, refuted, or still untested.
- On failure, update the causal model and propose a *new diagnostic hypothesis*, not a fix on top of a failed fix.
- If several hypotheses fail, revisit initial assumptions and boundaries. There is no arbitrary three-attempt stop or automatic architectural conclusion.

A suspected cause without a discriminating observation remains a hypothesis.

## Boundary instrumentation

For multi-component failures, establish the flow through relevant boundaries:

- What enters, what leaves, and what state or side effect changes?
- What version of the contract is used at each side?
- Which deployed revisions actually communicated?
- Do timestamps, correlation identifiers, queue ordering, retries, or cache state explain the difference?

Prefer existing logs and tracing. If additional diagnostic instrumentation is required, request explicit authorization before modifying files or environments; define the minimal scope, safety risks, how evidence will be captured, and how temporary changes can be reversed without disturbing preexisting work. Subagents must not instrument or edit. Never log secrets or unnecessarily expose private data.

Instrumentation should isolate **where the divergence occurs**, not generate indiscriminate high-volume logs.

## Concurrent and asynchronous behavior

Relevant clues include intermittent failures, order-dependent tests, queue delivery, stale reads, overlapping transactions, and sporadic timeouts.

- Identify the actual state or event being awaited, rather than assuming an arbitrary delay proves completion.
- In diagnostic tests, prefer condition/event-based waits with explicit timeout and observable failure information when the test framework supports them.
- A fixed delay is appropriate when the behavior under investigation is itself time-dependent (e.g. debounce) and the timing is documented.
- Distinguish causally demonstrated races from speculative concurrency explanations. Examine ordering, isolation, atomicity, idempotency, and version-specific behavior only as relevant.
- Do not introduce new test infrastructure, enforce TDD, or edit application code as part of diagnosis.

## Invariants and validation boundaries

Map the invariant or contract that the observed behavior violates, and the boundaries through which relevant data/state pass:

- Entry/transport validation
- Domain/business-rule checks
- Persistence and transaction invariants
- External provider or consumer contracts
- Environment-specific preconditions

Identify which protections are **actually present or absent**, which paths can bypass them, and what the evidence proves. Do not assume multiple validation layers are always necessary, and do not convert this analysis into a recommendation to add checks or refactor services. Selecting enforcement locations or designing defense-in-depth is the planning workflow's responsibility.

## Scope, confidence, and stopping

- Expand to related services, repositories, or consumers when data flow, evidence, or failure reach makes it relevant; align Git before inspecting newly implicated codebases.
- Prefer independent read-only subagent investigations only where they save meaningful context/effort; require evidence and per-repository Git provenance.
- Distinguish a **confirmed cause**, a **probable explanation with missing evidence**, and an **unconfirmed lead**. Do not force certainty.
- Continue while there are worthwhile, safe, authorized avenues; stop and communicate concrete limitations when further investigation requires unavailable evidence, external access, unsafe actions, or a user decision.
- End with the observed causal mechanism and limitations, **not** a patch strategy, fix options, implementation plan, or speculative improvement list.
