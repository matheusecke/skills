# Review Scope and Git Guidelines

Scope alignment is a **hard prerequisite** to inspecting feature code. The purpose is to define precisely **what code is being judged and against which state**, not to choose development branches or PR strategy. Use these rules independently of any planning or implementation workflow.

## 1. Establish the requested review target

Determine the kind of review from the user's actual request:

| Review target | Required alignment |
| --- | --- |
| PR review | Repository, PR identifier, current head SHA, intended base and effective changed-file set |
| Branch changes | Repository, branch/head SHA, intended comparison base and change semantics |
| Commit/range review | Exact commit(s), ancestry/range boundaries and scope |
| Local uncommitted changes | Working directory, whether staged, unstaged and untracked work is included |
| Existing component/flow | Repository, code surface, revision/branch and technical objective; no diff required |
| Review of feedback | Original comments, applicable code revision and relevant scope; account for subsequent changes |
| Multi-repository delivery | Repositories, references and change surfaces per repository; do not presume aligned deployment versions |

Read the user's text and explicit repository conventions first. Repository identity/configuration discovery and reading instructions needed to decide the scope are allowed prior to feature-code inspection. If the intended target or comparison baseline materially affects the assessment and is not established, **ask for confirmation before inspecting feature code**. Ask only for choices: obtain discoverable SHAs, PR metadata and paths yourself. Never silently select `HEAD~1`, `main`, `master`, `develop`, `origin`, the current branch, or the entire working tree.

If the user specifies a clear scope, verify and proceed without a redundant approval step. If a target remains unavailable or ambiguous, explain exactly what cannot be reviewed; do not substitute another target. A user may explicitly authorize proceeding under a documented uncertainty.

## 2. Verify repository state without changing it

For each repository actually in scope, inspect as relevant:

- Repository identity/path, current branch, HEAD SHA, local/remote references and upstream association where applicable.
- Current working-tree status, staged changes, unstaged changes and untracked files (including ignored files only if the user explicitly includes them).
- The precise objects or refs used as the review baseline and target; verify they exist and resolve to the claimed revisions.
- Available remote/PR metadata, whether it is current enough for the task, and discrepancies between the reviewed revision and a live PR or deployed version.
- Whether changes outside the requested scope could contaminate a working-tree-based review.

Useful **illustrative read-only** commands (adapt to the repository and available tools):

```bash
git rev-parse --show-toplevel
git status --short --branch
git rev-parse HEAD
git branch -vv
git remote -v
git log --oneline --decorate -n 12
git diff --stat <base>..<head>
git diff --name-status <base>..<head>
git diff --cached --stat
git diff --stat
git ls-files --others --exclude-standard
```

Fetching updates remote-tracking references and is **not strictly read-only Git state**. Do not automatically fetch, pull, checkout, reset, stash, create worktrees, rebase, or merge. If fresh remote evidence is necessary and cannot be obtained through non-mutating APIs, request permission to refresh references or disclose the limitation. No implicit branch switching or history modification. Respect pre-existing changes.

## 3. Choose the comparison that matches the question

Different Git commands answer different questions. State which semantics you chose:

- **Two fixed snapshots:** `git diff <base> <head>` compares their trees; use for exact committed before/after review.
- **Changes developed on a branch relative to a base:** establish a correct merge base (e.g. `git merge-base <base> <head>`) and compare it with the branch head; `git diff <base>...<head>` has merge-base semantics. `git diff <base> <head>` instead compares the current tips and may include changes on the base branch not introduced by the reviewed branch.
- **PR review:** prefer the provider's PR changed-file set and actual head/base metadata (plus any PR-specific merge-base semantics); do not assume a locally stale base is authoritative.
- **Specific commits:** determine whether the user means the change in one commit, a sequence of commits, or the final net difference. A multi-commit range is not equivalent to `HEAD~1..HEAD`.
- **Index (staged changes):** `git diff --cached` compares staged state with HEAD.
- **Working tree (unstaged tracked changes):** `git diff` compares working files with the index.
- **Combined staged + unstaged tracked changes:** `git diff HEAD` compares working files with HEAD, but **does not include untracked files**.
- **Untracked files:** identify with `git ls-files --others --exclude-standard` and inspect their actual content if they are in scope; avoid changing index/staging merely to obtain a diff. Do not assume ignored files are in scope.
- **Existing-code review:** no before/after range is needed. Fix the intended revision and component/flow boundary instead.

When a scope includes both committed branch changes and local working changes, evaluate their union **without double-counting** or incorrectly attributing uncommitted content to a commit SHA. If no reliable baseline can be established, stop and ask rather than manufacturing one.

## 4. Multiple repositories and integration boundaries

For a change spanning multiple repositories, track the target, baseline, branch, observed HEAD, working-tree changes, and review timestamp **per repository**. Verify external contract claims against the revisions actually examined. When you discover an additional relevant dependency, establish its Git/release identity before reading its feature code; confirm any essential missing choice with the user. Merely identifying a consumer is not permission to review every unrelated change in that repository.

Review callers/consumers/providers as needed to verify a named risk (e.g., API contract compatibility). Identify whether they are part of the change set, unchanged context, or inaccessible dependencies. Do not state that an integration has been verified when only one side was available.

## 5. Resumption and repeat reviews

If a prior review report exists, read its exact scope and code provenance, then check the current references and working trees. Decide whether the current request is (a) the same logical review with updated evidence, (b) a focused re-review of identified changes, or (c) a distinct review. Reassess the affected findings and surrounding impacts, not every historical issue without reason. Preserve the old revision association for findings that have not been reverified at the new revision.

A commit SHA identifies a committed tree, **not** staged, unstaged or untracked content. Include those facts in the report's context where relevant. Provide an observed date/time with timezone when possible. Never conflate files examined at different timestamps or revisions.

## 6. Hard boundaries

- Do not inspect feature code against an ambiguous or silently inferred review target/baseline.
- Do not modify the repository, Git state, index, working tree, PRs or external services as part of review.
- Do not silently drop staged, unstaged, untracked or cross-repository changes that are part of the user's selected scope.
- Do not claim a diff covers changes, integrations or versions that were not actually inspected.
- Prefer a precise question to an incorrectly scoped review; once aligned, proceed without unnecessary checkpoints.
