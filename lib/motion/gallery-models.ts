/** Shared math for the field arrows and the particles traveling through them. */
export const SPIRAL_DECAY = Math.log(20);
export const SPIRAL_SPEED = 4 * Math.PI;
export function spiralPoint(progress: number, phase: number): {x: number; y: number} {
  const r = Math.exp(-SPIRAL_DECAY * progress), angle = SPIRAL_SPEED * progress + phase;
  return {x: 370 * r * Math.cos(angle), y: -20 + 160 * r * Math.sin(angle)};
}
export function spiralVelocity(x: number, y: number): {x: number; y: number} {
  const centeredY = y + 20;
  return {x: -SPIRAL_DECAY * x - SPIRAL_SPEED * 370 / 160 * centeredY, y: SPIRAL_SPEED * 160 / 370 * x - SPIRAL_DECAY * centeredY};
}

export interface HistogramObservation {bin: number; jitter: number; previousInBin: number;}
/** Seeded synthetic observations; each dot and each count use this same list. */
export function histogramObservations(count = 120, bins = 15, seed = 73): HistogramObservation[] {
  let state = seed >>> 0;
  const random = () => {state = (Math.imul(1664525, state) + 1013904223) >>> 0; return state / 4294967296;};
  const counts = Array<number>(bins).fill(0);
  return Array.from({length: count}, () => {
    let sum = 0;
    for (let i = 0; i < 6; i++) sum += random();
    const bin = Math.max(0, Math.min(bins - 1, Math.round((bins - 1) / 2 + (sum - 3) * 3.5)));
    return {bin, jitter: (random() - .5) * 20, previousInBin: counts[bin]++};
  });
}
export function histogramCounts(observations: HistogramObservation[], arrived: number, bins = 15): number[] {
  const counts = Array<number>(bins).fill(0);
  for (let i = 0; i < Math.max(0, Math.min(observations.length, Math.floor(arrived))); i++) counts[observations[i].bin]++;
  return counts;
}
