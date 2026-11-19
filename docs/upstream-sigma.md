# Original Sigma paper-network demo

Entry point: `public/vendor/sigma/index.html` (public path `vendor/sigma/index.html`). This is the upstream homepage demo, not a network redrawn for Atlas.

## Provenance and rights

- Upstream: https://github.com/jacomyal/sigma.js
- Pinned **commit**: `e7748c88c861f19cab00be80cb7f836c5fef61e8`, November 10, 2026. The Git commit API confirms this is a commit, whose tree is `ce2e6c94a632446b8b230d00f79a35ba60cbdf7e`.
- Demo: `packages/website/src/examples/homepage/demo.astro` and `load-dataset.ts`.
- Data: unchanged `packages/website/public/data/demo-nodes.csv` (1,339,692 bytes; 8,798 records) and `demo-edges.csv` (836,477 bytes; 71,077 records).
- Original code and runtime dependencies: MIT, with per-package notices retained.
- OpenAlex metadata: CC0. Authoritative policy: https://docs.openalex.org/additional-help/faq . This is metadata, not copies of paper full text.
- Hauora and Public Sans fonts: original binaries from the pinned Sigma repository, with separate OFL and Public Sans modification notices. Font license sources and hashes are recorded in `source/font-and-data-license-sources.json`.

Original files are retained byte for byte in `public/vendor/sigma/source/upstream/`. Runtime dependency versions and transitive integrity hashes are pinned in `source/package-lock.json`. `provenance.json` records hashes for the deliverable. Do not apply Atlas's MIT notice to the separate font/data licenses.

## What remains original

The original ~9,000-paper graph coordinates, diamond nodes, community palette, citation-size encoding, gold directed citations and pink coauthorship edges remain intact. Hover highlights the neighborhood and its direct/indirect edges. The original title search, datalist, exact-match selection, author labels, and camera focus animation are retained. Its theme follows the original Starlight preference / browser color preference behavior.

## Hosting adaptations

The build extracts Astro's HTML, script and CSS into a static local entry. CSV and font URLs become relative. The original graph code is bundled with Sigma 4.0.6, `@sigma/node-border` 4.0.0 and `@sigma/layer-webgl` 4.0.0; no substitute graph renderer is used. The unused Cascadia CSS declaration is omitted. Source/notices links and an honest WebGL2 error panel sit outside the original scene. A small inspection API and pagehide cleanup are appended.

No inherited analytics, CDN scripts, remote runtime fetches, or private review storage are included. All graph data and used fonts load from the same local folder.

## Build and verify

From repository root, with Node 22+ and npm:

```sh
node scripts/vendor-sigma.mjs
node scripts/vendor-sigma.mjs --verify
```

The script uses a fresh system temporary directory for npm dependencies and removes it afterward. It does not edit the app's `package.json` or install into the app's dependencies. The first run writes the lockfile; subsequent runs use `npm ci`. Edit `source/upstream/packages/website/src/examples/homepage/demo.astro` to change the original demo, then rebuild; document intentional divergence and refresh provenance.

## Integration and limits

Host this document in an iframe with a useful height, preferably 650–800 px, or open it as a full-page original. The renderer requires WebGL2; browsers with GPU contexts disabled receive a clear availability message and a link to Sigma's original site. A Canvas approximation is deliberately not substituted. Rendering has to be visually checked in a WebGL2-capable browser.

`window.__motionAtlasOriginal.getState()` exposes the real node/edge totals, selected/hovered node, query and camera state after successful initialization. The original dataset stays public and synthetic/private Atlas coaching data never enters it.
