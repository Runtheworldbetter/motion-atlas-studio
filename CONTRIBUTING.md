# Contributing to Motion Atlas

Contributions can improve an animation, add a recipe, explain its data, or fix the editor.

## Submit a change

Describe the problem and expected behavior in an issue or pull request. For a new recipe, include a short input example and explain why animation helps. Follow [README](README.md) for local setup, then run:

```sh
npm test
npm run typecheck
node scripts/generate-notices.mjs --check
npm run build
```

Include relevant test results and a screenshot or short recording when the visible behavior changes. Check the explanation's accuracy and the scene's readability in a browser.

## Inputs and evidence

Keep parsing and calculations independent of Motion Canvas so they can be tested without a browser. Check the input format, numeric bounds, string lengths, and resource limits before creating a scene. Error messages should explain how to fix the input. Keep the previous preview when validation fails. Handle opened code files as text; never execute them.

Each recipe should describe its calculation or label its data as illustrative. Show chart values in a text or table view. Preserve units, signs, order, and totals. Add tests when a change affects calculations or input validation, using edge cases or independently known results.

Use synthetic examples or data you have permission to redistribute. Label synthetic examples in the interface and documentation, including staged agent traces, invented probabilities, and simulated business results. Include sources and transformation notes for real public datasets.

## Animation and accessibility

Give scenes clear start and end states, readable labels, and controls that work at different playback speeds. Check pause, replay, scrubbing, reduced motion, keyboard navigation, visible focus, icon-button labels, contrast, and a narrow viewport. Use text or shape alongside color, and provide a text or table explanation of the calculation.

Avoid flashes, pause offscreen previews, and stop rendering when a player closes. Keep input processing bounded and check that the largest valid example remains responsive.

## Local data and sharing

Votes and notes are saved in the browser; recipe drafts stay in the open page. Share links contain only scene or preset selections. Keep custom input and notes out of URLs, analytics events, remote requests, and logs. If a feature changes where data is stored or sent, explain the change before implementing it and update the interface and privacy documentation.

Downloads must include only the material the visitor chose to export. Exclude environment files, credentials, browser preferences, dependency folders, and private hosting configuration from source/project archives.

## Attribution and dependencies

Contribute only code, data, fonts, and media you are allowed to distribute. Keep upstream copyright and license notices with copied material. Motion Atlas contributions use the repository's MIT license; existing dependencies keep their own terms.

Prefer the existing small dependency set. If a dependency is necessary, update the lockfile and run:

```sh
node scripts/generate-notices.mjs
node scripts/generate-notices.mjs --check
```

Review the resulting notices, including bundled `NOTICE` files. Missing license text fails the check. Resolve gaps using an upstream source for the exact package version, recorded in `docs/license-overrides.json`. See [Attribution](docs/attribution.md).
