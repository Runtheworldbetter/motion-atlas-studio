# Motion Atlas

## Built with [Motion Canvas](https://github.com/motion-canvas/motion-canvas)

Motion Canvas is the open source animation engine used throughout Motion Atlas. Thank you to its creators and contributors. Visit the [Motion Canvas website](https://motioncanvas.io/) and [documentation](https://motioncanvas.io/docs/) to use it in your own projects.

RTWB maintains this browser editor, its seven editable recipes, and 50 gallery examples. The recipes cover cricket coaching, policy-gradient updates, event traces, waterfalls, code diffs, waveforms, and pathfinding.

[Open Motion Atlas](https://runtheworldbetter.github.io/motion-atlas-studio/) · [Source on GitHub](https://github.com/Runtheworldbetter/motion-atlas-studio) · [Input formats](docs/recipes.md) · [Contributing](CONTRIBUTING.md)

## Use the editor

The gallery covers Math & nature, Systems & AI, Data stories, Motion craft, and Sports & coaching. Play, pause, replay, scrub, and change speed. Upvote scenes you like, downvote those you don't, and add notes. Votes and notes are saved on your device.

Each recipe starts with an example you can edit:

| Recipe | Input | What it explains |
| --- | --- | --- |
| Cricket | JSON pose keyframes | Left/right batting modes, labeled hands and feet, and a two-hand close-up |
| Post-training | JSON probabilities and reward scores | How a supplied scoring rule changes a small policy |
| Trace | JSON events | Who did what, when, including handoffs and corrections |
| Waterfall | CSV contributions | How positive and negative changes produce a total |
| Code diff | Two text or code snippets | Which lines changed |
| Fourier | JSON harmonic terms | How simple rotating components combine into a wave |
| Pathfinding | An ASCII maze | How breadth-first search explores and finds a route |

Choose an example, edit it or open a local file, then select **Render changes**. Inputs are checked in the browser. Code examples are displayed as text and never executed. [Recipe documentation](docs/recipes.md) describes the formats, limits, and calculations.

Cricket and Post-training have stage buttons. Select a stage to pause at that point, then scrub or play from there. These two explanations hold their final frame when playback ends. Cricket uses constructed poses; Post-training computes each probability update from the supplied reward scores. The **Inspect values** tab shows the underlying numbers.

Cricket has **Left-handed** and **Right-handed** controls and a separate **Flip camera view** option. Hand and foot labels follow the selected batter. Changing modes preserves the current frame, playback speed, and edited poses. Recipe share links, embeds, and downloads retain the batting mode and camera direction.

Share a link or embed a gallery scene or recipe preset. To keep or share your edits, download the input or a project ZIP. The ZIP contains the app source and opens with your edited input. You can also save the current frame as a PNG image.

## Your data

Votes and notes stay in this browser's local storage. Use export/import to move them to another browser or device, or clear them with the clear-preferences control.

Recipe drafts stay in memory while the page is open. Download the input or project before reloading or closing the tab. Opened files are read locally and stay in your browser. Downloaded files remain on your device after you clear browser storage. See [Data and privacy](docs/privacy.md).

Supplied business data and AI examples are synthetic. Mathematical scenes and algorithm traces describe the calculation they use.

## Run locally

Use Node.js **22.13 or newer** and npm. The lockfile pins dependencies. No API keys or database setup are needed.

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

CI installs dependencies, runs parser/model tests, checks TypeScript and license notices, and builds the app. Also review animation, keyboard controls, and small-screen layout in a browser.

## Share and host

The public app is hosted on [GitHub Pages](https://runtheworldbetter.github.io/motion-atlas-studio/). You can link to it or embed it in an existing website, including a WordPress page. To host your own copy, serve `dist/` on a static host. The relative base in `vite.config.ts` supports a domain root or a path such as `/tools/motion-atlas/`.

```text
?scene=parametric-knot
?recipe=trace&example=human-correction
?recipe=cricket
?recipe=post-training
?scene=parametric-knot&embed=1
```

Publish updates with **Actions → Deploy to GitHub Pages → Run workflow** on the default branch. Deployment is manual; pushes and pull requests run CI. For a fork, first enable Pages with GitHub Actions in the repository settings. [Hosting and embeds](docs/hosting.md) has setup instructions and an iframe example.

## Source map

| Location | Purpose |
| --- | --- |
| `src/` | Gallery, recipe editor, local preferences, downloads, and share controls |
| `lib/motion/` | Motion Canvas runtime, palette, and the 50 gallery scenes |
| `lib/recipes/` | Recipe definitions, presets, pure input models, and animation factories |
| `tests/` | Input validation and algorithm/model checks |
| `scripts/` | Dependency notices and downloadable source packaging |
| `public/` | Static assets and full third-party notices |
| `docs/` | Input formats, privacy, hosting, and attribution details |

## Versions and attribution

The public app is version **0.3.0**. Direct runtime dependencies are Motion Canvas core/2d **3.17.2**, React/React DOM **19.2.6**, and Lucide React **1.31.0**. The build uses Vite **8.0.13** and TypeScript **5.9.3**; `package.json` and `package-lock.json` are the authoritative version records.

Motion Atlas code and examples use the [MIT license](LICENSE). Dependency licenses and attribution are included in [third-party notices](public/third-party-notices.txt). [Attribution](docs/attribution.md) explains how those notices are collected and checked.
