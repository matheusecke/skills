# Agent Skills

## Overview

Portable [Agent Skills](https://agentskills.io/specification) for software engineering discovery, specification, planning, implementation, and decision-making. Install them from GitHub with the [`skills` CLI](https://github.com/vercel-labs/skills), or use the manual symlink method below.

## Available Skills

| Skill | Purpose |
| --- | --- |
| [`planning-workflow`](skills/planning-workflow/SKILL.md) | Align Git references, investigate requirements and edge cases, write a persistent specification, and create an adaptive technical plan. It stops before implementation. |
| [`decision-refinement`](skills/decision-refinement/SKILL.md) | Clarify proposals and decisions through dependency-aware questions, researched facts, trade-offs, and recommended answers. |
| [`visual-prototyping`](skills/visual-prototyping/SKILL.md) | Create local visual prototypes to resolve concrete design and interaction decisions. |
| [`implementation-workflow`](skills/implementation-workflow/SKILL.md) | Execute an approved plan or, when no formal plan exists, an approved spec. It supports scoped execution and persistent recovery. |

These skills are written in English. User-facing conversations and generated documents follow the user's preferred language or repository conventions.

## Installation

### Recommended: Skills CLI

Install these skills globally for Codex, Claude Code, and Cursor:

```bash
npx skills add matheusecke/skills \
  --skill planning-workflow \
  --skill decision-refinement \
  --skill implementation-workflow \
  --skill visual-prototyping \
  --agent codex --agent claude-code --agent cursor \
  --global
```

To install only one skill, keep only its `--skill <name>` option. Choose other supported agents with `--agent <name>`; see the [`skills` CLI documentation](https://github.com/vercel-labs/skills#supported-agents). For a project-local installation, run the command from the project directory and omit `--global`.

### Alternative: Clone and symlink

Clone the repository and set the path to your checkout:

```bash
export SKILLS_REPO="$HOME/agent-skills"
git clone https://github.com/matheusecke/skills "$SKILLS_REPO"
mkdir -p "$HOME/.agents/skills" "$HOME/.claude/skills"
```

Create links to the actual skill directories. This keeps the clone as one source of truth and preserves each skill's `SKILL.md` and references:

```bash
for skill in planning-workflow decision-refinement implementation-workflow visual-prototyping; do
  for agent_dir in "$HOME/.agents/skills" "$HOME/.claude/skills"; do
    target="$agent_dir/$skill"
    if [ -e "$target" ] || [ -L "$target" ]; then
      printf 'Already exists; skipping: %s\n' "$target" >&2
      continue
    fi
    ln -s "$SKILLS_REPO/skills/$skill" "$target"
  done
done
```

The `~/.agents/skills/` directory is supported by Codex and Cursor; `~/.claude/skills/` is Claude Code's personal skills directory. Symlinks are an alternative for a cloned checkout, not a requirement for the Skills CLI.

## Usage

Invoke a skill explicitly with `$planning-workflow` in Codex or `/planning-workflow` in Claude Code and Cursor. Replace the name to invoke `decision-refinement` or `implementation-workflow` directly. Invocation support can vary by agent version.

`planning-workflow` guides engineering discovery and planning. It always produces a specification and stops for approval in the conversation; a clear request to proceed counts as approval, without recording it in the artifact. A separate implementation-agnostic plan is created when requested or warranted by dependencies, coordination, handoff, or risk; complex or high-risk changes use a structured plan. It does not implement features. For structured, unresolved decisions, it uses `decision-refinement` when available. Installing both is recommended; the workflow has a lightweight fallback if the second skill is unavailable.

`visual-prototyping` produces local visual references for a concrete question. A direct prototype request or explicit acceptance of an offer authorizes creation; a suggestion alone does not. Planning and decision refinement can optionally offer it, respecting refusals and existing approval gates. It needs Bash 3.2+, Node.js 22+ and a modern browser with EventSource. The preview binds to local loopback and automatic browser opening is best-effort; remote hosts may need user-managed port forwarding. Foreground execution in a persistent job may be needed when an agent terminates background processes. See its [runtime guide](skills/visual-prototyping/references/preview-runtime.md).

Prototypes remain in `.development/prototypes/<slug>/`; the project's versioning policy applies. Private operational state, including the connection credential and log, is kept outside the project in the system temporary directory. A prototype is an optional reference, not production code or a substitute for a self-contained approved spec.

`implementation-workflow` executes an approved plan or, when no formal plan exists, an approved spec. It supports scoped execution and persistent recovery through one consolidated checkpoint. It implements within those approved artifacts and does not replace discovery or planning.

## Repository Structure

```text
skills/
├── skills/
│   ├── planning-workflow/
│   │   ├── SKILL.md
│   │   └── references/
│   │       ├── git-guidelines.md
│   │       ├── spec-guidelines.md
│   │       └── planning-guidelines.md
│   ├── decision-refinement/
│   │   └── SKILL.md
│   ├── visual-prototyping/
│   │   ├── SKILL.md
│   │   ├── references/
│   │   ├── assets/preview-template.html
│   │   └── scripts/
│   └── implementation-workflow/
│       ├── SKILL.md
│       └── references/
│           ├── plan-execution.md
│           ├── spec-execution.md
│           ├── testing-guidelines.md
│           └── progress-guidelines.md
├── THIRD_PARTY_NOTICES.md
├── LICENSE
└── README.md
```

[`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md) records third-party references and attribution; upstream skill sources are not vendored or installable from this repository.

## Updating Skills

For installations managed by the Skills CLI, update globally installed skills with:

```bash
npx skills update --global
```

For a clone-and-symlink installation, pull the latest repository changes:

```bash
cd "$SKILLS_REPO" && git pull --ff-only
```

Restart an agent session if it does not discover updated skill instructions. To install a newly added skill with the CLI, run `npx skills add matheusecke/skills --skill <name>` for the relevant agent and scope.

## Development / Contributing

Each installable skill lives in `skills/<name>/` and must include a valid `SKILL.md`. Keep reference links relative, update this README when the skill inventory changes, and preserve third-party attribution and license notices. Validate discovery and referenced files in the agents you support before publishing.

## Credits and License

`decision-refinement` is adapted from Matt Pocock's original [`grilling` skill](https://github.com/mattpocock/skills/blob/main/skills/productivity/grilling/SKILL.md).

`visual-prototyping` is an original implementation inspired by Jesse Vincent's [Superpowers brainstorming](https://github.com/obra/superpowers/tree/2ce8aa15d05bd57213e6f746f953aafb7ded7a8b/skills/brainstorming) and Matt Pocock's [prototype skill](https://github.com/mattpocock/skills/tree/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/prototype), both MIT licensed.

See [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md) for provenance, adaptation notes, and license references.

Original content in this repository is licensed under MIT; see [`LICENSE`](LICENSE). Third-party material retains its own applicable notices.
