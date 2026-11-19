# Root Cause Tracing

**Purpose:** find the causal origin of an observed failure, including across service and repository boundaries, instead of treating the nearest visible symptom as the cause.

Use after the relevant Git context is aligned under [Git guidelines](git-guidelines.md). A trace is an evidence-finding process, **not** a proposal for where to implement a fix.

## 1. Anchor the symptom

Describe a specific observed failure: input, state, triggering condition, expected outcome from a known requirement/contract, actual outcome, and evidence source. Separate the user's report from directly reproduced or logged behavior.

Start with the narrowest reproducible failing path. If the defect cannot be reproduced safely, use production traces, stored requests with sensitive data removed, correlated events, or relevant tests as alternative evidence. Do not invent missing steps.

## 2. Trace backwards toward the origin

At each step, ask:

1. **What happened here?** Which check, operation, transformation, side effect, or state transition produced the observed result?
2. **What input or state made that possible?** Look at values, invariants, configuration, timing, and relevant dependencies.
3. **Where did that input or state come from?** Trace the actual caller, producer, prior event, middleware, persistence layer, or integration boundary.
4. **Why did this boundary accept or transform it this way?** Compare against code, contracts, configuration, and functioning paths.
5. **What evidence distinguishes origin from propagation?** A component may forward a bad value without creating it.

Continue only while upstream analysis can materially explain the behavior. Record the first *demonstrated* divergence from a supported invariant/contract and upstream conditions that made it possible. Some defects have multiple independent causes or necessary conditions; do not force a single-cause story.

## 3. Follow the relevant end-to-end system

An initial API, UI, test, or worker is an **entry point**, not a guaranteed root-cause location.

When relevant:

- Follow **upstream** callers, producers, event sources, integration adapters, or stored state to establish origin.
- Follow **downstream** consumers, services, queues, side effects, and data stores to understand propagation and observed impact.
- Inspect contracts, serialization, identity/authorization context, retries, idempotency, transaction boundaries, asynchronous events, caching, and time semantics **only when the failure path makes them relevant**.
- Compare independently deployed services at the revisions that actually interacted; align newly discovered repos before reading their feature code.
- Examine relevant existing documentation and tests against runtime evidence. If they disagree, investigate the discrepancy instead of choosing a favored source without support.

Do not mechanically investigate every consumer of an API or every dependency of a component. Prioritize interactions that explain the defect, might change its classification, or establish its reach.

## 4. Trace across boundaries with evidence

For each materially relevant boundary, determine:

| Boundary question | Evidence to seek |
| --- | --- |
| What entered? | Request/event payload shape, headers or metadata, state, timestamp |
| What was expected? | Versioned interface or business invariant, documented precondition |
| What left or changed? | Return data, published event, persisted state, error, side effect |
| What differed? | Transformation, missing/extra value, wrong version, stale state, timing |
| Which code state? | Repository, environment/ref, commit, local changes, observation time |

Use logs, traces, test fixtures, and read-only code inspection first. Instrumentation requiring edits must be explicitly authorized under the parent skill's safety rules. Redact secrets and sensitive data. A cross-boundary trace should reveal **where the first supported divergence occurs**, not simply produce more logs.

## 5. Validate causality, not coincidence

A plausible sequence of calls is not sufficient. Seek observations that distinguish competing explanations:

- Does the defect correlate with a specific input, deployment, configuration, state transition, or interleaving?
- Does the analogous working path differ in a way that explains the failure?
- Can the inferred mechanism be demonstrated by a controlled safe experiment, existing test, trace, or logically conclusive code path?
- Are there other paths or external conditions that could independently produce the symptom?
- Is a proposed explanation merely showing a **symptom location**, rather than the origin or enabling conditions?

When conditions are concurrent, capture the necessary ordering and state assumptions; do not claim a race solely because the result is intermittent.

## 6. Classify and report

- **CONFIRMED:** the causal mechanism is demonstrated with sufficiently specific code/runtime/test evidence in identified revisions.
- **PROBABLE:** evidence favors a mechanism, but material confirmation is unavailable or ambiguous.
- **UNCONFIRMED:** an open explanation not yet supported strongly enough to diagnose.

Summarize a causal chain where useful:

`Trigger/conditions -> upstream origin -> boundary transformations -> divergence -> observed effects`

Distinguish root cause, contributing factors, triggering conditions, propagation, and impact. Include failed or rejected hypotheses only when they materially clarify the current analysis. Attribute evidence to the exact Git and environment state; identify missing links rather than filling them with assumptions.

**Stop at the diagnosis.** Naming the failed interface or violated invariant is appropriate; directing an implementation change at a particular method or selecting an architectural remedy belongs to planning.
