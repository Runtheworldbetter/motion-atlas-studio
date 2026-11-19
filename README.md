# Motion Atlas

An open-source workbench for interactive explanations, visual experiments, music, and editable animations, built by RTWB. Change an input, inspect a mechanism, follow a model, or make something you can hear.

Version 0.5.1 restores the original **Editor → Collection** presentation, followed by **15 explorable studies** and a **Music Lab with six experiments**. The existing **50 gallery examples**, **seven editable recipes**, players, and coaching tools are unchanged. The repertoire spans stories, systems, AI, probability, physics, materials, data, and sports.

**[Open Motion Atlas](https://runtheworldbetter.github.io/motion-atlas-studio/) · [Read the Atlas docs](https://runtheworldbetter.github.io/motion-atlas-studio/docs/) · [Browse the source](https://github.com/Runtheworldbetter/motion-atlas-studio)**

[Explore the studies](https://runtheworldbetter.github.io/motion-atlas-studio/#explore) · [Open Music Lab](https://runtheworldbetter.github.io/motion-atlas-studio/#music-lab) · [Browse the collection](https://runtheworldbetter.github.io/motion-atlas-studio/#collection) · [Input formats](docs/recipes.md) · [Contributing](CONTRIBUTING.md)

## New in 0.5.1

The Editor and Collection come first again. Explore and Music Lab follow the original collection. Music Lab keeps its three Atlas experiments and adds three self-hosted Chrome Music Lab originals: **Harmonics**, **Strings**, and **Sound Waves**. Source labels distinguish the two sets.

Three studies from the earlier New Directions prototype return with their original illustrations and interactions: **Correct one assumption**, **Follow the same object**, and **Words that take shape**. They bring the exploration collection to 15 studies.

The spacecraft study has been removed. Raj Shekhar's original Voyager experience is not included because an applicable reuse or embedding grant could not be verified.

**Explore** is a searchable set of working studies. A card expands into an interactive detail view and returns to its place when closed. Category filters cover Stories, Systems, AI, Physics, and Materials. **Can suggest repairs** is a capability filter: it finds studies that can propose a change for review. It currently selects the local-rule repair study.

| Area | New studies |
| --- | --- |
| Stories | [Correct one assumption](https://runtheworldbetter.github.io/motion-atlas-studio/#explore/correction); [Follow the same object](https://runtheworldbetter.github.io/motion-atlas-studio/#explore/continuity); [Words that take shape](https://runtheworldbetter.github.io/motion-atlas-studio/#explore/typography); [Slides become places](https://runtheworldbetter.github.io/motion-atlas-studio/#explore/slide-canvas); [Feel the rearrangement](https://runtheworldbetter.github.io/motion-atlas-studio/#explore/springs) |
| Systems | [Events change the state](https://runtheworldbetter.github.io/motion-atlas-studio/#explore/state-machine); [Suggest a repair](https://runtheworldbetter.github.io/motion-atlas-studio/#explore/repair); [Find the relevant neighborhood](https://runtheworldbetter.github.io/motion-atlas-studio/#explore/neighborhood); [Edit the probabilities](https://runtheworldbetter.github.io/motion-atlas-studio/#explore/markov) |
| AI & probability | [Follow a classification](https://runtheworldbetter.github.io/motion-atlas-studio/#explore/classification); [Inspect attention](https://runtheworldbetter.github.io/motion-atlas-studio/#explore/transformer); [Expectation meets a sample](https://runtheworldbetter.github.io/motion-atlas-studio/#explore/probability) |
| Physics | [Inside a gear train](https://runtheworldbetter.github.io/motion-atlas-studio/#explore/gears); [Change the launch](https://runtheworldbetter.github.io/motion-atlas-studio/#explore/projectile) |
| Materials | [Shape a material](https://runtheworldbetter.github.io/motion-atlas-studio/#explore/shaders) |

The 15 studies are original Atlas adaptations of interaction and teaching ideas from projects including R2D3, Stately, Distill, Sigma, Setosa, React Flow, Transformer Explainer, Seeing Theory, and Paper Shaders. Each study includes **Model, source and inspiration** notes. Those study references are inspiration links. The three separately labelled Chrome Music Lab originals do include upstream code and assets under their retained licenses; see [their provenance and notices](docs/upstream-music-lab.md).

Use **Download frame** for the current SVG illustration, or a PNG for the material study. The material renders with WebGL, with a Canvas 2D fallback when WebGL is unavailable; its controls and PNG export work with either renderer. **Download data** saves the current study state as JSON. **Copy link** opens the same study; edited controls are not serialized into the link. [The exploration guide](docs/explorations.md) covers every study, the calculations, exports, and model boundaries.

Mechanism and trajectory diagrams show the whole figure on narrow screens; **Enlarge to read labels** opens a locally scrolling detail view. With reduced motion enabled, explicitly started gear, projectile, and material playback advances at four updates per second; you can also scrub directly to a moment.

## Music Lab

[Music Lab](https://runtheworldbetter.github.io/motion-atlas-studio/#music-lab) has six tabs sharing one active experiment surface:

| Tab | Source | Try it |
| --- | --- | --- |
| Sound & spectrum | Atlas | Change pitch and wave shape while a live waveform and spectrogram show the generated sound. |
| Build a timbre | Atlas | Adjust eight harmonic amplitudes and hear how their sum changes the sound. |
| Make a melody | Atlas | Compose on an 8- or 16-step, five-pitch grid; change tempo and timbre, and play once or loop. |
| Harmonics | Chrome Music Lab original | Press or touch a vertical harmonic to see and hear one of six related frequencies. |
| Strings | Chrome Music Lab original | Pluck strings of different lengths and hear the original harp samples. |
| Sound Waves | Chrome Music Lab original | Play the onscreen piano to drive the blue particle field; zoom in to inspect one particle. |

Atlas sound begins when you press Play; the originals unlock audio on a pointer, touch, or key gesture and use their own instrument controls. Switching experiments or hiding the page stops audio. An original is unloaded when switched away from or hidden, and restarts when you return. The Atlas melody tab retains **Save JSON**, **Import JSON**, and **Save WAV** for one complete pattern cycle. Save JSON before leaving if you want to keep your composition. These exports and keyboard composition controls belong to Make a melody, not the upstream originals. No microphone or account is required. [Music controls and file format](docs/explorations.md#music-lab).

The Chrome Music Lab originals are served from this site's own files, with no external runtime requests. They preserve the upstream experiments and use Chrome Music Lab revision `e54bb414908da2b6286a6ad6431a5fcf8b68dc3f`, under Apache-2.0 with third-party notices retained. [Upstream provenance, integration changes, and licenses](docs/upstream-music-lab.md).

**Sound Waves requires WebGL.** If it is unavailable, the experiment shows an availability message with links to the original and its source. Atlas keeps the original renderer; it does not substitute a simplified particle animation. The material study's Canvas 2D fallback is separate.

## Use the editor

The **Collection** retains its 50 gallery examples across Math & nature, Systems & AI, Data stories, Motion craft, and Sports & coaching. Play, pause, replay, scrub, and change speed. Upvote scenes you like, downvote those you don't, and add notes. Votes and notes are saved on your device.

The **Editor** retains these seven recipes, each with examples you can edit:

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

Exploration controls generally last for the current open study. The Markov study also saves its matrix, random seed, and path position in local storage; **Reset all** restores its defaults. Downloaded study JSON is an inspectable snapshot, with no general study-import control in this release. Melody JSON has its own validated import/export controls; Music Lab compositions are not automatically persisted across reloads.

Supplied business data, coaching illustrations, and AI examples are synthetic. Mathematical scenes and algorithm traces describe the calculation they use. The repair study uses explicit local rules and a visible stencil; the attention study uses a small hand-set model. Their model notes explain what each demonstration represents.

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
#explore
#explore/repair
#explore/transformer
#music-lab
```

Exploration fragments open a study directly in its detail view. Escape or the close button returns to Explore. Music Lab's section link opens the lab; its six tabs are selected inside that section. Study links identify an example, while downloads preserve its current data.

Publish updates with **Actions → Deploy to GitHub Pages → Run workflow** on the default branch. Deployment is manual; pushes and pull requests run CI. For a fork, first enable Pages with GitHub Actions in the repository settings. [Hosting and embeds](docs/hosting.md) has setup instructions and an iframe example.

## Source map

| Location | Purpose |
| --- | --- |
| `src/` | Gallery, recipe editor, local preferences, downloads, and share controls |
| `src/labs/` | Explorable study cards and detail views, interactive studies, and Music Lab |
| `src/labs/restored/` | The original New Directions correction, reading-collection, and typography modules |
| `lib/explorations/catalog.ts` | The 15 studies, categories, capability flags, model notes, and inspiration links |
| `lib/explorations/` | Pure study models, seeded experiments, mechanics, and music/WAV helpers |
| `lib/motion/` | Motion Canvas runtime, palette, and the 50 gallery scenes |
| `lib/recipes/` | Recipe definitions, presets, pure input models, and animation factories |
| `tests/` | Input validation and algorithm/model checks |
| `scripts/` | Dependency notices and downloadable source packaging |
| `public/` | Browser-readable Atlas documentation, static assets, and full third-party notices |
| `public/vendor/chrome-music-lab/` | Three self-hosted original experiments and their retained upstream notices |
| `docs/` | Guides, input formats, privacy, hosting, and attribution details |

## Versions and attribution

This guide covers **0.5.1**. Direct runtime dependencies are Motion Canvas core/2d **3.17.2**, React/React DOM **19.2.6**, and Lucide React **1.31.0**. The build uses Vite **8.0.13** and TypeScript **5.9.3**; `package.json` and `package-lock.json` are the authoritative version records. The studies add no packages. The original music experiments are vendored static applications with their own dependency notices.

[Motion Canvas](https://github.com/motion-canvas/motion-canvas) powers the editable animation recipes and gallery scenes. The complete-stroke coaching inspector and most new studies use React and SVG; the material study uses WebGL with a Canvas 2D fallback. Music Lab uses Web Audio, Canvas, and the original Sound Waves WebGL renderer. Atlas owns the surrounding editor, input models, controls, examples, and documentation. Thank you to the Motion Canvas creators and contributors; its [documentation](https://motioncanvas.io/docs/) explains the underlying engine.

Atlas-authored code and examples use the [MIT license](LICENSE). The three Chrome Music Lab originals retain Apache-2.0 and their included third-party licenses; Atlas's MIT license does not replace them. See [upstream music provenance and notices](docs/upstream-music-lab.md), [dependency notices](public/third-party-notices.txt), and [attribution](docs/attribution.md).
