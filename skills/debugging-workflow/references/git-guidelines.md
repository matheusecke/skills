# Git Context and Investigation Readiness

**Git alignment is a blocking prerequisite to feature-code investigation.** Its purpose is to establish *which actual system state* a finding describes—not to choose an implementation branch, PR target, or merge strategy.

## 1. Establish the investigation context before code

From the user's request and existing, user-confirmed workflow context, identify:

- **Reported environment:** production, staging, development, a feature workspace, CI, a historical release, etc.
- **Relevant repository/repositories:** those already known to participate in the reported scenario.
- **Target reference(s) per repository/environment:** branch, tag, commit, deploy SHA, or explicit reference comparison.
- **Comparison objective, if any:** working vs. broken, before vs. after, production vs. staging, or multiple branches.

**Do not equate an environment name with a Git reference.** Production may be running a release SHA while `main` has progressed; staging may use a different tag, image, or deployment. Prefer evidence from deployment metadata when accessible, and distinguish actual deployment verification from an inferred branch.

If the user has **not supplied or already confirmed** the intended references, first inspect only minimal repository metadata and explicit conventions needed to formulate a useful question, then **ask the user to confirm the proposed context**. State a concise recommendation if identifiable; do not ask for data such as a SHA that Git or deployment metadata can resolve after the user chooses the source. Group closely related missing reference choices into one question. Reuse explicit selections previously confirmed in the parent workflow instead of asking again.

Do not inspect feature code, derive diagnoses, or dispatch code-inspecting subagents before the relevant reference is confirmed. If references remain ambiguous or unavailable, state the blocker and request a decision. Proceed under a known stale/unverified reference only with the user's **explicit exception**, recording its limitations; never label it verified.

Minimal repository identification, listing refs, and inspection of explicit repo instructions about Git conventions are permitted before alignment. These are not permission for exploratory investigation of application code.

## 2. Verify each selected reference

Once aligned, establish as applicable:

- Repository identity, location, remotes and upstreams; do not assume a remote is called `origin`.
- Selected symbolic ref, the **resolved full commit SHA**, and where it was obtained.
- HEAD/current branch and worktree location, including **relevant uncommitted changes** and whether they affect inspected files.
- Freshness relative to the authoritative remote/deployment source, if applicable and accessible.
- Observation date/time with timezone; distinguish locally observed state from remote or deployed state.
- If deployed artifacts/images differ from source branches, the link between running artifact and source revision, or the inability to establish it.

Illustrative commands; substitute the real repository and refs:

```bash
git status --short --branch
git rev-parse --show-toplevel
git rev-parse HEAD
git remote -v
git show-ref --verify refs/heads/<branch>
git rev-parse <selected-ref>^{commit}
git log -1 --format='%H %cI %s' <selected-ref>
git diff --stat
git diff --name-only
```

After a remote is identified, if network access and task permissions allow, `git fetch --prune <remote>` may refresh remote-tracking metadata **without switching the working branch**. This updates Git metadata and should not be described as a fully read-only operation. Never fetch blindly, assume freshness from an old local ref, or imply that fetch verifies an actual deployment. If fetch is unavailable or disallowed, distinguish missing freshness verification from a proven mismatch and obtain an explicit exception if it is material to the intended diagnosis.

A commit SHA **does not contain uncommitted changes**. For dirty worktrees, record relevant file paths and the fact that observed local behavior may differ from the referenced commit. Do not copy secrets, full diffs, or sensitive runtime data into reports.

## 3. Compare safely across refs, repositories, and environments

Support independent baselines for each repository and environment; they may legitimately point to different revisions. A production comparison may use a deploy SHA and a historical release, rather than a single shared branch.

Prefer commands that inspect a ref without modifying the current checkout, for example:

```bash
git show <ref>:path/to/file
git diff <ref-a> <ref-b> -- path/to/area
git log --oneline <older-ref>..<newer-ref> -- path/to/area
git merge-base <ref-a> <ref-b>
```

- Do not silently switch branches, pull, merge, rebase, reset, clean, stash, create/delete branches, create worktrees, or rewrite history.
- Do not conflate **local working-tree observations**, committed reference snapshots, remote-tracking branches, and deployed running versions.
- If a new dependency/repository becomes relevant mid-investigation, establish its intended environment/ref and obtain confirmation **before examining its feature code**. Do not restart the entire investigation or ask again about already aligned repositories.
- Give subagents exact permitted repository/ref targets and require them to report those targets with their findings.
- Correlate cross-service evidence only after checking version compatibility and whether the observed deployments/revisions coexisted at the relevant time.

## 4. Evidence provenance and documentation

For each material finding, preserve enough provenance to reconstruct its meaning:

| Field | What to capture |
| --- | --- |
| Repository / component | Which codebase and boundary were examined |
| Environment / reference | Production deploy, staging tag, feature branch, etc. |
| Resolved SHA | Full SHA when available, otherwise explicit verification gap |
| Worktree condition | Clean, relevant local modifications, or not applicable/unknown |
| Observed at | Timestamp with timezone for time-sensitive evidence |
| Evidence | Paths, symbols, logs/traces, safe commands/results, or contract reference |
| Status | Verified in that state, inferred, unverified, or historical |

Be precise about *which* state supports *which* claim. A finding observed on `develop` is not automatically validated for production, and a production log does not itself prove source revision without deployment correlation.

Use an evidence-oriented summary rather than a verbose command diary. Reference original sources where possible, including trace IDs or sanitized log identifiers instead of sensitive data.

## 5. Resuming investigations

1. Read the existing consolidated diagnosis and its repository/reference matrix when present.
2. Reconfirm the intended investigation context if the environment or reference selection changed or is no longer clear. Reinspect HEAD, relevant working-tree changes, and target refs.
3. Compare old and current revisions; identify changed components, contracts, and assumptions that could invalidate findings.
4. Revalidate only affected evidence. Preserve historical results under their original reference; do not silently relabel them as current.
5. Consolidate the document into the latest defensible diagnosis, with valid version-specific evidence and explicit uncertainty.

**Do not require identical HEAD SHAs across sessions**, discard reliable past work because a ref advanced, or treat a changed SHA alone as proof that an earlier conclusion is false.
