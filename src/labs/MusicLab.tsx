import {useCallback, useEffect, useId, useRef, useState, type CSSProperties, type RefObject} from 'react';
import {encodeWav, harmonicValue, makePattern, MUSIC_PITCHES, noteFrequency, patternDuration, patternStepSeconds, renderPatternSamples, toneValue, validatePattern, type MusicPattern, type ToneShape} from '../../lib/explorations/music';
import OriginalMusicExperiment, {type OriginalMusicId} from './OriginalMusicExperiment';
import './music-lab.css';

type Lab = 'sound' | 'harmonics' | 'sequence' | `original-${OriginalMusicId}`;
type AudioSession = {
  context: AudioContext;
  analyser: AnalyserNode;
  master: GainNode;
  nodes: Set<OscillatorNode>;
  tone?: OscillatorNode;
  timer?: number;
  startsAt: number;
  stepSeconds: number;
  scheduled: number;
  stopAfter: number;
  stepCount: number;
};
const PARTIAL_COLORS = ['#d6edaa', '#84d8cd', '#8fc7ef', '#c7b0ed', '#eca6bd', '#f0b38b', '#ead180', '#b6cf8c'];
const LABS: {id: Lab; name: string; hint: string}[] = [
  {id: 'sound', name: 'Sound & spectrum', hint: 'See what you hear'},
  {id: 'harmonics', name: 'Build a timbre', hint: 'Add waves together'},
  {id: 'sequence', name: 'Make a melody', hint: 'Give your notes a rhythm'},
  {id: 'original-harmonics', name: 'Harmonics', hint: 'Google original'},
  {id: 'original-strings', name: 'Strings', hint: 'Google original'},
  {id: 'original-soundwaves', name: 'Sound Waves', hint: 'Google original'},
  {id: 'original-spectrogram', name: 'Spectrogram', hint: 'Google original'},
];
const labFromHash = () => LABS.find(item => window.location.hash === `#music-lab/${item.id}`)?.id;
const HARMONIC_PRESETS = {
  Pure: [1, 0, 0, 0, 0, 0, 0, 0],
  Warm: [1, .25, .08, 0, 0, 0, 0, 0],
  Odd: [1, 0, .33, 0, .2, 0, .14, 0],
  Bright: [1, .5, .33, .25, .2, .17, .14, .125],
};

function closeSession(session: AudioSession | null) {
  if (!session) return;
  if (session.timer !== undefined) window.clearInterval(session.timer);
  const {context, master} = session;
  if (context.state === 'closed') return;
  const now = context.currentTime;
  try {
    master.gain.cancelScheduledValues(now);
    master.gain.setValueAtTime(master.gain.value, now);
    master.gain.linearRampToValueAtTime(0, now + .018);
    session.nodes.forEach(node => {try {node.stop(now + .02);} catch { /* Already ended. */ }});
  } catch { /* A browser may have already closed an interrupted context. */ }
  window.setTimeout(() => {if (context.state !== 'closed') void context.close().catch(() => undefined);}, 35);
}

function periodicWave(context: AudioContext, amplitudes: readonly number[]) {
  const scale = Math.max(1, amplitudes.reduce((sum, value) => sum + Math.abs(value), 0));
  const real = new Float32Array(amplitudes.length + 1);
  const imaginary = Float32Array.from([0, ...amplitudes.map(value => value / scale)]);
  return context.createPeriodicWave(real, imaginary, {disableNormalization: true});
}

function downloadFile(name: string, content: BlobPart, type: string) {
  const url = URL.createObjectURL(new Blob([content], {type}));
  const link = document.createElement('a'); link.href = url; link.download = name;
  document.body.append(link); link.click(); link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Real analyser data when playing; the resting waveform is explicitly a model preview. */
function SignalMonitor({engine, playing, frequency, shape, reduced}: {
  engine: RefObject<AudioSession | null>; playing: boolean; frequency: number; shape: ToneShape; reduced: boolean;
}) {
  const waveRef = useRef<HTMLCanvasElement>(null), spectrumRef = useRef<HTMLCanvasElement>(null);
  const config = useRef({frequency, shape}); config.current = {frequency, shape};
  const history = useRef<HTMLCanvasElement | null>(null);
  const hasHistory = useRef(false);
  const repaint = useRef<(() => void) | null>(null);
  useEffect(() => {
    const wave = waveRef.current, spectrum = spectrumRef.current;
    if (!wave || !spectrum) return;
    const offscreen = history.current ?? document.createElement('canvas'); history.current = offscreen;
    let raf = 0, previous = 0, shiftRemainder = 0, width = 600;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const size = () => {
      width = Math.max(220, wave.getBoundingClientRect().width);
      for (const [canvas, height] of [[wave, 162], [spectrum, 240]] as const) {
        canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
      }
      const historyWidth = Math.max(1, Math.floor(width - 58));
      if (offscreen.width !== historyWidth || offscreen.height !== 178) {
        offscreen.width = historyWidth; offscreen.height = 178;
        offscreen.getContext('2d')?.clearRect(0, 0, offscreen.width, offscreen.height);
        hasHistory.current = false;
      }
    };
    const observer = new ResizeObserver(() => {size(); if (!playing) repaint.current?.();}); observer.observe(wave); size();
    const timeData = new Uint8Array(4096), frequencies = new Float32Array(2048);
    const draw = (now: number) => {
      if (playing && reduced && previous && now - previous < 250) {raf = requestAnimationFrame(draw); return;}
      const delta = previous ? Math.min(.3, (now - previous) / 1000) : 0; previous = now;
      const session = engine.current, live = playing && session?.context.state === 'running';
      const ctx = wave.getContext('2d'), spec = spectrum.getContext('2d'), hctx = offscreen.getContext('2d');
      if (!ctx || !spec || !hctx) return;
      const left = 44, right = width - 14, graphWidth = right - left;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, width, 162);
      ctx.font = '12px system-ui'; ctx.strokeStyle = '#355248'; ctx.lineWidth = 1;
      for (const y of [22, 74, 126]) {ctx.beginPath(); ctx.moveTo(left, y); ctx.lineTo(right, y); ctx.stroke();}
      ctx.fillStyle = '#a3bdb1'; ctx.textAlign = 'right'; ctx.fillText('+1', 35, 26); ctx.fillText('0', 35, 78); ctx.fillText('−1', 35, 130);
      ctx.textAlign = 'left'; ctx.fillText('0', left, 149); ctx.textAlign = 'center'; ctx.fillText('10', (left + right) / 2, 149); ctx.textAlign = 'right'; ctx.fillText('20 ms', right, 149);
      let start = 0, sampleCount = 0;
      if (live && session) {
        session.analyser.getByteTimeDomainData(timeData);
        sampleCount = Math.min(2200, Math.floor(session.context.sampleRate * .02));
        for (let i = 1; i < 1000 && i + sampleCount < timeData.length; i++) if (timeData[i - 1] < 128 && timeData[i] >= 128) {start = i; break;}
      }
      ctx.beginPath(); ctx.strokeStyle = '#d6edaa'; ctx.lineWidth = 2;
      for (let x = 0; x <= graphWidth; x++) {
        const t = x / graphWidth;
        const value = live ? (timeData[start + Math.min(sampleCount - 1, Math.floor(t * sampleCount))] - 128) / 128
          : toneValue(t * .02 * config.current.frequency * Math.PI * 2, config.current.shape);
        if (x === 0) ctx.moveTo(left + x, 74 - value * 49); else ctx.lineTo(left + x, 74 - value * 49);
      }
      ctx.stroke();
      if (live && session) {
        session.analyser.getFloatFrequencyData(frequencies);
        shiftRemainder += offscreen.width * delta / 8;
        const shift = Math.floor(shiftRemainder); shiftRemainder -= shift;
        if (shift > 0) {
          hctx.drawImage(offscreen, -shift, 0);
          for (let y = 0; y < 178; y++) {
            const hz = 40 * (8000 / 40) ** (1 - y / 177);
            const bin = Math.min(frequencies.length - 1, Math.round(hz / session.context.sampleRate * session.analyser.fftSize));
            const power = Math.max(0, Math.min(1, (frequencies[bin] + 85) / 80));
            hctx.fillStyle = power < .04 ? '#132c27' : `hsl(${190 - power * 125} 65% ${14 + power * 57}%)`;
            hctx.fillRect(offscreen.width - shift, y, shift, 1);
          }
          hasHistory.current = true;
        }
      }
      spec.setTransform(dpr, 0, 0, dpr, 0, 0); spec.clearRect(0, 0, width, 240);
      spec.fillStyle = '#132c27'; spec.fillRect(left, 12, graphWidth, 178);
      spec.drawImage(offscreen, left, 12, graphWidth, 178);
      spec.font = '12px system-ui'; spec.textAlign = 'right';
      for (const hz of [80, 440, 2000, 8000]) {
        const y = 12 + 178 * (1 - Math.log(hz / 40) / Math.log(8000 / 40));
        spec.fillStyle = '#a3bdb1'; spec.fillText(hz >= 1000 ? `${hz / 1000}k` : String(hz), 35, y + 4);
        spec.strokeStyle = '#bddecc16'; spec.beginPath(); spec.moveTo(left, y); spec.lineTo(right, y); spec.stroke();
      }
      spec.fillStyle = '#a3bdb1'; spec.textAlign = 'left'; spec.fillText('8 s ago', left, 212); spec.textAlign = 'right'; spec.fillText('now', right, 212);
      spec.textAlign = 'center'; spec.fillText('Frequency (Hz) over time', (left + right) / 2, 232);
      if (!hasHistory.current) {spec.fillStyle = '#adc9bb'; spec.fillText('Play, then change the pitch.', (left + right) / 2, 102);}
      if (playing) raf = requestAnimationFrame(draw);
    };
    repaint.current = () => draw(performance.now());
    raf = requestAnimationFrame(draw);
    return () => {cancelAnimationFrame(raf); observer.disconnect(); repaint.current = null;};
  }, [engine, playing, reduced]);
  useEffect(() => {if (!playing) repaint.current?.();}, [frequency, shape, playing]);
  return <div className="ml-monitors">
    <figure><figcaption><span>Waveform <small>amplitude / time</small></span><span className={playing ? 'ml-live' : ''}>{playing ? 'Live signal' : 'Model preview'}</span></figcaption><canvas ref={waveRef} style={{height: 162}} role="img" aria-label={playing ? 'Live audio waveform, amplitude from minus one to one over twenty milliseconds.' : 'Model preview of the selected waveform over twenty milliseconds. Press Play for real audio.'}/></figure>
    <figure><figcaption><span>Spectrogram <small>brighter = stronger</small></span><span>{playing ? 'FFT · log frequency' : 'Paused · log frequency'}</span></figcaption><canvas ref={spectrumRef} style={{height: 240}} role="img" aria-label="Audio frequency history, from 40 to 8000 hertz on a logarithmic vertical axis and eight seconds of time on the horizontal axis. Bright bands show stronger frequencies. The history pauses when sound stops."/></figure>
  </div>;
}

function HarmonicPlot({amplitudes}: {amplitudes: number[]}) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const draw = () => {
      const width = Math.max(220, canvas.getBoundingClientRect().width), height = 230, dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr); canvas.height = height * dpr;
      const ctx = canvas.getContext('2d'); if (!ctx) return;
      ctx.scale(dpr, dpr); const left = 26, right = width - 16, mid = 105, scale = Math.max(1, amplitudes.reduce((sum, value) => sum + value, 0));
      ctx.strokeStyle = '#355248'; ctx.lineWidth = 1;
      for (const y of [35, 105, 175]) {ctx.beginPath(); ctx.moveTo(left, y); ctx.lineTo(right, y); ctx.stroke();}
      amplitudes.forEach((amp, index) => {
        if (!amp) return; ctx.beginPath(); ctx.lineWidth = 1.2; ctx.globalAlpha = .55; ctx.strokeStyle = PARTIAL_COLORS[index];
        for (let x = 0; x <= right - left; x++) {const y = mid - amp / scale * Math.sin(x / (right - left) * Math.PI * 4 * (index + 1)) * 76; if (!x) ctx.moveTo(left, y); else ctx.lineTo(left + x, y);}
        ctx.stroke();
      });
      ctx.beginPath(); ctx.globalAlpha = 1; ctx.lineWidth = 3; ctx.strokeStyle = '#f5f6ef';
      for (let x = 0; x <= right - left; x++) {const y = mid - harmonicValue(x / (right - left) * Math.PI * 4, amplitudes) * 76; if (!x) ctx.moveTo(left, y); else ctx.lineTo(left + x, y);}
      ctx.stroke(); ctx.fillStyle = '#a3bdb1'; ctx.font = '13px system-ui'; ctx.textAlign = 'left'; ctx.fillText('0', left, 208); ctx.textAlign = 'center'; ctx.fillText('1 cycle', (left + right) / 2, 208); ctx.textAlign = 'right'; ctx.fillText('2 cycles', right, 208);
    };
    const observer = new ResizeObserver(draw); observer.observe(canvas); draw(); return () => observer.disconnect();
  }, [amplitudes]);
  return <figure className="ml-harmonic-plot"><figcaption><span>The combined wave</span><span><i/> colored components <b/> white sum</span></figcaption><canvas ref={ref} style={{height: 230}} role="img" aria-label="Two cycles of the combined wave in white, with each harmonic component in its own color."/></figure>;
}

export default function MusicLab() {
  const id = useId(), engine = useRef<AudioSession | null>(null), request = useRef(0), mounted = useRef(true);
  const [lab, setLab] = useState<Lab>(() => labFromHash() ?? 'sound'), [playing, setPlaying] = useState(false), [starting, setStarting] = useState(false);
  const [frequency, setFrequency] = useState(440), [shape, setShape] = useState<ToneShape>('sine'), [level, setLevel] = useState(30);
  const [fundamental, setFundamental] = useState(220), [amplitudes, setAmplitudes] = useState<number[]>([...HARMONIC_PRESETS.Warm]);
  const [pattern, setPattern] = useState<MusicPattern>(() => makePattern()), patternRef = useRef(pattern);
  const [loop, setLoop] = useState(false), [playhead, setPlayhead] = useState(-1), [cursor, setCursor] = useState({row: 4, step: 0});
  const [message, setMessage] = useState('Choose an experiment. Sound starts only when you press Play.');
  const [error, setError] = useState(''), [reduced, setReduced] = useState(false), [audioAvailable, setAudioAvailable] = useState(true);
  const importRef = useRef<HTMLInputElement>(null);
  const stop = useCallback((note?: string) => {
    request.current++; const previous = engine.current; engine.current = null; closeSession(previous);
    if (mounted.current) {setPlaying(false); setStarting(false); setPlayhead(-1); if (note) setMessage(note);}
  }, []);

  useEffect(() => {
    mounted.current = true;
    setAudioAvailable(Boolean(window.AudioContext || (window as unknown as {webkitAudioContext?: typeof AudioContext}).webkitAudioContext));
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(preference.matches); update(); preference.addEventListener('change', update);
    const hidden = () => {if (document.hidden) stop('Sound stopped while the page was out of view.');};
    const stopForOriginal = () => stop('Sound stopped while another original is open.');
    window.addEventListener('atlas-stop-audio', stopForOriginal);
    document.addEventListener('visibilitychange', hidden);
    return () => {mounted.current = false; request.current++; closeSession(engine.current); engine.current = null; document.removeEventListener('visibilitychange', hidden); window.removeEventListener('atlas-stop-audio', stopForOriginal); preference.removeEventListener('change', update);};
  }, [stop]);

  useEffect(() => {
    const navigate = () => {const next = labFromHash(); if (next) {stop(); setLab(next); setError(''); document.getElementById('music-lab')?.scrollIntoView({block: 'start'});}};
    navigate();
    window.addEventListener('hashchange', navigate); window.addEventListener('popstate', navigate);
    return () => {window.removeEventListener('hashchange', navigate); window.removeEventListener('popstate', navigate);};
  }, [stop]);

  useEffect(() => {
    const session = engine.current; if (!session || !session.tone || !playing) return;
    const now = session.context.currentTime;
    session.tone.frequency.setTargetAtTime(lab === 'harmonics' ? fundamental : frequency, now, .02);
    if (lab === 'harmonics') session.tone.setPeriodicWave(periodicWave(session.context, amplitudes)); else session.tone.type = shape;
  }, [frequency, shape, fundamental, amplitudes, lab, playing]);
  useEffect(() => {const session = engine.current; if (session) session.master.gain.setTargetAtTime(level / 100 * .12, session.context.currentTime, .02);}, [level, playing]);
  useEffect(() => {
    if (!playing || lab !== 'sequence') return;
    let raf = 0, previous = -1;
    const follow = () => {
      const session = engine.current; if (!session) return;
      const elapsed = session.context.currentTime - session.startsAt;
      const step = elapsed < 0 ? -1 : Math.floor(elapsed / session.stepSeconds) % session.stepCount;
      if (step !== previous) {previous = step; setPlayhead(step);}
      raf = requestAnimationFrame(follow);
    };
    raf = requestAnimationFrame(follow); return () => cancelAnimationFrame(raf);
  }, [playing, lab]);

  const changePattern = (next: MusicPattern, interrupt = false) => {if (interrupt) stop('Pattern updated. Press Play to hear it.'); patternRef.current = next; setPattern(next);};
  const chooseLab = (next: Lab) => {if (next !== lab) {stop(); setLab(next); setError(''); setMessage('Ready. Press Play when you want to listen.'); window.history.replaceState(null, '', `#music-lab/${next}`);}};

  async function play() {
    if (playing) {stop('Sound stopped. Your settings are kept.'); return;}
    if (starting) return;
    setStarting(true); setError(''); const ticket = ++request.current;
    let context: AudioContext | undefined;
    try {
      const Constructor = window.AudioContext || (window as unknown as {webkitAudioContext?: typeof AudioContext}).webkitAudioContext;
      if (!Constructor) throw new Error('This browser does not offer Web Audio. You can still explore the models and export a melody.');
      context = new Constructor();
      await context.resume();
      if (ticket !== request.current || !mounted.current || document.hidden) {void context.close(); return;}
      if (context.state !== 'running') throw new Error('Audio could not start. Press Play again, or try a browser with Web Audio support.');
      const analyser = context.createAnalyser(); analyser.fftSize = 4096; analyser.minDecibels = -90; analyser.maxDecibels = 0; analyser.smoothingTimeConstant = .65;
      const master = context.createGain(); master.gain.setValueAtTime(0, context.currentTime); master.gain.linearRampToValueAtTime(level / 100 * .12, context.currentTime + .035);
      analyser.connect(master); master.connect(context.destination);
      const session: AudioSession = {context, analyser, master, nodes: new Set(), startsAt: context.currentTime + .06, stepSeconds: patternStepSeconds(patternRef.current), scheduled: 0, stopAfter: loop ? Infinity : patternRef.current.steps, stepCount: patternRef.current.steps};
      engine.current = session;
      if (lab !== 'sequence') {
        const tone = context.createOscillator(); session.tone = tone; session.nodes.add(tone);
        tone.frequency.value = lab === 'harmonics' ? fundamental : frequency;
        if (lab === 'harmonics') tone.setPeriodicWave(periodicWave(context, amplitudes)); else tone.type = shape;
        tone.connect(analyser); tone.start();
        setMessage(lab === 'sound' ? 'Listening. Change the pitch or waveform and follow the live spectrum.' : 'Listening. Add or remove harmonics to change the character of the sound.');
      } else {
        const schedule = () => {
          if (engine.current !== session) return;
          const now = session.context.currentTime;
          if (Number.isFinite(session.stopAfter) && now >= session.startsAt + session.stopAfter * session.stepSeconds) {stop('Pattern finished. Play it again, or change a note.'); return;}
          while (session.scheduled < session.stopAfter && session.startsAt + session.scheduled * session.stepSeconds < now + .12) {
            const current = patternRef.current, index = session.scheduled % session.stepCount;
            const when = session.startsAt + session.scheduled * session.stepSeconds, duration = session.stepSeconds * .86;
            if (when < now - .05) {session.scheduled++; continue;} // Do not burst missed notes after a delayed timer.
            const pitches = current.notes.flatMap((row, pitch) => row[index] ? [pitch] : []);
            for (const pitch of pitches) {
              const oscillator = session.context.createOscillator(), envelope = session.context.createGain();
              oscillator.frequency.value = noteFrequency(MUSIC_PITCHES[pitch].midi);
              if (current.timbre === 'soft') oscillator.setPeriodicWave(periodicWave(session.context, [1, .25, .08]));
              const attack = Math.min(.008, duration * .15), release = Math.min(.055, duration * .3), amplitude = 1 / pitches.length;
              envelope.gain.setValueAtTime(0, when); envelope.gain.linearRampToValueAtTime(amplitude, when + attack);
              envelope.gain.setValueAtTime(amplitude, when + duration - release); envelope.gain.linearRampToValueAtTime(0, when + duration);
              oscillator.connect(envelope); envelope.connect(analyser); session.nodes.add(oscillator);
              oscillator.onended = () => {session.nodes.delete(oscillator); oscillator.disconnect(); envelope.disconnect();};
              oscillator.start(when); oscillator.stop(when + duration + .01);
            }
            session.scheduled++;
          }
        };
        schedule(); session.timer = window.setInterval(schedule, 25);
        setMessage(loop ? 'Playing in a loop. Edits change upcoming notes.' : 'Playing one complete cycle. Edits change upcoming notes.');
      }
      setPlaying(true); setStarting(false);
    } catch (cause) {
      if (context && context.state !== 'closed') void context.close().catch(() => undefined);
      if (ticket === request.current && mounted.current) {engine.current = null; setStarting(false); setPlaying(false); setError(cause instanceof Error ? cause.message : 'Audio is unavailable in this browser. The visual models and downloads still work.');}
    }
  }

  const toggleNote = (row: number, step: number) => changePattern({...pattern, notes: pattern.notes.map((notes, r) => r === row ? notes.map((value, s) => s === step ? !value : value) : notes)});
  const changeLoop = (value: boolean) => {
    setLoop(value); const session = engine.current;
    if (session && lab === 'sequence') session.stopAfter = value ? Infinity : Math.max(session.stepCount, Math.ceil(session.scheduled / session.stepCount) * session.stepCount);
  };
  async function importPattern(file: File | undefined) {
    if (!file) return;
    try {if (file.size > 32768) throw new Error('Choose a pattern JSON smaller than 32 KB.'); const next = validatePattern(JSON.parse(await file.text())); changePattern(next, true); setCursor({row: 4, step: 0}); setError(''); setMessage('Pattern imported. Press Play to hear it.');}
    catch (cause) {setError(cause instanceof Error ? cause.message : 'This is not a valid pattern file.');}
    if (importRef.current) importRef.current.value = '';
  }

  const originalExperiment = lab.startsWith('original-') ? lab.slice(9) as OriginalMusicId : null;
  return <section id="music-lab" className="music-lab page-width" aria-labelledby={`${id}-heading`}>
    <header className="ml-heading"><div><p className="ml-kicker">PLAYABLE EXPLORATIONS</p><h2 id={`${id}-heading`}>Music Lab<span aria-hidden="true"> ∿</span></h2><p>Hear a wave. Build a sound. Find a rhythm.</p></div><p className="ml-heading-aside">Small experiments at the meeting point of music, mathematics and physics.</p></header>
    <div className="ml-tabs" role="tablist" aria-label="Music experiments">
      {LABS.map((item, index) => <button type="button" role="tab" className={item.id.startsWith('original-') ? 'ml-original-tab' : undefined} id={`${id}-tab-${item.id}`} aria-controls={`${id}-panel`} aria-selected={lab === item.id} tabIndex={lab === item.id ? 0 : -1} key={item.id} onClick={() => chooseLab(item.id)} onKeyDown={event => {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault(); const next = event.key === 'Home' ? 0 : event.key === 'End' ? LABS.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : LABS.length - 1)) % LABS.length;
        chooseLab(LABS[next].id); document.getElementById(`${id}-tab-${LABS[next].id}`)?.focus();
      }}>{!item.id.startsWith('original-') && <span className="ml-tab-number">0{index + 1}</span>}<span><strong>{item.name}</strong><small>{item.hint}</small></span></button>)}
    </div>
    {originalExperiment ? <div id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-tab-${lab}`}><OriginalMusicExperiment key={originalExperiment} experiment={originalExperiment}/></div> : <div className="ml-stage" id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-tab-${lab}`}>
      <div className="ml-stage-heading"><div><h3>{lab === 'sound' ? 'One sound, two ways to see it.' : lab === 'harmonics' ? 'A richer sound starts with simple waves.' : 'A little grid. A lot of possibilities.'}</h3><p>{lab === 'sound' ? 'Pitch moves the bands. Wave shape adds overtones.' : lab === 'harmonics' ? 'Each slider adds a multiple of the fundamental frequency.' : 'Tap notes to compose. Columns are time; rows are pitch.'}</p></div><span className="ml-measure">{lab === 'sequence' ? `${pattern.bpm} BPM` : `${lab === 'harmonics' ? fundamental : frequency} Hz`}</span></div>
      <div className="ml-transport"><button className="ml-play" type="button" disabled={starting || !audioAvailable} onClick={() => void play()}><span aria-hidden="true">{playing ? '■' : '▶'}</span> {starting ? 'Starting…' : playing ? 'Stop sound' : lab === 'sequence' ? 'Play pattern' : 'Play sound'}</button><label className="ml-volume">Listening level <input type="range" min="0" max="100" step="1" value={level} onChange={event => setLevel(Number(event.target.value))}/><output>{level}%</output></label><span className="ml-audio-note">{playing ? 'Sound is on' : 'No sound until you press Play'}</span></div>
      {lab === 'sound' && <div className="ml-sound-layout"><div className="ml-sound-controls"><label className="ml-slider-label" htmlFor={`${id}-frequency`}>Pitch <output>{frequency} Hz</output></label><input id={`${id}-frequency`} className="ml-range" type="range" min="80" max="1600" step="1" value={frequency} onChange={event => setFrequency(Number(event.target.value))}/><div className="ml-frequency-stops">{[110, 220, 440, 880].map(hz => <button type="button" key={hz} onClick={() => setFrequency(hz)} aria-pressed={frequency === hz}>{hz}</button>)}</div><p className="ml-control-caption">Double the frequency to go up one octave.</p><fieldset className="ml-wave-choices"><legend>Wave shape</legend>{(['sine', 'triangle', 'square', 'sawtooth'] as ToneShape[]).map(wave => <button type="button" key={wave} aria-pressed={shape === wave} onClick={() => setShape(wave)}><svg viewBox="0 0 64 24" width="64" height="24" aria-hidden="true"><path d={Array.from({length: 65}, (_, x) => `${x ? 'L' : 'M'}${x},${12 - toneValue(x / 64 * Math.PI * 4, wave) * 8}`).join(' ')} fill="none" stroke="currentColor" strokeWidth="1.8"/></svg><span>{wave === 'sawtooth' ? 'Sawtooth' : wave.charAt(0).toUpperCase() + wave.slice(1)}</span></button>)}</fieldset><p className="ml-discovery">Try this: keep the pitch at 440 Hz and switch from sine to square. The extra bands are harmonics.</p></div><SignalMonitor engine={engine} playing={playing} frequency={frequency} shape={shape} reduced={reduced}/></div>}
      {lab === 'harmonics' && <div className="ml-harmonics"><div className="ml-harmonic-toolbar"><label className="ml-base-frequency">Fundamental <input type="range" min="80" max="440" step="1" value={fundamental} onChange={event => setFundamental(Number(event.target.value))}/><output>{fundamental} Hz</output></label><div className="ml-preset-buttons" aria-label="Harmonic presets">{Object.entries(HARMONIC_PRESETS).map(([name, values]) => <button type="button" key={name} onClick={() => setAmplitudes([...values])}>{name}</button>)}</div></div><HarmonicPlot amplitudes={amplitudes}/><div className="ml-partials">{amplitudes.map((amplitude, index) => <label className="ml-partial" style={{'--partial-color': PARTIAL_COLORS[index]} as CSSProperties} key={index}><span><b>{index + 1}×</b><output>{Math.round(amplitude * 100)}%</output></span><input aria-label={`Harmonic ${index + 1} amplitude`} type="range" min="0" max="1" step=".01" value={amplitude} onChange={event => setAmplitudes(previous => previous.map((value, i) => i === index ? Number(event.target.value) : value))}/><small>{fundamental * (index + 1)} Hz</small></label>)}</div><p className="ml-discovery">Try this: remove the fundamental but keep some upper harmonics. The sound changes while the other components stay tied to the same base frequency. Components use a shared scale; the sum is bounded to prevent clipping.</p></div>}
      {lab === 'sequence' && <div className="ml-sequencer"><div className="ml-sequence-tools"><label>Tempo <input type="range" min="60" max="180" value={pattern.bpm} onChange={event => changePattern({...pattern, bpm: Number(event.target.value)}, true)}/><output>{pattern.bpm} BPM</output></label><label>Length <select value={pattern.steps} onChange={event => {const steps = Number(event.target.value) as 8 | 16; changePattern({...pattern, steps, notes: pattern.notes.map(row => Array.from({length: steps}, (_, i) => row[i] ?? false))}, true); setCursor({row: 4, step: 0});}}><option value="8">8 steps</option><option value="16">16 steps</option></select></label><label>Sound <select value={pattern.timbre} onChange={event => changePattern({...pattern, timbre: event.target.value as MusicPattern['timbre']})}><option value="soft">Soft keys</option><option value="sine">Pure sine</option></select></label><label className="ml-loop"><input type="checkbox" checked={loop} onChange={event => changeLoop(event.target.checked)}/> Loop</label></div><div className="ml-sequence-scroll"><div className="ml-sequence-grid" role="grid" aria-label="Melody sequencer. Use arrow keys to move between notes, and Space or Enter to toggle a note." style={{'--step-count': pattern.steps} as CSSProperties}><div className="ml-grid-row ml-grid-header" role="row"><span role="columnheader">Pitch</span>{Array.from({length: pattern.steps}, (_, step) => <span role="columnheader" key={step} className={step === playhead ? 'ml-current' : ''}>{step + 1}</span>)}</div>{MUSIC_PITCHES.map((pitch, row) => <div className="ml-grid-row" role="row" key={pitch.midi} style={{'--pitch-color': pitch.color} as CSSProperties}><span className="ml-pitch-label" role="rowheader">{pitch.name}</span>{pattern.notes[row].map((on, step) => <button type="button" className={`ml-note ${on ? 'ml-on' : ''} ${step === playhead ? 'ml-current' : ''}`} role="gridcell" aria-selected={on} aria-label={`${pitch.name}, step ${step + 1}, ${on ? 'on' : 'off'}`} tabIndex={cursor.row === row && cursor.step === step ? 0 : -1} key={step} data-row={row} data-step={step} onFocus={() => setCursor({row, step})} onClick={() => toggleNote(row, step)} onKeyDown={event => {if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return; event.preventDefault(); const r = Math.max(0, Math.min(4, row + (event.key === 'ArrowUp' ? -1 : event.key === 'ArrowDown' ? 1 : 0))); const s = event.key === 'Home' ? 0 : event.key === 'End' ? pattern.steps - 1 : Math.max(0, Math.min(pattern.steps - 1, step + (event.key === 'ArrowLeft' ? -1 : event.key === 'ArrowRight' ? 1 : 0))); event.currentTarget.closest('.ml-sequence-grid')?.querySelector<HTMLButtonElement>(`[data-row="${r}"][data-step="${s}"]`)?.focus();}}><span aria-hidden="true">{on ? '●' : '·'}</span></button>)}</div>)}</div></div><div className="ml-grid-caption"><span>One step = ½ beat · {patternDuration(pattern).toFixed(1)} s per cycle</span><span>{pattern.steps === 16 ? 'Scroll the grid to reach every step.' : 'C major pentatonic · five pitches that work together'}</span></div><div className="ml-sequence-bottom"><div className="ml-preset-buttons"><span>Start with</span><button type="button" onClick={() => changePattern({...makePattern(pattern.steps, 'rise'), bpm: pattern.bpm, timbre: pattern.timbre}, true)}>Rising notes</button><button type="button" onClick={() => changePattern({...makePattern(pattern.steps, 'syncopation'), bpm: pattern.bpm, timbre: pattern.timbre}, true)}>Offbeat</button><button type="button" onClick={() => changePattern({...pattern, notes: pattern.notes.map(row => row.map(() => false))}, true)}>Clear</button></div><div className="ml-downloads"><button type="button" onClick={() => {downloadFile('motion-atlas-melody.json', JSON.stringify(pattern, null, 2), 'application/json'); setMessage('Pattern JSON downloaded. You can import it here again.');}}>Save JSON</button><button type="button" onClick={() => {const rate = 22050; downloadFile('motion-atlas-melody.wav', encodeWav(renderPatternSamples(pattern, rate, level / 100 * .12), rate), 'audio/wav'); setMessage('One complete cycle downloaded as a WAV audio file.');}}>Save WAV</button><button type="button" onClick={() => importRef.current?.click()}>Import JSON</button><input ref={importRef} className="ml-hidden" type="file" accept=".json,application/json" aria-label="Import melody pattern JSON" onChange={event => void importPattern(event.target.files?.[0])}/></div></div></div>}
      <div className="ml-status" role="status" aria-live="polite"><span className={playing ? 'ml-status-light active' : 'ml-status-light'} aria-hidden="true"/>{!audioAvailable ? 'Web Audio is unavailable here. The visual models and melody downloads still work.' : error || message}</div>
    </div>}
    <footer className="ml-footer"><p>Three Atlas experiments, plus four originals from <a href="https://musiclab.chromeexperiments.com/" target="_blank" rel="noreferrer">Google’s Chrome Music Lab</a>. No account required. Spectrogram also offers optional microphone input.</p><a href="https://github.com/googlecreativelab/chrome-music-lab" target="_blank" rel="noreferrer">Explore the original project</a></footer>
  </section>;
}
