/** Original, deterministic sound models for Motion Atlas. No audio or browser access. */
export const MUSIC_PITCHES = [
  {name: 'A4', midi: 69, color: '#d8b4ed'},
  {name: 'G4', midi: 67, color: '#8ccde0'},
  {name: 'E4', midi: 64, color: '#88d6b7'},
  {name: 'D4', midi: 62, color: '#e4d58d'},
  {name: 'C4', midi: 60, color: '#efab87'},
] as const;

export type ToneShape = 'sine' | 'triangle' | 'square' | 'sawtooth';
export type MusicPattern = {
  version: 1;
  bpm: number;
  steps: 8 | 16;
  timbre: 'sine' | 'soft';
  notes: boolean[][];
};

export function noteFrequency(midi: number): number {
  if (!Number.isFinite(midi) || midi < 0 || midi > 127) throw new RangeError('MIDI pitch must be between 0 and 127.');
  return 440 * 2 ** ((midi - 69) / 12);
}

export function harmonicValue(phase: number, amplitudes: readonly number[]): number {
  if (!Number.isFinite(phase) || amplitudes.some(a => !Number.isFinite(a))) throw new TypeError('Wave values must be finite.');
  const scale = Math.max(1, amplitudes.reduce((sum, a) => sum + Math.abs(a), 0));
  return amplitudes.reduce((sum, a, i) => sum + a * Math.sin((i + 1) * phase), 0) / scale;
}

export function harmonicWave(amplitudes: readonly number[], samples = 256, cycles = 2): Float32Array {
  if (!Number.isInteger(samples) || samples < 2 || samples > 16384 || !Number.isFinite(cycles) || cycles <= 0) throw new RangeError('Invalid wave sampling range.');
  return Float32Array.from({length: samples}, (_, i) => harmonicValue(i / (samples - 1) * cycles * Math.PI * 2, amplitudes));
}

export function toneValue(phase: number, shape: ToneShape): number {
  const cycle = ((phase / (Math.PI * 2)) % 1 + 1) % 1;
  if (shape === 'square') return Math.sin(phase) >= 0 ? 1 : -1;
  if (shape === 'triangle') return 2 / Math.PI * Math.asin(Math.sin(phase));
  if (shape === 'sawtooth') return 2 * cycle - 1;
  return Math.sin(phase);
}

export function makePattern(steps: 8 | 16 = 8, preset: 'rise' | 'syncopation' | 'empty' = 'rise'): MusicPattern {
  const notes = MUSIC_PITCHES.map(() => Array<boolean>(steps).fill(false));
  if (preset === 'rise') {
    const melody = [4, 3, 2, 1, 0, 1, 2, 3];
    for (let step = 0; step < steps; step++) notes[melody[step % 8]][step] = true;
  } else if (preset === 'syncopation') {
    for (let step = 0; step < steps; step++) {
      if ([0, 3, 6].includes(step % 8)) notes[4][step] = true;
      if ([2, 5, 7].includes(step % 8)) notes[2][step] = true;
      if (step % 8 === 4) notes[0][step] = true;
    }
  }
  return {version: 1, bpm: 110, steps, timbre: 'soft', notes};
}

/** Validate and copy imported data. Unknown properties never become executable state. */
export function validatePattern(value: unknown): MusicPattern {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new TypeError('Choose a Motion Atlas pattern JSON object.');
  const p = value as Record<string, unknown>;
  if (p.version !== 1) throw new TypeError('This pattern needs version 1.');
  if (p.steps !== 8 && p.steps !== 16) throw new TypeError('A pattern must have 8 or 16 steps.');
  if (typeof p.bpm !== 'number' || !Number.isFinite(p.bpm) || p.bpm < 60 || p.bpm > 180) throw new TypeError('Tempo must be between 60 and 180 BPM.');
  if (p.timbre !== 'sine' && p.timbre !== 'soft') throw new TypeError('Choose the sine or soft timbre.');
  if (!Array.isArray(p.notes) || p.notes.length !== MUSIC_PITCHES.length) throw new TypeError('A pattern needs five pitch rows.');
  const steps = p.steps;
  const notes = p.notes.map(row => {
    if (!Array.isArray(row) || row.length !== steps || row.some(note => typeof note !== 'boolean')) throw new TypeError('Every pitch row must contain one true/false value per step.');
    return [...row] as boolean[];
  });
  return {version: 1, bpm: p.bpm, steps, timbre: p.timbre, notes};
}

export function patternStepSeconds(pattern: MusicPattern): number { return 60 / pattern.bpm / 2; }
export function patternDuration(pattern: MusicPattern): number { return pattern.steps * patternStepSeconds(pattern); }

/** The same bounded waveform used by the live sequencer's PeriodicWave. */
export function instrumentValue(phase: number, timbre: MusicPattern['timbre']): number {
  return timbre === 'sine' ? Math.sin(phase) : (Math.sin(phase) + .25 * Math.sin(2 * phase) + .08 * Math.sin(3 * phase)) / 1.33;
}

export function noteEnvelope(time: number, duration: number): number {
  if (time <= 0 || time >= duration) return 0;
  const attack = Math.min(.008, duration * .15);
  const release = Math.min(.055, duration * .3);
  if (time < attack) return time / attack;
  if (time > duration - release) return (duration - time) / release;
  return 1;
}

/** Render one complete cycle, with headroom and click-free note boundaries. */
export function renderPatternSamples(input: MusicPattern, sampleRate = 22050, gain = .12): Float32Array {
  const pattern = validatePattern(input);
  if (!Number.isInteger(sampleRate) || sampleRate < 8000 || sampleRate > 96000) throw new RangeError('Sample rate must be 8000–96000 Hz.');
  if (!Number.isFinite(gain) || gain < 0 || gain > .3) throw new RangeError('Export gain must be between 0 and 0.3.');
  const stepSeconds = patternStepSeconds(pattern), duration = stepSeconds * .86;
  const samples = new Float32Array(Math.ceil(patternDuration(pattern) * sampleRate));
  for (let step = 0; step < pattern.steps; step++) {
    const rows = pattern.notes.flatMap((row, pitch) => row[step] ? [pitch] : []);
    if (!rows.length) continue;
    const start = Math.round(step * stepSeconds * sampleRate);
    const length = Math.ceil(duration * sampleRate);
    for (let i = 0; i < length && start + i < samples.length; i++) {
      const time = i / sampleRate;
      let value = 0;
      for (const row of rows) value += instrumentValue(Math.PI * 2 * noteFrequency(MUSIC_PITCHES[row].midi) * time, pattern.timbre);
      samples[start + i] = gain * noteEnvelope(time, duration) * value / rows.length;
    }
  }
  return samples;
}

/** Mono, signed 16-bit little-endian PCM in a standard RIFF/WAVE container. */
export function encodeWav(samples: Float32Array, sampleRate: number): ArrayBuffer {
  if (!Number.isInteger(sampleRate) || sampleRate < 8000 || sampleRate > 96000) throw new RangeError('Invalid WAV sample rate.');
  if (samples.some(sample => !Number.isFinite(sample))) throw new TypeError('WAV samples must be finite.');
  const buffer = new ArrayBuffer(44 + samples.length * 2), view = new DataView(buffer);
  const text = (offset: number, value: string) => [...value].forEach((c, i) => view.setUint8(offset + i, c.charCodeAt(0)));
  text(0, 'RIFF'); view.setUint32(4, buffer.byteLength - 8, true); text(8, 'WAVE'); text(12, 'fmt ');
  view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true); view.setUint32(28, sampleRate * 2, true); view.setUint16(32, 2, true); view.setUint16(34, 16, true);
  text(36, 'data'); view.setUint32(40, samples.length * 2, true);
  samples.forEach((sample, i) => { const s = Math.max(-1, Math.min(1, sample)); view.setInt16(44 + i * 2, Math.round(s * (s < 0 ? 32768 : 32767)), true); });
  return buffer;
}
