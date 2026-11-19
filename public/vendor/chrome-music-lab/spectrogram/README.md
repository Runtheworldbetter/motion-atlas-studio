# Spectrogram — original Chrome Music Lab

This is the original Google Creative Lab Spectrogram, packaged locally for Motion Atlas. Its spectral renderer, shaders, sample sounds, icon artwork, colors, drawing interaction and camera rotation come from the upstream project. This is not an official Google product.

**Open:** `index.html`, served over HTTP(S). It is a static application; `file://` does not support its local shader/audio requests reliably.

**Upstream:** [googlecreativelab/chrome-music-lab/spectrogram](https://github.com/googlecreativelab/chrome-music-lab/tree/e54bb414908da2b6286a6ad6431a5fcf8b68dc3f/spectrogram), commit `e54bb414908da2b6286a6ad6431a5fcf8b68dc3f`.

## Use

- Choose an instrument to hear its original sample and see its changing frequencies. Choose the same instrument again to stop. The samples loop, as in the original.
- Drag the spectral image horizontally while a sample plays to change the view.
- Choose **Draw sound**, then drag vertically on the canvas to draw a changing sine tone. Releasing the pointer stops that tone.
- The eight samples are Flute, Harp, Whistling, Trombone, Drum machine, Birds, Modem and Wine glass. The bottom strip scrolls horizontally on smaller screens.
- **Microphone (optional)** asks for permission only after it is chosen. It visualizes local microphone input without playing it through the speakers or uploading it. The sample and drawing modes need no microphone access.
- Drop an audio file on the experiment to inspect it locally. The file stays in the browser and is not uploaded.
- Tab to an instrument and press Enter or Space to activate it. Escape stops sound. The original drawing and camera controls remain pointer gestures.

Sound never starts on initial load. Leaving the tab, hiding/removing the frame, or sending the parent-frame message `{type: 'atlas-original-stop'}` stops sound, microphone tracks, pending starts and rendering. Returning does not restart playback.

## Requirements and limits

The original visual uses WebGL and Web Audio. If initialization fails, the page explains the requirement and offers full-size and original-source links; it does not replace the visual with a different animation. The original renderer has its own frequency view fallback on graphics hardware without vertex texture support. The canvas and instrument artwork remain the original visual system.

Microphone capture requires a secure origin and the browser's permission. An embedding page can opt in with `allow="microphone"`; this does not grant permission or begin capture. Without that policy, the experiment reports denied access and its other modes still work. A sandboxed frame needs `allow-scripts allow-same-origin` for the original local shader/audio requests.

There are no external runtime requests. Scripts, MP3s, shaders, images and fonts are served from this folder. The original repository's third-party links remain in comments and documentation; no analytics are loaded. The source link in the unavailable panel is an ordinary link opened only by the visitor.

## Editable source and reproducible build

`source/` retains the original Jade, SCSS, CommonJS, shaders, MP3s, SVG artwork, gesture sprite and historical Gulp configuration. Files with compatibility edits have a Motion Atlas change notice. The exact original file hashes are recorded in `upstream-sha256.json` so that changes can be compared with the pinned upstream source. The historical `source/README.md` describes the obsolete upstream build; use the procedure below instead.

The modern build tools are isolated from Atlas dependencies. The shipped static files do not need Node or a build step. To rebuild with Node 22 or later, run from the Motion Atlas repository root:

```sh
SPECTROGRAM_DIR="$PWD/public/vendor/chrome-music-lab/spectrogram"
SPECTROGRAM_BUILD_DIR="$(mktemp -d)"
cp "$SPECTROGRAM_DIR/build-package.json" "$SPECTROGRAM_BUILD_DIR/package.json"
cp "$SPECTROGRAM_DIR/build-package-lock.json" "$SPECTROGRAM_BUILD_DIR/package-lock.json"
npm ci --prefix "$SPECTROGRAM_BUILD_DIR" --ignore-scripts --no-audit --no-fund
ATLAS_SPECTROGRAM_BUILD_DIR="$SPECTROGRAM_BUILD_DIR" node "$SPECTROGRAM_DIR/build.mjs"
node "$SPECTROGRAM_DIR/check.mjs"
```

The build compiles the original template and SCSS, bundles CommonJS, concatenates the original O3D libraries, copies the original assets, and regenerates the original icon font from its 13 SVGs. Fonts and jQuery are already vendored in `source/`, so building does not download runtime assets. The build updates `provenance.json.distribution_sha256`. Do not add `node_modules` to this folder or to a source archive.

`check.mjs` checks runtime hashes, local asset references, JavaScript syntax, and asynchronous audio/microphone stop behavior using small Web Audio test doubles. Actual graphics/audio behavior also requires browser review on a WebGL-capable device.

## Changes and attribution

Packaged on **2026-11-18**. `provenance.json` lists every integration change and the font source commit. Changes cover local asset packaging, native audio unlocking, modern optional microphone access, stop/visibility handling, cancellation of stale downloads, keyboard button activation and an unavailable-renderer message. Original audio analysis, shaders, visual geometry, samples and icon artwork are preserved. The new file-drop adapter replaces an old externally credited loader; it uses browser APIs and does not add a network service.

The original work is Apache-2.0. O3D, Matrix4x4 and CameraController carry their retained BSD-style notices; jQuery 2.1.3 is MIT; Poppins and Roboto are SIL OFL 1.1. Integration and build additions are MIT. **Keep `LICENSE`, `THIRD-PARTY-NOTICES.txt`, the `licenses/` directory and source notices with redistributed copies.** These separate original licenses are not replaced by Atlas's MIT license.
