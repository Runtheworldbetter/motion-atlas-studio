# Motion Atlas releases

## 0.5.1 — 18 November 2026

The original Editor → Collection presentation is restored. Explore and Music Lab follow the collection, while the existing 50 gallery scenes, seven editable recipes, players, and coaching tools remain unchanged.

- Explore now contains 15 studies. The spacecraft study was removed; the original Voyager experience is omitted because an applicable reuse or embedding grant could not be verified.
- Restored **Correct one assumption**, **Follow the same object**, and **Words that take shape** from the earlier New Directions prototype, preserving their original illustrations and interactions. The examples use fictional evidence, books, reading times, and an illustrative word sequence.
- The gear study restores the earlier responsive illustration, detailed gear faces, orientation markers, large turn readouts, and finite full-cycle playback. Speed and isolation remain available below the figure.
- Music Lab retains the three Atlas experiments and adds the original Chrome Music Lab **Harmonics**, **Strings**, and **Sound Waves**, served locally from pinned upstream commit `e54bb414908da2b6286a6ad6431a5fcf8b68dc3f`.
- Six experiment tabs share one active surface, with labels identifying Atlas and upstream originals. Audio stops on switch or page hide; an upstream original unloads and starts fresh when revisited.
- Original Sound Waves requires WebGL. An availability message with original/source links appears when it cannot run; the original particle renderer is not replaced with a simplified animation.
- Atlas's melody JSON import/export and WAV download remain available. These controls are specific to Make a melody.
- Chrome Music Lab's Apache-2.0 license and included third-party notices are retained separately from Atlas's MIT license. [Upstream music provenance](upstream-music-lab.md) records source, modifications, and notices.
- The vendored originals make no external runtime requests. No private source materials, photographs, videos, or coaching records are included.

## 0.5.0

Added explorable studies across stories, systems, AI, probability, physics, and materials, plus three original Atlas Music Lab experiments. Studies include category/search filters, a repair capability filter, expanding detail views, source/model notes, deep links, and SVG or PNG frame and JSON state exports. Music Lab introduced sound/spectrum exploration, additive timbre controls, and a melody grid with JSON and WAV downloads.

## 0.4.0 — 18 November 2026

The cricket study now plays a complete straight drive with continuous movement through its checkpoints. The pose model uses continuous position, velocity, and acceleration tracks; both hands stay on a rigid bat and limbs retain their lengths. The front foot settles before contact and the body continues into extension and a gradual finish.

- New Complete straight drive view in Cricket, collection previews, scene dialog, and embeds.
- Side and bowler cameras; left-handed, right-handed, and comparison modes.
- Stable numbered bat imprints for backlift, contact, and extension; no arm-layer swapping during the stroke.
- Pause, scrub, three playback speeds, checkpoint inspection, reduced-motion stepping, and explicit replay.
- Share the exact view and paused frame; export a labelled SVG with hand roles and the imprint key.
- Existing editable Motion Canvas keyframe studies remain under Custom keyframes.
- Motion Atlas GitHub becomes the main source link. Atlas documentation covers the editor, cricket, AI explanations, reuse, and the underlying Motion Canvas library.
- Public video references and reviewed sequences are documented in [the cricket guide](cricket.md). The model is an authored teaching illustration, not motion capture.

Validation: 67 automated tests pass, including limb/grip invariants, exact contact, transition continuity, handedness, and planted-foot checks. The production build and source archive include the new player and documentation.

This release contains generic code and documentation; no personal photographs, videos, or coaching records.
