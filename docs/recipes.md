# Editable recipes

Each recipe has a browser editor, supplied presets, an animated preview, and an inspectable data view. Apply edited input to rebuild the preview. Uploaded files are read locally and limited to **128 KiB per file**; the smaller recipe limits below keep the result readable and responsive.

Drafts live in page memory. Download input or a customized source project before closing or reloading. A scene/preset link does not contain your changes. A project download includes your chosen input and should be reviewed before you share it.

**Download input** saves a JSON file with the marker `motion-atlas-input-v1`, the recipe ID, the primary input, and the optional second text input. **Open file** recognizes this wrapper and restores the corresponding recipe, including a waterfall or maze whose raw input is CSV or text. You can also open a raw file in the formats below. A preference export is a separate file and belongs in the **Your picks → Import** control.

## Trace: timestamped events

Use JSON with an `events` array:

```json
{
  "title": "A correction changes the plan",
  "events": [
    {"time": 0, "actor": "Human", "label": "Request a draft", "status": "info"},
    {"time": 12, "actor": "Agent", "label": "Propose a route", "status": "working"},
    {"time": 20, "actor": "Human", "label": "Add an access constraint", "status": "warning", "detail": "The first entrance is closed."},
    {"time": 32, "actor": "Agent", "label": "Revise the route", "status": "success"}
  ]
}
```

`time` is elapsed seconds, from 0 through 86,400. Use 2–18 events and at most four distinct actors. Actor names may contain up to 32 characters, labels 140, details 400, and the optional title 72. The input is limited to 20,000 characters. `status` defaults to `info`; accepted values are `info`, `working`, `success`, `warning`, and `error`.

Events sort by time, with input order preserved for ties. Timeline spacing reflects supplied timestamps, while playback gives each event equal reading time. A 20-second gap in the trace is not a requirement to wait 20 seconds during playback. No missing event, causal connection, or outcome is inferred. Full text remains in the data view when a canvas label is shortened.

The supplied traces are fictional examples. Preset IDs: `human-correction`, `incident-response`, `ci-pipeline`.

## Waterfall: changes that reconcile

Use CSV with the header `label,value,type`:

```csv
label,value,type
Opening balance,100,start
New work,35,change
"Support, tools",-18,change
Closing balance,,total
```

Use 3–12 data rows. The first row must be `start`, the last `total`, and at least one row must be a `change`. Only the first row can be `start`. A `total` row is a checkpoint: it does not add its value to the running balance. Intermediate totals are allowed.

Leave a total value blank to compute it, or supply the expected total to validate it. A mismatch is reported rather than silently changing the data. Values must be finite numbers, optionally decimals or scientific notation; omit currency symbols and thousands separators. Negative balances and changes are supported. Keep labels within 120 characters and the input within 20,000 characters. Quote CSV labels containing commas and represent an embedded quotation mark as `""`.

The bars and data table come from arithmetic on the input. Supplied presets use illustrative quantities with no implied company, currency, or measured business outcome. Preset IDs: `monthly-cash`, `product-revenue`, `negative-balance`.

## Before / after: explain a text change

Enter the original text in **Before** and the revision in **After**. For example:

```python
def average(values):
    if len(values) > 0:
        return sum(values) / len(values)
    return None
```

```python
def average(values):
    if not values:
        return None
    return sum(values) / len(values)
```

Each version may contain up to 18 lines, 90 display columns per line, and 6,000 characters. Tabs display as four spaces. One version may be empty to show a pure addition or deletion; both cannot be empty.

Motion Canvas animates the text transition. A deterministic longest-common-subsequence comparison supplies the added, removed, and unchanged lines in the data view. Input is never executed. The comparison does not prove that two programs behave the same, improve performance, or preserve security properties.

Preset IDs: `python-guard`, `js-async`, `python-extract`.

## Fourier: combine harmonics

Choose a preset waveform:

```json
{"wave": "square", "terms": 5, "amplitude": 1}
```

`wave` accepts `square`, `saw`, or `sine`. Use 1–16 terms and an amplitude from 0 through 10. A sine contains exactly one term. With omitted fields, the model uses a square wave, five terms, and amplitude 1; a selected sine defaults to one term.

Or supply a custom set of harmonics:

```json
{
  "title": "A three-note mixture",
  "harmonics": [
    {"frequency": 1, "amplitude": 1},
    {"frequency": 2, "amplitude": 0.45, "phase": 1.57},
    {"frequency": 5, "amplitude": -0.2}
  ]
}
```

Use 1–16 harmonics with distinct integer frequencies from 1 through 64, amplitudes from −10 through 10, and phases from −2π through 2π radians. Phase defaults to 0. An optional title may contain up to 72 characters. Choose a preset or a custom harmonics array; do not mix preset parameters with a custom array.

The visualization computes the finite sum `Σ amplitude × sin(frequency × angle + phase)`. Square and sawtooth presets use standard sine-series coefficients. A finite approximation has rounded transitions and can overshoot near a discontinuity; that is part of the construction. No audio is generated.

**The drawing scale fits its coefficients.** Use the coefficient/data table to compare amplitudes across examples, rather than comparing pixel heights of separately auto-scaled previews.

Preset IDs: `square`, `saw`, `sine`, `custom`.

## Pathfinding: edit an ASCII maze

```text
#########
#S..#..G#
#.#.#.#.#
#.......#
#########
```

Use `S` for the start, `G` for the goal, `#` for a wall, and `.` for an open cell. Include exactly one start and one goal. All rows must have the same width: 2–24 columns and 2–16 rows. Lowercase `s`/`g` and Windows line endings are accepted; surrounding row whitespace is trimmed.

The model runs actual breadth-first search with four equal-cost neighbors, considered in the order right, down, left, up. A cell is queued once; expansion proceeds in increasing distance from the start. The search stops when the goal is removed from the queue, and parent links reconstruct a shortest route. Several shortest routes may exist; the fixed neighbor order makes the chosen route repeatable.

The data view exposes the expansion order, queue/frontier, distances, and result. Coordinates use `(row, column)`, starting at 1. An unreachable goal is a valid result, not a parsing error. This recipe does not support diagonal movement or weighted paths.

Preset IDs: `detour`, `openings`, `open`, `blocked`.

## Gallery scenes and scientific claims

The 48 gallery scenes are independent authored demonstrations. Sorting, binary search, and breadth-first search compute algorithm traces. Many geometric scenes use explicit mathematical constructions. AI activations, attention weights, token probabilities, forecasts, and business scenarios are illustrative rather than measurements from a trained model or operating company.

If you replace supplied data with real observations, keep the source, units, context, and transformations with your example. An attractive animation does not by itself establish a causal relationship, calibrated uncertainty, or measured improvement.
