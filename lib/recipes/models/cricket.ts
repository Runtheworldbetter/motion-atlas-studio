export type Point = [number, number];
export const CRICKET_PHASES = ['Set-up', 'Downswing', 'Contact', 'Follow-through'] as const;
export const BAT = {knob: -22, upperHand: -9, lowerHand: 9, blade: 26, contact: 86, toe: 110} as const;
export const LIMBS = {upperArm: 55, forearm: 55, thigh: 76, shin: 78} as const;
export const BALL_RADIUS = 5.5;

export interface CricketFrame {
  grip: Point;
  batAngle: number;
  hip: Point;
  lean: number;
  frontFoot: number;
}
export interface CricketInput {
  title: string;
  frames: CricketFrame[];
  transitionSeconds: number;
  contactHold: number;
  mirror: boolean;
  showTraces: boolean;
}
export interface BatGeometry {
  grip: Point;
  direction: Point;
  normal: Point;
  knob: Point;
  upperHand: Point;
  lowerHand: Point;
  blade: Point;
  contact: Point;
  toe: Point;
}
export interface CricketPose {
  frame: CricketFrame;
  bat: BatGeometry;
  head: Point;
  neck: Point;
  shoulders: [Point, Point];
  hips: [Point, Point];
  elbows: [Point, Point];
  knees: [Point, Point];
  ankles: [Point, Point];
  toes: [Point, Point];
}

export const DEFAULT_CRICKET_FRAMES: CricketFrame[] = [
  {grip: [35, -74], batAngle: 223, hip: [0, 0], lean: -6, frontFoot: 72},
  {grip: [46, -44], batAngle: 132, hip: [4, 0], lean: -2, frontFoot: 97},
  {grip: [61, -18], batAngle: 72, hip: [10, 1], lean: 4, frontFoot: 104},
  {grip: [69, -61], batAngle: -36, hip: [12, 0], lean: 9, frontFoot: 104},
];
const clamp = (n: number, a = 0, b = 1) => Math.max(a, Math.min(b, n));
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
export const distance = (a: Point, b: Point) => Math.hypot(b[0] - a[0], b[1] - a[1]);
const add = (a: Point, b: Point, n = 1): Point => [a[0] + b[0] * n, a[1] + b[1] * n];

/** Clockwise angle in a side-view coordinate system where positive y is down. */
export function batGeometry(frame: CricketFrame): BatGeometry {
  const r = frame.batAngle * Math.PI / 180;
  const direction: Point = [Math.cos(r), Math.sin(r)];
  const normal: Point = [-direction[1], direction[0]];
  return {
    grip: [...frame.grip], direction, normal,
    knob: add(frame.grip, direction, BAT.knob),
    upperHand: add(frame.grip, direction, BAT.upperHand),
    lowerHand: add(frame.grip, direction, BAT.lowerHand),
    blade: add(frame.grip, direction, BAT.blade),
    contact: add(frame.grip, direction, BAT.contact),
    toe: add(frame.grip, direction, BAT.toe),
  };
}

/** Exact two-link IK. Invalid reaches are rejected rather than stretching a limb. */
function joint(a: Point, b: Point, upper: number, lower: number, bend: number): Point {
  const d = distance(a, b);
  if (d <= Math.abs(upper - lower) + .001 || d >= upper + lower - .001) {
    throw new Error('A hand or foot is beyond the fixed limb reach. Move the grip or foot closer to the body.');
  }
  const dx = (b[0] - a[0]) / d, dy = (b[1] - a[1]) / d;
  const along = (upper * upper - lower * lower + d * d) / (2 * d);
  const height = Math.sqrt(Math.max(0, upper * upper - along * along));
  return [a[0] + dx * along - dy * height * bend, a[1] + dy * along + dx * height * bend];
}

export function sampleCricket(input: CricketInput, rawPhase: number): CricketPose {
  if (!Number.isFinite(rawPhase)) throw new Error('The swing phase must be finite.');
  const phase = clamp(rawPhase, 0, 3), k = Math.min(2, Math.floor(phase));
  const t = phase >= 3 ? 1 : .5 - .5 * Math.cos(Math.PI * (phase - k));
  const a = input.frames[k], b = input.frames[k + 1];
  // Interpolate on the circle, keeping both the bat and its grip separation rigid.
  const delta = (((b.batAngle - a.batAngle + 180) % 360) + 360) % 360 - 180;
  const frame: CricketFrame = {
    grip: [mix(a.grip[0], b.grip[0], t), mix(a.grip[1], b.grip[1], t)],
    batAngle: a.batAngle + delta * t,
    hip: [mix(a.hip[0], b.hip[0], t), mix(a.hip[1], b.hip[1], t)],
    lean: mix(a.lean, b.lean, t), frontFoot: mix(a.frontFoot, b.frontFoot, t),
  };
  const r = frame.lean * Math.PI / 180;
  const body = (x: number, y: number): Point => [frame.hip[0] + x * Math.cos(r) - y * Math.sin(r), frame.hip[1] + x * Math.sin(r) + y * Math.cos(r)];
  const shoulders: [Point, Point] = [body(-16, -86), body(16, -86)];
  const hips: [Point, Point] = [body(-12, 0), body(12, 0)];
  const lift = phase > 0 && phase < 1.3 ? 12 * Math.sin(Math.PI * phase / 1.3) : 0;
  const ankles: [Point, Point] = [[-62, 125], [frame.frontFoot, 125 - lift]];
  const bat = batGeometry(frame);
  return {
    frame, bat, shoulders, hips, ankles,
    head: body(0, -121), neck: body(0, -101),
    elbows: [joint(shoulders[0], bat.upperHand, LIMBS.upperArm, LIMBS.forearm, 1), joint(shoulders[1], bat.lowerHand, LIMBS.upperArm, LIMBS.forearm, 1)],
    knees: [joint(hips[0], ankles[0], LIMBS.thigh, LIMBS.shin, 1), joint(hips[1], ankles[1], LIMBS.thigh, LIMBS.shin, -1)],
    toes: [[-35, 129], [frame.frontFoot + 26, 129 - lift]],
  };
}

/** The authored delivery bounces before meeting the blade at phase 2. */
export function cricketBall(input: CricketInput, rawPhase: number): Point {
  const phase = clamp(rawPhase, 0, 3);
  const contact = contactGeometry(input).ballCenter;
  const start: Point = [270, -42], bounce: Point = [178, 125], end: Point = [275, -108];
  const quadratic = (a: Point, c: Point, b: Point, t: number): Point => [
    (1 - t) ** 2 * a[0] + 2 * (1 - t) * t * c[0] + t * t * b[0],
    (1 - t) ** 2 * a[1] + 2 * (1 - t) * t * c[1] + t * t * b[1],
  ];
  if (phase <= 1) return quadratic(start, [230, -20], bounce, phase);
  if (phase <= 2) return quadratic(bounce, [135, 72], contact, phase - 1);
  return quadratic(contact, [192, -30], end, phase - 2);
}

export function contactGeometry(input: CricketInput) {
  const bat = batGeometry(input.frames[2]);
  const halfWidth = 4.5 + 2 * (BAT.contact - BAT.blade) / (BAT.toe - BAT.blade);
  const surface = add(bat.contact, bat.normal, -halfWidth);
  return {surface, ballCenter: add(surface, bat.normal, -BALL_RADIUS), halfWidth};
}

export function projectedBatAngle(frame: CricketFrame): number {
  return Math.acos(Math.min(1, Math.abs(Math.sin(frame.batAngle * Math.PI / 180)))) * 180 / Math.PI;
}

export function cricketTiming(input: CricketInput) {
  const setupHold = .8, downswingHold = .6, finishHold = 1.4;
  const downswing = setupHold + input.transitionSeconds;
  const contact = downswing + downswingHold + input.transitionSeconds;
  const followThrough = contact + input.contactHold + input.transitionSeconds;
  return {
    setupHold, downswingHold, finishHold, downswing, contact, followThrough,
    duration: followThrough + finishHold,
    checkpoints: [
      {label: 'Set-up', time: setupHold / 2, description: 'Both hands share one handle.'},
      {label: 'Downswing', time: downswing + downswingHold / 2, description: 'Compare the grip and bat toe with the previous frame.'},
      {label: 'Contact', time: contact + input.contactHold / 2, description: 'The ball meets the blade. The hold gives time to inspect the frame.'},
      {label: 'Follow-through', time: followThrough + finishHold / 2, description: 'Earlier bat endpoints stay numbered and labeled.'},
    ],
  };
}

export function parseCricket(input: string): CricketInput {
  if (input.length > 16000) throw new Error('Keep the cricket input below 16,000 characters.');
  let raw: unknown;
  try {raw = JSON.parse(input);} catch {throw new Error('Use valid JSON with a frames array containing four swing positions.');}
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new Error('Use a JSON object for the cricket input.');
  const data = raw as Record<string, unknown>;
  const number = (value: unknown, name: string, min: number, max: number) => {
    if (typeof value !== 'number' || !Number.isFinite(value) || value < min || value > max) throw new Error(`${name} must be a finite number from ${min} to ${max}.`);
    return value;
  };
  const point = (value: unknown, name: string, xmin: number, xmax: number, ymin: number, ymax: number): Point => {
    if (!Array.isArray(value) || value.length !== 2) throw new Error(`${name} needs two numbers: [x, y].`);
    return [number(value[0], `${name} x`, xmin, xmax), number(value[1], `${name} y`, ymin, ymax)];
  };
  if (!Array.isArray(data.frames) || data.frames.length !== 4) throw new Error('Include exactly four frames: Set-up, Downswing, Contact, Follow-through.');
  const frames = data.frames.map((rawFrame, i) => {
    if (!rawFrame || typeof rawFrame !== 'object' || Array.isArray(rawFrame)) throw new Error(`Frame ${i + 1} must be an object.`);
    const f = rawFrame as Record<string, unknown>, defaults = DEFAULT_CRICKET_FRAMES[i];
    return {
      grip: point(f.grip, `Frame ${i + 1} grip`, 0, 90, -100, -10),
      batAngle: number(f.batAngle, `Frame ${i + 1} batAngle`, -360, 360),
      hip: f.hip === undefined ? [...defaults.hip] as Point : point(f.hip, `Frame ${i + 1} hip`, -12, 18, -8, 8),
      lean: f.lean === undefined ? defaults.lean : number(f.lean, `Frame ${i + 1} lean`, -12, 12),
      frontFoot: f.frontFoot === undefined ? defaults.frontFoot : number(f.frontFoot, `Frame ${i + 1} frontFoot`, 60, 112),
    };
  });
  const title = data.title === undefined ? 'A drive, frame by frame' : data.title;
  if (typeof title !== 'string' || !title.trim() || title.trim().length > 60 || /[\r\n\t]/.test(title)) throw new Error('Use a title of 1–60 characters on one line.');
  for (const key of ['mirror', 'showTraces']) if (data[key] !== undefined && typeof data[key] !== 'boolean') throw new Error(`${key} must be true or false.`);
  const model: CricketInput = {
    title: title.trim(), frames,
    transitionSeconds: data.transitionSeconds === undefined ? 2.4 : number(data.transitionSeconds, 'transitionSeconds', 1, 4),
    contactHold: data.contactHold === undefined ? 2.1 : number(data.contactHold, 'contactHold', .8, 4),
    mirror: data.mirror === true, showTraces: data.showTraces !== false,
  };
  // Check the whole swing: individually reachable keyframes can otherwise have
  // an unreachable intermediate grip while the torso and bat are rotating.
  for (let sample = 0; sample <= 180; sample++) {
    try {sampleCricket(model, sample / 60);} catch {
      throw new Error(`The pose near ${CRICKET_PHASES[Math.min(3, Math.floor(sample / 60))]} stretches an arm or leg. Move the grip or front foot closer, or reduce the hip shift.`);
    }
  }
  return model;
}
