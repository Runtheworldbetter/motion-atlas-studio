# Motion Atlas

**Turn an idea into an animated explanation, then make it your own.** Motion Atlas is an RTWB project built with [Motion Canvas](https://motioncanvas.io/): 48 gallery experiments and five editable recipes that turn structured input into motion.

[Open Motion Atlas](https://motion-atlas-studio.aarjavtrivedi.chatgpt.site/) · [Source on GitHub](https://github.com/Runtheworldbetter/motion-atlas-studio) · [Input formats](docs/recipes.md) · [Contributing](CONTRIBUTING.md)

## Explore and make

The gallery covers Math & nature, Systems & AI, Data stories, and Motion craft, with 12 scenes in each collection. Play, pause, replay, scrub, and change speed. Upvote scenes you want more of, downvote those you want less of, and add a note about what worked. These reactions describe **your preferences on this device**; they are not public popularity totals.

Five recipes offer several presets and accept your own input:

| Recipe | Input | What it explains |
| --- | --- | --- |
| Trace | JSON events | Who did what, when, including handoffs and corrections |
| Waterfall | CSV contributions | How positive and negative changes produce a total |
| Before / after | Two text or code snippets | A change that is easier to follow when it unfolds |
| Fourier | JSON harmonic terms | How simple rotating components combine into a wave |
| Pathfinding | An ASCII maze | How breadth-first search explores and finds a route |

Choose a preset, edit or open a local file, and apply the input to rebuild the animation. Inputs are parsed and validated in the browser. Text/code examples are displayed as text, never executed. [Recipe documentation](docs/recipes.md) describes formats, limits, and the basis of each animation.

Share a scene link or embed a focused preview. Links select a gallery scene or a recipe preset; they do **not** contain your edited input. Download input to keep a draft, or download a project ZIP to continue editing locally. The project download includes the app source with your recipe input as its initial example. You can also save the current animation frame as a PNG image. There is no rendered-video export in the browser app.

## Your data

Favorites, downvotes, and notes stay in this browser's local storage. Export/import lets you move your preference collection, and the clear-preferences control removes it from this browser. There is no login, preference server, or cross-device synchronization.

Recipe drafts stay in memory while the page is open. Save an input or project download before reloading or closing the tab. Opening a file reads it locally; the app does not upload its contents. Browser storage and downloads are separate: clearing one does not delete the other. See [Data and privacy](docs/privacy.md).

All supplied business datasets, model activations, token probabilities, and outcomes are illustrative. Mathematical constructions and algorithm traces state their basis. This is a collection of animation examples, not a measured customer-results dashboard or a trained AI system.

## Run locally

Use Node.js **22.13 or newer** and npm. The lockfile pins the dependency graph; no environment variables, API keys, accounts, or database are required.

```sh
git clone https://github.com/Runtheworldbetter/motion-atlas-studio.git
cd motion-atlas-studio
npm ci
npm run dev
```

Open the local URL printed by Vite. A downloaded source/project ZIP works the same way after extracting it and entering the project folder; omit the clone step.

```sh
npm test
npm run typecheck
node scripts/generate-notices.mjs --check
npm run build
npm run preview
```

The build creates the static site in `dist/` and a downloadable source archive. Preview serves that build locally. To refresh dependency notices after changing the lockfile, run `node scripts/generate-notices.mjs` and commit the updated notice file. The check command fails if notices are stale or license evidence is missing.

CI runs installation, parser/model tests, TypeScript, notice verification, and the production build. It needs no deployment credentials. These checks complement a browser review of animation, keyboard use, and small-screen layout.

## Share and host

Motion Atlas is a static Vite app. Serve the contents of `dist/` on a static host, including under a subdirectory; `vite.config.ts` uses a relative base. A standalone subdomain is a convenient way to add it to an existing RTWB website. Link to it from the main site or use an iframe for a selected scene.

```text
?scene=parametric-knot
?recipe=trace&example=human-correction
?scene=parametric-knot&embed=1
```

The optional **Deploy to GitHub Pages** workflow is manual. Enable Pages with GitHub Actions in the repository settings, then run the workflow for the default branch. Ordinary pushes and pull requests only run CI; they do not publish a site. [Hosting and embeds](docs/hosting.md) includes the workflow setup and an iframe example.

## Source map

| Location | Purpose |
| --- | --- |
| `src/` | Gallery, recipe editor, local preferences, downloads, and share controls |
| `lib/motion/` | Motion Canvas runtime, palette, and the 48 gallery scenes |
| `lib/recipes/` | Recipe definitions, presets, pure input models, and animation factories |
| `tests/` | Input validation and algorithm/model checks |
| `scripts/` | Dependency notices and downloadable source packaging |
| `public/` | Static assets and full third-party notices |
| `docs/` | Input formats, privacy, hosting, and attribution details |

## Versions and attribution

The public app is version **0.2.0**. Direct runtime dependencies are Motion Canvas core/2d **3.17.2**, React/React DOM **19.2.6**, and Lucide React **1.31.0**. The build uses Vite **8.0.13** and TypeScript **5.9.3**; `package.json` and `package-lock.json` are the authoritative version records.

Motion Atlas is an independent RTWB project. Motion Canvas provides the animation engine; this repository contains the gallery, recipes, and application around it. See the [Motion Canvas source](https://github.com/motion-canvas/motion-canvas) and [documentation](https://motioncanvas.io/docs/).

Motion Atlas authored code and supplied examples are available under the [MIT license](LICENSE). Dependencies retain their own licenses and attribution, reproduced in [third-party notices](public/third-party-notices.txt). [Attribution and notice maintenance](docs/attribution.md) explains the notice scope and provenance checks.
