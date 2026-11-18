import {useEffect, useId, useMemo, useRef, useState} from 'react';
import {BookOpen, Code2, Download, Link2, Pause, Play, RotateCcw} from 'lucide-react';
import {renderStrokeSvg, exportStrokeSvg, strokeEngine} from '../lib/cricket/render';
import type {Camera, Hand} from '../lib/cricket/pose';
import {useReducedMotion} from './Player';
import './cricket-stroke.css';

type HandMode=Hand|'compare';
const REPOSITORY='https://github.com/Runtheworldbetter/motion-atlas-studio';
const cues:Record<string,{title:string;copy:string}>={
  setup:{title:'Set up with both hands together',copy:'The blue top hand and orange bottom hand stay attached to the handle. Watch them as one grip unit.'},
  backlift:{title:'Pick up, then move through',copy:'The pickup flows into the forward movement. The bat continues through the labelled checkpoints during playback.'},
  step:{title:'Settle the front foot',copy:'The front foot finishes its travel before contact. The head, hands and trunk continue into the stroke.'},
  contact:{title:'Travel through the ball',copy:'Pause here to inspect the blade, hands and front knee. During playback, the bat keeps moving through contact.'},
  extension:{title:'Extend toward the shot',copy:'Follow the hands away from contact. The front foot stays planted while the rear heel releases.'},
  follow:{title:'Let the finish grow from the swing',copy:'The shoulders turn and elbows fold gradually as the bat rises into a balanced finish.'},
  finish:{title:'Compare the earlier bat positions',copy:'The numbered imprints remain visible: 1 backlift, 2 contact, 3 extension. Scrub back to inspect each one.'},
};

function initialHand():HandMode{
  const hand=new URLSearchParams(location.search).get('handedness');
  return hand==='right'||hand==='compare'?hand:'left';
}
function initialProgress(){
  const value=Number(new URLSearchParams(location.search).get('at')??0);
  return Number.isFinite(value)?Math.max(0,Math.min(1,value)):0;
}

function StrokePanel({hand,camera,progress,imprints,compact}:{hand:Hand;camera:Camera;progress:number;imprints:boolean;compact:boolean}){
  const container=useRef<HTMLDivElement>(null);
  const [width,setWidth]=useState(compact?360:680);
  useEffect(()=>{
    if(!container.current)return;
    const observer=new ResizeObserver(([entry])=>setWidth(Math.max(180,entry.contentRect.width)));
    observer.observe(container.current);return()=>observer.disconnect();
  },[]);
  const drawing=useMemo(()=>renderStrokeSvg({width,hand,camera,progress,imprints}),[width,hand,camera,progress,imprints]);
  return <div className="stroke-panel" ref={container}>
    {!compact&&<div className="stroke-panel-caption"><strong>{hand==='left'?'Left-handed':'Right-handed'}</strong><span>Top hand {hand==='left'?'R':'L'} · Bottom hand {hand==='left'?'L':'R'} · Front foot {hand==='left'?'R':'L'}</span></div>}
    <svg xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${drawing.width} ${drawing.height}`} role="img" aria-label={`${hand}-handed straight drive, ${camera==='side'?'side':'bowler’s'} view`} dangerouslySetInnerHTML={{__html:drawing.markup}}/>
  </div>;
}

/** A single retained clock drives both cameras and handedness panels. */
export function CricketStroke({compact=false,autoplay=false}:{compact?:boolean;autoplay?:boolean}){
  const id=useId();
  const reduced=useReducedMotion();
  const [hand,setHand]=useState<HandMode>(initialHand);
  const [camera,setCamera]=useState<Camera>(()=>new URLSearchParams(location.search).get('camera')==='bowler'?'bowler':'side');
  const [imprints,setImprints]=useState(()=>new URLSearchParams(location.search).get('imprints')!=='0');
  const [progress,setProgress]=useState(compact?.55:initialProgress);
  const [playing,setPlaying]=useState(autoplay&&!reduced);
  const [speed,setSpeed]=useState(1);
  const [notice,setNotice]=useState('');
  const [copyFallback,setCopyFallback]=useState('');
  const current=useRef(progress),speedRef=useRef(speed);
  current.current=progress;speedRef.current=speed;
  const hands:Hand[]=hand==='compare'?['left','right']:[hand];
  const phase=strokeEngine.pose(progress,hand==='right'?'right':'left').phase;
  const exact=strokeEngine.stops.find(stop=>Math.abs(stop.t-progress)<.001);
  const phaseLabel=exact?.label??strokeEngine.frames.find(frame=>frame.id===phase)?.label??'Set-up';
  const cue=cues[phase]??cues.setup;
  useEffect(()=>{
    if(!playing||reduced)return;
    let frame=0,last=0;
    const tick=(now:number)=>{
      if(last){
        const next=Math.min(1,current.current+Math.max(0,now-last)*speedRef.current/strokeEngine.durationMs);
        current.current=next;setProgress(next);
        if(next===1){setPlaying(false);return;}
      }
      last=now;frame=requestAnimationFrame(tick);
    };
    frame=requestAnimationFrame(tick);
    return()=>cancelAnimationFrame(frame);
  },[playing,reduced]);
  useEffect(()=>{if(reduced)setPlaying(false);},[reduced]);
  useEffect(()=>{
    if(compact){setPlaying(autoplay&&!reduced);if(autoplay&&current.current===1){current.current=0;setProgress(0);}}
  },[autoplay,compact,reduced]);
  useEffect(()=>{
    const hide=()=>{if(document.hidden)setPlaying(false);};
    document.addEventListener('visibilitychange',hide);return()=>document.removeEventListener('visibilitychange',hide);
  },[]);
  useEffect(()=>{if(!notice)return;const timer=setTimeout(()=>setNotice(''),3500);return()=>clearTimeout(timer);},[notice]);
  function seek(t:number){setPlaying(false);current.current=t;setProgress(t);}
  function play(){
    if(reduced){seek(strokeEngine.stops.find(stop=>stop.t>progress+.001)?.t??0);return;}
    if(playing){setPlaying(false);return;}
    if(progress===1){current.current=0;setProgress(0);}setPlaying(true);
  }
  function saveFrame(){
    const markup=exportStrokeSvg({hand,camera,progress,imprints});
    const url=URL.createObjectURL(new Blob([markup],{type:'image/svg+xml'}));
    const a=document.createElement('a');a.href=url;a.download=`motion-atlas-drive-${hand}-${camera}.svg`;a.click();
    setTimeout(()=>URL.revokeObjectURL(url),1000);setNotice('Current frame downloaded as SVG.');
  }
  async function share(){
    const url=new URL(location.origin+location.pathname);
    url.searchParams.set('recipe','cricket');url.searchParams.set('example','full-stroke');
    url.searchParams.set('handedness',hand);url.searchParams.set('camera',camera);
    url.searchParams.set('at',progress.toFixed(4));url.searchParams.set('imprints',imprints?'1':'0');url.hash='studio';
    try{await navigator.clipboard.writeText(url.href);setNotice('Link copied with this frame and view.');}
    catch{setCopyFallback(url.href);}
  }
  return <div className={`stroke-studio${compact?' stroke-compact':''}`}>
    {!compact&&<>
      <div className="stroke-heading"><div><p className="eyebrow">CRICKET · COMPLETE STRAIGHT DRIVE</p><h2>One stroke. Every useful angle.</h2><p>Follow the hands, bat and body from set-up to finish.</p></div><span className="stroke-version">Atlas 0.4</span></div>
      <div className="stroke-view-controls">
        <label htmlFor={`${id}-hand`}>Batter<select id={`${id}-hand`} aria-label="Batting hand" value={hand} onChange={event=>setHand(event.target.value as HandMode)}><option value="left">Left-handed</option><option value="right">Right-handed</option><option value="compare">Compare hands</option></select></label>
        <div className="stroke-camera" role="group" aria-label="Camera angle">{(['side','bowler'] as const).map(value=><button key={value} type="button" aria-pressed={camera===value} onClick={()=>setCamera(value)}>{value==='side'?'Side view':'Bowler’s view'}</button>)}</div>
        <label className="stroke-imprints"><input type="checkbox" checked={imprints} onChange={event=>setImprints(event.target.checked)}/> Bat imprints</label>
      </div>
    </>}
    <div className={`stroke-stage ${hands.length===2?'stroke-compare':''}`}>{hands.map(value=><StrokePanel key={value} hand={value} camera={camera} progress={progress} imprints={imprints} compact={compact}/>)}</div>
    {!compact&&<>
      <div className="stroke-legend"><span><i className="stroke-top"/>Top arm & hand</span><span><i className="stroke-bottom"/>Bottom arm & hand</span><span><i className="stroke-bat"/>Bat</span><span className="stroke-camera-note">{camera==='side'?'Bowler on the left':'Camera at the bowler’s end'}</span></div>
      <div className="stroke-transport">
        <button className="stroke-play" type="button" onClick={play}>{playing?<Pause size={18}/>:<Play size={18}/>}<span>{reduced?'Next checkpoint':playing?'Pause':progress===1?'Replay full stroke':progress===0?'Play full stroke':'Continue stroke'}</span></button>
        <button className="icon-button" type="button" aria-label="Reset stroke to start" onClick={()=>seek(0)}><RotateCcw size={17}/></button>
        <label className="stroke-speed">Speed<select aria-label="Stroke playback speed" value={speed} onChange={event=>setSpeed(Number(event.target.value))}>{[1,.5,.25].map(value=><option key={value} value={value}>{value}×</option>)}</select></label>
        <span className="stroke-time">{(progress*strokeEngine.durationMs/1000).toFixed(1)} / {(strokeEngine.durationMs/1000).toFixed(1)} s</span>
      </div>
      <div className="stroke-timeline"><label htmlFor={`${id}-timeline`}>{phaseLabel}<span>{playing?'Playing':'Paused'}</span></label><input id={`${id}-timeline`} type="range" min="0" max="1000" step="1" value={Math.round(progress*1000)} aria-label="Stroke timeline" aria-valuetext={`${phaseLabel}, ${Math.round(progress*100)} percent`} onChange={event=>seek(Number(event.target.value)/1000)}/></div>
      <div className="stroke-checkpoints" role="group" aria-label="Stroke checkpoints">{strokeEngine.stops.map((stop,index)=><button key={stop.id} type="button" aria-pressed={Math.abs(stop.t-progress)<.001} onClick={()=>seek(stop.t)}>{index>0&&index<4&&<b>{index}</b>}{stop.label}</button>)}</div>
      <div className="stroke-coaching"><div><h3>{cue.title}</h3><p>{cue.copy}</p></div><div className="stroke-imprint-key"><strong>Read the imprints</strong><span>1 Backlift · 2 Contact · 3 Extension</span><small>Earlier positions appear as the stroke reaches them.</small></div></div>
      <div className="stroke-actions"><button type="button" onClick={share}><Link2 size={16}/> Copy this view</button><button type="button" onClick={saveFrame}><Download size={16}/> Save SVG frame</button><a href="./docs/index.html#cricket"><BookOpen size={16}/> Coaching controls</a><a href={`${REPOSITORY}/tree/main/lib/cricket`} target="_blank" rel="noreferrer"><Code2 size={16}/> Stroke source</a></div>
      {copyFallback&&<label className="stroke-copy-fallback">Copy this link<input readOnly value={copyFallback} onFocus={event=>event.target.select()}/></label>}
      {notice&&<p className="stroke-notice" role="status">{notice}</p>}
      <p className="stroke-basis">An authored straight-drive study, refined with public coaching-video frame references. <a href="./docs/index.html#cricket-references">View references and animation notes.</a></p>
    </>}
  </div>;
}
