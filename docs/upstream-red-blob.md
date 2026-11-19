# Original Red Blob Games A* diagrams

Entry point: `public/vendor/red-blob/index.html` (public path `vendor/red-blob/index.html`). These are the author's original Canvas implementations, not Atlas reinterpretations.

## Provenance and rights

- Original: https://www.redblobgames.com/pathfinding/a-star/introduction.html
- Published original source map: https://www.redblobgames.com/pathfinding/a-star/build/_introduction.js.map
- Source-map SHA-256: `a92677fadf5b4bfd7bb9290a28f6737c23042f5c004061ad4d8527afd909be4d`.
- Snapshot retrieved November 19, 2026. This upstream is identified by a content hash, not an invented Git commit or version tag.

The source map contains the full sources and explicit Apache-2.0 headers for Red Blob's `grid.js`, `search.js`, `diagram.js`, `draggable.v2.js`, `introduction.js`, and `code-highlighting.js`. Their original notices remain in the checked-in files. `LICENSE` contains Apache License 2.0. `THIRD-PARTY-NOTICES.txt` includes the license and applicable copyrights.

The source map also contains Conrec. Its Jason Davies BSD-style notice and older Nicholas Yue notice are both retained verbatim. The latter includes a restriction on distributing modifications. Atlas archives that original file **unchanged** and does not import it at runtime; none of the selected diagrams uses the contour layer.

No StarRaven map sprites, illustrated-map image, article prose, remote stylesheets, analytics, or remote fonts are copied into the runtime. Source-map archival preserves the original licensed JavaScript, including unused diagram functions; the standalone page invokes only the plain-grid functions listed below. New headings and instructions are Atlas text.

## Original diagrams included

1. `makeDiagramFrontier`: the original 30×15 wall grid, draggable red marker, editable walls, breadth-first frontier, distance slider and finite 7-frame-per-second playback.
2. `makeDiagramExpansion`: the original 9×4 numbered search grid, current/frontier/neighbor colors, and backward/forward controls. As on the upstream page, the automatic-play control is hidden for this teaching stepper.
3. `makeDiagramWeights`: original linked unweighted/weighted 10×10 route diagrams; terrain changes among 1, 5 and impassable, and endpoints move together.
4. `makeDiagramAStar`: original linked Dijkstra, greedy best-first and A* 15×15 diagrams, shared wall edits and endpoints, numerical fields and hover inspection. The upstream A* teaching example uses `cost_so_far + 1.01 * Manhattan distance`; that formula is preserved and disclosed in the UI.

## What the adapter changes

`scripts/vendor-red-blob.mjs` extracts those original initializers and their required helper functions verbatim, removes their automatic article-wide registration, and rewrites imports to local files. The underlying grid, search, diagram/layer, pattern, slider and drag implementations are byte-identical to the published snapshot.

The adapter supplies a standalone tabbed document, responsive figure wrappers, new instructions, source links, native-control accessible labels, and a small subclass that records original Diagram instances. That registry lets a ResizeObserver call the original `setSize()` and `redraw()` when the iframe or window changes width. Changing tabs preserves each initialized diagram's state and pauses any playing frontier. Hiding or leaving the document stops playback; the observer is disconnected on page exit. There is no autoplay.

The original Canvas marker/wall interactions are pointer driven. Native timeline/button controls remain keyboard operable; this wrapper does not claim to retrofit full keyboard editing to the original canvas.

## Build and verify

```sh
node scripts/vendor-red-blob.mjs
node scripts/vendor-red-blob.mjs --verify
```

No network request, dependency installation or app-package change is required. The script checks the stored source-map hash before extracting original modules. `provenance.json` records every distributed file's content hash. Keep the original archive intact; make intentional hosting edits in `app.js`, `index.html`, and `style.css`, then rebuild the manifest.

## Integration

Host the local index in an iframe approximately 750 px high or open it full-page. The comparison diagrams stack below 660 px; the iframe scrolls naturally. This original needs Canvas2D, not WebGL. `window.__motionAtlasOriginal.getState()` exposes the active diagram and actual start points, terrain and computed search state for inspection. The page requests only its local scripts and stylesheet.
