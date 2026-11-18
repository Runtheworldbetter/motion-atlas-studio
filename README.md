# Motion Atlas

An open-source collection and editor for interactive visual explanations, built by RTWB. Explore 50 examples across AI, data, mathematics, systems, and sports, then adapt them or build your own.

**[Open Motion Atlas](https://runtheworldbetter.github.io/motion-atlas-studio/) · [Read the Atlas docs](https://runtheworldbetter.github.io/motion-atlas-studio/docs/) · [Browse the source](https://github.com/Runtheworldbetter/motion-atlas-studio)**

[Cricket: complete straight drive](https://runtheworldbetter.github.io/motion-atlas-studio/?recipe=cricket&example=full-stroke#studio) · [AI: see what reward teaches](https://runtheworldbetter.github.io/motion-atlas-studio/?recipe=post-training#studio) · [Input formats](docs/recipes.md) · [Contributing](CONTRIBUTING.md)

## New in 0.4.0

The cricket inspector plays a complete straight drive with continuous movement through its checkpoints. Switch between side and bowler-end views, choose left-handed, right-handed, or a comparison, and keep the same point in the stroke. The top arm and hand are blue, the bottom arm and hand orange, and the bat gold. Numbered bat imprints mark backlift, contact, and extension.

The website now puts **Motion Atlas on GitHub** and **Motion Atlas docs** at the front. The documentation covers the complete project, including the Motion Canvas engine used for the editable recipes and the SVG renderer used for the stroke inspector.

## Use the editor

The gallery covers Math & nature, Systems & AI, Data stories, Motion craft, and Sports & coaching. Play, pause, replay, scrub, and change speed. Upvote scenes you like, downvote those you don't, and add notes. Votes and notes are saved on your device.

Each recipe starts with an example you can edit:

| Recipe | Input | What it explains |
| --- | --- | --- |
| Cricket | Complete-stroke inspector and editable JSON pose studies | Full-stroke playback, two cameras, handedness, and numbered bat imprints |
| Post-training | JSON probabilities and reward scores | How a supplied scoring rule changes a small policy |
| Trace | JSON events | Who did what, when, including handoffs and corrections |
| Waterfall | CSV contributions | How positive and negative changes produce a total |
| Code diff | Two text or code snippets | Which lines changed |
| Fourier | JSON harmonic terms | How simple rotating components combine into a wave |
| Pathfinding | An ASCII maze | How breadth-first search explores and finds a route |

Choose an example, edit it or open a local file, then select **Render changes**. Inputs are checked in the browser. Code examples are displayed as text and never executed. [Recipe documentation](docs/recipes.md) describes the formats, limits, and calculations.

Cricket and Post-training have stage buttons. Select a stage to pause at that point, then scrub or play from there. These two explanations hold their final frame when playback ends. Cricket uses constructed poses; Post-training computes each probability update from the supplied reward scores. The **Inspect values** tab shows the underlying numbers.

The default cricket view, **Complete straight drive**, includes **Side view**, **Bowler’s view**, and a handedness comparison. **Play full stroke** follows the whole movement; the timeline and named checkpoints let you inspect it. [Cricket guide](docs/cricket.md) explains the colors, imprints, views, and teaching limits.

Choose **Custom keyframes** to edit the additional four-pose cricket presets through JSON. They have **Left-handed** and **Right-handed** controls and a separate **Flip camera view** option. Hand and foot labels follow the selected batter. Changing modes preserves the current frame, playback speed, and edited poses. Recipe share links, embeds, and downloads retain these view settings.

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
| `public/` | Browser-readable Atlas documentation, static assets, and full third-party notices |
| `docs/` | Guides, input formats, privacy, hosting, and attribution details |

## Versions and attribution

The public app is version **0.4.0**. Direct runtime dependencies are Motion Canvas core/2d **3.17.2**, React/React DOM **19.2.6**, and Lucide React **1.31.0**. The build uses Vite **8.0.13** and TypeScript **5.9.3**; `package.json` and `package-lock.json` are the authoritative version records.

[Motion Canvas](https://github.com/motion-canvas/motion-canvas) powers the editable animation recipes and gallery scenes. The complete-stroke coaching inspector uses React and SVG with a shared pose model. Atlas owns the surrounding editor, input models, controls, examples, and documentation. Thank you to the Motion Canvas creators and contributors; its [documentation](https://motioncanvas.io/docs/) explains the underlying engine.

Motion Atlas code and examples use the [MIT license](LICENSE). Dependency licenses and attribution are included in [third-party notices](public/third-party-notices.txt). [Attribution](docs/attribution.md) explains how those notices are collected and checked.
