import type {CricketHandedness} from './cricket.ts';

export interface CricketView {handedness: CricketHandedness; mirror: boolean;}

/** View controls edit the current document, including any unrendered poses. */
export function patchCricketView(input: string, changes: Partial<CricketView>): string {
  let value: unknown;
  try {value = JSON.parse(input);} catch {throw new Error('Fix the JSON before changing the batting mode. Your edits are still here.');}
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Use a JSON object before changing the batting mode.');
  return JSON.stringify({...value, ...changes}, null, 2);
}

export function readCricketView(input: string): CricketView | null {
  try {
    const value = JSON.parse(input);
    if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
    const handedness = value.handedness ?? 'right';
    if (handedness !== 'left' && handedness !== 'right') return null;
    if (value.mirror !== undefined && typeof value.mirror !== 'boolean') return null;
    return {handedness, mirror: value.mirror === true};
  } catch {return null;}
}

export function cricketViewFromParams(params: URLSearchParams): Partial<CricketView> {
  const changes: Partial<CricketView> = {};
  const handedness = params.get('handedness'), mirror = params.get('mirror');
  if (handedness === 'left' || handedness === 'right') changes.handedness = handedness;
  if (mirror === '1' || mirror === '0') changes.mirror = mirror === '1';
  return changes;
}

export function setCricketViewParams(params: URLSearchParams, view: CricketView | null) {
  if (!view) return;
  params.set('handedness', view.handedness);
  params.set('mirror', view.mirror ? '1' : '0');
}
