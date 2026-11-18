# Cricket: inspect a complete straight drive

**[Open the complete stroke](https://runtheworldbetter.github.io/motion-atlas-studio/?recipe=cricket&example=full-stroke#studio)**

Open the **Cricket** tab. **Complete straight drive** is selected by default. The simplified figure shows the relationship between the hands, arms, bat, and feet through one authored straight drive. It is a teaching illustration, with synthetic positions and timing; it does not measure or grade a player's video.

## Follow the movement

Use **Play full stroke** to move from set-up through backlift, contact, extension, and finish. Pause at any moment, continue, or replay the whole stroke. The speed control slows the same movement for inspection. The timeline and checkpoint buttons let you choose a particular moment.

The movement passes through the checkpoints during playback. Selecting a checkpoint pauses there; the labels do not impose a stop on the moving stroke.

The figure uses three persistent roles:

| Color | Meaning |
| --- | --- |
| Blue | Top arm and top hand |
| Orange | Bottom arm and bottom hand |
| Gold | Bat |
| Neutral gray | Body and earlier bat positions |

The colored hands remain attached to the same handle. Limbs and bat retain their lengths as the pose changes.

## Handedness and camera

| Mode | Top hand / front foot | Bottom hand / back foot |
| --- | --- | --- |
| Left-handed | Right | Left |
| Right-handed | Left | Right |

Use the comparison mode to see both batting hands at the same point in the stroke. Colors identify the functional role, while the labels identify the anatomical side.

**Side view** makes the forward step, bat path, and extension easier to inspect. **Bowler’s view** separates the arms and shows handedness more clearly. Changing the view or handedness preserves the current moment, so you can compare like with like.

## Numbered bat imprints

Turn **Imprints** on to leave labeled outlines of the bat at earlier checkpoints:

1. **Backlift** — the raised bat before the downswing.
2. **Contact** — the bat and ball at the constructed contact point.
3. **Extension** — the bat after contact, before the finish.

Imprints appear once playback reaches their checkpoint and remain through the finish. Rewinding removes imprints of positions that have not yet been reached. The numbers keep their meaning when you change the camera.

## Use it in a coaching conversation

Start with one observation: the step, the two-hand grip, the path into contact, or the follow-through. Play the whole stroke to preserve its context, then pause at the relevant checkpoint and compare the camera views. The schematic helps explain the observation; assessing an actual shot still depends on the delivery, shot choice, and footage.

The public project includes generic illustrations and public source references. Personal photos, videos, and player-specific coaching records are not part of this example.

## Save or share an inspection

**Copy this view** creates a link containing the selected handedness, camera, and current stroke position. It opens paused at that moment, so another viewer can inspect the same view. **Save SVG frame** downloads the current illustration as a vector image. The older Motion Canvas players retain their PNG frame export.

## Cricket references

The revision was informed by sampled public storyboard sequences from these coaching videos. Samples were inspected at one- or two-second intervals; this was a sequence and posture reference study, not continuous playback or motion capture.

| Public source | Angles and reviewed sections | How it informed this illustration |
| --- | --- | --- |
| [Cricket Australia — Steve Smith Masterclass: Straight drive](https://www.youtube.com/watch?v=DxCZs5SGM0w) | Front / side-oblique demonstration at 0:00–0:22; front / bowler-end demonstration after 0:24 | The relationship between the forward movement, swing through contact, and continuing finish |
| [Lord’s — Ian Bell cover-drive coaching](https://www.youtube.com/watch?v=FRtWfiepnRc) | Side-on at 0:24–0:28; front-oblique at 0:32–0:35 | Drive sequencing and the progression from contact into follow-through; this cover drive was not used to set the straight drive’s bat direction |
| [CoachCricXI — HOW to DRIVE \| Batting Tutorials \| Cricket](https://www.youtube.com/watch?v=Zm9VKD0gH1U) | Front-on at 0:50–1:28; side-on at 2:54–3:10 | The step, front-foot placement, and coordinated hands and bat from comparable camera angles |

These observations informed the authored changes: the front foot plants before contact, the hands and bat continue through contact, and the shoulder turn flows into a softer finish. Atlas’s positions and timing are designed for a clear generic straight-drive explanation; they are not a reconstruction of any one player. No source frames or video files are redistributed with the project.

## Editable pose studies

Choose **Custom keyframes** to open the original four-pose Motion Canvas editor and its presets. They accept JSON for Set-up, Downswing, Contact, and Follow-through, including grip location and bat angle. These can be useful for building a particular schematic variation. See [the input format](recipes.md#editable-four-pose-studies).

## Implementation

The full-stroke inspector renders a shared pose model with React and SVG. The editable four-pose studies use Motion Canvas. This distinction lets the inspector change view immediately while preserving the current moment, and keeps the existing editable studies available in the same Atlas.

| Source file | Responsibility |
| --- | --- |
| [`lib/cricket/pose.ts`](../lib/cricket/pose.ts) | Authored poses, continuous motion, planted foot, and fixed-length limb geometry |
| [`lib/cricket/render.ts`](../lib/cricket/render.ts) | Camera projections, colored figure, bat imprints, and SVG drawing |
| [`src/CricketStroke.tsx`](../src/CricketStroke.tsx) | Playback, camera and handedness controls, inspection links, and SVG export |

The pose model uses quintic Hermite curves with shared velocity and acceleration at internal checkpoints (C2 continuity). This avoids a forced stop at every pose. The model solves the elbows and knees while retaining fixed joint lengths, fixes the front foot after its plant, and settles to rest only at the end of the demonstration.
