// Original Atlas typography study. No external assets or animation libraries.
// Every displayed pose is a pure function of progress and viewport size.

export const meta = {
  id: 'typography',
  title: 'Words that take shape',
  eyebrow: 'Type and meaning',
  description: 'Five different inputs find a shared frame, then become a clear action. Follow their identities through the whole thought.',
  duration: 14,
  basis: 'Original illustrative typography; no measured data.',
  inspiration: 'Kinetic typography as an explanation of meaning, inspired by Codrops. Original SVG implementation.',
  source: 'https://tympanus.net/codrops/2026/11/10/kinetic-typography-gsap/',
};

const NS = 'http://www.w3.org/2000/svg';
const INK = '#22372e';
const PAPER = '#f0f4ed';
const SANS = 'Arial, Helvetica, sans-serif';
const SERIF = 'Georgia, Times New Roman, serif';
const WORDS = [
  { text: 'Observations', color: '#7dd3d5', angle: -7 },
  { text: 'Intent', color: '#d4ed9b', angle: 7 },
  { text: 'History', color: '#bca4dc', angle: -4 },
  { text: 'Evidence', color: '#f4b886', angle: -6 },
  { text: 'Constraints', color: '#a6c3b2', angle: 4 },
];
const CHECKPOINTS = [
  { at: 0, title: 'Loose signals', detail: 'Each input holds a different part of the picture.' },
  { at: 0.33, title: 'Find the relation', detail: 'Bring the inputs into relation, without losing where they came from.' },
  { at: 0.64, title: 'Shared context', detail: 'The inputs stay distinct. Their relationships create a shared frame.' },
  { at: 1, title: 'Clear action', detail: 'A clear choice carries its context with it. The ingredients remain visible.' },
];

const clamp = (n, min = 0, max = 1) => Math.max(min, Math.min(max, n));
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = n => { const x = clamp(n); return x * x * x * (x * (x * 6 - 15) + 10); };
const between = (p, a, b) => smooth((p - a) / (b - a));
const fmt = n => Number(n.toFixed(3));

function node(tag, attrs = {}, parent) {
  const el = document.createElementNS(NS, tag);
  for (const [key, value] of Object.entries(attrs)) el.setAttribute(key, value);
  if (parent) parent.append(el);
  return el;
}

function html(tag, className, text, parent) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text !== undefined) el.textContent = text;
  if (parent) parent.append(el);
  return el;
}

function set(el, attrs) {
  for (const [key, value] of Object.entries(attrs)) el.setAttribute(key, typeof value === 'number' ? fmt(value) : value);
}

function createLetters(word, parent, family, weight) {
  const group = node('g', { 'aria-hidden': 'true' }, parent);
  const letters = [...word].map(letter => {
    const text = node('text', {
      'text-anchor': 'middle', fill: INK, 'font-family': family,
      'font-weight': weight, 'dominant-baseline': 'alphabetic',
    }, group);
    text.textContent = letter;
    return text;
  });
  return { group, letters, word, family, weight };
}

export function mount(container) {
  let dead = false;
  let frame = 0;
  let progress = 0;
  let playing = false;
  let startedAt = 0;
  let startedProgress = 0;
  let showTraces = true;
  let lastPhase = -1;
  let dimensions = { w: 900, h: 550, small: false };
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  let reducedMotion = media.matches;
  const measureCanvas = document.createElement('canvas');
  const measure = measureCanvas.getContext('2d');
  const widthCache = new Map();

  const root = html('section', 'scene typography-scene', undefined, container);
  root.setAttribute('aria-label', meta.title);
  const style = html('style', '', undefined, root);
  style.textContent = `
    .typography-scene { width:100%; min-width:0; background:transparent; color:var(--light,#f3f3e8); color-scheme:dark; overflow:visible; border-radius:0; }
    .typography-stage { width:100%; overflow:hidden; border-radius:22px; background:${PAPER}; }
    .typography-svg { display:block; width:100%; height:auto; overflow:hidden; touch-action:pan-y; }
    .typography-caption { display:flex; justify-content:space-between; gap:16px; margin:18px 0 22px; align-items:flex-start; }
    .typography-caption-title { margin:0 0 5px; font-size:20px; line-height:1.25; font-weight:600; color:var(--lime,#d4ed9b); }
    .typography-caption-text { margin:0; max-width:58ch; line-height:1.55; color:var(--muted,#c4d0c5); font-size:16px; }
    .typography-count { color:var(--muted,#c4d0c5); font-variant-numeric:tabular-nums; white-space:nowrap; font-size:16px; padding-top:3px; }
    .typography-checkpoints { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:8px; width:100%; margin:0 0 18px; }
    .typography-checkpoint { border:1px solid var(--border,#435c4c); border-radius:12px; background:transparent; color:var(--muted,#c4d0c5); padding:12px 10px; cursor:pointer; text-align:left; font:inherit; font-size:15px; line-height:1.3; min-height:65px; }
    .typography-checkpoint span { display:block; font-size:14px; margin-bottom:4px; opacity:.7; }
    .typography-checkpoint[aria-pressed="true"] { color:var(--lime,#d4ed9b); border-color:var(--lime,#d4ed9b); background:rgba(212,237,155,.055); }
    .typography-checkpoint:hover { border-color:var(--muted,#c4d0c5); }
    .typography-transport { display:flex; flex-wrap:wrap; align-items:center; gap:10px; margin-bottom:16px; }
    .typography-controls { display:block; margin:0; }
    .typography-transport .button { min-height:44px; padding:10px 17px; font:inherit; font-size:16px; cursor:pointer; }
    .typography-scene .button { color:var(--light,#f3f3e8); border-color:var(--border,#435c4c); }
    .typography-scene .button:hover { background:var(--panel,#1c332a); }
    .typography-scene .button.primary,.typography-scene .button[aria-pressed="true"] { background:var(--lime,#d4ed9b); color:${INK}; border-color:var(--lime,#d4ed9b); }
    .typography-traces { margin-left:auto; display:flex; align-items:center; gap:9px; color:var(--muted,#c4d0c5); font-size:15px; cursor:pointer; min-height:44px; }
    .typography-traces input { width:18px; height:18px; accent-color:var(--lime,#d4ed9b); }
    .typography-timeline-row { display:flex; align-items:center; gap:14px; width:100%; }
    .typography-timeline { width:100%; min-width:0; height:30px; accent-color:var(--lime,#d4ed9b); cursor:pointer; }
    .typography-scene input[type="range"] { accent-color:var(--lime,#d4ed9b); }
    .typography-time { min-width:88px; text-align:right; font-size:14px; color:var(--muted,#c4d0c5); font-variant-numeric:tabular-nums; }
    .typography-note { font-size:14px; line-height:1.5; color:var(--muted,#c4d0c5); margin:12px 0 0; }
    .typography-scene button:focus-visible,.typography-scene input:focus-visible { outline:3px solid var(--cyan,#7dd3d5); outline-offset:4px; }
    @media(max-width:580px) {
      .typography-checkpoints { grid-template-columns:repeat(2,minmax(0,1fr)); }
      .typography-caption { gap:12px; margin:16px 0 18px; }
      .typography-caption-title { font-size:19px; }
      .typography-traces { margin-left:0; width:100%; }
      .typography-stage { border-radius:16px; }
    }
  `;

  const stage = html('div', 'typography-stage', undefined, root);
  const svg = node('svg', {
    xmlns: NS, class: 'typography-svg', viewBox: '0 0 900 550', width: 900, height: 550,
    role: 'img', 'aria-label': 'Five words gather into shared context, then become clear action.',
  }, stage);
  const svgTitle = node('title', {}, svg);
  const svgDesc = node('desc', {}, svg);
  svgDesc.textContent = 'An original illustrative typography study. Observations, intent, history, evidence and constraints retain their identities as they align into shared context and support clear action.';
  const background = node('rect', { fill: PAPER, width: 900, height: 550 }, svg);
  const overline = node('text', { x: 28, y: 32, 'font-family': SANS, 'font-size': 14, 'font-weight': 600, 'letter-spacing': 1.4, fill: INK }, svg);
  overline.textContent = 'FIVE INPUTS / ONE THOUGHT';
  const chapterMark = node('text', { 'text-anchor': 'end', 'font-family': SANS, 'font-size': 14, fill: INK }, svg);
  const ghostGroup = node('g', { 'aria-hidden': 'true' }, svg);
  const connections = node('g', { fill: 'none', stroke: INK, 'stroke-width': 1.5, 'stroke-linecap': 'round', 'aria-hidden': 'true' }, svg);
  const wordGroup = node('g', { 'aria-hidden': 'true' }, svg);
  const heroGroup = node('g', {}, svg);
  const shared = createLetters('SHARED', heroGroup, SANS, 600);
  const context = createLetters('CONTEXT', heroGroup, SERIF, 700);
  const clear = createLetters('CLEAR', heroGroup, SANS, 600);
  const action = createLetters('ACTION', heroGroup, SERIF, 700);
  const actionRule = node('line', { stroke: '#b38159', 'stroke-width': 3, 'stroke-linecap': 'round', 'aria-hidden': 'true' }, heroGroup);
  const semanticText = node('text', { opacity: 0, 'aria-hidden': 'true' }, svg);
  semanticText.textContent = 'Observations · Intent · History · Evidence · Constraints → SHARED CONTEXT → CLEAR ACTION';

  const words = WORDS.map(item => {
    const ghost = node('text', { 'font-family': SANS, 'font-weight': 500, 'text-anchor': 'middle', fill: 'none', stroke: INK, 'stroke-width': .6 }, ghostGroup);
    ghost.textContent = item.text;
    const trail = node('path', { fill: 'none', stroke: INK, 'stroke-width': 1, 'stroke-dasharray': '2 7' }, ghostGroup);
    const link = node('path', {}, connections);
    const group = node('g', {}, wordGroup);
    const underline = node('line', { stroke: item.color, 'stroke-width': 5, 'stroke-linecap': 'round' }, group);
    const text = node('text', { 'font-family': SANS, 'font-weight': 500, 'text-anchor': 'middle', fill: INK }, group);
    text.textContent = item.text;
    return { ...item, ghost, trail, link, group, underline, text };
  });

  const caption = html('div', 'typography-caption', undefined, root);
  const captionBody = html('div', '', undefined, caption);
  const phaseTitle = html('h3', 'typography-caption-title', '', captionBody);
  const phaseDetail = html('p', 'typography-caption-text', '', captionBody);
  const phaseCount = html('span', 'typography-count', '', caption);
  const checkpointRow = html('div', 'typography-checkpoints', undefined, root);
  checkpointRow.setAttribute('role', 'group');
  checkpointRow.setAttribute('aria-label', 'Story checkpoints');
  const checkpointButtons = CHECKPOINTS.map((checkpoint, index) => {
    const button = html('button', 'typography-checkpoint', undefined, checkpointRow);
    button.type = 'button';
    html('span', '', `0${index + 1}`, button);
    button.append(document.createTextNode(checkpoint.title));
    button.addEventListener('click', () => { pause(); progress = checkpoint.at; render(); });
    return button;
  });

  const controls = html('div', 'controls typography-controls', undefined, root);
  const transport = html('div', 'typography-transport', undefined, controls);
  const playButton = html('button', 'button primary typography-play', 'Play whole sequence', transport);
  playButton.type = 'button';
  const replayButton = html('button', 'button typography-replay', 'Replay', transport);
  replayButton.type = 'button';
  const traceLabel = html('label', 'typography-traces', undefined, transport);
  const traceToggle = html('input', '', undefined, traceLabel);
  traceToggle.type = 'checkbox';
  traceToggle.checked = true;
  traceLabel.append(document.createTextNode('Show origin traces'));
  const timelineRow = html('div', 'typography-timeline-row', undefined, controls);
  const timeline = html('input', 'typography-timeline', undefined, timelineRow);
  timeline.type = 'range';
  timeline.min = '0';
  timeline.max = '1000';
  timeline.step = '1';
  timeline.value = '0';
  timeline.setAttribute('aria-label', 'Scrub the whole typography sequence');
  const timeLabel = html('output', 'typography-time', '0.0 / 14s', timelineRow);
  const note = html('p', 'typography-note', '', controls);

  function width(text, size, family = SANS, weight = 500) {
    const key = `${text}|${size.toFixed(1)}|${family}|${weight}`;
    if (widthCache.has(key)) return widthCache.get(key);
    if (measure) measure.font = `${weight} ${size}px ${family}`;
    const value = measure ? measure.measureText(text).width : text.length * size * .58;
    if (widthCache.size > 1600) widthCache.clear();
    widthCache.set(key, value);
    return value;
  }

  function pose(index) {
    const { w, h, small } = dimensions;
    if (small) {
      const origin = [[.46, 110, 28], [.67, 212, 42], [.28, 285, 35], [.65, 375, 32], [.44, 469, 29]][index];
      const final = [[.5, 324], [.25, 380], [.73, 380], [.28, 435], [.72, 435]][index];
      return {
        origin: { x: origin[0] * w, y: origin[1], font: Math.min(origin[2], w * .095) },
        gather: { x: .52 * w, y: 293 + index * 46, font: 21 },
        final: { x: final[0] * w, y: final[1], font: 16 },
      };
    }
    const origin = [[.22, .23, 43], [.75, .26, 62], [.18, .52, 51], [.75, .66, 47], [.46, .84, 44]][index];
    return {
      origin: { x: origin[0] * w, y: origin[1] * h, font: Math.min(origin[2], w * .046) },
      gather: { x: .215 * w, y: h * (.31 + index * .105), font: Math.min(27, w * .032) },
      final: { x: w * (.13 + index * .185), y: h * .855, font: Math.max(14, Math.min(19, w * .021)) },
    };
  }

  function drawLetters(line, x, y, font, tracking, appearance, settle = 0) {
    const widths = [...line.word].map(char => width(char, font, line.family, line.weight));
    const full = widths.reduce((a, b) => a + b, 0) + tracking * (widths.length - 1);
    let position = -full / 2;
    line.letters.forEach((letter, i) => {
      const reveal = between(appearance, i * .025, .72 + i * .025);
      const spread = (i - (widths.length - 1) / 2) * 13 * (1 - reveal);
      const lx = x + position + widths[i] / 2 + spread;
      const ly = y + (1 - reveal) * (26 + i * 3);
      set(letter, {
        x: 0, y: 0, 'font-size': font,
        transform: `translate(${fmt(lx)} ${fmt(ly)}) rotate(${fmt((1 - reveal) * (i % 2 ? 5 : -5))})`,
        opacity: reveal,
      });
      position += widths[i] + tracking;
    });
    // Settling changes geometry, never the letter identities.
    line.group.dataset.settle = settle.toFixed(2);
  }

  function phaseFor(p) { return p < .13 ? 0 : p < .58 ? 1 : p < .73 ? 2 : 3; }

  function displayedProgress() {
    return reducedMotion ? (progress < .18 ? 0 : progress < .49 ? .33 : progress < .83 ? .64 : 1) : progress;
  }

  function render() {
    if (dead) return;
    const { w, h, small } = dimensions;
    // Reduced-motion mode offers readable checkpoint poses while retaining time controls.
    const p = displayedProgress();
    const stageIndex = phaseFor(p);
    const finalTransition = between(p, .70, .97);
    const contextAppearance = between(p, .30, .59);
    const clearAppearance = between(p, .74, .91);
    const actionAppearance = between(p, .79, .99);
    set(background, { width: w, height: h });
    set(overline, { x: small ? 20 : 28, y: 31, 'font-size': 14, 'letter-spacing': small ? .3 : 1.4 });
    overline.textContent = w < 370 ? 'FIVE INPUTS' : 'FIVE INPUTS / ONE THOUGHT';
    set(chapterMark, { x: w - (small ? 20 : 28), y: h - 22 });
    chapterMark.textContent = `0${stageIndex + 1} / 04`;
    svgTitle.textContent = `Words that take shape — ${CHECKPOINTS[stageIndex].title}`;
    svg.setAttribute('aria-label', `${CHECKPOINTS[stageIndex].title}. ${CHECKPOINTS[stageIndex].detail}`);

    words.forEach((word, index) => {
      const positions = pose(index);
      const gather = between(p, .12 + index * .023, .43 + index * .023);
      const resolve = between(p, .70 + index * .015, .925 + index * .015);
      const arc = Math.sin(gather * Math.PI) * (small ? 12 : 24) * (index % 2 ? -1 : 1);
      const gx = lerp(positions.origin.x, positions.gather.x, gather) + arc;
      const gy = lerp(positions.origin.y, positions.gather.y, gather);
      const x = lerp(gx, positions.final.x, resolve);
      const y = lerp(gy, positions.final.y, resolve);
      const size = lerp(lerp(positions.origin.font, positions.gather.font, gather), positions.final.font, resolve);
      const angle = word.angle * (1 - gather);
      const tw = width(word.text, size);
      set(word.group, { transform: `translate(${fmt(x)} ${fmt(y)}) rotate(${fmt(angle)})` });
      set(word.text, { x: 0, y: 0, 'font-size': size });
      set(word.underline, { x1: -tw / 2, x2: tw / 2, y1: 8, y2: 8, 'stroke-width': lerp(5, 3, resolve) });

      const originOpacity = showTraces ? .115 * gather * (1 - between(p, .48, .71)) : 0;
      set(word.ghost, {
        transform: `translate(${fmt(positions.origin.x)} ${fmt(positions.origin.y)}) rotate(${word.angle})`,
        'font-size': positions.origin.font, opacity: originOpacity,
      });
      set(word.trail, {
        d: `M ${fmt(positions.origin.x)} ${fmt(positions.origin.y + 13)} Q ${fmt((positions.origin.x + x) / 2 + arc * 2)} ${fmt((positions.origin.y + y) / 2 + 25)} ${fmt(x)} ${fmt(y + 13)}`,
        opacity: originOpacity * 1.7,
      });

      const linkOpacity = .26 * between(gather, .20, .90);
      if (small) {
        const sx = lerp(x - tw / 2 - 10, x, resolve);
        const sy = lerp(y - 7, y - 23, resolve);
        const bendX = lerp(w * .08, x, resolve);
        const endX = lerp(w * .50, w * .5, resolve);
        const endY = lerp(213, 267, resolve);
        set(word.link, { d: `M ${fmt(sx)} ${fmt(sy)} C ${fmt(bendX)} ${fmt(sy)} ${fmt(bendX)} ${fmt(endY)} ${fmt(endX)} ${fmt(endY)}`, opacity: linkOpacity });
      } else {
        const sx = lerp(x + tw / 2 + 13, x, resolve);
        const sy = lerp(y - 8, y - 24, resolve);
        const bendX = lerp(w * .425, x, resolve);
        const endX = lerp(w * .485, w * .5, resolve);
        const endY = lerp(h * .505, h * .728, resolve);
        set(word.link, { d: `M ${fmt(sx)} ${fmt(sy)} C ${fmt(bendX)} ${fmt(sy)} ${fmt(bendX)} ${fmt(endY)} ${fmt(endX)} ${fmt(endY)}`, opacity: linkOpacity });
      }
    });

    const heroX = lerp(small ? w * .5 : w * .71, w * .5, finalTransition);
    const sharedY = lerp(small ? 104 : h * .392, small ? 65 : h * .16, finalTransition);
    const contextY = lerp(small ? 168 : h * .57, small ? 105 : h * .255, finalTransition);
    const sharedFont = lerp(small ? 22 : 25, 14, finalTransition);
    const contextFont = lerp(small ? Math.min(53, w * .167) : Math.min(86, w * .084), small ? 27 : 32, finalTransition);
    drawLetters(shared, heroX, sharedY, sharedFont, lerp(small ? 5 : 6, 3, finalTransition), contextAppearance, finalTransition);
    drawLetters(context, heroX, contextY, contextFont, -contextFont * .035, contextAppearance, finalTransition);
    drawLetters(clear, w * .5, small ? 163 : h * .425, small ? 22 : 27, 7, clearAppearance);
    drawLetters(action, w * .5, small ? 244 : h * .66, small ? Math.min(66, w * .217) : Math.min(126, w * .151), -2.4, actionAppearance);
    const ruleSize = (small ? 62 : 100) * between(p, .89, 1);
    const ruleY = small ? 268 : h * .73;
    set(actionRule, { x1: w * .5 - ruleSize / 2, x2: w * .5 + ruleSize / 2, y1: ruleY, y2: ruleY, opacity: between(p, .89, .97) });

    if (lastPhase !== stageIndex) {
      phaseTitle.textContent = CHECKPOINTS[stageIndex].title;
      phaseDetail.textContent = CHECKPOINTS[stageIndex].detail;
      phaseCount.textContent = `0${stageIndex + 1} / 04`;
      checkpointButtons.forEach((button, index) => button.setAttribute('aria-pressed', String(index === stageIndex)));
      lastPhase = stageIndex;
    }
    timeline.value = String(Math.round(progress * 1000));
    timeline.setAttribute('aria-valuetext', `${(progress * meta.duration).toFixed(1)} seconds. ${CHECKPOINTS[stageIndex].title}.`);
    timeLabel.textContent = `${(progress * meta.duration).toFixed(1)} / ${meta.duration}s`;
    playButton.textContent = playing ? 'Pause' : progress >= .999 ? 'Play again' : progress > 0 ? 'Continue sequence' : 'Play whole sequence';
    playButton.setAttribute('aria-pressed', String(playing));
    note.textContent = reducedMotion
      ? 'Reduced motion: playback advances through readable checkpoints. Scrubbing and SVG export remain available.'
      : 'Original illustrative study. Pause anywhere, or choose a checkpoint to inspect the composition.';
  }

  function pause() {
    playing = false;
    cancelAnimationFrame(frame);
    frame = 0;
  }

  function tick(now) {
    if (!playing || dead) return;
    progress = clamp(startedProgress + (now - startedAt) / (meta.duration * 1000));
    if (progress >= 1) pause();
    render();
    if (playing) frame = requestAnimationFrame(tick);
  }

  function play(restart = false) {
    pause();
    if (restart || progress >= .999) progress = 0;
    startedProgress = progress;
    startedAt = performance.now();
    playing = true;
    render();
    frame = requestAnimationFrame(tick);
  }

  playButton.addEventListener('click', () => { if (playing) { pause(); render(); } else play(); });
  replayButton.addEventListener('click', () => play(true));
  timeline.addEventListener('input', () => { pause(); progress = Number(timeline.value) / 1000; render(); });
  traceToggle.addEventListener('change', () => { showTraces = traceToggle.checked; render(); });
  const onMotionChange = event => { reducedMotion = event.matches; render(); };
  media.addEventListener?.('change', onMotionChange);

  function resize() {
    const rect = stage.getBoundingClientRect();
    const w = Math.max(240, Math.round(rect.width || container.clientWidth || 900));
    const small = w < 650;
    const h = small ? 530 : Math.max(500, Math.min(620, Math.round(w * .57)));
    dimensions = { w, h, small };
    set(svg, { viewBox: `0 0 ${w} ${h}`, width: w, height: h });
    render();
  }
  let observer;
  if ('ResizeObserver' in window) {
    observer = new ResizeObserver(resize);
    observer.observe(stage);
  } else window.addEventListener('resize', resize);
  resize();

  return {
    destroy() {
      dead = true;
      pause();
      observer?.disconnect();
      window.removeEventListener('resize', resize);
      media.removeEventListener?.('change', onMotionChange);
      root.remove();
    },
    getState() {
      return {
        id: meta.id, title: meta.title, progress: fmt(progress), seconds: fmt(progress * meta.duration),
        duration: meta.duration, phase: CHECKPOINTS[phaseFor(displayedProgress())].title,
        displayedProgress: fmt(displayedProgress()),
        playing, showTraces, reducedMotion,
        words: WORDS.map(word => word.text),
        baseline: { inputs: WORDS.map(word => word.text), duration: meta.duration, progress: 0 },
        checkpoints: CHECKPOINTS.map(checkpoint => ({ progress: checkpoint.at, title: checkpoint.title })),
        basis: meta.basis,
      };
    },
    getSvg() {
      return svg;
    },
  };
}
