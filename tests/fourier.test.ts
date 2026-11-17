import assert from 'node:assert/strict';
import test from 'node:test';
import {fourierValue, fourierVectors, parseFourier} from '../lib/recipes/fourier-model.ts';

const close = (a: number, b: number) => assert.ok(Math.abs(a - b) < 1e-10, `${a} ≠ ${b}`);
test('square preset uses odd sine-series coefficients', () => {
  const model = parseFourier('{"wave":"square","terms":5}');
  assert.deepEqual(model.harmonics.map(h => h.frequency), [1, 3, 5, 7, 9]);
  model.harmonics.forEach(h => close(h.amplitude, 4 / (Math.PI * h.frequency)));
});
test('saw preset alternates coefficients and scales amplitude', () => {
  const model = parseFourier('{"wave":"saw","terms":3,"amplitude":2}');
  close(model.harmonics[0].amplitude, 4 / Math.PI);
  close(model.harmonics[1].amplitude, -2 / Math.PI);
  close(model.harmonics[2].amplitude, 4 / (3 * Math.PI));
});
test('circle endpoint equals the displayed scalar sum for signed, phased terms', () => {
  const model = parseFourier('{"harmonics":[{"frequency":1,"amplitude":2,"phase":0.3},{"frequency":3,"amplitude":-0.7,"phase":-1}]}');
  for (const theta of [0, .2, 1, 2.8, Math.PI * 2]) {
    const points = fourierVectors(model, theta);
    close(points.at(-1)!.y, fourierValue(model, theta));
    assert.ok(Math.abs(fourierValue(model, theta)) <= model.amplitudeBound + 1e-12);
  }
  close(model.rms, Math.sqrt((4 + .49) / 2));
});
test('single sine and zero amplitude have well-defined values', () => {
  close(fourierValue(parseFourier('{"wave":"sine"}'), Math.PI / 2), 1);
  close(fourierValue(parseFourier('{"wave":"square","amplitude":0}'), 1), 0);
});
test('invalid and ambiguous harmonic inputs are rejected', () => {
  for (const input of ['{}x', '[]', '{"terms":100}', '{"terms":2.5}', '{"wave":["sine"]}', '{"wave":"sine","terms":3}', '{"wave":"square","harmonics":[{"frequency":1,"amplitude":1}]}', '{"harmonics":[{"frequency":1.5,"amplitude":1}]}', '{"harmonics":[{"frequency":1,"amplitude":1},{"frequency":1,"amplitude":2}]}']) assert.throws(() => parseFourier(input));
});
