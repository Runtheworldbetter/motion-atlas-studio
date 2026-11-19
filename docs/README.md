# Motion Atlas documentation

**[Open the Atlas](https://runtheworldbetter.github.io/motion-atlas-studio/) · [Read the website guide](https://runtheworldbetter.github.io/motion-atlas-studio/docs/) · [GitHub source](https://github.com/Runtheworldbetter/motion-atlas-studio)**

Motion Atlas is the project you run, edit, and share: interactive explanations, visual experiments, music, and editable animation. Version 0.5.0 adds **13 explorable studies** and **three Music Lab experiments**, alongside the existing **50 gallery examples** and **seven recipes**.

**[Explore the studies](https://runtheworldbetter.github.io/motion-atlas-studio/#explore) · [Open Music Lab](https://runtheworldbetter.github.io/motion-atlas-studio/#music-lab) · [Browse the Collection](https://runtheworldbetter.github.io/motion-atlas-studio/#collection)**

| Guide | Use it for |
| --- | --- |
| [Explorations and Music Lab](explorations.md) | All 13 studies, repair capability, model notes, deep links, SVG/PNG/state downloads, melody JSON and WAV |
| [Getting started](../README.md#use-the-editor) | Choose a recipe, change inputs, and inspect an explanation |
| [Cricket coaching inspector](cricket.md) | Full-stroke playback, handedness, cameras, and bat imprints |
| [Recipe input formats](recipes.md) | JSON, CSV, text, limits, and calculation details |
| [Run locally](../README.md#run-locally) | Install dependencies and start the editor |
| [Hosting and embeds](hosting.md) | GitHub Pages, static hosting, and share links |
| [Data and privacy](privacy.md) | Browser storage, local files, and exported data |
| [Attribution](attribution.md) | Engines, dependencies, and license notices |
| [Contributing](../CONTRIBUTING.md) | Extend the project and validate changes |

## The role of Motion Canvas

Atlas uses [Motion Canvas](https://github.com/motion-canvas/motion-canvas) for its editable animation recipes and gallery scenes. React and SVG support most explorable studies and the cricket inspector. The material study uses original WebGL shaders with a Canvas 2D fallback when WebGL is unavailable; its controls and PNG export work in either mode. Music Lab uses Web Audio and Canvas. They live in this repository and ship as one static website.

To customize an existing example, start with the Atlas recipe documentation. To change a Motion Canvas scene or write a new one, use the [upstream Motion Canvas documentation](https://motioncanvas.io/docs/) alongside Atlas's `lib/recipes/` and `lib/motion/` source.

Motion Canvas keeps its own project, documentation, and MIT license. Its full notices ship with Atlas in [third-party-notices.txt](../public/third-party-notices.txt).

The new exploration references are independent projects linked for inspiration and further study. Atlas's versions use original code, geometry, sound models, and synthetic examples. Each detail view includes its source and model boundaries; see [Models, source and inspiration](explorations.md#models-source-and-inspiration).
