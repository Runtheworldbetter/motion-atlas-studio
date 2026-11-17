export const POST_TRAINING_LIMITS = {
  characters: 12000,
  actions: 3,
  title: 72,
  prompt: 100,
  label: 32,
  minimumProbability: .001,
  maximumProbability: .998,
  maximumReward: 2,
  maximumLearningRate: 2,
  maximumRounds: 80,
} as const;

export interface PolicyAction {label: string; probability: number; reward: number;}
export interface PostTrainingInput {
  title: string;
  prompt: string;
  actions: PolicyAction[];
  learningRate: number;
  rounds: number;
}
export interface PolicyStep {
  round: number;
  logits: number[];
  probabilities: number[];
  expectedReward: number;
  gradient: number[];
}
export interface PostTrainingModel extends PostTrainingInput {steps: PolicyStep[];}

function text(value: unknown, name: string, length: number): string {
  if (typeof value !== 'string' || !value.trim()) throw new Error(`${name} must be a nonempty string.`);
  const result = value.trim();
  if (result.length > length) throw new Error(`${name} must be ${length} characters or fewer.`);
  return result;
}

export function parsePostTraining(input: string): PostTrainingInput {
  if (input.length > POST_TRAINING_LIMITS.characters) throw new Error('Keep the policy input below 12,000 characters.');
  let raw: unknown;
  try {raw = JSON.parse(input);} catch {throw new Error('Enter valid JSON with three actions, their starting probabilities, and their rewards.');}
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new Error('The policy input must be a JSON object.');
  const source = raw as Record<string, unknown>;
  if (!Array.isArray(source.actions) || source.actions.length !== 3) throw new Error('Supply exactly three actions.');
  const actions = source.actions.map((value, i): PolicyAction => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error(`Action ${i + 1} must be an object.`);
    const action = value as Record<string, unknown>;
    if (typeof action.probability !== 'number' || !Number.isFinite(action.probability) || action.probability < .001 || action.probability > .998) {
      throw new Error(`Action ${i + 1}: probability must be a number from 0.001 to 0.998.`);
    }
    if (typeof action.reward !== 'number' || !Number.isFinite(action.reward) || Math.abs(action.reward) > 2) {
      throw new Error(`Action ${i + 1}: reward must be a number from -2 to 2.`);
    }
    return {label: text(action.label, `Action ${i + 1} label`, 32), probability: action.probability, reward: action.reward};
  });
  const sum = actions.reduce((total, action) => total + action.probability, 0);
  if (Math.abs(sum - 1) > 1e-9) throw new Error(`Starting probabilities must add up to 1; these add up to ${Number(sum.toFixed(8))}.`);
  if (new Set(actions.map(action => action.label.toLocaleLowerCase())).size !== actions.length) throw new Error('Give each action a different label.');
  const learningRate = source.learningRate === undefined ? .8 : source.learningRate;
  if (typeof learningRate !== 'number' || !Number.isFinite(learningRate) || learningRate < 0 || learningRate > 2) throw new Error('learningRate must be a number from 0 to 2.');
  const rounds = source.rounds === undefined ? 24 : source.rounds;
  if (typeof rounds !== 'number' || !Number.isInteger(rounds) || rounds < 1 || rounds > 80) throw new Error('rounds must be a whole number from 1 to 80.');
  return {
    title: source.title === undefined ? 'How reward changes a policy' : text(source.title, 'Title', 72),
    prompt: text(source.prompt, 'Prompt', 100),
    actions: actions.map(action => ({...action, probability: action.probability / sum})),
    learningRate,
    rounds,
  };
}

/** Stable softmax over a small finite vector. No sampling is involved. */
export function softmax(logits: readonly number[]): number[] {
  const largest = Math.max(...logits);
  const weights = logits.map(value => Math.exp(value - largest));
  const sum = weights.reduce((total, weight) => total + weight, 0);
  return weights.map(weight => weight / sum);
}

export function expectedReward(probabilities: readonly number[], rewards: readonly number[]): number {
  return probabilities.reduce((total, probability, i) => total + probability * rewards[i], 0);
}

/** Exact derivative of J(z) = sum_i softmax(z)_i * reward_i. */
export function rewardGradient(probabilities: readonly number[], rewards: readonly number[]): number[] {
  const baseline = expectedReward(probabilities, rewards);
  return probabilities.map((probability, i) => probability * (rewards[i] - baseline));
}

/** Full-information gradient ascent: every update uses all supplied rewards. */
export function trainPolicy(input: PostTrainingInput): PostTrainingModel {
  const rewards = input.actions.map(action => action.reward);
  let logits = input.actions.map(action => Math.log(action.probability));
  const steps: PolicyStep[] = [];
  for (let round = 0; round <= input.rounds; round++) {
    const probabilities = softmax(logits);
    const gradient = rewardGradient(probabilities, rewards);
    steps.push({round, logits: [...logits], probabilities, expectedReward: expectedReward(probabilities, rewards), gradient});
    if (round < input.rounds) logits = logits.map((value, i) => value + input.learningRate * gradient[i]);
  }
  return {...input, actions: input.actions.map(action => ({...action})), steps};
}

/** Largest-remainder allocation conserves all 100 dots; exact values stay in text. */
export function allocateProbabilityDots(probabilities: readonly number[], total = 100): number[] {
  const raw = probabilities.map(probability => probability * total);
  const counts = raw.map(Math.floor);
  let remainder = total - counts.reduce((sum, count) => sum + count, 0);
  const order = raw.map((value, i) => ({i, fraction: value - counts[i]}))
    .sort((a, b) => b.fraction - a.fraction || a.i - b.i);
  for (let i = 0; remainder > 0; i++, remainder--) counts[order[i % order.length].i]++;
  return counts;
}
