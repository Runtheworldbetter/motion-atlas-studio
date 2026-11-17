# Editable recipes

Each recipe has an editor, examples, an animated preview, and a data table. Select **Render changes** after editing. Opened files are read locally and limited to **128 KiB per file**. Each recipe also has limits to keep its animation readable and responsive.

Download the input or project before closing or reloading the page to keep your edits. Share links open supplied examples. Project downloads contain your edited input; review it before sharing.

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

Events sort by time, with input order preserved for ties. Timeline spacing follows the supplied timestamps; playback gives each event equal reading time. The animation shows the events you supply. The data table keeps the full text when a canvas label is shortened.

The supplied traces are fictional examples. Preset IDs: `human-correction`, `incident-response`, `ci-pipeline`.

## Waterfall: changes to a running total

Use CSV with the header `label,value,type`:

```csv
label,value,type
Opening balance,100,start
New work,35,change
"Support, tools",-18,change
Closing balance,,total
```

Use 3–12 data rows. The first row must be `start`, the last `total`, and at least one row must be a `change`. Only the first row can be `start`. A `total` row is a checkpoint: it does not add its value to the running balance. Intermediate totals are allowed.

Leave a total value blank to compute it, or supply the expected total to check it. A mismatch produces an error. Values must be finite numbers, optionally decimals or scientific notation; omit currency symbols and thousands separators. Negative balances and changes are supported. Keep labels within 120 characters and the input within 20,000 characters. Quote CSV labels containing commas and represent an embedded quotation mark as `""`.

The bars and data table use the values you supply. Presets use fictional quantities in unspecified units. Preset IDs: `monthly-cash`, `product-revenue`, `negative-balance`.

## Code diff: compare two versions

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

Motion Canvas animates the text change. A longest-common-subsequence comparison identifies added, removed, and unchanged lines in the data table. Code is displayed as text and never executed.

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
  "title": "Three harmonics",
  "harmonics": [
    {"frequency": 1, "amplitude": 1},
    {"frequency": 2, "amplitude": 0.45, "phase": 1.57},
    {"frequency": 5, "amplitude": -0.2}
  ]
}
```

Use 1–16 harmonics with distinct integer frequencies from 1 through 64, amplitudes from −10 through 10, and phases from −2π through 2π radians. Phase defaults to 0. An optional title may contain up to 72 characters. Choose a preset or a custom harmonics array; do not mix preset parameters with a custom array.

The visualization computes the finite sum `Σ amplitude × sin(frequency × angle + phase)`. Square and sawtooth presets use standard sine-series coefficients. Using a finite number of terms rounds the transitions and can produce overshoot near a jump.

Each preview scales to fit its coefficients. Use the data table to compare amplitudes across examples.

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

Breadth-first search checks four equal-cost neighbors in the order right, down, left, up. Each cell is queued once, and cells are explored in increasing distance from the start. The search stops when the goal is removed from the queue, then traces parent links back to the start to find a shortest route. When several shortest routes exist, the fixed neighbor order determines which one is shown.

The data table shows the exploration order, queue, distances, and result. Coordinates use `(row, column)`, starting at 1. A maze with an unreachable goal is accepted and shows that result. Movement is horizontal or vertical, with one unit of cost per step.

Preset IDs: `detour`, `openings`, `open`, `blocked`.

## Gallery data and calculations

The gallery has 48 examples. Sorting, binary search, and breadth-first search run the algorithms they show. Geometric scenes use the formulas described with each scene. AI activations, attention weights, token probabilities, forecasts, and business scenarios use synthetic examples.

If you use real data, include its source, units, context, and any transformations.
