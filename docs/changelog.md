# Motion Atlas releases

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
