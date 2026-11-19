export const meta = {
  id: 'correction',
  title: 'Correct one assumption',
  eyebrow: 'Cause and consequence',
  description: 'Review a fictional source, correct the opening date, and see which parts of a plan actually depend on it.',
};

const DAYS = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const SHORT_DAYS = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const ORIGINAL_OPENING = 6;
const CORRECTED_OPENING = 2;
const END = 7400;
const TIMES = [0, 1400, 3300, 4400, 6100];
const STEP_TARGETS = [0, 1900, 4250, 5980, END];
const PHASES = [
  { label: 'Original plan', short: 'Plan', text: 'The plan assumes a Friday opening. Three action dates follow that assumption.' },
  { label: 'Review the source', short: 'Source', text: 'The fictional venue note says Monday is still the opening. Friday is a rehearsal.' },
  { label: 'Correct the anchor', short: 'Anchor', text: 'The opening changes to Monday. The dependent actions are queued for recalculation.' },
  { label: 'Follow the dependencies', short: 'Actions', text: 'Briefing, signs and launch move according to their rules. The weekly stock check stays on Tuesday.' },
  { label: 'Check the consequence', short: 'Check', text: 'The three dependent dates changed. The independent stock check did not move.' },
];
const ROWS = [
  { id: 'opening', label: 'Opening date', rule: 'The plan’s anchor', offset: 0, color: '#bca4dc', start: 3300 },
  { id: 'briefing', label: 'Team briefing', rule: 'Opening − 2 days', offset: -2, color: '#d4ed9b', start: 4400 },
  { id: 'signs', label: 'Signs ready', rule: 'Opening − 1 day', offset: -1, color: '#d4ed9b', start: 4590 },
  { id: 'launch', label: 'Launch message', rule: 'Same day as opening', offset: 0, color: '#d4ed9b', start: 4780 },
  { id: 'stock', label: 'Weekly stock check', rule: 'Fixed: every Tuesday', fixed: 3, color: '#f4b886', start: Infinity },
];
const SOURCE = {
  fictional: true,
  title: 'Venue note · fictional source',
  text: 'Opening remains Monday. Friday is the team rehearsal.',
};

const clamp = value => Math.max(0, Math.min(1, value));
const ease = value => { const t = clamp(value); return t * t * (3 - 2 * t); };
const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));

/** Pure dependency evaluation; the independent row never reads openingDay. */
export function scheduleFor(openingDay) {
  if (!Number.isInteger(openingDay) || openingDay < 2 || openingDay > 6) {
    throw new RangeError('Opening must be a day index from 2 (Monday) through 6 (Friday).');
  }
  return ROWS.map(row => ({
    id: row.id,
    label: row.label,
    rule: row.rule,
    dependsOn: row.fixed === undefined && row.id !== 'opening' ? 'opening' : null,
    day: row.fixed === undefined ? openingDay + row.offset : row.fixed,
  }));
}

/** A deterministic frame makes pause, scrubbing, stepping and replay agree. */
export function evaluateFrame(playheadMs, reducedMotion = false) {
  const time = Math.max(0, Math.min(END, Number(playheadMs) || 0));
  const original = scheduleFor(ORIGINAL_OPENING);
  const corrected = scheduleFor(CORRECTED_OPENING);
  let phase = 0;
  TIMES.forEach((start, index) => { if (time >= start) phase = index; });
  return {
    time,
    phase,
    evidenceReviewed: time >= TIMES[1],
    rows: ROWS.map((row, index) => {
      const progress = row.fixed !== undefined ? 0 : reducedMotion
        ? Number(time >= row.start)
        : ease((time - row.start) / 850);
      return {
        ...original[index],
        originalDay: original[index].day,
        correctedDay: corrected[index].day,
        position: original[index].day + (corrected[index].day - original[index].day) * progress,
        progress,
        changed: row.fixed === undefined && progress > 0,
        targetDay: row.fixed === undefined && time >= row.start ? corrected[index].day : original[index].day,
      };
    }),
  };
}

const STYLE = `
.correction-shell{color:var(--ink,#22372e);font-family:inherit;min-width:0}
.correction-shell *{box-sizing:border-box}
.correction-toolbar{display:flex;align-items:center;justify-content:space-between;gap:16px;margin:0 0 14px;flex-wrap:wrap}
.correction-views{display:inline-flex;gap:4px;background:var(--panel,#1c332a);border:1px solid var(--border,#435c4c);border-radius:13px;padding:4px}
.correction-shell .correction-view{appearance:none;border:0;background:transparent;color:var(--muted,#c4d0c5);font:inherit;font-size:14px;font-weight:650;border-radius:9px;padding:9px 16px;cursor:pointer;min-height:40px}
.correction-shell .correction-view[aria-pressed="true"]{background:var(--lime,#d4ed9b);color:#22372e}
.correction-key{display:flex;align-items:center;gap:8px;font-size:14px;color:var(--muted,#c4d0c5)}
.correction-key-dot{width:12px;height:12px;border-radius:4px;border:1.5px dashed #b4bfb5;background:#d8dfd7;flex:none}
.correction-scene{padding:0!important;overflow:hidden;border-radius:18px;background:var(--paper,#f0f4ed);border:1px solid #dce5d7;position:relative}
.correction-svg{display:block;width:100%;height:auto;overflow:visible;font-family:inherit;user-select:none}
.correction-controls{display:grid!important;grid-template-columns:auto 1fr;gap:14px!important;align-items:center;margin:16px 0 12px}
.correction-actions,.correction-playback{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.correction-playback{justify-content:flex-end}
.correction-shell .correction-button{appearance:none;border:1px solid var(--border,#435c4c);border-radius:10px;background:var(--panel,#1c332a);color:var(--muted,#c4d0c5);font:inherit;font-size:14px;line-height:1.3;font-weight:600;padding:11px 13px;min-height:43px;cursor:pointer;white-space:nowrap}
.correction-shell .correction-button.correction-primary{background:var(--lime,#d4ed9b);border-color:var(--lime,#d4ed9b);color:#22372e}
.correction-shell .correction-button:disabled{opacity:.42;cursor:default}
.correction-shell .correction-button:hover:not(:disabled){border-color:var(--cyan,#7dd3d5)}
.correction-shell button:focus-visible,.correction-shell input:focus-visible{outline:3px solid var(--cyan,#7dd3d5);outline-offset:3px}
.correction-progress{border:1px solid var(--border,#435c4c);border-radius:14px;padding:14px;background:var(--panel,#1c332a)}
.correction-progress-label{display:flex;justify-content:space-between;gap:12px;color:var(--muted,#c4d0c5);font-size:13px;margin-bottom:8px}
.correction-range{display:block;width:100%;height:20px;margin:0 0 10px;accent-color:var(--lime,#d4ed9b);cursor:pointer}
.correction-steps{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:5px}
.correction-shell .correction-step{appearance:none;border:0;background:transparent;color:#abbcaf;min-height:36px;border-radius:8px;font:inherit;font-size:14px;cursor:pointer;padding:6px 2px;text-align:center}
.correction-shell .correction-step[aria-current="step"]{background:#34503d;color:var(--lime,#d4ed9b);font-weight:650}
.correction-detail{display:flex;gap:16px;align-items:flex-start;justify-content:space-between;margin-top:14px;padding:16px!important;border:1px solid var(--border,#435c4c);border-radius:13px;background:var(--panel,#1c332a);color:var(--muted,#c4d0c5);min-height:88px}
.correction-detail-copy{margin:0;max-width:800px;font-size:15px;line-height:1.5}
.correction-detail-copy strong{color:var(--lime,#d4ed9b);display:block;font-size:16px;margin-bottom:3px;font-weight:650}
.correction-detail-status{font-size:13px;line-height:1.4;color:var(--cyan,#7dd3d5);text-align:right;max-width:150px;flex:none}
.correction-fiction{font-size:12px;line-height:1.5;color:var(--muted,#c4d0c5);opacity:.78;margin:12px 2px 0}
@media(max-width:760px){.correction-controls{grid-template-columns:1fr}.correction-playback{justify-content:flex-start}.correction-key{font-size:13px}.correction-detail-status{display:none}}
@media(max-width:440px){.correction-toolbar{gap:10px}.correction-views{width:100%}.correction-shell .correction-view{flex:1;padding:9px 5px}.correction-actions{display:grid;grid-template-columns:1fr 1fr;width:100%}.correction-shell .correction-button{font-size:13px;padding:10px 9px}.correction-playback{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));width:100%;gap:6px}.correction-progress{padding:12px 8px}.correction-step{font-size:13px!important}.correction-detail{padding:13px!important}.correction-detail-copy{font-size:14px}}
@media(prefers-reduced-motion:reduce){.correction-shell *{scroll-behavior:auto!important;transition:none!important;animation:none!important}}
`;

let instanceCount = 0;

export function mount(container) {
  if (!container || typeof container.append !== 'function') throw new TypeError('A DOM container is required.');
  const instance = `correction-${++instanceCount}`;
  const root = document.createElement('div');
  root.className = 'correction-shell';
  root.innerHTML = `
    <style>${STYLE}</style>
    <div class="correction-toolbar">
      <div class="correction-views" role="group" aria-label="Plan view">
        <button type="button" class="correction-view" data-view="original" aria-pressed="true">Original</button>
        <button type="button" class="correction-view" data-view="corrected" aria-pressed="false">Corrected</button>
        <button type="button" class="correction-view" data-view="compare" aria-pressed="false">Compare</button>
      </div>
      <div class="correction-key"><span class="correction-key-dot" aria-hidden="true"></span>Labelled grey imprints show the previous plan</div>
    </div>
    <div class="scene correction-scene">
      <svg class="correction-svg" xmlns="http://www.w3.org/2000/svg" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" role="img" aria-labelledby="${instance}-title ${instance}-desc"></svg>
    </div>
    <div class="controls correction-controls">
      <div class="correction-actions">
        <button type="button" class="button primary correction-button correction-primary" data-action="review">Review evidence</button>
        <button type="button" class="button correction-button" data-action="correct" disabled>Correct belief</button>
      </div>
      <div class="correction-playback">
        <button type="button" class="button correction-button" data-action="replay">Full replay</button>
        <button type="button" class="button correction-button" data-action="pause" disabled>Pause</button>
        <button type="button" class="button correction-button" data-action="previous" aria-label="Previous step" disabled>Previous</button>
        <button type="button" class="button correction-button" data-action="next" aria-label="Next step">Next</button>
      </div>
    </div>
    <div class="correction-progress">
      <div class="correction-progress-label"><label for="${instance}-range">Scrub the explanation</label><span class="correction-progress-state">Step 1 of 5</span></div>
      <input class="correction-range" id="${instance}-range" type="range" min="0" max="${END}" step="10" value="0" aria-label="Replay position" aria-valuetext="Original plan">
      <div class="correction-steps" role="group" aria-label="Explanation steps">
        ${PHASES.map((phase, index) => `<button type="button" class="correction-step" data-step="${index}"${index === 0 ? ' aria-current="step"' : ''}>${index + 1}. ${phase.short}</button>`).join('')}
      </div>
    </div>
    <div class="detail correction-detail">
      <p class="correction-detail-copy" role="status" aria-live="polite"><strong class="correction-phase-title"></strong><span class="correction-phase-text"></span></p>
      <span class="correction-detail-status"></span>
    </div>
    <p class="correction-fiction">Fictional schedule and source text. A rule-based illustration of correcting a plan, not a record of a real event.</p>
  `;
  container.append(root);

  const svg = root.querySelector('svg');
  const range = root.querySelector('.correction-range');
  const buttons = Object.fromEntries([...root.querySelectorAll('[data-action]')].map(button => [button.dataset.action, button]));
  const titleElement = root.querySelector('.correction-phase-title');
  const textElement = root.querySelector('.correction-phase-text');
  const statusElement = root.querySelector('.correction-detail-status');
  const progressLabel = root.querySelector('.correction-progress-state');
  const motionPreference = typeof matchMedia === 'function' ? matchMedia('(prefers-reduced-motion: reduce)') : null;
  const state = { view: 'original', time: 0, playing: false, paused: false, reducedMotion: motionPreference?.matches || false };
  let destroyed = false;
  let animationId = 0;
  let previousTimestamp = null;
  let targetTime = END;
  let manualAnimation = false;
  let lastPhase = -1;
  let sceneWidth = 0;
  let geometry = null;
  let graphics = [];
  let sourceElements = null;
  let anchorText = null;
  let svgDescription = null;
  let imprintLegend = null;

  function buildScene(width) {
    const w = Math.max(260, Math.round(width));
    const mobile = w < 680;
    const h = mobile ? 830 : 606;
    const xStart = mobile ? 30 : 242;
    const xEnd = w - (mobile ? 30 : 58);
    const gap = (xEnd - xStart) / 6;
    const markerWidth = mobile ? 49 : Math.min(86, gap * .9);
    const rows = mobile ? [267, 375, 483, 591, 731] : [173, 251, 329, 407, 505];
    const axisY = mobile ? 188 : 119;
    geometry = { w, h, mobile, xStart, xEnd, gap, rows, markerWidth };
    const sourceX = mobile ? 16 : Math.max(340, w - 390);
    const sourceY = mobile ? 70 : 17;
    const sourceW = mobile ? w - 32 : w - sourceX - 20;
    const sourceH = 82;
    const oldPlans = scheduleFor(ORIGINAL_OPENING);
    const xFor = day => xStart + gap * day;
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    svg.setAttribute('width', String(w));
    svg.setAttribute('height', String(h));
    svg.innerHTML = `
      <title id="${instance}-title">Correcting one opening date changes only dependent actions.</title>
      <desc id="${instance}-desc"></desc>
      <rect width="${w}" height="${h}" rx="18" fill="#f0f4ed"/>
      <text x="${mobile ? 18 : 26}" y="${mobile ? 28 : 38}" font-size="14" font-weight="700" letter-spacing="1.1" fill="#607365">ONE ASSUMPTION</text>
      <text class="correction-anchor-text" x="${mobile ? 18 : 26}" y="${mobile ? 52 : 68}" font-size="${mobile ? 21 : 23}" font-weight="700" fill="#22372e">Opening: Friday</text>
      <g class="correction-source">
        <rect class="correction-source-box" x="${sourceX}" y="${sourceY}" width="${sourceW}" height="${sourceH}" rx="12" fill="#e6ebe3" stroke="#cbd5c6" stroke-width="1.5"/>
        <circle class="correction-source-dot" cx="${sourceX + 17}" cy="${sourceY + 20}" r="4" fill="#8c9c8b"/>
        <text x="${sourceX + 29}" y="${sourceY + 25}" font-size="14" font-weight="650" fill="#536959">${mobile ? 'FICTIONAL VENUE NOTE' : 'FICTIONAL SOURCE · VENUE NOTE'}</text>
        <text class="correction-source-line1" x="${sourceX + 15}" y="${sourceY + 49}" font-size="17" font-weight="650" fill="#22372e">Source not reviewed</text>
        <text class="correction-source-line2" x="${sourceX + 15}" y="${sourceY + 70}" font-size="14" fill="#536959">Review the note before changing the plan.</text>
      </g>
      ${!mobile ? `<text x="26" y="${axisY}" font-size="14" fill="#607365">DEPENDENCY RULE</text>` : ''}
      ${DAYS.map((day, index) => `<text x="${xFor(index)}" y="${axisY}" font-size="14" font-weight="${index === 2 || index === 6 ? 700 : 500}" text-anchor="middle" fill="${index === 2 || index === 6 ? '#22372e' : '#607365'}">${gap > 88 && !mobile ? day : SHORT_DAYS[index]}</text>`).join('')}
      ${!mobile ? DAYS.map((_, index) => `<line x1="${xFor(index)}" y1="${axisY + 15}" x2="${xFor(index)}" y2="${rows[4] + 24}" stroke="#dce4d7" stroke-width="1" stroke-dasharray="3 7"/>`).join('') : ''}
      ${ROWS.map((row, index) => {
        const y = rows[index];
        const originalX = xFor(oldPlans[index].day);
        const independent = row.fixed !== undefined;
        const labelY = mobile ? y - 54 : y - 5;
        const labelX = mobile ? 18 : 26;
        return `<g class="correction-row" data-row="${row.id}">
          ${independent ? `<line x1="18" y1="${mobile ? y - 91 : y - 51}" x2="${w - 18}" y2="${mobile ? y - 91 : y - 51}" stroke="#cbd5c6"/><text x="${mobile ? 18 : 26}" y="${mobile ? y - 71 : y - 30}" font-size="14" font-weight="650" fill="#8a6344">INDEPENDENT WORK</text>` : ''}
          <text x="${labelX}" y="${labelY}" font-size="${mobile ? 17 : 17}" font-weight="650" fill="#22372e">${escape(row.label)}</text>
          <text x="${labelX}" y="${labelY + 21}" font-size="14" fill="#536959">${escape(row.rule)}</text>
          <line x1="${xStart}" y1="${y}" x2="${xEnd}" y2="${y}" stroke="${independent ? '#dfcbb5' : '#d2ddcc'}" stroke-width="3" stroke-linecap="round"/>
          ${DAYS.map((_, day) => `<circle cx="${xFor(day)}" cy="${y}" r="3" fill="${independent ? '#c7a888' : '#bccbb7'}"/>`).join('')}
          <line class="correction-trail" x1="${originalX}" y1="${y}" x2="${originalX}" y2="${y}" stroke="#819a72" stroke-width="3" stroke-dasharray="5 6" opacity="0"/>
          <g class="correction-imprint" opacity="0" transform="translate(${originalX} ${y})">
            <rect x="${-markerWidth / 2}" y="-19" width="${markerWidth}" height="38" rx="10" fill="#dfe5dc" stroke="#8c998b" stroke-width="1.5" stroke-dasharray="4 3"/>
            <text y="5" font-size="16" font-weight="650" text-anchor="middle" fill="#657463">${SHORT_DAYS[oldPlans[index].day]}</text>
            <text y="38" font-size="14" text-anchor="middle" fill="#596a59">Was ${SHORT_DAYS[oldPlans[index].day]}</text>
          </g>
          <g class="correction-marker" transform="translate(${originalX} ${y})">
            <rect class="correction-marker-box" x="${-markerWidth / 2}" y="-21" width="${markerWidth}" height="42" rx="11" fill="${row.color}" stroke="${independent ? '#bf956e' : row.id === 'opening' ? '#8c72ae' : '#9bb877'}" stroke-width="1.6"/>
            <text class="correction-marker-text" y="5" font-size="16" font-weight="750" text-anchor="middle" fill="#22372e">${SHORT_DAYS[oldPlans[index].day]}</text>
            <text class="correction-marker-caption" y="${independent ? 39 : 38}" font-size="14" text-anchor="middle" fill="${independent ? '#8a6344' : '#47613e'}">${independent ? 'Always Tue' : ''}</text>
          </g>
        </g>`;
      }).join('')}
      <g class="correction-imprint-legend" opacity="0">
        <rect x="${mobile ? 19 : 26}" y="${h - 40}" width="13" height="13" rx="3" fill="#dfe5dc" stroke="#8c998b" stroke-dasharray="3 2"/>
        <text x="${mobile ? 40 : 48}" y="${h - 28}" font-size="14" fill="#596a59">Grey imprints = previous plan</text>
      </g>
      ${!mobile ? `<text x="${w - 24}" y="${h - 28}" font-size="14" text-anchor="end" fill="#607365">One illustrative week · all content fictional</text>` : ''}
    `;
    graphics = ROWS.map(row => {
      const group = svg.querySelector(`[data-row="${row.id}"]`);
      return {
        marker: group.querySelector('.correction-marker'),
        markerText: group.querySelector('.correction-marker-text'),
        caption: group.querySelector('.correction-marker-caption'),
        imprint: group.querySelector('.correction-imprint'),
        trail: group.querySelector('.correction-trail'),
      };
    });
    sourceElements = {
      box: svg.querySelector('.correction-source-box'),
      dot: svg.querySelector('.correction-source-dot'),
      line1: svg.querySelector('.correction-source-line1'),
      line2: svg.querySelector('.correction-source-line2'),
    };
    anchorText = svg.querySelector('.correction-anchor-text');
    svgDescription = svg.querySelector('desc');
    imprintLegend = svg.querySelector('.correction-imprint-legend');
    updateFrame(true);
  }

  function updateFrame(force = false) {
    if (destroyed || !geometry) return;
    const frame = evaluateFrame(state.time, state.reducedMotion);
    const showImprints = state.view === 'compare';
    let anyImprints = false;
    frame.rows.forEach((row, index) => {
      const graphic = graphics[index];
      const x = geometry.xStart + geometry.gap * row.position;
      graphic.marker.setAttribute('transform', `translate(${x.toFixed(2)} ${geometry.rows[index]})`);
      const visiblyChanged = row.progress > .04;
      const imprint = showImprints && visiblyChanged && row.id !== 'stock';
      graphic.imprint.setAttribute('opacity', imprint ? String(Math.min(1, row.progress * 4)) : '0');
      graphic.trail.setAttribute('x2', x.toFixed(2));
      graphic.trail.setAttribute('opacity', imprint ? '.65' : '0');
      graphic.markerText.textContent = SHORT_DAYS[row.progress >= .5 ? row.correctedDay : row.originalDay];
      graphic.caption.textContent = row.id === 'stock' ? 'Always Tue' : row.progress > .99 ? 'Now ' + SHORT_DAYS[row.correctedDay] : '';
      anyImprints ||= imprint;
    });
    imprintLegend.setAttribute('opacity', anyImprints ? '1' : '0');
    anchorText.textContent = frame.phase >= 2 ? 'Opening: Monday' : 'Opening: Friday';
    sourceElements.box.setAttribute('fill', frame.evidenceReviewed ? '#dceee6' : '#e6ebe3');
    sourceElements.box.setAttribute('stroke', frame.phase === 1 ? '#488f7a' : frame.evidenceReviewed ? '#a8cab8' : '#cbd5c6');
    sourceElements.dot.setAttribute('fill', frame.evidenceReviewed ? '#2d7b60' : '#8c9c8b');
    sourceElements.line1.textContent = frame.evidenceReviewed ? 'Opening remains Monday.' : 'Source not reviewed';
    sourceElements.line2.textContent = frame.evidenceReviewed ? 'Friday is the team rehearsal.' : geometry.mobile ? 'Review before changing the plan.' : 'Review the note before changing the plan.';
    range.value = String(Math.round(state.time));
    if (force || frame.phase !== lastPhase) {
      const phase = PHASES[frame.phase];
      titleElement.textContent = phase.label;
      textElement.textContent = phase.text;
      progressLabel.textContent = `Step ${frame.phase + 1} of ${PHASES.length}`;
      range.setAttribute('aria-valuetext', phase.label);
      root.querySelectorAll('[data-step]').forEach(button => {
        if (Number(button.dataset.step) === frame.phase) button.setAttribute('aria-current', 'step');
        else button.removeAttribute('aria-current');
      });
      svgDescription.textContent = `${phase.label}. ${phase.text} Displayed rules: team briefing is two days before opening; signs are ready one day before opening; launch message is on opening day. Weekly stock check is fixed on Tuesday. ${showImprints ? 'Labelled grey imprints mark each previous plan date.' : ''} All data and the venue note are fictional.`;
      lastPhase = frame.phase;
    }
    root.querySelectorAll('[data-view]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.view === state.view)));
    buttons.review.disabled = state.playing;
    buttons.correct.disabled = state.playing || !frame.evidenceReviewed || frame.phase >= 2;
    buttons.correct.classList.toggle('correction-primary', frame.phase === 1 && !state.playing);
    buttons.review.classList.toggle('correction-primary', frame.phase === 0 && !state.playing);
    buttons.previous.disabled = !state.playing && frame.phase === 0 && state.time === 0;
    buttons.next.disabled = !state.playing && frame.phase === 4;
    buttons.pause.disabled = !state.playing && !state.paused;
    buttons.pause.textContent = state.paused && !state.playing ? 'Resume' : 'Pause';
    statusElement.textContent = state.reducedMotion ? 'Reduced motion · discrete changes' : state.playing ? 'Playing · pause or scrub any time' : frame.phase === 4 ? 'Stock check stays on Tuesday' : 'No autoplay · take your time';
  }

  function stop() {
    if (animationId) cancelAnimationFrame(animationId);
    animationId = 0;
    previousTimestamp = null;
    state.playing = false;
  }

  function tick(timestamp) {
    if (destroyed || !state.playing) return;
    const delta = previousTimestamp === null ? 0 : Math.min(80, Math.max(0, timestamp - previousTimestamp));
    previousTimestamp = timestamp;
    const direction = targetTime >= state.time ? 1 : -1;
    const speed = manualAnimation ? 3 : 1;
    const nextTime = state.time + delta * speed * direction;
    const done = direction > 0 ? nextTime >= targetTime : nextTime <= targetTime;
    state.time = done ? targetTime : nextTime;
    if (done) {
      state.playing = false;
      state.paused = false;
      animationId = 0;
      previousTimestamp = null;
    }
    updateFrame();
    if (!done) animationId = requestAnimationFrame(tick);
  }

  function start(from, to = END, manual = false) {
    stop();
    state.time = from;
    state.view = 'compare';
    state.paused = false;
    targetTime = to;
    manualAnimation = manual;
    if (manual && state.reducedMotion) {
      state.time = to;
      updateFrame(true);
      return;
    }
    state.playing = true;
    updateFrame(true);
    animationId = requestAnimationFrame(tick);
  }

  function jump(time, view = 'compare') {
    stop();
    state.time = Math.max(0, Math.min(END, time));
    state.view = view;
    state.paused = false;
    updateFrame(true);
  }

  function step(index) {
    const targetIndex = Math.max(0, Math.min(PHASES.length - 1, index));
    if (targetIndex === 0 || targetIndex === 1 || targetIndex === 4 || state.reducedMotion) {
      jump(STEP_TARGETS[targetIndex], targetIndex === 0 ? 'original' : 'compare');
    } else {
      start(state.time, STEP_TARGETS[targetIndex], true);
    }
  }

  function onClick(event) {
    const button = event.target.closest('button');
    if (!button || !root.contains(button) || button.disabled) return;
    if (button.dataset.view) {
      const view = button.dataset.view;
      jump(view === 'original' ? 0 : END, view);
      return;
    }
    if (button.dataset.step !== undefined) { step(Number(button.dataset.step)); return; }
    const frame = evaluateFrame(state.time, state.reducedMotion);
    switch (button.dataset.action) {
      case 'review': jump(STEP_TARGETS[1]); break;
      case 'correct': start(Math.max(STEP_TARGETS[1], Math.min(state.time, TIMES[2])), END); break;
      case 'replay': start(0); break;
      case 'pause':
        if (state.playing) { stop(); state.paused = true; updateFrame(true); }
        else if (state.paused) { start(state.time, targetTime, manualAnimation); }
        break;
      case 'previous': step(frame.phase - 1); break;
      case 'next': step(frame.phase + 1); break;
    }
  }

  function onScrub() { jump(Number(range.value)); }
  function onMotionPreference(event) { state.reducedMotion = event.matches; updateFrame(true); }
  function measure() {
    if (destroyed) return;
    const width = root.querySelector('.correction-scene').getBoundingClientRect().width || container.clientWidth || 960;
    if (Math.abs(width - sceneWidth) < 2 && geometry) return;
    sceneWidth = width;
    buildScene(width);
  }
  root.addEventListener('click', onClick);
  range.addEventListener('input', onScrub);
  motionPreference?.addEventListener?.('change', onMotionPreference);
  const resizeObserver = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null;
  resizeObserver?.observe(root);
  if (!resizeObserver) window.addEventListener('resize', measure);
  measure();

  return {
    destroy() {
      if (destroyed) return;
      stop();
      destroyed = true;
      root.removeEventListener('click', onClick);
      range.removeEventListener('input', onScrub);
      motionPreference?.removeEventListener?.('change', onMotionPreference);
      resizeObserver?.disconnect();
      if (!resizeObserver) window.removeEventListener('resize', measure);
      root.remove();
    },
    getState() {
      const frame = evaluateFrame(state.time, state.reducedMotion);
      return {
        id: meta.id,
        view: state.view,
        phase: frame.phase,
        phaseLabel: PHASES[frame.phase].label,
        playheadMs: Math.round(state.time),
        playing: state.playing,
        reducedMotion: state.reducedMotion,
        source: { ...SOURCE, reviewed: frame.evidenceReviewed },
        belief: { original: 'Friday', corrected: 'Monday', current: frame.phase >= 2 ? 'Monday' : 'Friday' },
        tasks: frame.rows.map(row => ({
          id: row.id, label: row.label, rule: row.rule, dependsOn: row.dependsOn,
          originalDay: DAYS[row.originalDay], correctedDay: DAYS[row.correctedDay],
          plannedDay: DAYS[row.targetDay], movementProgress: Number(row.progress.toFixed(3)),
        })),
      };
    },
    getSvg() { return svg; },
  };
}
