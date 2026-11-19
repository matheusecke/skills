# Technical Review Guidelines

These are **review lenses**, not a mandatory checklist to expand every review. Start with the agreed Git/code scope, follow concrete risks into surrounding context only when necessary, and calibrate effort to impact. Read [findings-guidelines.md](findings-guidelines.md) for adjudication and reporting.

## 1. Review against real requirements and behavior

Establish what the selected code is intended to do using trustworthy sources: user-defined objective, relevant ticket, approved specification/plan if present, contracts, repository instructions, documentation, existing tests, and observable current behavior. Formal artifacts are helpful but never universal prerequisites. Separate:

- **Binding requirements:** established business rules, contracts, compatibility and explicit acceptance criteria.
- **Demonstrable correctness expectations:** e.g., preventing unauthorized actions, preserving data integrity, handling invalid input; a spec's silence does not excuse real bugs.
- **Unresolved policy decisions:** ambiguous product behavior that a reviewer must not invent.
- **Optional preferences:** stylistic choices and attractive abstractions that are not defects.

If a plan specifies an approach that creates a demonstrable bug, report the issue and state that its source may be the plan. A review is not approval to redesign the solution or revise the requirement.

For **change reviews**, identify actual modifications and assess regressions caused by them. For **existing-code reviews**, assess the selected behavior as-is; do not fabricate a change baseline or an introduced/pre-existing attribution.

## 2. Inspect the code, not the implementation narrative

- Read the actual changed code and enough surrounding context to understand control/data flow, callers, contracts and error paths.
- Treat implementer summaries, earlier reviewer comments, and test claims as pointers requiring verification, not evidence by authority.
- Inspect actual tests, assertions and failures where relevant; distinguish current test results from historic or claimed results.
- Seek a credible triggering condition, path and consequence before recording a defect. Consider alternate paths, existing guards and compensating validations that might refute the finding.
- Avoid duplicate reads and exhaustive project-wide exploration. Broaden only for a named risk; document when meaningful adjacent code or an external dependency could not be inspected.

## 3. Risk-oriented review lenses

Apply relevant lenses at a depth proportionate to the change and its impact:

| Lens | Questions to investigate |
| --- | --- |
| Functionality | Does behavior match established requirements? Are paths, edge cases, state transitions, failure modes and errors correct? |
| Data integrity / concurrency | Are transactions, ordering, idempotency, state consistency and race conditions relevant? Can concurrent paths violate an invariant? |
| Interfaces and integrations | Are contracts, types, payloads, events, consumer expectations, compatibility and version interactions preserved? |
| Security / privacy | Are trust boundaries, authentication, authorization, injection, secrets and sensitive data exposure handled correctly? |
| Performance | Are new queries, loops, remote calls, allocations or synchronization points materially costly under realistic load? |
| Architecture and maintainability | Are responsibilities, coupling, error handling and abstractions reasonable for this project's established patterns? Is unnecessary complexity introduced? |
| Testing and verification | Do tests assert behavior rather than implementation artifacts? Are applicable regressions and required gates addressed? What was actually run and observed? |
| Operations and documentation | When relevant, are migrations, rollouts, configuration, feature flags, operational assumptions and affected docs consistent? |

Do not require extra testing layers, mandatory TDD, speculative scalability work or broad refactors merely because they are generic best practices. Conversely, established project conventions do not excuse confirmed security or correctness defects.

## 4. Cross-system scope

The changed file is not necessarily the boundary of the consequence. If an API contract changes, check relevant consumers; if a frontend relies on an endpoint, inspect its documented or available behavior; if an event changes, check producers and consumers; if data persistence changes, examine affected invariants. Follow upstream and downstream relationships only to validate a concrete risk. Distinguish verified dependencies, inferred dependencies, and unavailable code.

In multi-repository reviews, honor separate Git references and the intended change surface in each repository. Avoid judging one revision's consumer against another revision's provider as though they are deployed together unless that pairing is established.

## 5. Subagent review method

Prefer independent read-only subagents when substantial independent review work exists. The primary reviewer partitions the work by coherent risk/domain/flow, assigns exact code/Git scope and relevant requirements, and checks overall coverage. Subagents must:

- Review the assigned surface and only necessary supporting context.
- Avoid unrequested edits, state-changing commands and nested delegation.
- Return **candidate** findings with precise location, triggering condition, evidence, impact, severity proposal and uncertainty.
- Note meaningful scope gaps and actual checks performed; avoid prose logs and general praise.

The primary reviewer reconciles contradictory findings, deduplicates shared root causes, checks cross-component issues that fall between assignments, and independently validates material claims. The goal is context efficiency and better independent attention, **not** a higher volume of findings.

## 6. Verification without mutation

Use available read-only inspection, static reasoning, existing CI/test outputs and safely permitted checks. Be precise about what each proves. Running a test may mutate caches, files, databases or services, so verify that it is safe/authorized before doing so. If not, recommend the missing check as an uncertainty rather than quietly running it. Do not equate a previous CI result with current local uncommitted code.

The report should emphasize defects and meaningful risks, not a general quality score. If no meaningful defect is found, state exactly which surfaces were examined and what could not be verified. Never claim complete safety or correctness from a bounded review.
