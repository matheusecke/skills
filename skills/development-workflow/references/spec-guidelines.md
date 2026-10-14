# Specification guidelines

## Core contract

Every change gets a persistent, self-contained spec, even if the change is small. Use **one adaptive structure**, not three rigid templates. It must be understandable to a developer who did not participate in the conversation. State the *what, why, expected behavior, and architectural boundaries*; do not write a per-file implementation plan here.

Use repository documentation paths and conventions; otherwise default to `docs/development/specs/YYYY-MM-DD-<slug>-design.md`.

A compact frontmatter is recommended (adapt to repository conventions):

```yaml
---
status: draft # draft | awaiting_approval | approved
tier: 2
updated: YYYY-MM-DD
reference_commit: <verified-base-SHA>
base_branch: <remote/base>
working_branch: <name>
target_branch: <name>
---
```

If an unverified baseline was **explicitly authorized**, mark verification status and limitations visibly. Never fabricate a SHA or approval status. Existing repository conventions take precedence over this exact metadata layout.

## Essential content (all tiers)

- **Context and objective:** problem, motivation, intended outcome.
- **Git context:** base/source, working branch, target, verified SHA and any synchronization exception.
- **Existing behavior and precedents:** factual findings in source/tests; inherited requirements and contracts to preserve.
- **Scope:** included changes, meaningful exclusions and boundaries.
- **Behavior and business rules:** expected flows, allowed/forbidden states, inputs and outputs, error handling, invariants, and edge cases relevant to this change.
- **Contracts and technical decisions:** precisely define affected external/internal APIs, compatibility requirements, ownership, and important architecture decisions with reasoning.
- **Acceptance and testing:** observable success/failure cases and regression scenarios; favor test-first behavior specification where the project supports TDD.

Sections can be merged for a localized change; do not create empty headings. Contract precision is **not tier-dependent**: document every relevant behavior clearly in Tier 1 as well as Tier 3.

## Include only when relevant

- Concrete requests/responses, DTOs, payload structures, omitted vs. `null` vs. empty vs. explicit values, validation details, error/status mappings.
- State transitions, ordering/tie breaks, formulas, date-time rules, recurrence, access control and authorization boundaries.
- Data model effects, historical data, migrations, transactions, rollback, idempotency, concurrency and partial failures.
- Compatibility with downstream consumers, feature dependencies, architectural boundaries and rationale for alternatives.
- Definitions of ambiguous domain terms within this spec when necessary; do not automatically create glossaries or ADRs.

Prefer concrete examples and tables when they prevent semantic ambiguity. Use production code or schemas only if necessary to specify the contract. Never fill the spec with test implementation code.

## Internal review before approval

1. Map every stated requirement to defined behavior/acceptance coverage.
2. Confirm relevant business rules, inherited decisions, and edge cases are accurate and consistent with the code.
3. Ensure affected contracts specify inputs, outputs, states, error semantics, and compatibility precisely enough to implement and test without new behavioral choices.
4. Remove contradictions, undefined terms, assumptions presented as facts, and blocking open decisions.
5. Ensure technical boundaries and exclusions are explicit and the document is usable for handoff.
6. Verify cited file paths, names and examples against repository evidence when feasible.

If review finds a material gap, investigate or ask before requesting approval. Non-blocking follow-ups may be listed with explicit scope. Write `awaiting_approval` and **stop** for explicit approval; after approval record `approved` without silently changing substantive decisions.
