import assert from 'node:assert/strict';
import test from 'node:test';
import {histogramCounts, histogramObservations, spiralPoint, spiralVelocity} from '../lib/motion/gallery-models.ts';

test('particle derivative agrees with the displayed spiral vector field', () => {
  const epsilon = 1e-6;
  for (const time of [.1, .4, .8]) for (const phase of [0, 1, 4]) {
    const p = spiralPoint(time, phase), next = spiralPoint(time + epsilon, phase), velocity = spiralVelocity(p.x, p.y);
    assert.ok(Math.abs((next.x - p.x) / epsilon - velocity.x) < .05);
    assert.ok(Math.abs((next.y - p.y) / epsilon - velocity.y) < .05);
  }
});
test('histogram samples and prefix counts are deterministic and conserved', () => {
  const samples = histogramObservations();
  assert.deepEqual(samples, histogramObservations());
  assert.ok(samples.every(sample => sample.bin >= 0 && sample.bin < 15));
  for (let arrived = 0; arrived <= samples.length; arrived++) {
    const counts = histogramCounts(samples, arrived);
    assert.equal(counts.reduce((sum, value) => sum + value, 0), arrived);
    if (arrived) assert.equal(counts[samples[arrived - 1].bin], samples[arrived - 1].previousInBin + 1);
  }
});
