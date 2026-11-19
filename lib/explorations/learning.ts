/** Original, small teaching models. No pretrained weights, external data or copied code. */
export type PlantClass = 'sun' | 'shade';
export interface ClassificationItem {
  id: string;
  light: number;
  moisture: number;
  label: PlantClass;
  partition: 'train' | 'test';
}

export function seededRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(1664525, state) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

export function classificationData(): ClassificationItem[] {
  const random = seededRandom(4181);
  return Array.from({length: 36}, (_, index) => {
    const light = Math.round((1 + random() * 10) * 10) / 10;
    const moisture = Math.round(12 + random() * 76);
    const latent = light + (50 - moisture) * .022 + (random() - .5) * 2;
    return {id: `P${String(index + 1).padStart(2, '0')}`, light, moisture,
      label: latent >= 6 ? 'sun' : 'shade', partition: index % 3 === 0 ? 'test' : 'train'};
  });
}

export function classify(item: Pick<ClassificationItem, 'light'>, threshold: number): PlantClass {
  return item.light >= threshold ? 'sun' : 'shade';
}

export function classificationScore(items: readonly ClassificationItem[], threshold: number, partition?: 'train' | 'test') {
  const selected = items.filter(item => !partition || item.partition === partition);
  const results = selected.map(item => ({id: item.id, expected: item.label, predicted: classify(item, threshold), correct: classify(item, threshold) === item.label}));
  const correct = results.filter(result => result.correct).length;
  return {total: results.length, correct, incorrect: results.length - correct, accuracy: results.length ? correct / results.length : 0, results};
}

/** Empirical-error minimization using only training examples; ties choose the smaller threshold. */
export function fitClassificationThreshold(items: readonly ClassificationItem[]): number {
  const training = items.filter(item => item.partition === 'train');
  if (!training.length) throw new Error('At least one training example is required.');
  const values = [...new Set(training.map(item => item.light))].sort((a, b) => a - b);
  const candidates = [0, ...values.slice(1).map((value, index) => (values[index] + value) / 2), 12];
  return candidates.reduce((best, candidate) => classificationScore(training, candidate).incorrect < classificationScore(training, best).incorrect ? candidate : best, candidates[0]);
}

export type Vector2 = readonly [number, number];
export type Matrix2 = readonly [Vector2, Vector2];
export const TOY_VOCABULARY = ['we', 'share', 'clear', 'ideas', 'with', 'context', 'then', 'act'] as const;
export const TOY_EMBEDDINGS: Readonly<Record<string, Vector2>> = {
  we: [.9, .1], share: [.7, .6], clear: [.2, 1], ideas: [.8, .8],
  with: [-.2, .5], context: [.5, 1.2], then: [-.5, .3], act: [1.1, -.2],
};
export const TOY_MATRICES: {Q: Matrix2; K: Matrix2; V: Matrix2} = {
  Q: [[.9, .3], [-.2, .8]], K: [[.7, -.4], [.2, 1]], V: [[1, .2], [-.3, .9]],
};
const UNKNOWN: Vector2 = [-.4, -.4];

export function toyTokens(input: string): string[] {
  return input.trim().toLowerCase().split(/\s+/).filter(Boolean).slice(0, 6);
}
export function dot2(a: Vector2, b: Vector2): number { return a[0] * b[0] + a[1] * b[1]; }
export function project2(x: Vector2, weights: Matrix2): Vector2 {
  return [x[0] * weights[0][0] + x[1] * weights[1][0], x[0] * weights[0][1] + x[1] * weights[1][1]];
}

export function normalizedExponential(logits: readonly number[], temperature = 1): number[] {
  if (!(temperature > 0) || !Number.isFinite(temperature)) throw new Error('Temperature must be finite and positive.');
  if (!logits.length) return [];
  if (logits.some(value => Number.isNaN(value) || value === Infinity)) throw new Error('Logits must be finite or masked with negative infinity.');
  const max = Math.max(...logits);
  if (max === -Infinity) return logits.map(() => 0);
  const weights = logits.map(value => Math.exp((value - max) / temperature));
  const sum = weights.reduce((a, b) => a + b, 0);
  return weights.map(value => value / sum);
}

/** One untrained causal attention head, followed by a deliberately small tied linear readout. */
export function computeToyAttention(input: string, queryIndex: number, temperature = 1) {
  const tokens = toyTokens(input);
  if (!tokens.length) return null;
  const query = Math.max(0, Math.min(tokens.length - 1, Math.floor(queryIndex)));
  const embeddings: Vector2[] = tokens.map((token, i) => {
    const base = Object.hasOwn(TOY_EMBEDDINGS, token) ? TOY_EMBEDDINGS[token] : UNKNOWN;
    return [base[0] + .08 * i, base[1] - .05 * i];
  });
  const queries = embeddings.map(x => project2(x, TOY_MATRICES.Q));
  const keys = embeddings.map(x => project2(x, TOY_MATRICES.K));
  const values = embeddings.map(x => project2(x, TOY_MATRICES.V));
  const dotProducts = keys.map(key => dot2(queries[query], key));
  const scaledScores = dotProducts.map(value => value / Math.sqrt(2));
  const maskedScores = scaledScores.map((score, index) => index <= query ? score : -Infinity);
  const attention = normalizedExponential(maskedScores);
  const mixed: Vector2 = [
    values.reduce((sum, value, index) => sum + attention[index] * value[0], 0),
    values.reduce((sum, value, index) => sum + attention[index] * value[1], 0),
  ];
  const logits = TOY_VOCABULARY.map(token => dot2(mixed, TOY_EMBEDDINGS[token]));
  const probabilities = normalizedExponential(logits, temperature);
  return {tokens, query, embeddings, queries, keys, values, dotProducts, scaledScores, maskedScores,
    attention, mixed, logits, probabilities, vocabulary: TOY_VOCABULARY, temperature};
}

export function sampleBernoulli(seed: number, probability: number, count: number): number[] {
  if (!Number.isFinite(probability) || probability < 0 || probability > 1) throw new Error('Probability must be between zero and one.');
  if (!Number.isInteger(count) || count < 0 || count > 100000) throw new Error('Sample count must be an integer from 0 to 100000.');
  const random = seededRandom(seed);
  return Array.from({length: count}, () => random() < probability ? 1 : 0);
}

export function runningProportions(samples: readonly number[]): number[] {
  let heads = 0;
  return samples.map((value, index) => { heads += value; return heads / (index + 1); });
}

export function binomialProbabilities(n: number, p: number): number[] {
  if (!Number.isInteger(n) || n < 0 || n > 100 || !Number.isFinite(p) || p < 0 || p > 1) throw new Error('Invalid binomial parameters.');
  if (p === 0 || p === 1) return Array.from({length: n + 1}, (_, k) => Number(k === (p === 1 ? n : 0)));
  let choose = 1;
  return Array.from({length: n + 1}, (_, k) => {
    if (k > 0) choose = choose * (n - k + 1) / k;
    return choose * p ** k * (1 - p) ** (n - k);
  });
}

export function batchHistogram(samples: readonly number[], batchSize = 10): {counts: number[]; batches: number; proportions: number[]} {
  if (!Number.isInteger(batchSize) || batchSize < 1) throw new Error('Batch size must be a positive integer.');
  const counts = Array(batchSize + 1).fill(0) as number[];
  const batches = Math.floor(samples.length / batchSize);
  for (let i = 0; i < batches; i++) counts[samples.slice(i * batchSize, (i + 1) * batchSize).reduce((a, b) => a + b, 0)]++;
  return {counts, batches, proportions: counts.map(count => batches ? count / batches : 0)};
}
