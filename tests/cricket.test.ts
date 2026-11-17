import assert from 'node:assert/strict';
import test from 'node:test';
import {
  BALL_RADIUS, BAT, DEFAULT_CRICKET_FRAMES, LIMBS, batGeometry, contactGeometry,
  cricketAnatomy, cricketBall, cricketTiming, distance, parseCricket, projectedBatAngle, sampleCricket,
  type CricketInput, type Point,
} from '../lib/recipes/models/cricket.ts';

const input = () => ({frames: structuredClone(DEFAULT_CRICKET_FRAMES)});
const model = () => parseCricket(JSON.stringify(input()));
const near = (actual: number, expected: number, tolerance = 1e-8) => assert.ok(Math.abs(actual - expected) < tolerance, `${actual} differs from ${expected}`);
const samePoint = (a: Point, b: Point) => near(distance(a, b), 0);

test('the bat, both hands, arms, and legs retain their lengths between all keyframes', () => {
  const swing = model();
  for (let i = 0; i <= 600; i++) {
    const p = sampleCricket(swing, i / 200);
    near(distance(p.bat.knob, p.bat.toe), 132);
    near(distance(p.bat.upperHand, p.bat.lowerHand), 18);
    const upper = p.bat.upperHand, lower = p.bat.lowerHand;
    near((lower[0] - upper[0]) * p.bat.direction[1] - (lower[1] - upper[1]) * p.bat.direction[0], 0);
    for (let side = 0; side < 2; side++) {
      near(distance(p.shoulders[side], p.elbows[side]), LIMBS.upperArm);
      near(distance(p.elbows[side], side ? upper : lower), LIMBS.forearm);
      near(distance(p.hips[side], p.knees[side]), LIMBS.thigh);
      near(distance(p.knees[side], p.ankles[side]), LIMBS.shin);
    }
    for (const point of [p.head, p.neck, ...p.shoulders, ...p.hips, ...p.elbows, ...p.knees, ...p.ankles, upper, lower, p.bat.toe]) assert.ok(point.every(Number.isFinite));
  }
});

test('contact places the ball surface on the blade face rather than through its centerline', () => {
  const swing = model(), bat = batGeometry(swing.frames[2]), contact = contactGeometry(swing);
  samePoint(cricketBall(swing, 2), contact.ballCenter);
  near(distance(contact.ballCenter, contact.surface), BALL_RADIUS);
  const v: Point = [contact.ballCenter[0] - bat.grip[0], contact.ballCenter[1] - bat.grip[1]];
  near(v[0] * bat.direction[0] + v[1] * bat.direction[1], BAT.contact);
  near(Math.abs(v[0] * bat.normal[0] + v[1] * bat.normal[1]), contact.halfWidth + BALL_RADIUS);
  assert.ok(BAT.contact > BAT.blade && BAT.contact < BAT.toe);
  assert.ok(distance(cricketBall(swing, 1.99), contact.ballCenter) < 2);
  assert.ok(distance(cricketBall(swing, 2.01), contact.ballCenter) < 3);
});

test('angle interpolation does not spin between equivalent orientations or across the wrap boundary', () => {
  const swing = model();
  swing.frames[0].batAngle = 360; swing.frames[1].batAngle = -360;
  for (const phase of [0, .25, .5, .75, 1]) {
    const p = sampleCricket(swing, phase);
    near(p.bat.direction[0], 1); near(p.bat.direction[1], 0);
  }
  swing.frames[0].batAngle = 170; swing.frames[1].batAngle = -170;
  const p = sampleCricket(swing, .5);
  near(p.bat.direction[0], -1); near(p.bat.direction[1], 0);
});

test('independently known projected angles and checkpoint timings are preserved', () => {
  const swing = model();
  near(projectedBatAngle({...swing.frames[0], batAngle: 90}), 0);
  near(projectedBatAngle({...swing.frames[0], batAngle: 0}), 90);
  near(projectedBatAngle({...swing.frames[0], batAngle: 72}), 18);
  const timing = cricketTiming(swing);
  near(timing.contact, 6.2); near(timing.followThrough, 10.7); near(timing.duration, 12.1);
  assert.deepEqual(timing.checkpoints.map(p => Number(p.time.toFixed(2))), [.4, 3.5, 7.25, 11.4]);
  assert.ok(timing.checkpoints[2].time > timing.contact && timing.checkpoints[2].time < timing.contact + swing.contactHold);
});

test('a valid pair of keyframes with an unreachable intermediate hand is rejected', () => {
  const swing = model();
  const frame = {...swing.frames[0], grip: [80, -80] as Point};
  // The back arm holds the lower hand. Both vertical endpoint poses fit;
  // the halfway bat direction points right and takes that hand beyond reach.
  swing.frames[0] = {...frame, batAngle: 90};
  swing.frames[1] = {...frame, batAngle: -90};
  assert.doesNotThrow(() => sampleCricket(swing, 0));
  assert.doesNotThrow(() => sampleCricket(swing, 1));
  assert.throws(() => sampleCricket(swing, .5), /reach/);
  assert.throws(() => parseCricket(JSON.stringify(swing)), /stretches/);
});

test('bad input is bounded and rejected with an actionable message', () => {
  for (const bad of ['', 'null', '[]', '{', JSON.stringify({frames: []}), ' '.repeat(16001)]) assert.throws(() => parseCricket(bad));
  const variants: Record<string, unknown>[] = [
    {...input(), transitionSeconds: 0}, {...input(), contactHold: 8}, {...input(), mirror: 'yes'},
    {...input(), showTraces: 1}, {...input(), title: '\n'}, {...input(), title: 'x'.repeat(61)},
    {...input(), handedness: 'lefty'}, {...input(), handedness: true}, {...input(), handedness: null},
  ];
  for (const v of variants) assert.throws(() => parseCricket(JSON.stringify(v)));
  const badFrame = input(); badFrame.frames[0].grip = [90, -10];
  assert.throws(() => parseCricket(JSON.stringify(badFrame)), /stretches/);
  const numeric = input(); numeric.frames[0].batAngle = Number.NaN;
  assert.throws(() => parseCricket(JSON.stringify(numeric)), /finite number/);
  assert.throws(() => sampleCricket(model(), Number.NaN), /finite/);
});

test('omitted optional fields use bounded defaults and mirror leaves the underlying pose unchanged', () => {
  const minimal = {frames: DEFAULT_CRICKET_FRAMES.map(f => ({grip: f.grip, batAngle: f.batAngle})), mirror: true};
  const reversed = parseCricket(JSON.stringify(minimal)), standard = model();
  assert.equal(reversed.mirror, true);
  assert.equal(reversed.showTraces, true);
  assert.equal(reversed.handedness, 'right');
  assert.deepEqual(sampleCricket(reversed, 1.5), sampleCricket(standard, 1.5));
});

test('batting handedness labels the top hand and front foot independently of camera direction', () => {
  assert.deepEqual(cricketAnatomy('left'), {topHand: 'right', bottomHand: 'left', frontFoot: 'right', backFoot: 'left'});
  assert.deepEqual(cricketAnatomy('right'), {topHand: 'left', bottomHand: 'right', frontFoot: 'left', backFoot: 'right'});
  const base = model();
  for (const handedness of ['left', 'right'] as const) for (const mirror of [false, true]) {
    const swing = parseCricket(JSON.stringify({...input(), handedness, mirror}));
    assert.equal(swing.handedness, handedness);
    assert.equal(swing.mirror, mirror);
    for (const phase of [0, .5, 1, 1.5, 2, 2.5, 3]) assert.deepEqual(sampleCricket(swing, phase), sampleCricket(base, phase));
    assert.deepEqual(contactGeometry(swing), contactGeometry(base));
  }
});

test('the front arm reaches the top hand and the back arm reaches the bottom hand', () => {
  const swing = model();
  for (const phase of [0, .5, 1, 1.5, 2, 2.5, 3]) {
    const p = sampleCricket(swing, phase);
    assert.ok(p.shoulders[1][0] > p.shoulders[0][0]);
    near(distance(p.elbows[1], p.bat.upperHand), LIMBS.forearm);
    near(distance(p.elbows[0], p.bat.lowerHand), LIMBS.forearm);
  }
});
