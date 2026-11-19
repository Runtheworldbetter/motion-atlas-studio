# Motion Atlas releases

## 0.6.0

Added **Originals**, a separate collection of six upstream projects with their original implementations, readable source, precise provenance and retained licenses. The existing Editor → Collection presentation, 50 gallery examples, seven editable recipes, 15 Atlas studies, and previous six music experiments remain available.

- **Spectrogram** brings the original Google Creative Lab renderer, instrument samples, drawing mode and optional explicit microphone input. It is also the seventh Music Lab tab, alongside the three Atlas instruments and three earlier Google originals.
- **LOOPY** preserves Nicky Case’s v1.1 system-drawing and signal-simulation application, including its three authored example models.
- **Setosa Markov chains** includes the licensed original article, probability sliders, transition matrix, diagrams and moving weather sequences. Its separate full playground remains an external link because no reuse grant for that application was verified.
- **Sigma’s paper network** preserves the original homepage demo, public OpenAlex metadata, search, camera focus, citation and co-authorship views.
- **Red Blob Games’ pathfinding** includes four sets of original plain-grid diagrams: frontier expansion, search stepping, weighted routes, and Dijkstra/greedy/A* comparisons. StarRaven artwork and Conrec are not used at runtime.
- **Paper’s Metaballs and Warp** preserve the original shaders and preset values, with standalone Atlas hosting controls.
- Every original has **Open full size**, **Restart**, **Copy launch link**, source/credit links and a dedicated source ZIP at `originals/<id>-source.zip`. Links use `#originals/<id>`; Spectrogram also uses `#music-lab/original-spectrogram`.
- Original frames unload when closed. Silent originals stay mounted while the page is hidden, preserving edits; Spectrogram unloads to stop audio and microphone access. Music starts only through interaction, and pending Spectrogram audio starts are cancelled on stop/hide.
- The local packages include their runtime assets, editable source, README, build instructions where needed, provenance and full notices. They make no external runtime requests. Ordinary Atlas builds use the checked-in original distributions.
- Apache-2.0, MIT, CC0, dependency, font and data terms remain attached to the relevant packages. Atlas-authored code stays MIT; it does not relicense upstream originals.
- Updated the website guide, README, [Originals guide](originals.md), attribution and [Spectrogram integration guide](upstream-spectrogram.md). The mechanical watch, shuttle and Voyager experiences are not included.

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
