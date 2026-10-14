---
name: development-workflow
description: Plan or resume software features, bug fixes, and refactors. Align Git references before investigation, resolve business rules and edge cases, write a persistent specification for every change, and produce an adaptive technical plan when warranted. Use for engineering discovery, specification, and planning; not implementation.
---

# Development Workflow

Own discovery, specification, and technical planning. **Stop before application implementation.** Do not prescribe the later execution agent, worktree, commit sequence, or implementation orchestration. The user approves artifacts, not a proposed method of implementation.

## Non-negotiable rules

- **Git before code:** clarify source/base, working, and PR-target branches before investigating feature code. Then verify freshness and repository state. Git readiness is a hard gate; see [Git guidelines](references/git-guidelines.md).
- **Always produce a spec**, even for a localized fix. Every affected business rule, expected behavior, contract, and relevant edge case must be precise; only document length varies by tier.
- **One approval gate per artifact:** obtain explicit spec approval before drafting a separate plan. When a plan exists, obtain explicit plan approval. Stop at each pending approval; don't infer approval from an existing file.
- **Resolve, do not defer:** never leave blocking behavioral, contract, compatibility, or architectural choices to an implementer. Investigate facts yourself; ask the user to decide policy and behavior.
- **Test-oriented:** define behavior-based acceptance and regression scenarios. Favor test-first development where compatible with repository practice; do not include test implementation code in specs/plans.
- **Language:** communicate and write artifacts in the user's preferred language unless the user or repository convention specifies otherwise. Preserve exact identifiers and paths.
- **Efficiency:** search the smallest relevant code surface first; expand only on evidence of dependencies/risks. Preserve decisions, contracts, evidence and references rather than raw exploratory output. Use read-only subagents for substantial *independent* investigations only when parallelism or isolation outweighs overhead. Their concise findings must include evidence and uncertainty; the primary agent owns synthesis. Subagents do not change Git or code during discovery. Never trade correctness for token savings.

## Workflow

### 1. Align and verify Git (blocking)

Read [Git guidelines](references/git-guidelines.md) first. From the user's prompt and explicit repository conventions, identify base/source branch, working branch (existing or proposed), and PR/integration target; resolve missing choices with the user *before* reference-dependent commands or feature-code investigation. **Default: current working tree. Never ask about, create, or propose a worktree unless the user explicitly requests one.**

After alignment, check actual branches, upstream/remotes, dirty state, divergence and fresh remote-tracking references. If freshness cannot be verified or the selected base is not safely aligned, **stop and request manual correction**. Proceed with an unverified/outdated reference *only* upon the user's explicit exception; record its consequences in the spec. Do not silently change branches or synchronize local branch history.

### 2. Investigate and refine

Read applicable repository instructions (`AGENTS.md`, `CLAUDE.md`, etc.), referenced docs, relevant source/tests and existing artifacts from the **verified** base. Separate verified facts, inherited decisions, new requirements, unresolved decisions, and out-of-scope behavior.

Classify after the initial investigation; give a brief reason and reclassify when evidence warrants. **Risk beats size.**

| Tier | Signals | Documents |
| --- | --- | --- |
| **1 — Localized** | Contained behavior, established patterns, low cross-component risk | Concise spec; plan only if requested or demonstrably useful |
| **2 — Structured** | Several related flows/modules, bounded contract changes, moderate risk or connected decisions | Full spec; concise direct plan when dependencies, coordination or handoff justify it |
| **3 — Complex** | Architectural choices, consequential migrations, breaking contracts, coupled dependencies or high-risk regressions | Detailed spec + structured plan; progressive outlining only if valuable |

Use the installed **`decision-refinement`** skill for structured unresolved decisions: preferred for Tiers 2–3, and in Tier 1 when questions are interdependent. Discover/load its actual instructions using the agent's skill facility (or read its installed `SKILL.md`); merely mentioning its name does not activate it. Delimit scope to unresolved choices, avoid re-opening settled decisions, and do not ask questions already answered by code or documentation. Skip a redundant interview when decisions are already clear. If unavailable, conduct a lightweight dependency-aware interview yourself: options, trade-offs, recommended answer, await the user's choices. Do not claim the external skill was used when it wasn't.

**Discovery exit criteria — all five required, every tier:**
1. Existing and new relevant business rules are consolidated.
2. Applicable edge cases, errors, and state transitions have defined outcomes.
3. No blocking gaps, contradictions, or unstated assumptions remain.
4. Affected contracts and compatibility are precise enough to implement and verify.
5. No material product or architecture decision is left to the implementer.

If any criterion fails, investigate or ask; do not draft an approvable spec. No separate discovery-approval gate is required.

### 3. Draft, review, and approve the spec

Read [Spec guidelines](references/spec-guidelines.md). Follow an established repository convention; otherwise write to `docs/development/specs/YYYY-MM-DD-<slug>-design.md`. Preserve the verified Git baseline and approval status in frontmatter. Review the actual rules, behavior, errors, invariants, contracts, compatibility, acceptance scenarios and handoff quality against discovered evidence. Correct editorial defects internally; resolve material gaps with the user. Set `status: awaiting_approval`, present the spec and **stop for explicit approval**. Record `approved` after approval; never silently change approved requirements.

### 4. Plan only when warranted

Only after explicit spec approval, determine whether a separate plan is useful (Tier 1 optional, Tier 2 conditional, Tier 3 mandatory; explicit user request overrides). If a plan is required, read [Planning guidelines](references/planning-guidelines.md); otherwise stop with the approved spec. Follow repository conventions; default to `docs/development/plans/YYYY-MM-DD-<slug>-implementation.md`.

Reference the spec instead of duplicating it. Use a direct plan unless genuine dependency complexity calls for a short outline followed by progressive task detailing; do not add a separate outline-approval gate. Plan work as coherent verifiable tasks, preserving interfaces and dependencies. Describe testing by behaviors and outcomes, **never test code**; include production code only if essential to explain runtime logic or a contract. Review traceability and consistency, mark `awaiting_approval`, present the plan, **stop for approval**, then record `approved` and hand off. Never implement.

### 5. Resume safely

On a resumed task, perform Git alignment/readiness again *before* examining potentially stale feature code. Read the spec/plan and statuses, compare the saved baseline SHA with the latest verified reference, and selectively revalidate affected assumptions and contracts. Don't repeat settled interviewing. A changed SHA alone does not invalidate approval, but material changes to approved behavior, contracts, scope, or architecture require renewed approval. Continue from the first genuinely incomplete stage.

At handoff, report relevant document paths, statuses, tier, Git baseline, and any user-authorized limitations. Do not create a separate workflow-state document.
