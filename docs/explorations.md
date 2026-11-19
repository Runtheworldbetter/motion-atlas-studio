# Explorations and Music Lab

**[Open Explore](https://runtheworldbetter.github.io/motion-atlas-studio/#explore) · [Open Music Lab](https://runtheworldbetter.github.io/motion-atlas-studio/#music-lab) · [All Atlas guides](README.md)**

Version 0.5.0 adds 13 working studies and a dedicated Music Lab. They extend Atlas's visual vocabulary across stories, systems, AI, probability, physics, and materials. The existing 50-example Collection and seven-recipe Editor remain available as separate sections.

## Open and explore a study

1. Open **Explore**. Filter by Stories, Systems, AI, Physics, or Materials, or search for a title, description, or inspiration.
2. Select a card. It expands from its place into a detail view. Close it with the close button or Escape to return; the interaction respects reduced-motion preferences.
3. Change inputs, select components, or start playback using the study's controls. Playback and the state-machine clock begin only when requested.
4. Open **Model, source and inspiration** to inspect the model's basis, read its Atlas source, or visit the independent project that inspired the interaction.
5. Use **Download frame**, **Download data**, or **Copy link** at the bottom of the detail view.

Keyboard controls are provided alongside pointer interactions. For example, the spatial story supports left/right navigation and Home for its overview; the spring study provides Move up/Move down controls; the repair grid uses arrows and Enter; and graph nodes and Markov transitions can be selected by keyboard. Mechanism and trajectory diagrams initially show the whole figure on narrow screens. Choose **Enlarge to read labels** for a locally scrolling detail view; **Show whole diagram** returns to the overview. Other dense diagrams also scroll locally. With reduced motion enabled, explicitly started gear, spacecraft, projectile, and material playback advances at four updates per second. Scrubbing still selects a precise moment.

## The 13 studies

| Study | Try this | Model and interpretation |
| --- | --- | --- |
| [Follow a classification](https://runtheworldbetter.github.io/motion-atlas-studio/#explore/classification) · AI | Follow the same observations through features, a threshold rule, a tree, and held-out predictions. Select an observation and keep track of it. | Fixed synthetic data and a one-feature decision stump. The fitted threshold uses training labels. Tuning after inspecting test results makes that score exploratory. |
| [Slides become places](https://runtheworldbetter.github.io/motion-atlas-studio/#explore/slide-canvas) · Stories | Enter a slide, follow the six-part sequence, pan the background, then show the entire story. | An original spatial presentation with an animated camera. It demonstrates a narrative interaction; it does not import slide decks. |
| [Events change the state](https://runtheworldbetter.github.io/motion-atlas-studio/#explore/state-machine) · Systems | Submit without a source, then attach one. Try verification, failure, retry, timeout, and cancellation. | An explicit state machine. Submission requires a source; retries have a three-attempt budget; checking times out after five simulated seconds. Advance time manually or start the clock. |
| [Suggest a repair](https://runtheworldbetter.github.io/motion-atlas-studio/#explore/repair) · Systems | Grow a stencil from its seed, remove cells, propose repairs, inspect support, and apply only the suggestions you select. | A deterministic local-rule model with a known stencil. Support is a neighbour count, not a learned probability. See the repair workflow below. |
| [Find the relevant neighborhood](https://runtheworldbetter.github.io/motion-atlas-studio/#explore/neighborhood) · Systems | Search the fictional ecosystem, select a node, and switch between one and two hops. Select a relationship to read its explanation. | An original, undirected graph. Unrelated nodes dim while labels remain visible; a hop is one edge. |
| [Edit the probabilities](https://runtheworldbetter.github.io/motion-atlas-studio/#explore/markov) · Systems | Change a matrix cell, inspect its matching edge, and replay a path with a fixed random seed. | A computed three-state Markov process. Rows sum to one. Exact probabilities describe all possible paths; displayed visits describe the single seeded path. |
| [Inside a gear train](https://runtheworldbetter.github.io/motion-atlas-studio/#explore/gears) · Physics | Play or scrub the rotation, separate the gears, and select the input, idler, or output. | Idealized 12-, 24-, and 36-tooth gears with equal pitch and a computed 3:1 reduction. Separated parts retain the motion they would have when engaged. |
| [Take a spacecraft apart](https://runtheworldbetter.github.io/motion-atlas-studio/#explore/spacecraft) · Physics | Separate the assembly, isolate a component, and reveal the five parts one at a time. | Original illustrative geometry and component roles. It is not to scale, an engineering drawing, or a report of a spacecraft's current condition. |
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
#explore/classification
#explore/repair
#explore/transformer
#explore/shaders
#music-lab
```

For example, [open the repair study](https://runtheworldbetter.github.io/motion-atlas-studio/#explore/repair). A study fragment opens its detail view directly. **Copy link** copies that address. Closing returns to `#explore`; browser history can navigate study links.

Links identify a study; they do not encode its edited controls. The Music Lab section has one link, with its three tabs chosen within the page.

### Keep a frame or the state

| Control | Output | Scope |
| --- | --- | --- |
| Download frame · SVG studies | `.svg` | The primary illustration at the current moment, with its visible styling. |
| Download frame · material study | `.png` | The current material canvas frame, using either WebGL or the Canvas 2D fallback. |
| Download data | `.json` | Study ID, model basis, capabilities, and the study's current exported state. |
| Copy link | URL | The selected study, opened through its fragment. |
| Music Lab · Save JSON | `.json` | A melody pattern that can be imported in Make a melody. |
| Music Lab · Save WAV | `.wav` | One complete melody cycle rendered as audio. |

Exploration JSON uses `format: "motion-atlas-exploration-v1"` with `study`, `basis`, `capabilities`, and `state`. It is an inspectable snapshot for analysis or reuse in code. General restoration of study snapshots is not implemented in this release. Melody JSON uses its own validated, importable pattern format below.

Most study controls last while that study is open. The Markov study persists its matrix, seed, and path position in local storage and restores them without starting playback. **Reset all** restores its defaults. Music compositions and the other Music Lab controls are held in page memory; save the melody JSON before reloading or closing the tab.

## Music Lab

[Open Music Lab](https://runtheworldbetter.github.io/motion-atlas-studio/#music-lab). The dedicated section contains three experiments; these are separate from the 13 study cards.

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

## Models, source and inspiration

The new studies use original Atlas code, synthetic data, authored geometry, and original sound/shader models. Upstream names identify teaching or interaction references and provide routes to deeper material. Atlas does not bundle these projects' applications, artwork, datasets, or source code. Each upstream project retains its own license.

| Atlas study or interaction | Independent reference |
| --- | --- |
| Classification | [R2D3 · A visual introduction to machine learning](https://r2d3.us/visual-intro-to-machine-learning-part-1/) |
| Spatial presentation | [React Flow · Creating slideshows](https://reactflow.dev/learn/tutorials/slide-shows-with-react-flow) |
| State machine | [Stately Sketch](https://sketch.stately.ai/) |
| Repair | [Distill · Growing Neural Cellular Automata](https://distill.pub/2020/growing-ca/) |
| Neighbourhood focus | [Sigma.js](https://www.sigmajs.org/) |
| Markov process | [Setosa · Markov Chains](https://setosa.io/ev/markov-chains/) |
| Gear train | [Bartosz Ciechanowski · Gears](https://ciechanow.ski/gears/) |
| Spacecraft assembly | [Raj Shekhar · Voyager, taken apart](https://rshekhar.com/voyager/v1/apart/) |
| Attention | [Polo Club · Transformer Explainer](https://poloclub.github.io/transformer-explainer/) |
| Projectile | [Mafs · Projectile motion](https://mafs.dev/guides/examples/projectile-motion) |
| Spring interaction | [React Spring examples](https://www.react-spring.dev/examples) |
| Probability | [Seeing Theory](https://seeing-theory.brown.edu/basic-probability/index.html) |
| Materials | [Paper Shaders](https://shaders.paper.design/) |
| Card expansion | [Motion Primitives · Morphing dialog](https://motion-primitives.com/docs/morphing-dialog) |
| Music Lab | [Chrome Music Lab](https://musiclab.chromeexperiments.com/) · [original repository](https://github.com/googlecreativelab/chrome-music-lab) |

## Extend a study

- `lib/explorations/catalog.ts` owns the 13 study IDs, categories, descriptions, capability flags, model basis, and reference links.
- `src/labs/ExplorationAtlas.tsx` owns cards, filtering, the expanding detail dialog, fragment routing, and exports.
- `src/labs/LearningStudies.tsx`, `SystemStudies.tsx`, and `VisualStudies.tsx` render the experiments. Pure calculations live in the corresponding modules under `lib/explorations/`.
- `src/labs/MusicLab.tsx` owns the three music tabs and Web Audio session. `lib/explorations/music.ts` owns pure wave, pattern-validation, synthesis, and WAV helpers.
- A study's `.lab-demo` root publishes JSON through `data-export-state`; the primary SVG or Canvas uses `data-export="true"` for frame export.

Keep model rules explicit, support keyboard operation, respect reduced motion, clean up timers and audio resources, and use synthetic or appropriately licensed content. Pure model tests live under `tests/`. The additions use browser APIs and existing React dependencies; no new packages are required.
