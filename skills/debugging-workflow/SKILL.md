---
name: debugging-workflow
description: Investigate software bugs, failing tests, unexpected behavior, and integration issues to establish evidence-backed root causes. Align Git context before examining code; trace relevant end-to-end and multi-repository flows; optionally persist consolidated investigation reports. Diagnostic only—do not design or implement fixes.
---

# Debugging Workflow

Own **technical investigation and causal diagnosis**, not solution design or implementation. Explain **what fails, under which conditions, where the behavior diverges, and why**, with traceable evidence. A plausible fix is not proof of a cause.

This skill works independently or as a diagnostic method within another workflow. The calling workflow retains responsibility for requirements, solution choices, planning, implementation, tests of the eventual fix, and approvals. Do not assume other skills are installed.

## Non-negotiable rules

- **Git before code:** establish and verify the relevant environment, repositories, and Git references **before investigating feature code**. Read [Git guidelines](references/git-guidelines.md) first. If the user has not supplied or previously confirmed the reference, propose the likely context and **ask for confirmation**; do not silently use the current branch or a default branch. Existing verified, user-confirmed context from a parent workflow can be reused. Newly discovered repositories need their own alignment before code inspection.
- **Diagnose, do not fix:** no production code changes, refactoring, implementation plans, prescribed patches, or selection among solution architectures. Identify violated invariants, faulty interactions, affected components, and causal mechanisms without specifying how they should be changed. Do not create a spec or task breakdown.
- **Evidence before conclusions:** distinguish observations, inferences, tested hypotheses, and confirmed causes. Attribute meaningful claims to concrete evidence and its code/environment revision. Never manufacture a root cause to close the task.
- **Relevant end-to-end scope:** trace upstream and downstream components, callers, consumers, providers, contracts, and data transformations when they might cause or be affected by the issue. Do not assume the first repository contains the defect. Expand on evidence, not by indiscriminate repository browsing.
- **Proportional effort:** investigate the smallest relevant surface first, deepen when complexity, risk, contradictions, or cross-system boundaries warrant it. Reuse valid existing evidence and avoid unnecessary interviews or exhaustive reading.
- **Read-only by default:** inspect without modifying application code, Git branches/history, configuration, or environments. Diagnostic instrumentation that edits files requires explicit authorization and safeguards; investigative subagents are strictly read-only. The authorized investigation document is the only routine write. Never run unsafe reproduction steps or commands with material side effects without authorization.
- **No arbitrary stalls:** unsuccessful hypotheses prompt reassessment, not an automatic pause after a fixed attempt count. Continue within the authorized investigation while evidence-backed avenues remain. Escalate only a real blocker, ambiguous Git context, unsafe operation, material authorization need, or necessary behavioral decision.
- **Consolidate, never append a diary:** when writing investigation documents, represent the latest coherent diagnosis rather than accumulating session notes. Preserve version-specific provenance; use a separate document only when an independent historical investigation has clear value.
- **Language:** communicate and author investigation artifacts in the user's preferred language or applicable repository convention; preserve exact technical identifiers.

## Workflow

### 0. Align and verify Git — blocking

Read [Git guidelines](references/git-guidelines.md). Establish the reported environment and intended revision(s) for all initially known relevant repositories. Production and staging may run pinned deployments unrelated to branch tips. Confirm missing user choices *before* feature-code exploration; minimal repository metadata inspection to identify available references is allowed.

Verify selected references, repository/remotes, HEAD, relevant working-tree changes, and freshness when applicable. Record any limitation or user-authorized exception. For multi-branch/multi-repository comparisons, maintain separate baselines; prefer inspection by reference without changing checkout. Do not require a planning branch, PR target, or new worktree.

If the investigation later identifies another relevant repository, establish and verify its context before examining its feature code. On resumption, recheck the relevant Git state and selectively revisit potentially stale findings; do not redo unaffected work.

### 1. Frame the problem

- Establish the observed behavior, triggering conditions, expected behavior **as supported by requirements/contracts**, environment, impact known from evidence, and available errors/logs/reproduction steps.
- Read applicable repository guidance and **targeted** technical documentation, API contracts, configuration, tests, and relevant code only after Git alignment.
- Separate facts, user reports, assumptions, unclear business rules, and missing access. Resolve technical facts through available evidence; ask the user only for information or decisions that cannot be derived safely.
- Identify the initial execution path and hypotheses without prematurely declaring the faulty component.

### 2. Trace and test causes

Use [Root cause tracing](references/root-cause-tracing.md) as the core method and [Debugging techniques](references/debugging-techniques.md) selectively.

1. Examine the complete relevant errors, logs, traces, and failure conditions. Reproduce safely when feasible; where reproduction is unavailable, collect alternative evidence instead of guessing or stopping.
2. Trace the relevant path **through component boundaries**, following input, transformations, state, contracts, side effects, and output. Seek upstream sources and downstream effects; inspect other repositories or versions only after their Git context is aligned.
3. Compare broken and working paths, recent changes, environments, and revisions to isolate meaningful differences. Consider concurrency, stale state, configuration, and contract mismatches where supported.
4. State falsifiable hypotheses: what would have to be true, which evidence supports them, and which observation could refute them. Prefer narrow, controlled, non-destructive checks; avoid combining independent variables.
5. Reassess after contradictory results. An unsuccessful test does not establish an architectural flaw, and a successful workaround does not establish the root cause. Continue until evidence supports a conclusion or a concrete investigative limitation is reached.

Use **read-only investigative subagents** only for substantial, independently investigable domains, hypotheses, or integration boundaries when isolation/parallelism outweighs overhead. Give each the confirmed Git references, scoped question, and known evidence. Require concise findings with inspected paths, revisions, observations, and uncertainties. The primary agent owns end-to-end synthesis and must reconcile conflicting findings. Never delegate code edits, Git changes, or document writes to investigative subagents.

### 3. Consolidate the diagnosis

Report, in proportion to complexity:

- **Problem:** observed vs. expected behavior, conditions, and affected flow.
- **Context:** repositories, environments, branches/tags/commits, observed working-tree differences, and relevant observation times.
- **Evidence:** reproduction results, execution/data paths, contracts, comparisons, and material falsified hypotheses, with source/revision attribution.
- **Diagnosis:** causal mechanism, root cause(s) and contributing factors, known impact, and confidence classified as **CONFIRMED**, **PROBABLE**, or **UNCONFIRMED**.
- **Limits:** unresolved questions, inaccessible systems, missing production evidence, and the specific information needed to validate uncertain causes.

Do **not** add a “recommended fix,” implementation file-change list, proposed architecture, or implementation test plan. A factual account of missing checks, violated invariants, or failure points is appropriate; a prescription for adding/changing them is not. If behavior itself is unspecified, mark the product decision as unresolved rather than defining it.

### 4. Persist or hand off when useful

Persistence is **optional**, not a universal gate. Create or update a report when the user requests one or when investigation complexity, multiple repositories/versions, inconclusive findings, or likely resumption provides clear value. Follow any established project convention; otherwise use:

`docs/development/investigations/YYYY-MM-DD-[TICKET-]<scope>-investigation.md`

Use the document's creation date, a reliably associated ticket when available, and a problem-oriented slug (not an unconfirmed cause). For multi-repository work, use the user-designated documentation location or, absent one, the primary investigation repository's conventional documentation location; avoid duplicate reports across repositories.

Use a concise **consolidated** structure, adapting depth to the case:

1. **Metadata** — issue/ticket, created and last-investigated timestamps with timezone, diagnosis status and scope.
2. **Problem** — symptoms, triggering conditions, supported expected behavior, impact known.
3. **Technical and Git context** — involved systems and their roles, selected references and resolved SHAs, working-tree status/relevant uncommitted changes, observation timestamps, comparison targets, and access/freshness limitations.
4. **Evidence and analysis** — relevant flows, trace points, test/observation results, references for claims, meaningful confirmed/rejected hypotheses.
5. **Consolidated diagnosis** — mechanism, cause(s), confidence, known scope, and evidence provenance.
6. **Limitations and open questions** — gaps that genuinely constrain the diagnosis.

On resumption, read the existing report, re-align Git, compare relevant revisions and evidence validity, then **revise the existing sections into one current analysis**. Remove obsolete duplication and unsupported assertions; retain historical version-specific findings only when still materially informative and accurately labeled. Do not append “Session 2,” “Update 3,” or similar running logs. Create a **separate, cross-linked document** only when distinct historical states, investigations, or mechanisms must remain independently understandable. Never create a new document merely because another session occurred.

A persisted report is a diagnostic handoff, **not** an approved spec or implementation plan. If called from `planning-workflow` or `implementation-workflow`, return findings to the owner without changing its approvals, execution scope, or checkpoint logic. Do not automatically initiate a new workflow.

## Completion criteria

- Intended Git context is verified, or the precise limitation and explicit user exception are recorded.
- The relevant end-to-end path has been examined to the extent justified by evidence and available access; important boundaries were not ignored just because they cross repositories.
- Conclusions are backed by attributable observations; confirmed, probable, and unresolved causes are not conflated.
- Significant contradictions and remaining unknowns are visible; no unsupported certainty or solution prescription appears.
- Any warranted report is consolidated, reusable, and traceable to the actual code states investigated.

A sound **inconclusive diagnosis** is preferable to a fabricated cause. Stop at a genuine evidence/access/authorization limit with concrete findings and outstanding questions, not an invented implementation recommendation.
