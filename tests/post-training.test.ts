import test from 'node:test';
import assert from 'node:assert/strict';
import {allocateProbabilityDots, expectedReward, parsePostTraining, rewardGradient, softmax, trainPolicy} from '../lib/recipes/models/post-training.ts';

const input = (overrides: Record<string, unknown> = {}) => JSON.stringify({
  prompt: 'Explain agent memory', learningRate: .8, rounds: 24,
  actions: [
    {label: 'Guess confidently', probability: .45, reward: 0},
    {label: 'Check evidence', probability: .3, reward: 1},
    {label: 'Avoid answering', probability: .25, reward: -.2},
  ], ...overrides,
});
const close = (a: number, b: number, tolerance = 1e-11) => assert.ok(Math.abs(a - b) < tolerance, `${a} differs from ${b}`);

test('the analytical gradient agrees with independent central finite differences', () => {
  const logits = [-1.2, .3, .7], rewards = [-.4, 1.4, .2];
  const analytical = rewardGradient(softmax(logits), rewards), epsilon = 1e-5;
  for (let i = 0; i < logits.length; i++) {
    const plus = [...logits], minus = [...logits];
    plus[i] += epsilon; minus[i] -= epsilon;
    const difference = (expectedReward(softmax(plus), rewards) - expectedReward(softmax(minus), rewards)) / (2 * epsilon);
    close(analytical[i], difference, 1e-9);
  }
  close(analytical.reduce((sum, value) => sum + value, 0), 0);
});

test('updates preserve normalized finite probabilities and favor the better-scoring reply', () => {
  const model = trainPolicy(parsePostTraining(input()));
  assert.equal(model.steps.length, 25);
  for (const step of model.steps) {
    assert.ok(step.probabilities.every(value => value > 0 && value < 1 && Number.isFinite(value)));
    assert.ok(step.logits.every(Number.isFinite));
    close(step.probabilities.reduce((sum, value) => sum + value, 0), 1);
  }
  const final = model.steps.at(-1)!;
  assert.ok(final.probabilities[1] > .9);
  assert.ok(final.expectedReward > model.steps[0].expectedReward);
  for (let i = 1; i < model.steps.length; i++) assert.ok(model.steps[i].expectedReward >= model.steps[i - 1].expectedReward);
});

test('changing which behavior gets rewarded changes the learned preference', () => {
  const parsed = parsePostTraining(input());
  const evidence = trainPolicy(parsed).steps.at(-1)!.probabilities;
  const confidence = trainPolicy({...parsed, actions: parsed.actions.map((action, i) => ({...action, reward: [1, .2, -.2][i]}))}).steps.at(-1)!.probabilities;
  assert.ok(evidence[1] > evidence[0]);
  assert.ok(confidence[0] > confidence[1]);
});

test('equal rewards, a zero learning rate, and a common reward offset have the expected invariants', () => {
  const parsed = parsePostTraining(input());
  const equal = trainPolicy({...parsed, actions: parsed.actions.map(action => ({...action, reward: .5}))});
  const frozen = trainPolicy({...parsed, learningRate: 0});
  for (const model of [equal, frozen]) for (const step of model.steps) {
    step.probabilities.forEach((value, i) => close(value, parsed.actions[i].probability));
  }
  const original = trainPolicy(parsed);
  const shifted = trainPolicy({...parsed, actions: parsed.actions.map(action => ({...action, reward: action.reward + .75}))});
  original.steps.forEach((step, round) => step.probabilities.forEach((value, i) => close(value, shifted.steps[round].probabilities[i])));
});

test('permuting action order permutes the trajectory without changing the objective', () => {
  const parsed = parsePostTraining(input()), order = [2, 0, 1];
  const original = trainPolicy(parsed), permuted = trainPolicy({...parsed, actions: order.map(i => parsed.actions[i])});
  original.steps.forEach((step, round) => {
    close(step.expectedReward, permuted.steps[round].expectedReward);
    order.forEach((old, current) => close(step.probabilities[old], permuted.steps[round].probabilities[current]));
  });
});

test('softmax remains stable for large logits and is invariant to a common logit offset', () => {
  const first = softmax([1000, 1001, 999]), second = softmax([0, 1, -1]);
  first.forEach((value, i) => close(value, second[i]));
  close(softmax([-1000, -999, -1001]).reduce((sum, value) => sum + value, 0), 1);
});

test('rounded probability dots conserve 100 with at most one-dot error per action', () => {
  const models = [trainPolicy(parsePostTraining(input())), trainPolicy(parsePostTraining(input({learningRate: 2, rounds: 80})))];
  for (const model of models) for (const step of model.steps) {
    const counts = allocateProbabilityDots(step.probabilities);
    assert.equal(counts.reduce((sum, value) => sum + value, 0), 100);
    assert.ok(counts.every(Number.isInteger));
    counts.forEach((count, i) => assert.ok(Math.abs(count - step.probabilities[i] * 100) < 1));
  }
  assert.deepEqual(allocateProbabilityDots([1 / 3, 1 / 3, 1 / 3]), [34, 33, 33]);
});

test('invalid shape, probabilities, rewards, strings, and resource limits are rejected', () => {
  assert.throws(() => parsePostTraining('[]'), /object/);
  assert.throws(() => parsePostTraining('{'), /valid JSON/);
  assert.throws(() => parsePostTraining(input({actions: []})), /exactly three/);
  const parsed = JSON.parse(input());
  for (const probability of [0, -1, 1, .999, '0.45', null]) {
    const actions = parsed.actions.map((action: object, i: number) => i === 0 ? {...action, probability} : action);
    assert.throws(() => parsePostTraining(input({actions})), /probability/);
  }
  assert.throws(() => parsePostTraining(input({actions: parsed.actions.map((action: object) => ({...action, probability: .4}))})), /add up/);
  assert.throws(() => parsePostTraining(input({actions: parsed.actions.map((action: object) => ({...action, label: 'same'}))})), /different label/);
  for (const reward of [-2.1, 2.1, null, '1']) assert.throws(() => parsePostTraining(input({actions: parsed.actions.map((action: object) => ({...action, reward}))})), /reward/);
  for (const rounds of [0, 81, 2.5, '24', null]) assert.throws(() => parsePostTraining(input({rounds})), /rounds/);
  for (const learningRate of [-.1, 2.01, '0.8', null]) assert.throws(() => parsePostTraining(input({learningRate})), /learningRate/);
  assert.throws(() => parsePostTraining(input({prompt: 'x'.repeat(101)})), /100/);
  assert.throws(() => parsePostTraining(input({title: 'x'.repeat(73)})), /72/);
  assert.throws(() => parsePostTraining(' '.repeat(12001)), /12,000/);
});
