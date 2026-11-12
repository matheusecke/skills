---
name: qa-handoff
description: Prepare an evidence-based handoff that helps QA understand, access, and test a software delivery. Use when asked to prepare or review delivery information for QA.
license: MIT
---

# QA Handoff

Prepare or review the information QA needs to understand and test a delivery. Follow the user's requested format and repository conventions when they differ from the defaults below.

Engineering describes the implemented change, known impacts, prerequisites, and checks performed. Product and Engineering align business rules and acceptance criteria. QA defines test cases, scenarios, regression coverage, test data additions, and records results, evidence, and defects.

## Gather evidence

Inspect the relevant ticket, specifications, design, implementation, tests, release information, and other available references as appropriate. For multiple repositories or components, identify their respective changes and delivery references.

Use existing information when available and link to the relevant section instead of duplicating it unnecessarily. Separate confirmed facts from assumptions, missing information, and pending validation. Do not infer deployment, release version, test results, or acceptance from code alone.

If business rules or acceptance criteria are missing or ambiguous, record the pending alignment with Product before handoff. Identify other missing information that prevents QA from accessing or understanding the delivery. Include an owner and expected date when known; do not invent them.

## Prepare the handoff

Write in the user's preferred language. Use the following sections unless the user requests another format:

### Context and change

- Ticket and contact: key, title, link, engineer, and contact for questions when needed.
- Objective: problem or need, with specification or design reference.
- Delivered scope: affected modules, screens, services, and platforms; what is included and excluded.
- What changed: a concise explanation useful to QA.
- Before and after: previous behavior or bug condition, and the expected behavior and how to observe it. State when the capability is new.
- Delivery references: pull requests and version or build containing the change.

### Behavior and preparation

- Rules and acceptance criteria: link and section, relevant observable conditions and outcomes, implementation adherence, and any differences.
- Environment and version: URL, deployed build, and relevant platform or version.
- Access path: menu, screen, or endpoint and a short path to the change.
- Prerequisites and initial data: required profiles, permissions, accounts, organizations, records, and how to obtain or prepare essential data.
- Technical configuration: relevant flags, values, services, migrations, or scripts; distinguish what has been executed from what remains.
- Engineering checks: validation performed and its results, including relevant limitations.
- Regression: indicate whether regression testing is needed and identify known affected areas when supported by evidence.

### Conditional details

Include the following only when affected:

- Messages and errors: trigger, exact message or API code and status, effect on data, and whether retry is possible.
- Permissions and isolation: authorized profiles, user or organization restrictions, and behavior when access is denied.
- Integrations: affected service, endpoint or event, contract, inputs and outputs, failure handling, and mocks when relevant.

Use “N/A” with a short reason when a requested field does not apply. Mark unknown information and pending items explicitly. Keep the handoff concise and practical; do not write test cases or a scenario matrix unless the user separately requests them.

## Delivery

Present a copyable draft or review findings, as requested. Do not update a ticket, send a message, or publish the handoff without authorization.
