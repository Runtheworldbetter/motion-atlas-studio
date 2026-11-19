# Sigma original homepage paper network

Original authors: the Sigma.js contributors. Code is distributed under the MIT license in `Sigma-MIT.txt`. The dependency notices in `DEPENDENCIES.md` also apply.

Upstream commit: `e7748c88c861f19cab00be80cb7f836c5fef61e8`.

- Original site: https://www.sigmajs.org/
- Exact demo source: https://github.com/jacomyal/sigma.js/blob/e7748c88c861f19cab00be80cb7f836c5fef61e8/packages/website/src/examples/homepage/demo.astro
- Dataset loader: https://github.com/jacomyal/sigma.js/blob/e7748c88c861f19cab00be80cb7f836c5fef61e8/packages/website/src/examples/homepage/load-dataset.ts

The two unchanged CSVs contain 8,798 paper records and 71,077 edge records from the original demo. Its attribution identifies OpenAlex metadata and a Louvain clustering in Gephi Lite. OpenAlex releases its metadata under CC0: https://docs.openalex.org/additional-help/faq . The CC0 legal text is included in `CC0-1.0.txt`. No paper full text, photograph, or private user material is included.

The unmodified Hauora and Public Sans webfonts are from this same pinned Sigma commit. They have their own terms: `Hauora-OFL.txt`, `Public-Sans-OFL.txt`, and `Public-Sans-LICENSE.md`. They are not relicensed under Sigma's MIT license. Unused Cascadia font declarations are omitted.

Motion Atlas only adapts hosting: extracts the original Astro markup/script/styles into a static document; changes data/font paths to local relative URLs; bundles the original dependencies; adds source links, a WebGL2-unavailable message, and page-exit cleanup. The graph layout, palettes, shape and size encodings, citation/coauthorship edges, hover neighborhood, search selection, and camera animation remain the original implementation.

No upstream website analytics, remote fonts, CDN scripts, or remote data requests are used. Links to upstream sites open only when followed.

Editable sources and the dependency lockfile are in `../source/`. From the Motion Atlas repository root, rebuild with `node scripts/vendor-sigma.mjs`; verify the checked-in files with `node scripts/vendor-sigma.mjs --verify`.
