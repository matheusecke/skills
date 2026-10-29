# Third-party notices and provenance

## Matt Pocock — `grilling`

- **Original author:** Matt Pocock.
- **Upstream repository:** [mattpocock/skills](https://github.com/mattpocock/skills).
- **Original skill:** [`grilling`](https://github.com/mattpocock/skills/blob/main/skills/productivity/grilling/SKILL.md).
- **License:** MIT; see the upstream [`LICENSE`](https://github.com/mattpocock/skills/blob/main/LICENSE).
- **Locally adapted skill:** [`skills/decision-refinement/SKILL.md`](skills/decision-refinement/SKILL.md).
- The upstream source is referenced for attribution and provenance but is not vendored in this repository.

### Intentional adaptations

1. Rename `grilling` to `decision-refinement`, keeping the skill applicable beyond software projects.
2. Preserve the decision-tree, frontier, round-based questioning, recommended answers, facts-versus-decisions, and completion principles.
3. Make subagent fact-finding conditional on demonstrable value and environment support; otherwise investigate directly.
4. Allow calling workflows to restrict scope, preserve prior decisions, and enforce their own Git-readiness and approval gates.
5. Return a compact outcome for downstream workflows without creating an extra formal approval gate.

These modifications are not endorsed by or affiliated with the original author. Future upstream changes are not incorporated automatically; compare upstream material and review it manually before adapting it.

## Visual prototyping inspirations

The `visual-prototyping` skill is an original implementation inspired by [Superpowers brainstorming](https://github.com/obra/superpowers/tree/2ce8aa15d05bd57213e6f746f953aafb7ded7a8b/skills/brainstorming) (Jesse Vincent, MIT) and [Matt Pocock prototype](https://github.com/mattpocock/skills/tree/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/prototype) (MIT). The preview uses SSE and an explicit catalog, and does not vendor upstream code or automatically synchronize with either source.
