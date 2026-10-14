---
name: decision-refinement
description: Clarify a proposal, design, or decision through structured questions, dependency-aware rounds, researched facts, and recommended answers. Use to surface ambiguous requirements, hidden assumptions, trade-offs, and unanswered choices, either independently or as part of a development workflow.
license: MIT
---

# Decision Refinement

Interview the user until the relevant decisions are resolved and a shared understanding emerges. This skill is reusable beyond software engineering; it does not itself write implementation plans or make code changes.

## Map the decision tree

Identify the open **decision tree**: each decision can unblock or change decisions below it. Respect the calling workflow's scope, already settled decisions, and existing constraints; never restart or enlarge a settled investigation without new evidence.

Work in **rounds**. The **frontier** is the set of decisions whose prerequisites are already settled. Ask all relevant independent frontier questions in a numbered round, then wait for answers. Never ask a downstream question that depends on another unanswered question in the same round.

For each question, provide the options or trade-offs when useful and **your recommended answer with a concise rationale**. Phrase it so a simple “yes” clearly accepts the recommendation. Match the user's preferred language.

Example round:

```text
Q1 — <decision to make>
<Relevant options and consequences>
Recommendation: <recommended choice and why>

Q2 — <independent decision>
<Relevant options and consequences>
Recommendation: <recommended choice and why>
```

After each response, record which decisions are settled, recompute the frontier, and ask the next round. Do not repeat answered questions or manufacture choices to lengthen the interview.

## Facts versus decisions

Investigate **facts** using available documentation, code, files, tools, or other permitted evidence rather than asking the user to look them up. The **decisions** about desired behavior, product policy, and meaningful trade-offs belong to the user.

For substantial *independent* fact-finding, delegate read-only exploration to subagents **when available and likely to improve context isolation, parallelism, or quality enough to justify overhead**. Otherwise research directly. A pending investigation is an unsettled prerequisite: continue with independent frontier questions, but do not guess dependent answers. Require concise, evidence-backed findings and flag unresolved uncertainty. Respect restrictions and Git-readiness gates imposed by the calling workflow; a subagent cannot bypass them.

## Completion and handoff

The session ends when the relevant frontier is empty: every material decision in scope has been considered, no blocking gap is silently assumed, and the decisions can be summarized coherently. Report the resolved decisions, rationale, relevant alternatives rejected, and any explicitly non-blocking questions or exclusions.

- **When called by another workflow:** return a compact decision summary for its next artifact. Do **not** add a second formal approval gate; the calling workflow owns approvals and downstream actions.
- **When invoked on its own:** do not take unrelated downstream actions without the user's authorization. Invite correction of the summary if necessary.

Never silently decide a material user choice. Do not trade clarity or completeness for fewer questions.
