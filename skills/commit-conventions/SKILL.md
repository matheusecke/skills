---
name: commit-conventions
description: Organize changes into focused Git commits and write consistent commit messages, with or without issue identifiers. Use when asked to propose a commit breakdown, write commit messages, or commit changes.
license: MIT
---

# Commit Conventions

Organize the requested changes into coherent commits and describe each change clearly. Follow explicit user instructions and repository rules when they differ from the defaults below.

## Inspect and group

Inspect the Git status and relevant diffs, including staged and unstaged changes. Identify preexisting or unrelated work before deciding what belongs in each commit. For multiple repositories, inspect and group changes in each repository separately.

Group changes by coherent purpose, keeping related implementation, tests, and necessary supporting changes together. Separate documentation when it forms an independently reviewable change. Avoid splitting a change so finely that intermediate commits become misleading or incomplete.

When asked only for a commit map or messages, present the proposal without staging or committing.

## Write messages

Use the following default format:

```text
<TICKET>: <type>(<scope>): <description>
```

When no ticket is declared or reliably associated with the work, omit the prefix:

```text
<type>(<scope>): <description>
```

Use a ticket explicitly provided by the user or clearly associated with the work in the current context. Do not invent one or assume that every change belongs to the ticket in the branch name. If multiple tickets apply to the same change, list them separated by commas.

Use a concise English description in the imperative, without a final period. Choose a meaningful lowercase scope and an appropriate type, such as `feat`, `fix`, `refactor`, `test`, `docs`, `chore`, `build`, or `ci`.

Examples:

```text
TASK-123: feat(authentication): add password reset
TASK-123, TASK-456: fix(checkout): preserve selected payment method
fix(profile): handle missing display name
docs(api): document pagination parameters
```

## Execute when authorized

Create commits only when authorized by the user or applicable repository instructions. A request for a proposal alone does not authorize commits. Stage only changes belonging to the requested commit, review the staged diff, and preserve unrelated work. If changes cannot be separated safely, explain the issue before proceeding.

Do not push, merge, open a pull request, or alter history unless separately authorized. After committing, report the repository, commit hash, message, and any relevant changes left uncommitted.
