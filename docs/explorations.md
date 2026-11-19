# Explorations and Music Lab

**[Open Explore](https://runtheworldbetter.github.io/motion-atlas-studio/#explore) · [Open Music Lab](https://runtheworldbetter.github.io/motion-atlas-studio/#music-lab) · [All Atlas guides](README.md)**

Version 0.5.1 has 15 working studies and a six-experiment Music Lab. They extend Atlas's visual vocabulary across stories, systems, AI, probability, physics, and materials. The original Editor → Collection presentation comes first, followed by Explore and Music Lab. The existing 50 gallery examples, seven recipes, players, and coaching tools are unchanged.

**Correct one assumption**, **Follow the same object**, and **Words that take shape** restore the original illustrations and interactions from the earlier New Directions prototype. Their venue note, book collection, and word sequence are fictional or illustrative examples.

## Open and explore a study

1. Open **Explore**. Filter by Stories, Systems, AI, Physics, or Materials, or search for a title, description, or inspiration.
2. Select a card. It expands from its place into a detail view. Close it with the close button or Escape to return; the interaction respects reduced-motion preferences.
3. Change inputs, select components, or start playback using the study's controls. Playback and the state-machine clock begin only when requested.
4. Open **Model, source and inspiration** to inspect the model's basis, read its Atlas source, or visit the independent project that inspired the interaction.
5. Use **Download frame**, **Download data**, or **Copy link** at the bottom of the detail view.

Keyboard controls are provided alongside pointer interactions. For example, the spatial story supports left/right navigation and Home for its overview; the spring study provides Move up/Move down controls; the repair grid uses arrows and Enter; and graph nodes and Markov transitions can be selected by keyboard. Mechanism and trajectory diagrams initially show the whole figure on narrow screens. Choose **Enlarge to read labels** for a locally scrolling detail view; **Show whole diagram** returns to the overview. Other dense diagrams also scroll locally. With reduced motion enabled, explicitly started gear, projectile, and material playback advances at four updates per second. Scrubbing still selects a precise moment.

## The 15 studies

| Study | Try this | Model and interpretation |
| --- | --- | --- |
| [Correct one assumption](https://runtheworldbetter.github.io/motion-atlas-studio/#explore/correction) · Stories | Review the fictional evidence, correct the opening date, and compare Original, Corrected, and Compare views. Step through five checkpoints or replay the whole sequence. | Explicit dependency rules change only the actions that depend on the opening date. An unrelated Tuesday action stays fixed. Grey imprints are labelled; this is an authored cause-and-consequence example, not a live planning system. |
| [Follow the same object](https://runtheworldbetter.github.io/motion-atlas-studio/#explore/continuity) · Stories | Select a book and follow it through Shelf, Themes, and Reading time. Replay or scrub between the layouts. | Twelve fictional books and illustrative reading hours retain stable identities and selection while the layout changes. The example does not contain personal reading records. |
| [Words that take shape](https://runtheworldbetter.github.io/motion-atlas-studio/#explore/typography) · Stories | Follow five inputs as their words become SHARED CONTEXT, then CLEAR ACTION. Inspect four checkpoints or play the 14-second sequence. | Original SVG typography illustrates a thought taking shape. Words and motion express a narrative, not measured data or a computed assessment. |
| [Follow a classification](https://runtheworldbetter.github.io/motion-atlas-studio/#explore/classification) · AI | Follow the same observations through features, a threshold rule, a tree, and held-out predictions. Select an observation and keep track of it. | Fixed synthetic data and a one-feature decision stump. The fitted threshold uses training labels. Tuning after inspecting test results makes that score exploratory. |
| [Slides become places](https://runtheworldbetter.github.io/motion-atlas-studio/#explore/slide-canvas) · Stories | Enter a slide, follow the six-part sequence, pan the background, then show the entire story. | An original spatial presentation with an animated camera. It demonstrates a narrative interaction; it does not import slide decks. |
| [Events change the state](https://runtheworldbetter.github.io/motion-atlas-studio/#explore/state-machine) · Systems | Submit without a source, then attach one. Try verification, failure, retry, timeout, and cancellation. | An explicit state machine. Submission requires a source; retries have a three-attempt budget; checking times out after five simulated seconds. Advance time manually or start the clock. |
| [Suggest a repair](https://runtheworldbetter.github.io/motion-atlas-studio/#explore/repair) · Systems | Grow a stencil from its seed, remove cells, propose repairs, inspect support, and apply only the suggestions you select. | A deterministic local-rule model with a known stencil. Support is a neighbour count, not a learned probability. See the repair workflow below. |
| [Find the relevant neighborhood](https://runtheworldbetter.github.io/motion-atlas-studio/#explore/neighborhood) · Systems | Search the fictional ecosystem, select a node, and switch between one and two hops. Select a relationship to read its explanation. | An original, undirected graph. Unrelated nodes dim while labels remain visible; a hop is one edge. |
| [Edit the probabilities](https://runtheworldbetter.github.io/motion-atlas-studio/#explore/markov) · Systems | Change a matrix cell, inspect its matching edge, and replay a path with a fixed random seed. | A computed three-state Markov process. Rows sum to one. Exact probabilities describe all possible paths; displayed visits describe the single seeded path. |
| [Inside a gear train](https://runtheworldbetter.github.io/motion-atlas-studio/#explore/gears) · Physics | Play or scrub the rotation, separate the gears, and select the input, idler, or output. | Idealized 12-, 24-, and 36-tooth gears with equal pitch and a computed 3:1 reduction. Separated parts retain the motion they would have when engaged. |
| [Inspect attention](https://runtheworldbetter.github.io/motion-atlas-studio/#explore/transformer) · AI | Choose a query token and follow queries, keys, the causal mask, attention weights, mixed values, and output probabilities. | A small hand-set attention model with visible calculations. It has no trained GPT-2 weights or full language-model architecture. The output bars illustrate a calculation, not useful language prediction. |
| [Change the launch](https://runtheworldbetter.github.io/motion-atlas-studio/#explore/projectile) · Physics | Drag the initial velocity, adjust controls, and keep the labelled previous trajectory for comparison. | Ideal projectile motion on level ground with constant gravity and no air resistance. Range, height, and flight time are calculated. |
| [Feel the rearrangement](https://runtheworldbetter.github.io/motion-atlas-studio/#explore/springs) · Stories | Drag cards, or use Move up/Move down. Change stiffness and damping and inspect the response curve. | An original unit-mass spring model with exact damped motion. The primary frame export is its response chart. |
| [Expectation meets a sample](https://runtheworldbetter.github.io/motion-atlas-studio/#explore/probability) · AI | Change a coin's bias, collect seeded flips, and compare complete batches of ten with an exact binomial distribution. | Independent Bernoulli trials with a fixed probability. A finite sample need not match expectation. The histogram excludes incomplete batches. |
| [Shape a material](https://runtheworldbetter.github.io/motion-atlas-studio/#explore/shaders) · Materials | Switch among waves, metaballs, and warp; change shape and grain; scrub or freeze time. | Original material functions render with WebGL, with a Canvas 2D fallback when WebGL is unavailable. Controls and PNG export work with either renderer. These are graphic materials, not measured fields. |

## Repair is a capability

The **Can suggest repairs** checkbox filters by a capability recorded in `lib/explorations/catalog.ts`. It is separate from a study's category. In this release, **Suggest a repair** is the study with `capabilities.suggestRepairs: true`; future studies can advertise the same capability when they genuinely propose reviewable changes.

The current repair workflow is deliberately inspectable:

1. **Start from seed** and use **Grow one step** or **Play growth**. An empty cell inside the visible stencil grows when at least one orthogonal neighbour is alive.
2. Remove live cells by tapping them, or choose **Make a gap**. Keyboard users can focus the grid, move with arrows, and press Enter. After damage, normal growth is disabled so repair approval controls the changes.
3. Choose **Propose repairs**. An empty stencil cell qualifies when at least two orthogonal neighbours are alive. Each candidate explains its support, such as 3 of 4 neighbours.
4. Select candidates individually. Nothing is pre-approved. **Apply selected** rechecks support against the current grid and changes only the selected valid cells.
5. Propose again to see whether the newly repaired cells provide support for another layer. Unsupported gaps stay empty until the rule is satisfied.

This adapts the idea of an interactive damage-and-regrowth demonstration. It does not reproduce Distill's trained neural cellular automaton. The known stencil and simple rules are visible parts of this example.

## Deep links and exports

### Open the right place

```text
#explore
#explore/correction
#explore/continuity
#explore/typography
#explore/classification
#explore/repair
#explore/transformer
#explore/shaders
#music-lab
```

For example, [open the repair study](https://runtheworldbetter.github.io/motion-atlas-studio/#explore/repair). A study fragment opens its detail view directly. **Copy link** copies that address. Closing returns to `#explore`; browser history can navigate study links.

Links identify a study; they do not encode its edited controls. The Music Lab section has one link, with its six tabs chosen within the page.

### Keep a frame or the state

| Control | Output | Scope |
| --- | --- | --- |
| Download frame · SVG studies | `.svg` | The primary illustration at the current moment, with its visible styling. |
| Download frame · material study | `.png` | The current material canvas frame, using either WebGL or the Canvas 2D fallback. |
| Download data | `.json` | Study ID, model basis, capabilities, and the study's current exported state. |
| Copy link | URL | The selected study, opened through its fragment. |
| Atlas Make a melody · Save JSON | `.json` | A melody pattern that can be imported in Make a melody. |
| Atlas Make a melody · Save WAV | `.wav` | One complete melody cycle rendered as audio. |

Exploration JSON uses `format: "motion-atlas-exploration-v1"` with `study`, `basis`, `capabilities`, and `state`. It is an inspectable snapshot for analysis or reuse in code. General restoration of study snapshots is not implemented in this release. Melody JSON uses its own validated, importable pattern format below.

Most study controls last while that study is open. The Markov study persists its matrix, seed, and path position in local storage and restores them without starting playback. **Reset all** restores its defaults. Atlas music compositions and controls are held in page memory; save the melody JSON before reloading or closing the tab. The upstream originals unload when you select another experiment or hide the page, and start fresh when you return.

## Music Lab

[Open Music Lab](https://runtheworldbetter.github.io/motion-atlas-studio/#music-lab). Six tabs share one active experiment surface, separate from the 15 study cards. **Sound & spectrum**, **Build a timbre**, and **Make a melody** are Atlas experiments. **Harmonics**, **Strings**, and **Sound Waves** are self-hosted Chrome Music Lab originals; their labels identify the upstream source.

Atlas audio starts with Play. The originals unlock audio on the first pointer, touch, or key gesture and use their original instrument controls. Switching experiments or hiding the page stops audio. For an upstream original, this unloads the embedded application; returning starts a fresh instance. No microphone or account is required.

### Sound & spectrum

Choose sine, triangle, square, or sawtooth; change pitch from 80 to 1,600 Hz; then press **Play sound**. The waveform and spectrogram show the generated audio while playing. Bright spectrogram bands indicate stronger frequency components; the vertical frequency axis is logarithmic. While stopped, the waveform is labelled as a model preview and the frequency history is paused.

Try 440 Hz, then switch from sine to square. Keep the fundamental frequency fixed and look for the added harmonic bands.

### Build a timbre

Choose a fundamental from 80 to 440 Hz and adjust eight harmonic amplitudes. Each component is an integer multiple of that fundamental. The component plot and combined wave update together; **Pure**, **Warm**, **Odd**, and **Bright** presets provide starting points. The summed waveform uses a shared bounded scale to avoid clipping.

Press **Play sound** to hear edits. The listening-level control affects playback. Switching experiments or hiding the page stops sound.

### Make a melody

Compose with five C-major-pentatonic pitches on an 8- or 16-step grid. Each column is half a beat. Choose 60–180 BPM, **Soft keys** or **Pure sine**, and a single cycle or **Loop**. Use **Rising notes**, **Offbeat**, or **Clear** as starting points.

Tap notes to toggle them. Keyboard users can move within the grid using arrow keys and Home/End, then use Space or Enter to toggle a note. The 16-step grid scrolls horizontally on small screens. Sound starts only with **Play pattern**; some timing changes stop the current run so you can restart from the beginning.

**Save JSON** preserves the composition. **Import JSON** validates and loads a pattern without starting sound. Imports must be smaller than 32 KB. The format is:

```json
{
  "version": 1,
  "bpm": 110,
  "steps": 8,
  "timbre": "soft",
  "notes": [
    [false, false, false, false, true, false, false, false],
    [false, false, false, true, false, true, false, false],
    [false, false, true, false, false, false, true, false],
    [false, true, false, false, false, false, false, true],
    [true, false, false, false, false, false, false, false]
  ]
}
```

The five rows are **A4, G4, E4, D4, C4**, in that order. Every row must contain exactly `steps` boolean values. Supported lengths are 8 and 16; `timbre` is `soft` or `sine`; BPM must be between 60 and 180.

**Save WAV** renders one complete cycle as mono, signed 16-bit PCM at 22,050 Hz. The export uses the current pattern, tempo, timbre, and listening level; looping does not lengthen the downloaded file. It is synthesized from the pattern rather than recorded from a microphone. If Web Audio is unavailable, the visual models and melody downloads still work.

### Three original Chrome Music Lab experiments

| Original | Interaction |
| --- | --- |
| Harmonics | Press and hold or touch a vertical harmonic to see and hear its overtone. The instrument presents six related frequencies. |
| Strings | Drag or pluck the original strings. Their lengths map to the original included harp samples. |
| Sound Waves | Play the onscreen piano to drive the blue particle field. Use the face/zoom control to inspect an individual particle's motion. |

These preserve the original visual designs, assets, and instrument interactions, with compatibility and local-packaging changes documented in [Upstream music provenance](upstream-music-lab.md). All runtime files are served from Atlas's own `vendor/chrome-music-lab/` directory; the experiments make no external runtime requests. They do not share Atlas's melody JSON/WAV exports or its keyboard composition controls.

**Sound Waves requires WebGL.** If the browser cannot provide it, an availability message links to the original hosted experiment and pinned source. Its original particle renderer is retained; there is no replacement animation. This differs from Atlas's material study, which has a Canvas 2D fallback. The legacy instruments are primarily pointer/touch experiences; their surrounding Atlas controls and attribution links are keyboard accessible.

The source is [Google Creative Lab's Chrome Music Lab](https://github.com/googlecreativelab/chrome-music-lab/tree/e54bb414908da2b6286a6ad6431a5fcf8b68dc3f), pinned to `e54bb414908da2b6286a6ad6431a5fcf8b68dc3f`. Its Apache-2.0 license and included third-party notices are retained. Atlas's MIT license applies to Atlas-authored code and does not replace these upstream terms. [Read the full source, modification, and license record](upstream-music-lab.md).

## Models, source and inspiration

The 15 studies and three Atlas music experiments use original Atlas code, synthetic data, authored geometry, and sound/shader models. Their reference links identify teaching or interaction ideas and routes to deeper material. The three Chrome Music Lab originals are separately labelled upstream applications, bundled with their original assets and retained licenses. [Their provenance guide](upstream-music-lab.md) records the pinned source and integration changes.

| Atlas study or interaction | Source and teaching reference |
| --- | --- |
| Correct one assumption · restored Atlas original | [Original cause-and-consequence module](../src/labs/restored/correction.js); fictional evidence and explicit dependency rules |
| Follow the same object · restored Atlas original | [Original reading-collection module](../src/labs/restored/continuity.js); identity continuity inspired by [R2D3](https://r2d3.us/visual-intro-to-machine-learning-part-1/), with original code and fictional data |
| Words that take shape · restored Atlas original | [Original typography module](../src/labs/restored/typography.js); kinetic-typography inspiration from [Codrops](https://tympanus.net/codrops/2026/11/10/kinetic-typography-gsap/), with no GSAP code or fonts copied |
| Classification | [R2D3 · A visual introduction to machine learning](https://r2d3.us/visual-intro-to-machine-learning-part-1/) |
| Spatial presentation | [React Flow · Creating slideshows](https://reactflow.dev/learn/tutorials/slide-shows-with-react-flow) |
| State machine | [Stately Sketch](https://sketch.stately.ai/) |
| Repair | [Distill · Growing Neural Cellular Automata](https://distill.pub/2020/growing-ca/) |
| Neighbourhood focus | [Sigma.js](https://www.sigmajs.org/) |
| Markov process | [Setosa · Markov Chains](https://setosa.io/ev/markov-chains/) |
| Gear train | [Bartosz Ciechanowski · Gears](https://ciechanow.ski/gears/) |
| Attention | [Polo Club · Transformer Explainer](https://poloclub.github.io/transformer-explainer/) |
| Projectile | [Mafs · Projectile motion](https://mafs.dev/guides/examples/projectile-motion) |
| Spring interaction | [React Spring examples](https://www.react-spring.dev/examples) |
| Probability | [Seeing Theory](https://seeing-theory.brown.edu/basic-probability/index.html) |
| Materials | [Paper Shaders](https://shaders.paper.design/) |
| Card expansion | [Motion Primitives · Morphing dialog](https://motion-primitives.com/docs/morphing-dialog) |
| Three Atlas music experiments · inspiration | [Chrome Music Lab](https://musiclab.chromeexperiments.com/) |
| Harmonics, Strings, Sound Waves · original upstream applications | [Pinned Chrome Music Lab source](https://github.com/googlecreativelab/chrome-music-lab/tree/e54bb414908da2b6286a6ad6431a5fcf8b68dc3f) · [provenance and licenses](upstream-music-lab.md) |

## Extend a study

- `lib/explorations/catalog.ts` owns the 15 study IDs, categories, descriptions, capability flags, model basis, and reference links.
- `src/labs/ExplorationAtlas.tsx` owns cards, filtering, the expanding detail dialog, fragment routing, and exports.
- `src/labs/LearningStudies.tsx`, `SystemStudies.tsx`, and `VisualStudies.tsx` render the experiments. Pure calculations live in the corresponding modules under `lib/explorations/`.
- `src/labs/RestoredStudies.tsx` adapts the original New Directions modules in `src/labs/restored/` to the Atlas study lifecycle and exports.
- `src/labs/MusicLab.tsx` owns the six music tabs, the Atlas Web Audio session, and the active original's lifecycle. `lib/explorations/music.ts` owns Atlas wave, pattern-validation, synthesis, and WAV helpers.
- `public/vendor/chrome-music-lab/` contains the self-hosted original applications and their notices. [The upstream music guide](upstream-music-lab.md) records how to trace their source and packaging changes.
- A study's `.lab-demo` root publishes JSON through `data-export-state`; the primary SVG or Canvas uses `data-export="true"` for frame export.

Keep model rules explicit, support keyboard operation, respect reduced motion, clean up timers and audio resources, and use synthetic or appropriately licensed content. Pure model tests live under `tests/`. The Atlas studies use browser APIs and existing React dependencies; no new npm packages are required. Vendored original applications keep their own dependency and license records.
