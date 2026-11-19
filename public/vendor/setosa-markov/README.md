# Markov Chains — Explained Visually, original article

By Victor Powell, with text by Lewis Lehe. Original MIT source:
https://github.com/vicapow/explained-visually/tree/ad30bd277cf31af0cd7cadbd4f9b95981ee011d3

Open `index.html` through an HTTP static server. This package preserves the
original article, two-state probability sliders and linked transition diagram,
moving weather sequences, D3 graph geometry, colors, and Lato typography.
The exact upstream editable Jade, JavaScript, LESS, and relevant templates are
in `source/`. The original D3 3.4.11 and AngularJS 1.2.20 runtimes are local.

## Scope and packaging changes

The separate fullscreen playground at `setosa.io/markov` is not part of the
licensed repository, and no separate reuse grant was verified. Its remote
iframe and related example buttons are replaced by a clearly labeled link.
The original two-state matrix editor in this article remains fully included.
We do not claim that the complete separately hosted playground is bundled.

Analytics, social widgets, comments, and email signup are removed. Fonts are
self-hosted. A same-origin content security policy prevents remote runtime
requests; `ng-csp` selects Angular's existing CSP-compatible evaluator.
Unused global STIX-font and logo declarations are omitted from generated CSS.
All other diagrams, matrices, explanatory prose, animation, and interactions
are compiled from upstream. This is an archived original, not an Atlas rewrite.

The original animation begins when its frame is opened, and its legacy layout
is 1024 px wide. Use the surrounding Atlas open/close controls to start/stop it;
the article has no comprehensive pause, reduced-motion, or mobile redesign.
Weather sequences are original illustrative simulations, not observations.
The original controllers' probabilities are retained, including the informal
weather-sequence generator; do not treat it as a statistical validation tool.

## Reproduce

Run `python3 scripts/vendor-setosa.py` from the Atlas checkout. Python 3,
Node, npm, and network access at packaging time are required. The script
downloads the pinned source, compiles only this article in a temporary
directory, and installs no Atlas dependencies. Legacy build tools are
Jade 1.7.0, marked 0.3.2, and LESS 2.7.3, used on trusted pinned templates.
An isolated existing tool directory can be supplied with `--tools`; a pinned
source checkout can be supplied with `--source`. `source/build/package-lock.json`
records the resolved build-tool tree; `npm ci --ignore-scripts` in a copy of
that directory reproduces it. No build tools or node_modules ship at runtime.

## Rights

Article/source: MIT, see `LICENSE`. D3: BSD-3-Clause. AngularJS: MIT.
Lato fonts: SIL OFL 1.1. The upstream shared helper includes a small Facebook
BSD-licensed function with its accompanying patent grant. Full notices are in
`THIRD-PARTY-NOTICES.txt`; provenance and file checksums are in `provenance.json`.
Original authorship and rights are retained.
