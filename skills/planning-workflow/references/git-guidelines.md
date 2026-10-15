# Git alignment and readiness

## Before Git-dependent investigation

1. Read the user's request for explicit references and repo-specific conventions. Do not assume `main`, `master`, `dev`, or `origin`.
2. Identify **base/source branch** (code to build on), **working branch** (new or existing), and **PR/integration target** (may differ from base). Clarify the release/development context when it affects these choices.
3. Ask for missing choices **before investigating feature code or running reference-dependent commands**. Group closely related questions. If conventions unambiguously establish a choice, use them; distinguish conventions from guesses.
4. Default to the **current working tree**, never a newly created worktree. Do not solicit worktree preferences or create/suggest one unless explicitly instructed.

Minimal repository identification needed to locate conventions is allowed before alignment; this is not permission for feature-code exploration.

## Diagnose only after alignment

- Identify repository/remotes, current branch and upstream, uncommitted changes, worktree location, and whether the proposed working branch exists locally and remotely.
- Obtain fresh remote-tracking references when access permits (`git fetch --prune <remote>`). Identify the correct remote rather than assuming `origin`.
- Verify the local base against its authoritative remote reference; distinguish a branch being behind, ahead, diverged, or lacking an upstream.
- Identify the relevant base commit SHA and check dependencies on unmerged branches. Check likely integration conflicts when there is evidence of overlapping work; do not promise conflict-free merging.
- Record the base, working branch, target, remote/upstream when applicable, verification date, and baseline SHA in the spec.

Illustrative read/diagnostic commands (adapt names to the actual repo):

```bash
git status -sb
git branch -vv
git remote -v
git fetch --prune <remote>
git rev-list --left-right --count <local-base>...<remote>/<base>
git merge-base <remote>/<base> HEAD
```

`fetch` updates remote-tracking references, **not** the local working branch. A working branch being ahead of upstream can be normal; interpret divergence against the agreed strategy, not by a blanket zero-difference requirement.

## Hard stop and permissions

- **Stop before feature investigation** when references cannot be verified, the relevant base is outdated, fetch fails, access is missing, or an unexpected divergence prevents reliable planning. Explain exactly what was checked and what the user should update manually (including appropriate commands if safe). Recheck after the user resolves it.
- Only continue on an unverified or outdated reference after **explicit user authorization**. Document the exception and impact; never label the base verified.
- Read-only commands and reference-refreshing `fetch` are permitted after alignment when supported by environment and task permissions.
- Never silently switch/create/delete branches, pull, merge, rebase, reset, stash, push, change history, or discard local modifications. Require explicit authorization for state-changing operations; a user's explicit instruction in the original task can constitute authorization.
- If uncommitted work or an existing branch presents a conflict, stop and ask for resolution; do not auto-stash, auto-reset, or create a worktree.
- For a production fix, clarify the appropriate release/base and any needed propagation to other branches; for a dependent feature, record the upstream feature dependency and possible temporary PR target.

## Resumption

Re-run alignment/readiness before consulting potentially outdated feature code. Compare the spec's baseline SHA with the updated reference and inspect relevant changes selectively. If those changes affect approved assumptions or contracts, seek a decision and reapproval as appropriate. A new commit alone does not invalidate the spec.
