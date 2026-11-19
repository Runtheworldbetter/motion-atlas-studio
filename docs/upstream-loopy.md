# Original LOOPY in Motion Atlas

Motion Atlas includes **Nicky Case’s original LOOPY v1.1**. Its drawing tools,
editable causal loops, positive and negative links, signal simulation, help
illustrations, and original visual design are preserved. This is the upstream
application running in its own frame.

- Entry: [`public/vendor/loopy/index.html`](../public/vendor/loopy/index.html)
- Source: [`ncase/loopy`](https://github.com/ncase/loopy/tree/2d8e13f0a006f4024f27ad1712d7f9c2c1ad7cd9)
- Pinned revision: `2d8e13f0a006f4024f27ad1712d7f9c2c1ad7cd9`, directory `v1.1/`
- Original license: **CC0 1.0 Universal**; full text in
  [`LICENSE.txt`](../public/vendor/loopy/LICENSE.txt)
- Dependency licenses: **MIT** for MinPubSub and Balloon.css; complete notices
  in [`THIRD-PARTY-NOTICES.txt`](../public/vendor/loopy/THIRD-PARTY-NOTICES.txt)
- File-level hashes and changes:
  [`provenance.json`](../public/vendor/loopy/provenance.json)

## What to try

Draw a circle to create a variable, draw an arrow between variables, and edit
the label or relationship. Press the original play control, then increase or
decrease a variable to send signals through the loop. Switch back to edit mode
to change the structure. The three upstream authored example models remain
available through **examples**. They are illustrative systems, not calibrated
predictive models.

The original **save as link** and **embed** controls serialize a model into a
URL using the local application address. No Atlas account or model service is
involved. Anyone receiving such a URL can read the model it contains. The app
retains its original unsaved-work prompt.

## Limited packaging changes

The source is copied directly without a framework conversion. The three
authored preset links are made local and target the LOOPY frame. Its footer-home
link points to the upstream LOOPY homepage instead of a missing local parent. The later
directory of community-contributed models is excluded because the application’s
license does not establish permission for every linked user model. No unknown
community model content is bundled.

All runtime assets are self-hosted. A content security policy prevents remote
script, style, image, and connection requests. Original author and help links
remain ordinary user-initiated links. No analytics is added. Main-app layout,
simulation code, artwork, and controls are otherwise unchanged.

The original editor starts in edit mode. Its separate `?embed=1` mode starts
the simulation automatically. It is a pointer-oriented legacy application;
Atlas does not claim that it has the same keyboard or reduced-motion behavior
as Atlas-authored studies. Closing its host frame stops its execution.

## Editable source and reproduction

All executable source is editable in `public/vendor/loopy/js`, `css`, `pages`,
and `index.html`. The Atlas original-source download includes these files and
their notices. There is no `node_modules` directory or external runtime CDN.

From the repository root:

```sh
python3 scripts/vendor-loopy.py
```

For an existing checkout at the pinned revision:

```sh
python3 scripts/vendor-loopy.py --source /path/to/loopy
```

The script needs Python 3 and network access while packaging. It downloads
the pinned upstream archive, copies `v1.1/`, applies only the changes above,
fetches checksum-verified full dependency notices, and writes the provenance
manifest. It does not modify Atlas dependencies. Runtime use needs only a
static HTTP server.

LOOPY remains Nicky Case’s work. The upstream CC0 dedication and dependency
licenses apply to these files; Atlas’s MIT license does not replace them.
