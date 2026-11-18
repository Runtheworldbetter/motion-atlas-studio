# Motion Atlas documentation

**[Open the Atlas](https://runtheworldbetter.github.io/motion-atlas-studio/) · [Read the website guide](https://runtheworldbetter.github.io/motion-atlas-studio/docs/) · [GitHub source](https://github.com/Runtheworldbetter/motion-atlas-studio)**

Motion Atlas is the project you run, edit, and share. It includes a browser editor, reusable animation recipes, a gallery, and cricket coaching tools.

| Guide | Use it for |
| --- | --- |
| [Getting started](../README.md#use-the-editor) | Choose a recipe, change inputs, and inspect an explanation |
| [Cricket coaching inspector](cricket.md) | Full-stroke playback, handedness, cameras, and bat imprints |
| [Recipe input formats](recipes.md) | JSON, CSV, text, limits, and calculation details |
| [Run locally](../README.md#run-locally) | Install dependencies and start the editor |
| [Hosting and embeds](hosting.md) | GitHub Pages, static hosting, and share links |
| [Data and privacy](privacy.md) | Browser storage, local files, and exported data |
| [Attribution](attribution.md) | Engines, dependencies, and license notices |
| [Contributing](../CONTRIBUTING.md) | Extend the project and validate changes |

## The role of Motion Canvas

Atlas uses [Motion Canvas](https://github.com/motion-canvas/motion-canvas) for its editable animation recipes and gallery scenes. The complete-stroke cricket inspector uses React and SVG for direct pose inspection and camera switching. Both live in this repository and ship as one static website.

To customize an existing example, start with the Atlas recipe documentation. To change a Motion Canvas scene or write a new one, use the [upstream Motion Canvas documentation](https://motioncanvas.io/docs/) alongside Atlas's `lib/recipes/` and `lib/motion/` source.

Motion Canvas keeps its own project, documentation, and MIT license. Its full notices ship with Atlas in [third-party-notices.txt](../public/third-party-notices.txt).
