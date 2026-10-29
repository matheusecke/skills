# Prototype authoring

Use `<project>/.development/prototypes/<slug>/content/`. Outside a repository use that relative path under the chosen working directory. The project owns its versioning policy; do not change ignore files, staging or the index. Warn only about a concrete accidental inclusion risk.

Write `manifest.json` as an object with `version: 1`, a textual `title`, and ordered `alternatives` containing unique lowercase alphanumeric/hyphen `id`, textual `title`, and `entry` relative to `content/`, such as `choice-a/index.html`. Each HTML entry must exist inside its own alternative directory. The empty array means waiting for a proposal. Publish files before adding their catalog entry; use atomic writes where possible. Keep the selected result and all files it needs after the session stops.

Use local HTML, CSS, JS and selectively copied static resources. Never include credentials, sensitive real data, capability URLs, process metadata or logs. Do not use real backend requests or submissions. Document simulated behavior and implement reset for repeatable flows.

All links and programmatic navigations, including location assignment, assign and replace, must resolve locally relative to the current document, including fragments and query strings. Do not use external, protocol-relative external, javascript, data, blob, mailto, external base or meta refresh destinations. Simulate or disable external actions with an explanation. Review HTML and dynamically built JS destinations before presentation, and verify containment in a real browser. The sandbox is not a defense for arbitrary hostile code. Do not add global navigation interception or relax sandbox permissions.
