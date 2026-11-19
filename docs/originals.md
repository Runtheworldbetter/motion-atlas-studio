# Originals: use the work, keep the source

Version 0.6.0 adds six projects to [**Originals**](https://runtheworldbetter.github.io/motion-atlas-studio/#originals). These packages preserve the authors' implementations, visual systems, and relevant assets. Atlas supplies the collection, opening controls, source downloads, and documented hosting adapters.

The existing 50 gallery examples, seven editable recipes, 15 Atlas studies and earlier Music Lab instruments remain available. Originals is a separate collection. Spectrogram also appears as the seventh Music Lab tab, alongside the three Atlas experiments and the three previously included Google originals.

## Open, inspect, and take it with you

Open a card to enter the original. The surrounding controls provide **Open full size**, **Restart**, **Download source**, **Source on GitHub**, and **Copy launch link**. The launch link identifies the project; it does not contain its current edits. Closing the view removes its frame. Hiding the Atlas page unloads Spectrogram to stop audio and microphone access; use **Start again** to reopen it. Silent originals remain mounted while hidden, preserving edits such as a LOOPY model. An original's own animation can begin after its frame is opened, as documented below; sound still requires explicit interaction.

Each source ZIP includes the local runtime, readable source, project README, license notices, provenance, and applicable build instructions. The complete Atlas source ZIP includes these packages as well. Serve an extracted original over HTTP(S), following its README. The packaged runtime generally works immediately; its source rebuild can require an isolated tool installation.

| Original | Open in Atlas | Download its source | Local package |
| --- | --- | --- | --- |
| Spectrogram · Google Creative Lab | [Open Spectrogram](https://runtheworldbetter.github.io/motion-atlas-studio/#originals/spectrogram) | [spectrogram-source.zip](https://runtheworldbetter.github.io/motion-atlas-studio/originals/spectrogram-source.zip) | [`chrome-music-lab/spectrogram`](../public/vendor/chrome-music-lab/spectrogram/README.md) |
| LOOPY · Nicky Case | [Open LOOPY](https://runtheworldbetter.github.io/motion-atlas-studio/#originals/loopy) | [loopy-source.zip](https://runtheworldbetter.github.io/motion-atlas-studio/originals/loopy-source.zip) | [`loopy`](../public/vendor/loopy/README.md) |
| Markov chains · Victor Powell & Lewis Lehe | [Open Markov chains](https://runtheworldbetter.github.io/motion-atlas-studio/#originals/markov) | [markov-source.zip](https://runtheworldbetter.github.io/motion-atlas-studio/originals/markov-source.zip) | [`setosa-markov`](../public/vendor/setosa-markov/README.md) |
| A network of papers · Sigma.js contributors | [Open the network](https://runtheworldbetter.github.io/motion-atlas-studio/#originals/sigma) | [sigma-source.zip](https://runtheworldbetter.github.io/motion-atlas-studio/originals/sigma-source.zip) | [`sigma`](../public/vendor/sigma/README.md) |
| Inside a search · Amit Patel, Red Blob Games | [Open pathfinding](https://runtheworldbetter.github.io/motion-atlas-studio/#originals/pathfinding) | [pathfinding-source.zip](https://runtheworldbetter.github.io/motion-atlas-studio/originals/pathfinding-source.zip) | [`red-blob`](../public/vendor/red-blob/README.md) |
| Metaballs & Warp · Paper | [Open the shaders](https://runtheworldbetter.github.io/motion-atlas-studio/#originals/paper) | [paper-source.zip](https://runtheworldbetter.github.io/motion-atlas-studio/originals/paper-source.zip) | [`paper-shaders`](../public/vendor/paper-shaders/README.md) |

All local package paths above are under `public/vendor/`. Deep links use `#originals/<id>`; the IDs are `spectrogram`, `loopy`, `markov`, `sigma`, `pathfinding`, and `paper`. The new music tab is available at [`#music-lab/original-spectrogram`](https://runtheworldbetter.github.io/motion-atlas-studio/#music-lab/original-spectrogram).

## What is included

### Spectrogram

The original Chrome Music Lab spectral landscape, ten circular controls, eight selectable sound samples, icon artwork, drawing gestures and camera rotation are included. Choose an instrument, then drag the landscape to change the view. Choose **Draw sound** and drag vertically to draw a sine tone. Click a selected sample again, or press Escape, to stop.

The microphone is an explicit optional button. It requires browser permission and a secure origin; input is analyzed locally without speaker feedback or upload. Samples and drawing work without microphone access. Dropped sound files stay in the browser. Tab, Enter and Space operate the instrument buttons; the original drawing/camera interaction is pointer driven.

The package modernizes audio unlocking and microphone permission, packages fonts locally, and cancels late audio starts after stop or visibility loss. WebGL and Web Audio are required. The unavailable state preserves the original renderer and explains the requirement. [Full Spectrogram integration guide](upstream-spectrogram.md).

### LOOPY

This is Nicky Case's original **LOOPY v1.1** drawing and simulation application, including its edit/play interface, cursors, help illustrations and three authored example models. Draw nodes and causal connections, switch to play mode, then nudge a node to see signals move through the system. Selecting an example stays within the original's frame.

The contributed community-model directory is omitted. LOOPY's source is directly editable JavaScript, CSS and HTML; no framework migration is required. Its model-sharing URLs contain the model and are readable by the recipient. The original may prompt about unsaved edits. The ordinary Atlas entry opens in edit mode; LOOPY's separate `?embed=1` mode starts its simulation automatically.

### Setosa Markov chains

The package includes **the original licensed article and its interactive diagrams**: moving weather sequences, probability sliders, the two-state transition matrix and linked state diagram, D3 geometry, explanatory text and original Lato typography. Change a probability and follow the same value in the matrix and transition graphic.

The separately hosted full playground at `setosa.io/markov` is **linked only**. It is outside the licensed repository and a reuse grant for that application was not verified. Atlas does not claim to include that full playground.

The original article starts its diagrams when opened and uses a 1024-pixel layout. **Open full size** is useful for reading; the original does not provide a comprehensive pause, reduced-motion setting or mobile redesign. Its weather sequences are illustrative simulations. The upstream probability behavior is retained, so this is a teaching article rather than a statistical validation tool.

### Sigma paper network

This is Sigma's original homepage demo and public OpenAlex metadata: **8,798 paper records and 71,077 edge records**. Original coordinates, diamond nodes, community colors, citation-size encoding, gold citation edges and pink co-authorship edges are retained. Search a title, select it, and inspect the surrounding network. Hover and camera focus use the original behavior.

The package contains metadata, not paper full text. Its source, data, fonts and runtime dependencies are local and pinned. It requires WebGL2; a browser that cannot start the original graph renderer receives an availability message. The upstream Astro source is retained with its static packaging procedure.

### Red Blob Games plain-grid pathfinding

Four sets of original Canvas diagrams are included: frontier expansion, a numbered search stepper, linked unweighted/weighted routes, and linked Dijkstra/greedy/A* comparisons. Drag endpoints, edit walls or costs, and inspect the algorithm's actual search state. Frontier playback is finite and starts explicitly; the other diagrams respond to editing and stepping.

The original grid, search, layer, drag and slider code is retained. Atlas extracts the relevant original initializers into a standalone tabbed page, adds instructions and accessible names for native controls, and calls the original resize/redraw methods. The A* teaching example preserves the upstream score `cost_so_far + 1.01 × Manhattan distance`, disclosed in its interface.

The runtime uses plain grids. **StarRaven illustrated maps and sprites are excluded. Conrec is not imported or used at runtime.** Its original source and notices are retained unchanged in the archived source-map material. The article prose is not included. Canvas interaction remains pointer driven; native buttons and timelines support keyboard use. These diagrams need Canvas 2D and do not require WebGL.

### Paper Metaballs and Warp

The original **Paper Shaders 0.0.82** renderers, helpers, embedded noise texture and preset values are included unchanged. Atlas supplies a standalone control page for choosing Metaballs or Warp, selecting an upstream preset, and adjusting parameters. This preserves the original shaders; it does not claim to reproduce the entire Paper website or its editor.

WebGL2 is required. Reduced-motion preference starts playback paused, and Play enables it. The upstream mount pauses when hidden or offscreen; leaving releases the renderer. The renderer TypeScript and original React preset definitions remain in the package, with a documented rebuild.

## Pinned source and licenses

| Package | Exact upstream source | Applicable rights |
| --- | --- | --- |
| Spectrogram | [Chrome Music Lab `e54bb414908da2b6286a6ad6431a5fcf8b68dc3f`](https://github.com/googlecreativelab/chrome-music-lab/tree/e54bb414908da2b6286a6ad6431a5fcf8b68dc3f/spectrogram) | Apache-2.0; separate BSD-style helpers, MIT jQuery and SIL OFL fonts |
| LOOPY | [Nicky Case `2d8e13f0a006f4024f27ad1712d7f9c2c1ad7cd9`](https://github.com/ncase/loopy/tree/2d8e13f0a006f4024f27ad1712d7f9c2c1ad7cd9/v1.1) | CC0-1.0; MIT notices for MinPubSub and Balloon.css |
| Setosa Markov article | [Explained Visually `ad30bd277cf31af0cd7cadbd4f9b95981ee011d3`](https://github.com/vicapow/explained-visually/tree/ad30bd277cf31af0cd7cadbd4f9b95981ee011d3/client/explanations/markov-chains) | MIT article/source; BSD D3/helper notices, accompanying helper patent grant, MIT AngularJS and SIL OFL fonts |
| Sigma demo | [Sigma `e7748c88c861f19cab00be80cb7f836c5fef61e8`](https://github.com/jacomyal/sigma.js/tree/e7748c88c861f19cab00be80cb7f836c5fef61e8/packages/website/src/examples/homepage) | MIT code; OpenAlex metadata CC0; separate font licenses and notices |
| Red Blob diagrams | [Published source-map snapshot](https://www.redblobgames.com/pathfinding/a-star/build/_introduction.js.map), SHA-256 `a92677fadf5b4bfd7bb9290a28f6737c23042f5c004061ad4d8527afd909be4d` | Apache-2.0 original runtime; separate archived, unused Conrec notices retained verbatim |
| Paper shaders | [Paper `e7003a2d4e6e932e30b8fa11ec1239e6ea48e16a`](https://github.com/paper-design/shaders/tree/e7003a2d4e6e932e30b8fa11ec1239e6ea48e16a), version 0.0.82 | Apache-2.0; retain `LICENSE` and `NOTICE` |

Each package's `provenance.json` records its precise source and distribution hashes. Red Blob's published source is pinned by its content hash, rather than a Git revision. Package READMEs record changes and reproducible build steps. Full copyright and license text travels in the package; the site's [aggregate notices](../public/third-party-notices.txt) provide an additional index.

When reusing an original, retain its licenses, copyright notices, attribution and modification notices. A project's license does not automatically cover unrelated website assets or separate demos. Atlas's MIT license applies to Atlas-authored code and does not replace upstream terms. The packaged originals make no external runtime requests; outbound creator/source links are visitor-initiated.

## Relation to the existing Atlas studies

The 15 Atlas studies continue to use their own illustrative models and source notes. For example, the Atlas Markov and material studies remain available with their existing controls and exports. They are separate from Setosa's original article and Paper's original shaders. The earlier three Google instruments are also retained in Music Lab with [their original provenance record](upstream-music-lab.md).

The mechanical watch, shuttle and Voyager experiences are not part of this release. This collection contains the six packages listed above, with explicit scope and source for each.
