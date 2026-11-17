# Editable recipes

Each recipe has an editor, examples, an animated preview, and a data table. Select **Render changes** after editing. Opened files are read locally and limited to **128 KiB per file**. Each recipe also has limits to keep its animation readable and responsive.

Cricket and Post-training also have stage buttons. Selecting one pauses at that point. Use the timeline to inspect nearby frames, or play to continue. Both hold their last frame at the end.

Download the input or project before closing or reloading the page to keep your edits. Share links open supplied examples. Project downloads contain your edited input; review it before sharing.

**Download input** saves a JSON file with the marker `motion-atlas-input-v1`, the recipe ID, the primary input, and the optional second text input. **Open file** recognizes this wrapper and restores the corresponding recipe, including a waterfall or maze whose raw input is CSV or text. You can also open a raw file in the formats below. A preference export is a separate file and belongs in the **Your picks → Import** control.

## Cricket: inspect a swing

Use **Left-handed** or **Right-handed** above the input. The grip close-up names the top and bottom hands, and the main figure labels the front and back feet. A left-handed batter has the right hand on top and right foot in front; a right-handed batter has the left hand on top and left foot in front. **Flip camera view** changes screen direction independently. The front arm connects to the top hand in both modes.

Mode changes keep your edited poses, current frame, play/pause state, and playback speed. Fix an invalid input before switching modes. Preset selection keeps your handedness; the reversed-view preset changes the camera direction. Share links and recipe embeds include both settings. For example, append `&handedness=right&mirror=0` to a cricket recipe link to choose a right-handed batter with the bowler to the right. Input and project downloads also retain these settings.

The four keyframes describe Set-up, Downswing, Contact, and Follow-through, in that order:

```json
{
  "title": "A drive, frame by frame",
  "handedness": "left",
  "transitionSeconds": 2.4,
  "contactHold": 2.1,
  "mirror": false,
  "showTraces": true,
  "frames": [
    {"grip": [35, -74], "batAngle": 223, "hip": [0, 0], "lean": -6, "frontFoot": 72},
    {"grip": [46, -44], "batAngle": 132, "hip": [4, 0], "lean": -2, "frontFoot": 97},
    {"grip": [61, -18], "batAngle": 72, "hip": [10, 1], "lean": 4, "frontFoot": 104},
    {"grip": [69, -61], "batAngle": -36, "hip": [12, 0], "lean": 9, "frontFoot": 104}
  ]
}
```

Coordinates are synthetic two-dimensional drawing units: positive x points right and positive y points down. `batAngle` is clockwise from the rightward horizontal; 90° points down. `lean` rotates the torso in degrees. `mirror` flips the drawing horizontally. The supplied poses illustrate an annotation tool and are not measurements from a player's video.

Include exactly four frames. Each needs `grip` and `batAngle`; omitted `hip`, `lean`, and `frontFoot` values use that phase's defaults. Limits are:

| Field | Accepted values |
| --- | --- |
| `grip` | `[x, y]`, x from 0 to 90, y from −100 to −10 |
| `batAngle` | −360° through 360° |
| `hip` | `[x, y]`, x from −12 to 18, y from −8 to 8 |
| `lean` | −12° through 12° |
| `frontFoot` | 60 through 112 |
| `transitionSeconds` | 1–4 seconds; default 2.4 |
| `contactHold` | 0.8–4 seconds; default 2.1 |
| `handedness` | `"left"` or `"right"`; presets use `"left"`, omitted values in older inputs use `"right"` |
| `mirror`, `showTraces` | Booleans; defaults `false`, `true` |
| `title` | Optional, 1–60 characters on one line |

The input is limited to 16,000 characters. Poses that stretch an arm or leg beyond its fixed reach are rejected, including checks between keyframes.

The bat stays the same length, and the two hands remain 18 drawing units apart on its handle. The ball's path is constructed so its surface touches the blade face at Contact. Stage buttons pause at each named phase; **−1 frame** and **+1 frame** move through the illustration one frame at a time at 30 fps. The contact hold makes the ball position easier to inspect, and the close-up shows both hands on the handle. Earlier bat endpoints retain their numbered phase labels. **Inspect values** reports the geometry behind the drawing.

The supplied presets are:

- [`drive-contact`](https://runtheworldbetter.github.io/motion-atlas-studio/?recipe=cricket&example=drive-contact): the forward-step sequence shown above.
- [`later-grip`](https://runtheworldbetter.github.io/motion-atlas-studio/?recipe=cricket&example=later-grip): moves the grip back and makes the bat more upright at Contact.
- [`mirrored-drive`](https://runtheworldbetter.github.io/motion-atlas-studio/?recipe=cricket&example=mirrored-drive): flips the same sequence horizontally to match the opposite camera direction.

## Post-training: change what earns a reward

Supply a prompt and three possible reply strategies:

```json
{
  "title": "Reward evidence",
  "prompt": "How should we explain agent memory?",
  "learningRate": 0.8,
  "rounds": 24,
  "actions": [
    {"label": "Guess confidently", "probability": 0.45, "reward": 0},
    {"label": "Check evidence", "probability": 0.30, "reward": 1},
    {"label": "Avoid answering", "probability": 0.25, "reward": -0.2}
  ]
}
```

The model computes a policy-gradient update for this single prompt. All three reward scores are supplied on each update. The example replies, starting probabilities, and scores are synthetic.

| Field | Accepted values |
| --- | --- |
| `actions` | Exactly three actions with distinct labels |
| `label` | 1–32 characters |
| `probability` | 0.001–0.998; the three values must add up to 1 |
| `reward` | −2 through 2 |
| `learningRate` | 0–2; default 0.8 |
| `rounds` | Integer 1–80; default 24 |
| `prompt` | Required, 1–100 characters |
| `title` | Optional, 1–72 characters |

The input is limited to 12,000 characters. A zero learning rate freezes the starting policy. Giving every action the same reward also leaves its probabilities unchanged.

The calculation starts with `zᵢ = log(pᵢ)`. On each update it computes `J = Σ pᵢrᵢ`, adds `learningRate × pᵢ(rᵢ − J)` to each logit `zᵢ`, then obtains the new probabilities with softmax. This is the exact gradient of the supplied expected reward for a categorical policy. [OpenAI Spinning Up](https://spinningup.openai.com/en/latest/spinningup/rl_intro3.html) explains softmax policies, policy gradients, and reward baselines.

Select **Before**, **Reward**, **Update**, or **After** to pause at that stage. The 100 dots show rounded probability shares; they are allocated by largest remainder so the total stays 100. Numeric labels use the computed probabilities. **Inspect values** includes every update's probabilities, expected reward, and logit gradient.

The presets keep the same starting probabilities and change the scores:

- [`evidence`](https://runtheworldbetter.github.io/motion-atlas-studio/?recipe=post-training&example=evidence): checking evidence earns the highest reward.
- [`confidence`](https://runtheworldbetter.github.io/motion-atlas-studio/?recipe=post-training&example=confidence): a confident guess earns the highest reward.
- [`equal-reward`](https://runtheworldbetter.github.io/motion-atlas-studio/?recipe=post-training&example=equal-reward): equal scores produce no preference change.

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

The gallery has 50 examples. Sorting, binary search, and breadth-first search run the algorithms they show. Geometric scenes use the formulas described with each scene. The cricket scene uses constructed pose keyframes. The post-training scene computes probability updates from synthetic starting probabilities and reward scores. Other AI activations, attention weights, token probabilities, forecasts, and business scenarios use synthetic examples.

If you use real data, include its source, units, context, and any transformations.
