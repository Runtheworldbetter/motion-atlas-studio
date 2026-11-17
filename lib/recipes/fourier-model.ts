export interface Harmonic {
  frequency: number;
  amplitude: number;
  phase: number;
}

export interface FourierModel {
  title: string;
  wave: 'square' | 'saw' | 'sine' | 'custom';
  harmonics: Harmonic[];
  amplitudeBound: number;
  rms: number;
}

const MAX_TERMS = 16;
function finite(value: unknown, label: string, min: number, max: number): number {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < min || value > max) {
    throw new Error(`${label} must be a number between ${min} and ${max}.`);
  }
  return value;
}

/** Coefficients are the exact displayed model; there is no fitted waveform. */
export function parseFourier(input: string): FourierModel {
  let value: unknown;
  try { value = JSON.parse(input); } catch { throw new Error('Enter a JSON object, for example {"wave":"square","terms":5}.'); }
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('The Fourier input must be a JSON object.');
  const data = value as Record<string, unknown>;
  if (data.title !== undefined && (typeof data.title !== 'string' || data.title.trim().length > 72)) throw new Error('The optional title must be text of at most 72 characters.');
  let wave: FourierModel['wave'];
  let harmonics: Harmonic[];
  if (data.harmonics !== undefined) {
    if (data.wave !== undefined && data.wave !== 'custom') throw new Error('Use either a preset wave or a custom harmonics array, not both.');
    if (!Array.isArray(data.harmonics) || data.harmonics.length < 1 || data.harmonics.length > MAX_TERMS) throw new Error(`Provide between 1 and ${MAX_TERMS} custom harmonics.`);
    const seen = new Set<number>();
    harmonics = data.harmonics.map((raw, i) => {
      if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new Error(`Harmonic ${i + 1} must be an object.`);
      const term = raw as Record<string, unknown>;
      const frequency = finite(term.frequency, `Harmonic ${i + 1} frequency`, 1, 64);
      if (!Number.isInteger(frequency)) throw new Error('Harmonic frequencies must be whole numbers.');
      if (seen.has(frequency)) throw new Error(`Frequency ${frequency} appears twice. Combine it into one term.`);
      seen.add(frequency);
      return {frequency, amplitude: finite(term.amplitude, `Harmonic ${i + 1} amplitude`, -10, 10), phase: finite(term.phase ?? 0, `Harmonic ${i + 1} phase (radians)`, -2 * Math.PI, 2 * Math.PI)};
    });
    wave = 'custom';
  } else {
    if (data.wave !== undefined && (typeof data.wave !== 'string' || !['square', 'saw', 'sine'].includes(data.wave))) throw new Error('wave must be "square", "saw", or "sine", or provide custom harmonics.');
    wave = (data.wave ?? 'square') as 'square' | 'saw' | 'sine';
    const terms = finite(data.terms ?? (wave === 'sine' ? 1 : 5), 'terms', 1, MAX_TERMS);
    if (!Number.isInteger(terms)) throw new Error('terms must be a whole number.');
    if (wave === 'sine' && terms !== 1) throw new Error('A sine preset contains one term. Use terms: 1 or choose another wave.');
    const amplitude = finite(data.amplitude ?? 1, 'amplitude', 0, 10);
    harmonics = Array.from({length: terms}, (_, i) => {
      const frequency = wave === 'square' ? i * 2 + 1 : i + 1;
      const coefficient = wave === 'square' ? 4 / (Math.PI * frequency) : wave === 'saw' ? 2 * (i % 2 === 0 ? 1 : -1) / (Math.PI * frequency) : 1;
      return {frequency, amplitude: amplitude * coefficient, phase: 0};
    });
  }
  const titles = {square: 'Square wave approximation', saw: 'Sawtooth wave approximation', sine: 'Sine wave', custom: 'Custom waveform'};
  return {
    title: typeof data.title === 'string' && data.title.trim() ? data.title.trim() : titles[wave],
    wave,
    harmonics,
    amplitudeBound: harmonics.reduce((sum, h) => sum + Math.abs(h.amplitude), 0),
    // Integer, distinct frequencies are orthogonal over a full 2π period.
    rms: Math.sqrt(harmonics.reduce((sum, h) => sum + h.amplitude ** 2, 0) / 2),
  };
}

export function fourierValue(model: Pick<FourierModel, 'harmonics'>, theta: number): number {
  return model.harmonics.reduce((sum, h) => sum + h.amplitude * Math.sin(h.frequency * theta + h.phase), 0);
}

export function fourierVectors(model: Pick<FourierModel, 'harmonics'>, theta: number): {x: number; y: number}[] {
  const points = [{x: 0, y: 0}];
  for (const term of model.harmonics) {
    const previous = points[points.length - 1];
    const angle = term.frequency * theta + term.phase;
    points.push({x: previous.x + term.amplitude * Math.cos(angle), y: previous.y + term.amplitude * Math.sin(angle)});
  }
  return points;
}
