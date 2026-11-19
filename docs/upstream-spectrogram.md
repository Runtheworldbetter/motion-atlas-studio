# Original Chrome Music Lab Spectrogram

Motion Atlas includes a faithful local packaging of the original **Spectrogram**, from [Google Creative Lab's Apache-licensed repository](https://github.com/googlecreativelab/chrome-music-lab/tree/e54bb414908da2b6286a6ad6431a5fcf8b68dc3f/spectrogram).

**Entry:** `public/vendor/chrome-music-lab/spectrogram/index.html`  
**Pinned commit:** `e54bb414908da2b6286a6ad6431a5fcf8b68dc3f`  
**Packaged:** 2026-11-18

The original green-to-yellow spectral landscape, circular instrument controls, instrument drawings, shaders, eight selectable samples and draw-a-tone interaction are retained. This is the original experiment with documented compatibility changes. It is not a new Atlas interpretation and does not require Motion Canvas.

## Interactions

Choose Flute, Harp, Whistling, Trombone, Drum machine, Birds, Modem or Wine glass. The original sample loops while its frequencies draw the spectral image. Clicking the same control again stops it. Dragging the landscape changes its viewing angle. Draw sound creates a sine tone that follows the pointer's vertical position. The bottom instrument strip scrolls on narrow screens.

The optional microphone button makes an explicit permission request. Its input is analyzed locally, is not fed back to the speakers, and is not uploaded. Sample/drawing modes need no microphone permission. Dropped sound files are decoded locally as well. Instrument buttons support Tab, Enter and Space; Escape stops playback. Drawing pitch and camera rotation retain their original pointer interaction.

Nothing plays on load. The integration suspends audio until a user interaction and stops sound, rendering, pending starts and all microphone tracks when the experiment loses visibility or receives a stop message from its parent. Atlas should remove the iframe when the selected original changes. Returning to it does not resume prior playback.

## Browser and embed requirements

WebGL and Web Audio are required. The unavailable state explains that requirement and links to the full-size experiment and pinned original source. It preserves the original visual rather than offering a replacement animation. On hardware without vertex texture support, the original renderer itself switches to its original frequency view.

All runtime resources are local: JavaScript, styles, audio, shader programs, images, icon font and text fonts. No analytics or remote locale/font calls are retained. The original synchronous shader requests require HTTP(S); a sandboxed iframe needs `allow-scripts allow-same-origin`. Optional microphone use also requires a secure origin, `allow="microphone"` on the iframe, and explicit browser permission. A visitor can use samples and drawing when microphone access is denied.

## Source, licenses and rebuilding

The complete editable experiment source and a locked, isolated build are in [the vendor folder](../public/vendor/chrome-music-lab/spectrogram/README.md). Its README contains exact build and verification commands. `upstream-sha256.json` records the original source file hashes; `provenance.json` records changes, pins and SHA-256 hashes of the built runtime. `node_modules` is neither included nor required for playback.

The [upstream Apache-2.0 license](https://github.com/googlecreativelab/chrome-music-lab/blob/e54bb414908da2b6286a6ad6431a5fcf8b68dc3f/LICENSE) covers the experiment and supplied assets, with separately retained BSD-style notices in its O3D/math/camera helpers. No separate exclusion was found for the included MP3s, SVG icons or gesture sprite. The bundled jQuery 2.1.3 runtime retains its MIT license. The locally served Poppins and Roboto fonts come from [google/fonts commit `5bd87dfc525c8a0d1d8529d3684716e00c3fc59a`](https://github.com/google/fonts/tree/5bd87dfc525c8a0d1d8529d3684716e00c3fc59a) with their SIL OFL licenses. Atlas's compatibility adapter and build script are MIT.

Preserve the vendor `LICENSE`, `THIRD-PARTY-NOTICES.txt`, `licenses/` files and original source headers when redistributing. The original experiment keeps its own licenses alongside the Atlas shell. This is not an official Google product, and no endorsement is implied.

## Compatibility changes

The integration replaces the obsolete build pipeline, packages the original font families and jQuery locally, makes labels local and accessible, and modernizes audio unlocking and optional microphone capture. It guards late sample decoding and permission responses so they cannot restart a stopped experiment. It also fixes two accidental JavaScript globals, pointer coordinates at zero, touch cancellation, and release outside the drawing canvas. A new local file-drop adapter uses `File.arrayBuffer()` and `decodeAudioData()`.

Sample playback uses a conservative gain of 0.65; sine drawing retains the original 0.2 gain. Shader math, original sample files, SVG artwork and rendering geometry are retained. The full modification list is machine-readable in `provenance.json`.
