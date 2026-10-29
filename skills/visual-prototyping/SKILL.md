---
name: visual-prototyping
description: Create and refine local wireframes, mockups, or interactive prototypes to resolve a concrete visual or interaction decision before implementation.
---

# Visual Prototyping

A prototype is an experimental reference, not authorization to implement production software. Work in the user's language.

## Authorization

A direct request for a wireframe, mockup or prototype, direct invocation intending to produce one, or explicit acceptance of an offer authorizes the session and refinements to the same question. A recommendation, unanswered offer, question about this skill, or planning its creation does not. If intent or scope is unclear, clarify before creating files or starting a server. Respect a refusal and do not reoffer for the same question unless the user initiates it; a materially new question may justify a separate offer.

When called by another workflow, receive its question and authorization state. Return an unoffered opportunity to the coordinator; do not duplicate a pending or declined offer. If invoked as a mere recommendation without acceptance, return the need for an offer. Do not create a separate formal approval gate.

## Workflow

1. State briefly the decision to evaluate and select the smallest useful representation. For an existing product inspect relevant visual patterns, tokens, components, navigation, breakpoints, density and states. Redesign requires an explicit request. Read [visual guidelines](references/visual-guidelines.md).
2. Prepare authorized isolated content in `.development/prototypes/<slug>/content/`; use the same session only for the same question. Follow [prototype guidelines](references/prototype-guidelines.md). Prepare assets before publishing entries in the catalog, preferably atomically. Use fictitious data and local interactions only.
3. Run the local preview using [runtime guidance](references/preview-runtime.md), communicate its full connection URL in conversation, and verify it is accessible in the actual environment. Refine files and catalog in the same session. Preview controls do not send selections to the agent; obtain feedback in conversation.
4. Preserve the chosen proposal and its required assets in the session. If no choice was expressed, report it as open. Return the question, choice, rationale, visual decisions, behavior and states, layout and responsiveness, relative local path, simplifications, open questions, and whether the session remains active. If further refinement is not expected, stop the server and report the result.

The calling planning workflow incorporates material decisions into its self-contained spec before its normal approval. The local path is an optional reference and may be unavailable in another checkout. Do not store connection URLs or operational state in project artifacts, change Git configuration or staging, commit, push, install tools, or alter production code as a consequence of prototyping.
