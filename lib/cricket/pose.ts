/** Synthetic, editable straight-drive geometry. No photographed player or motion capture. */
export type Vec3 = [number, number, number];
export type Hand = 'right' | 'left';
export type Camera = 'bowler' | 'side';
export type CricketPhase = 'setup' | 'backlift' | 'step' | 'contact' | 'extension' | 'follow' | 'finish';

export interface CricketAnchors {
  head: Vec3;
  frontShoulder: Vec3;
  backShoulder: Vec3;
  frontHip: Vec3;
  backHip: Vec3;
  frontFoot: Vec3;
  backFoot: Vec3;
  frontArmPole: Vec3;
  backArmPole: Vec3;
  frontLegPole: Vec3;
  backLegPole: Vec3;
  grip: Vec3;
  axis: Vec3;
}

export interface CricketFrame extends CricketAnchors {
  t: number;
  id: CricketPhase;
  label: string;
}

export interface CricketPose extends CricketAnchors {
  top: Vec3;
  bottom: Vec3;
  frontElbow: Vec3;
  backElbow: Vec3;
  frontKnee: Vec3;
  backKnee: Vec3;
  batEnd: Vec3;
  bladeTop: Vec3;
  handleTop: Vec3;
  frontToe: Vec3;
  backToe: Vec3;
  topSide: 'L' | 'R';
  bottomSide: 'L' | 'R';
  time: number;
  phase: CricketPhase;
}

export const CRICKET_ANCHOR_KEYS = [
  'head', 'frontShoulder', 'backShoulder', 'frontHip', 'backHip',
  'frontFoot', 'backFoot', 'frontArmPole', 'backArmPole',
  'frontLegPole', 'backLegPole', 'grip',
] as const;

export const CRICKET_VECTOR_KEYS = [
  ...CRICKET_ANCHOR_KEYS, 'axis', 'top', 'bottom', 'frontElbow', 'backElbow',
  'frontKnee', 'backKnee', 'batEnd', 'bladeTop', 'handleTop', 'frontToe', 'backToe',
] as const satisfies readonly (keyof CricketPose)[];

export interface CricketStop {
  t: number;
  id: CricketPhase;
  label: string;
}

export interface CricketPoseEngine {
  pose: (t: number, hand?: Hand) => CricketPose;
  frames: CricketFrame[];
  stops: CricketStop[];
  contact: { t: number; point: Vec3; bladeDistance: number };
  frontFootPlantT: number;
  durationMs: number;
  lengths: { upperArm: number; forearm: number; thigh: number; shin: number; bat: number; gripSpacing: number };
}

export function createCricketPoseEngine(): CricketPoseEngine {
  const add = (a: Vec3, b: Vec3): Vec3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
  const sub = (a: Vec3, b: Vec3): Vec3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const mul = (a: Vec3, k: number): Vec3 => [a[0] * k, a[1] * k, a[2] * k];
  const dot = (a: Vec3, b: Vec3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const mag = (a: Vec3) => Math.hypot(...a);
  const unit = (a: Vec3): Vec3 => mul(a, 1 / (mag(a) || 1));
  const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
  const cross = (a: Vec3, b: Vec3): Vec3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];

  // C2 quintic Hermite tracks share velocity and acceleration at checkpoints.
  // Checkpoints are inspection times, rather than mandatory pauses in a swing.
  // Monotone component tracks also prevent an already planted foot from sliding.
  type Track = (interval: number, u: number) => number;
  function track(times: number[], values: number[]): Track {
    const n = times.length, h: number[] = [], d: number[] = [], m = Array<number>(n).fill(0);
    for (let i = 0; i < n - 1; i++) {
      h[i] = times[i + 1] - times[i];
      d[i] = (values[i + 1] - values[i]) / h[i];
    }
    // Preserve each extremum. Elsewhere use a shared weighted harmonic slope.
    for (let i = 1; i < n - 1; i++) if (d[i - 1] * d[i] > 0) {
      const w1 = 2 * h[i] + h[i - 1], w2 = h[i] + 2 * h[i - 1];
      m[i] = (w1 + w2) / (w1 / d[i - 1] + w2 / d[i]);
    }
    // For zero endpoint accelerations, the derivative's Bernstein coefficients
    // are [h*m0, h*m0, 5*delta - 2*h*(m0+m1), h*m1, h*m1]. Keep their signs
    // equal to the secant's sign. Reducing a shared slope preserves C2 at the
    // next boundary and cannot invalidate an interval already processed.
    for (let i = 0; i < n - 1; i++) {
      const sum = Math.abs(m[i]) + Math.abs(m[i + 1]), limit = 2.5 * Math.abs(d[i]);
      if (sum > limit && sum > 0) {
        const scale = limit / sum;
        m[i] *= scale;
        m[i + 1] *= scale;
      }
    }
    // The complete demonstration starts and settles at rest.
    return (i, u) => {
      const delta = values[i + 1] - values[i], v0 = h[i] * m[i], v1 = h[i] * m[i + 1];
      const a3 = 10 * delta - 6 * v0 - 4 * v1;
      const a4 = -15 * delta + 8 * v0 + 7 * v1;
      const a5 = 6 * delta - 3 * v0 - 3 * v1;
      return values[i] + v0 * u + u * u * u * (a3 + u * (a4 + u * a5));
    };
  }

  function intervalAt(t: number, times: number[]): number {
    const i = times.findIndex((_, j) => j < times.length - 1 && t <= times[j + 1]);
    return i < 0 ? times.length - 2 : i;
  }

  function joint(a: Vec3, b: Vec3, lengthA: number, lengthB: number, pole: Vec3): Vec3 {
    const delta = sub(b, a), distance = mag(delta), direction = unit(delta);
    if (distance > lengthA + lengthB + 1e-7 || distance < Math.abs(lengthA - lengthB) - 1e-7) {
      throw new RangeError('Cricket pose has an unreachable limb endpoint.');
    }
    const along = (lengthA * lengthA - lengthB * lengthB + distance * distance) / (2 * distance);
    const radius = Math.sqrt(Math.max(0, lengthA * lengthA - along * along));
    let plane = sub(sub(pole, a), mul(direction, dot(sub(pole, a), direction)));
    if (mag(plane) < 1e-8) plane = cross(direction, Math.abs(direction[2]) < .9 ? [0, 0, 1] : [1, 0, 0]);
    return add(add(a, mul(direction, along)), mul(unit(plane), radius));
  }

  // x: lateral from the bowler camera; y: toward the bowler; z: height.
  // The canonical figure is right-handed. Left-handed mode reflects x only,
  // preserving the direction of the pitch and the actual top/bottom hand roles.
  const frames: CricketFrame[] = [
    {t:0,id:'setup',label:'Set-up',
      head:[7,24,165],frontShoulder:[1,20,142],backShoulder:[27,-14,141],
      frontHip:[19,13,86],backHip:[38,-13,88],
      frontFoot:[13,32,4],backFoot:[34,-32,4],
      frontArmPole:[-2,42,112],backArmPole:[30,-20,106],
      frontLegPole:[-14,43,45],backLegPole:[6,-26,45],
      grip:[-3,-3,94],axis:[.08,-.14,-.987]},
    {t:.27,id:'backlift',label:'Backlift',
      head:[5,34,165],frontShoulder:[0,29,142],backShoulder:[25,-7,143],
      frontHip:[18,21,86],backHip:[36,-5,87],
      frontFoot:[11,48,5],backFoot:[34,-32,4],
      frontArmPole:[-12,44,113],backArmPole:[30,-20,113],
      frontLegPole:[-13,59,46],backLegPole:[5,-14,45],
      grip:[-6,-7,111],axis:[-.38,-.78,.50]},
    {t:.43,id:'step',label:'Forward step',
      head:[0,69,155],frontShoulder:[0,61,131],backShoulder:[24,25,136],
      frontHip:[16,44,78],backHip:[33,12,82],
      frontFoot:[8,89,5],backFoot:[34,-32,9],
      frontArmPole:[-10,90,125],backArmPole:[33,34,109],
      frontLegPole:[-7,96,44],backLegPole:[3,12,44],
      grip:[-4,42,114],axis:[-.22,-.62,.753]},
    {t:.55,id:'contact',label:'Contact',
      head:[-1,79,153],frontShoulder:[0,71,128],backShoulder:[23,35,132],
      frontHip:[15,49,76],backHip:[32,17,80],
      frontFoot:[7,93,4],backFoot:[34,-32,11],
      frontArmPole:[-4,109,128],backArmPole:[28,42,104],
      frontLegPole:[-4,99,43],backLegPole:[2,16,44],
      grip:[0,72,100],axis:[0,0,-1]},
    {t:.65,id:'extension',label:'Extension',
      head:[-1,83,154],frontShoulder:[-6,69,130],backShoulder:[28,80,130],
      frontHip:[13,52,78],backHip:[31,22,81],
      frontFoot:[7,93,4],backFoot:[34,-32,17],
      frontArmPole:[-8,111,117],backArmPole:[35,112,115],
      frontLegPole:[-3,100,44],backLegPole:[3,22,44],
      grip:[0,126,107],axis:[0,.50,-.8660254037844386]},
    {t:.89,id:'follow',label:'Follow-through',
      head:[0,81,159],frontShoulder:[-18,76,135],backShoulder:[17,70,134],
      frontHip:[5,56,82],backHip:[30,32,77],
      frontFoot:[7,93,4],backFoot:[34,-32,22],
      frontArmPole:[-24,106,145],backArmPole:[30,100,148],
      frontLegPole:[-4,97,44],backLegPole:[3,28,45],
      grip:[-18,109,160],axis:[-.28,.40,.8720091742636657]},
    {t:1,id:'finish',label:'Finish',
      head:[0,79,161],frontShoulder:[-20,76,136],backShoulder:[14,65,135],
      frontHip:[3,57,84],backHip:[29,34,77],
      frontFoot:[7,93,4],backFoot:[34,-32,22],
      frontArmPole:[-26,103,145],backArmPole:[27,97,147],
      frontLegPole:[-4,96,45],backLegPole:[3,29,46],
      grip:[-20,104,162],axis:[-.30,.30,.9055385138137417]},
  ];
  const stops = frames.filter(f => ['setup', 'backlift', 'contact', 'extension', 'finish'].includes(f.id))
    .map(({t, id, label}) => ({t, id, label}));
  const contact = {t:.55, point:[0,72,21] as Vec3, bladeDistance:79};
  const frontFootPlantT = .49;
  const times = frames.map(f => f.t);
  type AnchorKey = typeof CRICKET_ANCHOR_KEYS[number];
  const tracks = Object.fromEntries(CRICKET_ANCHOR_KEYS.map(key => [
    key, [0,1,2].map(c => track(times, frames.map(f => f[key][c]))),
  ])) as Record<AnchorKey, [Track, Track, Track]>;

  // Settle the short stride before impact, then keep the front foot planted.
  // This timing is an illustrative design choice, not measured video timing.
  const footTimes = [0, .27, .43, frontFootPlantT, 1];
  const footFrames = [frames[0], frames[1], frames[2], frames[3], frames[frames.length - 1]];
  const footTracks = [0,1,2].map(c => track(footTimes, footFrames.map(f => f.frontFoot[c])));

  const pitch: number[] = [], lateral: number[] = [];
  for (const f of frames) {
    const axis = unit(f.axis);
    let angle = Math.atan2(axis[2], axis[1]);
    if (pitch.length) {
      while (angle - pitch[pitch.length - 1] > Math.PI) angle -= 2 * Math.PI;
      while (angle - pitch[pitch.length - 1] < -Math.PI) angle += 2 * Math.PI;
    }
    pitch.push(angle);
    lateral.push(Math.asin(clamp(axis[0], -1, 1)));
  }
  // Unwrapped swing pitch prevents angle wrap snaps. The genuine backswing
  // reversal is retained, but the blade no longer pauses on meeting the ball.
  const pitchTrack = track(times, pitch), lateralTrack = track(times, lateral);

  function pose(t: number, hand: Hand = 'right'): CricketPose {
    if (!Number.isFinite(t)) throw new RangeError('Cricket progress must be finite.');
    t = clamp(t, 0, 1);
    const i = intervalAt(t, times), u = (t - times[i]) / (times[i + 1] - times[i]);
    const sample = (key: AnchorKey): Vec3 => tracks[key].map(fn => fn(i, u)) as Vec3;
    const p = pitchTrack(i, u), l = lateralTrack(i, u), c = Math.cos(l);
    const fi = intervalAt(t, footTimes), fu = (t - footTimes[fi]) / (footTimes[fi + 1] - footTimes[fi]);
    const anchors: CricketAnchors = {
      head: sample('head'), frontShoulder: sample('frontShoulder'), backShoulder: sample('backShoulder'),
      frontHip: sample('frontHip'), backHip: sample('backHip'),
      frontFoot: footTracks.map(fn => fn(fi, fu)) as Vec3, backFoot: sample('backFoot'),
      frontArmPole: sample('frontArmPole'), backArmPole: sample('backArmPole'),
      frontLegPole: sample('frontLegPole'), backLegPole: sample('backLegPole'),
      grip: sample('grip'), axis: [Math.sin(l), c * Math.cos(p), c * Math.sin(p)],
    };
    // Both gloves stay on the same rigid handle. IK moves elbows, never hands.
    const top = [...anchors.grip] as Vec3, bottom = add(anchors.grip, mul(anchors.axis, 10));
    const q: CricketPose = {
      ...anchors, top, bottom,
      frontElbow: joint(anchors.frontShoulder, top, 35, 33, anchors.frontArmPole),
      backElbow: joint(anchors.backShoulder, bottom, 35, 33, anchors.backArmPole),
      frontKnee: joint(anchors.frontHip, anchors.frontFoot, 45, 43, anchors.frontLegPole),
      backKnee: joint(anchors.backHip, anchors.backFoot, 45, 43, anchors.backLegPole),
      batEnd: add(anchors.grip, mul(anchors.axis, 90)),
      bladeTop: add(anchors.grip, mul(anchors.axis, 26)),
      handleTop: add(anchors.grip, mul(anchors.axis, -8)),
      frontToe: [anchors.frontFoot[0] - 19, anchors.frontFoot[1] + 10, 2],
      backToe: [15, -25, 2],
      topSide: hand === 'right' ? 'L' : 'R', bottomSide: hand === 'right' ? 'R' : 'L',
      time: t, phase: frames.filter(f => f.t <= t + 1e-8).at(-1)!.id,
    };
    if (hand === 'left') for (const key of CRICKET_VECTOR_KEYS) q[key] = [-q[key][0], q[key][1], q[key][2]];
    return q;
  }

  return {pose, frames, stops, contact, frontFootPlantT, durationMs:7200,
    lengths:{upperArm:35, forearm:33, thigh:45, shin:43, bat:90, gripSpacing:10}};
}
