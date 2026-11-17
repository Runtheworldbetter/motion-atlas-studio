import {useEffect, useRef, useState} from 'react';
import {Maximize2, Pause, Play, RotateCcw, Download} from 'lucide-react';
import type {SceneFactory} from '../lib/motion/types';
import type {MotionPlayerHandle} from '../lib/motion/runtime';

export function useReducedMotion() {
  const [reduced, setReduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const change = () => setReduced(media.matches);
    media.addEventListener('change', change);
    return () => media.removeEventListener('change', change);
  }, []);
  return reduced;
}

export function MotionPlayer({id, factory, title, compact = false, autoplay = true, posterTime = 0, onSnapshot}: {
  id: string; factory: SceneFactory; title: string; compact?: boolean; autoplay?: boolean; posterTime?: number;
  onSnapshot?: (canvas: HTMLCanvasElement) => void;
}) {
  const container = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const handle = useRef<MotionPlayerHandle | null>(null);
  const reduced = useReducedMotion();
  const playbackPolicy = useRef(autoplay && !reduced);
  playbackPolicy.current = autoplay && !reduced;
  const [playing, setPlaying] = useState(autoplay && !reduced);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');
  const [duration, setDuration] = useState(0);
  const [time, setTime] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [visible, setVisible] = useState(!compact);

  useEffect(() => {
    if (!compact || !frame.current) return;
    let timer: ReturnType<typeof setTimeout>;
    const observer = new IntersectionObserver(([entry]) => {
      clearTimeout(timer);
      if (entry.isIntersecting) setVisible(true);
      else timer = setTimeout(() => setVisible(false), 800);
    }, {rootMargin: '80px'});
    observer.observe(frame.current);
    return () => {clearTimeout(timer); observer.disconnect();};
  }, [compact]);

  useEffect(() => {
    if (!visible || !container.current) return;
    let cancelled = false;
    let instance: MotionPlayerHandle | null = null;
    let lastUpdate = 0;
    setReady(false); setError(''); setTime(0); setDuration(0); setSpeed(1);
    setPlaying(playbackPolicy.current);
    import('../lib/motion/runtime').then(({mountMotionCanvas}) => {
      if (cancelled || !container.current) return;
      instance = mountMotionCanvas(container.current, id, factory, {
        autoplay: playbackPolicy.current,
        resolutionScale: compact ? 0.55 : 1,
        initialTime: posterTime,
        onReady: seconds => {if (!cancelled) {setReady(true); setDuration(seconds);}},
        onFrame: (seconds, total) => {
          if (cancelled || compact) return;
          const now = performance.now();
          if (now - lastUpdate > 80 || seconds === 0) {setTime(seconds); setDuration(total); lastUpdate = now;}
        },
        onError: message => {if (!cancelled) setError(message);},
      });
      handle.current = instance;
      setPlaying(playbackPolicy.current);
      instance.canvas.setAttribute('aria-label', title);
    }).catch(e => {if (!cancelled) setError(e instanceof Error ? e.message : 'The player could not load.');});
    return () => {cancelled = true; instance?.dispose(); handle.current = null;};
  }, [id, factory, visible, compact, posterTime]);

  useEffect(() => {
    if (!autoplay || reduced) {handle.current?.pause(); setPlaying(false);}
    else {handle.current?.play(); setPlaying(true);}
  }, [autoplay, reduced]);

  const toggle = () => {
    if (playing) handle.current?.pause(); else handle.current?.play();
    setPlaying(!playing);
  };
  return <div className={`motion-player ${compact ? 'compact-player' : ''}`} ref={frame}>
    <div className="canvas-wrap" ref={container}>
      {!ready && !error && <div className="canvas-placeholder"><span className="orbit-loader"/><span>{visible ? 'Preparing animation' : 'Animation preview'}</span></div>}
      {error && <div className="canvas-error" role="alert"><strong>Unable to render this scene</strong><p>{error}</p><span>Your input is still in the editor.</span></div>}
    </div>
    {!compact && <div className="player-controls">
      <button className="icon-button play-button" aria-label={playing ? 'Pause animation' : 'Play animation'} onClick={toggle} disabled={!ready}>{playing ? <Pause size={17}/> : <Play size={17}/>}</button>
      <button className="icon-button" aria-label="Replay animation" onClick={() => {handle.current?.restart(); setPlaying(true);}} disabled={!ready}><RotateCcw size={16}/></button>
      <span className="player-time">{time.toFixed(1)}<span> / {duration.toFixed(1)}s</span></span>
      <input className="timeline" aria-label="Animation timeline" type="range" min="0" max={duration || 1} step="0.033333" value={Math.min(time, duration || 1)} disabled={!ready} onChange={e => {const value = Number(e.target.value); handle.current?.seek(value); setTime(value);}} />
      <select className="speed-select" aria-label="Playback speed" value={speed} onChange={e => {const value = Number(e.target.value); setSpeed(value); handle.current?.setSpeed(value);}}>{[0.5, 1, 1.5, 2].map(n => <option key={n} value={n}>{n}×</option>)}</select>
      {onSnapshot && <button className="icon-button snapshot-button" aria-label="Download current frame as PNG" onClick={() => handle.current && onSnapshot(handle.current.canvas)} disabled={!ready}><Download size={16}/></button>}
      <button className="icon-button" aria-label="Expand player to full screen" onClick={() => {frame.current?.requestFullscreen?.().catch(() => {});}}><Maximize2 size={16}/></button>
    </div>}
  </div>;
}
