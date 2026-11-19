# Motion Atlas documentation

**[Open the Atlas](https://runtheworldbetter.github.io/motion-atlas-studio/) · [Read the website guide](https://runtheworldbetter.github.io/motion-atlas-studio/docs/) · [GitHub source](https://github.com/Runtheworldbetter/motion-atlas-studio)**

Motion Atlas is the project you run, edit, and share: interactive explanations, visual experiments, music, and editable animation. Version 0.5.1 restores the original **Editor → Collection** presentation, with **15 explorable studies** and **six Music Lab experiments** following the collection. The existing **50 gallery examples**, **seven recipes**, players, and coaching tools are unchanged.

**[Explore the studies](https://runtheworldbetter.github.io/motion-atlas-studio/#explore) · [Open Music Lab](https://runtheworldbetter.github.io/motion-atlas-studio/#music-lab) · [Browse the Collection](https://runtheworldbetter.github.io/motion-atlas-studio/#collection)**

The 15 studies include three restored from the earlier New Directions prototype: **Correct one assumption**, **Follow the same object**, and **Words that take shape**, preserving their original illustrations and interactions. [Explore their controls and model notes](explorations.md#the-15-studies).

| Guide | Use it for |
| --- | --- |
| [Explorations and Music Lab](explorations.md) | All 15 studies, six music tabs, repair capability, model notes, deep links, SVG/PNG/state downloads, melody JSON and WAV |
| [Original Chrome Music Lab experiments](upstream-music-lab.md) | Harmonics, Strings, Sound Waves, pinned source, local integration, and retained licenses |
| [Getting started](../README.md#use-the-editor) | Choose a recipe, change inputs, and inspect an explanation |
| [Cricket coaching inspector](cricket.md) | Full-stroke playback, handedness, cameras, and bat imprints |
| [Recipe input formats](recipes.md) | JSON, CSV, text, limits, and calculation details |
| [Run locally](../README.md#run-locally) | Install dependencies and start the editor |
| [Hosting and embeds](hosting.md) | GitHub Pages, static hosting, and share links |
| [Data and privacy](privacy.md) | Browser storage, local files, and exported data |
| [Attribution](attribution.md) | Engines, dependencies, and license notices |
| [Contributing](../CONTRIBUTING.md) | Extend the project and validate changes |

## The role of Motion Canvas

Atlas uses [Motion Canvas](https://github.com/motion-canvas/motion-canvas) for its editable animation recipes and gallery scenes. React and SVG support most explorable studies and the cricket inspector. The material study uses original WebGL shaders with a Canvas 2D fallback when WebGL is unavailable; its controls and PNG export work in either mode. Music Lab uses Web Audio, Canvas, and the original Sound Waves WebGL renderer. They live in this repository and ship as one static website.

Music Lab's original **Sound Waves** experiment requires WebGL. If unavailable, it shows an explanatory message and source links, preserving the original renderer instead of replacing it with a simplified animation.

To customize an existing example, start with the Atlas recipe documentation. To change a Motion Canvas scene or write a new one, use the [upstream Motion Canvas documentation](https://motioncanvas.io/docs/) alongside Atlas's `lib/recipes/` and `lib/motion/` source.

Motion Canvas keeps its own project, documentation, and MIT license. Its full notices ship with Atlas in [third-party-notices.txt](../public/third-party-notices.txt).

The 15 exploration references are independent projects linked for inspiration and further study. Atlas's studies use original code, geometry, and synthetic examples. Each detail view includes its source and model boundaries; see [Models, source and inspiration](explorations.md#models-source-and-inspiration).

Music Lab keeps the three Atlas experiments and adds three faithful, self-hosted Chrome Music Lab originals. One experiment is active at a time, with source labels distinguishing Atlas from upstream. The originals retain Apache-2.0 and their third-party notices; see [their provenance guide](upstream-music-lab.md). The removed spacecraft study has no replacement: reuse or embedding permission for the original Voyager experience could not be verified.
