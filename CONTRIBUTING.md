# Contributing to Motion Atlas

Useful contributions make an idea easier to understand: a clearer animation, a well-scoped recipe, a better explanation of its data, or a fix that makes the editor usable by more people.

## Start with a small, reviewable change

Describe the problem and expected behavior in an issue or pull request. For a new recipe, include a short input example and explain why animation helps. Follow [README](README.md) for local setup, then run:

```sh
npm test
npm run typecheck
node scripts/generate-notices.mjs --check
npm run build
```

Include the relevant validation result and a screenshot or short recording when the visible behavior changes. A passing build does not establish that an explanation is accurate or that a scene is readable.

## Inputs and evidence

Keep parsing and model calculations independent of Motion Canvas so they can be tested without a browser. Validate shape, bounds, finite numbers, string lengths, and resource limits before creating a scene. Show actionable input errors and retain a usable previous preview when validation fails. Treat uploaded code as text; do not add evaluation of arbitrary JavaScript or Python.

Each recipe should say whether its output is computed from input, mathematically constructed, or illustrative. Show the quantities behind a chart in text as well as in motion. Preserve units, sign, order, and totals. Add a meaningful test when a change could alter a calculation or reject/accept the wrong input; test an edge case or an independently known result rather than repeating the implementation.

Use synthetic examples or data you have permission to redistribute. Identify synthetic examples in the interface and documentation. Do not present a staged agent trace as an actual execution log, an authored probability as a model prediction, or a simulated change as a measured business result. Include sources and transformation notes for any real public dataset.

## Animation and accessibility

Keep scenes finite, with sensible start/end states, readable labels, and controls that work at different playback speeds. Verify pause, replay, scrubbing, and reduced-motion behavior. Check keyboard navigation and visible focus, labels on icon buttons, readable contrast, and a narrow viewport. Use text, shape, or labels in addition to color. An equivalent text/table explanation is especially useful for recipes whose meaning would otherwise exist only in a canvas.

Avoid gratuitous flashes and constant animation outside visible previews. Keep input processing bounded and check that a large but valid example remains responsive. A new scene should not keep rendering after its player is closed.

## Local data and sharing

The public app's preferences are local to a browser, and recipe drafts are local to the page. Keep share links limited to scene/preset selection. Do not place custom input or notes in URLs, analytics events, remote requests, or logs. If a proposed feature changes this behavior, explain the concrete storage and sharing behavior before implementing it and update the privacy documentation and visible UI together.

Downloads must include only the material the visitor chose to export. Source/project archives must not pick up local environment files, credentials, browser preferences, dependency folders, or private hosting configuration.

## Attribution and dependencies

Contribute only code, data, fonts, and media you are allowed to distribute. Keep upstream copyright and license notices with copied material. Motion Atlas contributions use the repository's MIT license; existing dependencies keep their own terms.

Prefer the existing small dependency set. If a dependency is necessary, update the lockfile and run:

```sh
node scripts/generate-notices.mjs
node scripts/generate-notices.mjs --check
```

Review the resulting notices, including bundled `NOTICE` files. The generator deliberately fails on missing license text. Resolve gaps with a version-specific, documented upstream source in `docs/license-overrides.json`; do not invent copyright attribution or silently skip a package. See [Attribution](docs/attribution.md).
