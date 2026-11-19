#!/usr/bin/env python3
"""Package the licensed original Setosa Markov article; no Atlas runtime deps.

Python 3 + Node/npm are needed to reproduce. A temporary, isolated Jade/LESS
toolchain compiles trusted pinned templates; nothing is installed in Atlas.
"""
import argparse
import hashlib
import io
import json
from pathlib import Path
import re
import shutil
import subprocess
import tempfile
import urllib.request
import zipfile

COMMIT = "ad30bd277cf31af0cd7cadbd4f9b95981ee011d3"
REPO = "https://github.com/vicapow/explained-visually"
ROOT = Path(__file__).resolve().parents[1]
SOURCES = [
    "LICENSE", "README.md", "locals.json", "package.json", "gulpfile.js", "localsStore.js",
    "client/explanations/markov-chains/index.jade",
    "client/explanations/markov-chains/common.js",
    "client/explanations/markov-chains/script.js",
    "client/explanations/markov-chains/style.less",
    "client/explanations/markov-chains/fb-thumb.png",
    "client/templates/head.jade", "client/templates/explanation-head.jade",
    "client/templates/common.jade", "client/styles/style.less",
    "client/scripts/d3.js", "client/scripts/angular.js", "client/scripts/common.js",
]
ASSETS = [
    ("fonts/Lato-100.ttf", "https://raw.githubusercontent.com/google/fonts/main/ofl/lato/Lato-Thin.ttf", "663c55bfe9a38270fff44da273bf4d792eafc3e7e1201f62c3064cad80c5d5e7"),
    ("fonts/Lato-300.ttf", "https://raw.githubusercontent.com/google/fonts/main/ofl/lato/Lato-Light.ttf", "cf2a774503baf418d584f49967bd160e1e03f087c13b25602f28024ec7788f08"),
    ("fonts/Lato-400.ttf", "https://raw.githubusercontent.com/google/fonts/main/ofl/lato/Lato-Regular.ttf", "d636e4683231f931eda222d588e944d082bfd3bdba02f928bee461c0f185b251"),
]
LICENSES = [
    ("D3 3.4.11 — Mike Bostock — BSD-3-Clause", "https://raw.githubusercontent.com/d3/d3/v3.4.11/LICENSE", "10054db83ace18e5a455749d0d247857ec50508cecda79a5abe66fe4778d7721"),
    ("AngularJS 1.2.20 — Google, Inc. — MIT", "https://raw.githubusercontent.com/angular/angular.js/v1.2.20/LICENSE", "90b8af0852fa8fbd5398fa9e93133af2982ce8fc3e3f3b5fa56fed69238cd5f5"),
    ("Lato — Łukasz Dziedzic — SIL Open Font License 1.1", "https://raw.githubusercontent.com/google/fonts/main/ofl/lato/OFL.txt", "74ba064d03f1f1c4a952da936c3eb71866c34404916734de3cae73b34357e59e"),
    ("Facebook shallowEqual helper in upstream common.js — BSD license", "https://raw.githubusercontent.com/facebook/react/v0.13.2/LICENSE", "426ce3c23fa4006e34391ac67170a41ea6eb8bbd4bca2a8b16a7a37cef8b1f86"),
    ("Facebook shallowEqual helper — accompanying patent grant", "https://raw.githubusercontent.com/facebook/react/v0.13.2/PATENTS", "b3755ec187d97484fa9e3223828fb11057d0c544d6f2fded30a1dc65c6acca4e"),
]


def digest(body):
    return hashlib.sha256(body).hexdigest()


def fetch(url, expected=None):
    with urllib.request.urlopen(url, timeout=60) as response:
        body = response.read()
    if expected and digest(body) != expected:
        raise RuntimeError(f"Upstream checksum changed: {url}")
    return body


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", type=Path)
    parser.add_argument("--tools", type=Path, help="Existing isolated directory containing the pinned build tools")
    parser.add_argument("--output", type=Path, default=ROOT / "public/vendor/setosa-markov")
    args = parser.parse_args()
    with tempfile.TemporaryDirectory(prefix="atlas-setosa-") as temporary:
        temporary = Path(temporary)
        source = args.source
        if source is None:
            archive = zipfile.ZipFile(io.BytesIO(fetch(f"https://codeload.github.com/vicapow/explained-visually/zip/{COMMIT}")))
            archive.extractall(temporary)
            source = temporary / f"explained-visually-{COMMIT}"
        output = args.output
        if output.exists():
            shutil.rmtree(output)
        output.mkdir(parents=True)
        work = temporary / "compile"
        for relative in SOURCES:
            for destination in [output / "source" / relative, work / relative]:
                destination.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(source / relative, destination)
        shutil.copy2(source / "LICENSE", output / "LICENSE")
        for name in ["angular.js", "d3.js", "common.js"]:
            (output / "scripts").mkdir(exist_ok=True)
            shutil.copy2(source / "client/scripts" / name, output / "scripts" / name)
        shutil.copy2(source / "client/explanations/markov-chains/fb-thumb.png", output / "fb-thumb.png")

        index = work / "client/explanations/markov-chains/index.jade"
        text = index.read_text().replace("\nhtml\n", "\nhtml(ng-csp)\n", 1)
        text = text.replace("      a(href=basepath) Back", '      a(href="https://setosa.io/ev/" target="_blank" rel="noopener noreferrer") Explained Visually')
        text = text.replace("      +share\n", "").replace("    +footer\n", "").replace("    +disqus\n", "")
        start = text.index('        <iframe scrolling="no" class="playground"')
        end = text.index('        </script>', start) + len('        </script>')
        text = text[:start] + '''        **About the separate playground:** The original article links to an additional fullscreen matrix editor. That separately hosted application's reuse license has not been verified, so it is not bundled here. The original two-state matrix and all diagrams above remain interactive.

        [Open Setosa's original playground in a new tab](https://setosa.io/markov/index.html)
''' + text[end:]
        text = text.replace('    +disqus\n', '')
        index.write_text(text)
        head = work / "client/templates/head.jade"
        text = head.read_text()
        text = re.sub(r"if !dev\n  link\(href='//fonts.googleapis.com/[^\n]+\n", "", text)
        policy = "default-src 'self' data:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; connect-src 'none'; frame-src 'none'; object-src 'none'; base-uri 'self'; form-action 'none'"
        text = 'meta(http-equiv="Content-Security-Policy" content="' + policy + '")\n' + text
        head.write_text(text)
        tools = args.tools or temporary / "tools"
        if args.tools is None:
            tools.mkdir()
            subprocess.run(["npm", "install", "--prefix", str(tools), "--ignore-scripts", "--no-audit", "--no-fund", "jade@1.7.0", "marked@0.3.2", "less@2.7.3"], check=True)
        subprocess.run(["node", str(ROOT / "scripts/vendor-setosa.cjs"), str(work), str(output), str(tools)], check=True)
        # These are documentation links, never automatic network requests.
        html = (output / "index.html").read_text()
        html = html.replace('content=".fb-thumb.png"', 'content="./fb-thumb.png"')
        html = html.replace('<a href="https://setosa.io/markov/index.html">', '<a href="https://setosa.io/markov/index.html" target="_blank" rel="noopener noreferrer">')
        (output / "index.html").write_text(html)
        for name in ["package.json", "package-lock.json"]:
            if (tools / name).exists():
                destination = output / "source/build" / name
                destination.parent.mkdir(exist_ok=True)
                shutil.copy2(tools / name, destination)

        asset_sources = []
        for relative, url, expected in ASSETS:
            body = fetch(url, expected)
            destination = output / relative
            destination.parent.mkdir(parents=True, exist_ok=True)
            destination.write_bytes(body)
            asset_sources.append({"file": relative, "url": url, "sha256": expected})
        notices = ["Setosa / Explained Visually — Markov Chains", "Original visualization: Victor Powell. Original text: Lewis Lehe.", f"Source: {REPO}/tree/{COMMIT}", (source / "LICENSE").read_text()]
        notice_sources = []
        for title, url, expected in LICENSES:
            body = fetch(url, expected).decode("utf-8")
            notices += ["\n" + "=" * 72, title, "Source: " + url, body]
            notice_sources.append({"name": title, "url": url, "sha256": expected})
        (output / "THIRD-PARTY-NOTICES.txt").write_text("\n\n".join(notices) + "\n")
        (output / "README.md").write_text(f"""# Markov Chains — Explained Visually, original article

By Victor Powell, with text by Lewis Lehe. Original MIT source:
{REPO}/tree/{COMMIT}

Open `index.html` through an HTTP static server. This package preserves the
original article, two-state probability sliders and linked transition diagram,
moving weather sequences, D3 graph geometry, colors, and Lato typography.
The exact upstream editable Jade, JavaScript, LESS, and relevant templates are
in `source/`. The original D3 3.4.11 and AngularJS 1.2.20 runtimes are local.

## Scope and packaging changes

The separate fullscreen playground at `setosa.io/markov` is not part of the
licensed repository, and no separate reuse grant was verified. Its remote
iframe and related example buttons are replaced by a clearly labeled link.
The original two-state matrix editor in this article remains fully included.
We do not claim that the complete separately hosted playground is bundled.

Analytics, social widgets, comments, and email signup are removed. Fonts are
self-hosted. A same-origin content security policy prevents remote runtime
requests; `ng-csp` selects Angular's existing CSP-compatible evaluator.
Unused global STIX-font and logo declarations are omitted from generated CSS.
All other diagrams, matrices, explanatory prose, animation, and interactions
are compiled from upstream. This is an archived original, not an Atlas rewrite.

The original animation begins when its frame is opened, and its legacy layout
is 1024 px wide. Use the surrounding Atlas open/close controls to start/stop it;
the article has no comprehensive pause, reduced-motion, or mobile redesign.
Weather sequences are original illustrative simulations, not observations.
The original controllers' probabilities are retained, including the informal
weather-sequence generator; do not treat it as a statistical validation tool.

## Reproduce

Run `python3 scripts/vendor-setosa.py` from the Atlas checkout. Python 3,
Node, npm, and network access at packaging time are required. The script
downloads the pinned source, compiles only this article in a temporary
directory, and installs no Atlas dependencies. Legacy build tools are
Jade 1.7.0, marked 0.3.2, and LESS 2.7.3, used on trusted pinned templates.
An isolated existing tool directory can be supplied with `--tools`; a pinned
source checkout can be supplied with `--source`. `source/build/package-lock.json`
records the resolved build-tool tree; `npm ci --ignore-scripts` in a copy of
that directory reproduces it. No build tools or node_modules ship at runtime.

## Rights

Article/source: MIT, see `LICENSE`. D3: BSD-3-Clause. AngularJS: MIT.
Lato fonts: SIL OFL 1.1. The upstream shared helper includes a small Facebook
BSD-licensed function with its accompanying patent grant. Full notices are in
`THIRD-PARTY-NOTICES.txt`; provenance and file checksums are in `provenance.json`.
Original authorship and rights are retained.
""")
        provenance = {
            "name": "Markov Chains — Explained Visually", "authors": ["Victor Powell", "Lewis Lehe"],
            "repository": REPO, "commit": COMMIT, "license": "MIT", "entry": "index.html",
            "sourceDirectory": "client/explanations/markov-chains", "fontSources": asset_sources,
            "noticeSources": notice_sources, "buildTools": {"jade": "1.7.0", "marked": "0.3.2", "less": "2.7.3"},
            "excluded": ["Separate setosa.io/markov playground: no verified reuse grant", "Analytics, social widgets, comments, mailing-list signup", "Unused STIX font and logo CSS"],
            "modifications": ["Scoped Jade/LESS compilation", "Local runtime paths and fonts", "CSP-compatible Angular evaluation", "Unverified playground replaced by external user-initiated link"],
            "upstreamFilesSha256": {name: digest((source / name).read_bytes()) for name in SOURCES},
            "filesSha256": {p.relative_to(output).as_posix(): digest(p.read_bytes()) for p in sorted(output.rglob("*")) if p.is_file()},
        }
        (output / "provenance.json").write_text(json.dumps(provenance, indent=2) + "\n")
        print(f"Packaged Setosa Markov: {output} ({len(provenance['filesSha256'])} files)")


if __name__ == "__main__":
    main()
