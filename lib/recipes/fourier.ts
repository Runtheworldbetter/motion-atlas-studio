import {Circle, Line, Txt} from '@motion-canvas/2d';
import {createSignal, linear} from '@motion-canvas/core';
import {P, label, stage, TAU} from '../motion/shared';
import type {RecipeDefinition} from './types';
import {fourierValue, fourierVectors, parseFourier} from './fourier-model.ts';

const examples = [
  {id: 'square', name: 'Square wave', description: 'Five odd harmonics with their exact Fourier coefficients.', input: JSON.stringify({wave: 'square', terms: 5, amplitude: 1}, null, 2)},
  {id: 'saw', name: 'Sawtooth wave', description: 'Eight integer harmonics with alternating coefficients.', input: JSON.stringify({wave: 'saw', terms: 8, amplitude: 1}, null, 2)},
  {id: 'sine', name: 'Single sine', description: 'One rotating vector traces a sine wave.', input: JSON.stringify({wave: 'sine', terms: 1, amplitude: 1}, null, 2)},
  {id: 'custom', name: 'Mix your own', description: 'Edit frequencies, signed amplitudes, and phases in radians.', input: JSON.stringify({title: 'Three harmonics', harmonics: [{frequency: 1, amplitude: 1}, {frequency: 2, amplitude: 0.45, phase: 1.57}, {frequency: 5, amplitude: 0.2}]}, null, 2)},
];

export const fourierRecipe: RecipeDefinition = {
  id: 'fourier', title: 'Build a waveform', subtitle: 'Add sine waves with different frequencies.',
  description: 'Change the number of harmonics or enter your own frequencies and amplitudes. The waveform shows their sum.',
  inputLabel: 'Waveform specification', inputFormat: 'JSON', accept: '.json,application/json', color: P.orange,
  examples,
  help: 'Preset: {"wave":"square"|"saw"|"sine","terms":1–16,"amplitude":0–10}. A sine uses one term. Custom: {"harmonics":[{"frequency":1–64,"amplitude":-10–10,"phase":0}]}. Frequencies must be distinct integers; phase is in radians from −2π to 2π. Each preview scales automatically. Use the coefficient table to compare amplitudes.',
  basis: 'Adds a finite set of sine waves using Fourier coefficients. Square and sawtooth presets use the standard coefficients for those waves. The finite sum overshoots near sudden changes.',
  compile(input) {
    const model = parseFourier(input);
    const count = model.harmonics.length;
    const rows = [
      {label: 'Model', value: model.wave === 'custom' ? 'Custom harmonic sum' : `${model.wave} preset`, detail: 'y(θ) = Σ aₙ sin(nθ + φₙ)'},
      {label: 'Terms', value: String(count), detail: 'Distinct positive integer frequencies; θ spans two complete periods.'},
      {label: 'RMS amplitude', value: model.rms.toFixed(4), detail: '√(Σ aₙ² / 2), calculated over a full period.'},
      ...model.harmonics.map(h => ({label: `Frequency ${h.frequency}`, value: `amplitude ${h.amplitude.toFixed(5)}`, detail: `phase ${h.phase.toFixed(5)} radians`})),
    ];
    return {
      title: model.title,
      summary: `${count} ${count === 1 ? 'harmonic' : 'harmonics'} · RMS amplitude ${model.rms.toFixed(3)}`,
      rows, duration: 10,
      factory: function* (view) {
        stage(view);
        const theta = createSignal(0);
        const scale = 160 / Math.max(model.amplitudeBound, 0.1);
        const originX = -255, centerY = -10, plotX = 35, plotWidth = 385;
        const colors = [P.orange, P.yellow, P.teal, P.blue, P.pink, P.purple];
        const point = (index: number) => {
          const p = fourierVectors(model, theta())[index];
          return [originX + p.x * scale, centerY - p.y * scale] as [number, number];
        };
        label(view, 'ROTATING TERMS', -255, -215, P.muted, 18);
        label(view, 'THEIR VERTICAL SUM', 225, -215, P.muted, 18);
        view.add(new Line({points: [[plotX, -180], [plotX, 170]], stroke: P.grid, lineWidth: 1}));
        view.add(new Line({points: [[plotX, centerY], [plotX + plotWidth, centerY]], stroke: P.muted, lineWidth: 1.2}));
        for (const fraction of [0, .5, 1]) {
          const x = plotX + plotWidth * fraction;
          view.add(new Line({points: [[x, -180], [x, 170]], stroke: P.grid, lineWidth: 1, lineDash: [3, 7]}));
          label(view, fraction === 0 ? 'NOW' : fraction === .5 ? '−1 PERIOD' : '−2 PERIODS', x, 190, P.muted, 13);
        }
        model.harmonics.forEach((h, index) => {
          view.add(new Circle({position: () => point(index), size: Math.abs(h.amplitude) * scale * 2, stroke: index === 0 ? P.muted : P.grid, lineWidth: 1.4}));
          view.add(new Line({points: () => [point(index), point(index + 1)], stroke: colors[index % colors.length], lineWidth: 2.4}));
          view.add(new Circle({position: () => point(index + 1), size: index === count - 1 ? 12 : 5, fill: colors[index % colors.length]}));
        });
        view.add(new Line({points: () => [point(count), [plotX, centerY - fourierValue(model, theta()) * scale]], stroke: P.muted, lineWidth: 1.4, lineDash: [5, 7]}));
        view.add(new Line({points: () => Array.from({length: 320}, (_, i) => [plotX + i / 319 * plotWidth, centerY - fourierValue(model, theta() - i / 319 * TAU * 2) * scale] as [number, number]), stroke: P.orange, lineWidth: 3.8, lineCap: 'round'}));
        view.add(new Circle({position: () => [plotX, centerY - fourierValue(model, theta()) * scale], size: 11, fill: P.ink}));
        label(view, `${count} ${count === 1 ? 'TERM' : 'TERMS'} · y(θ) = Σ aₙ sin(nθ + φₙ)`, 0, 231, P.ink, 21);
        view.add(new Txt({text: () => `y = ${fourierValue(model, theta()).toFixed(3)}`, position: [-255, 195], fontFamily: 'Arial', fontSize: 24, fill: P.orange}));
        yield* theta(TAU * 2, 10, linear);
      },
    };
  },
};
