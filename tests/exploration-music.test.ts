import test from 'node:test';
import assert from 'node:assert/strict';
import {encodeWav, harmonicValue, harmonicWave, makePattern, MUSIC_PITCHES, noteEnvelope, noteFrequency, patternDuration, renderPatternSamples, validatePattern} from '../lib/explorations/music.ts';

test('equal-tempered pitch preserves A440 and octave ratios', () => {
  assert.equal(noteFrequency(69), 440);
  assert.ok(Math.abs(noteFrequency(60) - 261.6255653) < 1e-6);
  assert.equal(noteFrequency(72) / noteFrequency(60), 2);
  assert.throws(() => noteFrequency(NaN));
});

test('harmonics sum on a bounded shared scale and silent components remain silent', () => {
  assert.equal(harmonicValue(Math.PI / 2, [1]), 1);
  assert.ok(Math.abs(harmonicValue(Math.PI / 4, [0, 1]) - 1) < 1e-12);
  assert.ok(harmonicWave([0, 0, 0]).every(v => v === 0));
  assert.ok(harmonicWave(Array(8).fill(1), 1024).every(v => Number.isFinite(v) && Math.abs(v) <= 1));
  assert.throws(() => harmonicWave([Infinity]));
});

test('pattern import validates dimensions and bounds, and copies notes', () => {
  const original = makePattern();
  const copy = validatePattern(JSON.parse(JSON.stringify(original)));
  assert.deepEqual(copy, original);
  copy.notes[0][0] = !copy.notes[0][0];
  assert.notEqual(copy.notes[0][0], original.notes[0][0]);
  for (const patch of [{version: 2}, {steps: 1000}, {bpm: 0}, {bpm: Infinity}, {timbre: 'custom'}, {notes: []}, {notes: Array(5).fill(Array(8).fill('true'))}]) {
    assert.throws(() => validatePattern({...original, ...patch}));
  }
});

test('one exported cycle has the expected musical duration and silent gaps', () => {
  const pattern = {...makePattern(8), bpm: 120};
  assert.equal(patternDuration(pattern), 2);
  const samples = renderPatternSamples(pattern, 16000, .12);
  assert.equal(samples.length, 32000);
  assert.equal(samples[0], 0);
  assert.equal(samples.at(-1), 0);
  assert.ok(samples.some(v => Math.abs(v) > .02));
  assert.ok(samples.every(v => Number.isFinite(v) && Math.abs(v) <= .120001));
  assert.ok(renderPatternSamples(makePattern(16, 'empty')).every(v => v === 0));
  assert.equal(noteEnvelope(0, .2), 0); assert.equal(noteEnvelope(.2, .2), 0);
});

test('export retains pitch and bounds simultaneous notes instead of clipping', () => {
  const pattern = makePattern(8, 'empty'); pattern.timbre = 'sine'; pattern.notes[0][0] = true;
  const rate = 22050, samples = renderPatternSamples(pattern, rate);
  const energyAt = (hz: number) => {
    let real = 0, imag = 0;
    for (let i = 400; i < 3800; i++) {real += samples[i] * Math.cos(2 * Math.PI * hz * i / rate); imag += samples[i] * Math.sin(2 * Math.PI * hz * i / rate);}
    return Math.hypot(real, imag);
  };
  assert.ok(energyAt(noteFrequency(MUSIC_PITCHES[0].midi)) > energyAt(530) * 10);
  pattern.notes.forEach(row => row.fill(true));
  assert.ok(renderPatternSamples(pattern).every(v => Math.abs(v) <= .120001));
});

test('WAV export has a valid mono PCM header and correct little-endian samples', () => {
  const wav = encodeWav(new Float32Array([0, 1, -1]), 22050), view = new DataView(wav);
  assert.equal(new TextDecoder().decode(wav.slice(0, 4)), 'RIFF');
  assert.equal(view.getUint32(4, true), wav.byteLength - 8);
  assert.equal(view.getUint16(22, true), 1); assert.equal(view.getUint32(24, true), 22050);
  assert.equal(view.getUint32(40, true), 6);
  assert.equal(view.getInt16(46, true), 32767); assert.equal(view.getInt16(48, true), -32768);
  assert.throws(() => encodeWav(new Float32Array([NaN]), 22050));
});
