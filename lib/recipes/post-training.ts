import {Circle, Line, Rect, Txt} from '@motion-canvas/2d';
import {createSignal, linear, waitFor} from '@motion-canvas/core';
import {P, stage} from '../motion/shared';
import type {RecipeDefinition} from './types';
import {allocateProbabilityDots, parsePostTraining, trainPolicy} from './models/post-training.ts';
import {wrapLabel} from './models/text';

const clamp = (value: number) => Math.min(1, Math.max(0, value));
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (t: number) => t * t * (3 - 2 * t);
const rewardText = (value: number) => `${value > 0 ? '+' : ''}${Number(value.toFixed(2))}`;
const example = (title: string, rewards: number[]) => JSON.stringify({
  title,
  prompt: 'How should we explain agent memory?',
  learningRate: .8,
  rounds: 24,
  actions: [
    {label: 'Guess confidently', probability: .45, reward: rewards[0]},
    {label: 'Check evidence', probability: .30, reward: rewards[1]},
    {label: 'Avoid answering', probability: .25, reward: rewards[2]},
  ],
}, null, 2);

export const postTrainingRecipe: RecipeDefinition = {
  id: 'post-training',
  title: 'See what reward teaches',
  subtitle: 'Change the reward. Watch the policy learn a different preference.',
  description: 'A computed toy policy learns from three supplied reward scores. Compare its starting and final probabilities, then change what earns the highest score.',
  inputLabel: 'Prompt, replies, and rewards',
  inputFormat: 'JSON',
  accept: '.json,application/json,text/plain',
  color: P.teal,
  examples: [
    {id: 'evidence', name: 'Reward evidence', description: 'Checking evidence receives the highest score. The three starting probabilities are the same in every preset.', input: example('Reward evidence', [0, 1, -.2])},
    {id: 'confidence', name: 'Reward confidence', description: 'A confident guess receives the highest score. Watch the policy learn the preference encoded by that reward.', input: example('Reward confidence', [1, .2, -.2])},
    {id: 'equal-reward', name: 'Give equal rewards', description: 'Every reply receives the same reward, so this update has no preference to learn.', input: example('Equal rewards', [.5, .5, .5])},
  ],
  help: 'Supply exactly three actions, each with a distinct label, starting probability, and reward. Probabilities are from 0.001 to 0.998 and must add up to 1. Rewards are from -2 to 2. learningRate is from 0 to 2; rounds is a whole number from 1 to 80. Labels can contain 32 characters, the prompt 100, and the title 72. The presets use synthetic replies and scores. All three reward scores are known on every update. Dots show rounded probability shares.',
  basis: 'A computed single-prompt softmax policy. Starting logits are log(probability). Each update adds learningRate × p_i × (reward_i − expected reward) to logit i, then applies softmax. This is exact gradient ascent on the supplied expected reward, using all three scores.',
  references: [{title: 'Policy gradients · OpenAI Spinning Up', url: 'https://spinningup.openai.com/en/latest/spinningup/rl_intro3.html'}],
  compile(input) {
    const model = trainPolicy(parsePostTraining(input));
    const first = model.steps[0], final = model.steps[model.steps.length - 1];
    const rewards = model.actions.map(action => action.reward);
    const high = Math.max(...rewards), low = Math.min(...rewards);
    const winners = rewards.map((reward, i) => reward === high ? i : -1).filter(i => i >= 0);
    const tied = high === low;
    const colors = [P.blue, P.teal, P.pink];
    const centers = [-292, 0, 292];
    const assignments = model.steps.map(step => allocateProbabilityDots(step.probabilities));
    return {
      title: model.title,
      duration: 16,
      loop: false,
      checkpoints: [
        {label: 'Before', time: .8, description: 'The prompt has three possible reply strategies and a starting probability for each.'},
        {label: 'Reward', time: 4, description: 'All three supplied reward scores are visible. These scores define what the update favors.'},
        {label: 'Update', time: 9, description: 'The same probability dots move between replies as calculated policy updates accumulate.'},
        {label: 'After', time: 14.2, description: 'Compare final probabilities with the starting policy. Change the preset to change the reward.'},
      ],
      summary: `${model.rounds} computed updates; learning rate ${model.learningRate}. Expected reward ${first.expectedReward.toFixed(3)} → ${final.expectedReward.toFixed(3)}. ${tied ? 'Equal rewards leave the probabilities unchanged.' : `Highest reward: ${winners.map(i => model.actions[i].label).join(' and ')}.`}`,
      rows: [
        {label: 'Prompt', value: model.prompt, detail: 'The same single prompt is used throughout. Replies and reward scores are illustrative.'},
        ...model.actions.map((action, i) => ({label: `${String.fromCharCode(65 + i)} · ${action.label}`, value: `${(first.probabilities[i] * 100).toFixed(2)}% → ${(final.probabilities[i] * 100).toFixed(2)}%`, detail: `Supplied reward ${rewardText(action.reward)}. Probability change ${(100 * (final.probabilities[i] - first.probabilities[i])).toFixed(2)} percentage points.`})),
        {label: 'Update rule', value: 'zᵢ ← zᵢ + η pᵢ(rᵢ − E[r])', detail: `Probabilities are softmax(z). Learning rate η = ${model.learningRate}. All three supplied rewards contribute to each update.`},
        ...model.steps.map(step => ({label: `Update ${step.round}`, value: `A ${(100 * step.probabilities[0]).toFixed(2)}% · B ${(100 * step.probabilities[1]).toFixed(2)}% · C ${(100 * step.probabilities[2]).toFixed(2)}%`, detail: `Expected reward ${step.expectedReward.toFixed(5)}; logit gradient [${step.gradient.map(value => value.toFixed(5)).join(', ')}].`})),
      ],
      factory: function* (view) {
        stage(view);
        const chapter = createSignal(0), rewardReveal = createSignal(0), update = createSignal(0), comparison = createSignal(0);
        const index = () => Math.min(model.rounds - 1, Math.floor(update()));
        const fraction = () => update() >= model.rounds ? 1 : update() - index();
        const probabilities = () => first.probabilities.map((_, i) => mix(model.steps[index()].probabilities[i], model.steps[index() + 1].probabilities[i], fraction()));
        const expected = () => probabilities().reduce((sum, probability, i) => sum + probability * rewards[i], 0);
        const chapterText = () => chapter() === 0 ? 'Start with three possible replies' : chapter() === 1 ? 'Choose what earns a reward' : chapter() === 2 ? 'Repeat the policy update' : tied || model.learningRate === 0 ? 'The probabilities stayed the same' : `After ${model.rounds} reward updates`;

        view.add(new Rect({position: [0, -214], size: [854, 64], radius: 14, fill: P.panel}));
        view.add(new Txt({text: wrapLabel(model.prompt, 808, 25), position: [0, -214], fontSize: 25, lineHeight: 29, fontFamily: 'Arial', fill: P.ink, textAlign: 'center'}));
        view.add(new Txt({text: chapterText, position: [0, -144], fontSize: 27, fontFamily: 'Arial', fill: P.ink}));

        // The same three answer pools persist through the entire lesson.
        centers.forEach((x, i) => {
          view.add(new Rect({position: [x, 34], size: [264, 276], radius: 18, fill: P.panel, stroke: () => rewardReveal() > .5 && winners.includes(i) && !tied ? colors[i] : P.grid, lineWidth: () => 1.5 + rewardReveal() * (winners.includes(i) && !tied ? 1.3 : 0)}));
          view.add(new Line({points: [[x, 175], [x, 189]], stroke: colors[i], lineWidth: 2, opacity: rewardReveal}));
          view.add(new Rect({position: [x, 207], size: [194, 36], radius: 18, fill: P.panel, stroke: P.grid, lineWidth: 1, opacity: rewardReveal}));
          view.add(new Txt({text: `Reward ${rewardText(model.actions[i].reward)}`, position: [x, 207], fontSize: 23, fontFamily: 'Arial', fill: P.ink, opacity: rewardReveal}));
        });

        // Probability identities 0..99 survive each update. Rounding is only for
        // the dot view: the percentages and model rows retain computed values.
        const destination = (id: number, counts: number[]) => {
          let group = 0, offset = 0;
          while (group < 2 && id >= offset + counts[group]) {offset += counts[group]; group++;}
          const rank = id - offset;
          return {x: centers[group] - 72 + rank % 10 * 16, y: 61 + Math.floor(rank / 10) * 10.4, group};
        };
        for (let id = 0; id < 100; id++) {
          const location = () => {
            const a = destination(id, assignments[index()]);
            const b = destination(id, assignments[index() + 1]);
            const t = ease(fraction());
            const crossing = a.group !== b.group;
            return {x: mix(a.x, b.x, t), y: mix(a.y, b.y, t) - (crossing ? Math.sin(Math.PI * t) * (22 + id % 5 * 5) : 0), group: t < .5 ? a.group : b.group};
          };
          view.add(new Circle({position: () => [location().x, location().y], size: 7.3, fill: () => colors[location().group], opacity: .94}));
        }

        // Mask text against any migrating dots, then show both old and current
        // probabilities. Labels never travel or rely on a color-only legend.
        centers.forEach((x, i) => {
          view.add(new Rect({position: [x, -26], size: [254, 140], radius: 14, fill: P.panel}));
          view.add(new Circle({position: [x - 103, -84], size: 29, fill: P.bg, stroke: colors[i], lineWidth: 1.5}));
          view.add(new Txt({text: String.fromCharCode(65 + i), position: [x - 103, -84], fontSize: 19, fontFamily: 'Arial', fill: P.ink}));
          view.add(new Txt({text: wrapLabel(model.actions[i].label, 192, 25), position: [x + 12, -72], fontSize: 25, lineHeight: 28, fontFamily: 'Arial', fill: P.ink, textAlign: 'center'}));
          view.add(new Txt({text: () => `${(probabilities()[i] * 100).toFixed(1)}%`, position: [x, -13], fontSize: 43, fontFamily: 'Arial', fill: colors[i]}));
          view.add(new Txt({text: `Started at ${(first.probabilities[i] * 100).toFixed(1)}%`, position: [x, 26], fontSize: 18, fontFamily: 'Arial', fill: P.muted}));
          // A quiet baseline behind the dot mass gives the final allocation a
          // physical destination without adding another quantitative chart.
          view.add(new Line({points: [[x - 91, 162], [x + 91, 162]], stroke: P.grid, lineWidth: 1}));
        });

        // All scores join one return rail. The update returns to all three
        // policy choices below the question, leaving the prompt fixed.
        centers.forEach(x => view.add(new Line({points: [[x, 225], [x, 232]], stroke: P.yellow, lineWidth: 1.5, opacity: () => .45 * rewardReveal() * (1 - comparison() * .65)})));
        centers.forEach(x => view.add(new Line({points: [[x, -116], [x, -104]], stroke: P.yellow, lineWidth: 1.5, opacity: () => .45 * rewardReveal() * (1 - comparison() * .65)})));
        const feedbackPoints: [number, number][] = [[-292, 232], [451, 232], [451, -116], [-292, -116]];
        const feedback = new Line({points: feedbackPoints, radius: 16, stroke: P.yellow, lineWidth: 2, lineDash: [5, 7], opacity: () => .55 * rewardReveal() * (1 - comparison() * .65)});
        view.add(feedback);
        view.add(new Circle({position: () => feedback.getPointAtPercentage(clamp((update() / model.rounds * 6) % 1)).position, size: 8, fill: P.yellow, opacity: () => chapter() === 2 ? .9 : 0}));

        view.add(new Txt({text: () => chapter() === 0 ? 'Computed toy policy · each dot is about 1%' : chapter() === 1 ? 'Every reply receives its supplied score' : chapter() === 2 ? `Update ${Math.min(model.rounds, Math.ceil(update()))} / ${model.rounds} · expected reward ${expected().toFixed(2)}` : `Expected reward ${first.expectedReward.toFixed(2)} → ${final.expectedReward.toFixed(2)} · ${model.rounds} updates`, position: [0, 249], fontSize: 21, fontFamily: 'Arial', fill: P.muted}));

        yield* waitFor(2.2);
        chapter(1);
        yield* rewardReveal(1, 1.6, linear);
        yield* waitFor(1.2);
        chapter(2);
        yield* update(model.rounds, 8, linear);
        chapter(3);
        yield* comparison(1, .8, linear);
        yield* waitFor(2.2);
      },
    };
  },
};
