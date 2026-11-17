import {Circle, Line, Rect, Txt} from '@motion-canvas/2d';
import {createSignal, linear, waitFor} from '@motion-canvas/core';
import {P, label, stage} from '../motion/shared';
import type {RecipeDefinition} from './types';
import {
  BALL_RADIUS, BAT, CRICKET_PHASES, DEFAULT_CRICKET_FRAMES, batGeometry,
  contactGeometry, cricketAnatomy, cricketBall, cricketTiming, parseCricket, projectedBatAngle,
  sampleCricket, type CricketFrame, type Point,
} from './models/cricket.ts';

const inputFor = (title: string, frames: CricketFrame[], mirror = false) => JSON.stringify({
  title, handedness: 'left', frames, transitionSeconds: 2.4, contactHold: 2.1, mirror, showTraces: true,
}, null, 2);

const laterFrames = DEFAULT_CRICKET_FRAMES.map((frame, i) => ({
  ...frame, grip: (i === 2 ? [49, -15] : frame.grip) as Point,
  batAngle: i === 2 ? 87 : frame.batAngle,
}));

export const cricketRecipe: RecipeDefinition = {
  id: 'cricket', title: 'Read the contact frame', subtitle: 'Follow the grip, blade, and ball.',
  description: 'Choose a left- or right-handed batter, pause at contact, and compare labeled bat positions. Edit the four poses to make a different sequence.',
  inputLabel: 'Swing keyframes', inputFormat: 'JSON', accept: '.json,application/json', color: P.teal,
  examples: [
    {id: 'drive-contact', name: 'A drive to contact', description: 'A forward step, two hands on the handle, and a hold at contact.', input: inputFor('A drive to contact', DEFAULT_CRICKET_FRAMES)},
    {id: 'later-grip', name: 'A contact-frame variation', description: 'The grip is farther back and the bat is more upright at contact. Compare the authored geometry.', input: inputFor('A contact-frame variation', laterFrames)},
    {id: 'mirrored-drive', name: 'Reverse the side view', description: 'The same motion flipped horizontally; useful when matching a camera view.', input: inputFor('A drive, reversed side view', DEFAULT_CRICKET_FRAMES, true)},
  ],
  help: 'Supply four frames in this order: Set-up, Downswing, Contact, Follow-through. Each needs grip [x,y] and batAngle in degrees; optional hip [x,y], lean, and frontFoot use the example defaults. handedness is "left" or "right"; older inputs that omit it use "right". The presets specify "left". mirror flips the camera direction and keeps anatomical labels unchanged. Coordinates are drawing units; +x is towards the bowler before mirroring and +y is down. Angles run clockwise from right, so 90° points down. transitionSeconds is 1–4, contactHold is 0.8–4, and mirror/showTraces are true or false. Poses that would stretch a limb are rejected.',
  basis: 'An authored 2D coaching schematic. The torso, limbs, bat, and hand spacing retain their lengths; elbows and knees are solved from the fixed endpoints. Bat angles take the shorter rotation between poses. The ball is constructed to touch the blade surface at Contact. Angles below are projections in this side view, not measurements from footage.',
  compile(input) {
    const model = parseCricket(input), timing = cricketTiming(model);
    const contact = contactGeometry(model);
    const anatomy = cricketAnatomy(model.handedness);
    const handedTitle = model.handedness === 'left' ? 'Left-handed' : 'Right-handed';
    const fmt = (n: number) => Number(n.toFixed(1)).toString();
    return {
      title: model.title,
      summary: `${handedTitle} · four authored poses · ${fmt(timing.duration)} seconds · contact held for ${fmt(model.contactHold)} seconds`,
      duration: timing.duration, checkpoints: timing.checkpoints, loop: false, frameStep: true,
      rows: [
        {label: 'Example type', value: 'Authored 2D motion', detail: 'A coaching interaction with synthetic positions; no video or body measurements are used.'},
        {label: 'Batting mode', value: handedTitle, detail: `Top hand: ${anatomy.topHand}. Bottom hand: ${anatomy.bottomHand}. Front foot: ${anatomy.frontFoot}. Back foot: ${anatomy.backFoot}. Front and back describe position relative to the bowler.`},
        ...model.frames.map((frame, i) => ({
          label: `${i + 1}. ${CRICKET_PHASES[i]}`, value: `${fmt(projectedBatAngle(frame))}° from vertical`,
          detail: `Grip (${frame.grip.map(fmt).join(', ')}); bat direction ${fmt(frame.batAngle)}° clockwise from right. ${i < 3 ? `Trace ${i * 2 + 1}: grip. Trace ${i * 2 + 2}: bat toe.` : 'The final pose remains on screen.'}`,
        })),
        {label: 'Grip', value: 'Two separate hands on one handle', detail: 'The hand centers stay 18 drawing units apart, aligned with the handle, throughout the swing.'},
        {label: 'Contact', value: `${fmt(projectedBatAngle(model.frames[2]))}° from vertical`, detail: `Ball center (${contact.ballCenter.map(fmt).join(', ')}). Its surface meets the blade face; both the ball and pose hold still for inspection.`},
        {label: 'View', value: model.mirror ? 'Bowler to the left' : 'Bowler to the right', detail: 'Camera flip changes horizontal screen direction. Hand and foot labels stay tied to the selected batting mode.'},
      ],
      factory: function* (view) {
        stage(view);
        const phase = createSignal(0);
        const pose = () => sampleCricket(model, phase());
        const currentIndex = () => Math.min(3, Math.floor(phase() + .00001));
        const direction = model.mirror ? -1 : 1;
        const minY = Math.min(...Array.from({length: 181}, (_, i) => {
          const p = sampleCricket(model, i / 60);
          return Math.min(p.bat.toe[1], p.bat.knob[1], p.head[1] - 17);
        }));
        // Keep accepted high-backlift poses below the title and their numbered
        // trace badges inside the canvas, while preserving body proportions.
        const scale = Math.min(1.16, 320 / (132 - minY));
        const origin: Point = [model.mirror ? -130 : -220, 190 - 132 * scale];
        const world = (p: Point): Point => [origin[0] + p[0] * scale * direction, origin[1] + p[1] * scale];
        const offset = (p: Point, q: Point, amount: number): Point => [p[0] + q[0] * amount, p[1] + q[1] * amount];
        const visibleHistory = (i: number) => model.showTraces && phase() > i + .03 ? Math.min(1, (phase() - i) / .18) : 0;
        const contactActive = () => Math.max(0, 1 - Math.abs(phase() - 2) / .13);

        label(view, 'CRICKET · CONTACT STUDY', -197, -236, P.teal, 20);
        view.add(new Txt({text: () => CRICKET_PHASES[currentIndex()], position: [-197, -201], fontFamily: 'Arial', fontWeight: 600, fontSize: 31, fill: P.ink}));
        label(view, `${handedTitle} · side view`, -197, -173, P.muted, 17);

        // The pitch and crease stay fixed while the front foot steps forward.
        const floor = world([0, 132])[1];
        view.add(new Line({points: [[-435, floor], [115, floor]], stroke: P.grid, lineWidth: 2}));
        view.add(new Line({points: [[-350, floor + 7], [-36, floor + 7]], stroke: P.muted, lineWidth: 1, opacity: .34}));

        // Each historic grip and toe is its own numbered point. The key at the
        // right names every point, avoiding a web of crossing leader lines.
        model.frames.slice(0, 3).forEach((frame, i) => {
          const b = batGeometry(frame);
          view.add(new Line({points: [world(b.knob), world(b.toe)], stroke: P.muted, lineWidth: 5, opacity: () => visibleHistory(i) * .21, lineCap: 'round'}));
        });

        // A short trail shows the ball's approach and departure without scenery.
        const ballTrail = Array.from({length: 61}, (_, i) => world(cricketBall(model, i / 20)));
        view.add(new Line({points: ballTrail, stroke: P.grid, lineWidth: 1.5, lineDash: [3, 7], end: () => phase() / 3, opacity: .8}));

        const limb = (points: () => Point[], width: number, color: string) => {
          view.add(new Line({points: () => points().map(world), stroke: P.bg, lineWidth: width + 5, lineCap: 'round', lineJoin: 'round'}));
          view.add(new Line({points: () => points().map(world), stroke: color, lineWidth: width, lineCap: 'round', lineJoin: 'round'}));
        };
        // The rear arm and leg have lower contrast; each remains a separate limb.
        limb(() => [pose().hips[0], pose().knees[0], pose().ankles[0]], 13, P.muted);
        limb(() => [pose().ankles[0], pose().toes[0]], 11, P.muted);
        limb(() => [pose().hips[1], pose().knees[1], pose().ankles[1]], 15, P.ink);
        limb(() => [pose().ankles[1], pose().toes[1]], 12, P.ink);
        view.add(new Line({points: () => [...pose().shoulders, pose().hips[1], pose().hips[0]].map(world), closed: true, fill: P.panel, stroke: P.ink, lineWidth: 2.5, lineJoin: 'round'}));
        limb(() => [pose().neck, [(pose().shoulders[0][0] + pose().shoulders[1][0]) / 2, (pose().shoulders[0][1] + pose().shoulders[1][1]) / 2]], 8, P.ink);
        view.add(new Circle({position: () => world(pose().head), size: 37, fill: P.bg, stroke: P.ink, lineWidth: 3}));
        view.add(new Line({points: () => [[13, -4], [20, 1], [13, 5]].map(([x, y]) => world([pose().head[0] + x, pose().head[1] + y])), stroke: P.ink, lineWidth: 2.5, lineCap: 'round', lineJoin: 'round'}));
        limb(() => [pose().shoulders[0], pose().elbows[0], pose().bat.lowerHand], 8, P.muted);
        limb(() => [pose().shoulders[1], pose().elbows[1], pose().bat.upperHand], 9, P.ink);
        for (const part of ['shoulders', 'hips', 'elbows', 'knees'] as const) for (let i = 0; i < 2; i++) {
          view.add(new Circle({position: () => world(pose()[part][i]), size: 7.5, fill: P.bg, stroke: P.ink, lineWidth: 1.8}));
        }
        view.add(new Line({points: () => [pose().bat.knob, pose().bat.blade].map(world), stroke: P.ink, lineWidth: 5, lineCap: 'round'}));
        view.add(new Line({points: () => {
          const b = pose().bat;
          return [offset(b.blade, b.normal, 4.5), offset(b.toe, b.normal, 6.5), offset(b.toe, b.normal, -6.5), offset(b.blade, b.normal, -4.5)].map(world);
        }, closed: true, fill: '#244944', stroke: P.teal, lineWidth: 2.5, lineJoin: 'round'}));
        for (const hand of ['upperHand', 'lowerHand'] as const) view.add(new Circle({position: () => world(pose().bat[hand]), size: 13.5, fill: P.bg, stroke: P.ink, lineWidth: 2.4}));
        for (const [index, name, side] of [[0, 'Back', anatomy.backFoot], [1, 'Front', anatomy.frontFoot]] as const) {
          view.add(new Txt({text: `${name}: ${side}`, position: () => [world(pose().ankles[index])[0] + direction * 12, floor + 23], fontFamily: 'Arial', fontSize: 16, fill: index ? P.ink : P.muted}));
        }
        view.add(new Circle({position: () => world(cricketBall(model, phase())), size: BALL_RADIUS * 2 * scale, fill: P.orange}));
        view.add(new Circle({position: world(contact.ballCenter), size: 41, stroke: P.orange, lineWidth: 1.5, opacity: contactActive}));
        view.add(new Txt({text: 'Contact', position: [world(contact.ballCenter)[0] + direction * 63, world(contact.ballCenter)[1] - 4], fontFamily: 'Arial', fontSize: 19, fill: P.orange, opacity: contactActive}));

        // Small neutral point badges sit off each historic endpoint. Their IDs
        // have fixed meaning even when the custom frame positions change.
        const pointOffsets: [Point, Point][] = [[[24, -13], [-18, -15]], [[26, 4], [-18, 14]], [[27, -12], [23, 8]]];
        model.frames.slice(0, 3).forEach((frame, i) => {
          const b = batGeometry(frame);
          [b.grip, b.toe].forEach((p, j) => {
            const mark = world(p), o = pointOffsets[i][j], badge: Point = [mark[0] + o[0] * direction, mark[1] + o[1]];
            view.add(new Line({points: [mark, badge], stroke: P.muted, lineWidth: 1, opacity: () => visibleHistory(i) * .8}));
            view.add(new Circle({position: mark, size: 7, fill: P.bg, stroke: P.muted, lineWidth: 1.5, opacity: () => visibleHistory(i)}));
            view.add(new Circle({position: badge, size: 22, fill: P.bg, stroke: P.muted, lineWidth: 1, opacity: () => visibleHistory(i)}));
            view.add(new Txt({text: String(i * 2 + j + 1), position: badge, fontFamily: 'Arial', fontSize: 15, fill: P.ink, opacity: () => visibleHistory(i)}));
          });
        });

        // The close-up makes the two-hand grip readable even when the full pose
        // is small. It uses the same geometry as the athlete, not a second pose.
        const gripCenter: Point = [293, -116], zoom = 1.85;
        const gripPoint = (along: number): Point => {
          const b = pose().bat;
          return [gripCenter[0] + b.direction[0] * along * zoom * direction, gripCenter[1] + b.direction[1] * along * zoom];
        };
        label(view, 'Two hands, one handle', 293, -226, P.ink, 22);
        view.add(new Circle({position: gripCenter, size: 166, fill: P.panel, stroke: P.grid, lineWidth: 1.5}));
        view.add(new Line({points: () => [gripPoint(-27), gripPoint(44)], stroke: P.ink, lineWidth: 8, lineCap: 'round'}));
        view.add(new Line({points: () => [gripPoint(29), gripPoint(46)], stroke: P.teal, lineWidth: 21, lineCap: 'round'}));
        for (const [distance, name] of [[BAT.upperHand, anatomy.topHand[0].toUpperCase()], [BAT.lowerHand, anatomy.bottomHand[0].toUpperCase()]] as const) {
          view.add(new Circle({position: () => gripPoint(distance), size: 27, fill: P.bg, stroke: P.ink, lineWidth: 2}));
          view.add(new Txt({text: name, position: () => gripPoint(distance), fontFamily: 'Arial', fontSize: 17, fill: P.ink}));
        }
        label(view, `Top: ${anatomy.topHand} · Bottom: ${anatomy.bottomHand}`, 293, -13, P.muted, 18);

        label(view, 'Earlier positions', 289, 28, P.ink, 22);
        label(view, 'Frame', 226, 64, P.muted, 16);
        label(view, 'Grip', 344, 64, P.muted, 16);
        label(view, 'Toe', 418, 64, P.muted, 16);
        model.frames.slice(0, 3).forEach((_, i) => {
          const y = 98 + i * 36;
          view.add(new Txt({text: CRICKET_PHASES[i], position: [226, y], fontFamily: 'Arial', fontSize: 20, fill: P.ink, opacity: () => visibleHistory(i) ? 1 : .32}));
          for (let j = 0; j < 2; j++) {
            const x = j ? 418 : 344;
            view.add(new Circle({position: [x, y], size: 25, fill: P.bg, stroke: P.muted, lineWidth: 1, opacity: () => visibleHistory(i) ? 1 : .3}));
            view.add(new Txt({text: String(i * 2 + j + 1), position: [x, y], fontFamily: 'Arial', fontSize: 17, fill: P.ink, opacity: () => visibleHistory(i) ? 1 : .3}));
          }
        });
        if (!model.showTraces) label(view, 'Trace display is off', 292, 206, P.muted, 17);

        // One coaching readout follows the selected pose, while the contact
        // checkpoint holds still long enough to compare grip, blade, and ball.
        view.add(new Txt({text: () => `Bat: ${Math.round(projectedBatAngle(pose().frame))}° from vertical`, position: [-197, 239], fontFamily: 'Arial', fontSize: 21, fill: P.ink}));
        view.add(new Txt({text: () => currentIndex() === 2 ? 'Contact held for inspection' : currentIndex() === 3 ? 'Compare the numbered endpoints' : 'Follow the hands and bat together', position: [285, 239], fontFamily: 'Arial', fontSize: 18, fill: P.muted}));

        yield* waitFor(timing.setupHold);
        yield* phase(1, model.transitionSeconds, linear);
        yield* waitFor(timing.downswingHold);
        yield* phase(2, model.transitionSeconds, linear);
        yield* waitFor(model.contactHold);
        yield* phase(3, model.transitionSeconds, linear);
        yield* waitFor(timing.finishHold);
      },
    };
  },
};
