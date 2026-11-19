# Original Setosa Markov Chains in Motion Atlas

Motion Atlas includes the licensed original **Markov Chains — Explained
Visually** article by **Victor Powell, with text by Lewis Lehe**. Its original
two-state matrix, linked transition diagram, moving weather sequences, D3
geometry, colors, and explanatory text are compiled from upstream source.

- Entry: [`public/vendor/setosa-markov/index.html`](../public/vendor/setosa-markov/index.html)
- Original: [Setosa’s Markov Chains article](https://setosa.io/ev/markov-chains/)
- Source: [`vicapow/explained-visually`](https://github.com/vicapow/explained-visually/tree/ad30bd277cf31af0cd7cadbd4f9b95981ee011d3)
- Pinned revision: `ad30bd277cf31af0cd7cadbd4f9b95981ee011d3`
- Original files: `client/explanations/markov-chains/index.jade`, `common.js`,
  `script.js`, and `style.less`, plus the shared templates and runtimes
- License: **MIT**, copyright 2015 Victor Powell and Lewis Lehe; full text in
  [`LICENSE`](../public/vendor/setosa-markov/LICENSE)
- Complete dependency notices:
  [`THIRD-PARTY-NOTICES.txt`](../public/vendor/setosa-markov/THIRD-PARTY-NOTICES.txt)
- Sources, dependency URLs, checksums, exclusions, and changes:
  [`provenance.json`](../public/vendor/setosa-markov/provenance.json)

## What is interactive locally

Change the original matrix’s **four probability sliders** and watch the linked
two-state diagram change. The other probability in that row adjusts to keep
the row normalized. Hover a cell to emphasize its corresponding transition.
Use the original speed sliders and compare the independent and persistent
weather sequences. These are the original application controls and animation.

### The separate large-matrix playground is linked, not bundled

The original article embeds a different application at
[`setosa.io/markov`](https://setosa.io/markov/index.html). That application’s
fullscreen source and license are not included in the verified MIT repository,
and no separate redistribution grant was verified. Atlas therefore replaces
that iframe and its related preset buttons with a clear attribution and a
user-initiated link. **Atlas does not claim to include that separate arbitrary
matrix editor.** The licensed article’s two-state editor remains included.

## Packaging changes and boundaries

The scoped build uses the original Jade templates and LESS styles with the
original checked-in **AngularJS 1.2.20** and **D3 3.4.11**. It does not rewrite
the visualization in React. Lato fonts are local, with their SIL Open Font
License. Analytics, social widgets, Disqus comments, and email signup are
removed. Unused global STIX-font and logo declarations are omitted from
generated CSS. A content security policy blocks external runtime requests;
`ng-csp` selects Angular’s existing CSP-compatible evaluator.

The original source lives unchanged under `public/vendor/setosa-markov/source`;
generated runtime files incorporate only the documented packaging changes.
Original shared `common.js` includes a small Facebook helper; its BSD license
and accompanying patent grant are retained alongside D3’s BSD-3-Clause,
AngularJS’s MIT, and Lato’s SIL OFL notices. The package uses no microphone,
account, backend, analytics, or remote runtime CDN.

This legacy original begins animating when opened and uses a 1024-pixel article
layout. Its host can be closed to stop execution; it has no comprehensive
pause, reduced-motion, or narrow-screen redesign. The weather sequences are
illustrative simulations, not observed weather records. The original source’s
probabilities and informal sequence-generation behavior are retained, so this
archived visualization should not be treated as a statistical validation tool.

## Editable source and reproduction

The original Jade, JavaScript, LESS, supporting templates, source metadata, and
licenses are included in `source/`. The original-source download also includes
the packaging scripts. No build tool or `node_modules` directory is shipped.

From the Atlas repository root:

```sh
python3 scripts/vendor-setosa.py
```

The build requires Python 3, Node, npm, and network access at packaging time.
It downloads the pinned repository and creates an isolated temporary toolchain
of **Jade 1.7.0**, **marked 0.3.2**, and **LESS 2.7.3** for trusted upstream
templates. It installs no dependencies into Atlas. Optional `--source` and
`--tools` arguments accept an existing pinned checkout and isolated toolchain.

The resolved toolchain is recorded in `source/build/package-lock.json`; copy
that build directory and run `npm ci --ignore-scripts`, then pass its location
with `--tools` for a locked reproduction. Font and notice files have explicit
SHA-256 checks. Serve the generated `index.html` over ordinary static HTTP.

The original authors retain their authorship and copyright. Their MIT license
and all dependency licenses remain with the package.
