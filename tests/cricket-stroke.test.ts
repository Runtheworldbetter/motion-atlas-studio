import assert from 'node:assert/strict';
import test from 'node:test';
import {CRICKET_VECTOR_KEYS, createCricketPoseEngine, type Vec3} from '../lib/cricket/pose.ts';

const engine = createCricketPoseEngine();
const distance = (a: Vec3, b: Vec3) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const close = (actual: number, expected: number, message: string, tolerance = 1e-8) => {
  assert.ok(Math.abs(actual - expected) < tolerance, `${message}: expected ${expected}, got ${actual}`);
};

test('both grips, all limb lengths and the bat stay rigid over the complete stroke', () => {
  for (const hand of ['right', 'left'] as const) for (let i = 0; i <= 5000; i++) {
    const p = engine.pose(i / 5000, hand);
    for (const key of CRICKET_VECTOR_KEYS) assert.ok(p[key].every(Number.isFinite), `${key} is finite at ${p.time}`);
    close(distance(p.top, p.grip), 0, 'top hand remains on handle');
    close(distance(p.bottom, p.top), 10, 'glove spacing');
    close(distance(p.batEnd, p.grip), 90, 'rigid bat');
    close(distance(p.frontShoulder, p.frontElbow), 35, 'front upper arm');
    close(distance(p.frontElbow, p.top), 33, 'front forearm');
    close(distance(p.backShoulder, p.backElbow), 35, 'back upper arm');
    close(distance(p.backElbow, p.bottom), 33, 'back forearm');
    close(distance(p.frontHip, p.frontKnee), 45, 'front thigh');
    close(distance(p.frontKnee, p.frontFoot), 43, 'front shin');
    close(distance(p.backHip, p.backKnee), 45, 'back thigh');
    close(distance(p.backKnee, p.backFoot), 43, 'back shin');
    close(distance(p.axis, [0, 0, 0]), 1, 'unit blade direction');
    // The pole never approaches the singular line where an IK elbow could flip.
    for (const [a, b, pole] of [
      [p.frontShoulder, p.top, p.frontArmPole], [p.backShoulder, p.bottom, p.backArmPole],
      [p.frontHip, p.frontFoot, p.frontLegPole], [p.backHip, p.backFoot, p.backLegPole],
    ]) {
      const d = b.map((v, j) => v - a[j]), v = pole.map((x, j) => x - a[j]);
      const ratio = d.reduce((sum, x, j) => sum + x * v[j], 0) / d.reduce((sum, x) => sum + x * x, 0);
      assert.ok(Math.hypot(...v.map((x, j) => x - d[j] * ratio)) > 7, `stable IK plane at ${p.time}`);
    }
  }
});

test('contact meets the ball exactly and the blade continues through the checkpoint', () => {
  for (const hand of ['right', 'left'] as const) {
    const p = engine.pose(engine.contact.t, hand);
    const strike = p.grip.map((v, i) => v + engine.contact.bladeDistance * p.axis[i]) as Vec3;
    close(distance(strike, engine.contact.point), 0, 'blade-ball contact');
    const h = 1e-5, before = engine.pose(p.time - h, hand), after = engine.pose(p.time + h, hand);
    assert.ok(distance(after.batEnd, before.batEnd) / (2 * h) > 500, 'bat is moving through contact');
    assert.ok(distance(after.grip, before.grip) / (2 * h) > 100, 'hands are moving through contact');
  }
  assert.deepEqual(engine.stops.map(s => s.id), ['setup', 'backlift', 'contact', 'extension', 'finish']);
});

test('velocity and acceleration agree on both sides of every transition', () => {
  const h = 2e-5;
  const times = [...engine.frames.slice(1, -1).map(f => f.t), engine.frontFootPlantT];
  const weights = {vl: [0, 1, -4, 3, 0, 0, 0], vr: [0, 0, 0, -3, 4, -1, 0],
    al: [-1, 4, -5, 2, 0, 0, 0], ar: [0, 0, 0, 2, -5, 4, -1]};
  for (const hand of ['right', 'left'] as const) for (const t of times) {
    const samples = [-3, -2, -1, 0, 1, 2, 3].map(n => engine.pose(t + n * h, hand));
    for (const key of CRICKET_VECTOR_KEYS) {
      const derivative = (weights: number[], denominator: number): Vec3 => [0, 1, 2].map(c =>
        weights.reduce((sum, w, i) => sum + w * samples[i][key][c], 0) / denominator,
      ) as Vec3;
      // Second-order one-sided stencils estimate the boundary limits. These
      // tolerances allow truncation error and fail a segment-wise easing reset.
      assert.ok(distance(derivative(weights.vl, 2 * h), derivative(weights.vr, 2 * h)) < .002,
        `${key} velocity is continuous at ${t}`);
      assert.ok(distance(derivative(weights.al, h * h), derivative(weights.ar, h * h)) < .3,
        `${key} acceleration is continuous at ${t}`);
    }
  }
});

test('the front foot plants before impact and stays still while the body finishes', () => {
  assert.ok(engine.frontFootPlantT < engine.contact.t);
  for (const hand of ['right', 'left'] as const) {
    const planted = engine.pose(engine.frontFootPlantT, hand);
    for (let i = 0; i <= 100; i++) {
      const p = engine.pose(engine.frontFootPlantT + (1 - engine.frontFootPlantT) * i / 100, hand);
      close(distance(p.frontFoot, planted.frontFoot), 0, 'planted ankle');
      close(distance(p.frontToe, planted.frontToe), 0, 'planted toe');
    }
    const contact = engine.pose(engine.contact.t, hand), finish = engine.pose(1, hand);
    assert.ok(finish.backFoot[2] > contact.backFoot[2], 'back heel releases during follow-through');
    assert.ok(finish.grip[2] > contact.grip[2] + 50, 'hands rise into a high finish');
  }
});

test('left-handed mode mirrors lateral geometry, preserves pitch direction, and swaps named hands', () => {
  for (const t of [0, .27, .43, .49, .55, .65, .89, 1]) {
    const right = engine.pose(t, 'right'), left = engine.pose(t, 'left');
    for (const key of CRICKET_VECTOR_KEYS) {
      close(left[key][0], -right[key][0], `${key} lateral reflection`);
      close(left[key][1], right[key][1], `${key} pitch direction`);
      close(left[key][2], right[key][2], `${key} height`);
    }
    assert.equal(right.topSide, 'L'); assert.equal(right.bottomSide, 'R');
    assert.equal(left.topSide, 'R'); assert.equal(left.bottomSide, 'L');
  }
});
