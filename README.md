# Agent Skills

## Overview

Portable [Agent Skills](https://agentskills.io/specification) for software engineering discovery, specification, planning, and decision-making. Install them from GitHub with the [`skills` CLI](https://github.com/vercel-labs/skills), or use the manual symlink method below.

## Available Skills

| Skill | Purpose |
| --- | --- |
| [`planning-workflow`](skills/planning-workflow/SKILL.md) | Align Git references, investigate requirements and edge cases, write a persistent specification, and create an adaptive technical plan. It stops before implementation. |
| [`decision-refinement`](skills/decision-refinement/SKILL.md) | Clarify proposals and decisions through dependency-aware questions, researched facts, trade-offs, and recommended answers. |

Both skills are written in English. User-facing conversations and generated documents follow the user's preferred language or repository conventions.

## Installation

### Recommended: Skills CLI

Install both skills globally for Codex, Claude Code, and Cursor:

```bash
npx skills add matheusecke/skills \
  --skill planning-workflow \
  --skill decision-refinement \
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
for skill in planning-workflow decision-refinement; do
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

Invoke a skill explicitly with `$planning-workflow` in Codex or `/planning-workflow` in Claude Code and Cursor. Replace the name to invoke `decision-refinement` directly. Invocation support can vary by agent version.

`planning-workflow` guides engineering discovery and planning. It always produces a specification and stops for approval; a separate implementation-agnostic plan is optional for Tier 1, conditional for Tier 2, and required for Tier 3. It does not implement features. For structured, unresolved decisions, it uses `decision-refinement` when available. Installing both is recommended; the workflow has a lightweight fallback if the second skill is unavailable.

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
│   └── decision-refinement/
│       └── SKILL.md
├── THIRD_PARTY_NOTICES.md
├── LICENSE
└── README.md
```

[`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md) records the upstream reference and attribution for `decision-refinement`; the upstream skill source is not vendored or installable from this repository.

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

`decision-refinement` is adapted from Matt Pocock's original [`grilling` skill](https://github.com/mattpocock/skills/blob/main/skills/productivity/grilling/SKILL.md). The upstream reference, adaptation notes, and MIT license link are in [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md).

Original content in this repository is licensed under MIT; see [`LICENSE`](LICENSE). Third-party material retains its own applicable notices.
