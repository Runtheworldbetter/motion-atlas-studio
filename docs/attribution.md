# Attribution and third-party notices

## Motion Canvas

[Motion Canvas](https://github.com/motion-canvas/motion-canvas) provides the animation engine for Motion Atlas's editable recipes and gallery scenes. The complete-stroke cricket inspector uses React and SVG with an Atlas pose model. Thank you to the Motion Canvas creators and contributors for building and maintaining it. Its [documentation](https://motioncanvas.io/docs/) explains how to build your own animations.

RTWB maintains the Motion Atlas editor, gallery scenes, recipes, and examples. That code uses the [MIT license](../LICENSE). Dependencies keep their own licenses, listed below.

## Licensed upstream originals

Version 0.6.0 includes six packages in **Originals**. Their source and assets remain attributed to their creators. Atlas adds hosting and integration controls and records those changes in each package's README and provenance. [The Originals guide](originals.md) gives exact pins, scope, downloads and reuse details.

| Project | Creator | Retained rights and record |
| --- | --- | --- |
| Spectrogram | Google Creative Lab and collaborators | Apache-2.0 original; BSD-style helpers, MIT jQuery, SIL OFL fonts. [Source and notices](../public/vendor/chrome-music-lab/spectrogram/README.md). |
| LOOPY v1.1 | Nicky Case | CC0-1.0; separate MIT dependency notices. [Source and notices](../public/vendor/loopy/README.md). |
| Markov Chains — Explained Visually | Victor Powell; text by Lewis Lehe | MIT article/source; BSD D3/helper, helper patent grant, MIT AngularJS and SIL OFL Lato notices. [Source and notices](../public/vendor/setosa-markov/README.md). |
| Sigma homepage paper network | Sigma.js contributors | MIT code, public OpenAlex metadata under CC0, separate font licenses and notices. [Source and notices](../public/vendor/sigma/README.md). |
| Plain-grid A* diagrams | Amit Patel, Red Blob Games | Apache-2.0 original runtime. Original, unused Conrec source and notices retained in the archive. [Source and notices](../public/vendor/red-blob/README.md). |
| Metaballs and Warp | Paper | Apache-2.0 renderers and presets; original LICENSE and NOTICE retained. [Source and notices](../public/vendor/paper-shaders/README.md). |

Setosa's separately hosted full playground is linked only: no verified grant for incorporating that separate application was found. Red Blob's runtime does not use StarRaven illustrated-map assets or Conrec. Paper's original renderers and preset values are included with Atlas controls; its entire website/editor is not copied. Sigma's data is public metadata, not paper full text.

These licenses apply to their respective code and assets. Atlas's MIT license does not replace them. Preserve the project licenses, copyright/attribution, applicable NOTICE files and modification records when redistributing source or built files. Each dedicated source ZIP carries those materials. No endorsement by the upstream creators is implied.

## Original Chrome Music Lab experiments

Music Lab includes faithful, self-hosted **Harmonics**, **Strings**, **Sound Waves**, and **Spectrogram** from [Google Creative Lab's Chrome Music Lab](https://github.com/googlecreativelab/chrome-music-lab/tree/e54bb414908da2b6286a6ad6431a5fcf8b68dc3f), pinned to commit `e54bb414908da2b6286a6ad6431a5fcf8b68dc3f`.

They retain their upstream visuals, relevant assets and instrument interactions. Their Apache-2.0 license and bundled third-party notices remain applicable. [The earlier music provenance record](upstream-music-lab.md) documents Harmonics, Strings and Sound Waves; [the Spectrogram record](upstream-spectrogram.md) covers the new experiment's source, local fonts, retained notices and compatibility changes. The files live under `public/vendor/chrome-music-lab/`, with Spectrogram in its own subdirectory.

Music Lab labels distinguish the four Google originals from Atlas's **Sound & spectrum**, **Build a timbre**, and **Make a melody**. The 15 exploration studies are original Atlas adaptations with linked inspirations and explicit model boundaries; see [Models, source and inspiration](explorations.md#models-source-and-inspiration).

Three studies restore Atlas's own earlier New Directions modules: **Correct one assumption**, **Follow the same object**, and **Words that take shape**. Their original code and illustrative content remain Atlas work under MIT. R2D3 supplies an identity-continuity reference for the reading collection; Codrops supplies a kinetic-typography reference. No source artwork, datasets, GSAP code, or fonts are copied from those references.

The spacecraft study was removed in 0.5.1. Raj Shekhar's Voyager experience is not bundled or embedded because a grant permitting that reuse could not be verified. The mechanical watch and shuttle experiences are also outside this release's included collection.

## Direct runtime dependencies

| Package | Version | Declared license |
| --- | --- | --- |
| `@motion-canvas/core` | 3.17.2 | MIT |
| `@motion-canvas/2d` | 3.17.2 | MIT |
| `react` | 19.2.6 | MIT |
| `react-dom` | 19.2.6 | MIT |
| `lucide-react` | 1.31.0 | ISC |

Dependencies also include MathJax, CodeMirror, Lezer, chroma.js, and syntax grammars. Some packages include other third-party code with its own notices. Full license and notice texts are in [public/third-party-notices.txt](../public/third-party-notices.txt), included with the built site. Vendored projects also retain their own notice files next to their source; those project records define the scope of each original.

## Reproduce the notices

```sh
npm ci
node scripts/generate-notices.mjs
node scripts/generate-notices.mjs --check
```

The generator follows the installed dependency graph from `package.json`'s production dependencies, including installed peers and optional dependencies, and verifies versions against `package-lock.json`. It includes all `LICENSE`, `COPYING`, copyright, and `NOTICE` files it finds at package roots or in their notice directories. Full upstream notice files are retained, including the grammar attributions distributed by `@wooorm/starry-night` and Oniguruma attribution distributed by `vscode-oniguruma`.

The list covers all installed production dependencies, including code the browser build may remove as unused. Development tools have their licenses in their installed packages. If you distribute `node_modules` or build-tool binaries separately, include the licenses for that distribution too.

Vendored original notices are aggregated with the production package notices, with source and integrity records checked during release. Each original also keeps its complete notices locally.

The same installed dependencies and reviewed vendor files produce the same output. `--check` validates the generated file without changing it. The check fails for missing packages or license text, version mismatches, outdated overrides, or conflicting notices for the same package version.

## A package without a license file

Find the license text for the exact installed version and record its source. A package's short license label may omit copyright or attribution requirements.

Record recovered license text in `docs/license-overrides.json`. Each entry names the license, explains the missing text, and lists files under `docs/licenses/` with source URLs and SHA-256 checksums. The generator checks the files, version, and license, reports unused overrides as errors, and includes the source details in the generated notices.

The current exception is `mj-context-menu@0.6.1`, a MathJax dependency. Its [published version metadata](https://registry.npmjs.org/mj-context-menu/0.6.1) declares `Apache-2.0`, but the npm archive omits the license file. The standard Apache-2.0 text comes from the [upstream license commit](https://github.com/zorkow/context-menu/blob/72e16a5713cf30b390776c89bb6c1428747472f1/LICENSE). The published archive has no separate `NOTICE` file.

Review the override and upstream terms when changing the package version. Resolve missing attribution before release, or remove the dependency.
