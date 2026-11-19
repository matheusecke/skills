---
name: code-review-workflow
description: Review a user-selected code change, PR, branch, diff, existing code surface, or external review feedback. Confirm scope and Git references before inspecting code; conduct evidence-based, risk-proportionate, read-only review, preferably with focused review subagents for substantial independent areas; validate findings and optionally persist a consolidated report. Use when the user explicitly requests code review or evaluation of review feedback, not to implement fixes.
---

# Code Review Workflow

Independently assess code quality, correctness, requirement adherence, and relevant risks. **Review and report; do not implement fixes.** This skill is user-invoked and self-contained. It does not depend on another skill's execution modes, checkpoints, approval gates, or orchestration, and does not initiate reviews in other workflows.

## Non-negotiable rules

- **Scope and Git before code:** read [Git guidelines](references/git-guidelines.md). Establish the review target, repository/repositories, relevant references, comparison baseline (if reviewing changes), and whether committed, staged, unstaged, or untracked work is included. Confirm genuinely missing choices with the user **before inspecting feature code**. Do not silently choose the last commit, current branch, whole repository, or an arbitrary PR baseline.
- **Read-only review:** never change application code, tests, configuration, Git state, comments, PR status, or external systems. The sole ordinary write permitted by this skill is an authorized investigation-style review report under the reporting policy below. Inspection and safely permitted, non-mutating checks are allowed. Avoid operations that write caches, artifacts, test data, or remote state without authorization; if such a check is necessary, state the limitation or request permission.
- **Evidence over assertion:** read the actual code; independently evaluate claims in tickets, implementation reports, prior reviews, and test summaries. A proposed finding is not confirmed because a reviewer said it. Distinguish observed facts, supported inferences, and unknowns.
- **Review the relevant system:** start with the selected change or code surface; inspect adjacent callers, consumers, providers, contracts, storage, and integration boundaries only to evaluate concrete correctness or compatibility risks. Do not indiscriminately crawl unrelated code.
- **Project conventions first:** honor existing design, testing, compatibility, and documentation practices. Do not demand universal TDD, new test infrastructure, speculative features, or abstractions without a demonstrated need.
- **Calibrate findings:** use [Findings guidelines](references/findings-guidelines.md). Separate severity, evidence status, and origin; identify regressions and risks without misattributing unrelated pre-existing defects. Prefer a small number of actionable findings to a long list of opinions.
- **Independent review where useful:** for substantial reviews, prefer focused read-only subagents when the environment supports them and parallelism or context isolation materially helps. Small, localized reviews can be performed directly. The primary agent owns full-scope coverage, cross-boundary reconciliation, and the final report. Do not spawn nested reviewer subagents by default.
- **No implied remediation:** the review may describe a defective behavior or violated invariant and indicate what needs investigation, but must not edit code, start a fix workflow, or authorize changes. Technical suggestions, if useful, remain non-binding and must not be treated as a prescribed implementation plan.
- **Communication:** use the user's preferred language, subject to repository conventions. Preserve actual identifiers, paths, line references, and Git revisions.

## Workflow

### 0. Align scope and Git — blocking

Read [Git guidelines](references/git-guidelines.md) first. Determine whether the user requests a change review, existing-code assessment, or evaluation of external feedback. Identify the target and exclusions, repository identity, appropriate revision(s), and source of requirements or comments. Resolve only missing decisions that materially affect the result; use available metadata and repository conventions for facts, not guesswork. Repository identification and instructions lookup needed to establish scope are allowed before reading feature code.

Verify the selected references and working-tree state. For changes, define the correct before/after comparison and explicitly include or exclude local changes. For existing code, identify the code surface and revision; a diff is not required. For feedback review, identify the source comments and code revision they refer to, especially when the code has since changed. If the target cannot be established reliably, ask or explain the explicit limitation; never silently review a different scope.

### 1. Establish review criteria

Read applicable repository instructions (`AGENTS.md`, `CLAUDE.md`, etc.), relevant requirements, approved specifications or plans if present, tickets, API contracts, relevant internal documentation, and existing tests or verification evidence. Formal specs or plans are **not** prerequisites if the behavior or technical contract can otherwise be established. Distinguish binding requirements from incidental patterns, assumptions, and reviewer preferences.

For a change review, enumerate the material changed paths and their purpose; for an existing-code review, establish relevant entry points and behavior. Identify likely risk areas before distributing work. Bound inspection proportionally to risk, not by arbitrary file/line quotas.

### 2. Perform technical review

Read [Review guidelines](references/review-guidelines.md). Assess actual behavior and relevant interactions: functional correctness, edge cases, error handling, security, integrity/concurrency, performance, compatibility, testing, maintainability, and adherence to established contracts and conventions. Examine code beyond the diff only when a specific integration, caller, data-flow, or regression question requires it.

**Review subagents:** Prefer focused, read-only delegates for substantial, independently reviewable areas. Partition by meaningful domain, execution flow, contract boundary, or specific risk—not mechanically by repository or file. Give each delegate the exact Git references, assigned scope, relevant requirements, known constraints, and expected compact output. Do not pass the entire conversational history or pre-suggest the verdict. Each delegate reports files/lines, causal evidence, impact, uncertainty, and actual coverage. Delegates must not edit anything, run state-changing tools, publish comments, or dispatch nested reviewers. If delegates are unavailable or uneconomical, review directly and accurately describe the review's independence limitations.

The primary agent must also assess **cross-scope interactions and gaps**. Delegating several isolated areas does not prove end-to-end integration is sound. Do not replicate a large diff in every delegate's context unless necessary.

### 3. Validate and adjudicate findings

Use [Findings guidelines](references/findings-guidelines.md). For each candidate issue: verify the implicated code/contract, identify a realistic failure condition, evaluate impact and scope, distinguish introduced from pre-existing problems when applicable, and classify evidence status. Reconcile overlaps and conflicting reviewers. Reject unverifiable claims as confirmed defects; retain material unresolved risks with explicit uncertainty. Do not inflate style or architectural preferences into mandatory requirements.

If evaluating **received review feedback**, treat each comment as a technical assertion to verify; accept, reject, or leave unresolved with reasons. Ask for clarification only when needed, and continue evaluating independent comments. Do not implement or reply on external services without separate authorization.

### 4. Deliver a consolidated review

Provide a concise, prioritized report using the structure in [Findings guidelines](references/findings-guidelines.md): reviewed context and Git scope, confirmed findings, significant unverified risks, overall technical assessment, and checks/limitations. Include precise file:line or equivalent identifiers and evidence. If no actionable findings are found, say so **only for the scope actually reviewed**; never claim global correctness or unobserved test results. A readiness assessment is advisory, not a merge approval or an external workflow gate.

## Optional persistent reports

- Default location: `docs/development/reviews/` unless the project establishes another convention.
- Filename: `YYYY-MM-DD-[TICKET-]<scope>-review.md`, where the date is the document's creation date, ticket is included only when reliably associated, and the scope identifies the reviewed target without inventing outcomes.
- Persist when the user requests it or when complexity, multiple repositories, significant findings, or likely cross-session continuation give it clear value. Do not create a file for every small review. Under this policy, writing the report is permitted as the review's own deliverable, not permission to change application code.
- **Consolidate, never append a diary.** When resuming the same logical review, read the existing report, verify current Git state, update or rewrite affected sections to reflect the latest supported assessment, and remove stale/redundant commentary. Do not accumulate sections titled “Update 2”, “New findings”, etc.
- Create a separate dated report when a materially different change set, revision, or review objective merits independent historical preservation. Cross-link if useful. Do not create a new file merely because a new session began.
- Record creation/last review dates, actual repository and reference identities, comparison baseline, observed working-tree scope, relevant non-committed changes, and the provenance of material findings. Do not silently treat evidence from different commits as equivalent. Git history holds routine editorial history.
- Only the primary agent writes or updates the report. Reviewer subagents are strictly read-only. Reports are **not** implementation checkpoints or remediation plans.

## Completion criteria

The intended scope and Git provenance are known; relevant code/requirements have been assessed at a proportional depth; material findings have evidence and calibrated status; delegated work has been reconciled; coverage gaps and unverifiable claims are explicit; and the consolidated review is delivered or saved as authorized. **Stop at the review outcome.**
