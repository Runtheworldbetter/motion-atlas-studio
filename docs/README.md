# Motion Atlas documentation

**[Open the Atlas](https://runtheworldbetter.github.io/motion-atlas-studio/) · [Read the website guide](https://runtheworldbetter.github.io/motion-atlas-studio/docs/) · [GitHub source](https://github.com/Runtheworldbetter/motion-atlas-studio)**

Motion Atlas is the project you run, edit, and share: interactive explanations, visual experiments, music, and editable animation. Version **0.6.0** adds **six licensed upstream projects in Originals** and the original **Spectrogram** in Music Lab. The existing **50 gallery examples**, **seven editable recipes**, **15 studies**, players, and coaching tools remain. Music Lab now has **seven tabs**: three Atlas experiments and four Google originals.

**[Open the Originals](https://runtheworldbetter.github.io/motion-atlas-studio/#originals) · [Explore the studies](https://runtheworldbetter.github.io/motion-atlas-studio/#explore) · [Open Music Lab](https://runtheworldbetter.github.io/motion-atlas-studio/#music-lab) · [Browse the Collection](https://runtheworldbetter.github.io/motion-atlas-studio/#collection)**

Originals includes **Spectrogram**, **LOOPY**, **Setosa Markov chains**, **Sigma's paper network**, **Red Blob Games' plain-grid pathfinding diagrams**, and **Paper's Metaballs and Warp**. Each project opens its own upstream implementation, with source, credits, a dedicated ZIP download, and integration notes. [The Originals guide](originals.md) records exactly what is included and how to reuse it.

| Guide | Use it for |
| --- | --- |
| [Originals: source, scope and reuse](originals.md) | The six projects, original interaction, source ZIPs, precise pins, browser requirements, and mixed licenses |
| [Original Spectrogram](upstream-spectrogram.md) | Instrument samples, drawing, optional local microphone, editable upstream source, isolated build, and notices |
| [Explorations and Atlas Music Lab](explorations.md) | The 15 studies, existing music controls, model notes, SVG/PNG/state downloads, melody JSON and WAV |
| [Earlier Chrome Music Lab originals](upstream-music-lab.md) | Harmonics, Strings, Sound Waves, pinned source, local integration, and retained licenses |
| [Getting started](../README.md#use-the-editor) | Choose a recipe, change inputs, and inspect an explanation |
| [Cricket coaching inspector](cricket.md) | Full-stroke playback, handedness, cameras, and bat imprints |
| [Recipe input formats](recipes.md) | JSON, CSV, text, limits, and calculation details |
| [Run locally](../README.md#run-locally) | Install dependencies and start the editor |
| [Hosting and embeds](hosting.md) | GitHub Pages, static hosting, and share links |
| [Data and privacy](privacy.md) | Browser storage, local files, and exported data |
| [Attribution](attribution.md) | Engines, upstream projects, dependencies, and license notices |
| [Release history](changelog.md) | What changed in each version |
| [Contributing](../CONTRIBUTING.md) | Extend the project and validate changes |

## Choosing a starting point

Use **Originals** to explore a creator's actual implementation and take its source with you. The Setosa package includes the licensed article and interactive diagrams; its separate full playground is an external link. Paper supplies its original renderers and preset values inside Atlas hosting controls. These distinctions and the other package scopes are explicit in the Originals guide.

Use **Explore** for Atlas's 15 original adaptations and small, inspectable models. They include the restored **Correct one assumption**, **Follow the same object**, and **Words that take shape** studies. Each has source/inspiration notes and model boundaries. [The study guide](explorations.md#the-15-studies) covers their controls.

Use **Music Lab** to generate and hear sound. The three Atlas instruments remain alongside original Harmonics, Strings, Sound Waves, and [Spectrogram](https://runtheworldbetter.github.io/motion-atlas-studio/#music-lab/original-spectrogram). Audio starts only through interaction. Switching experiments or hiding the page stops it; use **Start experiment** after an original is stopped. Spectrogram's microphone is optional and explicit. Make a melody retains its JSON import/export and WAV download.

## How the renderers fit

Atlas uses [Motion Canvas](https://github.com/motion-canvas/motion-canvas) for its editable recipes and gallery scenes. React and SVG support most Atlas studies and the cricket inspector. The Atlas material study has its own WebGL renderer and Canvas 2D fallback. The separately hosted originals preserve their upstream renderers: Spectrogram and Sound Waves use WebGL, Sigma and Paper require WebGL2, and Red Blob's selected diagrams use Canvas 2D. An original whose graphics requirements are unavailable shows an explanatory message and source links.

For recipe inputs, start with the Atlas guides. For Motion Canvas scene authoring, use the [upstream documentation](https://motioncanvas.io/docs/) alongside `lib/recipes/` and `lib/motion/`. For an original, begin with its vendor README and source download; it need not use Motion Canvas at all.

## Authorship and licenses

Atlas-authored code and examples are MIT. The upstream originals retain Apache-2.0, MIT, CC0 and their separate dependency, font, and data notices. Keep each project's license and attribution files with redistributed code and assets. [Attribution](attribution.md), [the Originals guide](originals.md), and [the full notice file](../public/third-party-notices.txt) explain the scope.

The mechanical watch, shuttle, and Voyager experiences are not included in this release. The existing Atlas gear train remains an authored teaching model.
