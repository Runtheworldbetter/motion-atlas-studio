#!/usr/bin/env python3
"""Package Nicky Case's original LOOPY v1.1; Python 3, no installed packages.

Run from any directory. --source accepts a checkout of the pinned revision.
Only public/vendor/loopy is written. Network is used at packaging time only.
"""
import argparse
import hashlib
import io
import json
from pathlib import Path
import shutil
import tempfile
import urllib.request
import zipfile

COMMIT = "2d8e13f0a006f4024f27ad1712d7f9c2c1ad7cd9"
REPO = "https://github.com/ncase/loopy"
ROOT = Path(__file__).resolve().parents[1]
NOTICES = [
    ("MinPubSub — Daniel Lamb — MIT", "https://raw.githubusercontent.com/daniellmb/MinPubSub/master/LICENSE.txt", "b1fd2f306753d8b073b260a3cc7df5f7a327fb67a9fa22429553af4af5059a7e"),
    ("Balloon.css — Claudio Holanda — MIT", "https://raw.githubusercontent.com/kazzkiq/balloon.css/master/LICENSE", "4303e6b81dd60c805a26d59f5e6a7efc1d6f6d554198b3793e50e9787f36209e"),
]


def fetch(url):
    with urllib.request.urlopen(url, timeout=60) as response:
        return response.read()


def digest(data):
    return hashlib.sha256(data).hexdigest()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", type=Path)
    parser.add_argument("--output", type=Path, default=ROOT / "public/vendor/loopy")
    args = parser.parse_args()
    with tempfile.TemporaryDirectory(prefix="atlas-loopy-") as work:
        source = args.source
        if source is None:
            archive = zipfile.ZipFile(io.BytesIO(fetch(f"https://codeload.github.com/ncase/loopy/zip/{COMMIT}")))
            archive.extractall(work)
            source = Path(work) / f"loopy-{COMMIT}"
        destination = args.output
        if destination.exists():
            shutil.rmtree(destination)
        shutil.copytree(source / "v1.1", destination)
        shutil.copy2(source / "LICENSE.txt", destination / "LICENSE.txt")
        upstream_hashes = {
            p.relative_to(source / "v1.1").as_posix(): digest(p.read_bytes())
            for p in sorted((source / "v1.1").rglob("*")) if p.is_file()
        }

        # Keep the three authored presets. The later directory links to other
        # people's models, for which this package makes no reuse assumption.
        examples = destination / "pages/examples/index.html"
        html = examples.read_text()
        marker = '\t\t<hr>\n\t\t<div id="more_examples">'
        if marker not in html:
            raise RuntimeError("Pinned example-gallery structure changed")
        html = html.split(marker, 1)[0] + "\n\t</div>\n</body>\n</html>\n"
        html = html.replace("http://ncase.me/loopy/v1.1/?data=", "../../index.html?data=")
        html = html.replace("target='_top'", "target='_parent'")
        examples.write_text(html)

        sidebar = destination / "js/Sidebar.js"
        text = sidebar.read_text()
        if "href='../'>LOOPY" not in text:
            raise RuntimeError("Pinned sidebar-home link changed")
        sidebar.write_text(text.replace("href='../'>LOOPY", "href='https://ncase.me/loopy/'>LOOPY"))

        index = destination / "index.html"
        html = index.read_text()
        policy = "default-src 'self' data:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; connect-src 'none'; frame-src 'self'; object-src 'none'; base-uri 'self'; form-action 'none'"
        html = html.replace("<head>", '<head>\n<meta http-equiv="Content-Security-Policy" content="' + policy + '">', 1)
        index.write_text(html)

        notices = ["LOOPY v1.1, original work by Nicky Case", f"Source: {REPO}/tree/{COMMIT}", "LOOPY is dedicated to the public domain under CC0 1.0 Universal.", "The complete dedication is in LICENSE.txt. Dependency licenses follow."]
        notice_sources = []
        for label, url, expected in NOTICES:
            body = fetch(url)
            if digest(body) != expected:
                raise RuntimeError(f"License checksum changed: {url}")
            notices.extend(["\n" + "=" * 72, label, "Source: " + url, body.decode("utf-8")])
            notice_sources.append({"name": label, "url": url, "sha256": expected})
        (destination / "THIRD-PARTY-NOTICES.txt").write_text("\n\n".join(notices) + "\n")
        readme = f"""# LOOPY — original v1.1

Original application by [Nicky Case]({REPO}), revision `{COMMIT}`.
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
"""
        (destination / "README.md").write_text(readme)
        provenance = {
            "name": "LOOPY", "author": "Nicky Case", "version": "1.1",
            "repository": REPO, "commit": COMMIT, "sourceDirectory": "v1.1",
            "license": "CC0-1.0", "entry": "index.html", "noticeSources": notice_sources,
            "modifications": ["Local preset links target the application frame", "Community-model link directory excluded", "Sidebar home link points to the upstream LOOPY homepage", "Same-origin content security policy added"],
            "upstreamFilesSha256": upstream_hashes,
            "filesSha256": {p.relative_to(destination).as_posix(): digest(p.read_bytes()) for p in sorted(destination.rglob("*")) if p.is_file()},
        }
        (destination / "provenance.json").write_text(json.dumps(provenance, indent=2) + "\n")
        print(f"Packaged LOOPY: {destination} ({len(provenance['filesSha256'])} files)")


if __name__ == "__main__":
    main()
