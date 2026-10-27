# Specification guidelines

## Core contract

Every change gets a persistent, self-contained spec, even if the change is small. Use **one consistent structure**, with detail proportional to the change. It must be understandable to a developer who did not participate in the conversation. State the *what, why, expected behavior, and architectural boundaries*; do not write a per-file implementation plan here.

Use repository documentation paths and conventions; otherwise default to `docs/development/specs/YYYY-MM-DD-<slug>-design.md`.

A compact frontmatter is recommended (adapt to repository conventions):

```yaml
---
updated: YYYY-MM-DD
reference_commit: <verified-base-SHA>
base_branch: <remote/base>
working_branch: <name>
target_branch: <name>
---
```

If an unverified baseline was **explicitly authorized**, mark verification status and limitations visibly. Never fabricate a SHA. Existing repository conventions take precedence over this exact metadata layout.

## Essential content

- **Context and objective:** problem, motivation, intended outcome.
- **Git context:** base/source, working branch, target, verified SHA and any synchronization exception.
- **Existing behavior and precedents:** factual findings in source, tests, and the relevant internal documentation; inherited requirements and contracts to preserve. Name divergences among those sources and whether each was resolved or remains an open decision.
- **Scope:** included changes, meaningful exclusions and boundaries.
- **Behavior and business rules:** expected flows, allowed/forbidden states, inputs and outputs, error handling, invariants, and edge cases relevant to this change.
- **Contracts and technical decisions:** precisely define affected external/internal APIs, compatibility requirements, ownership, and important architecture decisions with reasoning.
- **Acceptance and verification:** observable success, failure, and regression scenarios. An acceptance scenario does not by itself require an automated test. State the automated tests and other checks that the repository's conventions and mandatory CI/CD gates require, including coverage thresholds when they exist. Favor test-first behavior specification only where the project already uses it. Do not prescribe a new test layer or infrastructure without a justified need.
- **Documentation impact:** existing internal documents that must be updated, by path; new documents only when justified; the business rules and contracts those documents must reflect; inconsistencies that must be resolved; and references that must stay synchronized. If investigation found no applicable document, write that explicitly. A historical record such as an ADR stays historical: note when it should remain unchanged instead of rewriting the past decision as current behavior.

Sections can be merged for a localized change; do not create empty headings. Documentation impact may be a short paragraph in a nearby section, but it is not optional. Document every relevant behavior and contract precisely, regardless of change size.

Record the impact only. Do not paste, rewrite, or otherwise duplicate operational documents inside the spec, and do not update those documents during specification to describe behavior that is not implemented yet.

## Include only when relevant

- Concrete requests/responses, DTOs, payload structures, omitted vs. `null` vs. empty vs. explicit values, validation details, error/status mappings.
- State transitions, ordering/tie breaks, formulas, date-time rules, recurrence, access control and authorization boundaries.
- Data model effects, historical data, migrations, transactions, rollback, idempotency, concurrency and partial failures.
- Compatibility with downstream consumers, feature dependencies, architectural boundaries and rationale for alternatives.
- Definitions of ambiguous domain terms within this spec when necessary; do not automatically create glossaries or ADRs.

Prefer concrete examples and tables when they prevent semantic ambiguity. Use production code or schemas only if necessary to specify the contract. Never fill the spec with test implementation code.

## Internal review before approval

1. Map every stated requirement to defined, observable acceptance coverage.
2. Confirm relevant business rules, inherited decisions, and edge cases are accurate and consistent with the code, tests, and applicable internal documentation. Divergences are explicit, not a silent choice of source.
3. Ensure affected contracts specify inputs, outputs, states, error semantics, and compatibility precisely enough to implement and verify without new behavioral choices. Confirm the planned checks match project test patterns and mandatory quality gates, and do not add unrequired test infrastructure.
4. Remove contradictions, undefined terms, assumptions presented as facts, and blocking open decisions.
5. Ensure technical boundaries and exclusions are explicit and the document is usable for handoff.
6. Verify cited file paths, names and examples against repository evidence when feasible.
7. Confirm the documentation impact names the affected documents, or records that none apply and that no new document is justified. Inconsistencies are listed or explicitly absent. The spec does not duplicate operational documents.

If review finds a material gap, investigate or ask before requesting approval. Non-blocking follow-ups may be listed with explicit scope. Present the spec and **stop** for approval; do not silently change substantive decisions.
