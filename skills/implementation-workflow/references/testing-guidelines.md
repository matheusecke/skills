# Testing and Verification Guidelines

**Project conventions first.** Do not impose mandatory TDD, universal test coverage by layer, new test frameworks, or E2E infrastructure.

## Discover applicable practices

Inspect the relevant repository instructions, test organization and file patterns, frameworks, existing verification commands, and CI/CD or quality-gate configuration. Identify mandatory checks and configured coverage thresholds when present. Distinguish established conventions and explicit requirements from isolated examples or accidental gaps. Keep inspection proportional to the work.

Follow the project's established **testing scope and file patterns**, adding or updating tests where consistent with existing conventions or required by the approved spec or mandatory quality gates. Do not introduce additional test layers or infrastructure by default.

An explicit spec requirement or mandatory gate must not be silently omitted because it differs from historical practice. When these materially conflict, use the parent workflow's decision rules rather than weakening either silently.

## Choose the strategy

Where automated tests are applicable, prioritize observable behavior, relevant regressions, and the interfaces commonly tested by the project. Avoid excessive coupling to implementation details or speculative test scaffolding.

Prefer test-first / RED → GREEN → REFACTOR **when suitable and aligned with project practice**, but do not mandate that sequence. When applied, confirm the expected test failure before implementing, then confirm success and preserve it during refactoring.

If a legacy repository has no applicable automated-test practice or tooling and no requirement to add it, do not create a framework or suite solely for this skill. Use applicable existing checks and targeted behavioral review; report verification limits without treating the absence of tests as an automatic blocker.

## Verify proportionally

- **During a Task:** run focused applicable checks, investigate failures, and distinguish preexisting failures from regressions.
- **At Task completion:** verify the intended behavior, relevant existing tests, required task-level checks, and applicable documentation.
- **At Milestone/full completion:** run appropriate integration/regression checks and mandatory lint, typecheck, build, coverage, or other project-specific gates.

Do not repeatedly run expensive suites without benefit. Subsequent code changes may make previous results stale; re-run affected checks when needed. Partial scopes need not satisfy criteria that depend on unfinished future work.

Never lower coverage thresholds, disable checks, alter CI configuration, or weaken quality requirements just to pass. A local run does not prove remote CI passed; use actual evidence for any remote gate. If a mandatory check cannot be performed, distinguish implementation progress from unverified completion.

Record meaningful commands/methods, coverage of the check, and outcomes in `progress.md`: `PASS`, `FAIL`, `NOT_RUN`, `BLOCKED`, or `NOT_APPLICABLE`. Never invent results or claim test coverage that does not exist.
