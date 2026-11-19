# LOOPY — original v1.1

Original application by [Nicky Case](https://github.com/ncase/loopy), revision `2d8e13f0a006f4024f27ad1712d7f9c2c1ad7cd9`.
Run `index.html` from an HTTP static server. All runtime scripts, styles,
icons, cursors, help illustrations, and credits artwork are local.

This is the original drawing and simulation application, including its
original edit/play controls and three authored example models. The model
directory contributed by other people is excluded. Selecting an authored
example navigates this application rather than the surrounding Atlas page.
Source code is directly editable in `js/`, `css/`, `pages/`, and `index.html`.

## Packaging changes

- Copy the upstream `v1.1/` directory without rebuilding or redesigning it.
- Remove the community-model link directory from the examples page.
- Make the three retained example links local and target the application frame.
- Point the original LOOPY footer-home link to its actual upstream homepage.
- Add a same-origin content security policy; no analytics or remote runtime
  resources are loaded. Author and external help links remain user-initiated.
- Include the original CC0 dedication, complete dependency notices, and hashes.

LOOPY stores model content in share URLs; it has no Atlas account or server
storage. Treat any shared model URL as readable by its recipient. Editing
may show the original unsaved-work prompt. The default launch is edit mode;
the original `?embed=1` mode starts its simulation automatically.

## Reproduce

From the Atlas checkout, run `python3 scripts/vendor-loopy.py`. Or provide a
checkout at the pinned revision with `--source /path/to/loopy`. The script
uses Python's standard library and fetches dependencies only while packaging.
The dependency notices are checksum-pinned; changes fail the build.

## Rights

LOOPY: CC0 1.0 Universal, see `LICENSE.txt`. MinPubSub and Balloon.css: MIT,
see `THIRD-PARTY-NOTICES.txt`. These original rights and authorship remain
with their respective creators; Atlas does not relabel the work as its own.
