# Original Chrome Music Lab experiments

Motion Atlas keeps its own three music experiments and includes three original
Chrome Music Lab instruments: **Harmonics**, **Strings**, and **Sound Waves**.
These are portable distributions of the original implementation. Their drawing
code, colors, instrument geometry, and included artwork are retained.

## Source and version

- Project: [Google Creative Lab — Chrome Music Lab](https://github.com/googlecreativelab/chrome-music-lab).
- Exact upstream commit: [`e54bb414908da2b6286a6ad6431a5fcf8b68dc3f`](https://github.com/googlecreativelab/chrome-music-lab/commit/e54bb414908da2b6286a6ad6431a5fcf8b68dc3f), dated 2022-12-16.
- Atlas packaging date: 2026-11-18.
- Original project: [musiclab.chromeexperiments.com](https://musiclab.chromeexperiments.com/).
- Primary license: [Apache License 2.0 in the upstream repository](https://github.com/googlecreativelab/chrome-music-lab/blob/e54bb414908da2b6286a6ad6431a5fcf8b68dc3f/LICENSE).

Google archived the source repository in April 2026. The pinned source remains
available under its existing license; Atlas does not depend on a live Google
asset server to run these three distributions.

## Included instruments

| Original | Upstream source | Atlas entry point | Interaction and implementation |
| --- | --- | --- | --- |
| Harmonics | [`harmonics & strings/`](https://github.com/googlecreativelab/chrome-music-lab/tree/e54bb414908da2b6286a6ad6431a5fcf8b68dc3f/harmonics%20%26%20strings) | [`harmonics.html`](../public/vendor/chrome-music-lab/harmonics.html) | Touch or hold a column to activate its harmonic. Original Canvas drawing and Tone.js synthesis; six frequencies related to a 174.61 Hz fundamental. |
| Strings | Same source directory, mode 1 | [`strings.html`](../public/vendor/chrome-music-lab/strings.html) | Drag across or pluck the strings. Original Canvas geometry, interaction, and eleven included harp recordings. |
| Sound Waves | [`soundwaves/dist/`](https://github.com/googlecreativelab/chrome-music-lab/tree/e54bb414908da2b6286a6ad6431a5fcf8b68dc3f/soundwaves/dist) | [`soundwaves.html`](../public/vendor/chrome-music-lab/soundwaves.html) | Play the original piano to drive the blue particle field; use the face/zoom control to inspect the motion of a particle. Original WebGL renderer, shaders, piano, and artwork. |

Each entry point is a self-contained HTML file. JavaScript and CSS are inline;
the Strings MP3s and Sound Waves SVGs are embedded as data URLs. The SVGs retain
their original embedded PNG artwork. There are no external scripts, fonts,
audio requests, analytics, microphone requests, or login requirements.

## Licenses and asset provenance

The root Apache-2.0 license is retained in
[`LICENSE-APACHE-2.0.txt`](../public/vendor/chrome-music-lab/LICENSE-APACHE-2.0.txt).
Full library notices are collected in
[`THIRD-PARTY-NOTICES.txt`](../public/vendor/chrome-music-lab/THIRD-PARTY-NOTICES.txt).
These files must accompany redistribution. The original experiment code is not
relicensed as Atlas's MIT code.

The audit inspected the included code, package manifests, source map, original
MP3 directory, SVG files, and third-party license files. No separate asset
license or attribution exception appears for the eleven harp MP3s or the
original Sound Waves images distributed in those upstream directories. Their
source and original byte hashes are recorded in the provenance manifest.
No media was copied from the hosted Chrome Music Lab website.

The main separate library licenses are:

- **Tone.js 0.6.1 / r6:** MIT, copyright 2014–2015 Yotam Mann. Harmonics and
  Strings use the exact Tone build already included in the Sound Waves source
  map, replacing their original remote script URL.
- **StartAudioContext.js:** MIT, copyright 2016 Yotam Mann. Its source header is
  retained; the native resume adapter replaces its obsolete iOS unlock path.
- **Sound Waves GL helpers:** MIT notices for `a-big-triangle`, `gl-buffer`,
  `gl-fbo`, `gl-shader`, `gl-vao`, `gl-texture2d`, and their retained numerical
  helpers are preserved. Lodash, Buffer, Browserify's loader, and their retained
  helpers also keep their own MIT notices.
- **weak-map:** Apache-2.0, copyright 2011 Google Inc.; its original header and
  the full Apache license are retained.

The published source map was compared with historical npm package contents to
identify retained dependency source and license texts. The six libraries already
vendored by Google use Google's included license copies. The manifest names
the license evidence for each retained package; its package version field is
explicitly a **license-reference version**, because unchanged code can occur in
several releases. The authoritative application version is the pinned Google
commit, not a newly resolved dependency graph.

The original Sound Waves entry point imports an unused Deku UI implementation
and an unused alternative keyboard. Those imports and their 30 unreachable
Browserify modules were removed. The active original piano, shaders, particle
renderer, and sound synthesis are unchanged. This also removes an unused
`get-uid` dependency whose package declares an ambiguous `Unlicensed` value.
No permission is inferred from that value.

Apache-2.0 requires retaining the license and applicable notices and identifying
modified files. Every generated HTML includes a prominent change notice, and
the inlined source sections identify their original paths. Chrome Music Lab
and Google are credited as the origin; Atlas does not claim endorsement or
ownership of the original experiments.

## Compatibility changes

The original source predates current browser audio policies. Atlas makes the
following contained changes:

1. Inline the original assets and dependencies into portable HTML files.
2. Select Harmonics mode 0 and Strings mode 1 through separate entry points. The
   upstream default and query parser could only select Strings.
3. Correct two upstream touch-event issues: `touchStarted(event)` uses its
   actual event argument, and touch-cancel branches reference `MODE` correctly.
4. Suspend the AudioContext initially and resume it on a pointer, touch, or key
   gesture inside the experiment. This replaces the old iOS-only overlay.
5. Suspend audio when the document becomes hidden or the frame loses focus;
   close contexts on `pagehide`. A message of type `atlas-original-stop` from
   the parent frame also suspends audio.
6. Give the original Sound Waves zoom control an accessible name and keyboard
   activation with Enter or Space.
7. Remove only the unused Sound Waves UI import branch described above and the
   obsolete external source-map URL.
8. Explain unavailable WebGL rather than leaving a blank Sound Waves frame.
   That message links to the original hosted experiment and pinned source.

The native audio adapter and accessibility additions are Atlas code under MIT.
The original algorithms and visual appearance remain upstream work.

## Runtime integration and limits

The Atlas Music Lab mounts one original iframe when its tab is selected and
removes it on a tab change or page hide. Returning to an original starts a new
session. Mounting a frame does not intentionally play audio; the first
interaction inside it unlocks audio. The original instruments do not share
Atlas's JSON/WAV export controls or its keyboard composition grid.

**Sound Waves requires WebGL.** When a browser cannot provide that context,
Atlas shows a clear availability message. It does not replace the original
with a different particle animation. The archived GL stack also generates
JavaScript functions at runtime; a host that forbids this through Content
Security Policy may prevent it from working. Keep that limitation visible;
do not weaken a host's security policy as a workaround.

The legacy Canvas instruments are primarily pointer/touch experiences. Their
surrounding Atlas controls and attribution links are keyboard accessible, but
these originals do not gain the full keyboard interaction model of the Atlas
sequencer merely by being embedded.

## Integrity record

[`provenance.json`](../public/vendor/chrome-music-lab/provenance.json) contains:

- `upstream_commit` and `upstream_commit_date`;
- `upstream_file_sha256`, mapping original repository paths to byte hashes;
- `distribution_sha256`, mapping the three distributed HTML filenames to byte hashes;
- each experiment's source directory and included assets;
- documented modifications and the retained/pruned Sound Waves module IDs;
- dependency license evidence.

Validate the distribution hashes after any edit, and update the manifest when
intentionally changing a vendored page. Keep the license and notice files with
the HTML in both the published site and the downloadable source archive.

## Originals not copied

**Rhythm, Kandinsky, Song Maker, and Oscillators** are not in the pinned Google
repository. The public source license therefore does not establish permission
to copy their website-only code, recordings, or artwork. They remain useful
originals to visit on the [Chrome Music Lab website](https://musiclab.chromeexperiments.com/).

The hosted pages returned no frame-blocking header during this audit, but
technical iframe support is not a redistribution license or an explicit
embedding grant. No assertion of permission is made from those headers.

Melody Maker is published in the Apache repository and uses synthesized sound,
but it has no checked-in build and relies on the old Webpack 1 / node-sass 3
toolchain. Arpeggios likewise needs a rebuild and references instrument samples
on an external Google server that are not included with its published source.
Those are candidates for a separate, explicit build and asset audit.
