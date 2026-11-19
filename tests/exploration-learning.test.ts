import test from 'node:test';
import assert from 'node:assert/strict';
import {classificationData, classify, classificationScore, fitClassificationThreshold, computeToyAttention, normalizedExponential, sampleBernoulli, runningProportions, binomialProbabilities, batchHistogram, dot2} from '../lib/explorations/learning.ts';

const close = (a: number, b: number, tolerance = 1e-10) => assert.ok(Math.abs(a - b) < tolerance, `${a} differs from ${b}`);

test('classifier keeps fixed IDs, separates train/test, and learns without test-label leakage', () => {
  const data = classificationData();
  assert.equal(new Set(data.map(item => item.id)).size, 36);
  assert.equal(data.filter(item => item.partition === 'train').length, 24);
  assert.equal(data.filter(item => item.partition === 'test').length, 12);
  const fitted = fitClassificationThreshold(data);
  const alteredTest = data.map(item => item.partition === 'test' ? {...item, label: item.label === 'sun' ? 'shade' as const : 'sun' as const, light: 100} : item);
  assert.equal(fitClassificationThreshold(alteredTest), fitted);
  const score = classificationScore(data, fitted, 'test');
  assert.equal(score.total, 12);
  assert.equal(score.correct, data.filter(item => item.partition === 'test' && classify(item, fitted) === item.label).length);
  close(score.accuracy, score.correct / 12);
  assert.equal(classify({light: fitted}, fitted), 'sun');
  for (let threshold = 0; threshold <= 12; threshold += .05) assert.ok(classificationScore(data, fitted, 'train').incorrect <= classificationScore(data, threshold, 'train').incorrect);
});

test('causal attention normalizes exactly, excludes the future, and computes its weighted value', () => {
  for (let q = 0; q < 6; q++) {
    const model = computeToyAttention('we share clear ideas with context', q)!;
    close(model.attention.reduce((a, b) => a + b, 0), 1);
    model.attention.forEach((weight, i) => { assert.ok(weight >= 0); if (i > q) assert.equal(weight, 0); });
    model.dotProducts.forEach((value, i) => close(value, dot2(model.queries[q], model.keys[i])));
    for (let d = 0; d < 2; d++) close(model.mixed[d], model.values.reduce((sum, value, i) => sum + model.attention[i] * value[d], 0));
    close(model.probabilities.reduce((a, b) => a + b, 0), 1);
  }
  const first = computeToyAttention('we share clear ideas', 1)!;
  const changedFuture = computeToyAttention('we share then act', 1)!;
  assert.deepEqual(first.attention, changedFuture.attention);
  assert.deepEqual(first.mixed, changedFuture.mixed);
  assert.deepEqual(computeToyAttention('we share', 0)!.attention, [1, 0]);
  assert.equal(computeToyAttention('   ', 0), null);
  assert.ok(computeToyAttention('constructor __proto__ unknown', 2)!.probabilities.every(Number.isFinite));
});

test('temperature changes output probabilities, not the attention calculation', () => {
  const cold = computeToyAttention('we share clear ideas', 3, .3)!;
  const hot = computeToyAttention('we share clear ideas', 3, 2)!;
  assert.deepEqual(cold.attention, hot.attention);
  assert.ok(Math.max(...cold.probabilities) > Math.max(...hot.probabilities));
  const shifted = normalizedExponential([1001, 999, 1000]);
  normalizedExponential([1, -1, 0]).forEach((value, i) => close(value, shifted[i]));
  assert.throws(() => normalizedExponential([1, 2], 0));
});

test('seeded sampling has reproducible prefixes, endpoints and correct empirical accounting', () => {
  const small = sampleBernoulli(731, .6, 40), large = sampleBernoulli(731, .6, 100);
  assert.deepEqual(small, large.slice(0, 40));
  assert.notDeepEqual(small, sampleBernoulli(732, .6, 40));
  assert.deepEqual(sampleBernoulli(731, 0, 12), Array(12).fill(0));
  assert.deepEqual(sampleBernoulli(731, 1, 12), Array(12).fill(1));
  close(runningProportions(small).at(-1)!, small.reduce((a, b) => a + b, 0) / 40);
  const histogram = batchHistogram(large.slice(0, 97));
  assert.equal(histogram.batches, 9);
  assert.equal(histogram.counts.reduce((a, b) => a + b, 0), 9);
  close(histogram.proportions.reduce((a, b) => a + b, 0), 1);
});

test('the exact binomial reference conserves probability and has the specified mean and variance', () => {
  for (const p of [0, .1, .5, .85, 1]) {
    const distribution = binomialProbabilities(10, p);
    close(distribution.reduce((a, b) => a + b, 0), 1);
    close(distribution.reduce((sum, value, k) => sum + k * value, 0), 10 * p);
    close(distribution.reduce((sum, value, k) => sum + (k - 10 * p) ** 2 * value, 0), 10 * p * (1 - p));
  }
  assert.throws(() => sampleBernoulli(1, -1, 10));
  assert.throws(() => binomialProbabilities(1.5, .5));
});
