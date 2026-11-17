# Attribution and third-party notices

Motion Atlas is an independent RTWB project built with [Motion Canvas](https://github.com/motion-canvas/motion-canvas). The application, gallery scenes, recipes, and supplied sample inputs are covered by the root [MIT license](../LICENSE). This does not replace the licenses of dependencies or imply endorsement by their authors.

## Direct runtime dependencies

| Package | Version | Declared license |
| --- | --- | --- |
| `@motion-canvas/core` | 3.17.2 | MIT |
| `@motion-canvas/2d` | 3.17.2 | MIT |
| `react` | 19.2.6 | MIT |
| `react-dom` | 19.2.6 | MIT |
| `lucide-react` | 1.31.0 | ISC |

Their dependency tree also includes packages such as MathJax, CodeMirror, Lezer, chroma.js, and syntax-grammar utilities. Some of those packages contain additional third-party code with its own notices. The complete source texts are preserved in [public/third-party-notices.txt](../public/third-party-notices.txt), which is served with the built site.

## Reproduce the notices

```sh
npm ci
node scripts/generate-notices.mjs
node scripts/generate-notices.mjs --check
```

The generator follows the installed dependency graph from `package.json`'s production dependencies, including installed peers and optional dependencies, and verifies versions against `package-lock.json`. It includes all `LICENSE`, `COPYING`, copyright, and `NOTICE` files it finds at package roots or in their notice directories. Full upstream notice files are retained, including the grammar attributions distributed by `@wooorm/starry-night` and Oniguruma attribution distributed by `vscode-oniguruma`.

This is a conservative inventory of the complete production dependency closure. It can include packages or grammar assets removed by a particular browser build's tree shaking. Development-only tools are not listed as browser runtime dependencies; their licenses remain in their installed packages. Do not use this browser-distribution inventory as a blanket license for a separate distribution of `node_modules` or build-tool binaries.

Output is deterministic and contains no build timestamp or machine-specific path. `--check` reads the same evidence without changing the generated file. Missing packages, stale versions, missing license metadata/text, stale override records, or differing notices in duplicate package versions fail the check.

## A package without a license file

Do not manufacture a copyright notice or assume that a package's short license label contains all its attribution requirements. Investigate the exact installed version and retain the published source of any recovered text.

A reviewed, version-specific recovery can be recorded in `docs/license-overrides.json`. Each entry names the declared license, explains why it is needed, and lists files under `docs/licenses/` with their source URLs and SHA-256 checksums. The generator verifies the checksums, checks that the entry matches the installed version/license, and fails when an override becomes unused. The recovery is included visibly in the generated notice file.

The current exception is `mj-context-menu@0.6.1`, a MathJax dependency. Its [published version metadata](https://registry.npmjs.org/mj-context-menu/0.6.1) explicitly declares `Apache-2.0`, but that npm archive omits a license file. The standard Apache-2.0 text is retained from the [upstream license commit](https://github.com/zorkow/context-menu/blob/72e16a5713cf30b390776c89bb6c1428747472f1/LICENSE). The published archive has no separate `NOTICE` file, and no package-specific copyright holder has been invented.

Review the override explanation and upstream terms again when changing that package version. An unresolved provenance question should remain a visible release issue until it is resolved or the dependency is removed.
