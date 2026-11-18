# Attribution and third-party notices

## Motion Canvas

[Motion Canvas](https://github.com/motion-canvas/motion-canvas) provides the animation engine for Motion Atlas's editable recipes and gallery scenes. The complete-stroke cricket inspector uses React and SVG with an Atlas pose model. Thank you to the Motion Canvas creators and contributors for building and maintaining it. Its [documentation](https://motioncanvas.io/docs/) explains how to build your own animations.

RTWB maintains the Motion Atlas editor, gallery scenes, recipes, and examples. That code uses the [MIT license](../LICENSE). Dependencies keep their own licenses, listed below.

## Direct runtime dependencies

| Package | Version | Declared license |
| --- | --- | --- |
| `@motion-canvas/core` | 3.17.2 | MIT |
| `@motion-canvas/2d` | 3.17.2 | MIT |
| `react` | 19.2.6 | MIT |
| `react-dom` | 19.2.6 | MIT |
| `lucide-react` | 1.31.0 | ISC |

Dependencies also include MathJax, CodeMirror, Lezer, chroma.js, and syntax grammars. Some packages include other third-party code with its own notices. Full license and notice texts are in [public/third-party-notices.txt](../public/third-party-notices.txt), included with the built site.

## Reproduce the notices

```sh
npm ci
node scripts/generate-notices.mjs
node scripts/generate-notices.mjs --check
```

The generator follows the installed dependency graph from `package.json`'s production dependencies, including installed peers and optional dependencies, and verifies versions against `package-lock.json`. It includes all `LICENSE`, `COPYING`, copyright, and `NOTICE` files it finds at package roots or in their notice directories. Full upstream notice files are retained, including the grammar attributions distributed by `@wooorm/starry-night` and Oniguruma attribution distributed by `vscode-oniguruma`.

The list covers all installed production dependencies, including code the browser build may remove as unused. Development tools have their licenses in their installed packages. If you distribute `node_modules` or build-tool binaries separately, include the licenses for that distribution too.

The same installed dependencies produce the same output. `--check` validates the generated file without changing it. The check fails for missing packages or license text, version mismatches, outdated overrides, or conflicting notices for the same package version.

## A package without a license file

Find the license text for the exact installed version and record its source. A package's short license label may omit copyright or attribution requirements.

Record recovered license text in `docs/license-overrides.json`. Each entry names the license, explains the missing text, and lists files under `docs/licenses/` with source URLs and SHA-256 checksums. The generator checks the files, version, and license, reports unused overrides as errors, and includes the source details in the generated notices.

The current exception is `mj-context-menu@0.6.1`, a MathJax dependency. Its [published version metadata](https://registry.npmjs.org/mj-context-menu/0.6.1) declares `Apache-2.0`, but the npm archive omits the license file. The standard Apache-2.0 text comes from the [upstream license commit](https://github.com/zorkow/context-menu/blob/72e16a5713cf30b390776c89bb6c1428747472f1/LICENSE). The published archive has no separate `NOTICE` file.

Review the override and upstream terms when changing the package version. Resolve missing attribution before release, or remove the dependency.
